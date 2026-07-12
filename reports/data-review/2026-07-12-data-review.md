# Data Review — 2026-07-12

Trigger: `workflow_dispatch` (manual audit). No PR to comment on; committed to `reports/data-review/`.

Scope: `routing-config.json`, `routing-config.example.json`, `src/config/routingConfig.ts`, `src/core/router.ts`, `src/core/costTracker.ts`, `src/core/sessionManager.ts`. Cross-checked against `src/providers/sapOrchestration.ts` and `src/core/aliases.ts` for model-id sprawl.

## Summary

| Area                 | Severity |
| -------------------- | -------- |
| Schema changes       | warn     |
| Cost coverage        | block    |
| Session compatibility| warn     |
| Router safety        | info     |
| Model-id sprawl      | warn     |
| Doc process          | warn     |

Headline: `anthropic--claude-4.7-opus` — the model pinned by every agent workflow and referenced in `.specify/memory/constitution.md` — has no entry in `src/core/costTracker.ts`. Cost tracker's partial-match logic (`costTracker.ts:227`) does NOT match `4.7-opus` against `4.5-opus` (neither string contains the other), so calls fall through to the medium-tier fallback `0.003/0.015 per 1k` at `costTracker.ts:288`. Opus 4.7 should be billed at roughly `0.015/0.075 per 1k` — the fleet is under-reporting Opus input cost by ~5x and output cost by ~5x every time an agent runs.

## Schema changes

- `routing-config.json` and `routing-config.example.json` both parse (`jq -e .` clean).
- Live vs example drift (`warn`):
  - Live renames `claude-3.5-sonnet` -> `anthropic--claude-4.5-sonnet` and `claude-4-sonnet` -> `anthropic--claude-4.5-opus`. Example still ships the legacy short names.
  - Live adds `anthropic--claude-4.5-haiku` (matches `routingConfig.ts:74` default). Example is missing it.
  - Example carries `preferences.routeFailureThreshold: 3` (matches optional field at `routingConfig.ts:35`); live omits it, which is fine (default kicks in at `router.ts:66`).
- No fields have been removed from `RoutingConfig` / `RoutingRule` / `RoutingPreferences` in the current head, so no read-compat break vs on-disk configs. `info`.
- `RoutingDecision` (`router.ts:23`) uses the name `RoutingDecision`, not `RouterDecision` as the role brief references. Not a defect; noting so future callers use the correct type name.

Recommendation: refresh `routing-config.example.json` to mirror the current live SAP model ids and re-add `anthropic--claude-4.5-haiku`. Keep `routeFailureThreshold` documented in the example since it is the only place developers see the knob (`docs/ROUTING.md` is a placeholder — see Recommendations).

## Cost coverage

Model ids present in `routing-config.json`:

- `gpt-4o-mini`, `gpt-4o`, `gpt-4.1` — priced.
- `anthropic--claude-4.5-sonnet`, `anthropic--claude-4.5-haiku`, `anthropic--claude-4.5-opus` — priced.

Every model in the live routing config has explicit pricing. `info`.

Missing from `MODEL_PRICING`, but actively used elsewhere in the codebase (`block`):

- `anthropic--claude-4.7-opus` — used by every agent workflow (`AGENT_MODEL`), by `.specify/memory/constitution.md`, and by tests in `src/core/__tests__/stats.test.ts`, `src/core/__tests__/costTracker.test.ts`, `src/providers/__tests__/deepseek.test.ts`, `src/cli/commands/__tests__/sessions.test.ts`.
- `getPricing('anthropic--claude-4.7-opus')` returns `undefined` (partial matcher at `costTracker.ts:227` requires substring containment either way; `4.5-opus` and `4.7-opus` neither contain the other).
- `calculateCost` then falls through to the medium-tier fallback `(input * 0.003 + output * 0.015) / 1000` (`costTracker.ts:288`).
- Actual SAP AI Core Opus pricing is roughly 5x higher on both sides. Every agent-fleet run is under-billed.

Missing coverage for other models actually reachable via SAP AI Core (from `ORCHESTRATION_MODELS`, `sapOrchestration.ts:1191`) — `warn`:

