/**
 * SSE probe helpers.
 *
 * Ports two related upstream fixes for the MCP SSE / streamable-HTTP
 * connect probe (kilocode 2026-09 sync):
 *
 * 1. **Case-insensitive `content-type` matching.** Upstream previously
 *    string-matched the response header verbatim (`text/event-stream`)
 *    which missed valid `Content-Type: Text/Event-Stream` / mixed-case
 *    headers and `application/json` payloads. Servers that terminate
 *    proxies (nginx, Cloudflare, SAP AI Core's fabric) routinely
 *    normalise headers to Title-Case or leading-uppercase forms.
 * 2. **Bounded, non-retrying probe fall-through.** When the probe
 *    responds with a non-SSE content-type, callers must NOT keep
 *    retrying (the peer is reachable — retrying is wasted budget).
 *    {@link classifyProbeContentType} lets the caller decide whether
 *    the response is an SSE handshake (`sse`), a JSON-RPC streamable
 *    HTTP endpoint (`json`), or something unexpected (`other`) that
 *    should surface as a permanent config error rather than being
 *    retried.
 *
 * Alexi's current remote-transport probe (`McpClientManager.connectRemote`)
 * uses `HEAD` and does not read the body, so it never inspected the
 * content-type in the first place. This module is exported for the
 * follow-up wiring that will replace the `HEAD` probe with a real
 * transport handshake — the classifier is agnostic to how the caller
 * obtained the header and unit-testable in isolation.
 */

/**
 * Kind of MCP endpoint we detected from the probe's `Content-Type`.
 *
 * - `sse`: `text/event-stream` (any case) — legacy SSE transport.
 * - `json`: `application/json` (any case) — streamable-HTTP JSON-RPC.
 * - `other`: anything else, including a missing header. Callers should
 *   treat this as a permanent misconfiguration, not a transient blip.
 */
export type ProbeContentTypeKind = 'sse' | 'json' | 'other';

/**
 * Classify a raw HTTP `Content-Type` value into an MCP endpoint kind.
 *
 * Trims trailing parameters (`; charset=utf-8`) and lower-cases the
 * media type before matching so `Text/Event-Stream; charset=utf-8`,
 * `text/event-stream`, and `TEXT/EVENT-STREAM` all resolve to `'sse'`.
 * A missing / empty header returns `'other'` — the peer answered with
 * a status code but omitted the content type, which is not a transport
 * we can safely handshake with.
 */
export function classifyProbeContentType(
  contentType: string | null | undefined
): ProbeContentTypeKind {
  if (typeof contentType !== 'string') {
    return 'other';
  }
  const media = contentType.split(';', 1)[0]?.trim().toLowerCase() ?? '';
  if (media === 'text/event-stream') {
    return 'sse';
  }
  if (media === 'application/json') {
    return 'json';
  }
  return 'other';
}

/**
 * Return true when the given raw `Content-Type` header looks like an
 * SSE stream, regardless of case or trailing parameters. Convenience
 * wrapper around {@link classifyProbeContentType} for the common
 * "am I talking to an SSE endpoint?" check.
 */
export function isSseContentType(contentType: string | null | undefined): boolean {
  return classifyProbeContentType(contentType) === 'sse';
}
