# Update Plan for Alexi

Generated: 2026-10-18
Based on upstream commits analyzed:
- opencode: 214fb7f, 60a5a6c, 63c1a27, 49e9786, c38d83c, 3bdab63, 86c7f7c
- kilocode: 2a1903f29 (JetBrains CLI pin bump — no action needed)

## Summary
- Total changes planned: 7
- Critical: 1 | High: 3 | Medium: 2 | Low: 1

## Changes

### 1. Tolerate sandboxed filesystem denials during location boot
**File**: `src/core/filesystem.ts` (and/or `src/core/location.ts`)
**Priority**: critical
**Type**: bugfix
**Reason**: Mirrors opencode fix (#55817). When Alexi runs inside a sandbox (SAP BTP, container, Codespaces), filesystem access to parent directories (e.g., global config dirs) may be denied with `EACCES`/`EPERM`. Current code likely treats these as fatal and aborts boot. Treat denied paths the same as missing paths so Alexi can still start.

**Current code** (typical pattern to look for):
```typescript
// Likely in location/boot path
const stat = await fs.stat(path)  // throws on EACCES
if (stat.isDirectory()) { /* ... */ }
```

**New code**:
```typescript
// Add helper to util/fs-util equivalent
export function isAccessDenied(err: unknown): boolean {
  if (!err || typeof err !== "object") return false
  const code = (err as NodeJS.ErrnoException).code
  return code === "EACCES" || code === "EPERM"
}

// Then in location boot:
const stat = await fs.stat(path).catch((err) => {
  if (err.code === "ENOENT" || isAccessDenied(err)) return undefined
  throw err
})
if (!stat) {
  logger.debug("location skipped", { path, reason: stat === undefined ? "unavailable" : "denied" })
  continue
}
```

---

### 2. Report shell exit only after output is captured
**File**: `src/tool/bash.ts` (or `src/tool/shell.ts`)
**Priority**: high
**Type**: bugfix
**Reason**: Upstream fix #56321 — shell tool was emitting the exit event before stdout/stderr pipes drained, so consumers saw truncated output. This is a race in Alexi's bash tool too if it listens to `child.on('exit', ...)` directly.

**Current code**:
```typescript
child.on("exit", (code) => {
  resolve({ stdout, stderr, exitCode: code })
})
```

**New code**:
```typescript
let exited: { code: number | null; signal: NodeJS.Signals | null } | undefined
let stdoutClosed = false
let stderrClosed = false

const maybeFinish = () => {
  if (exited && stdoutClosed && stderrClosed) {
    resolve({ stdout, stderr, exitCode: exited.code, signal: exited.signal })
  }
}

child.stdout.on("end", () => { stdoutClosed = true; maybeFinish() })
child.stderr.on("end", () => { stderrClosed = true; maybeFinish() })
child.on("exit", (code, signal) => {
  exited = { code, signal }
  maybeFinish()
})
```

---

### 3. Treat null OpenAI Responses stream fields as absent
**File**: `src/providers/openai-responses.ts` (if present) or `src/providers/sap-aicore.ts` for the Responses-compatible path
**Priority**: high
**Type**: bugfix
**Reason**: Upstream fix #56669 — OpenAI-compatible Responses API now sends explicit `null` for optional fields (`id`, `output`, `delta`) instead of omitting them. Current `if (value !== undefined)` checks miss these and cause downstream `TypeError: cannot read property 'x' of null`. Since SAP AI Core exposes OpenAI-compatible endpoints, this likely affects Alexi.

**Current code**:
```typescript
if (chunk.response !== undefined) {
  state.responseId = chunk.response.id
}
if (chunk.delta !== undefined) {
  state.text += chunk.delta
}
```

**New code**:
```typescript
// Treat null the same as undefined for optional fields
if (chunk.response != null) {
  state.responseId = chunk.response.id ?? state.responseId
}
if (chunk.delta != null) {
  state.text += chunk.delta
}
// Also guard: output arrays may be null
const outputs = chunk.output ?? []
for (const item of outputs) { /* ... */ }
```

---

### 4. Retry buffered generations with shared retry policy
**File**: `src/core/model-retry.ts` (new) + `src/core/generate.ts`
**Priority**: high
**Type**: refactor + bugfix
**Reason**: Upstream #56497 extracts a shared retry policy (`packages/core/src/model-retry.ts`) and reduces `session/runner/retry.ts` from 47 lines to 10. Alexi's SAP AI Core integration benefits from a single, consistent retry policy (handling rate limits, transient 5xx, and timeouts) rather than scattered retry logic.

**New file** `src/core/model-retry.ts`:
```typescript
import { Effect, Schedule, Duration } from "effect"

export interface RetryableError {
  readonly retryable: boolean
  readonly retryAfter?: Duration.Duration
}

export const isRetryable = (error: unknown): error is RetryableError => {
  if (!error || typeof error !== "object") return false
  const e = error as any
  // Rate limit, transient server errors, network blips
  if (e.status === 429 || e.status === 503 || e.status === 502 || e.status === 504) return true
  if (e.code === "ECONNRESET" || e.code === "ETIMEDOUT") return true
  return e.retryable === true
}

export const policy = Schedule.exponential(Duration.millis(500), 2.0).pipe(
  Schedule.jittered,
  Schedule.compose(Schedule.recurs(3)),
)

export const retryable = <A, E, R>(effect: Effect.Effect<A, E, R>) =>
  effect.pipe(Effect.retry({ schedule: policy, while: isRetryable }))
```

**Modify** `src/core/generate.ts`:
```typescript
// Before: ad-hoc try/catch retry
// After:
import { retryable } from "./model-retry"

export const generate = (opts: GenerateOpts) =>
  retryable(doGenerate(opts))
```

---

### 5. Bound skill discovery and watches (depth-limited scanning)
**File**: `src/core/skill-scan.ts` (new) + update any skill/instruction discovery
**Priority**: medium
**Type**: performance + bugfix
**Reason**: Upstream #55597 replaces unbounded glob `{*.md,**/SKILL.md}` with a depth-limited BFS (`MAX_DEPTH = 6`) that short-circuits on `SKILL.md` and skips ignored directories. Prevents runaway scans of large monorepos / `node_modules` symlink loops. Only apply if Alexi has an equivalent skill/instruction scan.

**New file** `src/core/skill-scan.ts`:
```typescript
import path from "path"
import { readdir, stat } from "fs/promises"

const MAX_DEPTH = 6
const IGNORED_DIRS = ["node_modules", ".git", "dist", "build", ".next", "target"]
export const ignore = ["**/node_modules/**", "**/.git/**", "**/.*", "**/.*/**"]

export async function scanSkills(root: string): Promise<string[]> {
  const files: string[] = []
  const queue: Array<{ directory: string; depth: number }> = [{ directory: root, depth: 0 }]

  while (queue.length) {
    const item = queue.shift()!
    const entries = await readdir(item.directory, { withFileTypes: true }).catch(() => [])
    const children = await Promise.all(
      entries
        .filter((e) => !e.name.startsWith(".") && !IGNORED_DIRS.includes(e.name))
        .map(async (e) => {
          const target = path.join(item.directory, e.name)
          let type: "file" | "directory" | "other" = "other"
          if (e.isFile()) type = "file"
          else if (e.isDirectory()) type = "directory"
          else if (e.isSymbolicLink()) {
            const s = await stat(target).catch(() => null)
            if (s?.isDirectory()) type = "directory"
            else if (s?.isFile()) type = "file"
          }
          return { name: e.name, path: target, type }
        }),
    )

    const skill = children.find((c) => c.type === "file" && c.name === "SKILL.md")
    if (skill) { files.push(skill.path); continue }

    if (item.depth === 0) {
      files.push(...children.filter((c) => c.type === "file" && c.name.endsWith(".md")).map((c) => c.path))
    }
    if (item.depth < MAX_DEPTH) {
      queue.push(...children.filter((c) => c.type === "directory").map((c) => ({ directory: c.path, depth: item.depth + 1 })))
    }
  }
  return files.sort()
}
```

---

### 6. Accept `idle` in message-type filter
**File**: `src/bus/message.ts` or `src/router/message-filter.ts`
**Priority**: medium
**Type**: bugfix
**Reason**: Upstream protocol fix #56504 — the message type filter rejected `idle` messages, which are now a legitimate state transition. If Alexi mirrors opencode's protocol message group, update the allowed-types list.

**Current code**:
```typescript
export const MessageType = Schema.Union(
  Schema.Literal("user"),
  Schema.Literal("assistant"),
  Schema.Literal("tool"),
  // idle missing
)
```

**New code**:
```typescript
export const MessageType = Schema.Union(
  Schema.Literal("user"),
  Schema.Literal("assistant"),
  Schema.Literal("tool"),
  Schema.Literal("idle"),
)
```

---

### 7. Instruction read: distinguish NotFound (transient) vs Denied (permanent)
**File**: `src/core/instruction.ts` or `src/config/instruction.ts`
**Priority**: low
**Type**: bugfix
**Reason**: Upstream fix in `instruction.ts` differentiates mid-save (NotFound → transient, retry allowed) from permission denial (stay-absent). Improves UX in sandboxed environments and avoids spurious "unavailable" markers when files are briefly missing during editor saves.

**Current code**:
```typescript
const read = async (filepath: string) => {
  const content = await fs.readFile(filepath, "utf8").catch(() => undefined)
  if (content === undefined) {
    logger.debug("instruction file skipped", { path: filepath, reason: "unavailable" })
    return undefined
  }
  return { path: filepath, content }
}
```

**New code**:
```typescript
const read = async (filepath: string): Promise<InstructionFile | "denied" | undefined> => {
  try {
    const content = await fs.readFile(filepath, "utf8")
    return { path: filepath, content }
  } catch (err: any) {
    if (err.code === "ENOENT") {
      logger.debug("instruction file skipped", { path: filepath, reason: "NotFound" })
      return undefined  // transient, caller may mark unavailable
    }
    if (err.code === "EACCES" || err.code === "EPERM") {
      logger.debug("instruction file skipped", { path: filepath, reason: "denied" })
      return "denied"  // stay absent
    }
    throw err
{"prompt_tokens":12374,"completion_tokens":4096,"total_tokens":16470,"cache_read_input_tokens":0,"cache_creation_input_tokens":0}

[Session: db454442-9a2a-408b-bdde-76f245ca9c38]
[Messages: 2, Tokens: 16470]
