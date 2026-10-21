# Subagent Tool Allowlist Inheritance Audit

**Issue:** #2104 — Audit subagent tool allowlist inheritance
**Reference:** Kilo-Org/kilocode PR [#15254](https://github.com/Kilo-Org/kilocode/pull/15254) (2026-10-19)
**Status:** **Already correct — no gap confirmed.**
**Date:** 2026-10-21

## Executive summary

The bug Kilocode PR #15254 fixed — a parent-session catch-all edit deny
(`{ tools: ['edit'], paths: ['*'], decision: 'deny' }`) followed by
path-specific allows being flattened into a blanket deny on the derived
subagent ruleset — **does not reproduce in Alexi**. The relevant guard was
ported into Alexi well before this audit, during the subagent approval
boundary enforcement work (`feat(agent): enforce subagent approval
boundaries without inheritance`, commit `d37f77ba`) and subsequent allowlist
baseline port (`src/permission/allowlist.ts`).

The verification path in Alexi is:

- `src/agent/subagent-permissions.ts` `deriveSubagentSessionPermission`
  (lines 209-223) collects every parent-session catch-all deny for the
  edit-family permissions (`edit`, `write`, `multiedit`, `apply_patch`,
  `patch`) that has at least one later path-specific non-deny rule
  narrowing it, and excludes those baselines from the subagent's forwarded
  ruleset.
- `src/permission/allowlist.ts` `PermissionAllowlist.exceptions` / `catchAll`
  implement the baseline-vs-blanket-deny distinction with the same
  semantics as upstream Kilocode `packages/opencode/src/kilocode/permission/allowlist.ts`.

A true blanket deny (catch-all deny with no narrowing allows) is still
propagated as a hard ceiling. Read-only parents still confine their
subagents' edit surface. The behaviour therefore matches the upstream
contract documented in the PR body.

A regression-pinning test case has been added at
`tests/agent/inheritance.test.ts` that reproduces the Kilocode PR #15254
customer scenario end-to-end against `TaskTool.buildSubagentConfig` and
`deriveSubagentSessionPermission`, so a future refactor that re-flattens
the parent allowlist will fail CI.

## Scope of audit

Traced the subagent-creation call chain for the `task` tool (internal
delegation; `agent_manager` is user-visible fan-out and uses a different
permission surface) across:

| File | Role |
|---|---|
| `src/tool/tools/task.ts` | `task` tool entry, calls `TaskTool.buildSubagentConfig` |
| `src/agent/subagent-permissions.ts` | `deriveSubagentSessionPermission` — the derivation under audit |
| `src/permission/allowlist.ts` | Catch-all vs. baseline helper (ported from Kilocode) |
| `src/permission/index.ts` | `PermissionManager` evaluate / check (last-match-wins) |
| `src/tool/registry.ts` | `EnhancedToolRegistry.resolveForPrompt` tool filtering |
| `src/agent/index.ts` | `Agent.canUseTool` tool-list enforcement |

## Call trace: parent -> subagent permission derivation

1. Parent LLM invokes `task` tool with optional `allowed_tools` list.
2. `taskTool.execute` (`src/tool/tools/task.ts:699`) assembles
   `SubagentOptions` and calls `TaskTool.buildSubagentConfig(context, agent, options)`.
3. `buildSubagentConfig` (same file, line 216) delegates to
   `deriveSubagentSessionPermission` with:
   - `parentSessionPermission`: the current session's ruleset (copy, never a reference).
   - `parentAgent`: the parent agent's config (for `tools` / `disabledTools`
     ceilings).
   - `subagent`: the delegate's agent config.
   - `allowedTools`: forwarded verbatim from the `task` call.
   - `bashRules`: `getExploreAgentBashRules()` when `isExploreAgent(subagent.id)`.
4. `deriveSubagentSessionPermission` (`src/agent/subagent-permissions.ts:129`)
   builds the derived ruleset by concatenating five layers in priority order:
   `parentAgentDenies ++ sessionDeniesAndExternal ++ defaultDenies ++
   explicitDenies ++ bashDenies`.
   - The allowlist-baseline filter runs inside the `sessionDeniesAndExternal`
     step (lines 209-223): a parent-session catch-all deny is omitted from
     the forwarded ruleset when `PermissionAllowlist.exceptions` reports a
     later path-specific allow narrowing it.
   - This matches the Kilocode PR #15254 fix.

## Comparison with Kilocode PR #15254

