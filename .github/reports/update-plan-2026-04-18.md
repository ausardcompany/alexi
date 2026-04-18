# Update Plan for Alexi

Generated: 2026-04-18
Based on upstream commits: kilocode 883f12819..1b4f9cd3d (78 commits)

## Summary
- Total changes planned: 12
- Critical: 1 | High: 4 | Medium: 5 | Low: 2

## Changes

### 1. Add Suggest Tool Permission to Agent System
**File**: `src/agent/index.ts`
**Priority**: critical
**Type**: feature
**Reason**: The suggest tool permission must be properly configured in agent definitions to enable the new code review suggestion feature. Without this, agents cannot use the suggest tool.

**Current code** (if modifying):
```typescript
// In agent permission configuration
{
  "*": "ask",
  ...Object.fromEntries(whitelistedDirs.map((dir) => [dir, "allow"])),
},
question: "deny",
plan_enter: "deny",
plan_exit: "deny",
```

**New code**:
```typescript
// In agent permission configuration
{
  "*": "ask",
  ...Object.fromEntries(whitelistedDirs.map((dir) => [dir, "allow"])),
},
suggest: "deny", // Deny by default for sub-agents
question: "deny",
plan_enter: "deny",
plan_exit: "deny",
```

**Additional change in same file** - Enable suggest for main agents:

**Current code**:
```typescript
Permission.fromConfig({
  question: "allow",
  plan_enter: "allow",
}),
```

**New code**:
```typescript
Permission.fromConfig({
  question: "allow",
  suggest: "allow", // Enable suggest tool for main agents
  plan_enter: "allow",
}),
```

---

### 2. Create Read Directory Tool
**File**: `src/tool/read-directory.ts` (new file)
**Priority**: high
**Type**: feature
**Reason**: New tool to read directory contents with file content aggregation, supporting concurrent file reading with binary detection and truncation handling.

**New code**:
```typescript
import { Effect } from "effect"
import { lstat } from "fs/promises"
import * as path from "path"
import { AppFileSystem } from "../filesystem"
import { Instance } from "../project/instance"
import { isBinaryFile, lines } from "./read"

const LIMIT = 2000
const CONCURRENCY = 8

export type DirectoryFile = {
  filepath: string
  content: string
}

export const readDirectoryFiles = Effect.fn("ReadDirectory.files")(function* (
  fs: AppFileSystem.Interface,
  filepath: string,
  items: string[],
) {
  const entries = yield* fs.readDirectoryEntries(filepath).pipe(Effect.catch(() => Effect.succeed([])))
  const types = new Map(entries.map((entry) => [entry.name, entry.type]))
  const files = yield* Effect.forEach(
    items.filter((item) => !item.endsWith("/") && types.get(item) === "file"),
    Effect.fnUntraced(function* (item) {
      const child = path.join(filepath, item)
      const info = yield* Effect.promise(() => lstat(child)).pipe(Effect.catch(() => Effect.void))
      if (!info?.isFile()) return
      const binary = yield* Effect.promise(() => isBinaryFile(child, info.size)).pipe(
        Effect.catch(() => Effect.succeed(true)),
      )
      if (binary) return
      const file = yield* Effect.promise(() => lines(child, { limit: LIMIT, offset: 1 })).pipe(
        Effect.catch(() => Effect.void),
      )
      if (!file) return
      const rel = path.relative(Instance.directory, child).replaceAll("\\", "/")
      const note = file.cut || file.more ? "\n\n(File truncated)" : ""
      return {
        filepath: child,
        content: `<file_content path="${rel}">\n${file.raw.join("\n")}${note}\n</file_content>`,
      }
    }),
    { concurrency: CONCURRENCY },
  )
  return files.filter((f): f is DirectoryFile => f !== undefined)
})
```

---

### 3. Add Command Metadata to Bash Tool Permission Request
**File**: `src/tool/bash.ts`
**Priority**: high
**Type**: feature
**Reason**: Pass the command string in permission request metadata to enable better UI display and logging of bash commands being authorized.

**Current code**:
```typescript
async function ask(ctx: Tool.Context, scan: Scan) {
  // ... permission request logic
  await ctx.permission({
    permission: "bash",
    patterns: Array.from(scan.patterns),
    always: Array.from(scan.always),
    metadata: {},
  })
}
```

**New code**:
```typescript
async function ask(ctx: Tool.Context, scan: Scan, command: string) {
  // ... permission request logic
  await ctx.permission({
    permission: "bash",
    patterns: Array.from(scan.patterns),
    always: Array.from(scan.always),
    metadata: { command },
  })
}
```

**Also update the call site**:

**Current code**:
```typescript
await ask(ctx, scan)
```

