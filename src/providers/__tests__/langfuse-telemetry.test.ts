/**
 * Unit tests for the BYOK Langfuse telemetry module (issue #1914).
 *
 * Mirrors the Cline PR #14787 test shape so the behaviour is pinned to
 * the same observable contract:
 * - Opt-in via `ALEXI_LANGFUSE_ALL_PROVIDERS` (truthy values enable).
 * - Direct exporter only; never OTLP relay.
 * - `LANGFUSE_TRACING_ENVIRONMENT` propagates on the config.
 * - Tag parsing (comma-separated, deduped, trimmed).
 * - Metadata parsing (JSON object OR `key=value,...`), with non-string
 *   values stringified and null/undefined dropped.
 * - Merge rules (env + call-site), with call-site metadata winning and
 *   empty attribute sets short-circuited.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// langfuse SDK is imported dynamically from inside the module under test.
// We mock it at the module level so no real HTTP client is constructed.
const langfuseConstructorSpy = vi.fn();
const traceSpy = vi.fn();
const shutdownAsyncSpy = vi.fn().mockResolvedValue(undefined);

vi.mock('langfuse', () => {
  class MockLangfuse {
    public sdkIntegration: string;
    public baseUrl: string;
    constructor(config: { sdkIntegration?: string; baseUrl: string }) {
      this.sdkIntegration = config.sdkIntegration ?? 'default';
      this.baseUrl = config.baseUrl;
      langfuseConstructorSpy(config);
    }
    trace(args: unknown): unknown {
      traceSpy(args);
      return {
        id: 'trace-id',
        generation: (): unknown => ({
          end: (): void => undefined,
        }),
      };
    }
    shutdownAsync(): Promise<void> {
      return shutdownAsyncSpy();
    }
  }
  return { Langfuse: MockLangfuse };
});

import {
  _resetLangfuseTelemetryForTests,
  finishLangfuseGeneration,
  failLangfuseGeneration,
  isEnvTruthy,
  LANGFUSE_SDK_INTEGRATION,
  readDirectLangfuseTelemetryConfig,
  readEnvTraceAttributes,
  resolveAiSdkTelemetry,
  startLangfuseGeneration,
  startLangfuseTrace,
  withLangfuseTraceAttributes,
} from '../langfuse-telemetry.js';

const BYOK_MODEL = 'byok-custom-model';

function stubEnv(name: string, value: string | undefined): void {
  if (value === undefined) {
    delete process.env[name];
  } else {
    process.env[name] = value;
  }
}

describe('langfuse-telemetry', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    // Clean every relevant var so individual tests set exactly what they need.
    for (const name of [
      'ALEXI_LANGFUSE_ALL_PROVIDERS',
      'ALEXI_LANGFUSE_TAGS',
      'ALEXI_LANGFUSE_METADATA',
      'LANGFUSE_TRACING_ENVIRONMENT',
      'LANGFUSE_BASE_URL',
      'LANGFUSE_PUBLIC_KEY',
      'LANGFUSE_SECRET_KEY',
      'ALEXI_DEBUG_LANGFUSE',
    ]) {
      delete process.env[name];
    }
    langfuseConstructorSpy.mockClear();
    traceSpy.mockClear();
    shutdownAsyncSpy.mockClear();
    _resetLangfuseTelemetryForTests();
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  // --------------------------------------------------------------------------
  // isEnvTruthy
  // --------------------------------------------------------------------------
  describe('isEnvTruthy', () => {
    it('returns false for undefined, empty, 0, false, no, off', () => {
      expect(isEnvTruthy(undefined)).toBe(false);
      expect(isEnvTruthy('')).toBe(false);
      expect(isEnvTruthy(' ')).toBe(false);
      expect(isEnvTruthy('0')).toBe(false);
      expect(isEnvTruthy('false')).toBe(false);
      expect(isEnvTruthy('FALSE')).toBe(false);
      expect(isEnvTruthy('no')).toBe(false);
      expect(isEnvTruthy('off')).toBe(false);
    });

    it('returns true for 1, true, yes, on, or any other non-empty string', () => {
      expect(isEnvTruthy('1')).toBe(true);
      expect(isEnvTruthy('true')).toBe(true);
      expect(isEnvTruthy('yes')).toBe(true);
      expect(isEnvTruthy('on')).toBe(true);
      expect(isEnvTruthy('anything')).toBe(true);
    });
  });

  // --------------------------------------------------------------------------
  // readDirectLangfuseTelemetryConfig
  // --------------------------------------------------------------------------
  describe('readDirectLangfuseTelemetryConfig', () => {
    it('returns undefined when any required credential is missing', () => {
      stubEnv('LANGFUSE_BASE_URL', 'https://cloud.langfuse.com');
      stubEnv('LANGFUSE_PUBLIC_KEY', 'pk-x');
      // SECRET_KEY intentionally absent
      expect(readDirectLangfuseTelemetryConfig()).toBeUndefined();
    });

    it('returns the credential set when all three are present (no environment)', () => {
      stubEnv('LANGFUSE_BASE_URL', 'https://cloud.langfuse.com');
      stubEnv('LANGFUSE_PUBLIC_KEY', 'pk-x');
      stubEnv('LANGFUSE_SECRET_KEY', 'sk-x');
      expect(readDirectLangfuseTelemetryConfig()).toEqual({
        baseUrl: 'https://cloud.langfuse.com',
        publicKey: 'pk-x',
        secretKey: 'sk-x',
      });
    });

    it('attaches LANGFUSE_TRACING_ENVIRONMENT when set', () => {
      stubEnv('LANGFUSE_BASE_URL', 'https://cloud.langfuse.com');
      stubEnv('LANGFUSE_PUBLIC_KEY', 'pk-x');
      stubEnv('LANGFUSE_SECRET_KEY', 'sk-x');
      stubEnv('LANGFUSE_TRACING_ENVIRONMENT', 'benchmark');
      expect(readDirectLangfuseTelemetryConfig()).toEqual({
        baseUrl: 'https://cloud.langfuse.com',
        publicKey: 'pk-x',
        secretKey: 'sk-x',
        environment: 'benchmark',
      });
    });
  });

  // --------------------------------------------------------------------------
  // resolveAiSdkTelemetry (opt-in + relay bypass)
  // --------------------------------------------------------------------------
  describe('resolveAiSdkTelemetry', () => {
    function setCreds(): void {
      stubEnv('LANGFUSE_BASE_URL', 'https://cloud.langfuse.com');
      stubEnv('LANGFUSE_PUBLIC_KEY', 'pk-x');
      stubEnv('LANGFUSE_SECRET_KEY', 'sk-x');
    }

    it('stays disabled without the ALEXI_LANGFUSE_ALL_PROVIDERS opt-in', async () => {
      setCreds();
      const decision = await resolveAiSdkTelemetry(BYOK_MODEL);
      expect(decision.isEnabled).toBe(false);
      expect(langfuseConstructorSpy).not.toHaveBeenCalled();
    });

    it('stays disabled when credentials are missing even with the opt-in', async () => {
      stubEnv('ALEXI_LANGFUSE_ALL_PROVIDERS', '1');
      const decision = await resolveAiSdkTelemetry(BYOK_MODEL);
      expect(decision.isEnabled).toBe(false);
      expect(langfuseConstructorSpy).not.toHaveBeenCalled();
    });

    it('enables tracing with opt-in + credentials and uses the direct exporter', async () => {
      stubEnv('ALEXI_LANGFUSE_ALL_PROVIDERS', '1');
      setCreds();
      const decision = await resolveAiSdkTelemetry(BYOK_MODEL);
      expect(decision.isEnabled).toBe(true);
      expect(langfuseConstructorSpy).toHaveBeenCalledTimes(1);
      expect(langfuseConstructorSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          baseUrl: 'https://cloud.langfuse.com',
          publicKey: 'pk-x',
          secretKey: 'sk-x',
          sdkIntegration: LANGFUSE_SDK_INTEGRATION,
        })
      );
    });

    it('ignores falsy opt-in values', async () => {
      setCreds();
      stubEnv('ALEXI_LANGFUSE_ALL_PROVIDERS', '0');
      await expect(resolveAiSdkTelemetry(BYOK_MODEL)).resolves.toEqual({ isEnabled: false });
      stubEnv('ALEXI_LANGFUSE_ALL_PROVIDERS', 'false');
      await expect(resolveAiSdkTelemetry(BYOK_MODEL)).resolves.toEqual({ isEnabled: false });
    });

    it('passes LANGFUSE_TRACING_ENVIRONMENT to the client', async () => {
      stubEnv('ALEXI_LANGFUSE_ALL_PROVIDERS', '1');
      setCreds();
      stubEnv('LANGFUSE_TRACING_ENVIRONMENT', 'benchmark');
      const decision = await resolveAiSdkTelemetry(BYOK_MODEL);
      expect(decision.isEnabled).toBe(true);
      if (decision.isEnabled) {
        expect(decision.config.environment).toBe('benchmark');
      }
    });

    it('reuses a cached client across calls for the same credentials', async () => {
      stubEnv('ALEXI_LANGFUSE_ALL_PROVIDERS', '1');
      setCreds();
      await resolveAiSdkTelemetry(BYOK_MODEL);
      await resolveAiSdkTelemetry(BYOK_MODEL);
      await resolveAiSdkTelemetry('other-model');
      expect(langfuseConstructorSpy).toHaveBeenCalledTimes(1);
    });

    it('never uses the OTLP relay (direct exporter stamps alexi-langfuse-direct)', async () => {
      stubEnv('ALEXI_LANGFUSE_ALL_PROVIDERS', '1');
      setCreds();
      const decision = await resolveAiSdkTelemetry(BYOK_MODEL);
      expect(decision.isEnabled).toBe(true);
      // The ONLY sdkIntegration this module emits is the direct one; the
      // relay path (`src/utils/tracing.ts`) is a different OTLP exporter
      // and is not touched here.
      expect(langfuseConstructorSpy).toHaveBeenCalledWith(
        expect.objectContaining({ sdkIntegration: LANGFUSE_SDK_INTEGRATION })
      );
    });
  });

  // --------------------------------------------------------------------------
  // readEnvTraceAttributes
  // --------------------------------------------------------------------------
  describe('readEnvTraceAttributes', () => {
    it('reads comma-separated tags and key=value metadata, deduped and trimmed', () => {
      stubEnv('ALEXI_LANGFUSE_TAGS', ' benchmark-run-1, nightly ,benchmark-run-1,');
      stubEnv('ALEXI_LANGFUSE_METADATA', 'suite=swe-bench, commit=abc123 ,bad,=x');
      expect(readEnvTraceAttributes()).toEqual({
        tags: ['benchmark-run-1', 'nightly'],
        metadata: { suite: 'swe-bench', commit: 'abc123' },
      });
    });

    it('reads JSON metadata and stringifies non-string values, drops null/undefined', () => {
      stubEnv(
        'ALEXI_LANGFUSE_METADATA',
        JSON.stringify({ suite: 'swe-bench', attempt: 2, skip: null })
      );
      expect(readEnvTraceAttributes()).toEqual({
        metadata: { suite: 'swe-bench', attempt: '2' },
      });
    });

    it('returns an empty attribute set for malformed JSON metadata', () => {
      stubEnv('ALEXI_LANGFUSE_METADATA', '{not json');
      expect(readEnvTraceAttributes()).toEqual({});
    });

    it('returns an empty attribute set when neither env var is set', () => {
      expect(readEnvTraceAttributes()).toEqual({});
    });
  });

  // --------------------------------------------------------------------------
  // withLangfuseTraceAttributes (merge logic)
  // --------------------------------------------------------------------------
  describe('withLangfuseTraceAttributes', () => {
    it('merges env tags and metadata under the call-site attributes (call-site wins)', () => {
      stubEnv('ALEXI_LANGFUSE_TAGS', 'benchmark-run-1');
      stubEnv('ALEXI_LANGFUSE_METADATA', 'suite=swe-bench,runId=env-run');
      const merged = withLangfuseTraceAttributes({
        sessionId: 'session-1',
        tags: ['cli', 'benchmark-run-1'],
        metadata: { runId: 'run-1' },
      });
      expect(merged).toEqual({
        sessionId: 'session-1',
        tags: ['benchmark-run-1', 'cli'],
        metadata: { suite: 'swe-bench', runId: 'run-1' },
      });
    });

    it('propagates env-only attributes when the call supplies none', () => {
      stubEnv('ALEXI_LANGFUSE_TAGS', 'benchmark-run-1');
      const merged = withLangfuseTraceAttributes({});
      expect(merged).toEqual({ tags: ['benchmark-run-1'] });
    });

    it('returns undefined when nothing is set on either side', () => {
      expect(withLangfuseTraceAttributes({})).toBeUndefined();
      // Empty metadata object MUST NOT trigger propagation on its own.
      expect(withLangfuseTraceAttributes({ metadata: {} })).toBeUndefined();
    });
  });

  // --------------------------------------------------------------------------
  // startLangfuseTrace / startLangfuseGeneration / finish / fail
  // --------------------------------------------------------------------------
  describe('span lifecycle helpers', () => {
    async function enabledDecision(): Promise<ReturnType<typeof resolveAiSdkTelemetry>> {
      stubEnv('ALEXI_LANGFUSE_ALL_PROVIDERS', '1');
      stubEnv('LANGFUSE_BASE_URL', 'https://cloud.langfuse.com');
      stubEnv('LANGFUSE_PUBLIC_KEY', 'pk-x');
      stubEnv('LANGFUSE_SECRET_KEY', 'sk-x');
      return resolveAiSdkTelemetry(BYOK_MODEL);
    }

    it('startLangfuseTrace returns undefined when disabled', () => {
      const trace = startLangfuseTrace({ isEnabled: false }, { name: 'test' });
      expect(trace).toBeUndefined();
    });

    it('startLangfuseTrace emits a trace with merged env attributes', async () => {
      stubEnv('ALEXI_LANGFUSE_TAGS', 'env-tag');
      const decision = await enabledDecision();
      const trace = startLangfuseTrace(decision, {
        name: 'alexi.chat',
        sessionId: 'session-xyz',
        tags: ['call-tag'],
        metadata: { k: 'v' },
      });
      expect(trace).toBeDefined();
      expect(traceSpy).toHaveBeenCalledTimes(1);
      expect(traceSpy).toHaveBeenCalledWith({
        name: 'alexi.chat',
        sessionId: 'session-xyz',
        userId: undefined,
        tags: ['env-tag', 'call-tag'],
        metadata: { k: 'v' },
      });
    });

    it('startLangfuseGeneration/finish/fail are no-ops when the trace is undefined', () => {
      expect(startLangfuseGeneration(undefined, { name: 'n', model: 'm' })).toBeUndefined();
      expect(() => finishLangfuseGeneration(undefined, {})).not.toThrow();
      expect(() => failLangfuseGeneration(undefined, new Error('x'))).not.toThrow();
    });
  });
});
