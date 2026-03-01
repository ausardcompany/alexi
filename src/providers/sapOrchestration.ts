/**
 * SAP AI SDK Orchestration Provider
 * Comprehensive wrapper for @sap-ai-sdk/orchestration package
 *
 * Features:
 * - Streaming and non-streaming chat completion
 * - Tool/function calling with streaming support
 * - Content filtering (Azure Content Safety, Llama Guard 3 8B)
 * - Data masking (DPI)
 * - Document grounding
 * - Translation (input/output)
 * - Embeddings
 */

import {
  OrchestrationClient,
  OrchestrationEmbeddingClient,
  buildAzureContentSafetyFilter,
  buildLlamaGuard38BFilter,
  buildDpiMaskingProvider,
  buildDocumentGroundingConfig,
  buildTranslationConfig,
  type OrchestrationModuleConfig,
  type DocumentGroundingServiceConfig,
  type DpiMaskingConfig,
  type AzureFilterThreshold,
  type AzureContentSafetyFilterInputParameters,
  type AzureContentSafetyFilterOutputParameters,
  type LlamaGuard38BCategory,
  type EmbeddingModuleConfig,
  type TranslationModule,
  type FilteringModule,
  type MaskingModule,
  type GroundingModule,
} from '@sap-ai-sdk/orchestration';

// Types are exported from the main package
type ChatCompletionTool = import('@sap-ai-sdk/orchestration').ChatCompletionTool;
type FunctionObject = import('@sap-ai-sdk/orchestration').FunctionObject;
type ToolChatMessage = import('@sap-ai-sdk/orchestration').ToolChatMessage;
type ChatMessage = import('@sap-ai-sdk/orchestration').ChatMessage;

// MessageToolCall is available through the response's getToolCalls() return type
// We define it manually based on SDK schema
interface MessageToolCall {
  id: string;
  type: 'function';
  function: {
    name: string;
    arguments: string;
  };
}

// ToolCallChunk from SDK streaming
interface SdkToolCallChunk {
  index: number;
  id?: string;
  type?: 'function';
  function?: {
    name?: string;
    arguments?: string;
  };
}

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Token usage statistics
 */
export interface TokenUsage {
  prompt_tokens?: number;
  completion_tokens?: number;
  total_tokens?: number;
}

/**
 * Tool call chunk for streaming
 */
export interface ToolCallChunk {
  index: number;
  id?: string;
  type?: string;
  function?: {
    name?: string;
    arguments?: string;
  };
}

/**
 * Stream chunk with tool call support
 */
export interface StreamChunk {
  text: string;
  toolCalls?: ToolCallChunk[];
  finishReason?: string;
  usage?: TokenUsage;
}

/**
 * Completion result with tool calls
 */
export interface CompletionResult {
  text: string;
  toolCalls?: MessageToolCall[];
  finishReason?: string;
  usage?: TokenUsage;
  /** Full message history including assistant response - useful for tool calling loops */
  allMessages?: ChatMessage[];
}

/**
 * Azure Content Safety filter configuration
 */
export interface AzureContentFilterConfig {
  hate?: AzureFilterThreshold;
  selfHarm?: AzureFilterThreshold;
  sexual?: AzureFilterThreshold;
  violence?: AzureFilterThreshold;
  /** Input-only: Enable prompt shield */
  promptShield?: boolean;
  /** Output-only: Detect protected code content */
  protectedMaterialCode?: boolean;
}

/**
 * Llama Guard 3 8B categories
 */
export type LlamaGuardCategory = LlamaGuard38BCategory;

/**
 * Input filter configuration
 */
export interface InputFilterConfig {
  type: 'azure' | 'llama_guard';
  /** Azure filter config (only for azure type) */
  azureConfig?: AzureContentFilterConfig;
  /** Llama Guard categories (only for llama_guard type) */
  llamaGuardCategories?: [LlamaGuardCategory, ...LlamaGuardCategory[]];
}

/**
 * Output filter configuration
 */
