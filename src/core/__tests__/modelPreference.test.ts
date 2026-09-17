/**
 * Regression tests for session model preference reconciliation.
 *
 * Ports upstream kilocode `dd2f2f9a9` + `50f7d01ad` coverage: an
 * explicit user model choice must not be silently overwritten by
 * defaults on subsequent turns, and effort-intent updates must merge
 * without picking a new model.
 */

import { describe, it, expect } from 'vitest';
import {
  resolveSessionModelPreference,
  userExplicitPreference,
  defaultPreference,
  migrateLegacyPreference,
} from '../modelPreference.js';

describe('resolveSessionModelPreference', () => {
  const cfg = defaultPreference('sap-ai-core/gpt-4o', 'sap-ai-core', 'medium');

  it('applies the config default on a brand-new session (no current preference)', () => {
    const resolved = resolveSessionModelPreference(undefined, undefined, cfg);
    expect(resolved).toEqual(cfg);
  });

  it("does NOT overwrite a user-explicit choice with a default incoming update", () => {
    const current = userExplicitPreference('sap-ai-core/claude-3.5-sonnet', 'sap-ai-core', 'high');
    const incoming = defaultPreference('sap-ai-core/gpt-4o', 'sap-ai-core', 'medium');

    const resolved = resolveSessionModelPreference(current, incoming, cfg);
    expect(resolved.modelID).toBe('sap-ai-core/claude-3.5-sonnet');
    expect(resolved.providerID).toBe('sap-ai-core');
    expect(resolved.source).toBe('user-explicit');
  });

  it('allows a new user-explicit choice to overwrite the previous user-explicit choice', () => {
    const current = userExplicitPreference('sap-ai-core/claude-3.5-sonnet', 'sap-ai-core');
    const incoming = userExplicitPreference('sap-ai-core/gpt-4o', 'sap-ai-core');

    const resolved = resolveSessionModelPreference(current, incoming, cfg);
    expect(resolved.modelID).toBe('sap-ai-core/gpt-4o');
    expect(resolved.source).toBe('user-explicit');
  });

  it('merges a fresh effort update into a user-explicit choice without swapping model', () => {
    const current = userExplicitPreference('sap-ai-core/claude-3.5-sonnet', 'sap-ai-core', 'medium');
    // Simulate `/effort high` — non-explicit source, only effort field set.
    const incoming = { reasoningEffort: 'high' as const };

    const resolved = resolveSessionModelPreference(current, incoming, cfg);
    expect(resolved.modelID).toBe('sap-ai-core/claude-3.5-sonnet');
    expect(resolved.reasoningEffort).toBe('high');
    expect(resolved.source).toBe('user-explicit');
  });

  it('preserves the existing effort intent when the incoming update omits it', () => {
    const current = userExplicitPreference('sap-ai-core/claude-3.5-sonnet', 'sap-ai-core', 'high');
    // A config-default reload with a different effort should NOT downgrade
    // the user's effort intent.
    const incoming = defaultPreference('sap-ai-core/gpt-4o', 'sap-ai-core', 'low');

    const resolved = resolveSessionModelPreference(current, incoming, cfg);
    expect(resolved.reasoningEffort).toBe('high');
  });

  it('treats inherited preferences the same as user-explicit for override protection', () => {
    const current = {
      modelID: 'sap-ai-core/claude-3.5-sonnet',
      providerID: 'sap-ai-core',
      source: 'inherited' as const,
    };
    const incoming = defaultPreference('sap-ai-core/gpt-4o', 'sap-ai-core');

    const resolved = resolveSessionModelPreference(current, incoming, cfg);
    expect(resolved.modelID).toBe('sap-ai-core/claude-3.5-sonnet');
    expect(resolved.source).toBe('inherited');
  });

  it('falls back to the config default when neither current nor incoming supply a model', () => {
    const resolved = resolveSessionModelPreference(undefined, {}, cfg);
    expect(resolved).toEqual(cfg);
  });
});

describe('migrateLegacyPreference', () => {
  it('defaults a legacy entry (no source field) to user-explicit', () => {
    const migrated = migrateLegacyPreference({
      modelID: 'sap-ai-core/gpt-4o',
      providerID: 'sap-ai-core',
    });
    expect(migrated.source).toBe('user-explicit');
  });

  it('preserves an already-present source field during migration', () => {
    const migrated = migrateLegacyPreference({
      modelID: 'sap-ai-core/gpt-4o',
      providerID: 'sap-ai-core',
      source: 'default',
    });
    expect(migrated.source).toBe('default');
  });
});
