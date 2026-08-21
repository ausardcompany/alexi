```markdown
# Update Plan for Alexi

Generated: 2026-08-21
Based on upstream commits analyzed:
- **opencode**: e11dbd0, c313504, e49772a, 08faeb3, 71d08e9
- **kilocode**: 36c57c12c (MCP Apps), c02134ab4, b7069922d, fe760ab02, 0d5d33448 (message-order), b8984e468 (watcher scoping), 6f87e9c22 (markdown viewer sidebar - N/A), permission/tool JetBrains parity (N/A for Alexi)

## Summary
- Total changes planned: 8
- Critical: 1 | High: 4 | Medium: 2 | Low: 1

The most relevant upstream changes for Alexi (which is primarily a TypeScript/Node fork focused on core, tool, agent, permission, and CLI systems) are:
1. **Subagent error surfacing** in Task tool (opencode c313504)
2. **Cerebras completion limit fix** (opencode e49772a)
3. **Subagent permission handling in `run` CLI** (opencode 08faeb3)
4. **xAI capacity retry** (opencode 71d08e9)
5. **MCP Apps experimental support** (kilocode 36c57c12c) — optional if MCP is in scope
6. **Watcher per-instance scoping** (kilocode b8984e468)
7. **Message ordering by created time** (kilocode 0d5d33448) — only if TUI is in scope

JetBrains-specific Kotlin changes (permission diff card, tool approval footer, workflows settings, logging config) are **not applicable** to Alexi and are excluded.

---

## Changes

### 1. Surface resumable subagent errors in Task tool
**File**: `src/tool/task.ts`
**Priority**: critical
**Type**: bugfix
**Reason**: Currently a failed subagent silently returns the last text part (often empty), masking real failures upstream. This causes the parent agent to proceed as if the subtask succeeded. Upstream commit `c313504` fixes this by failing the Effect with a descriptive error including the subsession id — critical for reliable multi-agent flows on SAP AI Core where quota/timeout errors are common.

**Current code** (approximate, in the `TaskTool` execute generator, after resolving the subagent result):
```typescript
Bus.publish(TaskEvent.Result, {
  sessionID: nextSession.id,
  agent: next.name,
  parts,
})
return result.parts.findLast((item) => item.type === "text")?.text ?? ""
```

**New code**:
```typescript
Bus.publish(TaskEvent.Result, {
  sessionID: nextSession.id,
  agent: next.name,
  parts,
})
if (result.info.role === "assistant" && result.info.error) {
  const message =
    "message" in result.info.error.data &&
    typeof result.info.error.data.message === "string"
      ? result.info.error.data.message
      : result.info.error.name
  return yield* Effect.fail(
    new Error(`Subagent failed (task_id: ${nextSession.id}): ${message}`),
  )
}
return result.parts.findLast((item) => item.type === "text")?.text ?? ""
```

**Test update** (`src/tool/task.test.ts` or equivalent): mirror opencode's `stubOps` extension to accept an `error` param, then add a test that asserts `Exit.isFailure` with a `Cause` mentioning `Subagent failed (task_id:`. See upstream `packages/opencode/test/tool/task.test.ts` diff.

---

### 2. Answer subagent permission requests in CLI `run`
**File**: `src/cli/cmd/run.ts`
**Priority**: high
**Type**: bugfix
**Reason**: Upstream commit `08faeb3` fixes a case where `opencode run` (non-interactive) would hang when a subagent triggered a permission prompt. The CLI must auto-answer (typically deny or apply the configured policy) permission requests originating from subagents. Alexi's `run` command likely inherits the same defect.

**Current code** (approximate — inside the permission subscription in `run.ts`):
```typescript
Bus.subscribe(Permission.Event.Updated, async (event) => {
  if (event.properties.sessionID !== session.id) return
  // handle permission ...
})
```

**New code**:
```typescript
Bus.subscribe(Permission.Event.Updated, async (event) => {
  // Also handle permission requests from subagent sessions spawned by this run.
  const isOwnSession = event.properties.sessionID === session.id
  const isSubagentSession = subagentSessionIds.has(event.properties.sessionID)
  if (!isOwnSession && !isSubagentSession) return
  // handle permission (respect --auto-approve / --deny flags) ...
})
```

Track subagent session ids by subscribing to `TaskEvent.Started` (or equivalent) and adding `event.properties.sessionID` to a local `Set<string>`. Cross-check upstream `packages/opencode/src/cli/cmd/run.ts` (+6, -1) for the minimal patch.

---

### 3. Preserve Cerebras completion limit
**File**: `src/plugin/cerebras.ts` (create if missing) and register in `src/plugin/index.ts`
**Priority**: high
**Type**: bugfix
**Reason**: Upstream commit `e49772a` adds a Cerebras-specific plugin that pins the completion token limit so the provider does not silently truncate. If Alexi supports Cerebras (or if SAP AI Core proxies Cerebras models), this same guard should exist.

**New code** (`src/plugin/cerebras.ts`):
```typescript
import type { Plugin } from "./index"

// Cerebras enforces a hard cap on max_completion_tokens; ensure we never
// exceed it and never lose an explicit user setting.
const CEREBRAS_MAX_COMPLETION_TOKENS = 32_768

export const CerebrasPlugin: Plugin = {
  name: "cerebras",
  "chat.params": async ({ provider, model, params }) => {
    if (provider.id !== "cerebras") return
    if (typeof params.maxTokens === "number") {
      params.maxTokens = Math.min(params.maxTokens, CEREBRAS_MAX_COMPLETION_TOKENS)
    }
  },
}
```

**Register in** `src/plugin/index.ts`:
```typescript
import { CerebrasPlugin } from "./cerebras"

export const BUILTIN_PLUGINS = [
  // ...existing plugins
  CerebrasPlugin,
]
```

**Skip if**: Alexi's SAP AI Core wrapper never routes to Cerebras. In that case, mark this change as **N/A** for the SAP fork.

---

### 4. Retry xAI capacity stream errors
**File**: `src/session/retry.ts` and `src/provider/error.ts`
**Priority**: high
**Type**: bugfix
**Reason**: Upstream commit `71d08e9` classifies xAI "capacity exceeded" mid-stream errors as retryable. Analogous SAP AI Core rate-limit errors likely already retry, but the xAI-specific classifier should be added if Alexi supports xAI models.

**Change in** `src/provider/error.ts` (add classification):
```typescript
// existing classifier
export function isRetryable(error: unknown): boolean {
  // ...existing checks
  if (isXAICapacityError(error)) return true
  return false
}

function isXAICapacityError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false
  const message = "message" in error && typeof error.message === "string" ? error.message : ""
  return /xai.*capacity|capacity.*exceeded/i.test(message)
}
```

**Change in** `src/session/retry.ts` — ensure the retry loop consults `isRetryable` (upstream added +1 line here; likely wiring the new classifier).

Add a test `src/provider/error.test.ts` covering the new case (upstream added `+24` lines to `test/provider/error.test.ts`).

---

### 5. Scope watcher state per instance
**File**: `src/kilocode/watcher.ts` (or `src/watcher/` in Alexi's layout)
**Priority**: high
**Type**: refactor / bugfix
**Reason**: Upstream commit `b8984e468` refactors the file watcher so its state is scoped to a single instance rather than module-global. This prevents cross-talk between concurrent sessions/workspaces — important for Alexi if multiple SAP AI Core workspaces run in the same process.

**Current code** (approximate — module-level state):
```typescript
// Module-scoped maps
const watchers = new Map<string, FSWatcher>()
const debouncers = new Map<string, NodeJS.Timeout>()

