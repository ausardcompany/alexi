/**
 * Regression tests for SessionBusyTracker publish ordering.
 *
 * Ports upstream kilocode `packages/opencode/test/kilocode/session-status.test.ts`
 * (upstream commits `88d23150b` + `e31aa5769`): a failed publish of the
 * idle transition must NOT leave the session wedged in busy state, and a
 * failed publish of the busy transition must roll back so a retry succeeds.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getSessionBusyTracker,
  resetSessionBusyTracker,
  SessionBusyError,
  type SessionBusyPublisher,
  type SessionBusyStatusEvent,
} from '../sessionBusy.js';

describe('SessionBusyTracker publish ordering', () => {
  beforeEach(() => {
    resetSessionBusyTracker();
  });

  it('markFree clears state even when publisher throws (no stale busy wedge)', () => {
    const tracker = getSessionBusyTracker();
    tracker.setPublisher(() => {
      /* successful busy publish */
    });
    tracker.markBusy('s1', 'chat');
    expect(tracker.isBusy('s1')).toBe(true);

    // Swap in a publisher that always throws on the idle transition.
    // The session must still be freed — that is the point of
    // clear-before-publish.
    tracker.setPublisher(() => {
      throw new Error('publish failed');
    });
    expect(() => tracker.markFree('s1')).not.toThrow();
    expect(tracker.isBusy('s1')).toBe(false);
  });

  it('markBusy rolls back on synchronous publisher failure so retries succeed', () => {
    const tracker = getSessionBusyTracker();
    const throwing: SessionBusyPublisher = () => {
      throw new Error('cannot publish');
    };
    tracker.setPublisher(throwing);

    expect(() => tracker.markBusy('s2', 'chat')).toThrow('cannot publish');
    // Store must NOT retain a phantom busy entry after a failed publish.
    expect(tracker.isBusy('s2')).toBe(false);

    // A subsequent retry with a working publisher must succeed —
    // proving no wedge.
    const events: SessionBusyStatusEvent[] = [];
    tracker.setPublisher((event) => {
      events.push(event);
    });
    expect(() => tracker.markBusy('s2', 'chat')).not.toThrow();
    expect(tracker.isBusy('s2')).toBe(true);
    expect(events).toEqual([{ sessionId: 's2', status: 'busy', operation: 'chat' }]);
  });

  it('markBusy publishes before persisting (transition order preserved)', () => {
    const tracker = getSessionBusyTracker();
    const observedIsBusyAtPublishTime: boolean[] = [];
    tracker.setPublisher((event) => {
      if (event.status === 'busy') {
        // At the moment we publish `busy`, the store must NOT yet
        // reflect the busy state — publish happens BEFORE persist.
        observedIsBusyAtPublishTime.push(tracker.isBusy(event.sessionId));
      }
    });

    tracker.markBusy('s3', 'chat');
    expect(observedIsBusyAtPublishTime).toEqual([false]);
    // After the call returns, the busy state IS persisted.
    expect(tracker.isBusy('s3')).toBe(true);
  });

  it('markFree clears before publishing (transition order preserved)', () => {
    const tracker = getSessionBusyTracker();
    tracker.setPublisher(() => {
      /* accept busy publish */
    });
    tracker.markBusy('s4', 'chat');

    const observedIsBusyAtPublishTime: boolean[] = [];
    tracker.setPublisher((event) => {
      if (event.status === 'idle') {
        // At the moment we publish `idle`, the store must ALREADY
        // reflect the free state — clear happens BEFORE publish.
        observedIsBusyAtPublishTime.push(tracker.isBusy(event.sessionId));
      }
    });

    tracker.markFree('s4');
    expect(observedIsBusyAtPublishTime).toEqual([false]);
    expect(tracker.isBusy('s4')).toBe(false);
  });

  it('markBusy still throws SessionBusyError when session is already busy', () => {
    const tracker = getSessionBusyTracker();
    tracker.markBusy('s5', 'chat');
    expect(() => tracker.markBusy('s5', 'chat')).toThrow(SessionBusyError);
  });

  it('markFree is a no-op (and does not publish) when session is not busy', () => {
    const tracker = getSessionBusyTracker();
    const publisher = vi.fn();
    tracker.setPublisher(publisher);

    tracker.markFree('never-was-busy');
    expect(publisher).not.toHaveBeenCalled();
  });

  it('reload after markFree succeeds (regression: stale session status blocks reload)', () => {
    const tracker = getSessionBusyTracker();
    tracker.setPublisher(() => {
      throw new Error('publish idle failed');
    });
    tracker.markBusy('reload-session', 'chat');
    tracker.markFree('reload-session');

    // Simulate the reload path: it re-marks the session busy. If the
    // previous free-with-failed-publish had wedged the tracker, this
    // would throw SessionBusyError.
    tracker.setPublisher(() => {
      /* healthy */
    });
    expect(() => tracker.markBusy('reload-session', 'chat')).not.toThrow();
    expect(tracker.isBusy('reload-session')).toBe(true);
  });
});
