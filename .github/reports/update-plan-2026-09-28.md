```markdown
# Update Plan for Alexi

Generated: 2026-09-28
Based on upstream commits analyzed:
- kilocode: 318a913a2, 52729b6d8, c4506f7ef, ee3e34961, 9ad55594e, ffa7968ff
- opencode: f416138, acb6859, 725e4ba, 03e6717, d6963bd, 661b7c5, 1eacc1b, 35fc7a7

## Summary
- Total changes planned: 3
- Critical: 0 | High: 2 | Medium: 1 | Low: 0

## Changes

### 1. Assume models with empty supported parameters support tool use
**File**: `src/providers/gateway/models.ts` (or equivalent provider capability resolver)
**Priority**: high
**Type**: bugfix
**Reason**: Upstream kilocode fix (`c4506f7ef` — "fix(gateway): assume models with empty supported parameters support tools"). When a gateway/catalog model returns no `supported_parameters` (empty array or null), Alexi should optimistically treat it as tool-capable, otherwise valid tool-capable models get filtered out and downgrade agents to a text-only fallback. This directly affects SAP AI Core integrations where certain deployed models don't publish `supported_parameters`.

**Current code** (typical pattern):
```typescript
export function modelSupportsTools(model: ModelInfo): boolean {
  const params = model.supported_parameters ?? []
  return params.includes("tools") || params.includes("tool_choice")
}
```

**New code**:
```typescript
/**
 * A model supports tool use when:
 *  - it explicitly advertises "tools"/"tool_choice" in supported_parameters, OR
 *  - it does not publish any supported_parameters at all (optimistic default).
 *
 * Rationale: some gateways (incl. SAP AI Core deployments) omit the field
 * entirely; treating "unknown" as "unsupported" incorrectly disables tools.
 * Ref: kilocode c4506f7ef.
 */
export function modelSupportsTools(model: ModelInfo): boolean {
  const params = model.supported_parameters
  if (params === undefined || params === null) return true
  if (Array.isArray(params) && params.length === 0) return true
  return params.includes("tools") || params.includes("tool_choice")
}
```

**Companion test** — add to `test/providers/gateway/models.test.ts`:
```typescript
import { describe, expect, test } from "bun:test"
import { modelSupportsTools } from "../../../src/providers/gateway/models"

describe("modelSupportsTools", () => {
  test("returns true when supported_parameters is undefined", () => {
    expect(modelSupportsTools({ id: "x" } as any)).toBe(true)
  })
  test("returns true when supported_parameters is an empty array", () => {
    expect(modelSupportsTools({ id: "x", supported_parameters: [] } as any)).toBe(true)
  })
  test("returns true when tools listed", () => {
    expect(modelSupportsTools({ id: "x", supported_parameters: ["tools"] } as any)).toBe(true)
  })
  test("returns false when parameters listed but tools absent", () => {
    expect(
      modelSupportsTools({ id: "x", supported_parameters: ["temperature", "top_p"] } as any),
    ).toBe(false)
  })
})
```

---

### 2. Apply provider timeouts to gateway-routed models (Cloudflare AI Gateway / SAP AI Core parity)
**File**: `src/providers/provider.ts`
**Priority**: high
**Type**: bugfix
**Reason**: Upstream opencode `35fc7a7` — "fix(opencode): apply provider timeouts to Cloudflare AI Gateway models". The provider timeout config (`headers`/`fetch` overrides) was only applied to direct provider URLs, not to gateway-routed ones. This is directly relevant to Alexi's SAP AI Core integration (which is itself a gateway) — long inference calls will hang on the default fetch timeout without this fix. Companion test added upstream: `test/provider/header-timeout.test.ts` (+106).

**Current code** (typical pattern in `provider.ts`):
```typescript
function buildFetch(opts: ProviderOptions) {
  const timeout = opts.timeout ?? DEFAULT_TIMEOUT_MS
  if (!opts.baseURL?.startsWith("https://api.")) {
    // gateway route — skip custom fetch
    return globalThis.fetch
  }
  return (input: RequestInfo, init?: RequestInit) =>
    globalThis.fetch(input, { ...init, signal: AbortSignal.timeout(timeout) })
}
```

**New code**:
```typescript
function buildFetch(opts: ProviderOptions) {
  const timeout = opts.timeout ?? DEFAULT_TIMEOUT_MS
  // Always honor configured timeout, regardless of whether the request goes
  // through a direct provider URL or a gateway (Cloudflare AI Gateway,
  // SAP AI Core, etc.). Ref: opencode 35fc7a7.
  return (input: RequestInfo, init?: RequestInit) => {
    const controller = new AbortController()
    const t = setTimeout(() => controller.abort(new Error(`Provider timeout after ${timeout}ms`)), timeout)
    const signal = init?.signal
      ? AbortSignal.any([init.signal, controller.signal])
      : controller.signal
    return globalThis.fetch(input, { ...init, signal }).finally(() => clearTimeout(t))
  }
}
```

**Companion test** — port `packages/opencode/test/provider/header-timeout.test.ts` to `test/providers/header-timeout.test.ts`:
```typescript
import { describe, expect, test } from "bun:test"
import { buildFetch } from "../../src/providers/provider"

