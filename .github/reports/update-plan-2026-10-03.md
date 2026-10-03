# Update Plan for Alexi

Generated: 2026-10-03
Based on upstream commits analyzed:
- kilocode: `17a6a7cd6` - fix(cli): tell the parent a subagent was cancelled by the user
- kilocode: `bf40cc7cb` - fix(cli): register semantic_search from VS Code project consent
- opencode: `108b988` - fix(stats): hide models listed in a secret (stats package - not applicable)
- opencode: docs commits (not applicable)

## Summary
- Total changes planned: 2
- Critical: 0 | High: 1 | Medium: 1 | Low: 0

Note: The majority of the kilocode changes relate to TUI subagent steering, VS Code agent-manager worktree pools, JetBrains plugin, dependabot config, and Nix hashes - none of which apply to Alexi's SAP AI Core-focused architecture. The opencode changes are all in the stats package and web docs, which also don't apply.

Only two upstream changes are directly relevant to Alexi: a bug fix for task cancellation messaging, and a VS Code consent-based tool filtering refactor (adapted to Alexi's context).

## Changes

### 1. Improve task cancellation error message to prevent subagent restart loop

**File**: `src/tool/task.ts`
**Priority**: high
**Type**: bugfix
**Reason**: When a subagent is cancelled, the current generic "Task cancelled" message is often interpreted by models as a transient failure, causing them to immediately spawn a new subagent. The upstream fix clarifies this was a user-initiated cancellation so the parent model treats it as a terminal signal. This directly impacts agent behavior correctness.

**Current code** (locate in `TaskTool` definition where cancellation is handled):
```typescript
if (result?.status === "cancelled") return yield* Effect.fail(new Error("Task cancelled"))
```

**New code**:
```typescript
// kilocode_change start - only an explicit stop/delete cancels a task its parent still awaits;
// without that reason, models treat the result as a failure and start a new subagent right away
if (result?.status === "cancelled") return yield* Effect.fail(new Error("Task cancelled by the user"))
// kilocode_change end
```

**Verification steps**:
1. Confirm the exact line in `src/tool/task.ts`
2. If Alexi doesn't have the cancellation path exactly as shown, adapt the error message in whatever handler emits task cancellation errors
3. Check for any downstream code (tests, UI formatters) that pattern-matches on the exact string `"Task cancelled"`

---

### 2. Guard optional tools behind runtime consent/availability without breaking tool resolution

**File**: `src/tool/registry.ts`
**Priority**: medium
**Type**: refactor
**Reason**: Upstream introduces a pattern for conditionally enabling tools based on runtime signals (VS Code project consent for semantic_search). While Alexi doesn't integrate with VS Code consent, the underlying pattern - lazy import + error-swallowed effect so that optional tool checks never break tool enumeration - is valuable. If Alexi has any environment-conditional tools (e.g., SAP AI Core-gated tools, enterprise feature flags), apply the same pattern.

**Pattern to apply** (only if Alexi has conditional tools; otherwise skip):

**New helper code** to add near top of `registry.ts`:
```typescript
/**
 * Check an optional runtime condition without failing tool resolution.
 * Use lazy imports for modules whose load could fail (circular deps, missing config, etc.)
 * so that tool enumeration remains robust.
 */
function checkOptionalCondition<T>(
  check: () => Promise<T>,
  fallback: T,
  context: string,
): Effect.Effect<T> {
  return Effect.tryPromise(check).pipe(
    Effect.catch((err) =>
      Effect.sync(() => {
        log.warn(`${context} unavailable`, { err })
        return fallback
      }),
    ),
  )
}
```

**Filter pattern** (replace `filter` with `flatMap` when excluding tools that have fallbacks):
```typescript
// Before:
return tools.filter((tool) => {
  if (tool.id === "some_optional_tool") return conditionMet
  return true
})

// After (preserves ability to swap excluded tools for fallbacks):
return tools.flatMap((tool) => {
  if (tool.id === "some_optional_tool") return conditionMet ? [tool] : []
  return [tool]
})
```

**Note**: If Alexi does not currently have conditional tool registration, this change can be deferred. It is only valuable if/when such conditions are introduced. Document the pattern in a code comment for future use.

---

## Skipped Upstream Changes (with reasoning)

| Upstream change | Reason skipped |
|---|---|
| TUI subagent steering (`packages/tui/src/kilocode/*`) | Alexi has no TUI subagent view route |
| TUI double-press Esc interrupt | TUI-specific; Alexi CLI has different interrupt handling |
| VS Code worktree pool refactor (`agent-manager/pool/*`) | Alexi has no VS Code agent-manager |
| JetBrains gradle/wrapper bumps | No JetBrains plugin in Alexi |
| Dependabot workflow changes | Repo-infrastructure, not product code |
| Nix hashes update | Build-system specific |
| Sandbox mutation worker offline fix (`kilo-sandbox`) | Alexi doesn't use kilo-sandbox |
| Stats package hidden models | Alexi has no stats sync service |
| Web docs (Zen) | Marketing site, not applicable |
| `semantic_search` VS Code consent registration | Alexi has no VS Code consent store; semantic_search tool (if present) is configured via SAP AI Core / global config |
| Memory prompt / indexing / session steering under `packages/opencode/src/kilocode/*` | Depends on TUI steering feature not present in Alexi |

## Testing Recommendations

1. **Task cancellation message** (change #1):
   - Start a subagent task, cancel it via the user-facing cancel/stop action, and verify the parent agent does **not** immediately spawn a replacement subagent.
   - Verify any tests asserting on cancellation error strings are updated (`src/tool/task.test.ts` or equivalent).
   - Verify end-to-end flow with SAP AI Core: parent LLM receives `"Task cancelled by the user"` and stops the chain.

2. **Tool registry pattern** (change #2, if applied):
   - Add unit tests for `checkOptionalCondition` verifying it returns the fallback (and logs a warning) when the inner promise rejects.
   - Confirm existing tool enumeration tests still pass with `flatMap` semantics.

3. **Regression smoke tests**:
   - Full subagent spawn → tool call → completion flow
   - Subagent explicit cancellation flow
   - Tool registry build with and without optional conditions

## Potential Risks

- **Error string matching**: If any Alexi code (telemetry, UI, logs, tests) pattern-matches on the exact string `"Task cancelled"`, change #1 will break that match. Grep for `"Task cancelled"` across the codebase before applying.
- **Model behavior shift**: While the new message is intended to stop the restart loop, it is still ultimately interpreted by the model. Monitor SAP AI Core-backed Claude/GPT behavior post-deployment to confirm the restart loop is eliminated.
- **`flatMap` vs `filter`**: If change #2 is applied naively to tool enumeration, ensure every branch returns an array (`[tool]` or `[]`). A branch returning a single `tool` object (not wrapped) would silently insert characters when `flatMap` iterates.
- **No critical security fixes** in this diff window - no urgent patching required.
{"prompt_tokens":12028,"completion_tokens":2732,"total_tokens":14760,"cache_read_input_tokens":0,"cache_creation_input_tokens":0}

[Session: 7ae77d79-5355-4eb0-8ddd-03a6aa692fbd]
[Messages: 2, Tokens: 14760]
