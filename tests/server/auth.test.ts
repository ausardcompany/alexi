import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  defaultSocketPath,
  defaultTokenPath,
  generateToken,
  loadOrCreateToken,
  readTokenIfExists,
  safeCompareToken,
} from '../../src/server/auth.js';

describe('server auth', () => {
  let tmpdir: string;

  beforeEach(() => {
    tmpdir = fs.mkdtempSync(path.join(os.tmpdir(), 'alexi-server-auth-'));
  });

  afterEach(() => {
    fs.rmSync(tmpdir, { recursive: true, force: true });
  });

  describe('generateToken', () => {
    it('produces a hex string of 64 characters', () => {
      const t = generateToken();
      expect(t).toMatch(/^[a-f0-9]{64}$/);
    });

    it('is non-deterministic across calls', () => {
      const a = generateToken();
      const b = generateToken();
      expect(a).not.toEqual(b);
    });
  });

  describe('loadOrCreateToken', () => {
    it('creates a new token file when missing and returns the same on next call', () => {
      const p = path.join(tmpdir, 'nested', 'server-token');
      const first = loadOrCreateToken(p);
      expect(fs.existsSync(p)).toBe(true);

      const second = loadOrCreateToken(p);
      expect(second).toBe(first);
    });

    it('writes the token with mode 0600 on POSIX filesystems', () => {
      if (process.platform === 'win32') {
        return;
      }
      const p = path.join(tmpdir, 'server-token');
      loadOrCreateToken(p);
      const stat = fs.statSync(p);
      const mode = stat.mode & 0o777;
      expect(mode).toBe(0o600);
    });

    it('reuses an existing token verbatim', () => {
      const p = path.join(tmpdir, 'server-token');
      fs.writeFileSync(p, 'preseeded-token\n');
      const loaded = loadOrCreateToken(p);
      expect(loaded).toBe('preseeded-token');
    });

    it('regenerates when the existing file is empty', () => {
      const p = path.join(tmpdir, 'server-token');
      fs.writeFileSync(p, '   ');
      const loaded = loadOrCreateToken(p);
      expect(loaded.length).toBeGreaterThan(0);
      expect(loaded).not.toBe('   ');
    });
  });

  describe('readTokenIfExists', () => {
    it('returns null when the file does not exist', () => {
      expect(readTokenIfExists(path.join(tmpdir, 'missing'))).toBeNull();
    });

    it('returns the trimmed contents when the file exists', () => {
      const p = path.join(tmpdir, 'server-token');
      fs.writeFileSync(p, 'tok\n');
      expect(readTokenIfExists(p)).toBe('tok');
    });

    it('returns null for whitespace-only files', () => {
      const p = path.join(tmpdir, 'server-token');
      fs.writeFileSync(p, '   \n');
      expect(readTokenIfExists(p)).toBeNull();
    });
  });

  describe('safeCompareToken', () => {
    it('returns true for identical strings', () => {
      expect(safeCompareToken('abc', 'abc')).toBe(true);
    });

    it('returns false for differing strings of equal length', () => {
      expect(safeCompareToken('abc', 'abd')).toBe(false);
    });

    it('returns false when lengths differ', () => {
      expect(safeCompareToken('abc', 'abcd')).toBe(false);
    });

    it('rejects non-strings without throwing', () => {
      // @ts-expect-error deliberately invalid input for defence-in-depth
      expect(safeCompareToken(null, 'abc')).toBe(false);
    });
  });

  describe('default paths', () => {
    it('places the token under the given home directory', () => {
      const home = '/custom/home';
      expect(defaultTokenPath(home)).toBe(path.join(home, '.alexi', 'server-token'));
    });

    it('places the socket under the given home directory', () => {
      const home = '/custom/home';
      expect(defaultSocketPath(home)).toBe(path.join(home, '.alexi', 'server.sock'));
    });
  });
});
