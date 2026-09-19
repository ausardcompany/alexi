/**
 * Tests for the shell permission pattern masker.
 *
 * Adapted from upstream `packages/opencode/test/kilocode/tool/shell-pattern.test.ts`.
 * The port targets vitest (bun's runner is not available here) and uses the
 * `patternFor` convenience export so the tests exercise the exact path the
 * shell tool uses at runtime (tree-sitter parse -> `pattern()`).
 *
 * When `tree-sitter-bash` is not installed the masker falls back to the raw
 * command; in that case the "still exposes real operators" cases are still
 * meaningful (raw text keeps its operators), but the "masks inert operators"
 * cases are skipped because there is nothing to parse against.
 */

import { describe, it, expect } from 'vitest';
import { checkGrammarAvailable } from '../context/treeSitter.js';
import { patternFor } from './shell-pattern.js';

const bashAvailable = checkGrammarAvailable('bash');
const describeIfBash = bashAvailable ? describe : describe.skip;

describe('shell-pattern raw-text guarantees', () => {
  it('returns the raw command when nothing needs masking', () => {
    expect(patternFor('ls -la', 'bash')).toBe('ls -la');
  });

  it('never returns an empty string for a non-empty input', () => {
    const out = patternFor('echo hello', 'bash');
    expect(out.length).toBeGreaterThan(0);
  });

  it('leaves non-POSIX shells (powershell/cmd) untouched', () => {
    // Non-POSIX shells don't share the bash operator glossary; the masker
    // deliberately returns the raw text so PowerShell / cmd rulesets keep
    // seeing exactly what the user wrote.
    expect(patternFor('Get-ChildItem | Where-Object', 'powershell')).toBe(
      'Get-ChildItem | Where-Object'
    );
    expect(patternFor('dir | findstr foo', 'cmd')).toBe('dir | findstr foo');
  });
});

describeIfBash('shell-pattern masking (tree-sitter-bash)', () => {
  it('does not deny grep with pipe inside quoted regex', () => {
    // `grep -E "foo|bar" file.txt` — the `|` is inside a quoted string and
    // must be masked so a `*|*` deny glob does not fire.
    const out = patternFor('grep -E "foo|bar" file.txt', 'bash');
    expect(out).not.toContain('|');
  });

  it('does not deny redirect to /dev/null', () => {
    // `2>/dev/null` — the redirect is inert, so the `>` must be masked.
    const out = patternFor('command 2>/dev/null', 'bash');
    expect(out).not.toContain('>');
  });

  it('does not deny fd duplication (2>&1)', () => {
    // Duplicating fd 2 onto fd 1 cannot touch the filesystem — mask both
    // the `>` and the `&`.
    const out = patternFor('command 2>&1', 'bash');
    expect(out).not.toContain('>');
    expect(out).not.toContain('&');
  });

  it('still exposes real pipes to the ruleset', () => {
    const out = patternFor('cat file | grep foo', 'bash');
    expect(out).toContain('|');
  });

  it('still exposes real redirects to the ruleset', () => {
    const out = patternFor('echo x > file.txt', 'bash');
    expect(out).toContain('>');
  });

  it('still exposes command substitution', () => {
    const out = patternFor('echo $(whoami)', 'bash');
    expect(out).toContain('$');
  });

  it('masks operator characters inside single-quoted strings', () => {
    const out = patternFor("echo 'a|b;c>d'", 'bash');
    // Everything inside the quotes must be masked, so no operator char
    // sneaks through from the quoted body.
    expect(out).not.toContain('|');
    expect(out).not.toContain(';');
    // The `>` above lives inside the quoted string only, so it should be
    // masked too.
    expect(out).not.toContain('>');
  });

  it('still surfaces statement separators outside quotes', () => {
    const out = patternFor('ls ; pwd', 'bash');
    expect(out).toContain(';');
  });
});
