/**
 * Tests for the shared protocol adapter utilities.
 *
 * Ports kilocode PRs #13255 / #13301: verify that back-to-back user
 * messages are merged into a single user message so protocols requiring
 * strict user/assistant alternation (Anthropic, Bedrock Converse,
 * Gemini) don't reject the payload.
 */

import { describe, expect, it } from 'vitest';
import { coalesceUserMessages, type CoalesceableMessage } from './shared.js';

describe('coalesceUserMessages', () => {
  it('leaves already-alternating conversations untouched', () => {
    const messages: CoalesceableMessage[] = [
      { role: 'user', content: 'hi' },
      { role: 'assistant', content: 'hello' },
      { role: 'user', content: 'how are you?' },
    ];
    const out = coalesceUserMessages(messages);
    expect(out).toHaveLength(3);
    expect(out[0].content).toBe('hi');
    expect(out[1].content).toBe('hello');
    expect(out[2].content).toBe('how are you?');
  });

  it('merges two adjacent user messages (string + string)', () => {
    const messages: CoalesceableMessage[] = [
      { role: 'user', content: 'first' },
      { role: 'user', content: 'second' },
      { role: 'assistant', content: 'ack' },
    ];
    const out = coalesceUserMessages(messages);
    expect(out).toHaveLength(2);
    expect(out[0].role).toBe('user');
    expect(out[0].content).toEqual([
      { type: 'text', text: 'first' },
      { type: 'text', text: 'second' },
    ]);
    expect(out[1].role).toBe('assistant');
  });

  it('merges array-form content with string content', () => {
    const messages: CoalesceableMessage[] = [
      {
        role: 'user',
        content: [{ type: 'image', source: { url: 'data:...' } }],
      },
      { role: 'user', content: 'describe this' },
    ];
    const out = coalesceUserMessages(messages);
    expect(out).toHaveLength(1);
    expect(out[0].content).toEqual([
      { type: 'image', source: { url: 'data:...' } },
      { type: 'text', text: 'describe this' },
    ]);
  });

  it('merges three consecutive user messages into one', () => {
    const messages: CoalesceableMessage[] = [
      { role: 'user', content: 'a' },
      { role: 'user', content: 'b' },
      { role: 'user', content: 'c' },
    ];
    const out = coalesceUserMessages(messages);
    expect(out).toHaveLength(1);
    expect(out[0].content).toEqual([
      { type: 'text', text: 'a' },
      { type: 'text', text: 'b' },
      { type: 'text', text: 'c' },
    ]);
  });

  it('does not mutate the input array or its messages', () => {
    const messages: CoalesceableMessage[] = [
      { role: 'user', content: 'first' },
      { role: 'user', content: 'second' },
    ];
    const snapshot = JSON.parse(JSON.stringify(messages));
    coalesceUserMessages(messages);
    expect(messages).toEqual(snapshot);
  });

  it('preserves non-user roles verbatim', () => {
    const messages: CoalesceableMessage[] = [
      { role: 'system', content: 'you are helpful' },
      { role: 'user', content: 'hi' },
      { role: 'assistant', content: 'hello' },
    ];
    const out = coalesceUserMessages(messages);
    expect(out).toEqual(messages);
  });
});
