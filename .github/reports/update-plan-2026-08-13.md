```markdown
# Update Plan for Alexi

Generated: 2026-08-13
Based on upstream commits analyzed:
- kilocode: 64e5dd036..f71154707 (48 commits)
- opencode: 1f94d8a..cc4b456 (21 commits)

## Summary
- Total changes planned: 10
- Critical: 1 | High: 4 | Medium: 3 | Low: 2

## Analysis Overview

The most significant upstream changes are:
1. **Removal of built-in `codebase_search` (WarpGrep) tool** from kilocode — this tool relied on a proprietary Morph API and free-period proxy that is not appropriate for Alexi's SAP AI Core context.
2. **Compaction prompt refinements** in opencode — better instructions for smaller models and clearer prior-summary handling.
3. **Provider reasoning-effort pass-through** for groq/mistral/xai in opencode — may inform Alexi's SAP AI Core provider adapters.
4. **Compaction slice logic simplification** — removes character-level slicing on token boundary.

## Changes

### 1. Remove built-in `codebase_search` / WarpGrep tool
**File**: `src/tool/warpgrep.ts` (delete), `src/tool/warpgrep.txt` (delete)
**Priority**: high
**Type**: refactor (security/compliance)
**Reason**: The upstream `codebase_search` tool used a Morph proprietary API with a "kilo-free" proxy fallback (`https://api.kilo.ai/api/gateway`). This is inappropriate for an SAP AI Core–oriented product like Alexi (data locality, licensing, and free-tier bootstrapping do not apply). Users who need this can install an equivalent as an MCP tool.

**Action**: Delete both files if they exist in Alexi. If Alexi has an SAP-specific reimplementation, keep it but audit for proxy fallback URLs and remove them.

```bash
# Remove upstream artifacts (if present)
rm -f src/tool/warpgrep.ts src/tool/warpgrep.txt src/tool/warpgrep.txt.ts
```

---

