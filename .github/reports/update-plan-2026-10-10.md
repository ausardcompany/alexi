```markdown
# Update Plan for Alexi

Generated: 2026-10-10
Based on upstream commits analyzed:
- kilocode: fb7e96eda, defcd7dff, e3552defc, 32491185e, 31fed7f43, a1fbca087
- opencode: 055d95b, b2a3926

## Summary
- Total changes planned: 5
- Critical: 0 | High: 2 | Medium: 2 | Low: 1

## Changes

### 1. Fix Copilot interleaved `reasoning_opaque` handling in message conversion
**File**: `src/providers/github-copilot/chat/convert-to-openai-compatible-chat-messages.ts` (or equivalent in Alexi's provider layer; if the file does not exist, locate the SAP AI Core / Copilot message-conversion module and apply the equivalent logic)
**Priority**: high
**Type**: bugfix
**Reason**: Claude models via Copilot use *interleaved thinking*, emitting a new `reasoning_opaque` before each tool call. The previous "first-wins" behavior drops subsequent opaque values and only keeps the first reasoning segment, causing multi-turn Claude reasoning to break. The fix concatenates reasoning text and keeps the latest opaque (matching Copilot's VS Code client).

**Current code**:
```typescript
for (const part of content) {
  const partMetadata = getOpenAIMetadata(part)
  // Check for reasoningOpaque on any part (may be attached to text/tool-call)
  const partOpaque = (part.providerOptions as { copilot?: { reasoningOpaque?: string } })?.copilot
    ?.reasoningOpaque
  if (partOpaque && !reasoningOpaque) {
    reasoningOpaque = partOpaque
  }

  switch (part.type) {
    // ...
    case "reasoning": {
      if (part.text) reasoningText = part.text
      break
    }
    // ...
  }
}
```

**New code**:
```typescript
for (const part of content) {
  const partMetadata = getOpenAIMetadata(part)
  // reasoningOpaque may be attached to any part. Interleaved thinking yields one per
  // reasoning segment; like the Copilot VS Code client, replay the latest opaque value
  // with the concatenated reasoning text.
  const partOpaque = (part.providerOptions as { copilot?: { reasoningOpaque?: string } })?.copilot
    ?.reasoningOpaque
  if (partOpaque) {
    reasoningOpaque = partOpaque
  }

  switch (part.type) {
    // ...
    case "reasoning": {
      if (part.text) reasoningText = (reasoningText ?? "") + part.text
      break
    }
    // ...
  }
}
```

---

### 2. Accept multiple `reasoning_opaque` deltas in Copilot stream parser
**File**: `src/providers/github-copilot/chat/openai-compatible-chat-language-model.ts` (or equivalent streaming language model in Alexi)
**Priority**: high
**Type**: bugfix
**Reason**: The current implementation throws `InvalidResponseDataError` when a stream sends more than one `reasoning_opaque`. Claude's interleaved thinking legitimately produces multiple values. This breaks all Claude-via-Copilot tool-calling flows. Fix is to keep the latest value instead of throwing.

**Current code**:
```typescript
// Capture reasoning_opaque for Copilot multi-turn reasoning
if (delta.reasoning_opaque) {
  if (reasoningOpaque != null) {
    throw new InvalidResponseDataError({
      data: delta,
      message:
        "Multiple reasoning_opaque values received in a single response. Only one thinking part per response is supported.",
    })
  }
  reasoningOpaque = delta.reasoning_opaque
}
```

**New code**:
```typescript
// Interleaved thinking (Claude) sends a new reasoning_opaque before each tool call.
// Keep the latest, matching the Copilot VS Code client, which replays only that one.
if (delta.reasoning_opaque) reasoningOpaque = delta.reasoning_opaque
```

**Note**: If Alexi emits `reasoning-end` events, verify that the opaque is attached per-segment (before each `tool-call`) rather than only at stream completion. Consult the upstream test fixture `interleavedReasoningOpaque` to confirm emission order:
- `reasoning-delta` → `reasoning-end` (with opaque-first) → `tool-call` (opaque-first) → `reasoning-delta` → `reasoning-end` (opaque-second) → `tool-call` (opaque-second).

---

### 3. Retry retryable connection resets through normal backoff path (ECONNRESET)
**File**: `src/core/session/retry.ts` and `src/core/session/network.ts` (or equivalent Alexi retry/network modules)
**Priority**: high
**Type**: bugfix
**Reason**: Previously `ECONNRESET` errors were being classified as `serverReset` based on error wording, bypassing the normal exponential backoff retry path. The upstream fix keys `serverReset` detection off the error **code** and routes retryable connection resets back into the standard retry loop. Important for stability on flaky networks and behind corporate proxies — common in SAP enterprise environments.

**Suggested changes** (`network.ts`):
```typescript
// Before: detection via error message string match
export function isServerReset(err: unknown): boolean {
  const msg = (err as Error)?.message ?? ""
  return msg.includes("server reset") || msg.includes("ECONNRESET")
}

// After: detect via error code (Node ErrnoException), with explicit retryable mapping
export function isServerReset(err: unknown): boolean {
  const code = (err as NodeJS.ErrnoException)?.code
  return code === "ECONNRESET" || code === "EPIPE" || code === "ETIMEDOUT"
}

