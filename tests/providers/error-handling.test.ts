/**
 * Provider error handling tests.
 *
 * Verifies that `SapOrchestrationProvider` fails fast with an actionable
 * `InvalidModelError` when constructed with a model id that is not in the
 * `ORCHESTRATION_MODELS` catalog, and that the `deploymentId` escape hatch
 * bypasses the check for callers that have pinned a concrete SAP deployment
 * out-of-band. See `AGENTS.md` "Error classification" — a bad model id is a
 * *permanent* failure that should NOT be retried, and the message must guide
 * the operator to the fix (AICORE_MODEL, routing-config.json, --model flag).
 */

import { describe, it, expect } from 'vitest';

import {
  InvalidModelError,
  ORCHESTRATION_MODELS,
  SapOrchestrationProvider,
  createSapOrchestrationProvider,
  isOrchestrationModel,
} from '../../src/providers/index.js';

describe('SapOrchestrationProvider invalid model handling', () => {
  it('throws InvalidModelError for an unknown model id', () => {
    expect(() => new SapOrchestrationProvider({ modelName: 'totally-fake-model' })).toThrow(
      InvalidModelError
    );
  });

  it('the error message echoes the invalid model id verbatim', () => {
    try {
      new SapOrchestrationProvider({ modelName: 'gpt-99-turbo' });
      expect.fail('constructor should have thrown');
    } catch (err) {
      expect(err).toBeInstanceOf(InvalidModelError);
      const e = err as InvalidModelError;
      expect(e.modelName).toBe('gpt-99-turbo');
      expect(e.message).toContain("'gpt-99-turbo'");
      expect(e.message).toContain('not found in SAP AI Core catalog');
    }
  });

  it('the error message lists the three fix locations', () => {
    try {
      new SapOrchestrationProvider({ modelName: 'nope' });
      expect.fail('constructor should have thrown');
    } catch (err) {
      const e = err as InvalidModelError;
      expect(e.message).toContain('AICORE_MODEL');
      expect(e.message).toContain('routing-config.json');
      expect(e.message).toContain('--model');
    }
  });

  it('the error exposes the first 5 catalog entries as valid examples', () => {
    try {
      new SapOrchestrationProvider({ modelName: 'nope' });
      expect.fail('constructor should have thrown');
    } catch (err) {
      const e = err as InvalidModelError;
      const expected = ORCHESTRATION_MODELS.slice(0, 5);
      expect(e.validExamples).toEqual(expected);
      for (const model of expected) {
        expect(e.message).toContain(model);
      }
    }
  });

  it('accepts a valid model id from the catalog without throwing', () => {
    expect(isOrchestrationModel('gpt-4o')).toBe(true);
    expect(() => new SapOrchestrationProvider({ modelName: 'gpt-4o' })).not.toThrow();
  });

  it('accepts every entry in ORCHESTRATION_MODELS', () => {
    for (const model of ORCHESTRATION_MODELS) {
      expect(() => new SapOrchestrationProvider({ modelName: model })).not.toThrow();
    }
  });

  it('bypasses catalog validation when deploymentId is provided (escape hatch)', () => {
    // A concrete SAP deployment id binds the model out-of-band, so the
    // catalog check is not authoritative.
    expect(
      () =>
        new SapOrchestrationProvider({
          modelName: 'some-custom-deployment-model',
          deploymentId: 'd-1234abcd',
        })
    ).not.toThrow();
  });

  it('still throws when modelName is invalid and deploymentId is undefined', () => {
    expect(
      () =>
        new SapOrchestrationProvider({
          modelName: 'unknown-model',
          resourceGroup: 'default',
        })
    ).toThrow(InvalidModelError);
  });

  it('factory helper createSapOrchestrationProvider also throws on invalid id', () => {
    expect(() => createSapOrchestrationProvider({ modelName: 'not-a-real-model' })).toThrow(
      InvalidModelError
    );
  });

  it('InvalidModelError is an Error subclass with a stable name', () => {
    const err = new InvalidModelError('x');
    expect(err).toBeInstanceOf(Error);
    expect(err.name).toBe('InvalidModelError');
  });
});
