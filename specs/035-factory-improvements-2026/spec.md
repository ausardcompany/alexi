# Feature Specification: Agent Factory Improvements (2026 Wave 2)

**Feature Branch**: `035-factory-improvements-2026`
**Created**: 2026-07-13
**Status**: Draft
**Input**: "Research how to improve the factory" -> two independent studies
(web 2026 trends + internal AI-Factory vault) that CONVERGED on the same
top gaps.

## Context

We already ship (Wave 1 + unification): model tiering, transient-only bounded
retry, failure->issue escalation, watchdog timeouts, rebase-retry push,
artifact persistence, git-file + issue inter-agent handoff, and a stack-agnostic
reusable engine (`ausardcompany/agent-factory@v1`) consumed via `uses:`.

Both studies agree the single biggest structural gap is: **the factory changes
fleet-wide prompts (`baseline-system.md`, `role-*.md`) with ZERO automated
regression protection.** A bad baseline edit is a silent fleet-wide outage.
Everything else (self-improvement, judge juries, GEPA) depends on first having
an eval target to score against.

## Prioritized improvements (by impact / effort)

Effort: S = hours (prompt/workflow), M = days (new job + script), L = weeks.

### Wave 2A - foundation (do first; small, compounding)

- **I1. Deterministic verify gate before commit** `[S]`
  The factory must run the project's own gates (lint/typecheck/test from
  `stack:` config) after the agent and REJECT the agent's self-reported success
  unless they pass. Cheapest reliability+cost win: a failing typecheck costs
  cents, an opus review of broken code costs dollars.
  - FR: engine runs `stack.lint`/`stack.test`/`stack.extra` post-agent when
    present; on failure, do not commit, mark run failed, escalate.
  - `stack: none` projects: gate degrades to "artifact was produced + well-formed".

- **I2. Output schema validation on inter-agent handoffs** `[S]`
  Define a strict schema per handoff artifact (research->planning->impl) and
  validate (ajv/zod). Malformed handoff = caught + re-run within budget, not
  silent downstream poisoning.

- **I3. Blast-radius limits per role** `[S]`
  Declarative caps in the engine: `max_diff_lines`, `path_allowlist` /
  `path_denylist` (never touch baseline prompt, workflow YAML, secrets,
  lockfile). Breach -> auto-reject + escalate. Extends `commit_changes` into an
  enforced scope-jail (review roles get NO write tools, not just skip-commit).

- **I4. Prompt caching on the stable baseline+role prefix** `[S-M]`
  Baseline + role scaffold are identical across every run of a role; mark a
  cache breakpoint so they become 0.1x-priced cache reads. Ongoing cost cut on
  the expensive (big/opus) roles with zero quality change. Needs `kilo run` /
  proxy support; if absent, file a CLI request.

### Wave 2B - quality foundation (unlocks self-improvement)

- **I5. Golden eval dataset + regression gate on prompt changes** `[M]`  <-- TOP GAP
  A curated, versioned set of 5-30 diverse canonical tasks per role with
  expected outcomes. Runs on every change to `baseline-system.md` or any
  `role-*.md`; blocks the PR if score drops >5% vs the previous prompt version.
  This is the prerequisite for I6 and I8.
  - Tooling: promptfoo (`promptfoo/promptfoo-action@v1`, before/after PR eval +
    comment + thresholds), or DeepEval pytest `assert_test()`.

- **I6. Cross-family LLM-judge jury as PR-blocking gate** `[M]`
  The `quality` review role must judge with model families DIFFERENT from the
  one that wrote the code (self-preference bias is a measured 4-8 point effect).
  Use a panel (>=2 families), per-criterion separate calls, randomized order,
  calibrated against a small human-labeled set. Turns review from advisory into
  enforceable.
  - Cheap first step: pin the `quality` role tier/model to a different family
    than `engineering` in `factory.config.yml`.

- **I7. Failed-run -> golden test loop** `[S-M]`
  Escalation issues + run logs already exist; feed them into
  `goldens/failures.jsonl` that I5's gate consumes. Escalations become
  regression tests -> the loop closes (GEPA "failure-mined goldens" pattern).

### Wave 2C - feedback loop (needs data from 2B)

- **I8. GEPA reflective prompt self-improvement in agent6** `[M-L]`
  `agent6-prompt-optimizer` (management role) reads failure traces + eval scores
  (natural-language feedback) and evolves `role-*.md` prompts on a Pareto
  frontier. GEPA (ICLR 2026 oral): +14% over MIPROv2, up to 35x fewer rollouts,
  shorter prompts (also cheaper). Output MUST go through a PR + I5 eval gate,
  never auto-merge into baseline.

