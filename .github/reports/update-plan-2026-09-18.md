# Update Plan for Alexi

Generated: 2026-09-18
Based on upstream commits: kilocode 8db973de9..c33d81690 (166 commits), opencode 5a83358..3dd1b30 (4 commits)

## Summary
- Total changes planned: 14
- Critical: 2 | High: 5 | Medium: 4 | Low: 3

## Changes

### 1. Harden read-only git classification against masked mutations in sandbox
**File**: `src/kilocode/sandbox/git.ts` (or equivalent sandbox classifier)
**Priority**: critical
**Type**: security
**Reason**: Upstream commit `32aaae25d` fixes a security issue where masked mutations could bypass the read-only git classifier. Additionally, commit `2da7e2bb7` reorders checks so write flags are evaluated before read flags. Both are security-relevant for sandbox escalation prevention.

**Current code** (typical pattern):
```typescript
// Likely checks read flags before write flags
function isReadOnlyGit(args: string[]): boolean {
  if (hasReadFlag(args)) return true
  if (hasWriteFlag(args)) return false
  // ...
}
```

**New code**:
```typescript
// Check write flags FIRST, then read flags — write intent must take precedence
function isReadOnlyGit(args: string[]): boolean {
  // Expand short-flag clusters including numeric values (e.g. -n1, -m"msg")
  const expanded = expandShortFlagClusters(args)

  // 1. Any write flag => not read-only
  if (hasWriteFlag(expanded)) return false

  // 2. Detect masked mutations: subcommands that appear read-only but can mutate
  //    via -c config overrides, --exec, --upload-pack, etc.
  if (hasMaskedMutation(expanded)) return false

  // 3. Then evaluate read-only flags
  return hasReadFlag(expanded)
}

function expandShortFlagClusters(args: string[]): string[] {
  // Handle -abc => -a -b -c and -n1 => -n 1
  return args.flatMap((arg) => {
    if (!arg.startsWith("-") || arg.startsWith("--")) return [arg]
    const chars = arg.slice(1)
    if (/^\d+$/.test(chars)) return [arg]
    return chars.split("").map((c) => `-${c}`)
  })
}

const MASKED_MUTATION_FLAGS = new Set([
  "-c", "--config", "--exec-path", "--upload-pack",
  "--receive-pack", "--work-tree", "--git-dir",
])

function hasMaskedMutation(args: string[]): boolean {
  return args.some((a) => MASKED_MUTATION_FLAGS.has(a.split("=")[0]))
}
```

---

### 2. Recover stalled permission approvals
**File**: `src/permission/handler.ts` (permission-handler equivalent)
**Priority**: critical
**Type**: bugfix
**Reason**: Upstream commits `d8eaefdf1`, `f6d761e65`, `fa897b854` fix a bug where permission approvals could stall or be lost during aborts, blocking the entire tool execution pipeline. Alexi's permission handling should reconcile aborted saves.

**New code** (add reconciliation logic):
```typescript
// src/permission/handler.ts
interface PendingPermission {
  id: string
  createdAt: number
  timeoutMs: number
  resolver: (result: PermissionResult) => void
}

const pending = new Map<string, PendingPermission>()

export async function requestPermission(req: PermissionRequest): Promise<PermissionResult> {
  const id = crypto.randomUUID()
  return new Promise((resolve) => {
    const entry: PendingPermission = {
      id,
      createdAt: Date.now(),
      timeoutMs: 5 * 60 * 1000, // 5-minute recovery window
      resolver: resolve,
    }
    pending.set(id, entry)
    dispatchToUi(req, id)
  })
}

// Recovery pass — called on session resume / provider re-init
export function recoverStalledPermissions(): void {
  const now = Date.now()
  for (const [id, entry] of pending.entries()) {
    if (now - entry.createdAt > entry.timeoutMs) {
      // Reconcile: treat aborted saves as denials rather than infinite wait
      entry.resolver({ approved: false, reason: "stalled_recovery" })
      pending.delete(id)
    }
  }
}

// Reconcile aborted permission rule saves (from f6d761e65)
export function reconcileAbortedSave(ruleId: string): void {
  // If a rule save was in flight but aborted, ensure we don't keep the
  // corresponding permission entry stuck waiting for a save that will never land
  const entry = Array.from(pending.values()).find((p) => p.id === ruleId)
  if (entry) {
    entry.resolver({ approved: false, reason: "save_aborted" })
    pending.delete(entry.id)
  }
}
```

Also update the recovery call site to run on session start:
```typescript
// src/core/session.ts (or entry point)
import { recoverStalledPermissions } from "../permission/handler"

export async function startSession(...) {
  recoverStalledPermissions()
  // ...
}
```

---

### 3. Add Programmatic Tool Calling (Code Mode) experimental setting
**File**: `src/core/config.ts`
**Priority**: high
**Type**: feature
**Reason**: Upstream commit `6b5e8a04e` adds a new experimental setting `code_mode` (`packages/core/src/v1/config/config.ts` diff shown above). This routes MCP tool calls through a confined JS runtime, reducing token overhead. Important for SAP AI Core token budgets.

**Current code**:
```typescript
export const Experiments = Schema.Struct({
  task_model_selection: Schema.optional(Schema.Boolean),
  speech_to_text_model: Schema.optional(Schema.String),
  // ...
})
```

