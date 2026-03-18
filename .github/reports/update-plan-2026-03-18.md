[2026-03-18T07:03:58.338Z] [32mINFO[39m     (context): Found a service key in environment variable "AICORE_SERVICE_KEY". Using a service key is recommended for local testing only. Bind the AI Core service to the application for productive usage.
# Update Plan for Alexi

Generated: 2026-03-18
Based on upstream commits: 3b8e8541..a3eecbbf (kilocode), 2a20822 (opencode - no changes)

## Summary
- Total changes planned: 8
- Critical: 0 | High: 3 | Medium: 4 | Low: 1

## Changes

### 1. Add WarpGrep Codebase Search Tool
**File**: `src/tool/warpgrep.ts` (new file)
**Priority**: high
**Type**: feature
**Reason**: New AI-powered codebase search tool using WarpGrep/MorphSDK for intelligent multi-step code search. This provides semantic code search capabilities beyond regex-based grep.

**New code**:
```typescript
import z from "zod"
import { Tool } from "./tool"
import { WarpGrepClient } from "@morphllm/morphsdk"
import { Instance } from "../project/instance"
import { Bus } from "../bus"

const DESCRIPTION = `Search the codebase for relevant code using AI-powered semantic search.
This tool performs intelligent multi-step code search and returns the most relevant code spans.
Use this for finding implementations, understanding code patterns, or locating specific functionality.
Be specific and descriptive in your query for best results.`

// FREE_PERIOD_TODO: Remove KILO_WARPGREP_PROXY_URL constant and the proxy
// fallback below. After the free period ends, require MORPH_API_KEY and
// return an error when it is missing.
const KILO_WARPGREP_PROXY_URL = "https://api.kilo.ai/api/gateway"

export const CodebaseSearchTool = Tool.define("codebase_search", {
  description: DESCRIPTION,
  parameters: z.object({
    query: z
      .string()
      .describe(
        "Search query describing what code you are looking for. Be specific and descriptive for best results.",
      ),
  }),
  async execute(params, ctx) {
    await ctx.ask({
      permission: "codebase_search",
      patterns: [params.query],
      always: ["*"],
      metadata: { query: params.query },
    })

    const apiKey = process.env["MORPH_API_KEY"]

    // FREE_PERIOD_TODO: Remove proxy fallback — require apiKey, error if missing
    const client = new WarpGrepClient({
      morphApiKey: apiKey ?? "kilo-free",
      ...(apiKey ? {} : { morphApiUrl: KILO_WARPGREP_PROXY_URL }),
      timeout: 60_000,
    })

    const result = await client.execute({
      searchTerm: params.query,
      repoRoot: Instance.directory,
    })

    if (!result.success) {
      return {
        title: "Codebase Search",
        output: `Search failed: ${result.error || "Unknown error"}`,
        metadata: { query: params.query },
      }
    }

    const spans = result.codeSpans || []
    if (spans.length === 0) {
      return {
        title: "Codebase Search",
        output: "No relevant code found for the given query.",
        metadata: { query: params.query },
      }
    }

    const output = spans
      .map((span: { filePath: string; startLine: number; endLine: number; content: string }) => 
        `### ${span.filePath}:${span.startLine}-${span.endLine}\n\`\`\`\n${span.content}\n\`\`\``)
      .join("\n\n")

    return {
      title: "Codebase Search",
      output,
      metadata: {
        query: params.query,
        resultCount: spans.length,
      },
    }
  },
})
```

---

### 2. Register Codebase Search Tool in Registry
**File**: `src/tool/registry.ts`
**Priority**: high
**Type**: feature
**Reason**: The new codebase_search tool needs to be registered conditionally based on experimental flag.

**Current code**:
```typescript
import { WebSearchTool } from "./websearch"
import { CodeSearchTool } from "./codesearch"
// ... other imports

export namespace ToolRegistry {
  // ... existing code
  const defaultTools = [
    // ... existing tools
    WebSearchTool,
    CodeSearchTool,
    // ... more tools
  ]
}
```

**New code**:
```typescript
import { WebSearchTool } from "./websearch"
import { CodeSearchTool } from "./codesearch"
import { CodebaseSearchTool } from "./warpgrep"
// ... other imports

export namespace ToolRegistry {
  // ... existing code
  const defaultTools = [
    // ... existing tools
    WebSearchTool,
    CodeSearchTool,
    // ... more tools
  ]
  
