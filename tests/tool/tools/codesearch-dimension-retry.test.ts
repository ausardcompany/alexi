/**
 * Tests for the embedding dimension-retry helper and the per-model
 * omission cache (issue #1968, kilocode PR #14921).
 *
 * These tests cover the retry policy, vector length validation,
 * cache hits short-circuiting the first attempt, and that cache
 * persistence round-trips through disk.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as fs from 'fs';
import * as fsp from 'fs/promises';
import * as path from 'path';
import * as os from 'os';
import * as http from 'http';
import type { AddressInfo } from 'net';

import {
  requestEmbedding,
  isDimensionRejectError,
  EmbeddingDimensionMismatchError,
  type EmbeddingClient,
  type EmbeddingRequest,
} from '../../../src/providers/embeddings.js';
import { DimensionCache } from '../../../src/providers/embedding-cache.js';
import { requestCodeEmbedding } from '../../../src/tool/tools/codesearch.js';

const DIMS = 4;

/** Build a vector of the given length filled with deterministic floats. */
function fakeVector(length: number): number[] {
  return Array.from({ length }, (_, i) => i / length);
}

/** Fresh in-memory cache rooted at a unique temp JSON path per test. */
function freshCache(dir: string): DimensionCache {
  return new DimensionCache(path.join(dir, 'embedding-cache.json'));
}

describe('isDimensionRejectError', () => {
  it('matches undici-style 400 status errors', () => {
    expect(isDimensionRejectError({ status: 400 })).toBe(true);
  });

  it('matches older-library 422 statusCode errors', () => {
    expect(isDimensionRejectError({ statusCode: 422 })).toBe(true);
  });

  it('matches axios-style nested response.status', () => {
    expect(isDimensionRejectError({ response: { status: 400 } })).toBe(true);
  });

  it('matches a plain Error whose message mentions status + dimensions', () => {
    const err = new Error('HTTP 400: unknown field dimensions');
    expect(isDimensionRejectError(err)).toBe(true);
  });

  it('ignores unrelated HTTP errors (401, 500, network)', () => {
    expect(isDimensionRejectError({ status: 401 })).toBe(false);
    expect(isDimensionRejectError({ status: 500 })).toBe(false);
    expect(isDimensionRejectError(new Error('ECONNRESET'))).toBe(false);
    expect(isDimensionRejectError(new Error('400 bad request'))).toBe(false);
  });

  it('safely rejects non-object inputs', () => {
    expect(isDimensionRejectError(null)).toBe(false);
    expect(isDimensionRejectError(undefined)).toBe(false);
    expect(isDimensionRejectError('string')).toBe(false);
    expect(isDimensionRejectError(42)).toBe(false);
  });
});

