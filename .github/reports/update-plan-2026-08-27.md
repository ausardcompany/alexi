# Update Plan for Alexi

Generated: 2026-08-27
Based on upstream commits analyzed:
- kilocode c03a20394..24b1fa1fc (136 commits)
- opencode 05ea507..13c2759 (18 commits)

## Summary
- Total changes planned: 8
- Critical: 2 | High: 3 | Medium: 2 | Low: 1

## Analysis Focus

The most impactful changes for Alexi are:
1. **Task tool empty-result bug fix (#13469)** — subagent answers being clobbered by empty extended runs
2. **Background job output preservation** — related core fix
3. **Windows shell/PowerShell rollback** — revert of PowerShell 7 probing
4. **Minimatch security update** — dependency bump
5. **Plan-mode permission ruleset dedup (#13219)** — permission stacking bug
6. **HTTP API authorization change** — security-related

Changes NOT applicable to Alexi (excluded):
- kilo-vscode changes (VSCode-specific UI)
- JetBrains plugin changes
- kilo-docs, stats, console, web (marketing/docs)
- SDK generation changes (auto-generated)
- Changeset markdown files
- kilo-sessions remote CLI features (not part of Alexi scope)

---

## Changes

### 1. Fix task tool empty-result bug (subagent answer clobbering)
**File**: `src/tool/task.ts`
**Priority**: critical
**Type**: bugfix
**Reason**: Upstream kilocode fix #13493 (commit bf7848cb4) restores the real subagent answer instead of returning empty task result. When a background/extended run returns an empty string, it must not overwrite a prior non-empty answer. This is a correctness bug affecting any task/subagent invocation flow.

**Current code** (approximate — check actual Alexi implementation):
```typescript
// In task tool result handling
const result = await runSubAgent(...)
return { output: result.text ?? "" }
```

**New code**:
```typescript
// kilocode_change - preserve last non-empty subagent answer (#13469, #13493)
const result = await runSubAgent(...)
const text = result.text?.trim()
if (!text) {
  // Fall back to the last non-empty output captured during the run
  return { output: result.previousOutput ?? "" }
}
return { output: result.text }
```

---

### 2. Fix background job output preservation (empty results never clobber)
**File**: `src/core/background-job.ts` (if present) or equivalent Alexi orchestration module
**Priority**: critical
**Type**: bugfix
**Reason**: Upstream commit in `packages/core/src/background-job.ts` fixes issue #13469 where empty outputs from extended runs would overwrite earlier non-empty results. The check must ensure only non-empty successful results with a higher sequence win.

**Current code**:
```typescript
const output =
  Exit.isSuccess(exit) && (!job.output || sequence > job.output.sequence)
    ? { sequence, text: exit.value }
    : job.output
```

**New code**:
```typescript
// kilocode_change - empty outputs never clobber; only the latest non-empty result wins (#13469)
const output =
  Exit.isSuccess(exit) && exit.value && sequence > (job.output?.sequence ?? -1)
    ? { sequence, text: exit.value }
    : job.output
```

**Companion test** (add to `src/core/background-job.test.ts` or equivalent):
```typescript
it.live("keeps the earlier non-empty output when an extended run returns empty", () =>
  Effect.gen(function* () {
    const jobs = yield* BackgroundJob.Service
    const first = yield* Deferred.make<void>()
    const job = yield* jobs.start({
      type: "test",
      run: Deferred.await(first).pipe(Effect.as("real answer")),
    })

    expect(yield* jobs.extend({ id: job.id, run: Effect.succeed("") })).toBe(true)

    yield* Deferred.succeed(first, undefined)
    expect(yield* jobs.wait({ id: job.id })).toMatchObject({
      timedOut: false,
      info: { status: "completed", output: "real answer" },
    })
  }).pipe(Effect.provide(jobsLayer)),
)
```

---

### 3. Add task tool regression tests
**File**: `src/tool/task.test.ts`
**Priority**: high
**Type**: bugfix (test)
**Reason**: Upstream added +64 lines of test coverage to `packages/opencode/test/tool/task.test.ts` covering the empty-result regression. Alexi should mirror these tests for its task tool.

**New code** (add test cases):
```typescript
describe("task tool - empty result handling", () => {
  it("returns real subagent answer when extended run yields empty", async () => {
    const result = await taskTool.execute({
      description: "test",
      prompt: "produce a real answer",
    })
    expect(result.output).not.toBe("")
    expect(result.output).toContain("real answer")
  })

  it("preserves prior non-empty result on empty followup", async () => {
    // simulates the #13469 scenario
    const first = await taskTool.execute({ prompt: "answer" })
    const second = await taskTool.execute({ prompt: "", extend: first.id })
    expect(second.output).toBe(first.output)
  })
})
```

---

### 4. Revert Windows PowerShell 7 probe (rollback)
**File**: `src/core/shell.ts` and `src/core/kilocode/powershell.ts` (if these exist in Alexi)
**Priority**: high
**Type**: bugfix (rollback)
**Reason**: Upstream commit a15d25359 reverts PR #13365 (support-configurable-powershell-shell) because it caused Windows startup issues. If Alexi adopted this feature, it must be rolled back to prevent Windows regression. `pwsh` probing is now simplified back to `which("pwsh")`.

**Current code** (`src/core/kilocode/powershell.ts`):
```typescript
import { statSync } from "fs"
import path from "path"
import { which } from "../util/which"

export const locations = (env: NodeJS.ProcessEnv = process.env) => [...]
export const probe = (env: NodeJS.ProcessEnv = process.env) => locations(env).filter(...)
export const pwsh = (env: NodeJS.ProcessEnv = process.env) => which("pwsh", env) ?? probe(env)[0]

export const PowerShell = { args, locations, probe, pwsh }
```

**New code**:
```typescript
export function args(command: string) {
  return ["-NoLogo", "-NoProfile", "-NonInteractive", "-Command", script(command)]
}
// ... keep script/setup helpers ...
export const PowerShell = { args }
```

**Current code** (`src/core/shell.ts`):
```typescript
function win() {
  return Array.from(
    new Set(
      [PowerShell.pwsh(), which("powershell"), gitbash(), process.env.COMSPEC || "cmd.exe"]
        .filter((item): item is string => Boolean(item))
        .map(full),
    ),
  )
}
```

**New code**:
```typescript
function win() {
  return Array.from(
    new Set(
      [which("pwsh"), which("powershell"), gitbash(), process.env.COMSPEC || "cmd.exe"]
        .filter((item): item is string => Boolean(item))
        .map(full),
    ),
  )
}
```

Also **delete** `src/core/kilocode/powershell.test.ts` if it exists (upstream removed 120 lines).

---

### 5. Update minimatch security dependency
**File**: `package.json`
**Priority**: high
**Type**: security
**Reason**: Dependabot security advisory for minimatch. Upstream bumped from 10.2.5 → 10.2.6.

**Current code**:
```json
"minimatch": "10.2.5",
```

**New code**:
```json
"minimatch": "10.2.6",
```

Run `bun install` / `npm install` to update lockfile.

---

### 6. Fix plan-mode permission ruleset stacking
**File**: `src/permission/` (specifically permission ruleset merge logic) or `src/tool/plan.ts`
**Priority**: high
**Type**: bugfix
**Reason**: Upstream fix #13219 (commit 62998965e) dedupes permission rulesets when plan mode stacks rules. Without this, plan mode accumulates duplicate permission rules on repeated toggles, causing incorrect permission prompts.

**New code** (in permission-ruleset merge):
```typescript
// kilocode_change - dedupe plan-mode permission ruleset stacking (#13219)
function mergePermissionRulesets(base: Ruleset[], planMode: Ruleset[]): Ruleset[] {
  const seen = new Set<string>()
  const merged: Ruleset[] = []
  for (const rule of [...base, ...planMode]) {
    const key = ruleKey(rule) // e.g. `${rule.tool}:${rule.pattern}:${rule.decision}`
    if (seen.has(key)) continue
    seen.add(key)
    merged.push(rule)
  }
  return merged
}

function ruleKey(rule: Ruleset): string {
  return `${rule.tool ?? "*"}:${rule.pattern ?? "*"}:${rule.decision}:${rule.scope ?? "session"}`
}
```

Add regression test:
```typescript
describe("plan-mode permission stacking", () => {
  it("does not duplicate rules when plan mode is toggled repeatedly", () => {
    const base = [{ tool: "edit", pattern: "*", decision: "ask" }]
    const plan = [{ tool: "edit", pattern: "*", decision: "ask" }]
    expect(mergePermissionRulesets(base, plan)).toHaveLength(1)
  })
})
```

---

### 7. Review authorization middleware change
**File**: `src/server/routes/instance/httpapi/middleware/authorization.ts` (if mirrored in Alexi)
**Priority**: medium
**Type**: security
**Reason**: Upstream changed one line in the authorization middleware (+1, -1). While the diff isn't shown in detail, security-related middleware changes should be reviewed and mirrored if Alexi exposes similar HTTP endpoints.

**Action**: Manually inspect upstream diff at `packages/opencode/src/server/routes/instance/httpapi/middleware/authorization.ts` and port any auth check tightening. Also review new tests:
- `packages/opencode/test/kilocode/server/httpapi-snapshot-auth.test.ts` (+96 lines)

---

### 8. Update review prompt (if Alexi uses kilocode review flow)
**File**: `src/kilocode/review/review.txt` or equivalent prompt asset
**Priority**: low
**Type**: refactor
**Reason**: Upstream tweaked review prompt (+43, -19 in `packages/opencode/src/kilocode/review/review.txt`). If Alexi ships a review agent using the same prompt template, port the updated wording for consistency. Otherwise skip.

**Action**: Diff upstream review.txt against Alexi's version; apply only if Alexi's review command derives from this template.

---

## NOT Applied (Rationale)

The following upstream changes are intentionally excluded:

| Change | Reason |
|---|---|
| VSCode webview UI, worktree references, prompt rail | Alexi is not a VSCode extension |
| JetBrains plugin (Kotlin) changes | Not applicable |
| kilo-docs, kilo-console, web/, stats/ | Documentation/marketing only |
| SDK generated files (`sdk/js/src/v2/gen/**`) | Auto-generated; regenerate from OpenAPI if
{"prompt_tokens":34383,"completion_tokens":4096,"total_tokens":38479,"cache_read_input_tokens":0,"cache_creation_input_tokens":0}

[Session: 91428a4f-6392-4d76-9e8b-1796e1dd659c]
[Messages: 2, Tokens: 38479]
