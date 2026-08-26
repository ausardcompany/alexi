import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from 'ink-testing-library';

import { ThemeProvider } from '../../src/cli/tui/context/ThemeContext.js';
import { WorkActivity } from '../../src/cli/tui/components/WorkActivity.js';
import type { ToolCallState } from '../../src/cli/tui/context/ChatContext.js';

function tool(overrides: Partial<ToolCallState> = {}): ToolCallState {
  return {
    id: overrides.id ?? `tc-${Math.random().toString(36).slice(2)}`,
    toolName: 'read',
    params: { path: '/tmp/foo' },
    status: 'completed',
    output: 'contents',
    error: null,
    isExpanded: false,
    diff: null,
    startedAt: 1000,
    completedAt: 2000,
    ...overrides,
  };
}

function renderWorkActivity(props: {
  toolCalls: ToolCallState[];
  duration: number;
  isExpanded?: boolean;
}) {
  return render(
    <ThemeProvider>
      <WorkActivity
        toolCalls={props.toolCalls}
        duration={props.duration}
        isExpanded={props.isExpanded}
        animate={false}
      />
    </ThemeProvider>
  );
}

describe('WorkActivity', () => {
  it('renders the summary label with plural tool-call count', () => {
    const toolCalls = [tool(), tool(), tool()];
    const { lastFrame } = renderWorkActivity({
      toolCalls,
      duration: 4 * 60 * 1000 + 12 * 1000,
    });
    const frame = lastFrame() ?? '';
    expect(frame).toContain('Worked for 4m 12s and made 3 tool calls');
  });

  it('uses singular "tool call" when there is exactly one', () => {
    const { lastFrame } = renderWorkActivity({
      toolCalls: [tool()],
      duration: 45000,
    });
    const frame = lastFrame() ?? '';
    expect(frame).toContain('Worked for 45s and made 1 tool call');
  });

  it('renders nothing when there are no tool calls', () => {
    const { lastFrame } = renderWorkActivity({ toolCalls: [], duration: 0 });
    const frame = lastFrame() ?? '';
    expect(frame.trim()).toBe('');
  });

  it('collapses the tool list by default (uncontrolled)', () => {
    const toolCalls = [tool({ toolName: 'grep', params: { pattern: 'MAGIC_STRING' } })];
    const { lastFrame } = renderWorkActivity({ toolCalls, duration: 1000 });
    const frame = lastFrame() ?? '';
    // Summary present, individual tool name hidden inside collapsed disclosure.
    expect(frame).toContain('Worked for');
    expect(frame).not.toContain('MAGIC_STRING');
  });

  it('expands to reveal individual tool rows when isExpanded=true', () => {
    const toolCalls = [tool({ toolName: 'grep', params: { pattern: 'MAGIC_STRING' } })];
    const { lastFrame } = renderWorkActivity({
      toolCalls,
      duration: 1000,
      isExpanded: true,
    });
    const frame = lastFrame() ?? '';
    expect(frame).toContain('MAGIC_STRING');
    expect(frame).toContain('grep');
  });

  it('renders an expand indicator that reflects state', () => {
    const collapsed = renderWorkActivity({ toolCalls: [tool()], duration: 1000 }).lastFrame() ?? '';
    const expanded =
      renderWorkActivity({
        toolCalls: [tool()],
        duration: 1000,
        isExpanded: true,
      }).lastFrame() ?? '';
    // Collapsed: right-pointing triangle. Expanded: down-pointing.
    expect(collapsed).toContain('\u25B8');
    expect(expanded).toContain('\u25BE');
  });
});
