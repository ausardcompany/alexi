import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render } from 'ink-testing-library';

import { ToolCallBlock } from '../../../src/cli/tui/components/ToolCallBlock.js';
import type { ToolCallBlockProps } from '../../../src/cli/tui/components/ToolCallBlock.js';
import { ThemeProvider } from '../../../src/cli/tui/context/ThemeContext.js';
import type { DiffData } from '../../../src/cli/tui/context/ChatContext.js';

const defaultProps = (): ToolCallBlockProps => ({
  toolName: 'read',
  params: { filePath: '/tmp/test.ts' },
  status: 'completed',
  output: 'file contents here',
  error: null,
  isExpanded: true,
  onToggle: vi.fn(),
  diff: null,
});

function renderBlock(overrides: Partial<ToolCallBlockProps> = {}) {
  return render(
    <ThemeProvider>
      <ToolCallBlock {...defaultProps()} {...overrides} />
    </ThemeProvider>
  );
}

describe('ToolCallBlock', () => {
  it('renders tool name in header', () => {
    const { lastFrame } = renderBlock();
    expect(lastFrame()).toContain('read');
  });

  it('renders pending status', () => {
    const { lastFrame } = renderBlock({ status: 'pending' });
    expect(lastFrame()).toContain('○');
    expect(lastFrame()).toContain('pending');
  });

  it('renders running status with spinner', () => {
    const { lastFrame } = renderBlock({ status: 'running' });
    expect(lastFrame()).toContain('running…');
  });

  it('renders completed status', () => {
    const { lastFrame } = renderBlock({ status: 'completed' });
    expect(lastFrame()).toContain('✓');
    expect(lastFrame()).toContain('done');
  });

  it('renders failed status', () => {
    const { lastFrame } = renderBlock({ status: 'failed' });
    expect(lastFrame()).toContain('✗');
    expect(lastFrame()).toContain('failed');
  });

  it('renders params preview', () => {
    const { lastFrame } = renderBlock({ params: { filePath: '/tmp/test.ts' } });
    expect(lastFrame()).toContain('/tmp/test.ts');
  });

  it('truncates long params preview', () => {
    const longPath = '/very/long/path/that/exceeds/the/sixty/character/limit/for/param/preview.ts';
    const { lastFrame } = renderBlock({ params: { filePath: longPath } });
    expect(lastFrame()).toContain('\u2026');
  });

  it('shows output when expanded', () => {
    const { lastFrame } = renderBlock({ isExpanded: true, output: 'hello' });
    expect(lastFrame()).toContain('hello');
  });

  it('hides output when collapsed', () => {
    const { lastFrame } = renderBlock({ isExpanded: false, output: 'hello' });
    expect(lastFrame()).not.toContain('hello');
  });

  it('shows error message when expanded and error is set', () => {
    const { lastFrame } = renderBlock({
      isExpanded: true,
      error: 'something went wrong',
    });
    expect(lastFrame()).toContain('something went wrong');
  });

  it('shows bash command format', () => {
    const { lastFrame } = renderBlock({
      toolName: 'bash',
      params: { command: 'ls' },
      output: 'file.txt',
      isExpanded: true,
    });
    expect(lastFrame()).toContain('$ ls');
    expect(lastFrame()).toContain('file.txt');
  });

  it('truncates long output', () => {
    const lines = Array.from({ length: 25 }, (_, i) => `line ${i + 1}`).join('\n');
    const { lastFrame } = renderBlock({ output: lines, isExpanded: true });
    expect(lastFrame()).toContain('more lines');
  });

  it('renders diff view when diff is provided', () => {
    const diff: DiffData = {
      filePath: '/src/example.ts',
      hunks: [
        {
          oldStart: 1,
          oldLines: 3,
          newStart: 1,
          newLines: 4,
          lines: [
            { type: 'context', content: 'const a = 1;' },
            { type: 'remove', content: 'const b = 2;' },
            { type: 'add', content: 'const b = 3;' },
            { type: 'add', content: 'const c = 4;' },
            { type: 'context', content: 'export { a };' },
          ],
        },
      ],
    };
    const { lastFrame } = renderBlock({ diff, isExpanded: true });
    expect(lastFrame()).toContain('/src/example.ts');
  });
});
