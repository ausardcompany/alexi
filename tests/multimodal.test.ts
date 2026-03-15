import { describe, it, expect } from 'vitest';
import {
  buildUserMessage,
  isMultimodalMessage,
  type MultimodalUserMessage,
} from '../src/utils/multimodal.js';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Create a minimal PNG buffer for testing. */
function makePngBuffer(size = 64): Buffer {
  const buf = Buffer.alloc(size);
  buf[0] = 0x89;
  buf[1] = 0x50;
  buf[2] = 0x4e;
  buf[3] = 0x47;
  return buf;
}

/** Create a minimal JPEG buffer for testing. */
function makeJpegBuffer(size = 64): Buffer {
  const buf = Buffer.alloc(size);
  buf[0] = 0xff;
  buf[1] = 0xd8;
  buf[2] = 0xff;
  return buf;
}

// ---------------------------------------------------------------------------
// buildUserMessage
// ---------------------------------------------------------------------------

describe('buildUserMessage', () => {
  it('should return plain text message when no images', () => {
    const msg = buildUserMessage('Hello world');
    expect(msg).toEqual({ role: 'user', content: 'Hello world' });
  });

  it('should return plain text message when images array is empty', () => {
    const msg = buildUserMessage('Hello world', []);
    expect(msg).toEqual({ role: 'user', content: 'Hello world' });
  });

  it('should return multimodal message with single image', () => {
    const pngData = makePngBuffer(16);
    const msg = buildUserMessage('Describe this', [{ data: pngData, format: 'png' }]);

    expect(msg.role).toBe('user');
    expect(Array.isArray(msg.content)).toBe(true);

    const content = (msg as MultimodalUserMessage).content;
    expect(content).toHaveLength(2);

    // Image first
    expect(content[0].type).toBe('image_url');
    if (content[0].type === 'image_url') {
      expect(content[0].image_url.url).toMatch(/^data:image\/png;base64,/);
      expect(content[0].image_url.detail).toBe('auto');
    }

    // Text second
    expect(content[1]).toEqual({ type: 'text', text: 'Describe this' });
  });

  it('should return multimodal message with multiple images', () => {
    const msg = buildUserMessage('Compare these', [
      { data: makePngBuffer(), format: 'png' },
      { data: makeJpegBuffer(), format: 'jpeg' },
    ]);

    const content = (msg as MultimodalUserMessage).content;
    expect(content).toHaveLength(3); // 2 images + 1 text

    expect(content[0].type).toBe('image_url');
    expect(content[1].type).toBe('image_url');
    expect(content[2].type).toBe('text');

    // Check MIME types
    if (content[0].type === 'image_url') {
      expect(content[0].image_url.url).toMatch(/^data:image\/png;base64,/);
    }
    if (content[1].type === 'image_url') {
      expect(content[1].image_url.url).toMatch(/^data:image\/jpeg;base64,/);
    }
  });

  it('should respect custom detail parameter', () => {
    const msg = buildUserMessage('Hi', [{ data: makePngBuffer(), format: 'png', detail: 'high' }]);

    const content = (msg as MultimodalUserMessage).content;
    if (content[0].type === 'image_url') {
      expect(content[0].image_url.detail).toBe('high');
    }
  });

  it('should omit text item when text is empty/whitespace', () => {
    const msg = buildUserMessage('   ', [{ data: makePngBuffer(), format: 'png' }]);

    const content = (msg as MultimodalUserMessage).content;
    expect(content).toHaveLength(1); // Only image, no text
    expect(content[0].type).toBe('image_url');
  });

  it('should produce correct base64 encoding', () => {
    const data = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    const msg = buildUserMessage('Check', [{ data, format: 'png' }]);

    const content = (msg as MultimodalUserMessage).content;
    if (content[0].type === 'image_url') {
      const expectedBase64 = data.toString('base64');
      expect(content[0].image_url.url).toBe(`data:image/png;base64,${expectedBase64}`);
    }
  });
});

// ---------------------------------------------------------------------------
// isMultimodalMessage
// ---------------------------------------------------------------------------

describe('isMultimodalMessage', () => {
  it('should return true for multimodal user message', () => {
    const msg: MultimodalUserMessage = {
      role: 'user',
      content: [{ type: 'text', text: 'hi' }],
    };
    expect(isMultimodalMessage(msg)).toBe(true);
  });

  it('should return false for plain text user message', () => {
    expect(isMultimodalMessage({ role: 'user', content: 'hi' })).toBe(false);
  });

  it('should return false for assistant message', () => {
    expect(
      isMultimodalMessage({ role: 'assistant', content: [{ type: 'text', text: 'hi' }] })
    ).toBe(false);
  });

  it('should return false for null', () => {
    expect(isMultimodalMessage(null)).toBe(false);
  });

  it('should return false for undefined', () => {
    expect(isMultimodalMessage(undefined)).toBe(false);
  });

  it('should return false for string', () => {
    expect(isMultimodalMessage('hello')).toBe(false);
  });

  it('should return false for number', () => {
    expect(isMultimodalMessage(42)).toBe(false);
  });
});
