# Update Plan for Alexi

Generated: 2026-10-02
Based on upstream commits analyzed:
- kilocode: fdebb0e10..a10fa8ebe (27 commits)
- opencode: 0112a92..1ddb087 (7 commits)

## Summary
- Total changes planned: 3
- Critical: 0 | High: 2 | Medium: 1 | Low: 0

The majority of upstream changes relate to VSCode webview prompt history (feat/per-conversation-prompt-history) and stats dashboard refactoring, neither of which apply to Alexi (SAP AI Core-focused). The relevant changes are:
1. PTY smoke test resiliency improvements (bug fix for Windows/pwsh users)
2. Agent manager tool validation error message improvement
3. Agent manager setup task error handling refactor

## Changes

### 1. Improve PTY smoke test resiliency against slow shell startup
**File**: `src/core/kilocode/pty/smoke.ts` (if exists in Alexi) or equivalent
**Priority**: high
**Type**: bugfix
**Reason**: Shells (notably `pwsh` under ConPTY while PSReadLine starts) can drop input written before they are ready to read it, causing the smoke test to time out. The fix adds a retry probe interval, extends the timeout, and makes the function parameterizable for testing. This is a legitimate bug fix affecting Windows users and should be ported.

**Current code**:
```typescript
import { Shell } from "../../shell"
import { KiloPtyTermination } from "./termination"
import { spawn } from "#pty"

const TIMEOUT = 15_000

export async function smoke() {
  const proc = spawn(Shell.preferred(), [], {
    name: "xterm-256color",
    cwd: process.cwd(),
    env: { ...process.env, TERM: "xterm-256color", KILO_TERMINAL: "1" } as Record<string, string>,
    // ...
  })
  // ...
  const timeout = AbortSignal.timeout(TIMEOUT)

  try {
    proc.resize(100, 40)
    proc.write("echo KILO_PTY_READY\r")
    await Promise.race([
      output.promise,
      new Promise<never>((_, reject) =>
        timeout.addEventListener(
          "abort",
          () => reject(new Error(`PTY smoke test timed out after ${TIMEOUT}ms`)),
        ),
      ),
    ])
    proc.write("exit 7\r")
    // ...
  }
}
```

**New code**:
```typescript
import { Shell } from "../../shell"
import { KiloPtyTermination } from "./termination"
import { spawn } from "#pty"

const TIMEOUT = 30_000
// Shells can drop input written before they are ready to read it (for example pwsh under
// ConPTY while PSReadLine starts), so resend the probe until the shell answers.
const RETRY = 1_000

export async function smoke(file = Shell.preferred(), args: string[] = []) {
  const proc = spawn(file, args, {
    name: "xterm-256color",
    cwd: process.cwd(),
    env: { ...process.env, TERM: "xterm-256color", KILO_TERMINAL: "1" } as Record<string, string>,
    // ...
  })
  // ...
  const timeout = AbortSignal.timeout(TIMEOUT)
  const probe = () => {
    if (state.exited) return
    try {
      proc.write("echo KILO_PTY_READY\r")
    } catch (err) {
      output.reject(err)
    }
  }
  const retry = setInterval(probe, RETRY)

  try {
    proc.resize(100, 40)
    probe()
    await Promise.race([
      output.promise,
      new Promise<never>((_, reject) =>
        timeout.addEventListener(
          "abort",
          () => reject(new Error(`PTY smoke test timed out after ${TIMEOUT}ms`)),
        ),
      ),
    ])
    // Stop probing before exit so no probe follows the exit command. Probes already queued
    // only print the marker again and run before exit.
    clearInterval(retry)
    proc.write("exit 7\r")
    // ...
  } finally {
    clearInterval(retry)
  }
}
```

**Additional test file**: `src/core/kilocode/pty/smoke.test.ts` (or appropriate test location)
```typescript
import { expect, test } from "bun:test"
import { smoke } from "./smoke"

// A fake shell that drops all input it reads during startup, like pwsh under ConPTY.
const shell = `
  const start = Date.now()
  const state = { buf: "" }
  process.stdin.setRawMode(true)
  process.stdin.on("data", (data) => {
    if (Date.now() - start < 1_500) return
    state.buf += data.toString()
    const lines = state.buf.split("\\r")
    state.buf = lines.pop() ?? ""
    for (const line of lines) {
      if (line.startsWith("echo ")) process.stdout.write(line.slice(5) + "\\r\\n")
      if (line.startsWith("exit ")) process.exit(Number(line.slice(5)))
    }
  })
  process.stdout.write("fake shell\\r\\n")
`

test("resends the probe when the shell drops early input", async () => {
  await expect(smoke(process.execPath, ["-e", shell])).resolves.toBeUndefined()
}, 20_000)
```

---

### 2. Improve agent-manager tool error message for `worktreeID` validation
**File**: `src/tool/agent-manager.ts` (if present in Alexi)
**Priority**: medium
**Type**: bugfix (UX/agent correction hint)
**Reason**: The previous error message `"worktreeID requires mode local"` was ambiguous and did not guide the LLM on how to recover. The new message includes the received worktreeID and explicit remediation ("omit worktreeID or send JSON null"), which materially improves agent self-correction. Low-risk, high-value change.

