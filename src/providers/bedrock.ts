/**
 * Typed AWS Bedrock Converse request options (opencode `74556a2` port).
 *
 * Alexi primarily targets SAP AI Core, but a subset of users route
 * Bedrock-hosted models alongside it (Anthropic Claude on Bedrock, for
 * instance). Upstream opencode added typed options for Bedrock's
 * Converse API so callers can request reasoning effort, service tier,
 * adaptive thinking, and request metadata without stringly-typed
 * provider-options bags that silently drop unknown keys.
 *
 * Scope: this file carries ONLY the typed options surface and the
 * request builder helper. Wiring to the actual Bedrock SDK call lives
 * wherever the caller instantiates the Bedrock client — kept out of
 * this module so the SAP AI Core dependency graph stays clean and users
 * who do not use Bedrock pay zero runtime cost.
 */

/**
 * Reasoning effort passed through `additionalModelRequestFields.reasoning_effort`.
 * Mirrors the Anthropic / OpenAI tri-value enum; Bedrock forwards the
 * value verbatim to the underlying model vendor.
 */
export type BedrockReasoningEffort = 'low' | 'medium' | 'high';

/**
 * Service tier controls Bedrock's provisioning strategy. `priority` buys
 * lower variance in latency at a higher per-token cost; `standard` is
 * the default pool.
 */
export type BedrockServiceTier = 'standard' | 'priority';

/**
 * Fully typed options surface for a Converse request. Each field maps to
 * a distinct Bedrock Converse request parameter (either top-level or
 * nested under `additionalModelRequestFields`) — see
 * `buildConverseRequest` for the exact mapping.
 */
export interface BedrockConverseOptions {
  /** Vendor-forwarded `reasoning_effort` enum. */
  reasoningEffort?: BedrockReasoningEffort;
  /** Bedrock provisioning tier. */
  serviceTier?: BedrockServiceTier;
  /**
   * Adaptive-thinking toggle for models that support it (Claude 3.7+).
   * Translates to `additionalModelRequestFields.thinking = { type:
   * 'enabled' }`; disabling omits the field entirely so the model
   * uses its default.
   */
  adaptiveThinking?: boolean;
  /**
   * Arbitrary metadata attached to the request. Values are
   * string-only per the Converse spec; non-string values are stringified
   * at the call site, not here, so this interface stays strictly typed.
   */
  requestMetadata?: Record<string, string>;
  /**
   * Optional JSON Schema that constrains the model response shape.
   * Forwarded as `additionalModelRequestFields.response_json_schema`.
   */
  responseJsonSchema?: object;
}

/**
 * Minimal structural type for a Converse message. Bedrock's SDK types
 * are not pulled in here so this module stays dependency-free; callers
 * that use the AWS SDK can safely cast up to its richer type.
 */
export interface BedrockConverseMessage {
  role: 'user' | 'assistant' | 'system';
  content: unknown;
}

/**
 * Shape of the request body passed to the Converse SDK call. All fields
 * except `modelId` and `messages` are optional and omitted when the
 * caller did not provide the matching option — this keeps the request
 * body minimal so Bedrock's request validator does not reject unknown
 * empty fields.
 */
export interface BedrockConverseRequest {
  modelId: string;
  messages: BedrockConverseMessage[];
  additionalModelRequestFields?: Record<string, unknown>;
  performanceConfig?: { latency: BedrockServiceTier };
  requestMetadata?: Record<string, string>;
}

/**
 * Translate typed `BedrockConverseOptions` into a Converse request body.
 *
 * The function is pure and does not perform any SDK calls — callers
 * pass the returned object into `BedrockRuntimeClient.send(new
 * ConverseCommand(request))`.
 */
export function buildConverseRequest(
  model: string,
  messages: BedrockConverseMessage[],
  opts: BedrockConverseOptions = {}
): BedrockConverseRequest {
  const additionalModelRequestFields: Record<string, unknown> = {};

  if (opts.reasoningEffort) {
    additionalModelRequestFields.reasoning_effort = opts.reasoningEffort;
  }
  if (opts.adaptiveThinking) {
    additionalModelRequestFields.thinking = { type: 'enabled' };
  }
  if (opts.responseJsonSchema) {
    additionalModelRequestFields.response_json_schema = opts.responseJsonSchema;
  }

  const request: BedrockConverseRequest = {
    modelId: model,
    messages,
  };

  if (Object.keys(additionalModelRequestFields).length > 0) {
    request.additionalModelRequestFields = additionalModelRequestFields;
  }
  if (opts.serviceTier) {
    // Converse carries the tier under `performanceConfig.latency`.
    request.performanceConfig = { latency: opts.serviceTier };
  }
  if (opts.requestMetadata && Object.keys(opts.requestMetadata).length > 0) {
    request.requestMetadata = opts.requestMetadata;
  }

  return request;
}
