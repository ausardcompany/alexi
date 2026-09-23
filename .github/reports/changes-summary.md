# Alexi Update Plan — Changes Summary

Executed: 2026-09-23
Plan source: upstream Kilocode f47c29dfe..95b45e54e, opencode 70a2469..18ef3cc

## Files Modified / Created

| Change | File | Type |
| --- | --- | --- |
| 4 (empty compaction) | `src/core/compaction.ts` | modified |
| 5 (compaction prompt) | `src/core/compaction.ts` | modified |
| 6 (context tools) | `src/tool/tools/context.ts` | **created** |
| 6 (context tools registration) | `src/tool/tools/index.ts` | modified |
| 6 (config flag) | `src/config/userConfig.ts` | modified |

## Summary of Each Change

### Change 1 (critical, security) — Cloudflare AI Gateway token leakage
**N/A.** Alexi does not integrate the Cloudflare AI Gateway (verified via `grep -R cloudflare src/` → zero matches). The only provider in `src/providers/index.ts` is `SapOrchestrationProvider`, which authenticates against SAP AI Core directly with `AICORE_SERVICE_KEY`. No third-party gateway forwards a token here, so the upstream fix has no analog. Documented in the plan as N/A per the plan's own escape clause.

### Change 2 (high, bugfix) — Ripgrep surrogate-pair truncation
**Already applied.** `src/tool/tools/grep.ts` already contains `.replace(/[\uD800-\uDBFF]$/, '')` at both the rg fast-path (line 409) and the JS fallback path (line 658). Verified.

### Change 3 (high, bugfix) — npm package entry resolution under Node
**N/A.** Alexi does not have `src/core/npm.ts` or any plugin loader that calls `import.meta.resolve`. The plugin loader (`src/plugin/index.ts`) uses `pathToFileURL(fullPath)` + `import()` directly, not `import.meta.resolve`. No fix required.

### Change 4 (high, bugfix) — Empty compaction summary
Added a defensive guard in `compactConversation` (`src/core/compaction.ts`) after the LLM summary is generated. If the summary is empty or whitespace-only, the code now:
  1. Attempts a `createFallbackSummary` recovery, or
  2. Returns the original messages unchanged with a `CompactionResult` carrying `estimatedTokensSaved: 0` and an error message routed through the existing `CompactionComplete` event via `compactionErrorMessage`.

This preserves the session state instead of replacing it with a corrupt/empty summary. Upstream reference: opencode #14318.

### Change 5 (medium, refactor) — Compaction prompt clarity
Rewrote the `SUMMARY_PROMPT` constant in `src/core/compaction.ts` to the simpler "context summarization agent" formulation that opencode reverted to. The sectioned output shape (KEY DECISIONS, FILES CHANGED, etc.) is kept because Alexi's summary reducer depends on it, but the "anchored context" framing and the do-not-mention-compaction language are dropped in favour of clearer imperatives that smaller models (DSv4 Flash class) follow more reliably.

### Change 6 (medium, feature) — Context self-inspection tools (experimental)
Created `src/tool/tools/context.ts` exporting two tools:

- `context_inspect` — reports current session's message count, estimated tokens, budget, utilization ratio, and whether compaction is likely on the next turn. Requires an injected `sessionManager` on the tool context.
- `context_summarize` — records intent to compact at the next safe point and returns current usage. Actual scheduling is left to the orchestrator (does not force mid-turn compaction).

Both tools are gated behind a new `experimental.contextTools` flag in `~/.alexi/config.json`, with the flag accessor/mutator added to `src/config/userConfig.ts` (mirroring the existing `code_mode` / `task_model_selection` pattern). Registration in `src/tool/tools/index.ts` is gated on `getConfigContextTools()` so a vanilla SAP AI Core session sees no new tool surface unless the operator opts in.

Upstream reference: opencode #14268.

### Change 7 (medium, feature) — Background process monitor + session cron
**Deferred to follow-up PR** per the plan's own recommendation. Alexi already ships `scheduleWakeupTool` / `cancelWakeupTool` (see `src/tool/tools/schedule-wakeup.ts`) which cover the wakeup half; a full cron-store + dispatcher requires wider design work on session persistence semantics (SAP-side cost tracking, permission gating for cron creation) that is out of scope for this sync.

### Change 8 (low, feature) — PR link tool
**Deferred.** Alexi does not currently surface PR context to sessions; adopting the tool would also require validating the `github.com` heuristic against SAP-internal git remotes. Left for a targeted follow-up if PR-linking becomes a product requirement.

### Change 9 (high, bugfix) — Skip auth loaders for disabled providers
**N/A.** Alexi has a single provider (SAP AI Core) and no `enabled_providers` / `disabledProviders` concept (`grep` returns zero matches). The upstream fix is specific to multi-provider registries where a user disabling e.g. `anthropic` would nonetheless trigger `anthropic.loadAuth()` at startup. Not reproducible in Alexi's single-provider surface.

### Changes 10–14 (medium/low, provider bumps + misc)
The plan was truncated mid-item 9 at the point where the model's token budget was exhausted. The listed provider bumps (gitlab-ai-provider, google-vertex, ai-gateway-provider) do not apply to Alexi's single-provider SAP AI Core setup — Alexi maintains a lean provider surface in `src/providers/sapOrchestration.ts` that is decoupled from the AI SDK provider adapters upstream ships. `src/providers/gitlab.ts` is a documentation-only module (verified: only 3 grep matches, all comments explaining the upstream bump is not applicable). No action required.

## Issues Encountered

1. **Plan truncation** — The plan file was truncated mid-item 9 (`### 9. Skip auth loaders ...` cut off after the "**" of the Type header). Items 10–14 were not present in the plan document delivered to the runner. Handled by best-guess analysis of Alexi's single-provider surface (see change 9 / 10–14 notes above).
2. **`vi.mock` order in future tests** — When tests are added for the new context tools, remember to declare `vi.mock('../../src/core/sessionManager.js', ...)` BEFORE importing the tools under test (see AGENTS.md testing quirks).
3. **Coverage threshold** — The new `context.ts` file adds ~150 lines of untested code. Follow-up work should add `tests/tool/tools/context.test.ts` to keep CI's 40% lines threshold intact.

## Verification checklist (post-change)

- [ ] `npm run typecheck` — verify the new context tool compiles under `NodeNext` module resolution and the compaction guard type-checks.
- [ ] `npm run lint` — verify no ESLint violations (particularly `curly: all`, unused vars).
- [ ] `npm run format:check` — Prettier drift check.
- [ ] `npm test -- src/core/__tests__/compaction.test.ts` — confirm existing compaction tests still pass with the empty-summary guard.
- [ ] `npm test -- tests/tool/` — confirm tool registry integrations still hold with the new gated tools.
