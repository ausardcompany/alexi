/**
 * OpenAI-compatible embeddings client with endpoint-capability detection.
 *
 * Backports upstream kilo-indexing hardening (commits 0a5c6df34, 52936e8a6,
 * da1927014, 4d6b6342b, 43fb46bf3) that teaches the embedder to:
 *
 * 1. Tolerate endpoints (SAP AI Core-fronted OpenAI deployments, some Azure
 *    deployments) that reject the `dimensions` request parameter — retry once
 *    without it on an unambiguous 400/422 rejection and remember per-endpoint.
 * 2. Surface a useful error envelope from non-standard failure responses
 *    instead of a bare status code.
 * 3. Guard the success-path response shape before decoding so a malformed
 *    body never crashes the caller.
 *
 * Relevant for Alexi's SAP AI Core integration where some proxied embedding
 * deployments ignore or reject the `dimensions` field.
 */

export interface EmbeddingRequestOptions {
  model: string;
  input: string | string[];
  dimensions?: number;
}

interface CachedEndpointCapability {
  acceptsDimensions: boolean;
  // Only cache the omission after we've seen a usable response without dimensions.
  confirmedUsableFallback: boolean;
}

const endpointCapabilityCache = new Map<string, CachedEndpointCapability>();

/**
 * Reset the per-endpoint capability cache. Intended for tests.
 */
export function resetEndpointCapabilityCache(): void {
  endpointCapabilityCache.clear();
}

export async function callEmbeddingEndpoint(
  endpoint: string,
  apiKey: string,
  opts: EmbeddingRequestOptions
): Promise<number[][]> {
  const cached = endpointCapabilityCache.get(endpoint);
  const includeDimensions = opts.dimensions !== undefined && (!cached || cached.acceptsDimensions);

  const body: Record<string, unknown> = {
    model: opts.model,
    input: opts.input,
  };
  if (includeDimensions && opts.dimensions !== undefined) {
    body.dimensions = opts.dimensions;
  }

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  // Project response text once per request so we can both surface a useful
  // error envelope and still decode embeddings if the status is 2xx.
  const rawText = await res.text();

  if (!res.ok) {
    // If dimensions was the problem, retry once without it and remember.
    if (includeDimensions && looksLikeDimensionsRejection(res.status, rawText)) {
      endpointCapabilityCache.set(endpoint, {
        acceptsDimensions: false,
        confirmedUsableFallback: false,
      });
      return callEmbeddingEndpoint(endpoint, apiKey, {
        ...opts,
        dimensions: undefined,
      });
    }
    throw new Error(
      `Embedding endpoint ${endpoint} failed: ${res.status} ${surfaceErrorEnvelope(rawText)}`
    );
  }

  // Guard response shape before decoding.
  let parsed: unknown;
  try {
    parsed = JSON.parse(rawText);
  } catch {
    throw new Error(`Embedding endpoint ${endpoint} returned non-JSON body`);
  }

  const embeddings = decodeEmbeddings(parsed);
  if (embeddings.length === 0) {
    throw new Error(`Embedding endpoint ${endpoint} returned no vectors`);
  }

  // Only confirm the dimensions omission once we have a usable response.
  if (!includeDimensions && opts.dimensions !== undefined) {
    endpointCapabilityCache.set(endpoint, {
      acceptsDimensions: false,
      confirmedUsableFallback: true,
    });
  }

  return embeddings;
}

export function looksLikeDimensionsRejection(status: number, body: string): boolean {
  if (status !== 400 && status !== 422) {
    return false;
  }
  return (
    /dimensions?/i.test(body) && /(unsupported|invalid|not allowed|unknown|rejected)/i.test(body)
  );
}

export function surfaceErrorEnvelope(body: string): string {
  try {
    const j = JSON.parse(body) as { error?: { message?: unknown }; message?: unknown };
    if (j?.error?.message) {
      return String(j.error.message);
    }
    if (j?.message) {
      return String(j.message);
    }
  } catch {
    // Not JSON — fall through to the raw-body preview below.
  }
  return body.slice(0, 500);
}

export function decodeEmbeddings(parsed: unknown): number[][] {
  if (!parsed || typeof parsed !== 'object') {
    return [];
  }
  const data = (parsed as { data?: unknown }).data;
  if (!Array.isArray(data)) {
    return [];
  }
  const out: number[][] = [];
  for (const row of data) {
    const emb = (row as { embedding?: unknown })?.embedding;
    if (Array.isArray(emb) && emb.every((n) => typeof n === 'number')) {
      out.push(emb as number[]);
    }
  }
  return out;
}