  export function getTools(config: Config) {
    return [
      ...defaultTools,
      ...(config.experimental?.codebase_search === true ? [CodebaseSearchTool] : []),
    ]
  }
}
```

---

### 3. Add Bash Hierarchy Rules for Granular Permissions
**File**: `src/tool/bash-hierarchy.ts` (new file)
**Priority**: high
**Type**: feature
**Reason**: Enables hierarchical permission rules for bash commands (e.g., "npm", "npm install", "npm install lodash") allowing more granular permission control.

**New code**:
```typescript
/**
 * Builds hierarchical permission rules for bash commands.
 * For a command like "npm install lodash", generates rules:
 * - "npm"
 * - "npm install"
 * - "npm install lodash"
 * 
 * This allows users to approve at different granularity levels.
 */
export namespace BashHierarchy {
  /**
   * Add all hierarchy levels for a command to the rules set.
   * @param rules - Set to add rules to
   * @param command - Array of command parts (e.g., ["npm", "install", "lodash"])
   * @param fullCommand - The full command string for the most specific rule
   */
  export function addAll(
    rules: Set<string>,
    command: string[],
    fullCommand: string
  ): void {
    if (command.length === 0) return

    // Add progressive prefixes: "npm", "npm install", etc.
    for (let i = 1; i <= command.length; i++) {
      const prefix = command.slice(0, i).join(" ")
      rules.add(prefix)
    }

    // Add the exact full command if different from the last prefix
    const lastPrefix = command.join(" ")
    if (fullCommand !== lastPrefix) {
      rules.add(fullCommand)
    }
  }

  /**
   * Check if a command matches any rule in the hierarchy.
   * @param rules - Set of approved rules
   * @param command - Command to check
   * @returns true if any prefix of the command is in rules
   */
  export function matches(rules: Set<string>, command: string[]): boolean {
    for (let i = 1; i <= command.length; i++) {
      const prefix = command.slice(0, i).join(" ")
      if (rules.has(prefix)) return true
    }
    return false
  }
}
```

---

### 4. Update Bash Tool to Include Hierarchy Rules
**File**: `src/tool/bash.ts`
**Priority**: medium
**Type**: feature
**Reason**: Integrate bash hierarchy rules into permission metadata for granular bash command permissions.

**Current code**:
```typescript
// In the execute function, where patterns are collected
const patterns = new Set<string>()
const always = new Set<string>()

// ... command parsing logic ...

if (command.length && command[0] !== "cd") {
  patterns.add(commandText)
  always.add(BashArity.prefix(command).join(" ") + " *")
}

// ... later in permission request ...
await ctx.ask({
  permission: "bash",
  patterns: Array.from(patterns),
  always: Array.from(always),
  metadata: { command: params.command },
})
```

**New code**:
```typescript
import { BashHierarchy } from "./bash-hierarchy"

// In the execute function, where patterns are collected
const patterns = new Set<string>()
const always = new Set<string>()
const rules = new Set<string>() // hierarchy rules for permissions

// ... command parsing logic ...

if (command.length && command[0] !== "cd") {
  patterns.add(commandText)
  always.add(BashArity.prefix(command).join(" ") + " *")
  BashHierarchy.addAll(rules, command, commandText)
}

// ... later in permission request ...
await ctx.ask({
  permission: "bash",
  patterns: Array.from(patterns),
  always: Array.from(always),
  metadata: { 
    command: params.command, 
    rules: Array.from(rules) 
  },
})
```

---

### 5. Add Permission toConfig Serialization
**File**: `src/permission/next.ts`
**Priority**: medium
**Type**: feature
**Reason**: Enable serializing permission rules back to config format for persistence. This is the inverse of fromConfig and allows saving permission rules to configuration files.

**Current code**:
```typescript
export namespace PermissionNext {
  export function fromConfig(config: Config.Permission): Ruleset {
    // ... existing implementation
  }
  
  // ... other functions
}
```

**New code**:
```typescript
export namespace PermissionNext {
  export function fromConfig(config: Config.Permission): Ruleset {
    // ... existing implementation
  }

  /**
   * Permissions typed as PermissionAction in the config schema (scalar-only).
   * These must be serialized as "allow"/"deny"/"ask", not as { "*": "allow" }.
   */
  const SCALAR_ONLY_PERMISSIONS = new Set([
    "todowrite",
    "todoread",
    "question",
    "webfetch",
    "websearch",
    "codesearch",
    "doom_loop",
  ])

  /**
   * Convert rules back to config format (inverse of fromConfig).
   * Useful for persisting user-approved permissions to config files.
   */
  export function toConfig(rules: Ruleset): Config.Permission {
    const result: Config.Permission = {}
    
    for (const rule of rules) {
      const existing = result[rule.permission]

      // Scalar-only permissions only accept PermissionAction ("allow"/"deny"/"ask")
      // Use scalar format for "*"; skip non-wildcard patterns
      if (SCALAR_ONLY_PERMISSIONS.has(rule.permission)) {
        if (rule.pattern === "*") {
          result[rule.permission] = rule.action
        }
        continue
      }

      if (existing === undefined) {
        // Use object format to preserve granular rules when merged
        result[rule.permission] = { [rule.pattern]: rule.action }
        continue
      }
      
      if (typeof existing === "string") {
        // Convert scalar to object format and add new pattern
        result[rule.permission] = { 
          "*": existing, 
          [rule.pattern]: rule.action 
        }
        continue
      }
      
      // Add pattern to existing object
      existing[rule.pattern] = rule.action
    }
    
    return result
  }
  
