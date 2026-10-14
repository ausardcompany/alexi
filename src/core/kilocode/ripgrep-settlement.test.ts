/**
 * Settlement test for the ripgrep argv assembly in `src/core/ripgrep.ts`.
 *
 * "Settlement" here means: this test freezes the externally observable argv
 * shape so a future refactor can't silently reintroduce the `--glob=<pattern>`
 * override bug (see `ripgrep-glob.test.ts` for the full regression story).
 *
 * Historically this file asserted `--glob=*.ts` was present in the argv when
 * an include pattern was passed. That was the bug: `--glob=` makes the
 * pattern a ripgrep override, which wins over `.gitignore`. The include-glob
 * path still legitimately uses `--glob=` because operator-supplied include
 * patterns ARE meant to override ignore rules — but the agent-supplied
 * pattern (`input.pattern`) must NOT.
 */

import { describe, it, expect } from 'vitest';
import { assembleGlobArgs } from '../ripgrep.js';

describe('ripgrep settlement: argv shape', () => {
  it('applies the pattern after ignore rules via --pre-glob + --type-add', () => {
    const passed = assembleGlobArgs({ pattern: '*.ts' });
    // The include glob is applied after ignore rules: validated by ripgrep,
    // prefiltered as a file type.
    expect(passed).toContain('--pre-glob=*.ts');
    expect(passed).toContain('--type-add=kiloglob:*.ts');
    // The critical regression guard: the agent-supplied pattern is NEVER
    // emitted as `--glob=...` because that would make it a ripgrep override
    // and surface `.gitignore`-ignored paths.
    expect(passed).not.toContain('--glob=*.ts');
  });

  it('still emits operator-supplied include globs as --glob=', () => {
    // include/exclude patterns are intentional overrides (operator config,
    // not agent input), so they keep the historical --glob= plumbing.
    const passed = assembleGlobArgs({
      pattern: '**/*',
      include: ['*.ts'],
      exclude: ['node_modules/**'],
    });
    expect(passed).toContain('--glob=*.ts');
    expect(passed).toContain('--glob=!node_modules/**');
  });

  it('does NOT emit the agent pattern as --glob= for a broad `**\/*` search', () => {
    const passed = assembleGlobArgs({ pattern: '**/*' });
    expect(passed).not.toContain('--glob=**/*');
  });
});
