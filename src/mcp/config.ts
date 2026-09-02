/**
 * MCP Configuration
 * Manages external MCP server connections
 */

import fs from 'fs';
import path from 'path';
import os from 'os';
import { z } from 'zod';
import { sanitizeApiKey } from '../providers/auth.js';

/**
 * Bounds for `timeout` fields (per-server or global) in milliseconds.
 *
 * - Minimum: 1000ms (1s). Anything below is a foot-gun: even the fastest
 *   local stdio MCP server needs a few hundred ms for the JSON-RPC
 *   handshake, and a sub-second budget guarantees false-positive timeouts.
 * - Maximum: 300000ms (5min). Above this you are almost certainly using
 *   MCP for the wrong kind of workload; long-running jobs should use a
 *   background-task pattern, not a synchronous tool call.
 *
 * Values outside `[MCP_TIMEOUT_MIN_MS, MCP_TIMEOUT_MAX_MS]` are rejected
 * by {@link validateMcpConfig} at config-load time and warned about by
 * `McpClientManager.normalizeTimeout` at call time.
 */
export const MCP_TIMEOUT_MIN_MS = 1000;
export const MCP_TIMEOUT_MAX_MS = 300000;

/**
 * Bounds for the remote-transport `connectTimeout` field in milliseconds.
 *
 * `connectTimeout` bounds the initial connection establishment for
 * remote transports (`sse`, `http`) — i.e. the time between issuing the
 * connect request and receiving a usable handshake response. Unlike
 * `timeout.startup` (which covers the JSON-RPC handshake AFTER the
 * transport is open), `connectTimeout` guards the TCP/TLS/HTTP dial
 * phase, where an unresponsive remote server can otherwise hang
 * indefinitely with no signal.
 *
 * - Minimum: 100ms. Any remote handshake completing in less than this
 *   is essentially free; anything below is a foot-gun (false positives).
 * - Maximum: 300000ms (5min). Above this you should reconsider whether
 *   MCP is the right transport for the workload.
 */
export const MCP_CONNECT_TIMEOUT_MIN_MS = 100;
export const MCP_CONNECT_TIMEOUT_MAX_MS = 300000;

/**
 * Default connect timeout for remote MCP transports (SSE / streamable
 * HTTP) in milliseconds. Applied when neither per-server nor global
 * `connectTimeout` is set. 10 seconds is aggressive enough to surface
 * unresponsive servers quickly while leaving headroom for a slow WAN
 * TLS handshake.
 */
export const DEFAULT_CONNECT_TIMEOUT_MS = 10000;

/**
 * Zod schema for a single `timeout` field. Accepts either a bare number
 * (applied to both startup and request phases) or an object with per-phase
 * budgets. Values must fall within `[MCP_TIMEOUT_MIN_MS, MCP_TIMEOUT_MAX_MS]`.
 */
const TimeoutMsSchema = z
  .number()
  .int('timeout must be an integer number of milliseconds')
  .min(
    MCP_TIMEOUT_MIN_MS,
    `timeout must be >= ${MCP_TIMEOUT_MIN_MS}ms (sub-second budgets cause false-positive timeouts)`
  )
  .max(
    MCP_TIMEOUT_MAX_MS,
    `timeout must be <= ${MCP_TIMEOUT_MAX_MS}ms (use a background-task pattern for longer workloads)`
  );

const TimeoutSchema = z.union([
  TimeoutMsSchema,
  z
    .object({
      startup: TimeoutMsSchema.optional(),
      request: TimeoutMsSchema.optional(),
    })
    .strict(),
]);

/**
 * Zod schema for the remote-transport `connectTimeout` field. Bounded by
 * `[MCP_CONNECT_TIMEOUT_MIN_MS, MCP_CONNECT_TIMEOUT_MAX_MS]`.
 */
const ConnectTimeoutSchema = z
  .number()
  .int('connectTimeout must be an integer number of milliseconds')
  .min(MCP_CONNECT_TIMEOUT_MIN_MS, `connectTimeout must be >= ${MCP_CONNECT_TIMEOUT_MIN_MS}ms`)
  .max(MCP_CONNECT_TIMEOUT_MAX_MS, `connectTimeout must be <= ${MCP_CONNECT_TIMEOUT_MAX_MS}ms`);

/**
 * Zod schema for a single MCP server entry. Only the fields relevant to
 * validation are enforced strictly; extra keys are accepted so future
 * additions do not require a schema bump.
 */