  // ... other functions
}
```

---

### 6. Update Agent Permissions to Include codebase_search
**File**: `src/agent/agent.ts`
**Priority**: medium
**Type**: feature
**Reason**: Add codebase_search permission to agent configurations and update explore agent prompt when experimental flag is enabled.

**Current code**:
```typescript
// In agent permission configurations
const defaultPermissions = {
  // ... existing permissions
  webfetch: "allow",
  websearch: "allow",
  codesearch: "allow",
  // ... more permissions
}
```

**New code**:
```typescript
// In agent permission configurations
const defaultPermissions = {
  // ... existing permissions
  webfetch: "allow",
  websearch: "allow",
  codesearch: "allow",
  codebase_search: "allow",
  // ... more permissions
}

// For the explore agent, update the prompt conditionally
function getExploreAgentConfig(config: Config) {
  const basePrompt = PROMPT_EXPLORE
  const prompt = config.experimental?.codebase_search
    ? `Prefer using the codebase_search tool for codebase searches — it performs intelligent multi-step code search and returns the most relevant code spans.\n\n${basePrompt}`
    : basePrompt
    
  return {
    // ... other config
    prompt,
    permissions: {
      // ... other permissions
      codebase_search: "allow",
    },
  }
}
```

---

### 7. Add Bash Hierarchy Tests
**File**: `src/tool/bash-hierarchy.test.ts` (new file)
**Priority**: medium
**Type**: feature
**Reason**: Ensure bash hierarchy rule generation works correctly for various command patterns.

**New code**:
```typescript
import { describe, it, expect } from "vitest"
import { BashHierarchy } from "./bash-hierarchy"

describe("BashHierarchy", () => {
  describe("addAll", () => {
    it("should add hierarchy levels for simple command", () => {
      const rules = new Set<string>()
      BashHierarchy.addAll(rules, ["npm"], "npm")
      
      expect(rules.has("npm")).toBe(true)
      expect(rules.size).toBe(1)
    })

    it("should add all prefix levels for multi-part command", () => {
      const rules = new Set<string>()
      BashHierarchy.addAll(rules, ["npm", "install", "lodash"], "npm install lodash")
      
      expect(rules.has("npm")).toBe(true)
      expect(rules.has("npm install")).toBe(true)
      expect(rules.has("npm install lodash")).toBe(true)
      expect(rules.size).toBe(3)
    })

    it("should handle command with flags", () => {
      const rules = new Set<string>()
      BashHierarchy.addAll(rules, ["git", "commit", "-m"], "git commit -m 'message'")
      
      expect(rules.has("git")).toBe(true)
      expect(rules.has("git commit")).toBe(true)
      expect(rules.has("git commit -m")).toBe(true)
      expect(rules.has("git commit -m 'message'")).toBe(true)
    })

    it("should handle empty command array", () => {
      const rules = new Set<string>()
      BashHierarchy.addAll(rules, [], "")
      
      expect(rules.size).toBe(0)
    })
  })

  describe("matches", () => {
    it("should match exact command", () => {
      const rules = new Set(["npm install"])
      expect(BashHierarchy.matches(rules, ["npm", "install"])).toBe(true)
    })

    it("should match parent prefix", () => {
      const rules = new Set(["npm"])
      expect(BashHierarchy.matches(rules, ["npm", "install", "lodash"])).toBe(true)
    })

    it("should not match unrelated command", () => {
      const rules = new Set(["npm"])
      expect(BashHierarchy.matches(rules, ["yarn", "add"])).toBe(false)
    })
  })
})
```

---

### 8. Add Permission toConfig Tests
**File**: `src/permission/next.toConfig.test.ts` (new file)
**Priority**: low
**Type**: feature
**Reason**: Ensure permission serialization to config format works correctly and round-trips properly.

**New code**:
```typescript
import { describe, it, expect } from "vitest"
import { PermissionNext } from "./next"

describe("PermissionNext.toConfig", () => {
  it("should serialize scalar-only permissions as scalars", () => {
    const rules: PermissionNext.Ruleset = [
      { permission: "websearch", pattern: "*", action:
{"prompt_tokens":28995,"completion_tokens":4096,"total_tokens":33091}

[Session: 24edc137-c011-4865-99dc-9ded89fb38f4]
[Messages: 2, Tokens: 33091]
