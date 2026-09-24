import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  __resetWorktreeStatusRegistry,
  getWorktreeStatus,
  getWorktreeStatuses,
  removeWorktreeStatus,
  setWorktreeStatus,
  subscribe,
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
});
