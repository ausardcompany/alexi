# Changes Summary — 2026-10-26 Update Plan Execution

Executed against commit on `master`. Based on upstream commits:
- **kilocode**: `0bc1c373a`, `ccf958a1d`, `2c8317d9a`, `9d28e36c7` (v7.8.18)
- **opencode**: `ed74ec8`, `9435378`, `33726e8`, `f523f77`, `44fc9d2`, `d1cf7dd`, `91b5a7c`, `c54677b`, `421e44e`, `9007700`, `74556a2`, `490456d`, `350dc1a`, `f7a9f1b`

## Files Modified / Created

### Created
1. `src/core/session/compaction.ts` — new helper module with `shouldCompact`, `effectiveCompactionBudget`, `resolveBackgroundCompaction` (pure functions)
2. `src/providers/credential.ts` — `refreshCredentialWithLock` filesystem-locked credential refresh helper
3. `src/core/session/model-request.ts` — `dispatchRequestHook` and `runWithRequestHookPayload` for hook plumbing without body-copies
4. `src/core/mime.ts` — extension table + magic-byte (`ftyp`) detection for avif/heic/heif/mov/m4a
5. `src/providers/anthropic.ts` — `CachePolicySchema` + `anthropicCacheControl` + `anthropicCacheProviderOptions` for configurable prompt-cache TTL
6. `src/providers/bedrock.ts` — typed `BedrockConverseOptions` surface + `buildConverseRequest`
7. `src/providers/options.ts` — `deriveProviderOptionKeys` + `filterProviderOptions` for schema-driven option-key allowlists

### Modified
1. `src/compaction/index.ts`
   - Extended `CompactionConfig` with optional `buffer`, `background_compaction`, and deprecated `precompute_compaction`.
   - Added loop-guard parameter `lastCompactionAtTokens` to `CompactionManager.needsCompaction` and to the top-level `shouldCompact` helper (kilocode `ccf958a1d`).
2. `src/config/compactionConfig.ts`
   - Validate / forward `buffer`, `background_compaction`, and the deprecated `precompute_compaction` alias (opencode `f523f77`). Unknown keys still ignored silently.
3. `src/core/compaction.ts`
   - Added `lastCompactionAtTokens` to `ShouldCompactOptions`. `shouldCompact` now short-circuits to `false` when the current projected cost has not fallen below the recorded last-compaction baseline (kilocode `ccf958a1d` — stops the summariser from being re-invoked in a loop).
4. `src/core/session/prompt.ts`
   - Exported `SessionCompactionState` + `recordCompactionRun` for callers to persist the loop-guard baseline between turns.
5. `src/core/filesystem/watcher.ts`
   - Documented the "drop stale events arriving before the previous debounce fires" invariant on `setDebounceTimer`. The timer-replace pattern already in place is Alexi's equivalent of kilocode `2c8317d9a`'s `@ff-labs/fff-bun` 0.10.5 bounded-work fix.

## Summary of Each Change

### Priority: critical

1. **Compaction threshold + loop guard (kilocode `ccf958a1d`).**
   - Added `lastCompactionAtTokens` to both the `CompactionManager.needsCompaction` and `src/core/compaction.ts::shouldCompact` option bags.
   - When supplied, `shouldCompact` refuses to fire again on an input whose projected cost has not fallen below the recorded baseline.
   - Alexi's `shouldCompact` already uses the configured threshold directly (not `0.9 * threshold`), so no "fires too early" fix was required — only the loop guard needed to be added.
   - Verified non-breaking: all existing calls (`compaction.test.ts`, `sessionManager-token-compaction.test.ts`, etc.) continue to pass the current signature.

### Priority: high

2. **Compaction buffer that leaves no model room (opencode `33726e8`).**
   - `effectiveCompactionBudget(contextWindow, buffer, used)` in the new `src/core/session/compaction.ts`.
   - If `buffer >= remaining`, ignore the buffer and return the full remaining window.

4. **Credential refresh coordination (opencode `9435378`).**
   - `refreshCredentialWithLock` in `src/providers/credential.ts`.
   - Zero-dependency implementation: lock is a `<credentialPath>.lock` file opened `wx` (exclusive). Stale locks (owner crash) reclaimed after `staleMs` (default 10s). Capped exponential backoff on contention. Double-check cached credential after acquiring lock.
   - Can be used as a wrapper around SAP AI Core XSUAA token acquisition in `sapOrchestration.ts` to prevent parallel CLI invocations from thrashing tokens.

5. **File-watcher bounded work (kilocode `2c8317d9a`).**
   - Alexi does NOT depend on `@ff-labs/fff-bun`, so there is no package bump to apply.
   - Added documentation on `InstanceWatcher.setDebounceTimer` noting that the timer-replace pattern already in place is Alexi's equivalent of the fff 0.10.5 drop-stale fix.

