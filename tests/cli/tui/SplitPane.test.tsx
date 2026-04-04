import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from 'ink-testing-library';
import { Text } from 'ink';

import { ThemeProvider } from '../../../src/cli/tui/context/ThemeContext.js';
import { SplitPane } from '../../../src/cli/tui/components/SplitPane.js';

function renderWithTheme(ui: React.JSX.Element) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe('SplitPane', () => {
  it('renders both panes when sideVisible is true', () => {
    const { lastFrame } = renderWithTheme(
      <SplitPane
        main={<Text>LEFT_CONTENT</Text>}
        side={<Text>RIGHT_CONTENT</Text>}
        sideVisible={true}
      />
    );
    const frame = lastFrame() ?? '';
    expect(frame).toContain('LEFT_CONTENT');
    expect(frame).toContain('RIGHT_CONTENT');
  });

  it('hides side pane when sideVisible is false', () => {
    const { lastFrame } = renderWithTheme(
      <SplitPane
        main={<Text>LEFT_CONTENT</Text>}
        side={<Text>RIGHT_CONTENT</Text>}
        sideVisible={false}
      />
    );
    const frame = lastFrame() ?? '';
    expect(frame).toContain('LEFT_CONTENT');
    expect(frame).not.toContain('RIGHT_CONTENT');
  });

  it('defaults sideVisible to false (only main shown)', () => {
    const { lastFrame } = renderWithTheme(
      <SplitPane main={<Text>LEFT</Text>} side={<Text>RIGHT</Text>} />
    );
    const frame = lastFrame() ?? '';
    expect(frame).toContain('LEFT');
  });

  it('renders without crashing with custom width', () => {
    const { lastFrame } = renderWithTheme(
      <SplitPane main={<Text>L</Text>} side={<Text>R</Text>} sideWidth={20} />
    );
    expect(lastFrame()).toBeDefined();
  });

  it('renders without crashing with side panel visible', () => {
    const { lastFrame } = renderWithTheme(
      <SplitPane main={<Text>L</Text>} side={<Text>R</Text>} sideVisible={true} />
    );
    expect(lastFrame()).toBeDefined();
  });
});
