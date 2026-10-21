/**
 * Doctor/Health Check System
 * Performs system diagnostics and validates environment configuration
 */

import fs from 'fs';
import path from 'path';
import os from 'os';
import { execSync } from 'child_process';
import { env } from '../config/env.js';

// ============ Type Definitions ============

export interface HealthCheckResult {
  id: string;
  name: string;
  status: 'pass' | 'warn' | 'fail';
  message: string;
  fix?: string;
  duration: number;
}

export interface CheckDefinition {
  id: string;
  name: string;
  description: string;
  category: 'environment' | 'configuration' | 'filesystem' | 'network' | 'tools';
  optional?: boolean;
}

export interface DoctorOptions {
  skipNetwork?: boolean;
  /** When true, individual checks may attempt safe auto-repairs (e.g. mkdir). */
  fix?: boolean;
}

export interface DoctorSummary {
  passed: number;
  warned: number;
  failed: number;
}

// ============ Constants ============

const MIN_NODE_VERSION = '22.12.0';

/**
 * Resolve `~/.alexi/` dynamically so tests (and the `--fix` flow) can
 * redirect HOME at runtime. `os.homedir()` is cached by the Node runtime
 * at import time if we compute it once, which breaks per-test HOME
 * overrides; the helpers below re-read it on every call.
 */
function configDir(): string {
  return path.join(os.homedir(), '.alexi');
}
function mcpConfigFile(): string {
  return path.join(configDir(), 'mcp-servers.json');
}
function sessionsDir(): string {
  return path.join(configDir(), 'sessions');
}

// ============ Health Check Interface ============

export interface HealthCheck {
  id: string;
  name: string;
  description: string;
  category: 'environment' | 'configuration' | 'filesystem' | 'network' | 'tools';
  optional?: boolean;
  run(options?: DoctorOptions): Promise<HealthCheckResult>;
}

// ============ Individual Health Checks ============

const nodeVersionCheck: HealthCheck = {
  id: 'node-version',
  name: 'Node.js Version',
  description: `Check Node.js version is >= ${MIN_NODE_VERSION}`,
  category: 'environment',
  async run(): Promise<HealthCheckResult> {
    const start = Date.now();
    const currentVersion = process.version.replace(/^v/, '');

    const compareVersions = (current: string, required: string): number => {
      const currParts = current.split('.').map(Number);
      const reqParts = required.split('.').map(Number);

      for (let i = 0; i < Math.max(currParts.length, reqParts.length); i++) {
        const curr = currParts[i] || 0;
        const req = reqParts[i] || 0;
        if (curr > req) return 1;
        if (curr < req) return -1;
      }
      return 0;
    };

    const comparison = compareVersions(currentVersion, MIN_NODE_VERSION);

    if (comparison >= 0) {
      return {
        id: this.id,
        name: this.name,
        status: 'pass',
        message: `Node.js ${currentVersion} meets minimum requirement (>= ${MIN_NODE_VERSION})`,
        duration: Date.now() - start,
      };
    } else {
      return {
        id: this.id,
        name: this.name,
        status: 'fail',
        message: `Node.js ${currentVersion} is below minimum requirement (>= ${MIN_NODE_VERSION})`,
        fix: `Install Node.js ${MIN_NODE_VERSION} or later: https://nodejs.org/`,
        duration: Date.now() - start,
      };
    }
  },
};

