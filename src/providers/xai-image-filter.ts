/**
 * xAI (Grok) multimodal image-mime filter.
 *
 * Upstream opencode (2026-10) narrowed the set of image mime types that
 * will be forwarded to xAI's multimodal endpoints after reports that
 * GIF / BMP / TIFF / HEIC uploads either silently drop the image or
 * trigger a 400 from the xAI backend. Only PNG, JPEG, and WebP are
 * accepted; everything else must be filtered out BEFORE the request is
 * built so the model gets a text-only turn instead of a silent failure.
 *
 * Alexi routes multimodal requests through SAP AI Core / SAP
 * Orchestration today and does not yet have a native xAI adapter, so
 * this helper is wired only on-demand by proxy adapters that forward
 * to xAI (e.g. OpenRouter, SAP proxy fronting Grok). Importing this
 * module has no side effects on the SAP AI Core happy path.
 */

/** Lower-cased mime types that xAI accepts on multimodal turns. */
const XAI_ALLOWED_IMAGE_MIME: ReadonlySet<string> = new Set([
  'image/png',
  'image/jpeg',
  'image/jpg', // non-standard but commonly emitted
  'image/webp',
]);

export interface MultimodalAttachment {
  mimeType: string;
  /** base64 / url / Buffer — opaque to this filter. */
  data: unknown;
  [k: string]: unknown;
}

/**
 * Return `true` when the given mime type is safe to forward to xAI.
 * Case-insensitive; strips any `;charset=...` or similar parameters.
 */
export function isXaiAllowedImageMime(mimeType: string): boolean {
  if (!mimeType) {
    return false;
  }
  const normalised = mimeType.split(';')[0].trim().toLowerCase();
  return XAI_ALLOWED_IMAGE_MIME.has(normalised);
}

/**
 * Partition a list of multimodal attachments into those safe to send to
 * xAI and those that must be dropped. The dropped list is returned so
 * callers can log a warning or surface a UX message instead of silently
 * swallowing the content.
 */
export function filterXaiImages<T extends MultimodalAttachment>(
  attachments: readonly T[]
): { kept: T[]; dropped: T[] } {
  const kept: T[] = [];
  const dropped: T[] = [];
  for (const att of attachments) {
    if (isXaiAllowedImageMime(att.mimeType)) {
      kept.push(att);
    } else {
      dropped.push(att);
    }
  }
  return { kept, dropped };
}
