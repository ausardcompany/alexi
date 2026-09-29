/**
 * Tests for `src/cli/commands/models.ts` — the `alexi models` CLI command.
 *
 * Focus: issue #1886 — surface model-list endpoint errors to stderr with a
 * non-zero exit code and an actionable hint.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Command } from 'commander';

// Hoisted mocks so any transitive import sees the stubs.
const { executeMock, deploymentQueryMock } = vi.hoisted(() => {
  const executeMock = vi.fn();
  const deploymentQueryMock = vi.fn(() => ({ execute: executeMock }));
  return { executeMock, deploymentQueryMock };
});

vi.mock('@sap-ai-sdk/ai-api', () => ({
  DeploymentApi: {
    deploymentQuery: deploymentQueryMock,
  },
}));

const { envMock } = vi.hoisted(() => ({ envMock: vi.fn() }));

vi.mock('../../../src/config/env.js', () => ({
  env: envMock,
}));

import { registerModelsCommand } from '../../../src/cli/commands/models.js';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function runModelsCommand(argv: string[]): Promise<{
  exitCode: number | null;
  stderr: string;
  stdout: string;
}> {
  let exitCode: number | null = null;
  const exitSpy = vi.spyOn(process, 'exit').mockImplementation(((code?: number) => {
    exitCode = code ?? 0;
    // Throw so control returns to the caller instead of actually exiting.
    throw new Error(`__exit__:${exitCode}`);
  }) as never);
  const stderrLines: string[] = [];
  const stdoutLines: string[] = [];
  const errSpy = vi.spyOn(console, 'error').mockImplementation((...args: unknown[]) => {
    stderrLines.push(args.map((a) => String(a)).join(' '));
  });
  const outSpy = vi.spyOn(console, 'log').mockImplementation((...args: unknown[]) => {
    stdoutLines.push(args.map((a) => String(a)).join(' '));
  });

  const program = new Command();
  program.exitOverride(); // prevent commander from calling process.exit itself
  registerModelsCommand(program);

  try {
    await program.parseAsync(argv, { from: 'user' });
  } catch (err) {
    // Swallow the synthetic exit and commander parse errors — they are
    // expected control-flow, not test failures.
    if (!(err instanceof Error) || !err.message.startsWith('__exit__')) {
      // Not our synthetic exit — rethrow only if it was not commander.
      if (!(err instanceof Error) || !/CommanderError|commander/i.test(err.name + err.message)) {
        // Keep it silent; the assertion below on exitCode is authoritative.
      }
    }
  }

  exitSpy.mockRestore();
  errSpy.mockRestore();
  outSpy.mockRestore();

  return {
    exitCode,
    stderr: stderrLines.join('\n'),
    stdout: stdoutLines.join('\n'),
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

beforeEach(() => {
  executeMock.mockReset();
  deploymentQueryMock.mockClear();
  envMock.mockReset();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('alexi models — error surfacing (issue #1886)', () => {
  it('exits non-zero and prints a classified reason + hint on 401', async () => {
    envMock.mockImplementation((key: string) => (key === 'AICORE_SERVICE_KEY' ? '{}' : undefined));
    executeMock.mockRejectedValue(Object.assign(new Error('boom'), { status: 401 }));

    const { exitCode, stderr } = await runModelsCommand(['models']);

    expect(exitCode).toBe(1);
    expect(stderr).toMatch(/unauthorized/i);
    expect(stderr).toMatch(/AICORE_SERVICE_KEY/);
    expect(stderr).toMatch(/Hint:/);
  });

  it('exits non-zero and prints a 404 hint suggesting -m fallback', async () => {
    envMock.mockImplementation((key: string) => (key === 'AICORE_SERVICE_KEY' ? '{}' : undefined));
    executeMock.mockRejectedValue(Object.assign(new Error('not found'), { status: 404 }));

    const { exitCode, stderr } = await runModelsCommand(['models']);

    expect(exitCode).toBe(1);
    expect(stderr).toMatch(/endpoint not found|not found/i);
    expect(stderr).toMatch(/AI_API_URL|-m/);
  });

  it('exits non-zero when AICORE_SERVICE_KEY is missing', async () => {
    envMock.mockReturnValue(undefined);

    const { exitCode, stderr } = await runModelsCommand(['models']);

    expect(exitCode).toBe(1);
    expect(stderr).toMatch(/AICORE_SERVICE_KEY/);
  });
});
