/**
 * Tests for the Bedrock Nova tool-result image placement transform
 * (`transformNovaMessages` + `isNovaModel`) in `src/providers/transform.ts`.
 *
 * Ports the behaviour contract from kilocode PR #14524 (merged 2026-10-09):
 * Amazon Nova rejects tool-result messages carrying image content blocks
 * with HTTP 400. The fix moves images to the next user message (or
 * synthesises one), preserves tool-result text, and leaves non-Nova
 * models unchanged.
 */

import { describe, expect, it } from 'vitest';
import { isNovaModel, transformNovaMessages } from '../../src/providers/transform.js';

describe('isNovaModel', () => {
  it('detects Bedrock cross-region Nova inference profiles', () => {
    expect(isNovaModel('us.amazon.nova-pro-v1:0')).toBe(true);
    expect(isNovaModel('eu.amazon.nova-lite-v1:0')).toBe(true);
    expect(isNovaModel('ap.amazon.nova-micro-v1:0')).toBe(true);
    expect(isNovaModel('apac.amazon.nova-pro-v1:0')).toBe(true);
  });

  it('detects Bedrock short-form Nova ids', () => {
    expect(isNovaModel('amazon.nova-micro-v1:0')).toBe(true);
    expect(isNovaModel('amazon.nova-pro')).toBe(true);
  });

  it('detects SAP AI Core orchestration Nova ids', () => {
    expect(isNovaModel('amazon--nova-micro')).toBe(true);
    expect(isNovaModel('amazon--nova-lite')).toBe(true);
    expect(isNovaModel('amazon--nova-pro')).toBe(true);
  });

  it('strips case before matching', () => {
    expect(isNovaModel('US.AMAZON.NOVA-PRO-V1:0')).toBe(true);
    expect(isNovaModel('Amazon--Nova-Lite')).toBe(true);
  });

  it('accepts a provider-prefixed form', () => {
    expect(isNovaModel('sap-ai-core/amazon--nova-pro')).toBe(true);
    expect(isNovaModel('bedrock/us.amazon.nova-pro-v1:0')).toBe(true);
  });

  it('returns false for non-Nova models', () => {
    expect(isNovaModel('anthropic--claude-4.7-opus')).toBe(false);
    expect(isNovaModel('gpt-4o')).toBe(false);
    expect(isNovaModel('gemini-2.5-pro')).toBe(false);
    expect(isNovaModel('us.anthropic.claude-3-5-sonnet-20241022-v2:0')).toBe(false);
    // Nova is Amazon-only; AWS Titan / Mistral on Bedrock should not match.
    expect(isNovaModel('amazon.titan-text-express-v1')).toBe(false);
  });

  it('returns false for empty / nullish ids', () => {
    expect(isNovaModel('')).toBe(false);
    expect(isNovaModel(undefined)).toBe(false);
  });
});

describe('transformNovaMessages - non-Nova models', () => {
  it('returns a shallow copy for non-Nova models without rewriting', () => {
    const messages = [
      { role: 'user', content: 'hi' },
      {
        role: 'tool',
        tool_call_id: 'c1',
        content: [
          { type: 'image', source: { data: 'AAAA', mediaType: 'image/png' } },
          { type: 'text', text: 'ran screenshot' },
        ],
      },
      { role: 'user', content: 'thanks' },
    ];
    const result = transformNovaMessages(messages, 'anthropic--claude-4.7-opus');
    expect(result).not.toBe(messages);
    expect(result).toEqual(messages);
    expect(result[1]).toBe(messages[1]);
  });

  it('does not transform for Claude on Bedrock (bugfix must stay Nova-only)', () => {
    const messages = [
      {
        role: 'tool',
        tool_call_id: 'c1',
        content: [
          { type: 'image', source: { data: 'XX' } },
          { type: 'text', text: 'ok' },
        ],
      },
      { role: 'user', content: 'next' },
    ];
    const result = transformNovaMessages(messages, 'us.anthropic.claude-3-5-sonnet-20241022-v2:0');
    expect(result).toEqual(messages);
  });

  it('returns a shallow copy for an empty / unknown model id', () => {
    const messages = [{ role: 'user', content: 'hi' }];
    expect(transformNovaMessages(messages, undefined)).toEqual(messages);
    expect(transformNovaMessages(messages, '')).toEqual(messages);
  });
});

