/**
 * Unit tests for `src/utils/tracing.ts`.
 *
 * Contract this test suite enforces:
 *
 * 1. Tracing is DISABLED unless `ALEXI_OTEL_TRACES_EXPORTER` is set to a
 *    recognised protocol (grpc / http/json / http/protobuf).
 * 2. The user's `telemetryOptOut` setting overrides the env-based enable,
 *    and any error reading the config file MUST fail closed (disable).
 * 3. Session sampling is deterministic in `sessionId` and honours the
 *    documented boundary cases (`0` never samples, `100` always samples,
 *    values in-between are hash-bucketed).
 * 4. `initTracing()` is idempotent and `shutdownTracing()` never throws.
 * 5. `getTracer()` returns a callable Tracer even when tracing is disabled
 *    (it falls back to the OTel no-op tracer).
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import * as userConfig from '../../src/config/userConfig.js';
import {
  _resetTracingForTests,
  fnv1a,
  getTracer,
  getTracingConfig,
  initTracing,
  isTelemetryOptOut,
  isTracingEnabled,
  resolveTracingConfig,
  shouldSampleSession,
  shutdownTracing,
} from '../../src/utils/tracing.js';

/**
 * Fully isolate every test from the runner's real environment:
 *   - point HOME at a fresh temp dir so `~/.alexi/config.json` reads never
 *     pick up an operator's actual settings;
 *   - clear all ALEXI_* / OTEL_* env vars this module reads.
 *
 * The `beforeEach` sets, the `afterEach` restores. This pattern is copied
 * from other tests under `tests/utils/*` (tokenStorage, filesystem).
 */
const ENV_KEYS = [
  'ALEXI_OTEL_TRACES_EXPORTER',
  'ALEXI_OTEL_EXPORTER_OTLP_ENDPOINT',
  'ALEXI_OTEL_SERVICE_NAME',
  'ALEXI_TRACE_SAMPLE_PERCENT',
  'ALEXI_TRACE_RECORD_CONTENT',
];

