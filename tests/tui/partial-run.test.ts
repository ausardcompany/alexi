import { describe, it, expect } from 'vitest';

import { collapseCompletedWork } from '../../src/cli/tui/utils/collapseWork.js';
import type { MessageDisplay } from '../../src/cli/tui/components/MessageArea.js';
import type { ToolCallState } from '../../src/cli/tui/context/ChatContext.js';

let idCounter = 0;
function nextId(prefix: string): string {
  idCounter += 1;
  return `${prefix}-${idCounter}`;
}

function tool(overrides: Partial<ToolCallState> = {}): ToolCallState {
  return {
    id: nextId('tc'),
    toolName: 'bash',
    params: { command: 'echo hi' },
    status: 'completed',
    output: 'hi',
    error: null,
    isExpanded: false,
    diff: null,
    startedAt: 1000,
    completedAt: 2000,
    ...overrides,
  };
}

function msg(
  role: MessageDisplay['role'],
  content: string,
  toolCalls: ToolCallState[] = []
): MessageDisplay {
  return {
    id: nextId(`msg-${role}`),
    role,
    content,
    toolCalls,
    timestamp: 0,
  };
}

describe('partial run rendering', () => {
  it('failed tool call keeps the run expanded even with a deliverable', () => {
    const messages: MessageDisplay[] = [
      msg('user', 'Try the thing'),
      msg('assistant', 'It failed, sorry', [
        tool({ status: 'failed', error: 'boom', output: null }),
      ]),
    ];

    const runs = collapseCompletedWork(messages, { isStreaming: false });

    expect(runs).toHaveLength(1);
    expect(runs[0].hasFailure).toBe(true);
    expect(runs[0].shouldCollapse).toBe(false);
  });

  it('mixed pass/fail keeps the run expanded', () => {
    const messages: MessageDisplay[] = [
      msg('user', 'Do many things'),
      msg('assistant', 'Partially done', [
        tool({ status: 'completed' }),
        tool({ status: 'failed', error: 'oops', output: null }),
        tool({ status: 'completed' }),
      ]),
    ];

    const runs = collapseCompletedWork(messages, { isStreaming: false });

    expect(runs[0].hasFailure).toBe(true);
    expect(runs[0].shouldCollapse).toBe(false);
  });

  it('active run with a running tool never collapses', () => {
    const messages: MessageDisplay[] = [
      msg('user', 'Long task'),
      msg('assistant', '', [tool({ status: 'running', completedAt: null })]),
    ];

    const runs = collapseCompletedWork(messages, { isStreaming: true });

    expect(runs[0].shouldCollapse).toBe(false);
  });

  it('run with zero tool calls never collapses (nothing to summarise)', () => {
    const messages: MessageDisplay[] = [msg('user', 'Hi'), msg('assistant', 'Hello')];

    const runs = collapseCompletedWork(messages, { isStreaming: false });

    expect(runs[0].toolCalls).toHaveLength(0);
    expect(runs[0].shouldCollapse).toBe(false);
  });
});
