import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from 'ink-testing-library';

import { ThemeProvider } from '../../src/cli/tui/context/ThemeContext.js';
import { DialogProvider } from '../../src/cli/tui/context/DialogContext.js';
import { RewindDialog } from '../../src/cli/tui/dialogs/RewindDialog.js';
import type { MessageDisplay } from '../../src/cli/tui/components/MessageArea.js';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function createMessage(
  role: MessageDisplay['role'],
  content: string,
  timestamp?: number
): MessageDisplay {
  return {
    id: `msg-${Math.random().toString(36).slice(2)}`,
    role,
    content,
    toolCalls: [],
    timestamp: timestamp ?? Date.now(),
  };
}

function renderDialog(messages: MessageDisplay[]) {
  return render(
    <ThemeProvider>
      <DialogProvider>
        <RewindDialog messages={messages} />
      </DialogProvider>
    </ThemeProvider>
  );
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('RewindDialog', () => {
  describe('rendering', () => {
    it('renders the title', () => {
      const messages = [
        createMessage('user', 'Hello world'),
        createMessage('assistant', 'Hi there!'),
      ];

      const { lastFrame } = renderDialog(messages);
      const frame = lastFrame() ?? '';
      expect(frame).toContain('Rewind / Manage Context');
    });

    it('renders turn boundaries from user messages', () => {
      const messages = [
        createMessage('user', 'First user message'),
        createMessage('assistant', 'First response'),
        createMessage('user', 'Second user message'),
        createMessage('assistant', 'Second response'),
        createMessage('user', 'Third user message'),
      ];

      const { lastFrame } = renderDialog(messages);
      const frame = lastFrame() ?? '';
      expect(frame).toContain('[1]');
      expect(frame).toContain('First user message');
      expect(frame).toContain('[2]');
      expect(frame).toContain('Second user message');
      expect(frame).toContain('[3]');
      expect(frame).toContain('Third user message');
    });

    it('shows empty state when no user messages', () => {
      const messages = [
        createMessage('system', 'System prompt'),
        createMessage('assistant', 'Hello!'),
      ];

      const { lastFrame } = renderDialog(messages);
      const frame = lastFrame() ?? '';
      expect(frame).toContain('No turn boundaries found');
    });

    it('shows only first line of multi-line messages', () => {
      const messages = [
        createMessage('user', 'First line\nSecond line\nThird line'),
        createMessage('assistant', 'Response'),
      ];

      const { lastFrame } = renderDialog(messages);
      const frame = lastFrame() ?? '';
      expect(frame).toContain('First line');
      expect(frame).not.toContain('Second line');
    });

    it('shows navigation hints', () => {
      const messages = [
        createMessage('user', 'Hello'),
        createMessage('assistant', 'Hi'),
      ];

      const { lastFrame } = renderDialog(messages);
      const frame = lastFrame() ?? '';
      expect(frame).toContain('navigate');
      expect(frame).toContain('Esc');
    });

    it('shows turn numbers sequentially', () => {
      const messages = [
        createMessage('user', 'Message one'),
        createMessage('assistant', 'Response one'),
        createMessage('user', 'Message two'),
        createMessage('assistant', 'Response two'),
      ];

      const { lastFrame } = renderDialog(messages);
      const frame = lastFrame() ?? '';
      expect(frame).toContain('[1]');
      expect(frame).toContain('[2]');
    });

    it('highlights the first item by default', () => {
      const messages = [
        createMessage('user', 'First message'),
        createMessage('assistant', 'Response'),
        createMessage('user', 'Second message'),
      ];

      const { lastFrame } = renderDialog(messages);
      const frame = lastFrame() ?? '';
      // The selected item has a ▸ indicator
      expect(frame).toContain('▸');
    });
  });

  describe('action selection', () => {
    it('transitions to action mode after Enter key', async () => {
      const messages = [
        createMessage('user', 'First message'),
        createMessage('assistant', 'Response'),
        createMessage('user', 'Second message'),
      ];

      const { lastFrame, stdin } = renderDialog(messages);

      // Press Enter to enter action mode
      stdin.write('\r');

      // Give ink time to process the input
      await new Promise((resolve) => setTimeout(resolve, 50));

      const frame = lastFrame() ?? '';
      expect(frame).toContain('Choose Action');
      expect(frame).toContain('Discard after here');
      expect(frame).toContain('Summarize before here');
    });

    it('shows back hint in action mode', async () => {
      const messages = [
        createMessage('user', 'First message'),
        createMessage('assistant', 'Response'),
      ];

      const { lastFrame, stdin } = renderDialog(messages);

      // Enter action mode
      stdin.write('\r');

      await new Promise((resolve) => setTimeout(resolve, 50));

      const frame = lastFrame() ?? '';
      expect(frame).toContain('Esc: back');
    });
  });
});
