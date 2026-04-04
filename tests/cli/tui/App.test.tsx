import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render } from 'ink-testing-library';

vi.mock('fzf', () => ({
  Fzf: class MockFzf {
    constructor(private items: string[]) {}
    find() {
      return [];
    }
  },
}));

vi.mock('terminal-image', () => ({
  default: { file: async () => '' },
}));

import { App } from '../../../src/cli/tui/App.js';

describe('App', () => {
  describe('renders without crashing', () => {
    it('renders with required props', () => {
      expect(() => {
        render(<App model="claude-sonnet" autoRoute={false} />);
      }).not.toThrow();
    });

    it('renders with all props including sessionId', () => {
      expect(() => {
        render(<App model="claude-sonnet" autoRoute={true} sessionId="test-session-123" />);
      }).not.toThrow();
    });
  });

  describe('layout regions', () => {
    it('shows the model name in the status bar', () => {
      const { lastFrame } = render(<App model="claude-sonnet-4" autoRoute={false} />);
      expect(lastFrame()).toContain('claude-sonnet-4');
    });

    it('shows the default agent name', () => {
      const { lastFrame } = render(<App model="gpt-4o" autoRoute={false} />);
      // Default agent is 'orchestrator'
      expect(lastFrame()).toContain('orchestrator');
    });

    it('shows the input prompt', () => {
      const { lastFrame } = render(<App model="claude-sonnet" autoRoute={false} />);
      // Input prompt has format: "> "
      expect(lastFrame()).toContain('> ');
    });

    it('shows keybinding hints in status bar', () => {
      const { lastFrame } = render(<App model="claude-sonnet" autoRoute={false} />);
      expect(lastFrame()).toContain('ctrl+? help');
    });

    it('shows session ID truncated to 8 chars when provided', () => {
      const { lastFrame } = render(
        <App model="claude-sonnet" autoRoute={false} sessionId="abcdefgh12345678" />
      );
      expect(lastFrame()).toContain('abcdefgh');
    });
  });

  describe('provider tree', () => {
    it('renders layout regions including status bar and input area', () => {
      const { lastFrame } = render(<App model="my-model" autoRoute={false} />);
      const frame = lastFrame() ?? '';
      // Model appears in status bar
      expect(frame).toContain('my-model');
      // Input prompt is rendered
      expect(frame).toContain('> ');
    });
  });
});
