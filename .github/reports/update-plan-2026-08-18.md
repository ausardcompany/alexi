# Update Plan for Alexi

Generated: 2026-08-18
Based on upstream commits analyzed:
- kilocode: 4239f9d98..91a337e31 (52 commits)
- opencode: 4d68d30..4e81a0b (9 commits)

## Summary
- Total changes planned: 6
- Critical: 0 | High: 2 | Medium: 3 | Low: 1

Most kilocode changes are VS Code webview/UI, docs, and internal test updates that do not map to Alexi's architecture (tool system, agent system, permission system, bus, core orchestration, providers, router, CLI). The relevant, actionable changes are:

1. Config schema addition: `mcp_tool_display` (kilocode)
2. OpenCode default server URL change (opencode)
3. Google Vertex SDK bump (opencode)
4. Codex data residency handling (opencode)
5. Codex WebSocket oversized request fallback (opencode)
6. Streaming/scroll behavior — informational only (kilocode UI, no direct mapping)

---

## Changes

### 1. Add `mcp_tool_display` field to core config schema
**File**: `src/core/config/config.ts` (or equivalent — wherever Alexi mirrors `packages/core/src/v1/config/config.ts`)
**Priority**: medium
**Type**: feature
**Reason**: Upstream added a new optional config option `mcp_tool_display` in `Info` schema controlling whether MCP and generic tool blocks are expanded/collapsed by default. Alexi should mirror this so serialized configs from upstream remain compatible and so any UI/CLI rendering of MCP tool output can respect the same knob. This is additive and non-breaking.

**Current code**:
```typescript
export const Info = Schema.Struct({
  // ... existing fields
  code_edit_display: Schema.optional(Schema.Literals(["expanded", "collapsed"])).annotate({
    description:
      "Controls whether code edit and diff blocks are expanded or collapsed by default in the VS Code chat UI",
  }),
  hide_prompt_training_models: Schema.optional(Schema.Boolean).annotate({
    description: "Hide Kilo Gateway models that may train on your prompts from model listings",
  }),
  // ...
})
```

**New code**:
```typescript
export const Info = Schema.Struct({
  // ... existing fields
  code_edit_display: Schema.optional(Schema.Literals(["expanded", "collapsed"])).annotate({
    description:
      "Controls whether code edit and diff blocks are expanded or collapsed by default in the VS Code chat UI",
  }),
  mcp_tool_display: Schema.optional(Schema.Literals(["expanded", "collapsed"])).annotate({
    description:
      "Controls whether MCP and generic tool blocks are expanded or collapsed by default in the chat UI",
  }),
  hide_prompt_training_models: Schema.optional(Schema.Boolean).annotate({
    description: "Hide Kilo Gateway models that may train on your prompts from model listings",
  }),
  // ...
})
```

Also update any config type re-exports / SDK type generation in Alexi to include the new field. If Alexi has a display context (similar to `webview-ui/src/context/display.tsx`), thread the new field through with default `"collapsed"` (matching upstream default behavior).

---

### 2. Update OpenCode default console/server URL
**File**: `src/providers/opencode.ts` (or wherever Alexi defines the OpenCode/Zen provider defaults; mirrors `packages/core/src/plugin/provider/opencode.ts`)
**Priority**: high
**Type**: bugfix
**Reason**: Upstream changed the default console URL from `https://console.opencode.ai` to `https://opencode.ai/console`. The old subdomain may be deprecated; keeping the stale URL will break OAuth device flow / config fetching against upstream servers. **However**, since Alexi targets SAP AI Core, verify whether Alexi uses this default at all before changing. If Alexi has its own SAP-hosted console URL, leave it untouched and only update if the fallback is genuinely the public opencode.ai console.

**Current code**:
```typescript
const defaultServer = "https://console.opencode.ai"
```

**New code**:
```typescript
const defaultServer = "https://opencode.ai/console"
```

**SAP guard**: If Alexi already overrides `defaultServer` for SAP AI Core, leave it as-is and only note this in comments:
```typescript
// Upstream default is https://opencode.ai/console (was console.opencode.ai)
// Alexi uses SAP AI Core endpoint below.
const defaultServer = process.env.ALEXI_CONSOLE_URL ?? "https://opencode.ai/console"
```

---

### 3. Bump `@ai-sdk/google-vertex` dependency
**File**: `package.json` (root or `packages/core/package.json` equivalent in Alexi)
**Priority**: medium
**Type**: bugfix (dependency)
**Reason**: Upstream bumped `@ai-sdk/google-vertex` from `4.0.128` → `4.0.181`. The bump likely contains bug fixes and Vertex API compatibility fixes. Since Alexi's primary target is SAP AI Core, this only matters if Alexi retains the Google Vertex provider. If so, mirror the bump to stay compatible with the shared AI SDK peer versions (`@ai-sdk/gateway`, `@ai-sdk/google`, etc.).

**Current code**:
```json
"@ai-sdk/google-vertex": "4.0.128",
```

**New code**:
```json
"@ai-sdk/google-vertex": "4.0.181",
```

After bumping, run:
```bash
bun install
# or npm/pnpm equivalent, plus run type-checks
```

Also check `nix/hashes.json` if Alexi mirrors that infrastructure.

---

