# Alexi Update Plan — Execution Summary

**Date**: 2026-09-17
**Plan basis**: Upstream analysis of kilocode `c23548f4f..8db973de9` (v7.7.3) and opencode `e03db9b..5a83358`.

## Executed changes

### ✅ Change #1 (high priority) — Session status ordering fix

**File modified**: `src/core/sessionBusy.ts`

Enhanced `SessionBusyTracker` with a publish-safe transition contract mirroring upstream kilocode `88d23150b` ("clear session status before publishing status events") and `e31aa5769` ("keep busy status writes after successful publication"):

- **`markBusy`** now publishes the busy event BEFORE persisting to the store. If the publisher throws synchronously, the busy entry is NOT recorded, and the caller sees the error (no phantom wedge). Async publisher failures trigger a best-effort rollback.
- **`markFree`** now clears the store entry BEFORE publishing the idle event. A publisher failure on the idle transition can no longer leave the session stuck in busy state — which was the root cause of the "stale session status blocks reload" bug.
- Added optional publisher hook via `setPublisher(publisher)` — fully backwards-compatible; existing callers that don't wire a publisher get identical Map-based behaviour.
- Added `resetSessionBusyTracker()` test helper.

**New test file**: `src/core/__tests__/sessionBusy.test.ts` (7 test cases, mirrors upstream `packages/opencode/test/kilocode/session-status.test.ts`):

- `markFree` clears state even when publisher throws (no stale busy wedge)
- `markBusy` rolls back on synchronous publisher failure so retries succeed
- Ordering assertions: publish-before-persist for busy, clear-before-publish for idle
- `SessionBusyError` still thrown when session is already busy (regression guard)
- `markFree` is a no-op when session is not busy
- End-to-end reload-after-markFree regression test

---

### ✅ Change #2 (high priority) — Preserve explicit model selection

**New file**: `src/core/modelPreference.ts`

Introduces `SessionModelPreference` with a `source` intent field (`"user-explicit" | "default" | "inherited"`) and a pure `resolveSessionModelPreference()` reconciler. Ports upstream kilocode `dd2f2f9a9` ("default model not persistent after explicit user choice") and `50f7d01ad` ("preserve effort intent and live session defaults"):

- User-explicit and inherited choices are never overwritten by `default` updates.
- Effort intent is the one field a non-explicit update may refresh (so `/effort high` keeps the current model).
- A missing effort on an incoming default update does not clobber the current effort.
- `migrateLegacyPreference()` helper defaults on-disk entries without a `source` field to `"user-explicit"` — the conservative choice, avoiding silent downgrades of users' saved model picks.
- Helper constructors `userExplicitPreference()` and `defaultPreference()` guide callers into setting the correct provenance.

**New test file**: `src/core/__tests__/modelPreference.test.ts` (9 test cases):

- Default applied to brand-new sessions
- User-explicit choice survives incoming default
- New user-explicit overwrites previous user-explicit
- Effort update merges without swapping model
- Effort intent preserved when incoming update omits it
- `"inherited"` source treated same as user-explicit for override protection
- Config-default fallback when neither current nor incoming supply a model
- Legacy migration → `"user-explicit"`; explicit `source` preserved

Note: this module is currently standalone. Existing session code (`src/core/sessionManager.ts`) does NOT yet call the reconciler. This mirrors the plan's intent — the module and its regression harness land first, and downstream integration into the routing pipeline is a follow-up that requires broader refactoring of how `Session.metadata.modelId` is written today (currently unconditional writes at multiple sites). Callers that adopt this reconciler get the fix; existing behaviour is unchanged.

---

### ✅ Change #3 (medium priority) — Discard empty draft caches after promotion

**New file**: `src/session/draft.ts`

Introduces `DraftCache` mirroring upstream kilocode `0d2fee251` ("discard empty draft caches after goal promotion"):

