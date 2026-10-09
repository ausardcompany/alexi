# Update Plan for Alexi

Generated: 2026-10-09
Based on upstream commits analyzed:
- kilocode: b3036eb73 (68 commits since bed08b09e)
- opencode: 3884062 (6 commits since 5d9cd9b)

## Summary
- Total changes planned: 10
- Critical: 1 | High: 4 | Medium: 3 | Low: 2

## Changes

### 1. Create session-scoped temp directory helper for cloud sessions
**File**: `src/tool/shell-tmp.ts` (new file)
**Priority**: critical
**Type**: security
**Reason**: Cloud sessions enforce an allowlist that only permits `/tmp/<SESSION_ID>/**`. Without this helper, the shell tool prompt advertises `Global.Path.tmp` (which may follow `TMPDIR`) and the model will attempt writes to denied paths. This is a sandbox-escape-prevention and reliability fix. Mirrors kilocode `packages/opencode/src/kilocode/tool/shell-tmp.ts`.

**New code**:
```typescript
// src/tool/shell-tmp.ts
// Cloud sessions allowlist a session-scoped temp dir instead of the shared one.
//
// The platform injects `external_directory` rules permitting only
// `/tmp/<SESSION_ID>/**` (plus a few session-scoped roots) and denying
// everything else, while the bash tool description otherwise advertises the
// shared `Global.Path.tmp`. Naming the session dir here keeps the guidance
// within the permitted set.
import fs from "node:fs"
import path from "node:path"
import { Global } from "@opencode-ai/core/global"

// The allowlist root is the literal `/tmp`, not `os.tmpdir()`: `os.tmpdir()`
// follows `TMPDIR`, so deriving from it could point the model back at a denied
// path if that override ever reaches the server process.
const ALLOWLIST_ROOT = "/tmp"

export function sessionTmp(): string {
  const cloud = process.env["KILO_CLOUD_AGENT"]?.toLowerCase()
  if (cloud !== "true" && cloud !== "1") return Global.Path.tmp
  const session = process.env.SESSION_ID
  if (!session || !/^[A-Za-z0-9_-]+$/.test(session)) return Global.Path.tmp
  const dir = path.join(ALLOWLIST_ROOT, session)
  try {
    fs.mkdirSync(dir, { recursive: true, mode: 0o700 })
    // lstat, not stat: a pre-existing symlink must not redirect the advertised dir
    if (!fs.lstatSync(dir).isDirectory()) return Global.Path.tmp
    return dir
  } catch {
    return Global.Path.tmp
  }
}
```

---

### 2. Use session-scoped tmp dir in shell prompt rendering
**File**: `src/tool/prompt.ts` (or wherever shell prompt is rendered in Alexi; adjust path if named `shell/prompt.ts`)
**Priority**: critical
**Type**: security
**Reason**: Pairs with change #1 — ensures the model sees the correct advertised temp path when running under cloud/sandbox contexts. SAP AI Core integration unaffected because `KILO_CLOUD_AGENT` is not set by default.

**Current code**:
```typescript
import { Global } from "@opencode-ai/core/global"
// ...
tmp: Global.Path.tmp,
```

**New code**:
```typescript
import { sessionTmp } from "./shell-tmp" // kilocode_change
// ...
tmp: sessionTmp(), // kilocode_change - session-scoped temp dir in cloud sessions
```

---

### 3. Tighten Agent Manager tool prompt — require explicit user intent
**File**: `src/tool/agent-manager.txt.ts` (or equivalent prompt string file)
**Priority**: high
**Type**: feature
**Reason**: Prevents the model from autonomously spawning Agent Manager worktrees/sessions "to parallelize", which costs disk space, tokens, and surprises users. User-safety / cost control fix.

**Current code** (paragraph starting with "To start sessions"):
```
To start sessions, keep using the existing `mode` and `tasks` input without an action. Use start mode when the user explicitly asks you to fan out work into Agent Manager, create Agent Manager worktrees, or start multiple Agent Manager sessions for independent tasks.
```

**New code**:
```
To start sessions, keep using the existing `mode` and `tasks` input without an action. Start sessions only when the user explicitly asks for new Agent Manager sessions or worktrees, or after you confirm with the user first. Never start them on your own to parallelize, delegate, or organize routine work: each session is user-visible and each worktree costs disk space and tokens.
```

---

### 4. Add Task tool usage disambiguation description
**File**: `src/tool/task.ts`
**Priority**: high
**Type**: feature
**Reason**: Clarifies to the model that `task` subagents are internal (no visible session, no worktree), distinct from `agent_manager`. Reduces incorrect routing between the two tools. Mirrors kilocode `KiloTask.usageDescription`.

**New code** (add export in task helpers / KiloTask namespace):
```typescript
export const usageDescription =
  "Subagents launched with this tool are internal to the current session and create no worktrees or interactive sessions. To start visible Agent Manager sessions, use `agent_manager` only when the user explicitly asks."
```

**Current code** (TaskTool `description`):
```typescript
description: [
  DESCRIPTION,
  ...(flags.experimentalBackgroundSubagents ? [BACKGROUND_DESCRIPTION] : []),
  KiloTask.modelDescription,
].join("\n\n"),
```

**New code**:
```typescript
description: [
  DESCRIPTION,
  KiloTask.usageDescription, // kilocode_change
  ...(flags.experimentalBackgroundSubagents ? [BACKGROUND_DESCRIPTION] : []),
  KiloTask.modelDescription,
].join("\n\n"),
```

---

### 5. Resolve bare / slash-containing task model names from the catalog
**File**: `src/tool/task.ts`
**Priority**: high
**Type**: bugfix
**Reason**: When a user configures a task subagent with a bare model name (e.g. `codestral`) or a display name containing a slash (e.g. `codestral (latest)`), the current `parse()` splits on `/` and produces an empty `modelID`, which breaks subagent dispatch. Important for SAP AI Core which exposes model IDs that may not follow strict `provider/model` structure. Fixes kilocode issue #14037.

**Current code**:
```typescript
function parse(value: string | null | undefined): Model | undefined {
  if (!value) return undefined
  const [providerID, ...parts] = value.split("/")
  return {
    providerID: ProviderV2.ID.make(providerID),
    modelID: ModelV2.ID.make(parts.join("/")),
  }
}
```

**New code**:
```typescript
function parse(value: string | null | undefined): Model | undefined {
  if (!value) return undefined
  const [providerID, ...parts] = value.split("/")
  const modelID = parts.join("/")
  if (!providerID || !modelID) return undefined
  return {
    providerID: ProviderV2.ID.make(providerID),
    modelID: ModelV2.ID.make(modelID),
  }
}

/**
 * Resolve a configured model reference. A value is matched against the
 * provider catalog by qualified `provider/model` key, model ID, then display
 * name, preferring the parent session's provider so a custom provider's
 * display name resolves to that provider's model instead of failing with an
 * empty model ID.
 */