export function isRetryableConnectionReset(err: unknown): boolean {
  const code = (err as NodeJS.ErrnoException)?.code
  // Treat these as retryable through the normal backoff path
  return code === "ECONNRESET" || code === "ETIMEDOUT" || code === "EAI_AGAIN"
}
```

**Suggested changes** (`retry.ts`):
```typescript
// Route retryable resets through the normal retry/backoff path
if (isRetryableConnectionReset(err)) {
  // Fall through to standard backoff instead of marking as serverReset-fail-fast
  return { shouldRetry: true, strategy: "backoff" }
}
```

Add a regression test mirroring `test/kilocode/session-processor-retry-limit.test.ts` ensuring that an injected `ECONNRESET` is retried N times via exponential backoff rather than failing immediately.

---

### 4. Improve CLI error message for missing binary on Windows ARM64
**File**: `src/cli/postinstall.ts` and `src/cli/bin/alexi` (or Alexi equivalent)
**Priority**: medium
**Type**: feature (UX)
**Reason**: Windows ARM64 users receive a cryptic error when the native binary is missing. Upstream added a clearer diagnostic. SAP developers increasingly use ARM64 Windows (Dev Boxes, Surface devices), so this improves the enterprise onboarding story.

**Suggested changes** (CLI bootstrap):
```typescript
// bin wrapper (equivalent of packages/opencode/bin/kilo)
function fail(binPath: string) {
  const platform = process.platform
  const arch = process.arch
  if (platform === "win32" && arch === "arm64") {
    console.error(
      `Alexi: no prebuilt binary available for Windows ARM64 at ${binPath}.\n` +
      `Native binaries for win32-arm64 are not currently published.\n` +
      `Workarounds:\n` +
      `  • Install the x64 build and run under x64 emulation.\n` +
      `  • Track support at: https://github.com/<org>/alexi/issues\n`,
    )
  } else {
    console.error(`Alexi: missing binary for ${platform}-${arch} at ${binPath}.`)
  }
  process.exit(1)
}
```

**Suggested changes** (`postinstall.ts`):
```typescript
// Detect win32-arm64 at install time and emit a warning rather than silently failing
if (process.platform === "win32" && process.arch === "arm64") {
  console.warn(
    "[alexi] Warning: no native binary is published for win32-arm64. " +
    "The CLI may not work until support is added.",
  )
}
```

Add a startup smoke test (mirror `test/kilocode/bin-startup.test.ts`) that asserts the improved error message is surfaced on unsupported platforms.

---

### 5. Add C++ module interface files to TUI/filetype detection
**File**: `src/tui/util/filetype.ts` or `src/cli/util/filetype.ts` (or wherever Alexi maintains file-extension → language mappings)
**Priority**: low
**Type**: feature
**Reason**: C++20 module interface units (`.ixx`, `.cppm`, `.mxx`) and some vendor-specific extensions are not currently highlighted. Minor UX improvement; no SAP-specific impact.

**New code** (add to the filetype map):
```typescript
export const FILETYPE_MAP: Record<string, string> = {
  // ... existing entries
  ".ixx": "cpp",   // MSVC module interface
  ".cppm": "cpp",  // Clang/standard module interface
  ".ccm": "cpp",
  ".cxxm": "cpp",
  ".c++m": "cpp",
}
```

If Alexi delegates to tree-sitter or Monarch grammars, extend the extension-to-grammar lookup instead.

---

## Testing Recommendations

1. **Copilot interleaved reasoning** (Changes 1 & 2):
   - Add a stream fixture mirroring upstream `interleavedReasoningOpaque` (Claude via Copilot with two reasoning + two tool-call deltas) and assert each `reasoning-end` carries its own opaque.
   - Add a message-conversion test asserting `reasoning_text` is concatenated and `reasoning_opaque` equals the *latest* value when replaying an assistant turn.
   - Smoke test: invoke a Claude-via-Copilot tool-call flow end-to-end; verify no `InvalidResponseDataError` and that a follow-up turn succeeds.

2. **Retry/backoff** (Change 3):
   - Unit test: inject an `ECONNRESET` into the HTTP client mock; assert N retry attempts occur with growing delays.
   - Unit test: inject an error with the *message* "server reset" but no `.code`; assert it is no longer treated as `serverReset`.
   - Integration test against SAP AI Core proxy, if feasible, under forced TCP RST.

3. **Windows ARM64 CLI** (Change 4):
   - Mock `process.platform = 'win32'`, `process.arch = 'arm64'`; invoke the bin wrapper with a missing binary and assert the ARM64-specific message.
   - Verify postinstall does not fail on win32-arm64, just warns.

4. **Filetype map** (Change 5):
   - Snapshot test: `.ixx`, `.cppm`, `.ccm` resolve to `cpp`.

5. **Regression**:
   - Full existing provider test suite, with emphasis on SAP AI Core adapter paths, to confirm the Copilot changes don't leak into SAP-specific message conversion.

## Potential Risks

- **Change 1/2 (Copilot opaque concatenation)**: If Alexi has an SAP AI Core adapter that reuses the same `convert-to-openai-compatible-chat-
{"prompt_tokens":5920,"completion_tokens":4096,"total_tokens":10016,"cache_read_input_tokens":0,"cache_creation_input_tokens":0}

[Session: aeb9dfbb-9377-42d1-8059-853d0ae01c09]
[Messages: 2, Tokens: 10016]
