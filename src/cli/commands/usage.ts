/**
 * `alexi usage` command — print agent usage aggregated by project.
 *
 * Ports kilocode `88312a65b` + `db5fb2ae1`. The underlying aggregation
 * is in `src/cli/agent-usage.ts` (pure functions over
 * {@link AgentUsageRecord}); this file just wires it onto the
 * Commander program and sources records from the session store.
 *
 * Record source today: `~/.alexi/sessions/<id>/usage.jsonl` when
 * present. Sessions without a usage ledger are silently skipped so
 * the command remains forward-compatible with older sessions.
 */

import fs from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import type { Command } from 'commander';

import { logger } from '../../utils/logger.js';
import { aggregateByProject, formatUsageTable, type AgentUsageRecord } from '../agent-usage.js';

interface UsageOptions {
  project?: string;
  since?: string;
  json?: boolean;
}

/** Resolve the sessions root. Mirrors `src/core/snapshot.ts`. */
function getSessionsDir(): string {
  return path.join(process.env.HOME ?? os.homedir() ?? '~', '.alexi', 'sessions');
}

/**
 * Load every usage record from the session store. Each session may
 * carry a `usage.jsonl` ledger (one record per line); invalid lines
 * are skipped with a `debug` log so a corrupted record never crashes
 * the whole command.
 */
async function loadAllRecords(): Promise<AgentUsageRecord[]> {
  const root = getSessionsDir();
  if (!existsSync(root)) {
    return [];
  }
  const sessions = await fs.readdir(root, { withFileTypes: true });
  const out: AgentUsageRecord[] = [];
  for (const dirent of sessions) {
    if (!dirent.isDirectory()) {
      continue;
    }
    const ledger = path.join(root, dirent.name, 'usage.jsonl');
    if (!existsSync(ledger)) {
      continue;
    }
    let raw: string;
    try {
      raw = await fs.readFile(ledger, 'utf8');
    } catch (err) {
      logger.debug('usage.ledger.read_failed', { session: dirent.name, err: String(err) });
      continue;
    }
    for (const line of raw.split('\n')) {
      const trimmed = line.trim();
      if (trimmed.length === 0) {
        continue;
      }
      try {
        const parsed = JSON.parse(trimmed) as AgentUsageRecord;
        if (
          typeof parsed.sessionId === 'string' &&
          typeof parsed.agent === 'string' &&
          typeof parsed.project === 'string'
        ) {
          out.push(parsed);
        }
      } catch {
        logger.debug('usage.ledger.parse_failed', { session: dirent.name });
      }
    }
  }
  return out;
}

/**
 * Filter records by caller-supplied options. Pure for easy testing.
 */
export function filterRecords(
  records: readonly AgentUsageRecord[],
  opts: UsageOptions
): AgentUsageRecord[] {
  let filtered = records;
  if (opts.project) {
    const needle = opts.project;
    filtered = filtered.filter((r) => r.project === needle);
  }
  if (opts.since) {
    const sinceMs = Date.parse(opts.since);
    if (!Number.isNaN(sinceMs)) {
      filtered = filtered.filter((r) => r.startedAt >= sinceMs);
    }
  }
  return [...filtered];
}

/**
 * Register the `alexi usage` command on the Commander program.
 */
export function registerUsageCommand(program: Command): void {
  program
    .command('usage')
    .description('Show agent usage aggregated by project')
    .option('-p, --project <id>', 'filter to a single project id')
    .option('--since <date>', 'only include records at or after this ISO date')
    .option('--json', 'emit JSON instead of a table')
    .action(async (opts: UsageOptions) => {
      const records = await loadAllRecords();
      const filtered = filterRecords(records, opts);
      const summary = aggregateByProject(filtered);
      if (opts.json) {
        process.stdout.write(JSON.stringify(summary, null, 2) + '\n');
        return;
      }
      process.stdout.write(formatUsageTable(summary) + '\n');
    });
}
