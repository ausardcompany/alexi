```markdown
# Update Plan for Alexi

Generated: 2026-07-28
Based on upstream commits: kilocode (b2735bfbc..a0a760e00), opencode (0b4edfc..1ead8d8)

## Summary
- Total changes planned: 6
- Critical: 1 | High: 3 | Medium: 2 | Low: 0

## Changes

### 1. Implement permission enforcement on unparsed shell commands
**File**: `src/tool/shell-unparsed.ts`
**Priority**: critical
**Type**: security
**Reason**: To ensure all shell commands have permission evaluation, especially those the parser fails to scan.

**New code**:
```typescript
import type { Node } from "web-tree-sitter"

export function unparsed(root: Node, commands: number): string[] {
  if (!root.hasError && commands > 0) return []
  const failed = root
    .descendantsOfType("ERROR")
    .filter((node): node is Node => Boolean(node))
    .filter((node) => node.descendantsOfType("command_name").length > 0)
    .map((node) => node.text.trim())
    .filter((text) => text.length > 0)
  if (failed.length > 0) return failed
  const raw = root.text.trim()
  return raw ? [raw] : []
}
```

### 2. Update shell.ts to include unparsed command handling
**File**: `src/tool/shell.ts`
**Priority**: high
**Type**: security
**Reason**: Integrate the unparsed command handler to ensure commands that fail parsing are evaluated for permissions.

**Current code**:
```typescript
// existing code without unparsed handling
```

**New code**:
```typescript
import { unparsed } from "@/tool/shell-unparsed" // Import unparsed command handler

// logic to handle unparsed commands
const lost = unparsed(root, nodes.length)
if (lost.length > 0) scan.access = "unknown"
for (const pattern of lost) {
  scan.patterns.add(pattern)
}
```

### 3. Refactor code-mode.ts to use updated client SDK for tool invocation
**File**: `src/tool/code-mode.ts`
**Priority**: high
**Type**: refactor
**Reason**: To align with the updated SDK's method of invoking tools, improving maintainability.

**Current code**:
```typescript
const result: CallToolResult = yield* Effect.promise(async () => {
  const raw = await input.entry.tool.client.callTool(
    { name: input.entry.tool.def.name, arguments: input.args },
    CallToolResultSchema,
    // additional options
  )
  // error handling logic
})
```

**New code**:
```typescript
const result: CallToolResult = yield* Effect.promise(() => McpCatalog.callTool(input.entry.tool, input.args, input.ctx.abort))
```

### 4. Update code-mode-integration.test.ts to reflect SDK changes
**File**: `src/tool/code-mode-integration.test.ts`
**Priority**: medium
**Type**: refactor
**Reason**: Ensure test compatibility with the updated SDK's method of tool invocation.

**Current code**:
```typescript
// Test setup and assertions with old SDK methods
```

**New code**:
```typescript
const server = new Server({ name: SERVER, version: "1.0.0" }, { capabilities: { tools: {} } })
server.setRequestHandler("tools/list", async () => ({ tools: TOOL_DEFS }))
server.setRequestHandler("tools/call", async (req) =>
  handleCall(req.params.name, (req.params.arguments ?? {}) as Record<string, unknown>),
)
```

### 5. Implement shell-unparsed.test.ts for regression testing
**File**: `src/tool/shell-unparsed.test.ts`
**Priority**: high
**Type**: testing
**Reason**: To verify handling of unparsed shell commands in various scenarios.

**New code**:
```typescript
import { describe, expect, test } from "bun:test"
import { unparsed } from "@/tool/shell-unparsed"

// Tests for unparsed command handling
describe("Unparsed command handling", () => {
  test("should recover failed command text from ERROR nodes", () => {
    const root = /* setup node with ERROR */;
    const result = unparsed(root, 0);
    expect(result).toEqual(["failed command text"]);
  });
});
```

### 6. Update registry.test.ts for tool system changes
**File**: `src/tool/registry.test.ts`
**Priority**: medium
**Type**: testing
**Reason**: Reflect changes in tool system for accurate testing.

**Current code**:
```typescript
// Test setup with old tool system methods
```

**New code**:
```typescript
// Updated test setup reflecting new tool system changes
```

## Testing Recommendations
- Conduct regression testing to ensure new unparsed command handling does not introduce security vulnerabilities.
- Verify that refactored code-mode.ts correctly interfaces with the updated SDK.
- Ensure all tests pass with the new configurations, including shell-unparsed and registry tests.

## Potential Risks
- Unparsed command handling may introduce unexpected behavior if not correctly implemented.
- Refactoring to align with SDK updates may require additional testing to ensure compatibility with existing integrations.
```
{"prompt_tokens":11096,"completion_tokens":1146,"total_tokens":12242,"cache_read_input_tokens":0}

[Session: c1bb0733-43b4-4fe0-9b82-241cfd52a899]
[Messages: 2, Tokens: 12242]
