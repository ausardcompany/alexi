# Update Plan for Alexi

Generated: 2026-04-16
Based on upstream commits: kilocode ba7b123f0..36c5d9e59 (387 commits)

## Summary
- Total changes planned: 28
- Critical: 3 | High: 10 | Medium: 12 | Low: 3

## Changes

### 1. Add Global Config Directory Whitelisting for Agents
**File**: `src/agent/index.ts`
**Priority**: critical
**Type**: security
**Reason**: Agents need read access to global config directories without prompting, while still protecting them from modification. This prevents agents from being blocked when reading configuration files.

**Current code** (if modifying):
```typescript
const whitelistedDirs = [Truncate.GLOB, ...skillDirs.map((dir) => path.join(dir, "*"))]
```

**New code**:
```typescript
import { Global } from "@/global"
import { AlexiPaths } from "@/alexi/paths" // Create this module if needed

// Include global config dirs so agents can read them without prompting
const whitelistedDirs = [
  Truncate.GLOB,
  ...skillDirs.map((dir) => path.join(dir, "*")),
  path.join(Global.Path.config, "*"),
  ...AlexiPaths.globalDirs().map((dir) => path.join(dir, "*")),
]
```

---

### 2. Fix Config Protection to Allow File Tool Reads
**File**: `src/permission/config-paths.ts`
**Priority**: critical
**Type**: bugfix
**Reason**: File tools should be able to read global config without prompting, but edits must still be protected. The current implementation blocks all external_directory access.

**Current code** (if modifying):
```typescript
export function isRequest(request: {
  permission: string
  patterns: string[]
  metadata?: Record<string, any>
}): boolean {
  if (request.permission === "external_directory") {
    for (const pattern of request.patterns) {
      const dir = pattern.replace(/\/\*$/, "")
      if (isAbsolute(dir)) return true
    }
    return false
  }
  // ...
}
```

**New code**:
```typescript
/**
 * Determine if a permission request targets config files.
 * Gates `edit` permissions and bash-originated `external_directory` requests.
 * File-tool reads are not restricted.
 */
export function isRequest(request: {
  permission: string
  patterns: string[]
  metadata?: Record<string, any>
}): boolean {
  if (request.permission === "external_directory") {
    // File tools include metadata.filepath. They may read global config
    // without prompting, but edits are still protected separately via `edit`.
    if (request.metadata?.filepath) return false
    for (const pattern of request.patterns) {
      const dir = pattern.replace(/\/\*$/, "")
      if (path.isAbsolute(dir) && isAbsolute(dir)) return true
    }
    return false
  }
  // ... rest of function
}
```

---

### 3. Add Event Emission on Permission Config Updates
**File**: `src/permission/routes.ts`
**Priority**: critical
**Type**: bugfix
**Reason**: When permissions are updated via API, clients need to be notified via the event bus to refresh their state. Missing this causes stale UI.

**Current code** (if modifying):
```typescript
await Config.updateGlobal({ permission: { "*": { "*": null } } }, { dispose: false })
await Permission.allowEverything({ enable: false })
return c.json(true)
```

**New code**:
```typescript
import { Bus } from "@/bus"
import { Event } from "../../server/event"

// ... in route handler
await Config.updateGlobal({ permission: { "*": { "*": null } } }, { dispose: false })
await Permission.allowEverything({ enable: false })
await Bus.publish(Event.ConfigUpdated, {})
return c.json(true)

// ... in other permission update handlers
await Config.updateGlobal({ permission: Permission.toConfig(rules) }, { dispose: false })
await Bus.publish(Event.ConfigUpdated, {})
```

---

### 4. Increase GlobalBus Max Listeners
**File**: `src/bus/global.ts`
**Priority**: high
**Type**: bugfix
**Reason**: Prevents memory leak warnings when many SSE listeners accumulate. The default limit is too low for production use.

**Current code** (if modifying):
```typescript
export const GlobalBus = new EventEmitter<{
  // event types...
}>()
```

**New code**:
```typescript
export const GlobalBus = new EventEmitter<{
  // event types...
}>()
GlobalBus.setMaxListeners(50) // Surface warning if SSE listeners accumulate
```

---

### 5. Update Read Tool with Effect-based Architecture
**File**: `src/tool/read.ts`
**Priority**: high
**Type**: refactor
**Reason**: Major refactor of read tool to use Effect pattern, improving error handling and composability. Changes include better file content handling and truncation.