describe('transformNovaMessages - Nova models', () => {
  it('moves tool-result images into the next user message', () => {
    const image = { type: 'image', source: { data: 'AAAA', mediaType: 'image/png' } };
    const messages = [
      { role: 'user', content: 'take a screenshot' },
      { role: 'assistant', content: '', tool_calls: [{ id: 'c1', name: 'shot' }] },
      {
        role: 'tool',
        tool_call_id: 'c1',
        content: [image, { type: 'text', text: 'captured OK' }],
      },
      { role: 'user', content: 'what do you see?' },
    ];
    const result = transformNovaMessages(messages, 'us.amazon.nova-pro-v1:0');

    // Tool result loses the image, keeps the text.
    expect(result[2]).toEqual({
      role: 'tool',
      tool_call_id: 'c1',
      content: [{ type: 'text', text: 'captured OK' }],
    });
    // Next user message gets the image prepended, original text lifted
    // to a text block so the two can coexist as content parts.
    expect(result[3]).toEqual({
      role: 'user',
      content: [image, { type: 'text', text: 'what do you see?' }],
    });
    // Earlier messages are untouched.
    expect(result[0]).toBe(messages[0]);
    expect(result[1]).toBe(messages[1]);
    expect(result).toHaveLength(messages.length);
  });

  it('preserves tool-result text when the content was mixed image + text', () => {
    const image = { type: 'image', source: { data: 'YY' } };
    const messages = [
      {
        role: 'tool',
        tool_call_id: 'c1',
        content: [{ type: 'text', text: 'summary line' }, image, { type: 'text', text: 'tail' }],
      },
      { role: 'user', content: 'got it' },
    ];
    const result = transformNovaMessages(messages, 'amazon--nova-pro');
    expect(result[0]).toEqual({
      role: 'tool',
      tool_call_id: 'c1',
      content: [
        { type: 'text', text: 'summary line' },
        { type: 'text', text: 'tail' },
      ],
    });
    expect(result[1]).toEqual({
      role: 'user',
      content: [image, { type: 'text', text: 'got it' }],
    });
  });

  it('creates a synthetic user message when no user turn follows', () => {
    const image = { type: 'image_url', image_url: { url: 'https://example.com/a.png' } };
    const messages = [
      { role: 'user', content: 'look' },
      { role: 'assistant', content: '', tool_calls: [{ id: 'c1', name: 'shot' }] },
      {
        role: 'tool',
        tool_call_id: 'c1',
        content: [image, { type: 'text', text: 'done' }],
      },
    ];
    const result = transformNovaMessages(messages, 'us.amazon.nova-lite-v1:0');

    expect(result).toHaveLength(messages.length + 1);
    expect(result[2]).toEqual({
      role: 'tool',
      tool_call_id: 'c1',
      content: [{ type: 'text', text: 'done' }],
    });
    expect(result[3]).toEqual({
      role: 'user',
      content: [image, { type: 'text', text: 'Continuing the conversation' }],
    });
  });

  it('creates a synthetic user message when only assistant/system turns follow', () => {
    const image = { type: 'image', source: { data: 'ZZ' } };
    const messages = [
      {
        role: 'tool',
        tool_call_id: 'c1',
        content: [image, { type: 'text', text: 'ok' }],
      },
      { role: 'assistant', content: 'summary of image' },
    ];
    const result = transformNovaMessages(messages, 'amazon--nova-pro');
    expect(result).toHaveLength(messages.length + 1);
    expect(result[0]).toEqual({
      role: 'tool',
      tool_call_id: 'c1',
      content: [{ type: 'text', text: 'ok' }],
    });
    expect(result[1]).toBe(messages[1]);
    expect(result[2]).toEqual({
      role: 'user',
      content: [image, { type: 'text', text: 'Continuing the conversation' }],
    });
  });

  it('leaves an empty-text block when the tool result had only images', () => {
    const image = { type: 'image', source: { data: 'QQ' } };
    const messages = [
      { role: 'tool', tool_call_id: 'c1', content: [image] },
      { role: 'user', content: 'describe it' },
    ];
    const result = transformNovaMessages(messages, 'us.amazon.nova-pro-v1:0');
    expect(result[0]).toEqual({
      role: 'tool',
      tool_call_id: 'c1',
      content: [{ type: 'text', text: '' }],
    });
    expect(result[1]).toEqual({
      role: 'user',
      content: [image, { type: 'text', text: 'describe it' }],
    });
  });

  it('passes through tool results that have no images', () => {
    const messages = [
      { role: 'tool', tool_call_id: 'c1', content: [{ type: 'text', text: 'no img' }] },
      { role: 'user', content: 'next' },
    ];
    const result = transformNovaMessages(messages, 'amazon--nova-pro');
    expect(result[0]).toBe(messages[0]);
    expect(result[1]).toBe(messages[1]);
  });

  it('passes through tool results whose content is a plain string', () => {
    const messages = [
      { role: 'tool', tool_call_id: 'c1', content: 'plain tool text' },
      { role: 'user', content: 'next' },
    ];
    const result = transformNovaMessages(messages, 'amazon--nova-pro');
    expect(result[0]).toBe(messages[0]);
    expect(result[1]).toBe(messages[1]);
  });

  it('accumulates images across consecutive tool results into the same user turn', () => {
    const img1 = { type: 'image', source: { data: 'AA' } };
    const img2 = { type: 'image', source: { data: 'BB' } };
    const messages = [
      {
        role: 'tool',
        tool_call_id: 'c1',
        content: [img1, { type: 'text', text: 'first' }],
      },
      {
        role: 'tool',
        tool_call_id: 'c2',
        content: [img2, { type: 'text', text: 'second' }],
      },
      { role: 'user', content: 'summarise' },
    ];
    const result = transformNovaMessages(messages, 'us.amazon.nova-pro-v1:0');
    expect(result[0]).toEqual({
      role: 'tool',
      tool_call_id: 'c1',
      content: [{ type: 'text', text: 'first' }],
    });
    expect(result[1]).toEqual({
      role: 'tool',
      tool_call_id: 'c2',
      content: [{ type: 'text', text: 'second' }],
    });
    expect(result[2]).toEqual({
      role: 'user',
      content: [img1, img2, { type: 'text', text: 'summarise' }],
    });
  });

  it('handles a user message whose content is already an array of parts', () => {
    const image = { type: 'image', source: { data: 'MM' } };
    const existingUserPart = { type: 'text', text: 'tell me more' };
    const messages = [
      { role: 'tool', tool_call_id: 'c1', content: [image, { type: 'text', text: 'done' }] },
      { role: 'user', content: [existingUserPart] },
    ];
    const result = transformNovaMessages(messages, 'amazon--nova-pro');
    expect(result[1]).toEqual({
      role: 'user',
      content: [image, existingUserPart],
    });
  });

  it('does not mutate the input list or its message objects', () => {
    const image = { type: 'image', source: { data: 'AA' } };
    const toolMsg = {
      role: 'tool',
      tool_call_id: 'c1',
      content: [image, { type: 'text', text: 'ok' }],
    };
    const userMsg = { role: 'user', content: 'next' };
    const messages = [toolMsg, userMsg];
    const toolSnapshot = JSON.parse(JSON.stringify(toolMsg));
    const userSnapshot = JSON.parse(JSON.stringify(userMsg));
    transformNovaMessages(messages, 'us.amazon.nova-pro-v1:0');
    expect(toolMsg).toEqual(toolSnapshot);
    expect(userMsg).toEqual(userSnapshot);
    expect(messages).toHaveLength(2);
  });
});

