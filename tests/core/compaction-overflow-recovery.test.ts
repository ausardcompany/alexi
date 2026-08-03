/**
 * Tests for the `overflowRecovery` mode of `compactConversation`
 * (issue #1247). This mode is the reactive fallback used by the streaming
 * orchestrator when a provider rejects a request with a
 * context-window-exceeded error:
 *
 *   1. Bypasses the "return unchanged when small" fast-paths — it either
 *      compacts, or throws `NothingToCompactError`, never a silent no-op.
 *   2. Forces the deterministic basic-summary strategy even when a global
 *      LLM summarize function is registered, so recovery cannot itself be
 *      blocked by another provider failure.
 *   3. Respects the 80% post-compact target when `maxContextTokens` is set.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import {
  compactConversation,
  setLLMSummarizeFn,
  NothingToCompactError,
  type LLMSummarizeFn,
} from '../../src/core/compaction.js';
import type { Message } from '../../src/core/sessionManager.js';

function msg(role: Message['role'], content: string): Message {
  return { role, content, timestamp: Date.now() };
}

/**
 * Generate `n` alternating user/assistant messages padded to `wordsPer` words
 * each so the resulting transcript reliably exceeds the 4-char/token heuristic
 * budgets tested here.
 */
function synthTranscript(n: number, wordsPer = 20): Message[] {
  const out: Message[] = [];
  for (let i = 0; i < n; i++) {
    out.push(msg(i % 2 === 0 ? 'user' : 'assistant', `msg${i} `.repeat(wordsPer).trim()));
  }
  return out;
}

describe('compactConversation with overflowRecovery: true', () => {
  beforeEach(() => {
    // Clear any global LLM summarize function set by other tests.
    setLLMSummarizeFn(null as unknown as LLMSummarizeFn);
  });

  afterEach(() => {
    setLLMSummarizeFn(null as unknown as LLMSummarizeFn);
  });

  it('throws NothingToCompactError when messages.length <= preserveLastN', async () => {
    // preserveLastN default is 4; supply only 3 messages so recovery has
    // nothing to salvage.
    const messages = [msg('user', 'a'), msg('assistant', 'b'), msg('user', 'c')];

    await expect(compactConversation(messages, { overflowRecovery: true })).rejects.toBeInstanceOf(
      NothingToCompactError
    );
  });

  it('throws NothingToCompactError on empty message array under recovery', async () => {
    await expect(compactConversation([], { overflowRecovery: true })).rejects.toBeInstanceOf(
      NothingToCompactError
    );
  });

  it('forces basic (deterministic) strategy even when an LLM summarize fn is registered', async () => {
    // Register an LLM summarizer that would normally be called by the
    // non-recovery path. Under overflowRecovery it MUST NOT be invoked —
    // recovery cannot depend on another provider call.
    const llmFn = vi.fn<Parameters<LLMSummarizeFn>, ReturnType<LLMSummarizeFn>>(
      async () => 'LLM-generated summary'
    );
    setLLMSummarizeFn(llmFn);

    const messages = synthTranscript(10, 20);

    const { messages: compacted, result } = await compactConversation(messages, {
      overflowRecovery: true,
      preserveLastN: 2,
    });

    // The LLM function was never called.
    expect(llmFn).not.toHaveBeenCalled();

    // A summary system message exists and was produced by the fallback
    // deterministic path (not the LLM). Basic summary emits section
    // headers like "FILES MENTIONED", "KEY POINTS", or "CONTEXT: N
    // messages summarized...". At minimum it never contains the LLM
    // sentinel above.
    const summaryMsg = compacted.find(
      (m) => m.role === 'system' && m.content.startsWith('[CONVERSATION SUMMARY]')
    );
    expect(summaryMsg).toBeDefined();
    expect(summaryMsg!.content).not.toContain('LLM-generated summary');

    expect(result.originalMessages).toBe(10);
    expect(result.compactedMessages).toBeLessThan(10);
  });

  it('reduces the transcript length when there is history to compact', async () => {
    const messages = synthTranscript(12, 30);

    const { messages: compacted, result } = await compactConversation(messages, {
      overflowRecovery: true,
      preserveLastN: 3,
    });

    // Preserved N + 1 (summary) at minimum; strictly fewer than original.
    expect(compacted.length).toBeLessThan(messages.length);
    expect(result.estimatedTokensSaved).toBeGreaterThan(0);
    // Last 3 messages are preserved intact.
    const tail = compacted.slice(-3).map((m) => m.content);
    const originalTail = messages.slice(-3).map((m) => m.content);
    expect(tail).toEqual(originalTail);
  });

  it('applies the 80% target budget when maxContextTokens is provided', async () => {
    // Build a transcript whose estimated tokens comfortably exceed the
    // 80% target so we can observe the target-driven reduction.
    const messages = synthTranscript(20, 40);

    const maxContextTokens = 2_000;
    const reserveOutputTokens = 400;
    // Target ≈ (2000 - 400) * 0.8 = 1280 tokens.

    const { result } = await compactConversation(messages, {
      overflowRecovery: true,
      preserveLastN: 2,
      maxContextTokens,
      reserveOutputTokens,
    });

    expect(result.originalMessages).toBe(20);
    expect(result.compactedMessages).toBeLessThan(20);
    expect(result.estimatedTokensSaved).toBeGreaterThan(0);
  });

  it('non-recovery mode still returns unchanged for tiny message arrays (no throw)', async () => {
    // Sanity: confirm we did not break the legacy contract for callers
    // that do NOT pass overflowRecovery.
    const messages = [msg('user', 'a'), msg('assistant', 'b')];
    const { messages: out, result } = await compactConversation(messages);
    expect(out).toEqual(messages);
    expect(result.estimatedTokensSaved).toBe(0);
  });
});
