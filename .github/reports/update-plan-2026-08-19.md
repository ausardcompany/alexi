```markdown
# Update Plan for Alexi

Generated: 2026-08-19
Based on upstream commits analyzed:
- kilocode: 91a337e31..0004b748b (180 commits, primarily JetBrains work + selected CLI/core fixes)
- opencode: 4e81a0b..da4730e (19 commits)

## Summary
- Total changes planned: 12
- Critical: 3 | High: 5 | Medium: 3 | Low: 1

The vast majority of upstream churn is JetBrains UI (not applicable to Alexi) and console/marketing (also not applicable). The actionable subset for Alexi is concentrated in:
- Core database WAL recovery (concurrency crash fix)
- Fallback state directory resolution (unwritable state paths)
- Permission system read-only mode enforcement
- Shell tool sandbox git write handling
- Snapshot disable persistence
- JWT share token import
- Kilo Gateway model visibility in TUI
- Session request header restoration (opencode)
- Malformed model cost handling (opencode)

---

## Changes

### 1. Prevent concurrent WAL recovery crashes on shared SQLite DB
**File**: `src/core/database/database.ts`
**Priority**: critical
**Type**: bugfix
**Reason**: When multiple Alexi processes open the same SQLite database concurrently, one racing to recover an abandoned WAL/SHM segment can crash with `SQLITE_BUSY` before the busy handler is installed. Upstream fixes this by setting `busy_timeout` **before** `journal_mode = WAL`, and by disabling the sqlite layer's own WAL init so pragmas run in the correct order. This is a stability fix relevant to any SAP AI Core deployment where the daemon and CLI may run simultaneously.

**Current code**:
```typescript
const layer = Layer.effect(
  Database,
  Effect.gen(function* () {
    const db = yield* makeDatabase
    yield* db.run("PRAGMA journal_mode = WAL")
    yield* db.run("PRAGMA synchronous = NORMAL")
    yield* db.run("PRAGMA busy_timeout = 5000")
    // ...
  }),
)

export function layerFromPath(filename: string) {
  DbPreflight.assertWritable(filename)
  return layer.pipe(Layer.provide(sqliteLayer({ filename })))
}
```

**New code**:
```typescript
const layer = Layer.effect(
  Database,
  Effect.gen(function* () {
    const db = yield* makeDatabase
    // alexi_change start - install SQLite's busy handler before concurrent
    // processes can race to recover the WAL
    yield* db.run("PRAGMA busy_timeout = 5000")
    yield* db.run("PRAGMA journal_mode = WAL")
    // alexi_change end
    yield* db.run("PRAGMA synchronous = NORMAL")
    yield* db.run("PRAGMA cache_size = -64000")
    yield* db.run("PRAGMA foreign_keys = ON")
    yield* db.run("PRAGMA wal_checkpoint(PASSIVE)")
    // ...
  }),
)

export function layerFromPath(filename: string) {
  DbPreflight.assertWritable(filename)
  // alexi_change - Database configures WAL after busy_timeout
  return layer.pipe(Layer.provide(sqliteLayer({ filename, disableWAL: true })))
}
```

---

### 2. Add fallback state directory resolution
**File**: `src/core/kilocode/global.ts` (or Alexi equivalent, e.g. `src/core/global/paths.ts`)
**Priority**: high
**Type**: bugfix
**Reason**: SAP AI Core deployments frequently run in constrained environments (containers, restricted user profiles, VS Code Server on Windows) where `$XDG_STATE_HOME` may be unwritable. Upstream now probes writability and falls back to `<data>/state` before crashing. This directly addresses the "VS Code server connection failure on unwritable state paths" bug (#13115).

**New code** (add to global helpers):
```typescript
import fs from "fs/promises"
import path from "path"
import { randomUUID } from "crypto"

async function writable(p: string) {
  const probe = path.join(p, `.alexi-write-${process.pid}-${randomUUID()}`)
  await fs.writeFile(probe, "", { flag: "wx", mode: 0o600 })
  await fs.unlink(probe)
}

async function ready(p: string) {
  await ensureRealDir(p)
  await writable(p)
}

