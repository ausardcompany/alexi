/**
 * `alexi debug config` — dump the effective Alexi configuration with all
 * credentials redacted.
 *
 * Ports opencode commit `82d4c89` (PR #50956,
 * `fix(opencode): redact credentials in debug config`). Prior to this
 * command being introduced, users troubleshooting SAP AI Core / MCP
 * routing issues would paste the raw output of ad-hoc `console.log(config)`
 * calls into GitHub issues, exposing `clientsecret`, `AICORE_SERVICE_KEY`,
 * OAuth tokens, and other credentials. `alexi debug config` provides a
 * safe, always-redacted view they can share instead.
 */

import type { Command } from 'commander';
import { loadFullConfig } from '../../../config/userConfig.js';
import { redact } from './redact.js';

/**
 * Build a snapshot of what would be dumped, with credentials masked. Split
 * out from the CLI action so unit tests can assert on the redacted shape
 * without spawning Commander.
 */
export function buildRedactedConfigSnapshot(): unknown {
  const config = loadFullConfig();
  // Also mirror a filtered slice of process.env — only entries whose KEY
  // matches an alexi-relevant prefix, so we do not leak arbitrary shell
  // secrets. Values are then redacted the same way as config fields.
  const envRelevant: Record<string, string | undefined> = {};
  for (const [k, v] of Object.entries(process.env)) {
    if (/^(AICORE|SAP_PROXY|ALEXI)_/i.test(k)) {
      envRelevant[k] = v;
    }
  }
  return redact({
    config,
    env: envRelevant,
  });
}

export function registerDebugConfigCommand(program: Command): void {
  const debug = program.commands.find((c) => c.name() === 'debug') ?? program.command('debug');
  debug
    .command('config')
    .description('Print the effective Alexi configuration with credentials redacted')
    .action(() => {
      const snapshot = buildRedactedConfigSnapshot();
      // Logger routing goes through utils/logger elsewhere; this command
      // is diagnostic output that must render exactly to stdout so a user
      // can pipe it into a bug report.
      // eslint-disable-next-line no-console
      console.log(JSON.stringify(snapshot, null, 2));
    });
}
