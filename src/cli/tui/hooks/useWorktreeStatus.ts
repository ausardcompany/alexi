import { useEffect, useState } from 'react';

import { subscribe, type WorktreeStatusEntry } from '../../../agent/worktreeStatus.js';

/**
 * React binding for the Agent Manager worktree status registry.
 *
 * Subscribes on mount and unsubscribes on unmount, mirroring the
 * pattern used by {@link useFileChanges} rather than
 * `useSyncExternalStore` — the registry emits a synchronous initial
 * snapshot on subscribe so a plain `useState` + effect is enough and
 * keeps the hook trivially testable under `ink-testing-library`.
 *
 * Returns the current full snapshot; callers project it into whatever
 * shape their component needs (typically a list rendered next to the
 * `<StatusIcon>` component).
 */
export function useWorktreeStatus(): readonly WorktreeStatusEntry[] {
  const [entries, setEntries] = useState<readonly WorktreeStatusEntry[]>([]);

  useEffect(() => {
    const unsub = subscribe((snapshot) => {
      setEntries(snapshot);
    });
    return unsub;
  }, []);

  return entries;
}
