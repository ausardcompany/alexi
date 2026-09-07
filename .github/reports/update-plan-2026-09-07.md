# Update Plan for Alexi

Generated: 2026-09-07
Based on upstream commits analyzed:
- kilocode: 1e4693558..1a5ee1882 (53 commits)
- opencode: 337fd14..57ef382 (11 commits)

## Summary
- Total changes planned: 4
- Critical: 0 | High: 2 | Medium: 2 | Low: 0

The dominant upstream changes are Kilo's VSCode UI (inline PR review comments, diff viewer, agent manager UI) and JetBrains — none of which apply to Alexi (a CLI/tool-focused fork). The relevant, portable changes are:

1. Agent Manager tool: new `worktreeID` parameter to target existing managed worktrees (feature + validation)
2. Agent Manager tool description text update reflecting `worktreeID`
3. Optional: propagate `worktreeID` in tool metadata
4. Optional: Provider SDK version bumps (only if Alexi tracks these deps)

## Changes

### 1. Add `worktreeID` parameter to Agent Manager tool schema

**File**: `src/tool/agent-manager.ts`
**Priority**: high
**Type**: feature
**Reason**: Upstream adds ability to start Agent Manager sessions targeting an *existing* managed worktree (returned by `action: "list"`), rather than always creating a new worktree or using the caller's directory. The validation ensures `worktreeID` is only allowed under safe combinations (`mode: "local"`, no `versions: true`, no `branchName`). This is a self-contained tool-schema change and is fully compatible with SAP AI Core (no provider-specific logic).

**Current code** (in `StartParams` struct):
```typescript
const StartParams = Schema.Struct({
  // ... existing fields (mode, versions, etc.)
  versions: Schema.optional(Schema.NullOr(Schema.Boolean)).annotate({
    description:
      "Set true only when tasks are alternative versions of the same work to compare. Omit or false for independent sessions.",
  }),
  tasks: Schema.Array(Task)
    .check(Schema.isMinLength(1), Schema.isMaxLength(20))
    .annotate({ description: "Agent Manager sessions to start" }),
})
```

**New code**:
```typescript
const StartParams = Schema.Struct({
  // ... existing fields (mode, versions, etc.)
  versions: Schema.optional(Schema.NullOr(Schema.Boolean)).annotate({
    description:
      "Set true only when tasks are alternative versions of the same work to compare. Omit or false for independent sessions.",
  }),
  worktreeID: Schema.optional(
    Schema.NullOr(
      Schema.String.check(
        Schema.makeFilter((value) =>
          value.trim() ? undefined : "worktreeID must not be blank",
        ),
      ),
    ),
  ).annotate({
    description:
      "Start sessions only. Existing managed worktree ID returned by action=list in the caller's project. Requires mode local; omit or null to use the caller's directory. Never use a path or branch name.",
  }),
  tasks: Schema.Array(Task)
    .check(Schema.isMinLength(1), Schema.isMaxLength(20))
    .annotate({ description: "Agent Manager sessions to start" }),
})
```

**Also update the `Params` union to add the cross-field validator**:

**Current code**:
```typescript
export const Params = Schema.Union([
  Schema.Struct({
    ...StartParams.fields,
    tasks: Schema.Union([StartParams.fields.tasks, Schema.fromJsonString(StartParams.fields.tasks)]),
  }),
  ListParams,
  PromptParams,
  StopParams,
  // ...
])
```

**New code**:
```typescript
export const Params = Schema.Union([
  Schema.Struct({
    ...StartParams.fields,
    tasks: Schema.Union([StartParams.fields.tasks, Schema.fromJsonString(StartParams.fields.tasks)]),
  }).check(
    Schema.makeFilter((params) => {
      if (params.worktreeID == null) return undefined
      if (params.mode !== "local") return "worktreeID requires mode local"
      if (params.versions === true) return "worktreeID cannot be combined with versions true"
      if (params.tasks.some((task) => task.branchName != null))
        return "worktreeID cannot be combined with branchName"
      return undefined
    }),
  ),
  ListParams,
  PromptParams,
  StopParams,
  // ...
])
```

**Also update `WireParams`** (JSON wire schema exposed to models):

**Current code**:
```typescript
const WireParams = Schema.Struct({
  // ...
  tasks: Schema.optional(Schema.NullOr(StartParams.fields.tasks)).annotate({
    description: "Start sessions only. Agent Manager sessions to start. Send null whenever action is set.",
  }),
  action: Schema.optional(
    Schema.NullOr(Schema.Literals(["list", "prompt", "stop", "move", "answer"])).annotate({
      // ...
    }),
  ),
})
```

**New code**:
```typescript
const WireParams = Schema.Struct({
  // ...
  tasks: Schema.optional(Schema.NullOr(StartParams.fields.tasks)).annotate({
    description: "Start sessions only. Agent Manager sessions to start. Send null whenever action is set.",
  }),
  worktreeID: StartParams.fields.worktreeID,
  action: Schema.optional(
    Schema.NullOr(Schema.Literals(["list", "prompt", "stop", "move", "answer"])).annotate({
      // ...
    }),
  ),
})
```

---

### 2. Propagate `worktreeID` in tool permission metadata

