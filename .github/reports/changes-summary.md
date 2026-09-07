# Changes Summary — Upstream Sync 2026-09-07

Applied changes from the update plan derived from upstream commits:
- kilocode: `1e4693558..1a5ee1882` (53 commits)
- opencode: `337fd14..57ef382` (11 commits)

## Files modified

1. `src/tool/tools/agent-manager.ts` — schema, validation, permission resource, and runtime capability gate.
2. `src/tool/tools/agent-manager.txt` — LLM-facing tool description.
3. `src/tool/tools/__tests__/agent-manager.worktree-id.test.ts` — **new** regression tests.

## Change 1 — Agent Manager `worktreeId` parameter validation (Priority: high)

**File:** `src/tool/tools/agent-manager.ts`

The pre-existing `worktreeId` field on the params schema was upgraded from a
free-form `z.string().nullable().optional()` to:

- Non-blank check (`refine`): whitespace-only IDs are rejected so we can't
  silently fall through to "use caller's cwd" behaviour when a model
  supplies garbage.
- Cross-field validator on the outer schema: `worktreeId` is only valid on
  `action: 'create'`. Passing it alongside `list`/`stop`/`status`/`answer`
  now produces a Zod validation error instead of being silently ignored.
- Description text refreshed to mirror upstream's phrasing: existing
  managed worktree ID returned by `action: "list"`, never a path or
  branch name.

**Deviation from the plan (documented, not a skip):** the upstream diff
lives in an Effect Schema world with concepts (`mode: 'local'|'worktree'`,
`versions`, `tasks: []`, `branchName`) that Alexi's action-oriented,
Zod-based `agent_manager` tool does not have. The portable subset is
"opt-in field to target an existing worktree, non-blank, only on start
(create), permission-visible" — which is exactly what has been applied.

## Change 2 — Propagate `worktreeId` into permission resource (Priority: medium)

**File:** `src/tool/tools/agent-manager.ts`

Upstream propagates `worktreeID` into the tool's permission `metadata`.
Alexi's permission layer (see `src/permission/index.ts`) has no
`metadata` field on the `PermissionRequest`; it has `resource` + free-form
`description`. To achieve the same audit / prompt-visibility outcome, the
tool's `getResource()` now returns `${action}:${worktreeId}` when
`worktreeId` is present, and the plain `action` otherwise. Approval UIs
and audit logs can now distinguish "resume in worktree wt-abc" from a
plain create.

Additionally, since Alexi does not (yet) track managed worktrees in
process, the `create` handler surfaces a clear
`Managed worktrees are not available in this build (worktreeId=...)`
error when `worktreeId` is supplied — matches the plan's "gate behind a
capability check" guidance rather than silently ignoring the field.

## Change 3 — Update `agent-manager.txt` description (Priority: high)

**File:** `src/tool/tools/agent-manager.txt`

Added a `worktreeId` bullet under `create` explaining that it targets an
existing managed worktree returned by `action: "list"`. This text is
part of the LLM prompt so the model can learn when to use the field.

## Change 4 — Provider SDK version bumps (Priority: medium) — **SKIPPED**

The plan flags this as optional and conditional on "Only apply if Alexi
tracks these dependencies directly." Alexi does not depend on
`@ai-sdk/openai` or `@ai-sdk/azure` — its provider layer sits on
`@sap-ai-sdk/ai-api` and `@sap-ai-sdk/orchestration` (see `package.json`
lines 36–37). No dep bump required, no upstream patch to copy.

## Explicitly skipped upstream changes (as per plan)

- All Kilo VSCode webview / diff viewer / inline PR comment changes
  (not a VSCode extension).
- JetBrains plugin changes.
- Kilo-CLI Windows AVX2 launcher benchmark.
- Visual regression PNG baselines.
- `console` OAuth client metadata route.
- `go.mdx` docs and Go SDK compatibility notes.
- Changesets / CI workflow tweaks specific to upstream repos.
- TUI Home/End nav fixes (Alexi's TUI is not the Kilo TUI).

## Testing

Added `src/tool/tools/__tests__/agent-manager.worktree-id.test.ts` with
four regression tests:

1. `create` without `worktreeId` still succeeds (backward compat).
2. Blank / whitespace-only `worktreeId` rejected at schema layer.
3. `worktreeId` on non-create actions rejected at schema layer.
4. Valid `worktreeId` on `create` surfaces the "not available in this
   build" capability error instead of silently succeeding.

The pre-existing test `src/tool/tools/__tests__/agent-manager.json-config.test.ts`
should continue to pass — none of its inputs supply `worktreeId`, and the
added `.refine()` calls on the outer schema and on `worktreeId` do not
change validation for any input it exercises.

## SAP AI Core compatibility

None of the changes touch provider dispatch, model resolution beyond
what was already there (`selectModel`), or wire schemas. The
`agent_manager` tool remains provider-agnostic and the field additions
are pure schema/validation and permission-string changes. SAP AI Core
integration is unaffected.

## Issues encountered

- The upstream diff uses `@effect/schema` (`Schema.Struct`,
  `Schema.makeFilter`, `Schema.NullOr`, etc.) which is not the same
  library as Alexi's Zod schemas. Field names and structural shape
  (`StartParams` / `ListParams` union, `WireParams` split) also do
  not exist in Alexi's action-oriented Zod schema. The port therefore
  applies the *intent* of the upstream changes (opt-in existing-worktree
  targeting with strict validation and permission visibility) rather
  than a literal line-for-line diff — which is what the plan
  explicitly authorised ("adapt to Alexi's conventions").
- Alexi's permission layer has no `metadata` field on requests, so the
  propagation went into the `resource` string. Documented above.
