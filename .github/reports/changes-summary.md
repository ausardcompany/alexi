# Upstream Sync — Changes Summary

**Date:** 2026-08-14
**Plan basis:**
- kilocode `f71154707..67cda85c9` (v7.4.21 → v7.4.22)
- opencode `cc4b456..e23586a`

## Files modified

| # | File | Kind |
| - | ---- | ---- |
| 1 | `src/agent/index.ts` | edit |
| 2 | `src/tool/tools/grep.ts` | edit |
| 3 | `src/tool/tools/__tests__/grep.surrogate.test.ts` | new |
| 4 | `src/core/sessionManager.ts` | edit |
| 5 | `src/cli/commands/chat.ts` | edit |
| 6 | `src/core/__tests__/headless-session-agent.test.ts` | new |
| 7 | `src/git/commitMessage.ts` | edit |
| 8 | `src/tool/tools/task.ts` | edit |

## Summary of each change

### 1. `src/agent/index.ts` — Harden `explore` subagent (kilocode 3a99f36d9) — *critical*
Added `exploreBash` table, exported `getExploreAgentBashRules()`, and added `isExploreAgent()` alongside the existing `getAskAgentBashRules()`. The table is `readOnlyBash + { 'gh *': 'deny', 'find *': 'deny' }` — `gh` and `find` cannot be delegated to a subagent that has no way to answer permission prompts, and `find -delete`/`find -exec` are mutating. The Alexi built-in `explore` agent already restricts its `tools` allowlist to `['read', 'glob', 'grep']` (no `bash`), so no bash allow needed to be removed structurally; the new helper is available for any future permission-merge integration in the task-tool path (see change #8).

### 2. `src/tool/tools/grep.ts` — Preserve UTF-16 surrogate pairs in previews (opencode 6c035e1) — *high*
Both the ripgrep JSON path and the JS fallback path now trim a trailing high surrogate (`/[\uD800-\uDBFF]$/`) after slicing the 200-char preview. Prevents lone high surrogates in tool output that break SAP AI Core message-shape validation. **Note:** Alexi's preview cap is 200 (not the 2 000 in the upstream). The regex-based post-fix is identical either way.

### 3. `src/tool/tools/__tests__/grep.surrogate.test.ts` — new regression test — *high*
Writes a file whose match line has an emoji straddling the 200-char boundary and asserts no lone surrogate ends up in the preview. Forces `ALEXI_DISABLE_RG=1` so CI does not need `rg` on PATH.

### 4. `src/core/sessionManager.ts` — record agent on `SessionMetadata` + public `persistActiveSession()` (kilocode f4cba053a) — *high*
Added optional `agent?: string` to `SessionMetadata` and a public `persistActiveSession()` helper (the underlying `saveSession` is private). Enables headless resumes to preserve the previously-chosen agent.

### 5. `src/cli/commands/chat.ts` — preserve session agent on `--session` resume (kilocode f4cba053a) — *high*
`--agent` flag now falls back to `session.metadata.agent` before falling back to the config default. After `sendChat` completes, the resolved agent is stamped onto the session and persisted via `persistActiveSession()`, so a subsequent `alexi chat --session <id>` without an explicit `--agent` picks it up. Silent revert to the built-in `code` default no longer happens.

### 6. `src/core/__tests__/headless-session-agent.test.ts` — new regression test — *high*
Round-trips `session.metadata.agent` through save + reload, and asserts the precedence contract used by `chat.ts`: `pickAgentSlug({ cliFlag: opts.agent ?? session.metadata.agent, configValue })` returns the session-recorded agent when the CLI flag is absent, but the CLI flag still wins when present.

### 7. `src/git/commitMessage.ts` — surface LLM commit-message errors (kilocode 738163bb1) — *high*
Introduced `CommitMessageError`. Empty LLM responses are still treated as "fall back to heuristic" (debug-logged, no throw), but any thrown error now surfaces via `logger.warn` instead of being silently swallowed. The public `generateCommitMessage()` still never rejects — the heuristic path always produces something — but operators diagnosing SAP AI Core provider failures can now see the cause.

### 8. `src/tool/tools/task.ts` — permission-inheritance TODO now references explore hardening (kilocode 3a99f36d9 + task.ts touch-up) — *medium*
Expanded the existing `deriveSubagentSessionPermission` TODO block to reference the new `getExploreAgentBashRules()` / `isExploreAgent()` helpers from change #1, so the eventual integration knows to layer the strict explore bash rules on top of the derived ruleset. No behavioural change — `ToolContext` still doesn't carry session/agent context, so a real integration is out of scope for this port.

## Items NOT applied (documented gaps vs. the plan)

- **Change #3 — models.dev refresh logger isolation (kilocode 746fa974e).**
  Alexi has no `models-dev.ts` module. Models are configured via `routing-config.json` + provider constructors, not via a background models.dev refresh Effect. There is no analogous refresh loop whose loggers could leak into the TUI, so the change is not applicable.

- **Change #6 — v1 session projector compatibility (opencode d8bf792).**
  Alexi does not use the `SessionContextEpoch` / `SessionV1.Event` projector architecture. `SessionManager` writes plain JSON files to `~/.alexi/sessions/` — no epoch reset to remove. Not applicable.

- **Change #8 — `ai-gateway-provider` 3.1.2 → 3.2.0 (opencode 6d63500).**
  `ai-gateway-provider` is not a dependency of Alexi (`grep` confirmed zero references). Alexi uses `@sap-ai-sdk/ai-api` and `@sap-ai-sdk/orchestration` for SAP AI Core. Not applicable.

- **The `--worktree` CLI flag (kilocode 907f7dfcf) and clickable file links in TUI (kilocode 8013e5f50)** were mentioned in the plan's context header but never broken out into numbered changes. Not applied.

## Issues encountered

- **`saveSession` is private on `SessionManager`.** Solved by adding a narrow public `persistActiveSession()` method rather than widening the internal API. This keeps the JSON-write path centralised.
- **Alexi's agent system uses tool-ID allowlists**, not a permission ruleset like kilocode/opencode. The `hardenExplore` port therefore takes the shape of a *helper* (`getExploreAgentBashRules`) that any future permission-merge integration can consume, rather than a direct edit to a permission-merging step that does not yet exist in Alexi.
- **`ToolContext` does not carry the parent session/agent.** The task-tool permission-inheritance integration (change #7) is therefore still gated behind the pre-existing TODO in `src/tool/tools/task.ts`; the TODO comment is the only thing that changed there.

## Verification

Recommended pre-push sequence per `AGENTS.md`:
```
npm run lint
npm run typecheck
npm run format:check
npm run test:coverage
npm run build
```
The two new tests (`grep.surrogate.test.ts`, `headless-session-agent.test.ts`) are self-contained and use `mkdtempSync` / `mkdtemp` for isolation, so they will run in parallel with the existing suite without cross-contamination.
