/**
 * Regression test: ensures the parallel-tool-call hint stays in the
 * description string of every read/search/edit tool and the shell tools.
 *
 * Issue #811: Tool descriptions render every turn even when the system
 * prompt is prefix-cached, so we repeat the hint there to keep the
 * model from serializing independent reads turn-by-turn.
 *
 * If a future edit drops the hint, this test fails immediately.
 */

import { describe, it, expect } from 'vitest';
import { readTool } from '../read.js';
import { grepTool } from '../grep.js';
import { globTool } from '../glob.js';
import { codesearchTool } from '../codesearch.js';
import { editTool } from '../edit.js';
import { multieditTool } from '../multiedit.js';
import { bashTool } from '../bash.js';
import { shellTool } from '../shell.js';
import { batchTool } from '../batch.js';

const PARALLEL_HINT = 'emit those tool calls in the same response';
const SHELL_EXTRA_HINT = 'Include multiple commands in the same call';

describe('parallel-tool-call hint in tool descriptions', () => {
  describe.each([
    ['read', readTool],
    ['grep', grepTool],
    ['glob', globTool],
    ['codesearch', codesearchTool],
    ['edit', editTool],
    ['multiedit', multieditTool],
    ['bash', bashTool],
    ['shell', shellTool],
  ])('%s tool', (_name, tool) => {
    it('contains the parallel-call hint', () => {
      expect(tool.description).toContain(PARALLEL_HINT);
    });
  });

  describe.each([
    ['bash', bashTool],
    ['shell', shellTool],
  ])('%s tool', (_name, tool) => {
    it('contains the shell-specific multi-command sentence', () => {
      expect(tool.description).toContain(SHELL_EXTRA_HINT);
    });
  });

  it('batch tool description is unchanged (no parallel-call hint paragraph)', () => {
    // batch is intentionally excluded: it is itself the parallel-execution
    // primitive, so adding the hint there would be self-referential noise.
    expect(batchTool.description).not.toContain(PARALLEL_HINT);
  });
});
