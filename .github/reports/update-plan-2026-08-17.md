```markdown
# Update Plan for Alexi

Generated: 2026-08-17
Based on upstream commits analyzed:
- kilocode: 4239f9d98, 87ba0569f, 90a93a7aa, 9851253b7, 5766f7e96
- opencode: 4d68d30, 5a0e07e, cba6b5f, 1c96545, a0f8dcc, fb8344f, 3fd77ae

## Summary
- Total changes planned: 4
- Critical: 1 | High: 1 | Medium: 1 | Low: 1

## Analysis Notes

The upstream changes fall into these categories:
1. **kilocode**: Documentation additions (TrustedRouter provider docs), and a new PR-linking feature for opencode sessions. These are Kilo-specific features that likely don't apply to Alexi/SAP AI Core.
2. **opencode**: A **security-relevant bug fix** in the Cloudflare AI Gateway plugin (token leaked to third-party providers), OpenAI Codex/ChatGPT subscription limit tweak, DeepSeek V4 pricing docs, zen peak pricing, and a scheduled workflow removal.

Most changes are docs/localization/console-specific and not applicable. The critical item is the Cloudflare AI Gateway auth token scoping fix if Alexi ships the CF AI Gateway plugin. The Codex limits tweak applies if Alexi ships the OpenAI Codex plugin. Neither is directly relevant to SAP AI Core integration but should be mirrored if the corresponding provider plugins exist in Alexi.

## Changes

### 1. Fix Cloudflare AI Gateway token leakage to third-party providers
**File**: `src/providers/cloudflare-ai-gateway.ts` (or wherever the CF AI Gateway plugin lives, e.g. `src/plugin/provider/cloudflare-ai-gateway.ts`)
**Priority**: critical
**Type**: security
**Reason**: Currently the Cloudflare account API key is being sent as the upstream `Authorization` header for *every* model routed through the gateway, including third-party providers (OpenAI, Anthropic, etc.). Third-party providers should rely on the gateway's stored/BYOK keys, not receive the CF token. Only Workers AI (`workers-ai/*` and bare `@cf/*` model IDs) should receive the CF token. Skip this change if Alexi does not ship a CF AI Gateway plugin.

**Current code**:
```typescript
const gateway = createGatewayProvider({
  accountId: config.accountId,
  gateway: config.gateway,
  apiKey: config.apiKey,
  options: gatewayOptions(evt.options, metadata),
} as any)
const unified = createUnified({ apiKey: config.apiKey })
evt.sdk = {
  languageModel(modelID: string) {
    return gateway(unified(modelID))
  },
}
```

**New code**:
```typescript
const gateway = createGatewayProvider({
  accountId: config.accountId,
  gateway: config.gateway,
  apiKey: config.apiKey,
  options: gatewayOptions(evt.options, metadata),
} as any)
evt.sdk = {
  languageModel(modelID: string) {
    // Workers AI is the only first-party provider whose upstream is Cloudflare itself, so it is
    // the only one that should receive the Cloudflare token as its upstream Authorization header.
    // The Unified API addresses Workers AI both with the explicit "workers-ai/" prefix and as
    // bare "@cf/..." ids. Third-party providers must not receive the token; they rely on the
    // gateway's stored/BYOK keys instead.
    const isWorkersAi =
      modelID.startsWith("workers-ai/") || modelID.startsWith("@cf/")
    const unified = createUnified(isWorkersAi ? { apiKey: config.apiKey } : {})
    return gateway(unified(modelID))
  },
}
```

---

### 2. Match Codex limits for OpenAI models when using ChatGPT subscription
**File**: `src/providers/openai/codex.ts` (if present in Alexi)
**Priority**: high
**Type**: bugfix
**Reason**: Upstream aligned the token/request limits reported for OpenAI models to match Codex's exact limits when a ChatGPT subscription is used. Without this, Alexi may over- or under-report context/output limits and cause premature truncation or refused requests. Only applies if Alexi ships the OpenAI Codex passthrough plugin.

**Action**: Port the diff from `packages/opencode/src/plugin/openai/codex.ts` (+4, -9). Since the raw diff isn't in this report, the reviewer must:
1. Fetch the upstream diff for commit `4d68d30` at `packages/opencode/src/plugin/openai/codex.ts`.
2. Locate the model limit map (`context`, `output`, or equivalent constants).
3. Replace the currently-inflated values with the tightened Codex-matched values.
4. Update the corresponding test at `test/plugin/codex.test.ts` accordingly (upstream +3/-3).

**Placeholder shape**:
```typescript
// Before (illustrative):
const LIMITS = {
  "gpt-5": { context: 400_000, output: 128_000, /* ...extra fields... */ },
}

