import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import type { Message } from '../../src/core/sessionManager.js';
import { setLLMSummarizeFn, type LLMSummarizeFn } from '../../src/core/compaction.js';
import {
  getTurnBoundaries,
  parseRewindArgs,
  validateTurnNumber,
  rewindDiscard,
  rewindSummarize,
  rewindList,
  executeRewind,
} from '../../src/command/rewind.js';

// Helper to create test messages
function createMessage(role: Message['role'], content: string, timestamp?: number): Message {
  return { role, content, timestamp: timestamp ?? Date.now() };
}

// Helper to create a typical conversation
function createConversation(): Message[] {
  return [
    createMessage('system', 'You are a helpful assistant'),
    createMessage('user', 'Hello, can you help me with TypeScript?'),
    createMessage('assistant', 'Of course! What do you need help with?'),
    createMessage('user', 'How do I define interfaces?'),
    createMessage('assistant', 'You can define interfaces using the interface keyword...'),
    createMessage('user', 'What about generics?'),
    createMessage('assistant', 'Generics allow you to create reusable components...'),
    createMessage('user', 'Thanks, now explain decorators'),
    createMessage('assistant', 'Decorators are a way to add annotations...'),
  ];
}

describe('Rewind Command', () => {
  let mockSummarizeFn: LLMSummarizeFn;

  beforeEach(() => {
    mockSummarizeFn = vi.fn().mockResolvedValue('Summary of earlier conversation');
    setLLMSummarizeFn(mockSummarizeFn);
  });

  afterEach(() => {
    setLLMSummarizeFn((() => Promise.resolve('')) as LLMSummarizeFn);
  });

  describe('getTurnBoundaries', () => {
    it('should identify user messages as turn boundaries', () => {
      const messages = createConversation();
      const boundaries = getTurnBoundaries(messages);

      expect(boundaries).toHaveLength(4);
      expect(boundaries[0].turnNumber).toBe(1);
      expect(boundaries[1].turnNumber).toBe(2);
      expect(boundaries[2].turnNumber).toBe(3);
      expect(boundaries[3].turnNumber).toBe(4);
    });

    it('should skip system messages when counting turns', () => {
      const messages = [
        createMessage('system', 'System prompt'),
        createMessage('user', 'First user message'),
        createMessage('assistant', 'Response'),
      ];
      const boundaries = getTurnBoundaries(messages);

      expect(boundaries).toHaveLength(1);
      expect(boundaries[0].turnNumber).toBe(1);
      expect(boundaries[0].role).toBe('user');
    });

    it('should return empty array for empty messages', () => {
      const boundaries = getTurnBoundaries([]);
      expect(boundaries).toHaveLength(0);
    });

    it('should return empty array for system-only messages', () => {
      const messages = [
        createMessage('system', 'System prompt 1'),
        createMessage('system', 'System prompt 2'),
      ];
      const boundaries = getTurnBoundaries(messages);
      expect(boundaries).toHaveLength(0);
    });

    it('should truncate preview to 50 characters', () => {
      const longContent = 'a'.repeat(100);
      const messages = [createMessage('user', longContent)];
      const boundaries = getTurnBoundaries(messages);

      expect(boundaries[0].preview.length).toBeLessThanOrEqual(53); // 50 + '...'
      expect(boundaries[0].preview).toContain('...');
    });

    it('should not truncate short previews', () => {
      const messages = [createMessage('user', 'Short message')];
      const boundaries = getTurnBoundaries(messages);

      expect(boundaries[0].preview).toBe('Short message');
    });
  });

  describe('parseRewindArgs', () => {
    it('should parse turn number', () => {
      const result = parseRewindArgs(['3']);
      expect(result.turnNumber).toBe(3);
      expect(result.summarize).toBe(false);
    });

    it('should parse --summarize flag', () => {
      const result = parseRewindArgs(['2', '--summarize']);
      expect(result.turnNumber).toBe(2);
      expect(result.summarize).toBe(true);
    });

    it('should handle --summarize before turn number', () => {
      const result = parseRewindArgs(['--summarize', '5']);
      expect(result.turnNumber).toBe(5);
      expect(result.summarize).toBe(true);
    });

    it('should return null turn number when no number given', () => {
      const result = parseRewindArgs([]);
      expect(result.turnNumber).toBeNull();
      expect(result.summarize).toBe(false);
    });

    it('should return null turn number for non-numeric args', () => {
      const result = parseRewindArgs(['--summarize']);
      expect(result.turnNumber).toBeNull();
      expect(result.summarize).toBe(true);
    });
  });

  describe('validateTurnNumber', () => {
    it('should reject zero', () => {
      const boundaries = getTurnBoundaries(createConversation());
      const result = validateTurnNumber(0, boundaries);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('positive integer');
    });

    it('should reject negative numbers', () => {
      const boundaries = getTurnBoundaries(createConversation());
      const result = validateTurnNumber(-1, boundaries);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('positive integer');
    });

    it('should reject out-of-range numbers', () => {
      const boundaries = getTurnBoundaries(createConversation());
      const result = validateTurnNumber(10, boundaries);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('out of range');
    });

    it('should accept valid turn numbers', () => {
      const boundaries = getTurnBoundaries(createConversation());
      const result = validateTurnNumber(2, boundaries);
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject when no boundaries exist', () => {
      const result = validateTurnNumber(1, []);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('No turns available');
    });
  });

  describe('rewindDiscard', () => {
    it('should discard messages after specified turn', () => {
      const messages = createConversation();
      const result = rewindDiscard(messages, 2);

      expect(result.success).toBe(true);
      expect(result.mode).toBe('discard');
      expect(result.messages).toBeDefined();
      // Turn 2 starts at "How do I define interfaces?" (index 3)
      // Turn 3 starts at "What about generics?" (index 5)
      // So we keep messages[0..4] (system + turn1 + turn2)
      expect(result.messages!.length).toBeLessThan(messages.length);
      expect(result.discardedCount).toBeGreaterThan(0);
    });

    it('should keep system messages and messages up to end of specified turn', () => {
      const messages = createConversation();
      const result = rewindDiscard(messages, 1);

      expect(result.success).toBe(true);
      // System message + user turn 1 + assistant response
      // Turn 2 starts at index 3, so we keep 0..2 (3 messages)
      expect(result.messages!).toHaveLength(3);
      expect(result.messages![0].role).toBe('system');
      expect(result.messages![1].role).toBe('user');
      expect(result.messages![2].role).toBe('assistant');
    });

    it('should keep all messages when rewinding to last turn', () => {
      const messages = createConversation();
      const result = rewindDiscard(messages, 4);

      expect(result.success).toBe(true);
      expect(result.messages!.length).toBe(messages.length);
      expect(result.discardedCount).toBe(0);
    });

    it('should fail for invalid turn number', () => {
      const messages = createConversation();
      const result = rewindDiscard(messages, 0);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should fail for out-of-range turn number', () => {
      const messages = createConversation();
      const result = rewindDiscard(messages, 99);

      expect(result.success).toBe(false);
      expect(result.error).toContain('out of range');
    });
  });

  describe('rewindSummarize', () => {
    it('should summarize messages before specified turn', async () => {
      const messages = createConversation();
      const result = await rewindSummarize(messages, 3);

      expect(result.success).toBe(true);
      expect(result.mode).toBe('summarize');
      expect(result.messages).toBeDefined();
      expect(result.summarizedCount).toBeGreaterThan(0);
    });

    it('should preserve messages from specified turn onward', async () => {
      const messages = createConversation();
      const result = await rewindSummarize(messages, 3);

      expect(result.success).toBe(true);
      // The messages from turn 3 onward should be preserved
      const keptMessages = result.messages!.filter((m) => m.role !== 'system');
      // Turn 3 starts with "What about generics?" and continues to end
      expect(keptMessages.some((m) => m.content.includes('What about generics?'))).toBe(true);
      expect(keptMessages.some((m) => m.content.includes('explain decorators'))).toBe(true);
    });

    it('should include a summary system message', async () => {
      const messages = createConversation();
      const result = await rewindSummarize(messages, 3);

      expect(result.success).toBe(true);
      const summaryMsg = result.messages!.find(
        (m) => m.role === 'system' && m.content.includes('[CONVERSATION SUMMARY]')
      );
      expect(summaryMsg).toBeDefined();
    });

    it('should fail when trying to summarize before turn 1', async () => {
      const messages = [
        createMessage('user', 'First message'),
        createMessage('assistant', 'Response'),
      ];
      const result = await rewindSummarize(messages, 1);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Nothing to summarize');
    });

    it('should fail for invalid turn number', async () => {
      const messages = createConversation();
      const result = await rewindSummarize(messages, -1);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should call the LLM summarize function', async () => {
      const messages = createConversation();
      await rewindSummarize(messages, 3);

      expect(mockSummarizeFn).toHaveBeenCalled();
    });
  });

  describe('rewindList', () => {
    it('should list all turn boundaries', () => {
      const messages = createConversation();
      const result = rewindList(messages);

      expect(result.success).toBe(true);
      expect(result.mode).toBe('list');
      expect(result.turnBoundaries).toBeDefined();
      expect(result.turnBoundaries!.length).toBe(4);
    });

    it('should fail when no turns exist', () => {
      const result = rewindList([]);

      expect(result.success).toBe(false);
      expect(result.error).toContain('No turns available');
    });

    it('should include previews in boundaries', () => {
      const messages = createConversation();
      const result = rewindList(messages);

      for (const boundary of result.turnBoundaries!) {
        expect(boundary.preview).toBeDefined();
        expect(boundary.preview.length).toBeGreaterThan(0);
      }
    });
  });

  describe('executeRewind', () => {
    it('should list turns when no args provided', async () => {
      const messages = createConversation();
      const result = await executeRewind(messages, []);

      expect(result.mode).toBe('list');
      expect(result.turnBoundaries).toBeDefined();
    });

    it('should discard when turn number provided without --summarize', async () => {
      const messages = createConversation();
      const result = await executeRewind(messages, ['2']);

      expect(result.success).toBe(true);
      expect(result.mode).toBe('discard');
      expect(result.messages).toBeDefined();
    });

    it('should summarize when --summarize flag is provided', async () => {
      const messages = createConversation();
      const result = await executeRewind(messages, ['3', '--summarize']);

      expect(result.success).toBe(true);
      expect(result.mode).toBe('summarize');
      expect(result.messages).toBeDefined();
    });

    it('should handle --summarize before turn number', async () => {
      const messages = createConversation();
      const result = await executeRewind(messages, ['--summarize', '3']);

      expect(result.success).toBe(true);
      expect(result.mode).toBe('summarize');
    });
  });
});
