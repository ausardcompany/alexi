/**
 * MIME / media type detection for attachments.
 *
 * Ports opencode `421e44e` and `c54677b`:
 *   - `421e44e` adds `.avif`, `.heic`, `.heif`, `.mov`, `.m4a` to the
 *     extension-based media type table so attachments with those
 *     extensions upload correctly instead of being rejected as "unknown".
 *   - `c54677b` disambiguates HEIC, QuickTime, and M4A files from
 *     generic MP4 by inspecting the `ftyp` box brand in the first 12
 *     bytes. All four formats share the ISO BMFF container so a bare
 *     extension OR a bare `video/mp4` fallback misidentifies them.
 *
 * The detection order is:
 *   1. {@link detectMediaFromMagic} — look at the ftyp box brand.
 *   2. {@link mediaTypeForExtension} — fall back to the extension table.
 *   3. Return `undefined` so the caller can decide whether to reject.
 *
 * Keeping magic-byte detection ahead of the extension table matters for
 * iOS/macOS screenshot pastes: Preview often renames `.heic` to `.jpg`
 * before export, and clipboard contents arrive extension-less. Reading
 * the ftyp brand catches those cases.
 */

/**
 * Extension → media type table.
 *
 * The HEIC / QuickTime / M4A entries intentionally use the same media
 * types the magic-byte path returns, so a mis-extensioned file gets the
 * correct type via `detectMediaFromMagic` first, then falls back to
 * extension if the file is too short to carry a usable ftyp box.
 */
const EXTENSION_MEDIA_TYPES: Record<string, string> = {
  // Images
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.heic': 'image/heic',
  '.heif': 'image/heif',
  '.svg': 'image/svg+xml',
  '.bmp': 'image/bmp',
  '.tiff': 'image/tiff',
  '.tif': 'image/tiff',

  // Audio
  '.m4a': 'audio/mp4',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.ogg': 'audio/ogg',
  '.flac': 'audio/flac',
  '.aac': 'audio/aac',

  // Video
  '.mp4': 'video/mp4',
  '.mov': 'video/quicktime',
  '.webm': 'video/webm',
  '.mkv': 'video/x-matroska',
  '.avi': 'video/x-msvideo',

  // Documents
  '.pdf': 'application/pdf',
  '.json': 'application/json',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
  '.md': 'text/markdown',
  '.csv': 'text/csv',
  '.html': 'text/html',
};

/**
 * Return the media type registered for a filename extension, or
 * `undefined` for unknown extensions. Case-insensitive; the leading dot
 * is required (`'.png'`, not `'png'`).
 */
export function mediaTypeForExtension(ext: string): string | undefined {
  return EXTENSION_MEDIA_TYPES[ext.toLowerCase()];
}

/**
 * Decode an ASCII brand from a byte range. Returns an empty string if
 * the range is out of bounds — safer than throwing on short buffers.
 */
function decodeBrand(bytes: Uint8Array, start: number, end: number): string {
  if (end > bytes.length) {
    return '';
  }
  return new TextDecoder('ascii').decode(bytes.slice(start, end));
}

/**
 * Inspect the leading bytes of a file for an ISO BMFF `ftyp` box and
 * return the specific media type based on the brand.
 *
 * The ftyp box layout (per ISO/IEC 14496-12):
 *   offset 0..3  : box size (uint32 BE)
 *   offset 4..7  : box type, must be 'ftyp' (0x66 0x74 0x79 0x70)
 *   offset 8..11 : major brand (ASCII)
 *   offset 12+   : minor version, compatible brands
 *
 * We branch on the major brand:
 *   - heic / heix / mif1  → image/heic
 *   - qt                  → video/quicktime
 *   - M4A                 → audio/mp4
 *   - mp4* / isom / iso2  → video/mp4 (generic MP4 fallback)
 *
 * Returns `undefined` when the leading bytes do not carry an ftyp box
 * or the brand is unrecognised — the caller falls back to the extension
 * table.
 */
export function detectMediaFromMagic(bytes: Uint8Array): string | undefined {
  if (bytes.length < 12) {
    return undefined;
  }
  // Check for 'ftyp' at offset 4.
  if (bytes[4] !== 0x66 || bytes[5] !== 0x74 || bytes[6] !== 0x79 || bytes[7] !== 0x70) {
    return undefined;
  }
  const brand = decodeBrand(bytes, 8, 12);
  // HEIF/HEIC family — ISO 23008-12.
  if (brand.startsWith('heic') || brand.startsWith('heix') || brand === 'mif1') {
    return 'image/heic';
  }
  // Apple QuickTime — brand 'qt  ' (with trailing spaces).
  if (brand.startsWith('qt  ')) {
    return 'video/quicktime';
  }
  // Apple M4A audio.
  if (brand.startsWith('M4A ')) {
    return 'audio/mp4';
  }
  // Generic MP4 family — covers mp41, mp42, isom, iso2.
  if (brand.startsWith('mp4') || brand.startsWith('isom') || brand.startsWith('iso2')) {
    return 'video/mp4';
  }
  return undefined;
}

/**
 * One-shot media type detection: magic bytes first (for mis-extensioned
 * or extension-less payloads), extension fallback, then `undefined`.
 *
 * `filename` may be an empty string if no extension context is
 * available (e.g. clipboard paste); the magic-byte path alone will
 * decide.
 */
export function detectMediaType(bytes: Uint8Array, filename = ''): string | undefined {
  const magic = detectMediaFromMagic(bytes);
  if (magic) {
    return magic;
  }
  const dot = filename.lastIndexOf('.');
  if (dot >= 0) {
    return mediaTypeForExtension(filename.slice(dot));
  }
  return undefined;
}

/**
 * Exported for tests and introspection commands that want to list the
 * full extension mapping.
 */
export function getExtensionMediaTypes(): Readonly<Record<string, string>> {
  return EXTENSION_MEDIA_TYPES;
}