| Dimension | Kilocode (packages/opencode/src/kilocode/tool/task.ts) | Alexi (src/agent/subagent-permissions.ts) |
|---|---|---|
| Allowlist baseline detection | `PermissionAllowlist.exceptions(name, parentRules)` | `PermissionAllowlist.exceptions(name, input.parentSessionPermission)` |
| Edit-family set | `edit`, `write`, `multiedit`, `apply_patch`, `patch` | `edit`, `write`, `multiedit`, `apply_patch`, `patch` (constant `EDIT_PERMISSION_NAMES`) |
| Baseline filtered from derived ruleset | yes | yes (via `editAllowlistBaselines` Set membership check) |
| True blanket deny still propagated | yes | yes (`exceptions()` returns false when no narrowing allow exists, so the catch-all survives into `sessionDeniesAndExternal`) |
| Parent `tools` / `disabledTools` deny inheritance scoped for custom delegators | yes (plan still hard-ceilings; custom allowlisted agents do not) | yes (`parentIsCustom` check at `src/agent/subagent-permissions.ts:145`, ports kilocode `0c8849c18`) |
| Parent ALLOW / ASK rules forwarded | no (dropped) | no (dropped — line 218: `rule.decision === 'deny' || external_directory`) |
| Resume refresh for stale flattened denies | implicit (session rebuild each turn) | n/a — Alexi derives per-call rather than persisting the flattened result; a stale rule cannot survive to a later turn |

### Why there is no `session.ts` analog gap

Kilocode's upstream fix also touched `packages/kilocode/src/session.ts` to
preserve the allowlist shape when a session is reconstructed. Alexi does
not persist the derived subagent ruleset — `deriveSubagentSessionPermission`
is called fresh on every `task` invocation (see
`src/tool/tools/task.ts:699`), so the "stale flattened deny on resume"
sub-bug cannot occur. The resume path for a failed subagent
(`src/tool/tools/task.ts:666`) only reads `taskData.status === 'failed'`
to re-surface the error; it does not re-derive and does not cache a prior
permission snapshot.

### Tool-registry filtering

`EnhancedToolRegistry.resolveForPrompt` (`src/tool/registry.ts:203`) does
NOT consult the permission ruleset. It only honours per-tool
`requiredPermissions` (string tags, orthogonal to `PermissionRule`) and
the optional `categories` filter. Tool availability on the subagent is
therefore gated at execution time via `PermissionManager.check(ctx)`
inside the tool executor, not by registry trimming. This matches Alexi's
permission-first model and sidesteps the Kilocode-specific
`Permission.disabled(rules)` path that was flattening the tool list in the
original bug.

### Explore subagent

The `explore` subagent receives an additional command-based deny layer
(`getExploreAgentBashRules()` -> `bashDenies` in
`src/agent/subagent-permissions.ts:290`) so bash escapes like
`find -delete`, `gh *`, etc. remain denied even when `bash` is otherwise
on the explicit allow-list. This is independent of the allowlist-baseline
fix and already covered by
`tests/tool/tools/task-approval-boundary.test.ts:215`.

## Verified behaviour (end-to-end)

New test file: `tests/agent/inheritance.test.ts`. It reproduces the
Kilocode PR #15254 customer scenario:

- Parent session has `edit` as a catch-all deny (`paths: ['*'], decision:
  'deny'`) followed by `paths: ['candidate/**/*.md'], decision: 'allow'`.
- Subagent is launched via `TaskTool.buildSubagentConfig` with
  `allowedTools: ['write', 'edit', 'read']`.
- Assertion: the derived ruleset must NOT contain the parent's catch-all
  edit deny (which would flatten the subagent's edit surface) AND the
  parent's path-specific allow must still have been dropped (parent
  APPROVALS are never forwarded).
- Negative case: a parent session with a true blanket edit deny (no
  narrowing allow) MUST still propagate the deny to the subagent.
- Negative case: parent ALLOW rules for `write` are never forwarded, even
  when the subagent explicitly lists `write` in `allowedTools` — the
  subagent gets a non-denied write surface, but ultimately
  `PermissionManager` falls back to the session's `ask-write` default
  rule, not a parent-granted allow.

Running `npm test -- tests/agent/inheritance.test.ts` passes against the
current implementation. No source changes are required for this issue.

## Outcome

- Gap confirmed? **No.** Alexi already carries the equivalent fix.
- Follow-up issue? **Not required.** The regression test added by this
  audit is sufficient to pin the behaviour. If a future refactor removes
  the `editAllowlistBaselines` filter from
  `src/agent/subagent-permissions.ts`, the new test fails.
- Documentation? The security contract is already documented at the top
  of `src/agent/subagent-permissions.ts` and
  `src/permission/allowlist.ts`. No additional docs changes required.

## Files inspected (read-only, no edits in this audit)

- `src/agent/subagent-permissions.ts`
- `src/agent/subagent-permissions.test.ts`
- `src/agent/subagent-denial.test.ts`
- `src/agent/index.ts`
- `src/tool/tools/task.ts`
- `src/tool/registry.ts`
- `src/permission/allowlist.ts`
- `src/permission/index.ts`
- `tests/tool/tools/task-approval-boundary.test.ts`

## Files added by this audit

- `.github/research/subagent-inheritance-audit.md` (this document)
- `tests/agent/inheritance.test.ts` (regression test)
