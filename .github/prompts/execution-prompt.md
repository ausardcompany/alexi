# Execution Task: Apply Update Plan to Alexi

You are an expert software developer. Your task is to execute the update plan below precisely.

## Update Plan to Execute

# Update Plan for Alexi

Generated: 2026-10-11
Based on upstream commits: opencode 055d95bb..d21b0790 (100 commits analyzed; kilocode no changes)

## Summary
- Total changes planned: 18
- Critical: 2 | High: 6 | Medium: 7 | Low: 3

## Context: Major Upstream Restructuring

The upstream opencode repository underwent **massive architectural restructuring** in this window:

1. **`packages/opencode/` entirely removed** — all code migrated to `packages/core/`, `packages/cli/`, `packages/server/`, `packages/tui/`, `packages/ai/`
2. **Tool system refactored** into a plugin-based model: individual tool files moved from `packages/opencode/src/tool/*.ts` to `packages/core/src/tool/plugin/*.ts` with a shared `runtime.ts`
3. **Agent system removed from `packages/opencode/src/agent/`** — logic now lives in `packages/core/src/session/` (subagent-job, subagent-completion, run-coordinator)
4. **Permission system consolidated** — moved from `packages/opencode/src/permission/` to `packages/core/src/permission.ts`
5. **New `packages/ai/` package** replaces `packages/llm/` with expanded provider support
6. **Package rename**: `@opencode-ai/*` → `@opencode/*` (plugin SDK import path change)
7. **Managed integration/skill/tool policies** added (`packages/core/src/managed-policy.ts`)
8. **Shell parser rewrite** with WASM backend, PowerShell safety scanning
9. **Models.dev snapshot refreshes** and new provider routes (Vertex Mistral, Vertex Interactions, Azure CLI auth)

Since Alexi forks selected pieces, this plan focuses on **targeted, high-value adoptions** rather than mirroring the full restructure.

## Changes

### 1. Rename plugin SDK import from `@opencode-ai/plugin` to `@opencode/plugin`
**File**: `src/tool/github-pr-search.ts`, `src/tool/github-triage.ts`, and any other files importing from `@opencode-ai/plugin`
**Priority**: critical
**Type**: refactor (breaking dependency rename)
**Reason**: Upstream renamed the plugin SDK package. Keeping the old name will break once Alexi upgrades the plugin dependency. Grep for `@opencode-ai` across the repo.

**Current code**:
```typescript
import { tool } from "@opencode-ai/plugin"
```

**New code**:
```typescript
import { tool } from "@opencode/plugin"
```

Also update `package.json` dependencies:
```json
{
  "dependencies": {
-   "@opencode-ai/plugin": "^1.x",
+   "@opencode/plugin": "^2.x",
  }
}
```

---

### 2. Reject malformed tool arguments and settle unfinished calls
**File**: `src/tool/runtime.ts` (or wherever tool invocation is dispatched in Alexi)
**Priority**: critical
**Type**: bugfix / security
**Reason**: Upstream fix (c9e1ed70) prevents stuck sessions when a model emits malformed JSON args, and settles any still-pending tool calls at turn boundary. Without this, Alexi sessions can hang or leak state when providers emit broken tool blocks.

**New code** (dispatch wrapper):
```typescript
async function invokeTool(call: ToolCall, ctx: ToolContext) {
  // Validate args JSON before invocation
  let args: unknown
  try {
    args = typeof call.input === "string" ? JSON.parse(call.input) : call.input
  } catch (err) {
    return {
      status: "error" as const,
      error: `Malformed tool arguments: ${(err as Error).message}`,
      toolCallId: call.id,
    }
  }

  // Validate against tool schema
  const tool = registry.get(call.name)
  if (!tool) {
    return {
      status: "error" as const,
      error: `Unknown tool: ${call.name}`,
      toolCallId: call.id,
    }
  }

  const parsed = tool.parameters.safeParse(args)
  if (!parsed.success) {
    return {
      status: "error" as const,
      error: `Invalid tool arguments: ${parsed.error.message}`,
      toolCallId: call.id,
    }
  }

  return tool.execute(parsed.data, ctx)
}

// At end of turn, settle any unfinished calls
function settleUnfinishedCalls(pending: Map<string, ToolCall>) {
  for (const [id, call] of pending) {
    emit({
      type: "tool.error",
      toolCallId: id,
      error: "Tool call did not complete before turn ended",
    })
  }
  pending.clear()
}
```

---

### 3. Adopt deterministic timeline file-link detection
**File**: `src/session-ui/timeline-links.ts` (new) or existing timeline rendering code
**Priority**: high
**Type**: feature
**Reason**: Upstream commit f43903d8 adds deterministic file link detection/resolution in the timeline. Prevents false positives when model output contains path-like strings that aren't real files.

**New code**:
```typescript
import * as path from "node:path"
import * as fs from "node:fs/promises"

const FILE_LINK_RE = /(?:^|[\s(])((?:\.{0,2}\/|[a-zA-Z]:\\|~\/)[\w./\\-]+(?::\d+)?(?::\d+)?)/g

export interface FileLink {
  raw: string
  absolutePath: string
  line?: number
  column?: number
  exists: boolean
}

export async function detectFileLinks(
  text: string,
  workspaceRoot: string,
): Promise<FileLink[]> {
  const matches = [...text.matchAll(FILE_LINK_RE)]
  const results: FileLink[] = []
  for (const m of matches) {
    const raw = m[1]
    const [filePart, lineStr, colStr] = raw.split(":")
    const abs = path.isAbsolute(filePart)
      ? filePart
      : path.resolve(workspaceRoot, filePart)
    let exists = false
    try {
      await fs.access(abs)
      exists = true
    } catch {
      /* not a real file */
    }
    if (exists) {
      results.push({
        raw,
        absolutePath: abs,
        line: lineStr ? Number(lineStr) : undefined,
        column: colStr ? Number(colStr) : undefined,
        exists,
      })
    }
  }
  return results
}
```

