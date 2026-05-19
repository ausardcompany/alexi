import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  CompactionManager,
  estimateConversationTokens,
  type CompactionOptions,
  type Message,
  type SummarizeFn,
} from '../../src/compaction/index.js';

// Helper to create test messages
function createMessage(role: Message['role'], content: string): Message {
  return { role, content, timestamp: Date.now() };
}

// Helper to create a list of messages with substantial content
function createConversation(count: number, contentLength = 200): Message[] {
  const messages: Message[] = [];
  for (let i = 0; i < count; i++) {
    const role = i % 2 === 0 ? 'user' : 'assistant';
    const content = `Message ${i}: ${'x'.repeat(contentLength)}`;
    messages.push(createMessage(role, content));
  }
  return messages;
}

describe('Reactive Compaction Seeding', () => {
  let summarizeFn: SummarizeFn;
  let capturedPrompts: string[];

  beforeEach(() => {
    capturedPrompts = [];
    summarizeFn = vi.fn(async (prompt: string) => {
      capturedPrompts.push(prompt);
      return 'Summary of the conversation.';
    });
  });

  describe('CompactionOptions.overflowTokens', () => {
    it('should include target length instruction when overflowTokens is provided', async () => {
      const manager = new CompactionManager({ summarizeFn });
      const messages = createConversation(10);

      const options: CompactionOptions = {
        strategy: 'summarize',
        preserveRecent: 2,
        overflowTokens: 500,
      };

      await manager.compact(messages, options);

      // The summarize function should have been called with a target instruction
      expect(capturedPrompts.length).toBeGreaterThan(0);
      const lastPrompt = capturedPrompts[capturedPrompts.length - 1];
      expect(lastPrompt).toContain('Keep your summary under approximately');
      expect(lastPrompt).toContain('tokens');
    });

    it('should NOT include target length instruction when overflowTokens is not provided', async () => {
      const manager = new CompactionManager({ summarizeFn });
      const messages = createConversation(10);

      const options: CompactionOptions = {
        strategy: 'summarize',
        preserveRecent: 2,
      };

      await manager.compact(messages, options);

      // The summarize function should have been called WITHOUT a target instruction
      expect(capturedPrompts.length).toBeGreaterThan(0);
      const lastPrompt = capturedPrompts[capturedPrompts.length - 1];
      expect(lastPrompt).not.toContain('Keep your summary under approximately');
    });

    it('should NOT include target length instruction when overflowTokens is 0', async () => {
      const manager = new CompactionManager({ summarizeFn });
      const messages = createConversation(10);

      const options: CompactionOptions = {
        strategy: 'summarize',
        preserveRecent: 2,
        overflowTokens: 0,
      };

      await manager.compact(messages, options);

      expect(capturedPrompts.length).toBeGreaterThan(0);
      const lastPrompt = capturedPrompts[capturedPrompts.length - 1];
      expect(lastPrompt).not.toContain('Keep your summary under approximately');
    });

    it('should calculate targetSummaryTokens as totalOldTokens - overflowTokens * 1.5', async () => {
      const manager = new CompactionManager({ summarizeFn });
      const messages = createConversation(10);

      const preserveRecent = 2;
      const overflowTokens = 100;

      // Calculate what the target should be
      const nonSystemMessages = messages.filter((m) => m.role !== 'system');
      const toSummarize = nonSystemMessages.slice(0, -preserveRecent);
      const totalOldTokens = estimateConversationTokens(toSummarize);
      const expectedTarget = Math.max(500, totalOldTokens - Math.ceil(overflowTokens * 1.5));

      const options: CompactionOptions = {
        strategy: 'summarize',
        preserveRecent,
        overflowTokens,
      };

      await manager.compact(messages, options);

      const lastPrompt = capturedPrompts[capturedPrompts.length - 1];
      expect(lastPrompt).toContain(`under approximately ${expectedTarget} tokens`);
    });

    it('should ensure targetSummaryTokens is at least 500', async () => {
      const manager = new CompactionManager({ summarizeFn });
      // Create short messages with very large overflow
      const messages = createConversation(10, 10);

      const options: CompactionOptions = {
        strategy: 'summarize',
        preserveRecent: 2,
        overflowTokens: 999999, // Way larger than actual tokens
      };

      await manager.compact(messages, options);

      const lastPrompt = capturedPrompts[capturedPrompts.length - 1];
      // Should still contain the instruction with at least 500 token target (minimum floor)
      expect(lastPrompt).toContain('Keep your summary under approximately 500 tokens');
    });

    it('should work with smart strategy when overflowTokens is provided', async () => {
      const manager = new CompactionManager({ summarizeFn });
      const messages = createConversation(10);

      const options: CompactionOptions = {
        strategy: 'smart',
        preserveRecent: 2,
        overflowTokens: 300,
      };

      await manager.compact(messages, options);

      // The summarize function should have been called with a target instruction
      expect(capturedPrompts.length).toBeGreaterThan(0);
      const lastPrompt = capturedPrompts[capturedPrompts.length - 1];
      expect(lastPrompt).toContain('Keep your summary under approximately');
      expect(lastPrompt).toContain('tokens');
    });

    it('should work with smart strategy without overflowTokens (backward-compatible)', async () => {
      const manager = new CompactionManager({ summarizeFn });
      const messages = createConversation(10);

      const options: CompactionOptions = {
        strategy: 'smart',
        preserveRecent: 2,
      };

      await manager.compact(messages, options);

      expect(capturedPrompts.length).toBeGreaterThan(0);
      const lastPrompt = capturedPrompts[capturedPrompts.length - 1];
      expect(lastPrompt).not.toContain('Keep your summary under approximately');
    });

    it('should work with customSummaryPrompt and overflowTokens', async () => {
      const manager = new CompactionManager({ summarizeFn });
      const messages = createConversation(10);

      const options: CompactionOptions = {
        strategy: 'summarize',
        preserveRecent: 2,
        customSummaryPrompt: 'Custom prompt: {messages}',
        overflowTokens: 200,
      };

      await manager.compact(messages, options);

      expect(capturedPrompts.length).toBeGreaterThan(0);
      const lastPrompt = capturedPrompts[capturedPrompts.length - 1];
      expect(lastPrompt).toContain('Custom prompt:');
      expect(lastPrompt).toContain('Keep your summary under approximately');
    });

    it('should not affect truncate strategy', async () => {
      const manager = new CompactionManager({ summarizeFn });
      const messages = createConversation(10);

      const options: CompactionOptions = {
        strategy: 'truncate',
        preserveRecent: 2,
        overflowTokens: 500,
      };

      const result = await manager.compact(messages, options);

      // Truncate should still work normally — no summarize call
      expect(result.success).toBe(true);
      expect(capturedPrompts.length).toBe(0);
    });

    it('should not affect sliding strategy', async () => {
      const manager = new CompactionManager({ summarizeFn });
      const messages = createConversation(10);

      const options: CompactionOptions = {
        strategy: 'sliding',
        preserveRecent: 2,
        overflowTokens: 500,
      };

      const result = await manager.compact(messages, options);

      // Sliding uses extractKeySummary (no AI call)
      expect(result.success).toBe(true);
      expect(capturedPrompts.length).toBe(0);
    });
  });

  describe('backward compatibility', () => {
    it('should produce identical results without overflowTokens', async () => {
      const manager = new CompactionManager({ summarizeFn });
      const messages = createConversation(10);

      // Run without overflowTokens
      const resultA = await manager.compact(messages, {
        strategy: 'summarize',
        preserveRecent: 2,
      });

      // Run with overflowTokens = undefined (equivalent)
      capturedPrompts = [];
      const resultB = await manager.compact(messages, {
        strategy: 'summarize',
        preserveRecent: 2,
        overflowTokens: undefined,
      });

      // Both should succeed and have same message counts
      expect(resultA.success).toBe(true);
      expect(resultB.success).toBe(true);
      expect(resultA.compactedMessageCount).toBe(resultB.compactedMessageCount);
      expect(resultA.removedMessages).toBe(resultB.removedMessages);
    });

    it('should still work when no summarizeFn is configured', async () => {
      const manager = new CompactionManager();
      const messages = createConversation(10);

      const result = await manager.compact(messages, {
        strategy: 'summarize',
        preserveRecent: 2,
        overflowTokens: 500,
      });

      // Should fallback to extractKeySummary without error
      expect(result.success).toBe(true);
    });
  });
});
