/**
 * Contracts for image attachment state management.
 *
 * These types define the React context and hook interfaces for managing
 * pending image attachments in the TUI input.
 */

import type { ImageFormat } from './clipboard.js';

// ---------------------------------------------------------------------------
// Image attachment
// ---------------------------------------------------------------------------

/** A pending image attachment before message submission. */
export interface ImageAttachment {
  /** Unique identifier for this attachment (nanoid). */
  id: string;
  /** Raw image data as a Buffer. */
  data: Buffer;
  /** Detected image format from magic bytes. */
  format: ImageFormat;
  /** Image dimensions if detectable. */
  dimensions?: { width: number; height: number };
  /** Size in bytes of the raw data. */
  sizeBytes: number;
  /** Source of the image. */
  source: 'clipboard' | 'file';
  /** Original file path if source is 'file'. */
  filePath?: string;
  /** Timestamp when the attachment was created. */
  createdAt: number;
}

/** Lightweight version for display purposes (no raw data). */
export interface ImageAttachmentPreview {
  id: string;
  format: ImageFormat;
  dimensions?: { width: number; height: number };
  sizeBytes: number;
  source: 'clipboard' | 'file';
  filePath?: string;
}

// ---------------------------------------------------------------------------
// Attachment state
// ---------------------------------------------------------------------------

/** State managed by useAttachments hook. */
export interface AttachmentsState {
  /** Currently pending image attachments (not yet submitted). */
  pending: ImageAttachment[];
  /** Whether a clipboard read is in progress. */
  reading: boolean;
  /** Last error from clipboard read or file read. */
  error?: string;
}

// ---------------------------------------------------------------------------
// Attachment actions
// ---------------------------------------------------------------------------

/** Actions available from the useAttachments hook. */
export interface AttachmentsActions {
  /** Read image from clipboard and add as attachment. */
  pasteFromClipboard(): Promise<void>;
  /** Read image from file path and add as attachment. */
  addFromFile(filePath: string): Promise<void>;
  /** Remove a specific attachment by ID. */
  remove(id: string): void;
  /** Clear all pending attachments. */
  clearAll(): void;
  /**
   * Consume all pending attachments (called on message submit).
   * Returns the attachments and clears the pending list.
   */
  consumeAll(): ImageAttachment[];
}

// ---------------------------------------------------------------------------
// useAttachments hook return type
// ---------------------------------------------------------------------------

/** Return type of the useAttachments hook. */
export type UseAttachmentsReturn = AttachmentsState & AttachmentsActions;
