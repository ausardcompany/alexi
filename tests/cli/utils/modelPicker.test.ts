/**
 * Tests for `src/cli/utils/modelPicker.ts` — the legacy inquirer-based picker
 * used by `interactive.ts` when the TUI is not active.
 *
 * Focus: issue #1886 — surface model-list endpoint errors instead of silently
 * falling back to the static catalog.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// The SAP SDK mock must be hoisted so any transitive import of
// `@sap-ai-sdk/ai-api` (e.g. via the modelCatalog module graph) sees the
// stubbed DeploymentApi rather than making a live call.
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

// `env` reads from the (already-loaded) dotenv config; stub it so we can
// deterministically enable / disable the proxy code path.
const { envMock } = vi.hoisted(() => ({ envMock: vi.fn() }));

vi.mock('../../../src/config/env.js', () => ({
  env: envMock,
}));

import { getAvailableModels } from '../../../src/cli/utils/modelPicker.js';
import { invalidateCatalog } from '../../../src/providers/modelCatalog.js';
import { logger } from '../../../src/utils/logger.js';

beforeEach(() => {
  executeMock.mockReset();
  deploymentQueryMock.mockClear();
  envMock.mockReset();
  invalidateCatalog();
});

afterEach(() => {
  invalidateCatalog();
  vi.restoreAllMocks();
});

describe('modelPicker.getAvailableModels — proxy error surfacing (issue #1886)', () => {
  it('logs a classified reason + hint when the proxy /models call fails with 401', async () => {
    envMock.mockImplementation((key: string) => {
      if (key === 'SAP_PROXY_BASE_URL') return 'https://example.invalid';
      if (key === 'SAP_PROXY_API_KEY') return 'secret';
      return undefined;
    });

    const warnSpy = vi.spyOn(logger, 'warn').mockImplementation(() => {});
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(new Response(null, { status: 401, statusText: 'Unauthorized' }));

    // Catalog is idle (no credentials), so `getAvailableModels` falls back to
    // static + proxy discovery.
    const models = await getAvailableModels();

    // Fallback happened — static list is returned.
    expect(models.length).toBeGreaterThan(0);
    expect(models.every((m) => m.source === 'local')).toBe(true);

    // The classified reason + hint were surfaced via logger.warn.
    const warnCalls = warnSpy.mock.calls.map((c) => String(c[0]));
    expect(warnCalls.some((m) => /Model list unavailable|proxy model list/i.test(m))).toBe(true);
    expect(warnCalls.some((m) => /unauthorized|401/i.test(m))).toBe(true);
    expect(warnCalls.some((m) => /Hint:/i.test(m))).toBe(true);

    fetchSpy.mockRestore();
    warnSpy.mockRestore();
  });

  it('logs a network hint when the proxy /models call fails with ECONNRESET', async () => {
    envMock.mockImplementation((key: string) => {
      if (key === 'SAP_PROXY_BASE_URL') return 'https://example.invalid';
      if (key === 'SAP_PROXY_API_KEY') return 'secret';
      return undefined;
    });

    const warnSpy = vi.spyOn(logger, 'warn').mockImplementation(() => {});
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockRejectedValue(Object.assign(new Error('socket hang up'), { code: 'ECONNRESET' }));

    const models = await getAvailableModels();
    expect(models.length).toBeGreaterThan(0);

    const warnCalls = warnSpy.mock.calls.map((c) => String(c[0]));
    expect(warnCalls.some((m) => /network|proxy|VPN|ECONNRESET/i.test(m))).toBe(true);

    fetchSpy.mockRestore();
    warnSpy.mockRestore();
  });

  it('does NOT log when the proxy is not configured (env vars missing)', async () => {
    envMock.mockReturnValue(undefined);

    const warnSpy = vi.spyOn(logger, 'warn').mockImplementation(() => {});
    const fetchSpy = vi.spyOn(globalThis, 'fetch');

    const models = await getAvailableModels();
    expect(models.length).toBeGreaterThan(0);

    // No fetch, no warn — the proxy path is short-circuited.
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(warnSpy).not.toHaveBeenCalled();

    fetchSpy.mockRestore();
    warnSpy.mockRestore();
  });

  it('does NOT log when the proxy fetch succeeds', async () => {
    envMock.mockImplementation((key: string) => {
      if (key === 'SAP_PROXY_BASE_URL') return 'https://example.invalid';
      if (key === 'SAP_PROXY_API_KEY') return 'secret';
      return undefined;
    });

    const warnSpy = vi.spyOn(logger, 'warn').mockImplementation(() => {});
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ data: [{ id: 'proxy-model-1' }, { id: 'proxy-model-2' }] }), {
        status: 200,
        statusText: 'OK',
        headers: { 'content-type': 'application/json' },
      })
    );

    const models = await getAvailableModels();

    // Proxy entries were merged in.
    expect(models.some((m) => m.id === 'proxy-model-1' && m.source === 'remote')).toBe(true);
    expect(warnSpy).not.toHaveBeenCalled();

    fetchSpy.mockRestore();
    warnSpy.mockRestore();
  });
});
