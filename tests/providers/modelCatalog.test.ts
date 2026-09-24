/**
 * Integration tests for `refreshModelCatalog` and `fetchDeploymentCatalog`
 * error surfacing (issue #1824).
 *
 * The catalog module holds process-wide state (entries, refresh timer,
 * status), so every test invalidates the cache in beforeEach/afterEach.
 * `@sap-ai-sdk/ai-api` is mocked to drive the fetch outcome without
 * requiring live SAP credentials — see `docs/TESTING.md#testing-the-dynamic-model-catalog`.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

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

import {
  fetchDeploymentCatalog,
  getCatalogState,
  getCatalogStatus,
  invalidateCatalog,
  refreshModelCatalog,
} from '../../src/providers/modelCatalog.js';
import { ModelFetchError } from '../../src/providers/modelFetchErrors.js';

const noSleep = () => Promise.resolve();

beforeEach(() => {
  executeMock.mockReset();
  deploymentQueryMock.mockClear();
  invalidateCatalog();
});

afterEach(() => {
  invalidateCatalog();
});

describe('refreshModelCatalog error surfacing', () => {
  it('marks status=ready and clears errorMessage on a successful fetch', async () => {
    executeMock.mockResolvedValueOnce({
      resources: [{ id: 'dep-1', configurationName: 'gpt-4o' }],
    });
    await refreshModelCatalog('default', { retry: { sleep: noSleep } });
    const state = getCatalogState();
    expect(state.status).toBe('ready');
    expect(state.errorMessage).toBeUndefined();
    expect(state.entries.some((e) => e.id === 'gpt-4o' && e.live)).toBe(true);
  });

  it('sets status=error with the classified reason on a permanent failure', async () => {
    executeMock.mockRejectedValue(Object.assign(new Error('boom'), { status: 401 }));
    await refreshModelCatalog('default', { retry: { sleep: noSleep } });
    const state = getCatalogState();
    expect(state.status).toBe('error');
    expect(state.errorMessage).toMatch(/unauthorized/i);
    expect(state.errorMessage).toMatch(/AICORE_SERVICE_KEY/);
    // Permanent failures MUST NOT retry.
    expect(executeMock).toHaveBeenCalledTimes(1);
  });

  it('retries transient 503 failures and eventually reports ready', async () => {
    executeMock
      .mockRejectedValueOnce(Object.assign(new Error('boom'), { status: 503 }))
      .mockRejectedValueOnce(Object.assign(new Error('boom'), { status: 503 }))
      .mockResolvedValueOnce({ resources: [{ id: 'dep-1', configurationName: 'gpt-4o' }] });
    await refreshModelCatalog('default', { retry: { sleep: noSleep, maxAttempts: 3 } });
    expect(getCatalogStatus()).toBe('ready');
    expect(executeMock).toHaveBeenCalledTimes(3);
  });

  it('reports status=error with a network reason when transient budget is exhausted', async () => {
    executeMock.mockRejectedValue(Object.assign(new Error('boom'), { code: 'ECONNRESET' }));
    await refreshModelCatalog('default', { retry: { sleep: noSleep, maxAttempts: 2 } });
    const state = getCatalogState();
    expect(state.status).toBe('error');
    expect(state.errorMessage).toMatch(/network|ECONNRESET/i);
    expect(executeMock).toHaveBeenCalledTimes(2);
  });

  it('does NOT crash the caller when the fetch fails (fire-and-forget contract)', async () => {
    executeMock.mockRejectedValue(Object.assign(new Error('boom'), { status: 401 }));
    // The whole point of `refreshModelCatalog` is that it never throws —
    // the background refresh at startup would otherwise crash the CLI on
    // a bad credential.
    await expect(
      refreshModelCatalog('default', { retry: { sleep: noSleep } })
    ).resolves.toBeUndefined();
  });
});

describe('fetchDeploymentCatalog', () => {
  it('returns the raw deployment list on success', async () => {
    executeMock.mockResolvedValueOnce({
      resources: [
        {
          id: 'd-1',
          configurationId: 'c-1',
          configurationName: 'gpt-4o',
          scenarioId: 'foundation-models',
          status: 'RUNNING',
          targetStatus: 'RUNNING',
          createdAt: '2026-01-01T00:00:00Z',
          modifiedAt: '2026-01-01T00:00:00Z',
        },
      ],
    });
    const result = await fetchDeploymentCatalog({ retry: { sleep: noSleep } });
    expect(result.resources).toHaveLength(1);
    expect(result.resources[0].id).toBe('d-1');
  });

  it('throws ModelFetchError on a permanent 401 without retrying', async () => {
    executeMock.mockRejectedValue(Object.assign(new Error('bad key'), { status: 401 }));
    await expect(
      fetchDeploymentCatalog({ retry: { sleep: noSleep, maxAttempts: 5 } })
    ).rejects.toBeInstanceOf(ModelFetchError);
    expect(executeMock).toHaveBeenCalledTimes(1);
  });

  it('retries transient 502 failures and throws only after the budget is exhausted', async () => {
    executeMock.mockRejectedValue(Object.assign(new Error('boom'), { status: 502 }));
    try {
      await fetchDeploymentCatalog({ retry: { sleep: noSleep, maxAttempts: 3 } });
      expect.fail('should have thrown');
    } catch (err) {
      expect(err).toBeInstanceOf(ModelFetchError);
      const mfe = err as ModelFetchError;
      expect(mfe.transient).toBe(true);
      expect(mfe.statusCode).toBe(502);
    }
    expect(executeMock).toHaveBeenCalledTimes(3);
  });

  it('forwards the resourceGroup header and status filter to DeploymentApi', async () => {
    executeMock.mockResolvedValueOnce({ resources: [] });
    await fetchDeploymentCatalog({
      status: 'RUNNING',
      resourceGroup: 'custom-rg',
      retry: { sleep: noSleep },
    });
    expect(deploymentQueryMock).toHaveBeenCalledWith(
      { status: 'RUNNING' },
      { 'AI-Resource-Group': 'custom-rg' }
    );
  });

  it('distinguishes an empty list from an error (empty resources returns []; no throw)', async () => {
    executeMock.mockResolvedValueOnce({ resources: [] });
    const result = await fetchDeploymentCatalog({ retry: { sleep: noSleep } });
    expect(result.resources).toEqual([]);
  });
});
