# Update Plan Execution Report

**Date**: 2026-08-13
**Plan source**: Upstream changes analysis
- kilocode: `64e5dd036..f71154707` (48 commits)
- opencode: `1f94d8a..cc4b456` (21 commits)

## Files modified

| File | Change type |
|------|-------------|
| `src/tool/warpgrep.ts` | Rewrite → empty placeholder (removal marker) |
| `src/tool/tools/warpgrep.ts` | Rewrite → keeps `isWarpgrepAvailable()` + no-op stub; removes `warpgrepTool` export, proxy fallback, Morph SDK integration |
| `src/tool/tools/index.ts` | Drop `warpgrepTool` import and registration; keep `isWarpgrepAvailable` to drive grep-hint switch |
| `src/tool/tools/grep.ts` | Update description to point at `alexi-mcp-warpgrep` MCP server instead of built-in `codebase_search` |
| `src/tool/tools/glob.ts` | Same doc update as grep.ts |
| `src/core/compaction.ts` | Adopt clearer `SUMMARY_PROMPT` phrasing (opencode) — explicit "do not continue the conversation" clause, structured summary contract |
| `tests/tool/tools/warpgrep.test.ts` | Rewrite to pin the removal contract (must NOT appear in `builtInTools` even when SDK resolves); keep grep-hint assertions |
| `tests/tool/tools/warpgrep-deprecation.test.ts` | Rewrite to assert `warpgrepTool` is not exported and the two remaining helpers still work |

## Change-by-change summary

### 1. Remove built-in `codebase_search` / WarpGrep tool — DONE (high)
- `src/tool/warpgrep.ts`: replaced stale placeholder comment with an explicit removal-notice `export {}` module.
- `src/tool/tools/warpgrep.ts`: stripped the full tool implementation. The module now only exports:
  - `isWarpgrepAvailable(): boolean` — retained so `src/tool/tools/index.ts` can decide whether to append the "install @morphllm/morphsdk" install hint to the `grep` description.
  - `_resetWarpgrepDeprecationWarning(): void` — retained as a no-op for backward test compatibility.
- Removed the Morph API integration, the `kilo-free` API key fallback, and the `https://api.kilo.ai/api/gateway` proxy URL. This is the specific compliance concern called out in the plan.

### 2. Remove `codebase_search` from tool registry — DONE (high, adapted)
The plan's example matched opencode's Effect-based registry, which does not exist in Alexi. The equivalent Alexi surface is `src/tool/tools/index.ts` (the `builtInTools` array + registration loop). Actioned there:
- Dropped `warpgrepTool` from the imports.
- Removed `...(warpgrepAvailable ? [warpgrepTool] : [])` from `builtInTools`.
- Removed `warpgrepTool` from the re-export block.
- `isWarpgrepAvailable` retained as an export so downstream consumers can still gate other UI on SDK availability.

### 3. Remove `codebase_search` permission entries in agent guards — N/A
Alexi's `src/agent/index.ts` uses a Zod-based `AgentConfig` schema with `builtInAgents` list; there are no `askGuard` / `planGuard` functions and no `codebase_search` permission entries. No changes required (grep for `codebase_search` / `askGuard` / `planGuard` in `src/` after the run confirms this).

### 4. Remove `codebase_search` config flag from schema — N/A
Alexi's config (`src/config/*.ts`) uses a different layout (no Effect `Schema.Struct`, no `codebase_search` boolean flag). Nothing to remove.

### 5. Adopt clearer compaction system prompt (opencode) — DONE (medium)
Updated `SUMMARY_PROMPT` in `src/core/compaction.ts` to the new opencode phrasing while preserving Alexi's KEY DECISIONS / FILES CHANGED / USER INSTRUCTIONS extraction structure. Notable adds:
- Explicit "You are a context summarization agent" framing (better for smaller SAP-hosted models).
- Explicit "Do not continue the conversation. Do not respond to any questions." clause — the common failure mode called out in the plan.
- Explicit "Only output the structured summary in the format requested."

All existing keyword-based assertions in `tests/compaction/preservation.test.ts` (`USER INSTRUCTIONS`, `Preserve ALL`, `preferences`, `constraints`, `verbatim`, `coding style`, `API keys`, `endpoints`, `"always do X"`, `"never do Y"`) and in `src/core/__tests__/compaction.test.ts` (`KEY DECISIONS`) continue to pass — the new prompt is a strict superset of the old on all pinned tokens.

### 6. Simplify compaction slice logic (drop char-level split) — N/A
Alexi's `src/core/compaction.ts` uses a message-array `preserveLastN` / `keepStart` walk, NOT the opencode `select()` char-slice pattern. There is no character-boundary splitting to remove.

### 7. Add prior-summary update instructions to compaction — N/A (plan truncated)
The plan text was cut off mid-sentence at item 7 (see the JSON usage stamp in the received plan). The described `SUMMARY_UPDATE_INSTRUCTIONS` addition targets an opencode structure Alexi does not currently mirror, so no faithful port was possible.

## Tests updated

- `tests/tool/tools/warpgrep.test.ts` — flipped the two "when morphsdk is available, register codebase_search" cases into a single "even when morphsdk resolves, the tool is NOT re-registered" case. This pins the removal contract so no future refactor silently re-enables the built-in tool.
- `tests/tool/tools/warpgrep-deprecation.test.ts` — was testing the deprecation warning emitted by the built-in tool. The tool no longer exists, so the warning cannot fire. The test now asserts the removal contract: `warpgrepTool` is not exported, `isWarpgrepAvailable` still works, `_resetWarpgrepDeprecationWarning` remains a callable no-op.

## SAP AI Core compatibility

- No changes to `src/providers/*` — SAP AI Core / SAP Orchestration providers unchanged.
- No changes to routing config, session store, or tool-call transport.
- `stripInternalOptions` and `INTERNAL_OPTION_KEYS` in `src/agent/index.ts` untouched.
- Compaction prompt change affects only the text sent to the summarization LLM; the message-shape contract to SAP AI Core is unchanged.

## Issues encountered

1. **Plan was truncated** mid-way through item 7 (contains a JSON usage stamp — `{"prompt_tokens":16663,...}` — indicating the upstream generator hit a token limit). Items 8+ (referenced by the header count "Total changes planned: 10") were not received. Executed the received 7 items to the extent they apply.

2. **Structural mismatch** between opencode's `Effect.gen`-based tool registry (items 2, 3, 4, 6, 7 in the plan) and Alexi's Zod + module-array layout. Each such item is either adapted to the Alexi equivalent (item 2) or documented as N/A above (items 3, 4, 6). Nothing was silently skipped.

3. **Alexi had already begun this migration.** The built-in tool already emitted a deprecation warning pointing users at `packages/alexi-mcp-warpgrep`. The MCP server package itself already exists and is intact. This execution completes the removal that Alexi's own deprecation notice was announcing.

## Verification checklist

- [x] `src/tool/tools/warpgrep.ts` no longer imports `@morphllm/morphsdk` or references `https://api.kilo.ai/api/gateway`.
- [x] `builtInTools` in `src/tool/tools/index.ts` no longer contains `warpgrepTool` under any code path.
- [x] `grep` tool still surfaces the install hint when `@morphllm/morphsdk` is not installed (behaviour test preserved).
- [x] `SUMMARY_PROMPT` still contains every keyword pinned by existing preservation tests.
- [x] Standalone MCP package `packages/alexi-mcp-warpgrep` untouched — migration target remains available.
