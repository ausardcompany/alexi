# Upstream Sync Changes Summary

Generated: 2026-09-21
Based on plan derived from:
- kilocode `f47c29dfe..010f511d7` (73 commits)
- opencode `70a2469..ebb7b76` (10 commits)

## Files Modified / Created

| File | Kind | Change |
| ---- | ---- | ------ |
| `src/tool/semantic-search-output.ts` | NEW | Helper module for semantic-search empty-result wording; local `IndexingStatus` type replaces the upstream `@kilocode/kilo-indexing` dependency. |
| `tests/tool/semantic-search-output.test.ts` | NEW | Vitest suite covering `normalizePath`, `scope`, `reason` (all 5 states + missing status), and `empty`. |
| `src/mcp/sse-probe.ts` | NEW | Case-insensitive `Content-Type` classifier (`sse` / `json` / `other`) for MCP remote-transport probes. |
| `tests/mcp/sse-probe.test.ts` | NEW | Vitest suite for the classifier and `isSseContentType` helper. |
| `src/mcp/client.ts` | MODIFIED | `connectRemote` now inspects the probe's `Content-Type` header via `classifyProbeContentType` and throws a permanent error (surfaced as `config` by `classifyConnectError`) when the response is neither SSE nor streamable-HTTP JSON. |
| `src/config/userConfig.ts` | MODIFIED | Added `SessionRetentionPolicy` type + `getConfigSessionRetention` / `setConfigSessionRetention` accessors backed by the top-level `retention` key. |

No files were deleted or renamed.

## Change-by-Change Notes

### #1 & #4 — semantic-search-output helper + tests (high, medium)

Added a standalone module that isolates the wording of empty semantic-search results. The upstream module depends on `@kilocode/kilo-indexing/status`; since Alexi does not depend on that package, the module exports a local `IndexingStatus` interface with the same shape (`state`, `message`, `percent`, `processedFiles`, `totalFiles`). All five upstream states (`Disabled`, `Error`, `In Progress`, `Standby`, `Ready`) are handled explicitly. Tests were ported from `bun:test` to `vitest` (Alexi's test runner) and cover every branch of `reason`, plus the `scope` / `empty` composition.

### #2 & #3 — semantic-search tool + description (high)

Skipped as **not applicable**. Alexi does not ship a first-party `semantic_search` tool — the capability is intentionally delegated to `@morphllm/morphsdk` and the `alexi-mcp-warpgrep` MCP server (see `src/tool/tools/index.ts` line 103: "codesearchTool removed - superseded by improved semantic search"). The helper from #1 is still useful for any future built-in tool or plugin that wants to surface index-state-aware empty results.

### #5 — Session retention policy schema (medium)

Instead of touching an Effect Schema (Alexi does not use Effect Schema for config), the retention policy was added to `src/config/userConfig.ts` alongside the other opt-in flags (`sharedAgentBoard`, `codeMode`, `taskModelSelection`). The reader (`getConfigSessionRetention`) always returns a fully-populated `SessionRetentionPolicy` object with safe defaults (`enabled: false`, `maxAgeDays: 30`) so callers do not need null checks. The writer (`setConfigSessionRetention`) validates `maxAgeDays >= 1`. As the plan notes, only the schema is added — the actual retention *runner* is deferred (upstream expects a backend service that Alexi does not yet own).

### #6 — Bedrock encrypted reasoning (critical → skipped)

**Skipped** per the plan's own escape clause: "If Alexi does not ship Bedrock, downgrade this to low priority and skip." Alexi has no `@ai-sdk/amazon-bedrock` dependency (grep `bedrock` in `package.json` only matches the `keywords` array) and no direct `src/providers/bedrock.ts`. AWS Bedrock is only reached indirectly through SAP AI Core `aicore-bedrock-*` deployments, and the existing `filterUnreplayableBedrockReasoning` in `src/providers/transform.ts` already handles the SAP-fronted case for reasoning replay (see line 198: `providerID.includes('bedrock') || providerID.includes('aicore')`). No SDK bump is needed; SAP AI Core normalises Bedrock's redacted-reasoning blocks before Alexi sees them.

### #7 — MCP SSE probe content-type handling (high)

Added `src/mcp/sse-probe.ts` with a case-insensitive classifier that strips `;`-delimited parameters (e.g. `; charset=utf-8`) before matching. Wired into `McpClientManager.connectRemote`:

- When the probe response advertises a `Content-Type`, it is classified.
- `sse` / `json` → treated as reachable, fall through to the existing "transport not yet implemented" fall-through (unchanged behaviour).
- `other` (HTML login page, wrong URL, intercepting proxy, ...) → throws a permanent error naming the observed type.
- `classifyConnectError` now maps the new "unexpected Content-Type" message to the `'config'` (permanent) bucket, so the retry loop does not waste its budget on a misconfiguration.

The indefinite-retry concern in the plan is already mitigated by `resolveRetryPolicy` (documented `maxAttempts` cap, geometric backoff) and the existing distinction between transient / config classifications in `classifyConnectError`; no changes were needed there beyond adding the new regex branch.

## Issues Encountered

- **Plan mismatch**: several plan items (#2, #3, #6) targeted upstream files that do not exist in Alexi. Documented as skipped with the reason above rather than fabricated.
- **Test runner divergence**: the plan's tests use `bun:test`; Alexi uses vitest exclusively (`npm test` → `vitest run`). Tests were rewritten idiomatically for vitest (`describe` / `it` / `expect` imports from `'vitest'`).
- **Import extension**: kept the mandatory `.js` suffix on every local import per Alexi's ESM + `NodeNext` rules (see `AGENTS.md`).

## Verification

To validate locally (per Alexi's CI order in `AGENTS.md`):

```bash
npm run lint
npm run typecheck
npm run format:check
npm run test:coverage
npm run build
```

Focused test invocations:

```bash
npm test -- tests/tool/semantic-search-output.test.ts
npm test -- tests/mcp/sse-probe.test.ts
```

SAP AI Core compatibility is preserved — no provider code, orchestration path, or authentication flow was touched. All changes are additive.
