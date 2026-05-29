/**
 * Tests for the POSIX shell command parser used by the permission gate.
 *
 * Carry-over from claude-code v2.1.149 (PowerShell `cd..` permission bypass
 * fix). Each case here corresponds to a directory-escape vector that the
 * parser must detect.
 */

import { describe, it, expect } from 'vitest';
import * as path from 'path';
import * as os from 'os';
import { parseSegments, auditShellCommand, BUILTINS_DIRECTORY_MUTATORS } from '../shell-parser.js';

// A workspace path we will treat as "the configured working directory" in
// every assertion. Use a stable subdirectory of os.tmpdir() so the "outside
// workspace" cases remain truly outside on every CI runner.
const WORKSPACE = path.join(os.tmpdir(), 'alexi-shellparser-ws');
const OUTSIDE = path.join(os.tmpdir(), 'alexi-shellparser-out');

describe('parseSegments', () => {
  it('splits on `;` `&&` `||` and `|`', () => {
    const segments = parseSegments('echo a; echo b && echo c || echo d | cat');
    expect(segments.map((s) => s.cmd)).toEqual(['echo', 'echo', 'echo', 'echo', 'cat']);
  });

  it('captures inline assignments', () => {
    const [seg] = parseSegments('FOO=bar BAZ=qux ls -la');
    expect(seg.env).toEqual({ FOO: 'bar', BAZ: 'qux' });
    expect(seg.cmd).toBe('ls');
    expect(seg.args).toEqual(['-la']);
  });

  it('honours single quotes as literal', () => {
    const [seg] = parseSegments(`echo 'a; b && c'`);
    expect(seg.cmd).toBe('echo');
    expect(seg.args).toEqual(['a; b && c']);
  });

  it('honours double quotes', () => {
    const [seg] = parseSegments('echo "a; b && c"');
    expect(seg.cmd).toBe('echo');
    expect(seg.args).toEqual(['a; b && c']);
  });

  it('handles backslash escapes', () => {
    const [seg] = parseSegments('echo a\\;b');
    expect(seg.args).toEqual(['a;b']);
  });

  it('parses parenthesised subshells and marks members', () => {
    const segments = parseSegments('(cd /etc && cat passwd)');
    expect(segments.length).toBe(2);
    expect(segments.every((s) => s.subshell)).toBe(true);
    expect(segments[0].cmd).toBe('cd');
    expect(segments[1].cmd).toBe('cat');
  });

  it('parses nested $() substitutions and marks them', () => {
    const segments = parseSegments('echo $(cd /etc && pwd)');
    expect(segments[0].cmd).toBe('echo');
    expect(segments[0].nested.length).toBeGreaterThan(0);
    expect(segments[0].nested.every((s) => s.substitution)).toBe(true);
  });

  it('parses backtick substitutions and marks them', () => {
    const segments = parseSegments('echo `cd /etc && pwd`');
    expect(segments[0].nested.length).toBeGreaterThan(0);
    expect(segments[0].nested.every((s) => s.substitution)).toBe(true);
  });

  it('exposes BUILTINS_DIRECTORY_MUTATORS with all expected entries', () => {
    expect(BUILTINS_DIRECTORY_MUTATORS.has('cd')).toBe(true);
    expect(BUILTINS_DIRECTORY_MUTATORS.has('pushd')).toBe(true);
    expect(BUILTINS_DIRECTORY_MUTATORS.has('popd')).toBe(true);
    expect(BUILTINS_DIRECTORY_MUTATORS.has('chdir')).toBe(true);
  });
});