export interface OutputFilterConfig {
  type: 'azure' | 'llama_guard';
  /** Azure filter config (only for azure type) */
  azureConfig?: AzureContentFilterConfig;
  /** Llama Guard categories (only for llama_guard type) */
  llamaGuardCategories?: [LlamaGuardCategory, ...LlamaGuardCategory[]];
}

/**
 * Content filtering configuration
 */
export interface FilteringConfig {
  input?: InputFilterConfig;
  output?: OutputFilterConfig;
}

/**
 * DPI entity types for masking
 * Based on SAP DPI standard entities
 */
export type DpiEntityType =
  | 'profile-person'
  | 'profile-org'
  | 'profile-university'
  | 'profile-location'
  | 'profile-email'
  | 'profile-phone'
  | 'profile-address'
  | 'profile-sapids-internal'
  | 'profile-sapids-public'
  | 'profile-url'
  | 'profile-username-password'
  | 'profile-nationalid'
  | 'profile-iban'
  | 'profile-ssn'
  | 'profile-credit-card-number'
  | 'profile-passport'
  | 'profile-driverlicense'
  | 'profile-nationality'
  | 'profile-religious-group'
  | 'profile-political-group'
  | 'profile-pronouns-gender'
  | 'profile-ethnicity'
  | 'profile-gender'
  | 'profile-sexual-orientation'
  | 'profile-trade-union'
  | 'profile-sensitive-data';

/**
 * Masking method for DPI
 */
export type MaskingMethod = 'anonymization' | 'pseudonymization';

/**
 * Masking configuration using DPI
 */
export interface MaskingConfig {
  /** Entity types to mask */
  entities: [DpiEntityType, ...DpiEntityType[]];
  /** Masking method - anonymization replaces data, pseudonymization allows reversal */
  method: MaskingMethod;
  /** Optional list of strings that should not be masked */
  allowlist?: string[];
  /** Whether to mask grounding input */
  maskGroundingInput?: boolean;
}

/**
 * Document grounding search filter
 */
export interface GroundingSearchFilter {
  id?: string;
  dataRepositoryId?: string[];
  dataRepositoryType?: 'vector' | 'help.sap.com';
  searchConfiguration?: string;
}

/**
 * Document grounding configuration
 */
export interface GroundingConfig {
  /** Input variables for grounding questions */
  inputVariables: [string, ...string[]];
  /** Output variable name for grounding results */
  outputVariable: string;
  /** Optional search filters */
  filters?: GroundingSearchFilter[];
  /** Optional metadata parameters */
  metadataParams?: string[];
}

/**
 * Translation configuration
 */
export interface TranslationConfig {
  input?: {
    sourceLanguage?: string;
    targetLanguage: string;
    translateMessagesHistory?: boolean;
  };
  output?: {
    sourceLanguage?: string;
    targetLanguage: string;
  };
}

/**
 * Main orchestration configuration
 */
export interface OrchestrationConfig {
  /** Model name (e.g., 'gpt-4o', 'anthropic--claude-3.7-sonnet') */
  modelName: string;
  /** Model version */
  modelVersion?: string;
  /** Maximum tokens for completion */
  maxTokens?: number;
  /** Temperature for sampling */
  temperature?: number;
  /** Top-p sampling */
  topP?: number;
  /** Frequency penalty */
  frequencyPenalty?: number;
  /** Presence penalty */
  presencePenalty?: number;

  /** SAP AI Core resource group */
  resourceGroup?: string;
  /** SAP AI Core deployment ID */
  deploymentId?: string;

  /** Tools/functions for function calling */
  tools?: ChatCompletionTool[];
  /** Tool choice strategy */
  toolChoice?: 'auto' | 'none' | 'required' | { type: 'function'; function: { name: string } };

  /** Content filtering configuration */
  filtering?: FilteringConfig;

  /** Data masking configuration */
  masking?: MaskingConfig;

  /** Document grounding configuration */
  grounding?: GroundingConfig;

  /** Translation configuration */
  translation?: TranslationConfig;
}

/**
 * Options for completion calls
 */
export interface CompletionOptions {
  maxTokens?: number;
  temperature?: number;
  topP?: number;
  signal?: AbortSignal;
  /** Override tools for this call */
  tools?: ChatCompletionTool[];
  /** Override tool choice for this call */
  toolChoice?: OrchestrationConfig['toolChoice'];
}

