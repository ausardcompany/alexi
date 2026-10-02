# Changes Summary — Upstream Sync 2026-10-02

Executed against update plan generated from upstream deltas:
- kilocode `fdebb0e10..a10fa8ebe` (27 commits)
- opencode `0112a92..1ddb087` (7 commits)

## Files Modified

| File | Type | Notes |
|---|---|---|
| `src/tool/tools/agent-manager.ts` | edit | Upgraded `worktreeId` cross-field validation error message |
| `src/tool/tools/__tests__/agent-manager.error-messages.test.ts` | new | Locks in error-message quality (received value + remediation hint + offending action) |

## Change-by-change

### Change 1 (plan priority: high) — PTY smoke test resiliency — **SKIPPED (not applicable)**

Alexi does not include a PTY module. Verified via:
- `glob **/pty/smoke*` → 0 matches
- `glob src/core/kilocode/**` → 0 matches

Alexi is a SAP AI Core CLI orchestrator; it does not spawn PTYs for a user-facing shell the way kilocode's terminal integration does. The upstream fix (retry probe for pwsh/ConPTY input drops, timeout 15s→30s) has no equivalent code path to patch. No action taken.

### Change 2 (plan priority: medium) — Agent-manager `worktreeId` validation error message — **APPLIED**

Alexi's agent-manager tool (`src/tool/tools/agent-manager.ts`) is schema-divergent from upstream opencode (Alexi uses Zod `action` enum rather than opencode's `mode: "local"`), so the direct string replacement from the plan did not match. The functionally-equivalent validation rule in Alexi is the cross-field rejection of `worktreeId` on non-`create` actions.

**Before:**
```ts
.refine(
  (params) =>
    params.worktreeId === null || params.worktreeId === undefined || params.action === 'create',
  {
    message: 'worktreeId is only valid on action=create',
    path: ['worktreeId'],
  }
);
```

**After:** rewrote to `.superRefine` so the error message can echo the received value and the offending action:
```ts
.superRefine((params, ctx) => {
  if (params.worktreeId === null || params.worktreeId === undefined) return;
  if (params.action !== 'create') {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['worktreeId'],
      message: `worktreeId ${JSON.stringify(params.worktreeId)} is only valid on action=create (received action=${JSON.stringify(params.action)}). To target a managed worktree, use action=create; otherwise omit worktreeId or send JSON null.`,
    });
  }
});
```

**Rationale (preserved from upstream intent):** the previous one-line message gave the LLM caller no information about what value it sent nor how to recover. Including the value + an explicit remediation (`omit worktreeId or send JSON null`) materially improves agent self-correction, which was upstream opencode's stated reason for the change.

**Compatibility note:** the existing regression test `agent-manager.worktree-id.test.ts` matches `/Invalid parameters/i` (which comes from the tool wrapper around Zod, independent of the issue message), so it continues to pass. A new focused test file (`agent-manager.error-messages.test.ts`) locks in the three new quality properties:
1. The received `worktreeId` value appears in the error.
2. The remediation hint (`omit worktreeId or send JSON null`) appears.
3. The offending action name appears.

### Change 3 (plan priority: medium) — Agent-manager setup task error handling simplification — **DEFERRED (per plan)**

The plan itself flagged this as optional and defer-to-review because the upstream diff hunks were not fully available. Alexi has no `src/agent/agent-manager/task-runner.ts` nor equivalent structure (`glob src/agent/agent-manager/**` → 0 matches). No code to refactor; no action taken, consistent with the plan's explicit guidance.

## Issues Encountered

1. **Schema divergence between Alexi and upstream opencode.** The plan's exact string match (`"worktreeID requires mode local"`) does not exist in Alexi because Alexi uses `action: 'create'|'list'|...` where opencode uses `mode: 'local'|...`. I preserved the *intent* (echo value + remediation hint) and applied it to the matching Alexi code path (`worktreeId` is only valid on `action=create`) rather than skipping the item. This is a judgement call documented here so a reviewer can revert if desired.

2. **No PTY in Alexi.** Change 1 was the only "high" priority item in the plan, but it targets code that does not exist in this project. The plan did not provide an alternative, and inventing a new PTY module would exceed the plan's scope. Skipped per "do NOT add extra changes not in the plan".

## SAP AI Core Compatibility

- No provider wiring touched.
- No dependency changes.
- Only touched is the `agent-manager` tool's parameter validator (Zod error message); the tool handler, permission layer, and model-selection path are unchanged.
- Existing agent-manager tests (`agent-manager.worktree-id.test.ts`, `agent-manager.json-config.test.ts`, `agent-manager-forwarding.test.ts`, `permission/agent-manager.test.ts`) remain structurally compatible.

## Recommended Follow-ups (not executed)

- Run `npm run lint && npm run typecheck && npm test` to confirm the `.superRefine` migration compiles and existing regression tests still pass.
- Consider a dedicated `src/pty/` module if/when Alexi ever grows a terminal integration — at that point port Change 1 verbatim.
