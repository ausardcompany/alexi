/**
 * End-to-end verification that hook `contextModification` output reaches the
 * model as a stamped `<hook_context>` user message.
 *
 * Covers issue #1542: PreToolUse and PostToolUse hooks that return
 * `contextModification` must have their payload appended to the conversation
 * after the tool result, stamped with `tool_name` and `tool_call_id`
 * attributes. The stamped block is what the model sees on the next turn.
 *
 * Wire shape asserted here:
 *   <hook_context tool_name="TOOL" tool_call_id="ID" [phase="pre"]>
 *   PAYLOAD
 *   </hook_context>
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { CompletionResult } from '../../src/providers/sapOrchestration.js';

// --- Mock the whole provider / router / cost / tool graph the same way
// existing hook tests do, so the agentic loop is deterministic and no live
// SAP credentials are required.

vi.mock('../../src/core/memory.js', () => ({
  getMemoryManager: vi.fn(() => ({
    getContextString: vi.fn().mockReturnValue(''),
  })),
}));

vi.mock('../../src/core/sessionContext.js', () => ({
  getSessionContextString: vi.fn().mockReturnValue(''),
}));

vi.mock('../../src/providers/index.js', () => {
  const getProviderForModel = vi.fn();
  return {
    getProviderForModel,
    getProviderForModelWithFallback: vi.fn((modelId: string) => ({
      provider: getProviderForModel(modelId),
      effectiveModelId: modelId,
      usedFallback: false,
    })),
    getDefaultModel: vi.fn(() => 'gpt-4o'),
  };
});

vi.mock('../../src/core/router.js', () => ({
  routePrompt: vi.fn(() => ({
    modelId: 'gpt-4o',
    reason: 'test routing',
    confidence: 0.9,
  })),
  recordRouteOutcome: vi.fn(),
  classifyRouteError: vi.fn(() => ({ kind: 'unknown' })),
}));

vi.mock('../../src/core/costTracker.js', () => ({
  getCostTracker: vi.fn(() => ({
    recordUsage: vi.fn(),
  })),
}));

const mockToolRegistry = {
  list: vi.fn(),
  get: vi.fn(),
};

vi.mock('../../src/tool/index.js', () => ({
  getToolRegistry: () => mockToolRegistry,
  registerTool: vi.fn(),
}));

vi.mock('../../src/tool/tools/index.js', () => ({
  registerBuiltInTools: vi.fn(),
}));

// Explicit per-event hook mock. Tests set queued results per phase so we
// exercise the Pre / Post ordering guarantees without racing on a single
// shared queue.
const preHooks = vi.fn();
const postHooks = vi.fn();
const stopHooks = vi.fn();

vi.mock('../../src/hooks/index.js', () => ({
  executeHooks: (event: string, ...rest: unknown[]) => {
    if (event === 'PreToolUse') {
      return preHooks(event, ...rest);
    }
    if (event === 'PostToolUse') {
      return postHooks(event, ...rest);
    }
    if (event === 'Stop') {
      return stopHooks(event, ...rest);
    }
    return Promise.resolve([]);
  },
  createHookContext: (event: string, data: Record<string, unknown>) => ({
    event,
    timestamp: Date.now(),
    ...data,
  }),
  getBlockCap: () => 8,
}));

import { agenticChat } from '../../src/core/agenticChat.js';
import { getProviderForModel } from '../../src/providers/index.js';

interface WireMessage {
  role: string;
  content?: string;
  tool_call_id?: string;
}

function findHookContextBlocks(messages: WireMessage[]): WireMessage[] {
  return messages.filter(
    (m) => m.role === 'user' && typeof m.content === 'string' && m.content.includes('<hook_context')
  );
}

describe('hook contextModification -> model injection (issue #1542)', () => {
  let mockProvider: { complete: ReturnType<typeof vi.fn> };

  const mockWriteTool = {
    name: 'write',
    description: 'Write to file',
    toFunctionSchema: () => ({
      name: 'write',
      description: 'Write to file',
      parameters: { type: 'object', properties: {} },
    }),
    execute: vi.fn().mockResolvedValue({ success: true, data: { written: true } }),
  };

  const mockReadTool = {
    name: 'read',
    description: 'Read file',
    toFunctionSchema: () => ({
      name: 'read',
      description: 'Read file',
      parameters: { type: 'object', properties: {} },
    }),
    execute: vi.fn().mockResolvedValue({ success: true, data: { content: 'x' } }),
  };

  beforeEach(() => {
    mockProvider = { complete: vi.fn() };
    vi.mocked(getProviderForModel).mockReturnValue(
      mockProvider as unknown as ReturnType<typeof getProviderForModel>
    );

    mockToolRegistry.list.mockReturnValue([mockWriteTool, mockReadTool]);
    mockToolRegistry.get.mockImplementation((name: string) => {
      if (name === 'write') {
        return mockWriteTool;
      }
      if (name === 'read') {
        return mockReadTool;
      }
      return undefined;
    });

    // Default: hooks pass with no context payload
    preHooks.mockResolvedValue([]);
    postHooks.mockResolvedValue([]);
    stopHooks.mockResolvedValue([]);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('PostToolUse contextModification', () => {
    it('injects a stamped <hook_context> user message after the tool result', async () => {
      // LLM calls a tool, then finishes.
      mockProvider.complete.mockResolvedValueOnce({
        text: '',
        toolCalls: [
          {
            id: 'call_abc',
            type: 'function',
            function: { name: 'write', arguments: '{"filePath": "/x.txt"}' },
          },
        ],
        usage: { prompt_tokens: 10, completion_tokens: 5, total_tokens: 15 },
      } satisfies CompletionResult);

      // PostToolUse hook returns a contextModification payload.
      postHooks.mockResolvedValueOnce([
        {
          success: true,
          duration: 3,
          contextModification: 'Lint found 3 warnings',
        },
      ]);

      mockProvider.complete.mockResolvedValueOnce({
        text: 'ok',
        usage: { prompt_tokens: 20, completion_tokens: 2, total_tokens: 22 },
      } satisfies CompletionResult);

      await agenticChat('write it');

      // On the second LLM call the wire history must contain the stamped
      // <hook_context> user message.
      const wireMessages = mockProvider.complete.mock.calls[1][0] as WireMessage[];
      const blocks = findHookContextBlocks(wireMessages);
      expect(blocks).toHaveLength(1);
      const block = blocks[0].content as string;
      expect(block).toContain('<hook_context tool_name="write" tool_call_id="call_abc"');
      expect(block).toContain('Lint found 3 warnings');
      expect(block).toContain('</hook_context>');
      // PostToolUse blocks carry no phase attribute (backwards-compat wire shape).
      expect(block).not.toContain('phase="pre"');
    });

    it('places the <hook_context> block AFTER the matching tool result', async () => {
      mockProvider.complete.mockResolvedValueOnce({
        text: '',
        toolCalls: [
          {
            id: 'call_1',
            type: 'function',
            function: { name: 'write', arguments: '{}' },
          },
        ],
        usage: { prompt_tokens: 10, completion_tokens: 5, total_tokens: 15 },
      } satisfies CompletionResult);

      postHooks.mockResolvedValueOnce([
        { success: true, duration: 1, contextModification: 'post-payload' },
      ]);

      mockProvider.complete.mockResolvedValueOnce({
        text: 'done',
        usage: { prompt_tokens: 20, completion_tokens: 2, total_tokens: 22 },
      } satisfies CompletionResult);

      await agenticChat('go');

      const wire = mockProvider.complete.mock.calls[1][0] as WireMessage[];
      const toolIndex = wire.findIndex((m) => m.role === 'tool' && m.tool_call_id === 'call_1');
      const hookIndex = wire.findIndex(
        (m) =>
          m.role === 'user' && typeof m.content === 'string' && m.content.includes('<hook_context')
      );
      expect(toolIndex).toBeGreaterThanOrEqual(0);
      expect(hookIndex).toBeGreaterThan(toolIndex);
    });
  });

  describe('PreToolUse contextModification', () => {
    it('injects a stamped <hook_context phase="pre"> user message', async () => {
      mockProvider.complete.mockResolvedValueOnce({
        text: '',
        toolCalls: [
          {
            id: 'call_pre_1',
            type: 'function',
            function: { name: 'write', arguments: '{}' },
          },
        ],
        usage: { prompt_tokens: 10, completion_tokens: 5, total_tokens: 15 },
      } satisfies CompletionResult);

      // PreToolUse hook succeeds and returns a context payload.
      preHooks.mockResolvedValueOnce([
        {
          success: true,
          duration: 2,
          contextModification: 'Cache warm: 800MB',
        },
      ]);

      mockProvider.complete.mockResolvedValueOnce({
        text: 'ok',
        usage: { prompt_tokens: 20, completion_tokens: 2, total_tokens: 22 },
      } satisfies CompletionResult);

      await agenticChat('go');

      const wire = mockProvider.complete.mock.calls[1][0] as WireMessage[];
      const blocks = findHookContextBlocks(wire);
      expect(blocks).toHaveLength(1);
      const block = blocks[0].content as string;
      expect(block).toContain('phase="pre"');
      expect(block).toContain('tool_name="write"');
      expect(block).toContain('tool_call_id="call_pre_1"');
      expect(block).toContain('Cache warm: 800MB');
    });
  });

  describe('ordering and phase discrimination', () => {
    it('flushes Pre blocks BEFORE Post blocks in the same iteration', async () => {
      mockProvider.complete.mockResolvedValueOnce({
        text: '',
        toolCalls: [
          {
            id: 'call_seq',
            type: 'function',
            function: { name: 'write', arguments: '{}' },
          },
        ],
        usage: { prompt_tokens: 10, completion_tokens: 5, total_tokens: 15 },
      } satisfies CompletionResult);

      preHooks.mockResolvedValueOnce([
        { success: true, duration: 1, contextModification: 'PRE payload' },
      ]);
      postHooks.mockResolvedValueOnce([
        { success: true, duration: 1, contextModification: 'POST payload' },
      ]);

      mockProvider.complete.mockResolvedValueOnce({
        text: 'done',
        usage: { prompt_tokens: 20, completion_tokens: 2, total_tokens: 22 },
      } satisfies CompletionResult);

      await agenticChat('go');

      const wire = mockProvider.complete.mock.calls[1][0] as WireMessage[];
      const blocks = findHookContextBlocks(wire);
      expect(blocks).toHaveLength(2);
      const first = blocks[0].content as string;
      const second = blocks[1].content as string;
      expect(first).toContain('phase="pre"');
      expect(first).toContain('PRE payload');
      expect(second).not.toContain('phase="pre"');
      expect(second).toContain('POST payload');
    });
  });

  describe('parallel tool executions in one iteration', () => {
    it('emits one <hook_context> block per (tool_call_id, hook) with correct stamping', async () => {
      // LLM emits TWO tool calls in one iteration.
      mockProvider.complete.mockResolvedValueOnce({
        text: '',
        toolCalls: [
          {
            id: 'call_A',
            type: 'function',
            function: { name: 'write', arguments: '{}' },
          },
          {
            id: 'call_B',
            type: 'function',
            function: { name: 'read', arguments: '{}' },
          },
        ],
        usage: { prompt_tokens: 15, completion_tokens: 8, total_tokens: 23 },
      } satisfies CompletionResult);

      // Each tool's PostToolUse yields its own contextModification.
      postHooks.mockResolvedValueOnce([
        { success: true, duration: 1, contextModification: 'A-post-context' },
      ]);
      postHooks.mockResolvedValueOnce([
        { success: true, duration: 1, contextModification: 'B-post-context' },
      ]);

      mockProvider.complete.mockResolvedValueOnce({
        text: 'done',
        usage: { prompt_tokens: 30, completion_tokens: 3, total_tokens: 33 },
      } satisfies CompletionResult);

      await agenticChat('parallel');

      const wire = mockProvider.complete.mock.calls[1][0] as WireMessage[];
      const blocks = findHookContextBlocks(wire);
      expect(blocks).toHaveLength(2);

      const contents = blocks.map((b) => b.content as string);
      const forA = contents.find((c) => c.includes('tool_call_id="call_A"'));
      const forB = contents.find((c) => c.includes('tool_call_id="call_B"'));
      expect(forA).toBeDefined();
      expect(forB).toBeDefined();
      expect(forA as string).toContain('tool_name="write"');
      expect(forA as string).toContain('A-post-context');
      expect(forB as string).toContain('tool_name="read"');
      expect(forB as string).toContain('B-post-context');
    });
  });

  describe('no-context path', () => {
    it('does not inject a <hook_context> block when hooks return no contextModification', async () => {
      mockProvider.complete.mockResolvedValueOnce({
        text: '',
        toolCalls: [
          {
            id: 'call_1',
            type: 'function',
            function: { name: 'write', arguments: '{}' },
          },
        ],
        usage: { prompt_tokens: 10, completion_tokens: 5, total_tokens: 15 },
      } satisfies CompletionResult);

      // Hook succeeds but returns no contextModification.
      postHooks.mockResolvedValueOnce([{ success: true, duration: 1 }]);

      mockProvider.complete.mockResolvedValueOnce({
        text: 'done',
        usage: { prompt_tokens: 20, completion_tokens: 2, total_tokens: 22 },
      } satisfies CompletionResult);

      await agenticChat('go');

      const wire = mockProvider.complete.mock.calls[1][0] as WireMessage[];
      expect(findHookContextBlocks(wire)).toHaveLength(0);
    });

    it('ignores empty-string contextModification (does not inject an empty block)', async () => {
      mockProvider.complete.mockResolvedValueOnce({
        text: '',
        toolCalls: [
          {
            id: 'call_1',
            type: 'function',
            function: { name: 'write', arguments: '{}' },
          },
        ],
        usage: { prompt_tokens: 10, completion_tokens: 5, total_tokens: 15 },
      } satisfies CompletionResult);

      postHooks.mockResolvedValueOnce([{ success: true, duration: 1, contextModification: '' }]);

      mockProvider.complete.mockResolvedValueOnce({
        text: 'done',
        usage: { prompt_tokens: 20, completion_tokens: 2, total_tokens: 22 },
      } satisfies CompletionResult);

      await agenticChat('go');

      const wire = mockProvider.complete.mock.calls[1][0] as WireMessage[];
      expect(findHookContextBlocks(wire)).toHaveLength(0);
    });
  });

  describe('rejected hooks do not inject context', () => {
    it('does not inject <hook_context> for a soft-blocked (continueOnBlock) hook', async () => {
      mockProvider.complete.mockResolvedValueOnce({
        text: '',
        toolCalls: [
          {
            id: 'call_1',
            type: 'function',
            function: { name: 'write', arguments: '{}' },
          },
        ],
        usage: { prompt_tokens: 10, completion_tokens: 5, total_tokens: 15 },
      } satisfies CompletionResult);

      // Post hook rejects; contextModification (even if present) MUST NOT be
      // injected, matching Cline's legacy "skip when hook cancels" behavior.
      postHooks.mockResolvedValueOnce([
        {
          success: false,
          error: 'blocked',
          duration: 1,
          continueOnBlock: true,
          contextModification: 'should be dropped',
        },
      ]);

      mockProvider.complete.mockResolvedValueOnce({
        text: 'ok',
        usage: { prompt_tokens: 20, completion_tokens: 2, total_tokens: 22 },
      } satisfies CompletionResult);

      await agenticChat('go');

      const wire = mockProvider.complete.mock.calls[1][0] as WireMessage[];
      const blocks = findHookContextBlocks(wire);
      expect(blocks).toHaveLength(0);
      // The soft-block message SHOULD still be present.
      const blocked = wire.find(
        (m) => m.role === 'user' && m.content?.includes('Tool execution was blocked')
      );
      expect(blocked).toBeDefined();
    });
  });
});
