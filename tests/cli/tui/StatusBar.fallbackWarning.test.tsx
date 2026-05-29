import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from 'ink-testing-library';

import { ProviderModelFellBack } from '../../../src/bus/index.js';
import { StatusBar } from '../../../src/cli/tui/components/StatusBar.js';
import { ThemeProvider } from '../../../src/cli/tui/context/ThemeContext.js';

function Wrapper({ children }: { children: React.ReactNode }): React.JSX.Element {
  return <ThemeProvider>{children}</ThemeProvider>;
}

describe('StatusBar fallback warning', () => {
  const defaultProps = {
    agent: 'code',
    model: 'gpt-4o',
    cost: { totalCost: 0, currency: 'USD' },
    isStreaming: false,
    leaderActive: false,
  };

  it('does not render the warning by default', () => {
    const { lastFrame } = render(
      <Wrapper>
        <StatusBar {...defaultProps} />
      </Wrapper>
    );
    expect(lastFrame()).not.toContain('unavailable');
  });

  it('renders the fallback warning when ProviderModelFellBack fires', () => {
    const { lastFrame, rerender } = render(
      <Wrapper>
        <StatusBar {...defaultProps} />
      </Wrapper>
    );

    ProviderModelFellBack.publish({
      requestedModel: 'fake-model',
      effectiveModel: 'gpt-4o',
      timestamp: Date.now(),
    });

    // Force a re-render so the React effect-driven state shows up
    rerender(
      <Wrapper>
        <StatusBar {...defaultProps} />
      </Wrapper>
    );

    const frame = lastFrame() ?? '';
    expect(frame).toContain('fake-model');
    expect(frame).toContain('unavailable');
    expect(frame).toContain('gpt-4o');
  });
});
