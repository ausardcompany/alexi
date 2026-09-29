/**
 * Auto-compaction trigger uses provider-reported token counts (issue #1879).
 *
 * The `addMessage` auto-compact path previously fed only the message array
 * into `shouldCompact`, which then estimated tokens via a chars-per-token
 * heuristic. On sessions with heavy reasoning traces or structured tool
 * outputs that heuristic drifts badly, causing premature compaction that
 * discards useful context.
 *
 * These tests pin the new behaviour:
 *   1. When `SessionMetadata.totalTokens` is populated (any provider turn
 *      that reported usage), the auto-compact trigger passes that figure
 *      as `reportedUsage` into `shouldCompact` at the 90% threshold — so
 *      reasoning tokens accumulated by `addMessage` participate in the
 *      trigger decision.
 *   2. When `totalTokens` is 0 (brand-new session, or legacy session
 *      pre-token-accumulation), the trigger falls back to the pure
 *      heuristic path with a HIGHER threshold (95%) to suppress false
 *      positives from the chars/4 bias.
 *   3. Auto-compact remains fully opt-out via `autoCompact: false`.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

vi.mock('../../src/core/compaction.js', () => ({
  shouldCompact: vi.fn().mockReturnValue(false),
  compactConversation: vi.fn().mockResolvedValue({
    messages: [],
    result: { originalMessages: 0, compactedMessages: 0, estimatedTokensSaved: 0, summary: '' },
  }),
  estimateMessagesTokens: vi.fn().mockReturnValue(0),
}));

vi.mock('../../src/core/sessionClose.js', () => ({
  closeSession: vi.fn().mockReturnValue(0),
}));

import { SessionManager, type Session } from '../../src/core/sessionManager.js';
import { shouldCompact, compactConversation } from '../../src/core/compaction.js';

let tempDir: string;

beforeEach(() => {
  vi.clearAllMocks();
  tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'session-compact-trigger-'));
});

afterEach(() => {
  fs.rmSync(tempDir, { recursive: true, force: true });
});

describe('auto-compact trigger uses provider token counts', () => {
  it('forwards session.totalTokens as reportedUsage once a turn has produced tokens', () => {
    const manager = new SessionManager({
      sessionsDir: tempDir,
      autoCompact: true,
      maxContextTokens: 100_000,
    });
    manager.createSession();

    // First message carries provider-reported usage so `totalTokens` is
    // populated on the metadata before the auto-compact check runs.
    manager.addMessage('assistant', 'response', {
      input: 50_000,
      output: 20_000,
      reasoning: 5_000,
    });

    expect(shouldCompact).toHaveBeenCalledTimes(1);
    const call = vi.mocked(shouldCompact).mock.calls[0];
    // Args: (messages, maxContextTokens, options)
    expect(call[1]).toBe(100_000);
    const opts = call[2] as { threshold: number; reportedUsage: number };
    expect(opts.threshold).toBe(90);
    // 50_000 + 20_000 + 5_000 = 75_000 total tokens accumulated on metadata.
    expect(opts.reportedUsage).toBe(75_000);
  });

  it('includes reasoning tokens in the reportedUsage that reaches shouldCompact', () => {
    const manager = new SessionManager({
      sessionsDir: tempDir,
      autoCompact: true,
      maxContextTokens: 200_000,
    });
    manager.createSession();

    // Two-turn reasoning-heavy session. All reasoning tokens must show
    // up in the reportedUsage arg of the SECOND call.
    manager.addMessage('user', 'first prompt', { input: 40_000 });
    manager.addMessage('assistant', 'first response', { output: 30_000, reasoning: 25_000 });

    expect(shouldCompact).toHaveBeenCalledTimes(2);
    const secondOpts = vi.mocked(shouldCompact).mock.calls[1][2] as {
      threshold: number;
      reportedUsage: number;
    };
    expect(secondOpts.threshold).toBe(90);
    // 40_000 + 30_000 + 25_000 = 95_000 — reasoning tokens participate.
    expect(secondOpts.reportedUsage).toBe(95_000);
  });

  it('triggers compact() when reported tokens cross the 90% budget', () => {
    const manager = new SessionManager({
      sessionsDir: tempDir,
      autoCompact: true,
      maxContextTokens: 10_000,
    });
    manager.createSession();

    // Make shouldCompact behave like the real one: fire when reportedUsage
    // meets or exceeds 90% of maxContextTokens.
    vi.mocked(shouldCompact).mockImplementation((_messages, maxTokens, opts): boolean => {
      const options =
        typeof opts === 'object' && opts !== null
          ? (opts as { reportedUsage?: number; threshold?: number })
          : {};
      const usage = options.reportedUsage ?? 0;
      const threshold = options.threshold ?? 90;
      return usage >= (maxTokens * threshold) / 100;
    });

    // 92% of the 10k budget after a single provider turn — should trip.
    manager.addMessage('assistant', 'huge response', { input: 5_000, output: 4_200 });

    expect(compactConversation).toHaveBeenCalled();
  });

  it('does NOT trigger compact() when reported tokens are below the 90% budget', () => {
    const manager = new SessionManager({
      sessionsDir: tempDir,
      autoCompact: true,
      maxContextTokens: 10_000,
    });
    manager.createSession();

    vi.mocked(shouldCompact).mockImplementation((_messages, maxTokens, opts): boolean => {
      const options =
        typeof opts === 'object' && opts !== null
          ? (opts as { reportedUsage?: number; threshold?: number })
          : {};
      const usage = options.reportedUsage ?? 0;
      const threshold = options.threshold ?? 90;
      return usage >= (maxTokens * threshold) / 100;
    });

    // 50% usage — should NOT fire.
    manager.addMessage('assistant', 'small response', { input: 3_000, output: 2_000 });

    expect(compactConversation).not.toHaveBeenCalled();
  });

  it('falls back to the heuristic path with a higher threshold when totalTokens is 0', () => {
    const manager = new SessionManager({
      sessionsDir: tempDir,
      autoCompact: true,
      maxContextTokens: 100_000,
    });
    manager.createSession();

    // No tokens payload -> totalTokens stays 0 -> fallback branch.
    manager.addMessage('user', 'first user message without token payload');

    expect(shouldCompact).toHaveBeenCalledTimes(1);
    const call = vi.mocked(shouldCompact).mock.calls[0];
    const opts = call[2] as { threshold: number; reportedUsage?: number };
    // Higher fallback threshold — resists premature compaction driven by
    // the well-known chars/4 heuristic bias.
    expect(opts.threshold).toBe(95);
    // Must NOT synthesise a bogus reportedUsage — the fallback branch
    // relies on the heuristic estimate inside `shouldCompact` itself.
    expect(opts.reportedUsage).toBeUndefined();
  });

  it('transitions from fallback threshold to token-based threshold as soon as the session records usage', () => {
    const manager = new SessionManager({
      sessionsDir: tempDir,
      autoCompact: true,
      maxContextTokens: 100_000,
    });
    manager.createSession();

    // First message: no token payload -> fallback branch.
    manager.addMessage('user', 'ask something');
    const firstOpts = vi.mocked(shouldCompact).mock.calls[0][2] as { threshold: number };
    expect(firstOpts.threshold).toBe(95);

    // Second message: provider reports tokens -> token-based branch.
    manager.addMessage('assistant', 'answer', { input: 100, output: 100 });
    const secondOpts = vi.mocked(shouldCompact).mock.calls[1][2] as {
      threshold: number;
      reportedUsage: number;
    };
    expect(secondOpts.threshold).toBe(90);
    expect(secondOpts.reportedUsage).toBe(200);
  });

  it('never invokes shouldCompact when autoCompact is disabled', () => {
    const manager = new SessionManager({
      sessionsDir: tempDir,
      autoCompact: false,
      maxContextTokens: 10_000,
    });
    manager.createSession();

    manager.addMessage('assistant', 'irrelevant', { input: 9_500, output: 500, reasoning: 1_000 });

    expect(shouldCompact).not.toHaveBeenCalled();
    expect(compactConversation).not.toHaveBeenCalled();
  });

  it('uses the token-based branch for legacy sessions once they append a reasoning turn', () => {
    // Simulate a session created before the token-accumulation contract
    // existed: totalTokens on disk starts at 0. Append a reasoning turn
    // and confirm the auto-compact check on THAT append uses the
    // token-based branch (because totalTokens becomes > 0 by the time
    // the check runs).
    const legacyId = '11111111-1111-4111-8111-111111111111';
    const legacyPath = path.join(tempDir, `${legacyId}.json`);
    const legacy: Session = {
      metadata: {
        id: legacyId,
        created: 1,
        updated: 2,
        totalTokens: 0,
        messageCount: 1,
      },
      messages: [
        {
          role: 'user',
          content: 'legacy no-token message',
          timestamp: 1,
        },
      ],
    };
    fs.writeFileSync(legacyPath, JSON.stringify(legacy, null, 2), 'utf-8');

    const manager = new SessionManager({
      sessionsDir: tempDir,
      autoCompact: true,
      maxContextTokens: 100_000,
    });
    const loaded = manager.loadSession(legacyId);
    expect(loaded).not.toBeNull();

    manager.addMessage('assistant', 'reasoning response', {
      input: 10_000,
      output: 5_000,
      reasoning: 3_000,
    });

    expect(shouldCompact).toHaveBeenCalledTimes(1);
    const opts = vi.mocked(shouldCompact).mock.calls[0][2] as {
      threshold: number;
      reportedUsage: number;
    };
    // Token-based branch: reasoning + prompt + completion = 18_000.
    expect(opts.threshold).toBe(90);
    expect(opts.reportedUsage).toBe(18_000);
  });
});
