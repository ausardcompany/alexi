/**
 * Cloudflare AI Gateway helpers (upstream security port).
 *
 * Alexi does not ship a first-party Cloudflare AI Gateway provider — SAP AI
 * Core is the primary routing target. This module exists so plugins /
 * external integrations that DO layer Cloudflare AI Gateway on top of a
 * Unified API upstream can import a hardened `buildGatewaySdk()` helper
 * instead of re-implementing the (subtle) token-scoping rule themselves.
 *
 * Upstream fix (opencode `70a2469..fe3f3a4`): passing the Cloudflare API
 * token to the Unified API for *any* model id caused the token to be
 * forwarded to third-party upstream providers via the gateway. Only
 * Workers AI is a first-party Cloudflare product whose upstream is
 * Cloudflare itself; every other provider addressed through the Unified
 * API must rely on the gateway's stored / BYOK keys. Sending the CF token
 * to those upstreams leaks BYOK credentials.
 *
 * The Unified API addresses Workers AI via two model-id shapes:
 *   - explicit prefix: `workers-ai/<model>`
 *   - bare model id:   `@cf/<model>`
 *
 * Everything else is a third-party provider and MUST be constructed
 * *without* the Cloudflare API token.
 */

/**
 * Return `true` when `modelID` addresses Workers AI (the only first-party
 * Cloudflare provider on the Unified API). Everything else is a third
 * party and must not receive the Cloudflare API token.
 *
 * Exposed as a plain predicate so callers who assemble their own gateway
 * SDK (rather than using {@link buildGatewaySdk}) can reuse the same
 * scoping rule.
 */
export function isWorkersAiModel(modelID: string): boolean {
  return modelID.startsWith('workers-ai/') || modelID.startsWith('@cf/');
}

/**
 * Minimal shape of a Unified-API factory: a function that accepts an
 * options bag with an optional `apiKey` and returns a callable that maps
 * a model id to a language-model handle. Kept generic so this module has
 * no hard dependency on any specific Unified-API package version.
 */
export type UnifiedFactory = (opts: { apiKey?: string }) => (modelID: string) => unknown;

/**
 * Minimal shape of a Cloudflare AI Gateway wrapper: a function that takes
 * an upstream language-model handle and returns a wrapped handle that
 * routes calls through the gateway. The gateway itself is expected to
 * carry its own authentication / stored keys — we do NOT thread the
 * Cloudflare token through it here.
 */
export type GatewayWrapper = (upstream: unknown) => unknown;

/**
 * Build a `{ languageModel(modelID) }` SDK object for a Cloudflare AI
 * Gateway integration, scoping the Cloudflare API token to Workers AI
 * calls only.
 *
 * Rationale (upstream security fix): the token must reach Cloudflare's
 * own Workers AI upstream, but must NOT reach third-party upstreams
 * (OpenAI, Anthropic, Groq, …) routed through the gateway — those rely
 * on the gateway's stored keys or BYOK credentials.
 *
 * @param cloudflareApiKey - The Cloudflare API token. Passed to the
 *   Unified API only when the requested model is Workers AI; suppressed
 *   for every other model id.
 * @param createUnified - Factory that instantiates the Unified API client
 *   with (or without) an API key.
 * @param gateway - Cloudflare AI Gateway wrapper that composes onto the
 *   upstream language-model handle.
 */
export function buildGatewaySdk(
  cloudflareApiKey: string,
  createUnified: UnifiedFactory,
  gateway: GatewayWrapper
): { languageModel(modelID: string): unknown } {
  return {
    languageModel(modelID: string): unknown {
      // Workers AI is the only first-party provider whose upstream is
      // Cloudflare itself, so it is the only one that should receive the
      // Cloudflare token as its upstream Authorization header. The
      // Unified API addresses Workers AI both with the explicit
      // "workers-ai/" prefix and as bare "@cf/..." ids. Third-party
      // providers must not receive the token; they rely on the
      // gateway's stored / BYOK keys instead.
      const isWorkersAi = isWorkersAiModel(modelID);
      const unified = createUnified(isWorkersAi ? { apiKey: cloudflareApiKey } : {});
      return gateway(unified(modelID));
    },
  };
}
