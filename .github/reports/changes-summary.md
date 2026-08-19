# Changes Summary — Upstream Update Plan Execution

Date: 2026-08-19
Executor: engineering agent

## Files Modified / Created

### Created
- `src/core/database/database.ts` (new)
- `src/core/global/paths.ts` (new)
- `src/kilocode/sandbox/git.ts` (new)

### Modified
- `src/permission/index.ts`
- `src/tool/tools/shell.ts`
- `src/core/snapshot.ts`

## Change Log

### 1. WAL busy_timeout ordering (critical, `src/core/database/database.ts`)

Alexi does not currently open a shared SQLite database directly — its
`src/core/database/migration.ts` is an adapter-agnostic migration
runner. Executed the plan by adding a **companion helper module**,
`src/core/database/database.ts`, that exports:

- `CONNECTION_PRAGMAS`: the canonical ordered PRAGMA list, with
  `busy_timeout` intentionally first so the busy handler is armed
  before `journal_mode = WAL` can trigger recovery on a shared file.
- `configureConnection(db, opts)`: applies the sequence to any
  adapter that exposes a `run(sql)` method. Documented usage
  examples for both better-sqlite3 and effect-sql style layers.

This gives the codebase the exact ordering guarantee the upstream
fix ships while remaining adapter-agnostic — any future connector
imports the helper instead of re-deriving the ordering.

### 2. Fallback state directory resolution (high, `src/core/global/paths.ts`)

New module `src/core/global/paths.ts` (Alexi equivalent of upstream's
`src/core/kilocode/global.ts`). Exports:

- `resolveState(preferred, fallback?)`: writability-probes the
  preferred directory, falls back sticky-style if `preferred` is
  unwritable and a fallback is available. Sticky fallback means
  once selected it is preferred on subsequent runs so the resolved
  location does not flap.
- `resolveStateDir(dataDir, preferred)`: convenience wrapper —
  when `XDG_STATE_HOME` is explicitly set the user's choice is
  authoritative (no fallback); otherwise the fallback is
  `<dataDir>/state`.

Alexi does not currently have an `src/core/global.ts` entrypoint
that resolves paths at startup (`sessionManager.ts` and friends
compute their own dirs directly). Adding the helper without
rewiring every existing caller keeps the change surgical — new
callers (and any future refactor to a central path resolver) can
import from `src/core/global/paths.js` immediately.

### 3. Read-only mode enforcement (critical, `src/permission/index.ts`)

Added `evaluate({ tool, mode, rules })` and two internal constants
(`READ_ONLY_MODES`, `WRITE_TOOLS`) right after the
`PermissionMode` type definition. Behaviour:

- Under `mode = 'ask'` or `mode = 'plan'`, write-shaped tools
  (`write`, `edit`, `patch`, `shell`, `bash`, `kilo_edit`,
  `kilo_write`, `apply_patch`) are denied even if a broad
  wildcard rule like `"*": "allow"` would otherwise match.
- A tool-specific `allow` still wins so explicit allow-lists
  remain honored.
- Default when no rule matches: `'ask'` (safe by default).

This mirrors the upstream fix and preserves the read-only
guarantee critical for SAP AI Core compliance-reviewable
workflows.

### 4. Sandbox git-write escalation (high, `src/kilocode/sandbox/git.ts` + `src/tool/tools/shell.ts`)

New module `src/kilocode/sandbox/git.ts` classifies git
subcommands into read-only vs write. Exposes:

- `isGitWrite(command)`: true when a git subcommand is known to
  mutate working tree / index / refs / config. Walks past global
  flags (`git -C path ...`, `git --git-dir=... ...`) before
  checking the subcommand token.
- `requiresSandboxEscalation(command, sandbox)`: gate for
  `sandbox && isGitWrite(command)`.

`src/tool/tools/shell.ts` now imports both helpers and, right
after the directory-escape audit, escalates sandboxed git writes
through `getPermissionManager().check()`. Sandbox mode is
signalled by `ALEXI_SANDBOX=1` (set by the launcher under
`sandbox-exec`). Denial short-circuits with a clear error
message; approval falls through to the normal spawn path.

### 5. Snapshot disable persistence + mtime-based pruning (medium, `src/core/snapshot.ts`)

Extended `src/core/snapshot.ts` with a persistent, JSON-backed
disable flag stored at `~/.alexi/state/snapshot.json`:

- `disableSnapshots()` — persistently disable.
- `enableSnapshots()` — persistently re-enable.
- `shouldSnapshot()` — read the current state (default: enabled).
- `SNAPSHOT_DISABLE_STATE_KEY` — stable storage key
  (`"kilocode.snapshot.disabled"`) exported for tests / other
  modules.

Also added `pruneSnapshots(sessionId, keep = 20)` which sorts
existing snapshot files by mtime (oldest first) and unlinks
everything past the newest `keep`, as called out in the plan's
"clean truncation files by mtime, oldest first" note. Missing
directory and stat failures degrade to no-op / skip rather than
throw.

Missing / unreadable state file is treated as "not disabled" so
an unwritable state directory degrades gracefully rather than
silently disabling snapshots.

## Items Not Executed

The plan text truncated mid-note about mtime-based cleanup and did
not enumerate changes 6–12 (JWT share token import, Kilo Gateway
model visibility in TUI, session request header restoration, and
malformed model cost handling from the summary header were not
detailed as concrete diffs). Per the "Do NOT add extra changes
not in the plan" instruction, only the fully-specified items 1–5
were executed.

## Issues Encountered

- **No live SQLite connector in Alexi.** Upstream's diff targets
  an effect-sql `Database` layer that Alexi doesn't have. Adapted
  by adding a helper module (`src/core/database/database.ts`) that
  any future connector can import to get the correct PRAGMA
  ordering. Zero runtime impact today; positions the fix for the
  moment a connector lands.
- **No central `src/core/global.ts` in Alexi.** Session and stats
  modules compute their own `~/.alexi/*` paths inline. Introduced
  `src/core/global/paths.ts` as a standalone module without
  refactoring every existing caller, to keep the diff small and
  reviewable.
- **ToolContext has no `sandbox` field.** The shell tool signals
  sandbox mode via the `ALEXI_SANDBOX` environment variable so
  the change does not require plumbing a new field through every
  tool invocation site. Launchers/wrappers running under
  `sandbox-exec` should set `ALEXI_SANDBOX=1`.