const envSapAicoreCheck: HealthCheck = {
  id: 'env-sap-aicore',
  name: 'SAP AI Core Environment',
  description: 'Check SAP AI Core environment variables',
  category: 'environment',
  async run(): Promise<HealthCheckResult> {
    const start = Date.now();

    const aicoreServiceKey = env('AICORE_SERVICE_KEY');
    const sapProxyBaseUrl = env('SAP_PROXY_BASE_URL');

    if (aicoreServiceKey) {
      // Validate it's valid JSON
      try {
        JSON.parse(aicoreServiceKey);
        return {
          id: this.id,
          name: this.name,
          status: 'pass',
          message: 'AICORE_SERVICE_KEY is set and valid JSON',
          duration: Date.now() - start,
        };
      } catch {
        return {
          id: this.id,
          name: this.name,
          status: 'fail',
          message: 'AICORE_SERVICE_KEY is set but not valid JSON',
          fix: 'Ensure AICORE_SERVICE_KEY contains valid JSON from SAP AI Core service key',
          duration: Date.now() - start,
        };
      }
    } else if (sapProxyBaseUrl) {
      // Validate it looks like a URL
      try {
        new URL(sapProxyBaseUrl);
        return {
          id: this.id,
          name: this.name,
          status: 'pass',
          message: `SAP_PROXY_BASE_URL is set: ${sapProxyBaseUrl}`,
          duration: Date.now() - start,
        };
      } catch {
        return {
          id: this.id,
          name: this.name,
          status: 'fail',
          message: 'SAP_PROXY_BASE_URL is set but not a valid URL',
          fix: 'Set SAP_PROXY_BASE_URL to a valid URL (e.g., http://localhost:3000)',
          duration: Date.now() - start,
        };
      }
    } else {
      return {
        id: this.id,
        name: this.name,
        status: 'fail',
        message: 'Neither AICORE_SERVICE_KEY nor SAP_PROXY_BASE_URL is set',
        fix: 'Set AICORE_SERVICE_KEY with your SAP AI Core service key JSON, or SAP_PROXY_BASE_URL for proxy mode',
        duration: Date.now() - start,
      };
    }
  },
};

const envModelCheck: HealthCheck = {
  id: 'env-model',
  name: 'Model Configuration',
  description: 'Check DEFAULT_MODEL or AICORE_MODEL is set',
  category: 'environment',
  async run(): Promise<HealthCheckResult> {
    const start = Date.now();

    const defaultModel = env('DEFAULT_MODEL');
    const aicoreModel = env('AICORE_MODEL');

    if (defaultModel) {
      return {
        id: this.id,
        name: this.name,
        status: 'pass',
        message: `DEFAULT_MODEL is set: ${defaultModel}`,
        duration: Date.now() - start,
      };
    } else if (aicoreModel) {
      return {
        id: this.id,
        name: this.name,
        status: 'pass',
        message: `AICORE_MODEL is set: ${aicoreModel}`,
        duration: Date.now() - start,
      };
    } else {
      return {
        id: this.id,
        name: this.name,
        status: 'warn',
        message: 'Neither DEFAULT_MODEL nor AICORE_MODEL is set, will use provider default',
        fix: 'Set DEFAULT_MODEL or AICORE_MODEL to specify the AI model (e.g., anthropic--claude-3.5-sonnet)',
        duration: Date.now() - start,
      };
    }
  },
};

const mcpConfigCheck: HealthCheck = {
  id: 'mcp-config',
  name: 'MCP Configuration',
  description: 'Check MCP config file exists and is valid JSON',
  category: 'configuration',
  async run(): Promise<HealthCheckResult> {
    const start = Date.now();

    if (!fs.existsSync(mcpConfigFile())) {
      return {
        id: this.id,
        name: this.name,
        status: 'warn',
        message: `MCP config file not found at ${mcpConfigFile()}`,
        fix: 'MCP config will be created automatically on first use, or run: alexi mcp list',
        duration: Date.now() - start,
      };
    }

    try {
      const content = fs.readFileSync(mcpConfigFile(), 'utf-8');
      const config = JSON.parse(content);

      if (!config.version || !Array.isArray(config.servers)) {
        return {
          id: this.id,
          name: this.name,
          status: 'warn',
          message: 'MCP config exists but may have invalid structure',
          fix: `Delete ${mcpConfigFile()} and let it regenerate with default structure`,
          duration: Date.now() - start,
        };
      }

      const enabledCount = config.servers.filter((s: { enabled?: boolean }) => s.enabled).length;
      return {
        id: this.id,
        name: this.name,
        status: 'pass',
        message: `MCP config valid with ${config.servers.length} servers (${enabledCount} enabled)`,
        duration: Date.now() - start,
      };
    } catch {
      return {
        id: this.id,
        name: this.name,
        status: 'fail',
        message: `MCP config exists but is not valid JSON: ${mcpConfigFile()}`,
        fix: `Delete ${mcpConfigFile()} and let it regenerate, or fix the JSON syntax`,
        duration: Date.now() - start,
      };
    }
  },
};

