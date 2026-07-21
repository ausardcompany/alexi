/**
 * Unit tests for the dynamic shell detection powering the bash / shell
 * tool descriptions and their spawn wiring.
 *
 * These tests focus on the pure, side-effect-free surface of the
 * detector — the tool integration paths are covered by
 * `tests/tool/tools/bash.test.ts` and `src/tool/tools/__tests__/bash.test.ts`.
 *
 * Related upstream fix: Cline PR #12331. The detector probes real
 * filesystem paths per-platform in priority order (pwsh > powershell >
 * cmd on Windows; zsh > bash > sh on POSIX) so the tool description the
 * LLM sees matches the shell the OS will actually dispatch to.
 *
 * The filesystem probe is dependency-injected via `_setFsProbeForTests`
 * because ESM module exports (`node:fs.existsSync`) cannot be spied on
 * with `vi.spyOn` in Vitest's default (non-browser) mode.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import {
  detectShell,
  shellSpawnArgs,
  _resetDetectShellCacheForTests,
  _setFsProbeForTests,
} from '../../../src/tool/tools/shell/id.js';
import { buildBashDescription, bashTool } from '../../../src/tool/tools/bash.js';
import { buildShellDescription, shellTool } from '../../../src/tool/tools/shell.js';

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

function makeProbe(existing: readonly string[]): (p: string) => boolean {
  const set = new Set(existing);
  return (p: string) => set.has(p);
}

function setExisting(existing: readonly string[]): void {
  _setFsProbeForTests(makeProbe(existing));
  _resetDetectShellCacheForTests();
}

function cleanup(): void {
  _resetDetectShellCacheForTests();
  _setFsProbeForTests(undefined);
  restorePlatform();
  process.env = { ...ORIGINAL_ENV };
  vi.restoreAllMocks();
}

describe('detectShell — Windows candidate probing', () => {
  beforeEach(() => {
    _resetDetectShellCacheForTests();
    setPlatform('win32');
    process.env.ProgramFiles = 'C:\\Program Files';
    process.env['ProgramFiles(x86)'] = 'C:\\Program Files (x86)';
    process.env.LOCALAPPDATA = 'C:\\Users\\test\\AppData\\Local';
    process.env.SystemRoot = 'C:\\Windows';
    delete process.env.COMSPEC;
  });

  afterEach(cleanup);

  it('picks pwsh 7 from Program Files when present (highest priority)', () => {
    setExisting([
      'C:\\Program Files\\PowerShell\\7\\pwsh.exe',
      'C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe',
      'C:\\Windows\\System32\\cmd.exe',
    ]);

    const info = detectShell();

    expect(info.type).toBe('powershell');
    expect(info.path).toBe('C:\\Program Files\\PowerShell\\7\\pwsh.exe');
  });

  it('falls back to Program Files (x86) pwsh when the 64-bit path is missing', () => {
    setExisting([
      'C:\\Program Files (x86)\\PowerShell\\7\\pwsh.exe',
      'C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe',
    ]);

    const info = detectShell();

    expect(info.type).toBe('powershell');
    expect(info.path).toBe('C:\\Program Files (x86)\\PowerShell\\7\\pwsh.exe');
  });

  it('falls back to the Local AppData WindowsApps pwsh stub when only that is installed', () => {
    setExisting([
      'C:\\Users\\test\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe',
      'C:\\Windows\\System32\\cmd.exe',
    ]);

    const info = detectShell();

    expect(info.type).toBe('powershell');
    expect(info.path).toContain('WindowsApps');
  });

  it('falls back to Windows PowerShell 5.1 when pwsh 7 is not installed', () => {
    setExisting([
      'C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe',
      'C:\\Windows\\System32\\cmd.exe',
    ]);

    const info = detectShell();

    expect(info.type).toBe('powershell');
    expect(info.path).toContain('powershell.exe');
  });

  it('falls back to cmd.exe when no PowerShell is installed', () => {
    setExisting(['C:\\Windows\\System32\\cmd.exe']);

    const info = detectShell();

    expect(info.type).toBe('cmd');
    expect(info.path).toContain('cmd.exe');
  });

  it('falls back to COMSPEC when none of the probed candidates exist', () => {
    process.env.COMSPEC = 'C:\\Custom\\cmd.exe';
    setExisting([]);

    const info = detectShell();

    expect(info.type).toBe('cmd');
    expect(info.path).toBe('C:\\Custom\\cmd.exe');
  });
});

describe('detectShell — POSIX candidate probing', () => {
  beforeEach(() => {
    _resetDetectShellCacheForTests();
    delete process.env.SHELL;
  });

  afterEach(cleanup);

  it('prefers zsh over bash on macOS when both exist', () => {
    setPlatform('darwin');
    setExisting(['/bin/zsh', '/bin/bash', '/bin/sh']);

    const info = detectShell();

    expect(info.type).toBe('zsh');
    expect(info.path).toBe('/bin/zsh');
  });

  it('falls back to bash on Linux when zsh is not installed', () => {
    setPlatform('linux');
    setExisting(['/bin/bash', '/bin/sh']);

    const info = detectShell();

    expect(info.type).toBe('bash');
    expect(info.path).toBe('/bin/bash');
  });

  it('honours $SHELL when it points at a non-standard prefix that exists', () => {
    setPlatform('linux');
    process.env.SHELL = '/opt/nix/bin/zsh';
    setExisting(['/opt/nix/bin/zsh', '/bin/bash']);

    const info = detectShell();

    expect(info.type).toBe('zsh');
    expect(info.path).toBe('/opt/nix/bin/zsh');
  });

  it('falls back to POSIX /bin/sh when only sh exists', () => {
    setPlatform('linux');
    setExisting(['/bin/sh']);

    const info = detectShell();

    expect(info.type).toBe('sh');
    expect(info.path).toBe('/bin/sh');
  });

  it('falls back to $SHELL string when no probed candidate exists on disk', () => {
    setPlatform('linux');
    process.env.SHELL = '/nonexistent/nushell';
    setExisting([]);

    const info = detectShell();

    // Detector returns the $SHELL string as-is when nothing on the
    // probed list resolves, and infers 'unknown' since it does not
    // match any known shell name.
    expect(info.path).toBe('/nonexistent/nushell');
    expect(info.type).toBe('unknown');
  });
});

describe('detectShell — caching', () => {
  beforeEach(() => {
    _resetDetectShellCacheForTests();
    setPlatform('linux');
    delete process.env.SHELL;
  });

  afterEach(cleanup);

  it('re-probes the filesystem when the cache is dropped (profile change simulation)', () => {
    let probeCalls = 0;
    _setFsProbeForTests((p) => {
      probeCalls += 1;
      return p === '/bin/bash';
    });

    const first = detectShell();
    expect(first.type).toBe('bash');
    const callsAfterFirst = probeCalls;

    // Cache hit — should NOT re-probe.
    detectShell();
    expect(probeCalls).toBe(callsAfterFirst);

    // User installs zsh mid-session.
    _resetDetectShellCacheForTests();
    _setFsProbeForTests((p) => p === '/bin/zsh' || p === '/bin/bash');

    const second = detectShell();
    expect(second.type).toBe('zsh');
  });
});

describe('shellSpawnArgs', () => {
  it('emits -c for bash / zsh / sh', () => {
    expect(shellSpawnArgs({ type: 'bash', path: '/bin/bash' })).toEqual({
      file: '/bin/bash',
      prefixArgs: ['-c'],
    });
    expect(shellSpawnArgs({ type: 'zsh', path: '/bin/zsh' })).toEqual({
      file: '/bin/zsh',
      prefixArgs: ['-c'],
    });
    expect(shellSpawnArgs({ type: 'sh', path: '/bin/sh' })).toEqual({
      file: '/bin/sh',
      prefixArgs: ['-c'],
    });
  });

  it('emits -NoProfile -Command for PowerShell', () => {
    expect(shellSpawnArgs({ type: 'powershell', path: 'C:\\pwsh.exe' })).toEqual({
      file: 'C:\\pwsh.exe',
      prefixArgs: ['-NoProfile', '-Command'],
    });
  });

  it('emits /d /s /c for cmd.exe', () => {
    expect(shellSpawnArgs({ type: 'cmd', path: 'C:\\cmd.exe' })).toEqual({
      file: 'C:\\cmd.exe',
      prefixArgs: ['/d', '/s', '/c'],
    });
  });
});

describe('bash / shell tool descriptions reflect the detected shell', () => {
  beforeEach(() => {
    _resetDetectShellCacheForTests();
    // Ensure $SHELL does not shadow the priority-ordered probe list —
    // `posixCandidates()` places `$SHELL` first when set.
    delete process.env.SHELL;
  });

  afterEach(cleanup);

  it('bash description says "powershell" on Windows when pwsh is present', () => {
    setPlatform('win32');
    process.env.ProgramFiles = 'C:\\Program Files';
    setExisting(['C:\\Program Files\\PowerShell\\7\\pwsh.exe']);

    const desc = buildBashDescription();
    expect(desc).toMatch(/^Execute a powershell command/);
  });

  it('bash description says "zsh" on macOS when zsh is present', () => {
    setPlatform('darwin');
    setExisting(['/bin/zsh', '/bin/bash']);

    const desc = buildBashDescription();
    expect(desc).toMatch(/^Execute a zsh command/);
  });

  it('bash description falls back to "bash" on Linux without zsh', () => {
    setPlatform('linux');
    setExisting(['/bin/bash']);

    const desc = buildBashDescription();
    expect(desc).toMatch(/^Execute a bash command/);
  });

  it('bashTool.toFunctionSchema() returns a fresh description each call', () => {
    setPlatform('linux');
    setExisting(['/bin/bash']);

    const first = bashTool.toFunctionSchema();
    expect(first.description).toMatch(/^Execute a bash command/);

    setExisting(['/bin/zsh', '/bin/bash']);
    const second = bashTool.toFunctionSchema();
    expect(second.description).toMatch(/^Execute a zsh command/);
  });

  it('bashTool.description getter also reflects the detected shell', () => {
    setPlatform('linux');
    setExisting(['/bin/zsh', '/bin/bash']);

    expect(bashTool.description).toMatch(/^Execute a zsh command/);
    // Preserved usage/security sections from the original description.
    expect(bashTool.description).toContain('Security');
    expect(bashTool.description).toContain('emit those tool calls in the same response');
  });

  it('shell tool description mirrors the same detection logic', () => {
    setPlatform('darwin');
    setExisting(['/bin/zsh']);

    expect(buildShellDescription()).toMatch(/^Execute a zsh command/);
    expect(shellTool.description).toMatch(/^Execute a zsh command/);
    expect(shellTool.toFunctionSchema().description).toMatch(/^Execute a zsh command/);
  });
});