- `gpt-5`, `gpt-5-mini` — no pricing entries.
- `anthropic--claude-3.7-sonnet` — no pricing entry (present in orchestration list at line 1198).
- `gemini-2.5-flash`, `gemini-2.5-pro` — only the 1.5-series is priced. Partial matcher will not save these (`gemini-1.5-flash` and `gemini-2.5-flash` don't contain each other).
- `amazon--nova-*`, `mistralai--*`, `meta--llama3.1-70b-instruct`, `deepseek-ai--deepseek-r1`, `sap-abap-1` — not priced.

Recommendation: add a pricing entry for `anthropic--claude-4.7-opus` immediately (block-blocker for the fleet), and follow up with entries for the Gemini 2.5 pair and Claude 3.7 sonnet. Verify each against the SAP AI Core deployment dashboard — do NOT paste public Anthropic/OpenAI prices. Reference the deployment id in the commit message.

## Session compatibility

- `Session` shape (`sessionManager.ts:50`) = `{ metadata: SessionMetadata, messages: Message[] }`.
- `SessionMetadata.workdir` (`sessionManager.ts:47`) is `optional` — read code at `sessionManager.ts:236` correctly returns `false` from filter when `workdir === undefined`, preserving compatibility with pre-workdir sessions. `info`.
- `Message.tokens` and `SessionMetadata.title` / `.modelId` are all optional and handled with defaults. `info`.
- No `version` field on the on-disk shape (`warn`). `loadSession` does `JSON.parse(content) as Session` (`sessionManager.ts:116`) and trusts the payload. Any future field rename or type narrowing has no read-side branching to fall back on. Introduce `metadata.version: 1` in `createSession` and have `loadSession` default `version = 1` when absent, so the NEXT change can safely branch on version.
- `closeAndExtract` (`sessionManager.ts:291`) mutates without persisting — after clearing `this.activeSession`, the previously-saved file still holds the pre-extract state. Not a schema issue, but noting for the Session Manager owner: extraction is intentionally in-memory-only.

## Router safety

- `routePrompt` fallback path (`router.ts:356-363`) handles the all-disabled case by returning `preferences.fallbackModel` with confidence 0.1. `gpt-4o` is the default fallback and IS present in `ORCHESTRATION_MODELS` and IS priced. Safe. `info`.
- `RoutingDecision` return branches: force-model (line 311), rule-with-modelId (line 328), all-disabled fallback (line 357), score-based (line 386). Every branch returns a fully-populated `RoutingDecision`. `info`.
- `getRouteFailureThreshold` (`router.ts:65`) reads `preferences.routeFailureThreshold ?? 3`. Live config omits the field; default applies. `info`.
- Route auto-disable state (`router.ts:63`) is in-memory only, cleared by `reloadConfig()` — matches the inline comment contract. `info`.

## Recommendations

Ordered by severity:

1. **block** — Add `anthropic--claude-4.7-opus` to `MODEL_PRICING` in `src/core/costTracker.ts`. Cross-reference the SAP AI Core deployment dashboard (do NOT copy public Anthropic pricing). Same PR should add regression coverage: a test in `src/core/__tests__/costTracker.test.ts` asserting `getPricing('anthropic--claude-4.7-opus')` returns a defined pricing entry with `inputCostPer1k > 0.003` (i.e. NOT the medium-tier fallback). This is priority-0 because it silently corrupts the fleet's cost dashboard on every agent run.
2. **warn** — Refresh `routing-config.example.json` to mirror the live schema: switch `claude-3.5-sonnet` -> `anthropic--claude-4.5-sonnet`, `claude-4-sonnet` -> `anthropic--claude-4.5-opus`, add the `anthropic--claude-4.5-haiku` entry. Keep `routeFailureThreshold` so developers can discover the knob.
3. **warn** — Add pricing entries for the other SAP-reachable models in `ORCHESTRATION_MODELS` (`gpt-5`, `gpt-5-mini`, `anthropic--claude-3.7-sonnet`, `gemini-2.5-*`, `amazon--nova-*`, etc.), OR tighten `calculateCost` to log a warning (once per model id, per process) when it falls through to the medium-tier default. Silent 0.003/0.015 fallback should not be the primary billing signal.
4. **warn** — Introduce a `metadata.version: 1` field on `Session` before the next breaking schema change. `loadSession` should default missing `version` to `1` and branch on it going forward. Cheap to add now, expensive to retrofit after the next rename.
5. **warn** — Model ids appear outside `src/config/`, violating Constitution III as encoded in the role brief. Concrete offenders:
   - `src/core/aliases.ts:39, 244, 245`
   - `src/cli/tui/hooks/useCommands.ts:143, 148, 153`
   - `src/cli/tui/hooks/useKeyboard.ts:31, 36, 41`
   - `src/providers/sapOrchestration.ts:1191-1214` (`ORCHESTRATION_MODELS`)
   Consolidate into a single `src/config/models.ts` export so a model rename is a one-file change. `ORCHESTRATION_MODELS` in particular should live under `src/config/` and be imported by the provider.
6. **warn** — `docs/ROUTING.md` is a 5-line placeholder auto-generated by the documentation workflow ("Manual edits will be overwritten"). The Data DoD requires schema changes to update this doc in the same PR, which is impossible while the file is workflow-managed. Either (a) unpin the file from the docs workflow and hand-author it, or (b) amend the DoD in `.github/prompts/role-data.md` to point at the source-of-truth interfaces in `routingConfig.ts` instead. Current state is a process trap.

## Verification steps run

- `jq -e . routing-config.json` — valid.
- `jq -e . routing-config.example.json` — valid.
- `diff -u routing-config.example.json routing-config.json` — inspected drift.
- Cross-referenced `routing-config.json` model ids against `MODEL_PRICING`.
- Grepped `anthropic--claude-4\.5-|4\.7-opus` across `src/` and `tests/` (39 hits) to trace 4.7-opus usage.
- Read `RoutingConfig` / `Session` / `Message` interfaces in full for optional-field discipline.
- Read `router.ts` end-to-end for fallback branch coverage.

No commits made to source; findings only. Recommendation 1 (Opus 4.7 pricing) is a follow-up implementation task and should be owned by a subsequent `data` role run with `commit_changes: true`.
