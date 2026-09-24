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

  it('omits worktrees section when worktrees prop is undefined', () => {
    const { lastFrame } = renderWithTheme(
      <Sidebar
        files={MOCK_FILES}
        selectedIndex={0}
        onSelect={vi.fn()}
        onActivate={vi.fn()}
        isFocused={false}
      />
    );
    expect(lastFrame() ?? '').not.toContain('Worktrees');
  });

  it('omits worktrees section when worktrees array is empty', () => {
    const { lastFrame } = renderWithTheme(
      <Sidebar
        files={MOCK_FILES}
        selectedIndex={0}
        onSelect={vi.fn()}
        onActivate={vi.fn()}
        isFocused={false}
        worktrees={[]}
      />
    );
    expect(lastFrame() ?? '').not.toContain('Worktrees');
  });

  it('renders worktrees section with a status icon per entry', () => {
    const { lastFrame } = renderWithTheme(
      <Sidebar
        files={MOCK_FILES}
        selectedIndex={0}
        onSelect={vi.fn()}
        onActivate={vi.fn()}
        isFocused={false}
        animateWorktrees={false}
        worktrees={[
          { id: 'a', label: 'feature-x', status: 'running', updatedAt: 1 },
          { id: 'b', label: 'main', status: 'idle', updatedAt: 2 },
          { id: 'c', label: 'stale', status: 'error', updatedAt: 3 },
          { id: 'd', label: 'waiting', status: 'blocked', updatedAt: 4 },
        ]}
      />
    );
    const frame = lastFrame() ?? '';
    expect(frame).toContain('Worktrees (4)');
    expect(frame).toContain('feature-x');
    expect(frame).toContain('main');
    expect(frame).toContain('stale');
    expect(frame).toContain('waiting');
    // Every non-running icon glyph should be present verbatim.
    expect(frame).toContain('\u2713'); // idle
    expect(frame).toContain('\u2717'); // error
    expect(frame).toContain('\u23F8'); // blocked
    // Running (static fallback since animate=false)
    expect(frame).toContain('\u25D0');
  });

  it('renders worktrees section when there are no file changes', () => {
    const { lastFrame } = renderWithTheme(
      <Sidebar
        files={[]}
        selectedIndex={0}
        onSelect={vi.fn()}
        onActivate={vi.fn()}
        isFocused={false}
        animateWorktrees={false}
        worktrees={[{ id: 'a', label: 'solo', status: 'idle', updatedAt: 1 }]}
      />
    );
    const frame = lastFrame() ?? '';
    expect(frame).toContain('No changes yet');
    expect(frame).toContain('Worktrees (1)');
    expect(frame).toContain('solo');
  });

  it('renders optional detail dimmed next to the label', () => {
    const { lastFrame } = renderWithTheme(
      <Sidebar
        files={[]}
        selectedIndex={0}
        onSelect={vi.fn()}
        onActivate={vi.fn()}
        isFocused={false}
        animateWorktrees={false}
        worktrees={[{ id: 'a', label: 'solo', status: 'idle', detail: 'ready', updatedAt: 1 }]}
      />
    );
    expect(lastFrame() ?? '').toContain('ready');
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