export async function resolveState(preferred: string, fallback?: string): Promise<string> {
  // Sticky: if the fallback already exists and is writable, keep using it
  // to avoid flapping between locations across restarts.
  const sticky =
    fallback === undefined
      ? false
      : await fs.stat(fallback).then(
          async (stat) => {
            if (!stat.isDirectory()) return false
            return writable(fallback).then(
              () => true,
              () => false,
            )
          },
          () => false,
        )
  if (sticky && fallback !== undefined) return fallback

  const err = await ready(preferred).then(
    () => undefined,
    (e: unknown) => e,
  )
  if (err === undefined) return preferred
  if (fallback === undefined) throw err

  const failed = await ready(fallback).then(
    () => undefined,
    (e: unknown) => e,
  )
  if (failed !== undefined) throw failed
  return fallback
}
```

**File**: `src/core/global.ts`

**Current code**:
```typescript
const state = path.join(clean(xdgState)!, app)
// ...
await Promise.all([
  ensureRealDir(Path.data),
  ensureRealDir(Path.config),
  ensureRealDir(Path.state),
  ensureRealDir(Path.tmp),
  // ...
])
```

**New code**:
```typescript
const preferredState = path.join(clean(xdgState)!, app)
const state = await resolveState(
  preferredState,
  process.env.XDG_STATE_HOME ? undefined : path.join(data, "state"),
)
// ...
await Promise.all([
  ensureRealDir(Path.data),
  ensureRealDir(Path.config),
  // Path.state is guaranteed real+writable by resolveState()
  ensureRealDir(Path.tmp),
  // ...
])
```

---

### 3. Keep ask and plan modes read-only under broad permission rules
**File**: `src/permission/index.ts`
**Priority**: critical
**Type**: security
**Reason**: A permission rule like `"*": "allow"` was previously allowing write/edit tools in ask and plan modes, defeating the read-only guarantee. This is a security regression that also matters for SAP AI Core where plan/ask modes are used for compliance-reviewable read-only workflows.

**Current code**:
```typescript
export function evaluate(input: {
  tool: string
  mode: string
  rules: Record<string, "allow" | "ask" | "deny">
}): "allow" | "ask" | "deny" {
  // Broad wildcard match applied uniformly across modes
  const rule = input.rules[input.tool] ?? input.rules["*"] ?? "ask"
  return rule
}
```

**New code**:
```typescript
const READ_ONLY_MODES = new Set(["ask", "plan"])
const WRITE_TOOLS = new Set([
  "write", "edit", "patch", "shell", "bash",
  "kilo_edit", "kilo_write", "apply_patch",
])

export function evaluate(input: {
  tool: string
  mode: string
  rules: Record<string, "allow" | "ask" | "deny">
}): "allow" | "ask" | "deny" {
  // alexi_change: enforce read-only in ask/plan regardless of broad wildcards.
  // A tool-specific rule still wins so explicit allow-lists remain honored.
  if (READ_ONLY_MODES.has(input.mode) && WRITE_TOOLS.has(input.tool)) {
    const explicit = input.rules[input.tool]
    if (explicit === "allow") return "allow"
    return "deny"
  }
  return input.rules[input.tool] ?? input.rules["*"] ?? "ask"
}
```

---

### 4. Prompt before sandboxed git writes
**File**: `src/tool/shell.ts` and new `src/kilocode/sandbox/git.ts`
**Priority**: high
**Type**: security
**Reason**: On macOS sandbox, git write operations (commit, push, checkout in some cases) could silently fail or succeed with unexpected write side-effects. Upstream now escalates git write commands through the permission prompt.

**New file** `src/kilocode/sandbox/git.ts`:
```typescript
// Detect git subcommands that mutate the working tree, index, refs, or config.
const GIT_WRITE_SUBCOMMANDS = new Set([
  "add", "am", "apply", "branch", "checkout", "cherry-pick", "clean",
  "commit", "config", "fetch", "gc", "init", "merge", "mv", "pull",
  "push", "rebase", "reflog", "remote", "reset", "restore", "revert",
  "rm", "stash", "submodule", "switch", "tag", "worktree",
])

export function isGitWrite(command: string): boolean {
  const tokens = command.trim().split(/\s+/)
  if (tokens[0] !== "git") return false
  // Skip global flags like `git -C path subcommand`
  let i = 1
  while (i < tokens.length && tokens[i]?.startsWith("-")) {
    // skip flag and its argument if it takes one
    if (["-C", "-c", "--git-dir", "--work-tree"].includes(tokens[i])) i += 2
    else i += 1
  }
  const sub = tokens[i]
  return sub !== undefined && GIT_WRITE_SUBCOMMANDS.has(sub)
}

export function requiresSandboxEscalation(command: string, sandbox: boolean): boolean {
  return sandbox && isGitWrite(command)
}
```

**File**: `src/tool/shell.ts`

**Change**: Before executing, request escalation for sandboxed git writes:
```typescript
import { requiresSandboxEscalation } from "../kilocode/sandbox/git"

// inside shell tool run():
if (requiresSandboxEscalation(args.command, ctx.sandboxEnabled)) {
  await ctx.permission.request({
    tool: "shell",
    reason: "sandboxed_git_write",
    command: args.command,
  })
}
```

---

### 5. Persist snapshot-disable across restarts
**File**: `src/kilocode/snapshot/track.ts`
**Priority**: medium
**Type**: bugfix
**Reason**: Users who disable snapshotting expect it to remain disabled across restarts. Upstream persists this in config state rather than in-memory only.

**Current code** (illustrative):
```typescript
let snapshotDisabled = false

export function disableSnapshots() {
  snapshotDisabled = true
}

export function shouldSnapshot() {
  return !snapshotDisabled
}
```

**New code**:
```typescript
import { Config } from "../../core/config"

const KEY = "kilocode.snapshot.disabled"

export async function disableSnapshots() {
  await Config.setState(KEY, true)
}

export async function enableSnapshots() {
  await Config.setState(KEY, false)
}

export async function shouldSnapshot(): Promise<boolean> {
  const disabled = await Config.getState<boolean>(KEY)
  return !disabled
}
```

Also clean up stale truncation files by mtime (not creation order):
```typescript
// alexi_change: clean truncation files by mtime, oldest first
{"prompt_tokens":40984,"completion_tokens":4096,"total_tokens":45080,"cache_read_input_tokens":0,"cache_creation_input_tokens":0}

[Session: ed5d2fa1-5d6d-4428-a538-db4f539b23a4]
[Messages: 2, Tokens: 45080]
