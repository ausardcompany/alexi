```markdown
# Update Plan for Alexi

Generated: 2026-07-06
Based on upstream commits: b0e41ff, 977a40a, dffecb6, 7f57d2a, 377d5d2, 38bb38e, 3a149ba, 14df88e, e12cb7f, d4f7039, e0ec9be, 2b34df9, 68f225a, e9f5d34, d3459eb, be73f46, f14eafe

## Summary
- Total changes planned: 4
- Critical: 0 | High: 2 | Medium: 2 | Low: 0

## Changes

### 1. Update tool integration tests
**File**: `src/tool/code-mode-integration.test.ts`
**Priority**: high
**Type**: bugfix
**Reason**: Ensure test cases reflect updated schema descriptions and tool definitions to maintain test accuracy.

**Current code**:
```typescript
expect(description).toContain("tools.fixtures.add(input: { a: number; b: number }): Promise<{ sum: number }>")
expect(description).toContain("tools.fixtures.get_text(input: { name: string }): Promise<unknown>")
```

**New code**:
```typescript
expect(description).toContain(
  "tools.fixtures.add(input: {\n  a: number,\n  b: number,\n}): Promise<{\n  sum: number,\n}>",
)
expect(description).toContain("tools.fixtures.get_text(input: {\n  name: string,\n}): Promise<unknown>")
```

### 2. Modify code mode tool description
**File**: `src/tool/code-mode.ts`
**Priority**: high
**Type**: feature
**Reason**: Align tool description with upstream changes to ensure users understand tool capabilities correctly.

**Current code**:
```typescript
const DESCRIPTION = [
  "Execute a JavaScript/TypeScript program that orchestrates the connected MCP tools inside a confined runtime.",
  "The full usage guide and the catalog of available tools follow below.",
].join("\n")
```

**New code**:
```typescript
const DESCRIPTION = "Run a confined orchestration script with access to connected MCP tools."
```

### 3. Update code mode parameters schema
**File**: `src/tool/code-mode.test.ts`
**Priority**: medium
**Type**: refactor
**Reason**: Adjust test expectations to align with the updated parameter schema for tool execution.

**Current code**:
```typescript
await expect(Effect.runPromise(decode({ code: "return 1" }))).resolves.toEqual({ code: "return 1" })
await expect(Effect.runPromise(decode({}))).rejects.toThrow()
```

**New code**:
```typescript
await expect(Effect.runPromise(decode({ code: "return 1" }))).resolves.toEqual({ code: "return 1" })
await expect(Effect.runPromise(decode({}))).rejects.toThrow()
expect(Schema.toJsonSchemaDocument(Parameters).schema).toMatchObject({
  properties: {
    code: {
      description: "Script body executed by the confined interpreter.",
    },
  },
})
```

### 4. Adjust registry tool descriptions
**File**: `src/tool/registry.test.ts`
**Priority**: medium
**Type**: refactor
**Reason**: Ensure registry test descriptions properly format tool signatures to match updated upstream structure.

**Current code**:
```typescript
expect(execute?.description).toContain("tools.weather.current(input: { city: string })")
```

**New code**:
```typescript
expect(execute?.description).toContain("tools.weather.current(input: {\n  city: string,\n})")
```

## Testing Recommendations
- Verify all updated test cases run successfully and reflect correct tool descriptions.
- Ensure no existing functionality is broken by running full test suite.

## Potential Risks
- Changes to tool descriptions might affect user understanding; ensure documentation aligns with code changes.
- Modifications in test expectations could miss edge cases if not thoroughly reviewed.
```
{"prompt_tokens":4663,"completion_tokens":886,"total_tokens":5549,"cache_read_input_tokens":0}

[Session: 3f5f0390-789f-4ec0-98b9-660d6402ab7c]
[Messages: 2, Tokens: 5549]
