/**
 * Model-request hook plumbing (opencode `d1cf7dd` / `91b5a7c` port).
 *
 * Problem: upstream opencode's request hooks copied the full request body
 * through the hook event even when the hook did not modify it. On long
 * sessions with large multimodal attachments this caused measurable heap
 * pressure, and the request reference stayed pinned on the hook event
 * for the lifetime of any running tool (so GC never reclaimed it).
 *
 * Fix: {@link dispatchRequestHook} runs the hook, then only replaces the
 * outgoing request when the hook actually returned a *different* request.
 * The identity-first short-circuit (`result.request === request`) is
 * essentially free; the deep-equality fallback is only reached when the
 * hook returned a fresh object that happens to carry the same payload.
 *
 * Related cleanup: {@link clearHookPayload} is a tiny `try/finally`
 * helper callers can use to drop their reference to the hook payload
 * after the request completes, so long-running tool executions do not
 * pin the original request body in memory.
 *
 * This module is deliberately decoupled from `src/hooks/index.ts` (which
 * handles shell/http/script side-effect hooks, not model-request
 * transformation) so the two surfaces can evolve independently.
 */

/**
 * Minimal shape of a model request a hook may transform. Callers pass in
 * their own concrete request type via the generic parameter so this
 * module stays agnostic of the provider wire format.
 */
export interface ModelRequestLike {
  /** Free-form payload a hook may read / replace. */
  readonly [key: string]: unknown;
}

/**
 * Result returned by a {@link RequestHook}. When `request` is absent (or
 * strictly equal to the input), the dispatcher assumes the hook was a
 * no-op and keeps the original reference.
 */
export interface RequestHookResult<Req extends ModelRequestLike> {
  request?: Req;
}

/**
 * Hook signature. A hook may inspect the request, optionally return a
 * replacement, or return nothing to indicate "no change".
 */
export type RequestHook<Req extends ModelRequestLike> = (ctx: {
  request: Req;
}) => Promise<RequestHookResult<Req> | void> | RequestHookResult<Req> | void;

/**
 * Deep-equality check with a sensible early-out for the overwhelmingly
 * common case of "same reference". Only reached when the hook returned a
 * freshly allocated object; keeps the comparison cost off the hot path
 * for no-op hooks.
 */
function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) {
    return true;
  }
  if (typeof a !== typeof b) {
    return false;
  }
  if (a === null || b === null || typeof a !== 'object') {
    return false;
  }
  if (Array.isArray(a) !== Array.isArray(b)) {
    return false;
  }
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) {
      return false;
    }
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) {
        return false;
      }
    }
    return true;
  }
  const aObj = a as Record<string, unknown>;
  const bObj = b as Record<string, unknown>;
  const aKeys = Object.keys(aObj);
  const bKeys = Object.keys(bObj);
  if (aKeys.length !== bKeys.length) {
    return false;
  }
  for (const key of aKeys) {
    if (!Object.prototype.hasOwnProperty.call(bObj, key)) {
      return false;
    }
    if (!deepEqual(aObj[key], bObj[key])) {
      return false;
    }
  }
  return true;
}

/**
 * Dispatch a request hook, returning the (possibly replaced) request.
 *
 * The hook result is treated as a replacement only when it is a
 * *different* request object AND carries a different payload. Otherwise
 * the original reference is passed through unchanged — avoiding a copy
 * (opencode `d1cf7dd`) and avoiding a pinned reference on the hook event
 * (opencode `91b5a7c`).
 */
export async function dispatchRequestHook<Req extends ModelRequestLike>(
  request: Req,
  hook: RequestHook<Req> | undefined
): Promise<Req> {
  if (!hook) {
    return request;
  }
  const result = (await hook({ request })) ?? undefined;
  if (!result || !result.request) {
    return request;
  }
  if (result.request === request) {
    return request;
  }
  if (deepEqual(result.request, request)) {
    // Hook returned a fresh object that is structurally identical —
    // keep the original reference to let GC reclaim the copy.
    return request;
  }
  return result.request;
}

/**
 * Mutable envelope callers can use to attach a hook payload for the
 * duration of a request. Pass this to {@link runWithRequestHookPayload}
 * instead of stashing the payload on the request directly, so the ref
 * can be cleared on completion without disturbing the request body.
 */
export interface HookPayloadEnvelope<T = unknown> {
  hookPayload?: T;
}

/**
 * Run a request lifecycle with an attached hook payload, then clear the
 * payload reference in `finally` so running tools do not pin it in
 * memory (opencode `91b5a7c`).
 */
export async function runWithRequestHookPayload<T, R>(
  envelope: HookPayloadEnvelope<T>,
  payload: T,
  run: () => Promise<R>
): Promise<R> {
  envelope.hookPayload = payload;
  try {
    return await run();
  } finally {
    // Avoid holding references in event listeners after the request
    // completes.
    envelope.hookPayload = undefined;
  }
}

/**
 * Standalone cleanup helper for callers that already own their own
 * try/finally block but want the "release the payload reference" step
 * to be named and documented.
 */
export function clearHookPayload(envelope: HookPayloadEnvelope): void {
  envelope.hookPayload = undefined;
}
