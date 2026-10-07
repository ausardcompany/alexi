import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render } from 'ink-testing-library';

import { ThemeProvider } from '../../../src/cli/tui/context/ThemeContext.js';
import {
  PIN_INDICATOR,
  Sidebar,
  sortWorktreesPinnedFirst,
} from '../../../src/cli/tui/components/Sidebar.js';
import type { FileChange } from '../../../src/cli/tui/types/props.js';
import type { WorktreeStatusEntry } from '../../../src/agent/worktreeStatus.js';

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
    // `blocked` is platform-aware after issue #1896: U+23F8 (⏸) on
    // non-Linux, U+25A0 (■) on Linux (DejaVu Sans Mono has no glyph
    // for U+23F8, so it would render as tofu).
    const expectedBlocked = process.platform === 'linux' ? '\u25A0' : '\u23F8';
    expect(frame).toContain('\u2713'); // idle
    expect(frame).toContain('\u2717'); // error
    expect(frame).toContain(expectedBlocked); // blocked
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

  describe('worktree pinning (PR #14891)', () => {
    const pinnedFirstEntries: WorktreeStatusEntry[] = [
      { id: 'a', label: 'alpha', status: 'idle', updatedAt: 1 },
      { id: 'b', label: 'beta', status: 'running', updatedAt: 2, pinned: true },
      { id: 'c', label: 'gamma', status: 'idle', updatedAt: 3 },
      { id: 'd', label: 'delta', status: 'idle', updatedAt: 4, pinned: true },
    ];

    it('sortWorktreesPinnedFirst puts pinned entries above unpinned, stable within buckets', () => {
      const sorted = sortWorktreesPinnedFirst(pinnedFirstEntries);
      expect(sorted.map((e) => e.id)).toEqual(['b', 'd', 'a', 'c']);
    });

    it('sortWorktreesPinnedFirst is a no-op when nothing is pinned', () => {
      const input: WorktreeStatusEntry[] = [
        { id: 'a', label: 'a', status: 'idle', updatedAt: 1 },
        { id: 'b', label: 'b', status: 'idle', updatedAt: 2 },
      ];
      const sorted = sortWorktreesPinnedFirst(input);
      expect(sorted).toBe(input);
    });

    it('renders pinned worktrees first with a pin indicator', () => {
      const { lastFrame } = renderWithTheme(
        <Sidebar
          files={[]}
          selectedIndex={0}
          onSelect={vi.fn()}
          onActivate={vi.fn()}
          isFocused={false}
          animateWorktrees={false}
          worktrees={pinnedFirstEntries}
        />
      );
      const frame = lastFrame() ?? '';
      // Pin indicator rendered for both pinned entries.
      expect(frame).toContain(`${PIN_INDICATOR} beta`);
      expect(frame).toContain(`${PIN_INDICATOR} delta`);
      // Unpinned entries do NOT carry the indicator.
      expect(frame).not.toContain(`${PIN_INDICATOR} alpha`);
      expect(frame).not.toContain(`${PIN_INDICATOR} gamma`);
      // Pinned bucket appears first in the rendered frame.
      const betaIdx = frame.indexOf('beta');
      const deltaIdx = frame.indexOf('delta');
      const alphaIdx = frame.indexOf('alpha');
      const gammaIdx = frame.indexOf('gamma');
      expect(betaIdx).toBeGreaterThan(-1);
      expect(deltaIdx).toBeGreaterThan(-1);
      expect(alphaIdx).toBeGreaterThan(-1);
      expect(gammaIdx).toBeGreaterThan(-1);
      expect(Math.max(betaIdx, deltaIdx)).toBeLessThan(Math.min(alphaIdx, gammaIdx));
    });

    it('invokes onTogglePin with the selected worktree id when p is pressed', async () => {
      const onTogglePin = vi.fn();
      const { stdin } = renderWithTheme(
        <Sidebar
          files={[]}
          selectedIndex={0}
          onSelect={vi.fn()}
          onActivate={vi.fn()}
          isFocused={true}
          animateWorktrees={false}
          worktrees={pinnedFirstEntries}
          selectedWorktreeIndex={2}
          onTogglePin={onTogglePin}
        />
      );
      // Yield so useInput subscribes before we fire the keystroke.
      await new Promise((r) => setImmediate(r));
      stdin.write('p');
      await new Promise((r) => setImmediate(r));
      expect(onTogglePin).toHaveBeenCalledTimes(1);
      // Index 2 in the raw snapshot is 'gamma'.
      expect(onTogglePin).toHaveBeenCalledWith('c');
    });

    it('does not invoke onTogglePin when no selected worktree index is wired', async () => {
      const onTogglePin = vi.fn();
      const { stdin } = renderWithTheme(
        <Sidebar
          files={[]}
          selectedIndex={0}
          onSelect={vi.fn()}
          onActivate={vi.fn()}
          isFocused={true}
          animateWorktrees={false}
          worktrees={pinnedFirstEntries}
          onTogglePin={onTogglePin}
        />
      );
      await new Promise((r) => setImmediate(r));
      stdin.write('p');
      await new Promise((r) => setImmediate(r));
      expect(onTogglePin).not.toHaveBeenCalled();
    });

    it('does not invoke onTogglePin when the sidebar is not focused', async () => {
      const onTogglePin = vi.fn();
      const { stdin } = renderWithTheme(
        <Sidebar
          files={[]}
          selectedIndex={0}
          onSelect={vi.fn()}
          onActivate={vi.fn()}
          isFocused={false}
          animateWorktrees={false}
          worktrees={pinnedFirstEntries}
          selectedWorktreeIndex={0}
          onTogglePin={onTogglePin}
        />
      );
      await new Promise((r) => setImmediate(r));
      stdin.write('p');
      await new Promise((r) => setImmediate(r));
      expect(onTogglePin).not.toHaveBeenCalled();
    });
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
