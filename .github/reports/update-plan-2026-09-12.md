# Update Plan for Alexi

Generated: 2026-09-12
Based on upstream commits analyzed:
- kilocode: `4304a8691..c36e22634` (23 commits)
- opencode: `193de13..95daf90` (3 commits)

## Summary
- Total changes planned: 5
- Critical: 0 | High: 2 | Medium: 2 | Low: 1

## Analysis Notes

Most upstream changes are **not applicable** to Alexi:
- **kilocode docs/webview/i18n** — VS Code extension UI-only, not relevant to Alexi's terminal-focused architecture
- **kilocode visual regression baselines** — VS Code extension test artifacts
- **console workspace block/unblock** — Kilo Console admin surface, not part of Alexi
- **ACP (Agent Client Protocol) restoration** — Only relevant if Alexi ships ACP support

The **actionable** items are:
1. Auxiliary task small-model fallback restriction (kilocode `1e73d3862`)
2. Compaction model configuration location (kilocode `f64c6646d`) — only if Alexi has compaction settings
3. Provider selection changes (kilocode `packages/opencode/src/provider/provider.ts` +14/-3)
4. ACP session options/reasoning boundaries (opencode `95daf90`) — only if ACP is present
5. Test hygiene for compaction (kilocode `0f33a6673`)

---

## Changes

### 1. Restrict small-model / kilo-auto fallback to auxiliary tasks with Kilo credentials
**File**: `src/providers/provider.ts` (or `src/router/model-selection.ts` if router-based)
**Priority**: high
**Type**: bugfix
**Reason**: Upstream commit `1e73d3862` fixes a bug where `kilo-auto` / `kilo-small` was being selected for auxiliary tasks (title generation, summarization, compaction) even for users without Kilo credentials, causing auth failures. For Alexi (SAP AI Core), the equivalent risk is defaulting auxiliary tasks to a cheap model that isn't provisioned in the user's SAP AI Core deployment. The fix should gate small-model fallback on provider capability.

**Current code** (illustrative, based on opencode pattern):
```typescript
// src/providers/provider.ts
export async function selectModelForTask(
  task: "primary" | "auxiliary",
  context: ProviderContext,
): Promise<ModelRef> {
  if (task === "auxiliary") {
    // Always fall back to a small model
    return { providerID: "kilo", modelID: "kilo-auto" }
  }
  return context.defaultModel
}
```

**New code**:
```typescript
// src/providers/provider.ts
export async function selectModelForTask(
  task: "primary" | "auxiliary",
  context: ProviderContext,
): Promise<ModelRef> {
  if (task === "auxiliary") {
    // Only use the small-model fallback when the active provider actually
    // supports it (i.e. Kilo credentials present, or SAP AI Core deployment
    // for the small model is configured). Otherwise, fall back to the
    // user's default model to avoid auth failures.
    const canUseSmallModel =
      context.providerID === "kilo" && (await context.hasKiloCredentials()) ||
      (context.providerID === "sap-ai-core" &&
        (await context.hasSapDeployment("small")))

    if (canUseSmallModel) {
      return context.providerID === "sap-ai-core"
        ? { providerID: "sap-ai-core", modelID: context.smallModelDeployment! }
        : { providerID: "kilo", modelID: "kilo-auto" }
    }
    // Fallback: reuse the primary model for auxiliary tasks
    return context.defaultModel
  }
  return context.defaultModel
}
```

**Also add** a corresponding test at `src/providers/__tests__/provider.test.ts` mirroring `packages/opencode/test/kilocode/provider/provider.test.ts` (+84 lines upstream). Focus cases:
- Auxiliary task with Kilo credentials → returns `kilo-auto`
- Auxiliary task without Kilo credentials → returns default model
- Auxiliary task with SAP AI Core small deployment → returns SAP small model
- Auxiliary task with SAP AI Core, no small deployment → returns default model

---

### 2. Skip title generation in exact-call compaction tests
**File**: `src/core/__tests__/compaction.test.ts` (or wherever compaction tests live)
**Priority**: medium
**Type**: bugfix (test hygiene)
**Reason**: Upstream commit `0f33a6673` fixes flaky compaction tests where implicit title-generation calls polluted the LLM call count assertions. If Alexi has compaction tests that assert exact call counts, they will suffer the same flake.

**New code** (add to test setup):
```typescript
// src/core/__tests__/compaction.test.ts
beforeEach(() => {
  // Compaction implicitly triggers title generation; disable it so that
  // exact-call assertions only measure compaction traffic.
  vi.spyOn(Session, "generateTitle").mockResolvedValue(undefined)
})
```

---

