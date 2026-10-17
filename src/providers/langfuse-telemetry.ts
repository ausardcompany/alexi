/**
 * Langfuse BYOK Telemetry (direct exporter)
 *
 * Opt-in Langfuse tracing for BYOK SAP AI Core providers. Ported from Cline
 * PR #14787 (`feat(llms): opt-in Langfuse tracing for BYOK providers plus
 * env tags, metadata and environment`).
 *
 * Contract:
 * - DISABLED by default. Enabled when the operator sets both:
 *     - `ALEXI_LANGFUSE_ALL_PROVIDERS=1` (truthy opt-in), AND
 *     - direct Langfuse credentials: `LANGFUSE_BASE_URL`,
 *       `LANGFUSE_PUBLIC_KEY`, `LANGFUSE_SECRET_KEY`.
 * - Direct exporter ONLY. BYOK provider traces never traverse the host OTLP
 *   relay (`src/utils/tracing.ts`); the operator keeps full control of where
 *   their prompts land.
 * - Trace-level dimensions can be attached from env:
 *     - `LANGFUSE_TRACING_ENVIRONMENT` -> Langfuse `environment` field on
 *       every trace produced by this process.
 *     - `ALEXI_LANGFUSE_TAGS` -> comma-separated trace tags
 *       (`foo, bar,foo` -> `['foo', 'bar']`, deduped).
 *     - `ALEXI_LANGFUSE_METADATA` -> either a JSON object (`{"k":"v"}`) or
 *       `key=value,...` pairs. Values are coerced to strings; `null` /
 *       `undefined` entries are dropped.
 * - Merge rules:
 *     - Tags are the union of env + call-site, deduped (env first, then
 *       call-site new values appended).
 *     - Metadata is `{...env, ...callSite}` so call-site keys win on
 *       conflict.
 *     - When nothing is set on either side, propagation is skipped entirely
 *       and the callback runs unchanged (no empty trace is created).
 *
 * This module does NOT register OpenTelemetry providers; it talks to
 * Langfuse directly through the `langfuse` SDK so a BYOK trace stays
 * isolated from any process-wide OTLP configuration.
 */

import type { Langfuse, LangfuseGenerationClient, LangfuseTraceClient } from 'langfuse';

import { env } from '../config/env.js';
import {
  isContentFilterError,
  isPermanentAuthFailure,
  isRateLimitError,
} from '../core/error-backoff.js';
import { scrubUrlsFromString } from '../utils/logger.js';

// ============================================================================
// Env var names (operators grep for these)
// ============================================================================

/** Opt-in: trace non-SAP (BYOK) providers through direct credentials. */
export const LANGFUSE_ALL_PROVIDERS_ENV = 'ALEXI_LANGFUSE_ALL_PROVIDERS';
/** Comma-separated tags appended to every trace produced by this process. */
export const LANGFUSE_TAGS_ENV = 'ALEXI_LANGFUSE_TAGS';
/** JSON object OR `key=value,...` metadata merged under call-site metadata. */
export const LANGFUSE_METADATA_ENV = 'ALEXI_LANGFUSE_METADATA';
/** Langfuse environment label (`ci`, `benchmark`, `prod`, ...). */
export const LANGFUSE_ENVIRONMENT_ENV = 'LANGFUSE_TRACING_ENVIRONMENT';
export const LANGFUSE_BASE_URL_ENV = 'LANGFUSE_BASE_URL';
export const LANGFUSE_PUBLIC_KEY_ENV = 'LANGFUSE_PUBLIC_KEY';
export const LANGFUSE_SECRET_KEY_ENV = 'LANGFUSE_SECRET_KEY';

/**
 * `sdkIntegration` string stamped on every trace emitted by this module so
 * downstream dashboards can filter alexi-generated traces from vanilla
 * Langfuse SDK traces coming from the same project.
 */
export const LANGFUSE_SDK_INTEGRATION = 'alexi-langfuse-direct';

// ============================================================================
// Types
// ============================================================================

/** Direct Langfuse exporter configuration resolved from env vars. */
export interface DirectLangfuseTelemetryConfig {
  baseUrl: string;
  publicKey: string;
  secretKey: string;
  /** Langfuse environment (`LANGFUSE_TRACING_ENVIRONMENT`). */
  environment?: string;
}

