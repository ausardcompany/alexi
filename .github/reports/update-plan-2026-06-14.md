```markdown
# Update Plan for Alexi

Generated: 2026-06-14
Based on upstream commits: d733487..7efade2

## Summary
- Total changes planned: 5
- Critical: 0 | High: 2 | Medium: 2 | Low: 1

## Changes

### 1. Update to Snowflake Cortex Token Handling
**File**: `src/providers/snowflake-cortex.ts`
**Priority**: high
**Type**: feature
**Reason**: To align with upstream changes for token handling, ensuring compatibility with new authentication mechanisms.

**Current code**:
```typescript
const pat = process.env.SNOWFLAKE_CORTEX_PAT ?? evt.options.apiKey;
```

**New code**:
```typescript
const token = process.env.SNOWFLAKE_CORTEX_TOKEN ?? process.env.SNOWFLAKE_CORTEX_PAT ?? evt.options.token ?? evt.options.apiKey;
```

### 2. Add Budget Management to ZenData Model
**File**: `src/core/model.ts`
**Priority**: high
**Type**: feature
**Reason**: To incorporate new budget management features into the existing ZenData model.

**Current code**:
```typescript
export namespace ZenData {
    // existing schema fields
}
```

**New code**:
```typescript
export namespace ZenData {
    // existing schema fields
    budgetMode: z.enum(["always", "fill"]).optional(),
    budgetContribution: z.number().optional(),
    budget: z.number().optional(),
}
```

### 3. Catch Directory Unavailable Error
**File**: `src/core/project/copy.ts`
**Priority**: medium
**Type**: bugfix
**Reason**: To prevent crashes due to unavailable directories during project copy operations.

**Current code**:
```typescript
Effect.forEach(strategies(), (strategy) => strategy.list(sourceDirectory))
```

**New code**:
```typescript
Effect.forEach(strategies(), (strategy) =>
    strategy.list(sourceDirectory).pipe(
        Effect.catchTag("ProjectCopy.DirectoryUnavailableError", () => Effect.succeed([]))
    )
)
```

### 4. MCP Protocol Version Usage in Debug
**File**: `src/cli/mcp.ts`
**Priority**: medium
**Type**: bugfix
**Reason**: To ensure that the correct MCP protocol version is used during debugging.

**Current code**:
```typescript
// existing debug setup
```

**New code**:
```typescript
const protocolVersion = process.env.MCP_PROTOCOL_VERSION || "default";
debugSetup(protocolVersion);
```

### 5. Update Package Versions
**File**: `package.json`
**Priority**: low
**Type**: refactor
**Reason**: To sync version numbers with upstream for consistency.

**Current code**:
```json
"version": "1.17.4"
```

**New code**:
```json
"version": "1.17.6"
```

## Testing Recommendations
- Validate Snowflake Cortex provider functionality with new token handling.
- Test budget management features in ZenData thoroughly.
- Ensure directory errors during project copy do not cause crashes.
- Verify that MCP protocol version is correctly applied in debug sessions.
- Confirm that all package versions are consistent and do not introduce incompatibilities.

## Potential Risks
- Changes in authentication may affect existing integrations; ensure backward compatibility.
- New budget management features may require UI updates; verify UI consistency.
- Directory error handling should be tested extensively to ensure no hidden issues arise.
```
{"prompt_tokens":3479,"completion_tokens":746,"total_tokens":4225}

[Session: eef82700-fd94-4d35-9b30-1f92884426af]
[Messages: 2, Tokens: 4225]