### 3. Provider selection: propagate auxiliary-task context through provider lookup
**File**: `src/providers/provider.ts`
**Priority**: high
**Type**: refactor (enables #1)
**Reason**: Upstream diff `packages/opencode/src/provider/provider.ts` (+14/-3) threads an auxiliary-task flag through the provider selection API. Alexi needs the same plumbing for the fix in change #1 to work end-to-end.

**Current code** (illustrative):
```typescript
export async function getModel(modelID?: string): Promise<ModelRef> {
  if (!modelID) return getDefaultModel()
  return resolveModel(modelID)
}
```

**New code**:
```typescript
export interface GetModelOptions {
  /** True when the caller is a background/auxiliary task
   *  (title gen, summarization, compaction). */
  auxiliary?: boolean
}

export async function getModel(
  modelID?: string,
  opts: GetModelOptions = {},
): Promise<ModelRef> {
  if (modelID) return resolveModel(modelID)
  if (opts.auxiliary) {
    return selectModelForTask("auxiliary", buildContext())
  }
  return getDefaultModel()
}
```

Update all callers of `getModel()` from compaction/title/summary paths to pass `{ auxiliary: true }`.

---

### 4. Move compaction model configuration to Models settings surface
**File**: `src/cli/commands/config.ts` and `src/core/config/schema.ts`
**Priority**: medium
**Type**: refactor
**Reason**: Upstream commit `f64c6646d` moves the compaction-model setting from the Context tab to the Models tab, aligning it with other model configuration. For Alexi (CLI/terminal), the analogue is to group `compactionModel` alongside `defaultModel` in the config schema rather than under a separate `context.*` section — improving discoverability via `alexi config` and reducing surprise.

**Current code** (if compaction model is under context):
```typescript
// src/core/config/schema.ts
export const ConfigSchema = z.object({
  models: z.object({
    default: z.string().optional(),
  }),
  context: z.object({
    compactionModel: z.string().optional(),  // <-- move this
    autoCompactionThreshold: z.number().optional(),
  }),
})
```

**New code**:
```typescript
// src/core/config/schema.ts
export const ConfigSchema = z.object({
  models: z.object({
    default: z.string().optional(),
    /** Model used for context compaction (auxiliary task).
     *  Moved from `context.compactionModel` — old key still read
     *  for backward compatibility. */
    compaction: z.string().optional(),
  }),
  context: z.object({
    autoCompactionThreshold: z.number().optional(),
  }),
})

// Backward-compat loader
export function loadConfig(raw: unknown): Config {
  const parsed = ConfigSchema.parse(raw)
  const legacy = (raw as any)?.context?.compactionModel
  if (legacy && !parsed.models.compaction) {
    parsed.models.compaction = legacy
    console.warn(
      "[alexi] config: `context.compactionModel` is deprecated; " +
      "use `models.compaction` instead.",
    )
  }
  return parsed
}
```

---

### 5. ACP session options and reasoning boundaries (only if ACP is supported)
**File**: `src/acp/service.ts`, `src/acp/config-option.ts`, `src/acp/event.ts`
**Priority**: low (skip entirely if Alexi does not ship ACP)
**Type**: bugfix
**Reason**: Upstream commit `95daf90` is a substantial fix to ACP (`packages/opencode/src/acp/service.ts` +157/-36) restoring session options and correctly bounding reasoning blocks in emitted events. If Alexi implements ACP, mirror the fix. If not (likely, given Alexi is SAP-focused), **skip this item**.

**Action items** (only if applicable):
- Port the config-option additions (see upstream `+5/-2` in `config-option.ts`)
- Port the event-boundary logic in `event.ts` (upstream `+2/-2`)
- Port the service session handling (upstream `+157/-36`)
- Port associated tests (`test/acp/*` — ~330 new test lines)

Given the size and Alexi's likely lack of ACP, treat this as **defer / not applicable** unless ACP is on the Alexi roadmap.

---

## Testing Recommendations

1. **Auxiliary-task model fallback** (change #1, #3):
   - Unit-test `selectModelForTask` with matrix: {kilo-creds, no-kilo-creds, sap-with-small, sap-no-small} × {primary, auxiliary}
   - Integration test: run a compaction against SAP AI Core with only the default deployment configured — must not attempt `kilo-auto` and must not fail with auth errors.

2. **Compaction test hygiene** (change #2):
   - Re-run existing compaction tests 20× to confirm no flake from title-gen interference.

3. **Config migration** (change #4):
   - Load a legacy config with `context.compactionModel` — assert it surfaces at `models.compaction` and a deprecation warning is logged.
   - Load a new-style config — assert clean parse, no warning.

4. **Regression sweep**:
   - `alexi run` with default SAP AI Core deployment — auxiliary tasks (title, summarize, compact) all resolve to the default model.
   - Verify no `kilo-*` model IDs leak into SAP AI Core code paths.

## Potential Risks

- **Change #1/#3** alters model-selection semantics. Users who *did* have Kilo credentials configured and *relied on* the implicit small-model fallback for auxiliary tasks will now need to explicitly configure `models.compaction` (or equivalent). Mitigation: log an info message on first auxiliary task showing which model was selected and why.
- **Change #4** deprecates a config key. Provide the backward-compat shim for at least one minor release before removal.
- **Change #5 (ACP)** is intentionally skipped; if Alexi later adds ACP, revisit upstream commit `95daf90` in full.
- No changes touch the SAP AI Core client, auth, or deployment lookup logic directly — SAP-specific customizations are preserved.
- Skipped upstream areas (kilocode webview, i18n strings, docs banners, visual regression PNGs, console workspace-block admin endpoints) are all confirmed **out of scope** for Alexi's terminal-first, SAP-integrated architecture.
{"prompt_tokens":6064,"completion_tokens":4095,"total_tokens":10159,"cache_read_input_tokens":0,"cache_creation_input_tokens":0}

[Session: 905dfcaf-fef2-478e-8495-cf537c3a38b8]
[Messages: 2, Tokens: 10159]
