/**
 * Session totals for reasoning tokens (issue #1846).
 *
 * The provider layer subtracts reasoning tokens out of `completion_tokens`
 * before forwarding usage to the session manager (Task 1 of the plan in
 * `.github/research/2026-09-26-tasks.md`). This means the session
 * manager can safely accumulate BOTH `output` and `reasoning` into
 * `SessionMetadata.totalTokens` without double-counting: by the time a
 * message reaches `addMessage`, the two fields are disjoint counts.
 *
 * These tests pin the accumulation contract:
 *   - single message with reasoning tokens: `totalTokens` includes them
 *     exactly once
 *   - multi-turn sessions accumulate reasoning tokens correctly
 *   - `totalReasoningTokens` observability field mirrors the running sum
 *     but stays `undefined` on sessions that never see reasoning usage
 *   - `createSession({ initialMessages })` seeds both counts from
 *     reasoning-carrying messages
 *   - persistence round-trip preserves the extra field on disk
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

// Match the mocking style of the sibling test suites so a compaction
// pass does not fire mid-assertion and mutate the transcript.
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

import { SessionManager, type Message, type Session } from '../../src/core/sessionManager.js';

let tempDir: string;

beforeEach(() => {
  vi.clearAllMocks();
  tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'session-reasoning-'));
});

afterEach(() => {
  fs.rmSync(tempDir, { recursive: true, force: true });
});

describe('SessionManager reasoning-token accumulation', () => {
  it('leaves totals unchanged when tokens carry no reasoning field', () => {
    const manager = new SessionManager(tempDir);
    manager.createSession();

    manager.addMessage('user', 'Hi', { input: 10 });
    manager.addMessage('assistant', 'Hello', { output: 20 });

    const meta = manager.getCurrentSession()!.metadata;
    expect(meta.totalTokens).toBe(30);
    // Backwards compat: never touched -> stays undefined so legacy
    // consumers cannot observe a behaviour change.
    expect(meta.totalReasoningTokens).toBeUndefined();
  });

  it('adds reasoning tokens exactly once to totalTokens on a single message', () => {
    const manager = new SessionManager(tempDir);
    manager.createSession();

    // Provider convention: `output` here is post-subtraction
    // (completion_tokens - reasoning_tokens), so `reasoning` is
    // disjoint. Total for this turn = 100 + 60 + 20 = 180.
    manager.addMessage('assistant', 'Response', { input: 100, output: 60, reasoning: 20 });

    const meta = manager.getCurrentSession()!.metadata;
    expect(meta.totalTokens).toBe(180);
    expect(meta.totalReasoningTokens).toBe(20);
  });

  it('accumulates reasoning tokens across a two-turn session without double-counting', () => {
    // Example from issue #1846 / plan Task 3:
    //   Turn 1: 100 prompt + 60 completion (post-subtraction) + 20 reasoning
    //   Turn 2: 150 prompt + 80 completion (post-subtraction) + 30 reasoning
    //   Expected: 250 prompt + 140 completion + 50 reasoning = 440 total.
    const manager = new SessionManager(tempDir);
    manager.createSession();

    manager.addMessage('user', 'turn 1 user', { input: 100 });
    manager.addMessage('assistant', 'turn 1 assistant', { output: 60, reasoning: 20 });
    manager.addMessage('user', 'turn 2 user', { input: 150 });
    manager.addMessage('assistant', 'turn 2 assistant', { output: 80, reasoning: 30 });

    const meta = manager.getCurrentSession()!.metadata;
    expect(meta.totalTokens).toBe(440);
    expect(meta.totalReasoningTokens).toBe(50);

    // Sanity-check the decomposition — each token counted exactly once.
    const promptSum = 100 + 150;
    const completionSum = 60 + 80;
    const reasoningSum = 20 + 30;
    expect(promptSum + completionSum + reasoningSum).toBe(meta.totalTokens);
  });

  it('mixes reasoning and non-reasoning turns without inflating totals', () => {
    const manager = new SessionManager(tempDir);
    manager.createSession();

    // Some turns come from reasoning models, others do not — a mixed
    // agent session (e.g. a router falling back to a cheap model)
    // should still tally correctly.
    manager.addMessage('assistant', 'no reasoning', { input: 10, output: 10 });
    manager.addMessage('assistant', 'with reasoning', { input: 5, output: 5, reasoning: 15 });
    manager.addMessage('assistant', 'no reasoning again', { input: 2, output: 3 });

    const meta = manager.getCurrentSession()!.metadata;
    expect(meta.totalTokens).toBe(10 + 10 + 5 + 5 + 15 + 2 + 3);
    expect(meta.totalReasoningTokens).toBe(15);
  });

  it('treats reasoning === 0 as a no-op (does not initialise totalReasoningTokens)', () => {
    const manager = new SessionManager(tempDir);
    manager.createSession();

    // An explicit zero should NOT flip the session into "has reasoning
    // usage" — otherwise every reasoning-capable provider that reports
    // `reasoning_tokens: 0` on a non-thinking turn would leak the
    // observability field into every session on disk.
    manager.addMessage('assistant', 'zero reasoning', { input: 10, output: 20, reasoning: 0 });

    const meta = manager.getCurrentSession()!.metadata;
    expect(meta.totalTokens).toBe(30);
    expect(meta.totalReasoningTokens).toBeUndefined();
  });

  it('seeds totalTokens and totalReasoningTokens from initialMessages', () => {
    const seeded: Message[] = [
      { role: 'user', content: 'prompt', timestamp: 1_000, tokens: { input: 40 } },
      {
        role: 'assistant',
        content: 'thinking response',
        timestamp: 2_000,
        tokens: { output: 25, reasoning: 15 },
      },
    ];

    const manager = new SessionManager(tempDir);
    const session = manager.createSession('gpt-x', undefined, { initialMessages: seeded });

    // 40 (prompt) + 25 (completion) + 15 (reasoning) = 80
    expect(session.metadata.totalTokens).toBe(80);
    expect(session.metadata.totalReasoningTokens).toBe(15);
  });

  it('omits totalReasoningTokens on the persisted JSON when the session never sees reasoning', () => {
    const manager = new SessionManager(tempDir);
    const session = manager.createSession();
    manager.addMessage('user', 'plain question', { input: 5, output: 0 });

    const filePath = path.join(tempDir, `${session.metadata.id}.json`);
    const parsed = JSON.parse(fs.readFileSync(filePath, 'utf-8')) as Session;

    expect(parsed.metadata.totalTokens).toBe(5);
    // JSON.stringify drops undefined properties, so a legacy consumer
    // parsing this file sees exactly the same shape as before the
    // reasoning field was introduced.
    expect(Object.prototype.hasOwnProperty.call(parsed.metadata, 'totalReasoningTokens')).toBe(
      false
    );
  });

  it('persists totalReasoningTokens to disk and survives reload', () => {
    const manager = new SessionManager(tempDir);
    const session = manager.createSession();
    manager.addMessage('assistant', 'thought hard', { input: 10, output: 10, reasoning: 25 });

    const manager2 = new SessionManager(tempDir);
    const reloaded = manager2.loadSession(session.metadata.id);
    expect(reloaded).not.toBeNull();
    expect(reloaded!.metadata.totalTokens).toBe(45);
    expect(reloaded!.metadata.totalReasoningTokens).toBe(25);
  });

  it('remains backwards compatible with sessions saved before the field existed', () => {
    // Simulate an on-disk session file written by an older Alexi build:
    // no `totalReasoningTokens` field at all, no `reasoning` token
    // subfield anywhere in the transcript. Loading it and appending a
    // reasoning-carrying turn should initialise the field lazily
    // without corrupting the pre-existing totals.
    const legacyId = '00000000-0000-4000-8000-000000000000';
    const legacyPath = path.join(tempDir, `${legacyId}.json`);
    const legacy: Session = {
      metadata: {
        id: legacyId,
        created: 1_000,
        updated: 2_000,
        totalTokens: 42,
        messageCount: 1,
      },
      messages: [
        {
          role: 'user',
          content: 'legacy',
          timestamp: 1_500,
          tokens: { input: 42 },
        },
      ],
    };
    fs.writeFileSync(legacyPath, JSON.stringify(legacy, null, 2), 'utf-8');

    const manager = new SessionManager(tempDir);
    const loaded = manager.loadSession(legacyId);
    expect(loaded).not.toBeNull();
    expect(loaded!.metadata.totalReasoningTokens).toBeUndefined();

    manager.addMessage('assistant', 'now thinking', { output: 8, reasoning: 12 });

    const meta = manager.getCurrentSession()!.metadata;
    // Legacy total (42) + new output (8) + new reasoning (12) = 62.
    expect(meta.totalTokens).toBe(62);
    expect(meta.totalReasoningTokens).toBe(12);
  });
});