### 4. Port Codex data-residency fix and WebSocket oversized-request fallback
**File**: `src/providers/codex.ts` and `src/providers/ws-pool.ts`, `src/providers/ws.ts` (mirrors `packages/opencode/src/plugin/openai/codex.ts`, `ws-pool.ts`, `ws.ts`)
**Priority**: high
**Type**: bugfix
**Reason**: Two related upstream fixes:
- `a97fec8 fix: codex data residency (#42432)` — regional routing correctness for OpenAI Codex.
- `7af274a fix(core): fall back on oversized websocket requests (#43099)` — when a WS payload exceeds the frame/size limit, fall back to HTTP (or chunked path) instead of failing.

If Alexi vendors the OpenAI Codex plugin (or an SAP-adapted variant), port both changes. These are real reliability fixes.

**Approach** (illustrative — actual diff hunks not in report; fetch from upstream commits `a97fec8` and `7af274a`):

`src/providers/codex.ts`:
```typescript
// Add data-residency-aware endpoint resolution
function resolveCodexEndpoint(opts: { region?: string; account?: Account }): string {
  // Prefer account-declared region, then env override, then default global
  const region = opts.account?.dataResidency ?? opts.region ?? process.env.CODEX_REGION
  switch (region) {
    case "eu":
      return "https://eu.api.openai.com/v1/codex"
    case "us":
      return "https://api.openai.com/v1/codex"
    default:
      return "https://api.openai.com/v1/codex"
  }
}
```

`src/providers/ws.ts` — oversized message fallback:
```typescript
const MAX_WS_PAYLOAD = 1 * 1024 * 1024 // 1 MiB, tune to upstream

async function sendRequest(payload: unknown): Promise<Response> {
  const serialized = JSON.stringify(payload)
  if (serialized.length > MAX_WS_PAYLOAD) {
    // Fall back to HTTP for oversized requests
    return httpFallback(payload)
  }
  try {
    return await wsSend(serialized)
  } catch (err) {
    if (isOversizedError(err)) return httpFallback(payload)
    throw err
  }
}
```

Also update `ws-pool.ts` to not evict/mark-bad a socket that returned an oversized error — the socket is still healthy.

Port corresponding tests from `packages/opencode/test/plugin/codex.test.ts` (+169 lines) and `packages/opencode/test/plugin/openai-ws.test.ts` (+26 lines).

---

### 5. Adopt "keep queued messages visible" & "preserve cached reasoning variants" semantics in session state (if applicable)
**File**: `src/core/session/session-queue.ts`, `src/core/session/session-variants.ts` (only if Alexi has session-level queuing and reasoning variant caching)
**Priority**: medium
**Type**: bugfix
**Reason**: Upstream fixed two subtle regressions:
- Queued messages disappeared visually before being processed (`f1909f9c4`).
- Cached reasoning variants were dropped when the default reasoning changed (`60aee1118`).

If Alexi has analogous logic (webview session context is UI-specific, but the queueing/variant caching semantics may be mirrored server-side), port the invariants:

```typescript
// session-queue.ts
// Keep queued messages in visible state until server acks consumption,
// not just until they are dispatched.
export function markQueued(state, msg) {
  return { ...state, queue: [...state.queue, { ...msg, visible: true, status: "queued" }] }
}
export function markConsumed(state, id) {
  return { ...state, queue: state.queue.filter(m => m.id !== id) }
}
```

```typescript
// session-variants.ts
// Preserve previously-cached reasoning variants when default reasoning changes;
// only invalidate entries whose reasoning key no longer maps to a known variant.
export function reconcileVariants(cached, availableKeys) {
  const kept = Object.fromEntries(
    Object.entries(cached).filter(([k]) => availableKeys.includes(k))
  )
  return kept
}
```

Skip this item entirely if Alexi does not maintain reasoning variant caches or a visible queue state on the core side.

---

### 6. Optional: mirror `.changeset` discipline for these ports
**File**: `.changeset/*.md`
**Priority**: low
**Type**: refactor (process)
**Reason**: Upstream adds a `.changeset/*.md` per change. If Alexi uses changesets, add corresponding entries for items 1–5 so release notes stay traceable.

**New files** (examples):
```markdown
---
"@alexi/core": patch
---

Add `mcp_tool_display` config option (mirrors kilocode #13010 lineage).
```

```markdown
---
"@alexi/core": patch
---

Codex: data-residency-aware endpoint routing and oversized WebSocket request HTTP fallback (mirrors opencode #42432, #43099).
```

---

## Skipped Upstream Changes (with rationale)

- **All `packages/kilo-vscode/webview-ui/**` changes** — VS Code webview UI (React components, i18n, timeline utilities, agent-manager). Alexi is a CLI/backend for SAP AI Core; no webview surface to update.
- **All `packages/kilo-docs/**` and `packages/web/src/content/docs/**` changes** — documentation only.
- **`packages/opencode/src/kilocode/plan-followup.ts`** — kilocode-specific plan → code model switching. Only port if Alexi has a "plan mode" agent orchestration; otherwise skip.
- **`packages/opencode/src/cli/cmd/account.ts`, `console/app/**`** — kiloc
{"prompt_tokens":10352,"completion_tokens":4096,"total_tokens":14448,"cache_read_input_tokens":0,"cache_creation_input_tokens":0}

[Session: 4347b642-5c45-4870-a55b-2f00a6b9f568]
[Messages: 2, Tokens: 14448]
