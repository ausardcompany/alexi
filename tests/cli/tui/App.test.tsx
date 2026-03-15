import { describe, it, expect } from 'vitest';
import React from 'react';
import { render } from 'ink-testing-library';

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
    it('shows the model name in the header', () => {
      const { lastFrame } = render(<App model="claude-sonnet-4" autoRoute={false} />);
      expect(lastFrame()).toContain('claude-sonnet-4');
    });

    it('shows the default agent name', () => {
      const { lastFrame } = render(<App model="gpt-4o" autoRoute={false} />);
      // Default agent is 'orchestrator'
      expect(lastFrame()).toContain('orchestrator');
    });

    it('shows the input prompt with agent name', () => {
      const { lastFrame } = render(<App model="claude-sonnet" autoRoute={false} />);
      // Input prompt has format: "agentname ❯"
      expect(lastFrame()).toContain('❯');
    });

    it('shows keybinding hints in status bar', () => {
      const { lastFrame } = render(<App model="claude-sonnet" autoRoute={false} />);
      expect(lastFrame()).toContain('Tab');
    });

    it('shows session ID truncated to 8 chars when provided', () => {
      const { lastFrame } = render(
        <App model="claude-sonnet" autoRoute={false} sessionId="abcdefgh12345678" />
      );
      expect(lastFrame()).toContain('abcdefgh');
    });
  });

  describe('provider tree', () => {
    it('renders all layout regions in correct order (header above input)', () => {
      const { lastFrame } = render(<App model="my-model" autoRoute={false} />);
      const frame = lastFrame() ?? '';
      const modelPos = frame.indexOf('my-model');
      const arrowPos = frame.indexOf('❯');
      // Model in header appears before the input prompt arrow
      expect(modelPos).toBeGreaterThanOrEqual(0);
      expect(arrowPos).toBeGreaterThan(modelPos);
    });
  });
});
