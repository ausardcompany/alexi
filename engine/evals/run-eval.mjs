#!/usr/bin/env node
// run-eval.mjs - golden eval + regression gate (I5).
//
// For a role: load its golden cases, compose the same prompt the engine builds
// (baseline + project-facts + role scaffold + overlay + task), run the candidate
// agent, score with heuristics + the cross-family judge jury, and compare the
// mean score to the recorded baseline. Fails (exit 1) if the mean drops by more
// than --max-drop, so a regressing prompt change is blocked before it ships.
//
// Usage:
//   node run-eval.mjs --role consulting \
//     --engine-dir .engine --consumer-dir . \
//     --candidate-model <model> --judges <m1>,<m2> \
//     [--max-drop 0.05] [--update-baseline] [--github-output]
//
// runAgent uses `kilo run` by default; override via --dry-run for a no-LLM
// smoke test (judges/candidate return canned output) so CI wiring can be
// validated without spending tokens.

import { readFileSync, existsSync, writeFileSync, appendFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { argv, env, exit } from 'node:process';
import { judge, heuristicChecks } from './judge.mjs';

function arg(name, def) {
  const i = argv.indexOf(`--${name}`);
  return i >= 0 && argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : def;
}
function flag(name) {
  return argv.includes(`--${name}`);
}
function die(m) {
  console.error(`::error::[eval] ${m}`);
  exit(1);
}

const role = arg('role');
if (!role) die('--role is required');
const engineDir = arg('engine-dir', '.engine');
const consumerDir = arg('consumer-dir', '.');
const candidateModel = arg('candidate-model', '');
const judges = arg('judges', '').split(',').map((s) => s.trim()).filter(Boolean);
const maxDrop = parseFloat(arg('max-drop', '0.05'));
const dryRun = flag('dry-run');
const updateBaseline = flag('update-baseline');
const toGithub = flag('github-output');

const goldenPath = `${engineDir}/evals/goldens/${role}.jsonl`;
if (!existsSync(goldenPath)) {
  console.error(`::warning::[eval] no goldens for role '${role}' at ${goldenPath}; skipping.`);
  exit(0);
}

function read(p) {
  return existsSync(p) ? readFileSync(p, 'utf8') : '';
}

function composePrompt(task) {
  const baseline = read(`${engineDir}/prompts/baseline-system.md`);
  const facts = read(`${consumerDir}/.agent-factory/project-facts.md`);
  const scaffold = read(`${engineDir}/prompts/roles/role-${role}.md`);
  const overlay = read(`${consumerDir}/.agent-factory/roles/${role}.overlay.md`);
  return [
    '# SYSTEM INSTRUCTIONS', '', baseline, '', '---', '',
    '# PROJECT FACTS', '', facts || '(none)', '', '---', '',
    '# ROLE', '', scaffold,
    overlay ? `\n## Project overlay\n\n${overlay}` : '', '', '---', '',
    '# TASK', '', task,
  ].join('\n');
}

function runAgentKilo(prompt, model) {
  if (dryRun) {
    // Canned deterministic output for CI wiring tests (no tokens spent).
    if (model && model.startsWith('__judge')) return '{"0":0.9,"1":0.9,"2":0.9}';
    return 'trend A (source: repo1)\ntrend B (source: repo2)\ntrend C (source: repo3)';
  }
  const out = execFileSync('kilo', ['run', prompt, '--auto', '-m', model], {
    encoding: 'utf8',
    maxBuffer: 32 * 1024 * 1024,
    timeout: 10 * 60 * 1000,
  });
  return out;
}

const goldens = read(goldenPath)
  .split('\n')
  .map((l) => l.trim())
  .filter(Boolean)
  .map((l) => JSON.parse(l));

const results = [];
for (const gold of goldens) {
  const prompt = composePrompt(gold.task);
  let output = '';
  try {
    output = runAgentKilo(prompt, candidateModel || '__candidate');
  } catch (e) {
    output = '';
  }
  const problems = heuristicChecks(output, gold);
  const judgeModels = dryRun ? ['__judge1', '__judge2'] : judges;
  const { score, perCriterion } = await judge({
    output,
    rubric: gold.rubric || [],
    judges: judgeModels.length ? judgeModels : ['__judge1'],
    runAgent: runAgentKilo,
  });
  // Heuristic failures cap the score at 0.5 (a hard-requirement miss).
  const finalScore = problems.length ? Math.min(score, 0.5) : score;
  const passed = finalScore >= (gold.min_score ?? 0.7);
  results.push({ id: gold.id, score: finalScore, passed, problems, perCriterion });
  console.error(`[eval] ${gold.id}: score=${finalScore.toFixed(2)} passed=${passed}${problems.length ? ' problems=' + problems.length : ''}`);
}

const mean = results.reduce((a, r) => a + r.score, 0) / (results.length || 1);
console.error(`[eval] role=${role} mean=${mean.toFixed(3)} cases=${results.length}`);

const baselineFile = `${engineDir}/evals/baseline-scores.json`;
let baseline = {};
try {
  baseline = JSON.parse(read(baselineFile) || '{}');
} catch {
  baseline = {};
}
const prev = baseline[role];

let regressed = false;
if (typeof prev === 'number' && mean < prev - maxDrop) {
  regressed = true;
  console.error(`::error::[eval] regression: role=${role} mean=${mean.toFixed(3)} < baseline ${prev.toFixed(3)} - ${maxDrop}`);
}

if (updateBaseline && !regressed) {
  baseline[role] = Math.max(prev || 0, mean);
  writeFileSync(baselineFile, JSON.stringify(baseline, null, 2) + '\n');
  console.error(`[eval] baseline updated: ${role}=${baseline[role].toFixed(3)}`);
}

if (toGithub && env.GITHUB_OUTPUT) {
  appendFileSync(env.GITHUB_OUTPUT, `mean=${mean.toFixed(3)}\nregressed=${regressed}\n`);
}

// Per-run JSON artifact (feeds the run-over-run heatmap, I9 later).
writeFileSync(`/tmp/eval-${role}.json`, JSON.stringify({ role, mean, results }, null, 2));

exit(regressed ? 1 : 0);
