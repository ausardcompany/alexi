/**
 * Abort-propagation tests for `SessionManager`.
 *
 * Issue #1624: parent `AbortSignal` must propagate to delegated child
 * sessions so cancelling a parent task immediately stops every
 * descendant subagent (and every level of nesting beneath them).
 * Regressions here manifest as runaway subagents continuing to consume
 * API quota after the user Ctrl+C's the parent.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

// Mock the compaction module so `addMessage`'s auto-compact path stays
// deterministic across the abort assertions below. We are not
// exercising compaction here.
vi.mock('../../src/core/compaction.js', () => ({
  shouldCompact: vi.fn().mockReturnValue(false),
  compactConversation: vi.fn().mockResolvedValue({
    messages: [],
    result: { originalMessages: 0, compactedMessages: 0, estimatedTokensSaved: 0, summary: '' },
  }),
  estimateMessagesTokens: vi.fn().mockReturnValue(0),
}));

vi.mock('../../src/core/sessionClose.js', () => ({
  closeSession: vi.fn().mockReturnValue(0),
}));

import { SessionManager } from '../../src/core/sessionManager.js';

let tempDir: string;

beforeEach(() => {
  vi.clearAllMocks();
  tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'session-abort-'));
});

afterEach(() => {
  fs.rmSync(tempDir, { recursive: true, force: true });
});

describe('SessionManager abort propagation', () => {
  describe('beginSessionRun / getSessionSignal', () => {
    it('returns a fresh, un-aborted signal when no parent is provided', () => {
      const manager = new SessionManager(tempDir);
      const session = manager.createSession();

      const signal = manager.beginSessionRun(session.metadata.id);
      expect(signal.aborted).toBe(false);
      expect(manager.hasActiveRun(session.metadata.id)).toBe(true);
      expect(manager.getSessionSignal(session.metadata.id)).toBe(signal);
    });

    it('immediately returns an aborted signal when the parent is already aborted', () => {
      const manager = new SessionManager(tempDir);
      const session = manager.createSession();

      const parentController = new AbortController();
      parentController.abort(new Error('parent gone'));

      const signal = manager.beginSessionRun(session.metadata.id, parentController.signal);
      expect(signal.aborted).toBe(true);
    });

    it('propagates a later parent abort to the child signal', () => {
      const manager = new SessionManager(tempDir);
      const session = manager.createSession();

      const parentController = new AbortController();
      const signal = manager.beginSessionRun(session.metadata.id, parentController.signal);

      expect(signal.aborted).toBe(false);
      parentController.abort();
      expect(signal.aborted).toBe(true);
    });

    it('is idempotent: re-registering the same session tears down the previous listener', () => {
      const manager = new SessionManager(tempDir);
      const session = manager.createSession();

      const parentA = new AbortController();
      const firstSignal = manager.beginSessionRun(session.metadata.id, parentA.signal);

      // Second call replaces the first bookkeeping entry entirely.
      const parentB = new AbortController();
      const secondSignal = manager.beginSessionRun(session.metadata.id, parentB.signal);

      expect(secondSignal).not.toBe(firstSignal);

      // Aborting the ORIGINAL parent must NOT reach the new signal —
      // otherwise long-running sessions that re-run under a fresh
      // parent would still be cancelable by stale parents.
      parentA.abort();
      expect(secondSignal.aborted).toBe(false);

      parentB.abort();
      expect(secondSignal.aborted).toBe(true);
    });
  });

  describe('endSessionRun', () => {
    it('detaches the parent-signal listener so parent abort no longer fires', () => {
      const manager = new SessionManager(tempDir);
      const session = manager.createSession();

      const parent = new AbortController();
      const signal = manager.beginSessionRun(session.metadata.id, parent.signal);

      manager.endSessionRun(session.metadata.id);
      expect(manager.hasActiveRun(session.metadata.id)).toBe(false);

      // After end, the parent abort must NOT propagate. This is the
      // memory-leak guard: without listener cleanup, every completed
      // subagent would leave a dead reference on the parent's signal.
      parent.abort();
      expect(signal.aborted).toBe(false);
    });

    it('does NOT abort the run controller on normal end (completion != cancellation)', () => {
      const manager = new SessionManager(tempDir);
      const session = manager.createSession();

      const signal = manager.beginSessionRun(session.metadata.id);
      manager.endSessionRun(session.metadata.id);

      expect(signal.aborted).toBe(false);
    });

    it('is a no-op for unknown session ids', () => {
      const manager = new SessionManager(tempDir);
      expect(() => manager.endSessionRun('nonexistent')).not.toThrow();
    });
  });

  describe('abortSession', () => {
    it('aborts the run of the target session', () => {
      const manager = new SessionManager(tempDir);
      const session = manager.createSession();
      const signal = manager.beginSessionRun(session.metadata.id);

      manager.abortSession(session.metadata.id);
      expect(signal.aborted).toBe(true);
    });

    it('walks children and aborts every descendant run (multi-level nesting)', () => {
      const manager = new SessionManager(tempDir);
      const root = manager.createSession();
      const child = manager.createSession(undefined, root.metadata.id);
      const grandchild = manager.createSession(undefined, child.metadata.id);
      const greatgrand = manager.createSession(undefined, grandchild.metadata.id);

      const rootSig = manager.beginSessionRun(root.metadata.id);
      const childSig = manager.beginSessionRun(child.metadata.id);
      const grandSig = manager.beginSessionRun(grandchild.metadata.id);
      const greatSig = manager.beginSessionRun(greatgrand.metadata.id);

      manager.abortSession(root.metadata.id);

      expect(rootSig.aborted).toBe(true);
      expect(childSig.aborted).toBe(true);
      expect(grandSig.aborted).toBe(true);
      expect(greatSig.aborted).toBe(true);
    });

    it('silently skips descendants that have no active run', () => {
      const manager = new SessionManager(tempDir);
      const root = manager.createSession();
      const child = manager.createSession(undefined, root.metadata.id);

      // Only the child has a run. Aborting root should still succeed
      // for descendants that were never started — there is simply
      // nothing to signal for those.
      const childSig = manager.beginSessionRun(child.metadata.id);
      expect(() => manager.abortSession(root.metadata.id)).not.toThrow();
      expect(childSig.aborted).toBe(true);
    });

    it('is cycle-safe against corrupted parent links', () => {
      const manager = new SessionManager(tempDir);
      const a = manager.createSession();
      const b = manager.createSession(undefined, a.metadata.id);

      // Corrupt on-disk: make A's parent be B, creating an A <-> B cycle.
      const aPath = path.join(tempDir, `${a.metadata.id}.json`);
      const aRaw = JSON.parse(fs.readFileSync(aPath, 'utf-8'));
      aRaw.metadata.parentSessionId = b.metadata.id;
      fs.writeFileSync(aPath, JSON.stringify(aRaw), 'utf-8');

      const aSig = manager.beginSessionRun(a.metadata.id);
      const bSig = manager.beginSessionRun(b.metadata.id);

      expect(() => manager.abortSession(a.metadata.id)).not.toThrow();
      expect(aSig.aborted).toBe(true);
      expect(bSig.aborted).toBe(true);
    });
  });

  describe('createSession with signal option', () => {
    it('registers a run and wires the parent signal', () => {
      const manager = new SessionManager(tempDir);
      const parent = new AbortController();

      const child = manager.createSession(undefined, undefined, { signal: parent.signal });
      expect(manager.hasActiveRun(child.metadata.id)).toBe(true);

      const signal = manager.getSessionSignal(child.metadata.id);
      expect(signal).toBeDefined();
      expect(signal!.aborted).toBe(false);

      parent.abort();
      expect(signal!.aborted).toBe(true);
    });

    it('does NOT register a run when no signal is provided (back-compat)', () => {
      const manager = new SessionManager(tempDir);
      const s = manager.createSession();
      expect(manager.hasActiveRun(s.metadata.id)).toBe(false);
    });

    it('honours a parent signal that was already aborted at creation time', () => {
      const manager = new SessionManager(tempDir);
      const parent = new AbortController();
      parent.abort();

      const child = manager.createSession(undefined, undefined, { signal: parent.signal });
      const signal = manager.getSessionSignal(child.metadata.id);
      expect(signal!.aborted).toBe(true);
    });
  });

  describe('releaseSession', () => {
    it('ends the run and deletes the persisted session file', () => {
      const manager = new SessionManager(tempDir);
      const parent = new AbortController();
      const child = manager.createSession(undefined, undefined, { signal: parent.signal });

      const sessionFile = path.join(tempDir, `${child.metadata.id}.json`);
      expect(fs.existsSync(sessionFile)).toBe(true);
      expect(manager.hasActiveRun(child.metadata.id)).toBe(true);

      const deleted = manager.releaseSession(child.metadata.id);
      expect(deleted).toBe(true);
      expect(fs.existsSync(sessionFile)).toBe(false);
      expect(manager.hasActiveRun(child.metadata.id)).toBe(false);

      // Post-release, the parent signal must NOT reach the released
      // child's controller — this is the leak guard.
      parent.abort();
      // No throw, no side-effect. Nothing to assert other than the
      // absence of side-effects; the run is gone.
      expect(manager.hasActiveRun(child.metadata.id)).toBe(false);
    });
  });

  describe('getSessionChildren', () => {
    it('returns direct children only (not grandchildren)', () => {
      const manager = new SessionManager(tempDir);
      const root = manager.createSession();
      const child1 = manager.createSession(undefined, root.metadata.id);
      const child2 = manager.createSession(undefined, root.metadata.id);
      const grand = manager.createSession(undefined, child1.metadata.id);

      const children = manager.getSessionChildren(root.metadata.id).sort();
      expect(children).toEqual([child1.metadata.id, child2.metadata.id].sort());
      expect(children).not.toContain(grand.metadata.id);
    });

    it('returns an empty array for a session with no children', () => {
      const manager = new SessionManager(tempDir);
      const root = manager.createSession();
      expect(manager.getSessionChildren(root.metadata.id)).toEqual([]);
    });
  });
});
