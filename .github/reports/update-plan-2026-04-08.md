# Update Plan for Alexi

Generated: 2026-04-08
Based on upstream commits: kilocode (d10d25a4..1a5be52c), opencode (3c96bf8..ae614d9)

## Summary
- Total changes planned: 18
- Critical: 2 | High: 5 | Medium: 8 | Low: 3

## Changes

### 1. Refactor Tool Registry to Remove Agent Context from Initialization
**File**: `src/tool/registry.ts`
**Priority**: critical
**Type**: refactor
**Reason**: Major architectural change in opencode (#21052) removes agent context from tool initialization, making tools more decoupled and testable. This is a breaking change that affects all tool definitions.

**Current code**:
```typescript
export interface ToolDefinition<T = unknown> {
  name: string
  description: string
  parameters: z.ZodSchema<T>
  execute: (params: T, context: AgentContext) => Promise<ToolResult>
}

export class ToolRegistry {
  private tools: Map<string, ToolDefinition> = new Map()
  
  register<T>(tool: ToolDefinition<T>, agentContext: AgentContext): void {
    this.tools.set(tool.name, tool)
  }
  
  async execute(name: string, params: unknown, context: AgentContext): Promise<ToolResult> {
    const tool = this.tools.get(name)
    if (!tool) throw new Error(`Tool ${name} not found`)
    return tool.execute(params, context)
  }
}
```

**New code**:
```typescript
export interface ToolContext {
  cwd: string
  signal?: AbortSignal
  sessionId?: string
  messageId?: string
}

export interface ToolDefinition<T = unknown> {
  name: string
  description: string
  parameters: z.ZodSchema<T>
  execute: (params: T, context: ToolContext) => Promise<ToolResult>
}

export class ToolRegistry {
  private tools: Map<string, ToolDefinition> = new Map()
  private toolContext: ToolContext
  
  constructor(context: ToolContext) {
    this.toolContext = context
  }
  
  register<T>(tool: ToolDefinition<T>): void {
    this.tools.set(tool.name, tool)
  }
  
  updateContext(context: Partial<ToolContext>): void {
    this.toolContext = { ...this.toolContext, ...context }
  }
  
  async execute(name: string, params: unknown): Promise<ToolResult> {
    const tool = this.tools.get(name)
    if (!tool) throw new Error(`Tool ${name} not found`)
    return tool.execute(params, this.toolContext)
  }
  
  getTools(): ToolDefinition[] {
    return Array.from(this.tools.values())
  }
}
```

### 2. Remove Batch Tool (Deprecated)
**File**: `src/tool/batch.ts`
**Priority**: critical
**Type**: refactor
**Reason**: The batch tool has been completely removed in opencode (-183 lines). This simplifies the tool system and removes unused functionality.

**Current code**:
```typescript
// src/tool/batch.ts - entire file
export const batchTool: ToolDefinition<BatchParams> = {
  name: "batch",
  description: "Execute multiple tools in sequence",
  // ... full implementation
}
```

**New code**:
```typescript
// DELETE THIS FILE ENTIRELY
// The batch functionality should be handled at the orchestration layer, not as a tool
```

### 3. Update Bash Tool with Improved Context Handling
**File**: `src/tool/bash.ts`
**Priority**: high
**Type**: refactor
**Reason**: Bash tool refactored to use new ToolContext instead of AgentContext, with improved signal handling for cancellation.

**Current code**:
```typescript
export const bashTool: ToolDefinition<BashParams> = {
  name: "bash",
  description: "Execute bash commands",
  parameters: bashParamsSchema,
  execute: async (params: BashParams, context: AgentContext) => {
    const { command, timeout = 30000 } = params
    const result = await execAsync(command, {
      cwd: context.workingDirectory,
      timeout,
    })
    return { success: true, output: result.stdout }
  }
}
```

**New code**:
```typescript
import { spawn } from "child_process"

export const bashTool: ToolDefinition<BashParams> = {
  name: "bash",
  description: "Execute bash commands",
  parameters: bashParamsSchema,
  execute: async (params: BashParams, context: ToolContext) => {
    const { command, timeout = 30000 } = params
    
    return new Promise((resolve, reject) => {
      const proc = spawn("bash", ["-c", command], {
        cwd: context.cwd,
        env: process.env,
      })
      
      let stdout = ""
      let stderr = ""
      
      const timeoutId = setTimeout(() => {
        proc.kill("SIGTERM")
        reject(new Error(`Command timed out after ${timeout}ms`))
      }, timeout)
      
      // Handle abort signal
      if (context.signal) {
        context.signal.addEventListener("abort", () => {
          proc.kill("SIGTERM")
          clearTimeout(timeoutId)
          reject(new Error("Command aborted"))
        })
      }
      
      proc.stdout.on("data", (data) => { stdout += data })
      proc.stderr.on("data", (data) => { stderr += data })
      
      proc.on("close", (code) => {
        clearTimeout(timeoutId)
        resolve({
          success: code === 0,
          output: stdout,
          error: stderr || undefined,
          exitCode: code,
        })
      })
    })
  }
}
```

### 4. Update WebFetch Tool with Timeout Cleanup
**File**: `src/tool/webfetch.ts`
**Priority**: high
**Type**: bugfix
**Reason**: Fix from opencode (#21378) - clear webfetch timeouts on failed fetches to prevent memory leaks.

**Current code**:
```typescript
export const webfetchTool: ToolDefinition<WebFetchParams> = {
  name: "webfetch",
  description: "Fetch content from a URL",
  parameters: webfetchParamsSchema,
  execute: async (params: WebFetchParams, context: ToolContext) => {
    const { url, timeout = 10000 } = params
    
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)
    
    const response = await fetch(url, { signal: controller.signal })
    const content = await response.text()
    
    return { success: true, content, status: response.status }
  }
}
```

**New code**:
```typescript
export const webfetchTool: ToolDefinition<WebFetchParams> = {
  name: "webfetch",
  description: "Fetch content from a URL",
  parameters: webfetchParamsSchema,
  execute: async (params: WebFetchParams, context: ToolContext) => {
    const { url, timeout = 10000 } = params
    
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)
    
    try {
      const response = await fetch(url, { signal: controller.signal })
      clearTimeout(timeoutId)
      const content = await response.text()
      return { success: true, content, status: response.status }
    } catch (error) {
      clearTimeout(timeoutId) // Always clear timeout on failure
      if (error instanceof Error && error.name === "AbortError") {
        return { success: false, error: `Request timed out after ${timeout}ms` }
      }
      throw error
    }
  }
}
```

### 5. Update WebSearch Tool with Improved Error Handling
**File**: `src/tool/websearch.ts`
**Priority**: medium
**Type**: refactor
**Reason**: WebSearch tool updated with better context handling and error recovery patterns.

**Current code**:
```typescript
export const websearchTool: ToolDefinition<WebSearchParams> = {
  name: "websearch",
  description: "Search the web for information",
  parameters: websearchParamsSchema,
  execute: async (params: WebSearchParams, context: AgentContext) => {
    const { query, maxResults = 5 } = params
    const results = await searchProvider.search(query, maxResults)
    return { success: true, results }
  }
}
```

**New code**:
```typescript
export const websearchTool: ToolDefinition<WebSearchParams> = {
  name: "websearch",
  description: "Search the web for information",
  parameters: websearchParamsSchema,
  execute: async (params: WebSearchParams, context: ToolContext) => {
    const { query, maxResults = 5, searchEngine = "default" } = params
    
    try {
      const results = await searchProvider.search(query, {
        maxResults,
        engine: searchEngine,
        signal: context.signal,
      })
      
      return {
        success: true,
        results: results.map(r => ({
          title: r.title,
          url: r.url,
          snippet: r.snippet,
        })),
        totalResults: results.length,
      }
    } catch (error) {
      if (context.signal?.aborted) {
        return { success: false, error: "Search aborted" }
      }
      return {
        success: false,
        error: error instanceof Error ? error.message : "Search failed",
      }
    }
  }
}
```

### 6. Update Apply Patch Tool
**File**: `src/tool/apply_patch.ts`
**Priority**: high
**Type**: refactor
**Reason**: Simplified interface removing agent context dependency.

**Current code**:
```typescript
export const applyPatchTool: ToolDefinition<ApplyPatchParams> = {
  name: "apply_patch",
  description: "Apply a unified diff patch to a file",
  parameters: applyPatchParamsSchema,
  execute: async (params: ApplyPatchParams, context: AgentContext) => {
    const { filePath, patch } = params
    const fullPath = path.resolve(context.workingDirectory, filePath)
    // ... implementation
  }
}
```

**New code**:
```typescript
export const applyPatchTool: ToolDefinition<ApplyPatchParams> = {
  name: "apply_patch",
  description: "Apply a unified diff patch to a file",
  parameters: applyPatchParamsSchema,
  execute: async (params: ApplyPatchParams, context: ToolContext) => {
    const { filePath, patch } = params
    const fullPath = path.resolve(context.cwd, filePath)
    
    if (!fullPath.startsWith(context.cwd)) {
      return { success: false, error: "Path traversal not allowed" }
    }
    
    try {
      const original = await fs.readFile(fullPath, "utf-8")
      const patched = applyUnifiedDiff(original, patch)
      await fs.writeFile(fullPath, patched)
      return { success: true, filePath: fullPath }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to apply patch",
      }
    }
  }
}
```

### 7. Update Edit Tool
**File**: `src/tool/edit.ts`
**Priority**: medium
**Type**: refactor
**Reason**: Update to use new ToolContext interface.

**Current code**:
```typescript
execute: async (params: EditParams, context: AgentContext) => {
  const fullPath = path.resolve(context.workingDirectory, params.filePath)
```

**New code**:
```typescript
execute: async (params: EditParams, context: ToolContext) => {
  const fullPath = path.resolve(context.cwd, params.filePath)
```

### 8. Update Question Tool
**File**: `src/tool/question.ts`
**Priority**: low
**Type**: refactor
**Reason**: Minor update for context interface consistency.

**Current code**:
```typescript
execute: async (params: QuestionParams, context: AgentContext) => {
```

**New code**:
```typescript
execute: async (params: QuestionParams, context: ToolContext) => {
```

### 9. Update Skill Tool with Improved Registration
**File**: `src/tool/skill.ts`
**Priority**: medium
**Type**: refactor
**Reason**: Skill tool updated with better dynamic tool registration patterns.

**Current code**:
```typescript
export class SkillManager {
  private skills: Map<string, Skill> = new Map()
  
  register(skill: Skill, context: AgentContext): void {
    this.skills.set(skill.name, skill)
  }
  
  async execute(name: string, params: unknown, context: AgentContext): Promise<ToolResult> {
    const skill = this.skills.get(name)
    if (!skill) throw new Error(`Skill ${name} not found`)
    return skill.execute(params, context)
  }
}
```

**New code**:
```typescript
export interface SkillDefinition {
  name: string
  description: string
  tools: string[]
  execute: (params: unknown, toolRegistry: ToolRegistry) => Promise<ToolResult>
}

export class SkillManager {
  private skills: Map<string, SkillDefinition> = new Map()
  private toolRegistry: ToolRegistry
  
  constructor(toolRegistry: ToolRegistry) {
    this.toolRegistry = toolRegistry
  }
  
  register(skill: SkillDefinition): void {
    // Validate that all required tools exist
    for (const toolName of skill.tools) {
      if (!this.toolRegistry.getTools().find(t => t.name === toolName)) {
        throw new Error(`Skill ${skill.name} requires tool ${toolName} which is not registered`)
      }
    }
    this.skills.set(skill.name, skill)
  }
  
  async execute(name: string, params: unknown): Promise<ToolResult> {
    const skill = this.skills.get(name)
    if (!skill) throw new Error(`Skill ${name} not found`)
    return skill.execute(params, this.toolRegistry)
  }
  
  getSkills(): SkillDefinition[] {
    return Array.from(this.skills.values())
  }
}
```

### 10. Update Task Tool with Improved Subagent Support
**File**: `src/tool/task.ts`
**Priority**: high
**Type**: feature
**Reason**: Better subagent experience from opencode (#20708) with improved task delegation.

**Current code**:
```typescript
export const taskTool: ToolDefinition<TaskParams> = {
  name: "task",
  description: "Delegate a task to a subagent",
  parameters: taskParamsSchema,
  execute: async (params: TaskParams, context: AgentContext) => {
    const { description, tools } = params
    const subagent = await context.spawnSubagent(description, tools)
    return await subagent.run()
  }
}
```

**New code**:
```typescript
export interface TaskParams {
  description: string
  tools?: string[]
  context?: string
  maxIterations?: number
}

export const taskTool: ToolDefinition<TaskParams> = {
  name: "task",
  description: "Delegate a task to a subagent for focused execution",
  parameters: z.object({
    description: z.string().describe("Clear description of the task to accomplish"),
    tools: z.array(z.string()).optional().describe("Specific tools the subagent should use"),
    context: z.string().optional().describe("Additional context for the subagent"),
    maxIterations: z.number().optional().default(10).describe("Maximum iterations for the subagent"),
  }),
  execute: async (params: TaskParams, context
{"prompt_tokens":15400,"completion_tokens":4096,"total_tokens":19496}

[Session: f73a499b-2241-42f0-9389-5c278717e5a4]
[Messages: 2, Tokens: 19496]
