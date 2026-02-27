/**
 * SAP AI SDK Orchestration Provider
 * Uses @sap-ai-sdk/orchestration for native SAP AI Core integration
 * Supports streaming, templating, content filtering, and other orchestration features
 */

import { OrchestrationClient } from '@sap-ai-sdk/orchestration';

export interface StreamChunk {
  text: string;
  finishReason?: string;
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
  };
}

export interface OrchestrationConfig {
  modelName: string;
  modelVersion?: string;
  maxTokens?: number;
  temperature?: number;
  resourceGroup?: string;
  deploymentId?: string;
}

export interface CompletionResult {
  text: string;
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
  };
}

/**
 * SAP AI SDK Orchestration Provider
 * Provides both streaming and non-streaming chat completion
 */
export class SapOrchestrationProvider {
  private config: OrchestrationConfig;

  constructor(config: OrchestrationConfig) {
    this.config = config;
  }

  /**
   * Create orchestration client with current config
   */
  private createClient(): OrchestrationClient {
    const deploymentConfig: { resourceGroup?: string; deploymentId?: string } = {};
    
    if (this.config.resourceGroup) {
      deploymentConfig.resourceGroup = this.config.resourceGroup;
    }
    if (this.config.deploymentId) {
      deploymentConfig.deploymentId = this.config.deploymentId;
    }

    return new OrchestrationClient(
      {
        promptTemplating: {
          model: {
            name: this.config.modelName,
            version: this.config.modelVersion,
            params: {
              max_tokens: this.config.maxTokens ?? 4096,
              temperature: this.config.temperature ?? 0.7,
            },
          },
        },
      },
      Object.keys(deploymentConfig).length > 0 ? deploymentConfig : undefined
    );
  }

  /**
   * Non-streaming chat completion
   */
  async complete(
    messages: Array<{ role: string; content: string }>,
    options?: {
      maxTokens?: number;
      temperature?: number;
    }
  ): Promise<CompletionResult> {
    // Create client with potentially overridden options
    const config = { ...this.config };
    if (options?.maxTokens) config.maxTokens = options.maxTokens;
    if (options?.temperature) config.temperature = options.temperature;

    const client = new OrchestrationClient(
      {
        promptTemplating: {
          model: {
            name: config.modelName,
            version: config.modelVersion,
            params: {
              max_tokens: config.maxTokens ?? 4096,
              temperature: config.temperature ?? 0.7,
            },
          },
        },
      },
      this.config.resourceGroup ? { resourceGroup: this.config.resourceGroup } : undefined
    );

    // Convert messages to orchestration format
    const orchestrationMessages = messages.map(m => ({
      role: m.role as 'user' | 'assistant' | 'system',
      content: m.content,
    }));

    const response = await client.chatCompletion({
      messages: orchestrationMessages,
    });

    const tokenUsage = response.getTokenUsage();

    return {
      text: response.getContent() ?? '',
      usage: tokenUsage ? {
        prompt_tokens: tokenUsage.prompt_tokens,
        completion_tokens: tokenUsage.completion_tokens,
        total_tokens: tokenUsage.total_tokens,
      } : undefined,
    };
  }

  /**
   * Streaming chat completion using SAP AI SDK orchestration
   * Returns an async generator yielding text chunks
   */
  async *streamComplete(
    messages: Array<{ role: string; content: string }>,
    options?: {
      maxTokens?: number;
      temperature?: number;
      signal?: AbortSignal;
    }
  ): AsyncGenerator<StreamChunk> {
    // Create client with potentially overridden options
    const config = { ...this.config };
    if (options?.maxTokens) config.maxTokens = options.maxTokens;
    if (options?.temperature) config.temperature = options.temperature;

    const deploymentConfig: { resourceGroup?: string; deploymentId?: string } = {};
    if (this.config.resourceGroup) {
      deploymentConfig.resourceGroup = this.config.resourceGroup;
    }
    if (this.config.deploymentId) {
      deploymentConfig.deploymentId = this.config.deploymentId;
    }

    const client = new OrchestrationClient(
      {
        promptTemplating: {
          model: {
            name: config.modelName,
            version: config.modelVersion,
            params: {
              max_tokens: config.maxTokens ?? 4096,
              temperature: config.temperature ?? 0.7,
            },
          },
        },
      },
      Object.keys(deploymentConfig).length > 0 ? deploymentConfig : undefined
    );

    // Convert messages to orchestration format
    const orchestrationMessages = messages.map(m => ({
      role: m.role as 'user' | 'assistant' | 'system',
      content: m.content,
    }));

    // Use SAP SDK streaming with AbortSignal support
    const response = await client.stream(
      { messages: orchestrationMessages },
      options?.signal
    );

    // Stream content chunks
    for await (const chunk of response.stream.toContentStream()) {
      yield { text: chunk };
    }

    // After streaming, get final metadata
    const finishReason = response.getFinishReason();
    const tokenUsage = response.getTokenUsage();

    yield {
      text: '',
      finishReason: finishReason ?? undefined,
      usage: tokenUsage ? {
        prompt_tokens: tokenUsage.prompt_tokens,
        completion_tokens: tokenUsage.completion_tokens,
        total_tokens: tokenUsage.total_tokens,
      } : undefined,
    };
  }

  /**
   * Get the model name
   */
  getModelName(): string {
    return this.config.modelName;
  }

  /**
   * Update model configuration
   */
  setModel(modelName: string, modelVersion?: string): void {
    this.config.modelName = modelName;
    this.config.modelVersion = modelVersion;
  }
}

/**
 * Create a SAP Orchestration provider instance
 */
export function createSapOrchestrationProvider(config: OrchestrationConfig): SapOrchestrationProvider {
  return new SapOrchestrationProvider(config);
}

/**
 * List of models available through SAP AI Core Orchestration
 * Based on SAP documentation
 */
export const ORCHESTRATION_MODELS = [
  // OpenAI models
  'gpt-4o',
  'gpt-4.1',
  'gpt-5',
  'gpt-5-mini',
  // Anthropic models
  'anthropic--claude-3.7-sonnet',
  'anthropic--claude-4.5-sonnet',
  // Google models
  'gemini-2.5-flash',
  'gemini-2.5-pro',
  // Amazon models
  'amazon--nova-micro',
  'amazon--nova-lite',
  'amazon--nova-pro',
  // Mistral models
  'mistralai--mistral-small-instruct',
  // Meta models
  'meta--llama3.1-70b-instruct',
  // DeepSeek models
  'deepseek-ai--deepseek-r1',
  // SAP models
  'sap-abap-1',
] as const;

export type OrchestrationModel = typeof ORCHESTRATION_MODELS[number];

/**
 * Check if a model is available through orchestration
 */
export function isOrchestrationModel(modelId: string): boolean {
  return ORCHESTRATION_MODELS.includes(modelId as OrchestrationModel);
}
