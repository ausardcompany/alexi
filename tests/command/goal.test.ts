import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock agenticChat before importing goal module
vi.mock('../../src/core/agenticChat.js', () => ({
  agenticChat: vi.fn(),
}));

vi.mock('../../src/core/orchestrator.js', () => ({
  sendChat: vi.fn(),
}));

vi.mock('../../src/bus/index.js', () => ({
  defineEvent: vi.fn(() => ({
    name: 'goal.progress',
    schema: {},
    publish: vi.fn(),
    publishAsync: vi.fn(),
    subscribe: vi.fn(),
    once: vi.fn(),
  })),
}));

import { executeGoal } from '../../src/command/goal.js';
import { agenticChat } from '../../src/core/agenticChat.js';
import { sendChat } from '../../src/core/orchestrator.js';

describe('Goal Command', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('executeGoal', () => {
    it('should complete when condition is met after 2 turns', async () => {
      // First turn: agenticChat does work
      vi.mocked(agenticChat)
        .mockResolvedValueOnce({
          text: 'I fixed one lint error.',
          usage: { prompt_tokens: 100, completion_tokens: 50, total_tokens: 150 },
          modelUsed: 'gpt-4o',
          iterations: 3,
          toolCallsExecuted: 2,
          toolCallSummary: [{ name: 'bash', success: true }],
        })
        .mockResolvedValueOnce({
          text: 'I fixed the remaining lint errors. All clean now.',
          usage: { prompt_tokens: 120, completion_tokens: 60, total_tokens: 180 },
          modelUsed: 'gpt-4o',
          iterations: 2,
          toolCallsExecuted: 1,
          toolCallSummary: [{ name: 'bash', success: true }],
        });

      // First evaluation: not met
      vi.mocked(sendChat).mockResolvedValueOnce({
        text: 'NO\nThere are still 2 remaining lint errors.',
        usage: { prompt_tokens: 50, completion_tokens: 20 },
        modelUsed: 'gpt-4o',
      });

      // Second evaluation: met
      vi.mocked(sendChat).mockResolvedValueOnce({
        text: 'YES\nAll lint errors have been resolved.',
        usage: { prompt_tokens: 50, completion_tokens: 20 },
        modelUsed: 'gpt-4o',
      });

      const result = await executeGoal({
        condition: 'no lint errors',
        maxTurns: 10,
        workdir: '/tmp/test',
      });

      expect(result.success).toBe(true);
      expect(result.turns).toBe(2);
      expect(result.status).toBe('completed');
      expect(result.totalTokens).toBe(330); // 150 + 180
      expect(result.condition).toBe('no lint errors');
      expect(result.finalEvaluation).toBe('All lint errors have been resolved.');
      expect(agenticChat).toHaveBeenCalledTimes(2);
      expect(sendChat).toHaveBeenCalledTimes(2);
    });

    it('should stop when max turns are reached', async () => {
      // Always return work but condition never met
      vi.mocked(agenticChat).mockResolvedValue({
        text: 'Made some progress but not done yet.',
        usage: { prompt_tokens: 100, completion_tokens: 50, total_tokens: 150 },
        modelUsed: 'gpt-4o',
        iterations: 1,
        toolCallsExecuted: 1,
        toolCallSummary: [],
      });

      vi.mocked(sendChat).mockResolvedValue({
        text: 'NO\nCondition not yet met.',
        usage: { prompt_tokens: 30, completion_tokens: 10 },
        modelUsed: 'gpt-4o',
      });

      const result = await executeGoal({
        condition: 'all tests pass',
        maxTurns: 3,
        workdir: '/tmp/test',
      });

      expect(result.success).toBe(false);
      expect(result.turns).toBe(3);
      expect(result.status).toBe('max_turns_reached');
      expect(result.totalTokens).toBe(450); // 3 * 150
      expect(agenticChat).toHaveBeenCalledTimes(3);
      expect(sendChat).toHaveBeenCalledTimes(3);
    });

    it('should cancel when AbortSignal is triggered before first turn', async () => {
      const controller = new AbortController();
      controller.abort();

      const result = await executeGoal({
        condition: 'all tests pass',
        signal: controller.signal,
        maxTurns: 5,
      });

      expect(result.success).toBe(false);
      expect(result.turns).toBe(0);
      expect(result.status).toBe('cancelled');
      expect(result.finalEvaluation).toBe('Cancelled by user');
      expect(agenticChat).not.toHaveBeenCalled();
    });

    it('should cancel when AbortSignal is triggered during execution', async () => {
      const controller = new AbortController();

      // First turn succeeds, then abort
      vi.mocked(agenticChat).mockImplementationOnce(async () => {
        // Abort after the first turn completes
        controller.abort();
        return {
          text: 'Did some work.',
          usage: { prompt_tokens: 100, completion_tokens: 50, total_tokens: 150 },
          modelUsed: 'gpt-4o',
          iterations: 1,
          toolCallsExecuted: 1,
          toolCallSummary: [],
        };
      });

      const result = await executeGoal({
        condition: 'all tests pass',
        signal: controller.signal,
        maxTurns: 10,
      });

      expect(result.success).toBe(false);
      expect(result.status).toBe('cancelled');
      expect(result.turns).toBe(1);
      expect(result.totalTokens).toBe(150);
    });

    it('should cancel when agenticChat throws AbortError', async () => {
      const controller = new AbortController();

      vi.mocked(agenticChat).mockImplementationOnce(async () => {
        controller.abort();
        const error = new Error('Aborted');
        error.name = 'AbortError';
        throw error;
      });

      const result = await executeGoal({
        condition: 'all tests pass',
        signal: controller.signal,
        maxTurns: 10,
      });

      expect(result.success).toBe(false);
      expect(result.status).toBe('cancelled');
      expect(result.finalEvaluation).toBe('Cancelled by user');
    });

    it('should emit progress events via onProgress callback', async () => {
      const progressEvents: unknown[] = [];

      vi.mocked(agenticChat).mockResolvedValueOnce({
        text: 'All done.',
        usage: { prompt_tokens: 100, completion_tokens: 50, total_tokens: 150 },
        modelUsed: 'gpt-4o',
        iterations: 1,
        toolCallsExecuted: 1,
        toolCallSummary: [],
      });

      vi.mocked(sendChat).mockResolvedValueOnce({
        text: 'YES\nCondition is met.',
        usage: { prompt_tokens: 30, completion_tokens: 10 },
        modelUsed: 'gpt-4o',
      });

      await executeGoal({
        condition: 'all tests pass',
        maxTurns: 5,
        onProgress: (progress) => {
          progressEvents.push({ ...progress });
        },
      });

      // Should have emitted 'running' and 'completed' progress events
      expect(progressEvents.length).toBe(2);
      expect((progressEvents[0] as { status: string }).status).toBe('running');
      expect((progressEvents[1] as { status: string }).status).toBe('completed');
      expect((progressEvents[0] as { turn: number }).turn).toBe(1);
    });

    it('should use ALEXI_GOAL_MAX_TURNS environment variable', async () => {
      const originalEnv = process.env.ALEXI_GOAL_MAX_TURNS;
      process.env.ALEXI_GOAL_MAX_TURNS = '2';

      vi.mocked(agenticChat).mockResolvedValue({
        text: 'Working...',
        usage: { prompt_tokens: 100, completion_tokens: 50, total_tokens: 150 },
        modelUsed: 'gpt-4o',
        iterations: 1,
        toolCallsExecuted: 1,
        toolCallSummary: [],
      });

      vi.mocked(sendChat).mockResolvedValue({
        text: 'NO\nNot done.',
        usage: { prompt_tokens: 30, completion_tokens: 10 },
        modelUsed: 'gpt-4o',
      });

      const result = await executeGoal({
        condition: 'all tests pass',
      });

      expect(result.status).toBe('max_turns_reached');
      expect(result.turns).toBe(2);

      // Restore
      if (originalEnv === undefined) {
        delete process.env.ALEXI_GOAL_MAX_TURNS;
      } else {
        process.env.ALEXI_GOAL_MAX_TURNS = originalEnv;
      }
    });

    it('should pass modelOverride and workdir to agenticChat', async () => {
      vi.mocked(agenticChat).mockResolvedValueOnce({
        text: 'Done.',
        usage: { prompt_tokens: 100, completion_tokens: 50, total_tokens: 150 },
        modelUsed: 'anthropic--claude-4-sonnet',
        iterations: 1,
        toolCallsExecuted: 0,
        toolCallSummary: [],
      });

      vi.mocked(sendChat).mockResolvedValueOnce({
        text: 'YES\nCondition met.',
        usage: { prompt_tokens: 30, completion_tokens: 10 },
        modelUsed: 'anthropic--claude-4-sonnet',
      });

      await executeGoal({
        condition: 'tests pass',
        maxTurns: 5,
        workdir: '/my/project',
        modelOverride: 'anthropic--claude-4-sonnet',
      });

      expect(agenticChat).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          modelOverride: 'anthropic--claude-4-sonnet',
          workdir: '/my/project',
          maxIterations: 25,
        })
      );
    });

    it('should re-throw non-abort errors from agenticChat', async () => {
      vi.mocked(agenticChat).mockRejectedValueOnce(new Error('Network failure'));

      await expect(
        executeGoal({
          condition: 'all tests pass',
          maxTurns: 5,
        })
      ).rejects.toThrow('Network failure');
    });

    it('should complete on first turn if condition met immediately', async () => {
      vi.mocked(agenticChat).mockResolvedValueOnce({
        text: 'Everything already passes.',
        usage: { prompt_tokens: 80, completion_tokens: 30, total_tokens: 110 },
        modelUsed: 'gpt-4o',
        iterations: 1,
        toolCallsExecuted: 0,
        toolCallSummary: [],
      });

      vi.mocked(sendChat).mockResolvedValueOnce({
        text: 'YES\nAll conditions are already satisfied.',
        usage: { prompt_tokens: 30, completion_tokens: 10 },
        modelUsed: 'gpt-4o',
      });

      const result = await executeGoal({
        condition: 'build succeeds',
        maxTurns: 25,
      });

      expect(result.success).toBe(true);
      expect(result.turns).toBe(1);
      expect(result.status).toBe('completed');
    });
  });
});
