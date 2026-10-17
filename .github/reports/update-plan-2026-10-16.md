# Update Plan for Alexi

Generated: 2026-10-16
Based on upstream commits analyzed:
- kilocode: `f01b273c1` (agent-manager named agent), `e703b5637` (reject internal agents), `4fcf08b5e` (trim agent name), `0c8849c18` (preserve custom subagent edit permissions), `8d5c126dc` (OpenAI-compatible tool content normalization), `b7672ae50` (provider failure reasons)
- opencode: `538f8b1` (variant respelling), `f09eee5` (unreadable config refs), `4cce6ae` (preferred free models), `ccc6a3f` (escape env config values), `b0a8e25` (Bedrock Converse cache), `723a2f6` (saved environment for services), `e3d5a3b` (hide bedrock bare IDs), `412b2b1` (reasoning spelling), `a448d5b` (numeric MCP timeouts), `8db638c` (big-pickle default), `7a4a032` (seed limits before transforms)

## Summary
- Total changes planned: 7
- Critical: 1 | High: 3 | Medium: 2 | Low: 1

## Changes

### 1. Add `agent` field to Agent Manager tool for named agent delegation
**File**: `src/tool/agent-manager.ts`
**Priority**: high
**Type**: feature
**Reason**: Upstream kilocode (`f01b273c1`, `e703b5637`, `4fcf08b5e`) introduces per-task `agent` selection so users can launch Agent Manager sessions under a specific primary agent (e.g. a custom agent with its own permission ruleset). This also validates that the agent is selectable (not a subagent or hidden/internal) and lists valid alternatives on rejection. This matters for Alexi because SAP users commonly configure custom primary agents with tailored tool/permission policies that must be preserved across spawned sessions.

**Current code** (task schema and select function):
```typescript
const Task = Schema.Struct({
  // ...
  branchName: Schema.optional(Schema.NullOr(Schema.String)).annotate({
    description: "Git branch name seed for worktree mode",
  }),
  model: Schema.optional(Schema.NullOr(Schema.String)).annotate({ /* ... */ }),
  // ...
})
```

**New code**:
```typescript
const Task = Schema.Struct({
  // ...
  branchName: Schema.optional(Schema.NullOr(Schema.String)).annotate({
    description: "Git branch name seed for worktree mode",
  }),
  agent: Schema.optional(Schema.NullOr(Schema.String)).annotate({
    description:
      "Optional agent name to run the new session as (e.g. a custom agent configured with mode 'all'). Must be a selectable primary agent: not a mode: 'subagent' agent and not an internal/hidden one. Omit to use the workspace default agent; prefer the name the user asked for. A rejected name lists the selectable agents.",
  }),
  model: Schema.optional(Schema.NullOr(Schema.String)).annotate({ /* ... */ }),
  // ...
})
```

In `select()`, propagate `agent`:
```typescript
const base = {
  ...(task.prompt != null ? { prompt: task.prompt } : {}),
  ...(task.name != null ? { name: task.name } : {}),
  ...(task.branchName != null ? { branchName: task.branchName } : {}),
  ...(task.agent?.trim() ? { agent: task.agent.trim() } : {}),
}
```

Add `Agent.Service` dependency and validation at the top of the tool execute path:
```typescript
import { Agent } from "@/agent/agent"

export const AgentManagerTool = Tool.define<
  /* params */,
  AgentManager.Service | Bus.Service | Provider.Service | Agent.Service,
  "agent_manager"
>("agent_manager", Effect.gen(function* () {
  const agents = yield* Agent.Service
  // ...
  const agentNames = params.tasks.flatMap((task) => (task.agent?.trim() ? [task.agent.trim()] : []))
  if (agentNames.length > 0) {
    const available = yield* agents.list()
    const selectable = available.filter(
      (a) => a.mode !== "subagent" && !a.internal && !a.hidden,
    )
    const selectableNames = new Set(selectable.map((a) => a.name))
    const invalid = agentNames.filter((n) => !selectableNames.has(n))
    if (invalid.length > 0) {
      return {
        error: `Unknown or non-selectable agent(s): ${invalid.join(", ")}. Selectable agents: ${[...selectableNames].join(", ")}`,
      }
    }
  }
  // ...
}))
```

### 2. Update Agent Manager tool description to document `agent` field
**File**: `src/tool/agent-manager.txt.ts` (or corresponding `.txt` embed)
**Priority**: high
**Type**: feature
**Reason**: The tool description must document the new `agent` parameter so the model uses it correctly and distinguishes it from the `task` tool's subagent list.

**New description additions** (append to Task fields paragraph and replace the final warning):
```text
Each task may provide a prompt, a short display name, a branch name, a `model`, an optional `provider`, a model-specific reasoning `variant`, and an `agent`.
...
Prepared sessions without an initial prompt still use any specified `agent`; only the base branch always uses the normal default.

By default, each spawned session uses the workspace default agent. Specify `agent` by name when the user wants a particular agent — including a custom agent with its own edit/bash/MCP permission rules — to run the work, instead of the workspace default. Use the name the user asked for; do not guess one. The named agent must be selectable as a primary agent (configured with `mode: "all"` or `mode: "primary"`, not `mode: "subagent"`, and not internal/hidden); any other name fails the request without starting a session and the error lists the selectable agents, so recover by reading that list rather than retrying blindly. Do not use this for ordinary subagent research: use the `task` tool for internal subagents, and reserve `agent_manager`'s `agent` field for cases where the user wants a visible, named-agent Agent Manager session in the extension. The `task` tool's "Available agent types" list is not valid here — it enumerates subagents, which this field rejects.
```

