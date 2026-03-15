import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from 'ink-testing-library';

import { DiffView } from '../../../src/cli/tui/components/DiffView.js';
import { ThemeProvider } from '../../../src/cli/tui/context/ThemeContext.js';
import type { DiffHunk } from '../../../src/cli/tui/context/ChatContext.js';

const sampleHunk: DiffHunk = {
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
};

function renderDiffView(filePath: string, hunks: DiffHunk[]) {
  return render(
    <ThemeProvider>
      <DiffView filePath={filePath} hunks={hunks} />
    </ThemeProvider>
  );
}

describe('DiffView', () => {
  it('renders without crashing with empty hunks', () => {
    const { lastFrame } = renderDiffView('path/to/file.ts', []);
    const output = lastFrame();
    expect(output).toBeDefined();
    expect(output).toContain('path/to/file.ts');
  });

  it('renders file path header', () => {
    const { lastFrame } = renderDiffView('path/to/file.ts', [sampleHunk]);
    expect(lastFrame()).toContain('─── path/to/file.ts ───');
  });

  it('renders hunk header', () => {
    const { lastFrame } = renderDiffView('test.ts', [sampleHunk]);
    expect(lastFrame()).toContain('@@ -1,3 +1,4 @@');
  });

  it('renders added lines with + prefix', () => {
    const { lastFrame } = renderDiffView('test.ts', [sampleHunk]);
    const output = lastFrame()!;
    expect(output).toContain('+const b = 3;');
    expect(output).toContain('+const c = 4;');
  });

  it('renders removed lines with - prefix', () => {
    const { lastFrame } = renderDiffView('test.ts', [sampleHunk]);
    expect(lastFrame()).toContain('-const b = 2;');
  });

  it('renders context lines', () => {
    const { lastFrame } = renderDiffView('test.ts', [sampleHunk]);
    const output = lastFrame()!;
    expect(output).toContain('const a = 1;');
    expect(output).toContain('export { a };');
  });

  it('renders multiple hunks', () => {
    const secondHunk: DiffHunk = {
      oldStart: 10,
      oldLines: 2,
      newStart: 11,
      newLines: 3,
      lines: [
        { type: 'context', content: 'function foo() {' },
        { type: 'add', content: '  return 42;' },
        { type: 'context', content: '}' },
      ],
    };

    const { lastFrame } = renderDiffView('multi.ts', [sampleHunk, secondHunk]);
    const output = lastFrame()!;
    expect(output).toContain('@@ -1,3 +1,4 @@');
    expect(output).toContain('@@ -10,2 +11,3 @@');
  });

  it('renders line numbers in gutter', () => {
    const { lastFrame } = renderDiffView('test.ts', [sampleHunk]);
    const output = lastFrame()!;
    // Context line at oldStart=1, newStart=1 → gutter shows "1 1"
    expect(output).toContain('1 1');
    // Removed line at old=2, no new → gutter shows "2  "
    expect(output).toContain('2');
    // Added lines at new=2 and new=3
    expect(output).toContain('3');
  });
});
