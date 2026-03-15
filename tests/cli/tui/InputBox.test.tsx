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
});
