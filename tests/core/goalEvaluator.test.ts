/**
 * Tests for goal evaluator - evaluates completion conditions for /goal command
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as child_process from 'child_process';
import { EventEmitter } from 'events';
import {
  evaluateGoal,
  checkGoalLimits,
  createGoalPrompt,
  createContinuationPrompt,
  GOAL_DEFAULTS,
  type GoalDefinition,
  type GoalProgress,
} from '../../src/core/goalEvaluator.js';
import type { ToolContext } from '../../src/tool/index.js';

// Mock child_process.spawn
vi.mock('child_process', () => ({
  spawn: vi.fn(),
}));

describe('goalEvaluator', () => {
  let context: ToolContext;

  beforeEach(() => {
    context = { workdir: '/tmp/test-workdir' };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('evaluateGoal', () => {
    describe('with checkCommand', () => {
      it('should return true when check command exits with code 0', async () => {
        const mockProc = new EventEmitter() as ReturnType<typeof child_process.spawn>;
        Object.assign(mockProc, {
          stdout: new EventEmitter(),
          stderr: new EventEmitter(),
          stdin: null,
          pid: 1234,
          kill: vi.fn(),
        });
        vi.mocked(child_process.spawn).mockReturnValue(
          mockProc as unknown as ReturnType<typeof child_process.spawn>
        );

        const goal: GoalDefinition = {
          description: 'Fix all lint errors',
          checkCommand: 'npm run lint',
        };
        const progress: GoalProgress = {
          turnsElapsed: 1,
          elapsedMs: 5000,
          tokensUsed: 1000,
          lastAssistantMessage: 'I fixed some lint errors.',
          isComplete: false,
        };

        const promise = evaluateGoal(goal, progress, context);

        // Simulate process exit with code 0
        mockProc.emit('close', 0);

        const result = await promise;
        expect(result).toBe(true);
        expect(child_process.spawn).toHaveBeenCalledWith(
          'npm run lint',
          expect.objectContaining({
            shell: true,
            cwd: '/tmp/test-workdir',
          })
        );
      });

      it('should return false when check command exits with non-zero code', async () => {
        const mockProc = new EventEmitter() as ReturnType<typeof child_process.spawn>;
        Object.assign(mockProc, {
          stdout: new EventEmitter(),
          stderr: new EventEmitter(),
          stdin: null,
          pid: 1234,
          kill: vi.fn(),
        });
        vi.mocked(child_process.spawn).mockReturnValue(
          mockProc as unknown as ReturnType<typeof child_process.spawn>
        );

        const goal: GoalDefinition = {
          description: 'Fix all lint errors',
          checkCommand: 'npm run lint',
        };
        const progress: GoalProgress = {
          turnsElapsed: 1,
          elapsedMs: 5000,
          tokensUsed: 1000,
          lastAssistantMessage: 'I fixed some lint errors.',
          isComplete: false,
        };

        const promise = evaluateGoal(goal, progress, context);
        mockProc.emit('close', 1);

        const result = await promise;
        expect(result).toBe(false);
      });

      it('should return false when check command errors', async () => {
        const mockProc = new EventEmitter() as ReturnType<typeof child_process.spawn>;
        Object.assign(mockProc, {
          stdout: new EventEmitter(),
          stderr: new EventEmitter(),
          stdin: null,
          pid: 1234,
          kill: vi.fn(),
        });
        vi.mocked(child_process.spawn).mockReturnValue(
          mockProc as unknown as ReturnType<typeof child_process.spawn>
        );

        const goal: GoalDefinition = {
          description: 'Fix all lint errors',
          checkCommand: 'nonexistent-command',
        };
        const progress: GoalProgress = {
          turnsElapsed: 1,
          elapsedMs: 5000,
          tokensUsed: 1000,
          lastAssistantMessage: 'Working on it.',
          isComplete: false,
        };

        const promise = evaluateGoal(goal, progress, context);
        mockProc.emit('error', new Error('ENOENT'));

        const result = await promise;
        expect(result).toBe(false);
      });

      it('should respect abort signal', async () => {
        const controller = new AbortController();
        controller.abort();

        const goal: GoalDefinition = {
          description: 'Fix all lint errors',
          checkCommand: 'npm run lint',
        };
        const progress: GoalProgress = {
          turnsElapsed: 1,
          elapsedMs: 5000,
          tokensUsed: 1000,
          lastAssistantMessage: 'Working on it.',
          isComplete: false,
        };

        const contextWithSignal: ToolContext = {
          ...context,
          signal: controller.signal,
        };

        // spawn should not be called because signal is already aborted
        const result = await evaluateGoal(goal, progress, contextWithSignal);
        expect(result).toBe(false);
      });
    });

    describe('without checkCommand (heuristic evaluation)', () => {
      it('should return true when assistant message indicates goal is met', async () => {
        const goal: GoalDefinition = {
          description: 'Fix all lint errors',
        };
        const progress: GoalProgress = {
          turnsElapsed: 3,
          elapsedMs: 30000,
          tokensUsed: 5000,
          lastAssistantMessage: 'I have fixed all the issues. The goal has been met.',
          isComplete: false,
        };

        const result = await evaluateGoal(goal, progress, context);
        expect(result).toBe(true);
      });

      it('should return true for "goal is complete" phrasing', async () => {
        const goal: GoalDefinition = {
          description: 'Migrate all files',
        };
        const progress: GoalProgress = {
          turnsElapsed: 5,
          elapsedMs: 60000,
          tokensUsed: 10000,
          lastAssistantMessage: 'All files have been migrated. The goal is complete.',
          isComplete: false,
        };

        const result = await evaluateGoal(goal, progress, context);
        expect(result).toBe(true);
      });

      it('should return false when assistant message does not indicate completion', async () => {
        const goal: GoalDefinition = {
          description: 'Fix all lint errors',
        };
        const progress: GoalProgress = {
          turnsElapsed: 2,
          elapsedMs: 15000,
          tokensUsed: 3000,
          lastAssistantMessage: 'I fixed 3 lint errors. There are still 5 remaining.',
          isComplete: false,
        };

        const result = await evaluateGoal(goal, progress, context);
        expect(result).toBe(false);
      });

      it('should be case-insensitive', async () => {
        const goal: GoalDefinition = {
          description: 'Fix all lint errors',
        };
        const progress: GoalProgress = {
          turnsElapsed: 3,
          elapsedMs: 30000,
          tokensUsed: 5000,
          lastAssistantMessage: 'GOAL HAS BEEN MET - all errors resolved.',
          isComplete: false,
        };

        const result = await evaluateGoal(goal, progress, context);
        expect(result).toBe(true);
      });
    });
  });

  describe('checkGoalLimits', () => {
    it('should return undefined when within all limits', () => {
      const goal: GoalDefinition = {
        description: 'Fix lint errors',
        maxTurns: 10,
        maxTimeMs: 60000,
      };
      const progress: GoalProgress = {
        turnsElapsed: 5,
        elapsedMs: 30000,
        tokensUsed: 5000,
        lastAssistantMessage: '',
        isComplete: false,
      };

      expect(checkGoalLimits(goal, progress)).toBeUndefined();
    });

    it('should return "max_turns" when turns exceeded', () => {
      const goal: GoalDefinition = {
        description: 'Fix lint errors',
        maxTurns: 5,
      };
      const progress: GoalProgress = {
        turnsElapsed: 5,
        elapsedMs: 30000,
        tokensUsed: 5000,
        lastAssistantMessage: '',
        isComplete: false,
      };

      expect(checkGoalLimits(goal, progress)).toBe('max_turns');
    });

    it('should return "max_time" when time exceeded', () => {
      const goal: GoalDefinition = {
        description: 'Fix lint errors',
        maxTimeMs: 60000,
      };
      const progress: GoalProgress = {
        turnsElapsed: 3,
        elapsedMs: 65000,
        tokensUsed: 5000,
        lastAssistantMessage: '',
        isComplete: false,
      };

      expect(checkGoalLimits(goal, progress)).toBe('max_time');
    });

    it('should return "cancelled" when signal is aborted', () => {
      const controller = new AbortController();
      controller.abort();

      const goal: GoalDefinition = {
        description: 'Fix lint errors',
      };
      const progress: GoalProgress = {
        turnsElapsed: 1,
        elapsedMs: 5000,
        tokensUsed: 1000,
        lastAssistantMessage: '',
        isComplete: false,
      };

      expect(checkGoalLimits(goal, progress, controller.signal)).toBe('cancelled');
    });

    it('should use default max turns when not specified', () => {
      const goal: GoalDefinition = {
        description: 'Fix lint errors',
      };
      const progress: GoalProgress = {
        turnsElapsed: GOAL_DEFAULTS.maxTurns,
        elapsedMs: 5000,
        tokensUsed: 1000,
        lastAssistantMessage: '',
        isComplete: false,
      };

      expect(checkGoalLimits(goal, progress)).toBe('max_turns');
    });

    it('should use default max time when not specified', () => {
      const goal: GoalDefinition = {
        description: 'Fix lint errors',
      };
      const progress: GoalProgress = {
        turnsElapsed: 1,
        elapsedMs: GOAL_DEFAULTS.maxTimeMs + 1,
        tokensUsed: 1000,
        lastAssistantMessage: '',
        isComplete: false,
      };

      expect(checkGoalLimits(goal, progress)).toBe('max_time');
    });

    it('should prioritize cancellation over other limits', () => {
      const controller = new AbortController();
      controller.abort();

      const goal: GoalDefinition = {
        description: 'Fix lint errors',
        maxTurns: 5,
        maxTimeMs: 60000,
      };
      const progress: GoalProgress = {
        turnsElapsed: 10,
        elapsedMs: 90000,
        tokensUsed: 1000,
        lastAssistantMessage: '',
        isComplete: false,
      };

      expect(checkGoalLimits(goal, progress, controller.signal)).toBe('cancelled');
    });
  });

  describe('createGoalPrompt', () => {
    it('should include the goal description', () => {
      const goal: GoalDefinition = {
        description: 'Fix all lint errors in the codebase',
      };

      const prompt = createGoalPrompt(goal);

      expect(prompt).toContain('Fix all lint errors in the codebase');
      expect(prompt).toContain('Active Goal');
      expect(prompt).toContain('Goal has been met');
    });

    it('should include check command when specified', () => {
      const goal: GoalDefinition = {
        description: 'Fix all lint errors',
        checkCommand: 'npm run lint',
      };

      const prompt = createGoalPrompt(goal);

      expect(prompt).toContain('npm run lint');
      expect(prompt).toContain('exits with code 0');
    });

    it('should not include check command section when not specified', () => {
      const goal: GoalDefinition = {
        description: 'Fix all lint errors',
      };

      const prompt = createGoalPrompt(goal);

      expect(prompt).not.toContain('verification command');
    });
  });

  describe('createContinuationPrompt', () => {
    it('should include the goal description', () => {
      const goal: GoalDefinition = {
        description: 'Fix all lint errors',
        maxTurns: 10,
      };
      const progress: GoalProgress = {
        turnsElapsed: 3,
        elapsedMs: 15000,
        tokensUsed: 5000,
        lastAssistantMessage: '',
        isComplete: false,
      };

      const prompt = createContinuationPrompt(goal, progress);

      expect(prompt).toContain('Fix all lint errors');
      expect(prompt).toContain('not yet met');
      expect(prompt).toContain('3 turns elapsed');
      expect(prompt).toContain('7 turns remaining');
    });

    it('should show elapsed time in seconds', () => {
      const goal: GoalDefinition = {
        description: 'Migrate files',
      };
      const progress: GoalProgress = {
        turnsElapsed: 2,
        elapsedMs: 45000,
        tokensUsed: 3000,
        lastAssistantMessage: '',
        isComplete: false,
      };

      const prompt = createContinuationPrompt(goal, progress);

      expect(prompt).toContain('45s elapsed');
    });

    it('should use default max turns for remaining calculation', () => {
      const goal: GoalDefinition = {
        description: 'Fix errors',
      };
      const progress: GoalProgress = {
        turnsElapsed: 5,
        elapsedMs: 30000,
        tokensUsed: 5000,
        lastAssistantMessage: '',
        isComplete: false,
      };

      const prompt = createContinuationPrompt(goal, progress);

      const expectedRemaining = GOAL_DEFAULTS.maxTurns - 5;
      expect(prompt).toContain(`${expectedRemaining} turns remaining`);
    });
  });

  describe('GOAL_DEFAULTS', () => {
    it('should have correct default values', () => {
      expect(GOAL_DEFAULTS.maxTurns).toBe(20);
      expect(GOAL_DEFAULTS.maxTimeMs).toBe(300_000);
      expect(GOAL_DEFAULTS.checkCommandTimeoutMs).toBe(30_000);
    });
  });
});
