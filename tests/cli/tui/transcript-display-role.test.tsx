/**
 * Tests for `displayRole` filtering — issue #1466.
 *
 * Verifies that messages tagged with `displayRole: 'system'` (typically
 * hook `contextModification` payloads injected by the agentic loop) are
 * hidden from user-facing transcripts (TUI `MessageArea` + session
 * replay) while regular user / assistant / system messages remain
 * visible. The model API path is not exercised here — those messages
 * are pushed to the provider via the in-memory `messages` array in
 * `agenticChat.ts` and are not affected by this display filter.
 */

import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render } from 'ink-testing-library';

import { MessageArea } from '../../../src/cli/tui/components/MessageArea.js';
import type {
  MessageAreaProps,
  MessageDisplay,
} from '../../../src/cli/tui/components/MessageArea.js';
import type { ToolCallState } from '../../../src/cli/tui/context/ChatContext.js';
import { ThemeProvider } from '../../../src/cli/tui/context/ThemeContext.js';
import { SessionReplay } from '../../../src/cli/session-replay.js';
import type { Message } from '../../../src/core/sessionManager.js';

function makeDisplay(overrides: Partial<MessageDisplay>): MessageDisplay {
  return {
    id: overrides.id ?? `msg-${Math.random().toString(36).slice(2)}`,
    role: 'user',
    content: '',
    toolCalls: [],
    timestamp: Date.now(),
    ...overrides,
  };
}

const defaultAreaProps: MessageAreaProps = {
  messages: [],
  streamingText: '',
  isStreaming: false,
  activeToolCalls: [] as ToolCallState[],
  onToggleToolCall: vi.fn(),
};

function renderArea(messages: MessageDisplay[]): string {
  const { lastFrame } = render(
    <ThemeProvider>
      <MessageArea {...defaultAreaProps} messages={messages} />
    </ThemeProvider>
  );
  return lastFrame() ?? '';
}

describe('TUI transcript displayRole filter', () => {
  it('hides messages tagged with displayRole: "system" from the transcript', () => {
    const messages: MessageDisplay[] = [
      makeDisplay({ role: 'user', content: 'VISIBLE_USER_MESSAGE' }),
      makeDisplay({
        role: 'user',
        content: 'HIDDEN_HOOK_CONTEXT_PAYLOAD',
        displayRole: 'system',
      }),
      makeDisplay({ role: 'assistant', content: 'VISIBLE_ASSISTANT_REPLY' }),
    ];

    const frame = renderArea(messages);

    expect(frame).toContain('VISIBLE_USER_MESSAGE');
    expect(frame).toContain('VISIBLE_ASSISTANT_REPLY');
    expect(frame).not.toContain('HIDDEN_HOOK_CONTEXT_PAYLOAD');
  });

  it('shows regular messages with no displayRole', () => {
    const messages: MessageDisplay[] = [
      makeDisplay({ role: 'user', content: 'NORMAL_USER' }),
      makeDisplay({ role: 'assistant', content: 'NORMAL_ASSISTANT' }),
    ];

    const frame = renderArea(messages);

    expect(frame).toContain('NORMAL_USER');
    expect(frame).toContain('NORMAL_ASSISTANT');
  });

  it('shows messages with displayRole: "user" or "assistant"', () => {
    const messages: MessageDisplay[] = [
      makeDisplay({ role: 'user', content: 'ROLE_USER_OVERRIDE', displayRole: 'user' }),
      makeDisplay({
        role: 'assistant',
        content: 'ROLE_ASSISTANT_OVERRIDE',
        displayRole: 'assistant',
      }),
    ];

    const frame = renderArea(messages);

    expect(frame).toContain('ROLE_USER_OVERRIDE');
    expect(frame).toContain('ROLE_ASSISTANT_OVERRIDE');
  });

  it('renders the empty-state placeholder when only hidden messages exist', () => {
    const messages: MessageDisplay[] = [
      makeDisplay({ role: 'user', content: 'HIDDEN_ONLY', displayRole: 'system' }),
    ];

    const frame = renderArea(messages);

    expect(frame).not.toContain('HIDDEN_ONLY');
    // Empty-state hint character (an ellipsis) appears when nothing is visible.
    expect(frame).toContain('…');
  });
});

describe('SessionReplay displayRole filter', () => {
  const makeMsg = (overrides: Partial<Message>): Message => ({
    role: 'user',
    content: '',
    timestamp: Date.now(),
    ...overrides,
  });

  it('skips messages tagged with displayRole: "system"', async () => {
    const replay = new SessionReplay();
    const seen: string[] = [];

    const messages: Message[] = [
      makeMsg({ role: 'user', content: 'visible-user' }),
      makeMsg({ role: 'user', content: 'hidden-hook-context', displayRole: 'system' }),
      makeMsg({ role: 'assistant', content: 'visible-assistant' }),
    ];

    const result = await replay.replay(messages, {
      onMessage: (m) => {
        seen.push(m.content);
      },
    });

    expect(seen).toEqual(['visible-user', 'visible-assistant']);
    expect(result.messagesReplayed).toBe(2);
    expect(result.skippedMessages).toBe(1);
  });

  it('still hides displayRole: "system" even when showSystemMessages is true', async () => {
    const replay = new SessionReplay();
    const seen: string[] = [];

    const messages: Message[] = [
      makeMsg({ role: 'system', content: 'real-system-prompt' }),
      makeMsg({ role: 'user', content: 'hidden-hook', displayRole: 'system' }),
      makeMsg({ role: 'user', content: 'visible-user' }),
    ];

    await replay.replay(messages, {
      showSystemMessages: true,
      onMessage: (m) => {
        seen.push(m.content);
      },
    });

    // Real `role: 'system'` message is shown (showSystemMessages=true),
    // but the `displayRole: 'system'` message is ALWAYS hidden.
    expect(seen).toContain('real-system-prompt');
    expect(seen).toContain('visible-user');
    expect(seen).not.toContain('hidden-hook');
  });
});
