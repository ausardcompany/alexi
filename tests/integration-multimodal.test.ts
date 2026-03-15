/**
 * Integration test: end-to-end multimodal message flow.
 *
 * Verifies the full pipeline:
 *   PNG buffer → imageValidation → buildUserMessage → provider-compatible format
 *
 * No mocked React context — tests the utility pipeline only.
 */
import { describe, it, expect } from 'vitest';

import { validateImage, toDataUri, formatSize } from '../src/utils/imageValidation.js';
import { buildUserMessage, isMultimodalMessage } from '../src/utils/multimodal.js';

// ---------------------------------------------------------------------------
// Helpers — minimal valid image buffers
// ---------------------------------------------------------------------------

function makePng(size = 128): Buffer {
  const buf = Buffer.alloc(size);
  // PNG magic: 89 50 4E 47 0D 0A 1A 0A
  buf.set([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  return buf;
}

function makeJpeg(size = 128): Buffer {
  const buf = Buffer.alloc(size);
  // JPEG magic: FF D8 FF
  buf.set([0xff, 0xd8, 0xff]);
  return buf;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Integration: multimodal message pipeline', () => {
  it('should validate a PNG, build a multimodal message, and produce correct structure', () => {
    const png = makePng(256);

    // Step 1: Validate
    const validation = validateImage(png);
    expect(validation.valid).toBe(true);
    if (!validation.valid) {
      return;
    }
    expect(validation.format).toBe('png');
    expect(validation.sizeBytes).toBe(256);

    // Step 2: Build multimodal message
    const msg = buildUserMessage('Describe this screenshot', [
      { data: png, format: validation.format },
    ]);

    // Step 3: Verify structure matches SAP SDK expectations
    expect(msg.role).toBe('user');
    expect(Array.isArray(msg.content)).toBe(true);
    expect(isMultimodalMessage(msg)).toBe(true);

    const content = msg.content as unknown as Array<Record<string, unknown>>;
    // Images first, then text
    expect(content).toHaveLength(2);
    expect(content[0].type).toBe('image_url');
    expect(content[1].type).toBe('text');

    // Verify data URI format
    const imageItem = content[0] as { type: string; image_url: { url: string; detail: string } };
    expect(imageItem.image_url.url).toMatch(/^data:image\/png;base64,/);
    expect(imageItem.image_url.detail).toBe('auto');

    // Verify base64 round-trip
    const base64 = imageItem.image_url.url.replace('data:image/png;base64,', '');
    const decoded = Buffer.from(base64, 'base64');
    expect(decoded.length).toBe(256);
    expect(decoded[0]).toBe(0x89); // PNG signature
    expect(decoded[1]).toBe(0x50);
  });

  it('should produce a plain text message when no images are attached', () => {
    const msg = buildUserMessage('Hello, no images here');
    expect(msg.role).toBe('user');
    expect(typeof msg.content).toBe('string');
    expect(msg.content).toBe('Hello, no images here');
    expect(isMultimodalMessage(msg)).toBe(false);
  });

  it('should handle multiple images of different formats', () => {
    const png = makePng(100);
    const jpeg = makeJpeg(200);

    const msg = buildUserMessage('Compare these images', [
      { data: png, format: 'png' },
      { data: jpeg, format: 'jpeg' },
    ]);

    expect(isMultimodalMessage(msg)).toBe(true);
    const content = msg.content as unknown as Array<Record<string, unknown>>;
    expect(content).toHaveLength(3); // 2 images + 1 text

    // Check image URIs use correct MIME types
    const img1 = content[0] as { image_url: { url: string } };
    const img2 = content[1] as { image_url: { url: string } };
    expect(img1.image_url.url).toMatch(/^data:image\/png;base64,/);
    expect(img2.image_url.url).toMatch(/^data:image\/jpeg;base64,/);
  });

  it('should reject oversized images during validation', () => {
    // Default max is 20 MB. Create a buffer slightly over.
    const oversized = Buffer.alloc(21 * 1024 * 1024);
    oversized.set([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]); // PNG header

    const validation = validateImage(oversized);
    expect(validation.valid).toBe(false);
    if (!validation.valid) {
      expect(validation.error).toContain('too large');
    }
  });

  it('should reject invalid image data during validation', () => {
    const garbage = Buffer.from('This is not an image file');
    const validation = validateImage(garbage);
    expect(validation.valid).toBe(false);
    if (!validation.valid) {
      expect(validation.error).toContain('Unsupported');
    }
  });

  it('should format image sizes correctly for display', () => {
    expect(formatSize(0)).toBe('0 B');
    expect(formatSize(500)).toBe('500 B');
    expect(formatSize(1024)).toBe('1 KB');
    expect(formatSize(128 * 1024)).toBe('128 KB');
    expect(formatSize(1.5 * 1024 * 1024)).toBe('1.5 MB');
  });

  it('should produce correct data URI from toDataUri()', () => {
    const png = makePng(8);
    const uri = toDataUri(png, 'png');
    expect(uri).toMatch(/^data:image\/png;base64,/);

    const jpeg = makeJpeg(8);
    const jpegUri = toDataUri(jpeg, 'jpeg');
    expect(jpegUri).toMatch(/^data:image\/jpeg;base64,/);
  });
});
