/**
 * Provider HTTP transport settings.
 *
 * Centralizes the chunk-timeout and Bun-fetch idle-timeout settings that
 * cover long-running SAP AI Core streaming requests. These are the
 * cross-cutting knobs that otherwise get scattered across provider
 * modules.
 *
 * Upstream references:
 *  - opencode PR #55032 — raised the chunk timeout to 15 min to stop
 *    spurious mid-stream failures on SAP AI Core enterprise models
 *    (gpt-5 / claude-opus) that routinely take > 5 min for complex
 *    reasoning tasks.
 *  - opencode PR #55007 — disabled Bun's default fetch idle timeout
 *    because it silently cuts long-running streams (ECONNRESET during
 *    model reasoning).
 *
 * Both knobs must remain compatible with SAP AI Core: it is a gateway
 * that preserves the upstream model's streaming behaviour, so the
 * timeout contract is identical to a direct provider call.
 */

/**
 * Default per-chunk timeout for provider streaming responses.
 *
 * This is the maximum time a stream may idle between chunks before the
 * caller aborts. SAP AI Core enterprise models (gpt-5, claude-opus via
 * SAP) can take > 5 min for complex reasoning; the previous 5-minute
 * default caused spurious mid-stream failures. 15 min matches the
 * opencode default (PR #55032).
 *
 * Callers that want "never time out" pass `0` or a negative number to
 * their stream wrapper. Callers that want a tighter deadline (unit
 * tests, cheap models) should pass an explicit override.
 */
export const DEFAULT_CHUNK_TIMEOUT = 900_000; // 15 minutes

/**
 * Build fetch options that disable Bun's default fetch idle timeout.
 *
 * Bun injects a `idleTimeout` option on fetch that silently closes
 * sockets after a fixed idle window, causing streaming provider
 * responses to fail with ECONNRESET while the model is still reasoning.
 * Setting `idleTimeout: 0` disables the Bun-specific cap.
 *
 * Under Node, the extra `idleTimeout` key is ignored — the `fetch()`
 * implementation drops unknown init keys. So this helper is a no-op on
 * Node and only takes effect under Bun. Mirrors opencode PR #55007.
 *
 * @param baseOptions - Existing RequestInit from the caller.
 * @returns A new RequestInit with `idleTimeout: 0` merged in.
 */
export function withBunIdleTimeoutDisabled<T extends RequestInit>(
  baseOptions: T
): T & { idleTimeout: number } {
  return {
    ...baseOptions,
    // 0 = disabled (Bun-specific option; ignored under Node)
    idleTimeout: 0,
  };
}