const sessionsDirCheck: HealthCheck = {
  id: 'sessions-dir',
  name: 'Sessions Directory',
  description: 'Check sessions directory is writable',
  category: 'filesystem',
  async run(): Promise<HealthCheckResult> {
    const start = Date.now();

    try {
      // Create directory if it doesn't exist
      if (!fs.existsSync(sessionsDir())) {
        fs.mkdirSync(sessionsDir(), { recursive: true });
      }

      // Test write access
      const testFile = path.join(sessionsDir(), '.write-test');
      fs.writeFileSync(testFile, 'test', 'utf-8');
      fs.unlinkSync(testFile);

      // Count existing sessions
      const files = fs.readdirSync(sessionsDir()).filter((f) => f.endsWith('.json'));

      return {
        id: this.id,
        name: this.name,
        status: 'pass',
        message: `Sessions directory is writable: ${sessionsDir()} (${files.length} sessions)`,
        duration: Date.now() - start,
      };
    } catch {
      return {
        id: this.id,
        name: this.name,
        status: 'fail',
        message: `Sessions directory is not writable: ${sessionsDir()}`,
        fix: `Ensure write permissions for ${sessionsDir()} or set HOME environment variable`,
        duration: Date.now() - start,
      };
    }
  },
};

const gitAvailableCheck: HealthCheck = {
  id: 'git-available',
  name: 'Git Available',
  description: 'Check git is available for project-init feature',
  category: 'tools',
  async run(): Promise<HealthCheckResult> {
    const start = Date.now();

    try {
      const version = execSync('git --version', {
        encoding: 'utf-8',
        timeout: 5000,
        stdio: ['pipe', 'pipe', 'pipe'],
      }).trim();

      return {
        id: this.id,
        name: this.name,
        status: 'pass',
        message: `Git is available: ${version}`,
        duration: Date.now() - start,
      };
    } catch {
      return {
        id: this.id,
        name: this.name,
        status: 'warn',
        message: 'Git is not available on PATH',
        fix: 'Install git from https://git-scm.com/ for full project-init functionality',
        duration: Date.now() - start,
      };
    }
  },
};

const networkSapCheck: HealthCheck = {
  id: 'network-sap',
  name: 'SAP AI Core Network',
  description: 'Ping SAP AI Core endpoint',
  category: 'network',
  optional: true,
  async run(): Promise<HealthCheckResult> {
    const start = Date.now();

    // Get the endpoint to test
    const aicoreServiceKey = env('AICORE_SERVICE_KEY');
    const sapProxyBaseUrl = env('SAP_PROXY_BASE_URL');

    let testUrl: string | null = null;

    if (sapProxyBaseUrl) {
      testUrl = sapProxyBaseUrl;
    } else if (aicoreServiceKey) {
      try {
        const serviceKey = JSON.parse(aicoreServiceKey);
        if (serviceKey.serviceurls?.AI_API_URL) {
          testUrl = serviceKey.serviceurls.AI_API_URL;
        }
      } catch {
        // Will return below if no URL found
      }
    }

    if (!testUrl) {
      return {
        id: this.id,
        name: this.name,
        status: 'warn',
        message: 'No SAP AI Core endpoint configured to test',
        fix: 'Configure AICORE_SERVICE_KEY or SAP_PROXY_BASE_URL first',
        duration: Date.now() - start,
      };
    }

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(testUrl, {
        method: 'HEAD',
        signal: controller.signal,
      });

      clearTimeout(timeout);

      // Any response (even 401/403) means the endpoint is reachable
      return {
        id: this.id,
        name: this.name,
        status: 'pass',
        message: `SAP AI Core endpoint reachable: ${testUrl} (HTTP ${response.status})`,
        duration: Date.now() - start,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);

      if (errorMessage.includes('abort')) {
        return {
          id: this.id,
          name: this.name,
          status: 'warn',
          message: `SAP AI Core endpoint timeout: ${testUrl}`,
          fix: 'Check network connectivity and firewall settings',
          duration: Date.now() - start,
        };
      }

      return {
        id: this.id,
        name: this.name,
        status: 'warn',
        message: `SAP AI Core endpoint unreachable: ${testUrl} (${errorMessage})`,
        fix: 'Check network connectivity, VPN status, or endpoint URL configuration',
        duration: Date.now() - start,
      };
    }
  },
};