describe('transformNovaMessages - Bedrock request mock', () => {
  // Minimal regression stand-in for the integration contract described in
  // the issue: a transformed Nova request contains NO image blocks on any
  // tool-role message. A real Bedrock endpoint returns HTTP 400 when this
  // invariant is violated; we check the invariant directly against the
  // transform output so the test does not require network access.
  function assertNoToolResultImages(messages: Array<{ role: string; content?: unknown }>): void {
    for (const msg of messages) {
      if (msg.role !== 'tool' || !Array.isArray(msg.content)) {
        continue;
      }
      for (const part of msg.content as Array<Record<string, unknown>>) {
        expect(part.type).not.toBe('image');
        expect(part.type).not.toBe('image_url');
      }
    }
  }

  it('produces a Nova-safe request shape (no images on tool results)', () => {
    const image = { type: 'image', source: { data: 'AA' } };
    const messages = [
      { role: 'system', content: 'you are helpful' },
      { role: 'user', content: 'screenshot it' },
      { role: 'assistant', content: '', tool_calls: [{ id: 'c1', name: 'shot' }] },
      {
        role: 'tool',
        tool_call_id: 'c1',
        content: [image, { type: 'text', text: 'done' }],
      },
      { role: 'user', content: 'describe' },
    ];
    const transformed = transformNovaMessages(messages, 'us.amazon.nova-pro-v1:0');
    assertNoToolResultImages(transformed);
  });

  it('leaves tool-result images in place for non-Nova (regression guard)', () => {
    const image = { type: 'image', source: { data: 'AA' } };
    const messages = [
      {
        role: 'tool',
        tool_call_id: 'c1',
        content: [image, { type: 'text', text: 'done' }],
      },
      { role: 'user', content: 'describe' },
    ];
    const transformed = transformNovaMessages(messages, 'anthropic--claude-4.7-opus');
    const tool = transformed[0] as { content: Array<Record<string, unknown>> };
    expect(tool.content.some((p) => p.type === 'image')).toBe(true);
  });
});
