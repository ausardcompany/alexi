/**
 * Contracts for clipboard image reading.
 *
 * These types define the interface between the TUI layer and the
 * platform-specific clipboard access implementations.
 */

// ---------------------------------------------------------------------------
// Image format & validation
// ---------------------------------------------------------------------------

/** Supported image formats for clipboard/file paste. */
export type ImageFormat = 'png' | 'jpeg' | 'gif' | 'webp';

/** Magic byte signatures for image format detection. */
export const IMAGE_SIGNATURES: Record<ImageFormat, { bytes: number[]; offset: number }> = {
  png: { bytes: [0x89, 0x50, 0x4e, 0x47], offset: 0 },
  jpeg: { bytes: [0xff, 0xd8, 0xff], offset: 0 },
  gif: { bytes: [0x47, 0x49, 0x46, 0x38], offset: 0 },
  webp: { bytes: [0x57, 0x45, 0x42, 0x50], offset: 8 },
};

// ---------------------------------------------------------------------------
// Clipboard capability detection
// ---------------------------------------------------------------------------

/** Platform-specific clipboard tool identifier. */
export type ClipboardTool = 'pngpaste' | 'xclip' | 'wl-paste' | 'powershell';

/** Detected clipboard capability for the current platform. */
export interface ClipboardCapability {
  /** Whether image clipboard reading is available. */
  available: boolean;
  /** The platform-specific tool that will be used. */
  tool?: ClipboardTool;
  /** Platform identifier. */
  platform: NodeJS.Platform;
  /** Human-readable install instructions if not available. */
  installHint?: string;
}

// ---------------------------------------------------------------------------
// Clipboard read result
// ---------------------------------------------------------------------------

/** Result of reading an image from the clipboard. */
export type ClipboardImageResult =
  | { success: true; data: Buffer; format: ImageFormat }
  | { success: false; error: string };

// ---------------------------------------------------------------------------
// Clipboard reader interface
// ---------------------------------------------------------------------------

/** Interface for platform-specific clipboard image reading. */
export interface ClipboardImageReader {
  /** Detect clipboard capabilities on the current platform. */
  detect(): Promise<ClipboardCapability>;

  /** Read image data from the system clipboard. */
  read(): Promise<ClipboardImageResult>;
}