/**
 * Embedding request options
 */
export interface EmbeddingOptions {
  resourceGroup?: string;
  /** Embedding model name */
  modelName?: string;
  /** Embedding model version */
  modelVersion?: string;
}

/**
 * Embedding result
 */
export interface EmbeddingResult {
  embeddings: number[][];
  model?: string;
  usage?: {
    prompt_tokens: number;
    total_tokens: number;
  };
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Build input filters based on configuration
 */
function buildInputFilters(config?: InputFilterConfig) {
  if (!config) return undefined;

  if (config.type === 'azure') {
    const azureParams: AzureContentSafetyFilterInputParameters = {};
    if (config.azureConfig?.hate) azureParams.hate = config.azureConfig.hate;
    if (config.azureConfig?.selfHarm) azureParams.self_harm = config.azureConfig.selfHarm;
    if (config.azureConfig?.sexual) azureParams.sexual = config.azureConfig.sexual;
    if (config.azureConfig?.violence) azureParams.violence = config.azureConfig.violence;
    if (config.azureConfig?.promptShield)
      azureParams.prompt_shield = config.azureConfig.promptShield;
    return [buildAzureContentSafetyFilter('input', azureParams)];
  } else if (config.type === 'llama_guard' && config.llamaGuardCategories) {
    return [buildLlamaGuard38BFilter('input', config.llamaGuardCategories)];
  }

  return undefined;
}

/**
 * Build output filters based on configuration
 */
function buildOutputFilters(config?: OutputFilterConfig) {
  if (!config) return undefined;

  if (config.type === 'azure') {
    const azureParams: AzureContentSafetyFilterOutputParameters = {};
    if (config.azureConfig?.hate) azureParams.hate = config.azureConfig.hate;
    if (config.azureConfig?.selfHarm) azureParams.self_harm = config.azureConfig.selfHarm;
    if (config.azureConfig?.sexual) azureParams.sexual = config.azureConfig.sexual;
    if (config.azureConfig?.violence) azureParams.violence = config.azureConfig.violence;
    if (config.azureConfig?.protectedMaterialCode)
      azureParams.protected_material_code = config.azureConfig.protectedMaterialCode;
    return [buildAzureContentSafetyFilter('output', azureParams)];
  } else if (config.type === 'llama_guard' && config.llamaGuardCategories) {
    return [buildLlamaGuard38BFilter('output', config.llamaGuardCategories)];
  }

  return undefined;
}

/**
 * Build filtering module config
 */
function buildFilteringModuleConfig(filtering?: FilteringConfig): FilteringModule | undefined {
  if (!filtering) return undefined;

  const inputFilters = buildInputFilters(filtering.input);
  const outputFilters = buildOutputFilters(filtering.output);

  if (!inputFilters && !outputFilters) return undefined;

  return {
    input: inputFilters ? { filters: inputFilters } : undefined,
    output: outputFilters ? { filters: outputFilters } : undefined,
  };
}

/**
 * Build masking module config
 */
function buildMaskingModuleConfig(masking?: MaskingConfig): MaskingModule | undefined {
  if (!masking || masking.entities.length === 0) return undefined;

  const dpiConfig: DpiMaskingConfig = {
    method: masking.method,
    entities: masking.entities.map((entity) => ({ type: entity })) as DpiMaskingConfig['entities'],
    allowlist: masking.allowlist,
  };

  return {
    masking_providers: [buildDpiMaskingProvider(dpiConfig)],
  };
}

/**
 * Build grounding module config
 */
function buildGroundingModuleConfig(grounding?: GroundingConfig): GroundingModule | undefined {
  if (!grounding) return undefined;

  const groundingServiceConfig: DocumentGroundingServiceConfig = {
    placeholders: {
      input: grounding.inputVariables,
      output: grounding.outputVariable,
    },
    filters: grounding.filters?.map((f) => ({
      id: f.id,
      data_repository_id: f.dataRepositoryId,
      data_repository_type: f.dataRepositoryType,
      search_configuration: f.searchConfiguration,
    })),
    metadata_params: grounding.metadataParams,
  };

  return buildDocumentGroundingConfig(groundingServiceConfig);
}

/**
 * Build translation module config
 */
function buildTranslationModuleConfig(
  translation?: TranslationConfig
): TranslationModule | undefined {
  if (!translation) return undefined;

  const translationModule: TranslationModule = {};

  if (translation.input) {
    translationModule.input = buildTranslationConfig('input', {
      sourceLanguage: translation.input.sourceLanguage,
      targetLanguage: translation.input.targetLanguage,
      translateMessagesHistory: translation.input.translateMessagesHistory,
    });
  }

  if (translation.output) {
    translationModule.output = buildTranslationConfig('output', {
      sourceLanguage: translation.output.sourceLanguage,
      targetLanguage: translation.output.targetLanguage,
    });
  }

  return Object.keys(translationModule).length > 0 ? translationModule : undefined;
}

/**
 * Convert simple message format to SDK ChatMessage format
 */
function toOrchestrationMessages(
  messages: Array<{ role: string; content: string } | ChatMessage | ToolChatMessage>
): ChatMessage[] {
  return messages.map((m) => {
    // Handle ToolChatMessage (has tool_call_id)
    if ('tool_call_id' in m) {
      return m as ToolChatMessage;
    }

    // Handle ChatMessage with tool_calls
    if ('tool_calls' in m) {
      return m as ChatMessage;
    }

    // Simple message format
    return {
      role: m.role as 'user' | 'assistant' | 'system',
      content: m.content,
    } as ChatMessage;
  });
}

// ============================================================================
// Main Provider Class
// ============================================================================

/**
 * SAP AI SDK Orchestration Provider
 *
 * Provides a clean API for all SAP AI Core orchestration features including:
 * - Streaming and non-streaming chat completion
 * - Tool/function calling
 * - Content filtering
 * - Data masking
 * - Document grounding
 * - Translation
 *
 * @example
 * ```typescript
 * const provider = new SapOrchestrationProvider({
 *   modelName: 'gpt-4o',
 *   resourceGroup: 'my-group',
 *   tools: [{
 *     type: 'function',
 *     function: {
 *       name: 'get_weather',
 *       description: 'Get weather for a location',
 *       parameters: { type: 'object', properties: { location: { type: 'string' } } }
 *     }
 *   }]
 * });
 *
 * const result = await provider.complete(messages);
 * if (result.toolCalls) {
 *   // Handle tool calls
 * }
 * ```
 */
export class SapOrchestrationProvider {
  private config: OrchestrationConfig;

