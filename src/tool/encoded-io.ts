/**
 * Encoding-aware file I/O utilities
 * Supports detection and conversion of common text encodings:
 * UTF-8, UTF-16LE, UTF-16BE, and Latin-1 (ISO-8859-1)
 */

export interface EncodingInfo {
  encoding: 'utf-8' | 'utf-16le' | 'utf-16be' | 'latin1';
  confidence: number;
  hasBOM: boolean;
  bomBytes?: Buffer;
}

/**
 * Detect file encoding from buffer content.
 * Strategy:
 * 1. BOM sniffing (highest confidence)
 * 2. Heuristic analysis for non-BOM files
 */
export function detectEncoding(buffer: Buffer): EncodingInfo {
  // Check for BOM markers first (highest confidence)
  if (buffer.length >= 3) {
    // UTF-8 BOM: EF BB BF
    if (buffer[0] === 0xef && buffer[1] === 0xbb && buffer[2] === 0xbf) {
      return { encoding: 'utf-8', confidence: 1, hasBOM: true, bomBytes: buffer.slice(0, 3) };
    }
  }

  if (buffer.length >= 2) {
    // UTF-16 LE BOM: FF FE
    if (buffer[0] === 0xff && buffer[1] === 0xfe) {
      return { encoding: 'utf-16le', confidence: 1, hasBOM: true, bomBytes: buffer.slice(0, 2) };
    }
    // UTF-16 BE BOM: FE FF
    if (buffer[0] === 0xfe && buffer[1] === 0xff) {
      return { encoding: 'utf-16be', confidence: 1, hasBOM: true, bomBytes: buffer.slice(0, 2) };
    }
  }

  // Heuristic: detect encoding without BOM
  return detectEncodingHeuristic(buffer);
}

/**
 * Heuristic encoding detection for files without BOM.
 * Checks for:
 * - Valid UTF-8 multi-byte sequences
 * - UTF-16 null byte patterns
 * - Falls back to Latin-1 if high bytes present but invalid UTF-8
 */
function detectEncodingHeuristic(buffer: Buffer): EncodingInfo {
  if (buffer.length === 0) {
    return { encoding: 'utf-8', confidence: 1, hasBOM: false };
  }

  // Check for UTF-16 without BOM by looking for null byte patterns
  // UTF-16LE: ASCII chars appear as [byte, 0x00]
  // UTF-16BE: ASCII chars appear as [0x00, byte]
  if (buffer.length >= 4) {
    const nullsAtOdd = countNullsAtPositions(buffer, 'odd');
    const nullsAtEven = countNullsAtPositions(buffer, 'even');
    const totalPairs = Math.floor(buffer.length / 2);

    // If >30% of odd positions are null, likely UTF-16LE
    if (totalPairs > 0 && nullsAtOdd / totalPairs > 0.3) {
      return { encoding: 'utf-16le', confidence: 0.8, hasBOM: false };
    }
    // If >30% of even positions are null, likely UTF-16BE
    if (totalPairs > 0 && nullsAtEven / totalPairs > 0.3) {
      return { encoding: 'utf-16be', confidence: 0.8, hasBOM: false };
    }
  }

  // Try to validate as UTF-8
  if (isValidUtf8(buffer)) {
    // Check if there are any multi-byte sequences (high bytes)
    const hasHighBytes = buffer.some((b) => b > 0x7f);
    return {
      encoding: 'utf-8',
      confidence: hasHighBytes ? 0.9 : 1,
      hasBOM: false,
    };
  }

  // Invalid UTF-8 with high bytes -> Latin-1
  return { encoding: 'latin1', confidence: 0.7, hasBOM: false };
}

/**
 * Count null bytes at odd or even positions in the buffer.
 * Used for UTF-16 heuristic detection.
 */
function countNullsAtPositions(buffer: Buffer, position: 'odd' | 'even'): number {
  let count = 0;
  const start = position === 'odd' ? 1 : 0;
  for (let i = start; i < buffer.length; i += 2) {
    if (buffer[i] === 0x00) {
      count++;
    }
  }
  return count;
}

/**
 * Validate that a buffer contains valid UTF-8 sequences.
 * Returns false if any invalid multi-byte sequences are found.
 */