/**
 * Attributes to attach to a Langfuse trace. Mirrors the Langfuse SDK
 * `trace()` shape but narrowed to the fields we propagate.
 */
export interface LangfuseTraceAttributes {
  sessionId?: string;
  userId?: string;
  tags?: string[];
  metadata?: Record<string, unknown>;
}

/** Result of resolving whether to trace a given call. */
export type AiSdkTelemetryDecision =
  | { isEnabled: false }
  | {
      isEnabled: true;
      /** Langfuse client to use for span emission. */
      client: Langfuse;
      /** Config in effect (environment / baseUrl snapshot for logging). */
      config: DirectLangfuseTelemetryConfig;
    };

// ============================================================================
// Env parsing
// ============================================================================

/**
 * Coerce a string env var into a boolean. The empty string, `0`, `false`,
 * `no`, `off`, and `undefined` are all treated as falsy. Anything else is
 * truthy. Matches the operator-friendly contract used by the Cline source
 * (so `=1`, `=true`, `=yes` all enable).
 */
export function isEnvTruthy(raw: string | undefined): boolean {
  if (!raw) {
    return false;
  }
  const normalized = raw.trim().toLowerCase();
  if (normalized.length === 0) {
    return false;
  }
  return !['0', 'false', 'no', 'off'].includes(normalized);
}

/**
 * Read direct Langfuse credentials from the environment. Returns
 * `undefined` when ANY of the three required fields is missing so the
 * caller stays off when the operator has only partially configured the
 * credentials (otherwise we would silently drop traces).
 */
export function readDirectLangfuseTelemetryConfig(): DirectLangfuseTelemetryConfig | undefined {
  const baseUrl = env(LANGFUSE_BASE_URL_ENV);
  const publicKey = env(LANGFUSE_PUBLIC_KEY_ENV);
  const secretKey = env(LANGFUSE_SECRET_KEY_ENV);

  if (!baseUrl || !publicKey || !secretKey) {
    return undefined;
  }

  const environment = env(LANGFUSE_ENVIRONMENT_ENV);
  return {
    baseUrl,
    publicKey,
    secretKey,
    ...(environment ? { environment } : {}),
  };
}

/** Parse `ALEXI_LANGFUSE_TAGS` into a deduped array of trimmed tag strings. */
function parseEnvTags(raw: string | undefined): string[] {
  if (!raw) {
    return [];
  }
  return dedupe(
    raw
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0)
  );
}

/**
 * Parse `ALEXI_LANGFUSE_METADATA` into a flat `Record<string, string>`.
 * Accepts either a JSON object or `key=value,key=value` pairs. Malformed
 * JSON is logged (when `ALEXI_DEBUG_LANGFUSE=1`) and otherwise ignored --
 * a corrupt env var MUST NOT crash the provider.
 */
