#!/usr/bin/env node
// harvest-failures.mjs - I7: turn escalation issues into golden regression cases.
//
// Reads open/closed factory-escalation issues from the consumer repo (via the
// `gh` CLI passed as JSON on stdin), extracts the role + failing task, and
// appends de-duplicated cases to evals/goldens/failures.jsonl so real
// production failures become regression tests the eval gate (I5) will catch.
//
// Usage:
//   gh issue list --repo O/R --label factory-escalation --state all \
//     --json number,title,body --limit 100 | node harvest-failures.mjs \
//     --out engine/evals/goldens/failures.jsonl

import { readFileSync, existsSync, appendFileSync } from 'node:fs';
import { argv } from 'node:process';

function arg(name, def) {
  const i = argv.indexOf(`--${name}`);
  return i >= 0 ? argv[i + 1] : def;
}
const out = arg('out', 'engine/evals/goldens/failures.jsonl');

let raw = '';
process.stdin.on('data', (d) => (raw += d));
process.stdin.on('end', () => {
  let issues = [];
  try {
    issues = JSON.parse(raw || '[]');
  } catch {
    console.error('[harvest] could not parse gh issue JSON');
    process.exit(0);
  }

  // Existing ids to dedupe.
  const existing = new Set();
  if (existsSync(out)) {
    for (const line of readFileSync(out, 'utf8').split('\n')) {
      const t = line.trim();
      if (!t) continue;
      try {
        existing.add(JSON.parse(t).id);
      } catch {
        /* ignore */
      }
    }
  }

  let added = 0;
  for (const it of issues) {
    // Title format: "[factory] <role> agent failed: <title>"
    const m = (it.title || '').match(/^\[factory\]\s+(\S+)\s+agent failed:\s+(.*)$/);
    if (!m) continue;
    const role = m[1];
    const id = `failure-${it.number}`;
    if (existing.has(id)) continue;
    // Use the escalation title/body as a regression probe: the role should be
    // able to handle a task like the one that failed without erroring.
    const gold = {
      id,
      role,
      task: `A previous run of the ${role} role failed on: "${m[2]}". Reproduce the intended output for this task; it must complete without erroring and produce a well-formed result.`,
      rubric: ['produces a non-empty, well-formed result', 'does not error out', 'addresses the stated task'],
      must_not_include: ['I cannot', 'as an AI'],
      min_score: 0.6,
      source_issue: it.number,
    };
    appendFileSync(out, JSON.stringify(gold) + '\n');
    added++;
  }
  console.error(`[harvest] added ${added} failure golden(s) to ${out}`);
});
