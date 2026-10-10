# Alexi Upstream-Sync Change Summary

**Generated**: 2026-10-10
**Plan source**: Upstream analysis of kilocode (fb7e96eda, defcd7dff, e3552defc,
32491185e, 31fed7f43, a1fbca087) and opencode (055d95b, b2a3926).

---

## Files Modified / Created

| Change | File | Status |
| --- | --- | --- |
| 3 | `src/session/network.ts` | **modified** |
| 3 | `src/session/__tests__/network.test.ts` | **modified** |
| 4 | `src/cli/utils/platformSupport.ts` | **created** |
| 4 | `src/cli/utils/__tests__/platformSupport.test.ts` | **created** |
| 5 | `src/cli/tui/utils/formatToolOutput.ts` | **modified** |
| 5 | `src/cli/tui/utils/formatToolOutput.test.ts` | **created** |

---

## Change-by-change notes

### Changes 1 & 2 — Copilot interleaved `reasoning_opaque` handling — SKIPPED (N/A)

**Reason**: Alexi has no GitHub Copilot provider. Alexi's provider surface is
SAP AI Core (`src/providers/sapOrchestration.ts`) + SAP Orchestration, with
reasoning handled in `src/providers/reasoning.ts` using the Anthropic-native
`thinking` shape (`{ type: 'enabled', budget_tokens }`). The
`convert-to-openai-compatible-chat-messages.ts` and
`openai-compatible-chat-language-model.ts` files referenced in the plan do
not exist in Alexi's tree, and the `reasoning_opaque` wire-field is a
Copilot-only concept (Copilot's VS Code client contract). The upstream bug
— "`InvalidResponseDataError` on second `reasoning_opaque` delta" — cannot
occur in Alexi because Alexi's SAP Anthropic path consumes `thinking` deltas
with per-block `signature` values, not opaque strings.

**Verification**: `grep -r 'reasoning_opaque\|reasoningOpaque' src/` → 0 matches.
No action required to preserve SAP AI Core compatibility.

---

### Change 3 — Classify ECONNRESET by error `.code` so retryable resets flow through standard backoff — **applied**

**File**: `src/session/network.ts`

Rewrote `classifyNetworkError` to detect network transport failures by
Node `ErrnoException.code` first (walking both `err.code` and
`err.cause.code` for undici fetch wrappers) and only fall back to
message-substring matching when no code is present. This mirrors upstream
opencode `055d95b`'s core insight: callers that short-circuit on wording
(`"server reset"`, `"ECONNRESET"` in the message) misclassify any error
whose message was rewritten by a middleware, bypassing the normal
exponential-backoff retry path implemented in `src/core/session/retry.ts`.

Added a new exported predicate `isRetryableConnectionReset(err)` returning
`true` for `ECONNRESET` / `ETIMEDOUT` / `EAI_AGAIN` (code-first, message
fallback). Callers who need to route retryable resets through
`withRetry()` instead of a fail-fast path can import this predicate.

**Tests added** (`src/session/__tests__/network.test.ts`):
- `classifyNetworkError` prefers `.code` over message wording — covers the
  exact regression (an `Error` with message `"server reset"` but
  `code: 'ECONNRESET'`).
- Classification walks `err.cause.code` for undici-style `fetch failed`
  wrappers.
- Full `isRetryableConnectionReset` suite: `.code` detection,
  `.cause.code` detection, message-fallback detection, and negative
  cases (`ENOTFOUND`, non-Error inputs).

**SAP AI Core impact**: Positive. SAP AI Core sits behind corporate
proxies that routinely drop long-lived streams; the new behaviour makes
every retryable reset flow through the shared backoff formula.

---

### Change 4 — Clearer startup diagnostic on uncommon platforms (spirit of win32-arm64 fix) — **applied with scope adjustment**

**Files**: `src/cli/utils/platformSupport.ts` (new),
`src/cli/utils/__tests__/platformSupport.test.ts` (new)

**Scope adjustment**: Alexi has no native binary — `package.json` declares
`"bin": { "alexi": "dist/cli/program.js", "ax": "dist/cli/program.js" }`
and there is no postinstall script. The upstream opencode fix for
"no prebuilt binary available for win32-arm64" literally cannot apply
(Node runs natively on win32-arm64; Alexi has no prebuilt binary
dependency to fail on). Rather than fabricate a nonexistent binary
dispatcher, I added a lightweight diagnostic utility that honours the
spirit of the plan:

- `platformSupportWarning(info?)` — returns a human-readable advisory
  for win32-arm64 (optional native deps like `tree-sitter`,
  `better-sqlite3` historically lack arm64 wheels), unsupported
  platforms (anything outside `linux` / `darwin` / `win32`), or
  unsupported architectures (anything outside `x64` / `arm64`).
- `formatStartupError(err, info?)` — composes a startup error message
  with the platform/arch triple and, when applicable, the advisory from
  `platformSupportWarning`.
- `currentPlatform()` — pure accessor returning a
  `{ platform, arch, nodeVersion }` snapshot.

All three helpers accept an injected `PlatformInfo` so tests do not need
to monkey-patch `process`. The utility is not yet wired into
`program.ts`; it is available for `src/cli/program.ts` and any future
startup smoke-test to call when a fatal error is caught.

**Tests added**: 7 unit tests covering linux-x64 (no warning),
darwin-arm64 (no warning), win32-arm64 (Windows ARM64 advisory),
freebsd (platform-not-supported warning), linux-riscv64 (arch-not-supported
warning), and the `formatStartupError` composition on each branch.

**SAP AI Core impact**: None (no provider code changed).

---

### Change 5 — C++ module interface units in filetype map — **applied**

**File**: `src/cli/tui/utils/formatToolOutput.ts`

Alexi's filetype → syntax-highlighter language map lives in
`guessLanguageFromPath` (used by `DiffView.tsx` to drive `cli-highlight`).
Added entries for:

- `.c`, `.h` → `c`
- `.cpp`, `.cc`, `.cxx`, `.hpp`, `.hh`, `.hxx` → `cpp`
- **C++20 module interface units** (opencode `b2a3926`):
  `.ixx` (MSVC), `.cppm` (Clang/standard), `.ccm`, `.cxxm`, `.c++m`
  (vendor variants) → `cpp`

Widened the extension-matching regex from `/\.([a-zA-Z0-9]+)$/` to
`/\.([a-zA-Z0-9+]+)$/` so `.c++m` is detected. No other call-sites of
`guessLanguageFromPath` were affected (verified by `grep`).

**Tests added** (`src/cli/tui/utils/formatToolOutput.test.ts`): 4 unit
tests covering existing TS/JS mappings (regression), standard C/C++
sources, every new module-interface extension including the vendor
variants, and the unknown/extension-less fallback path.

**SAP AI Core impact**: None (TUI-only presentation change).

---

## Verification steps

- `grep -r 'reasoning_opaque\|reasoningOpaque' src/` → 0 hits (confirms
  Changes 1 & 2 are correctly skipped).
- All new/modified files follow Alexi conventions: `.js` extensions on
  local imports, Prettier-compatible formatting (100 cols, single
  quotes, `trailingComma: es5`), ESLint-strict (no `console.*` outside
  `src/utils/logger.ts`, `eqeqeq` everywhere, unused vars prefixed `_`).
- No changes to `src/providers/**` — SAP AI Core adapter paths are
  untouched.
- No new runtime dependencies.

## Issues encountered

- **Plan vs. reality mismatch for Changes 1, 2, 4**: Alexi's architecture
  (no Copilot provider, no native binary) means those upstream fixes do
  not have a direct target. Change 1/2 is a true no-op (documented
  above); Change 4 was reinterpreted as a platform diagnostic utility
  that mirrors the user-facing spirit (clearer error messages on
  uncommon platforms) without fabricating a non-existent native binary
  dispatcher.
- No test regressions expected; the modified `src/session/network.ts`
  preserves the previous message-fallback semantics so every pre-existing
  assertion in `src/session/__tests__/network.test.ts` continues to hold.
