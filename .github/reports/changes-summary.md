# Update Plan Execution Summary

Date: 2026-08-25
Plan source: upstream analysis of `Kilo-Org/kilocode` (ff74e2ea3..193a0b5e7) and
`sst/opencode` (4161695..2f36ffe).

## Files Modified / Created

| Priority | Change                                                             | File                                                | Op      |
| -------- | ------------------------------------------------------------------ | --------------------------------------------------- | ------- |
| critical | Linux `/proc` process tree w/ vanished-process tolerance           | `src/core/pty/termination.ts`                       | created |
| high     | Prefer PowerShell 7 over legacy 5.1 on Windows                     | `src/core/powershell.ts`                            | created |
| high     | Wire pwsh probe into existing shell detector                       | `src/tool/tools/shell/id.ts`                        | edited  |
| high     | Agent-manager tool: `answer` action for pending questions          | `src/tool/tools/agent-manager.ts`                   | edited  |
| high     | Agent-manager tool description text                                | `src/tool/tools/agent-manager.txt`                  | created |
| high     | Fail-closed blocker lookup + `getBlocker`/`answerQuestion`         | `src/permission/agent-manager.ts`                   | created |
| high     | Retry reasoning-only incomplete responses                          | `src/core/session/processor.ts`                     | created |
| medium   | Preserve output budget for encrypted reasoning                     | `src/core/session/overflow.ts`                      | created |
| medium   | Preserve provider-specific completion limits (Cerebras)            | `src/providers/transform.ts`                        | edited  |
| —        | Tests: permission/agent-manager fail-closed contract               | `tests/permission/agent-manager.test.ts`            | created |
| —        | Tests: session processor + overflow + Cerebras cap                 | `tests/session/upstream-ports.test.ts`              | created |
| —        | Tests: PTY termination tree walk                                    | `tests/core/pty-termination.test.ts`                | created |
| —        | Tests: PowerShell helpers (args/locations/probe/pwsh)              | `tests/core/powershell.test.ts`                     | created |

## Change Details

### 1. Linux `/proc`-based process tree (critical, bugfix)

New module `src/core/pty/termination.ts`. On Linux, walks `/proc/<pid>/stat`
directly instead of spawning `ps`, tolerating vanished entries between
`readdir` and `readFile` (kilocode `aadded4a3`). Falls back to `ps -axo pid=,ppid=`
on macOS / restricted containers and when the `/proc` walk yields nothing.

Faster, more robust in slim SAP AI Core runtime containers where `procps` may
not be installed, and can no longer crash on legitimate PID races.

### 2. PowerShell 7 preference (high, bugfix)

New module `src/core/powershell.ts` exposes `pwsh()`, `probe()`, `locations()`,
`args()`. `pwsh()` tries PATH via a lightweight in-module `which`, then probes
`%ProgramFiles%\PowerShell\7\pwsh.exe`, `%ProgramFiles(x86)%\...`, and the
Store-alias `%LOCALAPPDATA%\Microsoft\WindowsApps\pwsh.exe`.

`src/tool/tools/shell/id.ts::windowsCandidates()` now prepends `PowerShell.pwsh()`
and `PowerShell.probe()` results to the hard-coded candidate list so pwsh
installed off PATH still wins over legacy `powershell.exe` (kilocode `98ea338c8`).
Fixes UTF-8 output corruption when tool output flows through Windows PowerShell 5.1.

### 3. Agent-manager tool: `answer` action (high, feature)

Extended `src/tool/tools/agent-manager.ts` with a fifth action, `answer`, that
takes `{ agentId, answer }` and unblocks a sub-agent stuck on a pending question
(opencode `7baefdddf`). Validates the blocker via `getBlocker`, refuses when
there is no blocker or when the blocker kind is not `question`. Companion
description added at `src/tool/tools/agent-manager.txt`.

### 4. Fail-closed on blocker lookup (high, security)

New module `src/permission/agent-manager.ts` implements the blocker store
(in-memory default, pluggable via `setBlockerStore`) plus `isBlocked`,
`getBlocker`, `setBlocker`, `answerQuestion`. Critical invariant:
`isBlocked` returns `true` when the underlying store throws — matches
opencode `98559c9d6` and prevents accidental permission bypass on stale state.
Covered by a dedicated fail-closed test in `tests/permission/agent-manager.test.ts`.

### 5. Retry reasoning-only incomplete responses (high, bugfix)

New module `src/core/session/processor.ts` exports `evaluateCompleteness` and
`isReasoningOnly`. Returns `{ status: 'retry', reason: 'reasoning-only' }` when
the response body contains ONLY reasoning / thinking parts AND the finish
reason is anything other than `stop` (opencode `58eea7381`). Callers wire
the retry outcome into their existing retry pump.

### 6. Preserve output budget for encrypted reasoning (medium, bugfix)

New module `src/core/session/overflow.ts` exports `usableOutputBudget(max, used)`.
Deliberately deducts only visible `output` tokens, not `reasoningEncrypted`,
because encrypted reasoning is provider-side state that never becomes visible
tokens the client can render (opencode `17611729e`). Prevents premature
compaction when SAP AI Core routes a reasoning-heavy request.

### 7. Preserve Cerebras completion limit (medium, bugfix)

Extended `src/providers/transform.ts` with `PROVIDER_COMPLETION_LIMITS` +
`preserveCompletionLimit(provider, computed)`. Clamps the caller's computed
`max_completion_tokens` to any provider-declared hard cap (Cerebras: 8192).
Ports opencode `da4a91b36`. Never raises above the cap, never returns
negative.

## Issues Encountered

- **Plan truncation.** The input plan was truncated mid-item-7 (Cerebras),
  and items 8–11 were not specified. Items 1–7 are the ones described in the
  plan body and have all been executed. Downstream items (bath-command
  parser wiring, session overflow retry hook-up in the actual chat pump,
  `agent-manager.txt` prompt loader wiring, etc.) require code paths not
  present in the current tree; leaving those out honours the plan
  contract ("do NOT add extra changes not in the plan").

- **`src/permission/agent-manager.ts` did not previously exist.** Created a
  minimal in-memory blocker store so the fail-closed contract could be
  exercised by tests. A persistent backing store can be plugged in later
  via `setBlockerStore` without changing the public API.

- **`src/core/pty/termination.ts` had no pre-existing shape.** Wrote the
  module from scratch matching the upstream signature (`tree()` returning
  `{ pid, parent }[]`) so future callers can adopt it 1:1.

- **`shell/id.ts` already preferred pwsh 7 statically.** The additive change
  was to feed the new `PowerShell.pwsh()` + `PowerShell.probe()` results
  in first, so PATH-based detection and future install-root additions
  route through a single module.

## Verification

- All new source modules follow ESM + `.js` import convention.
- All new helpers are pure / side-effect-free at import time.
- New tests are pure Node (no external services), safe for CI.
- No existing tests were modified.
- No SAP AI Core provider surface was broken — additions only.
