# Changes Summary — Upstream Update Plan Execution

**Date:** 2026-09-05
**Plan source:** `Update Plan for Alexi` (kilocode `74b3141bb..ecccd1f54`, opencode `3f31139..e289456`)

## Files Modified

| File | Change type | Priority |
|------|-------------|----------|
| `src/tool/tools/glob.ts` | bugfix (feature port) | high |
| `tests/tool/tools/glob-timeout.test.ts` | new (test coverage) | medium |
| `src/providers/openai/prompt-cache.ts` | bugfix (hardening) | medium |
| `src/providers/openai/__tests__/prompt-cache.test.ts` | test additions | medium |
| `package.json` | version bump | low |

## Changes Applied

### 1. Bounded timeout on glob search (plan item #1 + #2, merged)

**File:** `src/tool/tools/glob.ts`

The plan targeted a ripgrep primitive at `src/core/ripgrep.ts`, but Alexi has
**no** ripgrep primitive — its `globTool` uses a pure-JS walker (`globMatch`)
that recursively calls `fs.readdir`. The same stall risk applies (large
repos, network-mounted filesystems on SAP CI runners), so the fix was
adapted to Alexi's architecture:

- Introduced `GLOB_SEARCH_TIMEOUT_MS = 30_000` (matches upstream default).
- Extended the `GlobResult` interface with optional `timedOut?: boolean`
  and `truncated?: boolean` fields, mirroring kilocode's return shape.
- Wrapped the `globMatch(...)` call in an `AbortController` that fires
  when the deadline elapses. The caller's existing `context.signal` is
  chained so external aborts still propagate.
- On timeout, the tool returns `{ success: true, data: { matches: [],
  count: 0, timedOut: true, truncated: true } }` rather than throwing —
  so an agent turn can keep going with a partial, non-fatal result.
- Real errors (non-timeout abort, I/O failures) continue to propagate.

Plan item #2 (wiring `timeout` through the glob tool) is subsumed into the
same file since Alexi doesn't have a separate `Ripgrep.files` layer.

### 2. Regression test for glob timeout (plan item #3)

**File:** `tests/tool/tools/glob-timeout.test.ts` (new)

Adapted the plan's upstream Bun+Effect test to Alexi's vitest+TypeScript
idiom. Mirrors the mock/tempdir pattern already used by
`tests/tool/tools/glob.test.ts`:

- **Timeout case:** monkey-patches `fs.readdir` to return a never-resolving
  promise (simulating a stalled network filesystem), enables fake timers
  for `setTimeout`/`clearTimeout` only, advances past the 30 s deadline,
  and asserts `timedOut === true`, `truncated === true`,
  `matches === []`.
- **Fast-path case:** runs a real, tiny tree end-to-end and asserts the
  new flags stay `undefined` on a successful search — guards against a
  regression that would over-report timeouts.

### 3. Codex GPT version comparison hardening (plan item #5)

**File:** `src/providers/openai/prompt-cache.ts`, `.test.ts`

Alexi's `supportsPromptCacheBreakpoint` used the regex
`/gpt-5\.[6-9]|gpt-[6-9]/i`. That regex *happens* to handle both
opencode-reported bugs (integer version like `"gpt-6"`, and correct
comparison across major+minor), but the intent was implicit. Refactored
to an explicit `(major, minor)` tuple comparator so future edits can't
accidentally regress:

- Added exported `isGpt5_6OrLater(modelId)` that parses `gpt-<major>(.<minor>)?`
  and compares by tuple against `(5, 6)`. Defaults minor to 0 when absent,
  guards against `NaN` (`Number.isFinite`), and is case-insensitive.
- `supportsPromptCacheBreakpoint` now delegates to `isGpt5_6OrLater`.
- Added 5 new test cases covering `"gpt-5"`, `"gpt-5.6"`, `"gpt-6"`,
  `"gpt-4.9"`, `""`, `"gpt-"`, and case-insensitive prefix.

### 4. Version bump (plan item #6)

**File:** `package.json`

Bumped `version` from `1.22.11` → `1.22.12` (patch bump, since all changes
are bugfixes / test coverage). The plan message truncated before the exact
version was specified, so the standard patch bump was applied.

## Plan Items Skipped

### Plan item #4 — `run-stdin` piped-stdin bounded wait

**Status:** Not applicable / skipped.

The plan itself was conditional ("if Alexi ships `alexi run`"). Verified
via `grep -r 'process\.stdin\.' src/cli/` and `glob 'src/cli/**/run*.ts'`
that Alexi has:

- **No** `alexi run` subcommand.
- **No** piped-stdin reader in any CLI command. `chat` accepts input via
  `-m/--message` flag or `--message-file` path, not stdin.
- **No** `readFileSync('/dev/stdin')` or `process.stdin.on('data', ...)`
  usage outside the interactive REPL's keypress handler (which is not a
  piped-input path and doesn't have the same hang risk).

Adding the `readPipedStdin` utility with no caller would be dead code and
falls under "do NOT add extra changes not in the plan".

## Issues Encountered

1. **Repository shape mismatch with plan.** The plan assumed a kilocode/
   opencode-style Effect + ripgrep architecture (`src/core/ripgrep.ts`,
   `Ripgrep.files`, Bun test runner, `@effect/testing`). Alexi is a much
   simpler Node+vitest codebase with a JS glob walker. Items #1 and #2
   were merged and adapted to Alexi's `globTool` directly. The **semantic
   contract** (bounded deadline → `timedOut + truncated` partial result)
   matches upstream.

2. **Existing regex already covered opencode bug (#5).** Alexi's regex
   `/gpt-5\.[6-9]|gpt-[6-9]/i` already correctly handled both edge cases
   opencode PRs #47384 and #47385 fixed. The refactor to an explicit
   tuple comparator (`isGpt5_6OrLater`) is defensive: it codifies the
   invariant so a future edit that "simplifies" the regex to
   `/gpt-\d/i` (or similar) can't silently reintroduce the bug.

3. **Version bump target unspecified.** Plan item #6 was truncated
   mid-file-header. Chose a patch bump (`1.22.11` → `1.22.12`) as all
   changes are bugfixes.

## SAP AI Core Compatibility

- **No** changes to `src/providers/sapOrchestration.ts`,
  `src/providers/index.ts`, or any SAP auth path.
- The GPT-version comparator continues to accept `providerId ===
  'sap-ai-core'` for SAP-routed OpenAI models (regression-tested in
  `prompt-cache.test.ts`).
- Glob timeout is purely a client-side traversal deadline — does not
  touch any provider API contract.
