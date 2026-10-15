/**
 * Tests for the database query-error redaction helper.
 *
 * Guards upstream opencode `a8fc567` ("scrub params from database query
 * errors"). Operators ship Alexi logs to central observability; a raw
 * driver error that embeds its parameter list would leak user prompts,
 * API keys, and session blobs.
 */

import { describe, it, expect } from 'vitest';
import { formatQueryError } from './errors.js';

describe('formatQueryError', () => {
  it('redacts every parameter value', () => {
    const original = new Error('UNIQUE constraint failed: sessions.id');
    const err = formatQueryError(original, 'INSERT INTO sessions VALUES (?, ?)', [
      'sk-live-secret-token',
      { prompt: 'user private data' },
    ]);
    expect(err.message).not.toContain('sk-live-secret-token');
    expect(err.message).not.toContain('user private data');
    expect(err.message).toContain('[redacted]');
    expect(err.message).toMatch(/\["\[redacted\]","\[redacted\]"\]/);
  });

  it('preserves the parameter COUNT so shape bugs are visible', () => {
    const err = formatQueryError(new Error('x'), 'SELECT ?', ['a', 'b', 'c']);
    const match = err.message.match(/\[(.*)\]/);
    expect(match).not.toBeNull();
    const list = JSON.parse(`[${match![1]}]`);
    expect(list).toHaveLength(3);
  });

  it('names the SQL statement in the message', () => {
    const err = formatQueryError(new Error('x'), 'SELECT 1', []);
    expect(err.message).toContain('sql: SELECT 1');
  });

  it('attaches the original error as cause (for local debugging)', () => {
    const original = new Error('driver boom');
    const err = formatQueryError(original, 'SELECT 1', []);
    expect(err.cause).toBe(original);
    expect(err.name).toBe('QueryError');
  });

  it('tolerates non-Error values thrown by native drivers', () => {
    const err = formatQueryError('raw string', 'SELECT 1', []);
    expect(err.message).toContain('raw string');
  });
});
