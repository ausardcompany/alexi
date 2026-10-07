import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  __resetWorktreeStatusRegistry,
  getPinnedWorktreeIds,
  getWorktreeStatus,
  getWorktreeStatuses,
  removeWorktreeStatus,
  setWorktreePinned,
  setWorktreeStatus,
  subscribe,
  toggleWorktreePin,
  type WorktreeStatusEntry,
} from '../../src/agent/worktreeStatus.js';

afterEach(() => {
  __resetWorktreeStatusRegistry();
});

describe('worktreeStatus registry', () => {
  it('starts empty', () => {
    expect(getWorktreeStatuses()).toEqual([]);
  });

  it('stores a new worktree and surfaces it via getWorktreeStatus', () => {
    setWorktreeStatus('wt-1', { label: 'feature-x', status: 'running' });
    const entry = getWorktreeStatus('wt-1');
    expect(entry).toBeDefined();
    expect(entry?.id).toBe('wt-1');
    expect(entry?.label).toBe('feature-x');
    expect(entry?.status).toBe('running');
    expect(typeof entry?.updatedAt).toBe('number');
  });

  it('returns undefined for an unknown id (distinct from status=unknown)', () => {
    expect(getWorktreeStatus('never-seen')).toBeUndefined();
  });

  it('updates status in place when it changes', () => {
    setWorktreeStatus('wt-1', { label: 'feature-x', status: 'running' });
    setWorktreeStatus('wt-1', { label: 'feature-x', status: 'idle' });
    expect(getWorktreeStatus('wt-1')?.status).toBe('idle');
    expect(getWorktreeStatuses()).toHaveLength(1);
  });

  it('is a no-op when the same status is pushed again', () => {
    setWorktreeStatus('wt-1', { label: 'feature-x', status: 'idle' });
    const listener = vi.fn();
    subscribe(listener);
    listener.mockClear(); // ignore the synchronous initial emit
    setWorktreeStatus('wt-1', { label: 'feature-x', status: 'idle' });
    expect(listener).not.toHaveBeenCalled();
  });

  it('emits when detail changes even if status is the same', () => {
    setWorktreeStatus('wt-1', { label: 'feature-x', status: 'idle' });
    const listener = vi.fn();
    subscribe(listener);
    listener.mockClear();
    setWorktreeStatus('wt-1', { label: 'feature-x', status: 'idle', detail: 'ready' });
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('removeWorktreeStatus deletes the entry and emits', () => {
    setWorktreeStatus('wt-1', { label: 'feature-x', status: 'idle' });
    const listener = vi.fn();
    subscribe(listener);
    listener.mockClear();
    removeWorktreeStatus('wt-1');
    expect(getWorktreeStatus('wt-1')).toBeUndefined();
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('removeWorktreeStatus on a missing id does not emit', () => {
    const listener = vi.fn();
    subscribe(listener);
    listener.mockClear();
    removeWorktreeStatus('nope');
    expect(listener).not.toHaveBeenCalled();
  });

  it('subscribe emits the current snapshot synchronously', () => {
    setWorktreeStatus('wt-1', { label: 'feature-x', status: 'running' });
    let received: readonly WorktreeStatusEntry[] | undefined;
    subscribe((snap) => {
      received = snap;
    });
    expect(received).toBeDefined();
    expect(received).toHaveLength(1);
    expect(received?.[0].id).toBe('wt-1');
  });

  it('subscribe returns an unsubscribe that stops future emissions', () => {
    const listener = vi.fn();
    const unsub = subscribe(listener);
    listener.mockClear();
    unsub();
    setWorktreeStatus('wt-1', { label: 'feature-x', status: 'idle' });
    expect(listener).not.toHaveBeenCalled();
  });

  it('emits to multiple subscribers on every real change', () => {
    const a = vi.fn();
    const b = vi.fn();
    subscribe(a);
    subscribe(b);
    a.mockClear();
    b.mockClear();
    setWorktreeStatus('wt-1', { label: 'feature-x', status: 'running' });
    expect(a).toHaveBeenCalledTimes(1);
    expect(b).toHaveBeenCalledTimes(1);
  });

  it('supports every status in the union', () => {
    const statuses = ['running', 'idle', 'error', 'blocked', 'unknown'] as const;
    for (const status of statuses) {
      setWorktreeStatus(`wt-${status}`, { label: status, status });
    }
    const snap = getWorktreeStatuses();
    expect(snap).toHaveLength(statuses.length);
    for (const status of statuses) {
      expect(snap.find((e) => e.status === status)).toBeDefined();
    }
  });

  it('preserves insertion order in the snapshot', () => {
    setWorktreeStatus('a', { label: 'a', status: 'running' });
    setWorktreeStatus('b', { label: 'b', status: 'idle' });
    setWorktreeStatus('c', { label: 'c', status: 'error' });
    expect(getWorktreeStatuses().map((e) => e.id)).toEqual(['a', 'b', 'c']);
  });

  it('emitted entries are frozen to prevent accidental mutation', () => {
    setWorktreeStatus('wt-1', { label: 'feature-x', status: 'idle' });
    const snap = getWorktreeStatuses();
    expect(Object.isFrozen(snap[0])).toBe(true);
  });

  describe('pinning (PR #14891)', () => {
    it('defaults new entries to unpinned', () => {
      setWorktreeStatus('wt-1', { label: 'x', status: 'idle' });
      expect(getWorktreeStatus('wt-1')?.pinned).toBeUndefined();
      expect(getPinnedWorktreeIds()).toEqual([]);
    });

    it('setWorktreePinned flips the flag and emits', () => {
      setWorktreeStatus('wt-1', { label: 'x', status: 'idle' });
      const listener = vi.fn();
      subscribe(listener);
      listener.mockClear();
      expect(setWorktreePinned('wt-1', true)).toBe(true);
      expect(getWorktreeStatus('wt-1')?.pinned).toBe(true);
      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('setWorktreePinned on an unknown id returns false and does not emit', () => {
      const listener = vi.fn();
      subscribe(listener);
      listener.mockClear();
      expect(setWorktreePinned('nope', true)).toBe(false);
      expect(listener).not.toHaveBeenCalled();
    });

    it('setWorktreePinned is a no-op when the flag is already in the requested state', () => {
      setWorktreeStatus('wt-1', { label: 'x', status: 'idle' });
      setWorktreePinned('wt-1', true);
      const listener = vi.fn();
      subscribe(listener);
      listener.mockClear();
      expect(setWorktreePinned('wt-1', true)).toBe(false);
      expect(listener).not.toHaveBeenCalled();
    });

    it('toggleWorktreePin flips between pinned and unpinned', () => {
      setWorktreeStatus('wt-1', { label: 'x', status: 'idle' });
      expect(toggleWorktreePin('wt-1')).toBe(true);
      expect(getWorktreeStatus('wt-1')?.pinned).toBe(true);
      expect(toggleWorktreePin('wt-1')).toBe(false);
      expect(getWorktreeStatus('wt-1')?.pinned).toBe(false);
    });

    it('toggleWorktreePin returns undefined for an unknown id', () => {
      expect(toggleWorktreePin('nope')).toBeUndefined();
    });

    it('setWorktreeStatus preserves pin flag when it is not supplied', () => {
      setWorktreeStatus('wt-1', { label: 'x', status: 'idle' });
      setWorktreePinned('wt-1', true);
      // Simulate a lifecycle status update from the orchestrator —
      // must NOT clobber the user-set pin.
      setWorktreeStatus('wt-1', { label: 'x', status: 'running' });
      expect(getWorktreeStatus('wt-1')?.pinned).toBe(true);
      expect(getWorktreeStatus('wt-1')?.status).toBe('running');
    });

    it('setWorktreeStatus accepts an explicit pinned override', () => {
      setWorktreeStatus('wt-1', { label: 'x', status: 'idle', pinned: true });
      expect(getWorktreeStatus('wt-1')?.pinned).toBe(true);
    });

    it('getPinnedWorktreeIds returns ids in insertion order', () => {
      setWorktreeStatus('a', { label: 'a', status: 'idle' });
      setWorktreeStatus('b', { label: 'b', status: 'idle' });
      setWorktreeStatus('c', { label: 'c', status: 'idle' });
      setWorktreePinned('b', true);
      setWorktreePinned('a', true);
      expect(getPinnedWorktreeIds()).toEqual(['a', 'b']);
    });

    it('removeWorktreeStatus drops a pinned entry', () => {
      setWorktreeStatus('wt-1', { label: 'x', status: 'idle' });
      setWorktreePinned('wt-1', true);
      removeWorktreeStatus('wt-1');
      expect(getPinnedWorktreeIds()).toEqual([]);
    });

    it('no-op update including pinned does not emit', () => {
      setWorktreeStatus('wt-1', { label: 'x', status: 'idle', pinned: true });
      const listener = vi.fn();
      subscribe(listener);
      listener.mockClear();
      setWorktreeStatus('wt-1', { label: 'x', status: 'idle', pinned: true });
      expect(listener).not.toHaveBeenCalled();
    });

    it('entries projected into getWorktreeStatuses carry the pinned flag', () => {
      setWorktreeStatus('wt-1', { label: 'x', status: 'idle' });
      setWorktreePinned('wt-1', true);
      const snap: readonly WorktreeStatusEntry[] = getWorktreeStatuses();
      expect(snap[0].pinned).toBe(true);
    });
  });
});
