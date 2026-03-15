import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render } from 'ink-testing-library';

// Mock useClipboardImage so InputBox doesn't need a real AttachmentProvider
vi.mock('../../../src/cli/tui/hooks/useClipboardImage.js', () => ({
  useClipboardImage: vi.fn(),
}));

// Mock useAttachments so the AttachmentBar inside InputBox renders safely
vi.mock('../../../src/cli/tui/context/AttachmentContext.js', () => ({
  useAttachments: () => ({
    pending: [],
    reading: false,
    error: null,
    pasteFromClipboard: vi.fn(),
    addFromFile: vi.fn(),
    remove: vi.fn(),
    clearAll: vi.fn(),
    consumeAll: vi.fn(),
  }),
}));

import { InputBox } from '../../../src/cli/tui/components/InputBox.js';
import type { SlashCommand } from '../../../src/cli/tui/hooks/useCommands.js';
import { ThemeProvider } from '../../../src/cli/tui/context/ThemeContext.js';

/** Wrap component in ThemeProvider since AttachmentBar uses useTheme(). */
function Wrapper({ children }: { children: React.ReactNode }): React.JSX.Element {
  return <ThemeProvider>{children}</ThemeProvider>;
}

describe('InputBox', () => {
  const defaultProps = {
    agent: 'code',
    agentColor: 'green',
    disabled: false,
    onSubmit: vi.fn(),
    isFocused: true,
  };

  it('renders agent name and prompt symbol', () => {
    const { lastFrame } = render(
      <Wrapper>
        <InputBox {...defaultProps} />
      </Wrapper>
    );
    expect(lastFrame()).toContain('code');
    expect(lastFrame()).toContain('❯');
  });

  it('shows Streaming placeholder when disabled', () => {
    const { lastFrame } = render(
      <Wrapper>
        <InputBox {...defaultProps} disabled={true} />
      </Wrapper>
    );
    expect(lastFrame()).toContain('Streaming...');
  });

  it('shows agent prompt even when disabled', () => {
    const { lastFrame } = render(
      <Wrapper>
        <InputBox {...defaultProps} disabled={true} />
      </Wrapper>
    );
    expect(lastFrame()).toContain('code');
    expect(lastFrame()).toContain('❯');
  });

  it('renders different agent names', () => {
    for (const agent of ['debug', 'plan', 'orchestrator'] as const) {
      const { lastFrame } = render(
        <Wrapper>
          <InputBox {...defaultProps} agent={agent} />
        </Wrapper>
      );
      expect(lastFrame()).toContain(agent);
    }
  });

  it('shows placeholder text in enabled state', () => {
    const { lastFrame } = render(
      <Wrapper>
        <InputBox {...defaultProps} />
      </Wrapper>
    );
    // ink-text-input renders placeholder when value is empty
    expect(lastFrame()).toContain('Type a message or /command');
  });

  it('does not show placeholder text when disabled', () => {
    const { lastFrame } = render(
      <Wrapper>
        <InputBox {...defaultProps} disabled={true} />
      </Wrapper>
    );
    expect(lastFrame()).not.toContain('Type a message or /command');
  });

  describe('autocomplete', () => {
    const mockCommands: SlashCommand[] = [
      {
        name: 'help',
        aliases: ['h'],
        description: 'Show available commands',
        category: 'general',
        execute: async () => true,
      },
      {
        name: 'exit',
        aliases: ['quit', 'q'],
        description: 'Exit the TUI',
        category: 'general',
        execute: async () => true,
      },
      {
        name: 'model',
        description: 'Show or switch the current model',
        category: 'model',
        execute: async () => true,
      },
      {
        name: 'agent',
        description: 'Show or switch the current agent',
        category: 'session',
        execute: async () => true,
      },
    ];

    it('renders without crashing when commands prop is provided', () => {
      const { lastFrame } = render(
        <Wrapper>
          <InputBox {...defaultProps} commands={mockCommands} />
        </Wrapper>
      );
      expect(lastFrame()).toContain('code');
      expect(lastFrame()).toContain('❯');
    });

    it('does not show suggestions when input is empty', () => {
      const { lastFrame } = render(
        <Wrapper>
          <InputBox {...defaultProps} commands={mockCommands} />
        </Wrapper>
      );
      const frame = lastFrame() ?? '';
      // None of the command names should appear as suggestions
      expect(frame).not.toContain('/help');
      expect(frame).not.toContain('/exit');
    });

    it('renders with commands prop and shows placeholder', () => {
      const { lastFrame } = render(
        <Wrapper>
          <InputBox {...defaultProps} commands={mockCommands} />
        </Wrapper>
      );
      expect(lastFrame()).toContain('Type a message or /command');
    });

    it('accepts empty commands array without errors', () => {
      expect(() => {
        render(
          <Wrapper>
            <InputBox {...defaultProps} commands={[]} />
          </Wrapper>
        );
      }).not.toThrow();
    });

    it('accepts undefined commands without errors', () => {
      expect(() => {
        render(
          <Wrapper>
            <InputBox {...defaultProps} />
          </Wrapper>
        );
      }).not.toThrow();
    });
  });
});
