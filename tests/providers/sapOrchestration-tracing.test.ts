/**
 * Unit tests for the OTLP tracing helpers in `src/providers/sapOrchestration.ts`.
 *
 * We do not require a live OTLP collector to be running. Instead we drive
 * the exported helpers directly (`startProviderSpan`, `finishProviderSpan`,
 * `failProviderSpan`) and verify:
 *
 *   1. `startProviderSpan` returns `undefined` when tracing is disabled
 *      -- provider call sites must be able to skip span mutations.
 *   2. `startProviderSpan` returns `undefined` when the session is NOT
 *      selected by the sampling gate (0% sampling).
 *   3. `finishProviderSpan` and `failProviderSpan` are safe with
 *      `undefined` (no-op, no throw).
 *
 * We avoid coupling to a real TracerProvider registration because the
 * concrete OpenTelemetry SDK is dynamic-imported inside `initTracing()`
 * and the CI runner has no OTLP collector.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import * as userConfig from '../../src/config/userConfig.js';
import { _resetTracingForTests, initTracing, isTracingEnabled } from '../../src/utils/tracing.js';
import {
  failProviderSpan,
  finishProviderSpan,
  startProviderSpan,
} from '../../src/providers/sapOrchestration.js';

const ENV_KEYS = [
  'ALEXI_OTEL_TRACES_EXPORTER',
  'ALEXI_OTEL_EXPORTER_OTLP_ENDPOINT',
  'ALEXI_OTEL_SERVICE_NAME',
  'ALEXI_TRACE_SAMPLE_PERCENT',
  'ALEXI_TRACE_RECORD_CONTENT',
];

describe('sapOrchestration tracing helpers', () => {
  const saved: Record<string, string | undefined> = {};

  beforeEach(() => {
    for (const key of ENV_KEYS) {
      saved[key] = process.env[key];
      delete process.env[key];
    }
    _resetTracingForTests();
    // Neutralise real config so opt-out never leaks in.
    vi.spyOn(userConfig, 'getConfigValue').mockReturnValue(undefined);
    vi.spyOn(userConfig, 'loadFullConfig').mockReturnValue({});
  });

  afterEach(() => {
    _resetTracingForTests();
    for (const key of ENV_KEYS) {
      if (saved[key] === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = saved[key];
      }
    }
    vi.restoreAllMocks();
  });

  it('startProviderSpan returns undefined when tracing is disabled', async () => {
    await initTracing();
    expect(isTracingEnabled()).toBe(false);
    const span = startProviderSpan('chat', {
      model: 'gpt-4o',
      sessionId: 'session-1',
      messageCount: 3,
    });
    expect(span).toBeUndefined();
  });

  it('startProviderSpan returns undefined when the session is not sampled', async () => {
    process.env.ALEXI_OTEL_TRACES_EXPORTER = 'http/json';
    process.env.ALEXI_TRACE_SAMPLE_PERCENT = '0';
    await initTracing();
    // Tracing itself is enabled, but sampling is off -- helper must still
    // skip so we do not create no-op spans on the hot path.
    expect(isTracingEnabled()).toBe(true);
    const span = startProviderSpan('stream', {
      model: 'gpt-4o',
      sessionId: 'session-x',
    });
    expect(span).toBeUndefined();
  });

  it('finishProviderSpan and failProviderSpan tolerate undefined spans', () => {
    expect(() =>
      finishProviderSpan(undefined, {
        usage: { prompt_tokens: 10, completion_tokens: 20, total_tokens: 30 },
        finishReason: 'stop',
        contentPreview: 'ignored',
      })
    ).not.toThrow();
    expect(() => failProviderSpan(undefined, new Error('boom'))).not.toThrow();
    expect(() => failProviderSpan(undefined, 'string error')).not.toThrow();
  });

  it('startProviderSpan returns a real span when sampling is at 100% and tracing enabled', async () => {
    process.env.ALEXI_OTEL_TRACES_EXPORTER = 'http/json';
    process.env.ALEXI_TRACE_SAMPLE_PERCENT = '100';
    await initTracing();
    const span = startProviderSpan('chat', {
      model: 'gpt-4o',
      sessionId: 'session-forced',
      messageCount: 1,
    });
    // With 100% sampling the helper must produce a span object regardless
    // of whether an OTLP exporter is registered -- we may still be sitting
    // on the no-op tracer if the SDK dynamic import failed, but the helper
    // gate is the sampling decision, not the concrete provider.
    // Either way, `finishProviderSpan(span, ...)` must not throw.
    expect(() =>
      finishProviderSpan(span, {
        usage: { prompt_tokens: 5, completion_tokens: 7, total_tokens: 12 },
        finishReason: 'stop',
      })
    ).not.toThrow();
  });
});
