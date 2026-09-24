import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render } from 'ink-testing-library';

import { MessageArea } from '../../../src/cli/tui/components/MessageArea.js';
import type { MessageDisplay } from '../../../src/cli/tui/components/MessageArea.js';
import type { ToolCallState } from '../../../src/cli/tui/context/ChatContext.js';
import { ThemeProvider } from '../../../src/cli/tui/context/ThemeContext.js';

// ---------------------------------------------------------------------------
// Regression: transcript rendering must NOT retain state across session
// switches (issue #1815). Alexi's TUI does not use a row-measuring
// virtualizer (no `virtua` / `react-window` / `react-virtualized`
// dependency) — MessageArea renders every run directly through Ink.
//
// These tests pin that contract: if a future refactor introduces a
// virtualizer that caches row sizes across mounts, this file will fail
// and force the author to key the virtualizer by session id (see
// Kilocode PR #14486 for the pattern).
// ---------------------------------------------------------------------------

const baseAreaProps = {
  streamingText: '',
  isStreaming: false,
  activeToolCalls: [] as ToolCallState[],
  onToggleToolCall: vi.fn(),
};

function makeMessage(id: string, content: string, role: MessageDisplay['role']): MessageDisplay {
  return {
    id,
    role,
    content,
    toolCalls: [],
    timestamp: 1,
  };
}

describe('MessageArea session switching', () => {
  it('replaces transcript content when the messages prop is swapped', () => {
    const sessionA: MessageDisplay[] = [
      makeMessage('a-user', 'session-A-user-line', 'user'),
      makeMessage('a-assistant', 'session-A-assistant-line', 'assistant'),
    ];
    const sessionB: MessageDisplay[] = [
      makeMessage('b-user', 'session-B-user-line', 'user'),
      makeMessage('b-assistant', 'session-B-assistant-line', 'assistant'),
    ];

    const { lastFrame, rerender } = render(
      <ThemeProvider>
        <MessageArea {...baseAreaProps} messages={sessionA} />
      </ThemeProvider>
    );

    expect(lastFrame()).toContain('session-A-user-line');
    expect(lastFrame()).toContain('session-A-assistant-line');

    rerender(
      <ThemeProvider>
        <MessageArea {...baseAreaProps} messages={sessionB} />
      </ThemeProvider>
    );

    const frameAfterSwitch = lastFrame() ?? '';
    // Session B is visible ...
    expect(frameAfterSwitch).toContain('session-B-user-line');
    expect(frameAfterSwitch).toContain('session-B-assistant-line');
    // ... and no session-A remnants remain (no stale row content).
    expect(frameAfterSwitch).not.toContain('session-A-user-line');
    expect(frameAfterSwitch).not.toContain('session-A-assistant-line');
  });

  it('renders an empty transcript cleanly after switching from a populated one', () => {
    const populated: MessageDisplay[] = [
      makeMessage('m1', 'previous-session-content', 'assistant'),
    ];

    const { lastFrame, rerender } = render(
      <ThemeProvider>
        <MessageArea {...baseAreaProps} messages={populated} />
      </ThemeProvider>
    );

    expect(lastFrame()).toContain('previous-session-content');

    rerender(
      <ThemeProvider>
        <MessageArea {...baseAreaProps} messages={[]} />
      </ThemeProvider>
    );

    const frame = lastFrame() ?? '';
    // Empty-state placeholder shows and stale content is gone. The
    // MessageArea empty-state copy is "Start a conversation…".
    expect(frame).toContain('Start a conversation');
    expect(frame).not.toContain('previous-session-content');
  });

  it('does not leak the previous transcript when switching to a shorter one', () => {
    const long: MessageDisplay[] = [
      makeMessage('l1', 'long-1', 'user'),
      makeMessage('l2', 'long-2', 'assistant'),
      makeMessage('l3', 'long-3', 'user'),
      makeMessage('l4', 'long-4', 'assistant'),
    ];
    const short: MessageDisplay[] = [makeMessage('s1', 'short-only', 'user')];

    const { lastFrame, rerender } = render(
      <ThemeProvider>
        <MessageArea {...baseAreaProps} messages={long} />
      </ThemeProvider>
    );

    expect(lastFrame()).toContain('long-4');

    rerender(
      <ThemeProvider>
        <MessageArea {...baseAreaProps} messages={short} />
      </ThemeProvider>
    );

    const frame = lastFrame() ?? '';
    expect(frame).toContain('short-only');
    // None of the four previous-session lines should linger. This would
    // fail if a hypothetical virtualizer cached measured row content
    // indexed by row position rather than message id.
    for (const stale of ['long-1', 'long-2', 'long-3', 'long-4']) {
      expect(frame).not.toContain(stale);
    }
  });
});
