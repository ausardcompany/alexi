/**
 * Tests for `message-diagnostics` — verifies the summary never leaks
 * user content and that it defends against pathological zod-like
 * shapes.
 */

import { describe, it, expect } from 'vitest';
import {
  summarizeSchemaFailure,
  summarizeMessageEnvelope,
  summarizeMessageArrayFailure,
} from '../message-diagnostics.js';

describe('summarizeSchemaFailure', () => {
  it('returns empty when error is null/undefined/primitive', () => {
    expect(summarizeSchemaFailure(null).issues).toEqual([]);
    expect(summarizeSchemaFailure(undefined).issues).toEqual([]);
    expect(summarizeSchemaFailure('oops').issues).toEqual([]);
    expect(summarizeSchemaFailure(42).issues).toEqual([]);
  });

  it('extracts issues from a ZodError-like shape and records only path/code/kind', () => {
    const err = {
      issues: [
        { path: ['messages', 0, 'content'], code: 'invalid_type', message: 'secret prompt text' },
        { path: ['messages', 1, 'role'], code: 'invalid_enum_value', message: 42 },
      ],
    };
    const summary = summarizeSchemaFailure(err);
    expect(summary.truncated).toBe(false);
    expect(summary.issues).toHaveLength(2);
    expect(summary.issues[0]).toEqual({
      path: 'messages.0.content',
      code: 'invalid_type',
      messageKind: 'string',
    });
    expect(summary.issues[1]).toEqual({
      path: 'messages.1.role',
      code: 'invalid_enum_value',
      messageKind: 'number',
    });
    // No raw user content anywhere in the serialized summary.
    expect(JSON.stringify(summary)).not.toContain('secret prompt text');
  });

  it('also accepts the `.errors` alias', () => {
    const err = { errors: [{ path: ['x'], code: 'c', message: 'm' }] };
    expect(summarizeSchemaFailure(err).issues[0]?.path).toBe('x');
  });

  it('truncates very large issue lists', () => {
    const err = {
      issues: Array.from({ length: 60 }, (_, i) => ({
        path: ['i', i],
        code: 'c',
        message: 'm',
      })),
    };
    const summary = summarizeSchemaFailure(err);
    expect(summary.truncated).toBe(true);
    expect(summary.issues).toHaveLength(50);
  });

  it('falls back on a non-array path, non-string code', () => {
    const err = {
      issues: [{ path: 'not-an-array', code: { not: 'string' }, message: undefined }],
    };
    const summary = summarizeSchemaFailure(err);
    expect(summary.issues[0]).toEqual({
      path: '<root>',
      code: 'unknown_code',
      messageKind: 'undefined',
    });
  });

  it('rejects an absurdly long code string', () => {
    const err = { issues: [{ path: [], code: 'x'.repeat(500), message: '' }] };
    expect(summarizeSchemaFailure(err).issues[0]?.code).toBe('unknown_code');
  });
});

describe('summarizeMessageEnvelope', () => {
  it('returns shape metadata for a well-formed message without content', () => {
    const msg = {
      id: 'm1',
      role: 'user',
      parts: [
        { type: 'text', text: 'LEAK CANDIDATE' },
        { type: 'image', url: 'https://leak.example' },
      ],
    };
    const shape = summarizeMessageEnvelope(msg);
    expect(shape).toEqual({
      role: 'user',
      partCount: 2,
      partKinds: ['text', 'image'],
      hasId: true,
    });
    expect(JSON.stringify(shape)).not.toContain('LEAK CANDIDATE');
    expect(JSON.stringify(shape)).not.toContain('leak.example');
  });

  it('handles non-object inputs defensively', () => {
    expect(summarizeMessageEnvelope(null)).toEqual({ shape: 'object' });
    expect(summarizeMessageEnvelope(42)).toEqual({ shape: 'number' });
  });
});

describe('summarizeMessageArrayFailure', () => {
  it('combines schema + envelope summary without leaking content', () => {
    const messages = [
      { role: 'user', parts: [{ type: 'text', text: 'SECRET' }] },
      { role: 'assistant', parts: [{ type: 'text', text: 'ALSO SECRET' }] },
    ];
    const err = { issues: [{ path: ['0', 'parts', 0], code: 'invalid_type', message: 'secret' }] };
    const result = summarizeMessageArrayFailure(messages, err);
    expect(result.messageShapes).toHaveLength(2);
    expect(result.schemaFailure.issues[0]?.code).toBe('invalid_type');
    expect(JSON.stringify(result)).not.toContain('SECRET');
  });
});
