import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render } from 'ink-testing-library';

import { ToolRow, type ToolRowProps } from '../../../src/cli/tui/components/ToolRow.js';
import { ThemeProvider } from '../../../src/cli/tui/context/ThemeContext.js';
import type { DiffData } from '../../../src/cli/tui/context/ChatContext.js';

const defaultProps = (): ToolRowProps => ({
  toolName: 'read',
  params: { filePath: '/tmp/test.ts' },
  status: 'completed',
  output: 'file contents here',
  error: null,
  isExpanded: true,
  onToggle: vi.fn(),
  diff: null,
});

function renderRow(overrides: Partial<ToolRowProps> = {}) {
  return render(
    <ThemeProvider>
      <ToolRow {...defaultProps()} {...overrides} />
    </ThemeProvider>
  );
}

describe('ToolRow', () => {
  it('renders tool name in header', () => {
    const { lastFrame } = renderRow();
    expect(lastFrame()).toContain('read');
  });

  it('renders pending status', () => {
    const { lastFrame } = renderRow({ status: 'pending' });
    expect(lastFrame()).toContain('\u25CB');
    expect(lastFrame()).toContain('pending');
  });

  it('renders running status label with ellipsis', () => {
    const { lastFrame } = renderRow({ status: 'running' });
    expect(lastFrame()).toContain('running\u2026');
  });

  it('renders completed status with checkmark', () => {
    const { lastFrame } = renderRow({ status: 'completed' });
    expect(lastFrame()).toContain('\u2713');
    expect(lastFrame()).toContain('done');
  });

  it('renders failed status with cross', () => {
    const { lastFrame } = renderRow({ status: 'failed' });
    expect(lastFrame()).toContain('\u2717');
    expect(lastFrame()).toContain('failed');
  });

  it('hides output when collapsed and status is not failed', () => {
    const { lastFrame } = renderRow({
      isExpanded: false,
      status: 'completed',
      output: 'hidden-output',
    });
    expect(lastFrame()).not.toContain('hidden-output');
  });

  it('shows output when expanded', () => {
    const { lastFrame } = renderRow({
      isExpanded: true,
      status: 'completed',
      output: 'visible-output',
    });
    expect(lastFrame()).toContain('visible-output');
  });

  it('auto-expands when status is failed regardless of isExpanded', () => {
    const { lastFrame } = renderRow({
      isExpanded: false,
      status: 'failed',
      error: 'something went wrong',
    });
    expect(lastFrame()).toContain('something went wrong');
  });

  it('renders bash command with terminal $ prefix', () => {
    const { lastFrame } = renderRow({
      toolName: 'bash',
      params: { command: 'npm test' },
      output: 'PASS 1 test',
      isExpanded: true,
    });
    expect(lastFrame()).toContain('$ npm test');
    expect(lastFrame()).toContain('PASS 1 test');
  });

  it('renders duration on completed status when provided', () => {
    const { lastFrame } = renderRow({ status: 'completed', duration: 1500 });
    expect(lastFrame()).toContain('1.5s');
  });

  it('renders diff view when a diff is provided and expanded', () => {
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
          ],
        },
      ],
    };
    const { lastFrame } = renderRow({ diff, isExpanded: true });
    expect(lastFrame()).toContain('/src/example.ts');
  });

  it('renders unknown tool with a generic icon (no crash)', () => {
    const { lastFrame } = renderRow({ toolName: 'mystery' });
    expect(lastFrame()).toContain('mystery');
  });

  it('truncates long output with a "more lines" hint', () => {
    const lines = Array.from({ length: 40 }, (_, i) => `row ${i + 1}`).join('\n');
    const { lastFrame } = renderRow({ output: lines, isExpanded: true });
    expect(lastFrame()).toContain('more lines');
  });
});
