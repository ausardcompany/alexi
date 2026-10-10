/**
 * Tests for platform support diagnostics (`platformSupport.ts`).
 *
 * Covers the spirit of upstream opencode `055d95b` ("improve error
 * message for missing binary on windows arm64"): on uncommon
 * platforms Alexi should surface a clearer warning instead of a
 * cryptic failure.
 */

import { describe, expect, it } from 'vitest';

import {
  currentPlatform,
  formatStartupError,
  platformSupportWarning,
} from '../platformSupport.js';

describe('platformSupportWarning', () => {
  it('returns undefined on common linux-x64 setups', () => {
    expect(
      platformSupportWarning({ platform: 'linux', arch: 'x64', nodeVersion: '22.12.0' })
    ).toBeUndefined();
  });

  it('returns undefined on darwin-arm64 (common Apple Silicon)', () => {
    expect(
      platformSupportWarning({ platform: 'darwin', arch: 'arm64', nodeVersion: '22.12.0' })
    ).toBeUndefined();
  });

  it('emits a Windows ARM64 specific advisory', () => {
    const msg = platformSupportWarning({
      platform: 'win32',
      arch: 'arm64',
      nodeVersion: '22.12.0',
    });
    expect(msg).toBeDefined();
    expect(msg).toMatch(/Windows ARM64/);
    expect(msg).toMatch(/native dependencies/);
  });

  it('warns on fully unsupported platforms', () => {
    const msg = platformSupportWarning({
      platform: 'freebsd' as NodeJS.Platform,
      arch: 'x64',
      nodeVersion: '22.12.0',
    });
    expect(msg).toBeDefined();
    expect(msg).toMatch(/freebsd/);
    expect(msg).toMatch(/supported set/);
  });

  it('warns on unsupported architectures', () => {
    const msg = platformSupportWarning({
      platform: 'linux',
      arch: 'riscv64',
      nodeVersion: '22.12.0',
    });
    expect(msg).toBeDefined();
    expect(msg).toMatch(/riscv64/);
  });
});

describe('formatStartupError', () => {
  it('includes the Windows ARM64 advisory when applicable', () => {
    const out = formatStartupError(new Error('ENOENT: better-sqlite3'), {
      platform: 'win32',
      arch: 'arm64',
      nodeVersion: '22.12.0',
    });
    expect(out).toMatch(/win32-arm64/);
    expect(out).toMatch(/ENOENT: better-sqlite3/);
    expect(out).toMatch(/Windows ARM64/);
  });

  it('omits the advisory on supported platforms', () => {
    const out = formatStartupError(new Error('boom'), {
      platform: 'linux',
      arch: 'x64',
      nodeVersion: '22.12.0',
    });
    expect(out).toMatch(/linux-x64/);
    expect(out).toMatch(/boom/);
    expect(out).not.toMatch(/Windows ARM64/);
    expect(out).not.toMatch(/supported set/);
  });

  it('stringifies non-Error throwables', () => {
    const out = formatStartupError('something broke', {
      platform: 'linux',
      arch: 'x64',
      nodeVersion: '22.12.0',
    });
    expect(out).toMatch(/something broke/);
  });
});

describe('currentPlatform', () => {
  it('returns the actual runtime platform/arch triple', () => {
    const p = currentPlatform();
    expect(p.platform).toBe(process.platform);
    expect(p.arch).toBe(process.arch);
    expect(p.nodeVersion).toBe(process.versions.node);
  });
});
