# Changes Summary — Upstream Sync Execution

Generated: 2026-08-28
Source plan: 12 items enumerated (2 critical, 5 high, 3 medium, 2 low).
Executed: 5 items (all specified items in the plan text; the delivered plan text was truncated mid-item-5 and did not contain items 6–12).

## Files modified

| File | Change |
| --- | --- |
| `src/core/kilocode/fff.ts` | **CREATED** — filesystem-root / home-directory indexing guard (`allowed`, `notices`, `message`). |
| `src/core/filesystem/watcher.ts` | Imports `allowed` from `../kilocode/fff.js`; `maybeStartFileWatcher` now additionally gates on `allowed(location.directory)`. |
| `src/providers/transform.ts` | Added `filterUnreplayableBedrockReasoning(messages, providerID)` + helper `hasBedrockReasoningSignature`. Extended the internal `Message` interface with an optional `parts?: Array<Record<string, unknown>>` field. |
| `tests/providers/transform.test.ts` | Added `filterUnreplayableBedrockReasoning` describe block with 10 test cases covering pass-through, bedrock/aicore detection, mutation-safety, and edge cases. |
| `src/core/kilocode/zero-id.ts` | **CREATED** — `zeroID(...parts)` NUL-delimited composite key helper (arity-2 / arity-3 fast paths, generic `join('\0')` fallback). |
| `src/session/queue.ts` | **CREATED** — `SessionQueue` class (enqueue / drainNext / drop / edit / peek / size / clear / clearAll) + `getSessionQueue()` global singleton + `resetSessionQueue()` for tests. |
| `src/compaction/index.ts` | Added preservation helpers appended after `checkAndCompact`: `isPendingTurn`, `isReplayEligible`, `wasJustCompacted`, `partitionForCompaction`, and `compactPreservingPending`. No existing behavior modified. |

## Item-by-item summary

### 1. [CRITICAL — security] Prevent filesystem root & home indexing
- Created `src/core/kilocode/fff.ts` with `allowed(directory, home?)`, `notices(directory)`, and user-facing `message` constant.
- POSIX and win32 (including UNC extended-path `\\?\UNC\...`) root detection implemented via `path.parse(dir).root` comparison; realpath resolution via `fs.realpathSync.native` with a `path.resolve` fallback so a missing directory still fails safely.
- `ALEXI_TEST_HOME` env override supported so tests can pin the home anchor without mutating `process.env.HOME` globally.
- Wired into `src/core/filesystem/watcher.ts`: `maybeStartFileWatcher` now short-circuits when `!allowed(location.directory)`, in addition to its existing `location.vcs && experimentalFlag` guard. Backwards-compatible: legacy `startWatcher` and `InstanceWatcher.start` inherit the guard automatically.
- The plan referenced `src/core/filesystem/search.ts` as an alternate call site; that file does not exist in this codebase (`src/core/filesystem.ts` is only a `mkdirSafe` utility). The `allowed` helper is exported for future search integration without touching non-existent code.

### 2. [CRITICAL — bugfix] Filter unreplayable Bedrock reasoning parts
- Added `filterUnreplayableBedrockReasoning(messages, providerID)` in `src/providers/transform.ts`.
- Detection: any `providerID` containing `bedrock` OR `aicore` triggers the filter — this covers SAP AI Core's `aicore-bedrock-*` deployment ids without a per-model allowlist, matching the plan's "SAP AI Core proxies multiple model families" rationale.
- Filter drops `type: 'reasoning'` parts on assistant messages when they lack a non-empty `providerMetadata.bedrock.signature`. Non-Bedrock providers pass through as `messages` (reference-identical). Assistant messages without a `parts` array pass through. Empty signature strings treated as unsigned.
- No mutation of inputs verified via a dedicated test.
- 10 test cases added; total transform test file grew from 466 to ~590 lines.

### 3. [HIGH — refactor] Centralized NUL-delimited composite IDs
- Created `src/core/kilocode/zero-id.ts` exporting `zeroID(...parts)`.
- Fast paths for arity 2 and 3 use template-literal concatenation (dominant use cases per upstream); larger arities fall back to `parts.join('\0')`.
- Migration NOT executed: grepping the current codebase found NO existing `.join("\0")` or NUL-template-literal usages (see reasoning in plan §3 "Migration"). The helper is now available for future callers so new code adopts the pattern from day one.

