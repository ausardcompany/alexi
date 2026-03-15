import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render } from 'ink-testing-library';

import { InputBox } from '../../../src/cli/tui/components/InputBox.js';

describe('InputBox', () => {
  const defaultProps = {
    agent: 'code',
    agentColor: 'green',
    disabled: false,
    onSubmit: vi.fn(),
    isFocused: true,
  };

  it('renders agent name and prompt symbol', () => {
    const { lastFrame } = render(<InputBox {...defaultProps} />);
    expect(lastFrame()).toContain('code');
    expect(lastFrame()).toContain('❯');
  });

  it('shows Streaming placeholder when disabled', () => {
    const { lastFrame } = render(<InputBox {...defaultProps} disabled={true} />);
    expect(lastFrame()).toContain('Streaming...');
  });

  it('shows agent prompt even when disabled', () => {
    const { lastFrame } = render(<InputBox {...defaultProps} disabled={true} />);
    expect(lastFrame()).toContain('code');
    expect(lastFrame()).toContain('❯');
  });

  it('renders different agent names', () => {
    for (const agent of ['debug', 'plan', 'orchestrator'] as const) {
      const { lastFrame } = render(<InputBox {...defaultProps} agent={agent} />);
      expect(lastFrame()).toContain(agent);
    }
  });

  it('shows placeholder text in enabled state', () => {
    const { lastFrame } = render(<InputBox {...defaultProps} />);
    // ink-text-input renders placeholder when value is empty
    expect(lastFrame()).toContain('Type a message or /command');
  });

  it('does not show placeholder text when disabled', () => {
    const { lastFrame } = render(<InputBox {...defaultProps} disabled={true} />);
    expect(lastFrame()).not.toContain('Type a message or /command');
  });
});
