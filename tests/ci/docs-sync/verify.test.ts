import { describe, it, expect, vi } from 'vitest';
import { verifyBuild } from '../../../src/ci/docsSync/verify.js';
import type { CommandResult, CommandRunner, FixPass } from '../../../src/ci/docsSync/verify.js';

/**
 * Builds a mock CommandRunner from a queue of results. Each spawn shifts the
 * next result off the queue; missing entries default to a passing exit code
 * so tests only need to list the failures.
 */
function makeRunner(results: readonly CommandResult[]): {
  run: CommandRunner;
  calls: Array<{ command: string; args: readonly string[] }>;
} {
  const calls: Array<{ command: string; args: readonly string[] }> = [];
  const queue = [...results];
  const run: CommandRunner = async (command, args) => {
    calls.push({ command, args });
    return queue.shift() ?? { exitCode: 0, output: '' };
  };
  return { run, calls };
}

describe('verifyBuild', () => {
  it('returns success without fix pass when all gates pass', async () => {
    const { run, calls } = makeRunner([
      { exitCode: 0, output: 'built' },
      { exitCode: 0, output: 'tested' },
    ]);
    const fix = vi.fn<FixPass>();

    const result = await verifyBuild({ run, fix });

    expect(result).toEqual({
      success: true,
      fixAttempted: false,
      failedCommand: '',
      failedOutput: '',
    });
    expect(calls).toHaveLength(2);
    expect(calls[0]).toEqual({ command: 'npm', args: ['run', 'build'] });
    expect(calls[1]).toEqual({ command: 'npm', args: ['run', 'test'] });
    expect(fix).not.toHaveBeenCalled();
  });

  it('returns success=true and fixAttempted=true when fix pass rescues the build', async () => {
    const { run, calls } = makeRunner([
      { exitCode: 1, output: 'ts error' }, // build fails
      { exitCode: 0, output: 'built after fix' },
      { exitCode: 0, output: 'tested' },
    ]);
    const fix = vi.fn<FixPass>().mockResolvedValue(undefined);

    const result = await verifyBuild({ run, fix });

    expect(result.success).toBe(true);
    expect(result.fixAttempted).toBe(true);
    expect(result.failedCommand).toBe('');
    expect(fix).toHaveBeenCalledTimes(1);
    expect(fix).toHaveBeenCalledWith({ failedCommand: 'npm run build', output: 'ts error' });
    // Order: build (fail) -> fix -> build (pass) -> test (pass).
    expect(calls.map((c) => `${c.command} ${c.args.join(' ')}`)).toEqual([
      'npm run build',
      'npm run build',
      'npm run test',
    ]);
  });

  it('returns success=false when the fix pass fails to rescue the gate', async () => {
    const { run } = makeRunner([
      { exitCode: 1, output: 'first fail' },
      { exitCode: 1, output: 'still broken' },
    ]);
    const fix = vi.fn<FixPass>().mockResolvedValue(undefined);

    const result = await verifyBuild({ run, fix });

    expect(result).toEqual({
      success: false,
      fixAttempted: true,
      failedCommand: 'npm run build',
      failedOutput: 'still broken',
    });
    expect(fix).toHaveBeenCalledTimes(1);
  });

  it('does not invoke the fix pass when no fix is provided', async () => {
    const { run } = makeRunner([{ exitCode: 2, output: 'nope' }]);

    const result = await verifyBuild({ run });

    expect(result).toEqual({
      success: false,
      fixAttempted: false,
      failedCommand: 'npm run build',
      failedOutput: 'nope',
    });
  });

  it('reports the failing test gate correctly on a fresh failure', async () => {
    const { run } = makeRunner([
      { exitCode: 0, output: '' },
      { exitCode: 1, output: 'vitest failure' },
    ]);

    const result = await verifyBuild({ run });

    expect(result.success).toBe(false);
    expect(result.failedCommand).toBe('npm run test');
    expect(result.failedOutput).toBe('vitest failure');
  });

  it('honours a custom gate list', async () => {
    const { run, calls } = makeRunner([
      { exitCode: 0, output: '' },
      { exitCode: 0, output: '' },
    ]);

    const result = await verifyBuild({
      run,
      gates: [
        ['npm', 'run', 'lint'],
        ['npm', 'run', 'typecheck'],
      ],
    });

    expect(result.success).toBe(true);
    expect(calls[0]).toEqual({ command: 'npm', args: ['run', 'lint'] });
    expect(calls[1]).toEqual({ command: 'npm', args: ['run', 'typecheck'] });
  });

  it('returns success for an empty gate list without spawning anything', async () => {
    const { run, calls } = makeRunner([]);

    const result = await verifyBuild({ run, gates: [] });

    expect(result.success).toBe(true);
    expect(result.fixAttempted).toBe(false);
    expect(calls).toHaveLength(0);
  });

  it('does not run later gates once an earlier gate fails', async () => {
    const { run, calls } = makeRunner([
      { exitCode: 5, output: 'boom' },
      { exitCode: 0, output: 'never reached' },
    ]);

    await verifyBuild({ run });

    expect(calls).toHaveLength(1);
    expect(calls[0]).toEqual({ command: 'npm', args: ['run', 'build'] });
  });

  it('propagates errors thrown by the fix pass', async () => {
    const { run } = makeRunner([{ exitCode: 1, output: 'fail' }]);
    const fix = vi.fn<FixPass>().mockRejectedValue(new Error('fix crashed'));

    await expect(verifyBuild({ run, fix })).rejects.toThrow('fix crashed');
  });
});
