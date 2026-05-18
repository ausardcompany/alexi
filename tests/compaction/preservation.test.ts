import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import {
  CompactionManager,
  resetCompactionConfig,
  type Message as CompactionMessage,
} from '../../src/compaction/index.js';

import { summarizeChunks } from '../../src/core/compaction.js';
import type { Message as CoreMessage } from '../../src/core/sessionManager.js';

// Helper to create test messages for compaction module
function createCompactionMessage(
  role: CompactionMessage['role'],
  content: string
): CompactionMessage {
  return { role, content, timestamp: Date.now() };
}

// Helper to create test messages for core module
function createCoreMessage(role: CoreMessage['role'], content: string): CoreMessage {
  return { role, content, timestamp: Date.now() };
}

describe('Compaction instruction preservation', () => {
  beforeEach(() => {
    resetCompactionConfig();
  });

  afterEach(() => {
    resetCompactionConfig();
  });

  describe('src/compaction/index.ts SUMMARY_PROMPT', () => {
    it('should include preservation keywords in the summarization prompt', async () => {
      let capturedPrompt = '';
      const mockSummarizeFn = vi.fn(async (prompt: string) => {
        capturedPrompt = prompt;
        return 'mock summary';
      });

      const manager = new CompactionManager({
        summarizeFn: mockSummarizeFn,
      });

      const messages: CompactionMessage[] = [
        createCompactionMessage('user', 'Hello, use tabs for indentation'),
        createCompactionMessage('assistant', 'Got it, I will use tabs.'),
      ];

      await manager.summarize(messages);

      expect(mockSummarizeFn).toHaveBeenCalledOnce();
      expect(capturedPrompt).toContain('preserve');
      expect(capturedPrompt).toContain('verbatim');
      expect(capturedPrompt).toContain('constraints');
      expect(capturedPrompt).toContain('preferences');
      expect(capturedPrompt).toContain('CRITICAL');
    });

    it('should instruct to preserve API keys, endpoints, and URLs', async () => {
      let capturedPrompt = '';
      const mockSummarizeFn = vi.fn(async (prompt: string) => {
        capturedPrompt = prompt;
        return 'mock summary';
      });

      const manager = new CompactionManager({
        summarizeFn: mockSummarizeFn,
      });

      const messages: CompactionMessage[] = [
        createCompactionMessage('user', 'The API endpoint is https://example.com/api'),
        createCompactionMessage('assistant', 'Noted.'),
      ];

      await manager.summarize(messages);

      expect(capturedPrompt).toContain('API keys');
      expect(capturedPrompt).toContain('endpoints');
      expect(capturedPrompt).toContain('URLs');
      expect(capturedPrompt).toContain('credentials');
    });

    it('should instruct to preserve explicit do/do-not instructions', async () => {
      let capturedPrompt = '';
      const mockSummarizeFn = vi.fn(async (prompt: string) => {
        capturedPrompt = prompt;
        return 'mock summary';
      });

      const manager = new CompactionManager({
        summarizeFn: mockSummarizeFn,
      });

      const messages: CompactionMessage[] = [
        createCompactionMessage('user', 'Never modify the package.json'),
        createCompactionMessage('assistant', 'Understood.'),
      ];

      await manager.summarize(messages);

      expect(capturedPrompt).toContain('NOT to do');
      expect(capturedPrompt).toContain('always do');
    });
  });

  describe('src/core/compaction.ts SUMMARY_PROMPT', () => {
    it('should include preservation instruction in the summarization prompt', async () => {
      let capturedPrompt = '';
      const mockSummarizeFn = vi.fn(async (prompt: string) => {
        capturedPrompt = prompt;
        return 'mock summary';
      });

      const messages: CoreMessage[] = [
        createCoreMessage('user', 'Always use single quotes'),
        createCoreMessage('assistant', 'Will do.'),
      ];

      await summarizeChunks([messages], mockSummarizeFn);

      expect(mockSummarizeFn).toHaveBeenCalledOnce();
      expect(capturedPrompt).toContain('USER INSTRUCTIONS');
      expect(capturedPrompt).toContain('Preserve ALL');
      expect(capturedPrompt).toContain('preferences');
      expect(capturedPrompt).toContain('constraints');
      expect(capturedPrompt).toContain('verbatim');
    });

    it('should instruct to preserve coding style and explicit instructions', async () => {
      let capturedPrompt = '';
      const mockSummarizeFn = vi.fn(async (prompt: string) => {
        capturedPrompt = prompt;
        return 'mock summary';
      });

      const messages: CoreMessage[] = [
        createCoreMessage('user', 'Use 4 spaces indentation, never use var'),
        createCoreMessage('assistant', 'Noted.'),
      ];

      await summarizeChunks([messages], mockSummarizeFn);

      expect(capturedPrompt).toContain('coding style');
      expect(capturedPrompt).toContain('API keys');
      expect(capturedPrompt).toContain('endpoints');
      expect(capturedPrompt).toContain('"always do X"');
      expect(capturedPrompt).toContain('"never do Y"');
    });
  });

  describe('Integration: assembled prompt includes preservation instructions', () => {
    it('CompactionManager prompt includes both messages and preservation section', async () => {
      let capturedPrompt = '';
      const mockSummarizeFn = vi.fn(async (prompt: string) => {
        capturedPrompt = prompt;
        return 'mock summary';
      });

      const manager = new CompactionManager({
        summarizeFn: mockSummarizeFn,
      });

      const messages: CompactionMessage[] = [
        createCompactionMessage('user', 'Set up the project with ESLint strict mode'),
        createCompactionMessage('assistant', 'Done, ESLint is configured with strict mode.'),
        createCompactionMessage('user', 'Never disable any ESLint rules'),
        createCompactionMessage('assistant', 'I will keep all ESLint rules enabled.'),
      ];

      await manager.summarize(messages);

      // Verify the prompt has both the preservation instructions AND the messages
      expect(capturedPrompt).toContain('CRITICAL');
      expect(capturedPrompt).toContain('preserve');
      expect(capturedPrompt).toContain('verbatim');
      expect(capturedPrompt).toContain('[USER]: Set up the project with ESLint strict mode');
      expect(capturedPrompt).toContain('[USER]: Never disable any ESLint rules');
    });

    it('core compaction prompt includes both messages and preservation section', async () => {
      let capturedPrompt = '';
      const mockSummarizeFn = vi.fn(async (prompt: string) => {
        capturedPrompt = prompt;
        return 'mock summary';
      });

      const messages: CoreMessage[] = [
        createCoreMessage('user', 'The base URL is https://api.example.com'),
        createCoreMessage('assistant', 'Got it.'),
      ];

      await summarizeChunks([messages], mockSummarizeFn);

      // Verify the prompt has both the preservation instructions AND the messages
      expect(capturedPrompt).toContain('USER INSTRUCTIONS');
      expect(capturedPrompt).toContain('Preserve ALL');
      expect(capturedPrompt).toContain('[USER]: The base URL is https://api.example.com');
    });
  });
});
