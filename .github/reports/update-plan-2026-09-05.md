# Update Plan for Alexi

Generated: 2026-09-05
Based on upstream commits analyzed:
- kilocode: `74b3141bb..ecccd1f54` (29 commits)
- opencode: `3f31139..e289456` (15 commits)

## Summary
- Total changes planned: 6
- Critical: 0 | High: 2 | Medium: 3 | Low: 1

The most impactful upstream change relevant to Alexi is the **kilocode ripgrep glob search timeout fix** (`b8e497a35`, PR #13805). This addresses stalled glob searches by introducing a bounded `timeout` option to the ripgrep search primitive, which is used by the `glob` tool. Most other upstream changes are JetBrains plugin, VS Code extension UI, agent-manager UI, docs, or console/billing changes that are out of scope for Alexi's core SAP AI Core–focused implementation.

The opencode Codex plugin fix (`02a167e`, `500c46e`) for GPT version comparison in Codex provider is medium priority *if* Alexi ships the Codex/OpenAI plugin; low otherwise.

## Changes

### 1. Add bounded timeout to ripgrep search primitive
**File**: `src/core/ripgrep.ts` (or wherever Alexi hosts its ripgrep integration)
**Priority**: high
**Type**: bugfix
**Reason**: Upstream fix for stalled glob searches. When a ripgrep invocation stalls (large repos, slow filesystems, network-mounted workdirs common in SAP CI environments), Alexi's glob/search tools can hang indefinitely and block a whole agent turn. Adding a bounded `timeout` (mirroring the `stop` interruption path) makes long-running searches gracefully terminate with a `truncated` result.

**Current code** (approximate — port from upstream `packages/core/src/ripgrep.ts`):
```typescript
interface SearchInput<A> {
  readonly cwd: string
  readonly args: string[]
  readonly limit: number
  readonly signal?: AbortSignal
  readonly parse: (line: string) => Effect.Effect<A | undefined, Error>
  readonly pattern?: string
  readonly onItem?: (item: A) => Effect.Effect<void>
  readonly stop?: (row: A) => boolean
  readonly validate?: SpawnValidation.Validator
}

// ...
const command = Command.make(binary, ...input.args).pipe(
  Command.workingDirectory(input.cwd),
  Command.env(process.env),
  Command.stdin("ignore"),
  // kilocode_change - bound grep interruption
  input.stop ? Command.forceKillAfter(Duration.seconds(1)) : (c) => c,
)
const spawned = input.stop ? SpawnExit.attach(validated) : validated
```

**New code**:
```typescript
interface SearchInput<A> {
  readonly cwd: string
  readonly args: string[]
  readonly limit: number
  readonly signal?: AbortSignal
  readonly timeout?: number // NEW: bounded search deadline in ms
  readonly parse: (line: string) => Effect.Effect<A | undefined, Error>
  readonly pattern?: string
  readonly onItem?: (item: A) => Effect.Effect<void>
  readonly stop?: (row: A) => boolean
  readonly validate?: SpawnValidation.Validator
}

// Bound spawn interruption whenever either `stop` OR `timeout` is set.
const needsBoundedKill = input.stop || input.timeout != null
const command = Command.make(binary, ...input.args).pipe(
  Command.workingDirectory(input.cwd),
  Command.env(process.env),
  Command.stdin("ignore"),
  needsBoundedKill ? Command.forceKillAfter(Duration.seconds(1)) : (c) => c,
)
const validated = input.validate ? SpawnValidation.attach(command, input.validate) : command
const spawned = needsBoundedKill ? SpawnExit.attach(validated) : validated
const handle = yield* process.spawn(spawned)

// Wrap the stream consumption in a timeout race when configured.
const collect = Stream.decodeText(handle.stdout).pipe(
  Stream.splitLines,
  Stream.filter((line) => line.length > 0),
  Stream.mapEffect(input.parse),
  Stream.filter((row): row is A => row !== undefined),
  Stream.tap((row) => {
    if (!input.onItem || observed++ >= input.limit) return Effect.void
    return input.onItem(row)
  }),
  take,
  Stream.runCollect,
  Effect.map((chunk) => [...chunk]),
)

const rows = input.timeout != null
  ? yield* collect.pipe(
      Effect.timeoutTo({
        duration: Duration.millis(input.timeout),
        onTimeout: () => ({ __timedOut: true as const }),
        onSuccess: (value) => ({ __timedOut: false as const, value }),
      }),
    )
  : { __timedOut: false as const, value: yield* collect }

if (rows.__timedOut) {
  return { items: [], truncated: true, partial: true, timedOut: true }
}
if (stopped) return { items: rows.value, truncated: true, partial: false }
```

> Note: also propagate `timedOut` in the return type so callers can surface a user-visible "search timed out" hint.

---

### 2. Wire timeout through the glob tool
**File**: `src/tool/glob.ts`
**Priority**: high
**Type**: bugfix
**Reason**: The upstream commit `b8e497a35` specifically targets the `glob` CLI/tool path. Alexi's glob tool should pass a sensible default timeout (upstream uses on the order of 30s) to the ripgrep call and translate a timeout into a partial, non-fatal result so the agent can keep going.

**New code**:
```typescript
// src/tool/glob.ts
const GLOB_SEARCH_TIMEOUT_MS = 30_000

export const globTool = defineTool({
  name: "glob",
  // ...
  async execute(args, ctx) {
    const result = yield* Ripgrep.files({
      cwd: ctx.cwd,
      pattern: args.pattern,
      limit: args.limit ?? 1000,
      timeout: GLOB_SEARCH_TIMEOUT_MS, // NEW
      signal: ctx.signal,
    })

    if ("timedOut" in result && result.timedOut) {
      return {
        ok: true,
        truncated: true,
        message:
          `Glob search timed out after ${GLOB_SEARCH_TIMEOUT_MS}ms. ` +
          `Consider narrowing the pattern or root directory.`,
        items: result.items,
      }
    }
    return { ok: true, items: result.items, truncated: result.truncated }
  },
})
```

---

### 3. Add regression test for glob timeout behavior
**File**: `test/core/ripgrep-timeout.test.ts` (new)
**Priority**: medium
**Type**: bugfix (test coverage)
**Reason**: Mirror the upstream test `ripgrep-settlement.test.ts` additions to guard against regressions. Alexi's SAP CI runs on shared runners where a regression here would silently hang builds.

**New code**:
```typescript
import { describe, expect } from "bun:test"
import { Deferred, Effect, Layer } from "effect"
import * as TestClock from "effect/testing/TestClock"
import { Ripgrep } from "@alexi/core/ripgrep"
import { RipgrepBinary } from "@alexi/core/ripgrep/binary"
import { it } from "../lib/effect"

describe("ripgrep timeout", () => {
  it.effect(
    "returns truncated+timedOut when deadline elapses before results",
    Effect.gen(function* () {
      // A never-resolving filepath simulates a hung binary resolution / spawn.
      const gate = yield* Deferred.make<string>()
      const layer = Layer.succeed(
        RipgrepBinary.Service,
        RipgrepBinary.Service.of({ filepath: Deferred.await(gate) }),
      )

      const result = yield* Ripgrep.files({
        cwd: process.cwd(),
        pattern: "**/*.ts",
        limit: 100,
        timeout: 50,
      }).pipe(Effect.provide(layer))

      expect(result.truncated).toBe(true)
      expect((result as any).timedOut).toBe(true)
    }),
  )
})
```

---

### 4. Update `run-stdin` piped-stdin bounded wait (if Alexi ships `alexi run`)
**File**: `src/cli/cmd/run-stdin.ts` (or equivalent)
**Priority**: medium
**Type**: bugfix
**Reason**: kilocode commit `86c1928c4` bounds the piped-stdin wait in `kilo run` to prevent hangs when the CLI is invoked from CI pipes that don't close stdin promptly. Alexi's SAP-tenant CLI is likely invoked from GitHub Actions / Jenkins pipelines with similar risk.

**New code**:
```typescript
// src/cli/cmd/run-stdin.ts
const STDIN_WAIT_TIMEOUT_MS = 250

export async function readPipedStdin(): Promise<string | undefined> {
  if (process.stdin.isTTY) return undefined

  const chunks: Buffer[] = []
  const readPromise = new Promise<string>((resolve, reject) => {
    process.stdin.on("data", (c) => chunks.push(Buffer.from(c)))
    process.stdin.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")))
    process.stdin.on("error", reject)
  })

  const timeoutPromise = new Promise<undefined>((resolve) =>
    setTimeout(() => resolve(undefined), STDIN_WAIT_TIMEOUT_MS),
  )

  const result = await Promise.race([readPromise, timeoutPromise])
  return result && result.length > 0 ? result : undefined
}
```

---

### 5. Harden Codex GPT version comparison (only if Codex/OpenAI provider is shipped)
**File**: `src/providers/openai/codex.ts`
**Priority**: medium
**Type**: bugfix
**Reason**: opencode PRs #47384 and #47385 fix two issues: (a) integer GPT versions (e.g. `"gpt-6"` without minor) crashing the version filter, and (b) comparing GPT versions across only major (missing minor). If Alexi ships Codex support alongside SAP AI Core routing, port both fixes. Skip if not applicable.

**Current code**:
```typescript
function isCodexModel(model: string): boolean {
  const match = model.match(/^gpt-(\d+)\.(\d+)/)
  if (!match) return false
  const major = Number(match[1])
  return major >= 5
}
```

**New code**:
```typescript
function isCodexModel(model: string): boolean {
  // Accept both "gpt-5" and "gpt-5.6" style versions.
  const match = model.match(/^gpt-(\d+)(?:\.(\d+))?/)
  if (!match) return false
  const major = Number(match[1])
  const minor = match[2] != null ? Number(match[2]) : 0
  // Compare by (major, minor) tuple, not just major.
  if (major > 5) return true
  if (major === 5 && minor >= 0) return true
  return false
}
```

Plus a small unit test in `test/providers/codex.test.ts` covering `"gpt-5"`, `"gpt-5.6"`, `"gpt-6"`, `"gpt-4.9"`.

---

### 6. Version bump alignment in `package.json`
**File**
{"prompt_tokens":16912,"completion_tokens":4096,"total_tokens":21008,"cache_read_input_tokens":0,"cache_creation_input_tokens":0}

[Session: 46cb47ae-7e99-4688-a270-8e221b50a507]
[Messages: 2, Tokens: 21008]
