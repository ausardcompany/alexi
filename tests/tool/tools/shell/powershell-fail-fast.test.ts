/**
 * PowerShell fail-fast regression tests (Cline PR #13358, alexi issue
 * #1456). The `shellSpawnArgs` PowerShell branch prepends a bootstrap
 * to `-Command` that sets `$ErrorActionPreference='Stop'` before
 * invoking the user command as a scriptblock via `& { <user> }`.
 *
 * These tests focus on end-to-end semantics observed through a real
 * `spawn` of `pwsh` (skipped when pwsh is not on PATH, which lets the
 * suite still run on macOS / Linux dev boxes without PowerShell 7
 * installed). The pure-shape assertions on the return value of
 * `shellSpawnArgs` live in `../shell-detect.test.ts`.
 *
 * The behaviours we regression-guard here:
 *   1. A malformed pipeline stops at the FIRST non-terminating error
 *      with a non-zero exit code (fixes the "stderr flood + exit 0"
 *      hang reported in cline/cline#13285 / alexi #1456).
 *   2. The stderr flood is bounded: on a broken per-item pipeline over
 *      a directory tree, we get a single error record — NOT one per
 *      enumerated entry.
 *   3. Successful commands still succeed (no false-positive Stop).
 *   4. Per-cmdlet opt-out with `-ErrorAction Continue` restores the old
 *      non-fail-fast behaviour for that specific cmdlet, so users can
 *      still write partial-result commands when they explicitly want
 *      to.
 *   5. Scripts beginning with `param(...)` still work — the bootstrap
 *      is at the -Command outer scope, and the user command is wrapped
 *      in `& { ... }`, so `param` retains its mandatory first-statement
 *      position INSIDE the scriptblock. A naive top-level prepend
 *      would displace `param` and fail with CommandNotFoundException.
 */

import { describe, it, expect } from 'vitest';
import { spawnSync } from 'node:child_process';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';

import { shellSpawnArgs } from '../../../../src/tool/tools/shell/id.js';

/**
 * Locate a PowerShell executable to drive the end-to-end assertions.
 * We accept either `pwsh` (PowerShell 7+, cross-platform) or
 * `powershell.exe` (Windows PowerShell 5.1). Returns undefined when
 * neither is on PATH — in that case the tests self-skip so this file
 * stays green on POSIX runners without pwsh.
 */
function findPowerShell(): string | undefined {
  const candidates = ['pwsh', 'powershell.exe', 'powershell'];
  for (const cmd of candidates) {
    const probe = spawnSync(cmd, ['-NoProfile', '-Command', 'Write-Output ok'], {
      encoding: 'utf8',
    });
    if (probe.status === 0 && probe.stdout.trim() === 'ok') {
      return cmd;
    }
  }
  return undefined;
}

const pwshCmd = findPowerShell();
const describePwsh = pwshCmd ? describe : describe.skip;

/**
 * Simulate the exact wiring bash.ts / shell.ts perform: destructure
 * `shellSpawnArgs` and spawn `[...prefixArgs, userCommand, ...suffixArgs]`.
 * Returns the child-process status, stdout, and stderr so tests can
 * assert on all three.
 */
function runViaShellSpawnArgs(userCommand: string): {
  status: number | null;
  stdout: string;
  stderr: string;
} {
  const { prefixArgs, suffixArgs = [] } = shellSpawnArgs({
    type: 'powershell',
    path: pwshCmd as string,
  });
  const result = spawnSync(pwshCmd as string, [...prefixArgs, userCommand, ...suffixArgs], {
    encoding: 'utf8',
  });
  return {
    status: result.status,
    stdout: result.stdout,
    stderr: result.stderr,
  };
}

