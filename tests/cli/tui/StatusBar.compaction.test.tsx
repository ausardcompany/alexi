import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from 'ink-testing-library';

import { CompactionStarted, CompactionComplete } from '../../../src/bus/index.js';
import { StatusBar } from '../../../src/cli/tui/components/StatusBar.js';
import { ThemeProvider } from '../../../src/cli/tui/context/ThemeContext.js';

function Wrapper({ children }: { children: React.ReactNode }): React.JSX.Element {
  return <ThemeProvider>{children}</ThemeProvider>;
}

describe('StatusBar compaction progress', () => {
  const defaultProps = {
    agent: 'code',
    model: 'gpt-4o',
    cost: { totalCost: 0, currency: 'USD' },
    isStreaming: false,
    leaderActive: false,
  };

  it('does not render the compaction segment by default', () => {
    const { lastFrame } = render(
      <Wrapper>
        <StatusBar {...defaultProps} />
      </Wrapper>
    );
    expect(lastFrame() ?? '').not.toContain('Compacting');
  });

  it('renders the compaction segment when CompactionStarted fires', () => {
    const { lastFrame, rerender } = render(
      <Wrapper>
        <StatusBar {...defaultProps} />
      </Wrapper>
    );

    CompactionStarted.publish({
      messageCount: 20,
      estimatedTokens: 30000,
      trigger: 'auto',
      timestamp: Date.now(),
    });

    rerender(
      <Wrapper>
        <StatusBar {...defaultProps} />
      </Wrapper>
    );

    expect(lastFrame() ?? '').toContain('Compacting');
  });

  it('hides the compaction segment after CompactionComplete fires', () => {
    const { lastFrame, rerender } = render(
      <Wrapper>
        <StatusBar {...defaultProps} />
      </Wrapper>
    );

    CompactionStarted.publish({
      messageCount: 20,
      estimatedTokens: 30000,
      trigger: 'auto',
      timestamp: Date.now(),
    });
    rerender(
      <Wrapper>
        <StatusBar {...defaultProps} />
      </Wrapper>
    );
    expect(lastFrame() ?? '').toContain('Compacting');

    CompactionComplete.publish({
      originalMessages: 20,
      compactedMessages: 6,
      estimatedTokensSaved: 25000,
      durationMs: 1200,
      trigger: 'auto',
      timestamp: Date.now(),
    });
    rerender(
      <Wrapper>
        <StatusBar {...defaultProps} />
      </Wrapper>
    );
    expect(lastFrame() ?? '').not.toContain('Compacting');
  });
});
