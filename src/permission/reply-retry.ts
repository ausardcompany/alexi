/**
 * Retry helper for dropped permission replies (upstream port).
 *
 * Ports kilocode `675ed4b12` and `499a1ca5e`: permission replies published
 * on the bus could be dropped if the TUI / IDE client disconnected and
 * reconnected between the `askUser()` publish and the operator's answer.
 * When the reply is dropped the agent gets stuck waiting for a bus event
 * that will never arrive. Retrying the publish with exponential backoff
 * + jitter closes the window without introducing a hard timeout.
 *
 * This helper is deliberately transport-agnostic: it takes a `publish`
 * function so unit tests can inject a mock and so the same helper can
 * be reused if / when Alexi grows a second reply channel (e.g. WebSocket
 * for the IDE extension in addition to the in-process bus).
 *
 * Retry semantics match the AGENTS.md error contract:
 *   - The classifier is delegated to the caller via `shouldRetry`. When
 *     omitted, every failure is retried within the budget — this is
 *     safe here because the only failure mode we care about (bus drop
 *     during reconnect) is inherently transient.
 *   - Backoff is `100 * 2^attempt` ms with up to 50ms of full jitter so
 *     concurrent retriers do not collide.
 *   - The final error re-throws so callers can log / surface it if all
 *     attempts fail.
 */

import { logger } from '../utils/logger.js';

/**
 * Minimal shape of a permission reply. The helper does not inspect the
 * response; it just forwards the payload to the publisher.
 */
export interface PermissionReply {
  askId: string;
  response: unknown;
}

/**
 * Publisher contract — the function that actually delivers the reply
 * over the bus / socket / IPC channel. Callers supply their own so this
 * module has no import-time dependency on the bus module.
 */
export type ReplyPublisher = (askId: string, response: unknown) => Promise<void>;

/**
 * Options for {@link replyWithRetry}.
 */
export interface ReplyRetryOptions {
  /** Maximum number of publish attempts including the first. Default: 3. */
  maxAttempts?: number;
  /** Initial retry delay in ms; doubles each attempt. Default: 100. */
  initialDelayMs?: number;
  /** Random jitter (0..jitterMs) added to each delay. Default: 50. */
  jitterMs?: number;
  /**
   * Predicate used to decide whether a thrown error should trigger a
   * retry. Defaults to "retry every error" — safe for the bus-drop
   * case, but callers using a real transport should pass a narrower
   * classifier (see `AGENTS.md#error-classification`).
   */
  shouldRetry?: (err: unknown) => boolean;
}

const DEFAULT_MAX_ATTEMPTS = 3;
const DEFAULT_INITIAL_DELAY_MS = 100;
const DEFAULT_JITTER_MS = 50;

/**
 * Publish a permission reply with bounded exponential-backoff retries.
 *
 * @param publish - Transport-specific publisher supplied by the caller.
 * @param reply - The reply payload (ask id + response body).
 * @param opts - Optional retry tuning; sensible defaults are applied.
 * @throws The last error observed when the retry budget is exhausted.
 */
export async function replyWithRetry(
  publish: ReplyPublisher,
  reply: PermissionReply,
  opts: ReplyRetryOptions = {}
): Promise<void> {
  const maxAttempts = opts.maxAttempts ?? DEFAULT_MAX_ATTEMPTS;
  const initialDelayMs = opts.initialDelayMs ?? DEFAULT_INITIAL_DELAY_MS;
  const jitterMs = opts.jitterMs ?? DEFAULT_JITTER_MS;
  const shouldRetry = opts.shouldRetry ?? (() => true);

  let lastError: unknown;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      await publish(reply.askId, reply.response);
      return;
    } catch (err) {
      lastError = err;
      if (!shouldRetry(err) || attempt === maxAttempts - 1) {
        break;
      }
      const delay = initialDelayMs * 2 ** attempt + Math.random() * jitterMs;
      logger.warn(
        `[permission] reply publish failed for ${reply.askId} (attempt ${attempt + 1}/${maxAttempts}); ` +
          `retrying in ${Math.round(delay)}ms: ${err instanceof Error ? err.message : String(err)}`
      );
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  throw lastError;
}
