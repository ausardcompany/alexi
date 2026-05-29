import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mocks must be declared before importing the module under test.
vi.mock('child_process', async () => {
  // Provide both `execFile` (used via promisify) and a passthrough object.
  return {
    execFile: vi.fn(),
  };
});

vi.mock('../../src/core/orchestrator.js', () => ({
  sendChat: vi.fn(),
}));

vi.mock('../../src/providers/index.js', () => ({
  getDefaultModel: vi.fn(() => 'gpt-4o'),
}));

vi.mock('../../src/config/routingConfig.js', () => ({
  loadRoutingConfig: vi.fn(),
}));

import { execFile } from 'child_process';
import {
  executeCodeReview,
  buildSystemPrompt,
  pickModelForEffort,
} from '../../src/command/codeReview.js';
import { sendChat } from '../../src/core/orchestrator.js';
import { getDefaultModel } from '../../src/providers/index.js';
import { loadRoutingConfig } from '../../src/config/routingConfig.js';

// ---------------------------------------------------------------------------
// execFile helper — promisify(execFile) calls execFile(file, args, options, cb)
// ---------------------------------------------------------------------------

type ExecFileCallback = (
  err: Error | null,
  stdout: string | Buffer,
  stderr: string | Buffer
) => void;

function setExecFileImpl(impl: (file: string, args: string[]) => string): void {
  vi.mocked(execFile).mockImplementation(((
    file: string,
    args: string[],
    _options: unknown,
    callback: ExecFileCallback
  ) => {
    try {
      const stdout = impl(file, args);
      callback(null, stdout, '');
    } catch (err) {
      callback(err as Error, '', '');
    }
    // execFile normally returns a ChildProcess; the consumer (promisify) only
    // needs the callback to fire, so an `unknown` cast is sufficient here.
    return undefined as unknown;
  }) as unknown as typeof execFile);
}

const SAMPLE_DIFF = `diff --git a/foo.ts b/foo.ts
index 1111..2222 100644
--- a/foo.ts
+++ b/foo.ts
@@ -1,3 +1,3 @@
-export const x = 1;
+export const x = 2;
`;

const FAKE_REVIEW = `### MUST FIX (Critical)
- Off-by-one in foo.ts:1

### SHOULD IMPROVE (Important)
- Add a unit test

### NICE TO HAVE (Suggestions)
- Use a const-tier name`;

function mockReview(): void {
  vi.mocked(sendChat).mockResolvedValue({
    text: FAKE_REVIEW,
    usage: { prompt_tokens: 100, completion_tokens: 50, total_tokens: 150 },
    modelUsed: 'gpt-4o',
  });
}

