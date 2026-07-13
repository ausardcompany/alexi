#!/usr/bin/env node
// judge.mjs - cross-family LLM-judge jury (I6).
//
// Scores a candidate output against a rubric using one or more judge models.
// The judges SHOULD be a different model family than the candidate producer
// (self-preference bias is a measured 4-8 point effect). For load-bearing
// gates use >=2 judges from different families; the jury score is the mean of
// per-judge, per-criterion scores. Order of criteria is randomized per judge to
// reduce position bias.
//
// The judge invokes the agent CLI (`kilo run`) in a constrained "return only
// JSON" mode. Provider/model-agnostic: judge model ids come from the caller.
//
// Usage (programmatic): import { judge } from './judge.mjs'
//   const { score, perCriterion, perJudge } = await judge({
//     output, rubric, judges: ['model-a','model-b'], runAgent });
//
// runAgent(prompt, model) -> Promise<string> is injected so this file has no
// hard dependency on a specific CLI; run-eval.mjs supplies a kilo-based one.

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildJudgePrompt(output, rubric) {
  const criteria = shuffle(rubric.map((r, i) => ({ i, r })));
  const lines = criteria.map((c) => `- [${c.i}] ${c.r}`).join('\n');
  return [
    'You are an impartial evaluator. Score the CANDIDATE OUTPUT against each',
    'CRITERION on a 0.0-1.0 scale (1.0 = fully satisfied, 0.0 = not at all).',
    'Be strict and evidence-based. Do not reward verbosity.',
    '',
    'Return ONLY a compact JSON object mapping each criterion index to its',
    'score, e.g. {"0": 0.8, "1": 1.0, "2": 0.0}. No prose, no markdown.',
    '',
    '## CRITERIA',
    lines,
    '',
    '## CANDIDATE OUTPUT',
    output,
  ].join('\n');
}

function parseScores(raw, n) {
  // Extract the first {...} JSON object from the judge's reply.
  const m = raw.match(/\{[\s\S]*\}/);
  if (!m) return null;
  let obj;
  try {
    obj = JSON.parse(m[0]);
  } catch {
    return null;
  }
  const scores = [];
  for (let i = 0; i < n; i++) {
    const v = Number(obj[String(i)]);
    if (Number.isFinite(v)) scores.push(Math.max(0, Math.min(1, v)));
    else scores.push(0);
  }
  return scores;
}

export async function judge({ output, rubric, judges, runAgent }) {
  const perJudge = [];
  for (const model of judges) {
    const prompt = buildJudgePrompt(output, rubric);
    let raw = '';
    try {
      raw = await runAgent(prompt, model);
    } catch (e) {
      // A judge that errors contributes zeros rather than crashing the gate.
      raw = '';
    }
    const scores = parseScores(raw, rubric.length) || rubric.map(() => 0);
    perJudge.push({ model, scores });
  }
  // Per-criterion = mean across judges; overall = mean across criteria.
  const perCriterion = rubric.map((_, i) => {
    const vals = perJudge.map((j) => j.scores[i]);
    return vals.reduce((a, b) => a + b, 0) / (vals.length || 1);
  });
  const score = perCriterion.reduce((a, b) => a + b, 0) / (perCriterion.length || 1);
  return { score, perCriterion, perJudge };
}

// Cheap deterministic pre-checks (heuristics first, judge second).
export function heuristicChecks(output, gold) {
  const problems = [];
  for (const inc of gold.must_include || []) {
    if (!output.toLowerCase().includes(String(inc).toLowerCase())) {
      problems.push(`missing required substring: "${inc}"`);
    }
  }
  for (const exc of gold.must_not_include || []) {
    if (output.toLowerCase().includes(String(exc).toLowerCase())) {
      problems.push(`contains forbidden substring: "${exc}"`);
    }
  }
  return problems;
}
