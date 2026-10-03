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
 * Record an error on a Langfuse generation and end it. Safe with
 * `generation === undefined`.
 */
export function failLangfuseGeneration(
  generation: LangfuseGenerationClient | undefined,
  error: unknown
): void {
  if (!generation) {
    return;
  }
  try {
    generation.end({
      level: 'ERROR',
      statusMessage: error instanceof Error ? error.message : String(error),
    });
  } catch (err) {
    debugLangfuse(
      `generation.end(error) failed error=${err instanceof Error ? err.message : String(err)}`
    );
  }
}