---

### 4. Enforce managed integration and tool policies
**File**: `src/permission/policy.ts` (new) and `src/tool/registry.ts`
**Priority**: high
**Type**: security
**Reason**: Upstream commits 613ef8ba and d016db85 add managed policy enforcement — organizations can disable specific tools/integrations/skills centrally. Essential for enterprise SAP deployments where IT needs to lock down what agents can do.

**New file** `src/permission/policy.ts`:
```typescript
import { z } from "zod"

export const ManagedPolicy = z.object({
  tools: z
    .object({
      allowed: z.array(z.string()).optional(),
      denied: z.array(z.string()).optional(),
    })
    .optional(),
  integrations: z
    .object({
      allowed: z.array(z.string()).optional(),
      denied: z.array(z.string()).optional(),
    })
    .optional(),
  skills: z
    .object({
      allowed: z.array(z.string()).optional(),
      denied: z.array(z.string()).optional(),
    })
    .optional(),
})

export type ManagedPolicy = z.infer<typeof ManagedPolicy>

export class PolicyEnforcer {
  constructor(private policy: ManagedPolicy = {}) {}

  isToolAllowed(name: string): boolean {
    const t = this.policy.tools
    if (!t) return true
    if (t.denied?.includes(name)) return false
    if (t.allowed && !t.allowed.includes(name)) return false
    return true
  }

  isIntegrationAllowed(id: string): boolean {
    const i = this.policy.integrations
    if (!i) return true
    if (i.denied?.includes(id)) return false
    if (i.allowed && !i.allowed.includes(id)) return false
    return true
  }

  isSkillAllowed(name: string): boolean {
    const s = this.policy.skills
    if (!s) return true
    if (s.denied?.includes(name)) return false
    if (s.allowed && !s.allowed.includes(name)) return false
    return true
  }
}
```

**Update** `src/tool/registry.ts`:
```typescript
import { PolicyEnforcer } from "../permission/policy"

export class ToolRegistry {
  constructor(private policy: PolicyEnforcer) {}

  list(): Tool[] {
    return Array.from(this.tools.values()).filter((t) =>
      this.policy.isToolAllowed(t.name),
    )
  }

  get(name: string): Tool | undefined {
    const tool = this.tools.get(name)
    if (tool && !this.policy.isToolAllowed(name)) return undefined
    return tool
  }
}
```

---

### 5. Accept interleaved Copilot `reasoning_opaque` values
**File**: `src/providers/github-copilot.ts` (or wherever Copilot responses are decoded)
**Priority**: high
**Type**: bugfix
**Reason**: Upstream fix 9f282f8c handles the Copilot responses API emitting `reasoning_opaque` interleaved with content deltas; without it, Copilot sessions break on reasoning models.

**New code**:
```typescript
function parseCopilotResponseStream(chunk: StreamChunk) {
  switch (chunk.type) {
    case "response.output_text.delta":
      return { type: "text", text: chunk.delta }
    case "response.reasoning.delta":
    case "response.reasoning_opaque.delta": // NEW: accept opaque reasoning
      return { type: "reasoning", text: chunk.delta ?? "", opaque: true }
    case "response.output_item.added":
      if (chunk.item.type === "reasoning") {
        return { type: "reasoning_start", id: chunk.item.id }
      }
      break
    // ... existing cases
  }
}
```

---

### 6. Route Copilot Gemini fallback to chat completions
**File**: `src/providers/github-copilot.ts`
**Priority**: high
**Type**: bugfix
**Reason**: Upstream fix 1a9e29a0 — Gemini via Copilot must use the chat completions endpoint, not responses. Models.dev snapshot does not advertise this, so hardcoded routing is required.

**New code**:
```typescript
function selectCopilotEndpoint(modelId: string): "responses" | "chat" {
  // Gemini models through Copilot only work via chat completions
  if (modelId.toLowerCase().startsWith("gemini")) return "chat"
  // GPT and Claude use responses API
  if (modelId.toLowerCase().startsWith("gpt-")) return "responses"
  if (modelId.toLowerCase().startsWith("claude")) return "responses"
  return "chat" // safe default
}
```

Also follow models.dev packages for Copilot fallback routing (commit 823ac87f):
```typescript
import modelsDev from "./models-dev-snapshot.json"

function resolveCopilotProviderPackage(modelId: string): string {
  const info = modelsDev.copilot?.models?.[modelId]
  return info?.providerPackage ?? "openai-compatible"
}
```

---

### 7. Only send PNG, JPEG, and WebP images to xAI
**File**:
{"prompt_tokens":269923,"completion_tokens":4096,"total_tokens":274019,"cache_read_input_tokens":0,"cache_creation_input_tokens":0}

[Session: 042684c4-e796-4108-8e43-fe45c054d7bb]
[Messages: 2, Tokens: 274019]

## Execution Instructions

1. **Execute each change** in the plan above in order of priority (critical → high → medium → low)
2. **Make exact code changes** as specified in the plan
3. **Maintain SAP AI Core compatibility** - do not break existing integrations
4. **Follow existing code style** in this repository
5. **Create changes summary** at `.github/reports/changes-summary.md` with:
   - List of files modified
   - Summary of each change made
   - Any issues encountered

## Important

- Do NOT skip any items in the plan
- Do NOT add extra changes not in the plan
- Do NOT ask questions - just execute
- If a file doesn't exist, create it
- If code context is unclear, use your best judgment based on the plan

Execute the entire plan now.
