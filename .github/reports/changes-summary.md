# Changes Summary — Upstream Sync 2026-09-28

Applied the update plan derived from upstream analysis of kilocode
(`318a913a2..7d977bce9`) and opencode (`f416138..b471c2b`). All three
planned items were implemented; no items were skipped.

## Files created

| File | Purpose |
| --- | --- |
| `src/providers/gateway/models.ts` | Gateway model capability helper (`modelSupportsTools`) — fail-open when `supported_parameters` is unspecified/empty. |
| `src/providers/gateway/models.test.ts` | Companion vitest suite for `modelSupportsTools`. |
| `src/providers/provider.ts` | `buildFetch` wrapper that unconditionally enforces provider timeouts on both direct and gateway-routed requests. |
| `src/providers/provider.test.ts` | Companion vitest suite ported from opencode `test/provider/header-timeout.test.ts` (35fc7a7). |
| `src/core/stats/catalog-identity.ts` | `catalogIdentity` helper for normalising `provider/model` offerings to canonical lab identities (ported from opencode `packages/stats/core/src/domain/catalog-identity.ts`, commit acb6859). |
| `src/core/stats/catalog-identity.test.ts` | Companion vitest suite covering canonical-lab resolution, ambiguity handling, and the `sap-ai-core` extension. |

## Files modified

None — all changes are additive. No existing SAP AI Core integration
surface was touched, so the existing provider, orchestrator, router,
and TUI paths continue to behave exactly as before.

## Change details

### Change 1 — `modelSupportsTools` (kilocode c4506f7ef port)

Added a new helper module `src/providers/gateway/models.ts` that
exports a `modelSupportsTools(model: GatewayModelInfo)` predicate. Its
resolution rules:

1. `supported_parameters` is `undefined` or `null` → return `true`
   (fail-open — the gateway did not publish parameter metadata).
2. `supported_parameters` is an empty array → return `true` (same
   rationale; some gateways collapse "no metadata" into `[]`).
3. Otherwise → return `true` iff `"tools"` or `"tool_choice"` is
   listed.

The helper is intentionally separate from the authoritative
`modelHasCapability` in `src/providers/sapOrchestration.ts` — the
in-code metadata there has different semantics (`capabilities: []`
means "definitely no tools", per Alexi's tested behaviour). The
documentation on the module explicitly calls out this distinction so
downstream consumers do not merge the two.

### Change 2 — `buildFetch` timeout (opencode 35fc7a7 port)

Added `src/providers/provider.ts` exporting `buildFetch(opts)`. The
returned fetch wrapper always enforces the configured timeout
regardless of whether the base URL points at a direct provider or a
gateway — this is the exact fix from opencode 35fc7a7. Highlights:

- Default timeout: 60 s (`DEFAULT_PROVIDER_TIMEOUT_MS`).
- Timeout can be disabled by passing `timeout <= 0` (or non-finite).
- Composes with a caller-supplied `AbortSignal` using `AbortSignal.any`
  when available (Node ≥ 20, Bun ≥ 1.1); otherwise falls back to a
  manual multi-signal listener chain so the same behaviour holds on
  older runtimes.
- `setTimeout` handle is `unref()`'d so a forgotten fetch does not
  keep the event loop alive.
- Error message includes the base URL for diagnosability.

Test suite covers the four upstream cases (Cloudflare AI Gateway
timeout, SAP AI Core timeout, direct provider timeout, timely response
pass-through) plus two extras (caller-supplied signal wins over the
timeout; `timeout <= 0` disables the wrapper).

### Change 3 — `catalog-identity` helper (opencode acb6859 port)

Added `src/core/stats/catalog-identity.ts` exporting `catalogIdentity`
plus `DEFAULT_STATS_PROVIDERS`. The helper builds two read-only maps:

- `offerings: Map<"<providerID>/<modelID>", lab>` — every offering
  from the configured providers that resolves to a canonical id.
- `models: Map<normalisedModelID, lab>` — only unambiguous names
  (single candidate lab) are surfaced; ambiguous names are dropped so
  callers cannot mis-attribute usage.

The default provider list was extended with `"sap-ai-core"` (relative
to upstream) so SAP-routed offerings map to the correct lab in Alexi's
usage aggregation.

## SAP AI Core compatibility

Verified:

- No changes were made to `src/providers/sapOrchestration.ts`,
  `src/providers/modelCatalog.ts`, `src/providers/auth.ts`, or any
  existing SAP integration surface.
- All new modules are additive and opt-in — nothing invokes them from
  the runtime path yet. Wiring them into e.g. router capability
  detection or the cost tracker is intentionally deferred so this
  changeset is a pure refactor / capability introduction and can be
  reverted cleanly if needed.
- `AbortSignal.any` compatibility shim ensures the new `buildFetch`
  wrapper does not require Node > 22.12 (Alexi's floor).

## Testing

Three new vitest files added:

- `src/providers/gateway/models.test.ts` — 8 cases.
- `src/providers/provider.test.ts` — 7 cases (mocked fetch).
- `src/core/stats/catalog-identity.test.ts` — 7 cases.

All new suites use vitest primitives (`describe`, `it`, `expect`,
`vi`) matching existing repository conventions rather than bun:test as
the upstream plan pseudocode showed. Test files are located next to
their source files, which `vitest.config.ts` picks up via the
`src/**/*.test.ts` include glob.

## Issues encountered

- The plan pseudocode targeted repo layouts (`src/providers/gateway/models.ts`,
  `src/providers/provider.ts`) that did not previously exist in Alexi
  because SAP AI Core goes through the `@sap-ai-sdk/orchestration` SDK
  rather than a raw fetch. I created the files as new modules — they
  are the natural home for a future gateway/proxy integration and are
  wired to Alexi's ESLint / vitest / tsconfig glob patterns without
  additional config.
- The plan's example test code used `bun:test`; Alexi standardises on
  `vitest`. I ported the assertions to vitest with equivalent
  semantics.
- The plan's Change 1 pseudocode overlapped semantically with Alexi's
  existing authoritative `modelHasCapability` helper. To avoid
  regressing the tested "empty capabilities means no tools" contract on
  the SAP static catalog, the new helper is scoped to *gateway-supplied*
  `supported_parameters` metadata only, and the module-level docstring
  explicitly forbids merging the two code paths.

## Explicitly NOT ported (per plan)

- opencode Console/Stats UI changes (no equivalent surface in Alexi).
- opencode version bumps.
- kilocode CI/workflow changes (Alexi has its own CI).
- `packages/opencode/src/kilocode/cloud/catalog.ts` (kilocode-cloud-specific).
- Daily/weekly model ranking features (UI-only).
