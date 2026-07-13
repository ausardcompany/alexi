# Factory evals (I5 + I6 + I7)

Regression protection for prompt changes and a cross-family judge gate.

## Why

The factory edits fleet-wide prompts (`baseline-system.md`, `roles/role-*.md`).
A bad edit silently degrades every agent. This directory gives:

- **I5 golden eval + regression gate**: a small, versioned set of canonical
  tasks per role, scored by a judge against a rubric. Runs on any prompt change
  and blocks a merge when the score drops more than a threshold vs the baseline.
- **I6 cross-family judge jury**: the judge(s) must be a DIFFERENT model family
  than the candidate being scored (self-preference bias is a measured 4-8pt
  effect), and load-bearing gates use a panel (>=2 families) with per-criterion
  scoring and randomized order.
- **I7 failure-mined goldens**: escalation issues + failed runs are harvested
  into `goldens/failures.jsonl` so real production failures become regression
  cases.

## Layout

```
evals/
  goldens/
    <role>.jsonl        one golden case per line (see schema below)
    failures.jsonl      auto-harvested from escalations (I7)
  rubric/
    <role>.md           scoring rubric for a role (criteria, 0-1 each)
  run-eval.mjs          compose prompt -> run agent -> judge -> score
  judge.mjs             cross-family LLM-judge jury (I6)
  baseline-scores.json  last-known-good scores per role (regression baseline)
```

## Golden case schema (one JSON object per line in <role>.jsonl)

```json
{
  "id": "consulting-001",
  "task": "Summarize the 3 highest-signal trends from these commits: ...",
  "rubric": ["identifies >=3 distinct trends", "each trend has a source ref", "no hallucinated features"],
  "must_include": ["trend", "source"],
  "must_not_include": ["I cannot", "as an AI"],
  "min_score": 0.7
}
```

- `task` is fed as the concrete task (engine composes baseline+facts+role+task).
- `rubric` items are scored 0-1 by the judge jury; the case score is the mean.
- `must_include` / `must_not_include` are cheap deterministic pre-checks (heuristics
  first, judge second - the 2026 consensus: 100% heuristics + sampled judge).
- `min_score` gates the individual case.

## Regression gate

`run-eval.mjs --role <role>` scores every golden for a role and writes the mean
to `baseline-scores.json`. In CI, if the new mean is more than
`--max-drop` (default 0.05) below the recorded baseline, the job fails and the
PR is blocked. Improvements update the baseline.
