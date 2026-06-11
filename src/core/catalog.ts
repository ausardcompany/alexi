/**
 * Model Catalog System
 * Centralized model information and capability tracking
 * Optimize provider and model retrieval to align with updated catalog structure
 */
import { Catalog } from 'core/src/catalog';

function fetchProvider(providerID) {
    return Catalog.provider.get(providerID);
}

function fetchAllModels() {
    return Catalog.model.all();
}

import { z } from 'zod';

export const ModelCapability = z.enum([
  'text',
  'vision',
  'function_calling',
  'json_mode',
  'streaming',
]);

// eslint-disable-next-line no-redeclare
export type ModelCapability = z.infer<typeof ModelCapability>;

export interface ModelInfo {
  id: string;
  name: string;
  provider: string;
  capabilities: ModelCapability[];
  contextWindow: number;
  maxOutputTokens?: number;
  pricing?: {
    inputPerMillion: number;
    outputPerMillion: number;
  };
}

export interface ModelFilter {
  provider?: string;
  capabilities?: ModelCapability[];
  minContextWindow?: number;
}

export class ModelNotFoundError extends Error {
  constructor(readonly modelId: string) {
    super(`Model not found: ${modelId}`);
    this.name = 'ModelNotFoundError';
  }
}

export interface ModelCatalog {
  models: Map<string, ModelInfo>;
  getModel: (id: string) => ModelInfo | undefined;
  listModels: (filter?: ModelFilter) => ModelInfo[];
  hasCapability: (modelId: string, capability: ModelCapability) => boolean;
}

export function createCatalog(models: ModelInfo[]): ModelCatalog {
  const modelMap = new Map(models.map((m) => [m.id, m]));

  return {
    models: modelMap,

    getModel: (id: string) => {
      return modelMap.get(id);
    },

    listModels: (filter?: ModelFilter) => {
      let result = Array.from(modelMap.values());

      if (filter?.provider) {
        result = result.filter((m) => m.provider === filter.provider);
      }

      if (filter?.capabilities) {
        result = result.filter((m) =>
          filter.capabilities!.every((c) => m.capabilities.includes(c))
        );
      }

      if (filter?.minContextWindow) {
        result = result.filter((m) => m.contextWindow >= filter.minContextWindow!);
      }

      return result;
    },

    hasCapability: (modelId: string, capability: ModelCapability) => {
      const model = modelMap.get(modelId);
      return model?.capabilities.includes(capability) ?? false;
    },
  };
}

// Default catalog with SAP AI Core models
const defaultModels: ModelInfo[] = [
  {
    id: 'gpt-4',
    name: 'GPT-4',
    provider: 'openai',
    capabilities: ['text', 'function_calling', 'json_mode', 'streaming'],
    contextWindow: 8192,
    maxOutputTokens: 4096,
  },
  {
    id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    provider: 'openai',
    capabilities: ['text', 'vision', 'function_calling', 'json_mode', 'streaming'],
    contextWindow: 128000,
    maxOutputTokens: 4096,
  },
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    provider: 'openai',
    capabilities: ['text', 'function_calling', 'json_mode', 'streaming'],
    contextWindow: 16385,
    maxOutputTokens: 4096,
  },
  {
    id: 'claude-3-opus',
    name: 'Claude 3 Opus',
    provider: 'anthropic',
    capabilities: ['text', 'vision', 'function_calling', 'streaming'],
    contextWindow: 200000,
    maxOutputTokens: 4096,
  },
  {
    id: 'claude-3-sonnet',
    name: 'Claude 3 Sonnet',
    provider: 'anthropic',
    capabilities: ['text', 'vision', 'function_calling', 'streaming'],
    contextWindow: 200000,
    maxOutputTokens: 4096,
  },
  {
    id: 'claude-3-haiku',
    name: 'Claude 3 Haiku',
    provider: 'anthropic',
    capabilities: ['text', 'vision', 'function_calling', 'streaming'],
    contextWindow: 200000,
    maxOutputTokens: 4096,
  },
];

let globalCatalog: ModelCatalog | null = null;

export function getModelCatalog(): ModelCatalog {
  if (!globalCatalog) {
    globalCatalog = createCatalog(defaultModels);
  }
  return globalCatalog;
}

export function registerModel(model: ModelInfo): void {
  const catalog = getModelCatalog();
  catalog.models.set(model.id, model);
}
