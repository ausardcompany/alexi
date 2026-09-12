import { describe, it, expect, afterEach } from 'vitest';
import {
  resolveInlineModelReference,
  invalidateCatalog,
} from '../../src/providers/modelCatalog.js';

describe('resolveInlineModelReference', () => {
  afterEach(() => {
    invalidateCatalog();
  });

  it('returns "none" for a message with no @provider/model token', () => {
    const result = resolveInlineModelReference('write a haiku about the sea');
    expect(result.kind).toBe('none');
  });

  it('returns "none" for an empty or non-string input', () => {
    expect(resolveInlineModelReference('').kind).toBe('none');
    expect(resolveInlineModelReference(undefined as unknown as string).kind).toBe('none');
  });

  it('resolves @anthropic/claude-4.7-opus to the assembled catalog id', () => {
    const result = resolveInlineModelReference('@anthropic/claude-4.7-opus explain bubble sort');
    expect(result.kind).toBe('match');
    if (result.kind === 'match') {
      expect(result.reference.modelId).toBe('anthropic--claude-4.7-opus');
      expect(result.strippedMessage).toBe('explain bubble sort');
      expect(result.reference.match).toBe('@anthropic/claude-4.7-opus');
    }
  });

  it('resolves a bare model id when provider prefix is not part of catalog id', () => {
    // gpt-4o exists as a flat id in the catalog.
    const result = resolveInlineModelReference('@openai/gpt-4o quick summary please');
    expect(result.kind).toBe('match');
    if (result.kind === 'match') {
      expect(result.reference.modelId).toBe('gpt-4o');
      expect(result.strippedMessage).toBe('quick summary please');
    }
  });

  it('reports "invalid" for a well-formed but unknown reference', () => {
    const result = resolveInlineModelReference('@nonexistent/model-x test');
    expect(result.kind).toBe('invalid');
    if (result.kind === 'invalid') {
      expect(result.provider).toBe('nonexistent');
      expect(result.model).toBe('model-x');
    }
  });

  it('ignores mid-word matches (e.g. an email-like string)', () => {
    const result = resolveInlineModelReference('contact user@anthropic/claude-4.7-opus for info');
    // The `@anthropic/...` is inside a word (`user@...`), so the regex
    // requires start-of-string or whitespace before `@`.
    expect(result.kind).toBe('none');
  });

  it('extracts the first inline reference when multiple are present', () => {
    const result = resolveInlineModelReference(
      '@anthropic/claude-4.7-opus vs @openai/gpt-4o compare'
    );
    expect(result.kind).toBe('match');
    if (result.kind === 'match') {
      // First match wins for consistent behaviour.
      expect(result.reference.modelId).toBe('anthropic--claude-4.7-opus');
      // The second `@openai/gpt-4o` stays in the prompt (only the
      // matched token is stripped).
      expect(result.strippedMessage).toContain('@openai/gpt-4o');
    }
  });

  it('strips the token and collapses surrounding whitespace', () => {
    const result = resolveInlineModelReference('hello @anthropic/claude-4.7-opus world');
    expect(result.kind).toBe('match');
    if (result.kind === 'match') {
      expect(result.strippedMessage).toBe('hello world');
    }
  });
});
