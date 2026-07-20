```markdown
# Update Plan for Alexi

Generated: 2026-07-20
Based on upstream commits: 084bceada, 1ed3d9b7d, 29149b23a, 79fe75745, 1687d42c4, 5fed729ae, a19b52e

## Summary
- Total changes planned: 2
- Critical: 0 | High: 1 | Medium: 1 | Low: 0

## Changes

### 1. Integrate Heredoc Handling in Shell Tool
**File**: `src/tool/shell-heredoc.ts`
**Priority**: high
**Type**: feature
**Reason**: Enhanced shell command metadata handling for heredoc syntax, improving compatibility with bash shell scripts.

**New code**:
```typescript
import type { ShellID } from "@/tool/shell/id"
import type { Node } from "web-tree-sitter"

export function heredocs(root: Node, kind: ShellID.Kind) {
  if (kind !== "bash") return {}
  return root.descendantsOfType("heredoc_redirect").length > 0 ? { heredoc: true } : {}
}
```

### 2. Update Shell Tool to Use Heredoc Metadata
**File**: `src/tool/shell.ts`
**Priority**: medium
**Type**: feature
**Reason**: Adjust shell tool to incorporate heredoc metadata for better command execution context and permission handling.

**Current code**:
```typescript
// existing shell.ts code
```

**New code**:
```typescript
import { heredocs } from "@/tool/shell-heredoc" // kilocode_change

const ask = Effect.fn("ShellTool.ask")(function* (
  ctx: Tool.Context,
  scan: Scan,
  command: string,
  metadata: ReturnType<typeof heredocs>, // kilocode_change
  description?: string,
) {
  yield* ctx.log("ShellTool.ask", {
    permission: ShellID.ToolID,
    patterns: Array.from(scan.patterns),
    always: Array.from(scan.always),
    metadata: { command: normalizeUrls(command), ...(description ? { description } : {}), ...metadata }, // kilocode_change
  })
})

export const ShellPermission = Effect.gen(function* () {
  yield* Effect.gen(function* () {
    const tree = yield* Effect.acquireRelease(parse(input.command, ps), (tree) => Effect.sync(() => tree.delete()))
    const scan = yield* collect(tree.rootNode, input.cwd, ps, input.shell, instance)
    const metadata = heredocs(tree.rootNode, ShellID.toKind(Shell.name(input.shell))) // kilocode_change
    if (!containsPath(input.cwd, instance)) {
      scan.dirs.add(input.cwd)
      scan.access = "unknown"
    }
    yield* ask(ctx, scan, input.command, metadata, input.description) // kilocode_change
  })
})
```

## Testing Recommendations
- Verify heredoc handling in shell scripts by running test cases that include heredoc syntax.
- Ensure shell tool correctly processes command metadata, including heredoc information.
- Conduct regression tests to ensure no existing functionalities are broken.

## Potential Risks
- If the heredoc detection fails, it may lead to incorrect permission handling for shell commands involving heredocs.
- Changes in shell command metadata could inadvertently affect command execution behavior if not correctly integrated.
```
{"prompt_tokens":3286,"completion_tokens":714,"total_tokens":4000,"cache_read_input_tokens":0}

[Session: 673ebbda-72f7-4185-8283-1211fd05703e]
[Messages: 2, Tokens: 4000]