const McpServerConfigSchema = z
  .object({
    name: z.string().min(1),
    description: z.string().optional(),
    transport: z.enum(['stdio', 'sse', 'http']),
    command: z.string().optional(),
    args: z.array(z.string()).optional(),
    env: z.record(z.string(), z.string()).optional(),
    url: z.string().optional(),
    apiKey: z.string().optional(),
    enabled: z.boolean(),
    autoConnect: z.boolean().optional(),
    timeout: TimeoutSchema.optional(),
    connectTimeout: ConnectTimeoutSchema.optional(),
    cwd: z.string().optional(),
    retry: z
      .object({
        enabled: z.boolean(),
        maxAttempts: z.number().int().min(1).optional(),
        initialDelayMs: z.number().int().min(0).optional(),
        maxDelayMs: z.number().int().min(0).optional(),
      })
      .optional(),
  })
  .passthrough();

/**
 * Zod schema for the top-level MCP config. Validates version, servers,
 * and the optional global `timeout` field.
 */
export const McpConfigSchema = z
  .object({
    version: z.string(),
    servers: z.array(McpServerConfigSchema),
    timeout: TimeoutSchema.optional(),
    connectTimeout: ConnectTimeoutSchema.optional(),
  })
  .passthrough();

export interface McpServerConfig {
  /** Unique server identifier */
  name: string;
  /** Human-readable description */
  description?: string;
  /** Transport type */
  transport: 'stdio' | 'sse' | 'http';
  /** Command to start the server (for stdio) */
  command?: string;
  /** Arguments for the command */
  args?: string[];
  /** Environment variables */
  env?: Record<string, string>;
  /** URL for HTTP/SSE transport */
  url?: string;
  /** API key or token */
  apiKey?: string;
  /** Whether this server is enabled */
  enabled: boolean;
  /** Auto-connect on startup */
  autoConnect?: boolean;
  /**
   * Timeout budget(s) in milliseconds.
   *
   * Accepts either:
   * - A single number applied to BOTH the stdio handshake / cold-spawn
   *   phase (`client.connect`) and per-tool `callTool` deadlines.
   *   This is the legacy shape and remains supported for
   *   backwards-compatibility.
   * - An object `{ startup?: number; request?: number }` that lets the
   *   slow spawn phase and the fast tool-call phase have independent
   *   budgets. Missing keys fall back to the defaults below.
   *
   * Defaults when unspecified:
   * - `startup`: 3000 ms — aggressive cap so a hung MCP server cannot
   *   stall session creation on the critical path. Covers ~2s cold
   *   `npx -y` warm-cache starters while keeping worst-case per-server
   *   connect near ~6s. JVM-based servers (e.g. Oracle SQLcl) OR a
   *   first-time `npx -y` cold install WILL exceed this and MUST set an
   *   explicit `timeout.startup` override here (typical values 15000-45000).
   * - `request`: 60000 ms (per-tool call deadline)
   *
   * When this field is absent, the client falls back to the config-file
   * global {@link McpConfig.timeout}, then to the `MCP_TOOL_TIMEOUT` env
   * variable, and finally to the defaults above. See
   * `McpClientManager.getTimeoutsForServer` for the full precedence chain.
   */
  timeout?: number | { startup?: number; request?: number };
  /**
   * Bounded connect timeout for REMOTE transports (`sse`, `http`) in
   * milliseconds. Guards the initial TCP/TLS/HTTP dial and handshake
   * phase, preventing an unresponsive remote MCP server from hanging
   * session startup indefinitely.
   *
   * Only meaningful for `sse` and `http` transports; ignored for
   * `stdio` (which is guarded by `timeout.startup` instead).
   *
   * When absent, falls back to the config-file global `connectTimeout`,
   * then to the built-in default (10000ms). Valid range:
   * `[MCP_CONNECT_TIMEOUT_MIN_MS, MCP_CONNECT_TIMEOUT_MAX_MS]`
   * (100ms - 300000ms).
   */
  connectTimeout?: number;
  /**
   * Working directory for the spawned stdio server. Relative paths are
   * resolved against `options.workdir` (or `process.cwd()` if no workdir
   * is supplied to `connect()`). Ignored for non-stdio transports.
   */
  cwd?: string;
  /**
   * Connection retry policy for transient failures.
   *
   * When `enabled` is true, `McpClientManager.connect` retries a failed
   * initial connection with exponential backoff. Only transient errors
   * are retried (`ECONNREFUSED`, `ETIMEDOUT`, `ECONNRESET`, `EPIPE`,
   * `spawn` failures with recoverable codes, and startup-timeout errors
   * emitted by the manager). Configuration errors (`ENOENT` — command
   * not found — and missing required environment variables detected at
   * config-load time) are NEVER retried; they will only get worse with
   * more attempts.
   *
   * Defaults when the object is present but a field is omitted:
   * - `maxAttempts`: 3 (initial attempt + 2 retries)
   * - `initialDelayMs`: 1000
   * - `maxDelayMs`: 4000
   *
   * Backoff sequence: initialDelay, initialDelay*2, initialDelay*4, ...
   * capped at `maxDelayMs`.
   */
  retry?: {
    enabled: boolean;
    maxAttempts?: number;
    initialDelayMs?: number;
    maxDelayMs?: number;
  };
}

