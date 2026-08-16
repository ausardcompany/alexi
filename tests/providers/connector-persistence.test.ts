/**
 * Tests for connector auth state persistence (issue #1401).
 *
 * `loadConnectorState` / `saveConnectorState` provide a JSON file at
 * `~/.alexi/connectors.json` so users do not have to re-authenticate
 * on every session start. These tests exercise:
 *
 *  - save/load roundtrip (state persisted and restored);
 *  - expired-token pruning respects `TOKEN_EXPIRY_SKEW_MS` (30s);
 *  - corrupted file handled gracefully (fresh start, no throw);
 *  - missing file yields an empty snapshot;
 *  - `persistAuthTokens: false` disables both save and load;
 *  - file permissions `0600` on POSIX;
 *  - merge semantics — saving one provider preserves others;
 *  - `initializeConnectorStore` hydrates the in-memory store;
 *  - `refreshAccessToken` writes broader connector state on refresh.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';

// Toggle `persistAuthTokens` per test.
const persistAuthTokensMock = vi.fn(() => true);
vi.mock('../../src/config/userConfig.js', async () => {
  const actual = await vi.importActual<typeof import('../../src/config/userConfig.js')>(
    '../../src/config/userConfig.js'
  );
  return {
    ...actual,
    getConfigPersistAuthTokens: () => persistAuthTokensMock(),
  };
});

import {
  loadConnectorState,
  saveConnectorState,
  setConnectorStatePath,
  resetConnectorStatePath,
  getConnectorStatePath,
  initializeConnectorStore,
  setConnectorStore,
  createInMemoryConnectorStore,
  getConnectorStore,
  type ConnectorState,
  type ConnectorStateFile,
} from '../../src/providers/connectorStore.js';
import { refreshAccessToken, type FetchLike } from '../../src/providers/auth.js';

function makeFetch(body: unknown, status = 200): FetchLike {
  return async () => ({
    ok: status >= 200 && status < 300,
    status,
    statusText: 'OK',
    text: async () => JSON.stringify(body),
  });
}

describe('connectorStore persistence', () => {
  let tmpDir: string;

  beforeEach(async () => {
    tmpDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'alexi-connector-'));
    setConnectorStatePath(path.join(tmpDir, 'connectors.json'));
    setConnectorStore(createInMemoryConnectorStore());
    persistAuthTokensMock.mockReturnValue(true);
  });

  afterEach(async () => {
    resetConnectorStatePath();
    setConnectorStore(createInMemoryConnectorStore());
    await fs.promises.rm(tmpDir, { recursive: true, force: true });
    vi.restoreAllMocks();
  });

  describe('save/load roundtrip', () => {
    it('persists and restores connector state', async () => {
      const state: Record<string, ConnectorState> = {
        'sap-ai-core': {
          accessToken: 'bearer-1',
          refreshToken: 'refresh-1',
          expiry: Date.now() + 3600 * 1000,
        },
      };
      await saveConnectorState(state);

      const loaded = await loadConnectorState();
      expect(loaded['sap-ai-core']).toBeDefined();
      expect(loaded['sap-ai-core'].accessToken).toBe('bearer-1');
      expect(loaded['sap-ai-core'].refreshToken).toBe('refresh-1');
      expect(loaded['sap-ai-core'].expiry).toBe(state['sap-ai-core'].expiry);
    });

    it('writes the documented v1 file shape', async () => {
      const expiry = Date.now() + 3600 * 1000;
      await saveConnectorState({
        connectorA: { accessToken: 'ta', refreshToken: 'ra', expiry },
      });
      const raw = await fs.promises.readFile(getConnectorStatePath(), 'utf-8');
      const parsed = JSON.parse(raw) as ConnectorStateFile;
      expect(parsed.version).toBe(1);
      expect(parsed.connectors.connectorA).toEqual({
        accessToken: 'ta',
        refreshToken: 'ra',
        expiresAt: expiry,
      });
    });

    it('does NOT persist configuration-derived fields', async () => {
      // `tokenEndpoint`, `clientId`, `clientSecret`, `extra` are
      // sourced from config and must never leak into the on-disk
      // token cache.
      await saveConnectorState({
        sap: {
          accessToken: 'bearer',
          refreshToken: 'refresh',
          expiry: Date.now() + 3600 * 1000,
          tokenEndpoint: 'https://example/token',
          clientId: 'client-id',
          clientSecret: 'client-secret',
          extra: { foo: 'bar' },
        },
      });
      const raw = await fs.promises.readFile(getConnectorStatePath(), 'utf-8');
      const parsed = JSON.parse(raw) as ConnectorStateFile;
      expect(parsed.connectors.sap).toEqual({
        accessToken: 'bearer',
        refreshToken: 'refresh',
        expiresAt: parsed.connectors.sap.expiresAt,
      });
      expect(parsed.connectors.sap).not.toHaveProperty('tokenEndpoint');
      expect(parsed.connectors.sap).not.toHaveProperty('clientSecret');
      expect(parsed.connectors.sap).not.toHaveProperty('extra');
    });
  });

  describe('missing file', () => {
    it('returns empty snapshot when file does not exist', async () => {
      const loaded = await loadConnectorState();
      expect(loaded).toEqual({});
    });
  });

  describe('expired token pruning', () => {
    it('prunes access tokens within TOKEN_EXPIRY_SKEW_MS of expiry', async () => {
      const now = 1_000_000_000;
      // 15 seconds until expiry (< 30s skew).
      await saveConnectorState({
        stale: {
          accessToken: 'stale-bearer',
          refreshToken: 'refresh-still-good',
          expiry: now + 15_000,
        },
      });
      const loaded = await loadConnectorState({ now: () => now });
      // Access token pruned...
      expect(loaded.stale?.accessToken).toBeUndefined();
      expect(loaded.stale?.expiry).toBeUndefined();
      // ...but the refresh token survives so the caller can recover.
      expect(loaded.stale?.refreshToken).toBe('refresh-still-good');
    });

    it('preserves access tokens beyond the skew window', async () => {
      const now = 1_000_000_000;
      await saveConnectorState({
        fresh: {
          accessToken: 'fresh-bearer',
          refreshToken: 'refresh',
          expiry: now + 60_000,
        },
      });
      const loaded = await loadConnectorState({ now: () => now });
      expect(loaded.fresh?.accessToken).toBe('fresh-bearer');
      expect(loaded.fresh?.expiry).toBe(now + 60_000);
    });

    it('drops entries entirely when nothing survives pruning', async () => {
      const now = 1_000_000_000;
      // No refresh token — after pruning the entry is empty and
      // should not appear in the loaded snapshot at all.
      await saveConnectorState({
        gone: {
          accessToken: 'about-to-expire',
          expiry: now + 5_000,
        },
      });
      const loaded = await loadConnectorState({ now: () => now });
      expect(loaded.gone).toBeUndefined();
    });
  });

  describe('corrupted file', () => {
    it('returns empty snapshot on malformed JSON', async () => {
      await fs.promises.mkdir(path.dirname(getConnectorStatePath()), { recursive: true });
      await fs.promises.writeFile(getConnectorStatePath(), '{ this is not json ', 'utf-8');
      const loaded = await loadConnectorState();
      expect(loaded).toEqual({});
    });

    it('returns empty snapshot when top-level is an array', async () => {
      await fs.promises.mkdir(path.dirname(getConnectorStatePath()), { recursive: true });
      await fs.promises.writeFile(getConnectorStatePath(), '[]', 'utf-8');
      const loaded = await loadConnectorState();
      expect(loaded).toEqual({});
    });

    it('returns empty snapshot on wrong version', async () => {
      await fs.promises.mkdir(path.dirname(getConnectorStatePath()), { recursive: true });
      await fs.promises.writeFile(
        getConnectorStatePath(),
        JSON.stringify({ version: 999, connectors: { sap: { accessToken: 'x' } } }),
        'utf-8'
      );
      const loaded = await loadConnectorState();
      expect(loaded).toEqual({});
    });

    it('skips malformed per-provider entries and keeps valid ones', async () => {
      await fs.promises.mkdir(path.dirname(getConnectorStatePath()), { recursive: true });
      await fs.promises.writeFile(
        getConnectorStatePath(),
        JSON.stringify({
          version: 1,
          connectors: {
            valid: {
              accessToken: 'good',
              refreshToken: 'r',
              expiresAt: Date.now() + 3600 * 1000,
            },
            invalid: { accessToken: 123 }, // wrong type
            alsoInvalid: null,
          },
        }),
        'utf-8'
      );
      const loaded = await loadConnectorState();
      expect(loaded.valid?.accessToken).toBe('good');
      expect(loaded.invalid).toBeUndefined();
      expect(loaded.alsoInvalid).toBeUndefined();
    });

    it('overwrites corrupted file on next save', async () => {
      await fs.promises.mkdir(path.dirname(getConnectorStatePath()), { recursive: true });
      await fs.promises.writeFile(getConnectorStatePath(), 'garbage', 'utf-8');
      await saveConnectorState({
        fresh: {
          accessToken: 'x',
          refreshToken: 'r',
          expiry: Date.now() + 3600 * 1000,
        },
      });
      const loaded = await loadConnectorState();
      expect(loaded.fresh?.accessToken).toBe('x');
    });
  });

  describe('persistAuthTokens: false', () => {
    it('skips writing when disabled', async () => {
      persistAuthTokensMock.mockReturnValue(false);
      await saveConnectorState({
        sap: {
          accessToken: 'x',
          refreshToken: 'r',
          expiry: Date.now() + 3600 * 1000,
        },
      });
      expect(fs.existsSync(getConnectorStatePath())).toBe(false);
    });

    it('skips reading when disabled', async () => {
      // Populate the file first with persistence enabled.
      await saveConnectorState({
        sap: {
          accessToken: 'x',
          refreshToken: 'r',
          expiry: Date.now() + 3600 * 1000,
        },
      });
      expect(fs.existsSync(getConnectorStatePath())).toBe(true);

      // Then flip the setting and observe an empty load.
      persistAuthTokensMock.mockReturnValue(false);
      const loaded = await loadConnectorState();
      expect(loaded).toEqual({});
    });
  });

  describe('file permissions', () => {
    // On POSIX the file must be `0600`. Windows/tmpfs may not honour
    // chmod bits — skip gracefully on those platforms.
    const isPosix = process.platform !== 'win32';
    (isPosix ? it : it.skip)('creates the file with mode 0600', async () => {
      await saveConnectorState({
        sap: {
          accessToken: 'x',
          refreshToken: 'r',
          expiry: Date.now() + 3600 * 1000,
        },
      });
      const stat = await fs.promises.stat(getConnectorStatePath());
      // Compare only the permission bits.
      expect(stat.mode & 0o777).toBe(0o600);
    });
  });

  describe('merge semantics', () => {
    it('preserves entries for other providers on partial save', async () => {
      const expiry = Date.now() + 3600 * 1000;
      await saveConnectorState({
        a: { accessToken: 'ta', refreshToken: 'ra', expiry },
        b: { accessToken: 'tb', refreshToken: 'rb', expiry },
      });

      // Save only provider `a` with a new bearer.
      await saveConnectorState({
        a: { accessToken: 'ta-new', refreshToken: 'ra', expiry },
      });

      const loaded = await loadConnectorState();
      expect(loaded.a?.accessToken).toBe('ta-new');
      // Provider `b` should still be there.
      expect(loaded.b?.accessToken).toBe('tb');
      expect(loaded.b?.refreshToken).toBe('rb');
    });
  });

  describe('initializeConnectorStore', () => {
    it('hydrates the in-memory store from disk', async () => {
      const expiry = Date.now() + 3600 * 1000;
      await saveConnectorState({
        sap: { accessToken: 'bearer', refreshToken: 'refresh', expiry },
      });
      // Fresh in-memory store — nothing in it yet.
      setConnectorStore(createInMemoryConnectorStore());
      await initializeConnectorStore();
      const state = await getConnectorStore().get('sap');
      expect(state?.accessToken).toBe('bearer');
      expect(state?.refreshToken).toBe('refresh');
    });

    it('is idempotent within a single store lifetime', async () => {
      await saveConnectorState({
        sap: {
          accessToken: 'first',
          refreshToken: 'refresh',
          expiry: Date.now() + 3600 * 1000,
        },
      });
      await initializeConnectorStore();

      // Mutate in-memory, then rewrite disk to something else, then
      // call initialize again — the second init should be a no-op.
      await getConnectorStore().set('sap', {
        accessToken: 'in-memory-override',
        refreshToken: 'refresh',
      });
      await saveConnectorState({
        sap: {
          accessToken: 'disk-override',
          refreshToken: 'refresh',
          expiry: Date.now() + 3600 * 1000,
        },
      });
      await initializeConnectorStore();

      const state = await getConnectorStore().get('sap');
      expect(state?.accessToken).toBe('in-memory-override');
    });

    it('re-hydrates after setConnectorStore swaps in a fresh store', async () => {
      await saveConnectorState({
        sap: {
          accessToken: 'bearer',
          refreshToken: 'refresh',
          expiry: Date.now() + 3600 * 1000,
        },
      });
      await initializeConnectorStore();
      // Swap; the flag resets and the next init reads disk again.
      setConnectorStore(createInMemoryConnectorStore());
      await initializeConnectorStore();
      const state = await getConnectorStore().get('sap');
      expect(state?.refreshToken).toBe('refresh');
    });

    it('does nothing when persistAuthTokens is disabled', async () => {
      // Prime the file with persistence enabled.
      await saveConnectorState({
        sap: {
          accessToken: 'bearer',
          refreshToken: 'refresh',
          expiry: Date.now() + 3600 * 1000,
        },
      });
      persistAuthTokensMock.mockReturnValue(false);
      setConnectorStore(createInMemoryConnectorStore());
      await initializeConnectorStore();
      const state = await getConnectorStore().get('sap');
      expect(state).toBeUndefined();
    });
  });

  describe('refreshAccessToken persistence integration', () => {
    it('writes the refreshed connector state (incl. refresh token) to disk', async () => {
      const store = createInMemoryConnectorStore();
      await store.set('sap-ai-core', {
        refreshToken: 'refresh-abc',
        tokenEndpoint: 'https://oauth.example/token',
      });
      setConnectorStore(store);

      await refreshAccessToken('sap-ai-core', {
        now: () => 1_000_000,
        fetchImpl: makeFetch({
          access_token: 'new-bearer',
          refresh_token: 'refresh-rotated',
          expires_in: 3600,
        }),
      });

      // Broader connector snapshot on disk should include the rotated
      // refresh token so a new process can reuse it.
      const loaded = await loadConnectorState({ now: () => 1_000_000 });
      expect(loaded['sap-ai-core']?.accessToken).toBe('new-bearer');
      expect(loaded['sap-ai-core']?.refreshToken).toBe('refresh-rotated');
      expect(loaded['sap-ai-core']?.expiry).toBe(1_000_000 + 3600 * 1000);
    });

    it('does not write connector state to disk when persistAuthTokens is disabled', async () => {
      persistAuthTokensMock.mockReturnValue(false);
      const store = createInMemoryConnectorStore();
      await store.set('sap-ai-core', {
        refreshToken: 'refresh-abc',
        tokenEndpoint: 'https://oauth.example/token',
      });
      setConnectorStore(store);

      await refreshAccessToken('sap-ai-core', {
        now: () => 1_000_000,
        fetchImpl: makeFetch({ access_token: 'new-bearer', expires_in: 3600 }),
      });

      expect(fs.existsSync(getConnectorStatePath())).toBe(false);
    });

    it('propagates the refreshed token even when the connector snapshot save fails', async () => {
      // Point the storage path at a file-that-is-not-a-dir so mkdir
      // fails; refreshAccessToken must swallow the write error.
      const blocking = path.join(tmpDir, 'blocked');
      fs.writeFileSync(blocking, 'stop');
      setConnectorStatePath(path.join(blocking, 'connectors.json'));

      const store = createInMemoryConnectorStore();
      await store.set('sap-ai-core', {
        refreshToken: 'refresh-abc',
        tokenEndpoint: 'https://oauth.example/token',
      });
      setConnectorStore(store);

      const result = await refreshAccessToken('sap-ai-core', {
        now: () => 1_000_000,
        fetchImpl: makeFetch({ access_token: 'new-bearer', expires_in: 3600 }),
      });
      expect(result.accessToken).toBe('new-bearer');
    });
  });
});
