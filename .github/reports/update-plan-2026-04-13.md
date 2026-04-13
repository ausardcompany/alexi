# Update Plan for Alexi

Generated: 2026-04-13
Based on upstream commits: kilocode bd494f669..7ea50aac1 (144 commits), opencode cb1a500..74b14a2 (18 commits)

## Summary
- Total changes planned: 24
- Critical: 2 | High: 8 | Medium: 10 | Low: 4

## Changes

### 1. Update AI SDK Provider Tool Factory API
**File**: `src/tool/code-interpreter.ts`
**Priority**: critical
**Type**: bugfix
**Reason**: AI SDK v6 renamed `createProviderDefinedToolFactoryWithOutputSchema` to `createProviderToolFactoryWithOutputSchema` and removed the `name` property requirement. This is a breaking change that will cause runtime errors.

**Current code**:
```typescript
import { createProviderDefinedToolFactoryWithOutputSchema } from "@ai-sdk/provider-utils"

export const codeInterpreterToolFactory = createProviderDefinedToolFactoryWithOutputSchema<
  // ... type params
>({
  id: "openai.code_interpreter",
  name: "code_interpreter",
  inputSchema: codeInterpreterInputSchema,
  outputSchema: codeInterpreterOutputSchema,
})
```

**New code**:
```typescript
import { createProviderToolFactoryWithOutputSchema } from "@ai-sdk/provider-utils"

export const codeInterpreterToolFactory = createProviderToolFactoryWithOutputSchema<
  // ... type params
>({
  id: "openai.code_interpreter",
  inputSchema: codeInterpreterInputSchema,
  outputSchema: codeInterpreterOutputSchema,
})
```

### 2. Update File Search Tool Factory API
**File**: `src/tool/file-search.ts`
**Priority**: critical
**Type**: bugfix
**Reason**: Same AI SDK v6 breaking change for file search tool factory.

**Current code**:
```typescript
import { createProviderDefinedToolFactoryWithOutputSchema } from "@ai-sdk/provider-utils"

export const fileSearch = createProviderDefinedToolFactoryWithOutputSchema<
  // ... type params
>({
  id: "openai.file_search",
  name: "file_search",
  inputSchema: z.object({}),
  outputSchema: fileSearchOutputSchema,
})
```

**New code**:
```typescript
import { createProviderToolFactoryWithOutputSchema } from "@ai-sdk/provider-utils"

export const fileSearch = createProviderToolFactoryWithOutputSchema<
  // ... type params
>({
  id: "openai.file_search",
  inputSchema: z.object({}),
  outputSchema: fileSearchOutputSchema,
})
```

### 3. Update Image Generation Tool Factory API
**File**: `src/tool/image-generation.ts`
**Priority**: high
**Type**: bugfix
**Reason**: Same AI SDK v6 breaking change for image generation tool factory.

**Current code**:
```typescript
import { createProviderDefinedToolFactoryWithOutputSchema } from "@ai-sdk/provider-utils"

const imageGenerationToolFactory = createProviderDefinedToolFactoryWithOutputSchema<
  // ... type params
>({
  id: "openai.image_generation",
  name: "image_generation",
  inputSchema: z.object({}),
  outputSchema: imageGenerationOutputSchema,
})
```

**New code**:
```typescript
import { createProviderToolFactoryWithOutputSchema } from "@ai-sdk/provider-utils"

const imageGenerationToolFactory = createProviderToolFactoryWithOutputSchema<
  // ... type params
>({
  id: "openai.image_generation",
  inputSchema: z.object({}),
  outputSchema: imageGenerationOutputSchema,
})
```

### 4. Update Web Search Tool Factory API
**File**: `src/tool/web-search.ts`
**Priority**: high
**Type**: bugfix
**Reason**: Same AI SDK v6 breaking change for web search tool factory.

**New code**:
```typescript
import { createProviderToolFactoryWithOutputSchema } from "@ai-sdk/provider-utils"

// Replace all instances of createProviderDefinedToolFactoryWithOutputSchema
// with createProviderToolFactoryWithOutputSchema and remove 'name' property
```

### 5. Update Web Search Preview Tool Factory API
**File**: `src/tool/web-search-preview.ts`
**Priority**: high
**Type**: bugfix
**Reason**: Same AI SDK v6 breaking change for web search preview tool factory.

**New code**:
```typescript
import { createProviderToolFactoryWithOutputSchema } from "@ai-sdk/provider-utils"

// Replace all instances of createProviderDefinedToolFactoryWithOutputSchema
// with createProviderToolFactoryWithOutputSchema and remove 'name' property
```

### 6. Update Local Shell Tool Factory API
**File**: `src/tool/local-shell.ts`
**Priority**: high
**Type**: bugfix
**Reason**: Same AI SDK v6 breaking change for local shell tool factory.

