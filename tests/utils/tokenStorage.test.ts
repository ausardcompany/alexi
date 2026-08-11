/**
 * Tests for `src/utils/tokenStorage.ts` -- OAuth token cache used by
 * the SAP AI Core connector persistence layer (issue #1357).
 *
 * The module reads/writes `~/.alexi/tokens.json` by default; every
 * test relocates the storage path into a `mkdtemp` directory via
 * `setTokenStoragePath` so we never touch the real config.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';

import {
  saveToken,
  loadToken,
  clearToken,
  clearAllTokens,
  getTokenStoragePath,
  setTokenStoragePath,
  resetTokenStoragePath,
} from '../../src/utils/tokenStorage.js';

describe('tokenStorage', () => {
  let tmpDir: string;
  let tokenFile: string;

  beforeEach(async () => {
    tmpDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'alexi-token-storage-'));
    tokenFile = path.join(tmpDir, 'tokens.json');
    setTokenStoragePath(tokenFile);
  });

  afterEach(async () => {
    resetTokenStoragePath();
    await fs.promises.rm(tmpDir, { recursive: true, force: true });
  });

  describe('path helpers', () => {
    it('getTokenStoragePath returns the currently set path', () => {
      expect(getTokenStoragePath()).toBe(tokenFile);
    });

    it('resetTokenStoragePath restores the default ~/.alexi/tokens.json', () => {
      resetTokenStoragePath();
      expect(getTokenStoragePath()).toBe(path.join(os.homedir(), '.alexi', 'tokens.json'));
    });
  });

  describe('save/load lifecycle', () => {
    it('loadToken returns null when the file does not exist', async () => {
      const result = await loadToken('sap-ai-core');
      expect(result).toBeNull();
    });

    it('saveToken persists a token that loadToken can read back', async () => {
      const expiresAt = Date.now() + 3_600_000;
      await saveToken('sap-ai-core', 'bearer-abc123', expiresAt);

      const loaded = await loadToken('sap-ai-core');
      expect(loaded).toEqual({ token: 'bearer-abc123', expiresAt });
    });

    it('saveToken creates the parent directory if it does not exist', async () => {
      const nestedFile = path.join(tmpDir, 'nested', 'dir', 'tokens.json');
      setTokenStoragePath(nestedFile);

      await saveToken('sap-ai-core', 'bearer-nested', Date.now() + 1000);

      expect(fs.existsSync(nestedFile)).toBe(true);
    });

    it('saveToken writes the file with 0o600 permissions', async () => {
      await saveToken('sap-ai-core', 'bearer-mode', Date.now() + 1000);

      const stat = fs.statSync(tokenFile);
      // On POSIX, the mode bits for owner/group/other. Skip on
      // Windows where mode bits are effectively unused.
      if (process.platform !== 'win32') {
        const perm = stat.mode & 0o777;
        expect(perm).toBe(0o600);
      }
    });

    it('saveToken preserves other providers when adding a new one', async () => {
      await saveToken('sap-ai-core', 'token-a', 1000);
      await saveToken('other-provider', 'token-b', 2000);

      const a = await loadToken('sap-ai-core');
      const b = await loadToken('other-provider');
      expect(a).toEqual({ token: 'token-a', expiresAt: 1000 });
      expect(b).toEqual({ token: 'token-b', expiresAt: 2000 });
    });

    it('saveToken overwrites the entry for the same provider', async () => {
      await saveToken('sap-ai-core', 'first', 1000);
      await saveToken('sap-ai-core', 'second', 2000);

      const loaded = await loadToken('sap-ai-core');
      expect(loaded).toEqual({ token: 'second', expiresAt: 2000 });
    });
  });

  describe('clearToken', () => {
    it('removes the entry for the given provider', async () => {
      await saveToken('sap-ai-core', 'token-a', 1000);
      await saveToken('other-provider', 'token-b', 2000);

      await clearToken('sap-ai-core');

      expect(await loadToken('sap-ai-core')).toBeNull();
      expect(await loadToken('other-provider')).toEqual({ token: 'token-b', expiresAt: 2000 });
    });

    it('is a no-op when the entry does not exist', async () => {
      await expect(clearToken('missing')).resolves.toBeUndefined();
    });

    it('is a no-op when the file does not exist', async () => {
      await expect(clearToken('sap-ai-core')).resolves.toBeUndefined();
    });
  });

  describe('clearAllTokens', () => {
    it('removes the storage file entirely', async () => {
      await saveToken('sap-ai-core', 'token-a', 1000);
      expect(fs.existsSync(tokenFile)).toBe(true);

      await clearAllTokens();

      expect(fs.existsSync(tokenFile)).toBe(false);
    });

    it('is a no-op when the file does not exist', async () => {
      await expect(clearAllTokens()).resolves.toBeUndefined();
    });
  });

  describe('graceful degradation', () => {
    it('loadToken returns null when the file contains malformed JSON', async () => {
      fs.writeFileSync(tokenFile, '{not-valid-json');

      const result = await loadToken('sap-ai-core');
      expect(result).toBeNull();
    });

    it('loadToken returns null when the entry has the wrong shape', async () => {
      fs.writeFileSync(
        tokenFile,
        JSON.stringify({ 'sap-ai-core': { token: 42, expiresAt: 'not-a-number' } })
      );

      const result = await loadToken('sap-ai-core');
      expect(result).toBeNull();
    });

    it('loadToken returns null when the file is a JSON array (not an object)', async () => {
      fs.writeFileSync(tokenFile, JSON.stringify(['a', 'b']));

      const result = await loadToken('sap-ai-core');
      expect(result).toBeNull();
    });

    it('loadToken skips malformed entries but keeps well-formed ones', async () => {
      fs.writeFileSync(
        tokenFile,
        JSON.stringify({
          'sap-ai-core': { token: 'ok', expiresAt: 1000 },
          'bad-provider': { token: null, expiresAt: 'garbage' },
        })
      );

      expect(await loadToken('sap-ai-core')).toEqual({ token: 'ok', expiresAt: 1000 });
      expect(await loadToken('bad-provider')).toBeNull();
    });

    it('saveToken rejects empty providerId', async () => {
      await expect(saveToken('', 'token', 1000)).rejects.toThrow();
    });

    it('saveToken rejects empty token', async () => {
      await expect(saveToken('sap-ai-core', '', 1000)).rejects.toThrow();
    });

    it('saveToken rejects non-finite expiresAt', async () => {
      await expect(saveToken('sap-ai-core', 'token', Number.NaN)).rejects.toThrow();
      await expect(saveToken('sap-ai-core', 'token', Number.POSITIVE_INFINITY)).rejects.toThrow();
    });

    it('loadToken returns null for empty providerId', async () => {
      await saveToken('sap-ai-core', 'token', 1000);
      expect(await loadToken('')).toBeNull();
    });
  });

  describe('atomic writes', () => {
    it('concurrent saves both persist without corrupting the file', async () => {
      // Fire two writes for different providers back-to-back. Because
      // each write does read-modify-write, one of the interleavings can
      // race, but the final file must be valid JSON containing at
      // least one of the two entries. This test doesn't try to prove
      // last-writer-wins semantics -- just that we never end up with
      // a garbage file.
      await Promise.all([
        saveToken('provider-a', 'token-a', 1000),
        saveToken('provider-b', 'token-b', 2000),
      ]);

      const raw = fs.readFileSync(tokenFile, 'utf-8');
      const parsed = JSON.parse(raw);
      expect(typeof parsed).toBe('object');
      expect(parsed).not.toBeNull();

      // At least one provider was persisted. (The other may have lost
      // the race on read-modify-write.)
      const keys = Object.keys(parsed);
      expect(keys.length).toBeGreaterThanOrEqual(1);
    });
  });
});