### 2. Remove `codebase_search` from tool registry
**File**: `src/tool/registry.ts`
**Priority**: high
**Type**: refactor
**Reason**: Follow-through on removing WarpGrep. Registry must no longer wire in `CodebaseSearchTool`. Keep `semantic_search` (Alexi's supported search primitive) in place.

**Current code** (if pattern present):
```typescript
import { CodebaseSearchTool } from "./warpgrep"
// ...
export function infos(host?: AgentManager.Interface, notebook?: Notebook.Interface) {
  return Effect.gen(function* () {
    const codebase = yield* CodebaseSearchTool
    const recall = yield* RecallTool
    // ...
    if (!notebook)
      return { codebase, recall, /* ... */ }
    // ...
    return { codebase, recall, /* ... */, ...tools }
  })
}

export function build(
  tools: {
    codebase: Tool.Info
    recall: Tool.Info
    // ...
  },
  // ...
) {
  return Effect.gen(function* () {
    const base = yield* Effect.all({
      codebase: Tool.init(tools.codebase),
      recall: Tool.init(tools.recall),
      // ...
    })
  })
}
```

**New code**:
```typescript
// Remove the CodebaseSearchTool import.
import { RecallTool } from "./recall"
// ...
export function infos(host?: AgentManager.Interface, notebook?: Notebook.Interface) {
  return Effect.gen(function* () {
    const recall = yield* RecallTool
    // ...
    if (!notebook)
      return { recall, /* ... */ }
    // ...
    return { recall, /* ... */, ...tools }
  })
}

export function build(
  tools: {
    recall: Tool.Info
    // ...
  },
  // ...
) {
  return Effect.gen(function* () {
    const base = yield* Effect.all({
      recall: Tool.init(tools.recall),
      // ...
    })
  })
}
```

---

### 3. Remove `codebase_search` permission entries in agent guards
**File**: `src/agent/index.ts`
**Priority**: high
**Type**: refactor
**Reason**: With the tool gone, permission guards referencing it are dead code and can confuse operators reviewing agent capability surfaces.

**Current code**:
```typescript
function askGuard(mcp: Record<string, "allow" | "ask" | "deny"> = {}) {
  return {
    // ...
    webfetch: "allow",
    websearch: "allow",
    codebase_search: "allow",
    semantic_search: "allow",
    // ...
  }
}

function planGuard(worktree: string, mcp = {}) {
  return {
    // ...
    webfetch: "allow",
    websearch: "allow",
    codebase_search: "allow",
    semantic_search: "allow",
    // ...
  }
}

// Patch explore with codebase_search and conditional prompt
if (agents.explore) {
  agents.explore = {
    ...agents.explore,
    permission: {
      // ...
      webfetch: "allow",
      websearch: "allow",
      codebase_search: "allow",
      semantic_search: "allow",
      // ...
    },
  }
}
```

**New code**:
```typescript
function askGuard(mcp: Record<string, "allow" | "ask" | "deny"> = {}) {
  return {
    // ...
    webfetch: "allow",
    websearch: "allow",
    semantic_search: "allow",
    // ...
  }
}

function planGuard(worktree: string, mcp = {}) {
  return {
    // ...
    webfetch: "allow",
    websearch: "allow",
    semantic_search: "allow",
    // ...
  }
}

// Patch explore permissions and prompt (comment updated)
if (agents.explore) {
  agents.explore = {
    ...agents.explore,
    permission: {
      // ...
      webfetch: "allow",
      websearch: "allow",
      semantic_search: "allow",
      // ...
    },
  }
}
```

---

### 4. Remove `codebase_search` config flag from schema
**File**: `src/core/config/config.ts` (or `src/v1/config/config.ts` depending on Alexi layout)
**Priority**: high
**Type**: refactor
**Reason**: Upstream removed the experimental flag. Keeping it in schema would allow user configs to reference a non-existent feature.

**Current code**:
```typescript
export const Info = Schema.Struct({
  // ...
  batch_tool: Schema.optional(Schema.Boolean).annotate({ description: "Enable the batch tool" }),
  codebase_search: Schema.optional(Schema.Boolean).annotate({ description: "Enable AI-powered codebase search" }),
  image_generation: Schema.optional(Schema.Boolean),
  // ...
})
```

**New code**:
```typescript
export const Info = Schema.Struct({
  // ...
  batch_tool: Schema.optional(Schema.Boolean).annotate({ description: "Enable the batch tool" }),
  image_generation: Schema.optional(Schema.Boolean),
  // ...
})
```

**Migration note**: Add a graceful `Schema.optional` deprecation warning if any Alexi customers rely on this key, or emit a one-time console warning on config load if `codebase_search` is present.

---

### 5. Adopt clearer compaction system prompt (opencode)
**File**: `src/agent/prompt/compaction.txt` and/or `src/core/plugin/agent.ts`
**Priority**: medium
**Type**: feature
**Reason**: The new phrasing is more explicit for smaller/weaker models (e.g., DeepSeek v4 Flash tier). It also explicitly forbids continuing the conversation, which is a common failure mode. Beneficial for any smaller SAP-hosted models Alexi routes through AI Core.

**Current code** (`packages/core/src/plugin/agent.ts` equivalent):
```typescript
const PROMPT_COMPACTION = `You are an anchored context summarization assistant for coding sessions.

Summarize only the conversation history you are given. The newest turns may be kept verbatim outside your summary, so focus on the older context that still matters for continuing the work.

If the prompt includes a <previous-summary> block, treat it as the current anchored summary. Update it with the new history by preserving still-true details, removing stale details, and merging in new facts.

Always follow the exact output structure requested by the user prompt. Keep every section, preserve exact file paths and identifiers when known, and prefer terse bullets over paragraphs.

Do not answer the conversation itself. Do not mention that you are summarizing, compacting, or merging context. Respond in the same language as the conversation.`
```

**New code**:
```typescript
const PROMPT_COMPACTION = `You are a context summarization agent. You are given a conversation between a user and an agent. Your goal is to produce a structured summary matching the format specified so another coding agent can continue the work.

Always follow the exact output structure requested by the user prompt. Keep every section, preserve exact file paths and identifiers when known, and prefer terse bullets over paragraphs.

Do not continue the conversation. Do not respond to any questions in the conversation. Only output the structured summary in the exact format requested by the user prompt. Respond in the same language as the conversation.`
```

---

### 6. Simplify compaction slice logic (drop char-level split)
**File**: `src/core/session/compaction.ts` (and/or `src/session/compaction.ts`)
**Priority**: medium
**Type**: bugfix
**Reason**: The previous implementation sliced a message at a character boundary when it crossed the token budget, which produced broken tokens/UTF-8 sequences at the split and could confuse models. Upstream now cleanly splits at message boundaries only. Simpler and safer.

**Current code**:
```typescript
const select = (
  conversation: readonly string[],
  tokens: number,
) => {
  if (conversation.length === 0) return
  let total = 0
  let split = conversation.length
  let splitPrefix = ""
  let splitSuffix = ""
  for (let index = conversation.length - 1; index >= 0; index--) {
    const next = total + Token.estimate(conversation[index])
    if (next > tokens) {
      const remaining = Math.max(0, tokens - total) * 4
      if (remaining > 0) {
        splitPrefix = conversation[index].slice(0, -remaining)
        splitSuffix = conversation[index].slice(-remaining)
        split = index + 1
      }
      break
    }
    total = next
    split = index
  }
  return {
    head: [...conversation.slice(0, split), splitPrefix].filter(Boolean).join("\n\n"),
    recent: [splitSuffix, ...conversation.slice(split)].filter(Boolean).join("\n\n"),
  }
}
```

**New code**:
```typescript
const select = (
  conversation: readonly string[],
  tokens: number,
) => {
  if (conversation.length === 0) return
  let total = 0
  let split = conversation.length
  for (let index = conversation.length - 1; index >= 0; index--) {
    const next = total + Token.estimate(conversation[index])
    if (next > tokens) break
    total = next
    split = index
  }
  return {
    head: conversation.slice(0, split).join("\n\n"),
    recent: conversation.slice(split).join("\n\n"),
  }
}
```

---

### 7. Add prior-summary update instructions to compaction
**File**: `src/core/session/compaction.ts`
**Priority**: medium
**Type**: feature
**Reason**: New `SUMMARY_UPDATE_INSTRUCTIONS` string
{"prompt_tokens":16663,"completion_tokens":4096,"total_tokens":20759,"cache_read_input_tokens":0,"cache_creation_input_tokens":0}

[Session: 9b688749-5031-4511-9684-6fe9cbd890e7]
[Messages: 2, Tokens: 20759]
