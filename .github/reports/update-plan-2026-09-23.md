# Update Plan for Alexi

Generated: 2026-09-23
Based on upstream commits: kilocode f47c29dfe..95b45e54e, opencode 70a2469..18ef3cc

## Summary
- Total changes planned: 14
- Critical: 2 | High: 5 | Medium: 4 | Low: 3

Focus areas:
1. **Security/correctness**: Cloudflare AI Gateway token scoping, ripgrep surrogate handling, npm entry resolution under Node
2. **Bug fixes**: Empty compaction sessions, retry logic, compaction prompt clarity
3. **Features**: Context tools, cron/wakeup scheduling, PR linking, background process monitor
4. **Provider updates**: gitlab-ai-provider, google-vertex, ai-gateway-provider bumps

## Changes

### 1. Fix Cloudflare AI Gateway token leakage to third-party providers
**File**: `src/providers/cloudflare-ai-gateway.ts` (if present) or wherever CF gateway is wired
**Priority**: critical
**Type**: security
**Reason**: Currently, the Cloudflare API key is forwarded as an upstream `Authorization` header for every model routed through the gateway. Third-party providers (OpenAI, Anthropic via CF) must NOT receive the Cloudflare token — only Workers AI (first-party) should. This is a token-exposure bug.

**Current code**:
```typescript
const unified = createUnified({ apiKey: config.apiKey })
evt.sdk = {
  languageModel(modelID: string) {
    return gateway(unified(modelID))
  },
}
```

**New code**:
```typescript
evt.sdk = {
  languageModel(modelID: string) {
    // Workers AI is the only first-party provider whose upstream is Cloudflare itself, so
    // it is the only one that should receive the Cloudflare token as its upstream
    // Authorization header. The Unified API addresses Workers AI both with the explicit
    // "workers-ai/" prefix and as bare "@cf/..." ids. Third-party providers must not
    // receive the token; they rely on the gateway's stored/BYOK keys instead.
    const isWorkersAi = modelID.startsWith("workers-ai/") || modelID.startsWith("@cf/")
    const unified = createUnified(isWorkersAi ? { apiKey: config.apiKey } : {})
    return gateway(unified(modelID))
  },
}
```

If Alexi does not integrate the CF AI Gateway, mark this as N/A but confirm no similar leakage in the SAP AI Core provider wrapper.

---

### 2. Fix ripgrep surrogate-pair truncation
**File**: `src/core/ripgrep.ts` (or equivalent search utility)
**Priority**: high
**Type**: bugfix
**Reason**: Slicing at exactly 2000 chars can leave a dangling high surrogate (U+D800–U+DBFF), producing invalid UTF-16 output that breaks downstream JSON serialization and TUI rendering.

**Current code**:
```typescript
text: match.lines.text.length > 2_000
  ? match.lines.text.slice(0, 2_000) + "..."
  : match.lines.text,
```

**New code**:
```typescript
text: match.lines.text.length > 2_000
  ? match.lines.text.slice(0, 2_000).replace(/[\uD800-\uDBFF]$/, "") + "..."
  : match.lines.text,
```

---

### 3. Fix npm package entry resolution under Node
**File**: `src/core/npm.ts` (or plugin loader utility)
**Priority**: high
**Type**: bugfix
**Reason**: `import.meta.resolve(parent)` requires `--experimental-import-meta-resolve` on Node, and `import()` of a bare directory fails with `ERR_UNSUPPORTED_DIR_IMPORT`. Use `createRequire` to correctly resolve the package's `require`/`default` export target under Node.

**Current code**:
```typescript
const resolveEntryPoint = (name: string, dir: string): EntryPoint => {
  let entrypoint: string | undefined
  try {
    entrypoint = typeof Bun !== "undefined"
      ? import.meta.resolve(name, dir)
      : import.meta.resolve(dir)
  } catch {
    entrypoint = undefined
  }
  // ...
}
```

**New code**:
```typescript
import path from "path"
import { createRequire } from "module"
import { pathToFileURL } from "url"

const resolveEntryPoint = (name: string, dir: string): EntryPoint => {
  let entrypoint: string | undefined
  try {
    // Node only honors the parent argument behind --experimental-import-meta-resolve, and
    // import() of the bare package directory fails with ERR_UNSUPPORTED_DIR_IMPORT. require
    // resolution picks the "require"/"default" export target, which import() loads fine.
    entrypoint = typeof Bun !== "undefined"
      ? import.meta.resolve(name, dir)
      : pathToFileURL(createRequire(path.join(dir, "package.json")).resolve(name)).href
  } catch {
    entrypoint = undefined
  }
  // ...
}
```

---

