/**
 * `alexi provider` command group.
 *
 * Currently exposes a single subcommand, `health`, which validates
 * provider credentials and reachability. See `src/providers/health.ts`
 * for the underlying checks.
 *
 * Issue #2067.
 */

import type { Command } from 'commander';
import {
  checkAllProviderHealth,
  checkProviderHealth,
  KNOWN_PROVIDERS,
  listConfiguredProviders,
  type HealthResult,
} from '../../providers/health.js';

// --- ANSI colour helpers (match `src/cli/commands/models.ts` style) ------

const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
} as const;

function c(color: keyof typeof colors, text: string): string {
  return `${colors[color]}${text}${colors.reset}`;
}

// --- Formatting ----------------------------------------------------------

/**
 * Format one `HealthResult` for human output. Verbose mode adds the
 * env-var table, probed endpoint, and raw connectivity reason.
 */
export function formatHealthResult(result: HealthResult, verbose: boolean): string {
  const status = result.ok ? c('green', 'OK') : c('red', 'FAIL');
  const latency = typeof result.latency === 'number' ? c('dim', ` (${result.latency}ms)`) : '';

  const header = `  [${status}] ${c('bold', result.provider)}${latency}`;
  const lines = [header];

  if (!result.ok && result.error) {
    lines.push(`    ${c('red', result.error)}`);
  }

  if (verbose && result.details) {
    const { envVars, endpoint, connectivity, attemptedProbe } = result.details;
    if (envVars.length > 0) {
      lines.push(`    ${c('cyan', 'Environment:')}`);
      for (const v of envVars) {
        const marker = v.present ? c('green', '+') : v.required ? c('red', '-') : c('yellow', '-');
        const tag = v.required ? '' : c('dim', ' (optional)');
        lines.push(`      ${marker} ${v.name}${tag}`);
      }
    }
    if (endpoint) {
      lines.push(`    ${c('cyan', 'Endpoint:')} ${endpoint}`);
    }
    lines.push(`    ${c('cyan', 'Probed:')} ${attemptedProbe ? 'yes' : 'no'}`);
    if (connectivity) {
      lines.push(
        `    ${c('cyan', 'Reachable:')} ${connectivity.reachable ? 'yes' : 'no'}${
          connectivity.error ? ` — ${connectivity.error}` : ''
        }`
      );
    }
  }

  return lines.join('\n');
}

/**
 * Format a full set of results plus a summary footer. Pure so tests can
 * assert on the exact rendered text.
 */
export function formatHealthReport(results: HealthResult[], verbose: boolean): string {
  if (results.length === 0) {
    return (
      c('yellow', '  No providers configured.') +
      '\n' +
      c('dim', '  Set AICORE_SERVICE_KEY (SAP AI Core) or SAP_PROXY_BASE_URL (proxy).')
    );
  }

  const body = results.map((r) => formatHealthResult(r, verbose)).join('\n');
  const okCount = results.filter((r) => r.ok).length;
  const failCount = results.length - okCount;
  const summary = `  ${c('bold', 'Summary:')} ${c('green', `${okCount} ok`)}, ${
    failCount > 0 ? c('red', `${failCount} failed`) : c('dim', `${failCount} failed`)
  }`;
  return `${body}\n\n${summary}`;
}

// --- Command registration ------------------------------------------------

interface HealthOptions {
  provider?: string;
  verbose?: boolean;
  json?: boolean;
  skipNetwork?: boolean;
  timeout?: string;
}

/**
 * Parse the `--timeout` option (seconds) into milliseconds. Returns
 * `undefined` when the option is missing so the health module's own
 * default kicks in.
 */
function parseTimeoutMs(value: string | undefined): number | undefined {
  if (value === undefined) {
    return undefined;
  }
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0) {
    throw new Error(`Invalid --timeout value: '${value}' (must be a positive number of seconds)`);
  }
  return Math.round(n * 1000);
}

/**
 * Register `alexi provider` + its `health` subcommand on the Commander
 * program.
 */
export function registerProviderCommand(program: Command): void {
  const providerCmd = program
    .command('provider')
    .description('Inspect and validate provider configuration');

  providerCmd
    .command('health')
    .description('Validate provider credentials and connectivity')
    .option(
      '-p, --provider <name>',
      `Check a specific provider (one of: ${KNOWN_PROVIDERS.join(', ')})`
    )
    .option('-v, --verbose', 'Show detailed diagnostics (env vars, endpoint, reachability)')
    .option('--json', 'Output structured JSON instead of a human report')
    .option('--skip-network', 'Skip the connectivity probe (validate env vars only)')
    .option('--timeout <seconds>', 'Connectivity probe timeout in seconds (default: 10)')
    .action(async (opts: HealthOptions) => {
      try {
        const timeoutMs = parseTimeoutMs(opts.timeout);
        const checkOptions = {
          timeoutMs,
          skipNetwork: opts.skipNetwork === true,
        };

        let results: HealthResult[];
        if (opts.provider) {
          results = [await checkProviderHealth(opts.provider, checkOptions)];
        } else {
          const configured = listConfiguredProviders();
          results = await checkAllProviderHealth(configured, checkOptions);
        }

        if (opts.json) {
          // Emit JSON with pretty indentation so operators can pipe
          // the result into `jq` without extra flags.
          process.stdout.write(JSON.stringify(results, null, 2) + '\n');
        } else {
          process.stdout.write('\n');
          process.stdout.write(c('cyan', '  Provider Health Check') + '\n\n');
          process.stdout.write(formatHealthReport(results, opts.verbose === true) + '\n\n');
        }

        // Exit non-zero when any provider failed so CI / scripts can
        // branch on the result.
        if (results.some((r) => !r.ok)) {
          process.exitCode = 1;
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        process.stderr.write(c('red', `\n  Error: ${message}\n\n`));
        process.exitCode = 1;
      }
    });
}
