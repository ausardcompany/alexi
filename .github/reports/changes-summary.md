# Update Plan Execution Summary

**Date:** 2026-08-18
**Source plan:** Upstream analysis of kilocode `4239f9d98..91a337e31` + opencode `4d68d30..4e81a0b`

## Files Modified

| File | Change |
| --- | --- |
| `src/config/userConfig.ts` | Added `McpToolDisplay` type + `getConfigMcpToolDisplay()` / `setConfigMcpToolDisplay()` accessors (plan item 1). |
| `src/cli/tui/hooks/useToolEvents.ts` | Threaded `mcpToolDisplay` preference into the completed-tool-call state so MCP tools respect the user's collapse/expand default (plan item 1 — UI wiring). |
| `tests/config/userConfig.test.ts` | Added a `describe('getConfigMcpToolDisplay / setConfigMcpToolDisplay')` block covering default, round-trip, upstream snake_case compatibility, camelCase priority, corrupt-value fallback, and setter validation. |

No changes to `package.json`, no new `.changeset/` files, no new provider files.

## Per-item Execution

### Item 1 — Add `mcp_tool_display` field (medium, feature) — **DONE**

Alexi has no Effect-schema `Info` config type (that construct is a kilocode/opencode
webview surface). The equivalent surface in Alexi is the plain-JSON
`~/.alexi/config.json` file wrapped by `src/config/userConfig.ts`. I mirrored
the upstream option there:

- **Reader** accepts both `mcpToolDisplay` (camelCase, matches the rest of
  Alexi's config keys — `defaultModel`, `persistAuthTokens`, ...) and
  `mcp_tool_display` (snake_case, matches upstream serialized configs), so a
  config file authored against upstream still round-trips through Alexi.
  Unknown values fall back to `'collapsed'` (upstream default and Alexi's
  historical behaviour in `useToolEvents.ts`).
- **Writer** validates the value and always persists under the canonical
  camelCase key.
- **UI wiring** in `useToolEvents.ts`: MCP-namespaced tools
  (`mcp__server__tool`, matching `src/permission/index.ts` conventions)
  now respect the preference when the tool completes. Non-MCP tools keep
  their historical behaviour (collapse on completion) — this is a
  strictly additive, MCP-scoped change. The preference is captured once at
  `ToolExecutionStarted` time into a per-effect `Map<toolId, boolean>`,
  drained on completion/failure, and cleared on effect teardown, so the
  hot completion path stays free of disk I/O.

### Item 2 — OpenCode default console/server URL (high, bugfix) — **SKIPPED (guarded)**

The plan itself allows skipping when Alexi does not use the public
`opencode.ai` console fallback. Verified:

- `grep 'console.opencode|opencode.ai/console'` → no matches.
- Alexi's provider surface is `src/providers/*.ts` and targets SAP AI
  Core exclusively (`@sap-ai-sdk/orchestration`, `sapOrchestration.ts`,
  `deepseek.ts`, `connectorStore.ts`, ...). There is no `opencode.ts`
  provider.

Nothing to change.

### Item 3 — Bump `@ai-sdk/google-vertex` (medium, dependency) — **SKIPPED**

Alexi does not depend on `@ai-sdk/google-vertex`. Confirmed via
`package.json` (only `@sap-ai-sdk/*` and standard Node deps present, no
Vercel AI SDK vendor entries). No `nix/hashes.json` in the repo either.

Nothing to change.

### Item 4 — Codex data residency + oversized WS fallback (high, bugfix) — **SKIPPED**

Alexi does not vendor the OpenAI Codex plugin: no `src/providers/codex.ts`,
no `ws-pool.ts`, no `ws.ts`. All provider traffic goes through
`@sap-ai-sdk/orchestration` over HTTP (see `src/providers/sapOrchestration.ts`
and `src/providers/index.ts`). No WebSocket transport exists to add an
oversized-request fallback to, and no regional Codex endpoints to gate.

Nothing to change.

### Item 5 — Queued messages + reasoning variants (medium, bugfix) — **SKIPPED (guarded)**

The plan explicitly authorises skipping this item ("Skip this item entirely if
Alexi does not maintain reasoning variant caches or a visible queue state on
the core side"). Verified:

- `src/core/session/*` contains `retry.ts` and `store.ts` — no
  `session-queue.ts` and no `session-variants.ts`.
- `src/core/sessionManager.ts`, `sessionContext.ts`, and `sessionClose.ts`
  do not expose a visible-queue state or a reasoning-variant cache.
- Alexi's reasoning support is provider-side (`src/providers/reasoning.ts`,
  `adaptiveThinking.ts`); it is not cached across default changes.

Nothing to change.

### Item 6 — `.changeset/*.md` discipline (low, process) — **SKIPPED**

Alexi does not use changesets: no `.changeset/` directory, no
`@changesets/cli` dev-dependency, and release notes come from
`CHANGELOG.md` + conventional-commits (per `commitlint.config.cjs`).
Adding a `.changeset/` folder here would create dead process
infrastructure. This mirroring is explicitly optional in the plan.

Nothing to change.

## Issues Encountered

- **None functional.** The mapping between kilocode's Effect-schema `Info`
  and Alexi's plain-JSON config was the only non-trivial translation; the
  chosen strategy (typed accessor in `userConfig.ts` + snake_case
  compatibility alias) keeps upstream serialized configs importable.
- **No SAP AI Core integration was touched.** All ports were confined to
  `userConfig.ts` (side-effect-free) and `useToolEvents.ts` (TUI-only,
  presentation layer).

## Verification steps to run locally

```bash
npm run lint
npm run typecheck
npm test -- tests/config/userConfig.test.ts
npm test -- tests/cli/tui/useToolEvents.test.tsx
npm run format:check
```
