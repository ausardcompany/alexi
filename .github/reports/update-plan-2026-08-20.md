```markdown
# Update Plan for Alexi

Generated: 2026-08-20
Based on upstream commits analyzed:
- kilocode: 0004b748b..9a6e081e4 (85 commits)
- opencode: da4730e..b155b15 (18 commits)

## Summary
- Total changes planned: 12
- Critical: 2 | High: 5 | Medium: 3 | Low: 2

## Analysis Overview

The bulk of upstream churn falls into four themes relevant to Alexi:

1. **PTY subsystem refactor** — kilocode extracted a dedicated registry module (`packages/core/src/kilocode/pty/registry.ts`) and hardened termination error handling (no more silent `[]` fallback on `ps` failures). It also added durability across reloads.
2. **Removal of "agent requirements" feature** — Kilo deleted the entire skill/MCP/VS Code extension requirements schema, controller, UI, CLI, tests, and i18n entries.
3. **SWE-pruner + task-aware output pruning removed** — experimental `swe-pruner.ts` (264 lines) and related session prompt/tools pruning code removed.
4. **Tool schema/UX polish** — `agent-manager` tool made nullable-friendly (strict providers), `todowrite` gained incremental guidance, `background-process` clarified sleep/wait semantics, gateway providers Alibaba + Mistral removed.

opencode changes are mostly version bumps (1.18.18 → 1.18.19), stats/geo normalization, and Zen docs — largely irrelevant to Alexi core.

## Changes

### 1. Remove Alibaba and Mistral gateway provider adapters
**File**: `src/providers/gateway.ts` (or equivalent provider registry)
**Priority**: high
**Type**: refactor
**Reason**: Upstream removed both providers from the kilo-gateway. If Alexi mirrors these, keep parity to avoid dead code paths. SAP AI Core routing should be unaffected — SAP-specific provider must remain.

**Current code** (illustrative — check actual provider list):
```typescript
export const GATEWAY_PROVIDERS = [
  "openai",
  "anthropic",
  "alibaba",     // remove
  "mistral",     // remove
  "sap-ai-core", // KEEP
  // ...
]
```

**New code**:
```typescript
export const GATEWAY_PROVIDERS = [
  "openai",
  "anthropic",
  "sap-ai-core", // preserved SAP integration
  // ...
]
```

Also grep and remove:
- `alibaba` / `Alibaba` adapter files
- `mistral` / `Mistral` adapter files
- References in `src/providers/constants.ts` and `src/providers/types.ts`

---

### 2. Extract PTY session registry into dedicated module
**File**: `src/core/pty/registry.ts` (NEW)
**Priority**: high
**Type**: refactor
**Reason**: Upstream split `Subscriber`/`Active` types plus session Maps out of `pty.ts` for durability across reloads and testability. Enables the durability tests (`pty-durability.test.ts`).

**New code**:
```typescript
// src/core/pty/registry.ts
import type { Disp, Proc } from "#pty"
import { Log } from "../util/log"
import type { Location } from "../location"
import type { Info } from "../pty"
import type { PtyID } from "../pty/schema"

const log = Log.create({ service: "pty.registry" })

export type Subscriber = {
  readonly onData: (chunk: string) => void
  readonly onEnd: (event: { exitCode?: number }) => void
  active: boolean
  detached: boolean
  pending: string[]
  end?: { exitCode?: number }
}

export type Active = {
  info: Info
  location: Location.Ref
  process: Proc
  buffer: string
  bufferCursor: number
  cursor: number
  subscribers: Map<object, Subscriber>
  listeners: Disp[]
  stopping: boolean
  terminated: boolean
  closing?: Promise<void>
}

export const sessions = new Map<PtyID, Active>()
export const exited = new Map<string, PtyID[]>()
export const pending = new Map<number, Location.Ref>()
export const blocked = new Map<string, Location.Ref>()
export const removing = new Set<PtyID>()
export const waiters = new Set<() => void>()
export const directoryTasks = new Map<string, Promise<void>>()

let next = 0
let closing = false
let shutdownTask: Promise<void> | undefined
let owners = 0

export function nextId(): number { return ++next }
export function isClosing(): boolean { return closing }
export function setClosing(v: boolean) { closing = v }
export function getShutdownTask() { return shutdownTask }
export function setShutdownTask(t?: Promise<void>) { shutdownTask = t }
export function incOwners() { return ++owners }
export function decOwners() { return --owners }
export function notifyWaiters() {
  for (const w of waiters) w()
}
```

Then in `src/core/pty.ts`:

**Current code**:
```typescript
type Subscriber = { /* inline */ }
type Active = { /* inline */ }
const sessions = new Map<PtyID, Active>()
```

**New code**:
```typescript
import * as Registry from "./pty/registry"
import type { Active, Subscriber } from "./pty/registry"

// Use Registry.sessions everywhere sessions was referenced
```

---

### 3. Harden PTY termination — remove silent error swallowing
**File**: `src/core/pty/termination.ts`
**Priority**: critical
**Type**: bugfix
**Reason**: Silent fallback to `[]` on `ps` failure caused stale PTY processes to leak. Upstream now propagates errors so callers can retry or fallback to platform-specific kills. This is a correctness/security fix (process leakage).

**Current code**:
```typescript
async function family(root: number, input: Runtime) {
  const rows = await input.tree().catch((err) => {
    log.debug("failed to inspect PTY process tree", { err, pid: root })
    return []
  })
  return [...descendants(root, rows), root]
}