describe('codeReview command', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getDefaultModel).mockReturnValue('gpt-4o');
    vi.mocked(loadRoutingConfig).mockReturnValue({
      models: [
        {
          id: 'gpt-4o-mini',
          type: 'openai',
          costTier: 'cheap',
          strengths: [],
          maxTokens: 16000,
          reasoning: false,
        },
        {
          id: 'gpt-4o',
          type: 'openai',
          costTier: 'medium',
          strengths: [],
          maxTokens: 128000,
          reasoning: false,
        },
        {
          id: 'anthropic--claude-4.5-opus',
          type: 'claude',
          costTier: 'expensive',
          strengths: [],
          maxTokens: 200000,
          reasoning: true,
        },
      ],
      rules: [],
      preferences: {
        defaultCostTier: 'medium',
        preferCheapWhenPossible: false,
        maxCostPerRequest: null,
        fallbackModel: 'gpt-4o',
      },
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('buildSystemPrompt', () => {
    it('returns the bare skill prompt for medium effort', () => {
      const medium = buildSystemPrompt('medium');
      expect(medium.startsWith('You are a strict code reviewer')).toBe(true);
    });

    it('prepends a "critical only" preamble for low effort', () => {
      const low = buildSystemPrompt('low');
      expect(low.slice(0, 200)).toContain('Focus only on critical correctness bugs');
      expect(low).toContain('You are a strict code reviewer');
    });

    it('prepends a "thorough" preamble for high effort', () => {
      const high = buildSystemPrompt('high');
      expect(high.slice(0, 200)).toContain('Be thorough');
      expect(high).toContain('You are a strict code reviewer');
    });

    it('produces distinguishable prompts across effort levels', () => {
      const low = buildSystemPrompt('low').slice(0, 200);
      const medium = buildSystemPrompt('medium').slice(0, 200);
      const high = buildSystemPrompt('high').slice(0, 200);

      expect(low).not.toEqual(medium);
      expect(medium).not.toEqual(high);
      expect(low).not.toEqual(high);
    });
  });

  describe('pickModelForEffort', () => {
    it('returns the default model for medium effort', () => {
      expect(pickModelForEffort('medium')).toBe('gpt-4o');
    });

    it('prefers a reasoning-tier expensive model for high effort', () => {
      expect(pickModelForEffort('high')).toBe('anthropic--claude-4.5-opus');
    });

    it('prefers a cheap-tier model for low effort', () => {
      expect(pickModelForEffort('low')).toBe('gpt-4o-mini');
    });

    it('falls back to the default model when no candidate matches', () => {
      vi.mocked(loadRoutingConfig).mockReturnValueOnce({
        models: [
          {
            id: 'only-medium',
            type: 'openai',
            costTier: 'medium',
            strengths: [],
            maxTokens: 1000,
            reasoning: false,
          },
        ],
        rules: [],
        preferences: {
          defaultCostTier: 'medium',
          preferCheapWhenPossible: false,
          maxCostPerRequest: null,
          fallbackModel: 'gpt-4o',
        },
      });
      expect(pickModelForEffort('high')).toBe('gpt-4o'); // falls back to default
    });
  });

  describe('executeCodeReview', () => {
    it('returns early with a skip message when the diff is empty', async () => {
      setExecFileImpl(() => '');
      const result = await executeCodeReview({ workdir: '/tmp/test' });

      expect(result.success).toBe(true);
      expect(result.review).toBe('No changes to review.');
      expect(result.diffBytes).toBe(0);
      expect(sendChat).not.toHaveBeenCalled();
    });

    it('runs git diff HEAD for the default uncommitted target', async () => {
      const seen: { file: string; args: string[] } = { file: '', args: [] };
      setExecFileImpl((file, args) => {
        seen.file = file;
        seen.args = args;
        return SAMPLE_DIFF;
      });
      mockReview();

      const result = await executeCodeReview({ workdir: '/tmp/test' });

      expect(seen.file).toBe('git');
      expect(seen.args).toEqual(['diff', 'HEAD']);
      expect(result.success).toBe(true);
      expect(result.review).toContain('MUST FIX');
      expect(result.totalTokens).toBe(150);
      expect(result.effort).toBe('medium');
    });

    it('runs git diff <base>...HEAD when a base branch target is given', async () => {
      const seen: { args: string[] } = { args: [] };
      setExecFileImpl((_file, args) => {
        seen.args = args;
        return SAMPLE_DIFF;
      });
      mockReview();

      await executeCodeReview({
        workdir: '/tmp/test',
        target: { base: 'main' },
      });

      expect(seen.args).toEqual(['diff', 'main...HEAD']);
    });

    it('routes to a reasoning model when effort is high', async () => {
      setExecFileImpl(() => SAMPLE_DIFF);
      mockReview();

      await executeCodeReview({ workdir: '/tmp/test', effort: 'high' });

      expect(sendChat).toHaveBeenCalledTimes(1);
      const callArgs = vi.mocked(sendChat).mock.calls[0];
      const optsArg = callArgs[1] as { modelOverride?: string; systemPrompt?: string };
      expect(optsArg.modelOverride).toBe('anthropic--claude-4.5-opus');
      expect(optsArg.systemPrompt).toContain('Be thorough');
    });

    it('routes to a cheap model when effort is low', async () => {
      setExecFileImpl(() => SAMPLE_DIFF);
      mockReview();

      await executeCodeReview({ workdir: '/tmp/test', effort: 'low' });

      const optsArg = vi.mocked(sendChat).mock.calls[0][1] as {
        modelOverride?: string;
        systemPrompt?: string;
      };
      expect(optsArg.modelOverride).toBe('gpt-4o-mini');
      expect(optsArg.systemPrompt).toContain('Focus only on critical correctness bugs');
    });

    it('honors an explicit modelOverride over effort-based routing', async () => {
      setExecFileImpl(() => SAMPLE_DIFF);
      mockReview();

      await executeCodeReview({
        workdir: '/tmp/test',
        effort: 'high',
        modelOverride: 'gpt-4.1',
      });

      const optsArg = vi.mocked(sendChat).mock.calls[0][1] as { modelOverride?: string };
      expect(optsArg.modelOverride).toBe('gpt-4.1');
    });

    it('wraps the diff in a fenced ```diff block in the user message', async () => {
      setExecFileImpl(() => SAMPLE_DIFF);
      mockReview();

      await executeCodeReview({ workdir: '/tmp/test' });

      const userMessage = vi.mocked(sendChat).mock.calls[0][0];
      expect(userMessage).toContain('```diff\n');
      expect(userMessage).toContain('```');
      expect(userMessage).toContain('export const x = 2;');
    });

    it('throws if the signal is already aborted', async () => {
      const controller = new AbortController();
      controller.abort();
      await expect(
        executeCodeReview({ workdir: '/tmp/test', signal: controller.signal })
      ).rejects.toThrow(/cancelled/);
    });
  });
});
