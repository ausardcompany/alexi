import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { Text } from 'ink';
import { render } from 'ink-testing-library';

import { ThemeProvider } from '../../../src/cli/tui/context/ThemeContext.js';
import type { ImageAttachmentPreview } from '../../../src/cli/tui/context/AttachmentContext.js';

vi.mock('../../../src/cli/tui/components/MarkdownRenderer.js', () => ({
  MarkdownRenderer: ({ markdown }: { markdown: string }) => <Text>{markdown}</Text>,
}));

vi.mock('../../../src/utils/imageValidation.js', () => ({
  formatSize: (bytes: number) => `${bytes} B`,
}));

import { MessageBubble } from '../../../src/cli/tui/components/MessageBubble.js';
import type { MessageBubbleExtendedProps } from '../../../src/cli/tui/components/MessageBubble.js';

function renderBubble(overrides: Partial<MessageBubbleExtendedProps> = {}) {
  const defaultProps: MessageBubbleExtendedProps = {
    role: 'user',
    content: 'hello world',
    timestamp: Date.now(),
    ...overrides,
  };
  return render(
    <ThemeProvider>
      <MessageBubble {...defaultProps} />
    </ThemeProvider>
  );
}

describe('MessageBubble', () => {
  it('renders user message with "You" label and content', () => {
    const { lastFrame } = renderBubble({ role: 'user', content: 'hi there' });
    expect(lastFrame()).toContain('You');
    expect(lastFrame()).toContain('hi there');
  });

  it('renders assistant message with agent label and content', () => {
    const { lastFrame } = renderBubble({
      role: 'assistant',
      content: 'some markdown answer',
      agent: 'code',
    });
    expect(lastFrame()).toContain('code');
    expect(lastFrame()).toContain('some markdown answer');
  });

  it('renders system message as full-width separator line', () => {
    const { lastFrame } = renderBubble({ role: 'system', content: 'session started' });
    // System messages now render as a full-width ─ separator line
    expect(lastFrame()).toContain('──────');
  });

  it('shows model and token count in assistant metadata', () => {
    const { lastFrame } = renderBubble({
      role: 'assistant',
      content: 'answer',
      agent: 'code',
      model: 'gpt-4o',
      tokens: 512,
    });
    expect(lastFrame()).toContain('gpt-4o');
    expect(lastFrame()).toContain('512 tok');
  });

  it('renders image chips for user messages with images', () => {
    const images: ImageAttachmentPreview[] = [
      { id: 'img-1', format: 'png', sizeBytes: 2048, source: 'clipboard' },
      { id: 'img-2', format: 'jpeg', sizeBytes: 4096, source: 'file', filePath: '/tmp/photo.jpg' },
    ];
    const { lastFrame } = renderBubble({ role: 'user', content: 'check this', images });
    expect(lastFrame()).toContain('[Image: PNG 2048 B]');
    expect(lastFrame()).toContain('[Image: JPEG 4096 B]');
  });

  it('defaults agent label to "assistant" when no agent is provided', () => {
    const { lastFrame } = renderBubble({
      role: 'assistant',
      content: 'response',
    });
    expect(lastFrame()).toContain('assistant');
  });
});
