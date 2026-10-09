/**
 * Embedding dimension-retry helper
 *
 * Thin wrapper around a user-supplied embedder (`EmbeddingClient`) that
 * handles the "server rejects `dimensions`" failure mode documented in
 * kilocode PR #14921. Behaviour:
 *
 *   1. Consult the per-model `DimensionCache`. If the model is known to
 *      reject `dimensions`, send the request WITHOUT it on the first
 *      attempt (saving a wasted round trip).
 *   2. Otherwise send the request WITH `dimensions`.
 *   3. If the first attempt fails with HTTP 400 / 422 — the two status
 *      codes OpenAI-compatible servers return for "unknown parameter"
 *      — retry WITHOUT `dimensions`.
 *   4. Validate the returned vector length matches the requested
 *      `dimensions`. A mismatch is a hard error — the caller cannot use
 *      the vector against existing indices.
 *   5. On a successful retry (step 3 -> 4), record the omission in the
 *      cache so future calls skip the first attempt.
 *
 * Non-400/422 errors are rethrown unchanged — retrying an auth failure
 * or a network blip without `dimensions` would not help and would
 * silently cache a wrong hint.
 *
 * Source: kilocode PR #14921, Alexi issue #1968.
 */

import { DimensionCache } from './embedding-cache.js';

/**
 * HTTP status codes that OpenAI-compatible endpoints return for "I
 * don't know this request parameter". Spec note: 400 is the strict
 * Bad Request answer; 422 is the FastAPI / Pydantic variant used by
 * vLLM and some Ollama builds.
 */
export const DIMENSION_REJECT_STATUS_CODES: readonly number[] = [400, 422];

/**
 * Request shape handed to the user-supplied `EmbeddingClient`. The
 * helper controls whether `dimensions` is present in the outgoing
 * payload — the client should forward every field it receives.
 */
export interface EmbeddingRequest {
  model: string;
  input: string;
  dimensions?: number;
}

/**
 * Minimal interface a transport must implement to plug into
 * `requestEmbedding`. Separates the retry/validation policy from the
 * SAP AI SDK, local HTTP fetch, or in-memory test transports.
 */
export type EmbeddingClient = (request: EmbeddingRequest) => Promise<number[]>;

/**
 * Options for `requestEmbedding`.
 */
export interface RequestEmbeddingOptions {
  /** The embedding model id (e.g. `text-embedding-3-small`). */
  model: string;
  /** The text to embed. */
  input: string;
  /** The expected / configured output vector length. */
  dimensions: number;
  /** The dimension-omission cache. Mutated on successful retry. */
  cache: DimensionCache;
  /** Transport used to actually talk to the embedding server. */
  client: EmbeddingClient;
  /**
   * Persist the cache after a successful omission. Defaults to `true`
   * so the hint survives across CLI runs; disable in hot-path call
   * sites that batch requests and persist once at the end.
   */
  persist?: boolean;
}

/**
 * Classifies an error thrown by `EmbeddingClient`. Returns `true` when
 * the error looks like "unknown `dimensions` parameter" and a retry
 * without `dimensions` is likely to succeed.
 *
 * Accepts a few shapes real transports throw:
 *   - `{ status: 400 }` (undici / native fetch style)
 *   - `{ statusCode: 422 }` (older libraries)
 *   - `{ response: { status: 400 } }` (axios style)
 *   - `new Error('HTTP 400: unknown field dimensions')` (plain message)
 */
export function isDimensionRejectError(err: unknown): boolean {
  if (!err || typeof err !== 'object') {
    return false;
  }

  const e = err as {
    status?: unknown;
    statusCode?: unknown;
    response?: { status?: unknown };
    message?: unknown;
  };

  const candidates: unknown[] = [e.status, e.statusCode, e.response?.status];
  for (const c of candidates) {
    if (typeof c === 'number' && DIMENSION_REJECT_STATUS_CODES.includes(c)) {
      return true;
    }
  }

  if (typeof e.message === 'string') {
    // Match either `HTTP 400` / `status: 422` style messages, or an
    // explicit mention of `dimensions` in a 4xx response body. We stay
    // conservative — a bare `400` substring is not enough on its own.
    const msg = e.message;
    const statusHit = /\b(?:HTTP\s+)?(?:status[:\s]+)?(400|422)\b/.test(msg);
    const paramHit = /dimensions?/i.test(msg);
    if (statusHit && paramHit) {
      return true;
    }
  }

  return false;
}

/**
 * Error raised when the server returned a vector whose length does not
 * match the requested `dimensions`. The caller cannot use the vector
 * against an existing index at a different dimension, so this is
 * always fatal.
 */
export class EmbeddingDimensionMismatchError extends Error {
  public readonly model: string;
  public readonly expected: number;
  public readonly actual: number;

  constructor(model: string, expected: number, actual: number) {
    super(
      `Embedding model "${model}" returned a vector of length ${actual}, expected ${expected}. ` +
        'The server likely ignored the dimensions parameter or returned a different model.'
    );
    this.name = 'EmbeddingDimensionMismatchError';
    this.model = model;
    this.expected = expected;
    this.actual = actual;
  }
}

/**
 * Send an embedding request with automatic `dimensions`-rejection
 * handling.
 *
 * See the module-level comment for the full policy.
 */
export async function requestEmbedding(options: RequestEmbeddingOptions): Promise<number[]> {
  const { model, input, dimensions, cache, client, persist = true } = options;

  if (!Number.isInteger(dimensions) || dimensions <= 0) {
    throw new TypeError(
      `requestEmbedding: dimensions must be a positive integer (got ${String(dimensions)})`
    );
  }

  const skipDimensionsFirst = cache.shouldOmit(model);

  let vector: number[];
  if (skipDimensionsFirst) {
    // We already know this model rejects `dimensions` — don't waste a
    // round trip. Note: errors here are propagated unchanged; we
    // already stripped the one parameter we know how to recover from.
    vector = await client({ model, input });
  } else {
    try {
      vector = await client({ model, input, dimensions });
    } catch (err) {
      if (!isDimensionRejectError(err)) {
        throw err;
      }
      // Retry without `dimensions`. Any error from this attempt is
      // propagated — we got as far as we can.
      vector = await client({ model, input });
      cache.recordOmission(model);
      if (persist) {
        cache.save();
      }
    }
  }

  if (vector.length !== dimensions) {
    throw new EmbeddingDimensionMismatchError(model, dimensions, vector.length);
  }

  return vector;
}