describe('auditShellCommand — directory escape cases', () => {
  it('denies `cd /tmp` outside the workspace allowlist', () => {
    const r = auditShellCommand(`cd ${OUTSIDE}`, { workspace: WORKSPACE });
    expect(r.denials.length).toBe(1);
    expect(r.denials[0].reason).toBe('cd-outside-workspace');
  });

  it('denies `cd ..` from workspace into parent (outside allowlist)', () => {
    // The parent of any tmpdir() subdir is outside our workspace by definition.
    const r = auditShellCommand('cd ..', { workspace: WORKSPACE });
    expect(r.denials.length).toBe(1);
    expect(r.denials[0].reason).toBe('cd-outside-workspace');
  });

  it('denies `cd -` with no prior cd / OLDPWD', () => {
    const r = auditShellCommand('cd -', { workspace: WORKSPACE });
    expect(r.denials.length).toBe(1);
    expect(r.denials[0].reason).toBe('cd-dash-no-oldpwd');
  });

  it('denies `pushd /etc`', () => {
    const r = auditShellCommand('pushd /etc', { workspace: WORKSPACE });
    expect(r.denials.length).toBe(1);
    expect(r.denials[0].reason).toBe('pushd-outside-workspace');
  });

  it('denies `(cd /etc && cat passwd)` (subshell escape)', () => {
    const r = auditShellCommand('(cd /etc && cat passwd)', { workspace: WORKSPACE });
    expect(r.denials.length).toBeGreaterThanOrEqual(1);
    const reasons = r.denials.map((d) => d.reason);
    expect(reasons).toContain('cd-outside-workspace');
  });

  it('denies `cd /tmp && cd ..` whose chained target lands at `/`', () => {
    // First cd jumps into /tmp (outside workspace) — already a denial.
    // The chained `cd ..` then resolves to `/` which is also outside.
    const r = auditShellCommand(`cd ${OUTSIDE} && cd ..`, { workspace: WORKSPACE });
    expect(r.denials.length).toBeGreaterThanOrEqual(1);
    expect(r.denials.every((d) => d.reason === 'cd-outside-workspace')).toBe(true);
  });

  it('denies `PWD=/etc cat foo`', () => {
    const r = auditShellCommand('PWD=/etc cat foo', { workspace: WORKSPACE });
    expect(r.denials.length).toBe(1);
    expect(r.denials[0].reason).toBe('pwd-assignment');
  });

  it('denies `OLDPWD=/etc cd -`', () => {
    const r = auditShellCommand('OLDPWD=/etc cd -', { workspace: WORKSPACE });
    expect(r.denials.some((d) => d.reason === 'oldpwd-assignment')).toBe(true);
  });

  it('denies `cd $UNRESOLVED_VAR` (unknown target)', () => {
    const r = auditShellCommand('cd $SOMEWHERE', { workspace: WORKSPACE });
    expect(r.denials.length).toBe(1);
    expect(r.denials[0].reason).toBe('unknown-target');
  });

  it('denies `cd $(echo /etc)` (substitution makes target unresolvable)', () => {
    const r = auditShellCommand('cd $(echo /etc)', { workspace: WORKSPACE });
    // The outer `cd` has unresolved target AND the inner substitution's `echo`
    // doesn't itself escape — so we expect at least one unknown-target denial.
    expect(r.denials.some((d) => d.reason === 'unknown-target')).toBe(true);
  });
});

describe('auditShellCommand — allowed cases', () => {
  it('allows `cd` within the workspace', () => {
    const r = auditShellCommand('cd subdir', { workspace: WORKSPACE });
    expect(r.denials).toEqual([]);
  });

  it('allows `cd` to an allowlisted external dir (regression for external-directory.ts)', () => {
    const r = auditShellCommand(`cd ${OUTSIDE}`, {
      workspace: WORKSPACE,
      allowlist: [OUTSIDE],
    });
    expect(r.denials).toEqual([]);
  });

  it('allows `cd` to a subdir of an allowlisted external dir', () => {
    const r = auditShellCommand(`cd ${path.join(OUTSIDE, 'nested')}`, {
      workspace: WORKSPACE,
      allowlist: [OUTSIDE],
    });
    expect(r.denials).toEqual([]);
  });

  it('allows commands without directory mutators', () => {
    const r = auditShellCommand('echo hello && ls -la | grep foo', { workspace: WORKSPACE });
    expect(r.denials).toEqual([]);
  });

  it('allows `cd -` when prior OLDPWD is provided and inside workspace', () => {
    const r = auditShellCommand('cd -', {
      workspace: WORKSPACE,
      oldPwd: path.join(WORKSPACE, 'previous'),
    });
    expect(r.denials).toEqual([]);
  });

  it('allows `cd /allowed/path` style absolute paths inside the workspace', () => {
    const r = auditShellCommand(`cd ${path.join(WORKSPACE, 'foo', 'bar')}`, {
      workspace: WORKSPACE,
    });
    expect(r.denials).toEqual([]);
  });

  it('does not flag ordinary commands with `cd` substring (e.g. `cdrom-info`)', () => {
    const r = auditShellCommand('cdrom-info && echo done', { workspace: WORKSPACE });
    expect(r.denials).toEqual([]);
  });
});

describe('auditShellCommand — chained cwd tracking', () => {
  it('tracks chained `cd` so a later `cd ..` is evaluated against the new cwd', () => {
    // Walk into an allowlisted dir, then cd into one of its subdirs — both
    // resolved targets stay inside the allowlist so no denial.
    const allowed = path.join(WORKSPACE, 'allowed-side');
    const r = auditShellCommand('cd allowed-side && cd nested', {
      workspace: WORKSPACE,
      allowlist: [allowed],
    });
    expect(r.denials).toEqual([]);
  });

  it('subshell `cd` does NOT bleed into parent cwd', () => {
    // Inside the subshell `cd /tmp` is denied; afterwards the parent shell's
    // cwd is still WORKSPACE so `ls` is allowed (no denial added for it).
    const r = auditShellCommand(`(cd ${OUTSIDE}) && ls`, { workspace: WORKSPACE });
    // Exactly one denial — the subshell's escape attempt.
    expect(r.denials.length).toBe(1);
    expect(r.denials[0].reason).toBe('cd-outside-workspace');
  });
});
