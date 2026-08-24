# Update Plan for Alexi

Generated: 2026-08-24
Based on upstream commits: 4161695, 7bbfe42, f2a1d54, b1ce938, 63a883a, b3bad6b, dd3f915, fa11755, 17b4730, 3d31e4b, 32c3637, 9d466cd, dc13c6b

## Summary
- Total changes planned: 2
- Critical: 0 | High: 0 | Medium: 2 | Low: 0

## Analysis

The upstream changes in this diff report are almost entirely scoped to **opencode's console/zen infrastructure** (SST-hosted cloud service for OpenCode's inference proxy) and **stats/billing normalization**. Specifically:

- **Zen request body streaming/pricing** (`packages/console/app/src/routes/zen/*`) - This is opencode's cloud proxy backend, not part of the Alexi CLI. **Not applicable.**
- **DeepSeek weekend pricing** - Cloud-side pricing logic. **Not applicable.**
- **Workspace unblock action** - Console admin support tooling. **Not applicable.**
- **"always allow ox alpha in go"** - Console/support infra. **Not applicable.**
- **Stats model normalization** (`packages/stats/core/src/domain/model-normalization.ts`) - Lowercases model names for stat aggregation. This may or may not be relevant to Alexi depending on whether Alexi tracks/reports stats.

Alexi is downstream of **kilocode**, which had **zero changes** in this window. The only potentially portable change is the stats model-normalization lowercase fix, and only if Alexi has an equivalent stats module.

## Changes

### 1. Lowercase model names before suffix stripping (stats normalization)
**File**: `src/stats/model-normalization.ts` (or equivalent, if present)
**Priority**: medium
**Type**: bugfix
**Reason**: Upstream fix ensures `GPT-5-Free` normalizes to `gpt-5` (rather than `GPT-5`), so mixed-casing model identifiers from different providers/routers aggregate into a single canonical bucket. Only apply if Alexi has a stats/telemetry normalization utility.

**Current code** (if modifying):
```typescript
export function normalizeInferenceModel(value: string | undefined) {
  return (value || "unknown").replace(/(-free|:free|:global)+$/, "") || "unknown"
}
```

**New code**:
```typescript
export function normalizeInferenceModel(value: string | undefined) {
  return (value || "unknown").toLowerCase().replace(/(-free|:free|:global)+$/, "") || "unknown"
}
```

### 2. Add test case for uppercase model normalization
**File**: `src/stats/model-normalization.test.ts` (or equivalent)
**Priority**: medium
**Type**: bugfix (test coverage)
**Reason**: Guard against regression on the casing fix. Only add if the utility above exists in Alexi.

**New code**:
```typescript
test("normalizes model casing along with router/provider suffixes", () => {
  expect(normalizeInferenceModel("GPT-5-Free")).toBe("gpt-5")
  // ...preserve existing assertions
})
```

## Changes Explicitly NOT Ported

| Upstream Commit | Reason to skip |
|---|---|
| `17b4730` unblock workspace action | Console admin UI/API — not part of Alexi CLI |
| `b1ce938` DeepSeek weekend pricing | Cloud proxy pricing — Alexi uses SAP AI Core, no Zen dependency |
| `32c3637`, `3d31e4b`, `fa11755`, `dd3f915`, `b3bad6b`, `63a883a`, `f2a1d54` Zen request body streaming saga | Cloud proxy internals — no equivalent in Alexi |
| `dc13c6b` reduce zen request memory | Cloud proxy internals — N/A |
| `7bbfe42` always allow ox alpha in go | Support/release tooling — N/A |
| `03bba46`, `ca10088`, `c11c41b`, `bb72277`, `e3bd6e0` generated code | Auto-generated console artifacts — N/A |

## Testing Recommendations

- If change #1 is applied: run existing stats/inference normalization test suite and confirm no aggregation regressions in dashboards/telemetry that key on the previously-cased strings.
- Verify no downstream consumer of `normalizeInferenceModel` in Alexi does a case-sensitive equality check against a mixed-case constant (e.g., `=== "GPT-5"`). If found, update those constants to lowercase.
- Confirm SAP AI Core deployment IDs / model IDs surfaced through this function still round-trip correctly (SAP model naming is typically already lowercase, so risk is low).

## Potential Risks

- **Casing behavior change**: Any code path that stored the normalized model as a display label will now show lowercase (e.g., `gpt-5` instead of `GPT-5`). If Alexi surfaces normalized model names to users, consider adding a separate `displayModel()` helper rather than reusing `normalizeInferenceModel()` for UI.
- **Storage key change**: If normalized values are used as persisted DB keys / cache keys, historical data written with mixed case will not match new lookups. Requires a one-time migration or a fallback lowercased lookup.
- **No other changes**: The bulk of this upstream window is opencode cloud-service work irrelevant to Alexi. Attempting to port Zen streaming/pricing logic would introduce unnecessary coupling and break SAP AI Core integration assumptions.
{"prompt_tokens":3485,"completion_tokens":1953,"total_tokens":5438,"cache_read_input_tokens":0,"cache_creation_input_tokens":0}

[Session: 7a0d803f-a95e-48f6-872f-8dcabfc2108c]
[Messages: 2, Tokens: 5438]