**New code**:
```typescript
import { createProviderToolFactoryWithOutputSchema } from "@ai-sdk/provider-utils"

// Replace all instances of createProviderDefinedToolFactoryWithOutputSchema
// with createProviderToolFactoryWithOutputSchema and remove 'name' property
```

### 7. Refactor Bash Tool with PowerShell Support
**File**: `src/tool/bash.ts`
**Priority**: high
**Type**: feature
**Reason**: Add first-class PowerShell support for Windows and improve shell detection logic.

**Current code**:
```typescript
// Basic shell execution
export namespace BashTool {
  // ... existing implementation
}
```

**New code**:
```typescript
import { Shell } from "../shell/shell"

export namespace BashTool {
  // Add PowerShell detection and support
  const getShellType = Effect.fn("BashTool.getShellType")(function* () {
    const shell = yield* Shell.Service
    const shellInfo = yield* shell.detect()
    
    // Support pwsh/powershell on Windows
    if (shellInfo.type === "powershell" || shellInfo.type === "pwsh") {
      return {
        type: "powershell" as const,
        executable: shellInfo.executable,
        args: ["-NoProfile", "-NonInteractive", "-Command"]
      }
    }
    
    return {
      type: "bash" as const,
      executable: shellInfo.executable,
      args: ["-c"]
    }
  })

  // Update bash tool description for better cache hit rates
  export const description = `Execute shell commands in the user's environment.
Commands run in the project's working directory.
Use for file operations, running scripts, and system tasks.`
}
```

### 8. Update Bash Tool Description for Cache Optimization
**File**: `src/tool/bash.txt`
**Priority**: medium
**Type**: refactor
**Reason**: Adjust bash tool description to increase cache hit rates between projects by making it more generic.

**Current code**:
```
Execute a bash command in the user's shell environment.
```

**New code**:
```
Execute shell commands in the user's environment.
Commands run in the project's working directory.
Use for file operations, running scripts, and system tasks.
```

### 9. Add Alibaba Provider Support
**File**: `src/providers/alibaba.ts`
**Priority**: high
**Type**: feature
**Reason**: Add Alibaba cloud AI provider support with caching capabilities.

**New code**:
```typescript
import { Effect, Layer } from "effect"
import { ProviderRegistry } from "./registry"

export namespace AlibabaProvider {
  export const ID = "alibaba" as const
  
  export interface Config {
    apiKey: string
    baseUrl?: string
    cacheEnabled?: boolean
  }

  export const make = (config: Config) => Effect.gen(function* () {
    return {
      id: ID,
      name: "Alibaba Cloud AI",
      
      createModel: (modelId: string) => ({
        id: modelId,
        provider: ID,
        // Model implementation
      }),
      
      // Cache support similar to other providers
      supportsCache: config.cacheEnabled ?? true,
    }
  })

  export const layer = Layer.effect(
    ProviderRegistry.Service,
    Effect.gen(function* () {
      // Register Alibaba provider
    })
  )
}
```

### 10. Update Provider Transform for Alibaba
**File**: `src/providers/transform.ts`
**Priority**: high
**Type**: feature
**Reason**: Add Alibaba case to provider transformation logic.

**Current code**:
```typescript
export function transformProvider(providerId: string) {
  switch (providerId) {
    case "openai":
    case "anthropic":
    // ... other cases
    default:
      return providerId
  }
}
```

**New code**:
```typescript
export function transformProvider(providerId: string) {
  switch (providerId) {
    case "openai":
    case "anthropic":
    case "alibaba":
      return providerId
    // ... other cases
    default:
      return providerId
  }
}
```

### 11. Refactor Agent Service to Use Effect Services
**File**: `src/agent/index.ts`
**Priority**: medium
**Type**: refactor
**Reason**: Update agent to yield Config and Skill services instead of using promise facades, following the effectify pattern from upstream.

**Current code**:
```typescript
export namespace Agent {
  export const layer = Layer.effect(
    Service,
    Effect.gen(function* () {
      const config = () => Effect.promise(() => Config.get())
      
      const state = yield* InstanceState.make<State>(
        Effect.fn("Agent.state")(function* (ctx) {
          const cfg = yield* config()
          const skillDirs = yield* Effect.promise(() => Skill.dirs())
          // ...
        })
      )
    })
  )
}
```

**New code**:
```typescript
export namespace Agent {
  export const layer = Layer.effect(
    Service,
    Effect.gen(function* () {
      const config = yield* Config.Service
      const skill = yield* Skill.Service
      
      const state = yield* InstanceState.make<State>(
        Effect.fn("Agent.state")(function* (ctx) {
          const cfg = yield* config.get()
          const skillDirs = yield* skill.dirs()
          // ...
        })
      )
    })
  )
}
```

### 12. Add Default Agent Preference for "code"
**File**: `src/agent/index.ts`
**Priority**: medium
**Type**: feature
**Reason**: Prefer "code" as the default agent when no explicit default is configured.

