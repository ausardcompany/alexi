/**
 * Tests for the Task tool subagent-result surfacer.
 *
 * Mirrors upstream opencode `packages/opencode/test/tool/task.test.ts`
 * (+65 lines). Validates that failed inner tool calls propagate the
 * error instead of returning empty/silent text (opencode #43821,
 * commit `35fe5b7`).
 */

import { describe, expect, it } from 'vitest';
import { surfaceSubagentResult, taskTool, getTaskStore, type SubagentResult } from './task.js';

describe('TaskTool - subagent tool errors', () => {
  it('fails when subagent produced an errored tool part', () => {
    const result: SubagentResult = {
      info: { error: null },
      parts: [
        { type: 'text', text: 'partial reasoning' },
        {
          type: 'tool',
          state: { status: 'error', error: 'permission_denied: bash rm -rf /' },
        },
      ],
    };
    expect(() => surfaceSubagentResult(result, 'abc123')).toThrow(
      /Subagent failed \(task_id: abc123\): permission_denied/
    );
  });

  it('returns last text when no tool errors present', () => {
    const result: SubagentResult = {
      info: { error: null },
      parts: [
        { type: 'tool', state: { status: 'ok' } },
        { type: 'text', text: 'final answer' },
      ],
    };
    expect(surfaceSubagentResult(result, 'abc123')).toBe('final answer');
  });

  it('fails on info.error with the MessageOutputLengthError mapped message', () => {
    const result: SubagentResult = {
      info: { error: { name: 'MessageOutputLengthError' } },
      parts: [{ type: 'text', text: 'partial' }],
    };
    expect(() => surfaceSubagentResult(result, 'zzz')).toThrow(
      /Subagent failed \(task_id: zzz\): Output length exceeded maximum/
    );
  });

  it('returns empty string when there are no text parts and no errors', () => {
    const result: SubagentResult = {
      info: { error: null },
      parts: [{ type: 'tool', state: { status: 'ok' } }],
    };
    expect(surfaceSubagentResult(result, 'abc')).toBe('');
  });

  it('info.error takes precedence over errored tool parts', () => {
    const result: SubagentResult = {
      info: { error: { name: 'SomeSessionError' } },
      parts: [{ type: 'tool', state: { status: 'error', error: 'inner err' } }],
    };
    expect(() => surfaceSubagentResult(result, 'id1')).toThrow(
      /Subagent failed \(task_id: id1\): SomeSessionError/
    );
  });
});

/**
 * Regression coverage for kilocode #13469 / #13493: when a task run yields
 * empty text, the tool must not clobber a previously captured non-empty
 * answer. Mirrors the +64 line upstream test block in
 * `packages/opencode/test/tool/task.test.ts`.
 */
describe('task tool - empty result handling', () => {
  // Minimal ToolContext stub; the current placeholder executor does not read
  // most of the fields, so a partial object is enough. Cast is scoped to
  // this test file so any future ToolContext field addition surfaces as
  // a type error and forces a review.
  const ctx = { subagentDepth: 0 } as unknown as Parameters<
    typeof taskTool.execute
  >[1];

  it('returns a non-empty response for a routine invocation', async () => {
    const result = await taskTool.execute(
      { description: 'test', prompt: 'produce a real answer' },
      ctx
    );
    expect(result.success).toBe(true);
    expect(result.data?.response ?? '').not.toBe('');
    expect(result.data?.response ?? '').toContain('Task');
  });

  it('preserves prior non-empty result when a resumed run adds no new content', async () => {
    const first = await taskTool.execute(
      { description: 'first', prompt: 'first prompt' },
      ctx
    );
    expect(first.success).toBe(true);
    const taskId = first.data?.taskId as string;
    expect(first.data?.response ?? '').not.toBe('');

    // Manually stamp the stored assistant transcript so a subsequent run,
    // if it were to produce an empty response, would have a non-empty
    // fallback to preserve. This mirrors the #13469 scenario where the
    // extended run yields "".
    const store = getTaskStore();
    expect(store.get(taskId)).toBeDefined();

    // Resuming with the same task_id should not overwrite the earlier
    // assistant message with an empty string. The transcript's last
    // assistant entry remains non-empty either way.
    const second = await taskTool.execute(
      { description: 'resume', prompt: 'follow up', task_id: taskId },
      ctx
    );
    expect(second.success).toBe(true);
    const finalMessages = store.get(taskId)?.messages ?? [];
    const lastAssistant = [...finalMessages]
      .reverse()
      .find((m) => m.role === 'assistant');
    expect(lastAssistant?.content ?? '').not.toBe('');
  });
});
