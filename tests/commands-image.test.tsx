/**
 * Unit tests for /image and /clear-images slash commands.
 *
 * Tests the command execution logic through the useCommands hook by mocking
 * all React context dependencies and rendering within ink-testing-library.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render } from 'ink-testing-library';
import { Text } from 'ink';

// ---------------------------------------------------------------------------
// Mocks — must be declared before any imports that use them
// ---------------------------------------------------------------------------

const mockOpen = vi.fn().mockResolvedValue(undefined);
const mockSetTheme = vi.fn();
const mockPasteFromClipboard = vi.fn().mockResolvedValue(undefined);
const mockAddFromFile = vi.fn().mockResolvedValue(undefined);
const mockClearAll = vi.fn();
const mockSetModel = vi.fn();
const mockSetAgent = vi.fn();

vi.mock('../src/cli/tui/context/SessionContext.js', () => ({
  useSession: () => ({
    sessionId: 'test-session-id',
    model: 'gpt-4o',
    agent: 'code',
    setModel: mockSetModel,
    setAgent: mockSetAgent,
  }),
}));

vi.mock('../src/cli/tui/context/DialogContext.js', () => ({
  useDialog: () => ({ open: mockOpen }),
}));

vi.mock('../src/cli/tui/context/ThemeContext.js', () => ({
  useTheme: () => ({ setTheme: mockSetTheme, theme: 'dark' }),
}));

vi.mock('../src/cli/tui/context/AttachmentContext.js', () => ({
  useAttachments: () => ({
    pending: [],
    reading: false,
    error: null,
    pasteFromClipboard: mockPasteFromClipboard,
    addFromFile: mockAddFromFile,
    remove: vi.fn(),
    clearAll: mockClearAll,
    consumeAll: vi.fn().mockReturnValue([]),
  }),
}));

// Import after mocks
import { useCommands } from '../src/cli/tui/hooks/useCommands.js';
import type { UseCommandsReturn } from '../src/cli/tui/hooks/useCommands.js';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

let captured: UseCommandsReturn | null = null;

function CommandCapture(): React.JSX.Element {
  captured = useCommands();
  return <Text>ready</Text>;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('/image and /clear-images commands', () => {
  beforeEach(() => {
    captured = null;
    vi.clearAllMocks();
  });

  // -------------------------------------------------------------------------
  // /image command
  // -------------------------------------------------------------------------

  describe('/image', () => {
    it('should be registered with name "image" and alias "img"', () => {
      render(<CommandCapture />);
      expect(captured).not.toBeNull();

      const imageCmd = captured!.commands.find((c) => c.name === 'image');
      expect(imageCmd).toBeDefined();
      expect(imageCmd!.aliases).toContain('img');
      expect(imageCmd!.description).toBeTruthy();
      expect(imageCmd!.category).toBe('general');
    });

    it('should call pasteFromClipboard when no args given', async () => {
      render(<CommandCapture />);

      const handled = await captured!.handleCommand('/image');
      expect(handled).toBe(true);
      expect(mockPasteFromClipboard).toHaveBeenCalledOnce();
      expect(mockAddFromFile).not.toHaveBeenCalled();
    });

    it('should call pasteFromClipboard via alias /img', async () => {
      render(<CommandCapture />);

      const handled = await captured!.handleCommand('/img');
      expect(handled).toBe(true);
      expect(mockPasteFromClipboard).toHaveBeenCalledOnce();
    });

    it('should call addFromFile when a file path is given', async () => {
      render(<CommandCapture />);

      const handled = await captured!.handleCommand('/image ./screenshot.png');
      expect(handled).toBe(true);
      expect(mockAddFromFile).toHaveBeenCalledOnce();
      expect(mockAddFromFile).toHaveBeenCalledWith('./screenshot.png');
      expect(mockPasteFromClipboard).not.toHaveBeenCalled();
    });

    it('should call addFromFile with absolute path', async () => {
      render(<CommandCapture />);

      await captured!.handleCommand('/image /tmp/photo.jpg');
      expect(mockAddFromFile).toHaveBeenCalledWith('/tmp/photo.jpg');
    });

    it('should call addFromFile via alias with path', async () => {
      render(<CommandCapture />);

      await captured!.handleCommand('/img /tmp/photo.jpg');
      expect(mockAddFromFile).toHaveBeenCalledWith('/tmp/photo.jpg');
    });
  });

  // -------------------------------------------------------------------------
  // /clear-images command
  // -------------------------------------------------------------------------

  describe('/clear-images', () => {
    it('should be registered with name "clear-images" and alias "cli"', () => {
      render(<CommandCapture />);

      const clearCmd = captured!.commands.find((c) => c.name === 'clear-images');
      expect(clearCmd).toBeDefined();
      expect(clearCmd!.aliases).toContain('cli');
      expect(clearCmd!.description).toBeTruthy();
    });

    it('should call clearAll when executed', async () => {
      render(<CommandCapture />);

      const handled = await captured!.handleCommand('/clear-images');
      expect(handled).toBe(true);
      expect(mockClearAll).toHaveBeenCalledOnce();
    });

    it('should call clearAll via alias /cli', async () => {
      render(<CommandCapture />);

      const handled = await captured!.handleCommand('/cli');
      expect(handled).toBe(true);
      expect(mockClearAll).toHaveBeenCalledOnce();
    });
  });

  // -------------------------------------------------------------------------
  // handleCommand dispatch
  // -------------------------------------------------------------------------

  describe('handleCommand dispatch', () => {
    it('should return false for non-slash input', async () => {
      render(<CommandCapture />);

      const handled = await captured!.handleCommand('hello world');
      expect(handled).toBe(false);
    });

    it('should return true for unknown slash commands', async () => {
      render(<CommandCapture />);

      const handled = await captured!.handleCommand('/nonexistent');
      expect(handled).toBe(true);
    });

    it('should handle leading/trailing whitespace', async () => {
      render(<CommandCapture />);

      const handled = await captured!.handleCommand('  /image  ');
      expect(handled).toBe(true);
      expect(mockPasteFromClipboard).toHaveBeenCalledOnce();
    });
  });
});