- **I9. Cost-per-task tracking (OTel gen_ai.* span) + heatmap** `[M]`
  Emit one span per run with `gen_ai.usage.*` + `llm.total_cost_usd` + role +
  task. Export to Langfuse (OTLP). Adds: cost-per-PR, run-over-run quality
  heatmap, tier-ROI proof, "loop burning tokens" detection. Cheap baseline
  first: ~30-line per-run JSON + HTML heatmap uploaded as an artifact, before
  any SaaS.

- **I10. Cost-velocity circuit breaker** `[S-M]`
  Hard per-run and per-day token/cost ceiling; abnormal spend rate -> stop +
  escalate + degrade. Extends the "don't retry non-transient" philosophy to
  cost. Watchdog handles time; this handles spend.

### Wave 2D - scale & DX (larger, later)

- **I11. Long-term memory: lessons-learned notes first, Graphiti only if needed** `[M-L]`
  Layer 1 (do first): a git-committed `LESSONS.md` per role appended after each
  run and read back next run (Anthropic structured note-taking; 80% of value at
  S-M effort, no new infra). Layer 2 (only if retrieval plateaus): Graphiti/Zep
  temporal knowledge graph via MCP (L effort, needs a DB + MCP server).

- **I12. Sandboxed execution + input sanitization** `[M-L]`
  Agent-run code in an ephemeral sandbox (E2B/Daytona/Modal or hardened
  ephemeral runner); tighten `permissions:` to least-privilege per role; treat
  ingested issue/PR text (`task_prompt`) as an untrusted attack surface
  (prompt injection). Semgrep rule flagging untrusted input reaching
  tool/subprocess calls.

- **I13. Parallel sub-agents within a stage (formalized fan-out)** `[M]`
  Formalize the existing matrix-of-3 into a supervisor + summary-only returns.
  Fan out ONLY where subtasks are truly independent (research polling repos,
  independent files); stay single-threaded for coupled work.

- **I14. `npx create-agent-factory` scaffolder with stack auto-detection** `[M]`
  One-command onboarding for new consumers: detect stack, scaffold caller
  workflows + `.agent-factory/` config + tasks, wire `uses: ...@v1`. Highest DX
  lever for a product consumed via `uses:`.

- **I15. Canary model rollout with eval-gated auto-rollback** `[M]`
  When bumping `models.*` in config, run the new model in shadow on the golden
  set (I5); auto-revert if quality dips. "Canary + eval = promotion gate without
  a human."

## Recommended sequencing

1. Wave 2A (I1, I2, I3, I4) - all small, immediate cost/risk reduction.
2. Wave 2B (I5 -> I6, I7) - the quality foundation; I5 is the top gap.
3. Wave 2C (I8, I9, I10) - feedback loop, needs 2B's data.
4. Wave 2D (I11-I15) - scale-out and adoption.

## Success criteria

- SC-1: A prompt change that regresses quality >5% on the golden set is blocked
  before it reaches the fleet (I5).
- SC-2: The `quality` gate uses a different model family than `engineering`
  and can block a PR (I6).
- SC-3: Every factory run emits a cost number; a runaway loop is stopped by
  spend, not only time (I9 + I10).
- SC-4: An escalated failure becomes a golden regression case automatically (I7).
- SC-5: The engine rejects an agent's success claim when project gates fail (I1).

## Sources

Web: arXiv:2410.21819 + EMNLP2025 (judge self-preference); GEPA arXiv:2507.19457
(ICLR 2026 oral) + dspy.GEPA; Anthropic prompt-caching + context-engineering
(Sep 2025); promptfoo-action; OTel GenAI semantic conventions; Langfuse OTel;
getzep/graphiti + Zep arXiv:2501.13956; a2a-protocol.org.
Vault: Projects/Active/AI-Factory/deep-dives/02-Layer-Eval-Engineering.md,
01-Layer-Gateway-FinOps.md; research/00-Research-Enterprise-AI-Factory-2026.md,
02-Exoskeleton-Pattern-Analysis.md; Learning/Articles/Memory-MCP-Server-Agent-
Knowledge-Lifecycle.md; Learning/Articles/Digest-*-2026-0[5-7]-*.md;
Knowledge/AI-ML/Agent-Harness-Pattern.md, OpenAI-Codex-Harness-Engineering.md,
Multi-Agent-Development-From-Ideas-To-Production.md; AI-Run-Mission-2026/notes/
ai-maturity-matrix-rubric.md.