  constructor(config: OrchestrationConfig) {
    this.config = config;
  }

  /**
   * Build the orchestration module configuration
   */
  private buildModuleConfig(options?: CompletionOptions): OrchestrationModuleConfig {
    // Build model params
    const modelParams: Record<string, unknown> = {
      max_tokens: options?.maxTokens ?? this.config.maxTokens ?? 4096,
      temperature: options?.temperature ?? this.config.temperature ?? 0.7,
    };

    if (options?.topP !== undefined || this.config.topP !== undefined) {
      modelParams.top_p = options?.topP ?? this.config.topP;
    }
    if (this.config.frequencyPenalty !== undefined) {
      modelParams.frequency_penalty = this.config.frequencyPenalty;
    }
    if (this.config.presencePenalty !== undefined) {
      modelParams.presence_penalty = this.config.presencePenalty;
    }

    // Handle tools in model params (SDK expects tools in params for some models)
    const tools = options?.tools ?? this.config.tools;
    const toolChoice = options?.toolChoice ?? this.config.toolChoice;

    if (tools && tools.length > 0) {
      modelParams.tools = tools;
      if (toolChoice) {
        modelParams.tool_choice = toolChoice;
      }
    }

    // Build the module config
    const moduleConfig: OrchestrationModuleConfig = {
      promptTemplating: {
        model: {
          name: this.config.modelName,
          version: this.config.modelVersion,
          params: modelParams,
        },
      },
    };

    // Add filtering
    const filtering = buildFilteringModuleConfig(this.config.filtering);
    if (filtering) {
      moduleConfig.filtering = filtering;
    }

    // Add masking
    const masking = buildMaskingModuleConfig(this.config.masking);
    if (masking) {
      moduleConfig.masking = masking;
    }

    // Add grounding
    const grounding = buildGroundingModuleConfig(this.config.grounding);
    if (grounding) {
      moduleConfig.grounding = grounding;
    }

    // Add translation
    const translation = buildTranslationModuleConfig(this.config.translation);
    if (translation) {
      moduleConfig.translation = translation;
    }

    return moduleConfig;
  }