**New code**:
```typescript
await ask(ctx, scan, params.command)
```

---

### 4. Add Suggest Tool Client Filter to Registry
**File**: `src/tool/registry.ts`
**Priority**: high
**Type**: feature
**Reason**: The suggest tool should only be registered for CLI and VSCode clients, not for other client types like web or API.

**Current code** (add new function):
```typescript
export namespace ToolRegistry {
  // existing functions...
}
```

**New code**:
```typescript
import { Flag } from "../flag"

export namespace ToolRegistry {
  // existing functions...

  /** Suggest tool is only registered for cli and vscode clients */
  export function suggest(tool: Tool.Def): Tool.Def[] {
    return ["cli", "vscode"].includes(Flag.CLIENT_TYPE) ? [tool] : []
  }
}
```

---

### 5. Create Suggest Tool Implementation
**File**: `src/tool/suggest.ts` (new file)
**Priority**: high
**Type**: feature
**Reason**: New tool for code review suggestions, enabling the AI to propose code changes that users can accept or dismiss.

**New code**:
```typescript
import { Effect } from "effect"
import { Tool } from "./tool"
import { z } from "zod"

const SuggestParams = z.object({
  title: z.string().describe("Brief title for the suggestion"),
  description: z.string().describe("Detailed description of the suggested change"),
  filepath: z.string().optional().describe("File path the suggestion applies to"),
  diff: z.string().optional().describe("Unified diff format of the suggested change"),
})

export const SuggestTool = Tool.define("suggest", async () => {
  return {
    description: `Propose a code change suggestion for user review. Use this when you want to suggest improvements or fixes that the user can accept or dismiss.`,
    parameters: SuggestParams,
    async call(ctx, params) {
      const suggestion = {
        id: ctx.generateId("suggestion"),
        title: params.title,
        description: params.description,
        filepath: params.filepath,
        diff: params.diff,
        status: "pending" as const,
        createdAt: new Date().toISOString(),
      }

      await ctx.emitSuggestion(suggestion)

      return {
        content: `Suggestion "${params.title}" has been proposed for review.`,
        metadata: { suggestionId: suggestion.id },
      }
    },
  }
})
```

---

### 6. Update Read Tool with Enhanced Line Reading
**File**: `src/tool/read.ts`
**Priority**: medium
**Type**: feature
**Reason**: Export additional utilities for line-based file reading that are needed by the new read-directory tool.

**Current code** (if function exists, update signature):
```typescript
export async function lines(filepath: string, options?: { limit?: number }) {
  // existing implementation
}
```

**New code**:
```typescript
export interface LinesOptions {
  limit?: number
  offset?: number
}

export interface LinesResult {
  raw: string[]
  cut: boolean
  more: boolean
}

export async function lines(filepath: string, options?: LinesOptions): Promise<LinesResult> {
  const limit = options?.limit ?? 1000
  const offset = options?.offset ?? 0
  
  const content = await fs.readFile(filepath, "utf-8")
  const allLines = content.split("\n")
  const startIndex = Math.max(0, offset - 1)
  const endIndex = startIndex + limit
  
  const raw = allLines.slice(startIndex, endIndex)
  const cut = startIndex > 0
  const more = endIndex < allLines.length
  
  return { raw, cut, more }
}

export async function isBinaryFile(filepath: string, size: number): Promise<boolean> {
  if (size === 0) return false
  if (size > 10 * 1024 * 1024) return true // Files > 10MB treated as binary
  
  const buffer = Buffer.alloc(Math.min(8000, size))
  const fd = await fs.open(filepath, "r")
  try {
    await fd.read(buffer, 0, buffer.length, 0)
    // Check for null bytes which indicate binary content
    return buffer.includes(0)
  } finally {
    await fd.close()
  }
}
```

---

### 7. Register Suggest Tool in Tool Registry
**File**: `src/tool/registry.ts`
**Priority**: medium
**Type**: feature
**Reason**: Register the new suggest tool with the tool registry so it becomes available to agents.

**Current code**:
```typescript
import { BashTool } from "./bash"
import { ReadTool } from "./read"
// ... other tool imports

export const builtinTools = [
  BashTool,
  ReadTool,
  // ... other tools
]
```

**New code**:
```typescript
import { BashTool } from "./bash"
import { ReadTool } from "./read"
import { SuggestTool } from "./suggest"
// ... other tool imports

export const builtinTools = [
  BashTool,
  ReadTool,
  ...ToolRegistry.suggest(SuggestTool), // Conditionally include based on client
  // ... other tools
]
```

---

### 8. Add Suggest Permission Type
**File**: `src/permission/types.ts`
**Priority**: medium
**Type**: feature
**Reason**: Add the suggest permission type to the permission system to control access to the suggest tool.

