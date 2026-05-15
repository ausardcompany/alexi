import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  compactBefore,
  setLLMSummarizeFn,
  type CompactionOptions,
} from '../../src/core/compaction.js';
import type { Message } from '../../src/core/sessionManager.js';

// ---------------------------------------------------------------------------
// Helper to create test messages
// ---------------------------------------------------------------------------

function createMessages(count: number): Message[] {
  return Array.from({ length: count }, (_, i) => ({
    role: (i % 2 === 0 ? 'user' : 'assistant') as 'user' | 'assistant',
    content: `Message ${i}: ${'x'.repeat(100)}`,
    timestamp: Date.now() + i * 1000,
  }));
}

// ---------------------------------------------------------------------------
// compactBefore tests
// ---------------------------------------------------------------------------

describe('compactBefore', () => {
  beforeEach(() => {
    // Use a mock summarize function for predictable results
    setLLMSummarizeFn(vi.fn().mockResolvedValue('Summary of earlier messages'));
  });

  afterEach(() => {
    // Reset the global LLM function
    setLLMSummarizeFn(vi.fn().mockResolvedValue(''));
  });

  describe('preserves messages at and after index', () => {
    it('should preserve messages at and after the given index', async () => {
      const messages = createMessages(10);
      const index = 6;

      const { messages: result } = await compactBefore(messages, index);

      // Messages at index 6, 7, 8, 9 should be preserved verbatim
      const preserved = messages.slice(index);
      const resultTail = result.slice(-preserved.length);

      for (let i = 0; i < preserved.length; i++) {
        expect(resultTail[i].content).toBe(preserved[i].content);
        expect(resultTail[i].role).toBe(preserved[i].role);
      }
    });

    it('should compact messages before the given index', async () => {
      const messages = createMessages(10);
      const index = 6;

      const { messages: result, result: compactionResult } = await compactBefore(messages, index);

      // The result should have fewer messages than the original
      expect(result.length).toBeLessThan(messages.length);
      // Token savings should be positive
      expect(compactionResult.estimatedTokensSaved).toBeGreaterThan(0);
      // Original message count should match input
      expect(compactionResult.originalMessages).toBe(10);
    });

    it('should produce a summary from compacted messages', async () => {
      const messages = createMessages(10);
      const index = 6;

      const { result } = await compactBefore(messages, index);

      expect(result.summary).toBeTruthy();
    });
  });

  describe('invalid index handling', () => {
    it('should return messages unchanged for negative index', async () => {
      const messages = createMessages(5);

      const { messages: result, result: compactionResult } = await compactBefore(messages, -1);

      expect(result.length).toBe(messages.length);
      expect(compactionResult.estimatedTokensSaved).toBe(0);
    });

    it('should return messages unchanged for index exceeding message count', async () => {
      const messages = createMessages(5);

      const { messages: result, result: compactionResult } = await compactBefore(messages, 10);

      expect(result.length).toBe(messages.length);
      expect(compactionResult.estimatedTokensSaved).toBe(0);
    });

    it('should return messages unchanged for index of 0', async () => {
      const messages = createMessages(5);

      const { messages: result, result: compactionResult } = await compactBefore(messages, 0);

      expect(result.length).toBe(messages.length);
      expect(compactionResult.estimatedTokensSaved).toBe(0);
    });

    it('should return messages unchanged for index of 1', async () => {
      const messages = createMessages(5);

      const { messages: result, result: compactionResult } = await compactBefore(messages, 1);

      expect(result.length).toBe(messages.length);
      expect(compactionResult.estimatedTokensSaved).toBe(0);
    });
  });

  describe('edge cases', () => {
    it('should handle index equal to message count (compact all)', async () => {
      const messages = createMessages(8);
      const index = 8;

      const { messages: result, result: compactionResult } = await compactBefore(messages, index);

      // Should compact all messages (no preserved tail)
      expect(compactionResult.originalMessages).toBe(8);
      // Result should have the summary message(s)
      expect(result.length).toBeLessThan(messages.length);
    });

    it('should handle empty messages array', async () => {
      const messages: Message[] = [];

      const { messages: result, result: compactionResult } = await compactBefore(messages, 5);

      expect(result.length).toBe(0);
      expect(compactionResult.estimatedTokensSaved).toBe(0);
    });

    it('should handle index of 2 (minimal compaction)', async () => {
      const messages = createMessages(6);
      const index = 2;

      const { messages: result, result: compactionResult } = await compactBefore(messages, index);

      // Last 4 messages (index 2..5) should be preserved
      const preserved = messages.slice(2);
      const resultTail = result.slice(-preserved.length);

      for (let i = 0; i < preserved.length; i++) {
        expect(resultTail[i].content).toBe(preserved[i].content);
      }
      expect(compactionResult.originalMessages).toBe(6);
    });
  });
});

// ---------------------------------------------------------------------------
// CompactionOptions.upToIndex in the interface
// ---------------------------------------------------------------------------

describe('CompactionOptions.upToIndex', () => {
  it('should accept upToIndex as an optional property', () => {
    const options: CompactionOptions = {
      preserveLastN: 4,
      upToIndex: 10,
    };
    expect(options.upToIndex).toBe(10);
  });

  it('should allow undefined upToIndex', () => {
    const options: CompactionOptions = {
      preserveLastN: 4,
    };
    expect(options.upToIndex).toBeUndefined();
  });
});
