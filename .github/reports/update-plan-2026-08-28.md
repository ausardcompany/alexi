```markdown
# Update Plan for Alexi

Generated: 2026-08-28
Based on upstream commits analyzed:
- kilocode: c03a20394..e126cc3ca (138 commits, notably: 6e05f48fb prevent filesystem root indexing, 08467dba4 limit indexing safeguards, 8507bddb0 centralize NUL-delimited composite keys, 039a235b6 queue prompts for busy sessions, 76ea62098 preserve pending turns across compaction recovery, b9f2a5972 handle tool progress during compaction, 831530265 preserve compaction replay context, 8bcd9f4b8 prevent compaction request replay loops, c3deca608 forward messageID and drop queued prompts, 04ac919af file search on demand)
- opencode: 05ea507..df35e84 (12 commits, notably: 733562e remove Bun dependency from Azure auth, 517ee73 filter unreplayable Bedrock reasoning before caching, 790fb5b Azure CLI authentication, 03afae5 load supported v2 config in v1)

## Summary
- Total changes planned: 12
- Critical: 2 | High: 5 | Medium: 3 | Low: 2

## Changes

### 1. Prevent filesystem root and home directory indexing (security/safety)
**File**: `src/core/kilocode/fff.ts` (create/update)
**Priority**: critical
**Type**: security
**Reason**: Upstream commits `6e05f48fb`, `08467dba4`, `b0dbd398a` prevent the search/watcher subsystems from eagerly enumerating filesystem roots (e.g. `/`, `C:\`) or user home directories, which can lead to runaway indexing, resource exhaustion, and accidental scanning of sensitive files. This is a safety-critical change.

**New code**:
```typescript
// src/core/kilocode/fff.ts
import { realpathSync } from "node:fs"
import os from "os"
import path from "path"

export const message =
  "Automatic indexing is disabled in home and filesystem root directories. Open a project folder to enable indexing. File tools remain available."

function root(directory: string, api: typeof path.posix) {
  if (!api.isAbsolute(directory)) return false
  return api.normalize(directory) === api.normalize(api.parse(directory).root)
}

function real(directory: string) {
  try {
    return realpathSync.native(directory)
  } catch {
    return path.resolve(directory)
  }
}

export function allowed(
  directory: string,
  home = (process.env.ALEXI_TEST_HOME ?? os.homedir()).trim(),
) {
  const value = path.win32.normalize(directory)
  const prefix = "\\\\?\\UNC\\"
  const windows = value.toUpperCase().startsWith(prefix)
    ? `\\\\${value.slice(prefix.length)}`
    : value
  if (root(directory, path.posix) || root(windows, path.win32)) return false
  const resolved = real(directory)
  if (root(resolved, path)) return false
  const base = real(home)
  return process.platform === "win32"
    ? resolved.toLowerCase() !== base.toLowerCase()
    : resolved !== base
}

export function notices(directory: string) {
  return allowed(directory) ? [] : [{ path: directory, message }]
}
```

Then update filesystem search/watcher call sites:

**File**: `src/core/filesystem/search.ts` (or equivalent)

**Current code**:
```typescript
yield* ripgrep.find({
  cwd: location.directory,
  pattern: "*",
  limit: location.vcs ? Number.MAX_SAFE_INTEGER : 100_000,
  onEntry: (entry) => Effect.sync(() => { /* ... */ }),
}).pipe(Effect.orDie, Effect.asVoid, Effect.forkIn(scope))
```

**New code**:
```typescript
import { allowed } from "../kilocode/fff"

const real = yield* fs.realPath(location.directory).pipe(
  Effect.catch(() => Effect.succeed(undefined)),
)
if (real && allowed(real)) {
  yield* ripgrep.find({
    cwd: real,
    pattern: "*",
    limit: location.vcs ? Number.MAX_SAFE_INTEGER : 100_000,
    onEntry: (entry) => Effect.sync(() => { /* ... */ }),
  }).pipe(Effect.orDie, Effect.asVoid, Effect.forkIn(scope))
}
```

**File**: `src/core/filesystem/watcher.ts` (if watcher exists)

**New code**:
```typescript
import { allowed } from "../kilocode/fff"

