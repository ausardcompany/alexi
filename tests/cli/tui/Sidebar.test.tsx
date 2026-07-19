import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render } from 'ink-testing-library';

import { ThemeProvider } from '../../../src/cli/tui/context/ThemeContext.js';
import { Sidebar } from '../../../src/cli/tui/components/Sidebar.js';
import type { FileChange } from '../../../src/cli/tui/types/props.js';

const MOCK_FILES: FileChange[] = [
  { path: 'src/foo.ts', status: 'added', additions: 10, deletions: 0, timestamp: Date.now() },
  { path: 'src/bar.ts', status: 'modified', additions: 5, deletions: 3, timestamp: Date.now() },
  { path: 'src/old.ts', status: 'deleted', additions: 0, deletions: 20, timestamp: Date.now() },
];

function renderWithTheme(ui: React.JSX.Element) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe('Sidebar', () => {
  it('renders file list with status indicators', () => {
    const { lastFrame } = renderWithTheme(
      <Sidebar
        files={MOCK_FILES}
        selectedIndex={0}
        onSelect={vi.fn()}
        onActivate={vi.fn()}
        isFocused={false}
      />
    );
    const frame = lastFrame() ?? '';
    expect(frame).toContain('src/foo.ts');
    expect(frame).toContain('src/bar.ts');
    expect(frame).toContain('src/old.ts');
    expect(frame).toContain('Files (3)');
  });

  it('shows empty state when no files', () => {
    const { lastFrame } = renderWithTheme(
      <Sidebar
        files={[]}
        selectedIndex={0}
        onSelect={vi.fn()}
        onActivate={vi.fn()}
        isFocused={false}
      />
    );
    const frame = lastFrame() ?? '';
    expect(frame).toContain('No changes yet');
  });

  it('shows status characters', () => {
    const { lastFrame } = renderWithTheme(
      <Sidebar
        files={MOCK_FILES}
        selectedIndex={0}
        onSelect={vi.fn()}
        onActivate={vi.fn()}
        isFocused={false}
      />
    );
    const frame = lastFrame() ?? '';
    // + for added, ~ for modified, - for deleted
    expect(frame).toContain('+');
    expect(frame).toContain('~');
    expect(frame).toContain('-');
  });

  it('renders without crashing when focused', () => {
    const { lastFrame } = renderWithTheme(
      <Sidebar
        files={MOCK_FILES}
        selectedIndex={1}
        onSelect={vi.fn()}
        onActivate={vi.fn()}
        isFocused={true}
      />
    );
    expect(lastFrame()).toBeDefined();
  });

  it('renders compact per-model usage section when usage entries are provided', () => {
    const { lastFrame } = renderWithTheme(
      <Sidebar
        files={MOCK_FILES}
        selectedIndex={0}
        onSelect={vi.fn()}
        onActivate={vi.fn()}
        isFocused={false}
        usage={[
          { model: 'Claude 3.5 Sonnet', tokens: 12_345, cost: 0.45 },
          { model: 'Claude 4.5 Haiku', tokens: 3_200, cost: 0.02 },
        ]}
      />
    );
    const frame = lastFrame() ?? '';
    expect(frame).toContain('Usage');
    expect(frame).toContain('Claude 3.5 Sonnet');
    expect(frame).toContain('12.3K tokens');
    expect(frame).toContain('$0.45');
    expect(frame).toContain('Total');
  });

  it('omits usage section when usage prop is undefined', () => {
    const { lastFrame } = renderWithTheme(
      <Sidebar
        files={MOCK_FILES}
        selectedIndex={0}
        onSelect={vi.fn()}
        onActivate={vi.fn()}
        isFocused={false}
      />
    );
    const frame = lastFrame() ?? '';
    expect(frame).not.toContain('Usage');
    expect(frame).not.toContain('Total');
  });

  it('omits usage section when usage array is empty', () => {
    const { lastFrame } = renderWithTheme(
      <Sidebar
        files={MOCK_FILES}
        selectedIndex={0}
        onSelect={vi.fn()}
        onActivate={vi.fn()}
        isFocused={false}
        usage={[]}
      />
    );
    const frame = lastFrame() ?? '';
    expect(frame).not.toContain('Usage');
  });

  it('renders usage section even when there are no file changes', () => {
    const { lastFrame } = renderWithTheme(
      <Sidebar
        files={[]}
        selectedIndex={0}
        onSelect={vi.fn()}
        onActivate={vi.fn()}
        isFocused={false}
        usage={[{ model: 'GPT-4o', tokens: 1_000_000, cost: 2.5 }]}
      />
    );
    const frame = lastFrame() ?? '';
    expect(frame).toContain('No changes yet');
    expect(frame).toContain('GPT-4o');
    expect(frame).toContain('1M tokens');
    expect(frame).toContain('$2.50');
  });
});