function parseEnvMetadata(raw: string | undefined): Record<string, string> {
  const trimmed = raw?.trim();
  if (!trimmed) {
    return {};
  }
  const metadata: Record<string, string> = {};

  if (trimmed.startsWith('{')) {
    try {
      const parsed: unknown = JSON.parse(trimmed);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        for (const [key, value] of Object.entries(parsed as Record<string, unknown>)) {
          if (value === undefined || value === null) {
            continue;
          }
          metadata[key] = typeof value === 'string' ? value : JSON.stringify(value);
        }
      }
    } catch (error) {
      debugLangfuse(
        `ignoring malformed ${LANGFUSE_METADATA_ENV} JSON error=${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
    return metadata;
  }

  for (const pair of trimmed.split(',')) {
    const separator = pair.indexOf('=');
    if (separator <= 0) {
      continue;
    }
    const key = pair.slice(0, separator).trim();
    const value = pair.slice(separator + 1).trim();
    if (key) {
      metadata[key] = value;
    }
  }
  return metadata;
}

function dedupe(values: string[]): string[] {
  return [...new Set(values)];
}

function debugLangfuse(message: string): void {
  if (isEnvTruthy(env('ALEXI_DEBUG_LANGFUSE'))) {
    // Logger routing not available here (circular with providers); use
    // stderr directly so the message survives the no-console lint rule.
    process.stderr.write(`[langfuse] ${message}\n`);
  }
}

/**
 * Operator-supplied trace dimensions. `ALEXI_LANGFUSE_TAGS` is a
 * comma-separated tag list and `ALEXI_LANGFUSE_METADATA` is either a JSON
 * object or comma-separated `key=value` pairs. Both are merged under the
 * runtime's own attributes, so a benchmark harness can label every trace
 * it produces (for example `benchmark-run-1`) without touching call sites.
 */
export function readEnvTraceAttributes(): Pick<LangfuseTraceAttributes, 'tags' | 'metadata'> {
  const tags = parseEnvTags(env(LANGFUSE_TAGS_ENV));
  const metadata = parseEnvMetadata(env(LANGFUSE_METADATA_ENV));
  return {
    ...(tags.length ? { tags } : {}),
    ...(Object.keys(metadata).length ? { metadata } : {}),
  };
}

/**
 * Merge env-derived attributes with call-site attributes. Returns
 * `undefined` when the merged attribute set is empty so the caller can
 * skip propagation entirely.
 *
 * Merge rules:
 * - Tags: env first, then call-site new values appended, deduped.
 * - Metadata: `{...env, ...callSite}` -- call-site wins on key conflict.
 * - Other fields on `attributes` (sessionId, userId) pass through.
 */
export function withLangfuseTraceAttributes(
  callAttrs: LangfuseTraceAttributes,
  envAttrs: Pick<LangfuseTraceAttributes, 'tags' | 'metadata'> = readEnvTraceAttributes()
): LangfuseTraceAttributes | undefined {
  const tags = dedupe([...(envAttrs.tags ?? []), ...(callAttrs.tags ?? [])]);
  const metadata = { ...envAttrs.metadata, ...callAttrs.metadata };
  const merged: LangfuseTraceAttributes = {
    ...callAttrs,
    ...(tags.length ? { tags } : {}),
    ...(Object.keys(metadata).length ? { metadata } : {}),
  };
  if (!tags.length) {
    delete merged.tags;
  }
  if (!Object.keys(metadata).length) {
    delete merged.metadata;
  }
  return Object.keys(merged).length ? merged : undefined;
}

// ============================================================================
// Runtime decision + client factory
// ============================================================================

/**
 * Cache of Langfuse clients keyed by `baseUrl|publicKey|environment` so a
 * long-running process reuses one HTTP keep-alive pool per credential set
 * instead of leaking a new client on every call.
 */
let clientCache = new Map<string, Langfuse>();

/** Test-only hook so unit tests get a clean module per describe block. */
export function _resetLangfuseTelemetryForTests(): void {
  for (const client of clientCache.values()) {
    try {
      // Best-effort shutdown; synchronous paths may not have a shutdown.
      void client.shutdownAsync?.().catch(() => undefined);
    } catch {
      // Ignore -- the client may be a bare mock.
    }
  }
  clientCache = new Map();
}

function cacheKey(config: DirectLangfuseTelemetryConfig): string {
  return `${config.baseUrl}|${config.publicKey}|${config.environment ?? ''}`;
}

/**
 * Lazily construct (and cache) a direct Langfuse client. The import is
 * dynamic to keep `langfuse` off the hot boot path when BYOK tracing is
 * disabled -- the default. The constructor is wrapped in try/catch so a
 * broken client (missing peer dep, invalid URL) disables tracing for this
 * call without crashing the provider.
 */
async function getLangfuseClient(
  config: DirectLangfuseTelemetryConfig
): Promise<Langfuse | undefined> {
  const key = cacheKey(config);
  const cached = clientCache.get(key);
  if (cached) {
    return cached;
  }
  try {
    const mod = await import('langfuse');
    const client = new mod.Langfuse({
      baseUrl: config.baseUrl,
      publicKey: config.publicKey,
      secretKey: config.secretKey,
      sdkIntegration: LANGFUSE_SDK_INTEGRATION,
      flushAt: 1,
    });
    clientCache.set(key, client);
    debugLangfuse(
      `created isolated direct exporter baseUrl=${config.baseUrl} environment=${
        config.environment ?? ''
      }`
    );
    return client;
  } catch (error) {
    debugLangfuse(
      `failed to construct Langfuse client error=${
        error instanceof Error ? error.message : String(error)
      }`
    );
    return undefined;
  }
}

/**
 * Decide whether to trace the given provider call and, when enabled,
 * return the Langfuse client to use. BYOK tracing is opt-in: it fires
 * when the operator sets `ALEXI_LANGFUSE_ALL_PROVIDERS=1` and supplies
 * direct Langfuse credentials.
 *
 * The returned client ALWAYS points at the operator-configured Langfuse
 * instance via a direct HTTP exporter -- the host OTLP relay
 * (`src/utils/tracing.ts`) is never used for BYOK traces. This keeps a
 * BYOK operator's prompts/completions from reaching a collector they did
 * not configure themselves.
 *
 * The `_modelId` argument is accepted so the signature stays stable with
 * the Cline reference implementation (where BYOK vs native-provider is a
 * runtime decision); Alexi routes all calls through SAP AI Core, so the
 * id is advisory and not used to gate the decision.
 */
export async function resolveAiSdkTelemetry(_modelId: string): Promise<AiSdkTelemetryDecision> {
  if (!isEnvTruthy(env(LANGFUSE_ALL_PROVIDERS_ENV))) {
    return { isEnabled: false };
  }
  const config = readDirectLangfuseTelemetryConfig();
  if (!config) {
    return { isEnabled: false };
  }
  const client = await getLangfuseClient(config);
  if (!client) {
    return { isEnabled: false };
  }
  return { isEnabled: true, client, config };
}

// ============================================================================
// Trace helpers
// ============================================================================

/**
 * Begin a Langfuse trace for a provider call. The merged attribute set
 * (env + call-site) is attached to the trace. Returns `undefined` when
 * tracing is disabled OR when the merged attribute set is empty AND the
 * caller supplied no name/sessionId (so an empty trace is never emitted).
 */
export function startLangfuseTrace(
  decision: AiSdkTelemetryDecision,
  callAttrs: LangfuseTraceAttributes & { name?: string }
): LangfuseTraceClient | undefined {
  if (!decision.isEnabled) {
    return undefined;
  }
  const merged = withLangfuseTraceAttributes(callAttrs);
  // When no env attrs and no call attrs: skip. `name` alone still fires so
  // the operator sees spans for every provider call.
  if (!merged && !callAttrs.name) {
    return undefined;
  }
  try {
    return decision.client.trace({
      name: callAttrs.name ?? 'alexi.provider',
      sessionId: merged?.sessionId ?? callAttrs.sessionId,
      userId: merged?.userId ?? callAttrs.userId,
      tags: merged?.tags,
      metadata: merged?.metadata,
    });
  } catch (error) {
    debugLangfuse(`trace() failed error=${error instanceof Error ? error.message : String(error)}`);
    return undefined;
  }
}

/**
 * Begin a Langfuse generation (child observation) representing the actual
 * model call. Safe to call with `trace === undefined` (returns undefined).
 */
export function startLangfuseGeneration(
  trace: LangfuseTraceClient | undefined,
  attrs: { name: string; model: string; input?: unknown }
): LangfuseGenerationClient | undefined {
  if (!trace) {
    return undefined;
  }
  try {
    return trace.generation({
      name: attrs.name,
      model: attrs.model,
      input: attrs.input,
      startTime: new Date(),
    });
  } catch (error) {
    debugLangfuse(
      `generation() failed error=${error instanceof Error ? error.message : String(error)}`
    );
    return undefined;
  }
}

/**
 * Record usage, output, and OK status on a Langfuse generation, then end
 * it. Safe to call with `generation === undefined`.
 */
export function finishLangfuseGeneration(
  generation: LangfuseGenerationClient | undefined,
  data: {
    output?: unknown;
    usage?: { prompt_tokens?: number; completion_tokens?: number; total_tokens?: number };
    finishReason?: string;
  }
): void {
  if (!generation) {
    return;
  }
  try {
    generation.end({
      output: data.output,
      usage: data.usage
        ? {
            input: data.usage.prompt_tokens,
            output: data.usage.completion_tokens,
            total: data.usage.total_tokens,
          }
        : undefined,
      metadata: data.finishReason ? { finishReason: data.finishReason } : undefined,
    });
  } catch (error) {
    debugLangfuse(
      `generation.end() failed error=${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Structured error-span correlation context attached to a failed
 * Langfuse generation (issue #2057, Cline PR #15100 parity).
 *
 * - `errorType` — the error class name used for dashboard filtering
 *   (e.g. `ContentFilterError`, `FreeTierRateLimitError`, `AuthError`,
 *   `NetworkError`). When omitted, {@link classifyLangfuseError}
 *   derives it from the error's `name`, `code`, or constructor.
 * - `errorMessage` — human-readable description for debugging.
 *   {@link failLangfuseGeneration} runs the final string through
 *   {@link redactCredentialsFromString} (bearer tokens, SAP service-key
 *   fields, PEM blocks, long JWT-shaped base64 blobs, URL query
 *   strings) before forwarding it to the Langfuse SDK. Callers that
 *   do their own redaction upstream (issue #2051) are still welcome
 *   to pass a pre-scrubbed override; this scrubber is the Langfuse-
 *   side safety net, not a replacement for upstream redaction.
 * - `isTerminal` — operator hint that distinguishes permanent config
 *   failures (`true`: auth, validation, content filter, 4xx except
 *   429) from transient blips the retry budget is expected to
 *   absorb (`false`: network, 5xx, 429 / rate limit).
 */
export interface LangfuseErrorContext {
  errorType?: string;
  errorMessage?: string;
  isTerminal?: boolean;
}

/**
 * HTTP status codes considered terminal (permanent config failure)
 * per the error contract in `AGENTS.md`. 429 is NOT in this set —
 * it's a transient rate-limit the retry budget will absorb.
 */
const TERMINAL_HTTP_STATUSES = new Set([400, 401, 403, 404, 422]);

/**
 * Patterns of high-signal credential material that MUST NOT reach
 * Langfuse error spans. Issue #2057 explicitly forbids raw credentials
 * or API keys inside error-span metadata. Provider errors occasionally
 * echo request headers, service-key JSON, or signed URLs inside
 * `Error.message` on failure paths, so we scrub defensively before
 * forwarding the string to the Langfuse SDK.
 *
 * Scrubbing is layered on top of {@link scrubUrlsFromString} (which
 * handles query strings carrying OAuth tokens) and runs regardless of
 * whether issue #2051 (operator-side redaction) is in place — this is
 * the Langfuse-specific safety net, not a replacement for upstream
 * redaction.
 */
const CREDENTIAL_PATTERNS: Array<readonly [RegExp, string]> = [
  // HTTP Authorization headers: `Authorization: Bearer <token>` or `Bearer <token>` inline.
  [/\bBearer\s+[A-Za-z0-9._\-+/=]{8,}/gi, 'Bearer [REDACTED]'],
  // Basic auth header value.
  [/\bBasic\s+[A-Za-z0-9+/=]{8,}/gi, 'Basic [REDACTED]'],
  // SAP service-key fields and other JSON secrets. Match both quoted
  // and unquoted forms so `clientsecret:"..."` and `"clientsecret": "..."`
  // are both handled.
  [
    /"(client[_-]?secret|clientsecret|secret_key|secretkey|api[_-]?key|apikey|access[_-]?token|accesstoken|refresh[_-]?token|refreshtoken|password)"\s*:\s*"[^"]{4,}"/gi,
    '"$1":"[REDACTED]"',
  ],
  // Loose `key=value` and `key: value` forms for the same fields.
  [
    /\b(client[_-]?secret|clientsecret|secret_key|secretkey|api[_-]?key|apikey|access[_-]?token|accesstoken|refresh[_-]?token|refreshtoken|password)\s*[:=]\s*(["'])?[A-Za-z0-9._\-+/=]{8,}\2?/gi,
    '$1=[REDACTED]',
  ],
  // PEM-encoded private keys.
  [/-----BEGIN [A-Z ]+PRIVATE KEY-----[\s\S]*?-----END [A-Z ]+PRIVATE KEY-----/g, '[REDACTED_PEM]'],
  // Long opaque base64 blobs (JWTs, service-key tokens embedded raw in
  // error messages). Keep the threshold high enough that normal error
  // text ("provider returned 401 — unauthorized") does not match.
  [/\b[A-Za-z0-9_-]{40,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/g, '[REDACTED_JWT]'],
];

/**
 * Scrub credential material out of a free-form string before it is
 * attached to a Langfuse error span.
 *
 * The redaction is additive to {@link scrubUrlsFromString}: URL query
 * strings and hash fragments are scrubbed first (OAuth tokens frequently
 * ride there), then the credential patterns above are applied to the
 * remaining text.
 *
 * This is deliberately conservative — it does not try to detect every
 * possible secret shape, only the high-signal patterns called out in
 * the PR review of #2057 and in the issue contract. The goal is to
 * prevent accidental credential exfiltration via telemetry, not to
 * replace a dedicated DLP tool.
 *
 * @internal — exported for testing.
 */
export function redactCredentialsFromString(text: string): string {
  if (!text) {
    return text;
  }
  let redacted = scrubUrlsFromString(text);
  for (const [pattern, replacement] of CREDENTIAL_PATTERNS) {
    redacted = redacted.replace(pattern, replacement);
  }
  return redacted;
}

/**
 * Extract an HTTP status code from an error, when present. Looks at the
 * common surface shapes used by SAP SDK, fetch, and axios wrappers:
 * `statusCode`, `status`, `response.status`.
 */
function extractStatusCode(err: unknown): number | undefined {
  if (!err || typeof err !== 'object') {
    return undefined;
  }
  const candidate = err as {
    statusCode?: unknown;
    status?: unknown;
    response?: { status?: unknown };
  };
  if (typeof candidate.statusCode === 'number') {
    return candidate.statusCode;
  }
  if (typeof candidate.status === 'number') {
    return candidate.status;
  }
  if (
    candidate.response &&
    typeof candidate.response === 'object' &&
    typeof candidate.response.status === 'number'
  ) {
    return candidate.response.status;
  }
  return undefined;
}

/**
 * Match the error-code strings `ErrorBackoff` emits for network-level
 * transients. Mirrors the agent-workflow transient regex in
 * `AGENTS.md#error-classification` so Langfuse labelling stays
 * consistent with the retry budget.
 */
function isNetworkTransient(err: unknown): boolean {
  if (!err || typeof err !== 'object') {
    return false;
  }
  const candidate = err as { code?: unknown; message?: unknown };
  const code = typeof candidate.code === 'string' ? candidate.code : '';
  if (
    code === 'ECONNRESET' ||
    code === 'ECONNREFUSED' ||
    code === 'ETIMEDOUT' ||
    code === 'ENOTFOUND' ||
    code === 'EPIPE' ||
    code === 'EAGAIN' ||
    code === 'EBUSY'
  ) {
    return true;
  }
  const msg = typeof candidate.message === 'string' ? candidate.message : '';
  return /socket hang up|ECONNRESET|ECONNREFUSED|ETIMEDOUT|ENOTFOUND|EPIPE|fetch failed/i.test(msg);
}

/**
 * Classify an error into Langfuse error-span context fields. Pure
 * function — safe to call without an active Langfuse client.
 *
 * Classification rules (aligned with `AGENTS.md#error-classification`
 * and the retry contract in `docs/ARCHITECTURE.md#error-handling`):
 *
 * Terminal (permanent, operator must fix):
 *   - Content-filter rejections (`ContentFilterError`)
 *   - Permanent auth failures (`NoRefreshTokenError`,
 *     `ReauthenticationRequiredError`)
 *   - Free-tier rate-limit (quota permanently blocks until window reset,
 *     treated as fatal by `ErrorBackoff.isFatal`)
 *   - HTTP 400, 401, 403, 404, 422
 *
 * Transient (retry budget expected to absorb):
 *   - HTTP 429 (generic rate limit) and HTTP 5xx
 *   - Network errors (ECONNRESET, ETIMEDOUT, ENOTFOUND, ...)
 *   - xAI capacity errors
 *
 * The returned `errorType` prefers the error class name
 * (`err.name` / constructor name) so dashboards can filter by named
 * error families without parsing messages.
 */
export function classifyLangfuseError(err: unknown): LangfuseErrorContext {
  const rawMessage = err instanceof Error ? err.message : String(err);
  const errorMessage = redactCredentialsFromString(rawMessage);

  let errorType = 'Error';
  if (err && typeof err === 'object') {
    const candidate = err as { name?: unknown; constructor?: { name?: unknown } };
    if (typeof candidate.name === 'string' && candidate.name.length > 0) {
      errorType = candidate.name;
    } else if (
      candidate.constructor &&
      typeof candidate.constructor.name === 'string' &&
      candidate.constructor.name.length > 0 &&
      candidate.constructor.name !== 'Object'
    ) {
      errorType = candidate.constructor.name;
    }
  }

  // Terminal classes first — these short-circuit the HTTP-status check.
  if (isContentFilterError(err) || isPermanentAuthFailure(err)) {
    return { errorType, errorMessage, isTerminal: true };
  }

  // Free-tier rate limit is permanent per the error contract even
  // though its underlying HTTP code is 429. We detect it structurally
  // via the error name so cross-module re-imports still match.
  if (err && typeof err === 'object') {
    const candidate = err as { name?: unknown; code?: unknown };
    if (candidate.name === 'FreeTierRateLimitError' || candidate.code === 'free_tier_rate_limit') {
      return { errorType, errorMessage, isTerminal: true };
    }
  }

  // Transient rate-limit (generic 429) comes before the HTTP-status
  // check so we classify 429 as transient regardless of how the
  // provider surfaced the status code.
  if (isRateLimitError(err)) {
    return { errorType, errorMessage, isTerminal: false };
  }

  const status = extractStatusCode(err);
  if (status !== undefined) {
    if (TERMINAL_HTTP_STATUSES.has(status)) {
      return { errorType, errorMessage, isTerminal: true };
    }
    // 429 handled above; other 4xx fall through to terminal; 5xx is
    // transient. `429` would be caught by `isRateLimitError` above
    // only when the error carries the rate-limit `code`/`name`
    // marker — a raw `statusCode === 429` still routes here.
    if (status === 429) {
      return { errorType, errorMessage, isTerminal: false };
    }
    if (status >= 400 && status < 500) {
      return { errorType, errorMessage, isTerminal: true };
    }
    if (status >= 500 && status < 600) {
      return { errorType, errorMessage, isTerminal: false };
    }
  }

  if (isNetworkTransient(err)) {
    return { errorType, errorMessage, isTerminal: false };
  }

  // Unknown error shape: default to transient so dashboards do not
  // mis-flag an unclassified blip as a permanent config failure.
  // Operators can refine the classifier if they see noise.
  return { errorType, errorMessage, isTerminal: false };
}

/**
 * Record an error on a Langfuse generation and end it. Safe with
 * `generation === undefined`.
 *
 * Issue #2057 extends this to attach structured error-span correlation
 * (`errorType`, `errorMessage`, `isTerminal`) as Langfuse metadata so
 * terminal stream failures surface as filterable error spans in the
 * dashboard. The caller can either supply an explicit {@link
 * LangfuseErrorContext} override OR rely on {@link
 * classifyLangfuseError} to derive the fields from the thrown error.
 *
 * The call signature stays backward-compatible: existing call sites
 * that pass only `(generation, error)` continue to work and will
 * auto-classify the error.
 */
export function failLangfuseGeneration(
  generation: LangfuseGenerationClient | undefined,
  error: unknown,
  context?: LangfuseErrorContext
): void {
  if (!generation) {
    return;
  }
  const classified = classifyLangfuseError(error);
  const errorType = context?.errorType ?? classified.errorType;
  // Caller-supplied `errorMessage` wins (callers can inject their own
  // redacted copy via #2051); when it is omitted we fall back to the
  // auto-classified value which is already scrubbed by
  // `redactCredentialsFromString`. Caller input is re-scrubbed too so
  // the Langfuse-side safety net applies uniformly — a caller cannot
  // accidentally bypass it by passing a raw provider message.
  const errorMessage =
    context?.errorMessage !== undefined
      ? redactCredentialsFromString(context.errorMessage)
      : classified.errorMessage;
  const isTerminal = context?.isTerminal ?? classified.isTerminal;
  const metadata: Record<string, unknown> = {};
  if (errorType !== undefined) {
    metadata.errorType = errorType;
  }
  if (errorMessage !== undefined) {
    metadata.errorMessage = errorMessage;
  }
  if (isTerminal !== undefined) {
    metadata.isTerminal = isTerminal;
  }
  const fallbackMessage = error instanceof Error ? error.message : String(error);
  try {
    generation.end({
      level: 'ERROR',
      statusMessage: errorMessage ?? redactCredentialsFromString(fallbackMessage),
      metadata: Object.keys(metadata).length > 0 ? metadata : undefined,
    });
  } catch (err) {
    debugLangfuse(
      `generation.end(error) failed error=${err instanceof Error ? err.message : String(err)}`
    );
  }
}