async function tree(file = "ps", args = ["-axo", "pid=,ppid="]) {
  return await new Promise((resolve) => {
    try {
      const child = spawn(file, args, { /* ... */ })
      child.once("error", () => resolve([]))
      child.once("close", (code) => {
        if (code !== 0) return resolve([])
        // ...
      })
    } catch {
      resolve([])
    }
  })
}
```

**New code**:
```typescript
async function family(root: number, input: Runtime) {
  const rows = await input.tree() // let errors propagate
  return [...descendants(root, rows), root]
}

async function tree(file = "ps", args = ["-axo", "pid=,ppid="]) {
  return await new Promise<Array<{ pid: number; parent: number }>>((resolve, reject) => {
    try {
      const child = spawn(file, args, { stdio: ["ignore", "pipe", "ignore"] })
      const chunks: Buffer[] = []
      child.stdout?.on("data", (c: Buffer) => chunks.push(c))
      child.once("error", reject)
      child.once("close", (code) => {
        if (code !== 0) return reject(new Error(`process tree command exited with ${code}`))
        const rows = Buffer.concat(chunks).toString("utf8").trim().split("\n")
          .map((line) => line.trim().split(/\s+/).map((n) => Number.parseInt(n, 10)))
          .filter(([pid, parent]) => Number.isFinite(pid) && Number.isFinite(parent))
          .map(([pid, parent]) => ({ pid: pid!, parent: parent! }))
        resolve(rows)
      })
    } catch (error) {
      reject(error)
    }
  })
}
```

Callers of `KiloPtyTermination.terminate()` must now wrap in `try/catch` and fall back to direct `process.kill(pid, 'SIGTERM')`.

---

### 4. Make location services idle TTL configurable
**File**: `src/core/location-services.ts`
**Priority**: medium
**Type**: feature
**Reason**: Upstream added an `options.idleTimeToLive` parameter to `buildLocationServiceMap` so tests/embedders can control layer expiration. Useful for SAP integration tests that need shorter TTLs.

**Current code**:
```typescript
import { Effect, Layer, LayerMap } from "effect"

export function buildLocationServiceMap(
  replacements: LayerNode.Replacements = [],
): Layer.Layer<LocationServiceMap.Service> {
  return Layer.effect(
    LocationServiceMap.Service,
    LayerMap.make(/* ... */, { idleTimeToLive: "60 minutes" }),
  )
}
```

**New code**:
```typescript
import { Duration, Effect, Layer, LayerMap } from "effect"

export function buildLocationServiceMap(
  replacements: LayerNode.Replacements = [],
  options: { readonly idleTimeToLive?: Duration.Input } = {},
): Layer.Layer<LocationServiceMap.Service> {
  return Layer.effect(
    LocationServiceMap.Service,
    LayerMap.make(
      /* ... */,
      { idleTimeToLive: options.idleTimeToLive ?? "60 minutes" },
    ),
  )
}
```

---

### 5. Remove agent requirements feature (schema, controller, UI)
**File**: multiple — see list below
**Priority**: high
**Type**: refactor
**Reason**: Upstream fully deleted the "skills / MCPs / vscode_extensions" requirements gate. If Alexi carried this feature, remove it to stay in sync and reduce surface area. SAP-specific requirement checks (if any) should be extracted first.

**Files to delete** (if present in Alexi):
- `src/core/v1/config/agent.ts` — remove `Requirements`, `VSCodeExtension`, `RequirementID`, `RequirementName` schemas
- `src/agent/agent-requirements.ts`
- `src/cli/agent-requirements.ts`
- `src/core/agent-requirements-controller.ts`

**Files to edit** — `src/core/v1/config/agent.ts`:

**Current code**:
```typescript
export const Requirements = Schema.Struct({
  skills: Schema.optional(RequirementGroup),
  mcps: Schema.optional(RequirementGroup),
  vscode_extensions: Schema.optional(VSCodeExtensions),
}).check(/* ... */)

export const Agent = Schema.Struct({
  // ...
  requirements: Schema.optional(Requirements),
})
```

**New code**:
```typescript
export const Agent = Schema.Struct({
  // ... (requirements field removed)
})
```

Also purge:
- `src/core/v1/config/config.ts` — remove `agent_requirements` config keys
- Any i18n keys under `agentRequirements.*`
- Test files: `agent-requirements.test.ts`, `agent-requirements-cli.test.ts`

**SAP note**: If SAP AI Core relies on any capability-gating logic, port it into a separate `src/sap/capability-gate.ts` module before deletion.

---

### 6. Update agent-manager tool schema to allow nullable fields
**File**: `src/tool/agent-manager.ts`
**Priority**: high
**Type**: bugfix
**Reason**: Strict providers (OpenAI structured output, SAP AI Core's strict mode) omit optional fields entirely. Upstream fix: mark fields as nullable so strict providers can send `null` instead of omitting.

**Current code** (approxim
{"prompt_tokens":27929,"completion_tokens":4096,"total_tokens":32025,"cache_read_input_tokens":0,"cache_creation_input_tokens":0}

[Session: 3d5815da-393f-4e3e-8064-5887426cbe3c]
[Messages: 2, Tokens: 32025]
