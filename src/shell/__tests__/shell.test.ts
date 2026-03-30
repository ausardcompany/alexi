/**
 * Shell Utility Tests
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Shell } from '../shell.js';

describe('Shell', () => {
  let originalPlatform: string;
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    originalPlatform = process.platform;
    originalEnv = { ...process.env };
  });

  afterEach(() => {
    Object.defineProperty(process, 'platform', {
      value: originalPlatform,
      writable: true,
    });
    process.env = originalEnv;
  });

  describe('getShellArgs', () => {
    it('should return PowerShell args for pwsh.exe', () => {
      const args = Shell.getShellArgs('C:\\Program Files\\PowerShell\\7\\pwsh.exe');
      expect(args).toEqual(['-NoProfile', '-NonInteractive', '-Command']);
    });

    it('should return PowerShell args for powershell.exe', () => {
      const args = Shell.getShellArgs('C:\\Windows\\System32\\powershell.exe');
      expect(args).toEqual(['-NoProfile', '-NonInteractive', '-Command']);
    });

    it('should return cmd args for cmd.exe', () => {
      const args = Shell.getShellArgs('C:\\Windows\\System32\\cmd.exe');
      expect(args).toEqual(['/c']);
    });

    it('should return bash args for bash', () => {
      const args = Shell.getShellArgs('/bin/bash');
      expect(args).toEqual(['-c']);
    });

    it('should return bash args for zsh', () => {
      const args = Shell.getShellArgs('/bin/zsh');
      expect(args).toEqual(['-c']);
    });

    it('should handle case-insensitive shell names', () => {
      const args = Shell.getShellArgs('PWSH.EXE');
      expect(args).toEqual(['-NoProfile', '-NonInteractive', '-Command']);
    });
  });

  describe('getDefaultShell', () => {
    it('should return SHELL env var on Unix', () => {
      Object.defineProperty(process, 'platform', {
        value: 'linux',
        writable: true,
      });
      process.env.SHELL = '/bin/zsh';

      const shell = Shell.getDefaultShell();
      expect(shell).toBe('/bin/zsh');
    });

    it('should return /bin/bash as fallback on Unix', () => {
      Object.defineProperty(process, 'platform', {
        value: 'linux',
        writable: true,
      });
      delete process.env.SHELL;

      const shell = Shell.getDefaultShell();
      expect(shell).toBe('/bin/bash');
    });

    it('should detect shell on Windows', () => {
      Object.defineProperty(process, 'platform', {
        value: 'win32',
        writable: true,
      });

      const shell = Shell.getDefaultShell();
      // Should be either PowerShell or cmd.exe
      expect(
        shell.toLowerCase().includes('pwsh') ||
          shell.toLowerCase().includes('powershell') ||
          shell.toLowerCase().includes('cmd')
      ).toBe(true);
    });
  });

  describe('findPowerShell', () => {
    it('should return undefined on non-Windows platforms', () => {
      Object.defineProperty(process, 'platform', {
        value: 'linux',
        writable: true,
      });

      const pwsh = Shell.findPowerShell();
      expect(pwsh).toBeUndefined();
    });

    it('should attempt to find PowerShell on Windows', () => {
      Object.defineProperty(process, 'platform', {
        value: 'win32',
        writable: true,
      });

      const pwsh = Shell.findPowerShell();
      // May be undefined if PowerShell isn't installed, but shouldn't throw
      expect(typeof pwsh === 'string' || pwsh === undefined).toBe(true);
    });
  });
});
