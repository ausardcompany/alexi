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
}

export interface DoctorSummary {
  passed: number;
  warned: number;
  failed: number;
}

// ============ Constants ============

const MIN_NODE_VERSION = '22.12.0';
const CONFIG_DIR = path.join(os.homedir(), '.alexi');
const MCP_CONFIG_FILE = path.join(CONFIG_DIR, 'mcp-servers.json');
const SESSIONS_DIR = path.join(CONFIG_DIR, 'sessions');

// ============ Health Check Interface ============

export interface HealthCheck {
  id: string;
  name: string;
  description: string;
  category: 'environment' | 'configuration' | 'filesystem' | 'network' | 'tools';
  optional?: boolean;
  run(): Promise<HealthCheckResult>;
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
    
    if (!fs.existsSync(MCP_CONFIG_FILE)) {
      return {
        id: this.id,
        name: this.name,
        status: 'warn',
        message: `MCP config file not found at ${MCP_CONFIG_FILE}`,
        fix: 'MCP config will be created automatically on first use, or run: alexi mcp list',
        duration: Date.now() - start,
      };
    }
    
    try {
      const content = fs.readFileSync(MCP_CONFIG_FILE, 'utf-8');
      const config = JSON.parse(content);
      
      if (!config.version || !Array.isArray(config.servers)) {
        return {
          id: this.id,
          name: this.name,
          status: 'warn',
          message: 'MCP config exists but may have invalid structure',
          fix: `Delete ${MCP_CONFIG_FILE} and let it regenerate with default structure`,
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
        message: `MCP config exists but is not valid JSON: ${MCP_CONFIG_FILE}`,
        fix: `Delete ${MCP_CONFIG_FILE} and let it regenerate, or fix the JSON syntax`,
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
      if (!fs.existsSync(SESSIONS_DIR)) {
        fs.mkdirSync(SESSIONS_DIR, { recursive: true });
      }
      
      // Test write access
      const testFile = path.join(SESSIONS_DIR, '.write-test');
      fs.writeFileSync(testFile, 'test', 'utf-8');
      fs.unlinkSync(testFile);
      
      // Count existing sessions
      const files = fs.readdirSync(SESSIONS_DIR).filter(f => f.endsWith('.json'));
      
      return {
        id: this.id,
        name: this.name,
        status: 'pass',
        message: `Sessions directory is writable: ${SESSIONS_DIR} (${files.length} sessions)`,
        duration: Date.now() - start,
      };
    } catch (error) {
      return {
        id: this.id,
        name: this.name,
        status: 'fail',
        message: `Sessions directory is not writable: ${SESSIONS_DIR}`,
        fix: `Ensure write permissions for ${SESSIONS_DIR} or set HOME environment variable`,
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

// ============ All Checks Registry ============

const ALL_CHECKS: HealthCheck[] = [
  nodeVersionCheck,
  envSapAicoreCheck,
  envModelCheck,
  mcpConfigCheck,
  sessionsDirCheck,
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
        const result = await check.run();
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
  async runCheck(id: string): Promise<HealthCheckResult> {
    const check = this.checks.find(c => c.id === id);
    
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
      return await check.run();
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
    return this.checks.map(check => ({
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
      passed: results.filter(r => r.status === 'pass').length,
      warned: results.filter(r => r.status === 'warn').length,
      failed: results.filter(r => r.status === 'fail').length,
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
      pass: '\x1b[32m✓\x1b[0m',  // Green checkmark
      warn: '\x1b[33m!\x1b[0m',  // Yellow exclamation
      fail: '\x1b[31m✗\x1b[0m',  // Red X
    };
    
    const statusColors = {
      pass: '\x1b[32m',  // Green
      warn: '\x1b[33m',  // Yellow
      fail: '\x1b[31m',  // Red
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
      const categoryResults = results.filter(r => {
        const check = this.checks.find(c => c.id === r.id);
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
