/**
 * Unit tests for the nested-PowerShell unwrapping helper (Cline PR
 * #13815, alexi issue #1754). These tests exercise the pure parser
 * without spawning any PowerShell process, so they run on every
 * platform and self-skip nothing.
 *
 * The end-to-end wiring into the bash tool is covered on Windows by
 * `bash-powershell-unwrap.test.ts`; the pure-shape assertions live
 * here.
 */

import { describe, it, expect } from 'vitest';

import {
  parseNestedPowerShellCommand,
  unwrapNestedPowerShellCommand,
} from '../../../../src/tool/tools/shell/powershell.js';

describe('parseNestedPowerShellCommand', () => {
  it('unwraps a double-quoted -Command body and preserves $_', () => {
    const cmd = `powershell -NoProfile -Command "Get-ChildItem | Where-Object { $_.Name -like '*.ts' }"`;
    const result = parseNestedPowerShellCommand(cmd, 'powershell');
    expect(result).toBeDefined();
    expect(result?.executable).toBe('powershell');
    // $_ MUST NOT be interpolated away — the whole point of the fix.
    expect(result?.script).toBe(`Get-ChildItem | Where-Object { $_.Name -like '*.ts' }`);
  });

  it('unwraps a single-quoted -Command body and preserves $_', () => {
    const cmd = `powershell -NoProfile -Command 'Get-Process | Where-Object { $_.CPU -gt 10 }'`;
    const result = parseNestedPowerShellCommand(cmd, 'powershell');
    expect(result).toBeDefined();
    expect(result?.script).toBe(`Get-Process | Where-Object { $_.CPU -gt 10 }`);
  });

  it('recognises pwsh as the outer shell and cross-edition wrappers', () => {
    const cmd = `pwsh -NoProfile -Command "Write-Output $PSVersionTable.PSEdition"`;
    const result = parseNestedPowerShellCommand(cmd, 'powershell');
    expect(result?.executable).toBe('pwsh');
    expect(result?.script).toBe('Write-Output $PSVersionTable.PSEdition');
  });

  it('accepts extra bootstrap-equivalent flags before -Command', () => {
    const cmd = `powershell -NoProfile -NoLogo -NonInteractive -Command "Write-Output hi"`;
    const result = parseNestedPowerShellCommand(cmd, 'powershell');
    expect(result?.script).toBe('Write-Output hi');
  });

  it('decodes doubled double-quotes to a single quote', () => {
    const cmd = `powershell -NoProfile -Command "Write-Output ""hello"""`;
    const result = parseNestedPowerShellCommand(cmd, 'powershell');
    expect(result?.script).toBe('Write-Output "hello"');
  });

  it('decodes doubled single-quotes inside a single-quoted body', () => {
    const cmd = `powershell -NoProfile -Command 'Write-Output ''hello'''`;
    const result = parseNestedPowerShellCommand(cmd, 'powershell');
    expect(result?.script).toBe(`Write-Output 'hello'`);
  });

  it('decodes backtick escapes in a double-quoted body', () => {
    const cmd = `powershell -NoProfile -Command "line1\`nline2\`ttab"`;
    const result = parseNestedPowerShellCommand(cmd, 'powershell');
    expect(result?.script).toBe('line1\nline2\ttab');
  });

  it('decodes `u{...} only when the outer edition is PowerShell 7+', () => {
    const cmd = `pwsh -NoProfile -Command "Write-Output \`u{263A}"`;
    const coreResult = parseNestedPowerShellCommand(cmd, 'pwsh');
    expect(coreResult?.script).toBe('Write-Output \u263A');

    const windowsResult = parseNestedPowerShellCommand(cmd, 'powershell');
    // Under Windows PowerShell 5.1 rules, `u{...} is not a special
    // escape — the backtick escapes only the `u`.
    expect(windowsResult?.script).toBe('Write-Output u{263A}');
  });

  it('accepts a quoted executable path when introduced by the call operator', () => {
    const cmd = `& "C:\\Program Files\\PowerShell\\7\\pwsh.exe" -NoProfile -Command "Write-Output ok"`;
    const result = parseNestedPowerShellCommand(cmd, 'powershell');
    expect(result?.executable).toBe('C:\\Program Files\\PowerShell\\7\\pwsh.exe');
    expect(result?.script).toBe('Write-Output ok');
  });

  it('rejects a quoted executable without the call operator', () => {
    // A bare string expression is not an invocation in PowerShell.
    const cmd = `"C:\\Program Files\\PowerShell\\7\\pwsh.exe" -NoProfile -Command "Write-Output ok"`;
    expect(parseNestedPowerShellCommand(cmd, 'powershell')).toBeUndefined();
  });

  it('rejects invocations missing -NoProfile', () => {
    const cmd = `powershell -Command "Write-Output no-profile-missing"`;
    expect(parseNestedPowerShellCommand(cmd, 'powershell')).toBeUndefined();
  });

  it('rejects invocations with unsupported flags (e.g. -ExecutionPolicy)', () => {
    const cmd = `powershell -NoProfile -ExecutionPolicy Bypass -Command "Write-Output x"`;
    expect(parseNestedPowerShellCommand(cmd, 'powershell')).toBeUndefined();
  });

  it('rejects invocations using -File instead of -Command', () => {
    const cmd = `powershell -NoProfile -File script.ps1`;
    expect(parseNestedPowerShellCommand(cmd, 'powershell')).toBeUndefined();
  });

  it('rejects invocations whose -Command tail is not a single complete quoted string', () => {
    // Trailing statement after the closing quote.
    const cmd = `powershell -NoProfile -Command "Write-Output hi"; Write-Output tail`;
    expect(parseNestedPowerShellCommand(cmd, 'powershell')).toBeUndefined();
  });

  it('rejects invocations with an unquoted -Command tail', () => {
    const cmd = `powershell -NoProfile -Command Write-Output hi`;
    expect(parseNestedPowerShellCommand(cmd, 'powershell')).toBeUndefined();
  });

  it('rejects invocations that use newline instead of a horizontal separator', () => {
    // Newline terminates the outer statement, so this is not a wrapper.
    const cmd = `powershell\n-NoProfile -Command "Write-Output hi"`;
    expect(parseNestedPowerShellCommand(cmd, 'powershell')).toBeUndefined();
  });

  it('returns undefined when the outer shell is not PowerShell', () => {
    const cmd = `powershell -NoProfile -Command "Write-Output hi"`;
    expect(parseNestedPowerShellCommand(cmd, '/bin/bash')).toBeUndefined();
  });

  it('returns undefined when the executable is not powershell/pwsh', () => {
    const cmd = `cmd.exe -NoProfile -Command "Write-Output hi"`;
    expect(parseNestedPowerShellCommand(cmd, 'powershell')).toBeUndefined();
  });

  it('returns undefined for completely unrelated commands', () => {
    expect(parseNestedPowerShellCommand('Get-ChildItem', 'powershell')).toBeUndefined();
    expect(parseNestedPowerShellCommand('echo hello', 'powershell')).toBeUndefined();
  });
});

describe('unwrapNestedPowerShellCommand', () => {
  it('strips a single wrapper layer', () => {
    const cmd = `powershell -NoProfile -Command "Write-Output $_"`;
    const result = unwrapNestedPowerShellCommand(cmd, 'powershell');
    expect(result?.script).toBe('Write-Output $_');
  });

  it('strips multiple stacked wrapper layers', () => {
    const inner = `Write-Output $_`;
    const middle = `powershell -NoProfile -Command "${inner}"`;
    const outer = `pwsh -NoProfile -Command '${middle}'`;
    const result = unwrapNestedPowerShellCommand(outer, 'powershell');
    expect(result).toBeDefined();
    // After both layers, we should be down to the innermost script.
    expect(result?.script).toBe('Write-Output $_');
    // The requested innermost executable is `powershell`.
    expect(result?.executable).toBe('powershell');
  });

  it('returns undefined for commands with no wrapper', () => {
    expect(unwrapNestedPowerShellCommand('Get-ChildItem', 'powershell')).toBeUndefined();
    expect(
      unwrapNestedPowerShellCommand('powershell -NoProfile -File script.ps1', 'powershell')
    ).toBeUndefined();
  });
});
