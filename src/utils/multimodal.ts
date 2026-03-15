/**
 * Multimodal message construction utilities.
 *
 * Builds SAP AI SDK-compatible UserChatMessage objects that include both
 * text and image content items.
 */

import { toDataUri, type ImageFormat } from './imageValidation.js';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Text content item in a multimodal message. */
export interface TextContentItem {
  type: 'text';
  text: string;
}

/** Image content item in a multimodal message. */
export interface ImageContentItem {
  type: 'image_url';
  image_url: {
    url: string;
    detail?: string;
  };
}

/** Union of content items in a multimodal user message. */
export type MultimodalContentItem = TextContentItem | ImageContentItem;

/** A user message with multimodal content (array form). */
export interface MultimodalUserMessage {
  role: 'user';
  content: MultimodalContentItem[];
}

/** A plain text user message. */
export interface PlainUserMessage {
  role: 'user';
  content: string;
}

/** Image attachment data needed for message construction. */
export interface ImageForMessage {
  data: Buffer;
  format: ImageFormat;
  detail?: string;
}

// ---------------------------------------------------------------------------
// Functions
// ---------------------------------------------------------------------------

/**
 * Build a user message from text and optional image attachments.
 *
 * - If no images: returns a plain `{ role: 'user', content: text }` for
 *   backward compatibility with the existing text-only pipeline.
 * - If images present: returns a `MultimodalUserMessage` with
 *   `UserChatMessageContentItem[]` containing text + image_url items.
 *
 * @param text - The text content of the message.
 * @param images - Optional image attachments.
 * @returns A plain or multimodal user message.
 */
export function buildUserMessage(
  text: string,
  images?: ImageForMessage[]
): PlainUserMessage | MultimodalUserMessage {
  if (!images || images.length === 0) {
    return { role: 'user', content: text };
  }

  const contentItems: MultimodalContentItem[] = [];

  // Add image items first (convention: images before text)
  for (const img of images) {
    contentItems.push({
      type: 'image_url',
      image_url: {
        url: toDataUri(img.data, img.format),
        detail: img.detail ?? 'auto',
      },
    });
  }

  // Add text item
  if (text.trim().length > 0) {
    contentItems.push({ type: 'text', text });
  }

  return { role: 'user', content: contentItems };
}

/**
 * Check if a message has multimodal content (array content).
 *
 * Useful for the provider layer to detect pre-constructed multimodal
 * messages and pass them through without string coercion.
 */
export function isMultimodalMessage(message: unknown): message is MultimodalUserMessage {
  if (typeof message !== 'object' || message === null) {
    return false;
  }
  const msg = message as Record<string, unknown>;
  return msg.role === 'user' && Array.isArray(msg.content);
}
