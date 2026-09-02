/**
 * Tests for `sanitizeApiKey` — the config write-boundary helper that
 * strips invisible clipboard artefacts from pasted API keys.
 *
 * Rules under test (see `src/providers/auth.ts`):
 *   1. Control characters (`\p{Cc}`) are stripped (NUL, CR, LF, TAB, C1
 *      controls).
 *   2. Formatting characters (`\p{Cf}`) are stripped (zero-width spaces,
 *      joiners, BOM, bidi marks).
 *   3. Surrounding whitespace is trimmed.
 *   4. Whitespace-only input becomes '' so the caller can treat the
 *      field as "cleared".
 *   5. Non-string input yields ''.
 *   6. Normal keys pass through untouched.
 *
 * The test file lives under `tests/config/` per issue #1625 even though
 * the implementation currently lives in `src/providers/auth.ts` — the
 * function is intended for use at the config write boundary and future
 * config-layer callers will import it from the same module.
 */
import { describe, it, expect } from 'vitest';
import { sanitizeApiKey } from '../../src/providers/auth.js';
import { addMcpServer, saveMcpConfig, loadMcpConfig } from '../../src/mcp/config.js';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { beforeEach, afterEach, vi } from 'vitest';

describe('sanitizeApiKey', () => {
  it('leaves a normal key unchanged', () => {
    expect(sanitizeApiKey('sk-abc123')).toBe('sk-abc123');
  });

  it('preserves the interior of a well-formed key even when it contains dashes and digits', () => {
    expect(sanitizeApiKey('AICORE-1234-5678-abcdef')).toBe('AICORE-1234-5678-abcdef');
  });

  it('strips a trailing newline (LF)', () => {
    expect(sanitizeApiKey('key\n')).toBe('key');
  });

  it('strips a trailing CRLF pair', () => {
    expect(sanitizeApiKey('key\r\n')).toBe('key');
  });

  it('strips embedded zero-width space (U+200B)', () => {
    expect(sanitizeApiKey('key\u200Bvalue')).toBe('keyvalue');
  });

  it('strips a leading BOM (U+FEFF)', () => {
    expect(sanitizeApiKey('\uFEFFsk-abc')).toBe('sk-abc');
  });

  it('strips zero-width joiners and non-joiners', () => {
    // U+200C ZERO WIDTH NON-JOINER, U+200D ZERO WIDTH JOINER
    expect(sanitizeApiKey('foo\u200Cbar\u200Dbaz')).toBe('foobarbaz');
  });

  it('strips bidirectional formatting marks', () => {
    // U+202A LEFT-TO-RIGHT EMBEDDING, U+202C POP DIRECTIONAL FORMATTING
    expect(sanitizeApiKey('\u202Akey\u202C')).toBe('key');
  });

  it('strips NUL bytes', () => {
    expect(sanitizeApiKey('key\u0000ish')).toBe('keyish');
  });

  it('trims surrounding whitespace', () => {
    expect(sanitizeApiKey('   sk-abc123   ')).toBe('sk-abc123');
  });

  it('handles tabs around the key', () => {
    expect(sanitizeApiKey('\tsk-abc\t')).toBe('sk-abc');
  });

  it('returns empty string for whitespace-only input', () => {
    expect(sanitizeApiKey('   ')).toBe('');
    expect(sanitizeApiKey('\t\t')).toBe('');
    expect(sanitizeApiKey('\n\n\n')).toBe('');
  });

  it('returns empty string for input that is only invisibles', () => {
    // Every character stripped by \p{Cc} or \p{Cf} yields '' after trim.
    expect(sanitizeApiKey('\u200B\u200B\u200B')).toBe('');
    expect(sanitizeApiKey('\uFEFF')).toBe('');
    expect(sanitizeApiKey('\u200B \u200C\t\u200D')).toBe('');
  });

  it('returns empty string for an already-empty input', () => {
    expect(sanitizeApiKey('')).toBe('');
  });

  it('returns empty string for non-string input', () => {
    expect(sanitizeApiKey(undefined)).toBe('');
    expect(sanitizeApiKey(null)).toBe('');
    expect(sanitizeApiKey(42 as unknown)).toBe('');
    expect(sanitizeApiKey({} as unknown)).toBe('');
    expect(sanitizeApiKey([] as unknown)).toBe('');
  });

  it('is idempotent — sanitizing a sanitized key returns the same value', () => {
    const dirty = '  \uFEFF sk-abc \u200B \n ';
    const once = sanitizeApiKey(dirty);
    const twice = sanitizeApiKey(once);
    expect(twice).toBe(once);
    expect(once).toBe('sk-abc');
  });

  it('handles Unicode letters in the key body correctly (does not strip \\p{L})', () => {
    // Latin letters mixed with non-ASCII letters — none of these are
    // Cc or Cf, so they must survive.
    expect(sanitizeApiKey('sk-éclair-42')).toBe('sk-éclair-42');
  });
});

describe('sanitizeApiKey wiring: addMcpServer write boundary', () => {
  let mockHomeDir: string;

  beforeEach(() => {
    mockHomeDir = fs.mkdtempSync(path.join(os.tmpdir(), 'sanitize-mcp-test-'));
    vi.spyOn(os, 'homedir').mockReturnValue(mockHomeDir);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    fs.rmSync(mockHomeDir, { recursive: true, force: true });
  });

  it('sanitizes apiKey on addMcpServer', () => {
    // Seed an empty config so addMcpServer has a file to merge into.
    saveMcpConfig({ version: '1.0.0', servers: [] });
    addMcpServer({
      name: 'test-server',
      transport: 'http',
      url: 'https://example.com',
      apiKey: '  sk-abc\u200B\n',
      enabled: true,
    });
    const cfg = loadMcpConfig();
    const server = cfg.servers.find((s) => s.name === 'test-server');
    expect(server).toBeDefined();
    expect(server?.apiKey).toBe('sk-abc');
  });

  it('clears apiKey when the pasted value is whitespace-only', () => {
    saveMcpConfig({ version: '1.0.0', servers: [] });
    addMcpServer({
      name: 'blank-key-server',
      transport: 'http',
      url: 'https://example.com',
      apiKey: '   \u200B\uFEFF   ',
      enabled: true,
    });
    const cfg = loadMcpConfig();
    const server = cfg.servers.find((s) => s.name === 'blank-key-server');
    expect(server).toBeDefined();
    // Whitespace-only cleared: the field is dropped from persisted config.
    expect(server?.apiKey).toBeUndefined();
  });

  it('leaves a well-formed apiKey untouched', () => {
    saveMcpConfig({ version: '1.0.0', servers: [] });
    addMcpServer({
      name: 'clean-key-server',
      transport: 'http',
      url: 'https://example.com',
      apiKey: 'sk-good-key',
      enabled: true,
    });
    const cfg = loadMcpConfig();
    const server = cfg.servers.find((s) => s.name === 'clean-key-server');
    expect(server?.apiKey).toBe('sk-good-key');
  });
});
