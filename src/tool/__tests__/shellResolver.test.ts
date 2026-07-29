/**
 * Tests for `src/tool/shellResolver.ts`.
 *
 * The heavy detection logic (candidate lists, TTL cache, spawn args)
 * is covered by `tests/tool/tools/shell-detect.test.ts` against the
 * underlying `detectShell()`. These tests focus on the wrapper's
 * public API: it must return `{ shell, name }`, honour `$SHELL`,
 * fall back to `/bin/sh` when nothing is available, and let the
 * bash tool description include the resolved shell name.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';

import { resolveShell, _resetShellResolverCacheForTests } from '../shellResolver.js';
import { _setFsProbeForTests } from '../tools/shell/id.js';
import { buildBashDescription } from '../tools/bash.js';

const ORIGINAL_PLATFORM = process.platform;
const ORIGINAL_ENV = { ...process.env };

function setPlatform(value: NodeJS.Platform): void {
  Object.defineProperty(process, 'platform', { value, configurable: true });
}

function restorePlatform(): void {
  Object.defineProperty(process, 'platform', {
    value: ORIGINAL_PLATFORM,
    configurable: true,
  });
}

function setExisting(existing: readonly string[]): void {
  const set = new Set(existing);
  _setFsProbeForTests((p) => set.has(p));
  _resetShellResolverCacheForTests();
}

function cleanup(): void {
  _resetShellResolverCacheForTests();
  _setFsProbeForTests(undefined);
  restorePlatform();
  process.env = { ...ORIGINAL_ENV };
}

describe('resolveShell', () => {
  beforeEach(() => {
    setPlatform('linux');
    _resetShellResolverCacheForTests();
  });

  afterEach(cleanup);

  it('returns the resolved shell path and short name for zsh', () => {
    process.env.SHELL = '/bin/zsh';
    setExisting(['/bin/zsh']);

    const result = resolveShell();

    expect(result.shell).toBe('/bin/zsh');
    expect(result.name).toBe('zsh');
  });

  it('returns bash when $SHELL points to bash', () => {
    process.env.SHELL = '/bin/bash';
    setExisting(['/bin/bash']);

    const result = resolveShell();

    expect(result.shell).toBe('/bin/bash');
    expect(result.name).toBe('bash');
  });

  it('honours $SHELL over the hard-coded candidate ordering', () => {
    // $SHELL points to bash, but zsh also exists on disk. The
    // resolver must pick the user-configured shell first rather
    // than silently upgrading to zsh.
    process.env.SHELL = '/bin/bash';
    setExisting(['/bin/bash', '/bin/zsh']);

    const result = resolveShell();

    expect(result.name).toBe('bash');
    expect(result.shell).toBe('/bin/bash');
  });

  it('falls back to /bin/sh when $SHELL is unset and no candidates exist', () => {
    delete process.env.SHELL;
    setExisting([]);

    const result = resolveShell();

    // With no candidates present and $SHELL unset, the underlying
    // detector falls through to `/bin/sh` (the POSIX last-resort).
    expect(result.shell).toBe('/bin/sh');
    expect(result.name).toBe('sh');
  });

  it('falls back when $SHELL points to a missing binary', () => {
    // The user's login shell was uninstalled (e.g. removed fish
    // package) but $SHELL still names it. The probe must reject the
    // stale path and land on a real shell instead.
    process.env.SHELL = '/opt/removed/fish';
    setExisting(['/bin/bash']);

    const result = resolveShell();

    expect(result.shell).toBe('/bin/bash');
    expect(result.name).toBe('bash');
  });

  it('classifies fish correctly when it is the login shell', () => {
    process.env.SHELL = '/usr/local/bin/fish';
    setExisting(['/usr/local/bin/fish']);

    const result = resolveShell();

    expect(result.name).toBe('fish');
    expect(result.shell).toBe('/usr/local/bin/fish');
  });
});

describe('bash tool description surfaces resolved shell name', () => {
  beforeEach(() => {
    setPlatform('linux');
    _resetShellResolverCacheForTests();
  });

  afterEach(cleanup);

  it('includes a `Shell: <name>` line reflecting the detected shell', () => {
    process.env.SHELL = '/bin/zsh';
    setExisting(['/bin/zsh']);

    const description = buildBashDescription();

    expect(description).toContain('Shell: zsh');
  });

  it('reflects a bash environment when zsh is not available', () => {
    process.env.SHELL = '/bin/bash';
    setExisting(['/bin/bash']);

    const description = buildBashDescription();

    expect(description).toContain('Shell: bash');
    expect(description).not.toContain('Shell: zsh');
  });
});
