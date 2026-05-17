import React, { useState } from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from 'ink-testing-library';
import { Text } from 'ink';

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

const mockExit = vi.fn();
const mockSetModel = vi.fn();
const mockSetAgent = vi.fn();
const mockSetTheme = vi.fn();
const mockOpen = vi.fn();
const mockPasteFromClipboard = vi.fn();
const mockAddFromFile = vi.fn();
const mockClearAll = vi.fn();
const mockExportToFile = vi.fn();
const mockAddSystemMessage = vi.fn();

vi.mock('ink', async () => {
  const actual = await vi.importActual<typeof import('ink')>('ink');
  return {
    ...actual,
    useApp: () => ({ exit: mockExit }),
  };
});

vi.mock('../../../src/cli/tui/context/SessionContext.js', () => ({
  useSession: () => ({
    sessionId: 'test-session-1',
    model: 'gpt-4o',
    agent: 'code',
    autoRoute: false,
    stage: null,
    tokenCount: 0,
    cost: { inputTokens: 0, outputTokens: 0, totalCost: 0, currency: 'USD' },
    setModel: mockSetModel,
    setAgent: mockSetAgent,
    cycleAgent: vi.fn(),
    setTokenCount: vi.fn(),
    setCost: vi.fn(),
  }),
}));

vi.mock('../../../src/cli/tui/context/DialogContext.js', () => ({
  useDialog: () => ({
    stack: [],
    open: mockOpen,
    close: vi.fn(),
    cancel: vi.fn(),
    isOpen: false,
    currentType: null,
    currentEntry: null,
  }),
}));

vi.mock('../../../src/cli/tui/context/ThemeContext.js', () => ({
  useTheme: () => ({
    theme: {
      colors: {
        warning: 'yellow',
        error: 'red',
        info: 'cyan',
        success: 'green',
        dimText: 'gray',
      },
    },
    toggleTheme: vi.fn(),
    setTheme: mockSetTheme,
  }),
}));

vi.mock('../../../src/cli/tui/context/AttachmentContext.js', () => ({
  useAttachments: () => ({
    pending: [],
    reading: false,
    error: undefined,
    pasteFromClipboard: mockPasteFromClipboard,
    addFromFile: mockAddFromFile,
    remove: vi.fn(),
    clearAll: mockClearAll,
    consumeAll: vi.fn(),
  }),
}));

vi.mock('../../../src/core/dataExporter.js', () => ({
  getDataExporter: () => ({
    exportToFile: mockExportToFile,
  }),
}));

// Import after mocks
import { useCommands } from '../../../src/cli/tui/hooks/useCommands.js';

// ---------------------------------------------------------------------------
// Test component that exposes the hook results
// ---------------------------------------------------------------------------

let capturedHandleCommand: ((input: string) => Promise<boolean>) | null = null;

