import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

// Mock compaction module
vi.mock('../compaction.js', () => ({
  shouldCompact: vi.fn().mockReturnValue(false),
  compactConversation: vi.fn().mockResolvedValue({
    messages: [],
    result: { originalMessages: 0, compactedMessages: 0, estimatedTokensSaved: 0, summary: '' },
  }),
  estimateMessagesTokens: vi.fn().mockReturnValue(0),
}));

// Mock sessionClose module
vi.mock('../sessionClose.js', () => ({
  closeSession: vi.fn().mockReturnValue(0),
}));

import { SessionManager } from '../sessionManager.js';
import type { Session } from '../sessionManager.js';
import { shouldCompact, compactConversation, estimateMessagesTokens } from '../compaction.js';
import { closeSession } from '../sessionClose.js';

let tempDir: string;

beforeEach(() => {
  vi.clearAllMocks();
  tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'session-test-'));
});

afterEach(() => {
  fs.rmSync(tempDir, { recursive: true, force: true });
});

describe('SessionManager', () => {
  // ========== 1. Constructor ==========
  describe('constructor', () => {
    it('should accept a string (sessionsDir path) and create the directory', () => {
      const sessionsDir = path.join(tempDir, 'my-sessions');
      expect(fs.existsSync(sessionsDir)).toBe(false);

      new SessionManager(sessionsDir);

      expect(fs.existsSync(sessionsDir)).toBe(true);
    });

    it('should accept a SessionManagerOptions object and use sessionsDir from options', () => {
      const sessionsDir = path.join(tempDir, 'opts-sessions');
      expect(fs.existsSync(sessionsDir)).toBe(false);

      new SessionManager({ sessionsDir });

      expect(fs.existsSync(sessionsDir)).toBe(true);
    });

    it('should use default maxContextTokens (128000) and autoCompact (true)', () => {
      const sessionsDir = path.join(tempDir, 'defaults');
      const manager = new SessionManager({ sessionsDir });

      // Verify defaults by checking getContextUsage behavior
      manager.createSession();
      manager.addMessage('user', 'hello');

      const usage = manager.getContextUsage();
      expect(usage).not.toBeNull();
      expect(usage!.maxTokens).toBe(128_000);
    });
  });

  // ========== 2. createSession ==========
  describe('createSession', () => {
    it('should create a session with UUID, timestamps, and empty messages', () => {
      const manager = new SessionManager(tempDir);
      const session = manager.createSession();

      expect(session.metadata.id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
      );
      expect(session.metadata.created).toBeGreaterThan(0);
      expect(session.metadata.updated).toBeGreaterThan(0);
      expect(session.metadata.totalTokens).toBe(0);
      expect(session.metadata.messageCount).toBe(0);
      expect(session.messages).toEqual([]);
    });

    it('should set the created session as activeSession', () => {
      const manager = new SessionManager(tempDir);
      const session = manager.createSession();

      expect(manager.getCurrentSession()).toBe(session);
    });

    it('should persist session file to disk', () => {
      const manager = new SessionManager(tempDir);
      const session = manager.createSession();

      const sessionPath = path.join(tempDir, `${session.metadata.id}.json`);
      expect(fs.existsSync(sessionPath)).toBe(true);

      const content = JSON.parse(fs.readFileSync(sessionPath, 'utf-8')) as Session;
      expect(content.metadata.id).toBe(session.metadata.id);
    });

    it('should store modelId when provided', () => {
      const manager = new SessionManager(tempDir);
      const session = manager.createSession('gpt-4');

      expect(session.metadata.modelId).toBe('gpt-4');
    });

    it('should populate workdir from process.cwd() at creation time', () => {
      const manager = new SessionManager(tempDir);
      const session = manager.createSession();

      expect(session.metadata.workdir).toBe(process.cwd());
    });
  });

  // ========== 3. loadSession ==========
  describe('loadSession', () => {
    it('should load an existing session from disk', () => {
      const manager = new SessionManager(tempDir);
      const created = manager.createSession('test-model');
      created.messages.push({
        role: 'user',
        content: 'Hello',
        timestamp: Date.now(),
      });
      // Save by adding a message through the manager so it persists
      manager.addMessage('user', 'Hi there');

      // Create a new manager that loads from the same directory
      const manager2 = new SessionManager(tempDir);
      const loaded = manager2.loadSession(created.metadata.id);

      expect(loaded).not.toBeNull();
      expect(loaded!.metadata.id).toBe(created.metadata.id);
      expect(loaded!.metadata.modelId).toBe('test-model');
    });

    it('should return null for non-existent session ID', () => {
      const manager = new SessionManager(tempDir);
      const result = manager.loadSession('non-existent-id');

      expect(result).toBeNull();
    });

    it('should set loaded session as active', () => {
      const manager = new SessionManager(tempDir);
      const session = manager.createSession();
      const sessionId = session.metadata.id;

      // Clear and reload
      manager.clearSession();
      expect(manager.getCurrentSession()).toBeNull();

      manager.loadSession(sessionId);
      expect(manager.getCurrentSession()).not.toBeNull();
      expect(manager.getCurrentSession()!.metadata.id).toBe(sessionId);
    });
  });

  // ========== 4. addMessage ==========
  describe('addMessage', () => {
    it('should add a message to the active session', () => {
      const manager = new SessionManager(tempDir);
      manager.createSession();
      manager.addMessage('user', 'Hello world');

      const session = manager.getCurrentSession()!;
      expect(session.messages).toHaveLength(1);
      expect(session.messages[0].role).toBe('user');
      expect(session.messages[0].content).toBe('Hello world');
      expect(session.messages[0].timestamp).toBeGreaterThan(0);
    });

    it('should auto-create a session if none exists', () => {
      const manager = new SessionManager(tempDir);
      expect(manager.getCurrentSession()).toBeNull();

      manager.addMessage('user', 'Auto-created');

      expect(manager.getCurrentSession()).not.toBeNull();
      expect(manager.getCurrentSession()!.messages).toHaveLength(1);
    });

    it('should increment messageCount and update metadata', () => {
      const manager = new SessionManager(tempDir);
      manager.createSession();

      manager.addMessage('user', 'First');
      expect(manager.getCurrentSession()!.metadata.messageCount).toBe(1);

      manager.addMessage('assistant', 'Second');
      expect(manager.getCurrentSession()!.metadata.messageCount).toBe(2);

      // updated timestamp should be refreshed
      const updated = manager.getCurrentSession()!.metadata.updated;
      expect(updated).toBeGreaterThan(0);
    });

    it('should track tokens in totalTokens', () => {
      const manager = new SessionManager(tempDir);
      manager.createSession();

      manager.addMessage('user', 'Hello', { input: 10, output: 0 });
      expect(manager.getCurrentSession()!.metadata.totalTokens).toBe(10);

      manager.addMessage('assistant', 'Hi', { input: 0, output: 20 });
      expect(manager.getCurrentSession()!.metadata.totalTokens).toBe(30);
    });

    it('should set title from first user message (truncated to 50 chars + "...")', () => {
      const manager = new SessionManager(tempDir);
      manager.createSession();

      const longMessage = 'A'.repeat(60);
      manager.addMessage('user', longMessage);

      const title = manager.getCurrentSession()!.metadata.title;
      expect(title).toBe('A'.repeat(50) + '...');
    });

    it('should set title from first user message without truncation for short messages', () => {
      const manager = new SessionManager(tempDir);
      manager.createSession();

      manager.addMessage('user', 'Short title');

      const title = manager.getCurrentSession()!.metadata.title;
      expect(title).toBe('Short title');
    });

    it('should not override title with subsequent user messages', () => {
      const manager = new SessionManager(tempDir);
      manager.createSession();

      manager.addMessage('user', 'First message');
      manager.addMessage('user', 'Second message');

      expect(manager.getCurrentSession()!.metadata.title).toBe('First message');
    });

    it('should not set title from system or assistant messages', () => {
      const manager = new SessionManager(tempDir);
      manager.createSession();

      manager.addMessage('system', 'System prompt');
      expect(manager.getCurrentSession()!.metadata.title).toBeUndefined();

      manager.addMessage('assistant', 'Hello');
      expect(manager.getCurrentSession()!.metadata.title).toBeUndefined();

      manager.addMessage('user', 'User message');
      expect(manager.getCurrentSession()!.metadata.title).toBe('User message');
    });

    it('should persist after each message', () => {
      const manager = new SessionManager(tempDir);
      const session = manager.createSession();

      manager.addMessage('user', 'Persisted message');

      const filePath = path.join(tempDir, `${session.metadata.id}.json`);
      const saved = JSON.parse(fs.readFileSync(filePath, 'utf-8')) as Session;
      expect(saved.messages).toHaveLength(1);
      expect(saved.messages[0].content).toBe('Persisted message');
    });
  });

  // ========== 5. getHistory ==========
  describe('getHistory', () => {
    it('should return all messages', () => {
      const manager = new SessionManager(tempDir);
      manager.createSession();
      manager.addMessage('user', 'msg1');
      manager.addMessage('assistant', 'msg2');
      manager.addMessage('user', 'msg3');

      const history = manager.getHistory();
      expect(history).toHaveLength(3);
    });

    it('should return last N messages when maxMessages is specified', () => {
      const manager = new SessionManager(tempDir);
      manager.createSession();
      manager.addMessage('user', 'msg1');
      manager.addMessage('assistant', 'msg2');
      manager.addMessage('user', 'msg3');
      manager.addMessage('assistant', 'msg4');

      const history = manager.getHistory(2);
      expect(history).toHaveLength(2);
      expect(history[0].content).toBe('msg3');
      expect(history[1].content).toBe('msg4');
    });

    it('should preserve system messages when truncating', () => {
      const manager = new SessionManager(tempDir);
      manager.createSession();
      manager.addMessage('system', 'system-prompt');
      manager.addMessage('user', 'msg1');
      manager.addMessage('assistant', 'msg2');
      manager.addMessage('user', 'msg3');
      manager.addMessage('assistant', 'msg4');

      // Request last 2, but system messages should be preserved
      const history = manager.getHistory(2);

      const systemMsgs = history.filter((m) => m.role === 'system');
      expect(systemMsgs).toHaveLength(1);
      expect(systemMsgs[0].content).toBe('system-prompt');

      // Last 2 non-system messages should also be present
      const nonSystem = history.filter((m) => m.role !== 'system');
      expect(nonSystem).toHaveLength(2);
      expect(nonSystem[0].content).toBe('msg3');
      expect(nonSystem[1].content).toBe('msg4');
    });

    it('should return empty array when no active session', () => {
      const manager = new SessionManager(tempDir);
      expect(manager.getHistory()).toEqual([]);
    });
  });

  // ========== 6. listSessions ==========
  describe('listSessions', () => {
    it('should list all sessions sorted by updated time (newest first)', () => {
      const manager = new SessionManager(tempDir);

      const s1 = manager.createSession();
      const s1Id = s1.metadata.id;
      manager.addMessage('user', 'Session 1');

      const s2 = manager.createSession();
      const s2Id = s2.metadata.id;
      manager.addMessage('user', 'Session 2');

      // Manually set distinct updated timestamps to guarantee ordering
      const s1Path = path.join(tempDir, `${s1Id}.json`);
      const s1Data = JSON.parse(fs.readFileSync(s1Path, 'utf-8')) as Session;
      s1Data.metadata.updated = 1000;
      fs.writeFileSync(s1Path, JSON.stringify(s1Data, null, 2), 'utf-8');

      const s2Path = path.join(tempDir, `${s2Id}.json`);
      const s2Data = JSON.parse(fs.readFileSync(s2Path, 'utf-8')) as Session;
      s2Data.metadata.updated = 2000;
      fs.writeFileSync(s2Path, JSON.stringify(s2Data, null, 2), 'utf-8');

      const sessions = manager.listSessions();
      expect(sessions).toHaveLength(2);
      // Newest first
      expect(sessions[0].id).toBe(s2Id);
      expect(sessions[1].id).toBe(s1Id);
    });

    it('should return empty array when no sessions', () => {
      const emptyDir = path.join(tempDir, 'empty-sessions');
      const manager = new SessionManager(emptyDir);

      expect(manager.listSessions()).toEqual([]);
    });

    describe('workdir filter', () => {
      function writeRawSession(
        sessionsDir: string,
        id: string,
        workdir: string | undefined,
        updated: number
      ): void {
        const meta: Record<string, unknown> = {
          id,
          created: updated,
          updated,
          totalTokens: 0,
          messageCount: 0,
        };
        if (workdir !== undefined) {
          meta.workdir = workdir;
        }
        const session = { metadata: meta, messages: [] };
        fs.writeFileSync(
          path.join(sessionsDir, `${id}.json`),
          JSON.stringify(session, null, 2),
          'utf-8'
        );
      }

      it('should return all sessions when no opts are passed (unchanged behavior)', () => {
        const dir = path.join(tempDir, 'filter-default');
        fs.mkdirSync(dir, { recursive: true });
        writeRawSession(dir, 'a', '/foo', 1000);
        writeRawSession(dir, 'b', '/bar', 2000);
        writeRawSession(dir, 'c', undefined, 3000);

        const manager = new SessionManager(dir);
        const sessions = manager.listSessions();

        expect(sessions.map((s) => s.id).sort()).toEqual(['a', 'b', 'c']);
      });

      it('should filter to only sessions with matching workdir', () => {
        const dir = path.join(tempDir, 'filter-match');
        fs.mkdirSync(dir, { recursive: true });
        writeRawSession(dir, 'match1', '/foo', 1000);
        writeRawSession(dir, 'nomatch', '/bar', 2000);
        writeRawSession(dir, 'match2', '/foo', 3000);

        const manager = new SessionManager(dir);
        const sessions = manager.listSessions({ workdir: '/foo' });

        expect(sessions.map((s) => s.id).sort()).toEqual(['match1', 'match2']);
      });

      it('should exclude sessions with undefined workdir from filtered listings', () => {
        const dir = path.join(tempDir, 'filter-exclude-legacy');
        fs.mkdirSync(dir, { recursive: true });
        writeRawSession(dir, 'legacy', undefined, 1000);
        writeRawSession(dir, 'matching', '/foo', 2000);

        const manager = new SessionManager(dir);
        const sessions = manager.listSessions({ workdir: '/foo' });

        expect(sessions.map((s) => s.id)).toEqual(['matching']);
      });

      it('should resolve paths so /foo, /foo/, and /foo/. all match', () => {
        const dir = path.join(tempDir, 'filter-resolve');
        fs.mkdirSync(dir, { recursive: true });
        writeRawSession(dir, 's1', '/foo', 1000);
        writeRawSession(dir, 's2', '/foo/', 2000);
        writeRawSession(dir, 's3', '/foo/.', 3000);

        const manager = new SessionManager(dir);

        for (const target of ['/foo', '/foo/', '/foo/.']) {
          const sessions = manager.listSessions({ workdir: target });
          expect(sessions.map((s) => s.id).sort()).toEqual(['s1', 's2', 's3']);
        }
      });

      it('should return an empty array when no sessions match the workdir', () => {
        const dir = path.join(tempDir, 'filter-empty');
        fs.mkdirSync(dir, { recursive: true });
        writeRawSession(dir, 'a', '/foo', 1000);
        writeRawSession(dir, 'b', undefined, 2000);

        const manager = new SessionManager(dir);
        const sessions = manager.listSessions({ workdir: '/nope' });

        expect(sessions).toEqual([]);
      });
    });
  });

  // ========== 7. deleteSession ==========
  describe('deleteSession', () => {
    it('should delete session file from disk', () => {
      const manager = new SessionManager(tempDir);
      const session = manager.createSession();
      const sessionId = session.metadata.id;

      const filePath = path.join(tempDir, `${sessionId}.json`);
      expect(fs.existsSync(filePath)).toBe(true);

      const result = manager.deleteSession(sessionId);

      expect(result).toBe(true);
      expect(fs.existsSync(filePath)).toBe(false);
    });

    it('should clear active session if it matches', () => {
      const manager = new SessionManager(tempDir);
      const session = manager.createSession();

      expect(manager.getCurrentSession()).not.toBeNull();

      manager.deleteSession(session.metadata.id);

      expect(manager.getCurrentSession()).toBeNull();
    });

    it('should not clear active session if it does not match', () => {
      const manager = new SessionManager(tempDir);
      const s1 = manager.createSession();
      const s2 = manager.createSession();

      // Active session is now s2
      manager.deleteSession(s1.metadata.id);

      expect(manager.getCurrentSession()).not.toBeNull();
      expect(manager.getCurrentSession()!.metadata.id).toBe(s2.metadata.id);
    });

    it('should return false for non-existent session', () => {
      const manager = new SessionManager(tempDir);
      const result = manager.deleteSession('does-not-exist');

      expect(result).toBe(false);
    });
  });

  // ========== 8. clearSession ==========
  describe('clearSession', () => {
    it('should set activeSession to null', () => {
      const manager = new SessionManager(tempDir);
      manager.createSession();
      expect(manager.getCurrentSession()).not.toBeNull();

      manager.clearSession();

      expect(manager.getCurrentSession()).toBeNull();
    });
  });

  // ========== 9. closeAndExtract ==========
  describe('closeAndExtract', () => {
    it('should call closeSession with messages and sessionId', async () => {
      const manager = new SessionManager(tempDir);
      manager.createSession();
      manager.addMessage('user', 'Test message');

      const session = manager.getCurrentSession()!;
      const sessionId = session.metadata.id;
      const messages = session.messages;

      vi.mocked(closeSession).mockReturnValue(3);

      await manager.closeAndExtract();

      expect(closeSession).toHaveBeenCalledTimes(1);
      expect(closeSession).toHaveBeenCalledWith(messages, sessionId);
    });

    it('should return { memoriesCreated } count from closeSession', async () => {
      const manager = new SessionManager(tempDir);
      manager.createSession();
      manager.addMessage('user', 'Test');

      vi.mocked(closeSession).mockReturnValue(5);

      const result = await manager.closeAndExtract();

      expect(result).toEqual({ memoriesCreated: 5 });
    });

    it('should clear active session after extraction', async () => {
      const manager = new SessionManager(tempDir);
      manager.createSession();
      manager.addMessage('user', 'Test');

      vi.mocked(closeSession).mockReturnValue(1);

      await manager.closeAndExtract();

      expect(manager.getCurrentSession()).toBeNull();
    });

    it('should return null when no active session', async () => {
      const manager = new SessionManager(tempDir);

      const result = await manager.closeAndExtract();

      expect(result).toBeNull();
      expect(closeSession).not.toHaveBeenCalled();
    });
  });

  // ========== 10. compact ==========
  describe('compact', () => {
    it('should return null when no active session', async () => {
      const manager = new SessionManager(tempDir);

      const result = await manager.compact();

      expect(result).toBeNull();
    });

    it('should call compactConversation with current messages', async () => {
      const manager = new SessionManager(tempDir);
      manager.createSession();
      manager.addMessage('user', 'Hello');
      manager.addMessage('assistant', 'Hi');

      const currentMessages = manager.getCurrentSession()!.messages;

      vi.mocked(estimateMessagesTokens).mockReturnValueOnce(100).mockReturnValueOnce(50);
      vi.mocked(compactConversation).mockResolvedValueOnce({
        messages: [{ role: 'system', content: 'Summary', timestamp: Date.now() }],
        result: {
          originalMessages: 2,
          compactedMessages: 1,
          estimatedTokensSaved: 50,
          summary: 'Summary',
        },
      });

      await manager.compact();

      expect(compactConversation).toHaveBeenCalledTimes(1);
      expect(compactConversation).toHaveBeenCalledWith(currentMessages);
    });

    it('should update messages and metadata after compaction', async () => {
      const manager = new SessionManager(tempDir);
      manager.createSession();
      manager.addMessage('user', 'Hello');
      manager.addMessage('assistant', 'Hi');

      const compactedMessages = [
        { role: 'system' as const, content: 'Summary of conversation', timestamp: Date.now() },
      ];

      vi.mocked(estimateMessagesTokens).mockReturnValueOnce(200).mockReturnValueOnce(50);
      vi.mocked(compactConversation).mockResolvedValueOnce({
        messages: compactedMessages,
        result: {
          originalMessages: 2,
          compactedMessages: 1,
          estimatedTokensSaved: 150,
          summary: 'Summary of conversation',
        },
      });

      await manager.compact();

      const session = manager.getCurrentSession()!;
      expect(session.messages).toEqual(compactedMessages);
      expect(session.metadata.messageCount).toBe(1);
    });

    it('should return { saved, before, after } token stats', async () => {
      const manager = new SessionManager(tempDir);
      manager.createSession();
      manager.addMessage('user', 'Hello');

      vi.mocked(estimateMessagesTokens).mockReturnValueOnce(200).mockReturnValueOnce(80);
      vi.mocked(compactConversation).mockResolvedValueOnce({
        messages: [{ role: 'system', content: 'Summary', timestamp: Date.now() }],
        result: {
          originalMessages: 1,
          compactedMessages: 1,
          estimatedTokensSaved: 120,
          summary: 'Summary',
        },
      });

      const result = await manager.compact();

      expect(result).toEqual({ saved: 120, before: 200, after: 80 });
    });
  });

  // ========== 11. getContextUsage ==========
  describe('getContextUsage', () => {
    it('should return null when no active session', () => {
      const manager = new SessionManager(tempDir);

      expect(manager.getContextUsage()).toBeNull();
    });

    it('should return { tokens, maxTokens, percent } based on current messages', () => {
      const manager = new SessionManager({ sessionsDir: tempDir, maxContextTokens: 1000 });
      manager.createSession();
      manager.addMessage('user', 'Hello');

      vi.mocked(estimateMessagesTokens).mockReturnValue(500);

      const usage = manager.getContextUsage();

      expect(usage).toEqual({ tokens: 500, maxTokens: 1000, percent: 50 });
    });

    it('should use maxContextTokens from constructor options', () => {
      const manager = new SessionManager({ sessionsDir: tempDir, maxContextTokens: 50_000 });
      manager.createSession();
      manager.addMessage('user', 'Test');

      vi.mocked(estimateMessagesTokens).mockReturnValue(25_000);

      const usage = manager.getContextUsage();

      expect(usage).not.toBeNull();
      expect(usage!.maxTokens).toBe(50_000);
      expect(usage!.percent).toBe(50);
    });
  });

  // ========== 12. getSessionStats ==========
  describe('getSessionStats', () => {
    it('should return null when no active session', () => {
      const manager = new SessionManager(tempDir);

      expect(manager.getSessionStats()).toBeNull();
    });

    it('should return correct messageCount, totalTokens, avgTokensPerMessage, duration', () => {
      const manager = new SessionManager(tempDir);
      manager.createSession();

      manager.addMessage('user', 'Hello', { input: 10, output: 0 });
      manager.addMessage('assistant', 'Hi', { input: 0, output: 20 });
      manager.addMessage('user', 'How are you?', { input: 15, output: 0 });

      const stats = manager.getSessionStats();

      expect(stats).not.toBeNull();
      expect(stats!.messageCount).toBe(3);
      expect(stats!.totalTokens).toBe(45);
      expect(stats!.avgTokensPerMessage).toBe(Math.round(45 / 3));
      expect(stats!.duration).toBeGreaterThanOrEqual(0);
    });

    it('should return 0 avgTokensPerMessage when no messages', () => {
      const manager = new SessionManager(tempDir);
      manager.createSession();

      const stats = manager.getSessionStats();

      expect(stats).not.toBeNull();
      expect(stats!.messageCount).toBe(0);
      expect(stats!.avgTokensPerMessage).toBe(0);
    });
  });

  // ========== 13. Auto-compact behavior ==========
  describe('auto-compact behavior', () => {
    it('should call compact() after addMessage when shouldCompact returns true', () => {
      const manager = new SessionManager({ sessionsDir: tempDir, autoCompact: true });
      manager.createSession();

      vi.mocked(shouldCompact).mockReturnValue(true);
      vi.mocked(estimateMessagesTokens).mockReturnValue(100);
      vi.mocked(compactConversation).mockResolvedValue({
        messages: [],
        result: {
          originalMessages: 0,
          compactedMessages: 0,
          estimatedTokensSaved: 0,
          summary: '',
        },
      });

      manager.addMessage('user', 'Trigger compact');

      expect(shouldCompact).toHaveBeenCalled();
      expect(compactConversation).toHaveBeenCalled();
    });

    it('should never call compact when autoCompact is false', () => {
      const manager = new SessionManager({ sessionsDir: tempDir, autoCompact: false });
      manager.createSession();

      vi.mocked(shouldCompact).mockReturnValue(true);

      manager.addMessage('user', 'No compact');

      expect(shouldCompact).not.toHaveBeenCalled();
      expect(compactConversation).not.toHaveBeenCalled();
    });
  });

  // ========== 14. exportToMarkdown ==========
  describe('exportToMarkdown', () => {
    it('should format active session as markdown with title, metadata, messages', () => {
      const manager = new SessionManager(tempDir);
      const session = manager.createSession('gpt-4');
      manager.addMessage('user', 'Hello world');
      manager.addMessage('assistant', 'Hi there', { input: 5, output: 10 });

      const md = manager.exportToMarkdown();

      // Title
      expect(md).toContain('# Hello world');

      // Metadata
      expect(md).toContain(`**Session ID:** ${session.metadata.id}`);
      expect(md).toContain('**Created:**');
      expect(md).toContain('**Model:** gpt-4');
      expect(md).toContain('**Total Tokens:**');

      // Messages
      expect(md).toContain('## USER');
      expect(md).toContain('Hello world');
      expect(md).toContain('## ASSISTANT');
      expect(md).toContain('Hi there');

      // Token info for assistant message
      expect(md).toContain('*Tokens: 5 in / 10 out*');
    });

    it('should return "# No session found" when no session', () => {
      const manager = new SessionManager(tempDir);

      const md = manager.exportToMarkdown();

      expect(md).toBe('# No session found\n');
    });

    it('should load session by ID when sessionId is provided', () => {
      const manager = new SessionManager(tempDir);
      const s1 = manager.createSession();
      manager.addMessage('user', 'First session');
      const s1Id = s1.metadata.id;

      manager.createSession();
      manager.addMessage('user', 'Second session');

      // Export s1 by ID (not the active session)
      const md = manager.exportToMarkdown(s1Id);

      expect(md).toContain('First session');
      expect(md).not.toContain('Second session');
    });

    it('should use "Conversation" as default title when no title is set', () => {
      const manager = new SessionManager(tempDir);
      manager.createSession();
      // Add a system message that won't set a title
      manager.addMessage('system', 'You are a bot');

      const md = manager.exportToMarkdown();

      expect(md).toContain('# Conversation');
    });
  });
});
