/**
 * Tests for the route auto-disable feature in src/core/router.ts.
 *
 * Covers:
 *  - N consecutive permanent (4xx / model_not_found) failures disable a route.
 *  - Transient (5xx) failures are NOT classified as permanent and do not count.
 *  - A success outcome between two failures resets the counter.
 *  - When all candidates are disabled, routePrompt falls back to
 *    preferences.fallbackModel with confidence 0.1 (does NOT throw).
 *  - The yellow warning is printed exactly once on first disable.
 *  - resetRouteFailures() re-enables a disabled route.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { RoutingConfig } from '../../src/config/routingConfig.js';
import type { ModelCapability } from '../../src/core/router.js';

vi.mock('../../src/config/routingConfig.js', () => ({
  loadRoutingConfig: vi.fn(),
  findMatchingRule: vi.fn(),
  evaluateRule: vi.fn(),
}));

import {
  routePrompt,
  reloadConfig,
  recordRouteOutcome,
  isRouteDisabled,
  resetRouteFailures,
  classifyRouteError,
} from '../../src/core/router.js';
import { loadRoutingConfig, findMatchingRule } from '../../src/config/routingConfig.js';

describe('Router auto-disable', () => {
  const models: ModelCapability[] = [
    {
      id: 'primary-model',
      type: 'openai',
      costTier: 'medium',
      strengths: ['general-qa', 'coding'],
      maxTokens: 8192,
      reasoning: false,
    },
    {
      id: 'secondary-model',
      type: 'openai',
      costTier: 'cheap',
      strengths: ['general-qa', 'simple-qa'],
      maxTokens: 4096,
      reasoning: false,
    },
  ];

  const baseConfig: RoutingConfig = {
    models,
    rules: [],
    preferences: {
      preferCheapWhenPossible: false,
      defaultCostTier: 'medium',
      maxCostPerRequest: null,
      fallbackModel: 'fallback-model',
      routeFailureThreshold: 3,
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(loadRoutingConfig).mockReturnValue(baseConfig);
    vi.mocked(findMatchingRule).mockReturnValue(null);
    reloadConfig();
    resetRouteFailures();
  });

  afterEach(() => {
    vi.resetAllMocks();
    resetRouteFailures();
  });

  describe('classifyRouteError', () => {
    it('classifies 401 / 403 / 404 status codes as permanent', () => {
      for (const code of [401, 403, 404]) {
        const c = classifyRouteError(new Error(`Request failed with status: ${code}`));
        expect(c.kind).toBe('permanent');
        if (c.kind === 'permanent') {
          expect(c.statusCode).toBe(code);
        }
      }
    });

    it('classifies model_not_found / deployment_not_found as permanent', () => {
      const a = classifyRouteError(new Error('model_not_found: gpt-9'));
      const b = classifyRouteError(new Error('deployment_not_found for foo'));
      expect(a.kind).toBe('permanent');
      expect(b.kind).toBe('permanent');
    });

    it('does NOT classify 5xx or network errors as permanent', () => {
      expect(classifyRouteError(new Error('status: 503 service unavailable')).kind).toBe('unknown');
      expect(classifyRouteError(new Error('ECONNRESET socket hang up')).kind).toBe('unknown');
      expect(classifyRouteError(new Error('status: 500 internal')).kind).toBe('unknown');
    });

    it('tolerates non-Error throwables', () => {
      expect(classifyRouteError('weird string').kind).toBe('unknown');
      expect(classifyRouteError(undefined).kind).toBe('unknown');
      expect(classifyRouteError({ msg: 'no' }).kind).toBe('unknown');
    });

    it('classifies an Error named AbortError as aborted', () => {
      const err = new Error('The user aborted a request.');
      (err as Error & { name: string }).name = 'AbortError';
      expect(classifyRouteError(err).kind).toBe('aborted');
    });

    it('classifies a DOMException named AbortError as aborted, not permanent', () => {
      // Node's fetch surfaces aborts via DOMException; fall back to a
      // constructed object with the same shape on older runtimes.
      const err =
        typeof DOMException !== 'undefined'
          ? new DOMException('signal aborted', 'AbortError')
          : Object.assign(new Error('aborted'), { name: 'AbortError' });
      const result = classifyRouteError(err);
      expect(result.kind).toBe('aborted');
      expect(result.kind).not.toBe('permanent');
    });

    it('short-circuits before status-code detection when the error is an AbortError', () => {
      // Even if an AbortError incidentally carries a "401" or
      // "model_not_found" substring in its message (defensive check), we
      // must still classify it as aborted, never as permanent.
      const err = new Error('Request failed with status: 401 (aborted mid-flight)');
      (err as Error & { name: string }).name = 'AbortError';
      expect(classifyRouteError(err).kind).toBe('aborted');
    });
  });

  describe('recordRouteOutcome + isRouteDisabled', () => {
    it('disables a route after 3 consecutive permanent failures (default threshold)', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

      recordRouteOutcome('primary-model', { kind: 'permanent', statusCode: 401 });
      expect(isRouteDisabled('primary-model')).toBe(false);

      recordRouteOutcome('primary-model', { kind: 'permanent', statusCode: 401 });
      expect(isRouteDisabled('primary-model')).toBe(false);

      recordRouteOutcome('primary-model', { kind: 'permanent', statusCode: 401 });
      expect(isRouteDisabled('primary-model')).toBe(true);

      // Warning printed exactly once on first disable
      expect(warn).toHaveBeenCalledTimes(1);
      const arg = String(warn.mock.calls[0][0]);
      expect(arg).toContain('primary-model');
      expect(arg).toContain('3');

      // Additional permanent outcomes after disable must NOT re-emit warnings
      recordRouteOutcome('primary-model', { kind: 'permanent', statusCode: 401 });
      recordRouteOutcome('primary-model', { kind: 'permanent', statusCode: 403 });
      expect(warn).toHaveBeenCalledTimes(1);

      warn.mockRestore();
    });

    it('a success outcome resets the counter (2 fails + success + 2 fails -> not disabled)', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

      recordRouteOutcome('primary-model', { kind: 'permanent', statusCode: 401 });
      recordRouteOutcome('primary-model', { kind: 'permanent', statusCode: 401 });
      expect(isRouteDisabled('primary-model')).toBe(false);

      recordRouteOutcome('primary-model', { kind: 'success' });
      expect(isRouteDisabled('primary-model')).toBe(false);

      recordRouteOutcome('primary-model', { kind: 'permanent', statusCode: 401 });
      recordRouteOutcome('primary-model', { kind: 'permanent', statusCode: 401 });
      expect(isRouteDisabled('primary-model')).toBe(false);
      expect(warn).not.toHaveBeenCalled();

      warn.mockRestore();
    });

    it('resetRouteFailures() re-enables a disabled route', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

      for (let i = 0; i < 3; i++) {
        recordRouteOutcome('primary-model', { kind: 'permanent', statusCode: 401 });
      }
      expect(isRouteDisabled('primary-model')).toBe(true);

      resetRouteFailures();
      expect(isRouteDisabled('primary-model')).toBe(false);

      warn.mockRestore();
    });
  });

  describe('routePrompt filtering', () => {
    it('routes around a disabled model', () => {
      // Disable primary-model
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
      for (let i = 0; i < 3; i++) {
        recordRouteOutcome('primary-model', { kind: 'permanent', statusCode: 401 });
      }
      warn.mockRestore();

      const decision = routePrompt('Write a function to sort an array');
      expect(decision.modelId).not.toBe('primary-model');
      expect(decision.modelId).toBe('secondary-model');
    });

    it('returns the configured fallback model with confidence 0.1 when ALL routes are disabled', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

      for (let i = 0; i < 3; i++) {
        recordRouteOutcome('primary-model', { kind: 'permanent', statusCode: 401 });
      }
      for (let i = 0; i < 3; i++) {
        recordRouteOutcome('secondary-model', { kind: 'permanent', statusCode: 403 });
      }

      const decision = routePrompt('Write a function to sort an array');
      expect(decision.modelId).toBe('fallback-model');
      expect(decision.confidence).toBe(0.1);
      expect(decision.reason.toLowerCase()).toContain('disabled');

      warn.mockRestore();
    });

    it('does not throw when all routes are disabled', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
      for (let i = 0; i < 3; i++) {
        recordRouteOutcome('primary-model', { kind: 'permanent', statusCode: 401 });
      }
      for (let i = 0; i < 3; i++) {
        recordRouteOutcome('secondary-model', { kind: 'permanent', statusCode: 403 });
      }

      expect(() => routePrompt('anything')).not.toThrow();

      warn.mockRestore();
    });

    it('3 consecutive transient (503) outcomes do NOT disable the route', () => {
      // Transient errors should not be passed to recordRouteOutcome with
      // kind === 'permanent'. Simulate the orchestrator's call site by going
      // through classifyRouteError first.
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

      for (let i = 0; i < 3; i++) {
        const classified = classifyRouteError(new Error('status: 503 service unavailable'));
        if (classified.kind === 'permanent') {
          recordRouteOutcome('primary-model', classified);
        }
      }

      expect(isRouteDisabled('primary-model')).toBe(false);
      expect(warn).not.toHaveBeenCalled();

      const decision = routePrompt('Write a function');
      // primary-model should still be selectable
      expect(decision.modelId === 'primary-model' || decision.modelId === 'secondary-model').toBe(
        true
      );

      warn.mockRestore();
    });
  });

  describe('threshold override via config', () => {
    it('honors a custom routeFailureThreshold from config', () => {
      vi.mocked(loadRoutingConfig).mockReturnValue({
        ...baseConfig,
        preferences: { ...baseConfig.preferences, routeFailureThreshold: 2 },
      });
      reloadConfig();
      resetRouteFailures();

      const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
      recordRouteOutcome('primary-model', { kind: 'permanent', statusCode: 401 });
      expect(isRouteDisabled('primary-model')).toBe(false);
      recordRouteOutcome('primary-model', { kind: 'permanent', statusCode: 401 });
      expect(isRouteDisabled('primary-model')).toBe(true);
      expect(warn).toHaveBeenCalledTimes(1);
      warn.mockRestore();
    });

    it('defaults to threshold 3 when routeFailureThreshold is absent', () => {
      vi.mocked(loadRoutingConfig).mockReturnValue({
        ...baseConfig,
        preferences: {
          preferCheapWhenPossible: false,
          defaultCostTier: 'medium',
          maxCostPerRequest: null,
          fallbackModel: 'fallback-model',
          // routeFailureThreshold deliberately omitted
        },
      });
      reloadConfig();
      resetRouteFailures();

      const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
      recordRouteOutcome('primary-model', { kind: 'permanent', statusCode: 401 });
      recordRouteOutcome('primary-model', { kind: 'permanent', statusCode: 401 });
      expect(isRouteDisabled('primary-model')).toBe(false);
      recordRouteOutcome('primary-model', { kind: 'permanent', statusCode: 401 });
      expect(isRouteDisabled('primary-model')).toBe(true);
      warn.mockRestore();
    });
  });
});
