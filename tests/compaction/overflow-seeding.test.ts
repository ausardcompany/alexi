import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  CompactionManager,
  estimateConversationTokens,
  type CompactionOptions,
  type Message,
  type SummarizeFn,
} from '../../src/compaction/index.js';
import {
  compactConversation,
  estimateMessagesTokens,
  setLLMSummarizeFn,
  type CompactionOptions as CoreCompactionOptions,
} from '../../src/core/compaction.js';
import type { Message as CoreMessage } from '../../src/core/sessionManager.js';

// ============ Helpers ============

function createMessage(role: Message['role'], content: string): Message {
  return { role, content, timestamp: Date.now() };
}

function createCoreMessage(role: CoreMessage['role'], content: string): CoreMessage {
  return { role, content, timestamp: Date.now() };
}

function createConversation(count: number, contentLength = 200): Message[] {
  const messages: Message[] = [];
  for (let i = 0; i < count; i++) {
    const role = i % 2 === 0 ? 'user' : 'assistant';
    const content = `Message ${i}: ${'x'.repeat(contentLength)}`;
    messages.push(createMessage(role, content));
  }
  return messages;
}

function createCoreConversation(count: number, contentLength = 200): CoreMessage[] {
  const messages: CoreMessage[] = [];
  for (let i = 0; i < count; i++) {
    const role: CoreMessage['role'] = i % 2 === 0 ? 'user' : 'assistant';
    const content = `Message ${i}: ${'x'.repeat(contentLength)}`;
    messages.push(createCoreMessage(role, content));
  }
  return messages;
}

// ============ Tests ============

