/**
 * MCP OAuth loopback detection.
 *
 * Ports upstream opencode `b55f220` ("treat `*.localhost` as loopback for
 * MCP OAuth token endpoints"). A token endpoint URL whose hostname is a
 * sub-name of `.localhost` (e.g. `auth.service.localhost`) must be
 * classified as loopback per RFC 6761 so the OAuth flow is willing to
 * send the authorization code / refresh token to it over plain HTTP
 * from a dev-mode MCP server.
 *
 * Previously this helper only recognised the literal strings
 * `localhost`, `127.0.0.1`, and `::1`, which breaks local OAuth flows
 * for operators who run multiple services behind `*.localhost`
 * aliases.
 *
 * SAP AI Core note: SAP AI Core itself authenticates via the
 * `AICORE_SERVICE_KEY` client-credentials flow against SAP's identity
 * zone. This helper is only relevant to third-party MCP servers that
 * use interactive OAuth; it is a pure function and has no cost when
 * OAuth is unused.
 */

/**
 * Return `true` when `url.hostname` resolves to a loopback address per
 * RFC 6761 (`localhost` and any `.localhost` subname) OR a loopback
 * IPv4 (`127.0.0.0/8`) OR IPv6 loopback (`::1`).
 *
 * Comparison is case-insensitive so that `Localhost` / `LocalHost`
 * (common in copy-pasted dev config) are also recognised.
 */
export function isLoopback(url: URL): boolean {
  const host = url.hostname.toLowerCase();
  // RFC 6761: `localhost` and all `*.localhost` names are reserved as
  // loopback. Browsers and modern HTTP clients treat them the same way;
  // the MCP OAuth flow must do so too or dev-mode token endpoints break.
  return (
    host === 'localhost' ||
    host.endsWith('.localhost') ||
    host === '127.0.0.1' ||
    host === '::1' ||
    host.startsWith('127.')
  );
}