**New code**:
```typescript
export const Experiments = Schema.Struct({
  task_model_selection: Schema.optional(Schema.Boolean).annotate({
    description: "Allow task subagents to select a model, provider, and reasoning effort",
  }),
  code_mode: Schema.optional(Schema.Boolean).annotate({
    description:
      "Route MCP tool calls through a confined JavaScript runtime with on-demand tool discovery instead of exposing every MCP tool directly",
  }),
  speech_to_text_model: Schema.optional(Schema.String).annotate({
    description: "Speech-to-text transcription model ID to use for voice input",
  }),
})
```

Also gate loading with network check (commit `e0dcb0e4e`):
```typescript
// src/tool/code-mode.ts (new)
export async function loadCodeMode(config: Config): Promise<CodeMode | null> {
  if (!config.experimental?.code_mode) return null
  if (isNetworkRestricted(config)) {
    log.warn("code_mode requires network access; skipping")
    return null
  }
  return await import("./code-mode-runtime").then((m) => m.create())
}
```

---

### 4. Defer session title generation
**File**: `src/kilocode/session/title.ts` (new file)
**Priority**: high
**Type**: feature
**Reason**: Upstream commit `7e0ce5ec6` (+196 LOC) defers session title generation until after first user activity, dramatically improving perceived latency on session start. Commit `31bfc440c` moves orchestration into kilo-owned code. Commit `4ab5fe935` tightens the gate.

**New code**:
```typescript
// src/kilocode/session/title.ts
import { Effect } from "effect"

interface TitleState {
  sessionId: string
  generated: boolean
  attempts: number
  firstUserMessage?: string
  gatedUntil: number
}

const states = new Map<string, TitleState>()

const TITLE_MIN_MESSAGE_LENGTH = 8
const TITLE_MAX_ATTEMPTS = 3

export function ensureTitle(sessionId: string, message: string) {
  return Effect.gen(function* () {
    const state = states.get(sessionId) ?? {
      sessionId,
      generated: false,
      attempts: 0,
      gatedUntil: 0,
    }

    // Gate: only trigger after user has committed a substantive message
    if (state.generated) return
    if (state.attempts >= TITLE_MAX_ATTEMPTS) return
    if (Date.now() < state.gatedUntil) return
    if (message.trim().length < TITLE_MIN_MESSAGE_LENGTH) return

    state.attempts++
    state.firstUserMessage = message
    states.set(sessionId, state)

    yield* Effect.tryPromise({
      try: () => generateTitle(sessionId, message),
      catch: (err) => {
        state.gatedUntil = Date.now() + 60_000 // backoff
        return err
      },
    })

    state.generated = true
    states.set(sessionId, state)
  })
}

async function generateTitle(sessionId: string, message: string): Promise<string> {
  // Call SAP AI Core with a lightweight prompt
  // Keep prompt small — this runs after first user turn
  // ...
  return "..."
}
```

---

### 5. Allow read-only `gh` commands in sandbox / plan guard
**File**: `src/kilocode/sandbox/gh.ts` (new or extended)
**Priority**: high
**Type**: bugfix
**Reason**: Upstream commits `13e05d066`, `ecedeea49`, `700345267`, `15b6b3287` fix false-positive escalation prompts for read-only `gh` (GitHub CLI) commands. New test `gh-readonly.test.ts` codifies the contract.

**New code**:
```typescript
// src/kilocode/sandbox/gh.ts
const GH_READONLY_SUBCOMMANDS = new Set([
  "browse", "config get", "gist list", "gist view",
  "issue list", "issue view", "issue status",
  "pr list", "pr view", "pr status", "pr checks", "pr diff",
  "release list", "release view",
  "repo list", "repo view",
  "run list", "run view", "run watch",
  "search", "workflow list", "workflow view",
])

// gh auth status stays gated behind permission guard (ecedeea49)
const GH_AUTH_SUBCOMMANDS = new Set(["auth status", "auth token"])

export function classifyGh(args: string[]): "readonly" | "auth-gated" | "write" {
  const cmd = args.slice(0, 2).join(" ").toLowerCase()
  if (GH_AUTH_SUBCOMMANDS.has(cmd)) return "auth-gated"
  if (GH_READONLY_SUBCOMMANDS.has(cmd)) return "readonly"
  // Single-token subcommand check
  const single = args[0]?.toLowerCase()
  if (single && GH_READONLY_SUBCOMMANDS.has(single)) return "readonly"
  return "write"
}
```

Wire into sandbox permission check:
```typescript
// src/permission/sandbox-classifier.ts
if (command === "gh") {
  const classification = classifyGh(args)
  if (classification === "readonly") return { allowed: true, reason: "gh-readonly" }
  if (classification === "auth-gated") return { allowed: false, requiresPermission: true }
}
```

---

### 6. Improve tool registry with better categorization
**File**: `src/tool/registry.ts`
**Priority**: high
**Type**: refactor
**Reason**: Upstream commit changes to `packages/opencode/src/tool/registry.ts` (+25, -11) and its test (+55) su
{"prompt_tokens":33638,"completion_tokens":4096,"total_tokens":37734,"cache_read_input_tokens":0,"cache_creation_input_tokens":0}

[Session: f35e1cf7-f930-4d5f-b366-31e7fdb2446f]
[Messages: 2, Tokens: 37734]