describe('requestEmbedding', () => {
  let tempDir: string;
  let cache: DimensionCache;

  beforeEach(async () => {
    tempDir = await fsp.mkdtemp(path.join(os.tmpdir(), 'dim-retry-'));
    cache = freshCache(tempDir);
  });

  afterEach(async () => {
    await fsp.rm(tempDir, { recursive: true, force: true });
  });

  it('sends dimensions on the first attempt and returns the vector', async () => {
    const seen: EmbeddingRequest[] = [];
    const client: EmbeddingClient = async (req) => {
      seen.push(req);
      return fakeVector(DIMS);
    };

    const vec = await requestEmbedding({
      model: 'text-embedding-3-small',
      input: 'hello',
      dimensions: DIMS,
      cache,
      client,
    });

    expect(vec).toHaveLength(DIMS);
    expect(seen).toHaveLength(1);
    expect(seen[0].dimensions).toBe(DIMS);
    expect(cache.shouldOmit('text-embedding-3-small')).toBe(false);
  });

  it('retries without dimensions on HTTP 400 and caches the omission', async () => {
    const seen: EmbeddingRequest[] = [];
    const client: EmbeddingClient = async (req) => {
      seen.push(req);
      if (req.dimensions !== undefined) {
        const err: Error & { status: number } = Object.assign(
          new Error('unknown field dimensions'),
          { status: 400 }
        );
        throw err;
      }
      return fakeVector(DIMS);
    };

    const vec = await requestEmbedding({
      model: 'nomic-embed-text',
      input: 'hello',
      dimensions: DIMS,
      cache,
      client,
    });

    expect(vec).toHaveLength(DIMS);
    expect(seen).toHaveLength(2);
    expect(seen[0].dimensions).toBe(DIMS);
    expect(seen[1].dimensions).toBeUndefined();
    expect(cache.shouldOmit('nomic-embed-text')).toBe(true);
  });

  it('retries without dimensions on HTTP 422', async () => {
    const seen: EmbeddingRequest[] = [];
    const client: EmbeddingClient = async (req) => {
      seen.push(req);
      if (req.dimensions !== undefined) {
        throw Object.assign(new Error('unprocessable entity'), { statusCode: 422 });
      }
      return fakeVector(DIMS);
    };

    const vec = await requestEmbedding({
      model: 'bge-small',
      input: 'x',
      dimensions: DIMS,
      cache,
      client,
    });

    expect(vec).toHaveLength(DIMS);
    expect(cache.shouldOmit('bge-small')).toBe(true);
  });

  it('skips the dimensions-first attempt when the model is cached as rejecting', async () => {
    cache.recordOmission('cached-model');

    const seen: EmbeddingRequest[] = [];
    const client: EmbeddingClient = async (req) => {
      seen.push(req);
      return fakeVector(DIMS);
    };

    const vec = await requestEmbedding({
      model: 'cached-model',
      input: 'hi',
      dimensions: DIMS,
      cache,
      client,
    });

    expect(vec).toHaveLength(DIMS);
    expect(seen).toHaveLength(1);
    expect(seen[0].dimensions).toBeUndefined();
  });

  it('rejects vectors with the wrong length', async () => {
    const client: EmbeddingClient = async () => fakeVector(DIMS + 1);
    await expect(
      requestEmbedding({
        model: 'bad-model',
        input: 'x',
        dimensions: DIMS,
        cache,
        client,
      })
    ).rejects.toBeInstanceOf(EmbeddingDimensionMismatchError);
  });

  it('propagates non-retryable errors unchanged', async () => {
    const client: EmbeddingClient = async () => {
      throw Object.assign(new Error('unauthorized'), { status: 401 });
    };
    await expect(
      requestEmbedding({
        model: 'auth-fail-model',
        input: 'x',
        dimensions: DIMS,
        cache,
        client,
      })
    ).rejects.toThrow('unauthorized');
    expect(cache.shouldOmit('auth-fail-model')).toBe(false);
  });

  it('rejects non-positive-integer dimensions as a programmer error', async () => {
    const client: EmbeddingClient = async () => fakeVector(DIMS);
    await expect(
      requestEmbedding({ model: 'm', input: 'x', dimensions: 0, cache, client })
    ).rejects.toBeInstanceOf(TypeError);
    await expect(
      requestEmbedding({ model: 'm', input: 'x', dimensions: 1.5, cache, client })
    ).rejects.toBeInstanceOf(TypeError);
  });

  it('persists the omission to disk when persist=true (default)', async () => {
    const client: EmbeddingClient = async (req) => {
      if (req.dimensions !== undefined) {
        throw Object.assign(new Error('bad dimensions'), { status: 400 });
      }
      return fakeVector(DIMS);
    };
    await requestEmbedding({
      model: 'persisted-model',
      input: 'x',
      dimensions: DIMS,
      cache,
      client,
    });

    const reloaded = freshCache(tempDir);
    reloaded.load();
    expect(reloaded.shouldOmit('persisted-model')).toBe(true);
  });

  it('does not touch disk when persist=false', async () => {
    const client: EmbeddingClient = async (req) => {
      if (req.dimensions !== undefined) {
        throw Object.assign(new Error('bad dimensions'), { status: 400 });
      }
      return fakeVector(DIMS);
    };
    await requestEmbedding({
      model: 'ephemeral-model',
      input: 'x',
      dimensions: DIMS,
      cache,
      client,
      persist: false,
    });

    const reloaded = freshCache(tempDir);
    reloaded.load();
    expect(reloaded.shouldOmit('ephemeral-model')).toBe(false);
  });
});

describe('DimensionCache persistence', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await fsp.mkdtemp(path.join(os.tmpdir(), 'dim-cache-'));
  });

  afterEach(async () => {
    await fsp.rm(tempDir, { recursive: true, force: true });
  });

  it('round-trips entries through save/load', () => {
    const cache = freshCache(tempDir);
    cache.recordOmission('m1');
    cache.recordOmission('m2');
    cache.save();

    const reloaded = freshCache(tempDir);
    reloaded.load();
    expect(reloaded.shouldOmit('m1')).toBe(true);
    expect(reloaded.shouldOmit('m2')).toBe(true);
    expect(reloaded.shouldOmit('m3')).toBe(false);
  });

  it('creates the parent directory on save', () => {
    const nested = path.join(tempDir, 'nested', 'dir', 'embedding-cache.json');
    const cache = new DimensionCache(nested);
    cache.recordOmission('m1');
    cache.save();
    expect(fs.existsSync(nested)).toBe(true);
  });

  it('ignores a missing file on load', () => {
    const cache = freshCache(tempDir);
    cache.load(); // no file yet
    expect(cache.shouldOmit('anything')).toBe(false);
  });

  it('ignores a corrupt file on load without throwing', () => {
    const file = path.join(tempDir, 'embedding-cache.json');
    fs.writeFileSync(file, '{not valid json', 'utf-8');
    const cache = new DimensionCache(file);
    cache.load();
    expect(cache.shouldOmit('anything')).toBe(false);
  });

  it('ignores a file with the wrong schema version', () => {
    const file = path.join(tempDir, 'embedding-cache.json');
    fs.writeFileSync(file, JSON.stringify({ version: 99, omitDimensions: { m1: true } }), 'utf-8');
    const cache = new DimensionCache(file);
    cache.load();
    expect(cache.shouldOmit('m1')).toBe(false);
  });

  it('clear removes a single model and clearAll wipes memory', () => {
    const cache = freshCache(tempDir);
    cache.recordOmission('m1');
    cache.recordOmission('m2');
    cache.clear('m1');
    expect(cache.shouldOmit('m1')).toBe(false);
    expect(cache.shouldOmit('m2')).toBe(true);
    cache.clearAll();
    expect(cache.shouldOmit('m2')).toBe(false);
  });
});

