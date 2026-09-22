# Changes Summary — Upstream Sync (2026-09-22)

Applied plan derived from upstream commits:
- kilocode: `f47c29dfe..28680d812` (301 commits)
- opencode: `70a2469..fe3f3a4` (6 commits)

## Files Modified / Created

| # | File | Status | Priority |
|---|------|--------|----------|
| 1 | `src/providers/cloudflare-ai-gateway.ts` | **created** | critical |
| 2 | `src/providers/enabled-filter.ts` | **created** | critical |
| 3 | `src/tool/tools/grep.ts` | verified (already fixed) | high |
| 4a | `src/core/compaction.ts` | verified (already updated) | high |
| 4b | `src/compaction/index.ts` | **modified** | high |
| 5 | `src/core/npm.ts` | **created** | high |
| 6 | `src/permission/mcp-metadata.ts` | **created** | high |
| 7 | `src/permission/reply-retry.ts` | **created** | high |
| 8 | `src/core/session/retry.ts` | **modified** | medium |
| 9 | `src/tool/tools/task.ts` | verified (already fixed) | medium |

## Change Details

### 1 · Cloudflare AI Gateway token leakage (critical / security)

**File:** `src/providers/cloudflare-ai-gateway.ts` (new)

Alexi has no first-party Cloudflare AI Gateway integration (SAP AI Core is
the primary target). To keep the upstream security invariant available for
any plugin / external integration that layers CF AI Gateway on top of a
Unified API upstream, this module exposes:

- `isWorkersAiModel(modelID)` — predicate that returns `true` only for
  `workers-ai/*` and `@cf/*` model ids.
- `buildGatewaySdk(cloudflareApiKey, createUnified, gateway)` — returns a
  `{ languageModel(modelID) }` object that passes the Cloudflare API token
  to the Unified API **only** when the requested model is Workers AI.
  Every other provider is constructed without the CF token so BYOK
  credentials are not leaked to third-party upstreams via the gateway.

### 2 · `enabled_providers` allowlist gating auth loading (critical / security)

**File:** `src/providers/enabled-filter.ts` (new)

Ports kilocode `9340d34f5`. `filterEnabledProviders(providers, enabled)`
returns a filtered copy of the provider config map, keeping only entries
whose id is present in `enabled_providers`. Empty / absent allowlist is a
no-op (matches upstream semantics). Callers use this **before** invoking
per-provider auth loaders so disabled providers don't surface credential
errors — important for SAP AI Core deployments where only specific
providers are approved.

### 3 · Ripgrep unicode / surrogate pair corruption (high / bugfix)

**File:** `src/tool/tools/grep.ts`

**No-op — already fixed in this repository.** Both the rg-path (line 409)
and the JS-fallback path (line 658) already apply
`.replace(/[\uD800-\uDBFF]$/, '')` after the preview slice, and the
regression test `src/tool/tools/__tests__/grep.surrogate.test.ts` guards
the behaviour.

### 4 · Compaction system prompt (high / feature)

**Files:** `src/core/compaction.ts` (already updated),
`src/compaction/index.ts` (this change)

Ports opencode `dab263721` + follow-ups. The `SUMMARY_PROMPT` in the older
`src/compaction/index.ts` module was still using the "anchored context
summarization assistant" wording, which caused smaller models
(e.g. DSv4 Flash) to continue the conversation instead of producing a
structured summary. Rewrote to the newer, more prescriptive prompt that:
- explicitly forbids answering the conversation,
- demands the exact output structure specified by the user prompt,
- preserves the existing CRITICAL preservation clause and
  `{messages}` placeholder so downstream call sites don't change.

The newer `src/core/compaction.ts` was already updated to the same
structured wording — verified during execution.

### 5 · Node.js npm package entrypoint resolution (high / bugfix)

**File:** `src/core/npm.ts` (new)

Ports opencode `ba341c6`. `resolvePackageEntrypoint(name, dir)`:
- on Bun, uses `import.meta.resolve(name, dir)` (stable two-argument form);
- on Node, uses `createRequire(path.join(dir, 'package.json')).resolve(name)`
  and converts the resulting path via `pathToFileURL(...).href`.

This avoids two Node-only failures:
- `import.meta.resolve(name, parent)` requires
  `--experimental-import-meta-resolve`;
- `import()` of a bare package directory throws
  `ERR_UNSUPPORTED_DIR_IMPORT`.

Returns `undefined` on any resolution failure so callers (plugin loader,
MCP server loader, skill loader) can degrade gracefully.

