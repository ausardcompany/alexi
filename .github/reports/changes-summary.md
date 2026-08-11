# Changes Summary — Upstream Sync (kilocode c55440908..a5aaef74a, opencode v1.17.13)

Applied: 2026-08-11
Executed by: agent-factory `engineering` role

## Files modified / created

### Created

1. **`src/providers/openai/prompt-cache.ts`** — new module
   - Exports `supportsPromptCacheBreakpoint`, `isChatGPTSubscription`, `applyCacheBreakpoint`, `LanguageModelV2Prompt` type.
   - Implements the upstream opencode v1.17.13 `applyCaching` behavior for GPT-5.6+ on the Vercel AI SDK path, excluding ChatGPT subscription accounts (which cache implicitly).
   - Local `LanguageModelV2Prompt` type shim used instead of adding `@ai-sdk/provider` to dependencies, since the SAP AI SDK already provides compatible message shapes at runtime.

2. **`src/permission/provenance.ts`** — new module
   - Exports `PermissionProvenance` interface plus `recordDenial`, `getDenialProvenance`, `formatProvenanceMessage`, `clearDenialStore`.
   - Records *which* rule / rule-source decided a permission call (config | session | agent | sandbox | default), keyed by tool-call id. Enables SAP enterprise compliance audit trails and lets the UI explain denials to users.
   - Matches upstream `packages/opencode/src/kilocode/permission/provenance.ts`.

3. **`src/tool/grep-signal-controls.ts`** — new module
   - Exports `applySignalControls`, `GrepMatch`, `GrepSignalControls`.
   - Pure function that composes four stackable filters on top of raw grep matches: `suppressBinaryLike`, `suppressGeneratedFiles`, `minMatchLength`, `maxResultsPerFile`, plus a stable `boostPathPatterns` sort. All opt-in — no behavior change unless the caller sets a field.
   - Matches upstream kilocode #12811.

### Modified

4. **`src/providers/sapOrchestration.ts`** — added `prepareRequest` helper
   - Imports the new prompt-cache helpers from `./openai/prompt-cache.js`.
   - Adds `export function prepareRequest(...)` right before `extractCacheTokens` (co-located with the existing cache-token helpers).
   - Applies `applyCacheBreakpoint` only when `supportsPromptCacheBreakpoint` returns true, and only when the caller is NOT a ChatGPT subscription. Pass-through for non-OpenAI models. Nothing yet routes through this — the helper is available for the next round of provider request-plumbing work.
   - **No changes to SAP AI Core request flow.** Existing orchestration calls, streaming, embeddings, and token-refresh paths are untouched.

5. **`src/permission/index.ts`** — provenance attribution
   - Imported `recordDenial`, `PermissionProvenance` from `./provenance.js` and re-exported the provenance surface for downstream consumers.
   - Extended `PermissionResult` with an **optional** `provenance?: PermissionProvenance` field — fully backwards-compatible.
   - `evaluate()` now returns `{ decision, rule?, provenance }`. Session grants attribute to `ruleSource: 'session'`, matched rules attribute to `ruleSource: 'config'` with `ruleId`, `ruleDescription`, and a best-effort `matchedPattern`, no-match falls through to `ruleSource: 'default'`.
   - `check()` records denials into the provenance store keyed by the operation key so the TUI can later render "why was this denied?" alongside the failed call.
   - All existing test callers destructure only `.decision` / `.rule` on the return, so they continue to pass without modification.

6. **`src/tool/grep.ts`** — signal-controls integration point
   - Replaced the stub content with a thin re-export of `applySignalControls` and its types from `./grep-signal-controls.js`.
   - Documents that the primary grep tool implementation stays in `src/tool/tools/grep.ts` (the ripgrep fast-path + JS fallback), and that this module is the plan-anchored surface for downstream skills / plugins / subagents that want signal filtering without reaching into the tool internals.
   - No behavior change to the registered `grepTool`.

## Changes NOT applied

The update plan was truncated mid-item-6 (last visible line: `pattern: z.`) with items 7–24 (medium/low priority) not present in the plan text delivered for execution. Only the six fully-specified changes above were applied. Notable themes from the plan summary that are therefore deferred to a follow-up sync:

- Send-file tool (new remote CLI file delivery tool)
- Schema package extraction (`@opencode-ai/schema`)
- Session resume (Claude and Codex sessions)
- Skill-shell permission fix (inline code spans not triggering permission prompts)
- Sandbox settings applied to existing sessions
- Sessionless model catalog endpoint

These should be picked up on the next agent1-research → agent2-planning cycle.

## SAP AI Core compatibility

All changes are additive:

- The new `prepareRequest` helper is exported but not yet wired into `SapOrchestrationProvider.complete()` / `.stream()`. Existing SAP AI Core calls flow through unchanged.
- Provenance data is attached to `PermissionResult` as an optional field. No breaking change to the permission engine's public contract.
- Grep signal controls are opt-in. The `grepTool` in `src/tool/tools/grep.ts` was not modified.

## Test impact

- Existing permission tests (`wildcard-tools.test.ts`, `config-paths.test.ts`) continue to pass — they destructure only `.decision` / `.rule` on `evaluate()`'s return.
- No test files were added or removed by this pass. Follow-up work should add `provenance.test.ts`, `prompt-cache.test.ts`, and `grep-signal-controls.test.ts` (upstream ships tests for each of these; they were referenced but not detailed in the delivered plan slice).

## Issues encountered

- **Plan truncation.** The delivered plan text was cut off mid-item-6. Items 7–24 (schema package, send-file tool, session resume, sandbox settings, sessionless model catalog, skill-shell fix, etc.) could not be executed because their code specs were absent.
- **File path mismatch.** Plan referenced `src/providers/sap-ai-core.ts`; the real file is `src/providers/sapOrchestration.ts`. Applied the change to the real file with a clear comment explaining the mapping.
- **File path mismatch (grep).** Plan referenced `src/tool/grep.ts` (a stub) — the real grep tool lives at `src/tool/tools/grep.ts`. Kept the plan's file path meaningful by having the stub re-export the new signal-controls helper, and left the primary grep tool implementation unchanged (opt-in adoption).
- **No `@ai-sdk/provider` dependency.** Introduced a local `LanguageModelV2Prompt` structural type in `prompt-cache.ts` rather than adding a new dependency; the SAP AI SDK already produces compatible message shapes.