describe('codesearch requestCodeEmbedding wrapper', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await fsp.mkdtemp(path.join(os.tmpdir(), 'codesearch-emb-'));
  });

  afterEach(async () => {
    await fsp.rm(tempDir, { recursive: true, force: true });
  });

  it('delegates to requestEmbedding with the supplied cache', async () => {
    const cache = freshCache(tempDir);
    const client = vi.fn<EmbeddingClient>(async (_req) => fakeVector(DIMS));
    const vec = await requestCodeEmbedding('m', 'input', DIMS, client, cache);
    expect(vec).toHaveLength(DIMS);
    expect(client).toHaveBeenCalledOnce();
    expect(client.mock.calls[0][0].dimensions).toBe(DIMS);
  });
});

/**
 * Integration test: spin up a real HTTP server that mimics the LM
 * Studio behaviour (returns 400 when `dimensions` is present, serves a
 * valid embedding when it is omitted) and verify the full pipeline
 * recovers and caches the result.
 */
describe('requestEmbedding against a dimension-rejecting mock server', () => {
  let tempDir: string;
  let server: http.Server;
  let baseUrl: string;
  let hitCount: number;
  let sawDimensionsOnLastHit: boolean | undefined;

  beforeEach(async () => {
    tempDir = await fsp.mkdtemp(path.join(os.tmpdir(), 'dim-integration-'));
    hitCount = 0;
    sawDimensionsOnLastHit = undefined;

    server = http.createServer((req, res) => {
      hitCount += 1;
      let body = '';
      req.on('data', (chunk) => {
        body += String(chunk);
      });
      req.on('end', () => {
        let payload: { input?: string; model?: string; dimensions?: number };
        try {
          payload = JSON.parse(body) as typeof payload;
        } catch {
          res.statusCode = 400;
          res.end('bad json');
          return;
        }
        sawDimensionsOnLastHit = payload.dimensions !== undefined;
        if (payload.dimensions !== undefined) {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          res.end(
            JSON.stringify({
              error: {
                message: "'dimensions' is not supported by this model",
                type: 'invalid_request_error',
              },
            })
          );
          return;
        }
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(
          JSON.stringify({
            data: [{ embedding: fakeVector(DIMS), index: 0 }],
            model: payload.model,
          })
        );
      });
    });
    await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
    const addr = server.address() as AddressInfo;
    baseUrl = `http://127.0.0.1:${addr.port}/v1/embeddings`;
  });

  afterEach(async () => {
    await new Promise<void>((resolve) => server.close(() => resolve()));
    await fsp.rm(tempDir, { recursive: true, force: true });
  });

  function makeHttpClient(): EmbeddingClient {
    return async (req) => {
      const res = await fetch(baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req),
      });
      if (!res.ok) {
        const text = await res.text();
        const err: Error & { status: number } = Object.assign(
          new Error(`HTTP ${res.status}: ${text}`),
          { status: res.status }
        );
        throw err;
      }
      const payload = (await res.json()) as { data: Array<{ embedding: number[] }> };
      return payload.data[0].embedding;
    };
  }

  it('recovers from a 400 and succeeds on retry', async () => {
    const cache = freshCache(tempDir);
    const client = makeHttpClient();

    const vec = await requestEmbedding({
      model: 'lmstudio-model',
      input: 'hello world',
      dimensions: DIMS,
      cache,
      client,
    });

    expect(vec).toHaveLength(DIMS);
    expect(hitCount).toBe(2);
    expect(sawDimensionsOnLastHit).toBe(false);
    expect(cache.shouldOmit('lmstudio-model')).toBe(true);
  });

  it('skips the first attempt on a second call thanks to the cache', async () => {
    const cache = freshCache(tempDir);
    const client = makeHttpClient();

    await requestEmbedding({
      model: 'lmstudio-model',
      input: 'first',
      dimensions: DIMS,
      cache,
      client,
    });
    expect(hitCount).toBe(2);

    hitCount = 0;
    await requestEmbedding({
      model: 'lmstudio-model',
      input: 'second',
      dimensions: DIMS,
      cache,
      client,
    });

    expect(hitCount).toBe(1);
    expect(sawDimensionsOnLastHit).toBe(false);
  });
});
