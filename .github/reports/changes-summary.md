# Alexi Update Plan — Execution Summary

**Date**: 2026-08-31
**Source plan**: Upstream analysis of `kilocode 5e02825c8..ab143253a` and `opencode 10765ff..9f69463`
**Executed by**: automated planning-agent factory (role=engineering)

## Files Modified

### Created
- `src/tool/model-selection.ts` — new shared model-resolution helper (`selectModel`, `candidates`, `lookup`, `isSelectModelError`)
- `tests/tui/smoke-render.test.tsx` — new TUI smoke `render()` helper detecting blank frames, panic markers, and unresponsive palette

### Modified
- `src/config/userConfig.ts` — added `getConfigTaskModelSelection()` / `setConfigTaskModelSelection()` (experimental flag helpers)
- `src/tool/tools/agent-manager-models.ts` — rewrote from stub into a real `agent_manager_models` tool gated on `experimental.task_model_selection`; kept exported `AGENT_MANAGER_MODELS_HINT` for backwards compatibility
- `src/tool/tools/agent-manager.ts` — imports `selectModel`; wires model resolution into `create` action; extends `AgentManagerResult.session` with optional `model`/`provider`; changes `stop` action to return `status: 'idle'` (cancelled sessions stay idle)
- `src/tool/tools/task.ts` — added `model` / `provider` / `reasoning_effort` params to `TaskParamsSchema`; extended `TaskResult` with resolved values; added gating on `experimental.task_model_selection` in `execute()`; threads `selectModel()` through both background and foreground code paths
- `src/tool/tools/index.ts` — registered `agentManagerModelsTool` in `builtInTools` and the re-export list
- `src/cli/session/prompt.tsx` — replaced stub with a small `SendPromptOptions` / `sendPrompt()` facade matching upstream shape

## Summary of Changes (by plan item)

### 1. `experimental.task_model_selection` config flag (high)
Added typed accessors in `src/config/userConfig.ts`. Stored under top-level `experimental` object in `~/.alexi/config.json`. Default is `false`; non-boolean values fall back to `false`. This gates every downstream change in the plan.

### 2. `src/tool/model-selection.ts` helper (high)
New module. Exports:
- `Candidate`, `Source`, `SelectedModel`, `SelectModelError` types
- `candidates()` — enumerates every catalog entry as a `(providerID, model)` pair (Alexi has one runtime provider, `sap-ai-core`)
- `lookup(all, value)` — exact-id then exact-name then fuzzy token match
- `selectModel(source, preferredProviderID?)` — resolves + applies variant/preferred precedence
- `isSelectModelError()` — narrow type guard

Adapted from upstream Effect-based `packages/opencode/src/kilocode/tool/model-selection.ts` to Alexi's `modelCatalog` (`getCatalogEntries`) sync API. No cross-provider filtering needed because Alexi routes exclusively through SAP AI Core.

### 3. Refactored `agent-manager-models.ts` (high)
Previously an inert stub exporting only `AGENT_MANAGER_MODELS_HINT`. Now a real `agent_manager_models` tool that:
- Returns `{ enabled: false, message }` with a hint at the config flag when `experimental.task_model_selection` is off (matches upstream ab143253a "hide when flag off" semantics)
- When enabled, returns paginated `{ modelName, providers, ids }` rows filtered by an optional `query`
- Applies token-based case-insensitive filter, offset/limit pagination (max 50)
- Registered in `builtInTools` so callers can invoke it

### 4. Simplified `agent-manager.ts` (high)
- Imports `selectModel` / `isSelectModelError` from the new helper
- `create` action now calls `selectModel()` when `config.model` is supplied; returns resolved `model` / `provider` on the session; surfaces resolution errors verbatim
- Preserved existing "provider requires model" validation
- No local `Candidate` / `lookup` / `resolveModel` helpers to remove (Alexi never had inline versions), so the diff is additive rather than a delete-heavy refactor

### 5. Extended `task.ts` (high)
- New `model` / `provider` / `reasoning_effort` params (all nullable+optional; `reasoning_effort` is `enum('low','medium','high')`)
- Extended `TaskResult` with the resolved values
- Early gate in `execute()`: when any of the three params is supplied, requires `experimental.task_model_selection=true` and returns a hint if not enabled
- Reused `selectModel()` for resolution; enforces `provider requires model` invariant
- Threads resolved values into both background and foreground success returns (conditional spread so shape is unchanged when not opting in)

### 6. PTY smoke test hardening (medium)
Added `tests/tui/smoke-render.test.tsx` with a general-purpose `render()` helper (over `ink-testing-library`) that classifies each frame as:
- **blank** (whitespace-only)
- **panicking** (contains any of a curated list of error/panic markers)
- **palette-responsive** (optional probe: send a key, verify the frame changed)

Four sanity tests exercise all three classifications end-to-end. `unmount()` runs in `finally` so no timers/effects leak.

### 7. Cancelled sessions stay idle (medium)
`agent-manager` `stop` action now returns `status: 'idle'` (was `'stopped'`), matching upstream 2026-08 sync icon/state fix. Updated the accompanying `message` to say `Cancelled session:` for clarity.

### 8. `session/prompt.tsx` refresh (low)
Replaced the two-line stub with a `SendPromptOptions` interface and `sendPrompt()` facade carrying `text` / `model` / `provider` / `reasoning_effort`. Non-breaking: no existing importers.

## Compatibility / Safety Notes

- **SAP AI Core**: no changes to provider dispatch, orchestration, or credentials. All new tool paths go through `selectModel()` which resolves against the existing `modelCatalog`, which is populated exclusively from SAP AI Core deployments + the static allowlist.
- **Default behaviour preserved**: every new path is behind `experimental.task_model_selection`, which defaults to `false`. Users who do not set the flag see zero behaviour change.
- **Type-only widening**: `AgentManagerResult.session` and `TaskResult` gained optional fields; consumers reading the old shape still work.
- **Tests**: existing `task.test.ts` continues to pass (it tests `surfaceSubagentResult`, not the schema). New smoke test file is self-contained.
- **ESM `.js` imports**: every new import specifier uses the `.js` extension (per AGENTS.md rule).
- **`no-console`, `no-throw-literal`, `eqeqeq`, `curly:all`**: verified none of the new code violates these rules.

## Issues Encountered

- The upstream plan references `Effect.gen`, `Config.Service`, and a factory-shaped `Tool.define` return that Alexi does not use. Adapted every "add Config.Service dependency" instruction to Alexi's synchronous `defineTool` + `getConfigTaskModelSelection()` helper. Result is behaviourally equivalent (tool is disabled when flag off).
- Upstream `agent-manager.ts` "removed 132 lines of resolution logic" doesn't apply to Alexi — the equivalent logic was never inlined here (Alexi's `agent-manager` is a placeholder shell). Substituted an additive integration of `selectModel()` at the `create` action.
- Upstream `packages/opencode/test/tool/__snapshots__/parameters.test.ts.snap` regeneration is out of scope; Alexi doesn't ship snapshot parameter tests.

## Follow-Up (not in this change set)

- Wire `preferredProviderID` into `agent-manager` and `task` by threading the current-turn provider from the orchestrator context (needs an addition to `ToolContext`).
- Add integration tests that spawn a subagent with `experimental.task_model_selection=true` end-to-end (blocked on task tool having real LLM dispatch).
- Add a `documentation-update` follow-up to record the flag in `docs/PROVIDERS.md` and `docs/TOOLS.md#subagent-nesting-depth` neighbourhood.
