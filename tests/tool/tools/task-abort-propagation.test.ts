/**
 * Task tool abort-propagation tests.
 *
 * Issue #1624: When the parent session is aborted, the delegated child
 * session created by `task` must have its run aborted too. The tool's
 * `finally` block must release the child session (detaching the
 * parent-signal listener) whether the delegation succeeded, failed, or
 * was cancelled.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import type { ToolContext } from '../../../src/tool/index.js';

// Mock the agent registry the same way the depth-limit test does so the
// `code` and `explore` agent lookups succeed with `mode !== 'primary'`
// (validate() passes) and we exercise the abort path without needing a
// real agent registry.
vi.mock('../../../src/agent/index.js', () => {
  const codeAgent = {
    id: 'code',
    name: 'Code Agent',
    description: 'Test stub',
    mode: 'all' as const,
    systemPrompt: 'stub',
    canUseTool: () => true,
  };
  const exploreAgent = {
    id: 'explore',
    name: 'Explore Agent',
    description: 'Test stub',
    mode: 'subagent' as const,
    systemPrompt: 'stub',
    canUseTool: () => true,
  };
  const registry = {
    get(idOrAlias: string) {
      if (idOrAlias === 'code') {
        return codeAgent;
      }
      if (idOrAlias === 'explore') {
        return exploreAgent;
      }
      return undefined;
    },
  };
  return { getAgentRegistry: () => registry };
});

// Mock compaction so SessionManager.addMessage stays deterministic.
vi.mock('../../../src/core/compaction.js', () => ({
  shouldCompact: vi.fn().mockReturnValue(false),
  compactConversation: vi.fn().mockResolvedValue({
    messages: [],
    result: { originalMessages: 0, compactedMessages: 0, estimatedTokensSaved: 0, summary: '' },
  }),
  estimateMessagesTokens: vi.fn().mockReturnValue(0),
}));

vi.mock('../../../src/core/sessionClose.js', () => ({
  closeSession: vi.fn().mockReturnValue(0),
}));

import { taskTool, getTaskStore } from '../../../src/tool/tools/task.js';
import { SessionManager } from '../../../src/core/sessionManager.js';

let tempDir: string;

beforeEach(() => {
  tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'task-abort-'));
  delete process.env.MAX_SUBAGENT_DEPTH;
});

afterEach(() => {
  getTaskStore().clear();
  fs.rmSync(tempDir, { recursive: true, force: true });
  delete process.env.MAX_SUBAGENT_DEPTH;
});

function makeContext(overrides: Partial<ToolContext> = {}): ToolContext {
  return {
    workdir: tempDir,
    sessionId: 'parent-session',
    ...overrides,
  };
}

describe('task tool abort propagation', () => {
  it('creates a child session with the parent signal wired', async () => {
    const sessionManager = new SessionManager(tempDir);
    const parentController = new AbortController();

    const ctx = makeContext({
      signal: parentController.signal,
      sessionManager,
    });

    const beforeChildren = sessionManager.listSessions().length;

    // Capture the child signal at creation time by patching
    // `createSession` — the child session id is not exposed on the
    // result object, so we snapshot the signal at the moment the tool
    // creates it. The patch is scoped to this test only.
    const realCreate = sessionManager.createSession.bind(sessionManager);
    let capturedChildSignal: AbortSignal | undefined;
    let capturedChildId: string | undefined;
    sessionManager.createSession = ((...args: Parameters<typeof realCreate>) => {
      const session = realCreate(...args);
      capturedChildId = session.metadata.id;
      capturedChildSignal = sessionManager.getSessionSignal(session.metadata.id);
      return session;
    }) as typeof sessionManager.createSession;

    const result = await taskTool.execute(
      {
        prompt: 'do something',
        description: 'test task',
        subagent_type: 'explore',
      },
      ctx
    );

    expect(result.success).toBe(true);
    expect(capturedChildId).toBeDefined();
    expect(capturedChildSignal).toBeDefined();
    // The signal was NOT aborted during the run since the parent wasn't
    // aborted; but after `releaseSession` in the finally block, the
    // run bookkeeping should be gone.
    expect(sessionManager.hasActiveRun(capturedChildId as string)).toBe(false);

    // The child session file must have been deleted by `releaseSession`
    // — the subagent transcript should not clutter the top-level
    // sessions listing.
    const afterChildren = sessionManager.listSessions().length;
    expect(afterChildren).toBe(beforeChildren);
  });

  it('refuses to spawn a subagent when the parent signal is already aborted', async () => {
    const sessionManager = new SessionManager(tempDir);
    const parentController = new AbortController();
    parentController.abort();

    const ctx = makeContext({
      signal: parentController.signal,
      sessionManager,
    });

    // The `defineTool` harness short-circuits with 'Operation aborted'
    // BEFORE the tool's `execute` even runs when the parent signal is
    // already aborted. Either path (harness or in-tool guard) is
    // acceptable — what matters is (a) success === false, (b) no
    // orphan child session left on disk.
    const result = await taskTool.execute(
      {
        prompt: 'do something',
        description: 'test task',
        subagent_type: 'explore',
      },
      ctx
    );

    expect(result.success).toBe(false);
    expect(result.error).toBe('Operation aborted');
    expect(sessionManager.listSessions()).toHaveLength(0);
  });

  it('aborts the child session run when parent aborts mid-run', () => {
    // We exercise the mechanism directly on SessionManager here because
    // the current task-tool stub returns synchronously; the mid-run
    // abort path is what the future LLM integration will hit.
    const sessionManager = new SessionManager(tempDir);
    const parentController = new AbortController();

    const child = sessionManager.createSession(undefined, 'parent-session', {
      signal: parentController.signal,
    });
    const childSignal = sessionManager.getSessionSignal(child.metadata.id);
    expect(childSignal!.aborted).toBe(false);

    parentController.abort();
    expect(childSignal!.aborted).toBe(true);
  });

  it('detaches the parent-signal listener after the task completes', async () => {
    const sessionManager = new SessionManager(tempDir);
    const parentController = new AbortController();

    const ctx = makeContext({
      signal: parentController.signal,
      sessionManager,
    });

    await taskTool.execute(
      {
        prompt: 'do something',
        description: 'test task',
        subagent_type: 'explore',
      },
      ctx
    );

    // After the task returned, no runs must remain against the parent
    // signal. Aborting the parent now is a no-op with respect to the
    // manager — the previous child is already released.
    expect(() => parentController.abort()).not.toThrow();
    expect(sessionManager.listSessions()).toHaveLength(0);
  });

  it('falls back to stub behaviour when no session manager is present', async () => {
    // Absence of `sessionManager` on the context is expected for unit
    // tests and older CLI paths — the tool must not crash and must
    // still return a successful placeholder.
    const parentController = new AbortController();
    const ctx = makeContext({
      signal: parentController.signal,
      // No sessionManager set.
    });

    const result = await taskTool.execute(
      {
        prompt: 'do something',
        description: 'test task',
        subagent_type: 'explore',
      },
      ctx
    );

    expect(result.success).toBe(true);
    expect(result.data?.status).toBe('completed');
  });
});