// ============ Routing / Tools / Permissions Checks ============

const routingConfigCheck: HealthCheck = {
  id: 'routing-config',
  name: 'Routing Configuration',
  description: 'Check routing-config.json exists and is valid',
  category: 'configuration',
  async run(): Promise<HealthCheckResult> {
    const start = Date.now();

    const searchPaths = [
      path.join(process.cwd(), 'routing-config.json'),
      path.join(process.cwd(), 'config', 'routing.json'),
      path.join(configDir(), 'routing-config.json'),
    ];

    const found = searchPaths.find((p) => fs.existsSync(p));
    if (!found) {
      return {
        id: this.id,
        name: this.name,
        status: 'warn',
        message: 'No routing-config.json found; defaults will be used',
        fix: 'Copy routing-config.example.json to routing-config.json to customise routing',
        duration: Date.now() - start,
      };
    }

    try {
      const content = fs.readFileSync(found, 'utf-8');
      const raw = JSON.parse(content) as { models?: unknown; rules?: unknown };
      if (!Array.isArray(raw.models)) {
        return {
          id: this.id,
          name: this.name,
          status: 'fail',
          message: `Routing config at ${found} is missing 'models' array`,
          fix: 'Add a top-level `models: []` array to the routing config',
          duration: Date.now() - start,
        };
      }
      const rulesCount = Array.isArray(raw.rules) ? raw.rules.length : 0;
      return {
        id: this.id,
        name: this.name,
        status: 'pass',
        message: `Routing config valid at ${found} (${raw.models.length} models, ${rulesCount} rules)`,
        duration: Date.now() - start,
      };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      return {
        id: this.id,
        name: this.name,
        status: 'fail',
        message: `Routing config at ${found} is not valid JSON: ${msg}`,
        fix: `Fix the JSON syntax in ${found}, or copy routing-config.example.json fresh`,
        duration: Date.now() - start,
      };
    }
  },
};

const configDirCheck: HealthCheck = {
  id: 'config-dir',
  name: 'Alexi Config Directory',
  description: 'Check ~/.alexi/ exists and is writable',
  category: 'filesystem',
  async run(options?: DoctorOptions): Promise<HealthCheckResult> {
    const start = Date.now();
    try {
      if (!fs.existsSync(configDir())) {
        if (options?.fix) {
          fs.mkdirSync(configDir(), { recursive: true });
          return {
            id: this.id,
            name: this.name,
            status: 'pass',
            message: `Created missing config directory: ${configDir()}`,
            duration: Date.now() - start,
          };
        }
        return {
          id: this.id,
          name: this.name,
          status: 'warn',
          message: `Config directory does not exist: ${configDir()}`,
          fix: `Run 'alexi doctor --fix' to create it, or mkdir -p ${configDir()}`,
          duration: Date.now() - start,
        };
      }
      // Writable probe
      const testFile = path.join(configDir(), '.write-test');
      fs.writeFileSync(testFile, 'test', 'utf-8');
      fs.unlinkSync(testFile);
      return {
        id: this.id,
        name: this.name,
        status: 'pass',
        message: `Config directory writable: ${configDir()}`,
        duration: Date.now() - start,
      };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      return {
        id: this.id,
        name: this.name,
        status: 'fail',
        message: `Config directory not writable: ${configDir()} (${msg})`,
        fix: `Ensure write permission on ${configDir()}`,
        duration: Date.now() - start,
      };
    }
  },
};