**File**: `src/tool/agent-manager.ts`
**Priority**: medium
**Type**: feature
**Reason**: Upstream includes `worktreeID` (and likely more identifying context) in the permission request metadata so approval UIs and audit logs can show which existing worktree is being targeted. Without this, permission prompts for the new flow will be indistinguishable from ordinary local-mode starts.

**Current code** (inside the `Tool.define` `execute` / permission block):
```typescript
permission: "agent_manager",
patterns: [params.mode],
always: [params.mode],
metadata: { mode: params.mode, count: tasks.length },
```

**New code**:
```typescript
permission: "agent_manager",
patterns: [params.mode],
always: [params.mode],
metadata: {
  mode: params.mode,
  count: tasks.length,
  ...(params.worktreeID ? { worktreeID: params.worktreeID } : {}),
},
```

Additionally, in the downstream Agent Manager start handler (wherever `mode === "local"` currently resolves the target directory), branch on `worktreeID`:

**New logic sketch**:
```typescript
if (params.mode === "local" && params.worktreeID) {
  const managed = await AgentManager.getWorktreeByID(params.worktreeID, {
    projectID: ctx.projectID,
  })
  if (!managed) {
    throw new Tool.Error(`Unknown worktreeID: ${params.worktreeID}`)
  }
  targetDirectory = managed.path
} else {
  targetDirectory = ctx.cwd
}
```

> ⚠️ If Alexi does not currently implement managed-worktree tracking, gate this behind a capability check and return a clear error ("managed worktrees not available in this build") rather than silently ignoring `worktreeID`.

---

### 3. Update Agent Manager tool description (`.txt`)

**File**: `src/tool/agent-manager.txt.ts` (or `src/tool/agent-manager.txt` — whichever pattern Alexi uses)
**Priority**: high
**Type**: feature (docs — but visible to the model, so functionally important)
**Reason**: The tool description is part of the LLM prompt and directly shapes how models call the tool. If schema accepts `worktreeID` but the description doesn't explain when to use it, models will either never use it or misuse it.

**Current code**:
```
Modes:
- `worktree`: creates a new Agent Manager git worktree for each task, like the New Worktree dialog.
- `local`: creates Agent Manager sessions in the current workspace directory without git worktree isolation.
```

**New code**:
```
Modes:
- `worktree`: creates a new Agent Manager git worktree for each task, like the New Worktree dialog.
- `local`: creates sessions in the caller's directory, or an existing managed worktree selected by `worktreeID` from `action: "list"`.
```

No other lines in the description file need to change based on this upstream diff.

---

### 4. Optional: Bump AI SDK provider versions

**File**: `package.json` (root and/or `src/providers/` package, whichever declares these deps)
**Priority**: medium
**Type**: bugfix (upstream fixes: preserve explicit OpenAI service tiers, Azure SDK bump)
**Reason**: Two upstream fixes in `packages/core/package.json`:
- `@ai-sdk/openai`: 3.0.84 → 3.0.88 (includes "preserve explicit OpenAI service tiers" fix)
- `@ai-sdk/azure`: 3.0.88 → 3.0.93

These are bugfix bumps. **Only apply if Alexi tracks these dependencies directly.** Since Alexi uses SAP AI Core as the primary provider, verify these SDKs are still used before bumping. Also note upstream ships a patch file `patches/@ai-sdk%2Fopenai@3.0.88.patch` — copy it verbatim if you take the OpenAI bump.

**Current code** (if applicable):
```json
"@ai-sdk/azure": "3.0.88",
"@ai-sdk/openai": "3.0.84",
```

**New code**:
```json
"@ai-sdk/azure": "3.0.93",
"@ai-sdk/openai": "3.0.88",
```

Then copy `patches/@ai-sdk%2Fopenai@3.0.88.patch` into Alexi's `patches/` directory and ensure the package manager (bun/pnpm) is configured to apply patches.

---

## Explicitly SKIPPED Upstream Changes

The following upstream changes are **not applicable** to Alexi and should NOT be ported:

- **All Kilo VSCode webview / diff viewer / inline PR comment changes** (`packages/kilo-vscode/**`, `webview-ui/**`) — Alexi is not a VSCode extension.
- **JetBrains plugin changes** (`packages/kilo-jetbrains/**`) — not applicable.
- **TUI-specific fixes** (Home/End nav, board-tool rendering) — port only if Alexi ships the Kilo TUI; otherwise skip.
- **Windows CLI startup benchmark / AVX2 cache** (`packages/opencode/bin/kilo`, `bin/kilocode/windows-avx2.cjs`) — Kilo-CLI launcher specific.
- **Visual regression PNG baselines** — no equivalent in Alexi.
- **`console` OAuth client metadata route** — Alexi does not host the opencode console.
- **`go.mdx` docs and Go SDK client compatibility notes** — SDK-consumer docs, not Alexi runtime.
- **Changesets / CI workflow tweaks** — release-tooling specific to upstream repos.

## Testing Recommendations

1. **Schema validation tests** for the new `worktreeID` parameter:
   - Accepts valid string ID with `mode: "local"`.
   - Rejects `worktreeID` + `mode: "worktree"` → "worktreeID requires mode local".
   - Rejects `worktreeID
{"prompt_tokens":13649,"completion_tokens":4096,"total_tokens":17745,"cache_read_input_tokens":0,"cache_creation_input_tokens":0}

[Session: 1d5d11c8-3596-46e8-b1db-2a99c3803a77]
[Messages: 2, Tokens: 17745]
