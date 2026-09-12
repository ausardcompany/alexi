/**
 * OpenTelemetry Tracing - Privacy-preserving observability for provider calls
 *
 * Emits AI SDK spans (model, tokens, timings, errors) via OTLP exporter when
 * `ALEXI_OTEL_TRACES_EXPORTER` is configured. Metadata-only by default;
 * prompt/completion content is emitted only when `ALEXI_TRACE_RECORD_CONTENT=true`.
 *
 * Contract:
 * - Tracing is DISABLED unless `ALEXI_OTEL_TRACES_EXPORTER` is set to
 *   `grpc`, `http/json`, or `http/protobuf`.
 * - Tracing is DISABLED when the user has opted out of telemetry
 *   (`telemetryOptOut` in `~/.alexi/config.json`, or `disableTelemetry`
 *   in macOS managed preferences).
 * - If the config file cannot be read/parsed, we FAIL CLOSED and disable
 *   tracing rather than assume opt-in.
 * - Span emission is gated by session-deterministic sampling:
 *   `ALEXI_TRACE_SAMPLE_PERCENT` (0-100, default 0 = off). Whole sessions
 *   sample together via a deterministic hash of the session id.
 *
 * Reference: Cline PR #13974 (feat(llms): sampled cline-provider AI SDK
 * tracing via the host OTLP exporter).
 */

import type { Tracer, TracerProvider } from '@opentelemetry/api';
import { trace } from '@opentelemetry/api';

import { env } from '../config/env.js';
import { getConfigValue, loadFullConfig } from '../config/userConfig.js';

// ============================================================================
// Types
// ============================================================================

/** Supported OTLP exporter protocols (matches Cline). */
export type OtelExporterProtocol = 'grpc' | 'http/json' | 'http/protobuf';

/**
 * Result of resolving the current tracing configuration from env + config.
 * `enabled: false` means we will NOT register a TracerProvider (or the
 * registered provider is a no-op).
 */
export interface TracingConfig {
  enabled: boolean;
  protocol?: OtelExporterProtocol;
  endpoint?: string;
  serviceName: string;
  samplePercent: number;
  recordContent: boolean;
  /** Reason we disabled tracing (for logs/debug). Set when `enabled === false`. */
  disabledReason?: string;
}

// ============================================================================
// Environment / config resolution
// ============================================================================

const DEFAULT_GRPC_ENDPOINT = 'http://localhost:4317';
const DEFAULT_HTTP_ENDPOINT = 'http://localhost:4318';
const DEFAULT_SERVICE_NAME = 'alexi';

/**
 * Parse the exporter protocol from the environment. Returns `undefined`
 * when tracing is not requested at all. Returns `null` when the user set
 * an INVALID protocol -- treated as "disabled with reason" so a misconfigured
 * operator sees the setting is off rather than silently defaulting.
 */
function readExporterProtocol(): OtelExporterProtocol | undefined | null {
  const raw = env('ALEXI_OTEL_TRACES_EXPORTER');
  if (!raw) {
    return undefined;
  }
  if (raw === 'grpc' || raw === 'http/json' || raw === 'http/protobuf') {
    return raw;
  }
  return null;
}

/**
 * Read `telemetryOptOut` (or `disableTelemetry`) from the user's global
 * config. FAILS CLOSED: on ANY error (missing file is fine, but corrupt
 * JSON or unexpected exception must disable tracing).
 *
 * Returns `true` when the user has opted out.
 */
export function isTelemetryOptOut(): boolean {
  try {
    // `getConfigValue` already tolerates missing files and returns `undefined`.
    const optOut = getConfigValue('telemetryOptOut');
    if (optOut === true) {
      return true;
    }
    // Managed preference (macOS): `disableTelemetry: true` maps to
    // `telemetryEnabled: false` in `loadFullConfig`. Honour both keys.
    const config = loadFullConfig();
    if (config.telemetryEnabled === false) {
      return true;
    }
    if (config.telemetryOptOut === true) {
      return true;
    }
    return false;
  } catch {
    // Fail closed: any exception (corrupt file, permission error) disables
    // tracing rather than assuming implicit consent.
    return true;
  }
}

