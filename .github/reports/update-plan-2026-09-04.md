```markdown
# Update Plan for Alexi

Generated: 2026-09-04
Based on upstream commits analyzed:
- kilocode: cf954237c..74b3141bb (86 commits)
- opencode: f12e14c..3f31139 (14 commits)

## Summary

Only a small subset of upstream changes maps to Alexi's scope (agent system, core orchestration, providers, tool system). The bulk of upstream work is in `kilo-vscode` (VS Code extension UI/webview), `kilo-jetbrains` (JetBrains plugin), `kilo-docs`, `stats`, and `console` — all out of scope for Alexi.

- Total changes planned: 6
- Critical: 0 | High: 3 | Medium: 2 | Low: 1

## Changes

### 1. Fix plan-mode edit hardening scope (custom `architect` agents)
**File**: `src/agent/index.ts` (or wherever `hardenPlan` / plan-mode guard lives in Alexi)
**Priority**: high
**Type**: bugfix
**Reason**: Upstream fix (#13581, #13590) — the previous logic applied plan-mode edit ceilings to any agent named `plan` or `architect`. This made custom `architect` agents' edit permissions unreachable due to last-match-wins semantics, with no opt-out. Restrict the ceiling to the built-in native plan agent only. Also relevant to SAP-hosted setups where organizations may ship custom architect agents.

**Current code** (mirroring upstream pre-change):
```typescript
export function hardenPlan(
  key: string,
  item: { permission: Permission.Ruleset },
  worktree: string,
  ...explicit: Permission.Ruleset[]
) {
  if (key !== "plan" && key !== "architect") return
  const edit = explicit.map(editRestrictions)
  item.permission = Permission.merge(item.permission, planEditGuard(worktree), ...edit)
}
```

**New code**:
```typescript
export function hardenPlan(
  key: string,
  item: { native?: boolean; permission: Permission.Ruleset },
  worktree: string,
  ...explicit: Permission.Ruleset[]
) {
  // Plan-mode edit restrictions are a ceiling for the built-in plan agent only.
  // Custom agents named `architect` are governed by their own permission config;
  // the previous name check appended the guard after their rules, so last-match-
  // wins made their edit allows unreachable with no opt-out (#13581). A custom
  // `agent.plan` config reuses the built-in object, so `native` stays true and
  // the ceiling still applies there.
  if (key !== "plan") return
  if (item.native !== true) return
  const edit = explicit.map(editRestrictions)
  item.permission = Permission.merge(item.permission, planEditGuard(worktree), ...edit)
}
```

Also verify the `native: true` flag is set on the built-in plan agent registration site. If Alexi doesn't currently track `native`, add it to the agent metadata schema:

```typescript
// src/agent/types.ts (or equivalent)
export interface AgentConfig {
  // ...existing fields
  /** True when this agent is the built-in shipped default (not a user override). */
  native?: boolean
  permission: Permission.Ruleset
}
```

And at the built-in registration:
```typescript
agents.plan = { ...builtinPlan, native: true }
```

---

### 2. Clarify Explore agent description re: bash allowlist
**File**: `src/agent/index.ts` (Explore agent patch)
**Priority**: medium
**Type**: feature
**Reason**: Upstream fix (#13759) improves guidance to the router/orchestrator when the Explore agent's bash allowlist is too restrictive. This helps subagent selection avoid dead-ends on read-only analysis tasks that need broader shell access.

**Current code**:
```typescript
if (agents.explore) {
  agents.explore = {
    ...agents.explore,
    permission: Permission.merge(
      defaults,
      Permission.fromConfig({
        // ...
      }),
    ),
  }
}
```

**New code**:
```typescript
if (agents.explore) {
  agents.explore = {
    ...agents.explore,
    description: `${agents.explore.description} Bash is limited to an allowlist of read-only commands. For required scripts, tests, or binary-analysis commands outside that allowlist, select an available agent whose permissions allow them while preserving the requested no-change scope.`,
    permission: Permission.merge(
      defaults,
      Permission.fromConfig({
        // ...
      }),
    ),
  }
}
```

---

### 3. Add `questions: "dismiss"` option to orchestration `prompt()` for unanswered-question handling
**File**: `src/core/orchestration.ts` (or `src/core/orchestration-domain.ts` equivalent)
**Priority**: high
**Type**: bugfix
**Reason**: Upstream fix (#13774) — when a user reissues a slash command / new prompt while a prior question is still open, the orchestrator would block indefinitely on the stale question. Allow callers to signal that outstanding questions should be dismissed (skipped as a blocker) so the new prompt can proceed. Important for CLI/agent flows in Alexi where questions may not have an interactive UI.

**Current code**:
```typescript
async function blocked(input: Target, dir: string, name: string): Promise<string | undefined> {
  const [perms, qs] = await Promise.all([
    input.client.permission.list({ directory: dir }),
    input.client.question.list({ directory: dir }),
  ])
  if (perms.error || qs.error)
    throw new OrchestrationError("host_error", "The managed session blockers could not be read")
  const mine = (qs.data ?? []).filter((v) => v.sessionID === input.sessionID)
  const first = mine[0]
  // ...
}