// After (illustrative — use exact upstream values):
const LIMITS = {
  "gpt-5": { context: 272_000, output: 128_000 },
}
```

---

### 3. Add `costPeak` field to model cost schema
**File**: `src/core/model.ts` (or wherever `ZenData`/model schema is defined in Alexi, if the Zen model schema was adopted)
**Priority**: medium
**Type**: feature
**Reason**: Upstream added an optional `costPeak` field to model cost data to represent peak-hour pricing for zen models. This is a purely additive, optional field. If Alexi consumes or re-exports the Zen model schema, adding this field keeps validation compatible with upstream data feeds. Skip if Alexi does not use the Zen schema.

**Current code**:
```typescript
export namespace ZenData {
  export const Schema = z.object({
    // ...
    cost: ModelCostSchema,
    costMultiplier: z.number().default(1),
    cost200K: ModelCostSchema.optional(),
    allowAnonymous: z.boolean().optional(),
    byokProvider: z.enum(["openai", "anthropic", "google"]).optional(),
    stickyProvider: z.enum(["strict", "prefer"]).optional(),
    // ...
  })
}
```

**New code**:
```typescript
export namespace ZenData {
  export const Schema = z.object({
    // ...
    cost: ModelCostSchema,
    costMultiplier: z.number().default(1),
    cost200K: ModelCostSchema.optional(),
    costPeak: ModelCostSchema.optional(),
    allowAnonymous: z.boolean().optional(),
    byokProvider: z.enum(["openai", "anthropic", "google"]).optional(),
    stickyProvider: z.enum(["strict", "prefer"]).optional(),
    // ...
  })
}
```

---

### 4. (Optional) Simplify Cloudflare plugin wrapper
**File**: `src/providers/cloudflare.ts` (if present)
**Priority**: low
**Type**: refactor
**Reason**: Upstream removed 11 lines from `packages/opencode/src/plugin/cloudflare.ts`, likely dead-code cleanup related to the AI Gateway auth fix above. Non-functional; only worth doing to reduce future merge friction. Inspect upstream commit `cba6b5f` and mirror the deletions if the same wrapper exists in Alexi.

---

## Explicitly Skipped Changes

The following upstream changes are **intentionally not planned** for Alexi:

- **kilocode TrustedRouter docs** (`packages/kilo-docs/**`) — Kilo-specific documentation; Alexi has its own docs.
- **kilocode session ↔ PR linking** (`packages/opencode/src/kilo-sessions/**`, `packages/opencode/src/cli/cmd/pr.ts`) — Depends on Kilo's remote session ingest infrastructure that Alexi does not have; also not relevant to SAP AI Core workflows.
- **DeepSeek V4 pricing docs** and **zen peak pricing docs** across all locales (`packages/web/src/content/docs/**/*.mdx`) — Marketing/docs site content.
- **YouTube footer link fix** (`packages/stats/app/src/routes/stats-shell.tsx`) — Stats app UI, not shipped in Alexi.
- **Removal of `.github/workflows/beta.yml`** — CI infra specific to opencode's release cadence.
- **Console app changes** (`packages/console/**`) — Not part of Alexi.

## Testing Recommendations

1. **Cloudflare AI Gateway (change #1)**:
   - Add/extend an e2e test analogous to upstream `test/provider/cf-ai-gateway-e2e.test.ts` verifying that:
     - Requests to `workers-ai/*` and `@cf/*` model IDs include `Authorization: Bearer <cfToken>`.
     - Requests to `openai/*`, `anthropic/*`, etc. do **not** include the CF token in the upstream Authorization header.
   - Regression-test that gateway routing still succeeds for at least one third-party model using BYOK keys stored in the gateway.

2. **Codex limits (change #2)**:
   - Update snapshot / unit tests for OpenAI model metadata.
   - Manual smoke test: run a long prompt against `gpt-5` with a ChatGPT subscription and confirm the client no longer allows exceeding Codex's actual limit.

3. **`costPeak` schema (change #3)**:
   - Add a schema unit test asserting that Zen model payloads with and without `costPeak` both parse successfully.

4. **SAP AI Core regression**: Run the full existing SAP AI Core provider test suite to confirm none of the above touch the SAP integration path.

## Potential Risks

- **Change #1 (CF AI Gateway)**: If any existing Alexi deployment *relies* on the CF account token being forwarded to third-party providers (unlikely but possible in misconfigured setups), those calls will start failing with 401s from the upstream provider. Communicate this in the changelog as a security fix and instruct affected users to store BYOK keys in the CF Gateway UI.
- **Change #2 (Codex limits)**: Tightening context/output limits may cause previously-accepted long prompts to be rejected client-side. Document the new limits.
- **Change #3 (`costPeak`)**: Purely additive/optional — no risk if truly optional in the schema.
- **General**: Because the report did not include full diffs for the Codex and CF plugin files (only the summary and a single key diff), pull the actual upstream diffs before committing to ensure exact parity.
```
{"prompt_tokens":4952,"completion_tokens":3811,"total_tokens":8763,"cache_read_input_tokens":0,"cache_creation_input_tokens":0}

[Session: 890803ac-f0c9-442a-92be-30b4df6f8d62]
[Messages: 2, Tokens: 8763]
