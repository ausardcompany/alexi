import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render } from 'ink-testing-library';

import { MessageArea } from '../../../src/cli/tui/components/MessageArea.js';
import type { MessageDisplay } from '../../../src/cli/tui/components/MessageArea.js';
import type { ToolCallState } from '../../../src/cli/tui/context/ChatContext.js';
import { ThemeProvider } from '../../../src/cli/tui/context/ThemeContext.js';

const makeMessage = (overrides: Partial<MessageDisplay> = {}): MessageDisplay => ({
  id: 'msg-1',
  role: 'user',
  content: 'Hello world',
  toolCalls: [],
  timestamp: 1700000000000,
  ...overrides,
});

const makeToolCall = (overrides: Partial<ToolCallState> = {}): ToolCallState => ({
  id: 'tc-1',
  toolName: 'read',
  params: { filePath: '/tmp/test.ts' },
  status: 'running',
  output: null,
  error: null,
  isExpanded: true,
  diff: null,
  startedAt: Date.now(),
  completedAt: null,
  ...overrides,
});

describe('MessageArea', () => {
  it('renders without crashing when empty', () => {
    const { lastFrame } = render(
      <ThemeProvider>
        <MessageArea
          messages={[]}
          streamingText=""
          isStreaming={false}
          activeToolCalls={[]}
          onToggleToolCall={vi.fn()}
        />
      </ThemeProvider>
    );
    expect(lastFrame()).toBeDefined();
  });

  it('renders user messages', () => {
    const messages = [makeMessage({ content: 'Hello from user', role: 'user' })];
    const { lastFrame } = render(
      <ThemeProvider>
        <MessageArea
          messages={messages}
          streamingText=""
          isStreaming={false}
          activeToolCalls={[]}
          onToggleToolCall={vi.fn()}
        />
      </ThemeProvider>
    );
    expect(lastFrame()).toContain('Hello from user');
    expect(lastFrame()).toContain('You');
  });

  it('renders assistant messages', () => {
    const messages = [
      makeMessage({ content: 'Assistant reply', role: 'assistant', agent: 'code' }),
    ];
    const { lastFrame } = render(
      <ThemeProvider>
        <MessageArea
          messages={messages}
          streamingText=""
          isStreaming={false}
          activeToolCalls={[]}
          onToggleToolCall={vi.fn()}
        />
      </ThemeProvider>
    );
    expect(lastFrame()).toContain('Assistant reply');
  });

  it('renders system messages', () => {
    const messages = [makeMessage({ content: 'System notice', role: 'system' })];
    const { lastFrame } = render(
      <ThemeProvider>
        <MessageArea
          messages={messages}
          streamingText=""
          isStreaming={false}
          activeToolCalls={[]}
          onToggleToolCall={vi.fn()}
        />
      </ThemeProvider>
    );
    expect(lastFrame()).toContain('System notice');
  });

  it('renders streaming text when isStreaming is true', () => {
    const { lastFrame } = render(
      <ThemeProvider>
        <MessageArea
          messages={[]}
          streamingText="partial response..."
          isStreaming={true}
          activeToolCalls={[]}
          onToggleToolCall={vi.fn()}
        />
      </ThemeProvider>
    );
    expect(lastFrame()).toContain('partial response...');
  });

  it('does not render streaming text when isStreaming is false', () => {
    const { lastFrame } = render(
      <ThemeProvider>
        <MessageArea
          messages={[]}
          streamingText="should not show"
          isStreaming={false}
          activeToolCalls={[]}
          onToggleToolCall={vi.fn()}
        />
      </ThemeProvider>
    );
    expect(lastFrame()).not.toContain('should not show');
  });

  it('renders a waiting indicator when streaming but no text yet', () => {
    const { lastFrame } = render(
      <ThemeProvider>
        <MessageArea
          messages={[]}
          streamingText=""
          isStreaming={true}
          activeToolCalls={[]}
          onToggleToolCall={vi.fn()}
        />
      </ThemeProvider>
    );
    expect(lastFrame()).toContain('…');
  });

  it('renders active tool calls', () => {
    const toolCalls = [makeToolCall({ toolName: 'bash', params: { command: 'ls' } })];
    const { lastFrame } = render(
      <ThemeProvider>
        <MessageArea
          messages={[]}
          streamingText=""
          isStreaming={false}
          activeToolCalls={toolCalls}
          onToggleToolCall={vi.fn()}
        />
      </ThemeProvider>
    );
    expect(lastFrame()).toContain('bash');
  });

  it('renders multiple messages in order', () => {
    const messages: MessageDisplay[] = [
      makeMessage({ id: 'msg-1', content: 'First message', role: 'user', timestamp: 1 }),
      makeMessage({ id: 'msg-2', content: 'Second message', role: 'assistant', timestamp: 2 }),
    ];
    const frame =
      render(
        <ThemeProvider>
          <MessageArea
            messages={messages}
            streamingText=""
            isStreaming={false}
            activeToolCalls={[]}
            onToggleToolCall={vi.fn()}
          />
        </ThemeProvider>
      ).lastFrame() ?? '';
    const firstPos = frame.indexOf('First message');
    const secondPos = frame.indexOf('Second message');
    expect(firstPos).toBeGreaterThanOrEqual(0);
    expect(secondPos).toBeGreaterThan(firstPos);
  });
});
