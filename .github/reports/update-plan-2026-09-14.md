```markdown
# Update Plan for Alexi

Generated: 2026-09-14
Based on upstream commits analyzed:
- kilocode: c36e22634..2ad448820 (83 commits)
- opencode: 95daf90..228e909 (6 commits)

## Summary

The vast majority of kilocode changes target VSCode extension surfaces (agent-manager UI, webview components, i18n, PR comment flows, worktree pools, drag-and-drop), which are **not applicable to Alexi** (a headless/CLI AI coding assistant with SAP AI Core integration).

The relevant upstream signals for Alexi are:

1. **opencode core dependency bump** (`@ai-sdk/gateway`, `@ai-sdk/provider`, `@ai-sdk/provider-utils`) - relevant if Alexi uses the AI SDK.
2. **opencode snapshot & session hardening** (`packages/opencode/src/snapshot/index.ts`, `session/prompt.ts`, `skill/index.ts`) - possible bug fixes worth mirroring.
3. **kilocode permission rejection feedback** (`packages/tui/src/routes/session/permission.tsx`, CLI permission handling) - a UX/behavior improvement to the permission system that maps to `src/permission/`.
4. **kilocode goal-continues-after-message** fix in `packages/opencode/src/kilocode/session/goal/runner.ts` and `prompt-queue.ts` - relevant if Alexi has a goal/queue subsystem.
5. **kilocode `/reload` project-scoped command** - CLI feature.
6. **kilocode review findings formatting** (`review.txt` prompt) - agent prompt improvement.

- Total changes planned: 6
- Critical: 0 | High: 2 | Medium: 3 | Low: 1

## Changes

### 1. Bump `@ai-sdk/*` provider/gateway dependencies
**File**: `package.json` (root) and/or `src/providers/package.json`
**Priority**: high
**Type**: security/bugfix (dependency)
**Reason**: Upstream opencode bumped `@ai-sdk/gateway` from `3.0.104` → `3.0.191`, `@ai-sdk/provider` `3.0.8` → `3.0.16`, and `@ai-sdk/provider-utils` `4.0.23` → `4.0.51`. These bring bug fixes, improved streaming behavior, and provider-utils fixes that Alexi's provider layer (including any SAP AI Core adapter built on `@ai-sdk/openai-compatible` or similar) benefits from. Verify SAP AI Core adapter still works: the `provider-utils` bump has caused signature drift historically.

**Current code**:
```json
{
  "dependencies": {
    "@ai-sdk/gateway": "3.0.104",
    "@ai-sdk/provider": "3.0.8",
    "@ai-sdk/provider-utils": "4.0.23"
  }
}
```

**New code**:
```json
{
  "dependencies": {
    "@ai-sdk/gateway": "3.0.191",
    "@ai-sdk/provider": "3.0.16",
    "@ai-sdk/provider-utils": "4.0.51"
  }
}
```

**Verification steps**:
- Run `bun install` (or npm/pnpm equivalent).
- Grep for `LanguageModelV2`, `LanguageModelV3`, `ProviderV2` types — provider-utils v4.0.51 tightened some generic bounds.
- Smoke-test SAP AI Core provider adapter with a simple generate call.

---

### 2. Permission rejection feedback loop
**File**: `src/permission/index.ts` (or wherever permission prompts resolve) and any CLI permission renderer under `src/cli/`
**Priority**: high
**Type**: feature
**Reason**: Upstream added a "reject with feedback" flow so users rejecting a tool invocation can supply a natural-language reason that gets forwarded to the model as a follow-up user message. This meaningfully improves UX for agentic loops. See kilocode commits `b30b2cf0d feat: support permission rejection feedback in CLI and VS Code` and `60bb54b0f fix(cli): harden goal preemption handling`.

**Current code** (typical shape):
```typescript
// src/permission/index.ts
export type PermissionResponse =
  | { type: "approve" }
  | { type: "reject" }
  | { type: "approve_always" }

export async function requestPermission(req: PermissionRequest): Promise<PermissionResponse> {
  // ... shows prompt, returns approve/reject
}
```

**New code**:
```typescript
// src/permission/index.ts
export type PermissionResponse =
  | { type: "approve" }
  | { type: "approve_always" }
  | { type: "reject"; feedback?: string }

export async function requestPermission(req: PermissionRequest): Promise<PermissionResponse> {
  const answer = await promptUser(req)
  if (answer.choice === "reject") {
    // Offer optional feedback capture. Empty/whitespace => plain reject.
    const feedback = await promptForRejectionFeedback({ timeoutMs: 30_000 })
    return { type: "reject", feedback: feedback?.trim() || undefined }
  }
  return { type: answer.choice }
}
```

And in the tool-execution / agent loop (likely `src/agent/loop.ts` or `src/core/session.ts`):

```typescript
const decision = await permission.requestPermission(req)
if (decision.type === "reject") {
  // Emit a tool_result with an error AND, if feedback provided,
  // append it as a follow-up user message so the model can adapt.
  await bus.emit("tool.result", {
    callId: req.callId,
    error: "User rejected tool invocation",
  })
  if (decision.feedback) {
    await session.appendUserMessage({
      text: `I rejected that action. Feedback: ${decision.feedback}`,
      role: "user",
      metadata: { source: "permission_rejection_feedback" },
    })
  }
  return
}
```

**Also**: ensure the approval keyboard shortcut is blocked while the feedback input is active (mirrors `845565872 fix(vscode): block approval shortcut during rejection feedback`).

---

### 3. Keep session goal running when a new user message arrives
**File**: `src/core/session.ts` or `src/agent/goal.ts` (wherever "goals"/long-running loops are managed) and `src/core/prompt-queue.ts`
**Priority**: medium
**Type**: bugfix
**Reason**: Upstream kilocode fixed the case where a new inbound prompt would prematurely cancel an active session goal (`5665631ab fix(cli): keep a session goal running when a message arrives` and `60bb54b0f fix(cli): harden goal preemption handling and test`). If Alexi supports background goals / queued prompts, mirror this behavior.

**Current code** (illustrative):
```typescript
async enqueuePrompt(prompt: string) {
  if (this.activeGoal) {
    this.activeGoal.cancel()  // BUG: cancels an in-flight goal
  }
  this.queue.push(prompt)
  this.drain()
}
```

**New code**:
```typescript
async enqueuePrompt(prompt: string) {
  // Do not preempt an active goal on user message.
  // Append to queue; drain will pick it up after the current turn completes.
  this.queue.push(prompt)
  if (!this.activeGoal) {
    this.drain()
  } else {
    log.debug("prompt queued behind active goal", { goalId: this.activeGoal.id })
  }
}

// Explicit user-initiated interrupt (Ctrl-C / /stop) stays a separate path:
async interruptGoal(reason: string) {
  this.activeGoal?.cancel(reason)
}
```

Add a unit test in `test/session/goal-preemption.test.ts` covering:
- New prompt does NOT cancel an active goal.
- Explicit interrupt DOES cancel.
- Queued prompt is picked up after goal completes.

---

### 4. Snapshot preparation robustness (if Alexi uses snapshot/worktree isolation)
**File**: `src/core/snapshot/*` (skip entirely if Alexi does not implement snapshots)
**Priority**: medium
**Type**: bugfix
**Reason**: Upstream hardened snapshot seed handling significantly:
- `fedde46da fix(opencode): harden the trusted snapshot seed guards`
- `f40394f07 perf(opencode): start the first worktree snapshot without re-hashing the checkout`
- `6435aa954 fix(opencode): release the seed pin whenever the snapshot repository is gone`
- `a81cdf905 fix(opencode): release the seed pin when removing an untracked snapshot repository`
- `bdb303f09 fix: clean discarded worktree snapshots`

If Alexi does not have this subsystem, skip. If it does, mirror the seed-pin lifecycle:

**New code** (representative):
```typescript
// src/core/snapshot/seed.ts
export class SnapshotSeed {
  private pin: SeedPin | undefined
  private generation = 0

  async acquire(repoPath: string): Promise<SeedPin> {
    const gen = ++this.generation
    const pin = await this.pinRepo(repoPath, gen)
    this.pin = pin
    return pin
  }

  // NEW: guarantee release even when the repo directory disappears
  // or the seed generation becomes stale.
  async releaseIfStale(gen: number) {
    if (this.pin && this.pin.generation !== this.generation) {
      await this.pin.release().catch(() => {})
      if (this.pin.generation === gen) this.pin = undefined
    }
  }

  async releaseOnRepoMissing(repoPath: string) {
    if (!(await fs.pathExists(repoPath)) && this.pin) {
      await this.pin.release().catch(() => {})
      this.pin = undefined
    }
  }
}
```

---

### 5. Add `/reload` command that reloads the whole project
**File**: `src/cli/commands/reload.ts` (new) + register in command dispatcher
**Priority**: medium
**Type**: feature
**Reason**: Upstream added `feat(cli): reload the whole project from /reload` (`3a2c5d5c2`) and `fix(cli): surface reload failures and skip in-flight instances` (`546195019`). Useful for headless workflows where config/tooling changes without restart.

**New code**:
```typescript
// src/cli/commands/reload.ts
import type { CliCommand } from "../types"
import { getProjectRegistry } from "../../core/project"
import { log } from "../../util/log"

export const reloadCommand: CliCommand = {
  name: "reload",
  description: "Reload the current project (config, tools, MCP servers)",
  async handler(ctx) {
    const registry = getProjectRegistry()
    const instances = registry.instancesForProject(ctx.projectId)

    const results = await Promise.allSettled(
      instances.map(async (inst) => {
        if (inst.isBusy()) {
          return { id: inst.id, skipped: true, reason: "in-flight request" }
        }
        await inst.reload()
        return { id: inst.id, skipped: false }
      }),
    )

    const failed = results.filter((r) => r.status === "rejected")
    const skipped = results.filter(
      (r) => r.status === "fulfilled" && (r.value as any).skipped,
    )

    if (failed.length) {
      ctx.output.error(`Reload failed for ${failed.length} instance(s):`)
      for (const f of failed) ctx.output.error(`  - ${(f as any).reason}`)
    }
    if (skipped.length) {
      ctx.output.warn(`Skipped ${skipped.length} bus
{"prompt_tokens":16282,"completion_tokens":4096,"total_tokens":20378,"cache_read_input_tokens":0,"cache_creation_input_tokens":0}

[Session: e1bb1779-2a8c-40db-9481-cdbe3495128b]
[Messages: 2, Tokens: 20378]