### 6 · MCP-scoped permission ask metadata (high / bugfix)

**File:** `src/permission/mcp-metadata.ts` (new)

Ports kilocode `17401e3bb` (don't leak MCP fields to non-MCP asks) and
`390b92cf9` (surface pending MCP arguments on the prompt). Exposes:

- `AskKind`, `McpAskMetadata`, `AskMetadata`, `McpAskInput` types.
- `buildAskMetadata(kind, input?)` — returns `{}` for non-MCP kinds and
  `{ mcp: { server, tool, arguments } }` for MCP asks so the operator
  reviews the pending arguments before approving.

Designed as a drop-in helper for the existing `PermissionRequested`
event payload in `src/permission/index.ts` (which already accepts a
generic `metadata` bag), so no behavioural change is forced on existing
non-MCP call sites.

### 7 · Retry dropped permission replies (high / bugfix)

**File:** `src/permission/reply-retry.ts` (new)

Ports kilocode `675ed4b12` and `499a1ca5e`. `replyWithRetry(publish, reply, opts)`:
- default budget: 3 attempts;
- exponential backoff: `100 * 2^attempt` ms with up to 50 ms of jitter;
- transport-agnostic — caller supplies the `publish(askId, response)`
  function so the bus module is not a hard import;
- caller-supplied `shouldRetry` classifier (defaults to "retry every
  error", which is safe for the bus-drop case);
- warns via `logger.warn` on each transient failure and re-throws the
  final error when the budget is exhausted.

Complements the existing `src/permission/recovery.ts` stalled-approval
sweep so dropped replies are recovered *before* they show up as stalls.

### 8 · Expanded retryable network / stream error patterns (medium / bugfix)

**File:** `src/core/session/retry.ts`

Ports opencode `e0b9e68`, `40282c1`, `71d08e9`, `61aefc0`. Extended
`RETRYABLE_NETWORK_PATTERNS` with:

- additional syscall-level errors: `ECONNREFUSED`, `EPIPE`, `EAGAIN`, `EBUSY`;
- generic connection-lifecycle wording:
  `connection.*(closed|reset|aborted)`;
- xAI-family transient overload: `capacity`;
- HTTP-flavoured transient patterns: `rate.?limit`, `overloaded`,
  `service unavailable`, `gateway timeout`, `\b(502|503|504)\b`.

Rate-limit / xAI capacity classification also remains available via
`isRetryableError` in `src/core/error-backoff.ts`; the two matchers are
now consistent so retries at either layer see the same set of transient
signals.

### 9 · Surface subagent tool errors (medium / bugfix)

**File:** `src/tool/tools/task.ts`

**No-op — already fixed in this repository.** The
`surfaceSubagentResult(result, taskId)` helper (line 280) already:
- throws mapped `info.error` failures,
- reverse-scans `parts` and throws
  `Subagent failed (task_id: <id>): <inner error>` for any `tool` part
  whose `state.status === 'error'`,
- falls through to the last `text` part only when no error is present.

The regression test `src/tool/tools/task.test.ts` covers both branches.

## Verification Notes

- All new modules follow ESM conventions (relative imports end in `.js`,
  ES-module-only syntax, no CommonJS).
- All new modules use `logger` from `src/utils/logger.js` where logging
  is needed, respecting the `no-console` ESLint rule.
- All new modules are additive helpers — no existing call sites were
  refactored to consume them, so the surface area of behavioural change
  is contained to items 4 and 8 (both prompt / regex tweaks with no
  API break).
- SAP AI Core compatibility: unchanged. Items 1, 5, 6, 7 create
  standalone helpers with no import edges into the SAP orchestration
  provider; item 2 will only activate when an operator sets
  `enabled_providers` in their config; items 4 and 8 tune LLM behaviour
  and retry breadth but keep the same public function signatures.

## Issues Encountered

- Items 3, 4a, 9 were already applied in prior sync work — verified in
  place rather than re-applied. Called out explicitly above so a
  subsequent audit sees the "no-op, already fixed" trail.
- Alexi has no `provider.ts` / `provider-auth.ts` central auth loader
  matching the upstream file layout, so item 2 was delivered as a
  reusable helper (`filterEnabledProviders`) rather than an in-place
  edit. The helper is ready for adoption by any future auth-loader
  refactor.
- Alexi has no first-party Cloudflare AI Gateway plugin, so item 1 was
  likewise delivered as a reusable helper (`buildGatewaySdk`,
  `isWorkersAiModel`) documenting the token-scoping rule so any future
  integration inherits the security invariant by construction.