function isValidUtf8(buffer: Buffer): boolean {
  let i = 0;
  while (i < buffer.length) {
    const byte = buffer[i];

    if (byte <= 0x7f) {
      // ASCII
      i++;
    } else if ((byte & 0xe0) === 0xc0) {
      // 2-byte sequence: 110xxxxx 10xxxxxx
      if (i + 1 >= buffer.length || (buffer[i + 1] & 0xc0) !== 0x80) {
        return false;
      }
      // Overlong check: must encode values >= 0x80
      if ((byte & 0x1e) === 0) {
        return false;
      }
      i += 2;
    } else if ((byte & 0xf0) === 0xe0) {
      // 3-byte sequence: 1110xxxx 10xxxxxx 10xxxxxx
      if (
        i + 2 >= buffer.length ||
        (buffer[i + 1] & 0xc0) !== 0x80 ||
        (buffer[i + 2] & 0xc0) !== 0x80
      ) {
        return false;
      }
      // Overlong check
      if (byte === 0xe0 && (buffer[i + 1] & 0x20) === 0) {
        return false;
      }
      i += 3;
    } else if ((byte & 0xf8) === 0xf0) {
      // 4-byte sequence: 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
      if (
        i + 3 >= buffer.length ||
        (buffer[i + 1] & 0xc0) !== 0x80 ||
        (buffer[i + 2] & 0xc0) !== 0x80 ||
        (buffer[i + 3] & 0xc0) !== 0x80
      ) {
        return false;
      }
      // Overlong check
      if (byte === 0xf0 && (buffer[i + 1] & 0x30) === 0) {
        return false;
      }
      i += 4;
    } else {
      // Invalid start byte
      return false;
    }
  }
  return true;
}

/**
 * Decode buffer to UTF-8 string based on detected encoding.
 * Strips BOM bytes if present.
 */
export function decodeWithEncoding(buffer: Buffer, encoding: EncodingInfo): string {
  const contentBuffer =
    encoding.hasBOM && encoding.bomBytes ? buffer.slice(encoding.bomBytes.length) : buffer;

  switch (encoding.encoding) {
    case 'utf-8':
      return contentBuffer.toString('utf-8');

    case 'utf-16le':
      return contentBuffer.toString('utf16le');

    case 'utf-16be':
      // Node.js doesn't natively support utf-16be decoding,
      // swap bytes to convert to utf-16le then decode
      return swapBytes(contentBuffer).toString('utf16le');

    case 'latin1':
      return contentBuffer.toString('latin1');

    default:
      return contentBuffer.toString('utf-8');
  }
}

/**
 * Encode UTF-8 string back to buffer in the target encoding.
 * Prepends BOM if the original file had one.
 */
export function encodeWithEncoding(content: string, encoding: EncodingInfo): Buffer {
  let encoded: Buffer;

  switch (encoding.encoding) {
    case 'utf-8':
      encoded = Buffer.from(content, 'utf-8');
      break;

    case 'utf-16le':
      encoded = Buffer.from(content, 'utf16le');
      break;

    case 'utf-16be':
      // Encode as UTF-16LE then swap bytes for BE
      encoded = swapBytes(Buffer.from(content, 'utf16le'));
      break;

    case 'latin1':
      encoded = Buffer.from(content, 'latin1');
      break;

    default:
      encoded = Buffer.from(content, 'utf-8');
      break;
  }

  // Restore BOM if original had one
  if (encoding.hasBOM && encoding.bomBytes) {
    return Buffer.concat([encoding.bomBytes, encoded]);
  }

  return encoded;
}

/**
 * Swap byte pairs in a buffer (for UTF-16 BE/LE conversion).
 */
function swapBytes(buffer: Buffer): Buffer {
  const swapped = Buffer.alloc(buffer.length);
  for (let i = 0; i < buffer.length - 1; i += 2) {
    swapped[i] = buffer[i + 1];
    swapped[i + 1] = buffer[i];
  }
  // Handle odd trailing byte
  if (buffer.length % 2 !== 0) {
    swapped[buffer.length - 1] = buffer[buffer.length - 1];
  }
  return swapped;
}

/**
 * Check if a buffer appears to be a binary (non-text) file.
 * Uses heuristic: checks for null bytes and control characters
 * in the first 8KB of the file, excluding common text control chars.
 */
export function isBinaryFile(buffer: Buffer): boolean {
  // Empty files are not binary
  if (buffer.length === 0) {
    return false;
  }

  // Files with UTF-16 BOM are text, not binary
  if (buffer.length >= 2) {
    if ((buffer[0] === 0xff && buffer[1] === 0xfe) || (buffer[0] === 0xfe && buffer[1] === 0xff)) {
      return false;
    }
  }

  // UTF-8 BOM means text
  if (buffer.length >= 3 && buffer[0] === 0xef && buffer[1] === 0xbb && buffer[2] === 0xbf) {
    return false;
  }

  // Sample the first 8KB for binary detection
  const sampleSize = Math.min(buffer.length, 8192);
  let nullCount = 0;
  let controlCount = 0;

  for (let i = 0; i < sampleSize; i++) {
    const byte = buffer[i];

    // Null bytes strongly indicate binary
    if (byte === 0x00) {
      nullCount++;
    }

    // Control chars (except common text ones: \t, \n, \r)
    if (byte < 0x08 || (byte > 0x0d && byte < 0x1b) || byte === 0x7f) {
      controlCount++;
    }
  }

  // If >1% null bytes, it's binary
  if (nullCount / sampleSize > 0.01) {
    return true;
  }

  // If >10% control characters, it's binary
  if (controlCount / sampleSize > 0.1) {
    return true;
  }

  return false;
}
