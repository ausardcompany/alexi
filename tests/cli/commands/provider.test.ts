/**
 * Tests for `src/cli/commands/provider.ts` — `alexi provider health`.
 *
 * Issue #2067. Focus: formatter output and command wiring. The
 * underlying checks are covered by `tests/providers/health.test.ts`.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Command } from 'commander';

const { checkProviderHealthMock, checkAllProviderHealthMock, listConfiguredProvidersMock } =
  vi.hoisted(() => ({
    checkProviderHealthMock: vi.fn(),
    checkAllProviderHealthMock: vi.fn(),
    listConfiguredProvidersMock: vi.fn(),
  }));

vi.mock('../../../src/providers/health.js', () => ({
  checkProviderHealth: checkProviderHealthMock,
  checkAllProviderHealth: checkAllProviderHealthMock,
  listConfiguredProviders: listConfiguredProvidersMock,
  KNOWN_PROVIDERS: ['sap-ai-core', 'sap-proxy'] as const,
}));

import {
  formatHealthReport,
  formatHealthResult,
  registerProviderCommand,
} from '../../../src/cli/commands/provider.js';
import type { HealthResult } from '../../../src/providers/health.js';

interface Captured {
  stdout: string;
  stderr: string;
  exitCode: number | undefined;
}

async function runProviderCommand(argv: string[]): Promise<Captured> {
  const stdoutChunks: string[] = [];
  const stderrChunks: string[] = [];
  const outSpy = vi.spyOn(process.stdout, 'write').mockImplementation(((
    chunk: string | Uint8Array
  ) => {
    stdoutChunks.push(typeof chunk === 'string' ? chunk : String(chunk));
    return true;
  }) as never);
  const errSpy = vi.spyOn(process.stderr, 'write').mockImplementation(((
    chunk: string | Uint8Array
  ) => {
    stderrChunks.push(typeof chunk === 'string' ? chunk : String(chunk));
    return true;
  }) as never);

  // Reset exitCode so tests do not inherit state from earlier runs.
  const previousExitCode = process.exitCode;
  process.exitCode = undefined;

  const program = new Command();
  program.exitOverride();
  registerProviderCommand(program);

  try {
    await program.parseAsync(argv, { from: 'user' });
  } catch (err) {
    // Commander throws on exitOverride; ignore unless unexpected.
    if (!(err instanceof Error) || !/CommanderError|commander/i.test(err.name + err.message)) {
      // non-commander errors are suppressed; assertions below are authoritative.
    }
  }

  const captured: Captured = {
    stdout: stdoutChunks.join(''),
    stderr: stderrChunks.join(''),
    exitCode: process.exitCode,
  };
  process.exitCode = previousExitCode;
  outSpy.mockRestore();
  errSpy.mockRestore();
  return captured;
}

beforeEach(() => {
  checkProviderHealthMock.mockReset();
  checkAllProviderHealthMock.mockReset();
  listConfiguredProvidersMock.mockReset();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('formatHealthResult', () => {
  it('renders an OK line with latency', () => {
    const result: HealthResult = {
      provider: 'sap-ai-core',
      ok: true,
      latency: 42,
      details: { envVars: [], attemptedProbe: true },
    };
    const out = formatHealthResult(result, false);
    expect(out).toContain('sap-ai-core');
    expect(out).toContain('OK');
    expect(out).toContain('42ms');
  });

  it('renders a FAIL line with the error reason', () => {
    const result: HealthResult = {
      provider: 'sap-proxy',
      ok: false,
      error: 'SAP_PROXY_BASE_URL is not set',
      details: { envVars: [], attemptedProbe: false },
    };
    const out = formatHealthResult(result, false);
    expect(out).toContain('FAIL');
    expect(out).toContain('SAP_PROXY_BASE_URL');
  });

  it('includes env var table and endpoint under verbose mode', () => {
    const result: HealthResult = {
      provider: 'sap-ai-core',
      ok: true,
      latency: 10,
      details: {
        envVars: [
          { name: 'AICORE_SERVICE_KEY', present: true, required: true },
          { name: 'AICORE_RESOURCE_GROUP', present: false, required: false },
        ],
        endpoint: 'https://api.example',
        connectivity: { reachable: true },
        attemptedProbe: true,
      },
    };
    const out = formatHealthResult(result, true);
    expect(out).toContain('AICORE_SERVICE_KEY');
    expect(out).toContain('AICORE_RESOURCE_GROUP');
    expect(out).toContain('optional');
    expect(out).toContain('https://api.example');
    expect(out).toContain('Reachable');
  });
});

describe('formatHealthReport', () => {
  it('shows a helpful message when no providers are configured', () => {
    const out = formatHealthReport([], false);
    expect(out).toContain('No providers configured');
    expect(out).toContain('AICORE_SERVICE_KEY');
    expect(out).toContain('SAP_PROXY_BASE_URL');
  });

  it('summarises ok vs failed counts', () => {
    const results: HealthResult[] = [
      { provider: 'sap-ai-core', ok: true, details: { envVars: [], attemptedProbe: true } },
      {
        provider: 'sap-proxy',
        ok: false,
        error: 'missing',
        details: { envVars: [], attemptedProbe: false },
      },
    ];
    const out = formatHealthReport(results, false);
    expect(out).toContain('1 ok');
    expect(out).toContain('1 failed');
  });
});

describe('alexi provider health — command wiring', () => {
  it('checks a specific provider when --provider is passed', async () => {
    checkProviderHealthMock.mockResolvedValue({
      provider: 'sap-ai-core',
      ok: true,
      latency: 15,
      details: { envVars: [], attemptedProbe: true },
    });

    const result = await runProviderCommand(['provider', 'health', '--provider', 'sap-ai-core']);

    expect(checkProviderHealthMock).toHaveBeenCalledWith(
      'sap-ai-core',
      expect.objectContaining({ skipNetwork: false })
    );
    expect(result.stdout).toContain('sap-ai-core');
    expect(result.exitCode).toBeUndefined();
  });

  it('iterates over configured providers when --provider is omitted', async () => {
    listConfiguredProvidersMock.mockReturnValue(['sap-ai-core']);
    checkAllProviderHealthMock.mockResolvedValue([
      { provider: 'sap-ai-core', ok: true, details: { envVars: [], attemptedProbe: true } },
    ]);

    const result = await runProviderCommand(['provider', 'health']);

    expect(listConfiguredProvidersMock).toHaveBeenCalled();
    expect(checkAllProviderHealthMock).toHaveBeenCalledWith(['sap-ai-core'], expect.any(Object));
    expect(result.stdout).toContain('sap-ai-core');
    expect(result.exitCode).toBeUndefined();
  });

  it('sets exitCode=1 when any provider fails', async () => {
    listConfiguredProvidersMock.mockReturnValue(['sap-ai-core']);
    checkAllProviderHealthMock.mockResolvedValue([
      {
        provider: 'sap-ai-core',
        ok: false,
        error: 'AICORE_SERVICE_KEY is not set',
        details: { envVars: [], attemptedProbe: false },
      },
    ]);

    const result = await runProviderCommand(['provider', 'health']);

    expect(result.exitCode).toBe(1);
    expect(result.stdout).toContain('FAIL');
    expect(result.stdout).toContain('AICORE_SERVICE_KEY');
  });

  it('passes --skip-network through to the health check', async () => {
    listConfiguredProvidersMock.mockReturnValue(['sap-ai-core']);
    checkAllProviderHealthMock.mockResolvedValue([]);

    await runProviderCommand(['provider', 'health', '--skip-network']);

    expect(checkAllProviderHealthMock).toHaveBeenCalledWith(
      ['sap-ai-core'],
      expect.objectContaining({ skipNetwork: true })
    );
  });

  it('converts --timeout seconds to milliseconds', async () => {
    checkProviderHealthMock.mockResolvedValue({
      provider: 'sap-ai-core',
      ok: true,
      details: { envVars: [], attemptedProbe: true },
    });

    await runProviderCommand(['provider', 'health', '--provider', 'sap-ai-core', '--timeout', '3']);

    expect(checkProviderHealthMock).toHaveBeenCalledWith(
      'sap-ai-core',
      expect.objectContaining({ timeoutMs: 3000 })
    );
  });

  it('rejects a non-numeric --timeout value', async () => {
    const result = await runProviderCommand([
      'provider',
      'health',
      '--provider',
      'sap-ai-core',
      '--timeout',
      'abc',
    ]);

    expect(result.exitCode).toBe(1);
    expect(result.stderr).toMatch(/Invalid --timeout/);
  });

  it('emits JSON when --json is passed', async () => {
    const payload = [
      { provider: 'sap-ai-core', ok: true, details: { envVars: [], attemptedProbe: true } },
    ];
    checkProviderHealthMock.mockResolvedValue(payload[0]);

    const result = await runProviderCommand([
      'provider',
      'health',
      '--provider',
      'sap-ai-core',
      '--json',
    ]);

    const parsed = JSON.parse(result.stdout.trim());
    expect(Array.isArray(parsed)).toBe(true);
    expect(parsed[0].provider).toBe('sap-ai-core');
    expect(parsed[0].ok).toBe(true);
  });

  it('shows env-var details with --verbose', async () => {
    checkProviderHealthMock.mockResolvedValue({
      provider: 'sap-ai-core',
      ok: true,
      details: {
        envVars: [{ name: 'AICORE_SERVICE_KEY', present: true, required: true }],
        endpoint: 'https://api.example',
        attemptedProbe: true,
      },
    });

    const result = await runProviderCommand([
      'provider',
      'health',
      '--provider',
      'sap-ai-core',
      '--verbose',
    ]);

    expect(result.stdout).toContain('AICORE_SERVICE_KEY');
    expect(result.stdout).toContain('https://api.example');
  });
});
