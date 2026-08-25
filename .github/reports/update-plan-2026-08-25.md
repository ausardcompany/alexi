# Update Plan for Alexi

Generated: 2026-08-25
Based on upstream commits analyzed:
- **kilocode**: ff74e2ea3..193a0b5e7 (129 commits)
- **opencode**: 4161695..2f36ffe (23 commits)

## Summary
- Total changes planned: 11
- Critical: 2 | High: 4 | Medium: 3 | Low: 2

The most relevant upstream changes for Alexi (which focuses on tool/agent/permission/core orchestration for SAP AI Core) are:
1. Windows PowerShell 7 detection (bug fix)
2. Linux PTY termination via `/proc` (bug fix — tolerates vanished processes)
3. Agent-manager tool: answer pending questions (feature)
4. Task tool small refactor
5. Cerebras/completion limit preservation in provider transform
6. Session overflow / retry reasoning-only incomplete responses
7. Background process "clarify background task orchestration"

The bulk of upstream churn (JetBrains UI, VS Code webview, docs, i18n, screenshots, worktrees, kilo-docs) is **out of scope** for Alexi and intentionally excluded.

---

## Changes

### 1. Add Linux `/proc`-based process tree with vanished-process tolerance
**File**: `src/core/pty/termination.ts`
**Priority**: critical
**Type**: bugfix
**Reason**: Upstream `aadded4a3 fix(pty): tolerate vanished process entries` prevents PTY termination from crashing on Linux when a PID disappears between `readdir` and `readFile`. Also avoids spawning `ps` where possible, which is faster and more robust in containerized SAP AI Core runtime environments.

**Current code** (approximate — the pre-change upstream shape):
```typescript
async function tree(file: string = "ps", args: string[] = ["-axo", "pid=,ppid="]) {
  return await new Promise<Array<{ pid: number; parent: number }>>((resolve, reject) => {
    // spawn ps and parse ...
  })
}
```

**New code**:
```typescript
import { readdir, readFile } from "node:fs/promises"

async function tree(file: string = "ps", args: string[] = ["-axo", "pid=,ppid="]) {
  if (process.platform === "linux") {
    try {
      const rows = await procTree()
      if (rows.length > 0) return rows
    } catch (err) {
      log.debug("failed to read Linux process tree", { err })
    }
  }

  return await new Promise<Array<{ pid: number; parent: number }>>((resolve, reject) => {
    // existing ps fallback unchanged
  })
}

async function procTree() {
  const entries = await readdir("/proc", { withFileTypes: true })
  const rows = await Promise.all(
    entries
      .filter((entry) => entry.isDirectory() && /^\d+$/.test(entry.name))
      .map(async (entry) => {
        // Tolerate vanished entries between readdir and readFile
        const stat = await readFile(`/proc/${entry.name}/stat`, "utf8").catch(() => undefined)
        if (!stat) return
        const match = stat.match(/^\d+ \(.*\) [A-Z] (\d+)/)
        if (!match) return
        return { pid: Number(entry.name), parent: Number(match[1]) }
      }),
  )
  return rows.filter((row): row is { pid: number; parent: number } => row !== undefined)
}
```

---

### 2. Prefer PowerShell 7 over legacy 5.1 on Windows
**File**: `src/core/powershell.ts` (create if missing) and `src/core/shell.ts`
**Priority**: high
**Type**: bugfix
**Reason**: Upstream `98ea338c8 fix: prefer powershell 7 over legacy 5.1 on windows`. Legacy PowerShell 5.1 has UTF-8/encoding issues that break tool output on Windows-based Alexi installations. Probe known install locations so pwsh works even when off PATH.

**New code** — create `src/core/powershell.ts`:
```typescript
import { statSync } from "fs"
import path from "path"
import { which } from "./util/which"

export function args(command: string) {
  return ["-NoLogo", "-NoProfile", "-NonInteractive", "-Command", script(command)]
}

export const locations = (env: NodeJS.ProcessEnv = process.env) =>
  [
    env["ProgramFiles"] && path.join(env["ProgramFiles"], "PowerShell", "7"),
    env["ProgramFiles(x86)"] && path.join(env["ProgramFiles(x86)"], "PowerShell", "7"),
    env["LOCALAPPDATA"] && path.join(env["LOCALAPPDATA"], "Microsoft", "WindowsApps"),
  ]
    .filter((item): item is string => Boolean(item))
    .map((root) => path.join(root, "pwsh.exe"))

export const probe = (env: NodeJS.ProcessEnv = process.env) =>
  locations(env).filter((file) => statSync(file, { throwIfNoEntry: false })?.isFile())

export const pwsh = (env: NodeJS.ProcessEnv = process.env) => which("pwsh", env) ?? probe(env)[0]

// existing script() helper preserved ...

export const PowerShell = { args, locations, probe, pwsh }
```

**Update** `src/core/shell.ts` (Windows branch):
```typescript
import { PowerShell } from "./powershell"

function win() {
  return Array.from(
    new Set(
      // Prefer PowerShell 7 over legacy 5.1; probe known install roots when off PATH.
      [PowerShell.pwsh(), which("powershell"), gitbash(), process.env.COMSPEC || "cmd.exe"]
        .filter((item): item is string => Boolean(item))
        .map(full),
    ),
  )
}
```

---

