/**
 * Tests for the GitLab AI provider reasoning-variant transform.
 *
 * Ports the reasoning-branch coverage added upstream alongside the
 * `gitlab-ai-provider` bump 6.13.0 → 6.14.0. Alexi does not yet expose
 * GitLab as a live provider, so these tests pin the transform behaviour
 * against a synthetic raw-model shape.
 */

import { describe, it, expect } from 'vitest';
import { transformGitlabModel } from '../gitlab.js';

describe('transformGitlabModel', () => {
  it('preserves the model id verbatim', () => {
    const out = transformGitlabModel({ id: 'gitlab/claude-3.5-sonnet' });
    expect(out.id).toBe('gitlab/claude-3.5-sonnet');
  });

  it('sets reasoning.enabled when the id contains "reasoning"', () => {
    const out = transformGitlabModel({ id: 'gitlab/claude-reasoning' });
    expect(out.reasoning?.enabled).toBe(true);
  });

  it('sets reasoning.enabled when capabilities include "reasoning"', () => {
    const out = transformGitlabModel({
      id: 'gitlab/claude-3.7-sonnet',
      capabilities: ['tools', 'reasoning'],
    });
    expect(out.reasoning?.enabled).toBe(true);
  });

  it('omits reasoning for non-reasoning models', () => {
    const out = transformGitlabModel({
      id: 'gitlab/claude-3.5-sonnet',
      capabilities: ['tools'],
    });
    expect(out.reasoning).toBeUndefined();
  });

  it('omits reasoning when capabilities is absent and id has no marker', () => {
    const out = transformGitlabModel({ id: 'gitlab/gpt-4o' });
    expect(out.reasoning).toBeUndefined();
  });

  it('preserves the SAP AI Core deployment hint when present', () => {
    const out = transformGitlabModel({
      id: 'gitlab/anthropic--claude-3.7-sonnet',
      sapDeploymentId: 'dep-abc-123',
    });
    expect(out.sapDeploymentId).toBe('dep-abc-123');
  });

  it('omits sapDeploymentId when absent on the raw model', () => {
    const out = transformGitlabModel({ id: 'gitlab/claude-3.5-sonnet' });
    expect(out.sapDeploymentId).toBeUndefined();
  });

  it('combines reasoning + sap hint on a single model', () => {
    const out = transformGitlabModel({
      id: 'gitlab/claude-reasoning',
      capabilities: ['reasoning'],
      sapDeploymentId: 'dep-xyz',
    });
    expect(out.reasoning?.enabled).toBe(true);
    expect(out.sapDeploymentId).toBe('dep-xyz');
  });
});
