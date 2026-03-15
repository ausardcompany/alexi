import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from 'ink-testing-library';

import { Spinner } from '../../../src/cli/tui/components/Spinner.js';
import type { SpinnerProps } from '../../../src/cli/tui/components/Spinner.js';
import { ThemeProvider } from '../../../src/cli/tui/context/ThemeContext.js';

function renderSpinner(props: SpinnerProps = {}) {
  return render(
    <ThemeProvider>
      <Spinner {...props} />
    </ThemeProvider>
  );
}

describe('Spinner', () => {
  it('renders without crashing', () => {
    const { lastFrame } = renderSpinner();
    expect(lastFrame()).toBeTruthy();
  });

  it('renders with a label', () => {
    const { lastFrame } = renderSpinner({ label: 'loading…' });
    expect(lastFrame()).toContain('loading…');
  });

  it('renders without a label', () => {
    const { lastFrame } = renderSpinner();
    // No label text appended; the frame should not contain trailing spaces from a label
    expect(lastFrame()).not.toContain('undefined');
  });

  it('exports SpinnerProps type', () => {
    // Compile-time check: assigning a valid SpinnerProps object
    const props: SpinnerProps = { label: 'test', type: 'dots', color: 'cyan' };
    const { lastFrame } = renderSpinner(props);
    expect(lastFrame()).toContain('test');
  });
});
