/**
 * Tests for the `/fork` slash command.
 *
 * Issue #994: `/fork` must copy the message transcript (and derived metadata)
 * from the current session into the new one, so users can explore alternate
 * conversation branches from the current point rather than getting an empty
 * session.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs';

import { handleCommand, type ReplState } from '../../src/cli/interactive.js';
import { SessionManager } from '../../src/core/sessionManager.js';

function buildReplState(sessionsDir: string): ReplState {
  const sessionManager = new SessionManager({ sessionsDir });
  sessionManager.createSession('test-model');
  return {
    sessionManager,
    currentModel: 'test-model',
    autoRoute: false,
    preferCheap: false,
    isStreaming: false,
  };
}

describe('/fork copies session transcript', () => {
  let tmpDir: string;
  let logSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'alexi-fork-test-'));
    logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    logSpy.mockRestore();
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('duplicates messages and token metadata into a fresh session', async () => {
    const state = buildReplState(tmpDir);
    const original = state.sessionManager.getCurrentSession();
    if (!original) {
      throw new Error('expected a starting session');
    }
    original.messages.push({
      role: 'user',
      content: 'hello alexi',
      timestamp: Date.now(),
      tokens: { input: 10, output: 0 },
    });
    original.messages.push({
      role: 'assistant',
      content: 'hello back',
      timestamp: Date.now(),
      tokens: { input: 0, output: 20 },
    });
    original.metadata.messageCount = 2;
    original.metadata.totalTokens = 30;
    const originalId = original.metadata.id;
    const originalWorkdir = original.metadata.workdir;

    const handled = await handleCommand('/fork test-fork', state);
    expect(handled).toBe(true);

    const forked = state.sessionManager.getCurrentSession();
    if (!forked) {
      throw new Error('expected a forked session');
    }
    expect(forked.metadata.id).not.toBe(originalId);
    expect(forked.metadata.title).toBe('test-fork');
    expect(forked.messages).toHaveLength(2);
    expect(forked.messages[0].content).toBe('hello alexi');
    expect(forked.messages[1].content).toBe('hello back');
    expect(forked.metadata.messageCount).toBe(2);
    expect(forked.metadata.totalTokens).toBe(30);
    expect(forked.metadata.workdir).toBe(originalWorkdir);
  });

  it('deep-copies messages so mutating the fork does not affect the source', async () => {
    const state = buildReplState(tmpDir);
    const original = state.sessionManager.getCurrentSession();
    if (!original) {
      throw new Error('expected a starting session');
    }
    // Use addMessage so the source session is persisted to disk with the
    // message and we can reload it after the fork.
    state.sessionManager.addMessage('user', 'immutable', { input: 5, output: 0 });
    const originalId = original.metadata.id;

    await handleCommand('/fork branch-a', state);
    const forked = state.sessionManager.getCurrentSession();
    if (!forked) {
      throw new Error('expected a forked session');
    }

    // Mutate the fork's copied message and its token record.
    forked.messages[0].content = 'mutated';
    if (forked.messages[0].tokens) {
      forked.messages[0].tokens.input = 999;
    }

    // Reload the original from disk to confirm it was not affected.
    const reloaded = state.sessionManager.loadSession(originalId);
    expect(reloaded?.messages[0].content).toBe('immutable');
    expect(reloaded?.messages[0].tokens?.input).toBe(5);
  });

  it('generates a fallback fork name when no argument is provided', async () => {
    const state = buildReplState(tmpDir);
    const original = state.sessionManager.getCurrentSession();
    if (!original) {
      throw new Error('expected a starting session');
    }

    const handled = await handleCommand('/fork', state);
    expect(handled).toBe(true);

    const forked = state.sessionManager.getCurrentSession();
    expect(forked?.metadata.title).toMatch(/^fork-\d+$/);
  });

  it('switches the active session to the fork (issue #993)', async () => {
    const state = buildReplState(tmpDir);
    const original = state.sessionManager.getCurrentSession();
    if (!original) {
      throw new Error('expected a starting session');
    }
    original.messages.push({
      role: 'user',
      content: 'original message',
      timestamp: Date.now(),
    });
    const originalId = original.metadata.id;

    await handleCommand('/fork test-fork', state);

    const active = state.sessionManager.getCurrentSession();
    expect(active).not.toBeNull();
    expect(active?.metadata.id).not.toBe(originalId);
    expect(active?.metadata.title).toBe('test-fork');
  });

  it('logs "now active" in the confirmation message', async () => {
    const state = buildReplState(tmpDir);
    const original = state.sessionManager.getCurrentSession();
    if (!original) {
      throw new Error('expected a starting session');
    }

    await handleCommand('/fork switched', state);

    const logged = logSpy.mock.calls.map((call) => String(call[0])).join('\n');
    expect(logged).toContain('now active');
    expect(logged).toContain('switched');
  });

  it('does not fork when there is no active session', async () => {
    const sessionManager = new SessionManager({ sessionsDir: tmpDir });
    const state: ReplState = {
      sessionManager,
      currentModel: 'test-model',
      autoRoute: false,
      preferCheap: false,
      isStreaming: false,
    };

    const handled = await handleCommand('/fork orphan', state);
    expect(handled).toBe(true);
    expect(sessionManager.getCurrentSession()).toBeNull();
  });
});
