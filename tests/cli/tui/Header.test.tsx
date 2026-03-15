import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from 'ink-testing-library';

import { Header } from '../../../src/cli/tui/components/Header.js';

describe('Header', () => {
  const defaultProps = {
    model: 'claude-3-sonnet',
    agent: 'code',
    agentColor: 'green',
    sessionId: 'abcdef1234567890',
    tokenCount: 0,
    autoRoute: false,
  };

  it('renders the model name', () => {
    const { lastFrame } = render(<Header {...defaultProps} />);
    expect(lastFrame()).toContain('claude-3-sonnet');
  });

  it('renders the agent name', () => {
    const { lastFrame } = render(<Header {...defaultProps} />);
    expect(lastFrame()).toContain('code');
  });

  it('renders the first 8 characters of session ID', () => {
    const { lastFrame } = render(<Header {...defaultProps} />);
    expect(lastFrame()).toContain('abcdef12');
    // Full ID should not be shown
    expect(lastFrame()).not.toContain('abcdef1234567890');
  });

  it('does not render token count when tokenCount is 0', () => {
    const { lastFrame } = render(<Header {...defaultProps} tokenCount={0} />);
    expect(lastFrame()).not.toContain('tok');
  });

  it('renders token count when tokenCount > 0', () => {
    const { lastFrame } = render(<Header {...defaultProps} tokenCount={1234} />);
    expect(lastFrame()).toContain('1,234 tok');
  });

  it('renders auto-route indicator when autoRoute is true', () => {
    const { lastFrame } = render(<Header {...defaultProps} autoRoute={true} />);
    expect(lastFrame()).toContain('auto-route');
  });

  it('does not render auto-route indicator when autoRoute is false', () => {
    const { lastFrame } = render(<Header {...defaultProps} autoRoute={false} />);
    expect(lastFrame()).not.toContain('auto-route');
  });

  it('renders different agent names', () => {
    for (const agent of ['debug', 'plan', 'explore', 'orchestrator'] as const) {
      const { lastFrame } = render(<Header {...defaultProps} agent={agent} />);
      expect(lastFrame()).toContain(agent);
    }
  });
});