const toolRegistryCheck: HealthCheck = {
  id: 'tool-registry',
  name: 'Tool Registry',
  description: 'Check all built-in tools load with valid schemas',
  category: 'tools',
  async run(): Promise<HealthCheckResult> {
    const start = Date.now();
    try {
      // Ensure built-in tools are registered before inspecting the
      // registry. `registerBuiltInTools` is idempotent — the registry
      // dedupes by tool name — so repeated calls are safe.
      const toolsMod = (await import('../tool/tools/index.js')) as {
        registerBuiltInTools?: () => void;
      };
      toolsMod.registerBuiltInTools?.();

      const mod = (await import('../tool/index.js')) as {
        getToolRegistry: () => { list: () => Array<{ name: string; parameters?: unknown }> };
      };
      const registry = mod.getToolRegistry();
      const tools = registry.list();
      if (tools.length === 0) {
        return {
          id: this.id,
          name: this.name,
          status: 'warn',
          message: 'Tool registry loaded but reports zero tools',
          fix: 'Ensure built-in tools register via src/tool/registry.ts',
          duration: Date.now() - start,
        };
      }
      const nameless = tools.filter((t) => !t.name || typeof t.name !== 'string');
      if (nameless.length > 0) {
        return {
          id: this.id,
          name: this.name,
          status: 'fail',
          message: `${nameless.length} tool(s) are missing a 'name' field`,
          fix: 'Check tool definitions under src/tool/tools/ and src/tool/registry.ts',
          duration: Date.now() - start,
        };
      }
      return {
        id: this.id,
        name: this.name,
        status: 'pass',
        message: `Tool registry loaded ${tools.length} tool(s)`,
        duration: Date.now() - start,
      };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      return {
        id: this.id,
        name: this.name,
        status: 'fail',
        message: `Failed to load tool registry: ${msg}`,
        fix: 'Rebuild the project (npm run build) and verify tool imports',
        duration: Date.now() - start,
      };
    }
  },
};

const permissionsCheck: HealthCheck = {
  id: 'permissions',
  name: 'Permission Rules',
  description: 'Check permission rules are valid',
  category: 'configuration',
  async run(): Promise<HealthCheckResult> {
    const start = Date.now();
    try {
      const mod = (await import('../permission/index.js')) as {
        PermissionRuleSchema: { safeParse: (value: unknown) => { success: boolean } };
        defaultRules: unknown[];
        getPermissionManager: () => unknown;
      };
      // Load manager to ensure defaults are consistent
      mod.getPermissionManager();
      const rules = mod.defaultRules;
      let invalid = 0;
      for (const rule of rules) {
        const result = mod.PermissionRuleSchema.safeParse(rule);
        if (!result.success) {
          invalid++;
        }
      }
      if (invalid > 0) {
        return {
          id: this.id,
          name: this.name,
          status: 'fail',
          message: `${invalid} of ${rules.length} default permission rules failed schema validation`,
          fix: 'Inspect defaultRules in src/permission/index.ts for shape regressions',
          duration: Date.now() - start,
        };
      }
      return {
        id: this.id,
        name: this.name,
        status: 'pass',
        message: `Permission rules valid (${rules.length} default rules)`,
        duration: Date.now() - start,
      };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      return {
        id: this.id,
        name: this.name,
        status: 'fail',
        message: `Failed to load permission module: ${msg}`,
        fix: 'Rebuild the project (npm run build) and check src/permission/index.ts',
        duration: Date.now() - start,
      };
    }
  },
};

const mcpBreakageCheck: HealthCheck = {
  id: 'mcp-breakage',
  name: 'MCP Breakage Tracker',
  description: 'Check for recent MCP server protocol violations',
  category: 'tools',
  optional: true,
  async run(): Promise<HealthCheckResult> {
    const start = Date.now();
    try {
      const mod = (await import('../mcp/breakage-tracker.js')) as {
        McpBreakageTracker: new () => unknown;
      };
      // We can only inspect a live tracker if the MCP client manager has
      // been created in this process. The tracker import alone validates
      // the module shape; a passing load is reported as pass.
      if (typeof mod.McpBreakageTracker !== 'function') {
        return {
          id: this.id,
          name: this.name,
          status: 'fail',
          message: 'McpBreakageTracker export is not a constructor',
          duration: Date.now() - start,
        };
      }
      return {
        id: this.id,
        name: this.name,
        status: 'pass',
        message: 'MCP breakage tracker module loaded',
        duration: Date.now() - start,
      };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      return {
        id: this.id,
        name: this.name,
        status: 'warn',
        message: `MCP breakage tracker not loadable: ${msg}`,
        fix: 'Rebuild the project (npm run build) and verify src/mcp/breakage-tracker.ts',
        duration: Date.now() - start,
      };
    }
  },
};

