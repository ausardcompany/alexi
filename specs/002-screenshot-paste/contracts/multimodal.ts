/**
 * Contracts for multimodal message construction.
 *
 * These types bridge the gap between the TUI attachment layer and the
 * SAP AI SDK's UserChatMessage type. They define how text + images are
 * combined into a single multimodal user message.
 */

// ---------------------------------------------------------------------------
// Multimodal content items
// ---------------------------------------------------------------------------

/** Text content item in a multimodal message. */
export interface TextContentItem {
  type: 'text';
  text: string;
}

/** Image content item in a multimodal message (base64 data URI). */
export interface ImageContentItem {
  type: 'image_url';
  image_url: {
    /** Base64 data URI: `data:image/<format>;base64,<data>` */
    url: string;
    /** Detail level. Default: 'auto'. */
    detail?: string;
  };
}

/** Union of content items in a multimodal user message. */
export type MultimodalContentItem = TextContentItem | ImageContentItem;

// ---------------------------------------------------------------------------
// Multimodal user message
// ---------------------------------------------------------------------------

/**
 * A user message with multimodal content.
 *
 * Compatible with SAP AI SDK's UserChatMessage type:
 * ```typescript
 * type UserChatMessage = {
 *   content: UserChatMessageContent; // string | UserChatMessageContentItem[]
 *   role: 'user';
 * };
 * ```
 */
export interface MultimodalUserMessage {
  role: 'user';
  content: MultimodalContentItem[];
}

// ---------------------------------------------------------------------------
// Message builder
// ---------------------------------------------------------------------------

/** Options for building a multimodal message. */
export interface BuildMultimodalMessageOptions {
  /** The text content of the message. */
  text: string;
  /** Image attachments to include. Each is a base64 data URI. */
  images: Array<{
    dataUri: string;
    detail?: string;
  }>;
}

/**
 * Build a multimodal UserChatMessage from text and image attachments.
 *
 * If no images are provided, returns a plain text message
 * `{ role: 'user', content: text }` for backward compatibility.
 */
export type BuildMultimodalMessage = (
  options: BuildMultimodalMessageOptions
) => { role: 'user'; content: string } | MultimodalUserMessage;
