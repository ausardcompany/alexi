/**
 * Tests for Agent Manager worktree pinning (upstream kilocode PR #14891).
 *
 * The pin state has two homes: an in-memory flag on each
 * `WorktreeStatusEntry` (covered by `tests/agent/worktreeStatus.test.ts`)
 * and the on-disk `~/.alexi/agent-manager.json` file. This suite focuses
 * on the latter — the orchestration-api wrapper that keeps the two in
 * lockstep and roundtrips pin state across session restarts.
 */
import { promises as fs } from 'fs';
import os from 'os';
import path from 'path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import {
  loadPersistedPinnedWorktrees,
  persistPinnedWorktrees,
  readAgentManagerState,
  resetAgentManagerStatePathForTesting,
  setAgentManagerStatePathForTesting,
  toggleWorktreePin,
  writeAgentManagerState,
} from '../../src/core/agent-manager/orchestration-api.js';
import {
  __resetWorktreeStatusRegistry,
  getWorktreeStatus,
  setWorktreeStatus,
} from '../../src/agent/worktreeStatus.js';

let tmpDir: string;
let statePath: string;

beforeEach(async () => {
  tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'alexi-pin-'));
  statePath = path.join(tmpDir, 'agent-manager.json');
  setAgentManagerStatePathForTesting(statePath);
});

afterEach(async () => {
  resetAgentManagerStatePathForTesting();
  __resetWorktreeStatusRegistry();
  await fs.rm(tmpDir, { recursive: true, force: true });
});

describe('toggleWorktreePin (persistence)', () => {
  it('pins an existing worktree and writes the id to disk', async () => {
    setWorktreeStatus('wt-1', { label: 'feature', status: 'idle' });
    const result = await toggleWorktreePin('wt-1');
    expect(result).toBe(true);
    expect(getWorktreeStatus('wt-1')?.pinned).toBe(true);
    const state = await readAgentManagerState();
    expect(state.pinnedWorktrees).toEqual(['wt-1']);
  });

  it('unpins a worktree and removes the id from disk', async () => {
    setWorktreeStatus('wt-1', { label: 'feature', status: 'idle' });
    await toggleWorktreePin('wt-1');
    const result = await toggleWorktreePin('wt-1');
    expect(result).toBe(false);
    expect(getWorktreeStatus('wt-1')?.pinned).toBe(false);
    const state = await readAgentManagerState();
    expect(state.pinnedWorktrees).toEqual([]);
  });

  it('returns undefined for an unknown id and does not write the file', async () => {
    const result = await toggleWorktreePin('nope');
    expect(result).toBeUndefined();
    // No file should have been created on an unknown-id toggle.
    await expect(fs.access(statePath)).rejects.toThrow();
  });

  it('preserves unknown fields in the state file across writes', async () => {
    await writeAgentManagerState({ pinnedWorktrees: [], futureField: 42 });
    setWorktreeStatus('wt-1', { label: 'feature', status: 'idle' });
    await toggleWorktreePin('wt-1');
    const state = await readAgentManagerState();
    expect(state.pinnedWorktrees).toEqual(['wt-1']);
    expect(state.futureField).toBe(42);
  });
});

describe('loadPersistedPinnedWorktrees', () => {
  it('returns an empty list when no state file exists', async () => {
    const applied = await loadPersistedPinnedWorktrees();
    expect(applied).toEqual([]);
  });

  it('applies persisted pin ids to entries present in the registry', async () => {
    await writeAgentManagerState({ pinnedWorktrees: ['wt-1', 'wt-2'] });
    setWorktreeStatus('wt-1', { label: 'a', status: 'idle' });
    setWorktreeStatus('wt-2', { label: 'b', status: 'running' });
    const applied = await loadPersistedPinnedWorktrees();
    expect(applied).toEqual(['wt-1', 'wt-2']);
    expect(getWorktreeStatus('wt-1')?.pinned).toBe(true);
    expect(getWorktreeStatus('wt-2')?.pinned).toBe(true);
  });

  it('skips persisted ids with no matching registry entry (stale pin)', async () => {
    await writeAgentManagerState({ pinnedWorktrees: ['wt-1', 'ghost'] });
    setWorktreeStatus('wt-1', { label: 'a', status: 'idle' });
    const applied = await loadPersistedPinnedWorktrees();
    expect(applied).toEqual(['wt-1']);
    expect(getWorktreeStatus('wt-1')?.pinned).toBe(true);
    expect(getWorktreeStatus('ghost')).toBeUndefined();
  });

  it('ignores non-string entries defensively', async () => {
    // Simulate a hand-edited corrupted file: pinnedWorktrees must only
    // contain strings, but the loader should not crash on bad input.
    await fs.writeFile(statePath, JSON.stringify({ pinnedWorktrees: ['ok', 123, null] }), 'utf8');
    setWorktreeStatus('ok', { label: 'a', status: 'idle' });
    const applied = await loadPersistedPinnedWorktrees();
    expect(applied).toEqual(['ok']);
  });

  it('treats a missing file as empty state', async () => {
    // No write yet.
    const applied = await loadPersistedPinnedWorktrees();
    expect(applied).toEqual([]);
  });

  it('treats a malformed JSON file as empty state (does not crash)', async () => {
    await fs.writeFile(statePath, '{not json', 'utf8');
    const applied = await loadPersistedPinnedWorktrees();
    expect(applied).toEqual([]);
  });
});

describe('persistPinnedWorktrees', () => {
  it('writes the current pinned ids reflecting the registry snapshot', async () => {
    setWorktreeStatus('a', { label: 'a', status: 'idle' });
    setWorktreeStatus('b', { label: 'b', status: 'idle' });
    setWorktreeStatus('c', { label: 'c', status: 'idle' });
    await toggleWorktreePin('a');
    await toggleWorktreePin('c');
    await persistPinnedWorktrees();
    const state = await readAgentManagerState();
    expect(state.pinnedWorktrees).toEqual(['a', 'c']);
  });

  it('creates the parent directory on first write', async () => {
    const nested = path.join(tmpDir, 'nested', 'deep', 'agent-manager.json');
    setAgentManagerStatePathForTesting(nested);
    setWorktreeStatus('a', { label: 'a', status: 'idle' });
    await toggleWorktreePin('a');
    const state = await readAgentManagerState();
    expect(state.pinnedWorktrees).toEqual(['a']);
  });
});

describe('pin persistence roundtrip', () => {
  it('a pinned worktree survives a simulated session restart', async () => {
    // Session 1: user pins a worktree.
    setWorktreeStatus('wt-1', { label: 'feature', status: 'idle' });
    await toggleWorktreePin('wt-1');
    expect(getWorktreeStatus('wt-1')?.pinned).toBe(true);

    // Simulate restart: drop the in-memory registry, keep the file.
    __resetWorktreeStatusRegistry();

    // Session 2: discovery populates the registry first, then load.
    setWorktreeStatus('wt-1', { label: 'feature', status: 'idle' });
    expect(getWorktreeStatus('wt-1')?.pinned).toBeUndefined();
    const applied = await loadPersistedPinnedWorktrees();
    expect(applied).toEqual(['wt-1']);
    expect(getWorktreeStatus('wt-1')?.pinned).toBe(true);
  });
});
