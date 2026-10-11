# Upstream Sync Changes Summary — 2026-10-11

Generated: 2026-10-11
Based on update plan derived from opencode `055d95bb..d21b0790` (100 commits).

## Files Modified

### Created
- `src/session-ui/timeline-links.ts` — Deterministic file-link detection for timeline rendering.
- `src/permission/policy.ts` — Managed integration / tool / skill policy enforcement (`PolicyEnforcer`, `ManagedPolicySchema`).
- `src/providers/github-copilot.ts` — Copilot endpoint selector + stream parser helpers (ready for a future Copilot adapter; no live wiring).
- `src/providers/xai-image-filter.ts` — xAI mime-type allowlist (PNG / JPEG / WebP) with partitioning helper.

### Edited
- `src/core/agenticChat.ts` — `executeToolCall` now (a) returns a descriptive `Malformed tool arguments for <tool>` error on bad JSON, (b) runs `safeParse` on the tool schema BEFORE dispatch, (c) exports a new `settleUnfinishedCalls` helper to drain the pending-call map at turn boundaries.
- `src/tool/index.ts` — Added `DEFAULT_POLICY_ENFORCER` import and `setPolicy` / `getPolicy` on `ToolRegistry`; `get()` and `list()` now consult the policy; exported `setToolPolicy()` for operator / startup wiring.

## Changes by Priority

### Critical

**1. Rename `@opencode-ai/plugin` → `@opencode/plugin`** — _No-op in current Alexi._ A grep across `src/` found zero live imports of either package name, no `src/tool/github-pr-search.ts` or `src/tool/github-triage.ts` files, and no `@opencode-ai/plugin` entry in `package.json`. Historical references to `@opencode-ai/*` appear only in `CHANGELOG.md` and `docs/upstream-sync/2026-09-06.md` (where they were already documented as "never wired into any module"). Nothing to rename.

**2. Reject malformed tool arguments + settle unfinished calls** — Done in `src/core/agenticChat.ts`:
   - `JSON.parse` failure now produces a structured `Malformed tool arguments for <toolName>: <detail>` error that names the tool and includes the raw payload for debugging.
   - A new `safeParse` step runs the tool's Zod schema against the parsed args BEFORE `tool.execute()`. On schema violation we short-circuit with a tool-named error so the model can self-correct instead of hitting the generic `Invalid parameters` string buried inside `defineTool.executeUnsafe`.
   - Exported `settleUnfinishedCalls(pending, onProgress)` helper that drains a `Map<id, { toolName }>` of in-flight tool calls, emits `tool_end` events, and returns synthetic error results so transcripts stay well-formed when a turn ends mid-dispatch (prevents SAP AI Core from rejecting the next assistant message for orphaned `tool_calls` entries).

### High

**3. Deterministic timeline file-link detection** — New module `src/session-ui/timeline-links.ts` exporting `detectFileLinks(text, workspaceRoot)` and the `FileLink` interface. Anchored on leading whitespace / `(` / start-of-string, with special handling for Windows drive letters (`C:\...`) so the drive-letter colon is never mistaken for a `:line:col` suffix. Only paths confirmed via `fs.access` are returned.

**4. Managed integration + tool + skill policy enforcement** — New module `src/permission/policy.ts` exporting:
   - `ManagedPolicySchema` (Zod) + inferred `ManagedPolicy` type
   - `PolicyEnforcer` with `isToolAllowed`, `isIntegrationAllowed`, `isSkillAllowed`, `snapshot()`
   - `DEFAULT_POLICY_ENFORCER` singleton (open-world: everything allowed) so existing installations behave identically unless a policy is explicitly installed.
   - Wired into `src/tool/index.ts` `ToolRegistry`: `get()` returns `undefined` for denied tools (stricter than filtering `list()` — a cached tool name still cannot be invoked); `list()` filters by policy; `setToolPolicy()` is the entry point for enterprise SAP deployments to install their managed configuration at startup.

**5. Accept interleaved Copilot `reasoning_opaque` values** — Implemented in `src/providers/github-copilot.ts` via `parseCopilotResponseStream()`. Handles `response.reasoning_opaque.delta` identically to `response.reasoning.delta` but with `opaque: true` so downstream renderers know the content is encrypted blob data. Alexi has no live Copilot adapter today — these helpers are dependency-light and documented so a future adapter can import them directly without pulling the rest of the provider stack.

**6. Route Copilot Gemini fallback to chat-completions** — Implemented in `src/providers/github-copilot.ts` via `selectCopilotEndpoint(modelId)` and `resolveCopilotProviderPackage(modelId, snapshot)`. Gemini models get `chat`, GPT / Claude get `responses`, unknown families fall back to `chat` (the stricter subset) to avoid silent breakage when Copilot adds a new family before the models.dev snapshot catches up.

### Medium / Low

**7. Only send PNG / JPEG / WebP images to xAI** — Implemented in `src/providers/xai-image-filter.ts` via `isXaiAllowedImageMime(mime)` and `filterXaiImages(attachments)` → `{ kept, dropped }`. The dropped list is returned (not silently swallowed) so callers can log a warning. Alexi has no native xAI adapter yet; this helper is wired on-demand by proxy adapters that forward to xAI.

## Issues Encountered

- **Plan truncation**: The update plan was truncated mid-sentence at change #7 (xAI images), and changes #8 through #18 (the remaining medium / low items listed in the summary header) were never transmitted. Only changes #1 through #7 were executed as specified. The surrounding architectural notes about `packages/opencode/` restructuring, package renames, and plugin SDK migration were acknowledged but did not translate into additional file-level changes beyond what is listed here.
- **Non-applicable changes**: Changes #1 (`@opencode-ai/plugin`), #5 (Copilot streams), #6 (Copilot Gemini routing), and #7 (xAI image filter) target code paths that do not exist in Alexi today — Alexi's provider surface is SAP AI Core plus proxies, not a direct Copilot or xAI adapter. For these items I created dependency-light utility modules that encode the upstream semantics so a future adapter can import them, rather than inventing provider adapters not called for in the plan. This matches Alexi's existing pattern of "fork selected pieces, not mirror the full restructure" (per the plan's own preamble).
- **SAP AI Core compatibility**: All edits preserve existing SAP AI Core / SAP Orchestration flows. `ToolRegistry` policy defaults to the open-world enforcer so no existing deployment changes behaviour unless `setToolPolicy()` is called explicitly. The `agenticChat` error-handling changes only widen the error-string surface (nothing that was previously allowed is now rejected).
- No tests were added for the new modules in this execution per the plan's scope. Existing tests under `src/core/__tests__/agenticChat.test.ts` and `src/tool/registry.test.ts` continue to exercise the modified call sites.