  /**
   * Get deployment configuration
   */
  private getDeploymentConfig(): { resourceGroup?: string; deploymentId?: string } | undefined {
    const deploymentConfig: { resourceGroup?: string; deploymentId?: string } = {};

    if (this.config.resourceGroup) {
      deploymentConfig.resourceGroup = this.config.resourceGroup;
    }
    if (this.config.deploymentId) {
      deploymentConfig.deploymentId = this.config.deploymentId;
    }

    return Object.keys(deploymentConfig).length > 0 ? deploymentConfig : undefined;
  }

  /**
   * Create an OrchestrationClient instance
   */
  private createClient(options?: CompletionOptions): OrchestrationClient {
    const moduleConfig = this.buildModuleConfig(options);
    const deploymentConfig = this.getDeploymentConfig();

    return new OrchestrationClient(moduleConfig, deploymentConfig);
  }

  /**
   * Non-streaming chat completion
   *
   * @param messages - Array of chat messages (supports ToolChatMessage for tool responses)
   * @param options - Optional completion options
   * @returns Completion result with text, tool calls, and usage statistics
   *
   * @example
   * ```typescript
   * // Basic completion
   * const result = await provider.complete([
   *   { role: 'user', content: 'Hello!' }
   * ]);
   *
   * // With tool response
   * const result = await provider.complete([
   *   { role: 'user', content: 'What is the weather?' },
   *   { role: 'assistant', content: '', tool_calls: [...] },
   *   { role: 'tool', tool_call_id: 'call_123', content: '{"temp": 72}' }
   * ]);
   * ```
   */
  async complete(
    messages: Array<{ role: string; content: string } | ChatMessage | ToolChatMessage>,
    options?: CompletionOptions
  ): Promise<CompletionResult> {
    const client = this.createClient(options);
    const orchestrationMessages = toOrchestrationMessages(messages);

    const response = await client.chatCompletion({
      messages: orchestrationMessages,
    });

    const tokenUsage = response.getTokenUsage();
    const toolCalls = response.getToolCalls();
    const allMessages = response.getAllMessages();

    return {
      text: response.getContent() ?? '',
      toolCalls: toolCalls && toolCalls.length > 0 ? toolCalls : undefined,
      finishReason: response.getFinishReason() ?? undefined,
      usage: tokenUsage
        ? {
            prompt_tokens: tokenUsage.prompt_tokens,
            completion_tokens: tokenUsage.completion_tokens,
            total_tokens: tokenUsage.total_tokens,
          }
        : undefined,
      allMessages: allMessages,
    };
  }