**New code**:
```typescript
import { Effect, pipe } from "effect"
import { Tool } from "./tool"
import { Truncate } from "@/truncate"

export const ReadTool = Tool.define({
  name: "read",
  description: "Read file contents with optional line range",
  parameters: z.object({
    file_path: z.string().describe("Path to the file to read"),
    start_line: z.number().optional().describe("Starting line (1-indexed)"),
    end_line: z.number().optional().describe("Ending line (inclusive)"),
  }),
  
  execute: Effect.fn("ReadTool.execute")(function* (params, ctx) {
    const { file_path, start_line, end_line } = params
    
    // Resolve path relative to workspace
    const absolutePath = yield* ctx.resolvePath(file_path)
    
    // Check file exists and is readable
    const stat = yield* Effect.tryPromise(() => fs.stat(absolutePath))
    
    if (!stat.isFile()) {
      return yield* Effect.fail(new Error(`Not a file: ${file_path}`))
    }
    
    // Read content with optional line range
    const content = yield* Effect.tryPromise(() => 
      fs.readFile(absolutePath, "utf-8")
    )
    
    const lines = content.split("\n")
    const startIdx = (start_line ?? 1) - 1
    const endIdx = end_line ?? lines.length
    
    const selectedLines = lines.slice(startIdx, endIdx)
    const result = selectedLines.join("\n")
    
    // Apply truncation if needed
    const truncated = yield* Truncate.apply(result, {
      maxLength: ctx.maxOutputLength,
      filepath: file_path,
    })
    
    return truncated
  }),
})
```

---

### 6. Update Tool Registry with Kilo-specific Tools
**File**: `src/tool/registry.ts`
**Priority**: high
**Type**: feature
**Reason**: Add support for Alexi-specific tools (CodebaseSearch, Recall) and proper gating for question/plan tools.

**New code**:
```typescript
import { Effect } from "effect"
import { Tool } from "./tool"
import { CodebaseSearchTool } from "./warpgrep"
import { RecallTool } from "./recall"
import { Flag } from "@/flag/flag"
import { ProviderID } from "../provider/schema"
import { Env } from "../env"

export namespace AlexiToolRegistry {
  /** Build Alexi-specific tools as Tool.Def */
  export function build() {
    return Effect.all({
      codebase: Tool.init(CodebaseSearchTool),
      recall: Tool.init(RecallTool),
    })
  }

  /** Override question-tool client gating */
  export function question(): boolean {
    return ["app", "cli", "desktop", "vscode"].includes(Flag.ALEXI_CLIENT) || 
           Flag.ALEXI_ENABLE_QUESTION_TOOL
  }

  /** Plan tool is always registered (gated by agent permission instead) */
  export function plan(): boolean {
    return true
  }

  /** Alexi-specific tools to append to the builtin list */
  export function extra(
    tools: { codebase: Tool.Def; recall: Tool.Def },
    cfg: { experimental?: { codebase_search?: boolean } },
  ): Tool.Def[] {
    return [
      ...(cfg.experimental?.codebase_search === true ? [tools.codebase] : []),
      tools.recall,
    ]
  }

  /** Check whether exa-based tools are enabled for a provider */
  export function exa(providerID: ProviderID): boolean {
    return providerID === ProviderID.alexi || Flag.ALEXI_ENABLE_EXA
  }

  /** Check for E2E LLM URL */
  export function e2e(): boolean {
    return !!Env.get("ALEXI_E2E_LLM_URL")
  }
}
```

---

### 7. Update Task Tool with Effect Pattern
**File**: `src/tool/task.ts`
**Priority**: high
**Type**: refactor
**Reason**: Major refactor of task tool to use Effect pattern. Changes include better subagent handling and state management.

**New code**:
```typescript
import { Effect, pipe } from "effect"
import { Tool } from "./tool"

export const TaskTool = Tool.define({
  name: "task",
  description: "Delegate a task to a subagent",
  parameters: z.object({
    description: z.string().describe("Task description for the subagent"),
    context: z.array(z.string()).optional().describe("Files to include as context"),
  }),
  
  execute: Effect.fn("TaskTool.execute")(function* (params, ctx) {
    const { description, context = [] } = params
    
    // Create subagent session
    const subSession = yield* ctx.createSubSession({
      task: description,
      contextFiles: context,
    })
    
    // Run subagent to completion
    const result = yield* ctx.runSubSession(subSession.id)
    
    // Return subagent's final output
    return {
      sessionId: subSession.id,
      output: result.output,
      filesModified: result.filesModified,
    }
  }),
})
```

---

### 8. Update Bash Tool Error Handling
**File**: `src/tool/bash.ts`
**Priority**: high
**Type**: bugfix
**Reason**: Improved error handling and signal propagation in bash tool execution.

**Current code** (if modifying):
```typescript
// Basic execution without proper signal handling
const result = await exec(command, options)
```

