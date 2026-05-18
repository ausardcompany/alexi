import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

import { SessionManager } from '../../src/core/sessionManager.js';
import { setLLMSummarizeFn, type LLMSummarizeFn } from '../../src/core/compaction.js';
import { UndoManager, setUndoManager, resetUndoManager } from '../../src/undo/index.js';

describe('Rewind and Partial Summarize', () => {
  let tempDir: string;
  let sm: SessionManager;
  let undoManager: UndoManager;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'alexi-rewind-test-'));
    sm = new SessionManager({ sessionsDir: tempDir, autoCompact: false });
    undoManager = new UndoManager();
    setUndoManager(undoManager);
  });

  afterEach(() => {
    resetUndoManager();
    fs.rmSync(tempDir, { recursive: true, force: true });
    setLLMSummarizeFn((() => Promise.resolve('')) as LLMSummarizeFn);
  });

  describe('getTurnCount', () => {
    it('should return 0 for no active session', () => {
      expect(sm.getTurnCount()).toBe(0);
    });

    it('should count user messages as turns', () => {
      sm.createSession();
      sm.addMessage('user', 'Hello');
      sm.addMessage('assistant', 'Hi');
      sm.addMessage('user', 'How are you?');
      sm.addMessage('assistant', 'Good');

      expect(sm.getTurnCount()).toBe(2);
    });

    it('should count user messages without assistant response', () => {
      sm.createSession();
      sm.addMessage('user', 'Hello');
      sm.addMessage('user', 'Another');

      expect(sm.getTurnCount()).toBe(2);
    });
  });

  describe('rewind', () => {
    it('should throw if no active session', async () => {
      await expect(sm.rewind(1)).rejects.toThrow('No active session');
    });

    it('should throw if n is 0 or negative', async () => {
      sm.createSession();
      sm.addMessage('user', 'Hello');
      sm.addMessage('assistant', 'Hi');

      await expect(sm.rewind(0)).rejects.toThrow('positive integer');
      await expect(sm.rewind(-1)).rejects.toThrow('positive integer');
    });

    it('should throw if n exceeds total turns', async () => {
      sm.createSession();
      sm.addMessage('user', 'Hello');
      sm.addMessage('assistant', 'Hi');

      await expect(sm.rewind(5)).rejects.toThrow('Cannot rewind 5 turns: only 1 turn(s)');
    });

    it('should remove last turn (user + assistant pair)', async () => {
      sm.createSession();
      sm.addMessage('user', 'First');
      sm.addMessage('assistant', 'Response 1');
      sm.addMessage('user', 'Second');
      sm.addMessage('assistant', 'Response 2');

      const result = await sm.rewind(1);

      expect(result.turnsRemoved).toBe(1);
      expect(result.messagesRemoved).toBe(2);

      const session = sm.getCurrentSession()!;
      expect(session.messages).toHaveLength(2);
      expect(session.messages[0].content).toBe('First');
      expect(session.messages[1].content).toBe('Response 1');
    });

    it('should remove multiple turns', async () => {
      sm.createSession();
      sm.addMessage('user', 'First');
      sm.addMessage('assistant', 'Response 1');
      sm.addMessage('user', 'Second');
      sm.addMessage('assistant', 'Response 2');
      sm.addMessage('user', 'Third');
      sm.addMessage('assistant', 'Response 3');

      const result = await sm.rewind(2);

      expect(result.turnsRemoved).toBe(2);
      expect(result.messagesRemoved).toBe(4);

      const session = sm.getCurrentSession()!;
      expect(session.messages).toHaveLength(2);
      expect(session.messages[0].content).toBe('First');
      expect(session.messages[1].content).toBe('Response 1');
    });

    it('should remove all turns when n equals total turns', async () => {
      sm.createSession();
      sm.addMessage('user', 'First');
      sm.addMessage('assistant', 'Response 1');
      sm.addMessage('user', 'Second');
      sm.addMessage('assistant', 'Response 2');

      const result = await sm.rewind(2);

      expect(result.turnsRemoved).toBe(2);
      expect(result.messagesRemoved).toBe(4);

      const session = sm.getCurrentSession()!;
      expect(session.messages).toHaveLength(0);
    });

    it('should trigger file undo for affected turns', async () => {
      sm.createSession();

      // Simulate timestamps
      const now = Date.now();
      sm.addMessage('user', 'First');
      sm.addMessage('assistant', 'Response 1');

      // Push an undo entry with a timestamp that will be after the second user message
      const laterTimestamp = now + 5000;

      sm.addMessage('user', 'Second');
      sm.addMessage('assistant', 'Response 2');

      // Push undo state for the second turn's file changes
      undoManager.pushState(
        'msg-2',
        [{ path: '/tmp/test-file.txt', content: 'original', timestamp: laterTimestamp }],
        'write file'
      );

      // Spy on undo
      const undoSpy = vi.spyOn(undoManager, 'undo');

      const result = await sm.rewind(1);

      expect(undoSpy).toHaveBeenCalled();
      expect(result.filesRestored.length).toBeGreaterThanOrEqual(0);
    });

    it('should update session metadata after rewind', async () => {
      sm.createSession();
      sm.addMessage('user', 'First');
      sm.addMessage('assistant', 'Response 1');
      sm.addMessage('user', 'Second');
      sm.addMessage('assistant', 'Response 2');

      await sm.rewind(1);

      const session = sm.getCurrentSession()!;
      expect(session.metadata.messageCount).toBe(2);
    });

    it('should persist session to disk after rewind', async () => {
      const session = sm.createSession();
      sm.addMessage('user', 'First');
      sm.addMessage('assistant', 'Response 1');
      sm.addMessage('user', 'Second');
      sm.addMessage('assistant', 'Response 2');

      await sm.rewind(1);

      // Load from disk
      const sm2 = new SessionManager({ sessionsDir: tempDir, autoCompact: false });
      const loaded = sm2.loadSession(session.metadata.id);
      expect(loaded).not.toBeNull();
      expect(loaded!.messages).toHaveLength(2);
    });
  });

  describe('partialSummarize', () => {
    it('should throw if no active session', async () => {
      await expect(sm.partialSummarize(2)).rejects.toThrow('No active session');
    });

    it('should throw if beforeTurn is 0 or negative', async () => {
      sm.createSession();
      sm.addMessage('user', 'Hello');
      sm.addMessage('assistant', 'Hi');

      await expect(sm.partialSummarize(0)).rejects.toThrow('positive integer');
      await expect(sm.partialSummarize(-1)).rejects.toThrow('positive integer');
    });

    it('should throw if beforeTurn exceeds total turns', async () => {
      sm.createSession();
      sm.addMessage('user', 'Hello');
      sm.addMessage('assistant', 'Hi');

      await expect(sm.partialSummarize(5)).rejects.toThrow(
        'Cannot summarize before turn 5: only 1 turn(s)'
      );
    });

    it('should throw if beforeTurn is 1 (nothing to summarize)', async () => {
      sm.createSession();
      sm.addMessage('user', 'Hello');
      sm.addMessage('assistant', 'Hi');

      await expect(sm.partialSummarize(1)).rejects.toThrow('Nothing to summarize before turn 1');
    });

    it('should summarize messages before the specified turn', async () => {
      // Set up LLM summarize function
      setLLMSummarizeFn(async (_prompt: string) => {
        return 'Summary of earlier conversation.';
      });

      sm.createSession();
      sm.addMessage('user', 'First question');
      sm.addMessage('assistant', 'First answer');
      sm.addMessage('user', 'Second question');
      sm.addMessage('assistant', 'Second answer');
      sm.addMessage('user', 'Third question');
      sm.addMessage('assistant', 'Third answer');

      const result = await sm.partialSummarize(3);

      expect(result.messagesSummarized).toBe(4); // First 2 turns = 4 messages
      expect(result.messagesPreserved).toBe(2); // Turn 3 = 2 messages

      const session = sm.getCurrentSession()!;
      // Should have: summary message + 2 preserved messages
      expect(session.messages).toHaveLength(3);
      expect(session.messages[0].role).toBe('system');
      expect(session.messages[0].content).toContain('[PARTIAL SUMMARY]');
      expect(session.messages[1].content).toBe('Third question');
      expect(session.messages[2].content).toBe('Third answer');
    });

    it('should produce valid summary message with fallback when no LLM', async () => {
      sm.createSession();
      sm.addMessage('user', 'First question about file.ts');
      sm.addMessage('assistant', 'First answer');
      sm.addMessage('user', 'Second question');
      sm.addMessage('assistant', 'Second answer');
      sm.addMessage('user', 'Third question');
      sm.addMessage('assistant', 'Third answer');

      // No LLM set — will use fallback summary
      setLLMSummarizeFn(null as unknown as LLMSummarizeFn);

      const result = await sm.partialSummarize(3);

      expect(result.messagesSummarized).toBe(4);

      const session = sm.getCurrentSession()!;
      expect(session.messages[0].role).toBe('system');
      expect(session.messages[0].content).toContain('[PARTIAL SUMMARY]');
    });

    it('should update session metadata after partial summarize', async () => {
      setLLMSummarizeFn(async () => 'Summary');

      sm.createSession();
      sm.addMessage('user', 'First');
      sm.addMessage('assistant', 'Response 1');
      sm.addMessage('user', 'Second');
      sm.addMessage('assistant', 'Response 2');

      await sm.partialSummarize(2);

      const session = sm.getCurrentSession()!;
      // 1 summary + 2 preserved = 3
      expect(session.metadata.messageCount).toBe(3);
    });

    it('should persist session to disk after partial summarize', async () => {
      setLLMSummarizeFn(async () => 'Summary');

      const session = sm.createSession();
      sm.addMessage('user', 'First');
      sm.addMessage('assistant', 'Response 1');
      sm.addMessage('user', 'Second');
      sm.addMessage('assistant', 'Response 2');

      await sm.partialSummarize(2);

      // Load from disk
      const sm2 = new SessionManager({ sessionsDir: tempDir, autoCompact: false });
      const loaded = sm2.loadSession(session.metadata.id);
      expect(loaded).not.toBeNull();
      expect(loaded!.messages).toHaveLength(3);
      expect(loaded!.messages[0].content).toContain('[PARTIAL SUMMARY]');
    });
  });

  describe('integration: rewind + partial summarize in sequence', () => {
    it('should support rewind followed by partial summarize', async () => {
      setLLMSummarizeFn(async () => 'Integrated summary');

      sm.createSession();
      sm.addMessage('user', 'Turn 1');
      sm.addMessage('assistant', 'Response 1');
      sm.addMessage('user', 'Turn 2');
      sm.addMessage('assistant', 'Response 2');
      sm.addMessage('user', 'Turn 3');
      sm.addMessage('assistant', 'Response 3');
      sm.addMessage('user', 'Turn 4');
      sm.addMessage('assistant', 'Response 4');

      // Rewind last turn
      await sm.rewind(1);
      expect(sm.getTurnCount()).toBe(3);

      // Now summarize before turn 3
      await sm.partialSummarize(3);

      const session = sm.getCurrentSession()!;
      // Summary + turn 3 (user + assistant) = 3 messages
      expect(session.messages).toHaveLength(3);
      expect(session.messages[0].role).toBe('system');
      expect(session.messages[0].content).toContain('[PARTIAL SUMMARY]');
      expect(session.messages[1].content).toBe('Turn 3');
      expect(session.messages[2].content).toBe('Response 3');
    });
  });
});