export const resolve = Effect.fn("KiloTask.resolve")(function* (input: {
  value: string
  preferred: string
  provider: Provider.Interface
}) {
  const value = input.value.trim()
  if (!value) return undefined
  const providers = yield* input.provider.list()
  const all = Object.values(providers).flatMap((provider) =>
    Object.values(provider.models).map((model) => ({ providerID: provider.id, model })),
  )
  const query = value.toLowerCase()

  // 1. Match by fully-qualified provider/model
  const qualified = all.filter(
    (item) => `${item.providerID}/${item.model.id}`.toLowerCase() === query,
  )
  if (qualified.length === 1) return { providerID: qualified[0].providerID, modelID: qualified[0].model.id }

  // 2. Match by model ID (prefer parent session's provider)
  const byId = all.filter((item) => item.model.id.toLowerCase() === query)
  if (byId.length >= 1) {
    const preferred = byId.find((item) => item.providerID === input.preferred) ?? byId[0]
    return { providerID: preferred.providerID, modelID: preferred.model.id }
  }

  // 3. Match by display name (prefer parent session's provider)
  const byName = all.filter((item) => (item.model.name ?? "").toLowerCase() === query)
  if (byName.length >= 1) {
    const preferred = byName.find((item) => item.providerID === input.preferred) ?? byName[0]
    return { providerID: preferred.providerID, modelID: preferred.model.id }
  }

  return undefined
})
```

Wire `resolve()` into the task subagent dispatch path so that when `parse()` returns undefined, Alexi falls back to catalog resolution before failing.

---

### 6. Clean up MCP servers when startup is interrupted
**File**: `src/mcp/cleanup.ts` (new) and `src/mcp/index.ts` (wire-up)
**Priority**: high
**Type**: bugfix
**Reason**: If an MCP client startup is cancelled (e.g. user Ctrl-C during init), the server process and streams can leak. This is a resource-leak fix. Important for long-running Alexi serve mode.

**New code** (`src/mcp/cleanup.ts`):
```typescript
import { Effect } from "effect"

export namespace McpCleanup {
  export const cleanupInterrupted = Effect.fn("McpCleanup.cleanupInterrupted")(
    function* (client: { close?: () => Promise<void> | void; transport?: { close?: () => Promise<void> | void } }) {
      yield* Effect.try({
        try: async () => {
          await client.close?.()
          await client.transport?.close?.()
        },
        catch: (e) => new Error(`mcp cleanup failed: ${String(e)}`),
      }).pipe(Effect.catchAll(() => Effect.void))
    },
  )
}
```

In `src/mcp/index.ts`, wrap the client-startup Effect with `Effect.onInterrupt` or `Effect.ensuring` to invoke `cleanupInterrupted` so a cancelled startup doesn't leave orphaned stdio processes.

---

### 7. Bound serve shutdown deadline after signals
**File**: `src/cli/cmd/serve.ts`
**Priority**: medium
**Type**: bugfix
**Reason**: On SIGINT/SIGTERM, graceful shutdown can hang indefinitely waiting on stuck connections. Add a hard timeout to force-exit after a bounded deadline. Fixes kilocode #14823.

**New code** (within signal handler):
```typescript
const SHUTDOWN_DEADLINE_MS = 10_000

function onSignal(sig: NodeJS.Signals) {
  console.log(`received ${sig}, shutting down...`)
  const forceExit = setTimeout(() => {
    console.
{"prompt_tokens":15610,"completion_tokens":4096,"total_tokens":19706,"cache_read_input_tokens":0,"cache_creation_input_tokens":0}

[Session: 0b7f559b-3c73-449d-8412-9641de97ae6a]
[Messages: 2, Tokens: 19706]