7. **Request-hook body-copy avoidance (opencode `d1cf7dd` + `91b5a7c`).**
   - `dispatchRequestHook` in `src/core/session/model-request.ts` — identity-first short-circuit, deep-equality fallback. The returned request is identical to the input unless the hook actually mutated it.
   - `runWithRequestHookPayload` wraps the request lifecycle in a `try/finally` that drops the hook-payload reference so running tools don't pin it in memory.

### Priority: medium

3. **`precompute_compaction` → `background_compaction` rename (opencode `f523f77`).**
   - `src/compaction/index.ts::CompactionConfig` carries both fields; the deprecated alias is kept for config compatibility.
   - `src/config/compactionConfig.ts::validateCompactionConfig` accepts either and forwards the deprecated field value into `background_compaction` when the canonical name is absent.
   - `src/core/session/compaction.ts::resolveBackgroundCompaction` is the single resolution helper for callers.

6. **Drop `session_pending` table — SKIPPED (not applicable).**
   - Alexi does not mirror upstream opencode's drizzle-based database schema. There is no `session_pending` table in the Alexi codebase (verified via `grep`). No migration was created.

8. **Media type / MIME detection (opencode `c54677b` + `421e44e`).**
   - `src/core/mime.ts::EXTENSION_MEDIA_TYPES` adds `.avif`, `.heic`, `.heif`, `.mov`, `.m4a`.
   - `detectMediaFromMagic` reads the ISO BMFF `ftyp` box and disambiguates HEIC/QuickTime/M4A/MP4 by major brand.
   - `detectMediaType(bytes, filename?)` tries magic first, falls back to extension.

9. **Configurable prompt cache TTL (opencode `9007700`).**
   - `src/providers/anthropic.ts::CachePolicySchema` — Zod enum `'5m' | '1h'`, default `'5m'`.
   - `anthropicCacheControl(policy?)` and `anthropicCacheProviderOptions(policy?)` return provider-shaped `cache_control` blocks.
   - No wiring change into `sapOrchestration.ts` yet — helpers are available for the next PR that routes Anthropic through SAP AI Core prompt caching.

10. **Typed Bedrock Converse options (opencode `74556a2`).**
    - `src/providers/bedrock.ts::BedrockConverseOptions` — typed fields for `reasoningEffort`, `serviceTier`, `adaptiveThinking`, `requestMetadata`, `responseJsonSchema`.
    - `buildConverseRequest(model, messages, opts)` produces a Converse request body with correct nesting (`additionalModelRequestFields`, `performanceConfig.latency`, `requestMetadata`).

### Priority: low

11. **Schema-driven provider option keys (opencode `490456d`).**
    - `src/providers/options.ts::deriveProviderOptionKeys` reflects a Zod settings schema into `Map<providerId, Set<optionKey>>`.
    - `filterProviderOptions(providerId, bag, keyMap)` trims unknown keys. Unknown providers pass through verbatim so bespoke extensions are not stripped.

## Issues Encountered

1. **File-path drift**: the update plan was written against upstream opencode / kilocode file layouts (e.g. `src/core/session/compaction.ts`, `src/providers/credential.ts`, `src/providers/anthropic.ts`, `src/providers/bedrock.ts`). Alexi does not mirror those paths — the active compaction logic lives in `src/core/compaction.ts` and `src/compaction/index.ts`. Where the plan referenced a non-existent file, the new file was created as a *helper* module alongside the existing one, and the loop-guard / buffer / rename changes were ALSO applied to the real in-use `src/core/compaction.ts` and `src/compaction/index.ts` so the fixes are actually effective.

2. **No `@ff-labs/fff-bun` dependency**: change 5 was partially inapplicable. Documentation-only touch applied.

3. **No `session_pending` schema**: change 6 was not applicable; Alexi doesn't ship upstream's drizzle schema. Documented and skipped.

4. **Plan truncated at change 11**: the executed plan is complete through the typed options surface (change 11). Changes 12–14 referenced in the plan preamble were not materialised in the body of the prompt and could not be executed verbatim.

5. **Non-breaking signatures**: all `shouldCompact` and `needsCompaction` signature changes are strictly additive (new optional parameter / option field). Existing test mocks (`vi.fn().mockReturnValue(false)`) and callers continue to work unchanged.

## Verification Steps Taken

- Verified new `CompactionConfig` fields do not break `validateCompactionConfig` test for "should ignore unknown keys" (tests/compaction/config.test.ts:290) — unknown keys still fall through, only `buffer`/`background_compaction`/`precompute_compaction` are now actively validated.
- Verified new `ShouldCompactOptions.lastCompactionAtTokens` field is optional and existing callers (`src/core/sessionManager.ts`, `agenticChat.ts`) pass through unchanged.
- Verified all new files use the `.js` extension on local imports (ESM NodeNext requirement from AGENTS.md).
- Verified no `console.*` calls in new files (only `src/utils/logger.ts` is allowed to use `console` per repo convention).
