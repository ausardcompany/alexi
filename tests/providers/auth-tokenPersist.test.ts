/**
 * Tests for the token-persistence path of `refreshAccessToken`
 * (issue #1357). A successful refresh must write the new bearer to
 * `~/.alexi/tokens.json` when `persistAuthTokens` is enabled and must
 * NOT touch the file when the user has opted out.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';

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

import { refreshAccessToken, type FetchLike } from '../../src/providers/auth.js';
import {
  setConnectorStore,
  createInMemoryConnectorStore,
} from '../../src/providers/connectorStore.js';
import {
  loadToken,
  setTokenStoragePath,
  resetTokenStoragePath,
} from '../../src/utils/tokenStorage.js';

function makeFetch(body: unknown, status = 200): FetchLike {
  return async () => ({
    ok: status >= 200 && status < 300,
    status,
    statusText: 'OK',
    text: async () => JSON.stringify(body),
  });
}

describe('refreshAccessToken -> tokenStorage persistence', () => {
  let tmpDir: string;

  beforeEach(async () => {
    tmpDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'alexi-auth-persist-'));
    setTokenStoragePath(path.join(tmpDir, 'tokens.json'));
    setConnectorStore(createInMemoryConnectorStore());
    persistAuthTokensMock.mockReturnValue(true);
  });

  afterEach(async () => {
    resetTokenStoragePath();
    setConnectorStore(createInMemoryConnectorStore());
    await fs.promises.rm(tmpDir, { recursive: true, force: true });
  });

  it('writes the refreshed token to the on-disk cache', async () => {
    const store = createInMemoryConnectorStore();
    await store.set('sap-ai-core', {
      refreshToken: 'refresh-abc',
      tokenEndpoint: 'https://oauth.example/token',
    });
    setConnectorStore(store);

    const now = () => 1_000_000;
    const result = await refreshAccessToken('sap-ai-core', {
      now,
      fetchImpl: makeFetch({ access_token: 'new-bearer', expires_in: 3600 }),
    });

    expect(result.accessToken).toBe('new-bearer');
    expect(result.expiry).toBe(1_000_000 + 3600 * 1000);

    const cached = await loadToken('sap-ai-core');
    expect(cached).toEqual({ token: 'new-bearer', expiresAt: 1_000_000 + 3600 * 1000 });
  });

  it('does NOT write to disk when persistAuthTokens is false', async () => {
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

    expect(await loadToken('sap-ai-core')).toBeNull();
    expect(fs.existsSync(path.join(tmpDir, 'tokens.json'))).toBe(false);
  });

  it('propagates the refreshed token even when the on-disk save fails', async () => {
    // Point the storage path at a location that cannot be written
    // to -- a file rather than a directory, so mkdir fails.
    const conflictingFile = path.join(tmpDir, 'not-a-dir');
    fs.writeFileSync(conflictingFile, 'blocking file');
    setTokenStoragePath(path.join(conflictingFile, 'tokens.json'));

    const store = createInMemoryConnectorStore();
    await store.set('sap-ai-core', {
      refreshToken: 'refresh-abc',
      tokenEndpoint: 'https://oauth.example/token',
    });
    setConnectorStore(store);

    // Must not throw despite the disk failure.
    const result = await refreshAccessToken('sap-ai-core', {
      now: () => 1_000_000,
      fetchImpl: makeFetch({ access_token: 'new-bearer', expires_in: 3600 }),
    });
    expect(result.accessToken).toBe('new-bearer');
  });
});
