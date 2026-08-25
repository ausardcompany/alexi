import { describe, expect, it } from 'vitest';

import { PowerShell, args, locations, probe, pwsh } from '../../src/core/powershell.js';

describe('core/powershell', () => {
  it('args() returns the expected pwsh invocation flags', () => {
    expect(args('Get-Date')).toEqual([
      '-NoLogo',
      '-NoProfile',
      '-NonInteractive',
      '-Command',
      'Get-Date',
    ]);
  });

  it('locations() derives candidates from the provided env map', () => {
    const env = {
      ProgramFiles: 'C:\\Program Files',
      'ProgramFiles(x86)': 'C:\\Program Files (x86)',
      LOCALAPPDATA: 'C:\\Users\\test\\AppData\\Local',
    } as NodeJS.ProcessEnv;
    const locs = locations(env);
    expect(locs).toHaveLength(3);
    // Every path ends in pwsh.exe.
    for (const p of locs) {
      expect(p.endsWith('pwsh.exe')).toBe(true);
    }
  });

  it('locations() filters out empty env slots', () => {
    // Only ProgramFiles set — the other two entries should be dropped.
    const env = { ProgramFiles: 'C:\\Program Files' } as NodeJS.ProcessEnv;
    expect(locations(env)).toHaveLength(1);
  });

  it('probe() returns an array (may be empty on non-Windows CI)', () => {
    // We don't assert a specific length: this test suite runs on Linux
    // where none of the Windows locations exist. The invariant is that
    // probe() returns an array without throwing.
    expect(Array.isArray(probe({}))).toBe(true);
  });

  it('pwsh() returns undefined when no pwsh is installed and env is empty', () => {
    // Force an empty env so both `which` and `probe` return nothing.
    expect(pwsh({} as NodeJS.ProcessEnv)).toBeUndefined();
  });

  it('exports a bundled PowerShell namespace with all helpers', () => {
    expect(PowerShell.args).toBe(args);
    expect(PowerShell.locations).toBe(locations);
    expect(PowerShell.probe).toBe(probe);
    expect(PowerShell.pwsh).toBe(pwsh);
  });
});