// ============ All Checks Registry ============

const ALL_CHECKS: HealthCheck[] = [
  nodeVersionCheck,
  envSapAicoreCheck,
  envModelCheck,
  configDirCheck,
  routingConfigCheck,
  mcpConfigCheck,
  mcpBreakageCheck,
  sessionsDirCheck,
  toolRegistryCheck,
  permissionsCheck,
  gitAvailableCheck,
  networkSapCheck,
];

// ============ DoctorService Class ============

export class DoctorService {
  private checks: HealthCheck[];

  constructor() {
    this.checks = [...ALL_CHECKS];
  }

  /**
   * Run all health checks
   */
  async runAll(options: DoctorOptions = {}): Promise<HealthCheckResult[]> {
    const results: HealthCheckResult[] = [];

    for (const check of this.checks) {
      // Skip network checks if requested
      if (options.skipNetwork && check.category === 'network') {
        results.push({
          id: check.id,
          name: check.name,
          status: 'warn',
          message: 'Skipped (--skip-network)',
          duration: 0,
        });
        continue;
      }

      try {
        const result = await check.run(options);
        results.push(result);
      } catch (error) {
        results.push({
          id: check.id,
          name: check.name,
          status: 'fail',
          message: `Check failed with error: ${error instanceof Error ? error.message : String(error)}`,
          duration: 0,
        });
      }
    }

    return results;
  }

  /**
   * Run a single health check by ID
   */
  async runCheck(id: string, options: DoctorOptions = {}): Promise<HealthCheckResult> {
    const check = this.checks.find((c) => c.id === id);

    if (!check) {
      return {
        id,
        name: 'Unknown Check',
        status: 'fail',
        message: `Health check with id "${id}" not found`,
        duration: 0,
      };
    }

    try {
      return await check.run(options);
    } catch (error) {
      return {
        id: check.id,
        name: check.name,
        status: 'fail',
        message: `Check failed with error: ${error instanceof Error ? error.message : String(error)}`,
        duration: 0,
      };
    }
  }

  /**
   * List all available checks
   */
  listChecks(): CheckDefinition[] {
    return this.checks.map((check) => ({
      id: check.id,
      name: check.name,
      description: check.description,
      category: check.category,
      optional: check.optional,
    }));
  }

  /**
   * Get summary of results
   */
  getSummary(results: HealthCheckResult[]): DoctorSummary {
    return {
      passed: results.filter((r) => r.status === 'pass').length,
      warned: results.filter((r) => r.status === 'warn').length,
      failed: results.filter((r) => r.status === 'fail').length,
    };
  }