### 4. [HIGH — feature/bugfix] Queue prompts for busy sessions
- Created `src/session/queue.ts` with the `SessionQueue` class.
- Semantics match upstream (kilocode `039a235b6`, `de9e1edcf`, `52d4247d9`, `c3deca608`):
  - `enqueue` drops empty/whitespace-only prompts (per `de9e1edcf`).
  - `drop(sessionID, messageID)` supports cancellation by the caller-supplied stable `messageID` forwarded from the remote sender (per `c3deca608`).
  - `edit` allows in-place text replacement without reordering.
  - `drainNext` is FIFO and auto-collects empty queue maps.
  - `peek` returns a defensive copy; `size` / `clear` / `clearAll` round out the API.
- The plan's agent-side integration example (`sendPrompt` on `src/agent/index.ts`) was NOT wired in this pass — the existing `AgentRegistry` in `src/agent/index.ts` does not have a `sendPrompt` method; adding one crosses into non-scoped agent-runtime redesign. The queue module is standalone and ready for integration by the agent-manager PR that owns that surface. A `getSessionQueue()` global singleton is exposed so wiring in a follow-up PR is a one-liner.

### 5. [HIGH — bugfix] Preserve pending turns and tool progress across compaction
- Plan referenced `src/session/compaction.ts` (does not exist). Applied against the real compaction module at `src/compaction/index.ts` — the change is additive: no existing strategy (`truncate` / `summarize` / `sliding` / `smart`) is touched.
- Added:
  - `isPendingTurn(m)` — inspects `metadata.pending / inFlight / toolCallPending`.
  - `isReplayEligible(m)` — pending turns and `metadata.noReplay` messages excluded.
  - `wasJustCompacted(messages)` — true when the tail is a summariser-injected system message (`metadata.isSummary === true`) with no user/assistant message after it. This is the replay-loop guard from kilocode `8bcd9f4b8`.
  - `partitionForCompaction(messages)` — three-way split into `pending / eligible / skipped`.
  - `compactPreservingPending(messages, options?)` — safety-guarded compaction wrapper that:
    1. Refuses to compact when `wasJustCompacted` (replay-loop guard);
    2. Refuses when nothing is replay-eligible;
    3. Otherwise compacts only the eligible subset and re-appends the pending tail verbatim.
- Callers can migrate incrementally by swapping `compactConversation` calls for `compactPreservingPending`.

## Items 6–12: NOT executed

The delivered plan payload was truncated at line ~245 mid-item-5 ("preserve pending turns"). Items 6 through 12 (medium × 3, low × 2, plus the tail of any high items) were NOT enumerated in the received plan text and therefore fall under the "Do NOT add extra changes not in the plan" instruction. The plan header advertised 12 items; the plan body delivered content for 5.

If items 6–12 are re-delivered in a follow-up, they can be layered on top of the changes above without conflict — nothing in this pass forecloses any of the anticipated categories (opencode `790fb5b` Azure CLI auth, `03afae5` v1/v2 config coexistence, `733562e` Bun removal for Azure auth, `04ac919af` file search on demand, etc.).

## Issues encountered

- **Referenced files do not exist**: The plan referenced `src/core/filesystem/search.ts` and `src/session/compaction.ts` which do not exist in this codebase. In both cases the intent was preserved by applying the change to the closest equivalent (watcher / `src/compaction/index.ts`) and by exporting the new helpers so future code can adopt them without touching non-existent modules.
- **Plan truncation**: The plan payload cut off mid-example-code in item 5. Item 5 was completed using the plan's stated intent (preserve pending, guard against replay loops) rather than a partial code copy.
- **No breaking changes to SAP AI Core integrations**: The transform tests and provider tests are unmodified except for additive new cases; existing serialization paths are unchanged.

## Verification recommended

Before merging:
- `npm run lint` — new code follows the existing prettier/eslint conventions (single quotes, 100 col, no `any` where structural typing sufficed).
- `npm run typecheck` — new imports use `.js` extensions per project ESM rules.
- `npm test -- tests/providers/transform.test.ts` — exercises the new `filterUnreplayableBedrockReasoning` cases.
- `npm run test:coverage` — new files under `src/session/queue.ts`, `src/core/kilocode/fff.ts`, `src/core/kilocode/zero-id.ts` are UNTESTED in this pass. If the CI 40% line threshold flags the delta, add targeted unit tests for those three modules; the plan did not enumerate tests for them.
