/**
 * Integration tests for nested-PowerShell unwrapping through the bash
 * tool (Cline PR #13815, alexi issue #1754).
 *
 * These tests spawn real PowerShell processes via `bashTool` and are
 * therefore skipped when neither `pwsh` nor `powershell.exe` is on the
 * detected shell path. The pure parser is covered on all platforms by
 * `powershell-unwrap.test.ts`.
 *
 * The primary invariants:
 *   1. Nested pipelines that use `$_` succeed without the "property not
 *      found" error flood documented in cline/cline#13284.
 *   2. Single-quoted `-Command` bodies preserve `$_` identically.
 *   3. Ctrl+C (abort) still terminates the running child.
 *   4. Non-matching invocations (e.g. `-File`, unsupported flags) pass
 *      through unchanged.
 */

import { describe, it, expect, afterEach } from 'vitest';
import { spawnSync } from 'node:child_process';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';

import { bashTool } from '../../../../src/tool/tools/bash.js';
import {
  _resetDetectShellCacheForTests,
  _setFsProbeForTests,
} from '../../../../src/tool/tools/shell/id.js';
import type { ToolContext } from '../../../../src/tool/index.js';

/**
 * Locate a PowerShell executable to drive the end-to-end assertions.
 * Returns the resolved path when either `pwsh` or `powershell.exe` /
 * `powershell` is available on PATH. When neither is present the
 * whole suite self-skips (mirrors `powershell-fail-fast.test.ts`).
 */
function findPowerShell(): { command: string; path: string } | undefined {
  const candidates = ['pwsh', 'powershell.exe', 'powershell'];
  for (const cmd of candidates) {
    const probe = spawnSync(
      cmd,
      ['-NoProfile', '-NoLogo', '-Command', 'Write-Output $PSVersionTable.PSEdition'],
      { encoding: 'utf8' }
    );
    if (probe.status === 0) {
      // Resolve the absolute path so the detector's fs probe accepts
      // it as a real candidate on any platform.
      const which = spawnSync(process.platform === 'win32' ? 'where' : 'which', [cmd], {
        encoding: 'utf8',
      });
      const resolved =
        which.status === 0 && which.stdout.trim().length > 0
          ? which.stdout.split(/\r?\n/)[0].trim()
          : cmd;
      return { command: cmd, path: resolved };
    }
  }
  return undefined;
}

const pwsh = findPowerShell();
const describePwsh = pwsh ? describe : describe.skip;

describePwsh('bash tool - nested PowerShell unwrap (issue #1754)', () => {
  afterEach(() => {
    _resetDetectShellCacheForTests();
    _setFsProbeForTests(undefined);
  });

  function context(): ToolContext {
    return {
      workdir: process.cwd(),
      sessionId: 'ps-unwrap-test',
    };
  }

  function forcePwsh(): void {
    // Pin detectShell to the located PowerShell executable so the bash
    // tool routes through the PowerShell bootstrap on non-Windows
    // developer boxes too. Real-Windows CI produces the same routing
    // without the pin.
    _resetDetectShellCacheForTests();
    _setFsProbeForTests((p: string) => p === pwsh!.path);
    process.env.SHELL = pwsh!.path;
  }

  it('preserves $_ in a double-quoted nested pipeline over a real directory', async () => {
    forcePwsh();
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'alexi-ps-unwrap-'));
    try {
      fs.writeFileSync(path.join(dir, 'a.ts'), '');
      fs.writeFileSync(path.join(dir, 'b.ts'), '');
      fs.writeFileSync(path.join(dir, 'c.md'), '');
      // With the wrap in place, `$_` would be interpolated to '' by the
      // outer -Command parser before Where-Object was compiled, and
      // every file would produce a "property not found" error record.
      const cmd =
        `${pwsh!.command} -NoProfile -Command ` +
        `"Get-ChildItem -File -LiteralPath '${dir}' | ` +
        `Where-Object { $_.Name -like '*.ts' } | ForEach-Object { $_.Name }"`;

      const result = await bashTool.executeUnsafe({ command: cmd }, context());

      expect(result.success).toBe(true);
      // Both .ts files must be listed. Order across platforms varies.
      const lines = (result.data?.stdout ?? '')
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter((l) => l.length > 0)
        .sort();
      expect(lines).toEqual(['a.ts', 'b.ts']);
      // No "property not found" errors — the flood-vs-single-error test.
      expect(result.data?.stderr ?? '').not.toContain('property');
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  }, 30000);

  it('preserves $_ in a single-quoted nested pipeline', async () => {
    forcePwsh();
    const cmd = `${pwsh!.command} -NoProfile -Command '1,2,3 | Where-Object { $_ -gt 1 } | ForEach-Object { $_ * 10 }'`;
    const result = await bashTool.executeUnsafe({ command: cmd }, context());
    expect(result.success).toBe(true);
    const values = (result.data?.stdout ?? '')
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l.length > 0);
    expect(values).toEqual(['20', '30']);
  }, 30000);

  it('still honours abort signals mid-script', async () => {
    forcePwsh();
    const controller = new AbortController();
    const abortContext: ToolContext = {
      workdir: process.cwd(),
      sessionId: 'ps-unwrap-abort',
      signal: controller.signal,
    };
    const cmd = `${pwsh!.command} -NoProfile -Command "Start-Sleep -Seconds 30"`;
    const promise = bashTool.executeUnsafe({ command: cmd }, abortContext);
    setTimeout(() => controller.abort(), 200);
    const result = await promise;
    // Aborted commands report success=false with the process killed.
    expect(result.success).toBe(false);
    // exitCode is -1 when we killed the child.
    expect(result.data?.exitCode).not.toBe(0);
  }, 15000);

  it('passes non-matching invocations through unchanged (unsupported flag)', async () => {
    forcePwsh();
    // `-ExecutionPolicy` is not on the unwrappable-flag allowlist, so
    // the wrapper must NOT be stripped. The command still runs — the
    // outer bootstrap invokes it as PowerShell source, which then
    // spawns a nested `pwsh` and prints the literal string. We assert
    // the command completed successfully and produced the expected
    // output, which is only possible when the wrapper survived (a
    // stripped wrapper would have executed `-ExecutionPolicy` as a
    // standalone statement and errored).
    const cmd = `${pwsh!.command} -NoProfile -ExecutionPolicy Bypass -Command "Write-Output wrapped-ok"`;
    const result = await bashTool.executeUnsafe({ command: cmd }, context());
    expect(result.success).toBe(true);
    expect((result.data?.stdout ?? '').trim()).toBe('wrapped-ok');
  }, 15000);
});