if (location.vcs && (yield* Flag.ALEXI_EXPERIMENTAL_FILEWATCHER) && allowed(location.directory)) {
  yield* Effect.forkScoped(
    subscribe(location.directory, [...Ignore.PATTERNS, ...config, ...protecteds(location.directory)]),
  )
}
```

---

### 2. Filter unreplayable Bedrock reasoning parts before caching (SAP AI Core relevance)
**File**: `src/providers/transform.ts`
**Priority**: critical
**Type**: bugfix
**Reason**: Upstream commit `517ee73` (opencode) fixes a bug where AWS Bedrock reasoning tokens can be replayed into the cache/prompt and cause provider errors. Because SAP AI Core proxies multiple model families (Anthropic-on-Bedrock, etc.), this fix applies directly to Alexi's provider transform layer.

**Current code** (approximate):
```typescript
export function transformMessages(messages: Message[]) {
  return messages.map((m) => ({
    ...m,
    parts: m.parts,
  }))
}
```

**New code**:
```typescript
export function transformMessages(messages: Message[], providerID?: string) {
  return messages.map((m) => {
    // Bedrock cannot replay reasoning content without the signature that
    // accompanied the original assistant turn. Strip unreplayable reasoning
    // parts before they enter the cache/prompt to avoid provider errors.
    const isBedrock = providerID?.includes("bedrock") || providerID?.includes("aicore")
    if (!isBedrock || m.role !== "assistant") return m
    const parts = m.parts.filter((p) => {
      if (p.type !== "reasoning") return true
      const meta = (p as any).providerMetadata?.bedrock
      return Boolean(meta?.signature)
    })
    return { ...m, parts }
  })
}
```

Add tests mirroring `packages/opencode/test/provider/transform.test.ts` (+130 lines).

---

### 3. Centralize NUL-delimited composite IDs
**File**: `src/core/kilocode/zero-id.ts` (new)
**Priority**: high
**Type**: refactor
**Reason**: Upstream commit `8507bddb0` extracts composite key building into a shared helper. Adopting this now reduces duplication and prevents subtle collisions in session/agent/worktree keying used throughout the codebase.

**New code**:
```typescript
// src/core/kilocode/zero-id.ts
export function zeroID(...parts: (string | number | boolean)[]) {
  if (parts.length === 2) return `${parts[0]}\0${parts[1]}`
  if (parts.length === 3) return `${parts[0]}\0${parts[1]}\0${parts[2]}`
  return parts.join("\0")
}
```

**Migration**: Grep the codebase for `.join("\0")`, `` `${a}\0${b}` ``, and replace with `zeroID(a, b)`.

---

### 4. Queue prompts when the session is busy
**File**: `src/agent/index.ts` and `src/session/queue.ts` (new)
**Priority**: high
**Type**: feature/bugfix
**Reason**: Upstream commits `039a235b6`, `de9e1edcf`, `52d4247d9`, `c3deca608` (remote-sender forwarding + drop queued prompts) introduce a queued-prompt model that prevents dropped user input while an agent is busy and enables editing/canceling queued prompts. This aligns with the agent behavior in Alexi's session manager.

**New code (session queue)**:
```typescript
// src/session/queue.ts
export interface QueuedPrompt {
  messageID: string
  sessionID: string
  text: string
  createdAt: number
}

export class SessionQueue {
  private queues = new Map<string, QueuedPrompt[]>()

  enqueue(sessionID: string, prompt: Omit<QueuedPrompt, "createdAt">) {
    if (!prompt.text.trim()) return // drop empty (upstream de9e1edcf)
    const list = this.queues.get(sessionID) ?? []
    list.push({ ...prompt, createdAt: Date.now() })
    this.queues.set(sessionID, list)
  }

  drainNext(sessionID: string): QueuedPrompt | undefined {
    const list = this.queues.get(sessionID)
    if (!list?.length) return
    return list.shift()
  }

  drop(sessionID: string, messageID: string) {
    const list = this.queues.get(sessionID)
    if (!list) return
    this.queues.set(sessionID, list.filter((p) => p.messageID !== messageID))
  }

  edit(sessionID: string, messageID: string, text: string) {
    const list = this.queues.get(sessionID) ?? []
    const idx = list.findIndex((p) => p.messageID === messageID)
    if (idx >= 0) list[idx] = { ...list[idx], text }
  }

  clear(sessionID: string) {
    this.queues.delete(sessionID)
  }
}
```

**Agent hook** (`src/agent/index.ts`):
```typescript
async sendPrompt(sessionID: string, text: string, opts: { messageID: string }) {
  if (this.isBusy(sessionID)) {
    this.queue.enqueue(sessionID, { sessionID, messageID: opts.messageID, text })
    this.bus.emit("session.prompt.queued", { sessionID, messageID: opts.messageID })
    return
  }
  await this.runTurn(sessionID, text, opts)
  // After turn completes, drain queue
  const next = this.queue.drainNext(sessionID)
  if (next) await this.sendPrompt(next.sessionID, next.text, { messageID: next.messageID })
}
```

---

### 5. Preserve pending turns and tool progress across compaction
**File**: `src/session/compaction.ts`
**Priority**: high
**Type**: bugfix
**Reason**: Commits `76ea62098`, `b9f2a5972`, `831530265`, `8bcd9f4b8`, `ae00c228d`, `34d70fe6b` fix a class of bugs where compaction (context trimming/summarization) would drop pending turns, tool progress, or trigger request replay loops. These are correctness bugs users will hit whenever conversation compaction runs.

**Current code** (approximate):
```typescript
export async function compact(session: Session) {
  const summary = await summarize(session.messages)
  session.messages = [summary]
}
```

**New code**:
```typescript
export async function compact(session: Session) {
  // Preserve any in-flight turn: tool calls that have started but not yet
  // produced a result must survive compaction so they can be replayed
  // correctly by the provider.
  const pending = session.messages.filter((m) => isPendingTurn(m))
  const eligible = session.messages.filter((m) => isReplayEligible(m) && !isPendingTurn(m))

  const summary = await summarize(eligible)

  // Guard against replay loops: if a summary was just produced last turn,
  // do not immediately re-inject it as a fresh user message.
  const rec
{"prompt_tokens":39488,"completion_tokens":4096,"total_tokens":43584,"cache_read_input_tokens":0,"cache_creation_input_tokens":0}

[Session: 5eda676c-8bd3-457c-b4ef-26a3925472b2]
[Messages: 2, Tokens: 43584]
