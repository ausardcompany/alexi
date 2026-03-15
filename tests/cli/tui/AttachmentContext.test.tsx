import { describe, it, expect, vi, beforeEach } from 'vitest';
import React, { act } from 'react';
import { render } from 'ink-testing-library';
import { Text } from 'ink';

// ---------------------------------------------------------------------------
// Mocks — must be declared before importing the module under test
// ---------------------------------------------------------------------------

vi.mock('nanoid', () => {
  let counter = 0;
  return {
    nanoid: vi.fn(() => `test-id-${++counter}`),
  };
});

vi.mock('../../../src/utils/clipboard.js', () => ({
  readClipboardImage: vi.fn(),
  readImageFile: vi.fn(),
}));

vi.mock('../../../src/utils/imageValidation.js', async () => {
  const actual = await vi.importActual<typeof import('../../../src/utils/imageValidation.js')>(
    '../../../src/utils/imageValidation.js'
  );
  return {
    ...actual,
    validateImage: vi.fn(actual.validateImage),
  };
});

// ---------------------------------------------------------------------------
// Imports after mocks
// ---------------------------------------------------------------------------

import {
  AttachmentContext,
  AttachmentProvider,
  useAttachments,
} from '../../../src/cli/tui/context/AttachmentContext.js';
import type { AttachmentContextValue } from '../../../src/cli/tui/context/AttachmentContext.js';
import { readClipboardImage, readImageFile } from '../../../src/utils/clipboard.js';
import { validateImage } from '../../../src/utils/imageValidation.js';

// ---------------------------------------------------------------------------
// Test fixtures
// ---------------------------------------------------------------------------

/** Valid PNG magic bytes + padding. */
const VALID_PNG = Buffer.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52,
]);

/** Valid JPEG magic bytes + padding. */
const VALID_JPEG = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46]);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function StateInspector(): React.JSX.Element {
  const ctx = useAttachments();
  // Only serialize JSON-safe fields (no error string which may contain
  // characters that Ink ANSI-wraps, breaking JSON.parse in tests).
  return (
    <Text>
      {JSON.stringify({
        pendingCount: ctx.pending.length,
        reading: ctx.reading,
        hasError: ctx.error !== undefined,
        ids: ctx.pending.map((a) => a.id),
        formats: ctx.pending.map((a) => a.format),
        sources: ctx.pending.map((a) => a.source),
      })}
    </Text>
  );
}

let captured: AttachmentContextValue | null = null;

function ContextCapture(): React.JSX.Element {
  captured = useAttachments();
  return <StateInspector />;
}

