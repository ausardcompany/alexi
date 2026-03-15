import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  detectImageFormat,
  validateImage,
  toDataUri,
  formatSize,
  getMaxImageSizeBytes,
} from '../src/utils/imageValidation.js';

// ---------------------------------------------------------------------------
// Magic byte helpers
// ---------------------------------------------------------------------------

/** Create a minimal PNG-like buffer (magic bytes only). */
function makePngBuffer(size = 64): Buffer {
  const buf = Buffer.alloc(size);
  // PNG signature: 89 50 4E 47 0D 0A 1A 0A
  buf[0] = 0x89;
  buf[1] = 0x50;
  buf[2] = 0x4e;
  buf[3] = 0x47;
  return buf;
}

/** Create a minimal JPEG-like buffer. */
function makeJpegBuffer(size = 64): Buffer {
  const buf = Buffer.alloc(size);
  // JPEG signature: FF D8 FF
  buf[0] = 0xff;
  buf[1] = 0xd8;
  buf[2] = 0xff;
  return buf;
}

/** Create a minimal GIF-like buffer. */
function makeGifBuffer(size = 64): Buffer {
  const buf = Buffer.alloc(size);
  // GIF signature: 47 49 46 38
  buf[0] = 0x47;
  buf[1] = 0x49;
  buf[2] = 0x46;
  buf[3] = 0x38;
  return buf;
}

/** Create a minimal WebP-like buffer (needs RIFF header + WEBP at offset 8). */
function makeWebpBuffer(size = 64): Buffer {
  const buf = Buffer.alloc(size);
  // RIFF header
  buf[0] = 0x52; // R
  buf[1] = 0x49; // I
  buf[2] = 0x46; // F
  buf[3] = 0x46; // F
  // WEBP at offset 8
  buf[8] = 0x57; // W
  buf[9] = 0x45; // E
  buf[10] = 0x42; // B
  buf[11] = 0x50; // P
  return buf;
}

// ---------------------------------------------------------------------------
// detectImageFormat
// ---------------------------------------------------------------------------

