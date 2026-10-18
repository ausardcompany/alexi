/**
 * Tests for `src/providers/health.ts` — provider health check (issue #2067).
 *
 * Covers:
 *   - Env-var validation (missing required / malformed JSON / missing URL).
 *   - Connectivity probe success and failure paths.
 *   - `skipNetwork` option.
 *   - Unknown-provider handling.
 *   - `listConfiguredProviders` reflects env state.
 *   - `checkAllProviderHealth` sequential aggregation.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { envMock } = vi.hoisted(() => ({ envMock: vi.fn() }));

vi.mock('../../src/config/env.js', () => ({
  env: envMock,
}));

// Mock connectivity so no real network traffic is issued.
const { connectivityMock } = vi.hoisted(() => ({ connectivityMock: vi.fn() }));
vi.mock('../../src/providers/connectivity.js', () => ({
  checkConnectivity: connectivityMock,
}));

import {
  checkAllProviderHealth,
  checkProviderHealth,
  KNOWN_PROVIDERS,
  listConfiguredProviders,
} from '../../src/providers/health.js';

function serviceKey(url = 'https://api.ai.core.cloud.sap'): string {
  return JSON.stringify({
    serviceurls: { AI_API_URL: url },
    clientid: 'x',
    clientsecret: 'y',
    url: 'https://auth.example',
  });
}

beforeEach(() => {
  envMock.mockReset();
  connectivityMock.mockReset();
  envMock.mockReturnValue(undefined);
  connectivityMock.mockResolvedValue({ reachable: true });
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('checkProviderHealth — sap-ai-core', () => {
  it('fails when AICORE_SERVICE_KEY is not set', async () => {
    const result = await checkProviderHealth('sap-ai-core');

    expect(result.ok).toBe(false);
    expect(result.provider).toBe('sap-ai-core');
    expect(result.error).toMatch(/AICORE_SERVICE_KEY/);
    expect(result.details?.attemptedProbe).toBe(false);
    expect(connectivityMock).not.toHaveBeenCalled();
  });

  it('fails when AICORE_SERVICE_KEY is not valid JSON', async () => {
    envMock.mockImplementation((k: string) =>
      k === 'AICORE_SERVICE_KEY' ? 'not-json' : undefined
    );

    const result = await checkProviderHealth('sap-ai-core');

    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/not valid JSON/i);
    expect(connectivityMock).not.toHaveBeenCalled();
  });

  it('fails when the service key is missing serviceurls.AI_API_URL', async () => {
    envMock.mockImplementation((k: string) =>
      k === 'AICORE_SERVICE_KEY' ? JSON.stringify({ clientid: 'x' }) : undefined
    );

    const result = await checkProviderHealth('sap-ai-core');

    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/AI_API_URL/);
    expect(connectivityMock).not.toHaveBeenCalled();
  });

  it('returns ok with latency on reachable endpoint', async () => {
    envMock.mockImplementation((k: string) =>
      k === 'AICORE_SERVICE_KEY' ? serviceKey() : undefined
    );
    connectivityMock.mockResolvedValue({ reachable: true });

    const result = await checkProviderHealth('sap-ai-core');

    expect(result.ok).toBe(true);
    expect(result.provider).toBe('sap-ai-core');
    expect(typeof result.latency).toBe('number');
    expect(result.details?.endpoint).toBe('https://api.ai.core.cloud.sap');
    expect(result.details?.attemptedProbe).toBe(true);
    expect(connectivityMock).toHaveBeenCalledWith('https://api.ai.core.cloud.sap', 10000);
  });

  it('returns not-ok with connectivity error', async () => {
    envMock.mockImplementation((k: string) =>
      k === 'AICORE_SERVICE_KEY' ? serviceKey() : undefined
    );
    connectivityMock.mockResolvedValue({
      reachable: false,
      error: 'API unreachable after 10s — check network connection',
    });

    const result = await checkProviderHealth('sap-ai-core');

    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/unreachable/);
    expect(result.details?.connectivity?.reachable).toBe(false);
    expect(typeof result.latency).toBe('number');
  });

  it('skips the network probe when skipNetwork is set', async () => {
    envMock.mockImplementation((k: string) =>
      k === 'AICORE_SERVICE_KEY' ? serviceKey() : undefined
    );

    const result = await checkProviderHealth('sap-ai-core', { skipNetwork: true });

    expect(result.ok).toBe(true);
    expect(result.details?.attemptedProbe).toBe(false);
    expect(connectivityMock).not.toHaveBeenCalled();
    expect(result.latency).toBeUndefined();
  });

  it('honours a custom timeoutMs option', async () => {
    envMock.mockImplementation((k: string) =>
      k === 'AICORE_SERVICE_KEY' ? serviceKey() : undefined
    );

    await checkProviderHealth('sap-ai-core', { timeoutMs: 2500 });

    expect(connectivityMock).toHaveBeenCalledWith('https://api.ai.core.cloud.sap', 2500);
  });

  it('reports AICORE_RESOURCE_GROUP as optional in details', async () => {
    envMock.mockImplementation((k: string) =>
      k === 'AICORE_SERVICE_KEY' ? serviceKey() : undefined
    );

    const result = await checkProviderHealth('sap-ai-core', { skipNetwork: true });

    const rg = result.details?.envVars.find((v) => v.name === 'AICORE_RESOURCE_GROUP');
    expect(rg).toBeDefined();
    expect(rg?.required).toBe(false);
    expect(rg?.present).toBe(false);
  });
});

describe('checkProviderHealth — sap-proxy', () => {
  it('fails when SAP_PROXY_BASE_URL is not set', async () => {
    const result = await checkProviderHealth('sap-proxy');

    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/SAP_PROXY_BASE_URL/);
    expect(connectivityMock).not.toHaveBeenCalled();
  });

  it('fails when SAP_PROXY_BASE_URL is not a valid URL', async () => {
    envMock.mockImplementation((k: string) =>
      k === 'SAP_PROXY_BASE_URL' ? 'not-a-url' : k === 'SAP_PROXY_API_KEY' ? 'secret' : undefined
    );

    const result = await checkProviderHealth('sap-proxy');

    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/not a valid URL/);
    expect(connectivityMock).not.toHaveBeenCalled();
  });

  it('fails when SAP_PROXY_API_KEY is missing', async () => {
    envMock.mockImplementation((k: string) =>
      k === 'SAP_PROXY_BASE_URL' ? 'https://proxy.example' : undefined
    );

    const result = await checkProviderHealth('sap-proxy');

    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/SAP_PROXY_API_KEY/);
    expect(connectivityMock).not.toHaveBeenCalled();
  });

  it('returns ok when env + probe succeed', async () => {
    envMock.mockImplementation((k: string) =>
      k === 'SAP_PROXY_BASE_URL'
        ? 'https://proxy.example'
        : k === 'SAP_PROXY_API_KEY'
          ? 'secret'
          : undefined
    );

    const result = await checkProviderHealth('sap-proxy');

    expect(result.ok).toBe(true);
    expect(result.provider).toBe('sap-proxy');
    expect(result.details?.endpoint).toBe('https://proxy.example');
    expect(connectivityMock).toHaveBeenCalledWith('https://proxy.example', 10000);
  });

  it('returns not-ok when the proxy is unreachable', async () => {
    envMock.mockImplementation((k: string) =>
      k === 'SAP_PROXY_BASE_URL'
        ? 'https://proxy.example'
        : k === 'SAP_PROXY_API_KEY'
          ? 'secret'
          : undefined
    );
    connectivityMock.mockResolvedValue({ reachable: false, error: 'ECONNREFUSED' });

    const result = await checkProviderHealth('sap-proxy');

    expect(result.ok).toBe(false);
    expect(result.error).toContain('ECONNREFUSED');
  });
});

describe('checkProviderHealth — unknown provider', () => {
  it('returns a structured error listing known providers', async () => {
    const result = await checkProviderHealth('bogus-provider');

    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/Unknown provider/);
    for (const known of KNOWN_PROVIDERS) {
      expect(result.error).toContain(known);
    }
    expect(connectivityMock).not.toHaveBeenCalled();
  });
});

describe('listConfiguredProviders', () => {
  it('returns empty when nothing is set', () => {
    expect(listConfiguredProviders()).toEqual([]);
  });

  it('includes sap-ai-core when AICORE_SERVICE_KEY is set', () => {
    envMock.mockImplementation((k: string) => (k === 'AICORE_SERVICE_KEY' ? '{}' : undefined));
    expect(listConfiguredProviders()).toEqual(['sap-ai-core']);
  });

  it('includes sap-proxy when SAP_PROXY_BASE_URL is set', () => {
    envMock.mockImplementation((k: string) =>
      k === 'SAP_PROXY_BASE_URL' ? 'https://proxy.example' : undefined
    );
    expect(listConfiguredProviders()).toEqual(['sap-proxy']);
  });

  it('includes both when both are set', () => {
    envMock.mockImplementation((k: string) => {
      if (k === 'AICORE_SERVICE_KEY') {
        return '{}';
      }
      if (k === 'SAP_PROXY_BASE_URL') {
        return 'https://proxy.example';
      }
      return undefined;
    });
    expect(listConfiguredProviders()).toEqual(['sap-ai-core', 'sap-proxy']);
  });
});

describe('checkAllProviderHealth', () => {
  it('returns an empty array for an empty input', async () => {
    const results = await checkAllProviderHealth([]);
    expect(results).toEqual([]);
  });

  it('preserves input order and runs each provider', async () => {
    envMock.mockImplementation((k: string) => {
      if (k === 'AICORE_SERVICE_KEY') {
        return serviceKey();
      }
      if (k === 'SAP_PROXY_BASE_URL') {
        return 'https://proxy.example';
      }
      if (k === 'SAP_PROXY_API_KEY') {
        return 'secret';
      }
      return undefined;
    });

    const results = await checkAllProviderHealth(['sap-proxy', 'sap-ai-core']);

    expect(results.map((r) => r.provider)).toEqual(['sap-proxy', 'sap-ai-core']);
    expect(results.every((r) => r.ok)).toBe(true);
  });
});