### 3. Agent-manager tool: support "answer pending question" action
**File**: `src/tool/agent-manager.ts` and `src/tool/agent-manager.txt`
**Priority**: high
**Type**: feature
**Reason**: Upstream `7baefdddf feat(agent-manager): answer pending questions` adds a first-class action so the LLM can unblock sub-agents that are waiting for input. This is directly relevant to Alexi's orchestration flow with SAP AI Core sub-agents.

**New parameter schema addition**:
```typescript
// src/tool/agent-manager.ts
export const AgentManagerParams = z.object({
  action: z.enum([
    "start",
    "stop",
    "status",
    "list",
    "answer", // NEW
  ]),
  agentId: z.string().optional(),
  // NEW: answer text for pending questions
  answer: z
    .string()
    .optional()
    .describe("Answer text to send to a sub-agent that is blocked on a pending question. Required when action=answer."),
  // ... existing fields
})

// In the tool handler:
switch (params.action) {
  // ... existing cases
  case "answer": {
    if (!params.agentId || !params.answer) {
      throw new Error("agentId and answer are required for action=answer")
    }
    const blocker = await AgentManager.getBlocker(params.agentId)
    // Fail-closed per fix(agent-manager): fail closed on blocker lookup errors (98559c9d6)
    if (!blocker) {
      throw new Error(`No pending question for agent ${params.agentId}`)
    }
    if (blocker.kind !== "question") {
      throw new Error(`Agent ${params.agentId} is not blocked on a question`)
    }
    await AgentManager.answerQuestion(params.agentId, params.answer)
    return { ok: true, answered: params.agentId }
  }
}
```

**Update** `src/tool/agent-manager.txt` — append to the actions list:
```
- answer: Provide an answer to a sub-agent that is blocked on a pending question.
  Required params: agentId, answer.
  Use when a sub-agent's status shows a pending question that only you can resolve.
```

---

### 4. Fail-closed on agent-manager blocker lookup errors
**File**: `src/permission/agent-manager.ts`
**Priority**: high
**Type**: security
**Reason**: Upstream `98559c9d6 fix(agent-manager): fail closed on blocker lookup errors`. Prevents accidentally granting or bypassing permission when the blocker store is unavailable. Aligns with SAP-grade security posture.

**Current code**:
```typescript
export async function isBlocked(agentId: string): Promise<boolean> {
  try {
    const blocker = await store.get(agentId)
    return blocker != null
  } catch {
    return false // ← insecure: assumes unblocked on error
  }
}
```

**New code**:
```typescript
export async function isBlocked(agentId: string): Promise<boolean> {
  try {
    const blocker = await store.get(agentId)
    return blocker != null
  } catch (err) {
    log.warn("blocker lookup failed; failing closed", { agentId, err })
    // Fail-closed: treat as blocked so caller cannot proceed on stale state.
    return true
  }
}
```

Update `test/permission/agent-manager-prompt.test.ts` to add a fail-closed case.

---

### 5. Retry reasoning-only incomplete responses
**File**: `src/core/session/processor.ts` (or equivalent Alexi session processor)
**Priority**: high
**Type**: bugfix
**Reason**: Upstream `58eea7381 fix(cli): retry reasoning-only incomplete responses`. When SAP AI Core (or any provider) returns only reasoning tokens without a final assistant message, treat as incomplete and retry. Prevents silent stalls.

**New logic** to add at the point where response completeness is evaluated:
```typescript
function isReasoningOnly(parts: MessagePart[]): boolean {
  if (parts.length === 0) return false
  return parts.every((p) => p.type === "reasoning" || p.type === "thinking")
}

// In the response-complete check:
const finishReason = response.finishReason
const reasoningOnly = isReasoningOnly(response.parts)

if (reasoningOnly && finishReason !== "stop") {
  log.info("response contained only reasoning; retrying", {
    sessionId,
    finishReason,
  })
  return { status: "retry", reason: "reasoning-only" }
}
```

---

### 6. Preserve output budget for encrypted reasoning
**File**: `src/core/session/overflow.ts` (or Alexi's session overflow module)
**Priority**: medium
**Type**: bugfix
**Reason**: Upstream `17611729e fix(cli): preserve output budget for encrypted reasoning`. Encrypted reasoning tokens should not consume the visible output budget, avoiding premature truncation. Directly relevant when Alexi routes through SAP AI Core providers that support encrypted reasoning.

**New helper**:
```typescript
export function usableOutputBudget(
  max: number,
  used: {
    output: number
    reasoningEncrypted?: number
  },
): number {
  // Encrypted reasoning tokens are provider-side only; do not deduct from output budget.
  const spent = used.output
  return Math.max(0, max - spent)
}
```

Wire this into wherever overflow is currently computed as `max - (output + reasoning)`.

---

### 7. Provider transform: preserve provider-specific completion limits (Cerebras)
**File**: `src/providers/transform.ts`
**Priority**: medium
**Type**: bugfix
**Reason**: Upstream `da4a91b36 fix(opencode): preserve Cerebras completion limit`. Currently `max_completion_tokens` may be overwritten during message normalization. This directly aff
{"prompt_tokens":34857,"completion_tokens":4096,"total_tokens":38953,"cache_read_input_tokens":0,"cache_creation_input_tokens":0}

[Session: 3fc58a12-b5b5-4753-820a-39d0368c7e08]
[Messages: 2, Tokens: 38953]