/**
 * Parse `ALEXI_TRACE_SAMPLE_PERCENT` (0-100). Invalid or missing values
 * return `0` (sampling disabled). Values outside `[0, 100]` are clamped.
 */
function readSamplePercent(): number {
  const raw = env('ALEXI_TRACE_SAMPLE_PERCENT');
  if (!raw) {
    return 0;
  }
  const parsed = Number.parseFloat(raw);
  if (!Number.isFinite(parsed)) {
    return 0;
  }
  if (parsed <= 0) {
    return 0;
  }
  if (parsed >= 100) {
    return 100;
  }
  return parsed;
}

/**
 * Resolve the current tracing configuration from environment variables and
 * user config. Pure function, safe to call at any time; does not touch any
 * global state.
 */
export function resolveTracingConfig(): TracingConfig {
  const serviceName = env('ALEXI_OTEL_SERVICE_NAME') ?? DEFAULT_SERVICE_NAME;
  const samplePercent = readSamplePercent();
  const recordContent = env('ALEXI_TRACE_RECORD_CONTENT') === 'true';

  const protocol = readExporterProtocol();
  if (protocol === undefined) {
    return {
      enabled: false,
      serviceName,
      samplePercent,
      recordContent,
      disabledReason: 'ALEXI_OTEL_TRACES_EXPORTER not set',
    };
  }
  if (protocol === null) {
    return {
      enabled: false,
      serviceName,
      samplePercent,
      recordContent,
      disabledReason: 'ALEXI_OTEL_TRACES_EXPORTER value invalid',
    };
  }

  if (isTelemetryOptOut()) {
    return {
      enabled: false,
      serviceName,
      samplePercent,
      recordContent,
      disabledReason: 'telemetry opt-out',
    };
  }

  const endpoint =
    env('ALEXI_OTEL_EXPORTER_OTLP_ENDPOINT') ??
    (protocol === 'grpc' ? DEFAULT_GRPC_ENDPOINT : DEFAULT_HTTP_ENDPOINT);

  return {
    enabled: true,
    protocol,
    endpoint,
    serviceName,
    samplePercent,
    recordContent,
  };
}

// ============================================================================
// Sampling
// ============================================================================

/**
 * FNV-1a 32-bit hash. Deterministic, dependency-free, and good enough for
 * sample-bucketing. Not cryptographic.
 */
export function fnv1a(input: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    // FNV prime 16777619. Force to uint32.
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash >>> 0;
}

/**
 * Decide whether to sample a given session for tracing. Deterministic per
 * `sessionId` so all spans within one chat session emit or all suppress.
 *
 * `samplePercent === 0` always returns `false`. `samplePercent >= 100`
 * always returns `true`. Values in-between compare `hash(sessionId) % 100`
 * against `samplePercent`.
 */
export function shouldSampleSession(sessionId: string, samplePercent: number): boolean {
  if (samplePercent <= 0) {
    return false;
  }
  if (samplePercent >= 100) {
    return true;
  }
  const bucket = fnv1a(sessionId) % 100;
  return bucket < samplePercent;
}

// ============================================================================
// TracerProvider registration
// ============================================================================

let _registeredProvider: TracerProvider | undefined;
let registeredConfig: TracingConfig | undefined;
// `shutdown()` is defined on the concrete NodeTracerProvider but not on the
// public `TracerProvider` interface. We capture a reference to it separately
// so callers can flush pending spans on shutdown without a type cast at each
// call site.
let providerShutdown: (() => Promise<void>) | undefined;