describe('tracing', () => {
  let tmpHome: string;
  const savedEnv: Record<string, string | undefined> = {};

  beforeEach(() => {
    tmpHome = fs.mkdtempSync(path.join(os.tmpdir(), 'alexi-tracing-test-'));
    savedEnv.HOME = process.env.HOME;
    process.env.HOME = tmpHome;
    for (const key of ENV_KEYS) {
      savedEnv[key] = process.env[key];
      delete process.env[key];
    }
    _resetTracingForTests();
  });

  afterEach(async () => {
    await shutdownTracing();
    _resetTracingForTests();
    process.env.HOME = savedEnv.HOME;
    for (const key of ENV_KEYS) {
      if (savedEnv[key] === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = savedEnv[key];
      }
    }
    try {
      fs.rmSync(tmpHome, { recursive: true, force: true });
    } catch {
      // best-effort cleanup
    }
    vi.restoreAllMocks();
  });

  describe('resolveTracingConfig', () => {
    it('returns disabled when ALEXI_OTEL_TRACES_EXPORTER is unset', () => {
      const cfg = resolveTracingConfig();
      expect(cfg.enabled).toBe(false);
      expect(cfg.disabledReason).toMatch(/not set/);
    });

    it('returns disabled with reason for an invalid exporter value', () => {
      process.env.ALEXI_OTEL_TRACES_EXPORTER = 'not-a-protocol';
      const cfg = resolveTracingConfig();
      expect(cfg.enabled).toBe(false);
      expect(cfg.disabledReason).toMatch(/invalid/);
    });

    it('enables tracing when a valid grpc exporter is set', () => {
      process.env.ALEXI_OTEL_TRACES_EXPORTER = 'grpc';
      const cfg = resolveTracingConfig();
      expect(cfg.enabled).toBe(true);
      expect(cfg.protocol).toBe('grpc');
      // Default grpc endpoint per the issue spec.
      expect(cfg.endpoint).toBe('http://localhost:4317');
      expect(cfg.serviceName).toBe('alexi');
    });

    it('uses the http default endpoint for the http/json protocol', () => {
      process.env.ALEXI_OTEL_TRACES_EXPORTER = 'http/json';
      const cfg = resolveTracingConfig();
      expect(cfg.enabled).toBe(true);
      expect(cfg.endpoint).toBe('http://localhost:4318');
    });

    it('honours ALEXI_OTEL_EXPORTER_OTLP_ENDPOINT override', () => {
      process.env.ALEXI_OTEL_TRACES_EXPORTER = 'grpc';
      process.env.ALEXI_OTEL_EXPORTER_OTLP_ENDPOINT = 'http://collector.internal:4317';
      const cfg = resolveTracingConfig();
      expect(cfg.endpoint).toBe('http://collector.internal:4317');
    });

    it('honours ALEXI_OTEL_SERVICE_NAME override', () => {
      process.env.ALEXI_OTEL_TRACES_EXPORTER = 'grpc';
      process.env.ALEXI_OTEL_SERVICE_NAME = 'alexi-worker';
      const cfg = resolveTracingConfig();
      expect(cfg.serviceName).toBe('alexi-worker');
    });

    it('clamps ALEXI_TRACE_SAMPLE_PERCENT to [0, 100]', () => {
      process.env.ALEXI_OTEL_TRACES_EXPORTER = 'grpc';
      process.env.ALEXI_TRACE_SAMPLE_PERCENT = '250';
      expect(resolveTracingConfig().samplePercent).toBe(100);
      process.env.ALEXI_TRACE_SAMPLE_PERCENT = '-5';
      expect(resolveTracingConfig().samplePercent).toBe(0);
      process.env.ALEXI_TRACE_SAMPLE_PERCENT = 'not-a-number';
      expect(resolveTracingConfig().samplePercent).toBe(0);
    });

    it('reads ALEXI_TRACE_RECORD_CONTENT only when set to the literal "true"', () => {
      process.env.ALEXI_OTEL_TRACES_EXPORTER = 'grpc';
      expect(resolveTracingConfig().recordContent).toBe(false);
      process.env.ALEXI_TRACE_RECORD_CONTENT = 'true';
      expect(resolveTracingConfig().recordContent).toBe(true);
      // Truthy-but-not-"true" values must NOT enable content recording -- this
      // is a privacy default we deliberately keep strict.
      process.env.ALEXI_TRACE_RECORD_CONTENT = '1';
      expect(resolveTracingConfig().recordContent).toBe(false);
    });
  });

  describe('opt-out handling', () => {
    // `userConfig` caches its config paths at import time (`CONFIG_DIR` is
    // computed from `os.homedir()` when the module first loads). To exercise
    // the opt-out branches without touching the operator's real config we
    // stub the two accessor functions `isTelemetryOptOut` depends on --
    // `getConfigValue` for the fast path and `loadFullConfig` for the
    // managed-preference fallback.

    it('disables tracing when telemetryOptOut is true in the user config', () => {
      vi.spyOn(userConfig, 'getConfigValue').mockImplementation((k: string) =>
        k === 'telemetryOptOut' ? true : undefined
      );
      vi.spyOn(userConfig, 'loadFullConfig').mockReturnValue({ telemetryOptOut: true });
      process.env.ALEXI_OTEL_TRACES_EXPORTER = 'grpc';
      const cfg = resolveTracingConfig();
      expect(cfg.enabled).toBe(false);
      expect(cfg.disabledReason).toBe('telemetry opt-out');
    });

    it('disables tracing when telemetryEnabled is false in the user config', () => {
      vi.spyOn(userConfig, 'getConfigValue').mockReturnValue(undefined);
      vi.spyOn(userConfig, 'loadFullConfig').mockReturnValue({ telemetryEnabled: false });
      process.env.ALEXI_OTEL_TRACES_EXPORTER = 'grpc';
      const cfg = resolveTracingConfig();
      expect(cfg.enabled).toBe(false);
      expect(cfg.disabledReason).toBe('telemetry opt-out');
    });

    it('does not disable tracing when telemetryOptOut is missing / false', () => {
      vi.spyOn(userConfig, 'getConfigValue').mockReturnValue(undefined);
      vi.spyOn(userConfig, 'loadFullConfig').mockReturnValue({ telemetryOptOut: false });
      process.env.ALEXI_OTEL_TRACES_EXPORTER = 'grpc';
      const cfg = resolveTracingConfig();
      expect(cfg.enabled).toBe(true);
      expect(isTelemetryOptOut()).toBe(false);
    });

    it('fails closed when config reads throw an unexpected error', () => {
      // The module under test wraps its `getConfigValue` call in `try/catch`
      // and returns `true` (opt-out) when ANY exception escapes. This is
      // deliberate: a corrupt config must not silently enable tracing.
      const spy = vi.spyOn(userConfig, 'getConfigValue').mockImplementation(() => {
        throw new Error('simulated corruption');
      });
      expect(isTelemetryOptOut()).toBe(true);
      spy.mockRestore();
    });
  });

  describe('shouldSampleSession', () => {
    it('returns false when samplePercent <= 0', () => {
      expect(shouldSampleSession('session-abc', 0)).toBe(false);
      expect(shouldSampleSession('session-abc', -50)).toBe(false);
    });

    it('returns true when samplePercent >= 100', () => {
      expect(shouldSampleSession('session-abc', 100)).toBe(true);
      expect(shouldSampleSession('session-abc', 500)).toBe(true);
    });

    it('is deterministic for a given session id and percent', () => {
      const a = shouldSampleSession('session-abc', 50);
      const b = shouldSampleSession('session-abc', 50);
      expect(a).toBe(b);
    });

    it('splits sessions approximately by the sampling percent (statistical)', () => {
      const total = 2000;
      let sampled = 0;
      for (let i = 0; i < total; i++) {
        if (shouldSampleSession(`session-${i}`, 50)) {
          sampled++;
        }
      }
      // FNV-1a of numeric ids should distribute roughly uniformly; give a
      // generous +/- 10% window so the test does not flake.
      expect(sampled).toBeGreaterThan(total * 0.4);
      expect(sampled).toBeLessThan(total * 0.6);
    });
  });

  describe('fnv1a', () => {
    it('produces a stable 32-bit unsigned integer', () => {
      const h = fnv1a('hello');
      expect(Number.isInteger(h)).toBe(true);
      expect(h).toBeGreaterThanOrEqual(0);
      expect(h).toBeLessThanOrEqual(0xffffffff);
    });

    it('differs for different inputs', () => {
      expect(fnv1a('a')).not.toBe(fnv1a('b'));
    });

    it('returns 0x811c9dc5 for the empty string (FNV offset basis)', () => {
      expect(fnv1a('')).toBe(0x811c9dc5);
    });
  });

  describe('initTracing / shutdownTracing', () => {
    it('is a no-op when tracing is disabled (no env var)', async () => {
      const cfg = await initTracing();
      expect(cfg.enabled).toBe(false);
      expect(isTracingEnabled()).toBe(false);
      // Idempotent: second call returns the same cached decision.
      const cfg2 = await initTracing();
      expect(cfg2).toBe(cfg);
    });

    it('shutdownTracing never throws when tracing was disabled', async () => {
      await expect(shutdownTracing()).resolves.toBeUndefined();
    });

    it('records the resolved config after init', async () => {
      process.env.ALEXI_OTEL_TRACES_EXPORTER = 'http/json';
      process.env.ALEXI_TRACE_SAMPLE_PERCENT = '25';
      const cfg = await initTracing();
      expect(cfg.enabled).toBe(true);
      expect(getTracingConfig()?.samplePercent).toBe(25);
      // Follow-up init is a no-op returning the cached decision.
      const cfg2 = await initTracing();
      expect(cfg2).toBe(cfg);
      await shutdownTracing();
      // After shutdown, isTracingEnabled still reflects the last resolved
      // config (a shutdown does not "un-resolve" env). This is intentional:
      // shutdown is for flushing on exit, not for toggling at runtime.
      expect(isTracingEnabled()).toBe(true);
    });
  });

  describe('getTracer', () => {
    it('returns a Tracer object with startSpan even when tracing is disabled', () => {
      const tracer = getTracer('test');
      expect(typeof tracer.startSpan).toBe('function');
      const span = tracer.startSpan('noop');
      // No-op spans still expose the standard span API surface.
      expect(typeof span.end).toBe('function');
      span.end();
    });
  });
});
