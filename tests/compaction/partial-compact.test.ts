import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  CompactionManager,
  partialCompact,
  setCompactionManager,
  type Message,
  type SummarizeFn,
} from '../../src/compaction/index.js';

// Helper to create test messages
function createMessage(role: Message['role'], content: string, timestamp?: number): Message {
  return { role, content, timestamp: timestamp ?? Date.now() };
}

describe('partialCompact', () => {
  let summarizeFn: SummarizeFn;
  let manager: CompactionManager;

  beforeEach(() => {
    summarizeFn = vi.fn(async (_prompt: string) => {
      return 'Summary of earlier conversation.';
    });
    manager = new CompactionManager({ summarizeFn });
    setCompactionManager(manager);
  });

  afterEach(() => {
    // Reset to default manager
    const defaultManager = new CompactionManager();
    setCompactionManager(defaultManager);
  });

  describe('normal boundary', () => {
    it('should summarize messages before the boundary and preserve messages after', async () => {
      const messages: Message[] = [
        createMessage('user', 'Hello, help me with a task'),
        createMessage('assistant', 'Sure, what do you need?'),
        createMessage('user', 'Fix the bug in auth.ts'),
        createMessage('assistant', 'I found the issue in the login function.'),
        createMessage('user', 'Great, now add tests'),
        createMessage('assistant', 'Here are the tests for the auth module.'),
      ];

      const result = await partialCompact(messages, 4);

      // First message should be the summary
      expect(result[0].role).toBe('system');
      expect(result[0].content).toContain('[CONVERSATION SUMMARY]');
      expect(result[0].metadata?.isSummary).toBe(true);
      expect(result[0].metadata?.summarizedCount).toBe(4);

      // Messages after boundary should be preserved exactly
      expect(result.length).toBe(3); // summary + 2 preserved
      expect(result[1].role).toBe('user');
      expect(result[1].content).toBe('Great, now add tests');
      expect(result[2].role).toBe('assistant');
      expect(result[2].content).toBe('Here are the tests for the auth module.');
    });

    it('should preserve messages after boundary exactly as-is', async () => {
      const messages: Message[] = [
        createMessage('user', 'First message'),
        createMessage('assistant', 'First response'),
        createMessage('user', 'Second message'),
        createMessage('assistant', 'Second response'),
      ];

      const result = await partialCompact(messages, 2);

      // Preserved messages should be identical
      expect(result[1]).toEqual(messages[2]);
      expect(result[2]).toEqual(messages[3]);
    });

    it('should call summarize with messages before boundary', async () => {
      const messages: Message[] = [
        createMessage('user', 'Alpha'),
        createMessage('assistant', 'Beta'),
        createMessage('user', 'Gamma'),
        createMessage('assistant', 'Delta'),
      ];

      await partialCompact(messages, 2);

      // summarizeFn should have been called (via manager.summarize)
      expect(summarizeFn).toHaveBeenCalled();
    });
  });

  describe('edge cases', () => {
    it('should return original messages unchanged when boundary is 0', async () => {
      const messages: Message[] = [
        createMessage('user', 'Hello'),
        createMessage('assistant', 'Hi there'),
      ];

      const result = await partialCompact(messages, 0);

      expect(result.length).toBe(2);
      expect(result[0].content).toBe('Hello');
      expect(result[1].content).toBe('Hi there');
    });

    it('should summarize all messages when boundary is at end', async () => {
      const messages: Message[] = [
        createMessage('user', 'Hello'),
        createMessage('assistant', 'Hi there'),
        createMessage('user', 'Goodbye'),
      ];

      const result = await partialCompact(messages, messages.length);

      // Should return a single summary message
      expect(result.length).toBe(1);
      expect(result[0].role).toBe('system');
      expect(result[0].content).toContain('[CONVERSATION SUMMARY]');
      expect(result[0].metadata?.summarizedCount).toBe(3);
    });

    it('should summarize all messages when boundary exceeds length', async () => {
      const messages: Message[] = [
        createMessage('user', 'Hello'),
        createMessage('assistant', 'Hi'),
      ];

      const result = await partialCompact(messages, 100);

      expect(result.length).toBe(1);
      expect(result[0].role).toBe('system');
      expect(result[0].content).toContain('[CONVERSATION SUMMARY]');
    });

    it('should handle single message with boundary at 1 (summarize all)', async () => {
      const messages: Message[] = [createMessage('user', 'Only message')];

      const result = await partialCompact(messages, 1);

      expect(result.length).toBe(1);
      expect(result[0].role).toBe('system');
      expect(result[0].content).toContain('[CONVERSATION SUMMARY]');
      expect(result[0].metadata?.summarizedCount).toBe(1);
    });

    it('should handle single message with boundary at 0 (keep all)', async () => {
      const messages: Message[] = [createMessage('user', 'Only message')];

      const result = await partialCompact(messages, 0);

      expect(result.length).toBe(1);
      expect(result[0].content).toBe('Only message');
    });

    it('should handle empty messages array', async () => {
      const result = await partialCompact([], 0);
      expect(result.length).toBe(0);
    });

    it('should handle boundary at 1 with multiple messages', async () => {
      const messages: Message[] = [
        createMessage('user', 'First'),
        createMessage('assistant', 'Second'),
        createMessage('user', 'Third'),
      ];

      const result = await partialCompact(messages, 1);

      expect(result.length).toBe(3); // summary + 2 preserved
      expect(result[0].role).toBe('system');
      expect(result[0].content).toContain('[CONVERSATION SUMMARY]');
      expect(result[0].metadata?.summarizedCount).toBe(1);
      expect(result[1].content).toBe('Second');
      expect(result[2].content).toBe('Third');
    });
  });

  describe('fallback without summarize function', () => {
    it('should use fallback extraction when no summarize function is set', async () => {
      const noSummarizeFnManager = new CompactionManager();
      setCompactionManager(noSummarizeFnManager);

      const messages: Message[] = [
        createMessage('user', 'Fix the bug in auth.ts'),
        createMessage('assistant', 'Done, I fixed the login function'),
        createMessage('user', 'Now add tests'),
        createMessage('assistant', 'Tests added'),
      ];

      const result = await partialCompact(messages, 2);

      // Should still produce a summary message via fallback
      expect(result[0].role).toBe('system');
      expect(result[0].content).toContain('[CONVERSATION SUMMARY]');
      // Preserved messages intact
      expect(result[1].content).toBe('Now add tests');
      expect(result[2].content).toBe('Tests added');
    });
  });
});
