/**
 * MCP Client Manager
 * Connects to external MCP servers and aggregates their tools
 */

import { Client } from '@modelcontextprotocol/client';
import { StdioClientTransport } from '@modelcontextprotocol/client/stdio';
import { spawn, type ChildProcess } from 'child_process';
import path from 'path';
import { logger } from '../utils/logger.js';
import { loadMcpConfig, resolveEnvVars, type McpServerConfig } from './config.js';

export interface McpToolInfo {
  /** Tool name (raw short name as advertised by the server) */
  name: string;
  /** Tool description */
  description?: string;
  /** Input schema */
  inputSchema: {
    type: string;
    properties?: Record<string, unknown>;
    required?: string[];
    additionalProperties?: boolean;
  };
  /** Source server name */
  serverName: string;
  /**
   * Fully qualified name in the form `<escapedServerName>::<toolName>`.
   *
   * `serverName` is escaped so that literal `:` and `%` characters in a
   * server name do not collide with the `::` separator. `%` is escaped
   * first (as `%25`) so the `%3A` introduced by escaping `:` is not
   * double-escaped on the way back.
   *
   * `toolName` is passed through verbatim; a tool name that itself
   * contains `::` still round-trips because parsing splits on the FIRST
   * `::` occurrence.
   */
  qualifiedName: string;
}

/**
 * Escape a server name for use in the `qualifiedName` prefix.
 *
 * `%` is escaped first as `%25` so that the `%3A` introduced by escaping
 * `:` cannot be misinterpreted on the reverse pass.
 */
export function escapeServerName(name: string): string {
  return name.replaceAll('%', '%25').replaceAll(':', '%3A');
}

/**
 * Reverse of {@link escapeServerName}. `%3A` -> `:` first, then `%25` -> `%`.
 */
export function unescapeServerName(escaped: string): string {
  return escaped.replaceAll('%3A', ':').replaceAll('%25', '%');
}

/**
 * Build a qualified tool name from a raw server name and tool name.
 */
export function buildQualifiedName(serverName: string, toolName: string): string {
  return `${escapeServerName(serverName)}::${toolName}`;
}

/**
 * Parse a qualified tool name into its (unescaped) server and tool components.
 *
 * Splits on the FIRST `::` occurrence. Because {@link escapeServerName}
 * turns any literal `:` in the server segment into `%3A`, the server
 * segment never contains `::`; splitting on the first separator therefore
 * preserves tool names that themselves contain `::`. Throws when no `::`
 * separator is present.
 */
export function parseQualifiedName(qualified: string): {
  serverName: string;
  toolName: string;
} {
  const idx = qualified.indexOf('::');
  if (idx === -1) {
    throw new Error(`Invalid qualified tool name (missing '::'): ${qualified}`);
  }
  const escapedServer = qualified.slice(0, idx);
  const toolName = qualified.slice(idx + 2);
  return {
    serverName: unescapeServerName(escapedServer),
    toolName,
  };
}

/**
 * Connection lifecycle states.
 *
 * - `connecting`: initial handshake in progress (first attempt or single-shot).
 * - `retrying`: previous attempt failed with a transient error, backoff
 *   delay running, next attempt pending. See `attemptCount` for progress.
 * - `connected`: handshake succeeded and initial metadata fetch completed.
 * - `disconnected`: previously connected server exited cleanly (or was
 *   closed by the manager).
 * - `failed`: terminal failure. Either the retry budget was exhausted or
 *   the error was classified as non-transient (bad config). The
 *   connection remains registered so operators can see the failure in
 *   `getStatus()` and act on the actionable hint in `error`.
 * - `error`: retained for backwards compatibility. New code should treat
 *   `error` as an alias for `failed`; existing callers/UIs that only
 *   knew about `error` continue to work unchanged.
 */
export type McpConnectionStatus =
  'connecting' | 'retrying' | 'connected' | 'disconnected' | 'failed' | 'error';

export interface McpConnection {
  /** Server configuration */
  config: McpServerConfig;
  /** MCP Client instance */
  client: Client;
  /** Child process (for stdio transport) */
  process?: ChildProcess;
  /** Available tools from this server */
  tools: McpToolInfo[];
  /** Cached resources from this server (populated on demand via refreshResources) */
  resources?: unknown[];
  /** Cached prompts from this server (populated on demand via refreshPrompts) */
  prompts?: unknown[];
  /** Connection status */
  status: McpConnectionStatus;
  /** Error message if any (actionable hint whenever possible) */
  error?: string;
  /** Timestamp (ms since epoch) of the last recorded error, if any */
  lastErrorAt?: number;
  /**
   * Number of connect attempts that have been made against this server
   * during the CURRENT `connect()` invocation. Reset to 0 at the start
   * of every top-level `connect()` call.
   */
  attemptCount: number;
  /** Last time tools were fetched */
  toolsCachedAt?: number;
  /** Last time resources were fetched */
  resourcesCachedAt?: number;
  /** Last time prompts were fetched */
  promptsCachedAt?: number;
}

/**
 * Kind of MCP list that a `list_changed` notification refers to. Used as
 * part of the debounce key so bursts on independent axes (tools vs
 * resources vs prompts) do not block each other.
 */
export type McpListKind = 'tools' | 'resources' | 'prompts';

/**
 * Debounced-refresh bookkeeping for a single (serverName, listKind) pair.
 *
 * A single timer holds the trailing edge of the debounce window; the
 * `deadline` (absolute epoch ms) caps how far a run of continuous
 * notifications can defer the refresh. When the timer fires OR the
 * deadline is exceeded, the associated list is re-fetched and the entry
 * is removed from the map so the next notification restarts the cycle.
 */
interface RefreshDebounceEntry {
  /** Trailing-edge timer handle. */
  timer: NodeJS.Timeout;
  /** Absolute deadline (ms since epoch) — refresh MUST fire by this time. */
  deadline: number;
}

export interface McpConnectOptions {
  /** Project working directory to pass as ALEXI_PROJECT_DIR */
  workdir?: string;
  /** Active Alexi session id to pass as ALEXI_SESSION_ID */
  sessionId?: string;
}

interface ToolCache {
  tools: McpToolInfo[];
  timestamp: number;
}

const CACHE_TTL_MS = 30000; // 30 seconds
const DEFAULT_STARTUP_TIMEOUT_MS = 30000; // 30 seconds for cold `npx -y` spawn
const DEFAULT_TOOL_CALL_TIMEOUT_MS = 60000; // 60 seconds for per-tool call
const MAX_PAGES = 100; // Safety cap for paginated tools/list