describe('Overflow Seeding', () => {
  describe('Target calculation formula', () => {
    let summarizeFn: SummarizeFn;
    let capturedPrompts: string[];

    beforeEach(() => {
      capturedPrompts = [];
      summarizeFn = vi.fn(async (prompt: string) => {
        capturedPrompts.push(prompt);
        return 'Summary of conversation.';
      });
    });

    it('should compute target as totalOldTokens - ceil(overflowTokens * 1.5)', async () => {
      const manager = new CompactionManager({ summarizeFn });
      const messages = createConversation(12);
      const preserveRecent = 2;
      const overflowTokens = 200;

      const nonSystem = messages.filter((m) => m.role !== 'system');
      const toSummarize = nonSystem.slice(0, -preserveRecent);
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

    it('should apply the 1.5x multiplier with ceiling on the overflow', async () => {
      const manager = new CompactionManager({ summarizeFn });
      const messages = createConversation(10);
      const overflowTokens = 333; // 333 * 1.5 = 499.5, ceil = 500

      const options: CompactionOptions = {
        strategy: 'summarize',
        preserveRecent: 2,
        overflowTokens,
      };

      await manager.compact(messages, options);

      const nonSystem = messages.filter((m) => m.role !== 'system');
      const toSummarize = nonSystem.slice(0, -2);
      const totalOldTokens = estimateConversationTokens(toSummarize);
      const expected = Math.max(500, totalOldTokens - Math.ceil(333 * 1.5));

      const lastPrompt = capturedPrompts[capturedPrompts.length - 1];
      expect(lastPrompt).toContain(`under approximately ${expected} tokens`);
    });
  });

  describe('Minimum floor of 500 tokens', () => {
    let summarizeFn: SummarizeFn;
    let capturedPrompts: string[];

    beforeEach(() => {
      capturedPrompts = [];
      summarizeFn = vi.fn(async (prompt: string) => {
        capturedPrompts.push(prompt);
        return 'Brief summary.';
      });
    });

    it('should floor at 500 when overflow is larger than conversation tokens', async () => {
      const manager = new CompactionManager({ summarizeFn });
      // Very short messages
      const messages = createConversation(8, 5);

      const options: CompactionOptions = {
        strategy: 'summarize',
        preserveRecent: 2,
        overflowTokens: 1000000,
      };

      await manager.compact(messages, options);

      const lastPrompt = capturedPrompts[capturedPrompts.length - 1];
      expect(lastPrompt).toContain('Keep your summary under approximately 500 tokens');
    });

    it('should not floor when target naturally exceeds 500', async () => {
      const manager = new CompactionManager({ summarizeFn });
      // Large messages — target will be well above 500
      const messages = createConversation(20, 500);

      const options: CompactionOptions = {
        strategy: 'summarize',
        preserveRecent: 2,
        overflowTokens: 100,
      };

      await manager.compact(messages, options);

      const nonSystem = messages.filter((m) => m.role !== 'system');
      const toSummarize = nonSystem.slice(0, -2);
      const totalOldTokens = estimateConversationTokens(toSummarize);
      const expectedTarget = totalOldTokens - Math.ceil(100 * 1.5);
      expect(expectedTarget).toBeGreaterThan(500);

      const lastPrompt = capturedPrompts[capturedPrompts.length - 1];
      expect(lastPrompt).toContain(`under approximately ${expectedTarget} tokens`);
    });
  });

  describe('Prompt instruction content', () => {
    let summarizeFn: SummarizeFn;
    let capturedPrompts: string[];

    beforeEach(() => {
      capturedPrompts = [];
      summarizeFn = vi.fn(async (prompt: string) => {
        capturedPrompts.push(prompt);
        return 'Summarized.';
      });
    });

    it('should append target instruction to the summarization prompt', async () => {
      const manager = new CompactionManager({ summarizeFn });
      const messages = createConversation(10);

      await manager.compact(messages, {
        strategy: 'summarize',
        preserveRecent: 2,
        overflowTokens: 400,
      });

      const lastPrompt = capturedPrompts[capturedPrompts.length - 1];
      // The instruction should appear at the end of the prompt
      expect(lastPrompt).toMatch(/Keep your summary under approximately \d+ tokens\.$/);
    });

    it('should not include instruction when overflowTokens is absent', async () => {
      const manager = new CompactionManager({ summarizeFn });
      const messages = createConversation(10);

      await manager.compact(messages, {
        strategy: 'summarize',
        preserveRecent: 2,
      });

      const lastPrompt = capturedPrompts[capturedPrompts.length - 1];
      expect(lastPrompt).not.toContain('Keep your summary under approximately');
    });

    it('should not include instruction when overflowTokens is zero', async () => {
      const manager = new CompactionManager({ summarizeFn });
      const messages = createConversation(10);

      await manager.compact(messages, {
        strategy: 'summarize',
        preserveRecent: 2,
        overflowTokens: 0,
      });

      const lastPrompt = capturedPrompts[capturedPrompts.length - 1];
      expect(lastPrompt).not.toContain('Keep your summary under approximately');
    });

    it('should not include instruction when overflowTokens is negative', async () => {
      const manager = new CompactionManager({ summarizeFn });
      const messages = createConversation(10);

      await manager.compact(messages, {
        strategy: 'summarize',
        preserveRecent: 2,
        overflowTokens: -100,
      });

      const lastPrompt = capturedPrompts[capturedPrompts.length - 1];
      expect(lastPrompt).not.toContain('Keep your summary under approximately');
    });
  });

  describe('src/core/compaction.ts integration', () => {
    let capturedPrompts: string[];

    beforeEach(() => {
      capturedPrompts = [];
      const mockSummarize = vi.fn(async (prompt: string) => {
        capturedPrompts.push(prompt);
        return 'Summarized content.';
      });
      setLLMSummarizeFn(mockSummarize);
    });

    afterEach(() => {
      setLLMSummarizeFn((() => Promise.resolve('')) as unknown as (p: string) => Promise<string>);
    });

    it('should accept overflowTokens in CompactionOptions', async () => {
      const messages = createCoreConversation(10);

      const options: CoreCompactionOptions = {
        preserveLastN: 2,
        overflowTokens: 300,
      };

      const { result } = await compactConversation(messages, options);
      expect(result.originalMessages).toBe(10);
      expect(result.compactedMessages).toBeLessThan(10);
    });

    it('should append target instruction to LLM prompt when overflowTokens is set', async () => {
      const messages = createCoreConversation(10);

      const options: CoreCompactionOptions = {
        preserveLastN: 2,
        overflowTokens: 250,
      };

      await compactConversation(messages, options);

      expect(capturedPrompts.length).toBeGreaterThan(0);
      const lastPrompt = capturedPrompts[capturedPrompts.length - 1];
      expect(lastPrompt).toContain('Keep your summary under approximately');
      expect(lastPrompt).toContain('tokens');
    });

    it('should calculate correct target in core compaction', async () => {
      const messages = createCoreConversation(12);
      const preserveLastN = 2;
      const overflowTokens = 150;

      // Calculate expected target
      const nonSystem = messages.filter((m) => m.role !== 'system');
      const toSummarize = nonSystem.slice(0, -preserveLastN);
      const totalOldTokens = estimateMessagesTokens(toSummarize);
      const expectedTarget = Math.max(500, totalOldTokens - Math.ceil(overflowTokens * 1.5));

      await compactConversation(messages, { preserveLastN, overflowTokens });

      const lastPrompt = capturedPrompts[capturedPrompts.length - 1];
      expect(lastPrompt).toContain(`under approximately ${expectedTarget} tokens`);
    });

    it('should not append instruction when overflowTokens is absent', async () => {
      const messages = createCoreConversation(10);

      await compactConversation(messages, { preserveLastN: 2 });

      expect(capturedPrompts.length).toBeGreaterThan(0);
      const lastPrompt = capturedPrompts[capturedPrompts.length - 1];
      expect(lastPrompt).not.toContain('Keep your summary under approximately');
    });

    it('should not append instruction when overflowTokens is zero', async () => {
      const messages = createCoreConversation(10);

      await compactConversation(messages, { preserveLastN: 2, overflowTokens: 0 });

      expect(capturedPrompts.length).toBeGreaterThan(0);
      const lastPrompt = capturedPrompts[capturedPrompts.length - 1];
      expect(lastPrompt).not.toContain('Keep your summary under approximately');
    });
  });
});
