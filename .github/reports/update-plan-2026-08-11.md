# Update Plan for Alexi

Generated: 2026-08-11
Based on upstream commits: kilocode c55440908..a5aaef74a (v7.4.18 → v7.4.21), including opencode v1.17.13 merge

## Summary
- Total changes planned: 24
- Critical: 3 | High: 8 | Medium: 9 | Low: 4

## Key Themes from Upstream
1. **Opencode v1.17.13 merge** — session model changes, provider refactors, tool registry updates
2. **Explicit prompt cache breakpoints** — new caching strategy for OpenAI/GPT-5+ (excluded for ChatGPT subscriptions)
3. **Deny provenance / tool approval reasoning** — track *why* tool calls were auto-approved or denied
4. **Grep signal controls** — signal-to-noise controls for grep tool
5. **Send-file tool** — new remote CLI file delivery tool
6. **Schema package extraction** — types moved from core to `@opencode-ai/schema`
7. **Session resume** — resume Claude and Codex sessions
8. **Skill-shell permission fix** — inline code spans no longer trigger permission prompts
9. **Sandbox settings applied to existing sessions**
10. **Sessionless model catalog** endpoint

---

## Changes

### 1. Add explicit prompt cache breakpoint helper for OpenAI models
**File**: `src/providers/openai/prompt-cache.ts` (new)
**Priority**: high
**Type**: feature
**Reason**: Upstream added explicit prompt cache breakpoints for GPT-5.6+ on stable prefix, restricted to Vercel AI SDK path, and excludes ChatGPT subscriptions (which manage caching automatically). Aligns SAP AI Core OpenAI routes with new caching behavior for cost savings.

**New code**:
```typescript
// src/providers/openai/prompt-cache.ts
import type { LanguageModelV2Prompt } from "@ai-sdk/provider"

/**
 * Determines if a provider/model supports explicit prompt cache breakpoints.
 * Excludes ChatGPT subscription accounts (they cache implicitly).
 */
export function supportsPromptCacheBreakpoint(opts: {
  providerId: string
  modelId: string
  isChatGPTSubscription?: boolean
}): boolean {
  if (opts.isChatGPTSubscription) return false
  // GPT-5.6 and later support explicit cache breakpoints
  if (opts.providerId === "openai" || opts.providerId === "sap-ai-core") {
    return /gpt-5\.[6-9]|gpt-[6-9]/i.test(opts.modelId)
  }
  return false
}

/**
 * Zero-cost heuristic for detecting ChatGPT subscription accounts.
 * ChatGPT subscribers should not receive explicit cache breakpoints.
 */
export function isChatGPTSubscription(auth: {
  type?: string
  source?: string
}): boolean {
  return auth.type === "oauth" && auth.source === "chatgpt"
}

/**
 * Applies a cache breakpoint marker to the stable prefix of the prompt,
 * placed before trailing environment-details injection.
 */
export function applyCacheBreakpoint(
  prompt: LanguageModelV2Prompt,
): LanguageModelV2Prompt {
  // Find last stable content boundary (before env details / trailing user content)
  let breakpointIndex = -1
  for (let i = prompt.length - 1; i >= 0; i--) {
    const msg = prompt[i]
    if (msg.role === "system" || msg.role === "assistant") {
      breakpointIndex = i
      break
    }
  }
  if (breakpointIndex < 0) return prompt
  // Mark the message with cache_control (Anthropic-style) or provider-specific hint
  const result = [...prompt]
  const target = result[breakpointIndex]
  result[breakpointIndex] = {
    ...target,
    providerOptions: {
      ...(target as any).providerOptions,
      openai: { cacheBreakpoint: true },
    },
  } as any
  return result
}
```

---

### 2. Wire prompt cache breakpoints into SAP AI Core OpenAI provider
**File**: `src/providers/sap-ai-core.ts`
**Priority**: high
**Type**: feature
**Reason**: Apply the new cache breakpoint helper only on the Vercel AI SDK path, matching upstream's `applyCaching` scope. SAP AI Core routes OpenAI models through Vercel SDK.

**New code** (add to provider setup):
```typescript
import {
  supportsPromptCacheBreakpoint,
  applyCacheBreakpoint,
  isChatGPTSubscription,
} from "./openai/prompt-cache"

// In your request-building path:
async function prepareRequest(ctx: { providerId: string; modelId: string; auth: any; prompt: LanguageModelV2Prompt }) {
  const isChatGPT = isChatGPTSubscription(ctx.auth)
  if (supportsPromptCacheBreakpoint({
    providerId: ctx.providerId,
    modelId: ctx.modelId,
    isChatGPTSubscription: isChatGPT,
  })) {
    return { ...ctx, prompt: applyCacheBreakpoint(ctx.prompt) }
  }
  return ctx
}
```

---

### 3. Track denial provenance on tool call permission metadata
**File**: `src/permission/provenance.ts` (new)
**Priority**: high
**Type**: feature
**Reason**: Upstream added `packages/opencode/src/kilocode/permission/provenance.ts` (+64 lines) and `deny-provenance.test.ts` to record *which* rule decided a denial. Makes auto-approvals/denials debuggable and lets the UI explain the decision to users. Critical for enterprise SAP compliance auditing.

