/**
 * Ad-hoc profiling script for session listing / search performance.
 *
 * Not part of the vitest suite — invoked manually via
 * `npx tsx scripts/profile-session-search.ts` to gather the numbers
 * documented in docs/session-search-performance.md (issue #1606).
 *
 * Writes a fresh set of sessions to a temp dir, then measures:
 *   - `listSessions()` cold and warm (eager fs.readdirSync + JSON.parse)
 *   - `searchSessions()` cold and warm (FTS5-indexed)
 *   - JS in-memory substring filter on the eager list
 *
 * The script deletes its temp dir on exit so re-runs are idempotent.
 */

import fs from 'fs';
import os from 'os';
import path from 'path';
import { SessionManager } from '../src/core/sessionManager.js';

interface Row {
  label: string;
  count: number;
  ms: number;
}

const rows: Row[] = [];

function measure(label: string, count: number, fn: () => unknown): void {
  const start = process.hrtime.bigint();
  fn();
  const ms = Number(process.hrtime.bigint() - start) / 1_000_000;
  rows.push({ label, count, ms });
}

function seed(dir: string, n: number): void {
  const titleWords = ['api', 'refactor', 'auth', 'llm', 'router', 'plan', 'test', 'debug'];
  for (let i = 0; i < n; i++) {
    const id = `perf-${i.toString().padStart(4, '0')}`;
    const title = `${titleWords[i % titleWords.length]} ${titleWords[(i + 3) % titleWords.length]} session ${i}`;
    const messages = [
      {
        role: 'user' as const,
        content: `Please help me with ${titleWords[i % titleWords.length]} work item number ${i}. This is a longer message body that simulates typical session content.`,
        timestamp: Date.now() - i * 1000,
      },
      {
        role: 'assistant' as const,
        content: `Sure, I'll help with the ${titleWords[(i + 3) % titleWords.length]} refactor. Here is a plan with several steps and code samples.`,
        timestamp: Date.now() - i * 1000 + 500,
      },
    ];
    const session = {
      metadata: {
        id,
        created: Date.now() - i * 1000,
        updated: Date.now() - i * 1000,
        modelId: 'sap-ai-core/anthropic--claude-4.7-opus',
        totalTokens: 200,
        messageCount: 2,
        title,
        workdir: dir,
      },
      messages,
    };
    fs.writeFileSync(path.join(dir, `${id}.json`), JSON.stringify(session, null, 2));
  }
}

function runScenario(n: number): void {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), `perf-sessions-${n}-`));
  try {
    seed(tempDir, n);

    // Cold: fresh SessionManager, no FTS index yet on disk
    const mgrCold = new SessionManager({ sessionsDir: tempDir });
    measure('listSessions (cold)', n, () => mgrCold.listSessions());
    measure('listSessions + JS substring (cold)', n, () => {
      const all = mgrCold.listSessions();
      all.filter((s) => (s.title ?? '').toLowerCase().includes('api'));
    });
    measure('searchSessions "api" (cold, builds FTS index)', n, () =>
      mgrCold.searchSessions('api')
    );

    // Warm: same manager, indexes already built
    const mgrWarm = new SessionManager({ sessionsDir: tempDir });
    // Force one warmup pass so the FTS SQLite handle is opened
    mgrWarm.searchSessions('warmup');
    measure('listSessions (warm)', n, () => mgrWarm.listSessions());
    measure('searchSessions "api" (warm)', n, () => mgrWarm.searchSessions('api'));
    measure('searchSessions "refactor" (warm)', n, () => mgrWarm.searchSessions('refactor'));
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
}

for (const n of [10, 50, 100, 500, 1000]) {
  runScenario(n);
}

// Emit results as a markdown table for docs.
process.stdout.write('\n| Scenario | Sessions | Time (ms) |\n');
process.stdout.write('| --- | ---: | ---: |\n');
for (const r of rows) {
  process.stdout.write(`| ${r.label} | ${r.count} | ${r.ms.toFixed(2)} |\n`);
}
