# Update Plan for Alexi

Generated: 2026-08-22
Based on upstream commits analyzed:
- **kilocode**: fe760ab02..ff74e2ea3 (118 commits)
- **opencode**: e11dbd0..e00890c (26 commits)

## Summary
- Total changes planned: 8
- Critical: 2 | High: 3 | Medium: 2 | Low: 1

Note: Only changes relevant to Alexi's core orchestration, tool system, permission system, and provider layers are included. UI-specific (JetBrains/VSCode webview), i18n, visual regression baselines, and provider-usage-center features (Kilo-specific product) are excluded.

## Changes

### 1. Surface subagent tool errors in Task tool
**File**: `src/tool/task.ts`
**Priority**: critical
**Type**: bugfix
**Reason**: Upstream fix (opencode #43821, commit `35fe5b7`) — when a subagent's inner tool call fails but the subagent session itself completes without an error state, the failure was silently swallowed and only the last text part was returned. This masks real failures from callers.

**Current code**:
```typescript
if (result.info.error) {
  const message =
    result.info.error.name === "MessageOutputLengthError"
      ? "Output length exceeded maximum"
      : result.info.error.name
  return yield* Effect.fail(new Error(`Subagent failed (task_id: ${nextSession.id}): ${message}`))
}
return result.parts.findLast((item) => item.type === "text")?.text ?? ""
```

**New code**:
```typescript
if (result.info.error) {
  const message =
    result.info.error.name === "MessageOutputLengthError"
      ? "Output length exceeded maximum"
      : result.info.error.name
  return yield* Effect.fail(new Error(`Subagent failed (task_id: ${nextSession.id}): ${message}`))
}
const failed = result.parts.findLast((item) => item.type === "tool" && item.state.status === "error")
if (failed?.type === "tool" && failed.state.status === "error") {
  return yield* Effect.fail(new Error(`Subagent failed (task_id: ${nextSession.id}): ${failed.state.error}`))
}
return result.parts.findLast((item) => item.type === "text")?.text ?? ""
```

---

### 2. Add test coverage for subagent tool error surfacing
**File**: `src/tool/task.test.ts`
**Priority**: high
**Type**: feature (test coverage)
**Reason**: Mirrors upstream opencode `packages/opencode/test/tool/task.test.ts` (+65 lines). Validates that failed inner tool calls propagate the error instead of returning empty/silent text.

**New code** (append):
```typescript
describe("TaskTool - subagent tool errors", () => {
  it("fails when subagent produced an errored tool part", async () => {
    const result = {
      info: { error: null },
      parts: [
        { type: "text", text: "partial reasoning" },
        { type: "tool", state: { status: "error", error: "permission_denied: bash rm -rf /" } },
      ],
    }
    // Assert the tool wrapper rejects with a message containing the inner error
    // and includes the subagent task_id in the failure message.
    await expect(runTaskWithMockedResult(result)).rejects.toThrow(
      /Subagent failed \(task_id: .+\): permission_denied/,
    )
  })

  it("returns last text when no tool errors present", async () => {
    const result = {
      info: { error: null },
      parts: [
        { type: "tool", state: { status: "ok" } },
        { type: "text", text: "final answer" },
      ],
    }
    await expect(runTaskWithMockedResult(result)).resolves.toBe("final answer")
  })
})
```

---

### 3. Harden PTY termination against stale kill() results
**File**: `src/core/pty/termination.ts` (if PTY module exists in Alexi; otherwise skip)
**Priority**: high
**Type**: bugfix
**Reason**: Upstream kilocode change to `packages/core/src/kilocode/pty/termination.ts`. The prior code trusted `killed === true` from `taskkill`/`kill` even when the process was actually still alive. Now it also consults `input.alive(pid)` to decide whether to escalate to a direct signal. Prevents leaked/zombie PTY processes across reloads.

**Current code**:
```typescript
if (!killed && !state.exited) direct(proc)
```

**New code**:
```typescript
if ((!killed || input.alive(proc.pid)) && !state.exited) direct(proc)
```

**Companion test change** in `src/core/pty/termination.test.ts`:
```typescript
// Add a scenario where taskkill/kill returns success=true but the process
// remains alive (e.g., detached child). Assert direct(proc) is invoked.
it("escalates to direct kill when process remains alive after reported kill", async () => {
  const runtime = makeRuntime({
    aliveResult: true, // pid still reports alive
    spawnResult: { status: 0 }, // taskkill reports success
  })
  const direct = spyOn(runtime, "direct")
  await terminate(proc, runtime)
  expect(direct).toHaveBeenCalledWith(proc)
})
```

---

### 4. Guard `textVerbosity` injection for openai-compatible providers
**File**: `src/providers/provider.ts` (or equivalent transform layer)
**Priority**: high
**Type**: bugfix
**Reason**: Upstream opencode PR #43915 (commit `3a4c253`). `@ai-sdk/openai-compatible` providers do not universally accept `textVerbosity`; injecting it unconditionally causes some SAP AI Core-fronted models (and other compatibles) to reject requests. Since Alexi integrates with SAP AI Core (which frequently wraps OpenAI-compatible endpoints), this is directly relevant.

**Current code** (approximate — locate the transform that injects verbosity):
```typescript
if (options.textVerbosity !== undefined) {
  providerOptions.textVerbosity = options.textVerbosity
}
```

**New code**:
```typescript
// Only inject textVerbosity when the provider actually supports it.
// openai-compatible providers (including many SAP AI Core deployments) reject unknown params.
const supportsVerbosity =
  provider.id === "openai" ||
  provider.id === "openai-responses" ||
  provider.capabilities?.textVerbosity === true

if (options.textVerbosity !== undefined && supportsVerbosity) {
  providerOptions.textVerbosity = options.textVerbosity
}
```

---

### 5. Retry unknown/raw network finish errors
**File**: `src/core/session/retry.ts` (or wherever retry classification lives)
**Priority**: high
**Type**: bugfix
**Reason**: Upstream opencode commits `e0b9e68` and `40282c1` broaden retry classification to include raw network variants and unknown finish reasons. Prevents user-visible failures on transient network hiccups mid-stream — critical for SAP AI Core which sits behind corporate proxies and can produce truncated streams.

**New code** (extend retryable-error matcher):
```typescript
const RETRYABLE_NETWORK_PATTERNS = [
  /ECONNRESET/i,
  /ETIMEDOUT/i,
  /ENOTFOUND/i,
  /EAI_AGAIN/i,
  /socket hang up/i,
  /network error/i,
  /fetch failed/i,
  /terminated/i,      // undici stream terminated
  /premature close/i, // NEW
]

export function isRetryable(err: unknown): boolean {
  if (err instanceof Error) {
    if (RETRYABLE_NETWORK_PATTERNS.some((p) => p.test(err.message))) return true
    // Retry unknown finish reasons (upstream: continue unknown finish responses)
    if ((err as any).finishReason === "unknown") return true
  }
  return isHttpRetryable(err)
}
```

---

### 6. Continue on unknown finish responses (do not fail the turn)
**File**: `src/core/session/runner/llm.ts`
**Priority**: medium
**Type**: bugfix
**Reason**: Upstream opencode commit `57fa34f` (#43892). When a model reports an `unknown` finish reason (rather than `stop`/`length`/`tool_calls`), the runner should continue/retry rather than aborting the assistant turn. Also aligns with kilocode change to `packages/core/src/session/runner/llm.ts`.

**Current code** (approximate):
```typescript
switch (finishReason) {
  case "stop":
  case "length":
  case "tool_calls":
    return handleFinish(finishReason)
  default:
    throw new Error(`Unexpected finish reason: ${finishReason}`)
}
```

**New code**:
```typescript
switch (finishReason) {
  case "stop":
  case "length":
  case "tool_calls":
    return handleFinish(finishReason)
  case "unknown":
    // Treat as transient — allow retry loop to continue the response.
    return handleFinish("unknown", { continue: true })
  default:
    throw new Error(`Unexpected finish reason: ${finishReason}`)
}
```

---

### 7. Coalesce consecutive user messages in LLM protocol adapters
**File**: `src/providers/protocols/shared.ts` (create if missing) + apply in `anthropic-messages.ts`, `bedrock-converse.ts`, `gemini.ts`
**Priority**: medium
**Type**: refactor + bugfix
**Reason**: Upstream kilocode PRs #13255 / #13301. Anthropic, Bedrock Converse, and Gemini all require strict user/assistant alternation. Prior implementations had per-protocol coalescing logic; upstream now centralizes it in `protocols/shared.ts` and additionally fixes the CLI max-steps message to be sent as a *user* message (which required correct coalescing). Directly relevant for SAP AI Core Anthropic/Bedrock deployments.

**New file** `src/providers/protocols/shared.ts`:
```typescript
import type { ModelMessage } from "ai"

/**
 * Merge consecutive user messages into a single user message so that
 * providers requiring strict alternation (Anthropic, Bedrock Converse, Gemini)
 * do not receive back-to-back user turns.
 */
export function coalesceUserMessages(messages: ModelMessage[]): ModelMessage[] {
  const out: ModelMessage[] = []
  for (const msg of messages) {
    const last = out[out.length - 1]
    if (last && last.role === "user" && msg.role === "user") {
      const lastContent = Array.isArray(last.content) ? last.content : [{ type: "text", text: last.content }]
      const nextContent = Array.isArray(msg.content) ? msg.content : [{ type: "text", text: msg.content }]
      out[out.length - 1] = { ...last, content: [...lastContent, ...nextContent] }
    } else {
      out.push(msg)
    }
  }
  return out
}
```

**Change** in each protocol adapter (example: `anthropic-messages.ts`):
```typescript
// Before: inline coalescing logic
// ... manual loop merging user messages ...

// After:
import { coalesceUserMessages } from "./shared"

const normalized = coalesceUserMessages(messages)
// use `normalized` for the outbound request
```

---

### 8. Resolve console/device verification URLs safely (opencode plugin)
**File**: `src/providers/opencode-plugin.ts` (only if Alexi ships the opencode OAuth device-code plugin)
**Priority**: low
**Type**: security
**Reason**: Upstream opencode commit `e00890c` (
{"prompt_tokens":32550,"completion_tokens":4096,"total_tokens":36646,"cache_read_input_tokens":0,"cache_creation_input_tokens":0}

[Session: 87497d42-6511-4d62-91f2-b55dca0597ec]
[Messages: 2, Tokens: 36646]