/**
 * Initialise the global OpenTelemetry TracerProvider based on the resolved
 * tracing config. Idempotent: calling twice is a no-op. When tracing is
 * disabled by env/config, this function returns immediately without
 * touching the OTel API.
 *
 * Dynamic imports keep the OpenTelemetry SDK out of the hot boot path when
 * tracing is disabled (the default). The SDK adds ~40ms of import time on
 * a cold start on Node 22.
 */
export async function initTracing(): Promise<TracingConfig> {
  if (registeredConfig) {
    return registeredConfig;
  }

  const config = resolveTracingConfig();
  registeredConfig = config;
  if (!config.enabled || !config.protocol || !config.endpoint) {
    return config;
  }

  try {
    const [{ NodeTracerProvider, BatchSpanProcessor }, { resourceFromAttributes }, semconv] =
      await Promise.all([
        import('@opentelemetry/sdk-trace-node'),
        import('@opentelemetry/resources'),
        import('@opentelemetry/semantic-conventions'),
      ]);

    let exporter;
    if (config.protocol === 'grpc') {
      const mod = await import('@opentelemetry/exporter-trace-otlp-grpc');
      exporter = new mod.OTLPTraceExporter({ url: config.endpoint });
    } else if (config.protocol === 'http/protobuf') {
      const mod = await import('@opentelemetry/exporter-trace-otlp-proto');
      exporter = new mod.OTLPTraceExporter({ url: config.endpoint });
    } else {
      const mod = await import('@opentelemetry/exporter-trace-otlp-http');
      exporter = new mod.OTLPTraceExporter({ url: config.endpoint });
    }

    const serviceNameAttr =
      (semconv as { ATTR_SERVICE_NAME?: string }).ATTR_SERVICE_NAME ?? 'service.name';
    const resource = resourceFromAttributes({
      [serviceNameAttr]: config.serviceName,
    });

    const provider = new NodeTracerProvider({
      resource,
      spanProcessors: [new BatchSpanProcessor(exporter)],
    });
    provider.register();
    _registeredProvider = provider;
    providerShutdown = () => provider.shutdown();
    return config;
  } catch {
    // Failure to register (bad endpoint, missing peer dep, etc.) disables
    // tracing for the rest of the process rather than crashing the CLI.
    registeredConfig = {
      ...config,
      enabled: false,
      disabledReason: 'tracer provider registration failed',
    };
    return registeredConfig;
  }
}

/**
 * Best-effort synchronous check for whether tracing has been enabled.
 * Returns the cached decision from the last `initTracing()` call, or
 * `false` when tracing has not been initialised yet.
 */
export function isTracingEnabled(): boolean {
  return registeredConfig?.enabled === true;
}

/**
 * Return the current tracing config snapshot. Useful for tests and for
 * callers that need to know sampling / recordContent without re-parsing
 * env vars themselves.
 */
export function getTracingConfig(): TracingConfig | undefined {
  return registeredConfig;
}

/**
 * Return an OpenTelemetry Tracer for the given instrumentation name.
 * When tracing is disabled, this returns the no-op tracer that the OTel
 * API ships by default so callers can call `startSpan()` unconditionally.
 */
export function getTracer(name = 'alexi'): Tracer {
  return trace.getTracer(name);
}

/**
 * Flush pending spans and shut down the registered TracerProvider. Safe to
 * call multiple times; safe to call when tracing was never enabled. Never
 * throws -- exceptions are swallowed so shutdown handlers stay simple.
 */
export async function shutdownTracing(): Promise<void> {
  if (!providerShutdown) {
    return;
  }
  const fn = providerShutdown;
  providerShutdown = undefined;
  _registeredProvider = undefined;
  try {
    await fn();
  } catch {
    // Best-effort flush; a broken exporter must not block process exit.
  }
}

/**
 * Test-only reset. Clears cached configuration and any registered provider.
 * Not exported from the package barrel; used exclusively by unit tests.
 */
export function _resetTracingForTests(): void {
  _registeredProvider = undefined;
  registeredConfig = undefined;
  providerShutdown = undefined;
}