### 4. Keep session alive when compaction returns an empty summary
**File**: `src/core/session/compaction.ts`
**Priority**: high
**Type**: bugfix
**Reason**: Upstream fix (opencode #14318): if the compaction LLM returns an empty/whitespace summary, the current code destroys the session state. Instead, fall back to preserving the existing summary and log a warning.

**New code** (defensive check around summary extraction):
```typescript
export async function compactSession(session: Session, opts: CompactOpts) {
  const result = await runCompactionLLM(session, opts)
  const summary = result?.summary?.trim()

  if (!summary) {
    // Empty compaction — do NOT discard existing history/summary.
    log.warn("compaction returned empty summary; keeping existing session state", {
      sessionId: session.id,
    })
    return { ok: false as const, reason: "empty-summary" }
  }

  // ...existing replacement logic
}
```

Also update `src/core/session/runner/llm.ts` if it forwards an empty text through — add a guard to surface an explicit event rather than swallowing.

---

### 5. Update compaction prompt for clarity with smaller models
**File**: `src/agent/prompt/compaction.txt` (or wherever the compaction system prompt lives)
**Priority**: medium
**Type**: refactor
**Reason**: Upstream reverted the "anchored summarization" prompt to a simpler, more explicit "context summarization agent" formulation. Smaller models (DSv4 Flash class) follow it more reliably.

**Current code**:
```text
You are an anchored context summarization assistant for coding sessions.

Summarize only the conversation history you are given. The newest turns may be kept
verbatim outside your summary, so focus on the older context that still matters for
continuing the work.

If the prompt includes a <previous-summary> block, treat it as the current anchored
summary. Update it with the new history by preserving still-true details, removing
stale details, and merging in new facts.

Always follow the exact output structure requested by the user prompt. Keep every
section, preserve exact file paths and identifiers when known, and prefer terse
bullets over paragraphs.

Do not answer the conversation itself. Do not mention that you are summarizing,
compacting, or merging context. Respond in the same language as the conversation.
```

**New code**:
```text
You are a context summarization agent. You are given a conversation between a user
and an agent. Your goal is to produce a structured summary matching the format
specified so another coding agent can continue the work.

Always follow the exact output structure requested by the user prompt. Keep every
section, preserve exact file paths and identifiers when known, and prefer terse
bullets over paragraphs.

Do not continue the conversation. Do not respond to any questions in the conversation.
Only output the structured summary in the exact format requested by the user prompt.
Respond in the same language as the conversation.
```

---

### 6. Add context self-inspection tools (experimental)
**File**: `src/tool/context.ts` (NEW)
**Priority**: medium
**Type**: feature
**Reason**: Upstream `feat(cli): add experimental self-context tools (#14268)` — lets the agent introspect its own message/token budget. Useful for long SAP conversations to avoid abrupt compaction.

**New code** (adapted skeleton — full port from `packages/opencode/src/kilocode/tool/context.ts`):
```typescript
import { Tool } from "./tool"
import { z } from "zod"

export const ContextInspectTool = Tool.define("context_inspect", {
  description:
    "Report the current session's approximate token usage, message count, and " +
    "distance to the compaction threshold. Use before large operations.",
  parameters: z.object({}),
  async execute(_input, ctx) {
    const session = await ctx.session.current()
    const tokens = session.tokens ?? { input: 0, output: 0 }
    const total = tokens.input + tokens.output
    const budget = session.tokenBudget ?? 0
    return {
      messageCount: session.messages.length,
      tokens: total,
      budget,
      utilization: budget > 0 ? total / budget : null,
    }
  },
})
```

Register behind a feature flag (mirror upstream `experimental.contextTools`) in `src/tool/registry.ts`.

**Gating in registry**:
```typescript
if (config.experimental?.contextTools) {
  registry.register(ContextInspectTool)
  registry.register(ContextSummarizeTool)
}
```

---

### 7. Add background process monitor + session cron scheduling
**File**: `src/tool/cron.ts` (NEW), `src/tool/background-process.ts` (extend), `src/kilocode/wakeup/cron.ts` (NEW)
**Priority**: medium
**Type**: feature
**Reason**: Upstream `feat(cli): add background process monitor and session cron scheduling (#14312)`. Enables scheduled resumption of sessions and monitored background procs. Assess whether SAP deployment context needs cron — if Alexi runs headless/service mode, this is useful; if strictly interactive, defer.

**Recommendation**: **defer to a follow-up PR** unless Alexi already has a session persistence layer. Requires:
- Persistent cron store (SQLite via existing session sql layer)
- Wakeup dispatcher wired to session runner
- Permission gating (cron creation should require user confirmation)

If adopting, port these files verbatim with SAP-appropriate tool naming:
- `src/tool/cron.ts` (register, list, delete)
- `src/tool/cron-{create,delete,list}.txt` (tool prompts)
- `src/kilocode/wakeup/cron.ts` (scheduler)
- Add tests: `test/tool/cron.test.ts`, `test/wakeup/cron.test.ts`

---

### 8. Add PR link tool and remote-check
**File**: `src/tool/link-pr.ts` (NEW)
**Priority**: low
**Type**: feature
**Reason**: Upstream `feat(cli): link sessions to pull requests via tool and remote check (#14315)`. Only useful if Alexi surfaces PR context. For SAP-internal git remotes (e.g., GitHub Enterprise), the remote-check heuristic must be validated.

**Action**: Port only if PR-linking is a product requirement. Adjust `github.com` heuristics to also accept configured internal hosts.

---

### 9. Skip auth loaders for providers excluded by `enabled_providers`
**File**: `src/providers/registry.ts` or `src/cli/provider-init.ts`
**Priority**: high
**Type**: bugfix
**
{"prompt_tokens":54526,"completion_tokens":4096,"total_tokens":58622,"cache_read_input_tokens":0,"cache_creation_input_tokens":0}

[Session: ad0d8c16-5039-4a89-90ba-cbae9e3d3ffd]
[Messages: 2, Tokens: 58622]
