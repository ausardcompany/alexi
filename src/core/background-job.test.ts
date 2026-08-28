/**
 * Regression tests for `selectJobOutput` — upstream kilocode #13469 fix
 * (empty outputs from extended background runs must not clobber earlier
 * non-empty outputs).
 */
import { describe, expect, it } from 'vitest';
import { selectJobOutput, type JobExit, type JobOutput } from './background-job.js';

describe('selectJobOutput', () => {
  it('records the first successful non-empty output', () => {
    const exit: JobExit = { success: true, value: 'real answer' };
    expect(selectJobOutput(undefined, exit, 0)).toEqual({
      sequence: 0,
      text: 'real answer',
    });
  });

  it('keeps the earlier non-empty output when an extended run returns empty', () => {
    const previous: JobOutput = { sequence: 0, text: 'real answer' };
    const extendedEmpty: JobExit = { success: true, value: '' };
    expect(selectJobOutput(previous, extendedEmpty, 1)).toEqual(previous);
  });

  it('replaces the stored output when a later non-empty run wins', () => {
    const previous: JobOutput = { sequence: 0, text: 'first' };
    const followup: JobExit = { success: true, value: 'second' };
    expect(selectJobOutput(previous, followup, 1)).toEqual({
      sequence: 1,
      text: 'second',
    });
  });

  it('ignores a failed exit even when it carries text', () => {
    const previous: JobOutput = { sequence: 0, text: 'real answer' };
    const failed: JobExit = { success: false, value: 'error trace' };
    expect(selectJobOutput(previous, failed, 5)).toEqual(previous);
  });

  it('does not replace when the sequence is not strictly greater', () => {
    const previous: JobOutput = { sequence: 3, text: 'kept' };
    const stale: JobExit = { success: true, value: 'stale' };
    expect(selectJobOutput(previous, stale, 3)).toEqual(previous);
    expect(selectJobOutput(previous, stale, 2)).toEqual(previous);
  });
});
