```markdown
# Update Plan for Alexi

Generated: 2026-07-17
Based on upstream commits: kilocode (a0ffa3ed0..957ddf11b), opencode (1754480..3238daa)

## Summary
- Total changes planned: 3
- Critical: 0 | High: 2 | Medium: 1 | Low: 0

## Changes

### 1. Update `src/core/package.json` Version
**File**: `src/core/package.json`
**Priority**: high
**Type**: feature
**Reason**: Align with upstream version updates to ensure compatibility with new features and fixes.

**Current code**:
```json
{
  "version": "1.18.2"
}
```

**New code**:
```json
{
  "version": "1.18.3"
}
```

### 2. Implement Canonical Path Change Check
**File**: `src/tool/read.ts`
**Priority**: high
**Type**: security
**Reason**: Prevent time-of-check-to-time-of-use (TOCTOU) vulnerabilities by ensuring canonical paths do not change after permission approval.

**Current code**:
```typescript
if (ctx.extra?.["denyDirectory"] === true) {
    return yield* Effect.fail(new Error(`Directory attachments cannot be expanded: ${requested}`))
}
```

**New code**:
```typescript
if (ctx.extra?.["denyDirectory"] === true) {
    const resolved2 = yield* fs.realPath(requested)
    const target2 = process.platform === "win32" ? FSUtil.normalizePath(resolved2) : resolved2
    if (target2 !== target) {
        return yield* Effect.fail(new Error(`Directory attachments cannot be expanded: ${requested}`))
    }
}
```

### 3. Add Cost Multiplier to ZenData Model
**File**: `src/core/model.ts`
**Priority**: medium
**Type**: feature
**Reason**: Support new cost multiplier feature for enhanced model cost calculations.

**Current code**:
```typescript
const ModelSchema = z.object({
    name: z.string(),
    cost: ModelCostSchema,
    cost200K: ModelCostSchema.optional(),
    allowAnonymous: z.boolean().optional(),
    byokProvider: z.enum(["openai", "anthropic", "google"]).optional(),
})
```

**New code**:
```typescript
const ModelSchema = z.object({
    name: z.string(),
    cost: ModelCostSchema,
    costMultiplier: z.number().default(1),
    cost200K: ModelCostSchema.optional(),
    allowAnonymous: z.boolean().optional(),
    byokProvider: z.enum(["openai", "anthropic", "google"]).optional(),
})
```

## Testing Recommendations
- Verify that the version update in `package.json` does not introduce compatibility issues.
- Test directory reading functionality to ensure that canonical path validation prevents TOCTOU vulnerabilities.
- Validate that the cost multiplier is correctly applied in cost calculations in ZenData models.

## Potential Risks
- Version update could potentially introduce hidden dependencies or bugs.
- Canonical path validation might block legitimate file accesses if path resolution logic has errors.
- New cost multiplier might affect existing cost calculation logic if not thoroughly tested.
```
{"prompt_tokens":10141,"completion_tokens":688,"total_tokens":10829,"cache_read_input_tokens":0}

[Session: 5ba7726a-ce6e-43e8-936b-a32e85d505e4]
[Messages: 2, Tokens: 10829]