describePwsh('PowerShell fail-fast semantics (issue #1456)', () => {
  it('stops at the first error in a malformed pipeline with non-zero exit', () => {
    // Emit a line, hit a hard error, then emit another line. Under
    // the old ErrorActionPreference='Continue' default, both lines
    // would print and the exit code would be 0. Under Stop, the first
    // error terminates the script before the second Write-Output.
    const cmd = 'Write-Output "before"; Get-Item /definitely-not-a-real-path; Write-Output "after"';
    const { status, stdout, stderr } = runViaShellSpawnArgs(cmd);

    expect(status).not.toBe(0);
    expect(stdout).toContain('before');
    // The post-error statement must NOT have executed.
    expect(stdout).not.toContain('after');
    // The error message is reported (single record, no flood).
    expect(stderr.length).toBeGreaterThan(0);
  });

  it('emits a single error message rather than a flood on a broken per-item pipeline', () => {
    // The exact reproduction from cline/cline#13285: an invalid
    // scriptblock in Where-Object is invoked once per enumerated
    // item. Under Continue, we would see one error record per file
    // in the tree (tens of thousands on large trees). Under Stop,
    // the first item's error terminates the whole pipeline.
    //
    // Set up a temp directory with a handful of files so we have a
    // deterministic input regardless of the ambient filesystem.
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'alexi-ps-flood-'));
    try {
      for (let i = 0; i < 5; i++) {
        fs.writeFileSync(path.join(dir, `file-${i}.txt`), '');
      }
      // [int]::Parse on the filename (`file-0.txt`, ...) is malformed
      // and throws for every enumerated item — the classic flood
      // pattern.
      const cmd =
        `Get-ChildItem -File -LiteralPath '${dir}' ` +
        `| Where-Object { [int]::Parse($_.Name) -gt 0 }`;
      const { status, stderr } = runViaShellSpawnArgs(cmd);

      expect(status).not.toBe(0);
      // Bound the flood: with 5 files we would see 5 records under
      // Continue. Under Stop we expect exactly 1 error record — but
      // allow a modest ceiling to keep the test robust across pwsh
      // versions that vary in how many follow-up lines a single
      // ErrorRecord serialises to.
      const errorLines = stderr.split('\n').filter((line) => line.trim().length > 0);
      expect(errorLines.length).toBeLessThan(5);
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });

  it('lets successful commands succeed with exit 0 and expected stdout', () => {
    const { status, stdout } = runViaShellSpawnArgs('Write-Output "hello-alexi"');
    expect(status).toBe(0);
    expect(stdout.trim()).toBe('hello-alexi');
  });

  it('honours per-cmdlet -ErrorAction Continue opt-out', () => {
    // The user explicitly opts out of Stop for a specific cmdlet.
    // Post-error statements should still run, and the overall exit
    // code should be 0.
    const cmd =
      'Get-Item /definitely-not-a-real-path -ErrorAction Continue; Write-Output "still-ran"';
    const { status, stdout } = runViaShellSpawnArgs(cmd);

    expect(status).toBe(0);
    expect(stdout).toContain('still-ran');
  });

  it('accepts scripts starting with param(...) (param stays first-statement inside the scriptblock)', () => {
    // Regression guard: a naive `prepend to user script` strategy
    // would displace `param(...)` from its mandatory first-statement
    // position and fail with CommandNotFoundException. The bootstrap-
    // scope strategy sets $ErrorActionPreference at the -Command
    // outer scope and wraps the user command in `& { <user> }`, so
    // `param` still occupies the first-statement slot INSIDE the
    // scriptblock braces.
    const cmd = 'param($name = "world") Write-Output "hello $name"';
    const { status, stdout } = runViaShellSpawnArgs(cmd);

    expect(status).toBe(0);
    expect(stdout.trim()).toBe('hello world');
  });

  it('preserves user exit codes through the wrapper', () => {
    // A user `exit 42` should propagate as 42, not be swallowed by
    // Stop's own exit code. This mirrors the exit-code preservation
    // check in cline/cline#13358.
    const { status } = runViaShellSpawnArgs('exit 42');
    expect(status).toBe(42);
  });
});