/**
 * Trailing-edge debounce window for `list_changed` refreshes. Bursts of
 * notifications arriving within this window coalesce into a single fetch.
 * Sized to smooth over the ~dozen-notification bursts servers emit on
 * toolset changes / shutdown without noticeably lagging genuine updates.
 */
const LIST_CHANGED_DEBOUNCE_MS = 300;

/**
 * Absolute maximum time a refresh can be deferred by a continuous stream
 * of notifications. Even if new notifications keep resetting the trailing
 * timer, the refresh fires once `Date.now()` exceeds the deadline, so the
 * UI never falls further behind than this cap.
 */
const LIST_CHANGED_MAX_DEFERRAL_MS = 2000;

/**
 * Map from spec notification method to the list kind it refreshes. Any
 * method not in this map is treated as an unknown notification and
 * downgraded to a debug log by the fallback handler.
 */
const LIST_CHANGED_METHODS: Record<string, McpListKind> = {
  'notifications/tools/list_changed': 'tools',
  'notifications/resources/list_changed': 'resources',
  'notifications/prompts/list_changed': 'prompts',
};

// Retry defaults when `config.retry.enabled` is true but individual fields
// are omitted. Kept intentionally conservative: 3 attempts across ~7s worst
// case (1s + 2s + 4s cap) so a transient blip is smoothed without letting
// startup latency balloon for genuinely broken configs.
const DEFAULT_RETRY_MAX_ATTEMPTS = 3;
const DEFAULT_RETRY_INITIAL_DELAY_MS = 1000;
const DEFAULT_RETRY_MAX_DELAY_MS = 4000;

/**
 * Node system-call error codes we treat as transient network / startup
 * failures. Anything on this list is safe to retry with backoff — the
 * underlying cause is typically a race between our connect attempt and a
 * slow-booting server, a temporarily unavailable socket, or a spawned
 * child that hadn't quite grabbed stdio yet.
 */
const TRANSIENT_ERROR_CODES = new Set([
  'ECONNREFUSED',
  'ECONNRESET',
  'ETIMEDOUT',
  'EPIPE',
  'EAGAIN',
  'EBUSY',
]);

/**
 * Node system-call error codes we KNOW are non-transient configuration
 * errors. `ENOENT` from `spawn` means the command binary does not exist
 * on PATH — retrying will not resurrect it. `EACCES` means the command
 * is not executable. Both need operator intervention, not more attempts.
 */
const CONFIG_ERROR_CODES = new Set(['ENOENT', 'EACCES', 'ENOTDIR', 'EPERM']);

/**
 * Classify a raw error thrown during a connect attempt as either a
 * transient failure (worth retrying) or a configuration/terminal failure
 * (must NOT be retried). Retrying an ENOENT with the same command will
 * always fail; retrying an ECONNREFUSED while the peer finishes booting
 * often succeeds.
 *
 * Rules (checked in order):
 * 1. Explicit config codes (`ENOENT`, `EACCES`, ...) -> non-transient.
 * 2. Explicit transient codes (`ECONNREFUSED`, `ETIMEDOUT`, ...) -> transient.
 * 3. Messages from `formatTimeoutError` with kind `startup` -> transient
 *    (the server just took longer than the budget; another attempt with
 *    a warm cache often clears in seconds).
 * 4. Messages that clearly point at a missing `${VAR}` env resolution
 *    (empty expansion) -> non-transient. The manager surfaces these with
 *    an actionable hint before attempting the connect, but we defensively
 *    catch them here too.
 * 5. Anything else defaults to non-transient. Retrying an unknown error
 *    class wastes the budget on the same broken input.
 */
function classifyConnectError(error: unknown): 'transient' | 'config' {
  const code = (error as { code?: unknown } | null)?.code;
  if (typeof code === 'string') {
    if (CONFIG_ERROR_CODES.has(code)) {
      return 'config';
    }
    if (TRANSIENT_ERROR_CODES.has(code)) {
      return 'transient';
    }
  }

  const message = error instanceof Error ? error.message : String(error ?? '');
  // Startup-timeout errors emitted by this module are transient by
  // definition — the peer was slow, not misconfigured.
  if (/startup timeout for server/.test(message) && /timed out after/.test(message)) {
    return 'transient';
  }
  // Missing env variable hint emitted by `checkMissingEnvVars`.
  if (/missing environment variable/i.test(message)) {
    return 'config';
  }
  // "command not found" style messages from various shells / SDK wrappers.
  if (/command not found|no such file or directory|ENOENT/i.test(message)) {
    return 'config';
  }
  return 'config';
}

/**
 * Build an actionable error message for a connect failure. The message
 * always names the server, the error class, and the exact config field
 * or environment variable an operator needs to change.
 */
function formatConnectError(serverName: string, error: unknown): string {
  const raw = error instanceof Error ? error.message : String(error ?? '');
  const code = (error as { code?: unknown } | null)?.code;

  if (typeof code === 'string' && CONFIG_ERROR_CODES.has(code)) {
    return (
      `Failed to start MCP server '${serverName}': ${raw} (${code}). ` +
      `Check the 'command' field in mcp-servers.json — the binary must exist ` +
      `on PATH and be executable.`
    );
  }

  // Timeout errors emitted by `formatTimeoutError` (startup OR request)
  // already contain an actionable hint pointing at the exact
  // `timeout.startup` / `timeout.request` field to raise. Pass them
  // through verbatim so log grepping and downstream error routing stay
  // stable.
  if (/^MCP .* timed out after \d+ms /.test(raw) && /timeout for server/.test(raw)) {
    return raw;
  }

  // Missing env var hint emitted by `checkMissingEnvVars` is already
  // actionable — do not double-wrap it.
  if (/missing environment variable/i.test(raw)) {
    return raw;
  }

  if (typeof code === 'string' && TRANSIENT_ERROR_CODES.has(code)) {
    return (
      `Failed to connect to MCP server '${serverName}': ${raw} (${code}). ` +
      `This looks like a transient network/startup error; retry will be attempted ` +
      `if 'retry.enabled' is true in mcp-servers.json.`
    );
  }

  return `Failed to connect to MCP server '${serverName}': ${raw}`;
}

/**
 * Resolve the retry policy for a server, applying documented defaults
 * for missing fields. When `config.retry` is absent OR
 * `config.retry.enabled === false`, retry is disabled and
 * `maxAttempts` is 1 (single attempt, existing behaviour).
 */
