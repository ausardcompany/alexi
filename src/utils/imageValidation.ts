/**
 * Image format detection and validation utilities.
 *
 * Detects image format from magic bytes and validates size constraints.
 * No runtime dependencies — operates on raw Buffers.
 */

import { env } from '../config/env.js';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Supported image formats. */
export type ImageFormat = 'png' | 'jpeg' | 'gif' | 'webp';

/** Result of image validation. */
export type ValidationResult =
  | { valid: true; format: ImageFormat; sizeBytes: number }
  | { valid: false; error: string };

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Default maximum image size: 20 MB. */
const DEFAULT_MAX_IMAGE_SIZE_MB = 20;

/** Magic byte signatures for image format detection. */
const IMAGE_SIGNATURES: ReadonlyArray<{
  format: ImageFormat;
  bytes: readonly number[];
  offset: number;
}> = [
  { format: 'png', bytes: [0x89, 0x50, 0x4e, 0x47], offset: 0 },
  { format: 'jpeg', bytes: [0xff, 0xd8, 0xff], offset: 0 },
  { format: 'gif', bytes: [0x47, 0x49, 0x46, 0x38], offset: 0 },
  { format: 'webp', bytes: [0x57, 0x45, 0x42, 0x50], offset: 8 },
];

/** MIME types for each supported format. */
export const IMAGE_MIME_TYPES: Record<ImageFormat, string> = {
  png: 'image/png',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  webp: 'image/webp',
};

// ---------------------------------------------------------------------------
// Functions
// ---------------------------------------------------------------------------

/**
 * Detect image format from magic bytes in a Buffer.
 *
 * @param data - Raw image data.
 * @returns The detected format, or `null` if unrecognized.
 */
export function detectImageFormat(data: Buffer): ImageFormat | null {
  if (!data || data.length === 0) {
    return null;
  }

  for (const sig of IMAGE_SIGNATURES) {
    const { bytes, offset } = sig;
    if (data.length < offset + bytes.length) {
      continue;
    }
    let match = true;
    for (let i = 0; i < bytes.length; i++) {
      if (data[offset + i] !== bytes[i]) {
        match = false;
        break;
      }
    }
    if (match) {
      return sig.format;
    }
  }

  return null;
}

/**
 * Get the configured maximum image size in bytes.
 *
 * Reads from `ALEXI_MAX_IMAGE_SIZE_MB` environment variable, falling back
 * to the default (20 MB).
 */
export function getMaxImageSizeBytes(): number {
  const envValue = env('ALEXI_MAX_IMAGE_SIZE_MB');
  if (envValue) {
    const mb = Number(envValue);
    if (!Number.isNaN(mb) && mb > 0) {
      return mb * 1024 * 1024;
    }
  }
  return DEFAULT_MAX_IMAGE_SIZE_MB * 1024 * 1024;
}

/**
 * Validate image data: check format (magic bytes) and size.
 *
 * @param data - Raw image data.
 * @param maxSizeBytes - Maximum allowed size in bytes. Defaults to configured limit.
 * @returns Validation result with format and size on success, or error message.
 */
export function validateImage(data: Buffer, maxSizeBytes?: number): ValidationResult {
  if (!data || data.length === 0) {
    return { valid: false, error: 'Image data is empty' };
  }

  const limit = maxSizeBytes ?? getMaxImageSizeBytes();
  if (data.length > limit) {
    const sizeMB = (data.length / (1024 * 1024)).toFixed(1);
    const limitMB = (limit / (1024 * 1024)).toFixed(0);
    return {
      valid: false,
      error: `Image too large (${sizeMB} MB > ${limitMB} MB limit)`,
    };
  }

  const format = detectImageFormat(data);
  if (!format) {
    return { valid: false, error: 'Unsupported image format' };
  }

  return { valid: true, format, sizeBytes: data.length };
}

/**
 * Convert image data to a base64 data URI.
 *
 * @param data - Raw image data.
 * @param format - Image format (determines MIME type).
 * @returns Data URI string: `data:image/<format>;base64,<base64data>`
 */
export function toDataUri(data: Buffer, format: ImageFormat): string {
  const mime = IMAGE_MIME_TYPES[format];
  const base64 = data.toString('base64');
  return `data:${mime};base64,${base64}`;
}

/**
 * Format a byte size as a human-readable string.
 *
 * @param bytes - Size in bytes.
 * @returns e.g. "128 KB", "1.5 MB"
 */
export function formatSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  if (bytes < 1024 * 1024) {
    return `${Math.round(bytes / 1024)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