describe('detectImageFormat', () => {
  it('should detect PNG format', () => {
    expect(detectImageFormat(makePngBuffer())).toBe('png');
  });

  it('should detect JPEG format', () => {
    expect(detectImageFormat(makeJpegBuffer())).toBe('jpeg');
  });

  it('should detect GIF format', () => {
    expect(detectImageFormat(makeGifBuffer())).toBe('gif');
  });

  it('should detect WebP format', () => {
    expect(detectImageFormat(makeWebpBuffer())).toBe('webp');
  });

  it('should return null for empty buffer', () => {
    expect(detectImageFormat(Buffer.alloc(0))).toBeNull();
  });

  it('should return null for unrecognized data', () => {
    const buf = Buffer.from('hello world this is not an image');
    expect(detectImageFormat(buf)).toBeNull();
  });

  it('should return null for buffer too short for any signature', () => {
    const buf = Buffer.from([0x89, 0x50]); // Only 2 bytes of PNG sig
    expect(detectImageFormat(buf)).toBeNull();
  });

  it('should handle buffer just long enough for JPEG (3 bytes)', () => {
    const buf = Buffer.from([0xff, 0xd8, 0xff]);
    expect(detectImageFormat(buf)).toBe('jpeg');
  });

  it('should handle buffer too short for WebP (needs offset 8)', () => {
    // Buffer has RIFF header but is too short for WEBP check at offset 8
    const buf = Buffer.from([0x52, 0x49, 0x46, 0x46, 0x00, 0x00, 0x00, 0x00]);
    expect(detectImageFormat(buf)).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// validateImage
// ---------------------------------------------------------------------------

describe('validateImage', () => {
  it('should validate a valid PNG', () => {
    const result = validateImage(makePngBuffer(1024));
    expect(result).toEqual({ valid: true, format: 'png', sizeBytes: 1024 });
  });

  it('should validate a valid JPEG', () => {
    const result = validateImage(makeJpegBuffer(2048));
    expect(result).toEqual({ valid: true, format: 'jpeg', sizeBytes: 2048 });
  });

  it('should reject empty buffer', () => {
    const result = validateImage(Buffer.alloc(0));
    expect(result).toEqual({ valid: false, error: 'Image data is empty' });
  });

  it('should reject oversized image with custom limit', () => {
    const maxSize = 100; // 100 bytes
    const data = makePngBuffer(200);
    const result = validateImage(data, maxSize);
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.error).toContain('too large');
      expect(result.error).toContain('MB');
    }
  });

  it('should reject unrecognized format', () => {
    const data = Buffer.from('not an image but long enough data string here');
    const result = validateImage(data);
    expect(result).toEqual({ valid: false, error: 'Unsupported image format' });
  });

  it('should accept image exactly at size limit', () => {
    const maxSize = 1024;
    const data = makePngBuffer(1024);
    const result = validateImage(data, maxSize);
    expect(result).toEqual({ valid: true, format: 'png', sizeBytes: 1024 });
  });

  it('should reject image 1 byte over limit', () => {
    const maxSize = 1024;
    const data = makePngBuffer(1025);
    const result = validateImage(data, maxSize);
    expect(result.valid).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// getMaxImageSizeBytes
// ---------------------------------------------------------------------------

describe('getMaxImageSizeBytes', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should return default 20 MB when env var is not set', () => {
    delete process.env.ALEXI_MAX_IMAGE_SIZE_MB;
    expect(getMaxImageSizeBytes()).toBe(20 * 1024 * 1024);
  });

  it('should read from ALEXI_MAX_IMAGE_SIZE_MB env var', () => {
    process.env.ALEXI_MAX_IMAGE_SIZE_MB = '10';
    expect(getMaxImageSizeBytes()).toBe(10 * 1024 * 1024);
  });

  it('should ignore invalid env var value', () => {
    process.env.ALEXI_MAX_IMAGE_SIZE_MB = 'not-a-number';
    expect(getMaxImageSizeBytes()).toBe(20 * 1024 * 1024);
  });

  it('should ignore negative env var value', () => {
    process.env.ALEXI_MAX_IMAGE_SIZE_MB = '-5';
    expect(getMaxImageSizeBytes()).toBe(20 * 1024 * 1024);
  });
});

// ---------------------------------------------------------------------------
// toDataUri
// ---------------------------------------------------------------------------

describe('toDataUri', () => {
  it('should create PNG data URI', () => {
    const data = Buffer.from([1, 2, 3, 4]);
    const uri = toDataUri(data, 'png');
    expect(uri).toBe(`data:image/png;base64,${data.toString('base64')}`);
  });

  it('should create JPEG data URI', () => {
    const data = Buffer.from([0xff, 0xd8, 0xff]);
    const uri = toDataUri(data, 'jpeg');
    expect(uri).toMatch(/^data:image\/jpeg;base64,/);
  });

  it('should create GIF data URI', () => {
    const uri = toDataUri(Buffer.from([1]), 'gif');
    expect(uri).toMatch(/^data:image\/gif;base64,/);
  });

  it('should create WebP data URI', () => {
    const uri = toDataUri(Buffer.from([1]), 'webp');
    expect(uri).toMatch(/^data:image\/webp;base64,/);
  });
});

// ---------------------------------------------------------------------------
// formatSize
// ---------------------------------------------------------------------------

describe('formatSize', () => {
  it('should format bytes', () => {
    expect(formatSize(500)).toBe('500 B');
  });

  it('should format kilobytes', () => {
    expect(formatSize(1024)).toBe('1 KB');
    expect(formatSize(128 * 1024)).toBe('128 KB');
  });

  it('should format megabytes', () => {
    expect(formatSize(1024 * 1024)).toBe('1.0 MB');
    expect(formatSize(1.5 * 1024 * 1024)).toBe('1.5 MB');
  });

  it('should handle zero', () => {
    expect(formatSize(0)).toBe('0 B');
  });
});
