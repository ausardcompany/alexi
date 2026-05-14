import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs/promises';
import * as path from 'path';
import os from 'os';
import { SessionManager } from '../../src/core/sessionManager.js';

describe('SessionManager', () => {
  let tempDir: string;
  let manager: SessionManager;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'session-manager-test-'));
    manager = new SessionManager({ sessionsDir: tempDir });
  });

  afterEach(async () => {
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  describe('workspace filtering', () => {
    describe('createSession with workdir', () => {
      it('should store workdir in session metadata', () => {
        const workdir = '/home/user/project-a';
        const session = manager.createSession('gpt-4o', workdir);

        expect(session.metadata.workdir).toBe(workdir);
      });

      it('should store workdir as undefined when not provided', () => {
        const session = manager.createSession('gpt-4o');

        expect(session.metadata.workdir).toBeUndefined();
      });

      it('should persist workdir to disk', async () => {
        const workdir = '/home/user/project-b';
        const session = manager.createSession('gpt-4o', workdir);

        const sessionPath = path.join(tempDir, `${session.metadata.id}.json`);
        const content = await fs.readFile(sessionPath, 'utf-8');
        const saved = JSON.parse(content);

        expect(saved.metadata.workdir).toBe(workdir);
      });
    });

    describe('listSessions with filter', () => {
      it('should return all sessions when no filter is provided', () => {
        manager.createSession('gpt-4o', '/workspace/a');
        manager.createSession('gpt-4o', '/workspace/b');
        manager.createSession('gpt-4o', '/workspace/c');

        const sessions = manager.listSessions();

        expect(sessions).toHaveLength(3);
      });

      it('should filter sessions by workdir', () => {
        manager.createSession('gpt-4o', '/workspace/a');
        manager.createSession('gpt-4o', '/workspace/b');
        manager.createSession('gpt-4o', '/workspace/a');

        const sessions = manager.listSessions({ workdir: '/workspace/a' });

        expect(sessions).toHaveLength(2);
        expect(sessions.every((s) => s.workdir === '/workspace/a')).toBe(true);
      });

      it('should return empty array when no sessions match the filter', () => {
        manager.createSession('gpt-4o', '/workspace/a');
        manager.createSession('gpt-4o', '/workspace/b');

        const sessions = manager.listSessions({ workdir: '/workspace/nonexistent' });

        expect(sessions).toHaveLength(0);
      });

      it('should not match sessions without a workdir when filtering', () => {
        manager.createSession('gpt-4o');
        manager.createSession('gpt-4o', '/workspace/a');

        const sessions = manager.listSessions({ workdir: '/workspace/a' });

        expect(sessions).toHaveLength(1);
        expect(sessions[0].workdir).toBe('/workspace/a');
      });

      it('should return sessions sorted by updated time (newest first)', () => {
        const session1 = manager.createSession('gpt-4o', '/workspace/a');
        const session2 = manager.createSession('gpt-4o', '/workspace/a');

        const sessions = manager.listSessions({ workdir: '/workspace/a' });

        // session2 was created later so should be first
        expect(sessions[0].id).toBe(session2.metadata.id);
        expect(sessions[1].id).toBe(session1.metadata.id);
      });
    });

    describe('listSessions without filter (--all behavior)', () => {
      it('should return sessions from all workspaces when filter is undefined', () => {
        manager.createSession('gpt-4o', '/workspace/a');
        manager.createSession('gpt-4o', '/workspace/b');
        manager.createSession('gpt-4o');

        const sessions = manager.listSessions(undefined);

        expect(sessions).toHaveLength(3);
      });
    });
  });
});
