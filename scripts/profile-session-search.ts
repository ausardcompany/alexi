/**
 * Ad-hoc profiling script for session listing / search performance.
 *
 * Not part of the vitest suite — invoked manually via
 * `npx tsx scripts/profile-session-search.ts` to gather the numbers
 * documented in docs/session-search-performance.md (issues #1606 / #1610).
 *
 * Writes a fresh set of sessions to a temp dir, then measures:
 *   - `listSessions()` cold and warm (eager fs.readdirSync + JSON.parse)
 *   - `searchSessions()` cold and warm (FTS5-indexed)
 *   - JS in-memory substring filter on the eager list
 *   - Resident-set-size delta (approximate heap + native memory cost)
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
  rssDeltaMb: number;
}

const rows: Row[] = [];

/**
 * Measure wall-clock cost and resident-set-size delta of `fn`. RSS is a
 * blunt instrument on Node (GC timing dominates on small allocations),
 * but at CLI scale it is the only "memory footprint" number that maps
 * cleanly onto the `ps aux` measurement the issue asks for.
 *
 * A best-effort `global.gc()` call is issued before sampling when Node
 * is running with `--expose-gc`; otherwise the delta is noisier but
 * still directionally correct.
 */
function measure(label: string, count: number, fn: () => unknown): void {
  const gc = (globalThis as { gc?: () => void }).gc;
  if (typeof gc === 'function') {
    gc();
  }
  const rssBefore = process.memoryUsage().rss;
  const start = process.hrtime.bigint();
  fn();
  const ms = Number(process.hrtime.bigint() - start) / 1_000_000;
  const rssAfter = process.memoryUsage().rss;
  const rssDeltaMb = (rssAfter - rssBefore) / (1024 * 1024);
  rows.push({ label, count, ms, rssDeltaMb });
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

// Scenarios chosen to cover the thresholds called out in issue #1610:
// 50 (grep suffices), 100 (consider lazy), 200 (lazy + incremental),
// 500 / 1000 (stress). 10 is retained as the "typical CLI" baseline.
for (const n of [10, 50, 100, 200, 500, 1000]) {
  runScenario(n);
}

// Emit results as a markdown table for docs.
process.stdout.write('\n| Scenario | Sessions | Time (ms) | RSS delta (MB) |\n');
process.stdout.write('| --- | ---: | ---: | ---: |\n');
for (const r of rows) {
  process.stdout.write(
    `| ${r.label} | ${r.count} | ${r.ms.toFixed(2)} | ${r.rssDeltaMb.toFixed(2)} |\n`
  );
}
