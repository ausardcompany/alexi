# Update Plan Execution Summary

Executed: 2026-09-18
Basis: Alexi update plan derived from kilocode `8db973de9..c33d81690` (166 commits)
and opencode `5a83358..3dd1b30` (4 commits).

## Files Modified / Created

### Modified

- `src/kilocode/sandbox/git.ts` — Hardened `isGitWrite()` against masked
  mutations; short-flag cluster expansion; write-flag / masked-mutation
  detection now runs before the read-only subcommand check.
- `src/permission/index.ts` — Re-exports the new recovery surface
  (`recoverStalledPermissions`, `reconcileAbortedSave`, `trackPendingPermission`,
  `clearPendingPermission`, and their test helpers).
- `src/core/sessionManager.ts` — `createSession()` now triggers a
  best-effort `recoverStalledPermissions()` sweep on session start (dynamic
  import, non-blocking, non-fatal on failure).
- `src/config/userConfig.ts` — New `getConfigCodeMode()` / `setConfigCodeMode()`
  accessors for the `experimental.code_mode` flag, following the same
  serialisation pattern as `experimental.task_model_selection`.
- `src/tool/registry.ts` — Added first-class `ToolCategory` taxonomy
  (`read` / `write` / `execute` / `network` / `agent` / `meta` / `other`)
  and a `categories` filter on `ToolResolutionContext`. `resolveForPrompt`
  now honours the category filter for static tools (dynamic resolvers own
  their own filtering).

### Created

- `src/permission/recovery.ts` — Stalled-permission-approval recovery.
  Tracks pending prompts by id, provides `recoverStalledPermissions()`
  (called on session resume) and `reconcileAbortedSave(ruleId)`
  (called when a rule save is aborted mid-flight). Both resolve their
  entries as denials with structured `reason` codes.
- `src/tool/code-mode.ts` — Shim / loader for the `code_mode`
  experimental feature. `loadCodeMode()` returns `null` unless the
  config flag is set AND network access is not restricted (per upstream
  `e0dcb0e4e`). The actual runtime module (`./code-mode-runtime.js`) is
  a follow-up drop-in — the shim lets us land the config gate now.
- `src/kilocode/session/title.ts` — Deferred session title generation.
  Enforces the four-way gate (not-yet-titled, attempt budget, backoff
  window, min-message-length) before invoking a caller-supplied
  `TitleGenerator`. Failed attempts back off for 60s.
- `src/kilocode/sandbox/gh.ts` — `gh` (GitHub CLI) sandbox
  classification. Read-only subcommands (`pr list`, `issue view`, ...)
  now pass without a permission prompt; `gh auth *` stays behind the
  gate; everything else is treated as a write.

## Changes Applied (in priority order)

### 1. [critical] Harden read-only git classification (`src/kilocode/sandbox/git.ts`)
Ports upstream `32aaae25d` (masked mutations) + `2da7e2bb7` (flag order).
Short-flag cluster expansion (`-abc → -a -b -c`, preserving numeric-tail
short flags like `-n1`). Masked-mutation flag set (`-c`, `--config`,
`--exec-path`, `--upload-pack`, `--receive-pack`, `--work-tree`,
`--git-dir`) evaluated first — any hit forces write classification even
when the visible subcommand is read-only-shaped.

### 2. [critical] Recover stalled permission approvals (new module)
Ports `d8eaefdf1`, `f6d761e65`, `fa897b854`. New
`src/permission/recovery.ts` module registers pending prompts by id;
`recoverStalledPermissions()` sweeps expired entries and resolves them
as denials (`stalled_recovery`); `reconcileAbortedSave(ruleId)` handles
the aborted-save race (`save_aborted`). Wired into
`sessionManager.createSession()` so every new/resumed session drains
stalled prompts from prior aborts. Re-exported through
`src/permission/index.ts`.

### 3. [high] `experimental.code_mode` gate (`src/config/userConfig.ts`, `src/tool/code-mode.ts`)
Ports `6b5e8a04e` (config flag) + `e0dcb0e4e` (network-restricted gate).
Config accessors added following the existing `task_model_selection`
pattern. `loadCodeMode()` returns `null` when the flag is off or when
the environment is network-restricted (`ALEXI_NO_NETWORK=1`,
`NO_PROXY=*`). Runtime module is dynamically imported so unused
deployments do not pay for it.

### 4. [high] Deferred session title generation (`src/kilocode/session/title.ts`)
Ports `7e0ce5ec6`, `31bfc440c`, `4ab5fe935`. New `ensureTitle()` helper
enforces the four-part gate (not-yet-titled → attempt budget →
backoff window → min-message-length) before calling a
caller-supplied `TitleGenerator`. Idempotent, backoff on failure,
`resetTitleState()` on session close.

### 5. [high] Read-only `gh` classification (`src/kilocode/sandbox/gh.ts`)
Ports `13e05d066`, `ecedeea49`, `700345267`, `15b6b3287`. Explicit
read-only subcommand table (`pr list`, `pr view`, `issue view`,
`repo view`, `run list`, `workflow view`, `search`, `browse`, ...).
`gh auth *` classified as `auth-gated` — still needs the permission
gate but treated separately from write. Everything else defaults to
`write` (escalate). `isGhReadOnly(tokens)` convenience for the shell
tool.

### 6. [high] Tool-registry categorisation (`src/tool/registry.ts`)
Ports the opencode +25/-11 refactor. New `ToolCategory` union
(`read` / `write` / `execute` / `network` / `agent` / `meta` /
`other`) and a `categories?` filter on `ToolResolutionContext`.
`resolveForPrompt` filters static tools by declared `category` when
the caller supplies a filter (dynamic resolvers own their own
filtering). Missing category defaults to `other`.

## Compatibility Notes

- **SAP AI Core**: no changes to provider dispatch, model routing, or
  the SAP-specific auth path. `code_mode` is opt-in (default `false`)
  and network-restricted deployments (typical for on-prem AI Core)
  will short-circuit the loader before any external call is made.
- **ESM imports**: every new module uses the `.js` suffix on relative
  imports per the project's `NodeNext` module resolution.
- **Test surface**: the new modules export `_...ForTests` helpers so
  unit tests can reset in-memory state without spawning a fresh
  process. No global mocks were touched.

## Issues Encountered

- The update plan was truncated mid-item-6 in the input. Items 1–6
  (2 critical + 4 high) were fully specified and have been executed.
  The plan's stated totals (14 changes across critical/high/medium/low)
  could not be honoured for items 7–14 because their file targets and
  code diffs were not present in the received prompt. Per the
  execution instructions ("Do NOT add extra changes not in the plan"),
  I did not fabricate items 7–14 — those should be re-issued with a
  fresh (non-truncated) plan.
- No downstream call sites for the new `recoverStalledPermissions()`
  hook exist yet beyond `sessionManager.createSession()`; the hook
  point in `askUser()` that would register prompts via
  `trackPendingPermission()` is deliberately NOT patched here because
  it changes an already-tested code path. Suggested follow-up: wire
  `trackPendingPermission` / `clearPendingPermission` into
  `PermissionManager.askUser()` in a separate commit with its own
  test coverage.
- `src/tool/code-mode-runtime.ts` is intentionally NOT created — the
  shim in `code-mode.ts` refers to it via a dynamic import and
  gracefully returns `null` when the module is absent, so the config
  gate can land ahead of the sandbox implementation.
