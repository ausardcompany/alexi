/**
 * Unit tests for the shell environment probe that feeds the dynamic
 * bash / shell tool descriptions.
 *
 * Issue #1123 / Cline PR #12331: the description surfaced to the LLM
 * includes the shell version, a `PATH` summary, and which common
 * developer tools are present, so the model can pick the right syntax
 * and avoid attempting commands whose binaries are not installed.
 *
 * The version probe (`spawnSync`) and tool probe (`fs.existsSync` over
 * PATH) are dependency-injected via `_setVersionProbeForTests` /
 * `_setToolProbeForTests` because both real implementations touch the
 * filesystem and subprocess table in ways vitest cannot easily mock.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';

import {
  detectShellEnv,
  formatShellEnvSummary,
  splitPath,
  COMMON_TOOLS,
  PATH_SUMMARY_ENTRIES,
  _resetShellEnvCacheForTests,
  _setVersionProbeForTests,
  _setToolProbeForTests,
} from '../../../src/tool/tools/shell/env.js';
import {
  _resetDetectShellCacheForTests,
  _setFsProbeForTests,
  type ShellInfo,
} from '../../../src/tool/tools/shell/id.js';
import { buildBashDescription } from '../../../src/tool/tools/bash.js';
import { buildShellDescription } from '../../../src/tool/tools/shell.js';

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

function cleanup(): void {
  _resetShellEnvCacheForTests();
  _resetDetectShellCacheForTests();
  _setVersionProbeForTests(undefined);
  _setToolProbeForTests(undefined);
  _setFsProbeForTests(undefined);
  restorePlatform();
  process.env = { ...ORIGINAL_ENV };
}

const BASH_INFO: ShellInfo = { type: 'bash', path: '/bin/bash' };
const PWSH_INFO: ShellInfo = {
  type: 'powershell',
  path: 'C:\\Program Files\\PowerShell\\7\\pwsh.exe',
};

describe('splitPath', () => {
  afterEach(cleanup);

  it('splits POSIX PATH on colons', () => {
    setPlatform('linux');
    expect(splitPath('/usr/local/bin:/usr/bin:/bin')).toEqual([
      '/usr/local/bin',
      '/usr/bin',
      '/bin',
    ]);
  });

  it('splits Windows PATH on semicolons', () => {
    setPlatform('win32');
    expect(splitPath('C:\\Windows;C:\\Windows\\System32')).toEqual([
      'C:\\Windows',
      'C:\\Windows\\System32',
    ]);
  });

  it('drops empty and whitespace-only entries', () => {
    setPlatform('linux');
    expect(splitPath('/usr/bin::  :/bin')).toEqual(['/usr/bin', '/bin']);
  });

  it('returns an empty array when PATH is undefined', () => {
    // Pass an explicit empty string to exercise the missing-PATH path
    // (the default-parameter form resolves to `process.env.PATH` when
    // `undefined` is passed, which on CI is populated).
    expect(splitPath('')).toEqual([]);
  });
});

describe('detectShellEnv', () => {
  beforeEach(() => {
    _resetShellEnvCacheForTests();
    _resetDetectShellCacheForTests();
    setPlatform('linux');
    process.env.PATH = '/usr/local/bin:/usr/bin:/bin';
  });

  afterEach(cleanup);

  it('reports the version when the probe returns a first line', () => {
    _setVersionProbeForTests(() => 'GNU bash, version 5.1.16(1)-release');
    _setToolProbeForTests(() => false);

    const env = detectShellEnv(BASH_INFO);

    expect(env.version).toBe('GNU bash, version 5.1.16(1)-release');
    // The version is also mirrored onto the returned shell for convenience.
    expect(env.shell.version).toBe('GNU bash, version 5.1.16(1)-release');
  });

  it('omits version when the probe returns undefined (broken binary)', () => {
    _setVersionProbeForTests(() => undefined);
    _setToolProbeForTests(() => false);

    const env = detectShellEnv(BASH_INFO);

    expect(env.version).toBeUndefined();
    // shell.version is only set when we actually captured one.
    expect(env.shell.version).toBeUndefined();
  });

  it('captures the first PATH_SUMMARY_ENTRIES entries of PATH', () => {
    process.env.PATH = ['/a', '/b', '/c', '/d', '/e', '/f', '/g'].join(':');
    _resetShellEnvCacheForTests();
    _setVersionProbeForTests(() => undefined);
    _setToolProbeForTests(() => false);

    const env = detectShellEnv(BASH_INFO);

    expect(env.pathSummary).toHaveLength(PATH_SUMMARY_ENTRIES);
    expect(env.pathSummary[0]).toBe('/a');
    expect(env.pathSummary[PATH_SUMMARY_ENTRIES - 1]).toBe('/e');
  });

  it('returns the available tools in the order defined by COMMON_TOOLS', () => {
    _setVersionProbeForTests(() => undefined);
    // Pretend git, npm and docker are installed but nothing else.
    _setToolProbeForTests((name) => name === 'git' || name === 'npm' || name === 'docker');

    const env = detectShellEnv(BASH_INFO);

    expect(env.availableTools).toEqual(['git', 'npm', 'docker']);
    // Sanity check the order matches the COMMON_TOOLS declaration.
    const idx = env.availableTools.map((t) => COMMON_TOOLS.indexOf(t));
    expect(idx).toEqual([...idx].sort((a, b) => a - b));
  });

  it('caches results across calls with the same shell + PATH', () => {
    let versionCalls = 0;
    let toolCalls = 0;
    _setVersionProbeForTests(() => {
      versionCalls += 1;
      return 'bash 5';
    });
    _setToolProbeForTests(() => {
      toolCalls += 1;
      return false;
    });

    detectShellEnv(BASH_INFO);
    const afterFirstV = versionCalls;
    const afterFirstT = toolCalls;

    detectShellEnv(BASH_INFO);

    expect(versionCalls).toBe(afterFirstV);
    expect(toolCalls).toBe(afterFirstT);
  });

  it('re-probes when PATH changes (profile change simulation)', () => {
    let versionCalls = 0;
    _setVersionProbeForTests(() => {
      versionCalls += 1;
      return 'bash 5';
    });
    _setToolProbeForTests(() => false);

    detectShellEnv(BASH_INFO);
    expect(versionCalls).toBe(1);

    // User installs Homebrew and prepends /opt/homebrew/bin to PATH.
    process.env.PATH = '/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin';
    detectShellEnv(BASH_INFO);

    expect(versionCalls).toBe(2);
  });
});

describe('formatShellEnvSummary', () => {
  beforeEach(() => {
    _resetShellEnvCacheForTests();
    _resetDetectShellCacheForTests();
    setPlatform('linux');
    process.env.PATH = '/usr/local/bin:/usr/bin:/bin';
  });

  afterEach(cleanup);

  it('renders a single-line summary with shell version and available tools', () => {
    _setVersionProbeForTests(() => 'GNU bash, version 5.1.16(1)-release');
    _setToolProbeForTests((name) => ['git', 'npm', 'node'].includes(name));

    const summary = formatShellEnvSummary(detectShellEnv(BASH_INFO));

    expect(summary).toContain('shell: GNU bash, version 5.1.16');
    expect(summary).toContain('PATH: /usr/local/bin:/usr/bin:/bin');
    expect(summary).toContain('Available tools: git, npm, node');
    expect(summary).not.toContain('\n');
  });

  it('falls back to the shell type when no version was captured', () => {
    _setVersionProbeForTests(() => undefined);
    _setToolProbeForTests(() => false);

    const summary = formatShellEnvSummary(detectShellEnv(BASH_INFO));

    expect(summary).toContain('shell: bash');
    // No "Available tools:" fragment when the tool list is empty.
    expect(summary).not.toContain('Available tools:');
  });

  it('appends a "(+N more)" suffix when PATH has more entries than fit', () => {
    process.env.PATH = ['/a', '/b', '/c', '/d', '/e', '/f', '/g', '/h'].join(':');
    _resetShellEnvCacheForTests();
    _setVersionProbeForTests(() => 'bash 5');
    _setToolProbeForTests(() => false);

    const summary = formatShellEnvSummary(detectShellEnv(BASH_INFO));

    expect(summary).toMatch(/PATH: \/a:\/b:\/c:\/d:\/e \(\+3 more\)/);
  });

  it('uses ";" as the PATH separator on Windows', () => {
    setPlatform('win32');
    process.env.PATH = 'C:\\Windows;C:\\Windows\\System32';
    _resetShellEnvCacheForTests();
    _setVersionProbeForTests(() => 'PowerShell 7.4.0');
    _setToolProbeForTests(() => false);

    const summary = formatShellEnvSummary(detectShellEnv(PWSH_INFO));

    expect(summary).toContain('PATH: C:\\Windows;C:\\Windows\\System32');
    expect(summary).toContain('shell: PowerShell 7.4.0');
  });
});

describe('bash / shell tool descriptions include environment info', () => {
  beforeEach(() => {
    _resetShellEnvCacheForTests();
    _resetDetectShellCacheForTests();
    setPlatform('linux');
    delete process.env.SHELL;
    process.env.PATH = '/usr/local/bin:/usr/bin:/bin';
    // Make the id-detector pick a deterministic /bin/bash.
    _setFsProbeForTests((p) => p === '/bin/bash');
  });

  afterEach(cleanup);

  it('bash description contains the environment summary line', () => {
    _setVersionProbeForTests(() => 'GNU bash, version 5.1.16');
    _setToolProbeForTests((name) => ['git', 'npm'].includes(name));

    const desc = buildBashDescription();

    expect(desc).toContain('Environment:');
    expect(desc).toContain('GNU bash, version 5.1.16');
    expect(desc).toContain('Available tools: git, npm');
    // Keeps the original opening line and downstream sections.
    expect(desc).toMatch(/^Execute a bash command/);
    expect(desc).toContain('Security');
  });

  it('shell description contains the environment summary line', () => {
    _setVersionProbeForTests(() => 'GNU bash, version 5.1.16');
    _setToolProbeForTests((name) => name === 'docker');

    const desc = buildShellDescription();

    expect(desc).toContain('Environment:');
    expect(desc).toContain('Available tools: docker');
    expect(desc).toMatch(/^Execute a bash command in the user's environment/);
  });

  it('description survives a broken version probe (no throw, no version fragment)', () => {
    _setVersionProbeForTests(() => undefined);
    _setToolProbeForTests(() => false);

    const desc = buildBashDescription();

    expect(desc).toContain('shell: bash');
    expect(desc).toMatch(/^Execute a bash command/);
  });
});
