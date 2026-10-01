/**
 * Resilience regression for `initializeConnectorStore` (ports kilocode
 * fix 1988e54fd — "keep storage usable after an interrupted first
 * access").
 *
 * Scenario:
 *   1. The first `initializeConnectorStore` call hits a transient
 *      failure in `loadConnectorState` (e.g. EINTR, a stale lock, a
 *      cancelled signal during startup).
 *   2. Before the fix, the hydrated flag was set BEFORE the await, so
 *      the second attempt saw `currentStoreHydrated === true` and
 *      silently skipped hydration forever — meaning the persisted
 *      refresh token never made it back into memory.
 *   3. After the fix, the flag is only set after the merge succeeds, so
 *      a later attempt (second startup phase, a retry on failure)
 *      actually re-reads the snapshot.
 *
 * The persistence layer reads from a JSON file at
 * `getConnectorStatePath()`, so we drive the two attempts by pointing
 * the path at a non-existent file first (load returns empty snapshot,
 * which is treated as success) and then at a well-formed snapshot the
 * second time. Correct behaviour: both attempts observe the fresh
 * state they were asked to read.
 */

import fs from 'fs';
import os from 'os';
import path from 'path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  createInMemoryConnectorStore,
  getConnectorStore,
  initializeConnectorStore,
  resetConnectorStatePath,
  setConnectorStatePath,
  setConnectorStore,
} from '../connectorStore.js';

describe('initializeConnectorStore resilience', () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'alexi-connector-'));
    // Reset the store so `currentStoreHydrated` is false.
    setConnectorStore(createInMemoryConnectorStore());
  });

  afterEach(() => {
    resetConnectorStatePath();
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('retries hydration after an interrupted first attempt', async () => {
    // ----- Attempt 1: the file does not exist (first-run scenario). -----
    // `loadConnectorState` returns an empty snapshot — technically a
    // success, so the hydrated flag flips to true. We then explicitly
    // reset the store (mirroring what the production retry path does
    // when it detects a startup race) and verify the SECOND attempt
    // actually re-reads the real snapshot instead of early-returning.
    const missing = path.join(tmpDir, 'missing.json');
    setConnectorStatePath(missing);
    await initializeConnectorStore();

    // No state yet.
    const emptyEntry = await getConnectorStore().get('sap-ai-core');
    expect(emptyEntry).toBeUndefined();

    // ----- Reset: simulates a fresh store swap (e.g. test harness or a
    // live config reload). This is what the production code relies on
    // to retry hydration without a process restart.
    setConnectorStore(createInMemoryConnectorStore());

    // ----- Attempt 2: a real snapshot is now on disk. -----
    const populated = path.join(tmpDir, 'populated.json');
    const snapshot = {
      version: 1,
      connectors: {
        'sap-ai-core': {
          refreshToken: 'refresh-abc',
          tokenEndpoint: 'https://example.com/oauth/token',
          clientId: 'client-id',
        },
      },
    };
    fs.writeFileSync(populated, JSON.stringify(snapshot), { mode: 0o600 });
    setConnectorStatePath(populated);
    await initializeConnectorStore();

    const entry = await getConnectorStore().get('sap-ai-core');
    expect(entry?.refreshToken).toBe('refresh-abc');
    expect(entry?.tokenEndpoint).toBe('https://example.com/oauth/token');
  });

  it('does not mark hydrated when loadConnectorState throws, allowing retry', async () => {
    // Point the state path at a directory to force `loadConnectorState`
    // to throw (reading a dir as a file errors on most platforms). The
    // fix guarantees we do NOT mark hydrated in that case, so a
    // subsequent attempt against a valid path succeeds.
    const asDir = path.join(tmpDir, 'as-dir');
    fs.mkdirSync(asDir);
    setConnectorStatePath(asDir);
    // Should NOT throw — `initializeConnectorStore` swallows load failures.
    await initializeConnectorStore();
    // No state hydrated.
    expect(await getConnectorStore().get('sap-ai-core')).toBeUndefined();

    // Now point at a valid snapshot and retry WITHOUT swapping stores.
    // Pre-fix: the hydrated flag was set early, so this would be a no-op.
    // Post-fix: hydration actually runs.
    const populated = path.join(tmpDir, 'populated.json');
    fs.writeFileSync(
      populated,
      JSON.stringify({
        version: 1,
        connectors: {
          'sap-ai-core': { refreshToken: 'retry-token' },
        },
      }),
      { mode: 0o600 }
    );
    setConnectorStatePath(populated);
    await initializeConnectorStore();

    const entry = await getConnectorStore().get('sap-ai-core');
    expect(entry?.refreshToken).toBe('retry-token');
  });
});
