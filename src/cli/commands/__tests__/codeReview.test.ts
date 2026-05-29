/**
 * Commander wiring smoke test for `alexi code-review`.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../../command/codeReview.js', () => ({
  executeCodeReview: vi.fn(),
}));

import { Command } from 'commander';
import { registerCodeReviewCommand } from '../codeReview.js';
import { executeCodeReview } from '../../../command/codeReview.js';

describe('alexi code-review (Commander wiring)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(executeCodeReview).mockResolvedValue({
      success: true,
      diffBytes: 0,
      effort: 'medium',
      review: 'No changes to review.\n',
      modelUsed: '',
      totalTokens: 0,
      elapsedMs: 1,
    });
  });

  function makeProgram(): Command {
    const program = new Command();
    program.exitOverride(); // throw instead of process.exit
    registerCodeReviewCommand(program);
    return program;
  }

  it('registers a subcommand named "code-review"', () => {
    const program = makeProgram();
    const sub = program.commands.find((c) => c.name() === 'code-review');
    expect(sub).toBeDefined();
    expect(sub?.description()).toContain('correctness');
  });

  it('forwards the default uncommitted target to executeCodeReview', async () => {
    const program = makeProgram();
    await program.parseAsync(['node', 'alexi', 'code-review']);

    expect(executeCodeReview).toHaveBeenCalledTimes(1);
    const opts = vi.mocked(executeCodeReview).mock.calls[0][0];
    expect(opts?.effort).toBe('medium');
    expect(opts?.target).toBe('uncommitted');
  });

  it('forwards --effort high and --base main', async () => {
    const program = makeProgram();
    await program.parseAsync([
      'node',
      'alexi',
      'code-review',
      '--effort',
      'high',
      '--base',
      'main',
    ]);

    const opts = vi.mocked(executeCodeReview).mock.calls[0][0];
    expect(opts?.effort).toBe('high');
    expect(opts?.target).toEqual({ base: 'main' });
  });
});