export interface McpConfig {
  /** Version of the config format */
  version: string;
  /** List of MCP servers */
  servers: McpServerConfig[];
  /**
   * Global default timeout budget(s) in milliseconds applied to every
   * server that does NOT declare its own {@link McpServerConfig.timeout}.
   *
   * Accepts the same shapes as the per-server field:
   * - A single number applied to BOTH startup and request phases.
   * - An object `{ startup?: number; request?: number }` for independent
   *   budgets; missing keys fall back to the built-in defaults
   *   (3000ms startup, 60000ms request).
   *
   * Resolution order at call time (per server):
   * 1. Per-server `McpServerConfig.timeout` (if set)
   * 2. Global `McpConfig.timeout` (this field)
   * 3. `MCP_TOOL_TIMEOUT` environment variable (applied to both phases)
   * 4. Built-in defaults (3000ms startup, 60000ms request)
   */
  timeout?: number | { startup?: number; request?: number };
  /**
   * Global default connect timeout for remote transports in
   * milliseconds. Applied to every server that does not declare its
   * own {@link McpServerConfig.connectTimeout}.
   *
   * Only meaningful for `sse` and `http` transports; ignored for
   * `stdio`. Valid range:
   * `[MCP_CONNECT_TIMEOUT_MIN_MS, MCP_CONNECT_TIMEOUT_MAX_MS]`.
   *
   * When absent, the built-in default {@link DEFAULT_CONNECT_TIMEOUT_MS}
   * (10000ms) applies.
   */
  connectTimeout?: number;
}

const CONFIG_DIR = path.join(os.homedir(), '.alexi');
const CONFIG_FILE = path.join(CONFIG_DIR, 'mcp-servers.json');

/**
 * Get default MCP configuration
 */
function getDefaultConfig(): McpConfig {
  return {
    version: '1.0',
    // Optional config-file global timeout. Applied to every server that
    // does NOT declare its own `timeout` field. Accepts a bare number
    // (both phases) or `{ startup?, request? }`. Omitted from the default
    // config so built-in defaults (3s startup, 60s request) apply until
    // an operator explicitly opts in. Slow-starting servers (JVM-based
    // like Oracle SQLcl, first-time `npx -y` cold installs) MUST bump
    // `timeout.startup` to avoid tripping the aggressive 3s default.
    // Example:
    //   "timeout": { "startup": 45000, "request": 90000 }
    servers: [
      // Example: filesystem MCP server
      {
        name: 'filesystem',
        description: 'File system access via MCP',
        transport: 'stdio',
        command: 'npx',
        args: ['-y', '@modelcontextprotocol/server-filesystem', '/tmp'],
        enabled: false,
        autoConnect: false,
      },
      // Example: GitHub MCP server
      {
        name: 'github',
        description: 'GitHub API access via MCP',
        transport: 'stdio',
        command: 'npx',
        args: ['-y', '@modelcontextprotocol/server-github'],
        env: {
          GITHUB_PERSONAL_ACCESS_TOKEN: '${GITHUB_TOKEN}',
        },
        enabled: false,
        autoConnect: false,
        // Per-server timeout overrides the global default. Bare number
        // applies to both startup and request phases.
        // timeout: 45000,
      },
      // Example: Brave Search MCP server with an explicit per-server
      // timeout that a slow-starting server may need.
      {
        name: 'brave-search',
        description: 'Web search via Brave Search API',
        transport: 'stdio',
        command: 'npx',
        args: ['-y', '@modelcontextprotocol/server-brave-search'],
        env: {
          BRAVE_API_KEY: '${BRAVE_API_KEY}',
        },
        enabled: false,
        autoConnect: false,
        // Object form lets startup and per-tool call have independent
        // budgets. Omitted keys fall back through the precedence chain.
        // timeout: { startup: 60000, request: 30000 },
      },
    ],
  };
}

/**
 * Validate an MCP configuration object against {@link McpConfigSchema}.
 *
 * Returns `{ ok: true, config }` on success, `{ ok: false, errors }` on
 * failure. Callers may choose to hard-fail (a fresh `mcp add` mutation)
 * or degrade gracefully (a load-time validation of an existing file
 * where the operator already committed to the values).
 *
 * The primary contract this enforces is that `timeout` fields fall
 * within `[MCP_TIMEOUT_MIN_MS, MCP_TIMEOUT_MAX_MS]`. Zero, negative, and
 * out-of-range values used to silently disable the timeout at runtime
 * (see `McpClientManager.normalizeTimeout`); this check surfaces them
 * up-front instead.
 */
