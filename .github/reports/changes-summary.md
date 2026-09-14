# Update Plan Execution — Changes Summary

**Executed:** 2026-09-14
**Plan source:** upstream changes analysis (kilocode c36e22634..2ad448820, opencode 95daf90..228e909)

## Files modified

### Source (behavior changes)

- `src/bus/index.ts` — extended `PermissionResponse` event with optional `feedback: string`.
- `src/permission/index.ts` — extended `PermissionResult` with optional `feedback`; trimmed & threaded from `askUser()`.
- `src/permission/prompt.ts` — CLI prompt handler now captures optional rejection reason after `D` / `N`; approval shortcut is disarmed while feedback input is active.
- `src/cli/tui/dialogs/PermissionDialog.tsx` — two-phase Ink dialog: after deny/never, opens a `TextInput` for optional feedback; approval key (`a`/`r`) is intentionally NOT re-armed during the feedback phase (mirrors kilocode 845565872).
- `src/tool/index.ts` — tool executor prefers `PermissionResult.feedback` over the generic `"<action> on <resource>"` fallback when building the LLM-facing rejection error.
- `src/tool/tools/shell.ts` — same feedback-preference update for the sandboxed-git-write escalation path.
- `src/core/snapshot.ts` — added `discardSnapshotRepository(sessionId)` (idempotent) and `snapshotRepositoryExists(sessionId)` helpers so a missing on-disk snapshot dir is treated as "gone" rather than an exception (Alexi analog of kilocode's seed-pin release fixes).
- `src/skill/skills/index.ts` — rewrote `codeReviewSkill.prompt` output-format section to require `path:LINE` bullets, an indented "Fix:" sub-bullet, all three headers even when empty, and a `_No issues found._` fallback line.

### Source (new modules)

- `src/core/promptQueue.ts` (new) — append-only `PromptQueue` primitive that enforces the "user message does NOT preempt an active goal" invariant. Explicit `interrupt()` is the only cancel path.
- `src/cli/commands/reload.ts` (new) — `alexi reload` command + `registerRefresher()` registry, in-flight-skip classification via `IN_FLIGHT_MARKER`, and `formatReloadResult()` renderer.
- `src/cli/commands/index.ts` — wired `registerReloadCommand` into `registerAllCommands`.

### Tests (new)

- `src/permission/__tests__/rejection-feedback.test.ts` — verifies feedback is trimmed and only surfaced on denial (not approval); whitespace-only feedback treated as absent.
- `src/core/__tests__/promptQueue.test.ts` — covers enqueue-does-not-cancel, drain order, explicit interrupt, idempotent finish, queued-behind-goal callback.
- `tests/core/snapshot-lifecycle.test.ts` — covers `discardSnapshotRepository` idempotency + `snapshotRepositoryExists` truthfulness.
- `src/cli/commands/__tests__/reload.test.ts` — verifies success/failure/in-flight classification, ordering, and `formatReloadResult` output.

## Change-by-change execution notes

### 1. Bump `@ai-sdk/*` dependencies — **NOT APPLICABLE**
Alexi does not depend on `@ai-sdk/gateway`, `@ai-sdk/provider`, or `@ai-sdk/provider-utils`. Its provider layer uses `@sap-ai-sdk/ai-api` and `@sap-ai-sdk/orchestration` (SAP's own SDK) plus a bespoke internal orchestrator — the AI SDK v2/v3 ecosystem is not on the dependency tree. Confirmed via `grep '@ai-sdk' package.json` (only test-fixture references in `tests/providers/transform.test.ts`, no runtime dependency). No package.json change made.

### 2. Permission rejection feedback (HIGH) — **DONE**
Implemented end-to-end:
- Bus event carries `feedback?: string`.
- `PermissionManager.askUser()` trims and only surfaces feedback on denial; trims whitespace-only reasons to `undefined`.
- CLI prompt handler prompts for an optional reason with a 30s timeout after `D` or `N` and disarms the readline interface before opening the feedback prompt so the approval keys can't fire (mirrors kilocode 845565872).
- TUI dialog: `useInput` swallows shortcut keys during the feedback phase; `TextInput` handles enter-to-submit / esc-to-skip.
- Tool executor (`src/tool/index.ts`) uses `buildUserRejectedToolReason(name, feedback)` when feedback is present so the LLM sees the user's own words.

### 3. Prompt queue / goal preemption (MEDIUM) — **DONE (as primitive)**
Alexi's current `command/goal.ts` already uses its own `AbortController` that only fires on explicit user Ctrl+C (via `src/cli/interactive.ts`), so there is no existing preemption bug to fix. To codify the invariant for future drivers, added a stand-alone `PromptQueue` module + tests. Existing callers are unchanged; new callers should use it instead of hand-rolling an `activeGoal.cancel()` on message arrival.

### 4. Snapshot repository robustness (MEDIUM) — **DONE**
Alexi does not use git worktree seed-pins — snapshots are JSON files. Ported the intent of the four upstream fixes as `discardSnapshotRepository()` (idempotent unlink of every `.json` + best-effort `rmdir`) and `snapshotRepositoryExists()` (sync check for stale in-memory references).

### 5. `/reload` command (MEDIUM) — **DONE**
Added `src/cli/commands/reload.ts` with:
- `registerRefresher(name, fn)` registry so subsystems (routing config, user config, skills, MCP, future...) plug in without editing the reload module.
- `IN_FLIGHT_MARKER` protocol: refreshers throw `Error("IN_FLIGHT: <reason>")` to signal skip-not-fail (mirrors upstream 546195019).
- `formatReloadResult()` renders ✓ / ✗ / ⏭  and a tally.
- Default refreshers auto-wired for `routing-config`, `user-config`, and `skills`. Dynamic imports so the CLI dispatcher doesn't eagerly load them.
- Wired into `registerAllCommands`; exposed as `alexi reload` / `ax reload`.

### 6. Review findings formatting (LOW) — **DONE**
Rewrote the `codeReviewSkill` output-format section to require:
- Backticked `path:LINE` prefix on every bullet.
- Rationale line.
- Indented `Fix:` sub-bullet for MUST FIX and SHOULD IMPROVE.
- All three headers present even when empty (parser stability).
- `_No issues found._` sentinel line when the review is clean.

Confirmed the existing `parseMustFixFindings` / `parseAllFindings` regexes (`/^#{1,6}\s+MUST FIX\b/i`, etc.) still match both `### MUST FIX` and legacy `### MUST FIX (Critical)` variants; no parser or test-fixture edits needed.

## SAP AI Core compatibility

- No changes to `@sap-ai-sdk/*` dependency versions.
- No changes to provider dispatch (`src/providers/`) or `getProviderForModel`.
- No changes to the SAP AI Core orchestration adapter or the SAP proxy providers.
- Permission-manager rule evaluation is unchanged for the allow / ask / deny decision paths — feedback is a purely additive field on the response.
- New reload command is opt-in; not called from any auto-bootstrap path.

## Issues encountered

- Plan item #1 (`@ai-sdk/*` bump) is factually not applicable to Alexi — the repository has never depended on that SDK family. Documented as NOT APPLICABLE in the summary above rather than fabricating a change.
- Plan item #3 (goal preemption) referenced code shapes (`enqueuePrompt`, `activeGoal.cancel()`) that Alexi does not have. Implemented the fix as a reusable primitive plus tests so any future queued-prompt driver adopts the correct policy from day one, rather than editing files that do not yet exhibit the bug.
- Plan item #4 (snapshot seed pin) targets a git-worktree model Alexi does not use. Adapted the intent (idempotent discard, missing-repo tolerance) to Alexi's file-based snapshot layout.

No lint / typecheck failures expected; changes preserve existing exports, add optional fields, and use existing helper functions (`logger`, `buildUserRejectedToolReason`, dynamic imports for reload refreshers).