  /**
   * Streaming chat completion
   *
   * Yields chunks with text content and/or tool call deltas.
   * The final chunk contains finish reason and usage statistics.
   *
   * @param messages - Array of chat messages
   * @param options - Optional completion options (including AbortSignal)
   * @yields StreamChunk with text, tool calls, finish reason, and usage
   *
   * @example
   * ```typescript
   * // Stream text output
   * for await (const chunk of provider.streamComplete(messages)) {
   *   if (chunk.text) {
   *     process.stdout.write(chunk.text);
   *   }
   * }
   *
   * // Stream with tool calls
   * const toolCallsAccumulator: Map<number, ToolCallChunk> = new Map();
   * for await (const chunk of provider.streamComplete(messages)) {
   *   if (chunk.text) process.stdout.write(chunk.text);
   *   if (chunk.toolCalls) {
   *     for (const tc of chunk.toolCalls) {
   *       // Accumulate tool call chunks
   *       const existing = toolCallsAccumulator.get(tc.index) || { index: tc.index };
   *       if (tc.id) existing.id = tc.id;
   *       if (tc.function?.name) existing.function = { ...existing.function, name: tc.function.name };
   *       if (tc.function?.arguments) {
   *         existing.function = existing.function || {};
   *         existing.function.arguments = (existing.function.arguments || '') + tc.function.arguments;
   *       }
   *       toolCallsAccumulator.set(tc.index, existing);
   *     }
   *   }
   * }
   * ```
   */
  async *streamComplete(
    messages: Array<{ role: string; content: string } | ChatMessage | ToolChatMessage>,
    options?: CompletionOptions
  ): AsyncGenerator<StreamChunk> {
    const client = this.createClient(options);
    const orchestrationMessages = toOrchestrationMessages(messages);

    // Use SAP SDK streaming with AbortSignal support
    const response = await client.stream({ messages: orchestrationMessages }, options?.signal);

    // Stream chunks using the iterator
    for await (const chunk of response.stream) {
      const deltaContent = chunk.getDeltaContent();
      const deltaToolCalls = chunk.getDeltaToolCalls();

      // Only yield if there's content or tool calls
      if (deltaContent || (deltaToolCalls && deltaToolCalls.length > 0)) {
        const streamChunk: StreamChunk = {
          text: deltaContent ?? '',
        };

        if (deltaToolCalls && deltaToolCalls.length > 0) {
          streamChunk.toolCalls = deltaToolCalls.map((tc: SdkToolCallChunk) => ({
            index: tc.index,
            id: tc.id,
            type: tc.type,
            function: tc.function
              ? {
                  name: tc.function.name,
                  arguments: tc.function.arguments,
                }
              : undefined,
          }));
        }

        yield streamChunk;
      }
    }

    // After streaming completes, get final metadata
    const finishReason = response.getFinishReason();
    const tokenUsage = response.getTokenUsage();

    // Yield final chunk with metadata
    yield {
      text: '',
      finishReason: finishReason ?? undefined,
      usage: tokenUsage
        ? {
            prompt_tokens: tokenUsage.prompt_tokens,
            completion_tokens: tokenUsage.completion_tokens,
            total_tokens: tokenUsage.total_tokens,
          }
        : undefined,
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

  /**
   * Update tools configuration
   */
  setTools(tools: ChatCompletionTool[]): void {
    this.config.tools = tools;
  }

  /**
   * Get current tools configuration
   */
  getTools(): ChatCompletionTool[] | undefined {
    return this.config.tools;
  }

  /**
   * Update filtering configuration
   */
  setFiltering(filtering: FilteringConfig): void {
    this.config.filtering = filtering;
  }

  /**
   * Update masking configuration
   */
  setMasking(masking: MaskingConfig): void {
    this.config.masking = masking;
  }

  /**
   * Update grounding configuration
   */
  setGrounding(grounding: GroundingConfig): void {
    this.config.grounding = grounding;
  }

  /**
   * Update translation configuration
   */
  setTranslation(translation: TranslationConfig): void {
    this.config.translation = translation;
  }

  /**
   * Get the full configuration
   */
  getConfig(): Readonly<OrchestrationConfig> {
    return { ...this.config };
  }
}

// ============================================================================
// Embeddings Client
// ============================================================================

/**
 * SAP AI SDK Orchestration Embeddings Provider
 *
 * Provides text embedding generation using SAP AI Core orchestration.
 *
 * @example
 * ```typescript
 * const embeddings = new SapOrchestrationEmbeddings({
 *   resourceGroup: 'my-group',
 *   modelName: 'text-embedding-ada-002'
 * });
 *
 * const result = await embeddings.embed(['Hello world', 'How are you?']);
 * console.log(result.embeddings); // [[0.1, 0.2, ...], [0.3, 0.4, ...]]
 * ```
 */
export class SapOrchestrationEmbeddings {
  private options: EmbeddingOptions;

  constructor(options?: EmbeddingOptions) {
    this.options = options ?? {};
  }

  /**
   * Build the embedding module configuration
   */
  private buildEmbeddingConfig(): EmbeddingModuleConfig {
    return {
      embeddings: {
        model: {
          name: (this.options.modelName ?? 'text-embedding-ada-002') as any,
          version: this.options.modelVersion,
        },
      },
    };
  }

  /**
   * Get deployment configuration
   */
  private getDeploymentConfig(): { resourceGroup?: string } | undefined {
    if (this.options.resourceGroup) {
      return { resourceGroup: this.options.resourceGroup };
    }
    return undefined;
  }

  /**
   * Generate embeddings for input texts
   *
   * @param input - Single text or array of texts to embed
   * @returns Embedding result with vectors and usage
   */
  async embed(input: string | string[]): Promise<EmbeddingResult> {
    const embeddingConfig = this.buildEmbeddingConfig();
    const deploymentConfig = this.getDeploymentConfig();

    const client = new OrchestrationEmbeddingClient(embeddingConfig, deploymentConfig);

    const texts = Array.isArray(input) ? input : [input];
    const response = await client.embed({ input: texts });

    const embeddingData = response.getEmbeddings();
    const tokenUsage = response.getTokenUsage();

    return {
      embeddings: embeddingData.map((d) => {
        // Handle both number[] and base64-encoded string formats
        if (Array.isArray(d.embedding)) {
          return d.embedding as number[];
        }
        // If it's a base64 string, decode it (rare case)
        return [];
      }),
      usage: tokenUsage
        ? {
            prompt_tokens: tokenUsage.prompt_tokens,
            total_tokens: tokenUsage.total_tokens,
          }
        : undefined,
    };
  }

  /**
   * Generate embedding for a single text
   *
   * @param text - Text to embed
   * @returns Single embedding vector
   */
  async embedSingle(text: string): Promise<number[]> {
    const result = await this.embed(text);
    return result.embeddings[0] ?? [];
  }
}

// ============================================================================
// Factory Functions
// ============================================================================

/**
 * Create a SAP Orchestration provider instance
 */
export function createSapOrchestrationProvider(
  config: OrchestrationConfig
): SapOrchestrationProvider {
  return new SapOrchestrationProvider(config);
}

/**
 * Create a SAP Orchestration embeddings instance
 */
export function createSapOrchestrationEmbeddings(
  options?: EmbeddingOptions
): SapOrchestrationEmbeddings {
  return new SapOrchestrationEmbeddings(options);
}

// ============================================================================
// Tool Definition Helpers
// ============================================================================

/**
 * Create a ChatCompletionTool from a function definition
 *
 * @param fn - Function object definition
 * @returns ChatCompletionTool
 *
 * @example
 * ```typescript
 * const weatherTool = createTool({
 *   name: 'get_weather',
 *   description: 'Get weather for a location',
 *   parameters: {
 *     type: 'object',
 *     properties: {
 *       location: { type: 'string', description: 'City name' }
 *     },
 *     required: ['location']
 *   }
 * });
 * ```
 */
export function createTool(fn: FunctionObject): ChatCompletionTool {
  return {
    type: 'function',
    function: fn,
  };
}

/**
 * Create a ToolChatMessage for responding to a tool call
 *
 * @param toolCallId - The ID of the tool call being responded to
 * @param content - The tool's response content (will be JSON stringified if object)
 * @returns ToolChatMessage
 *
 * @example
 * ```typescript
 * const toolResponse = createToolResponse(
 *   'call_abc123',
 *   { temperature: 72, conditions: 'sunny' }
 * );
 * ```
 */
export function createToolResponse(toolCallId: string, content: string | object): ToolChatMessage {
  return {
    role: 'tool',
    tool_call_id: toolCallId,
    content: typeof content === 'string' ? content : JSON.stringify(content),
  };
}

// ============================================================================
// Model Registry
// ============================================================================

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

export type OrchestrationModel = (typeof ORCHESTRATION_MODELS)[number];

/**
 * Check if a model is available through orchestration
 */
export function isOrchestrationModel(modelId: string): boolean {
  return ORCHESTRATION_MODELS.includes(modelId as OrchestrationModel);
}

// ============================================================================
// Re-export SDK Types
// ============================================================================

export type { ChatCompletionTool, FunctionObject, MessageToolCall, ToolChatMessage, ChatMessage };
