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
  const startedAt = overrides.startedAt ?? 1000;
  const completedAt = overrides.completedAt ?? startedAt + 5000;
  return {
    id: nextId('tc'),
    toolName: 'read',
    params: { path: '/tmp/foo' },
    status: 'completed',
    output: 'ok',
    error: null,
    isExpanded: false,
    diff: null,
    startedAt,
    completedAt,
    ...overrides,
  };
}

function msg(
  role: MessageDisplay['role'],
  content: string,
  toolCalls: ToolCallState[] = [],
  extra: Partial<MessageDisplay> = {}
): MessageDisplay {
  return {
    id: nextId(`msg-${role}`),
    role,
    content,
    toolCalls,
    timestamp: 0,
    ...extra,
  };
}

describe('collapseCompletedWork', () => {
  it('groups a user->assistant turn with tool calls into one run', () => {
    const messages: MessageDisplay[] = [
      msg('user', 'Please read the file'),
      msg('assistant', 'Here is the file', [tool()]),
    ];

    const runs = collapseCompletedWork(messages, { isStreaming: false });

    expect(runs).toHaveLength(1);
    expect(runs[0].userMessage?.role).toBe('user');
    expect(runs[0].assistantMessage?.role).toBe('assistant');
    expect(runs[0].toolCalls).toHaveLength(1);
    expect(runs[0].shouldCollapse).toBe(true);
  });

  it('produces one run per user delimiter across multiple turns', () => {
    const messages: MessageDisplay[] = [
      msg('user', 'Turn one'),
      msg('assistant', 'Reply one', [tool()]),
      msg('user', 'Turn two'),
      msg('assistant', 'Reply two', [tool(), tool()]),
      msg('user', 'Turn three'),
      msg('assistant', 'Reply three'),
    ];

    const runs = collapseCompletedWork(messages, { isStreaming: false });

    expect(runs).toHaveLength(3);
    expect(runs[0].toolCalls).toHaveLength(1);
    expect(runs[1].toolCalls).toHaveLength(2);
    expect(runs[2].toolCalls).toHaveLength(0);
  });

  it('trailing run does not collapse while streaming', () => {
    const messages: MessageDisplay[] = [
      msg('user', 'Do work'),
      msg('assistant', 'Working…', [tool()]),
    ];

    const runs = collapseCompletedWork(messages, { isStreaming: true });

    expect(runs).toHaveLength(1);
    expect(runs[0].shouldCollapse).toBe(false);
  });

  it('trailing run does not collapse if no deliverable was produced', () => {
    const messages: MessageDisplay[] = [
      msg('user', 'Do work'),
      // Assistant emitted only tool calls, no textual answer yet.
      msg('assistant', '', [tool()]),
    ];

    const runs = collapseCompletedWork(messages, { isStreaming: false });

    expect(runs).toHaveLength(1);
    expect(runs[0].assistantMessage).toBeNull();
    expect(runs[0].shouldCollapse).toBe(false);
  });

  it('collapses earlier runs even when the trailing run is active', () => {
    const messages: MessageDisplay[] = [
      msg('user', 'First turn'),
      msg('assistant', 'First reply', [tool()]),
      msg('user', 'Second turn'),
      msg('assistant', '', [tool()]),
    ];

    const runs = collapseCompletedWork(messages, { isStreaming: true });

    expect(runs).toHaveLength(2);
    expect(runs[0].shouldCollapse).toBe(true);
    expect(runs[1].shouldCollapse).toBe(false);
  });

  it('sums tool-call wall-clock durations for the run', () => {
    const messages: MessageDisplay[] = [
      msg('user', 'Do work'),
      msg('assistant', 'Done', [
        tool({ startedAt: 1000, completedAt: 3000 }), // 2s
        tool({ startedAt: 3000, completedAt: 3500 }), // 500ms
      ]),
    ];

    const runs = collapseCompletedWork(messages, { isStreaming: false });

    expect(runs[0].durationMs).toBe(2500);
  });

  it('runs with images are treated as deliverables even when text is empty', () => {
    const messages: MessageDisplay[] = [
      msg('user', 'Show the diagram'),
      msg('assistant', '', [tool()], {
        images: [
          {
            id: 'img-1',
            format: 'png',
            sizeBytes: 1024,
            source: 'clipboard',
          },
        ],
      }),
    ];

    const runs = collapseCompletedWork(messages, { isStreaming: false });

    expect(runs[0].assistantMessage).not.toBeNull();
    expect(runs[0].shouldCollapse).toBe(true);
  });

  it('emits a prelude run for messages before the first user message', () => {
    const messages: MessageDisplay[] = [
      msg('assistant', 'Warm-up greeting'),
      msg('user', 'Hello'),
      msg('assistant', 'Hi', [tool()]),
    ];

    const runs = collapseCompletedWork(messages, { isStreaming: false });

    expect(runs).toHaveLength(2);
    expect(runs[0].userMessage).toBeNull();
    expect(runs[0].assistantMessage?.content).toBe('Warm-up greeting');
    expect(runs[1].userMessage?.content).toBe('Hello');
  });

  it('folds interstitial assistant chatter into the run without moving it out', () => {
    const interstitial = msg('assistant', '', [tool()]);
    const messages: MessageDisplay[] = [
      msg('user', 'Refactor'),
      interstitial,
      msg('assistant', 'All done', [tool()]),
    ];

    const runs = collapseCompletedWork(messages, { isStreaming: false });

    expect(runs).toHaveLength(1);
    expect(runs[0].interstitialAssistantMessages).toHaveLength(1);
    expect(runs[0].toolCalls).toHaveLength(2);
    expect(runs[0].assistantMessage?.content).toBe('All done');
  });

  it('ignores tool calls with malformed timestamps in duration total', () => {
    const messages: MessageDisplay[] = [
      msg('user', 'Do work'),
      msg('assistant', 'Done', [
        tool({ startedAt: 1000, completedAt: 3000 }), // 2s
        tool({ startedAt: 5000, completedAt: null }), // running, ignored
        // completedAt < startedAt is dropped
        tool({ startedAt: 10000, completedAt: 9000 }),
      ]),
    ];

    const runs = collapseCompletedWork(messages, { isStreaming: false });

    expect(runs[0].durationMs).toBe(2000);
  });
});
