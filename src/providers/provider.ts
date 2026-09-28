/**
 * Provider fetch wrapper with unconditional timeout enforcement.
 *
 * Ports opencode 35fc7a7 ("fix(opencode): apply provider timeouts to
 * Cloudflare AI Gateway models"). The upstream bug: the provider timeout
 * config was only applied when the base URL matched a direct provider
 * pattern (e.g. `https://api.anthropic.com`), so requests routed through
 * an AI gateway (Cloudflare AI Gateway, SAP AI Core, OpenRouter, etc.)
 * bypassed the wrapper entirely and would hang on the default
 * platform-level fetch timeout.
 *
 * This module always honours the configured timeout, regardless of
 * whether the request goes through a direct provider URL or a gateway.
 *
 * The `AbortSignal.any` fallback: on Node < 20 or Bun < 1.1 this global
 * is not available. We provide a manual multi-signal composer so the
 * caller's own abort signal (Ctrl+C, request cancellation) still wins
 * over the timeout when either fires first.
 */

/** Default provider request timeout (ms). Matches opencode 35fc7a7. */
export const DEFAULT_PROVIDER_TIMEOUT_MS = 60_000;

/**
 * Options accepted by {@link buildFetch}.
 */
export interface BuildFetchOptions {
  /**
   * Base URL of the provider or gateway endpoint. Kept informational —
   * the timeout is applied unconditionally regardless of what this
   * value is. Only used to make timeout error messages friendlier.
   */
  baseURL?: string;
  /**
   * Timeout in milliseconds. Defaults to
   * {@link DEFAULT_PROVIDER_TIMEOUT_MS}. Non-positive values disable the
   * timeout (fall through to the platform fetch default) — callers that
   * want "never time out" pass `0` or a negative number.
   */
  timeout?: number;
}

/** Signature of the returned fetch wrapper. */
export type FetchLike = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

/**
 * Compose multiple AbortSignals into one. Prefers the platform
 * `AbortSignal.any` when available (Node >= 20, Bun >= 1.1); falls back
 * to a manual listener chain otherwise. The returned controller is
 * aborted when ANY of the input signals fire.
 */
function anySignal(signals: readonly AbortSignal[]): AbortSignal {
  // Use the platform helper when available — it is more efficient and
  // correctly propagates the abort reason.
  const anyFn = (AbortSignal as unknown as { any?: (s: readonly AbortSignal[]) => AbortSignal })
    .any;
  if (typeof anyFn === 'function') {
    return anyFn(signals);
  }

  const controller = new AbortController();
  const onAbort = (signal: AbortSignal): void => {
    if (!controller.signal.aborted) {
      controller.abort(signal.reason);
    }
  };
  for (const signal of signals) {
    if (signal.aborted) {
      onAbort(signal);
      break;
    }
    signal.addEventListener('abort', () => onAbort(signal), { once: true });
  }
  return controller.signal;
}

/**
 * Build a `fetch`-compatible wrapper that enforces a request timeout
 * for the configured provider or gateway.
 *
 * Contract:
 *  - Always applies the timeout, regardless of whether `baseURL` points
 *    at a direct provider or a gateway. This is the fix from opencode
 *    35fc7a7.
 *  - Composes with a caller-supplied `init.signal` (e.g. user Ctrl+C):
 *    whichever fires first — timeout or caller signal — aborts the
 *    underlying request.
 *  - When `timeout <= 0`, no timeout is applied and the caller's signal
 *    (if any) is used directly.
 *
 * The wrapper is a plain function, so it can be dropped into any SDK
 * that accepts a custom `fetch` implementation.
 *
 * @param opts - Base URL and timeout config.
 * @returns Fetch-compatible function.
 */
export function buildFetch(opts: BuildFetchOptions = {}): FetchLike {
  const timeout = opts.timeout ?? DEFAULT_PROVIDER_TIMEOUT_MS;
  const label = opts.baseURL ? `${opts.baseURL}` : 'provider';

  return (input, init) => {
    // Timeout disabled → forward directly.
    if (!Number.isFinite(timeout) || timeout <= 0) {
      return globalThis.fetch(input as RequestInfo, init);
    }

    const controller = new AbortController();
    const timer = setTimeout(() => {
      controller.abort(new Error(`Provider timeout after ${timeout}ms (${label})`));
    }, timeout);
    // Do not keep the event loop alive just for a timeout on a fetch
    // the caller has already forgotten about.
    if (typeof (timer as { unref?: () => void }).unref === 'function') {
      (timer as { unref: () => void }).unref();
    }

    const callerSignal = init?.signal ?? undefined;
    const signal = callerSignal ? anySignal([callerSignal, controller.signal]) : controller.signal;

    return globalThis
      .fetch(input as RequestInfo, { ...init, signal })
      .finally(() => clearTimeout(timer));
  };
}
