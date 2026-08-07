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

import { checkConnectivity } from './connectivity.js';
import {
  StartupTimeoutError,
  refreshAccessToken,
  isTokenExpiredError,
  ReauthenticationRequiredError,
  NoRefreshTokenError,
} from './auth.js';
import { env } from '../config/env.js';

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
 *
 * Optional cache fields mirror the SAP Orchestration `prompt_tokens_details`
 * shape (which also covers Anthropic-style `cache_read_input_tokens` /
 * `cache_creation_input_tokens` and OpenAI-style
 * `prompt_tokens_details.cached_tokens`). They are omitted when the upstream
 * provider does not report cache usage; consumers MUST treat `undefined` as
 * "unknown" rather than zero.
 */
export interface TokenUsage {
  prompt_tokens?: number;
  completion_tokens?: number;
  total_tokens?: number;
  /** Tokens served from the provider prompt cache. */
  cache_read_input_tokens?: number;
  /** Tokens written to the provider prompt cache (Anthropic charges ~1.25x). */
  cache_creation_input_tokens?: number;
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
  /** Top-k sampling (honored by Anthropic Claude; silently dropped by OpenAI-family models) */
  topK?: number;
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
  /** Top-k sampling (honored by Anthropic Claude; silently dropped by OpenAI-family models) */
  topK?: number;
  signal?: AbortSignal;
  /** Override tools for this call */
  tools?: ChatCompletionTool[];
  /** Override tool choice for this call */
  toolChoice?: OrchestrationConfig['toolChoice'];
  /** Extra HTTP headers to include in the request (e.g. agent observability headers) */
  headers?: Record<string, string>;
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
 * Extract prompt-cache hit/miss token counts from a raw SDK TokenUsage
 * payload. Handles BOTH provider shapes:
 *  - Anthropic-routed responses expose `cache_read_input_tokens` and
 *    `cache_creation_input_tokens` at the top level of `usage`.
 *  - OpenAI-shaped responses (and current SAP Orchestration TokenUsage)
 *    expose `prompt_tokens_details.cached_tokens` and
 *    `prompt_tokens_details.cache_creation_tokens`.
 *
 * Returns `undefined` for each field when the upstream payload did not
 * report it — we never coerce to 0, because 0 is a meaningful signal
 * (cache was checked and missed) distinct from "provider did not report".
 */
export function extractCacheTokens(usage: unknown): {
  cache_read_input_tokens?: number;
  cache_creation_input_tokens?: number;
} {
  if (!usage || typeof usage !== 'object') {
    return {};
  }
  const u = usage as Record<string, unknown>;

  let cacheRead: number | undefined;
  let cacheCreate: number | undefined;

  // Anthropic-style top-level fields.
  if (typeof u.cache_read_input_tokens === 'number') {
    cacheRead = u.cache_read_input_tokens;
  }
  if (typeof u.cache_creation_input_tokens === 'number') {
    cacheCreate = u.cache_creation_input_tokens;
  }

  // OpenAI / SAP Orchestration prompt_tokens_details fallback.
  const details = u.prompt_tokens_details;
  if (details && typeof details === 'object') {
    const d = details as Record<string, unknown>;
    if (cacheRead === undefined && typeof d.cached_tokens === 'number') {
      cacheRead = d.cached_tokens;
    }
    if (cacheCreate === undefined && typeof d.cache_creation_tokens === 'number') {
      cacheCreate = d.cache_creation_tokens;
    }
  }

  const out: { cache_read_input_tokens?: number; cache_creation_input_tokens?: number } = {};
  if (cacheRead !== undefined) {
    out.cache_read_input_tokens = cacheRead;
  }
  if (cacheCreate !== undefined) {
    out.cache_creation_input_tokens = cacheCreate;
  }
  return out;
}

// ============================================================================
// Empty-Response Retry (issue #1279)
// ============================================================================

/**
 * Classification of a single {@link StreamChunk} for the empty-response
 * retry wrapper.
 *
 * - `output`   : chunk carries model-visible content (text, tool call, file,
 *                reasoning) — the turn is NOT empty.
 * - `structural`: metadata-only chunk (finish reason, usage, stream-start).
 *                Not output on its own; used to detect end-of-turn.
 * - `error`    : chunk represents an error signal from the provider.
 *                Currently the SAP SDK throws for errors so this branch is
 *                reserved for future providers that emit error frames.
 */
export type StreamPartKind = 'output' | 'structural' | 'error';

/**
 * Classify a {@link StreamChunk} for retry decisions.
 *
 * A chunk is considered `output` when it produced anything the user or a
 * downstream tool loop can act on:
 *   - non-empty `text`
 *   - one or more `toolCalls`
 *
 * A chunk with only a `finishReason` or `usage` is `structural`. Purely
 * empty chunks (no text, no tool calls, no finish reason, no usage) are
 * treated as `structural` too — they cannot rescue an otherwise empty turn.
 *
 * The `output` category deliberately covers tool-call-only turns per the
 * task contract ("tool-call-only turns are never retried"): a tool call is
 * a valid, non-empty response even when the assistant produced no text.
 */
export function classifyStreamPart(chunk: StreamChunk): StreamPartKind {
  const hasText = typeof chunk.text === 'string' && chunk.text.length > 0;
  const hasToolCalls = Array.isArray(chunk.toolCalls) && chunk.toolCalls.length > 0;
  if (hasText || hasToolCalls) {
    return 'output';
  }
  return 'structural';
}

/**
 * Configuration for {@link retryEmptyResponse}.
 */
export interface EmptyResponseRetryOptions {
  /**
   * Maximum number of attempts (including the initial one).
   * Default: 3. Any value < 1 is treated as 1 (no retry).
   */
  maxAttempts?: number;
  /**
   * Optional callback invoked when an attempt is discarded as empty.
   * Receives the 1-indexed attempt number that just failed and the
   * (possibly undefined) aggregated usage-so-far. Errors thrown from the
   * callback are swallowed to avoid masking retry progress.
   */
  onEmptyAttempt?: (attempt: number, usageSoFar: TokenUsage | undefined) => void;
}

/**
 * Aggregate two {@link TokenUsage} records field-by-field.
 *
 * Undefined fields are treated as "unknown" and do NOT contribute to the
 * sum (they are only kept if present on one side). When BOTH sides report
 * a numeric value, they are summed. This matches the semantics needed for
 * charging discarded-attempt cost against the eventual successful turn
 * — the API billed us for the empty attempts, so the caller must see the
 * total.
 */
export function mergeUsage(
  a: TokenUsage | undefined,
  b: TokenUsage | undefined
): TokenUsage | undefined {
  if (!a) {
    return b;
  }
  if (!b) {
    return a;
  }
  const addField = (x: number | undefined, y: number | undefined): number | undefined => {
    if (x === undefined && y === undefined) {
      return undefined;
    }
    return (x ?? 0) + (y ?? 0);
  };
  const out: TokenUsage = {};
  const pt = addField(a.prompt_tokens, b.prompt_tokens);
  if (pt !== undefined) {
    out.prompt_tokens = pt;
  }
  const ct = addField(a.completion_tokens, b.completion_tokens);
  if (ct !== undefined) {
    out.completion_tokens = ct;
  }
  const tt = addField(a.total_tokens, b.total_tokens);
  if (tt !== undefined) {
    out.total_tokens = tt;
  }
  const cr = addField(a.cache_read_input_tokens, b.cache_read_input_tokens);
  if (cr !== undefined) {
    out.cache_read_input_tokens = cr;
  }
  const cc = addField(a.cache_creation_input_tokens, b.cache_creation_input_tokens);
  if (cc !== undefined) {
    out.cache_creation_input_tokens = cc;
  }
  return out;
}

/**
 * Wrap a stream factory with empty-response retry.
 *
 * Semantics (see issue #1279 and Kilo PR #12927):
 *  - Consume chunks from the factory-produced stream one at a time.
 *  - As soon as we see an `output` chunk we "commit" the attempt: buffered
 *    structural chunks (if any) are flushed, and everything from this
 *    attempt is streamed through to the caller unchanged. No further
 *    retries can happen for this turn.
 *  - If the stream ends without producing any `output` chunk, the attempt
 *    is discarded. Its usage is aggregated into a running total, and the
 *    factory is called again to open a fresh stream.
 *  - After {@link EmptyResponseRetryOptions.maxAttempts} attempts, the
 *    accumulated structural chunks (with aggregated usage) are yielded to
 *    the caller as a best-effort final metadata chunk. The turn ends
 *    empty — the caller decides whether that is an error.
 *  - Errors thrown by the underlying stream are propagated immediately.
 *    They are NOT retried here; higher-level layers (`ErrorBackoff`, the
 *    workflow `KILO_RETRIES` loop, or the route retry policy) handle
 *    error retries with their own backoff and classification.
 *
 * The factory MUST be safe to invoke multiple times and MUST produce a
 * fresh stream on each call (the previous stream is fully drained before
 * a retry).
 *
 * Usage aggregation is field-by-field, using {@link mergeUsage}. When the
 * committed attempt itself reports usage, that usage is summed with the
 * aggregated total of the discarded attempts so downstream cost trackers
 * bill the whole turn.
 */
export async function* retryEmptyResponse(
  streamFactory: () => AsyncIterable<StreamChunk> | Promise<AsyncIterable<StreamChunk>>,
  options: EmptyResponseRetryOptions = {}
): AsyncGenerator<StreamChunk> {
  const maxAttempts = Math.max(1, options.maxAttempts ?? 3);
  let aggregatedUsage: TokenUsage | undefined;
  let lastStructural: StreamChunk | undefined;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const stream = await streamFactory();
    const bufferedStructural: StreamChunk[] = [];
    let committed = false;

    for await (const chunk of stream) {
      if (committed) {
        // Post-commit passthrough: everything flows to the caller as-is.
        // No further retry decisions and no aggregation are needed.
        yield chunk;
        continue;
      }

      const kind = classifyStreamPart(chunk);
      if (kind === 'output') {
        // Commit: flush buffered structural chunks first, then this one.
        // Aggregate any usage seen so far into this chunk's usage so the
        // caller sees the full billed cost of the turn.
        committed = true;
        for (const s of bufferedStructural) {
          yield s;
        }
        if (aggregatedUsage) {
          const merged = mergeUsage(aggregatedUsage, chunk.usage);
          const rewritten: StreamChunk = { ...chunk };
          if (merged) {
            rewritten.usage = merged;
          }
          yield rewritten;
          aggregatedUsage = undefined;
        } else {
          yield chunk;
        }
        continue;
      }
      // structural: buffer for potential replay of usage.
      bufferedStructural.push(chunk);
      if (chunk.usage) {
        lastStructural = chunk;
      }
    }

    if (committed) {
      return;
    }

    // Attempt produced no output. Aggregate usage from the discarded
    // stream's structural chunks into the running total.
    for (const s of bufferedStructural) {
      if (s.usage) {
        aggregatedUsage = mergeUsage(aggregatedUsage, s.usage);
      }
    }
    if (options.onEmptyAttempt) {
      try {
        options.onEmptyAttempt(attempt, aggregatedUsage);
      } catch {
        // Swallow to avoid masking retry progress.
      }
    }
  }