- `set(sessionID, draft)` evicts empty / whitespace-only drafts instead of persisting them.
- `promote(sessionID, draft)` returns the trimmed prompt and ALWAYS evicts the cache entry — even when the promote is a no-op (empty input). This is the exact upstream bug: a stale non-empty cache surviving an empty promotion.
- Pluggable `DraftCacheStore` interface so a future durable backend can be swapped in without changing callers.
- Global singleton via `getDraftCache()` with test-only `resetDraftCache()`.

**New test file**: `src/session/__tests__/draft.test.ts` (8 test cases):

- Basic set / get
- Empty draft evicted on set
- Whitespace-only draft evicted on set
- `promote` returns trimmed prompt and evicts cache
- `promote` of empty draft returns `undefined` AND evicts stale cache (upstream regression)
- `delete` is idempotent
- `clear` wipes every entry
- Singleton identity check

---

### ⏭️ Change #4 (low priority) — `@opencode-ai/core` bump: **N/A**

Verified `package.json`: Alexi does not declare `@opencode-ai/core` as a dependency (SAP AI Core integration goes through `@sap-ai-sdk/orchestration` and `@sap-ai-sdk/ai-api` directly, not through opencode's package). Alexi's upstream-ported code lives in-tree (`src/kilocode/**`, `src/session/**`, etc.), so no version bump is needed. Skipped as the plan itself notes: "If Alexi vendored the code, no action needed."

---

## Files modified / created

| Path | Kind | Change |
|---|---|---|
| `src/core/sessionBusy.ts` | modified | Publish-safe transitions, publisher hook, reset helper |
| `src/core/__tests__/sessionBusy.test.ts` | created | 7 regression tests |
| `src/core/modelPreference.ts` | created | New reconciler module |
| `src/core/__tests__/modelPreference.test.ts` | created | 9 regression tests |
| `src/session/draft.ts` | created | New DraftCache module |
| `src/session/__tests__/draft.test.ts` | created | 8 regression tests |
| `.github/reports/changes-summary.md` | created | This file |

---

## Explicitly skipped (per plan)

- KiloClaw removal (Alexi has no KiloClaw)
- VSCode extension / JetBrains changes
- Stats aggregation infra / Union Alpha stealth model
- Console migrated-workspace selector
- SDK regeneration (Alexi does not consume the opencode OpenAPI spec)
- i18n bundles, dev:stats script, review command aliases

---

## Issues / notes

1. **Session status publisher wiring is opt-in.** The `sessionBusy.ts` refactor is fully backwards-compatible: without a publisher installed via `setPublisher`, the tracker behaves exactly as before (plain in-memory Map). Downstream wiring — e.g. having `SessionManager` call `setPublisher(event => bus.publish(...))` — is intentionally left to a follow-up so this PR does not perturb the existing event flow. The regression tests use a synthetic publisher to prove the ordering contract holds.

2. **Model preference reconciler is not yet threaded into `sessionManager.ts`.** The plan calls out that existing code unconditionally overwrites `session.model = config.defaultModel`; migrating those sites is a wider refactor because Alexi's session shape (`SessionMetadata.modelId: string | undefined`) has no `source` field on disk yet. Adding a `modelPreference?: SessionModelPreference` field on `SessionMetadata` and a migration path can be done in a follow-up PR without touching this module — the pure reconciler and its migrator are already ready.

3. **No SAP AI Core provider surface was touched.** All changes are additive at the core / session-management layer; the provider layer (`src/providers/sapOrchestration.ts`, `src/providers/index.ts`) is unchanged. SAP AI Core compatibility is preserved.

4. **All new tests are colocated under `src/**/__tests__/`** which matches the vitest include glob `src/**/*.test.ts`.

5. **ESLint style respected**: `no-console` allowlist bypassed only via `// eslint-disable-next-line no-console` for the two best-effort warning paths in `sessionBusy.ts`; `curly: all`, `eqeqeq`, and single-quote conventions maintained; all local imports use `.js` extensions as required by NodeNext ESM.
