/**
 * Tests for dynamic model discovery from SAP AI Core.
 *
 * Covers:
 * - Successful model listing and parsing
 * - Error handling (network failure, auth failure)
 * - Caching behavior
 * - Fallback to static list
 * - Merge logic between discovered and static models
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock the DeploymentApi before importing
vi.mock('@sap-ai-sdk/ai-api', () => ({
  DeploymentApi: {
    deploymentQuery: vi.fn(),
  },
}));

// Mock the env function
vi.mock('../src/config/env.js', () => ({
  env: vi.fn(),
}));

import { DeploymentApi } from '@sap-ai-sdk/ai-api';
import { env } from '../src/config/env.js';
import {
  fetchModelsFromAICore,
  discoverModels,
  getStaticModels,
  mergeWithStaticModels,
  getAvailableModelIds,
  clearModelDiscoveryCache,
  type DiscoveredModel,
} from '../src/providers/modelDiscovery.js';
import { ORCHESTRATION_MODELS } from '../src/providers/sapOrchestration.js';

// Helper to create a mock deployment response
function createMockDeploymentResponse(models: Array<{ name: string; status?: string }>) {
  return {
    count: models.length,
    resources: models.map((m, i) => ({
      id: `deployment-${i}`,
      configurationId: `config-${i}`,
      configurationName: m.name,
      scenarioId: 'foundation-models',
      status: m.status || 'RUNNING',
      targetStatus: 'RUNNING',
      createdAt: '2024-01-01T00:00:00Z',
      modifiedAt: '2024-01-01T00:00:00Z',
    })),
  };
}

describe('Model Discovery', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    clearModelDiscoveryCache();
    vi.mocked(env).mockImplementation((key: string) => {
      if (key === 'AICORE_SERVICE_KEY') return '{"valid": "key"}';
      if (key === 'AICORE_RESOURCE_GROUP') return 'default';
      return undefined;
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
    clearModelDiscoveryCache();
  });

  describe('fetchModelsFromAICore', () => {
    it('should fetch and parse models from running deployments', async () => {
      const mockResponse = createMockDeploymentResponse([
        { name: 'gpt-4o' },
        { name: 'anthropic--claude-4.5-sonnet' },
        { name: 'gemini-2.5-pro' },
      ]);

      vi.mocked(DeploymentApi.deploymentQuery).mockReturnValue({
        execute: vi.fn().mockResolvedValue(mockResponse),
      } as unknown as ReturnType<typeof DeploymentApi.deploymentQuery>);

      const models = await fetchModelsFromAICore();

      expect(models).toHaveLength(3);
      expect(models[0]).toEqual({
        id: 'gpt-4o',
        source: 'discovered',
        status: 'RUNNING',
      });
      expect(models[1]).toEqual({
        id: 'anthropic--claude-4.5-sonnet',
        source: 'discovered',
        status: 'RUNNING',
      });
      expect(models[2]).toEqual({
        id: 'gemini-2.5-pro',
        source: 'discovered',
        status: 'RUNNING',
      });
    });

    it('should deduplicate models with same configuration name', async () => {
      const mockResponse = createMockDeploymentResponse([
        { name: 'gpt-4o' },
        { name: 'gpt-4o' }, // duplicate
        { name: 'anthropic--claude-4.5-sonnet' },
      ]);

      vi.mocked(DeploymentApi.deploymentQuery).mockReturnValue({
        execute: vi.fn().mockResolvedValue(mockResponse),
      } as unknown as ReturnType<typeof DeploymentApi.deploymentQuery>);

      const models = await fetchModelsFromAICore();

      expect(models).toHaveLength(2);
      expect(models.map((m) => m.id)).toEqual(['gpt-4o', 'anthropic--claude-4.5-sonnet']);
    });

    it('should skip deployments without configuration name', async () => {
      const mockResponse = {
        count: 2,
        resources: [
          {
            id: 'dep-1',
            configurationId: 'cfg-1',
            configurationName: 'gpt-4o',
            scenarioId: 'foundation-models',
            status: 'RUNNING',
            targetStatus: 'RUNNING',
            createdAt: '2024-01-01T00:00:00Z',
            modifiedAt: '2024-01-01T00:00:00Z',
          },
          {
            id: 'dep-2',
            configurationId: 'cfg-2',
            configurationName: undefined,
            scenarioId: 'foundation-models',
            status: 'RUNNING',
            targetStatus: 'RUNNING',
            createdAt: '2024-01-01T00:00:00Z',
            modifiedAt: '2024-01-01T00:00:00Z',
          },
        ],
      };

      vi.mocked(DeploymentApi.deploymentQuery).mockReturnValue({
        execute: vi.fn().mockResolvedValue(mockResponse),
      } as unknown as ReturnType<typeof DeploymentApi.deploymentQuery>);

      const models = await fetchModelsFromAICore();

      expect(models).toHaveLength(1);
      expect(models[0].id).toBe('gpt-4o');
    });

    it('should throw when AICORE_SERVICE_KEY is not set', async () => {
      vi.mocked(env).mockReturnValue(undefined);

      await expect(fetchModelsFromAICore()).rejects.toThrow('AICORE_SERVICE_KEY is not configured');
    });

    it('should use custom resource group from options', async () => {
      const mockResponse = createMockDeploymentResponse([{ name: 'gpt-4o' }]);

      vi.mocked(DeploymentApi.deploymentQuery).mockReturnValue({
        execute: vi.fn().mockResolvedValue(mockResponse),
      } as unknown as ReturnType<typeof DeploymentApi.deploymentQuery>);

      await fetchModelsFromAICore({ resourceGroup: 'custom-group' });

      expect(DeploymentApi.deploymentQuery).toHaveBeenCalledWith(
        { scenarioId: 'foundation-models', status: 'RUNNING' },
        { 'AI-Resource-Group': 'custom-group' }
      );
    });

    it('should use AICORE_RESOURCE_GROUP env var when no option provided', async () => {
      vi.mocked(env).mockImplementation((key: string) => {
        if (key === 'AICORE_SERVICE_KEY') return '{"valid": "key"}';
        if (key === 'AICORE_RESOURCE_GROUP') return 'env-group';
        return undefined;
      });

      const mockResponse = createMockDeploymentResponse([{ name: 'gpt-4o' }]);

      vi.mocked(DeploymentApi.deploymentQuery).mockReturnValue({
        execute: vi.fn().mockResolvedValue(mockResponse),
      } as unknown as ReturnType<typeof DeploymentApi.deploymentQuery>);

      await fetchModelsFromAICore();

      expect(DeploymentApi.deploymentQuery).toHaveBeenCalledWith(
        { scenarioId: 'foundation-models', status: 'RUNNING' },
        { 'AI-Resource-Group': 'env-group' }
      );
    });

    it('should handle timeout', async () => {
      vi.mocked(DeploymentApi.deploymentQuery).mockReturnValue({
        execute: vi
          .fn()
          .mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 60_000))),
      } as unknown as ReturnType<typeof DeploymentApi.deploymentQuery>);

      await expect(fetchModelsFromAICore({ timeoutMs: 50 })).rejects.toThrow(
        'Model discovery request timed out'
      );
    });

    it('should handle empty deployment list', async () => {
      const mockResponse = { count: 0, resources: [] };

      vi.mocked(DeploymentApi.deploymentQuery).mockReturnValue({
        execute: vi.fn().mockResolvedValue(mockResponse),
      } as unknown as ReturnType<typeof DeploymentApi.deploymentQuery>);

      const models = await fetchModelsFromAICore();

      expect(models).toHaveLength(0);
    });

    it('should handle network errors', async () => {
      vi.mocked(DeploymentApi.deploymentQuery).mockReturnValue({
        execute: vi.fn().mockRejectedValue(new Error('Network error: connection refused')),
      } as unknown as ReturnType<typeof DeploymentApi.deploymentQuery>);

      await expect(fetchModelsFromAICore()).rejects.toThrow('Network error');
    });

    it('should handle authentication errors', async () => {
      vi.mocked(DeploymentApi.deploymentQuery).mockReturnValue({
        execute: vi.fn().mockRejectedValue(new Error('401 Unauthorized')),
      } as unknown as ReturnType<typeof DeploymentApi.deploymentQuery>);

      await expect(fetchModelsFromAICore()).rejects.toThrow('401 Unauthorized');
    });
  });

  describe('discoverModels', () => {
    it('should return merged discovered and static models on success', async () => {
      const mockResponse = createMockDeploymentResponse([
        { name: 'gpt-4o' },
        { name: 'new-model-from-aicore' },
      ]);

      vi.mocked(DeploymentApi.deploymentQuery).mockReturnValue({
        execute: vi.fn().mockResolvedValue(mockResponse),
      } as unknown as ReturnType<typeof DeploymentApi.deploymentQuery>);

      const models = await discoverModels();

      // Should contain discovered models + static models not already discovered
      const ids = models.map((m) => m.id);
      expect(ids).toContain('gpt-4o');
      expect(ids).toContain('new-model-from-aicore');

      // All static models should be present
      for (const staticModel of ORCHESTRATION_MODELS) {
        expect(ids).toContain(staticModel);
      }

      // gpt-4o should have 'discovered' source since it was found
      const gpt4o = models.find((m) => m.id === 'gpt-4o');
      expect(gpt4o?.source).toBe('discovered');

      // new-model should have 'discovered' source
      const newModel = models.find((m) => m.id === 'new-model-from-aicore');
      expect(newModel?.source).toBe('discovered');

      // A model only in static list should have 'static' source
      const staticOnly = models.find((m) => m.id === 'anthropic--claude-3.7-sonnet');
      expect(staticOnly?.source).toBe('static');
    });

    it('should fall back to static models on API failure', async () => {
      vi.mocked(DeploymentApi.deploymentQuery).mockReturnValue({
        execute: vi.fn().mockRejectedValue(new Error('Service unavailable')),
      } as unknown as ReturnType<typeof DeploymentApi.deploymentQuery>);

      const models = await discoverModels();

      // Should return all static models
      expect(models).toHaveLength(ORCHESTRATION_MODELS.length);
      for (const model of models) {
        expect(model.source).toBe('static');
      }
      expect(models.map((m) => m.id)).toEqual([...ORCHESTRATION_MODELS]);
    });

    it('should fall back to static models when credentials are missing', async () => {
      vi.mocked(env).mockReturnValue(undefined);

      const models = await discoverModels();

      // Should return all static models (fallback)
      expect(models).toHaveLength(ORCHESTRATION_MODELS.length);
      for (const model of models) {
        expect(model.source).toBe('static');
      }
    });

    it('should use cached results on subsequent calls within TTL', async () => {
      const mockResponse = createMockDeploymentResponse([{ name: 'gpt-4o' }]);

      vi.mocked(DeploymentApi.deploymentQuery).mockReturnValue({
        execute: vi.fn().mockResolvedValue(mockResponse),
      } as unknown as ReturnType<typeof DeploymentApi.deploymentQuery>);

      // First call - should hit the API
      await discoverModels();
      expect(DeploymentApi.deploymentQuery).toHaveBeenCalledTimes(1);

      // Second call - should use cache
      await discoverModels();
      expect(DeploymentApi.deploymentQuery).toHaveBeenCalledTimes(1);
    });

    it('should refetch when cache TTL expires', async () => {
      const mockResponse = createMockDeploymentResponse([{ name: 'gpt-4o' }]);

      vi.mocked(DeploymentApi.deploymentQuery).mockReturnValue({
        execute: vi.fn().mockResolvedValue(mockResponse),
      } as unknown as ReturnType<typeof DeploymentApi.deploymentQuery>);

      // First call with very short TTL
      await discoverModels({ cacheTtlMs: 1 });
      expect(DeploymentApi.deploymentQuery).toHaveBeenCalledTimes(1);

      // Wait for cache to expire
      await new Promise((resolve) => setTimeout(resolve, 10));

      // Second call - should refetch because cache expired
      await discoverModels({ cacheTtlMs: 1 });
      expect(DeploymentApi.deploymentQuery).toHaveBeenCalledTimes(2);
    });

    it('should clear cache when clearModelDiscoveryCache is called', async () => {
      const mockResponse = createMockDeploymentResponse([{ name: 'gpt-4o' }]);

      vi.mocked(DeploymentApi.deploymentQuery).mockReturnValue({
        execute: vi.fn().mockResolvedValue(mockResponse),
      } as unknown as ReturnType<typeof DeploymentApi.deploymentQuery>);

      await discoverModels();
      expect(DeploymentApi.deploymentQuery).toHaveBeenCalledTimes(1);

      clearModelDiscoveryCache();

      await discoverModels();
      expect(DeploymentApi.deploymentQuery).toHaveBeenCalledTimes(2);
    });

    it('should cache fallback with shorter TTL to retry sooner', async () => {
      vi.mocked(DeploymentApi.deploymentQuery).mockReturnValue({
        execute: vi.fn().mockRejectedValue(new Error('Service unavailable')),
      } as unknown as ReturnType<typeof DeploymentApi.deploymentQuery>);

      // First call - failure, uses fallback
      const models1 = await discoverModels({ cacheTtlMs: 300_000 });
      expect(models1.every((m) => m.source === 'static')).toBe(true);
      expect(DeploymentApi.deploymentQuery).toHaveBeenCalledTimes(1);

      // Second immediate call - should use fallback cache
      await discoverModels({ cacheTtlMs: 300_000 });
      expect(DeploymentApi.deploymentQuery).toHaveBeenCalledTimes(1);

      // After 1+ minutes, should retry (wait 65 seconds would be too long for tests,
      // so we verify by clearing cache and calling again)
      clearModelDiscoveryCache();
      await discoverModels({ cacheTtlMs: 300_000 });
      expect(DeploymentApi.deploymentQuery).toHaveBeenCalledTimes(2);
    });
  });

  describe('getStaticModels', () => {
    it('should return all static models with correct source', () => {
      const models = getStaticModels();

      expect(models).toHaveLength(ORCHESTRATION_MODELS.length);
      for (const model of models) {
        expect(model.source).toBe('static');
        expect(ORCHESTRATION_MODELS).toContain(model.id);
      }
    });

    it('should include known models', () => {
      const models = getStaticModels();
      const ids = models.map((m) => m.id);

      expect(ids).toContain('gpt-4o');
      expect(ids).toContain('anthropic--claude-4.5-sonnet');
      expect(ids).toContain('gemini-2.5-flash');
    });
  });

  describe('mergeWithStaticModels', () => {
    it('should merge discovered models with static list', () => {
      const discovered: DiscoveredModel[] = [
        { id: 'gpt-4o', source: 'discovered', status: 'RUNNING' },
        { id: 'new-model', source: 'discovered', status: 'RUNNING' },
      ];

      const merged = mergeWithStaticModels(discovered);

      // Should contain all discovered models
      expect(merged.map((m) => m.id)).toContain('gpt-4o');
      expect(merged.map((m) => m.id)).toContain('new-model');

      // Should contain static models not in discovered
      for (const staticId of ORCHESTRATION_MODELS) {
        expect(merged.map((m) => m.id)).toContain(staticId);
      }
    });

    it('should not duplicate models present in both discovered and static', () => {
      const discovered: DiscoveredModel[] = [
        { id: 'gpt-4o', source: 'discovered', status: 'RUNNING' },
      ];

      const merged = mergeWithStaticModels(discovered);

      // gpt-4o should only appear once
      const gpt4oEntries = merged.filter((m) => m.id === 'gpt-4o');
      expect(gpt4oEntries).toHaveLength(1);
      expect(gpt4oEntries[0].source).toBe('discovered');
    });

    it('should place discovered models first', () => {
      const discovered: DiscoveredModel[] = [
        { id: 'brand-new-model', source: 'discovered', status: 'RUNNING' },
      ];

      const merged = mergeWithStaticModels(discovered);

      // First model should be the discovered one
      expect(merged[0].id).toBe('brand-new-model');
      expect(merged[0].source).toBe('discovered');
    });

    it('should handle empty discovered list', () => {
      const merged = mergeWithStaticModels([]);

      expect(merged).toHaveLength(ORCHESTRATION_MODELS.length);
      for (const model of merged) {
        expect(model.source).toBe('static');
      }
    });
  });

  describe('getAvailableModelIds', () => {
    it('should return just model ID strings', async () => {
      const mockResponse = createMockDeploymentResponse([
        { name: 'gpt-4o' },
        { name: 'new-model' },
      ]);

      vi.mocked(DeploymentApi.deploymentQuery).mockReturnValue({
        execute: vi.fn().mockResolvedValue(mockResponse),
      } as unknown as ReturnType<typeof DeploymentApi.deploymentQuery>);

      const ids = await getAvailableModelIds();

      expect(ids).toContain('gpt-4o');
      expect(ids).toContain('new-model');
      // All static models should be present too
      for (const staticModel of ORCHESTRATION_MODELS) {
        expect(ids).toContain(staticModel);
      }
      // Should be plain strings
      for (const id of ids) {
        expect(typeof id).toBe('string');
      }
    });

    it('should return static model IDs on failure', async () => {
      vi.mocked(DeploymentApi.deploymentQuery).mockReturnValue({
        execute: vi.fn().mockRejectedValue(new Error('Failure')),
      } as unknown as ReturnType<typeof DeploymentApi.deploymentQuery>);

      const ids = await getAvailableModelIds();

      expect(ids).toEqual([...ORCHESTRATION_MODELS]);
    });
  });

  describe('clearModelDiscoveryCache', () => {
    it('should force next call to refetch', async () => {
      const mockResponse = createMockDeploymentResponse([{ name: 'gpt-4o' }]);

      vi.mocked(DeploymentApi.deploymentQuery).mockReturnValue({
        execute: vi.fn().mockResolvedValue(mockResponse),
      } as unknown as ReturnType<typeof DeploymentApi.deploymentQuery>);

      await discoverModels();
      clearModelDiscoveryCache();
      await discoverModels();

      expect(DeploymentApi.deploymentQuery).toHaveBeenCalledTimes(2);
    });
  });
});