  // All attempts empty. Yield a final metadata chunk so the caller can
  // still see the aggregated usage of the discarded attempts and the last
  // finishReason. This keeps cost tracking honest.
  const finalChunk: StreamChunk = {
    text: '',
  };
  if (lastStructural?.finishReason) {
    finalChunk.finishReason = lastStructural.finishReason;
  }
  if (aggregatedUsage) {
    finalChunk.usage = aggregatedUsage;
  }
  yield finalChunk;
}

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
 * Convert simple message format to SDK ChatMessage format.
 *
 * Supports multimodal user messages: if a message has `role === 'user'` and
 * `Array.isArray(content)`, it is treated as a pre-constructed
 * `UserChatMessage` with `UserChatMessageContentItem[]` and passed through
 * without string coercion.
 */
function toOrchestrationMessages(
  messages: Array<{ role: string; content: string | unknown[] } | ChatMessage | ToolChatMessage>
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

    // Handle multimodal user messages (content is an array of content items)
    if (m.role === 'user' && Array.isArray(m.content)) {
      return { role: 'user', content: m.content } as ChatMessage;
    }

    // Simple message format (string content)
    return {
      role: m.role as 'user' | 'assistant' | 'system',
      content: m.content as string,
    } as ChatMessage;
  });
}

// ============================================================================
// OAuth token refresh wrapper (issue #1299)
// ============================================================================

