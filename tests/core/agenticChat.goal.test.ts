/**
 * Regression tests for issue #1804: `agenticChat()` must re-drive the
 * model when the active session's metadata carries an armed multi-turn
 * goal, up to `MAX_GOAL_CONTINUATIONS` extra iterations. A text-only
 * assistant response no longer terminates the loop when a goal is
 * armed; instead a `<system-reminder>` continuation is injected and
 * the model is called again.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';
import type { CompletionResult } from '../../src/providers/sapOrchestration.js';

vi.mock('../../src/core/memory.js', () => ({
  getMemoryManager: vi.fn(() => ({
    getContextString: vi.fn().mockReturnValue(''),
  })),
}));

vi.mock('../../src/core/sessionContext.js', () => ({
  getSessionContextString: vi.fn().mockReturnValue(''),
}));

vi.mock('../../src/providers/index.js', () => ({
  getProviderForModel: vi.fn(),
  getProviderForModelWithFallback: vi.fn(),
  getDefaultModel: vi.fn(() => 'gpt-4o'),
}));

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
  list: vi.fn(() => []),
  get: vi.fn(() => undefined),
};

vi.mock('../../src/tool/index.js', () => ({
  getToolRegistry: () => mockToolRegistry,
  registerTool: vi.fn(),
  defineTool: vi.fn(),
  getAllToolNames: vi.fn(() => []),
}));

vi.mock('../../src/tool/tools/index.js', () => ({
  registerBuiltInTools: vi.fn(),
}));

import { agenticChat } from '../../src/core/agenticChat.js';
import { getProviderForModel, getProviderForModelWithFallback } from '../../src/providers/index.js';
import { SessionManager } from '../../src/core/sessionManager.js';

describe('agenticChat goal continuation loop (issue #1804)', () => {
  let mockProvider: { complete: ReturnType<typeof vi.fn> };
  let sessionsDir: string;

  beforeEach(() => {
    sessionsDir = fs.mkdtempSync(path.join(os.tmpdir(), 'alexi-goal-loop-'));
    mockProvider = {
      complete: vi.fn().mockResolvedValue({
        text: 'ok',
        usage: { prompt_tokens: 1, completion_tokens: 1, total_tokens: 2 },
        toolCalls: undefined,
      } satisfies CompletionResult),
    };
    vi.mocked(getProviderForModel).mockReturnValue(mockProvider as never);
    vi.mocked(getProviderForModelWithFallback).mockImplementation((modelId: string) => ({
      provider: mockProvider as never,
      effectiveModelId: modelId,
      usedFallback: false,
    }));
  });

  afterEach(() => {
    fs.rmSync(sessionsDir, { recursive: true, force: true });
    vi.clearAllMocks();
  });

  it('terminates in a single provider call when no goal is armed', async () => {
    const sm = new SessionManager({ sessionsDir });
    sm.createSession('gpt-4o');

    await agenticChat('hi', {
      workdir: process.cwd(),
      sessionManager: sm,
    });

    expect(mockProvider.complete).toHaveBeenCalledTimes(1);
  });

  it('continues after a text-only turn when session.metadata.goal is armed', async () => {
    const sm = new SessionManager({ sessionsDir });
    const session = sm.createSession('gpt-4o');
    session.metadata.goal = {
      description: 'keep going',
      armed: true,
      createdAt: Date.now(),
    };
    sm.persistActiveSession();

    // First call: model returns text (no tool calls). Second call: same.
    // The continuation loop should re-drive up to MAX_GOAL_CONTINUATIONS
    // times. We disarm after 2 calls to prove the loop honours a mid-run
    // disarm and terminates naturally.
    let callCount = 0;
    mockProvider.complete.mockImplementation(async () => {
      callCount++;
      if (callCount === 2) {
        // Simulate the model completing the goal — disarm on second turn.
        const current = sm.getCurrentSession();
        if (current?.metadata.goal) {
          current.metadata.goal.armed = false;
        }
      }
      return {
        text: `turn ${callCount}`,
        usage: { prompt_tokens: 1, completion_tokens: 1, total_tokens: 2 },
        toolCalls: undefined,
      } satisfies CompletionResult;
    });

    const result = await agenticChat('start', {
      workdir: process.cwd(),
      sessionManager: sm,
    });

    // First turn is the initial call; the continuation loop should
    // have driven at least one additional provider call before the
    // model disarmed the goal.
    expect(mockProvider.complete).toHaveBeenCalledTimes(2);
    expect(result.text).toBe('turn 2');
  });

  it('stops after MAX_GOAL_CONTINUATIONS extra turns to prevent runaway loops', async () => {
    const sm = new SessionManager({ sessionsDir });
    const session = sm.createSession('gpt-4o');
    session.metadata.goal = {
      description: 'infinite goal',
      armed: true,
      createdAt: Date.now(),
    };
    sm.persistActiveSession();

    // Model never disarms. MAX_GOAL_CONTINUATIONS is currently 5 -> we
    // should see at most 1 (initial) + 5 (continuations) = 6 calls.
    mockProvider.complete.mockResolvedValue({
      text: 'still going',
      usage: { prompt_tokens: 1, completion_tokens: 1, total_tokens: 2 },
      toolCalls: undefined,
    } satisfies CompletionResult);

    const result = await agenticChat('start', {
      workdir: process.cwd(),
      sessionManager: sm,
      // Give the continuation cap plenty of room within maxIterations
      maxIterations: 20,
    });

    expect(mockProvider.complete.mock.calls.length).toBeGreaterThanOrEqual(2);
    expect(mockProvider.complete.mock.calls.length).toBeLessThanOrEqual(6);
    // Final assistant text comes back non-empty
    expect(result.text.length).toBeGreaterThan(0);
  });

  it('injects a continuation reminder that references the goal description', async () => {
    const sm = new SessionManager({ sessionsDir });
    const session = sm.createSession('gpt-4o');
    session.metadata.goal = {
      description: 'the-canary-goal',
      target: 'canary/file.ts',
      armed: true,
      createdAt: Date.now(),
    };
    sm.persistActiveSession();

    let callCount = 0;
    mockProvider.complete.mockImplementation(async (messages) => {
      callCount++;
      if (callCount === 2) {
        // On the second call, the messages array should contain a
        // reminder referencing the goal description and target.
        const combined = JSON.stringify(messages);
        expect(combined).toContain('the-canary-goal');
        expect(combined).toContain('canary/file.ts');
        // Disarm to stop the loop after this turn.
        const current = sm.getCurrentSession();
        if (current?.metadata.goal) {
          current.metadata.goal.armed = false;
        }
      }
      return {
        text: 'ack',
        usage: { prompt_tokens: 1, completion_tokens: 1, total_tokens: 2 },
        toolCalls: undefined,
      } satisfies CompletionResult;
    });

    await agenticChat('start', {
      workdir: process.cwd(),
      sessionManager: sm,
    });

    expect(callCount).toBeGreaterThanOrEqual(2);
  });
});
