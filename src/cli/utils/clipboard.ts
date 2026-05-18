/* eslint-disable no-undef */
/**
 * Clipboard text copy utility with fallback support
 * Provides cross-platform clipboard text copying functionality
 */

/**
 * Copy text to clipboard with fallback for environments where navigator.clipboard fails
 * @param text - Text to copy to clipboard
 * @returns Promise<boolean> - true if successful, false otherwise
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  // Try modern clipboard API first
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      // Fall through to fallback
      console.debug('navigator.clipboard failed, trying fallback', err);
    }
  }

  // Fallback to execCommand for environments where clipboard API fails
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    textArea.style.top = '-9999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    const success = document.execCommand('copy');
    document.body.removeChild(textArea);
    return success;
  } catch (err) {
    console.error('Clipboard fallback failed', err);
    return false;
  }
}