export function resolveRetryPolicy(config: McpServerConfig): {
  maxAttempts: number;
  initialDelayMs: number;
  maxDelayMs: number;
} {
  const r = config.retry;
  if (!r || r.enabled !== true) {
    return { maxAttempts: 1, initialDelayMs: 0, maxDelayMs: 0 };
  }
  const maxAttempts =
    typeof r.maxAttempts === 'number' && r.maxAttempts > 0
      ? Math.floor(r.maxAttempts)
      : DEFAULT_RETRY_MAX_ATTEMPTS;
  const initialDelayMs =
    typeof r.initialDelayMs === 'number' && r.initialDelayMs >= 0
      ? Math.floor(r.initialDelayMs)
      : DEFAULT_RETRY_INITIAL_DELAY_MS;
  const maxDelayMs =
    typeof r.maxDelayMs === 'number' && r.maxDelayMs >= 0
      ? Math.floor(r.maxDelayMs)
      : DEFAULT_RETRY_MAX_DELAY_MS;
  return { maxAttempts, initialDelayMs, maxDelayMs };
}

/**
 * Compute the backoff delay for the Nth retry (1-indexed). Grows
 * geometrically (2^n) from `initialDelayMs` and clamps at `maxDelayMs`.
 */
export function computeBackoffDelayMs(
  retryIndex: number,
  initialDelayMs: number,
  maxDelayMs: number
): number {
  const raw = initialDelayMs * Math.pow(2, Math.max(0, retryIndex - 1));
  return Math.min(raw, maxDelayMs);
}

/**
 * Detect missing environment variables in the resolved env map. Returns
 * the list of KEYS whose value expanded to empty (typically because the
 * referenced `${VAR}` was undefined in `process.env`). Empty-by-design
 * values that never referenced a `${...}` template are ignored — the
 * check only fires when the *raw* config value contained `${...}` but
 * the resolved value is empty.
 */
function findMissingEnvVars(
  rawEnv: Record<string, string> | undefined,
  resolvedEnv: Record<string, string>
): string[] {
  if (!rawEnv) {
    return [];
  }
  const missing: string[] = [];
  for (const [key, rawValue] of Object.entries(rawEnv)) {
    if (typeof rawValue !== 'string') {
      continue;
    }
    const match = rawValue.match(/\$\{([^}]+)\}/);
    if (!match) {
      continue;
    }
    const resolved = resolvedEnv[key];
    if (!resolved) {
      missing.push(match[1]);
    }
  }
  return missing;
}

/**
 * Which timeout budget was exceeded when an MCP request aborts.
 *
 * `startup` covers the stdio handshake / cold-spawn phase (`client.connect`).
 * `request` covers every metadata or tool call made after the handshake
 * (`callTool`, `listTools`, `listResources`, `listPrompts`, `readResource`,
 * `getPrompt`, ...). Naming the bound in error messages lets operators
 * pick the correct config field to raise.
 */
type TimeoutKind = 'startup' | 'request';

/**
 * Produce a human-readable timeout error message that names the exceeded
 * bound and points at the exact `mcp-servers.json` field to change.
 */
function formatTimeoutError(
  serverName: string,
  operation: string,
  kind: TimeoutKind,
  timeoutMs: number
): string {
  const field = kind === 'startup' ? 'timeout.startup' : 'timeout.request';
  return (
    `MCP ${operation} timed out after ${timeoutMs}ms ` +
    `(${kind} timeout for server '${serverName}'); ` +
    `increase '${field}' in mcp-servers.json to raise this bound.`
  );
}

/**
 * Format a single MCP content part into a string suitable for the model.
 *
 * - `text` parts pass through their text verbatim.
 * - `image` parts render as `[image: <mime>, <bytes> bytes omitted]` so the
 *   model knows an image was returned without flooding context with base64.
 * - `resource` parts render as `[resource: <uri>]` so the model can reference
 *   the file/URI that was returned.
 * - Any other type falls back to `JSON.stringify(part)` to avoid silent loss.
 */
export function formatContentPart(part: unknown): string {
  const p = part as {
    type?: string;
    text?: string;
    mimeType?: string;
    data?: string;
    uri?: string;
    resource?: { uri?: string };
  };
  switch (p.type) {
    case 'text':
      return typeof p.text === 'string' ? p.text : '';
    case 'image': {
      const mime = p.mimeType ?? 'unknown';
      const bytes = typeof p.data === 'string' ? Math.floor((p.data.length * 3) / 4) : 0;
      return `[image: ${mime}, ${bytes} bytes omitted]`;
    }
    case 'resource': {
      const uri = p.resource?.uri ?? p.uri ?? 'unknown';
      return `[resource: ${uri}]`;
    }
    default:
      return JSON.stringify(part);
  }
}

export class McpClientManager {
  private connections: Map<string, McpConnection> = new Map();
  private toolCache: Map<string, ToolCache> = new Map();
  /**
   * Per-(server, listKind) debounce state for `list_changed` notifications.
   * The key format is `${serverName}::${listKind}` and mirrors the shape
   * used elsewhere for qualified-tool naming, but only serves as an
   * internal map key — it is never surfaced to callers.
   */
  private refreshDebounces: Map<string, RefreshDebounceEntry> = new Map();
  /**
   * Cached global timeout from {@link McpConfig.timeout}, used as the
   * fallback layer between per-server config and the `MCP_TOOL_TIMEOUT`
   * environment variable. Populated on first `connectFromConfig` and can
   * be overridden explicitly via {@link setGlobalTimeout} (for tests and
   * callers that connect servers without going through the config file).
   *
   * `undefined` means "unset" (fall through to env / defaults);
   * `null` means "explicitly no global override" (same effect, distinct
   * marker so we can tell "never resolved" from "resolved to nothing").
   */
  private globalTimeout: number | { startup?: number; request?: number } | undefined | null =
    undefined;

  /**
   * Explicitly set the global timeout override that will be used as the
   * second-precedence layer (after per-server config, before
   * `MCP_TOOL_TIMEOUT` env / built-in defaults). Passing `undefined`
   * clears the override.
   */
  setGlobalTimeout(timeout: number | { startup?: number; request?: number } | undefined): void {
    this.globalTimeout = timeout === undefined ? null : timeout;
  }