**Current code**:
```typescript
const defaultAgent = Effect.fnUntraced(function* () {
  const c = yield* config.get()
  if (c.default_agent) {
    // ... handle configured default
  }
  const visible = Object.values(agents).find((a) => a.mode !== "subagent" && a.hidden !== true)
  if (!visible) throw new Error("no primary visible agent found")
  return visible.name
})
```

**New code**:
```typescript
const defaultAgent = Effect.fnUntraced(function* () {
  const c = yield* config.get()
  if (c.default_agent) {
    // ... handle configured default
  }
  // Prefer "code" as default agent
  const code = agents.code
  if (code && code.mode !== "subagent" && code.hidden !== true) {
    return code.name
  }
  const visible = Object.values(agents).find((a) => a.mode !== "subagent" && a.hidden !== true)
  if (!visible) throw new Error("no primary visible agent found")
  return visible.name
})
```

### 13. Update Tool Registry to Use Effect Services
**File**: `src/tool/registry.ts`
**Priority**: medium
**Type**: refactor
**Reason**: Refactor tool registry to yield Config/Plugin services and use Effect.forEach for better effect composition.

**Current code**:
```typescript
export namespace ToolRegistry {
  export const list = Effect.gen(function* () {
    const config = yield* Effect.promise(() => Config.get())
    // ... tool listing logic
  })
}
```

**New code**:
```typescript
export namespace ToolRegistry {
  export const list = Effect.gen(function* () {
    const config = yield* Config.Service
    const plugin = yield* Plugin.Service
    
    const cfg = yield* config.get()
    const tools = yield* Effect.forEach(
      toolDefinitions,
      (def) => loadTool(def, cfg),
      { concurrency: "unbounded" }
    )
    
    return tools.filter(Boolean)
  })
}
```

### 14. Fix Token Usage Double-Counting
**File**: `src/session/index.ts`
**Priority**: high
**Type**: bugfix
**Reason**: Fix token usage double-counting with Anthropic and Bedrock providers due to AI SDK v6 upgrade.

**Current code**:
```typescript
// Session usage calculation
const calculateUsage = (messages: Message[]) => {
  return messages.reduce((acc, msg) => ({
    inputTokens: acc.inputTokens + (msg.usage?.inputTokens ?? 0),
    outputTokens: acc.outputTokens + (msg.usage?.outputTokens ?? 0),
  }), { inputTokens: 0, outputTokens: 0 })
}
```

**New code**:
```typescript
import type { LanguageModelUsage } from "ai"

// Session usage calculation - use LanguageModelUsage instead of LanguageModelV2Usage
const calculateUsage = (messages: Message[]): LanguageModelUsage => {
  const seen = new Set<string>()
  
  return messages.reduce((acc, msg) => {
    // Deduplicate usage by message ID to prevent double-counting
    if (msg.id && seen.has(msg.id)) {
      return acc
    }
    if (msg.id) seen.add(msg.id)
    
    return {
      promptTokens: acc.promptTokens + (msg.usage?.promptTokens ?? 0),
      completionTokens: acc.completionTokens + (msg.usage?.completionTokens ?? 0),
      totalTokens: acc.totalTokens + (msg.usage?.totalTokens ?? 0),
    }
  }, { promptTokens: 0, completionTokens: 0, totalTokens: 0 })
}
```

### 15. Update Session Message V2 for Image Attachments
**File**: `src/session/message-v2.ts`
**Priority**: medium
**Type**: bugfix
**Reason**: Ensure images read by agent don't count against quota and preserve image attachments when selecting slash commands.

**Current code**:
```typescript
export namespace MessageV2 {
  export const fromContent = (content: Content) => {
    // ... content conversion
  }
}
```

**New code**:
```typescript
export namespace MessageV2 {
  export const fromContent = (content: Content, options?: { preserveImages?: boolean }) => {
    // Preserve image attachments when processing
    if (options?.preserveImages && content.type === "image") {
      return {
        ...content,
        _agentRead: true, // Mark as agent-read to exclude from quota
      }
    }
    // ... rest of content conversion
  }
  
  export const preserveImageAttachments = (messages: Message[], newContent: Content[]) => {
    const existingImages = messages
      .flatMap(m => m.content)
      .filter(c => c.type === "image")
    
    return [...existingImages, ...newContent]
  }
}
```

### 16. Improve Snapshot Gitignore Handling
**File**: `src/snapshot/index.ts`
**Priority**: medium
**Type**: bugfix
**Reason**: Complete gitignore respect for previously tracked files in snapshots.

**Current code**:
```typescript
export namespace Snapshot {
  const shouldIncludeFile = (filePath: string, gitignore: Gitignore) => {
    return !gitignore.ignores(filePath)
  }
}
```

**New code**:
```typescript
export namespace Snapshot {
{"prompt_tokens":26196,"completion_tokens":4096,"total_tokens":30292}

[Session: 5bd545f2-6b17-47e4-954c-f13fdf796c48]
[Messages: 2, Tokens: 30292]