**New code**:
```typescript
import { Effect } from "effect"

export const BashTool = Tool.define({
  name: "bash",
  // ... parameters
  
  execute: Effect.fn("BashTool.execute")(function* (params, ctx) {
    const { command, timeout = 120000 } = params
    
    // Check for abort signal before execution
    if (ctx.signal?.aborted) {
      return yield* Effect.fail(new Error("Execution aborted"))
    }
    
    const result = yield* Effect.tryPromise({
      try: () => exec(command, {
        timeout,
        signal: ctx.signal,
        cwd: ctx.workingDirectory,
      }),
      catch: (error) => {
        if (error.killed) {
          return new Error(`Command timed out after ${timeout}ms`)
        }
        return error
      },
    })
    
    return {
      stdout: result.stdout,
      stderr: result.stderr,
      exitCode: result.exitCode,
    }
  }),
})
```

---

### 9. Update Glob Tool with Improved Pattern Handling
**File**: `src/tool/glob.ts`
**Priority**: high
**Type**: feature
**Reason**: Enhanced glob tool with better pattern validation and absolute path handling.

**New code**:
```typescript
import { Effect } from "effect"
import { glob } from "glob"
import path from "path"

export const GlobTool = Tool.define({
  name: "glob",
  description: "Find files matching a glob pattern",
  parameters: z.object({
    pattern: z.string().describe("Glob pattern to match"),
    cwd: z.string().optional().describe("Working directory for relative patterns"),
  }),
  
  execute: Effect.fn("GlobTool.execute")(function* (params, ctx) {
    const { pattern, cwd } = params
    
    // Validate pattern doesn't escape workspace
    const resolvedCwd = cwd ? path.resolve(ctx.workingDirectory, cwd) : ctx.workingDirectory
    
    if (!resolvedCwd.startsWith(ctx.workingDirectory)) {
      return yield* Effect.fail(new Error("Cannot glob outside workspace"))
    }
    
    // Handle absolute patterns specially
    const isAbsolute = path.isAbsolute(pattern)
    const searchPattern = isAbsolute ? pattern : pattern
    
    const matches = yield* Effect.tryPromise(() => 
      glob(searchPattern, {
        cwd: resolvedCwd,
        nodir: true,
        absolute: false,
      })
    )
    
    // Limit results to prevent overwhelming output
    const maxResults = 1000
    if (matches.length > maxResults) {
      return {
        files: matches.slice(0, maxResults),
        truncated: true,
        total: matches.length,
      }
    }
    
    return {
      files: matches,
      truncated: false,
      total: matches.length,
    }
  }),
})
```

---

### 10. Update Edit Tool with Better Validation
**File**: `src/tool/edit.ts`
**Priority**: high
**Type**: bugfix
**Reason**: Improved edit tool with better diff validation and conflict detection.

**New code**:
```typescript
import { Effect } from "effect"
import { applyPatch, createPatch } from "diff"

export const EditTool = Tool.define({
  name: "edit",
  description: "Edit a file by applying changes",
  parameters: z.object({
    file_path: z.string(),
    old_string: z.string().describe("Exact text to find and replace"),
    new_string: z.string().describe("Text to replace with"),
  }),
  
  execute: Effect.fn("EditTool.execute")(function* (params, ctx) {
    const { file_path, old_string, new_string } = params
    
    const absolutePath = yield* ctx.resolvePath(file_path)
    
    // Read current content
    const content = yield* Effect.tryPromise(() => 
      fs.readFile(absolutePath, "utf-8")
    )
    
    // Verify old_string exists exactly once
    const occurrences = content.split(old_string).length - 1
    
    if (occurrences === 0) {
      return yield* Effect.fail(new Error(
        `Could not find the specified text in ${file_path}. ` +
        `Make sure the old_string matches exactly, including whitespace.`
      ))
    }
    
    if (occurrences > 1) {
      return yield* Effect.fail(new Error(
        `Found ${occurrences} occurrences of the text in ${file_path}. ` +
        `Please provide more context to uniquely identify the location.`
      ))
    }
    
    // Apply the edit
    const newContent = content.replace(old_string, new_string)
    
    yield* Effect.tryPromise(() => 
      fs.writeFile(absolutePath, newContent, "utf-8")
    )
    
    // Generate diff for response
    const diff = createPatch(file_path, content, newContent)
    
    return {
      success: true,
      diff,
    }
  }),
})
```

---

### 11. Update External Directory Permission Handling
**File**: `src/tool/external-directory.
{"prompt_tokens":34405,"completion_tokens":4096,"total_tokens":38501}

[Session: db8ee8b2-5417-42ee-b751-e148ea22b3af]
[Messages: 2, Tokens: 38501]
