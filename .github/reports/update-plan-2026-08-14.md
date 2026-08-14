```markdown
# Update Plan for Alexi

Generated: 2026-08-14
Based on upstream commits analyzed:
- kilocode: f71154707..67cda85c9 (v7.4.21 → v7.4.22)
  - Key: 3a99f36d9 (fix read-only agent bash denies blocking subagents)
  - Key: 746fa974e (keep models.dev refresh errors off the TUI)
  - Key: f4cba053a (preserve session agent for headless prompts)
  - Key: 738163bb1 (surface commit-message generation errors)
  - Key: 907f7dfcf (feat: --worktree flag)
  - Key: 8013e5f50 (feat: clickable file links in UI)
- opencode: cc4b456..e23586a
  - Key: 6c035e1 (fix: preserve unicode in grep previews)
  - Key: d8bf792 (fix: preserve v1 database compatibility)
  - Key: 6d63500 (chore: bump ai-gateway-provider 3.1.2 → 3.2.0)

## Summary
- Total changes planned: 9
- Critical: 1 | High: 4 | Medium: 3 | Low: 1

## Changes

### 1. Harden `explore` agent — bash denies must not block delegated subagents
**File**: `src/agent/index.ts`
**Priority**: critical
**Type**: security / bugfix
**Reason**: Upstream commit 3a99f36d9 introduces a new `hardenExplore` step that constrains the read-only `explore` agent's bash permissions to a stricter subset (denies `gh *` and `find *` since the delegated agent cannot answer permission prompts, and `find` can mutate via `-delete`/`-exec`). Without this, delegated subagents launched by the explore agent can be blocked by read-only denies or execute unsafe commands.

**Current code** (approximate):
```typescript
// src/agent/index.ts — in agent hardening layer
KiloAgent.processConfigItem(item)
KiloAgent.hardenPlan(key, item, ctx.worktree, user, Permission.fromConfig(value.permission ?? {}))
```

**New code**:
```typescript
KiloAgent.processConfigItem(item)
KiloAgent.hardenPlan(key, item, ctx.worktree, user, Permission.fromConfig(value.permission ?? {}))
// kilocode_change start: harden explore agent permissions
KiloAgent.hardenExplore(key, item, user, Permission.fromConfig(value.permission ?? {}))
// kilocode_change end
```

Add to `src/agent/index.ts` (or the corresponding kilocode-agent helpers module):
```typescript
const exploreBash: Record<string, "allow" | "ask" | "deny"> = {
  ...readOnlyBash,
  // Explore runs as a delegated agent, so it cannot answer permission prompts.
  "gh *": "deny",
  // `find` can mutate through `-delete` and `-exec`; use glob/list instead.
  "find *": "deny",
}

export function hardenExplore(
  key: string,
  item: { permission: Permission.Ruleset },
  ...explicit: Permission.Ruleset[]
) {
  if (key !== "explore") return
  item.permission = Permission.merge(
    item.permission,
    Permission.fromConfig({ bash: exploreBash }),
    // Hardening is a ceiling; retain any stricter user-authored denies.
    ...explicit.map(denies),
  )
}
```

Also remove the blanket `bash: "allow"` from the built-in explore agent tool patch so hardening takes effect:
```typescript
// In patchAgents() built-in explore permissions
tools: {
  grep: "allow",
  glob: "allow",
  list: "allow",
  // bash: "allow",  // REMOVED — hardenExplore now scopes bash strictly
  skill: "allow",
  webfetch: "allow",
  websearch: "allow",
},
```

---

### 2. Preserve unicode surrogate pairs when truncating grep previews
**File**: `src/tool/grep.ts` (or `src/core/ripgrep.ts` if adopted)
**Priority**: high
**Type**: bugfix
**Reason**: Upstream commit 6c035e1 fixes a corruption bug where `.slice(0, 2_000)` can split a UTF-16 surrogate pair, producing invalid unicode in tool output that breaks SAP AI Core message serialization (some model endpoints reject invalid surrogates).

**Current code**:
```typescript
text: match.lines.text.length > 2_000
  ? match.lines.text.slice(0, 2_000) + "..."
  : match.lines.text,
```

**New code**:
```typescript
text:
  match.lines.text.length > 2_000
    ? match.lines.text.slice(0, 2_000).replace(/[\uD800-\uDBFF]$/, "") + "..."
    : match.lines.text,
