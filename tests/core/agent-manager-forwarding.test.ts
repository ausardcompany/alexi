/**
 * Tests for `src/core/agent-manager/orchestration-api.ts`.
 *
 * Ports the intent of upstream kilocode PR #14487
 * (`fix(agent-manager): forward all owned session activity events`).
 * The classifier must:
 *
 *   1. Forward activity events (status / deleted / wakeup / turn-close /
 *      error / asked / replied) for EVERY owned session, regardless of
 *      whether that session runs in the currently-selected worktree.
 *   2. Filter transcript events by the currently-selected worktree —
 *      those are too expensive to sync for background sessions.
 *   3. Keep the owner entry when a session goes `offline`. Offline is
 *      not end-of-turn; only an explicit `deleted` event drops
 *      ownership.
 *   4. Refuse to forward activity events for sessions we do not own.
 */
import { describe, it, expect } from 'vitest';
import {
  ActivityEventForwarder,
  isActivityEventKind,
  isEndOfLife,
  orchestrateAgentManagerSessions,
  type ActivityEvent,
  type TranscriptEvent,
} from '../../src/core/agent-manager/orchestration-api.js';

describe('ActivityEventForwarder', () => {
  it('forwards activity events for a BACKGROUND owned session (PR #14487 fix)', () => {
    const fwd = new ActivityEventForwarder();
    fwd.addOwnedSession('sess-bg');
    fwd.setSelectedWorktree('/tmp/selected-worktree');

    const event: ActivityEvent = {
      kind: 'status',
      sessionId: 'sess-bg',
      worktreeDir: '/tmp/other-worktree',
      status: 'completed',
    };

    const decision = fwd.handleActivity(event);
    expect(decision.forward).toBe(true);
    expect(decision.reason).toBe('activity-owned');
  });

  it('forwards activity events for a SELECTED owned session (regression)', () => {
    const fwd = new ActivityEventForwarder();
    fwd.addOwnedSession('sess-fg');
    fwd.setSelectedWorktree('/tmp/selected-worktree');

    const event: ActivityEvent = {
      kind: 'status',
      sessionId: 'sess-fg',
      worktreeDir: '/tmp/selected-worktree',
      status: 'idle',
    };

    expect(fwd.handleActivity(event).forward).toBe(true);
  });

  it('drops activity events for sessions we do not own', () => {
    const fwd = new ActivityEventForwarder();
    fwd.addOwnedSession('sess-mine');

    const event: ActivityEvent = {
      kind: 'status',
      sessionId: 'sess-other',
      status: 'completed',
    };

    const decision = fwd.handleActivity(event);
    expect(decision.forward).toBe(false);
    expect(decision.reason).toBe('activity-not-owned');
  });

  it.each(['status', 'deleted', 'wakeup', 'turn-close', 'error', 'asked', 'replied'] as const)(
    'forwards activity event kind %s for background owned sessions',
    (kind) => {
      const fwd = new ActivityEventForwarder();
      fwd.addOwnedSession('sess-bg');
      fwd.setSelectedWorktree('/tmp/selected');

      const event: ActivityEvent = {
        kind,
        sessionId: 'sess-bg',
        worktreeDir: '/tmp/background',
      };

      expect(fwd.handleActivity(event).forward).toBe(true);
    }
  );

  it('keeps owner entry when status goes offline (offline is not end-of-turn)', () => {
    const fwd = new ActivityEventForwarder();
    fwd.addOwnedSession('sess-bg');

    const decision = fwd.handleActivity({
      kind: 'status',
      sessionId: 'sess-bg',
      status: 'offline',
    });

    expect(decision.forward).toBe(true);
    // Owner entry preserved so a reconnect resumes forwarding.
    expect(fwd.isOwned('sess-bg')).toBe(true);
  });

  it.each(['idle', 'completed', 'failed', 'waiting', 'scheduled'] as const)(
    'keeps owner entry when status transitions to %s',
    (status) => {
      const fwd = new ActivityEventForwarder();
      fwd.addOwnedSession('sess');
      fwd.handleActivity({ kind: 'status', sessionId: 'sess', status });
      expect(fwd.isOwned('sess')).toBe(true);
    }
  );

  it('drops owner entry on explicit deleted event', () => {
    const fwd = new ActivityEventForwarder();
    fwd.addOwnedSession('sess');

    const decision = fwd.handleActivity({ kind: 'deleted', sessionId: 'sess' });

    expect(decision.forward).toBe(true);
    expect(fwd.isOwned('sess')).toBe(false);
  });

  it('does not drop owner entry for a deleted event on a non-owned session', () => {
    const fwd = new ActivityEventForwarder();
    fwd.addOwnedSession('sess-mine');

    const decision = fwd.handleActivity({ kind: 'deleted', sessionId: 'sess-other' });

    expect(decision.forward).toBe(false);
    // Owner entry for our own session must not be perturbed.
    expect(fwd.isOwned('sess-mine')).toBe(true);
  });

  describe('transcript events', () => {
    it('forwards transcripts for the selected worktree', () => {
      const fwd = new ActivityEventForwarder();
      fwd.addOwnedSession('sess-fg');
      fwd.setSelectedWorktree('/tmp/selected');

      const event: TranscriptEvent = {
        sessionId: 'sess-fg',
        worktreeDir: '/tmp/selected',
        payload: { chunk: 'hello' },
      };

      const decision = fwd.decideTranscript(event);
      expect(decision.forward).toBe(true);
      expect(decision.reason).toBe('transcript-selected');
    });

    it('drops transcripts for background sessions', () => {
      const fwd = new ActivityEventForwarder();
      fwd.addOwnedSession('sess-bg');
      fwd.setSelectedWorktree('/tmp/selected');

      const event: TranscriptEvent = {
        sessionId: 'sess-bg',
        worktreeDir: '/tmp/other',
        payload: { chunk: 'expensive' },
      };

      const decision = fwd.decideTranscript(event);
      expect(decision.forward).toBe(false);
      expect(decision.reason).toBe('transcript-background');
    });

    it('drops transcripts for non-owned sessions even in selected worktree', () => {
      const fwd = new ActivityEventForwarder();
      fwd.setSelectedWorktree('/tmp/selected');

      const event: TranscriptEvent = {
        sessionId: 'sess-not-owned',
        worktreeDir: '/tmp/selected',
        payload: {},
      };

      const decision = fwd.decideTranscript(event);
      expect(decision.forward).toBe(false);
      expect(decision.reason).toBe('activity-not-owned');
    });

    it('drops transcripts when no worktree is selected', () => {
      const fwd = new ActivityEventForwarder();
      fwd.addOwnedSession('sess');

      const event: TranscriptEvent = {
        sessionId: 'sess',
        worktreeDir: '/tmp/any',
        payload: {},
      };

      expect(fwd.decideTranscript(event).forward).toBe(false);
    });
  });

  describe('utility helpers', () => {
    it('classifies known activity event kinds via isActivityEventKind', () => {
      expect(isActivityEventKind('status')).toBe(true);
      expect(isActivityEventKind('deleted')).toBe(true);
      expect(isActivityEventKind('wakeup')).toBe(true);
      expect(isActivityEventKind('turn-close')).toBe(true);
      expect(isActivityEventKind('error')).toBe(true);
      expect(isActivityEventKind('asked')).toBe(true);
      expect(isActivityEventKind('replied')).toBe(true);
    });

    it('rejects unknown event kinds', () => {
      expect(isActivityEventKind('transcript')).toBe(false);
      expect(isActivityEventKind('')).toBe(false);
      expect(isActivityEventKind('STATUS')).toBe(false);
    });

    it('flags only deleted events as end-of-life', () => {
      expect(isEndOfLife({ kind: 'deleted', sessionId: 's' })).toBe(true);
      expect(isEndOfLife({ kind: 'status', sessionId: 's', status: 'offline' })).toBe(false);
      expect(isEndOfLife({ kind: 'status', sessionId: 's', status: 'completed' })).toBe(false);
      expect(isEndOfLife({ kind: 'turn-close', sessionId: 's' })).toBe(false);
    });

    it('orchestrateAgentManagerSessions returns a usable forwarder (back-compat)', () => {
      const fwd = orchestrateAgentManagerSessions();
      fwd.addOwnedSession('sess');
      expect(fwd.isOwned('sess')).toBe(true);
    });

    it('setSelectedWorktree(undefined) clears the selection', () => {
      const fwd = new ActivityEventForwarder();
      fwd.setSelectedWorktree('/tmp/x');
      fwd.setSelectedWorktree(undefined);
      expect(fwd.getSelectedWorktree()).toBeUndefined();
    });

    it('removeOwnedSession removes an owner entry', () => {
      const fwd = new ActivityEventForwarder();
      fwd.addOwnedSession('sess');
      fwd.removeOwnedSession('sess');
      expect(fwd.isOwned('sess')).toBe(false);
    });
  });
});
