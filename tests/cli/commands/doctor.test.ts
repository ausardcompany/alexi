/**
 * Tests for `src/cli/commands/doctor.ts` — `alexi doctor` wiring.
 *
 * Focus: command registration, flag parsing, and output routing. The
 * underlying health checks are covered by `tests/doctor/index.test.ts`.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Command } from 'commander';

const { runAllMock, getSummaryMock, formatJsonMock, formatReportMock, formatReportPlainMock } =
  vi.hoisted(() => ({
    runAllMock: vi.fn(),
    getSummaryMock: vi.fn(),
    formatJsonMock: vi.fn(),
    formatReportMock: vi.fn(),
    formatReportPlainMock: vi.fn(),
  }));

vi.mock('../../../src/doctor/index.js', () => ({
  getDoctor: () => ({
    runAll: runAllMock,
    getSummary: getSummaryMock,
    formatJson: formatJsonMock,
    formatReport: formatReportMock,
    formatReportPlain: formatReportPlainMock,
  }),
}));

import { registerDoctorCommand } from '../../../src/cli/commands/doctor.js';

interface Captured {
  stdout: string;
  exitCode: number | undefined;
}

async function runDoctorCommand(argv: string[]): Promise<Captured> {
  const stdoutChunks: string[] = [];
  const outSpy = vi.spyOn(process.stdout, 'write').mockImplementation(((
    chunk: string | Uint8Array
  ) => {
    stdoutChunks.push(typeof chunk === 'string' ? chunk : String(chunk));
    return true;
  }) as never);

  const previousExitCode = process.exitCode;
  process.exitCode = undefined;

  const program = new Command();
  program.exitOverride();
  registerDoctorCommand(program);

  try {
    await program.parseAsync(['node', 'alexi', 'doctor', ...argv]);
  } finally {
    outSpy.mockRestore();
  }

  const exitCode = process.exitCode;
  process.exitCode = previousExitCode;

  return {
    stdout: stdoutChunks.join(''),
    exitCode,
  };
}

describe('alexi doctor', () => {
  beforeEach(() => {
    runAllMock.mockReset();
    getSummaryMock.mockReset();
    formatJsonMock.mockReset();
    formatReportMock.mockReset();
    formatReportPlainMock.mockReset();

    // Default: all pass
    runAllMock.mockResolvedValue([
      {
        id: 'test',
        name: 'Test Check',
        status: 'pass',
        message: 'ok',
        duration: 1,
      },
    ]);
    getSummaryMock.mockReturnValue({ passed: 1, warned: 0, failed: 0 });
    formatJsonMock.mockReturnValue('{"overall":"pass"}');
    formatReportMock.mockReturnValue('verbose report');
    formatReportPlainMock.mockReturnValue('plain report');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('runs all checks and emits plain-text report by default', async () => {
    const { stdout, exitCode } = await runDoctorCommand([]);
    expect(runAllMock).toHaveBeenCalledWith({ skipNetwork: undefined, fix: undefined });
    expect(formatReportPlainMock).toHaveBeenCalled();
    expect(formatReportMock).not.toHaveBeenCalled();
    expect(stdout).toContain('plain report');
    expect(exitCode).toBeUndefined();
  });

  it('emits colored verbose report with --verbose', async () => {
    const { stdout } = await runDoctorCommand(['--verbose']);
    expect(formatReportMock).toHaveBeenCalled();
    expect(formatReportPlainMock).not.toHaveBeenCalled();
    expect(stdout).toContain('verbose report');
  });

  it('emits JSON with --json', async () => {
    const { stdout } = await runDoctorCommand(['--json']);
    expect(formatJsonMock).toHaveBeenCalled();
    expect(stdout).toContain('"overall":"pass"');
  });

  it('passes --fix through to runAll', async () => {
    await runDoctorCommand(['--fix']);
    expect(runAllMock).toHaveBeenCalledWith(expect.objectContaining({ fix: true }));
  });

  it('passes --skip-network through to runAll', async () => {
    await runDoctorCommand(['--skip-network']);
    expect(runAllMock).toHaveBeenCalledWith(expect.objectContaining({ skipNetwork: true }));
  });

  it('exits with code 1 when any check fails', async () => {
    getSummaryMock.mockReturnValue({ passed: 0, warned: 0, failed: 1 });
    const { exitCode } = await runDoctorCommand([]);
    expect(exitCode).toBe(1);
  });

  it('exits with no error code when only warnings are present', async () => {
    getSummaryMock.mockReturnValue({ passed: 0, warned: 1, failed: 0 });
    const { exitCode } = await runDoctorCommand([]);
    expect(exitCode).toBeUndefined();
  });
});
