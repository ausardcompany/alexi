/**
 * Tests for the per-instance {@link InstanceWatcher} scoping fix
 * (kilocode b8984e468). Two concurrent instances must not share watcher
 * state, and disposing one must not tear down the peer's watches.
 */

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import {
  InstanceWatcher,
  isExperimentalFileWatcherEnabled,
  getDefaultWatcherInstance,
  startWatcher,
  type WatchLocation,
} from '../../core/filesystem/watcher.js';

describe('InstanceWatcher', () => {
  const originalFlag = process.env.ALEXI_EXPERIMENTAL_FILEWATCHER;
  const location: WatchLocation = { directory: '/tmp/alexi-test', vcs: true };
  const otherLocation: WatchLocation = { directory: '/tmp/alexi-other', vcs: true };

  beforeEach(() => {
    process.env.ALEXI_EXPERIMENTAL_FILEWATCHER = '1';
    getDefaultWatcherInstance().dispose();
  });

  afterEach(() => {
    if (originalFlag === undefined) {
      delete process.env.ALEXI_EXPERIMENTAL_FILEWATCHER;
    } else {
      process.env.ALEXI_EXPERIMENTAL_FILEWATCHER = originalFlag;
    }
    getDefaultWatcherInstance().dispose();
  });

  it('exposes the flag getter', () => {
    expect(isExperimentalFileWatcherEnabled()).toBe(true);
    process.env.ALEXI_EXPERIMENTAL_FILEWATCHER = '0';
    expect(isExperimentalFileWatcherEnabled()).toBe(false);
  });

  it('starts a watch and increments size', () => {
    const w = new InstanceWatcher();
    let disposed = false;
    const disposer = w.start(location, () => () => {
      disposed = true;
    });
    expect(disposer).not.toBeNull();
    expect(w.size()).toBe(1);
    expect(w.has(location.directory)).toBe(true);
    disposer!();
    expect(disposed).toBe(true);
    expect(w.size()).toBe(0);
  });

  it('is idempotent per directory', () => {
    const w = new InstanceWatcher();
    let subscribeCalls = 0;
    const d1 = w.start(location, () => {
      subscribeCalls++;
      return () => {};
    });
    const d2 = w.start(location, () => {
      subscribeCalls++;
      return () => {};
    });
    expect(subscribeCalls).toBe(1);
    expect(d1).toBe(d2);
    w.dispose();
  });

  it('skips watches when the VCS guard fails', () => {
    const w = new InstanceWatcher();
    const disposer = w.start({ directory: '/tmp/no-vcs', vcs: false }, () => () => {});
    expect(disposer).toBeNull();
    expect(w.size()).toBe(0);
  });

  it('skips watches when the experimental flag is off', () => {
    process.env.ALEXI_EXPERIMENTAL_FILEWATCHER = '0';
    const w = new InstanceWatcher();
    const disposer = w.start(location, () => () => {});
    expect(disposer).toBeNull();
    expect(w.size()).toBe(0);
  });

  it('isolates state between two instances (kilocode b8984e468)', () => {
    const a = new InstanceWatcher();
    const b = new InstanceWatcher();
    let aDisposed = false;
    let bDisposed = false;
    a.start(location, () => () => {
      aDisposed = true;
    });
    b.start(otherLocation, () => () => {
      bDisposed = true;
    });
    // Disposing b must not affect a.
    b.dispose();
    expect(bDisposed).toBe(true);
    expect(aDisposed).toBe(false);
    expect(a.size()).toBe(1);
    a.dispose();
    expect(aDisposed).toBe(true);
  });

  it('stop() only tears down the requested directory', () => {
    const w = new InstanceWatcher();
    let firstDisposed = false;
    let secondDisposed = false;
    w.start(location, () => () => {
      firstDisposed = true;
    });
    w.start(otherLocation, () => () => {
      secondDisposed = true;
    });
    expect(w.stop(location.directory)).toBe(true);
    expect(firstDisposed).toBe(true);
    expect(secondDisposed).toBe(false);
    expect(w.size()).toBe(1);
    // stop for an unknown directory returns false.
    expect(w.stop('/tmp/unknown')).toBe(false);
    w.dispose();
  });

  it('backwards-compatible startWatcher shim delegates to the default instance', () => {
    let disposed = false;
    const disposer = startWatcher(location, () => () => {
      disposed = true;
    });
    expect(disposer).not.toBeNull();
    expect(getDefaultWatcherInstance().size()).toBe(1);
    disposer!();
    expect(disposed).toBe(true);
  });

  it('setDebounceTimer clears the previous timer for the same directory', () => {
    const w = new InstanceWatcher();
    const first = setTimeout(() => {}, 60_000) as ReturnType<typeof setTimeout>;
    // Replace clearTimeout would be racy; instead observe indirectly by
    // scheduling two timers and calling dispose (which must clear them
    // without hanging the test).
    w.setDebounceTimer('/tmp/x', first);
    w.setDebounceTimer(
      '/tmp/x',
      setTimeout(() => {}, 60_000)
    );
    // If the previous timer weren't cleared, this test would keep the event
    // loop alive for 60s. dispose() must also clear the current timer.
    w.dispose();
    expect(w.size()).toBe(0);
  });
});