  /**
   * Run an MCP request under a per-server `request` timeout budget.
   *
   * Creates an `AbortController` bound to `timeoutMs`, hands its signal to
   * the SDK method through the shared `RequestOptions` shape, and on abort
   * throws an error whose message names the exceeded bound and the exact
   * config field to raise. Non-timeout errors are rethrown unchanged so
   * caller-side categorisation (retry, cache invalidation, etc.) still
   * works.
   *
   * `operation` is a short human label (`'tools/list'`, `'callTool'`, ...)
   * used only in the error message.
   */
  private async withRequestTimeout<T>(
    serverName: string,
    operation: string,
    run: (options: { signal: AbortSignal }) => Promise<T>
  ): Promise<T> {
    const { request: timeoutMs } = this.getTimeoutsForServer(serverName);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      return await run({ signal: controller.signal });
    } catch (error) {
      if (controller.signal.aborted || (error instanceof Error && error.name === 'AbortError')) {
        throw new Error(formatTimeoutError(serverName, operation, 'request', timeoutMs), {
          cause: error,
        });
      }
      throw error;
    } finally {
      clearTimeout(timer);
    }
  }

  /**
   * Fetch all tools from an MCP client, handling paginated responses.
   *
   * Loops manually with explicit `{ cursor }` params so the per-page contract
   * of the v2 SDK is used (the no-`cursor` call would trigger the SDK's
   * built-in auto-aggregate walk instead — capped by `ClientOptions.listMaxPages`,
   * which we do not configure). Stops when no `nextCursor` is returned or
   * `MAX_PAGES` is reached; a `nextCursor` that repeats also stops the walk
   * as a defence against a non-converging server.
   *
   * Each page is guarded by an independent `request`-timeout budget so a
   * slow server cannot burn through the caller's overall deadline silently
   * — the `AbortController` is reset per page and named in the error so
   * operators know which `mcp-servers.json` field to raise.
   */
  private async listAllTools(
    serverName: string,
    client: Client
  ): Promise<Array<{ name: string; description?: string; inputSchema: unknown }>> {
    const allTools: Array<{ name: string; description?: string; inputSchema: unknown }> = [];
    let cursor: string | undefined;
    let pages = 0;
    let previousCursor: string | undefined;

    do {
      const result = await this.withRequestTimeout(serverName, 'tools/list', (opts) =>
        client.listTools({ cursor }, opts)
      );
      allTools.push(...(result.tools || []));
      previousCursor = cursor;
      cursor = result.nextCursor;
      pages++;
      // Guard against a server whose `nextCursor` never advances.
      if (cursor && cursor === previousCursor) {
        break;
      }
    } while (cursor && pages < MAX_PAGES);

    return allTools;
  }

  /**
   * Map a raw MCP tool to McpToolInfo, tolerating malformed schemas.
   *
   * Also normalizes object schemas that omit `properties` to an empty object,
   * because OpenAI-shaped function-tool registration (used by SAP AI Core
   * deployments) rejects the entire `tools` payload when an object schema
   * lacks `properties`. Spec-compliant MCP servers (e.g. the official
   * `@modelcontextprotocol/server-time`) emit `{ type: 'object' }` with no
   * `properties` for zero-arg tools; without this fix the whole server
   * silently disables for that session. See opencode `25cb2be6`.
   */
  private mapToolInfo(
    tool: { name: string; description?: string; inputSchema: unknown },
    serverName: string
  ): McpToolInfo {
    let inputSchema = tool.inputSchema as McpToolInfo['inputSchema'];
    try {
      if (!inputSchema || typeof inputSchema !== 'object') {
        throw new Error('Invalid schema structure');
      }
    } catch (error) {
      logger.warn(
        `MCP tool schema parsing failed for ${tool.name} from ${serverName}, using permissive fallback:`,
        error
      );
      inputSchema = {
        type: 'object',
        properties: {},
      };
    }

    // Default `properties` to `{}` when the schema declares an object type but
    // omits it. We deliberately do NOT rewrite schemas that already have
    // `properties` set (even to a truthy non-object value) — those are the
    // user's responsibility.
    const schemaType = (inputSchema as { type?: unknown }).type;
    const isObjectType =
      schemaType === 'object' || (Array.isArray(schemaType) && schemaType.includes('object'));
    if (isObjectType && (inputSchema as { properties?: unknown }).properties === undefined) {
      inputSchema = { ...inputSchema, properties: {} };
    }

    return {
      name: tool.name,
      description: tool.description,
      inputSchema,
      serverName,
      qualifiedName: buildQualifiedName(serverName, tool.name),
    };
  }

  /**
   * Sleep for `ms` milliseconds. Extracted as a protected method so tests
   * using fake timers can advance the clock without depending on wall time.
   */
  protected async delay(ms: number): Promise<void> {
    if (ms <= 0) {
      return;
    }
    await new Promise<void>((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Perform ONE connect + initial-metadata-fetch attempt for a
   * connection. Throws on any failure so the caller can classify the
   * error and decide whether to retry.
   */
  private async attemptConnect(
    connection: McpConnection,
    options?: McpConnectOptions
  ): Promise<void> {
    const { config } = connection;

    // Fail fast on obvious config errors so we don't burn the retry
    // budget on a request that can never succeed.
    if (config.transport === 'stdio') {
      const rawEnv = config.env;
      const resolvedEnv = resolveEnvVars(rawEnv);
      const missing = findMissingEnvVars(rawEnv, resolvedEnv);
      if (missing.length > 0) {
        throw new Error(
          `MCP server '${config.name}' is missing environment variable(s): ` +
            `${missing.join(', ')}. Set them in the process environment or in the ` +
            `'env' block of mcp-servers.json.`
        );
      }
    }

    if (config.transport === 'stdio') {
      await this.connectStdio(connection, options);
    } else {
      throw new Error(`Transport ${config.transport} not yet implemented`);
    }

    // Fetch available tools (with pagination support). Each page is
    // bound by the per-server `request` timeout so a slow server can't
    // stall startup indefinitely — the `startup` budget covered the
    // handshake above; metadata fetches use the `request` budget going
    // forward. Additional metadata endpoints (resources, prompts) are
    // fetched in parallel with tools where the client supports them,
    // so a slow endpoint on one axis does not block the others.
    const rawTools = await this.fetchInitialMetadata(config.name, connection.client);
    connection.tools = rawTools.map((tool) => this.mapToolInfo(tool, config.name));
  }

  /**
   * Fetch initial metadata for a freshly connected server. Currently
   * only tools are exposed to the rest of the codebase, but we
   * parallelize probes for `resources` and `prompts` where the SDK
   * exposes them so future callers get the data without adding round
   * trips. Failures on optional endpoints are logged and swallowed —
   * a server without `resources` support must not fail to connect
   * because of an unsupported method.
   */
  private async fetchInitialMetadata(
    serverName: string,
    client: Client
  ): Promise<Array<{ name: string; description?: string; inputSchema: unknown }>> {
    const toolsPromise = this.listAllTools(serverName, client);

    // `listResources` / `listPrompts` are optional in the MCP spec. Not
    // every client build exposes them, and even when exposed a server
    // may respond with `method not found`. We fire them in parallel
    // with tools, catch and ignore all errors — they're informational
    // only and MUST NOT block a successful connection.
    const optionalMetadata: Promise<unknown>[] = [];
    const c = client as unknown as {
      listResources?: (params?: unknown, options?: { signal: AbortSignal }) => Promise<unknown>;
      listPrompts?: (params?: unknown, options?: { signal: AbortSignal }) => Promise<unknown>;
    };
    const listResources = c.listResources;
    if (typeof listResources === 'function') {
      optionalMetadata.push(
        this.withRequestTimeout(serverName, 'resources/list', (opts) =>
          listResources({}, opts)
        ).catch((error: unknown) => {
          logger.debug(`MCP resources/list unavailable for ${serverName}:`, error);
        })
      );
    }
    const listPrompts = c.listPrompts;
    if (typeof listPrompts === 'function') {
      optionalMetadata.push(
        this.withRequestTimeout(serverName, 'prompts/list', (opts) => listPrompts({}, opts)).catch(
          (error: unknown) => {
            logger.debug(`MCP prompts/list unavailable for ${serverName}:`, error);
          }
        )
      );
    }

    // Wait for tools (the required axis) AND the optional probes to
    // settle so that slow-listing resources cannot silently linger and
    // leak timers past the connect call.
    const [tools] = await Promise.all([toolsPromise, ...optionalMetadata]);
    return tools;
  }

  /**
   * Connect to an MCP server, applying the configured retry policy on
   * transient failures. Non-transient (config) errors terminate the
   * loop immediately.
   *
   * The returned {@link McpConnection} is ALWAYS registered in the
   * manager's connection map (closes #1189: failed servers remain
   * visible with an actionable `error` message and a `failed` status),
   * regardless of outcome. Operators can inspect it via `getStatus()`
   * / `getConnection()` and reconnect after fixing the underlying
   * cause.
   */
  async connect(config: McpServerConfig, options?: McpConnectOptions): Promise<McpConnection> {
    if (this.connections.has(config.name)) {
      const existing = this.connections.get(config.name)!;
      if (existing.status === 'connected') {
        return existing;
      }
      // Disconnect existing failed connection so the retry loop starts
      // from a clean transport/process pair.
      await this.disconnect(config.name);
    }

    const connection: McpConnection = {
      config,
      client: new Client({ name: 'alexi', version: '0.1.0' }, { capabilities: {} }),
      tools: [],
      status: 'connecting',
      attemptCount: 0,
    };
    this.registerNotificationHandlers(connection);

    this.connections.set(config.name, connection);

    const policy = resolveRetryPolicy(config);
    let lastError: unknown = undefined;

    for (let attempt = 1; attempt <= policy.maxAttempts; attempt++) {
      connection.attemptCount = attempt;

      // Every attempt beyond the first needs a fresh Client + transport
      // pair — an aborted handshake leaves the SDK internals in an
      // undefined state and re-using the same instance produces
      // confusing double-connect errors.
      if (attempt > 1) {
        connection.client = new Client({ name: 'alexi', version: '0.1.0' }, { capabilities: {} });
        connection.process = undefined;
        this.registerNotificationHandlers(connection);
      }

      try {
        await this.attemptConnect(connection, options);
        connection.status = 'connected';
        connection.error = undefined;
        logger.info(
          `Connected to MCP server: ${config.name} (${connection.tools.length} tools)` +
            (attempt > 1 ? ` [after ${attempt} attempts]` : '')
        );
        return connection;
      } catch (error) {
        lastError = error;
        connection.lastErrorAt = Date.now();
        connection.error = formatConnectError(config.name, error);

        const classification = classifyConnectError(error);
        const attemptsRemaining = policy.maxAttempts - attempt;

        if (classification === 'config' || attemptsRemaining <= 0) {
          connection.status = 'failed';
          logger.error(
            `Failed to connect to MCP server ${config.name} ` +
              `[attempt ${attempt}/${policy.maxAttempts}, ${classification}]: ${connection.error}`
          );
          return connection;
        }

        // Transient + at least one attempt remaining: schedule backoff
        // and try again. Emit a `retrying` state so consumers of
        // `getStatus()` can render a spinner rather than a red X.
        const delayMs = computeBackoffDelayMs(attempt, policy.initialDelayMs, policy.maxDelayMs);
        connection.status = 'retrying';
        logger.warn(
          `MCP server ${config.name} connect attempt ${attempt}/${policy.maxAttempts} failed ` +
            `(transient): ${connection.error} — retrying in ${delayMs}ms`
        );
        await this.delay(delayMs);
      }
    }

    // Unreachable in practice — the loop always returns on the final
    // attempt — but keep a defensive fallback that mirrors the failure
    // path so `connection.status` is never left as `retrying`.
    connection.status = 'failed';
    connection.error = formatConnectError(config.name, lastError);
    return connection;
  }

  private async connectStdio(
    connection: McpConnection,
    options?: McpConnectOptions
  ): Promise<void> {
    const { config } = connection;

    if (!config.command) {
      throw new Error('Stdio transport requires a command');
    }

    // Resolve environment variables
    // ALEXI_PROJECT_DIR, ALEXI_SESSION_ID and ALEXICODE are injected before user
    // config.env so users can override them (last-write semantics).
    const env = {
      ...process.env,
      ALEXI_PROJECT_DIR: options?.workdir ?? process.cwd(),
      ALEXI_SESSION_ID: options?.sessionId ?? '',
      ALEXICODE: '1',
      ...resolveEnvVars(config.env),
    };

    // Resolve optional working directory for the stdio server. Relative
    // paths are resolved against options.workdir (or process.cwd() if
    // not supplied). When undefined, the cwd key is omitted so the child
    // inherits the parent process cwd (preserves prior behaviour).
    const baseDir = options?.workdir ?? process.cwd();
    const resolvedCwd = config.cwd
      ? path.isAbsolute(config.cwd)
        ? config.cwd
        : path.resolve(baseDir, config.cwd)
      : undefined;

    const spawnOptions: Parameters<typeof spawn>[2] = {
      env,
      stdio: ['pipe', 'pipe', 'pipe'],
    };
    if (resolvedCwd !== undefined) {
      spawnOptions.cwd = resolvedCwd;
    }

    // Spawn the MCP server process
    const proc = spawn(config.command, config.args || [], spawnOptions);

    connection.process = proc;

    // Handle process errors AFTER the connection has stabilised. During
    // an in-flight connect attempt the SDK's `client.connect` call is
    // the source of truth for failure — letting the async `proc.on`
    // handler race with the retry loop would flip `status` back to
    // 'error' between attempts and hide the retry state from operators.
    proc.on('error', (error) => {
      if (connection.status === 'connected') {
        connection.status = 'failed';
        connection.error = formatConnectError(config.name, error);
        connection.lastErrorAt = Date.now();
      }
    });

    proc.on('exit', (code) => {
      if (connection.status === 'connected') {
        connection.status = 'disconnected';
        logger.info(`MCP server ${config.name} exited with code ${code}`);
      }
    });

    // Log stderr for debugging
    proc.stderr?.on('data', (data) => {
      logger.warn(`[${config.name}] ${data.toString()}`);
    });

    // Create stdio transport - filter out undefined values from env
    const cleanEnv: Record<string, string> = {};
    for (const [key, value] of Object.entries(env)) {
      if (value !== undefined) {
        cleanEnv[key] = value;
      }
    }

    const transport = new StdioClientTransport({
      command: config.command,
      args: config.args,
      env: cleanEnv,
    });

    // Bind the handshake to the per-server `startup` budget. The SDK also
    // honours `timeout` internally, but we additionally guard with an
    // `AbortController` so a slow spawn produces a named, actionable error
    // that points at `timeout.startup` in `mcp-servers.json` instead of a
    // generic SDK message.
    const { startup } = this.getTimeoutsForServer(config.name);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), startup);
    try {
      await connection.client.connect(transport, {
        timeout: startup,
        signal: controller.signal,
      });
    } catch (error) {
      if (controller.signal.aborted || (error instanceof Error && error.name === 'AbortError')) {
        throw new Error(formatTimeoutError(config.name, 'connect', 'startup', startup), {
          cause: error,
        });
      }
      throw error;
    } finally {
      clearTimeout(timer);
    }
  }

  /**
   * Disconnect from an MCP server
   */
  async disconnect(name: string): Promise<void> {
    const connection = this.connections.get(name);
    if (!connection) return;

    // Cancel any pending debounced list refreshes for this server so a
    // trailing timer cannot fire after disconnect and hit a closed client.
    for (const kind of ['tools', 'resources', 'prompts'] as McpListKind[]) {
      const key = `${name}::${kind}`;
      const entry = this.refreshDebounces.get(key);
      if (entry) {
        clearTimeout(entry.timer);
        this.refreshDebounces.delete(key);
      }
    }

    try {
      await connection.client.close();
    } catch (error) {
      logger.warn(`Error closing MCP client ${name}:`, error);
    }

    if (connection.process) {
      connection.process.kill();
    }

    this.connections.delete(name);
    logger.info(`Disconnected from MCP server: ${name}`);
  }

  /**
   * Disconnect from all servers
   */
  async disconnectAll(): Promise<void> {
    for (const name of this.connections.keys()) {
      await this.disconnect(name);
    }
  }

  /**
   * Connect to all enabled servers from config
   * Enhanced with graceful failure handling and summary logging
   */
  async connectFromConfig(options?: McpConnectOptions): Promise<void> {
    const config = loadMcpConfig();

    // Cache the config-file-level global timeout so `getTimeoutsForServer`
    // can use it as the fallback layer (per-server > global > env > default).
    // A missing field clears any previously-set global override.
    this.setGlobalTimeout(config.timeout);

    // Add graceful handling for server initialization failures
    const servers = config.servers.filter((s) => s.enabled && s.autoConnect);
    const results = await Promise.allSettled(
      servers.map(async (server) => {
        try {
          const connection = await this.connect(server, options);
          if (connection.status === 'connected') {
            return { server: server.name, status: 'connected', tools: connection.tools.length };
          } else {
            return {
              server: server.name,
              status: 'failed',
              error: connection.error || 'Unknown error',
            };
          }
        } catch (error) {
          logger.warn(`Failed to initialize MCP server ${server.name}:`, error);
          return {
            server: server.name,
            status: 'failed',
            error: error instanceof Error ? error.message : String(error),
          };
        }
      })
    );

    // Log initialization summary
    const successful = results.filter(
      (r) => r.status === 'fulfilled' && r.value.status === 'connected'
    ).length;
    const failed = results.filter(
      (r) => r.status === 'rejected' || (r.status === 'fulfilled' && r.value.status === 'failed')
    ).length;

    if (servers.length > 0) {
      if (failed > 0) {
        logger.warn(`MCP initialization: ${successful} connected, ${failed} failed`);
      } else {
        logger.info(`MCP initialization: ${successful} server(s) connected`);
      }
    }
  }

  /**
   * Get all available tools from connected servers
   * Uses cache to avoid redundant RPC calls
   */
  getAllTools(): McpToolInfo[] {
    const allTools: McpToolInfo[] = [];

    for (const connection of this.connections.values()) {
      if (connection.status === 'connected') {
        allTools.push(...connection.tools);
      }
    }

    return allTools;
  }

  /**
   * Get tools from a specific server with caching
   */
  getServerTools(serverName: string): McpToolInfo[] {
    const connection = this.connections.get(serverName);
    if (!connection || connection.status !== 'connected') {
      return [];
    }

    const cached = this.toolCache.get(serverName);
    const now = Date.now();

    if (cached && now - cached.timestamp < CACHE_TTL_MS) {
      return cached.tools;
    }

    // Cache the tools
    this.toolCache.set(serverName, {
      tools: connection.tools,
      timestamp: now,
    });

    return connection.tools;
  }

  /**
   * Invalidate tool cache for a specific server or all servers
   */
  invalidateToolCache(serverName?: string): void {
    if (serverName) {
      this.toolCache.delete(serverName);
    } else {
      this.toolCache.clear();
    }
  }

  /**
   * Refresh tools from a specific server
   */
  async refreshTools(serverName: string): Promise<void> {
    const connection = this.connections.get(serverName);
    if (!connection || connection.status !== 'connected') {
      return;
    }

    try {
      const rawTools = await this.listAllTools(connection.config.name, connection.client);
      connection.tools = rawTools.map((tool) => this.mapToolInfo(tool, connection.config.name));
      connection.toolsCachedAt = Date.now();

      // Update cache
      this.toolCache.set(serverName, {
        tools: connection.tools,
        timestamp: Date.now(),
      });
    } catch (error) {
      logger.error(`Failed to refresh tools from ${serverName}:`, error);
    }
  }

  /**
   * Refresh the cached resources list from a specific server.
   *
   * Silently no-ops when the server is not connected or when the SDK
   * client does not expose `listResources` (older transports / minimal
   * servers). Errors are logged and swallowed — a failed refresh must
   * not flip the connection to `failed`, because the cached list is a
   * convenience surface, not a required capability.
   */
  async refreshResources(serverName: string): Promise<void> {
    const connection = this.connections.get(serverName);
    if (!connection || connection.status !== 'connected') {
      return;
    }
    const c = connection.client as unknown as {
      listResources?: (params?: unknown, options?: { signal: AbortSignal }) => Promise<unknown>;
    };
    if (typeof c.listResources !== 'function') {
      return;
    }
    try {
      const result = (await this.withRequestTimeout(serverName, 'resources/list', (opts) =>
        c.listResources!({}, opts)
      )) as { resources?: unknown[] };
      connection.resources = Array.isArray(result?.resources) ? result.resources : [];
      connection.resourcesCachedAt = Date.now();
    } catch (error) {
      logger.error(`Failed to refresh resources from ${serverName}:`, error);
    }
  }

  /**
   * Refresh the cached prompts list from a specific server.
   *
   * Same contract as {@link refreshResources}: no-op when unavailable,
   * errors are logged and swallowed.
   */
  async refreshPrompts(serverName: string): Promise<void> {
    const connection = this.connections.get(serverName);
    if (!connection || connection.status !== 'connected') {
      return;
    }
    const c = connection.client as unknown as {
      listPrompts?: (params?: unknown, options?: { signal: AbortSignal }) => Promise<unknown>;
    };
    if (typeof c.listPrompts !== 'function') {
      return;
    }
    try {
      const result = (await this.withRequestTimeout(serverName, 'prompts/list', (opts) =>
        c.listPrompts!({}, opts)
      )) as { prompts?: unknown[] };
      connection.prompts = Array.isArray(result?.prompts) ? result.prompts : [];
      connection.promptsCachedAt = Date.now();
    } catch (error) {
      logger.error(`Failed to refresh prompts from ${serverName}:`, error);
    }
  }

  /**
   * Perform the fetch for a given list kind. Kept as a single dispatch
   * point so {@link scheduleListRefresh} does not need to know which
   * method to call for each kind.
   */
  private async performListRefresh(serverName: string, kind: McpListKind): Promise<void> {
    switch (kind) {
      case 'tools':
        await this.refreshTools(serverName);
        return;
      case 'resources':
        await this.refreshResources(serverName);
        return;
      case 'prompts':
        await this.refreshPrompts(serverName);
        return;
    }
  }

  /**
   * Schedule a debounced refresh of the given list for a connected server.
   *
   * Coalesces bursts of MCP `list_changed` notifications by resetting the
   * trailing timer on every call, but caps the total deferral so the UI
   * cannot fall arbitrarily far behind. When the timer fires (or the
   * deadline is hit), the corresponding list is re-fetched and the
   * debounce state for that (server, kind) pair is cleared so the next
   * notification restarts a fresh cycle.
   *
   * Exposed as an internal helper on the manager so both the SDK
   * notification path and tests can drive it.
   */
  scheduleListRefresh(serverName: string, kind: McpListKind): void {
    const key = `${serverName}::${kind}`;
    const now = Date.now();
    const existing = this.refreshDebounces.get(key);

    // Preserve the ORIGINAL deadline across resets so a continuous burst
    // cannot indefinitely push the refresh out. The first notification
    // arms both timer and deadline; subsequent notifications only reset
    // the trailing timer, always clamped to the pre-existing deadline.
    const deadline = existing?.deadline ?? now + LIST_CHANGED_MAX_DEFERRAL_MS;
    const trailingFireAt = now + LIST_CHANGED_DEBOUNCE_MS;
    const fireAt = Math.min(trailingFireAt, deadline);
    const delay = Math.max(0, fireAt - now);

    if (existing) {
      clearTimeout(existing.timer);
    }

    const timer = setTimeout(() => {
      // Clear before firing so a refresh that itself triggers a
      // notification (rare, but the spec allows it) starts a fresh
      // debounce cycle instead of resetting the just-fired one.
      this.refreshDebounces.delete(key);
      void this.performListRefresh(serverName, kind).catch((error) => {
        logger.error(`MCP list refresh failed for ${serverName} (${kind}):`, error);
      });
    }, delay);

    // Node's Timeout carries a reference by default; `unref` so a lone
    // pending refresh cannot block process exit. Guarded because fake
    // timer implementations (vitest) do not expose `unref`.
    if (typeof (timer as { unref?: () => unknown }).unref === 'function') {
      (timer as { unref: () => unknown }).unref();
    }

    this.refreshDebounces.set(key, { timer, deadline });
  }

  /**
   * Register MCP notification handlers on a freshly-created client. Sets
   * per-method handlers for the three `list_changed` notifications and a
   * fallback handler that downgrades everything else to a debug log
   * (matches the Kilo #12619 pattern: prevents notification-spam toasts
   * while still preserving diagnostic signal).
   *
   * Idempotent per client: `setNotificationHandler` replaces any prior
   * registration for the same method.
   */
  private registerNotificationHandlers(connection: McpConnection): void {
    const client = connection.client as unknown as {
      setNotificationHandler?: (method: string, handler: (n: unknown) => void) => void;
      fallbackNotificationHandler?: (n: unknown) => Promise<void>;
    };

    if (typeof client.setNotificationHandler === 'function') {
      for (const [method, kind] of Object.entries(LIST_CHANGED_METHODS)) {
        client.setNotificationHandler(method, () => {
          this.scheduleListRefresh(connection.config.name, kind);
        });
      }
    }

    // Fallback handler: any notification method NOT in LIST_CHANGED_METHODS
    // lands here. Log at debug level so operators can still surface the
    // traffic if they crank the log level up, but never toast the user.
    client.fallbackNotificationHandler = async (notification: unknown) => {
      const method = (notification as { method?: unknown } | null)?.method;
      logger.debug(
        `MCP notification (unhandled) from ${connection.config.name}: ` +
          `${typeof method === 'string' ? method : '<unknown>'}`
      );
    };
  }

  /**
   * Normalize a raw `timeout` config value into a `{startup, request}`
   * pair. Returns `undefined` if the value is absent so the caller can
   * fall through to the next precedence layer. Zero and negative numbers
   * are treated as unset (they would disable the timeout, which is never
   * what an operator wants).
   */
  private normalizeTimeout(
    raw: number | { startup?: number; request?: number } | undefined | null
  ): { startup?: number; request?: number } | undefined {
    if (typeof raw === 'number') {
      if (!isFinite(raw) || raw <= 0) {
        return undefined;
      }
      return { startup: raw, request: raw };
    }
    if (raw !== undefined && raw !== null && typeof raw === 'object') {
      return { startup: raw.startup, request: raw.request };
    }
    return undefined;
  }

  /**
   * Get the startup and per-request timeouts for a specific server.
   *
   * Resolution order (per-phase, checked independently so a partial
   * override at any layer falls through for the missing phase):
   * 1. Per-server `McpServerConfig.timeout` (bare number applies to both
   *    phases; object form contributes only the fields it sets).
   * 2. Global `McpConfig.timeout` (this manager instance's cached global
   *    timeout, set via {@link setGlobalTimeout} or auto-populated by
   *    {@link connectFromConfig}).
   * 3. `MCP_TOOL_TIMEOUT` environment variable (applied to both phases
   *    for backwards-compat).
   * 4. Built-in defaults (30000ms startup, 60000ms request).
   */
  private getTimeoutsForServer(serverName: string): { startup: number; request: number } {
    const connection = this.connections.get(serverName);
    const serverLayer = this.normalizeTimeout(connection?.config.timeout);
    const globalLayer = this.normalizeTimeout(this.globalTimeout);

    let envLayer: { startup?: number; request?: number } | undefined;
    const envTimeout = process.env.MCP_TOOL_TIMEOUT;
    if (envTimeout !== undefined) {
      const parsed = Number(envTimeout);
      if (!isNaN(parsed) && parsed > 0) {
        envLayer = { startup: parsed, request: parsed };
      }
    }

    const startup =
      serverLayer?.startup ??
      globalLayer?.startup ??
      envLayer?.startup ??
      DEFAULT_STARTUP_TIMEOUT_MS;
    const request =
      serverLayer?.request ??
      globalLayer?.request ??
      envLayer?.request ??
      DEFAULT_TOOL_CALL_TIMEOUT_MS;

    return { startup, request };
  }

  /**
   * Call a tool on an MCP server
   */
  async callTool(
    serverName: string,
    toolName: string,
    args: Record<string, unknown>
  ): Promise<{ success: boolean; result?: unknown; error?: string }> {
    const connection = this.connections.get(serverName);

    if (!connection) {
      return { success: false, error: `Server not connected: ${serverName}` };
    }

    if (connection.status !== 'connected') {
      return { success: false, error: `Server not ready: ${serverName} (${connection.status})` };
    }

    try {
      const result = await this.withRequestTimeout(serverName, 'callTool', (opts) =>
        connection.client.callTool({ name: toolName, arguments: args }, opts)
      );

      // Per the MCP spec, `content` is the canonical narrated output and
      // `structuredContent` is a supplementary machine-readable payload.
      // Prefer non-empty `content` so we preserve images, resource links,
      // and mixed text+resource arrays from servers (Playwright, Qt Creator,
      // Codex wrappers) that emit BOTH fields. Fall back to the
      // `structuredContent` stringify path only when `content` is missing
      // or empty -- spec-compliant servers that emit ONLY `structuredContent`
      // (zero-arg tools, pure data results) still work via the fallback.
      const rawContent = (result as { content?: unknown }).content;
      if (Array.isArray(rawContent) && rawContent.length > 0) {
        // Extract content from result, preserving non-text parts as compact
        // placeholders so the model can reason about structured failures
        // (e.g. an MCP error that returns text + a `resource` link to the
        // offending file). Spec-compliant MCP servers routinely return mixed
        // content arrays; filtering them to text-only loses critical context.
        const flattened = (rawContent as unknown[]).map(formatContentPart).join('\n');

        if (result.isError) {
          return { success: false, error: flattened || 'Unknown error' };
        }

        return { success: true, result: flattened };
      }

      const structured = (result as { structuredContent?: unknown }).structuredContent;
      if (structured !== undefined && structured !== null) {
        const text = typeof structured === 'string' ? structured : JSON.stringify(structured);
        if (result.isError) {
          return { success: false, error: text || 'Unknown error' };
        }
        return { success: true, result: text };
      }

      // Neither content nor structuredContent present — return empty result
      // (preserves prior behaviour where empty content flattened to '').
      if (result.isError) {
        return { success: false, error: 'Unknown error' };
      }
      return { success: true, result: '' };
    } catch (error) {
      // `withRequestTimeout` translates AbortError into a rich, named
      // timeout message. Any other error propagates its message verbatim.
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  /**
   * Look up a connected tool by its qualified name.
   *
   * Returns the owning connection and the {@link McpToolInfo} entry, or
   * `undefined` if no connected server currently exposes that tool.
   */
  getToolByQualifiedName(
    qualified: string
  ): { connection: McpConnection; tool: McpToolInfo } | undefined {
    let parsed: { serverName: string; toolName: string };
    try {
      parsed = parseQualifiedName(qualified);
    } catch {
      return undefined;
    }
    const connection = this.connections.get(parsed.serverName);
    if (!connection || connection.status !== 'connected') {
      return undefined;
    }
    const tool = connection.tools.find((t) => t.name === parsed.toolName);
    if (!tool) {
      return undefined;
    }
    return { connection, tool };
  }

  /**
   * Call a tool identified by its qualified name (`serverName::toolName`).
   *
   * Delegates to {@link callTool} once the qualified name has been resolved.
   * Existing callers using `callTool(serverName, toolName, args)` are
   * unaffected.
   */
  async callToolByQualified(
    qualified: string,
    args: Record<string, unknown>
  ): Promise<{ success: boolean; result?: unknown; error?: string }> {
    const entry = this.getToolByQualifiedName(qualified);
    if (!entry) {
      return { success: false, error: `Tool not found: ${qualified}` };
    }
    return this.callTool(entry.connection.config.name, entry.tool.name, args);
  }

  /**
   * Find which server provides a tool
   */
  findToolServer(toolName: string): string | undefined {
    for (const connection of this.connections.values()) {
      if (connection.status === 'connected') {
        const tool = connection.tools.find((t) => t.name === toolName);
        if (tool) {
          return connection.config.name;
        }
      }
    }
    return undefined;
  }

  /**
   * Get connection status for all servers
   */
  getStatus(): Array<{
    name: string;
    status: string;
    tools: number;
    error?: string;
  }> {
    return Array.from(this.connections.entries()).map(([name, conn]) => ({
      name,
      status: conn.status,
      tools: conn.tools.length,
      error: conn.error,
    }));
  }

  /**
   * Get a specific connection
   */
  getConnection(name: string): McpConnection | undefined {
    return this.connections.get(name);
  }
}

// Singleton instance
let globalManager: McpClientManager | null = null;

export function getMcpClientManager(): McpClientManager {
  if (!globalManager) {
    globalManager = new McpClientManager();
  }
  return globalManager;
}

export function resetMcpClientManager(): void {
  if (globalManager) {
    globalManager.disconnectAll();
  }
  globalManager = null;
}
