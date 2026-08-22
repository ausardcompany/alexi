/**
 * Tests for the Task tool subagent-result surfacer.
 *
 * Mirrors upstream opencode `packages/opencode/test/tool/task.test.ts`
 * (+65 lines). Validates that failed inner tool calls propagate the
 * error instead of returning empty/silent text (opencode #43821,
 * commit `35fe5b7`).
 */

import { describe, expect, it } from 'vitest';
import { surfaceSubagentResult, type SubagentResult } from './task.js';

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