export function validateMcpConfig(
  raw: unknown
): { ok: true; config: McpConfig } | { ok: false; errors: string[] } {
  const parsed = McpConfigSchema.safeParse(raw);
  if (parsed.success) {
    return { ok: true, config: parsed.data as unknown as McpConfig };
  }
  const errors = parsed.error.issues.map((issue) => {
    const p = issue.path.length > 0 ? issue.path.join('.') : '(root)';
    return `${p}: ${issue.message}`;
  });
  return { ok: false, errors };
}

/**
 * Load MCP configuration from file.
 *
 * If the file is missing, a default config is written to disk and
 * returned. If parsing or validation fails, a warning is logged and the
 * built-in defaults are returned; this keeps a broken config from
 * bricking session creation while still surfacing the problem in logs.
 */
export function loadMcpConfig(): McpConfig {
  try {
    if (!fs.existsSync(CONFIG_FILE)) {
      // Create default config
      const defaultConfig = getDefaultConfig();
      saveMcpConfig(defaultConfig);
      return defaultConfig;
    }

    const content = fs.readFileSync(CONFIG_FILE, 'utf-8');
    const raw = JSON.parse(content) as unknown;
    const result = validateMcpConfig(raw);
    if (!result.ok) {
      console.warn(
        `Invalid MCP config in ${CONFIG_FILE} - falling back to defaults:\n  ` +
          result.errors.join('\n  ')
      );
      return getDefaultConfig();
    }
    return result.config;
  } catch (error) {
    console.warn('Failed to load MCP config, using defaults:', error);
    return getDefaultConfig();
  }
}

/**
 * Save MCP configuration to file
 */
export function saveMcpConfig(config: McpConfig): void {
  try {
    if (!fs.existsSync(CONFIG_DIR)) {
      fs.mkdirSync(CONFIG_DIR, { recursive: true });
    }
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf-8');
  } catch (error) {
    console.error('Failed to save MCP config:', error);
  }
}

/**
 * Add a new MCP server to configuration.
 *
 * Throws when the merged config fails validation (e.g. an out-of-range
 * `timeout`). Callers that already trust the input can wrap the call in
 * a try/catch and surface the message to the operator; this is the
 * write path, so hard-failing keeps invalid values from being persisted
 * to disk in the first place.
 */
export function addMcpServer(server: McpServerConfig): McpConfig {
  const config = loadMcpConfig();

  // Sanitize the API key at the write boundary. Users routinely paste
  // keys carrying invisible clipboard artefacts (BOM, zero-width
  // spaces, trailing newlines) that later cause 401s indistinguishable
  // from a wrong key. `sanitizeApiKey` strips those code points and
  // trims surrounding whitespace; a whitespace-only value clears the
  // field. See `sanitizeApiKey` doc in `src/providers/auth.ts`.
  const normalized: McpServerConfig =
    server.apiKey === undefined
      ? server
      : (() => {
          const cleaned = sanitizeApiKey(server.apiKey);
          const next: McpServerConfig = { ...server };
          if (cleaned.length === 0) {
            delete next.apiKey;
          } else {
            next.apiKey = cleaned;
          }
          return next;
        })();

  // Check for duplicate name
  const existing = config.servers.findIndex((s) => s.name === normalized.name);
  if (existing >= 0) {
    config.servers[existing] = normalized;
  } else {
    config.servers.push(normalized);
  }

  const result = validateMcpConfig(config);
  if (!result.ok) {
    throw new Error(`Invalid MCP server config: ${result.errors.join('; ')}`);
  }

  saveMcpConfig(config);
  return config;
}

/**
 * Remove an MCP server from configuration
 */
export function removeMcpServer(name: string): McpConfig {
  const config = loadMcpConfig();
  config.servers = config.servers.filter((s) => s.name !== name);
  saveMcpConfig(config);
  return config;
}

/**
 * Enable/disable an MCP server
 */
export function toggleMcpServer(name: string, enabled: boolean): McpConfig {
  const config = loadMcpConfig();
  const server = config.servers.find((s) => s.name === name);
  if (server) {
    server.enabled = enabled;
    saveMcpConfig(config);
  }
  return config;
}

/**
 * Get config file path
 */
export function getConfigPath(): string {
  return CONFIG_FILE;
}

/**
 * Resolve environment variables in config
 */
export function resolveEnvVars(env?: Record<string, string>): Record<string, string> {
  if (!env) return {};

  const resolved: Record<string, string> = {};
  for (const [key, value] of Object.entries(env)) {
    // Replace ${VAR} with process.env.VAR
    resolved[key] = value.replace(/\$\{([^}]+)\}/g, (_, varName) => {
      return process.env[varName] || '';
    });
  }
  return resolved;
}
