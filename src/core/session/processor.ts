/**
 * Session response completeness classifier.
 *
 * Ports opencode `58eea7381 fix(cli): retry reasoning-only incomplete
 * responses`. Some SAP AI Core deployments (notably reasoning-heavy
 * models routed through the orchestration API) occasionally emit ONLY
 * reasoning / thinking tokens and then close the stream without ever
 * producing a visible assistant message. The finish reason on those
 * responses is anything except `stop`; treating the response as
 * "complete" strands the user on a blank turn.
 *
 * `evaluateCompleteness` returns a `retry` outcome for that specific
 * shape so the caller can re-issue the request instead of silently
 * accepting the empty visible payload. All other shapes pass through
 * unchanged (`{ status: 'complete' }`), keeping this classifier
 * strictly additive.
 */

export type MessagePartType = 'text' | 'reasoning' | 'thinking' | 'tool-call' | 'tool-result';

export interface MessagePart {
  type: MessagePartType;
  [key: string]: unknown;
}

export interface CompletenessInput {
  parts: readonly MessagePart[];
  /**
   * Provider-reported stream finish reason. `stop` is the only value
   * that means "the model reached a natural end"; every other value
   * (`length`, `content-filter`, `error`, `unknown`, ...) is treated
   * as potentially incomplete when combined with a reasoning-only
   * body.
   */
  finishReason?: string;
}

export type CompletenessResult =
  | { status: 'complete' }
  | { status: 'retry'; reason: 'reasoning-only' };

/**
 * True when the message body contains ONLY reasoning / thinking parts
 * (and at least one such part). An empty parts list returns `false`
 * — the "no output at all" case is handled by a separate empty-response
 * classifier, not by this helper.
 */
export function isReasoningOnly(parts: readonly MessagePart[]): boolean {
  if (parts.length === 0) {
    return false;
  }
  return parts.every((p) => p.type === 'reasoning' || p.type === 'thinking');
}

/**
 * Classify a completed streaming response. Callers wire the `retry`
 * outcome into their existing retry pump; the session store treats
 * this identically to a transient network error.
 */
export function evaluateCompleteness(input: CompletenessInput): CompletenessResult {
  const reasoningOnly = isReasoningOnly(input.parts);
  if (reasoningOnly && input.finishReason !== 'stop') {
    return { status: 'retry', reason: 'reasoning-only' };
  }
  return { status: 'complete' };
}