**Current code**:
```typescript
export const Params = Schema.Union([
  // ...
  }).check(
    Schema.makeFilter((params) => {
      if (params.worktreeID == null) return undefined
      if (params.mode !== "local") return "worktreeID requires mode local"
      if (params.versions === true) return "worktreeID cannot be combined with versions true"
      if (params.tasks.some((task) => task.branchName != null)) return "worktreeID cannot be combined with branchName"
      return undefined
    }),
  ),
])
```

**New code**:
```typescript
export const Params = Schema.Union([
  // ...
  }).check(
    Schema.makeFilter((params) => {
      if (params.worktreeID == null) return undefined
      if (params.mode !== "local")
        return `worktreeID ${JSON.stringify(params.worktreeID)} requires mode local. To start a new worktree, omit worktreeID or send JSON null`
      if (params.versions === true) return "worktreeID cannot be combined with versions true"
      if (params.tasks.some((task) => task.branchName != null)) return "worktreeID cannot be combined with branchName"
      return undefined
    }),
  ),
])
```

**Note**: If Alexi does not currently include the `agent-manager` tool (SAP AI Core integration may not require worktree-based parallel agent flows), skip this change. Verify by checking `src/tool/` for `agent-manager.ts`.

---

### 3. (Optional) Port agent-manager setup task error handling simplification
**File**: `src/agent/agent-manager/task-runner.ts` (if present)
**Priority**: medium
**Type**: refactor
**Reason**: Upstream `refactor(agent-manager): simplify setup task start error handling` (commit 11b67894a) reduced ~19 lines of boilerplate error handling. Worth porting only if Alexi has an agent-manager with equivalent task-runner logic. Without access to the specific diff hunks, defer this to a follow-up review.

**Action**: Review `packages/kilo-vscode/src/agent-manager/task-runner.ts` upstream diff (not fully shown in report) and port equivalent simplification if Alexi has mirrored code. Otherwise skip.

---

## Excluded Changes (and why)

The following upstream changes are **intentionally excluded** from this plan:

| Change | Reason for exclusion |
|---|---|
| `feat/per-conversation-prompt-history` (webview-ui, i18n, PromptInput.tsx, usePromptHistory.ts) | Alexi does not include the VSCode webview UI; this is kilo-vscode-specific. |
| `fix(kilo-docs): upgrade next to 16.3.6` | Documentation site, not applicable. |
| `release: v7.8.3` + version bumps across 20+ `package.json` files | Alexi maintains independent versioning. |
| `nix/hashes.json` updates | Nix build artifact, not applicable. |
| `opencode/stats/*` (athena retire, lake retire, i18n, agent-formats) | Stats dashboard refactor, unrelated to Alexi's SAP AI Core focus. |
| `packages/console/*` log-processor changes | Opencode console-specific. |
| `fix(agent-manager): run worktree setup for every worktree` | Worktree-specific flow likely absent in Alexi. |

---

## Testing Recommendations

1. **PTY smoke test**:
   - Run existing smoke test on Linux/macOS to confirm no regression.
   - If possible, test on Windows with pwsh + PSReadLine to validate the retry behavior.
   - Add the new test (`smoke.test.ts`) to ensure retry probe works against slow shells.
   - Verify the `clearInterval(retry)` runs even on error paths (consider adding a `finally` block as shown).

2. **Agent-manager tool**:
   - Add a unit test asserting the new error message format when `worktreeID` is provided with non-local mode.
   - Verify existing agent-manager tests still pass.

3. **SAP AI Core integration**:
   - Smoke test a basic chat completion flow after merge to confirm no regressions in provider wiring.
   - Confirm no accidental dependency changes affect the SAP provider.

## Potential Risks

- **PTY timeout extension (15s → 30s)**: Doubled wait time for failed shells. If Alexi runs this smoke test in CI, test runtimes may increase. Mitigation: the retry probe should resolve healthy shells faster than before, so wall-clock impact in success cases is negligible.
- **Interval leak**: Ensure `clearInterval(retry)` is called in all code paths (including thrown errors). The upstream diff only clears it on the happy path; recommend wrapping in `try/finally` as shown in the "New code" snippet above — this is a **small improvement over upstream**.
- **Agent-manager change**: If Alexi's schema version of `agent-manager` tool diverges significantly from upstream, the `JSON.stringify(params.worktreeID)` call could expose internal data in error messages shown to users. Review whether `worktreeID` ever contains sensitive data; if so, replace with a sanitized reference.
- **No breaking changes expected** since all included changes are backward-compatible refinements.
{"prompt_tokens":11158,"completion_tokens":3884,"total_tokens":15042,"cache_read_input_tokens":0,"cache_creation_input_tokens":0}

[Session: 051e55aa-8709-45bb-b421-77e0340bfb83]
[Messages: 2, Tokens: 15042]
