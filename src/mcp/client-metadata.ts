/**
 * MCP Client ID Metadata Document (CIMD) support.
 *
 * Ports the upstream opencode 2026-09 sync (new
 * `packages/opencode/src/kilocode/mcp/client-metadata.ts` + OAuth-provider
 * wiring, upstream commit range 18ef3cc..0f54984). CIMD is the MCP spec
 * extension in which an OAuth `client_id` is a URL that resolves to a
 * JSON document describing the client (redirect URIs, grant types,
 * scopes, etc.). Fetching the document lets an MCP OAuth flow start
 * without any static registration on the server side.
 *
 * SAP AI Core note
 * ----------------
 * SAP AI Core authenticates via `AICORE_SERVICE_KEY` (client-credentials
 * against SAP's identity zone) — CIMD is only relevant for third-party
 * MCP servers that require an interactive OAuth flow. This module is
 * therefore optional: it is imported by `oauth-provider.ts` only when
 * the caller's `client_id` looks like a `http(s)://` URL.
 */

import { z } from 'zod';

/**
 * Shape of a Client ID Metadata Document as defined by the MCP CIMD
 * spec (a subset of RFC 7591 dynamic-client-registration metadata).
 *
 * Only `client_id` and `redirect_uris` are required; every other field
 * is optional and passed through untouched to whichever OAuth library
 * the caller uses.
 */
export const ClientMetadataDocumentSchema = z.object({
  client_id: z.string().min(1),
  client_name: z.string().optional(),
  redirect_uris: z.array(z.string()).min(1),
  grant_types: z.array(z.string()).optional(),
  response_types: z.array(z.string()).optional(),
  scope: z.string().optional(),
  token_endpoint_auth_method: z.string().optional(),
});

export type ClientMetadataDocument = z.infer<typeof ClientMetadataDocumentSchema>;

/**
 * Fetch a Client ID Metadata Document from `url` and validate it against
 * the CIMD schema. `signal` is forwarded to `fetch` so a caller-supplied
 * abort signal cancels the network request promptly.
 *
 * Errors:
 *   - Non-2xx HTTP status → thrown as `Error('CIMD fetch failed: <status> <statusText>')`
 *   - Malformed JSON      → propagated from `response.json()`
 *   - Schema mismatch     → propagated from `zod.parse()`
 *
 * The function does NOT retry — CIMD documents are effectively static
 * per client, and a transient network failure is the caller's problem
 * to handle (the surrounding OAuth flow will fail with a descriptive
 * message either way).
 */
export async function fetchClientMetadata(
  url: string,
  signal?: AbortSignal
): Promise<ClientMetadataDocument> {
  const res = await fetch(url, {
    signal,
    headers: { accept: 'application/json' },
  });
  if (!res.ok) {
    throw new Error(`CIMD fetch failed: ${res.status} ${res.statusText}`);
  }
  const body: unknown = await res.json();
  return ClientMetadataDocumentSchema.parse(body);
}

/**
 * Returns `true` when `clientId` looks like an `http(s)://` URL — the
 * signal that the caller should resolve it as a Client ID Metadata
 * Document rather than treating it as an opaque registered client id.
 *
 * Purely a shape check; the actual fetch happens in `fetchClientMetadata`.
 */
export function isClientMetadataUrl(clientId: string): boolean {
  return /^https?:\/\//i.test(clientId);
}
