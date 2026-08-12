/**
 * Concurrent migration application test.
 *
 * Simulates two processes racing to apply the same migration set against
 * a shared, serialized journal. The runner must serialize on the write
 * lock and re-check inside the tx; a primary-key collision would fail
 * this test.
 */

import { describe, it, expect } from 'vitest';
import {
  applyMigrations,
  type Migration,
  type MigrationDb,
  type MigrationTx,
} from '../../../src/core/database/migration.js';

/**
 * In-memory MigrationDb that serializes transactions on a shared mutex to
 * model IMMEDIATE lock semantics. A single `applied` Set stands in for
 * the migration journal — its `.add()` throws if the id is already
 * present, mirroring a primary-key collision on INSERT.
 */
function makeSharedDb() {
  const applied = new Set<string>();
  let mutex: Promise<unknown> = Promise.resolve();

  const runExclusive = async <T>(fn: () => Promise<T>): Promise<T> => {
    const prev = mutex;
    let release: () => void = () => {};
    mutex = new Promise<void>((resolve) => {
      release = resolve;
    });
    await prev;
    try {
      return await fn();
    } finally {
      release();
    }
  };

  const makeInstance = (): MigrationDb => ({
    async completedIds() {
      return new Set(applied);
    },
    async transactionImmediate(fn) {
      return runExclusive(async () => {
        const tx: MigrationTx = {
          async has(id) {
            return applied.has(id);
          },
          async record(id) {
            if (applied.has(id)) {
              throw new Error(`PRIMARY KEY violation on migration id ${id}`);
            }
            applied.add(id);
          },
        };
        return fn(tx);
      });
    },
  });

  return { applied, makeInstance };
}

describe('applyMigrations (concurrent)', () => {
  it('does not race on the migration journal primary key when two runners race', async () => {
    const runs: string[] = [];
    const migrations: Migration[] = [
      {
        id: '2026_01_01_init',
        up: async () => {
          runs.push('init');
        },
      },
      {
        id: '2026_01_02_second',
        up: async () => {
          runs.push('second');
        },
      },
    ];

    const shared = makeSharedDb();
    const a = shared.makeInstance();
    const b = shared.makeInstance();

    await Promise.all([applyMigrations(a, migrations), applyMigrations(b, migrations)]);

    // Both runners saw the same list, but each migration must have been
    // recorded exactly once (no PK collision).
    expect(shared.applied.has('2026_01_01_init')).toBe(true);
    expect(shared.applied.has('2026_01_02_second')).toBe(true);
    // And each up() body must have run exactly once across both runners.
    expect(runs.sort()).toEqual(['init', 'second']);
  });

  it('skips a migration recorded by another process between snapshot and tx', async () => {
    const shared = makeSharedDb();
    // Pretend another process recorded this migration AFTER our snapshot
    // was taken but BEFORE our tx acquired the lock. The re-check inside
    // the tx must catch it.
    const db: MigrationDb = {
      async completedIds() {
        return new Set(); // stale snapshot: empty
      },
      async transactionImmediate(fn) {
        // Simulate the concurrent commit that landed while we waited.
        shared.applied.add('2026_01_03_third');
        return fn({
          async has(id) {
            return shared.applied.has(id);
          },
          async record(id) {
            if (shared.applied.has(id)) {
              throw new Error(`PRIMARY KEY violation on migration id ${id}`);
            }
            shared.applied.add(id);
          },
        });
      },
    };

    let upRan = false;
    await applyMigrations(db, [
      {
        id: '2026_01_03_third',
        up: async () => {
          upRan = true;
        },
      },
    ]);

    // The up() body must NOT have run because the re-check found the id
    // already recorded by the competing process.
    expect(upRan).toBe(false);
  });
});