/**
 * Wrap an operation so a single 401/403 failure triggers an OAuth
 * refresh followed by exactly one retry.
 *
 * Contract:
 *  - The first attempt runs `operation()`. If it succeeds, return.
 *  - If it throws and the error is NOT a 401/403 (per
 *    `isTokenExpiredError`), rethrow immediately. No refresh, no retry.
 *  - Otherwise call `refreshAccessToken(providerId)`. If the refresh
 *    itself throws `NoRefreshTokenError` or `ReauthenticationRequiredError`,
 *    that permanent error is rethrown as-is — the caller (and the CLI)
 *    surface the "run `alexi login`" message.
 *  - After a successful refresh, run `operation()` exactly one more
 *    time. Any error from this second attempt is propagated verbatim,
 *    even if it is another 401 — we do NOT loop, to avoid burning
 *    budget on a broken credential.
 *
 * This mirrors the pattern in the issue description ("max 1 retry to
 * avoid loops") and keeps the retry policy legible: exactly two
 * attempts, one refresh between them, no exponential backoff.
 */
export async function withTokenRefresh<T>(
  providerId: string,
  operation: () => Promise<T>
): Promise<T> {
  try {
    return await operation();
  } catch (err) {
    if (!isTokenExpiredError(err)) {
      throw err;
    }
    // Attempt refresh. `NoRefreshTokenError` and
    // `ReauthenticationRequiredError` are permanent — propagate them so
    // the CLI can surface the "re-authenticate" message.
    try {
      await refreshAccessToken(providerId);
    } catch (refreshErr) {
      if (
        refreshErr instanceof NoRefreshTokenError ||
        refreshErr instanceof ReauthenticationRequiredError
      ) {
        throw refreshErr;
      }
      // Non-permanent refresh failure (5xx from token endpoint,
      // network blip). Surface a `ReauthenticationRequiredError` so
      // higher layers do not misclassify it as a chat error worth
      // retrying with the same expired bearer.
      throw new ReauthenticationRequiredError(providerId, refreshErr);
    }
    return operation();
  }
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
  private _connectivityChecked = false;

  constructor(config: OrchestrationConfig) {
    // Validate model id against the SAP AI Core orchestration catalog so an
    // unknown id fails fast with an actionable message instead of leaking
    // through to the SAP API as a generic 400/404. `deploymentId` is an
    // escape hatch for callers that have pinned a concrete deployment
    // out-of-band — the deployment binds the model, so the catalog check is
    // not authoritative there. See `InvalidModelError` for rationale.
    if (!config.deploymentId && !isOrchestrationModel(config.modelName)) {
      throw new InvalidModelError(config.modelName);
    }
    this.config = config;
  }

  /**
   * Resolve the API base URL from environment configuration.
   * Returns undefined if no URL can be determined.
   */
  private resolveApiBaseUrl(): string | undefined {
    const proxyUrl = env('SAP_PROXY_BASE_URL');
    if (proxyUrl) {
      return proxyUrl;
    }

    const serviceKeyJson = env('AICORE_SERVICE_KEY');
    if (serviceKeyJson) {
      try {
        const serviceKey = JSON.parse(serviceKeyJson);
        if (serviceKey.serviceurls?.AI_API_URL) {
          return serviceKey.serviceurls.AI_API_URL as string;
        }
      } catch {
        // Invalid JSON — skip connectivity check
      }
    }

    return undefined;
  }

  /**
   * Perform a one-time connectivity check on the first API call.
   * Throws StartupTimeoutError if the API is unreachable.
   */
  private async ensureConnectivity(): Promise<void> {
    if (this._connectivityChecked) {
      return;
    }

    const baseUrl = this.resolveApiBaseUrl();
    if (!baseUrl) {
      // Cannot determine URL — skip check, let the SDK handle the error
      this._connectivityChecked = true;
      return;
    }

    const result = await checkConnectivity(baseUrl);
    if (!result.reachable) {
      throw new StartupTimeoutError(
        'sap-ai-core',
        result.error ?? 'API unreachable — check network connection'
      );
    }

    this._connectivityChecked = true;
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
    if (options?.topK !== undefined || this.config.topK !== undefined) {
      modelParams.top_k = options?.topK ?? this.config.topK;
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
    messages: Array<{ role: string; content: string | unknown[] } | ChatMessage | ToolChatMessage>,
    options?: CompletionOptions
  ): Promise<CompletionResult> {
    await this.ensureConnectivity();

    const client = this.createClient(options);
    const orchestrationMessages = toOrchestrationMessages(messages);

    // Forward AbortSignal to the SAP SDK so user-initiated Ctrl+C (or any
    // upstream cancellation) tears down the in-flight HTTP request instead
    // of burning tokens until the model finishes. `chatCompletion` calls
    // `signal?.throwIfAborted()` and passes the signal through to fetch.
    const requestConfig =
      options?.headers || options?.signal
        ? {
            ...(options?.headers ? { headers: options.headers } : {}),
            ...(options?.signal ? { signal: options.signal } : {}),
          }
        : undefined;

    let response;
    try {
      response = await client.chatCompletion({ messages: orchestrationMessages }, requestConfig);
    } catch (err) {
      throw classifyRateLimitError(err, this.config.modelName);
    }

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
            ...extractCacheTokens(tokenUsage),
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
    messages: Array<{ role: string; content: string | unknown[] } | ChatMessage | ToolChatMessage>,
    options?: CompletionOptions
  ): AsyncGenerator<StreamChunk> {
    await this.ensureConnectivity();

    const client = this.createClient(options);
    const orchestrationMessages = toOrchestrationMessages(messages);

    // Use SAP SDK streaming with AbortSignal support.
    //
    // The signal is passed as the SECOND positional argument to
    // `client.stream(request, signal, options, requestConfig)`. The SDK
    // wires it to an internal AbortController that aborts the underlying
    // HTTP request when the caller signals cancellation. Callers MUST fire
    // this signal to unstick a stalled response -- `for await ... break`
    // alone cannot preempt a pending SSE chunk `await` (Cline PR #12249).
    // See "Streaming Abort Semantics" in docs/PROVIDERS.md and the test
    // suite tests/providers/sapOrchestration-streamAbort.test.ts.
    const requestConfig = options?.headers ? { headers: options.headers } : undefined;
    let response;
    try {
      response = await client.stream(
        { messages: orchestrationMessages },
        options?.signal,
        undefined,
        requestConfig
      );
    } catch (err) {
      throw classifyRateLimitError(err, this.config.modelName);
    }

    // Stream chunks using the iterator. Errors surfaced mid-stream are
    // also candidates for free-tier rate-limit classification — some
    // deployments accept the initial request and only surface a 429 on
    // the first data frame. Guarding just the initial `client.stream()`
    // call is therefore not sufficient.
    try {
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
    } catch (err) {
      throw classifyRateLimitError(err, this.config.modelName);
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
            ...extractCacheTokens(tokenUsage),
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
  'gpt-4o-mini',
  'gpt-4.1',
  'gpt-5',
  'gpt-5-mini',
  // Anthropic models
  'anthropic--claude-3.7-sonnet',
  'anthropic--claude-4.5-haiku',
  'anthropic--claude-4.5-sonnet',
  'anthropic--claude-4.5-opus',
  'anthropic--claude-4.7-opus',
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

/**
 * Error thrown when `SapOrchestrationProvider` is constructed with a model id
 * that is not in the `ORCHESTRATION_MODELS` catalog and no `deploymentId`
 * escape hatch is provided.
 *
 * The message is actionable: it echoes the invalid id, lists the first five
 * catalog entries as concrete examples, and points the user at the three
 * places a bad id typically originates (env var, routing-config.json, CLI
 * flag). This is a *permanent* failure per the error-classification contract
 * in `AGENTS.md` — the SAP AI Core API would eventually return
 * `model_not_found`/`deployment_not_found`, but by then the caller has
 * already spent budget on retries. Catching it at construction time lets the
 * router / TUI show one crisp diagnostic instead.
 *
 * `deploymentId` acts as an escape hatch because a caller who has pinned a
 * concrete SAP deployment id has bound the model out-of-band and does not
 * need the catalog check — the deployment itself is the authoritative
 * binding.
 */
export class InvalidModelError extends Error {
  readonly modelName: string;
  readonly validExamples: readonly string[];

  constructor(modelName: string) {
    const validExamples = ORCHESTRATION_MODELS.slice(0, 5);
    const message =
      `Model '${modelName}' not found in SAP AI Core catalog. Check:\n` +
      `  1. AICORE_MODEL environment variable\n` +
      `  2. routing-config.json model ids\n` +
      `  3. CLI --model flag spelling\n` +
      `Valid models: ${validExamples.join(', ')}`;
    super(message);
    this.name = 'InvalidModelError';
    this.modelName = modelName;
    this.validExamples = validExamples;
  }
}

// ============================================================================
// Free-tier rate limiting
// ============================================================================

/**
 * Machine-readable error code carried by {@link FreeTierRateLimitError} and
 * recognised by `ErrorBackoff.isFatal()` in `src/core/error-backoff.ts`.
 *
 * A free-tier 429 is *permanent* per the AGENTS.md error contract: retrying
 * the same call at the same rate simply burns budget and produces the same
 * cryptic "max retries exceeded" trailer. The user must either wait for the
 * quota window to reset or upgrade to a paid SAP AI Core deployment.
 */
export const FREE_TIER_RATE_LIMIT_CODE = 'free_tier_rate_limit';

/**
 * Public URL that operators land on when we tell them "your free tier quota
 * is exhausted". Kept as a constant so the same link is used by the error
 * message and by unit tests, and so future documentation moves only need to
 * be updated in one place.
 */
export const SAP_AI_CORE_RATE_LIMIT_DOCS_URL =
  'https://help.sap.com/docs/ai-core/generative-ai-hub/rate-limits';

/**
 * Error thrown when the SAP AI Core API rejects a request with HTTP 429 AND
 * the model id targets a free-tier deployment (heuristic: `-free` suffix,
 * see {@link isFreeModel}).
 *
 * The message explains what happened, why generic retry will not help, and
 * points at the SAP AI Core rate-limit documentation for the upgrade path.
 * The `code` field (`free_tier_rate_limit`) is the machine-readable signal
 * consumed by `ErrorBackoff.isFatal()` — treat any error with that code as
 * permanent and stop retrying immediately.
 *
 * Generic (non-free) 429 responses remain transient; they surface as normal
 * `Error` instances so the existing backoff/retry path in `ErrorBackoff`
 * and the workflow-level `KILO_RETRIES` loop handle them.
 */
export class FreeTierRateLimitError extends Error {
  readonly code: typeof FREE_TIER_RATE_LIMIT_CODE = FREE_TIER_RATE_LIMIT_CODE;
  readonly modelName: string;
  readonly statusCode = 429;
  readonly docsUrl: string = SAP_AI_CORE_RATE_LIMIT_DOCS_URL;

  constructor(modelName: string, cause?: unknown) {
    const message =
      `Free-tier model rate limit exceeded for '${modelName}'. ` +
      `SAP AI Core free-tier deployments enforce strict per-minute request quotas; ` +
      `retrying now will hit the same limit. Wait for the quota window to reset ` +
      `or upgrade to a paid SAP AI Core deployment. ` +
      `See: ${SAP_AI_CORE_RATE_LIMIT_DOCS_URL}`;
    super(message);
    this.name = 'FreeTierRateLimitError';
    this.modelName = modelName;
    if (cause !== undefined) {
      (this as Error & { cause?: unknown }).cause = cause;
    }
  }
}

/**
 * Heuristic: a model id targets a free-tier SAP AI Core deployment if its
 * last hyphen-delimited segment is `free` (case-insensitive). Examples:
 *   - `sap-ai-core/anthropic--claude-4.7-haiku-free` → true
 *   - `anthropic--claude-4.5-sonnet-free` → true
 *   - `anthropic--claude-4.5-sonnet` → false
 *   - `gpt-4o` → false
 *
 * The heuristic is deliberately narrow: we only match the trailing `-free`
 * segment (or the whole id) so that hypothetical model names containing
 * `free` in the middle (e.g. `some-freerider-model`) do NOT trigger the
 * free-tier code path and its non-retry behaviour.
 */
export function isFreeModel(modelId: string): boolean {
  if (typeof modelId !== 'string' || modelId.length === 0) {
    return false;
  }
  return /(^|-)free$/i.test(modelId);
}

/**
 * Extract an HTTP status code from a variety of error shapes that SAP AI
 * Core, the SAP SDK, undici, and Node/fetch throwables use.
 *
 * Tries, in order:
 *   1. `err.status` / `err.statusCode` (SDK style)
 *   2. `err.response.status` / `err.response.statusCode` (fetch wrappers)
 *   3. A textual `status: NNN` marker in `err.message` (mirrors the regex
 *      used by `extractStatusCode` in `src/core/error-backoff.ts`)
 *
 * Returns `undefined` when no status can be extracted. The message-based
 * fallback intentionally restricts to 4xx/5xx to avoid false positives on
 * arbitrary three-digit numbers in error text.
 */
function extractHttpStatus(err: unknown): number | undefined {
  if (err === null || err === undefined) {
    return undefined;
  }
  if (typeof err === 'object') {
    const candidate = err as {
      status?: unknown;
      statusCode?: unknown;
      response?: { status?: unknown; statusCode?: unknown };
      message?: unknown;
    };
    const direct = candidate.status ?? candidate.statusCode;
    if (typeof direct === 'number' && Number.isFinite(direct)) {
      return direct;
    }
    const resp = candidate.response;
    if (resp && typeof resp === 'object') {
      const respStatus = resp.status ?? resp.statusCode;
      if (typeof respStatus === 'number' && Number.isFinite(respStatus)) {
        return respStatus;
      }
    }
    if (typeof candidate.message === 'string') {
      const match = candidate.message.match(/status:\s*([45]\d{2})\b/);
      if (match) {
        return parseInt(match[1], 10);
      }
      // Fallback for bare "429" or "HTTP 429" in the message without a
      // "status:" prefix — common in SDK error strings.
      const bare = candidate.message.match(/\b(429|502|503|504)\b/);
      if (bare) {
        return parseInt(bare[1], 10);
      }
    }
  }
  return undefined;
}

/**
 * If `err` represents a 429 response AND `modelName` looks like a free-tier
 * deployment (see {@link isFreeModel}), wrap the underlying error in a
 * {@link FreeTierRateLimitError} with actionable upgrade guidance.
 *
 * Otherwise return the original error unchanged so the existing transient
 * retry path in `ErrorBackoff` and the workflow retry loop keeps handling
 * generic 429s the same way it does today.
 *
 * Exported for direct unit testing; production callers use it via the
 * `complete`/`streamComplete` catch blocks.
 */
export function classifyRateLimitError(err: unknown, modelName: string): unknown {
  if (err instanceof FreeTierRateLimitError) {
    return err;
  }
  const status = extractHttpStatus(err);
  if (status !== 429) {
    return err;
  }
  if (!isFreeModel(modelName)) {
    return err;
  }
  return new FreeTierRateLimitError(modelName, err);
}

// ============================================================================
// Re-export SDK Types
// ============================================================================

export type { ChatCompletionTool, FunctionObject, MessageToolCall, ToolChatMessage, ChatMessage };
