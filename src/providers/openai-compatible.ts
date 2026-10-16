/**
 * OpenAI-compatible chat utilities (opt-in).
 *
 * Ports upstream kilocode `8d5c126dc` — makes the normalization of
 * `null` tool-content opt-in rather than always-on.
 *
 * Rationale: a few strict OpenAI-compatible endpoints (early SAP AI
 * Core deployments, some proxy wrappers) reject tool-role messages
 * that carry `null` content, requiring an empty string instead.
 * Historically Alexi (and upstream) would unconditionally rewrite
 * `null` → `""` on tool messages. That caused regressions where
 * providers that legitimately return `null` content (indicating "no
 * body, see tool_calls") saw their payloads mangled.
 *
 * The fix is to gate the normalization behind an explicit flag so
 * strict-OpenAI deployments opt in without regressing providers that
 * already return correct shapes. Default behaviour is "do not
 * normalize" — matching upstream.
 *
 * SAP AI Core routing is unaffected unless the provider setting
 * `normalizeNullToolContent: true` is set on the deployment config.
 */

/**
 * Minimal chat message shape used by the normalizer. Deliberately
 * loose so callers can pass through SDK-shaped and plain-shaped
 * messages interchangeably.
 */
export interface OpenAICompatibleMessage {
  role: string;
  content: unknown;
  [key: string]: unknown;
}

/**
 * Options accepted by {@link normalizeToolContent}.
 */
export interface NormalizeToolContentOptions {
  /**
   * When `true`, replaces a tool-role message's `null` content with an
   * empty string. When `false` or omitted, the message passes through
   * untouched. Default: `false` (preserve upstream shape).
   */
  normalizeNullToolContent?: boolean;
}

/**
 * Normalize a single OpenAI-compatible message. Returns the input
 * unchanged unless `options.normalizeNullToolContent` is `true` AND the
 * message is a tool-role message with explicit `null` content.
 *
 * Never mutates the input — returns a shallow copy on normalization.
 *
 * @param message - The message to normalize.
 * @param options - Normalization options; omit to preserve shape.
 */
export function normalizeToolContent<T extends OpenAICompatibleMessage>(
  message: T,
  options?: NormalizeToolContentOptions
): T {
  if (!options?.normalizeNullToolContent) {
    return message;
  }
  if (message.role === 'tool' && (message.content === null || message.content === undefined)) {
    return { ...message, content: '' };
  }
  return message;
}

/**
 * Normalize an array of messages. Convenience wrapper around
 * {@link normalizeToolContent}; returns a new array when any message
 * was rewritten, otherwise returns a shallow copy of the input.
 */
export function normalizeToolContentAll<T extends OpenAICompatibleMessage>(
  messages: readonly T[],
  options?: NormalizeToolContentOptions
): T[] {
  if (!options?.normalizeNullToolContent) {
    return messages.slice();
  }
  return messages.map((m) => normalizeToolContent(m, options));
}
