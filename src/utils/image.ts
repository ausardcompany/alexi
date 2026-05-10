/**
 * Image Processing Utilities
 * Utilities for resizing and optimizing images before sending to LLM providers
 * From PR #26401
 */

export interface ImageProcessingOptions {
  maxWidth?: number;
  maxHeight?: number;
  maxSizeBytes?: number;
  quality?: number;
}

export interface ProcessedImage {
  data: Buffer;
  mimeType: string;
  width: number;
  height: number;
}

/**
 * Process an image buffer with size constraints and optional resizing.
 * Returns the processed image or the original if no processing needed.
 *
 * Note: This is a placeholder implementation. For production use, integrate
 * with sharp, photon-node, or similar image processing library.
 */
export async function processImage(
  input: Buffer,
  mimeType: string,
  options: ImageProcessingOptions = {}
): Promise<ProcessedImage> {
  const { maxWidth = 2048, maxHeight = 2048, maxSizeBytes = 5 * 1024 * 1024 } = options;

  // Check if processing is needed
  if (input.length <= maxSizeBytes) {
    // Return original if within size limits
    // Note: Full implementation would use sharp or similar for dimension checks
    return {
      data: input,
      mimeType,
      width: 0, // Would need actual dimension detection
      height: 0,
    };
  }

  // For actual implementation, integrate with sharp or photon-node
  // Example with sharp:
  // const sharp = require('sharp');
  // const image = sharp(input);
  // const metadata = await image.metadata();
  // if (metadata.width > maxWidth || metadata.height > maxHeight) {
  //   const resized = await image.resize(maxWidth, maxHeight, {
  //     fit: 'inside',
  //     withoutEnlargement: true,
  //   }).toBuffer();
  //   return { data: resized, mimeType, width: maxWidth, height: maxHeight };
  // }

  // Placeholder: return original
  return {
    data: input,
    mimeType,
    width: 0,
    height: 0,
  };
}

/**
 * Check if a buffer represents a supported image format
 */
export function isSupportedImage(mimeType: string): boolean {
  const supported = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  return supported.includes(mimeType.toLowerCase());
}

/**
 * Detect image MIME type from buffer
 */
export function detectImageType(buffer: Buffer): string | null {
  // Check magic numbers
  if (buffer.length < 4) return null;

  // PNG: 89 50 4E 47
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) {
    return 'image/png';
  }

  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return 'image/jpeg';
  }

  // GIF: 47 49 46
  if (buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46) {
    return 'image/gif';
  }

  // WebP: 52 49 46 46 ... 57 45 42 50
  if (
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer.length >= 12 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  ) {
    return 'image/webp';
  }

  return null;
}
