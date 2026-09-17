# Update Plan for Alexi

Generated: 2026-09-17
Based on upstream commits analyzed:
- kilocode: c23548f4f..8db973de9 (v7.7.3 release, KiloClaw removal, model preference fixes, session status fixes)
- opencode: e03db9b..5a83358 (stats normalization, Union Alpha stealth model)

## Summary

The vast majority of upstream changes are **not applicable to Alexi**:
- KiloClaw removal (Alexi doesn't have KiloClaw)
- VSCode extension changes (Alexi is not a VSCode extension)
- Stats/console/docs/i18n updates (Alexi doesn't ship these)
- JetBrains changes (not applicable)
- Union Alpha stealth model (specific to opencode.ai's stats infra)

However, there are a **handful of relevant fixes** that map to Alexi's architecture:

- Total changes planned: 4
- Critical: 0 | High: 2 | Medium: 1 | Low: 1

## Changes

### 1. Fix session status ordering — clear before publishing, keep busy writes after publication

**File**: `src/session/status.ts` (or Alexi's equivalent session status manager)
**Priority**: high
**Type**: bugfix
**Reason**: Upstream commits `88d23150b` (clear session status before publishing status events) and `e31aa5769` (keep busy status writes after successful publication) fix a stale-session bug where sessions get stuck in a busy state after crashes/reloads. This is the root fix for "stale session status blocks reload". The bug pattern: if publication of the "idle" event fails, the in-memory busy state is never cleared, blocking future reloads. Conversely, on success the busy writes must be flushed so downstream subscribers see the transition.

**Current pattern to look for** (upstream previous behavior):
```typescript
// BEFORE (buggy)
export async function setStatus(sessionID: string, status: SessionStatus) {
  await store.set(sessionID, status)   // write first
  await Bus.publish(Event.StatusChanged, { sessionID, status })
  // if publish throws, store retains stale busy state
}
```

**New pattern** (upstream fix):
```typescript
// AFTER
export async function setStatus(sessionID: string, status: SessionStatus) {
  // Clear/normalize state prior to publishing terminal states
  if (status === "idle" || status === "error") {
    await store.clear(sessionID)
  }

  try {
    await Bus.publish(Event.StatusChanged, { sessionID, status })
  } catch (err) {
    // On publish failure for busy transitions, revert so we don't wedge
    if (status === "busy") await store.clear(sessionID)
    throw err
  }

  // Only persist busy writes AFTER successful publication
  if (status === "busy") {
    await store.set(sessionID, status)
  }
}
```

**Action**: locate Alexi's session status/state manager under `src/session/`, `src/core/session/`, or `src/bus/` and audit the ordering of state writes vs event publication. Mirror the semantics: clear-before-publish for terminal states, write-after-publish for busy state, with rollback on publish failure. Add a regression test analogous to upstream `packages/opencode/test/kilocode/session-status.test.ts` (79 new lines).

---

### 2. Preserve explicit model selection across sessions (persistence bug)

**File**: `src/core/session/model-preferences.ts` (or wherever Alexi tracks per-session model choice)
**Priority**: high
**Type**: bugfix
**Reason**: Upstream commit `dd2f2f9a9` ("default model not persistent after explicit user choice") plus `50f7d01ad` ("preserve effort intent and live session defaults") fix a class of bugs where a user's explicit model/effort selection was overwritten by defaults on subsequent turns. This affects any Alexi codepath that reconciles user-selected model with configured defaults. Since Alexi routes to SAP AI Core models, this is especially important — user overrides must not silently regress to the SAP-configured default.

**New behavior to implement**:
```typescript
// src/core/session/model-preferences.ts

export interface SessionModelPreference {
  modelID: string
  providerID: string
  reasoningEffort?: "low" | "medium" | "high"
  // Track intent so defaults don't overwrite explicit choices
  source: "user-explicit" | "default" | "inherited"
}

export function resolveSessionModel(
  session: Session,
  incoming: Partial<SessionModelPreference>,
  configDefault: SessionModelPreference,
): SessionModelPreference {
  const current = session.modelPreference

  // If the user has already explicitly chosen, do NOT overwrite with defaults
  if (current?.source === "user-explicit" && incoming.source !== "user-explicit") {
    return {
      ...current,
      // Merge only non-conflicting hints (e.g., new reasoningEffort passed explicitly)
      reasoningEffort: incoming.reasoningEffort ?? current.reasoningEffort,
    }
  }

  // Otherwise fall back to incoming → default
  return {
    modelID: incoming.modelID ?? configDefault.modelID,
    providerID: incoming.providerID ?? configDefault.providerID,
    reasoningEffort: incoming.reasoningEffort ?? configDefault.reasoningEffort,
    source: incoming.source ?? "default",
  }
}
```

**Additionally**: audit any place that calls something like `session.model = config.defaultModel` — those unconditional writes are the bug. Reference upstream `packages/kilo-vscode/src/kilo-provider/model-state.ts` (+77, -27) and the new tests in `tests/unit/model-state.test.ts` (+343) for coverage patterns.

---

### 3. Discard empty draft caches after prompt/goal promotion

**File**: `src/cli/prompt/draft.ts` or `src/session/draft.ts`
**Priority**: medium
**Type**: bugfix
**Reason**: Upstream commit `0d2fee251` ("discard empty draft caches after goal promotion") fixes empty draft entries lingering in cache after a prompt is submitted. If Alexi persists an in-progress prompt buffer (e.g., across reloads), the same bug likely applies — empty drafts should not survive promotion.

**New code**:
```typescript
// After a draft is promoted to an actual message/goal:
export async function promoteDraft(sessionID: string, draft: string): Promise<void> {
  const trimmed = draft.trim()

  if (trimmed.length === 0) {
    // Never persist an empty draft — actively evict any stale cache
    await draftCache.delete(sessionID)
    return
  }

  await session.submit(sessionID, trimmed)
  // After submit, always clear so the next turn starts clean
  await draftCache.delete(sessionID)
}
```

---

### 4. Bump `@opencode-ai/core` (and related) to 7.7.3

**File**: `package.json` (root) and any workspace package that pins `@opencode-ai/core`
**Priority**: low
**Type**: refactor (dependency bump)
**Reason**: Upstream released v7.7.3 (`633f4c0ee`). If Alexi consumes `@opencode-ai/core` as a dependency, align the version. If Alexi vendored the code, no action needed.

**Current**:
```json
{
  "dependencies": {
    "@opencode-ai/core": "7.7.2"
  }
}
```

**New**:
```json
{
  "dependencies": {
    "@opencode-ai/core": "7.7.3"
  }
}
```

**Verification**: run `bun install` (or npm/pnpm equivalent) and re-run the test suite. Confirm SAP AI Core provider still initializes correctly.

---

## Explicitly Skipped Upstream Changes

These upstream changes were reviewed and **intentionally excluded** from this plan:

| Change | Reason for skipping |
|---|---|
| KiloClaw removal (~5000 LOC deleted across `packages/kilo-vscode/src/kiloclaw/**`, `packages/kilo-gateway/src/claw/**`, `packages/opencode/src/kilocode/claw/**`) | Alexi has no KiloClaw integration |
| VSCode chat search refactor (`transcript-search-text.ts`, `MessageList.tsx`, etc.) | Alexi is not a VSCode extension |
| VSCode voice input disable in SSH (`features.ts`, speech-to-text) | Not applicable — no VSCode webview |
| JetBrains changelog / CLI parser tests | Not applicable |
| Zig cache CI fix (`.github/actions/setup-linux-sandbox/action.yml`) | CI-specific, only relevant if Alexi uses the same GitHub Action |
| Union Alpha stealth model + oversized model-name guard (`packages/stats/core/src/domain/**`) | Alexi does not ship the stats aggregation service |
| Console migrated-workspace selector fix | Alexi doesn't ship the opencode.ai console |
| SDK regeneration (`packages/sdk/js/src/v2/gen/**`, `openapi.json`) removing Claw endpoints | Only relevant if Alexi generates from the same OpenAPI spec — verify and regenerate if so |
| Review command alias removal (`packages/opencode/src/kilocode/review/command.ts`) | Alexi likely never had these aliases |
| i18n translation string additions across ~20 languages | Only apply if Alexi maintains matching i18n bundles |
| Removal of `dev:stats` script | Alexi's `package.json` likely never had it |

---

## Testing Recommendations

1. **Session status regression** — add a test that:
   - Puts a session into `busy` state
   - Simulates a publish failure on the transition to `idle`
   - Asserts the session is NOT left in a stale busy state
   - Then triggers a reload and asserts it succeeds
2. **Model preference persistence** — add a test that:
   - Sets an explicit user model choice (e.g., a specific SAP AI Core deployment)
   - Simulates a new turn with the config default present
   - Asserts the explicit choice survives
   - Repeat for `reasoningEffort` intent preservation
3. **Draft cache** — assert empty drafts are evicted immediately after submission (or after clearing input)
4. **SAP AI Core smoke test** — after the `@opencode-ai/core` bump, run an end-to-end chat completion through the SAP provider to confirm no signature/interface drift

## Potential Risks

- **Session status change is subtle**: the ordering fix (clear-before-publish, write-after-publish) can create a brief window where subscribers observing state directly might see an inconsistent snapshot. Verify all consumers subscribe via the event bus rather than polling the store.
- **Model preference source-tracking**: introducing a `source: "user-explicit" | "default" | "inherited"` field is a schema change. If Alexi persists preferences to disk, add a migration (default old entries to `"user-explicit"` to avoid silently downgrading users' saved choices).
- **`@opencode-ai/core` 7.7.3 bump**: even though this is a patch release, upstream's KiloClaw removal (`packages/opencode/src/kilocode/claw/**`) and command index changes (`packages/opencode/src/command/index.ts` -3 lines) could have surfaced through the core package. If Alexi imports any Claw-related symbol, it will break — grep for `claw`, `KiloClaw`, `kilo-chat-client` before bumping.
- **No security fixes identified** in this diff window, so no urgency to expedite deployment.
{"prompt_tokens":16680,"completion_tokens":4036,"total_tokens":20716,"cache_read_input_tokens":0,"cache_creation_input_tokens":0}

[Session: ccd4b07b-40cf-42fa-9407-4dc708b3facc]
[Messages: 2, Tokens: 20716]
