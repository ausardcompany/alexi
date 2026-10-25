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

/**
 * Scoped fetch instrumentation for an SSE probe.
 *
 * Ports upstream kilocode `432462088` and `70354f039` ("fix(cli): MCP
 * SSE probe scoped to stream request and redirects"). Previously the
 * probe installed a global `fetch` wrapper that intercepted EVERY
 * concurrent request made by the process while the probe was running
 * — including unrelated SAP AI Core traffic and other MCP tool calls.
 * The fix scopes interception to the probe's own request URL plus any
 * redirect hops the server actually serves.
 *
 * This helper is used by follow-up wiring that replaces Alexi's HEAD
 * probe with a real transport handshake. Pure in-memory bookkeeping;
 * no I/O inside the helper itself.
 */
export class ScopedProbeFetch {
  private readonly visited = new Set<string>();

  constructor(initialUrl: string) {
    this.visited.add(normalizeUrl(initialUrl));
  }

  /**
   * `true` when the given request URL is part of this probe's traffic
   * (initial URL or a recorded redirect hop). The caller — typically
   * a wrapper around `globalThis.fetch` — passes through unchanged
   * fetches for which this returns `false`.
   */
  owns(requestUrl: string | URL): boolean {
    const key = normalizeUrl(typeof requestUrl === 'string' ? requestUrl : requestUrl.href);
    return this.visited.has(key);
  }

  /**
   * Record a redirect hop. Callers invoke this once per observed
   * redirect so subsequent fetches to the hop URL are still
   * recognised as probe traffic.
   */
  recordRedirect(url: string | URL): void {
    this.visited.add(normalizeUrl(typeof url === 'string' ? url : url.href));
  }

  /** Snapshot of recorded URLs — primarily for test assertions. */
  snapshot(): readonly string[] {
    return Array.from(this.visited);
  }
}

/**
 * Normalise a URL for scope matching. Strips the `#fragment` since
 * fetch never sees it, and lower-cases the scheme + host so trivial
 * casing differences in `Location:` headers don't bypass scope checks.
 */
function normalizeUrl(input: string): string {
  if (typeof URL.canParse === 'function' && !URL.canParse(input)) {
    return input;
  }
  try {
    const u = new URL(input);
    u.hash = '';
    // URL already lower-cases scheme + host, but be explicit so a
    // caller passing a pre-formatted string doesn't trip the check.
    u.protocol = u.protocol.toLowerCase();
    return u.href;
  } catch {
    return input;
  }
}