export async function prompt(input: {
  client: Client
  sessionID: string
  messageID: string
  signal?: AbortSignal
  managed?: ManagedSession
}): Promise<void> {
  if (input.signal?.aborted) return
  const target = await locate(input)
  const blocker = await blocked(input, target.dir, target.name)
  if (blocker) throw new OrchestrationError("unavailable_session", blocker)
  // ...
}
```

**New code**:
```typescript
async function blocked(
  input: Target,
  dir: string,
  name: string,
  questions?: "dismiss",
): Promise<string | undefined> {
  const [perms, qs] = await Promise.all([
    input.client.permission.list({ directory: dir }),
    input.client.question.list({ directory: dir }),
  ])
  if (perms.error || qs.error)
    throw new OrchestrationError("host_error", "The managed session blockers could not be read")
  const mine = (qs.data ?? []).filter((v) => v.sessionID === input.sessionID)
  const first = questions === "dismiss" ? undefined : mine.at(0)
  if (first) {
    const detail = mine
      .map((value) => {
        // ...existing detail construction
      })
      .join("\n")
    // ...
  }
  // ...permission checks unchanged
}

export async function prompt(input: {
  client: Client
  sessionID: string
  messageID: string
  signal?: AbortSignal
  managed?: ManagedSession
  /** When "dismiss", any outstanding questions on this session are skipped as blockers. */
  questions?: "dismiss"
}): Promise<void> {
  if (input.signal?.aborted) return
  const target = await locate(input)
  const blocker = await blocked(input, target.dir, target.name, input.questions)
  if (blocker) throw new OrchestrationError("unavailable_session", blocker)
  if (input.signal?.aborted) return
  await input.client.session.promptAsync(/* ...unchanged... */)
}
```

Callers that reissue a prompt after user edit should pass `questions: "dismiss"`.

---

### 4. Keep subagents running after permission denial
**File**: `src/permission/index.ts` or `src/agent/subagent-runner.ts` (wherever subagent lifecycle handles denials)
**Priority**: high
**Type**: bugfix
**Reason**: Upstream fix (#13744, commit `4b85267ae`) — denying a permission prompt inside a subagent should not tear down the subagent; the tool call should fail with a denial error and the agent loop should continue. Previously, denial killed the subagent process/session prematurely. This affects SAP AI Core setups since permission prompts are common in guarded enterprise environments.

**Investigation**: Check current subagent denial path in Alexi. If denial currently propagates as a fatal error to the subagent runner, change it to a scoped tool-error:

**Current code** (approximate pattern):
```typescript
if (decision === "deny") {
  throw new PermissionDeniedError(toolCall)
  // ^ bubbles up and aborts the subagent
}
```

**New code**:
```typescript
if (decision === "deny") {
  // Return a tool error result so the agent loop can observe the denial
  // and choose a different action, rather than aborting the whole subagent.
  return {
    ok: false,
    error: {
      type: "permission_denied",
      message: `Permission denied for ${toolCall.name}`,
      toolCallID: toolCall.id,
    },
  }
}
```

Add a test analogous to upstream `agent-permission-overrides.test.ts` covering the "denial does not terminate subagent" case.

---

### 5. Restore OpenCode provider request headers (SAP-compatibility check)
**File**: `src/providers/opencode.ts` (if Alexi ships an OpenCode-flavored provider) or `src/session/llm/request.ts`
**Priority**: high
**Type**: bugfix
**Reason**: Upstream fix (#13752) restored request headers on the OpenCode provider that were regressed. If Alexi uses similar provider abstractions (or shares the `session/llm/request.ts` layer), verify headers survive request construction. This is critical because SAP AI Core also relies on custom auth headers — any regression pattern here could indicate similar risk in the SAP path.

**Action**:
1. Diff `packages/opencode/src/session/llm/request.ts` (+6/-6 upstream) against Alexi's request layer.
2. Ensure per-provider `headers` from the provider config are merged into the outgoing fetch/AI SDK options, not dropped when a request adapter reshapes the payload.
3. Add a regression test asserting `Authorization` / custom headers (e.g., `X-SAP-*`) survive through the request pipeline.

Reference upstream test:
```
packages/opencode/test/kilocode/session-llm-request.test.ts (+83)
packages/opencode/test/kilocode/session-prompt-permission-refresh.test.ts (+117)
```

Mirror these into `test/session/llm-request.test.ts` in Alexi, adapted for the SAP AI Core header set.

---

### 6. Adopt `X-Interaction-Id` header pattern (session-scoped request correlation)
**File**: `src/providers/*.ts` (all providers) and/or `src/session/llm/request.ts`
**Priority**: low
**Type**: feature
**Reason**: Upstream feature (#47215 in opencode) sends `X-Interaction-Id: <sessionID>` on Copilot requests. Useful pattern for SAP AI Core telemetry/tracing — attach the current sessionID as a correlation header so requests can be traced back to a session in server logs. Non-breaking, purely additive.

**New code** (in the provider fetch wrapper):
```typescript
function buildHeaders(base: Record<string, string>, sessionID?: string) {
  const headers = { ...base }
  if (sessionID) {
    headers["X-Interaction-Id"] = sessionID
  }
  return headers
}
{"prompt_tokens":19219,"completion_tokens":4096,"total_tokens":23315,"cache_read_input_tokens":0,"cache_creation_input_tokens":0}

[Session: 6a7efef5-428e-4f68-82c2-10b735c6bb1a]
[Messages: 2, Tokens: 23315]