**New code**:
```typescript
// src/permission/provenance.ts
export interface PermissionProvenance {
  decision: "allow" | "deny" | "ask"
  ruleSource: "config" | "session" | "agent" | "sandbox" | "default"
  ruleId?: string
  ruleDescription?: string
  matchedPattern?: string
  reason?: string
}

export function recordDenial(
  toolCallId: string,
  provenance: PermissionProvenance,
): void {
  denialStore.set(toolCallId, provenance)
}

export function getDenialProvenance(toolCallId: string): PermissionProvenance | undefined {
  return denialStore.get(toolCallId)
}

export function formatProvenanceMessage(p: PermissionProvenance): string {
  if (p.decision === "deny") {
    return `Denied by ${p.ruleSource} rule${p.ruleId ? ` "${p.ruleId}"` : ""}${p.reason ? `: ${p.reason}` : ""}`
  }
  if (p.decision === "allow") {
    return `Auto-approved by ${p.ruleSource}${p.matchedPattern ? ` (matched ${p.matchedPattern})` : ""}`
  }
  return "Awaiting approval"
}

const denialStore = new Map<string, PermissionProvenance>()
```

---

### 4. Attribute permission decisions in permission engine
**File**: `src/permission/index.ts`
**Priority**: high
**Type**: feature
**Reason**: Upstream `packages/opencode/src/permission/index.ts` (+13/-25) attributes denials to the specific rule that decided them. Enables reason display in UI/TUI.

**Current code** (approximate):
```typescript
async function checkPermission(toolCall: ToolCall): Promise<Decision> {
  for (const rule of rules) {
    if (matches(rule, toolCall)) {
      return rule.decision  // no provenance
    }
  }
  return "ask"
}
```

**New code**:
```typescript
import { recordDenial, type PermissionProvenance } from "./provenance"

async function checkPermission(toolCall: ToolCall): Promise<{ decision: Decision; provenance: PermissionProvenance }> {
  for (const rule of rules) {
    if (matches(rule, toolCall)) {
      const provenance: PermissionProvenance = {
        decision: rule.decision,
        ruleSource: rule.source ?? "config",
        ruleId: rule.id,
        ruleDescription: rule.description,
        matchedPattern: rule.pattern,
        reason: rule.reason,
      }
      if (rule.decision === "deny") {
        recordDenial(toolCall.id, provenance)
      }
      return { decision: rule.decision, provenance }
    }
  }
  return {
    decision: "ask",
    provenance: { decision: "ask", ruleSource: "default" },
  }
}
```

---

### 5. Add signal-to-noise controls to grep tool
**File**: `src/tool/grep-signal-controls.ts` (new)
**Priority**: medium
**Type**: feature
**Reason**: Upstream #12811 added `grep-signal-controls.ts` (+64) and test (+124). Reduces noise from grep results by filtering by relevance/frequency.

**New code**:
```typescript
// src/tool/grep-signal-controls.ts
export interface GrepSignalControls {
  maxResultsPerFile?: number
  minMatchLength?: number
  suppressBinaryLike?: boolean
  suppressGeneratedFiles?: boolean
  boostPathPatterns?: string[]
}

export function applySignalControls(
  matches: GrepMatch[],
  controls: GrepSignalControls,
): GrepMatch[] {
  let filtered = matches
  if (controls.suppressBinaryLike) {
    filtered = filtered.filter((m) => !looksBinary(m.line))
  }
  if (controls.suppressGeneratedFiles) {
    filtered = filtered.filter((m) => !isGeneratedFile(m.path))
  }
  if (controls.minMatchLength && controls.minMatchLength > 0) {
    filtered = filtered.filter((m) => m.match.length >= controls.minMatchLength!)
  }
  if (controls.maxResultsPerFile) {
    const perFile = new Map<string, number>()
    filtered = filtered.filter((m) => {
      const count = perFile.get(m.path) ?? 0
      perFile.set(m.path, count + 1)
      return count < controls.maxResultsPerFile!
    })
  }
  if (controls.boostPathPatterns?.length) {
    filtered = filtered.sort((a, b) => {
      const aBoost = controls.boostPathPatterns!.some((p) => a.path.includes(p)) ? 1 : 0
      const bBoost = controls.boostPathPatterns!.some((p) => b.path.includes(p)) ? 1 : 0
      return bBoost - aBoost
    })
  }
  return filtered
}

function looksBinary(line: string): boolean {
  return /[\x00-\x08\x0E-\x1F]/.test(line)
}

function isGeneratedFile(path: string): boolean {
  return /(\.min\.|\.gen\.|node_modules\/|dist\/|build\/|\.lock$)/.test(path)
}

interface GrepMatch { path: string; line: string; match: string; lineNumber: number }
```

---

### 6. Update grep tool to accept signal controls
**File**: `src/tool/grep.ts`
**Priority**: medium
**Type**: feature
**Reason**: Wire grep-signal-controls into the tool and expose new params in the schema.

**New code** (add to schema and handler):
```typescript
import { applySignalControls, type GrepSignalControls } from "./grep-signal-controls"

export const grepSchema = z.object({
  pattern: z.
{"prompt_tokens":125367,"completion_tokens":4096,"total_tokens":129463,"cache_read_input_tokens":0,"cache_creation_input_tokens":0}

[Session: fdb75b57-d0d8-4ca0-a888-2da9a6ad269d]
[Messages: 2, Tokens: 129463]