```

Add corresponding test in `src/tool/__tests__/grep.test.ts`:
```typescript
it("does not split surrogate pairs in oversized line previews", async () => {
  const line = `needle${"x".repeat(1_993)}😀\n`
  // ... write file, run grep, assert text === `needle${"x".repeat(1_993)}...`
})
```

---

### 3. Isolate models.dev refresh loggers so refresh errors don't leak into TUI
**File**: `src/core/models-dev.ts`
**Priority**: high
**Type**: bugfix
**Reason**: Upstream commit 746fa974e captures file/OTLP loggers before the background refresh fork so that transient models.dev fetch failures do not surface as toast/console errors in the user-facing UI. Important for SAP-hosted deployments where models.dev may be unreachable behind corporate proxies.

**Current code**:
```typescript
import { Context, Duration, Effect, Layer, Option, Schedule, Schema } from "effect"
// ...
const layer = Layer.effect(
  Service,
  Effect.gen(function* () {
    const fs = yield* FSUtil.Service
    const events = yield* EventV2.Service
    // ...
    ).pipe(
      Effect.tapCause((cause) => Effect.logError("Failed to fetch models.dev", { cause })),
      Effect.ignore,
    )
```

**New code**:
```typescript
import { Context, Duration, Effect, Layer, Logger, Option, Schedule, Schema } from "effect"
// ...
import { Observability } from "./observability"

const layer = Layer.effect(
  Service,
  Effect.gen(function* () {
    const fs = yield* FSUtil.Service
    const events = yield* EventV2.Service
    const loggers = yield* Effect.service(Logger.CurrentLoggers)
    // ...
    ).pipe(
      Effect.tapCause((cause) => Effect.logError("Failed to fetch models.dev", { cause })),
      Effect.ignore,
      Effect.provideService(Logger.CurrentLoggers, loggers),
    )
```

Update the node builder deps:
```typescript
export const node = makeGlobalNode({
  service: Service,
  layer,
  deps: [FSUtil.node, EventV2.node, httpClient, Observability.node],
})
```

---

### 4. Preserve session agent selection for headless prompts
**File**: `src/session/prompt.ts` (or `src/core/session/prompt.ts`)
**Priority**: high
**Type**: bugfix
**Reason**: Upstream commit f4cba053a ensures that when a user passes `--agent` or a session already has an agent set, headless (`run`) prompts do not reset it to the default. Critical for scripted/CI usage where a specific agent is required.

**Current code** (approximate — check `session/prompt.ts`):
```typescript
const agent = input.agent ?? "default"
```

**New code**:
```typescript
// Preserve the session's existing agent when the caller didn't override it.
const agent = input.agent ?? session.agent ?? "default"
```

Add regression test at `src/session/__tests__/headless-session-agent.test.ts` mirroring `packages/opencode/test/kilocode/headless-session-agent.test.ts`.

---

### 5. Surface commit-message generation errors instead of swallowing
**File**: `src/router/commit-message.ts` (or `src/server/httpapi/handlers/commit-message.ts`)
**Priority**: high
**Type**: bugfix
**Reason**: Upstream commit 738163bb1 surfaces real error causes when commit-message generation fails, rather than returning a generic empty/"no changes" response. Improves debuggability for SAP AI Core provider failures.

**Current code**:
```typescript
try {
  return await generateCommitMessage(diff)
} catch {
  return { message: "" }
}
```

**New code**:
```typescript
try {
  return await generateCommitMessage(diff)
} catch (cause) {
  // Distinguish "no changes to summarize" from real generation failures.
  if (isNoChangesError(cause)) {
    return { message: "", reason: "no-changes" }
  }
  throw new CommitMessageError("Failed to generate commit message", { cause })
}
```

Ensure the handler propagates the error to the HTTP response with a 5xx status and structured body (mirror `packages/opencode/src/kilocode/server/httpapi/handlers/commit-message.ts`).

---

### 6. Preserve v1 session database compatibility
**File**: `src/core/session/projector.ts` (if present in Alexi)
**Priority**: medium
**Type**: bugfix
**Reason**: Upstream commit d8bf792 removes the `SessionContextEpoch.reset` call from the v1 session projector because it breaks compatibility with existing v1 databases. Only applies if Alexi ships the v1 session projector.

**Current code**:
```typescript
import { SessionContextEpoch } from "./context-epoch"
// ...
yield* db.update(SessionTable).set({ ... }).where(...).run().pipe(Effect.orDie)
yield* SessionContextEpoch.reset(db, event.data.sessionID)
```

**New code**:
```typescript
// import removed
// ...
yield* db.update(SessionTable).set({ ... }).where(...).run().pipe(Effect.orDie)
// SessionContextEpoch.reset removed for v1 compatibility
```

Apply to both `SessionV1.Event.Created` and `Deleted` handlers.

---

### 7. Task tool: propagate parent agent context correctly to nested tasks
**File**: `src/tool/task.ts`
**Priority**: medium
**Type**: bugfix
**Reason**: The kilocode `task.ts` tool has +16/-4 lines of changes related to how subagent context propagates. Combined with the `hardenExplore` change (#1), this ensures delegated subagents inherit sensible permissions and don't hit unexpected denies. Review the upstream diff and reconcile with Alexi's `src/tool/task.ts`.

**Action**: 
1. Diff Alexi's `src/tool/task.ts` against `packages/opencode/src/kilocode/tool/task.ts` in the upstream.
2. Port any changes related to permission inheritance, agent resolution, or read-only bash pass-through.
3. Ensure the test `packages/opencode/test/kilocode/task-nesting.test.ts` scenarios pass.

---

### 8. Update `ai-gateway-provider` dependency
**File**: `package.json` (root and/or `src/providers/` if separate)
**Priority**: medium
**Type**: refactor / dep-bump
**Reason**: Upstream commit 6d63500 bumps `ai-gateway-provider` from `3.1.2` → `3.2.0`. Verify no breaking changes affect the SAP AI Core adapter, then apply.

**Current**:
{"prompt_tokens":17198,"completion_tokens":4096,"total_tokens":21294,"cache_read_input_tokens":0,"cache_creation_input_tokens":0}

[Session: 7b96700f-c33a-49a0-81aa-8987e9bb1e69]
[Messages: 2, Tokens: 21294]