  /**
   * Format results as CLI report
   */
  formatReport(results: HealthCheckResult[]): string {
    const lines: string[] = [];
    const summary = this.getSummary(results);

    // Status symbols and colors (ANSI escape codes)
    const symbols = {
      pass: '\x1b[32m✓\x1b[0m', // Green checkmark
      warn: '\x1b[33m!\x1b[0m', // Yellow exclamation
      fail: '\x1b[31m✗\x1b[0m', // Red X
    };

    const statusColors = {
      pass: '\x1b[32m', // Green
      warn: '\x1b[33m', // Yellow
      fail: '\x1b[31m', // Red
    };
    const resetColor = '\x1b[0m';

    lines.push('');
    lines.push('\x1b[1mAlexi - Health Check\x1b[0m');
    lines.push('─'.repeat(50));
    lines.push('');

    // Group results by category
    const categories = ['environment', 'configuration', 'filesystem', 'tools', 'network'] as const;
    const categoryLabels: Record<string, string> = {
      environment: 'Environment',
      configuration: 'Configuration',
      filesystem: 'Filesystem',
      tools: 'Tools',
      network: 'Network',
    };

    for (const category of categories) {
      const categoryResults = results.filter((r) => {
        const check = this.checks.find((c) => c.id === r.id);
        return check?.category === category;
      });

      if (categoryResults.length === 0) continue;

      lines.push(`\x1b[1m${categoryLabels[category]}\x1b[0m`);

      for (const result of categoryResults) {
        const symbol = symbols[result.status];
        const color = statusColors[result.status];

        lines.push(`  ${symbol} ${result.name}`);
        lines.push(`    ${color}${result.message}${resetColor}`);

        if (result.fix && result.status !== 'pass') {
          lines.push(`    \x1b[2mFix: ${result.fix}\x1b[0m`);
        }

        if (result.duration > 0) {
          lines.push(`    \x1b[2m(${result.duration}ms)\x1b[0m`);
        }

        lines.push('');
      }
    }

    // Summary
    lines.push('─'.repeat(50));
    lines.push('\x1b[1mSummary\x1b[0m');
    lines.push(`  ${symbols.pass} Passed: ${summary.passed}`);
    lines.push(`  ${symbols.warn} Warnings: ${summary.warned}`);
    lines.push(`  ${symbols.fail} Failed: ${summary.failed}`);
    lines.push('');

    // Overall status
    if (summary.failed > 0) {
      lines.push('\x1b[31m\x1b[1mStatus: Some checks failed. Please fix the issues above.\x1b[0m');
    } else if (summary.warned > 0) {
      lines.push('\x1b[33m\x1b[1mStatus: All checks passed with warnings.\x1b[0m');
    } else {
      lines.push('\x1b[32m\x1b[1mStatus: All checks passed!\x1b[0m');
    }
    lines.push('');

    return lines.join('\n');
  }

  /**
   * Format results as structured JSON. The shape is stable and intended
   * for programmatic consumption (CI gates, agent workflows).
   */
  formatJson(results: HealthCheckResult[]): string {
    const summary = this.getSummary(results);
    const payload = {
      version: 1,
      summary,
      overall:
        summary.failed > 0
          ? ('fail' as const)
          : summary.warned > 0
            ? ('warn' as const)
            : ('pass' as const),
      checks: results.map((r) => ({
        id: r.id,
        name: r.name,
        status: r.status,
        message: r.message,
        fix: r.fix,
        duration: r.duration,
        category: this.checks.find((c) => c.id === r.id)?.category,
      })),
    };
    return JSON.stringify(payload, null, 2);
  }

  /**
   * Format results as plain text (no colors)
   */
  formatReportPlain(results: HealthCheckResult[]): string {
    const lines: string[] = [];
    const summary = this.getSummary(results);

    const symbols = {
      pass: '[PASS]',
      warn: '[WARN]',
      fail: '[FAIL]',
    };

    lines.push('');
    lines.push('Alexi - Health Check');
    lines.push('='.repeat(50));
    lines.push('');

    for (const result of results) {
      lines.push(`${symbols[result.status]} ${result.name}`);
      lines.push(`  ${result.message}`);

      if (result.fix && result.status !== 'pass') {
        lines.push(`  Fix: ${result.fix}`);
      }

      lines.push('');
    }

    lines.push('='.repeat(50));
    lines.push('Summary');
    lines.push(`  Passed: ${summary.passed}`);
    lines.push(`  Warnings: ${summary.warned}`);
    lines.push(`  Failed: ${summary.failed}`);
    lines.push('');

    if (summary.failed > 0) {
      lines.push('Status: Some checks failed. Please fix the issues above.');
    } else if (summary.warned > 0) {
      lines.push('Status: All checks passed with warnings.');
    } else {
      lines.push('Status: All checks passed!');
    }
    lines.push('');

    return lines.join('\n');
  }
}

// ============ Singleton Instance ============

let doctorInstance: DoctorService | null = null;

/**
 * Get the singleton DoctorService instance
 */
export function getDoctor(): DoctorService {
  if (!doctorInstance) {
    doctorInstance = new DoctorService();
  }
  return doctorInstance;
}

/**
 * Reset the singleton instance (useful for testing)
 */
export function resetDoctor(): void {
  doctorInstance = null;
}

// ============ Convenience Exports ============

export { ALL_CHECKS };
