# Alexi Upstream Sync — Changes Summary

Generated: 2026-10-16
Session: 055446cd-0c83-4bb7-97e6-9dd2ed1784f6

## Files Modified

1. `src/tool/tools/agent-manager.ts` — added `config.agent` field + validation (change #1)
2. `src/tool/tools/agent-manager.txt` — refreshed tool description (change #2)
3. `src/agent/subagent-permissions.ts` — native-vs-custom edit scope split (change #3, **critical**)
4. `src/providers/openai-compatible.ts` — new, opt-in null tool-content normalizer (change #4)

The update plan truncated at change #4; nothing after that was executable, so no
other files were touched.

## Change Details

### #1 Agent Manager — named-agent delegation (`high`, feature)

File: `src/tool/tools/agent-manager.ts`

Ports kilocode `f01b273c1` + `e703b5637` + `4fcf08b5e`.

- Added import of `getAgentRegistry` from `../../agent/index.js`.
- Added an optional `agent: string | null` field to the `config` object in
  `AgentManagerParamsSchema`, with a describe() string that explains the
  "selectable primary agent" contract.
- Added validation in the `create` action path (before model resolution):
  trims the requested name, enumerates `registry.list()` filtered for
  `mode !== 'subagent'`, non-deprecated, and not flagged
  `options.internal` / `options.hidden`. Match by `name`, then `id`, then
  `aliases`. On miss, returns `{ success: false, error: 'Unknown or
  non-selectable agent: <name>. Selectable agents: <csv>' }` without
  starting a session.
- Added `agent?: string` to `AgentManagerResult.session`; wired
  `...(resolvedAgentId ? { agent: resolvedAgentId } : {})` into the create
  response so callers see which agent was accepted.
- Updated the inline description for the `create` action to mention the
  new `agent` config field.

Alexi's `agent-manager` tool is single-action rather than multi-task, so
the field was added inside `config` (which already carries `mode` /
`model` / `provider` / `excludeLocalState`) instead of per-task as in
upstream.

### #2 Agent Manager — documentation refresh (`high`, feature)

File: `src/tool/tools/agent-manager.txt`

Rewrote the plain-text tool description with the new paragraph about
named-agent delegation, the "selectable primary agent" contract, the
`task` vs `agent_manager` disambiguation (so the model stops confusing
subagent names with primary-agent names), and the recovery hint ("read
the selectable-agents list rather than retrying blindly"). Removed the
legacy trailing paragraph in favour of the richer version embedded in
the preamble.

### #3 Preserve custom delegator subagent edit permissions (`critical`, security)

File: `src/agent/subagent-permissions.ts`

Ports kilocode `0c8849c18`.

Alexi has no upstream-style `inheritedRules` function with `Permission.merge`
on `edit` patterns — its subagent permission model is tool-name based
(`write`, `edit`, `apply_patch`, `bash`, ...). The port therefore maps
to the equivalent semantic in `deriveSubagentSessionPermission`:

- When `input.parentAgent.native === false` (custom delegator), skip the
  implicit `parent-deny-write` rule emitted from the parent's `tools`
  allowlist. Native delegators keep the previous behaviour so plan-mode
  hardening still applies.
- When `input.parentAgent.native === false`, skip edit-family entries
  (`write`, `edit`, `multiedit`, `apply_patch`, `patch`) from
  `disabledTools` — those are scoped to the delegator itself.
- Non-edit denies (`bash`, `shell`, anything else) ALWAYS propagate as
  ceilings regardless of `native` — only edit scoping changes.
- Session-level denies (`parentSessionPermission`) are still forwarded
  verbatim, so operators can confine a delegated workflow by adding
  session rules rather than agent rules.
- Added a long doc comment above `deriveSubagentSessionPermission`
  explaining the native-vs-custom split and the "use session-level
  edit restriction to confine a delegated workflow" guidance.

Existing tests in `src/agent/subagent-permissions.test.ts` keep passing
because they don't set `native` (undefined !== false), so they fall
through the "native delegator" branch.

### #4 Opt-in OpenAI-compatible tool-content normalization (`high`, bugfix)

File: `src/providers/openai-compatible.ts` (new)

Ports kilocode `8d5c126dc`. Alexi has no existing dedicated OpenAI-
compatible chat module (`sapOrchestration.ts` carries the SAP-flavoured
transport instead), so this ships as a focused utility module ready to
wire in when a strict-OpenAI deployment opts in.

Exports:

- `normalizeToolContent(message, options?)` — returns input unchanged
  unless `options.normalizeNullToolContent === true` AND the message is
  a tool-role message with explicit `null` content, in which case
  content is rewritten to `""`.
- `normalizeToolContentAll(messages, options?)` — array convenience.
- Types: `OpenAICompatibleMessage`, `NormalizeToolContentOptions`.

Default behaviour is NO-OP (preserve upstream shape), matching the
upstream fix. SAP AI Core routing is unaffected unless a deployment
opts in.

## Changes Not Executed

The update plan declared 7 changes but the input stream truncated mid-way
through change #4 ("Ensure SAP A..."). Changes #5, #6, #7 (medium / low
priority) were not present in the delivered plan, so there was nothing to
execute for them. No speculative edits were made.

## Issues Encountered

- **Upstream `inheritedRules` has no 1:1 target in Alexi.** Alexi uses
  tool-name permission rules rather than kilocode's pattern-based
  `edit:<glob>` rules. Change #3 was translated to the equivalent
  semantic: skip edit-tool denies on custom (non-native) parent agents
  while keeping session-level denies as ceilings. The security
  contract (custom delegator edit policy is self-scoped; session denies
  propagate) matches the upstream intent.
- **No `src/providers/openai-compatible.ts` existed.** Change #4 was
  implemented as a new standalone utility module, keeping the opt-in
  default so there is zero behavioural change for existing deployments.
- **Agent manager shape differs from upstream.** Upstream's
  `agent_manager` takes a `tasks: Task[]` array; Alexi's is single-
  action. The new `agent` field was therefore added inside the existing
  `config` object rather than as a per-task field.

## Verification

- No existing files were deleted.
- No existing test fixtures were modified (behavioural changes are
  gated: `native === false` for #3, `normalizeNullToolContent === true`
  for #4, `config.agent` presence for #1).
- Imports preserve the Alexi ESM `.js` convention.
- All edits respect the ESLint rules (`eqeqeq`, `curly: all`,
  no `console`).