Remove the trailing legacy paragraph:
```text
Do not use this for ordinary subagent research. Use the `task` tool for internal subagents, and use this only when the user wants visible Agent Manager sessions in the extension.
```

### 3. Preserve custom delegator subagent edit permissions
**File**: `src/tool/task.ts`
**Priority**: critical
**Type**: security
**Reason**: Upstream kilocode (`0c8849c18`) fixes a security-adjacent correctness bug where a custom delegator's `edit` policy was projected onto its spawned subagents — causing path-scoped `edit: { "secrets/**": "deny" }` on a *delegator* to inadvertently confine delegated writes. The fix scopes custom-delegator edit rules to just the delegator, while keeping **session-level** edit denials as hard ceilings for all descendants. This correctness issue affects any Alexi deployment that uses custom delegators with path-scoped edit restrictions — common in SAP-governed workspaces.

**Current code**:
```typescript
export function inheritedRules(input: {
  caller: Pick<Agent.Info, "permission">
  session: Pick<Session.Info, "permission">
  mcp: Config.Info["mcp"]
}): Permission.Ruleset {
  const rules = Permission.merge(input.caller.permission ?? [], input.session.permission ?? [])
  const prefixes = Object.keys(input.mcp ?? {}).map((k) => k.replace(/[^a-zA-Z0-9_-]/g, "_") + "_")
  const isMcp = (p: string) => prefixes.some((prefix) => p.startsWith(prefix))
  const mutation = new Set(["edit", ...guarded.filter((p) => p !== "bash")])
  const inherited = rules.filter(
    (r: Permission.Rule) => r.action === "deny" && (mutation.has(r.permission) || isMcp(r.permission)),
  )
  for (const permission of mutation) {
    if (Permission.evaluate(permission, "*", rules).action !== "deny") continue
    inherited.push({ permission, pattern: "*", action: "deny" })
  }
  const scoped = rules.filter((rule) => rule.permission !== "*")
  // ...
}
```

**New code**:
```typescript
export function inheritedRules(input: {
  caller: Pick<Agent.Info, "permission" | "native">
  session: Pick<Session.Info, "permission">
  mcp: Config.Info["mcp"]
}): Permission.Ruleset {
  const session = input.session.permission ?? []
  const rules = Permission.merge(input.caller.permission ?? [], session)
  // Custom (non-native) delegators scope their edit policy to themselves — only
  // session-level edit denials become hard ceilings on spawned subagents.
  const edit = input.caller.native === false ? session : rules
  const prefixes = Object.keys(input.mcp ?? {}).map((k) => k.replace(/[^a-zA-Z0-9_-]/g, "_") + "_")
  const isMcp = (p: string) => prefixes.some((prefix) => p.startsWith(prefix))
  const mutation = new Set(["edit", ...guarded.filter((p) => p !== "bash")])
  const inherited = [
    ...rules.filter((rule) => rule.permission !== "edit"),
    ...edit.filter((rule) => rule.permission === "edit"),
  ].filter((r: Permission.Rule) => r.action === "deny" && (mutation.has(r.permission) || isMcp(r.permission)))
  for (const permission of mutation) {
    const source = permission === "edit" ? edit : rules
    if (Permission.evaluate(permission, "*", source).action !== "deny") continue
    inherited.push({ permission, pattern: "*", action: "deny" })
  }
  const scoped = rules.filter((rule) => rule.permission !== "*")
  // ...
}
```

Also update the doc comment above `inheritedRules` to describe the native-vs-custom edit split and the "use session-level edit restriction to confine a delegated workflow" guidance.

### 4. Opt-in OpenAI-compatible tool-content normalization
**File**: `src/providers/openai-compatible.ts` (or wherever Alexi handles OpenAI-compatible tool content)
**Priority**: high
**Type**: bugfix
**Reason**: Upstream kilocode (`8d5c126dc`) makes the normalization of null `tool` content opt-in rather than always-on. For SAP AI Core (which proxies OpenAI-shaped APIs), unconditional normalization has caused regressions where providers return `null` content legitimately. Guard behind a flag to avoid regressing providers that already return correct shapes.

**New code** (sketch):
```typescript
// In the OpenAI-compatible content normalizer
export function normalizeToolContent(message: Message, options?: { normalizeNullToolContent?: boolean }) {
  if (!options?.normalizeNullToolContent) return message
  if (message.role === "tool" && message.content == null) {
    return { ...message, content: "" }
  }
  return message
}
```

Expose via provider settings:
```typescript
export const Settings = Schema.Struct({
  // ...
  normalizeNullToolContent: Schema.optional(Schema.Boolean).annotate({
    description: "Replace null tool-content with empty string for strict OpenAI-compatible endpoints.",
  }),
})
```

Ensure SAP A
{"prompt_tokens":36843,"completion_tokens":4096,"total_tokens":40939,"cache_read_input_tokens":0,"cache_creation_input_tokens":0}

[Session: 055446cd-0c83-4bb7-97e6-9dd2ed1784f6]
[Messages: 2, Tokens: 40939]