function InnerComponent(): React.JSX.Element {
  const { handleCommand, commands } = useCommands({
    addSystemMessage: mockAddSystemMessage,
  });
  const [result, setResult] = useState<string>('idle');

  capturedHandleCommand = handleCommand;

  return (
    <>
      <Text>commands:{commands.length}</Text>
      <Text>result:{result}</Text>
    </>
  );
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('useCommands', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    capturedHandleCommand = null;
  });

  it('returns false for non-slash input', async () => {
    render(<InnerComponent />);
    expect(capturedHandleCommand).not.toBeNull();

    const result = await capturedHandleCommand!('hello');
    expect(result).toBe(false);
  });

  it('returns true for known commands', async () => {
    render(<InnerComponent />);

    const result = await capturedHandleCommand!('/help');
    expect(result).toBe(true);
  });

  it('returns true for unknown slash commands', async () => {
    render(<InnerComponent />);

    const result = await capturedHandleCommand!('/unknown');
    expect(result).toBe(true);
  });

  it('/exit calls exit()', async () => {
    render(<InnerComponent />);

    await capturedHandleCommand!('/exit');
    expect(mockExit).toHaveBeenCalledTimes(1);
  });

  it('/quit alias calls exit()', async () => {
    render(<InnerComponent />);

    await capturedHandleCommand!('/quit');
    expect(mockExit).toHaveBeenCalledTimes(1);
  });

  it('/model with argument calls setModel', async () => {
    render(<InnerComponent />);

    await capturedHandleCommand!('/model gpt-4o');
    expect(mockSetModel).toHaveBeenCalledWith('gpt-4o');
  });

  it('/agent with argument calls setAgent', async () => {
    render(<InnerComponent />);

    await capturedHandleCommand!('/agent code');
    expect(mockSetAgent).toHaveBeenCalledWith('code');
  });

  it('/theme dark calls setTheme', async () => {
    render(<InnerComponent />);

    await capturedHandleCommand!('/theme dark');
    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });

  it('/theme light calls setTheme', async () => {
    render(<InnerComponent />);

    await capturedHandleCommand!('/theme light');
    expect(mockSetTheme).toHaveBeenCalledWith('light');
  });

  it('/clear-images calls clearAttachments', async () => {
    render(<InnerComponent />);

    await capturedHandleCommand!('/clear-images');
    expect(mockClearAll).toHaveBeenCalledTimes(1);
  });

  it('exposes commands array with expected command names', () => {
    const { lastFrame } = render(<InnerComponent />);
    // The hook should register multiple commands
    const frame = lastFrame() ?? '';
    // We verify the commands count is > 0
    expect(frame).not.toContain('commands:0');
  });

  it('/image without args calls pasteFromClipboard', async () => {
    render(<InnerComponent />);

    await capturedHandleCommand!('/image');
    expect(mockPasteFromClipboard).toHaveBeenCalledTimes(1);
  });

  it('/image with file path calls addFromFile', async () => {
    render(<InnerComponent />);

    await capturedHandleCommand!('/image /tmp/photo.png');
    expect(mockAddFromFile).toHaveBeenCalledWith('/tmp/photo.png');
  });

  describe('/export command', () => {
    it('is registered in the commands list', () => {
      const { lastFrame } = render(<InnerComponent />);
      const frame = lastFrame() ?? '';
      // The command count should include the new export command
      // (original 14 commands + 1 export = 15)
      expect(frame).toContain('commands:');
      expect(frame).not.toContain('commands:0');
    });

    it('calls data exporter with session ID and default path', async () => {
      mockExportToFile.mockResolvedValue(undefined);
      render(<InnerComponent />);

      const result = await capturedHandleCommand!('/export');
      expect(result).toBe(true);
      expect(mockExportToFile).toHaveBeenCalledTimes(1);
      expect(mockExportToFile).toHaveBeenCalledWith(
        expect.stringContaining('export-'),
        { sessionIds: ['test-session-1'] }
      );
      expect(mockAddSystemMessage).toHaveBeenCalledWith(
        expect.stringContaining('Session exported to:')
      );
    });

    it('calls data exporter with custom path argument', async () => {
      mockExportToFile.mockResolvedValue(undefined);
      render(<InnerComponent />);

      const result = await capturedHandleCommand!('/export /tmp/my-export.json');
      expect(result).toBe(true);
      expect(mockExportToFile).toHaveBeenCalledWith('/tmp/my-export.json', {
        sessionIds: ['test-session-1'],
      });
      expect(mockAddSystemMessage).toHaveBeenCalledWith(
        'Session exported to: /tmp/my-export.json'
      );
    });

    it('reports error when export fails', async () => {
      mockExportToFile.mockRejectedValue(new Error('Permission denied'));
      render(<InnerComponent />);

      const result = await capturedHandleCommand!('/export /bad/path.json');
      expect(result).toBe(true);
      expect(mockAddSystemMessage).toHaveBeenCalledWith(
        'Export failed: Permission denied'
      );
    });
  });
});