describe("provider timeout", () => {
  test("aborts gateway-routed requests when timeout elapses", async () => {
    const fetchFn = buildFetch({ baseURL: "https://gateway.ai.cloudflare.com/v1/xxx", timeout: 50 })
    await expect(
      fetchFn("https://gateway.ai.cloudflare.com/v1/xxx/slow", {}),
    ).rejects.toThrow(/timeout/i)
  })

  test("aborts SAP AI Core requests when timeout elapses", async () => {
    const fetchFn = buildFetch({ baseURL: "https://api.ai.sap.example/v2/", timeout: 50 })
    await expect(fetchFn("https://api.ai.sap.example/v2/slow", {})).rejects.toThrow(/timeout/i)
  })
})
```

---

### 3. (Optional) Track model identity by canonical catalog ID for usage attribution
**File**: `src/core/stats/catalog-identity.ts` (new)
**Priority**: medium
**Type**: feature
**Reason**: Upstream opencode `acb6859` introduces `catalog-identity.ts` in `stats/core` to normalize a model+provider offering to a canonical lab identity, avoiding double-counting when the same underlying model is exposed via multiple gateways. Alexi may want a similar helper if it aggregates usage across SAP AI Core deployments and other providers. Adopt only if Alexi has usage/stats aggregation; otherwise defer.

**New code** (only if Alexi has stats aggregation):
```typescript
// src/core/stats/catalog-identity.ts
// Ported from opencode packages/stats/core/src/domain/catalog-identity.ts
// (commit acb6859). Adapted to Alexi's provider registry.

export type CatalogIdentity = {
  /** "<providerID>/<modelID>" -> canonical lab (e.g. "meituan") */
  offerings: ReadonlyMap<string, string>
  /** normalized model name -> canonical lab (only when unambiguous) */
  models: ReadonlyMap<string, string>
}

const record = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v)

export function catalogIdentity(
  value: unknown,
  statsProviders: readonly string[] = ["opencode", "opencode-go", "sap-ai-core"],
): CatalogIdentity {
  if (!record(value) || !record(value.models) || !record(value.providers)) {
    throw new Error("Invalid model catalog")
  }
  const models = value.models
  const providers = value.providers

  const offerings = new Map<string, string>()
  const candidates = new Map<string, Set<string>>()

  for (const providerID of statsProviders) {
    const provider = providers[providerID]
    if (!record(provider) || !record(provider.models)) continue
    for (const [modelID, model] of Object.entries(provider.models)) {
      if (!record(model)) continue
      const canonicalID =
        typeof model.canonical_model_id === "string"
          ? model.canonical_model_id
          : modelID in models
            ? modelID
            : `${providerID}/${modelID}` in models
              ? `${providerID}/${modelID}`
              : undefined
      if (!canonicalID) continue
      const lab = canonicalID.split("/")[0]
      offerings.set(`${providerID}/${modelID}`, lab)
      const norm = modelID.replace(/-free$|-preview$/g, "")
      if (!candidates.has(norm)) candidates.set(norm, new Set())
      candidates.get(norm)!.add(lab)
    }
  }

  const modelsOut = new Map<string, string>()
  for (const [name, labs] of candidates) {
    if (labs.size === 1) modelsOut.set(name, [...labs][0]!)
  }
  return { offerings, models: modelsOut }
}
```

---

## Explicitly NOT ported

The following upstream changes are intentionally skipped as they are not applicable to Alexi:

- **opencode Console/Stats UI changes** (`packages/console/app/**`, `packages/stats/app/**`, `packages/web/src/content/docs/**/go.mdx`, i18n files): Alexi has no web console, marketing site, or "Go Plus" product surface.
- **opencode version bumps** (`1.18.32` → `1.18.33` across `package.json` files): purely release plumbing, no code impact.
- **kilocode CI/workflow changes** (`.github/workflows/dependabot-auto-merge.yml`, workflow README): Alexi has its own CI configuration; no code impact.
- **`packages/opencode/src/kilocode/cloud/catalog.ts`**: kilocode-cloud-specific; Alexi does not consume kilocode's cloud catalog.
- **Daily/weekly model ranking features** (`661b7c5`, `d6963bd`, `03e6717`): UI/stats-app only.

## Testing Recommendations

1. **Tool capability regression**: run existing agent integration tests against a mock SAP AI Core deployment that returns a model with empty `supported_parameters` — the agent should still register tools successfully.
2. **Timeout behavior**: unit-test `buildFetch` against a stalling mock server at both a direct provider URL and a gateway URL; both must abort at the configured timeout.
3. **Existing provider test suite**: run the full `test/providers/` suite to ensure the fetch signature/abort-chaining change does not break streaming responses (SSE) — the `signal` composition must not close the stream prematurely.
4. **If porting change #3**: run the ported `catalog-identity` tests and verify SAP-provider offerings map to their correct canonical lab.

## Potential Risks

- **AbortSignal.any availability**: `AbortSignal.any` requires Node 20+/Bun; if Alexi supports older runtimes, fall back to a manual listener
{"prompt_tokens":7888,"completion_tokens":4096,"total_tokens":11984,"cache_read_input_tokens":0,"cache_creation_input_tokens":0}

[Session: 10358de5-b4a0-4219-9b43-76c5ba5e7a65]
[Messages: 2, Tokens: 11984]