**Current code**:
```typescript
export type PermissionType = 
  | "bash"
  | "read"
  | "write"
  | "question"
  | "plan_enter"
  | "plan_exit"
  // ... other types
```

**New code**:
```typescript
export type PermissionType = 
  | "bash"
  | "read"
  | "write"
  | "question"
  | "suggest"
  | "plan_enter"
  | "plan_exit"
  // ... other types
```

---

### 9. Create Suggest Tool Tests
**File**: `src/tool/suggest.test.ts` (new file)
**Priority**: medium
**Type**: feature
**Reason**: Add comprehensive tests for the new suggest tool functionality.

**New code**:
```typescript
import { describe, it, expect, vi } from "vitest"
import { SuggestTool } from "./suggest"
import { createMockToolContext } from "../test/utils"

describe("SuggestTool", () => {
  it("should create a suggestion with required fields", async () => {
    const ctx = createMockToolContext()
    const tool = await SuggestTool()
    
    const result = await tool.call(ctx, {
      title: "Add error handling",
      description: "Add try-catch block around API call",
    })
    
    expect(result.content).toContain("Add error handling")
    expect(ctx.emitSuggestion).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Add error handling",
        description: "Add try-catch block around API call",
        status: "pending",
      })
    )
  })

  it("should include optional filepath and diff", async () => {
    const ctx = createMockToolContext()
    const tool = await SuggestTool()
    
    await tool.call(ctx, {
      title: "Fix bug",
      description: "Fix null pointer",
      filepath: "src/main.ts",
      diff: "- const x = null\n+ const x = {}",
    })
    
    expect(ctx.emitSuggestion).toHaveBeenCalledWith(
      expect.objectContaining({
        filepath: "src/main.ts",
        diff: "- const x = null\n+ const x = {}",
      })
    )
  })
})
```

---

### 10. Add Registry Filter Tests
**File**: `src/tool/registry.test.ts`
**Priority**: medium
**Type**: feature
**Reason**: Add tests for the new suggest tool client filtering functionality.

**Current code** (add to existing test file):
```typescript
describe("ToolRegistry", () => {
  // existing tests...
})
```

**New code**:
```typescript
import { Flag } from "../flag"

describe("ToolRegistry", () => {
  // existing tests...

  describe("suggest filter", () => {
    it("should include suggest tool for cli client", () => {
      vi.spyOn(Flag, "CLIENT_TYPE", "get").mockReturnValue("cli")
      const mockTool = { name: "suggest" } as Tool.Def
      
      const result = ToolRegistry.suggest(mockTool)
      
      expect(result).toEqual([mockTool])
    })

    it("should include suggest tool for vscode client", () => {
      vi.spyOn(Flag, "CLIENT_TYPE", "get").mockReturnValue("vscode")
      const mockTool = { name: "suggest" } as Tool.Def
      
      const result = ToolRegistry.suggest(mockTool)
      
      expect(result).toEqual([mockTool])
    })

    it("should exclude suggest tool for web client", () => {
      vi.spyOn(Flag, "CLIENT_TYPE", "get").mockReturnValue("web")
      const mockTool = { name: "suggest" } as Tool.Def
      
      const result = ToolRegistry.suggest(mockTool)
      
      expect(result).toEqual([])
    })
  })
})
```

---

### 11. Create Read Directory Tests
**File**: `src/tool/read-directory.test.ts` (new file)
**Priority**: low
**Type**: feature
**Reason**: Add comprehensive tests for the read-directory functionality.

**New code**:
```typescript
import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { Effect } from "effect"
import { readDirectoryFiles } from "./read-directory"
import { createMockFileSystem, createTempDir, cleanupTempDir } from "../test/utils"
import * as fs from "fs/promises"
import * as path from "path"

describe("readDirectoryFiles", () => {
  let tempDir: string

  beforeEach(async () => {
    tempDir = await createTempDir()
  })

  afterEach(async () => {
    await cleanupTempDir(tempDir)
  })

  it("should read text files from directory", async () => {
    await fs.writeFile(path.join(tempDir, "test.ts"), "const x = 1")
    const mockFs = createMockFileSystem(tempDir)
    
    const result = await Effect.runPromise(
      readDirectoryFiles(mockFs, tempDir, ["test.ts"])
    )
    
    expect(result).toHaveLength(1)
    expect(result[0].content).toContain("const x = 1")
  })

  it("should skip binary files", async () => {
    const binaryContent
{"prompt_tokens":13039,"completion_tokens":4096,"total_tokens":17135}

[Session: 519287cf-9a4b-44e8-82a6-76e2c13823c3]
[Messages: 2, Tokens: 17135]
