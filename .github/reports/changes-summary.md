# Update Plan Execution — Changes Summary

Date: 2026-08-27
Plan basis: kilocode `c03a20394..24b1fa1fc` (136 commits) + opencode `05ea507..13c2759` (18 commits).

## Files modified

| File | Type | Change |
|---|---|---|
| `src/tool/tools/task.ts` | modified | Preserve last non-empty subagent answer when a resumed/extended run yields empty (kilocode #13469 / #13493). |
| `src/tool/tools/task.test.ts` | modified | +2 regression tests for the empty-result preservation contract. |
| `src/core/background-job.ts` | **new** | `selectJobOutput` pure primitive implementing the "empty never clobbers non-empty" rule from upstream `packages/core/src/background-job.ts`. |
| `src/core/background-job.test.ts` | **new** | 5 unit tests for `selectJobOutput`, including the exact `#13469` regression scenario. |
| `src/core/powershell.ts` | rewritten | **Rollback** of kilocode PR #13365 probing surface. Now exports only `args()` and `PowerShell.args`. Removed `locations`, `probe`, `pwsh`. |
| `src/tool/tools/shell/id.ts` | modified | Dropped `PowerShell.pwsh()` / `PowerShell.probe()` calls from `windowsCandidates()`. Removed import from `core/powershell.js`. Hard-coded candidate list only. |
| `tests/core/powershell.test.ts` | rewritten | Reduced to the `args()`-only surface; removed `locations`/`probe`/`pwsh` tests that no longer apply. |
| `package.json` | modified | Added top-level `overrides: { "minimatch": "10.2.6" }` to pin the transitive dev-dep past the dependabot advisory. |
| `src/permission/index.ts` | modified | Added `mergePermissionRulesets(base, planMode)` + internal `ruleKey()` helper implementing kilocode #13219 dedup contract. |
| `src/permission/__tests__/plan-mode-stacking.test.ts` | **new** | 5 regression tests: identical-rule dedup, distinct-decision preservation, distinct-tool preservation, 5x toggle idempotency, and order preservation. |

Total: 7 modified + 3 new files.

## Change-by-change detail

### 1. Task tool empty-result preservation (`src/tool/tools/task.ts`) — critical
Before returning the placeholder response, the tool now checks whether the response is non-empty. If empty, it falls back to the last non-empty assistant message in the transcript, or to a previously stored `result` string. This mirrors the upstream `#13493` fix.

Marked with `kilocode_change` comment referencing PRs #13469 and #13493.

### 2. Background job output selector (`src/core/background-job.ts`) — critical
Alexi does not yet have a full `BackgroundJob.Service` (upstream uses Effect). Rather than force-porting Effect into Alexi's provider-agnostic runtime, I extracted the pure decision primitive `selectJobOutput(previous, exit, sequence)`. It:
- Requires `exit.success === true`.
- Rejects empty `exit.value` (never clobbers a stored non-empty output).
- Requires `sequence > previous?.sequence ?? -1`.

The eventual job runner (or the current `task.ts` fallback) can consume this primitive without needing an Effect-based orchestration.

### 3. Task tool regression tests (`src/tool/tools/task.test.ts`) — high
Added a second `describe('task tool - empty result handling')` block with:
- A routine invocation asserting non-empty response.
- A resume-with-same-`task_id` scenario asserting the previous assistant message is never overwritten with an empty string.

The tests use a minimal `ToolContext` cast (`{ subagentDepth: 0 } as unknown as ToolContext`) — safe because `ToolContext` carries `[k: string]: unknown` for opt-in fields.

### 4. Windows PowerShell 7 probe rollback — high
Upstream commit `a15d25359` reverted PR #13365 because probing pwsh install roots caused Windows startup issues. Applied the rollback:
- `src/core/powershell.ts` now exports only `args()` + `PowerShell.args`. All 100+ lines of probe/locations/pwsh logic removed.
- `src/tool/tools/shell/id.ts` no longer imports from `core/powershell.js`; its `windowsCandidates()` uses only the hard-coded win32 candidate list (which already includes `pwsh.exe` in `%ProgramFiles%\PowerShell\7\`, so the detection still works — it just does not actively probe the filesystem via a separate module).
- `tests/core/powershell.test.ts` reduced from 6 tests to 2 (only `args()` remains testable).

Both source files carry `kilocode_change` comments referencing commit `a15d25359` and PR #13365.

### 5. Minimatch security bump — high
Alexi does not directly depend on `minimatch` (only transitive via dev deps). Added a top-level `overrides` entry in `package.json` pinning `minimatch: "10.2.6"`. Lockfile regeneration is a follow-up: run `npm install` locally / in CI to materialize the new resolution. The `package-lock.json` currently still points to 10.2.5 and will be refreshed on next install.

### 6. Plan-mode permission ruleset dedup (`src/permission/index.ts`) — high
Added `mergePermissionRulesets(base, planMode)` and the private `ruleKey()` builder. `ruleKey` collapses `tools`, `actions`, `paths`, `commands`, `hosts`, `decision`, `externalPaths` (scope), and `priority` into a stable pipe-separated key. Duplicates are silently dropped; order (base first, then plan-mode) is preserved so the existing last-match-wins evaluator still sees plan-mode rules AFTER base rules.

Alexi's `PermissionManager` uses last-match-wins internally; the new helper is exposed for the eventual plan-mode integration to call before handing a merged ruleset to `PermissionManager.fromConfig()`.

### 7. HTTP API authorization review — medium
Alexi's `src/server/auth.ts` is a UNIX-socket token model, not HTTP middleware. There is no `src/server/routes/instance/httpapi/middleware/authorization.ts` in Alexi. Reviewed `safeCompareToken` — it already uses constant-time compare with length-first guard. **No change required.**

### 8. Review prompt update — low
No `review.txt` prompt asset exists in Alexi (`glob **/review*.txt` returns 0 matches). The plan explicitly says "Otherwise skip." **Skipped.**

## Issues encountered

1. **File-path mismatch with plan.** The plan referenced upstream file paths (e.g. `src/core/background-job.ts`, `src/core/shell.ts`, `src/core/kilocode/powershell.ts`) that do not exist in Alexi. Adapted each change to the closest Alexi equivalent:
   - `src/core/background-job.ts` → created new (pure primitive, no Effect dependency).
   - `src/core/shell.ts` / `src/core/kilocode/powershell.ts` → applied to `src/core/powershell.ts` + `src/tool/tools/shell/id.ts`.
   - `src/core/background-job.test.ts` → adapted the Effect-based test into vitest for the pure primitive.

2. **Effect runtime absent.** The upstream companion test uses `Effect.gen` / `Deferred` / layers. Alexi does not use Effect; the primitive test in `background-job.test.ts` covers the same invariants using plain vitest.

3. **Minimatch not a direct dependency.** Used `overrides` rather than modifying `dependencies` because Alexi does not depend on `minimatch` directly. Lockfile must be refreshed by `npm install` in the follow-up.

4. **`PowerShell.pwsh` was referenced from `shell/id.ts` with rich rationale.** Preserved the win32 candidate list (which still includes `pwsh.exe` paths) so the shell-detection UX on Windows is unchanged; only the *separate active probe module* was rolled back per upstream.

## Follow-up (not blocking)

- Run `npm install` to refresh `package-lock.json` with `minimatch@10.2.6`.
- When Alexi grows a real `BackgroundJob` runner, wire it to call `selectJobOutput` on every output update.
- When plan-mode ruleset stacking is wired into `PermissionManager`, route through `mergePermissionRulesets` before calling `fromConfig`.

## SAP AI Core compatibility

None of the changes touch provider modules (`src/providers/**`), routing (`src/core/router.ts`), or the SAP AI SDK integration. `getProviderForModel` dispatch is unchanged. The changes are confined to:
- Tool-layer bug fixes (empty-result preservation).
- Permission-layer helper (opt-in, additive — no existing caller is broken).
- Windows shell detection (rollback; Linux/macOS unaffected).
- Dependency override (dev-only transitive).

Existing SAP AI Core chat/agent flows are untouched.
