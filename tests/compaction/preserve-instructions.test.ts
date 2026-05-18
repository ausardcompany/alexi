import { describe, it, expect, vi, afterEach } from 'vitest';

import {
  CompactionManager,
  resetCompactionConfig,
  type Message,
} from '../../src/compaction/index.js';

import {
  compactConversation,
  setLLMSummarizeFn,
  type LLMSummarizeFn,
} from '../../src/core/compaction.js';

import type { Message as CoreMessage } from '../../src/core/sessionManager.js';

// Helper to create test messages
function createMessage(role: Message['role'], content: string): Message {
  return { role, content, timestamp: Date.now() };
}

function createCoreMessage(role: CoreMessage['role'], content: string): CoreMessage {
  return { role, content, timestamp: Date.now() };
}

describe('Compaction preserves user instructions', () => {
  afterEach(() => {
    resetCompactionConfig();
  });

  describe('src/compaction/index.ts SUMMARY_PROMPT', () => {
    it('should include instruction preservation language in the summarization prompt', async () => {
      let capturedPrompt = '';
      const mockSummarizeFn = vi.fn(async (prompt: string) => {
        capturedPrompt = prompt;
        return 'summary result';
      });

      const manager = new CompactionManager({ summarizeFn: mockSummarizeFn });

      const messages: Message[] = [
        createMessage('user', 'Always use single quotes in this project'),
        createMessage('assistant', 'Understood, I will use single quotes.'),
      ];

      await manager.summarize(messages);

      expect(mockSummarizeFn).toHaveBeenCalledTimes(1);

      // Verify the prompt contains instruction preservation directives
      expect(capturedPrompt).toContain('CRITICAL');
      expect(capturedPrompt).toContain(
        'Identify and preserve ALL explicit user instructions, preferences, and constraints verbatim'
      );
      expect(capturedPrompt).toContain('Coding style rules');
      expect(capturedPrompt).toContain('File/directory restrictions');
      expect(capturedPrompt).toContain('API endpoints, keys, or configuration values');
      expect(capturedPrompt).toContain('"always do X" or "never do Y"');
      expect(capturedPrompt).toContain('Project-specific conventions');
      expect(capturedPrompt).toContain('## User Instructions');
      expect(capturedPrompt).toContain('MUST survive compaction unchanged');
    });

    it('should include user message content alongside preservation directives', async () => {
      let capturedPrompt = '';
      const mockSummarizeFn = vi.fn(async (prompt: string) => {
        capturedPrompt = prompt;
        return 'summary';
      });

      const manager = new CompactionManager({ summarizeFn: mockSummarizeFn });

      const messages: Message[] = [
        createMessage('user', 'Never modify the package-lock.json file'),
        createMessage('assistant', 'Got it, I will leave package-lock.json untouched.'),
      ];

      await manager.summarize(messages);

      // The user's instruction should appear in the formatted messages section
      expect(capturedPrompt).toContain('Never modify the package-lock.json file');
      // The preservation directive should also be present
      expect(capturedPrompt).toContain('MUST survive compaction unchanged');
    });

    it('should include preservation language when using summarize strategy', async () => {
      let capturedPrompt = '';
      const mockSummarizeFn = vi.fn(async (prompt: string) => {
        capturedPrompt = prompt;
        return 'compacted summary';
      });

      const manager = new CompactionManager({ summarizeFn: mockSummarizeFn });

      const messages: Message[] = [
        createMessage('user', 'Use tabs for indentation, never spaces'),
        createMessage('assistant', 'I will use tabs for indentation.'),
        createMessage('user', 'Also always use the endpoint https://api.example.com'),
        createMessage('assistant', 'Noted, using https://api.example.com'),
        createMessage('user', 'Now implement the login feature'),
        createMessage('assistant', 'Working on the login feature now.'),
        createMessage('user', 'How is it going?'),
        createMessage('assistant', 'Almost done with login.'),
      ];

      await manager.compact(messages, {
        strategy: 'summarize',
        preserveRecent: 2,
      });

      expect(mockSummarizeFn).toHaveBeenCalled();
      expect(capturedPrompt).toContain('## User Instructions');
      expect(capturedPrompt).toContain('MUST survive compaction unchanged');
    });
  });

  describe('src/core/compaction.ts SUMMARY_PROMPT', () => {
    afterEach(() => {
      setLLMSummarizeFn((() => Promise.resolve('')) as LLMSummarizeFn);
    });

    it('should include instruction preservation language in the summarization prompt', async () => {
      let capturedPrompt = '';
      const mockSummarizeFn = vi.fn(async (prompt: string) => {
        capturedPrompt = prompt;
        return 'summary result';
      });

      setLLMSummarizeFn(mockSummarizeFn);

      const messages: CoreMessage[] = [
        createCoreMessage('user', 'Always use single quotes'),
        createCoreMessage('assistant', 'Understood.'),
        createCoreMessage('user', 'Never delete the .env file'),
        createCoreMessage('assistant', 'Got it.'),
        createCoreMessage('user', 'Build the feature'),
        createCoreMessage('assistant', 'Working on it.'),
        createCoreMessage('user', 'Status?'),
        createCoreMessage('assistant', 'Almost done.'),
      ];

      await compactConversation(messages, { preserveLastN: 2 });

      expect(mockSummarizeFn).toHaveBeenCalled();

      // Verify the prompt contains the USER INSTRUCTIONS extraction item
      expect(capturedPrompt).toContain('USER INSTRUCTIONS');
      expect(capturedPrompt).toContain(
        'Identify and preserve ALL explicit user instructions, preferences, and constraints verbatim'
      );
      expect(capturedPrompt).toContain('coding style rules');
      expect(capturedPrompt).toContain('file/directory restrictions');
      expect(capturedPrompt).toContain('API endpoints, keys, or configuration values');
      expect(capturedPrompt).toContain('"always do X" or "never do Y"');
      expect(capturedPrompt).toContain('project-specific conventions');
      expect(capturedPrompt).toContain('MUST survive compaction unchanged');
    });

    it('should include CRITICAL preservation directive', async () => {
      let capturedPrompt = '';
      const mockSummarizeFn = vi.fn(async (prompt: string) => {
        capturedPrompt = prompt;
        return 'summary';
      });

      setLLMSummarizeFn(mockSummarizeFn);

      const messages: CoreMessage[] = [
        createCoreMessage('user', 'Use kebab-case for file names'),
        createCoreMessage('assistant', 'Will do.'),
        createCoreMessage('user', 'Implement auth'),
        createCoreMessage('assistant', 'On it.'),
        createCoreMessage('user', 'Next step?'),
        createCoreMessage('assistant', 'Done with auth.'),
      ];

      await compactConversation(messages, { preserveLastN: 2 });

      expect(capturedPrompt).toContain('CRITICAL');
      expect(capturedPrompt).toContain(
        'Preserve them verbatim — do not paraphrase or omit any directive the user stated'
      );
    });

    it('should include user messages containing instructions in the prompt', async () => {
      let capturedPrompt = '';
      const mockSummarizeFn = vi.fn(async (prompt: string) => {
        capturedPrompt = prompt;
        return 'summary';
      });

      setLLMSummarizeFn(mockSummarizeFn);

      const messages: CoreMessage[] = [
        createCoreMessage('user', 'Always use the API key sk-test-12345'),
        createCoreMessage('assistant', 'Noted.'),
        createCoreMessage('user', 'Build the dashboard'),
        createCoreMessage('assistant', 'Working on it.'),
        createCoreMessage('user', 'Done?'),
        createCoreMessage('assistant', 'Yes, finished.'),
      ];

      await compactConversation(messages, { preserveLastN: 2 });

      // User instruction should appear in the messages section of the prompt
      expect(capturedPrompt).toContain('Always use the API key sk-test-12345');
      // Preservation directive should also be present
      expect(capturedPrompt).toContain('MUST survive compaction unchanged');
    });
  });
});
