import { useInput } from 'ink';
import { useAttachments } from '../context/AttachmentContext.js';

// ---------------------------------------------------------------------------
// useClipboardImage — intercept Ctrl+V to paste images from clipboard
// ---------------------------------------------------------------------------

export interface UseClipboardImageOptions {
  /** Whether clipboard paste is enabled (e.g. disable during streaming). */
  enabled?: boolean;
}

/**
 * Hook that listens for Ctrl+V (raw terminal `\x16`) and triggers a clipboard
 * image read through the AttachmentContext. The hook is a thin integration
 * layer — all heavy lifting happens in `pasteFromClipboard()`.
 */
export function useClipboardImage(options: UseClipboardImageOptions = {}): void {
  const { enabled = true } = options;
  const { pasteFromClipboard, reading } = useAttachments();

  useInput(
    (input, _key) => {
      // Ctrl+V sends \x16 (SYN character) in raw terminal mode
      if (input === '\x16' && !reading) {
        void pasteFromClipboard();
      }
    },
    { isActive: enabled }
  );
}