export function startWatcher(path: string) { /* uses watchers/debouncers */ }
```

**New code**:
```typescript
export class InstanceWatcher {
  private readonly watchers = new Map<string, FSWatcher>()
  private readonly debouncers = new Map<string, NodeJS.Timeout>()

  start(path: string): void { /* ... */ }
  stop(path: string): void { /* ... */ }
  dispose(): void {
    for (const w of this.watchers.values()) w.close()
    for (const t of this.debouncers.values()) clearTimeout(t)
    this.watchers.clear()
    this.debouncers.clear()
  }
}

// Legacy function-style API kept as a thin wrapper for backward compat:
const defaultInstance = new InstanceWatcher()
export const startWatcher = (path: string) => defaultInstance.start(path)
```

Add per-session ownership so each session/instance holds its own `InstanceWatcher`. Update the existing watcher tests (upstream: `packages/opencode/test/kilocode/instance-vcs-watcher.test.ts` +101/-38) to cover isolation between instances.

---

### 6. MCP Apps experimental HTTP endpoints
**File**: `src/kilocode/mcp/apps.ts` (new) and `src/kilocode/server/httpapi/groups/kilocode.ts`, `handlers/kilocode.ts`
**Priority**: medium
**Type**: feature
**Reason**: Upstream commits `36c57c12c`, `c02134ab4`, `b7069922d`, and `294e8fe6b` add experimental MCP Apps support (resource + tool endpoints, tightened `callTool` error handling). Only worth pulling if Alexi exposes an HTTP surface for MCP tooling. Behind an experimental flag by default.

**New file** `src/kilocode/mcp/apps.ts` (~80 lines mirroring upstream):
```typescript
import { Effect } from "effect"
import { MCP } from "@/mcp"

export namespace MCPApps {
  export const listResources = Effect.fn("MCPApps.listResources")(function* (server: string) {
    const client = yield* MCP.client(server)
    return yield* Effect.tryPromise({
      try: () => client.listResources(),
      catch: (cause) => new MCPAppsError({ operation: "listResources", server, cause }),
    })
  })

  export const callTool = Effect.fn("MCPApps.callTool")(function* (
    server: string,
    tool: string,
    args: Record<string, unknown>,
  ) {
    const client = yield* MCP.client(server)
    return yield* Effect.tryPromise({
      try: () => client.callTool({ name: tool, arguments: args }),
      catch: (cause) => new MCPAppsError({ operation: "callTool", server, tool, cause }),
    })
  })

  export class MCPAppsError extends Error {
    constructor(
      readonly detail: { operation: string; server: string; tool?: string; cause: unknown },
    ) {
      super(
{"prompt_tokens":35205,"completion_tokens":4096,"total_tokens":39301,"cache_read_input_tokens":0,"cache_creation_input_tokens":0}

[Session: 6b03db1d-2a05-47e3-a36f-98720461484a]
[Messages: 2, Tokens: 39301]
