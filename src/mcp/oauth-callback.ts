/**
 * MCP OAuth sign-in URL hardening.
 *
 * Ports upstream kilocode `82926fb30` ("fix(cli): restrict browser and
 * MCP OAuth URLs to HTTP(S)"). An attacker-controlled MCP server can
 * otherwise supply a `javascript:`, `file://`, `ms-msdt:`, or UNC
 * authorization URL in its OAuth discovery metadata; when Alexi opens
 * that URL in the operator's browser, the operator gets an arbitrary-
 * scheme invocation (XSS, local file disclosure, or RCE via protocol
 * handlers — see CVE-2022-30190 "Follina" for the pattern).
 *
 * Defense in depth: callers MUST validate the authorization URL BEFORE
 * handing it to {@link openUrl}, since a URL that rejects at open time
 * has already round-tripped through logging + telemetry (and might
 * have been printed to the terminal). {@link assertHttpUrl} is the
 * sanctioned validator; it mirrors the scheme allow-list used in
 * {@link ../core/open.ts}.
 *
 * SAP AI Core note: SAP AI Core itself authenticates via the
 * `AICORE_SERVICE_KEY` client-credentials flow and never issues an
 * interactive OAuth redirect. This surface is only exercised when the
 * operator wires a third-party OAuth-protected MCP server (e.g.
 * GitHub, Linear) into Alexi.
 */

import { openUrl } from '../core/open.js';

/**
 * Parse `input` as a URL and assert the scheme is `http:` or `https:`.
 *
 * Throws when:
 *   - `input` is not a parseable URL
 *   - the URL scheme is anything other than http(s)
 *
 * `label` is included in the error message so operators can tell which
 * field in the MCP discovery metadata failed (e.g.
 * `authorization_endpoint`, `token_endpoint`, `registration_endpoint`).
 */
export function assertHttpUrl(input: string, label: string): URL {
  if (typeof input !== 'string' || input.length === 0) {
    throw new Error(`${label} is not a valid URL`);
  }
  // Reject UNC paths outright — some Node versions on Windows will
  // otherwise accept `\\server\share\file.html` as a `file:` URL after
  // implicit normalization.
  if (input.startsWith('\\\\') || input.startsWith('//')) {
    throw new Error(`${label} must use http or https: ${input}`);
  }
  if (typeof URL.canParse === 'function' && !URL.canParse(input)) {
    throw new Error(`${label} is not a valid URL`);
  }
  let url: URL;
  try {
    url = new URL(input);
  } catch {
    throw new Error(`${label} is not a valid URL`);
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new Error(`${label} must use http or https: ${input}`);
  }
  return url;
}

/**
 * Start an MCP OAuth sign-in flow by opening the given authorization
 * URL in the operator's default browser.
 *
 * Validates the URL on receipt (so a bad URL never reaches the shell /
 * launcher) AND relies on {@link openUrl}'s own scheme allow-list as
 * belt-and-braces defense.
 *
 * Rejects with an `Error` when the authorization URL is not an http(s)
 * URL, or when the platform launcher fails to spawn.
 */
export async function startMcpOAuth(
  authorizationUrl: string,
  options: { label?: string } = {}
): Promise<void> {
  const label = options.label ?? 'MCP authorization URL';
  // Validate once up-front — fails fast and gives operators a clear
  // field-level error before anything is spawned.
  assertHttpUrl(authorizationUrl, label);
  // Second gate: openUrl re-parses + re-validates. Keeps this helper
  // safe even if a future refactor drops the explicit assert above.
  await openUrl(authorizationUrl);
}