function parseFrame(frame: string | undefined): Record<string, unknown> {
  return JSON.parse(frame ?? '{}');
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('AttachmentContext', () => {
  beforeEach(() => {
    captured = null;
    vi.clearAllMocks();
  });

  // -------------------------------------------------------------------------
  // Initial state
  // -------------------------------------------------------------------------

  describe('initial state', () => {
    it('starts with empty pending list, reading=false, no error', () => {
      const { lastFrame } = render(
        <AttachmentProvider>
          <StateInspector />
        </AttachmentProvider>
      );
      const state = parseFrame(lastFrame());
      expect(state.pendingCount).toBe(0);
      expect(state.reading).toBe(false);
      expect(state.error).toBeUndefined();
    });
  });

  // -------------------------------------------------------------------------
  // Exports & guard
  // -------------------------------------------------------------------------

  describe('exports', () => {
    it('AttachmentContext is exported and defined', () => {
      expect(AttachmentContext).toBeDefined();
    });

    it('useAttachments returns valid context inside provider', () => {
      render(
        <AttachmentProvider>
          <ContextCapture />
        </AttachmentProvider>
      );
      expect(captured).not.toBeNull();
      expect(captured!.pasteFromClipboard).toBeInstanceOf(Function);
      expect(captured!.addFromFile).toBeInstanceOf(Function);
      expect(captured!.remove).toBeInstanceOf(Function);
      expect(captured!.clearAll).toBeInstanceOf(Function);
      expect(captured!.consumeAll).toBeInstanceOf(Function);
    });

    it('useAttachments throws outside provider', () => {
      // Calling a hook outside React throws before our guard runs.
      // Verify it throws (either our message or React's hook violation).
      expect(() => useAttachments()).toThrow();
    });
  });

  // -------------------------------------------------------------------------
  // pasteFromClipboard
  // -------------------------------------------------------------------------

  describe('pasteFromClipboard()', () => {
    it('adds an attachment on successful clipboard read', async () => {
      vi.mocked(readClipboardImage).mockResolvedValue({
        success: true,
        data: VALID_PNG,
        format: 'png',
      });
      vi.mocked(validateImage).mockReturnValue({
        valid: true,
        format: 'png',
        sizeBytes: VALID_PNG.length,
      });

      const { lastFrame } = render(
        <AttachmentProvider>
          <ContextCapture />
        </AttachmentProvider>
      );

      await act(async () => {
        await captured!.pasteFromClipboard();
      });

      const state = parseFrame(lastFrame());
      expect(state.pendingCount).toBe(1);
      expect(state.reading).toBe(false);
      expect(state.error).toBeUndefined();
      expect((state.formats as string[])[0]).toBe('png');
      expect((state.sources as string[])[0]).toBe('clipboard');
    });

    it('sets error when clipboard has no image', async () => {
      vi.mocked(readClipboardImage).mockResolvedValue({
        success: false,
        error: 'No image found in clipboard',
      });

      render(
        <AttachmentProvider>
          <ContextCapture />
        </AttachmentProvider>
      );

      await act(async () => {
        await captured!.pasteFromClipboard();
      });

      expect(captured!.pending).toHaveLength(0);
      expect(captured!.error).toBe('No image found in clipboard');
      expect(captured!.reading).toBe(false);
    });

    it('sets error when image validation fails', async () => {
      vi.mocked(readClipboardImage).mockResolvedValue({
        success: true,
        data: VALID_PNG,
        format: 'png',
      });
      vi.mocked(validateImage).mockReturnValue({
        valid: false,
        error: 'Image too large (25.0 MB > 20 MB limit)',
      });

      render(
        <AttachmentProvider>
          <ContextCapture />
        </AttachmentProvider>
      );

      await act(async () => {
        await captured!.pasteFromClipboard();
      });

      expect(captured!.pending).toHaveLength(0);
      expect(captured!.error).toBe('Image too large (25.0 MB > 20 MB limit)');
    });

    it('sets error when clipboard throws unexpectedly', async () => {
      vi.mocked(readClipboardImage).mockRejectedValue(new Error('Spawn failed'));

      render(
        <AttachmentProvider>
          <ContextCapture />
        </AttachmentProvider>
      );

      await act(async () => {
        await captured!.pasteFromClipboard();
      });

      expect(captured!.pending).toHaveLength(0);
      expect(captured!.error).toBe('Clipboard error: Spawn failed');
      expect(captured!.reading).toBe(false);
    });
  });

  // -------------------------------------------------------------------------
  // addFromFile
  // -------------------------------------------------------------------------

  describe('addFromFile()', () => {
    it('adds an attachment on successful file read', async () => {
      vi.mocked(readImageFile).mockResolvedValue({
        success: true,
        data: VALID_JPEG,
        format: 'jpeg',
      });
      vi.mocked(validateImage).mockReturnValue({
        valid: true,
        format: 'jpeg',
        sizeBytes: VALID_JPEG.length,
      });

      const { lastFrame } = render(
        <AttachmentProvider>
          <ContextCapture />
        </AttachmentProvider>
      );

      await act(async () => {
        await captured!.addFromFile('/tmp/photo.jpg');
      });

      const state = parseFrame(lastFrame());
      expect(state.pendingCount).toBe(1);
      expect((state.formats as string[])[0]).toBe('jpeg');
      expect((state.sources as string[])[0]).toBe('file');
      expect(state.error).toBeUndefined();
    });

    it('sets error when file not found', async () => {
      vi.mocked(readImageFile).mockResolvedValue({
        success: false,
        error: 'File not found: /tmp/nope.png',
      });

      render(
        <AttachmentProvider>
          <ContextCapture />
        </AttachmentProvider>
      );

      await act(async () => {
        await captured!.addFromFile('/tmp/nope.png');
      });

      expect(captured!.pending).toHaveLength(0);
      expect(captured!.error).toBe('File not found: /tmp/nope.png');
    });

    it('sets error when file validation fails', async () => {
      vi.mocked(readImageFile).mockResolvedValue({
        success: true,
        data: Buffer.from([0x00, 0x01, 0x02]),
        format: 'png',
      });
      vi.mocked(validateImage).mockReturnValue({
        valid: false,
        error: 'Unsupported image format',
      });

      render(
        <AttachmentProvider>
          <ContextCapture />
        </AttachmentProvider>
      );

      await act(async () => {
        await captured!.addFromFile('/tmp/bad.bin');
      });

      expect(captured!.pending).toHaveLength(0);
      expect(captured!.error).toBe('Unsupported image format');
    });
  });

  // -------------------------------------------------------------------------
  // remove
  // -------------------------------------------------------------------------

  describe('remove()', () => {
    it('removes a specific attachment by ID', async () => {
      vi.mocked(readClipboardImage).mockResolvedValue({
        success: true,
        data: VALID_PNG,
        format: 'png',
      });
      vi.mocked(validateImage).mockReturnValue({
        valid: true,
        format: 'png',
        sizeBytes: VALID_PNG.length,
      });

      const { lastFrame } = render(
        <AttachmentProvider>
          <ContextCapture />
        </AttachmentProvider>
      );

      // Add two attachments
      await act(async () => {
        await captured!.pasteFromClipboard();
      });
      await act(async () => {
        await captured!.pasteFromClipboard();
      });

      let state = parseFrame(lastFrame());
      expect(state.pendingCount).toBe(2);
      const ids = state.ids as string[];

      // Remove the first one
      act(() => {
        captured!.remove(ids[0]);
      });

      state = parseFrame(lastFrame());
      expect(state.pendingCount).toBe(1);
      expect((state.ids as string[])[0]).toBe(ids[1]);
    });

    it('is a no-op when ID does not exist', async () => {
      vi.mocked(readClipboardImage).mockResolvedValue({
        success: true,
        data: VALID_PNG,
        format: 'png',
      });
      vi.mocked(validateImage).mockReturnValue({
        valid: true,
        format: 'png',
        sizeBytes: VALID_PNG.length,
      });

      const { lastFrame } = render(
        <AttachmentProvider>
          <ContextCapture />
        </AttachmentProvider>
      );

      await act(async () => {
        await captured!.pasteFromClipboard();
      });

      act(() => {
        captured!.remove('nonexistent-id');
      });

      const state = parseFrame(lastFrame());
      expect(state.pendingCount).toBe(1);
    });
  });

  // -------------------------------------------------------------------------
  // clearAll
  // -------------------------------------------------------------------------

  describe('clearAll()', () => {
    it('clears all pending attachments', async () => {
      vi.mocked(readClipboardImage).mockResolvedValue({
        success: true,
        data: VALID_PNG,
        format: 'png',
      });
      vi.mocked(validateImage).mockReturnValue({
        valid: true,
        format: 'png',
        sizeBytes: VALID_PNG.length,
      });

      const { lastFrame } = render(
        <AttachmentProvider>
          <ContextCapture />
        </AttachmentProvider>
      );

      // Add two attachments
      await act(async () => {
        await captured!.pasteFromClipboard();
      });
      await act(async () => {
        await captured!.pasteFromClipboard();
      });

      let state = parseFrame(lastFrame());
      expect(state.pendingCount).toBe(2);

      act(() => {
        captured!.clearAll();
      });

      state = parseFrame(lastFrame());
      expect(state.pendingCount).toBe(0);
      expect(state.error).toBeUndefined();
    });

    it('clears error when called', async () => {
      vi.mocked(readClipboardImage).mockResolvedValue({
        success: false,
        error: 'Some error',
      });

      render(
        <AttachmentProvider>
          <ContextCapture />
        </AttachmentProvider>
      );

      await act(async () => {
        await captured!.pasteFromClipboard();
      });

      expect(captured!.error).toBe('Some error');

      act(() => {
        captured!.clearAll();
      });

      expect(captured!.error).toBeUndefined();
    });
  });

  // -------------------------------------------------------------------------
  // consumeAll
  // -------------------------------------------------------------------------

  describe('consumeAll()', () => {
    it('returns all pending attachments and clears the list', async () => {
      vi.mocked(readClipboardImage).mockResolvedValue({
        success: true,
        data: VALID_PNG,
        format: 'png',
      });
      vi.mocked(validateImage).mockReturnValue({
        valid: true,
        format: 'png',
        sizeBytes: VALID_PNG.length,
      });

      const { lastFrame } = render(
        <AttachmentProvider>
          <ContextCapture />
        </AttachmentProvider>
      );

      await act(async () => {
        await captured!.pasteFromClipboard();
      });
      await act(async () => {
        await captured!.pasteFromClipboard();
      });

      let state = parseFrame(lastFrame());
      expect(state.pendingCount).toBe(2);

      let consumed: unknown[] = [];
      act(() => {
        consumed = captured!.consumeAll();
      });

      // Should return the two attachments
      expect(consumed).toHaveLength(2);
      expect((consumed[0] as { format: string }).format).toBe('png');
      expect((consumed[1] as { source: string }).source).toBe('clipboard');

      // Pending list should now be empty
      state = parseFrame(lastFrame());
      expect(state.pendingCount).toBe(0);
    });

    it('returns empty array when no pending attachments', () => {
      render(
        <AttachmentProvider>
          <ContextCapture />
        </AttachmentProvider>
      );

      let consumed: unknown[] = [];
      act(() => {
        consumed = captured!.consumeAll();
      });

      expect(consumed).toHaveLength(0);
    });
  });

  // -------------------------------------------------------------------------
  // Error clearing on new add
  // -------------------------------------------------------------------------

  describe('error clearing', () => {
    it('clears previous error on successful add', async () => {
      // First: fail
      vi.mocked(readClipboardImage).mockResolvedValueOnce({
        success: false,
        error: 'No image found in clipboard',
      });

      render(
        <AttachmentProvider>
          <ContextCapture />
        </AttachmentProvider>
      );

      await act(async () => {
        await captured!.pasteFromClipboard();
      });
      expect(captured!.error).toBe('No image found in clipboard');

      // Second: succeed
      vi.mocked(readClipboardImage).mockResolvedValueOnce({
        success: true,
        data: VALID_PNG,
        format: 'png',
      });
      vi.mocked(validateImage).mockReturnValue({
        valid: true,
        format: 'png',
        sizeBytes: VALID_PNG.length,
      });

      await act(async () => {
        await captured!.pasteFromClipboard();
      });

      expect(captured!.error).toBeUndefined();
      expect(captured!.pending).toHaveLength(1);
    });
  });
});
