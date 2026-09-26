/**
 * Tests for `importLegacyDrizzleJournal` — the defensive port of the
 * upstream kilocode fix that handles legacy `__drizzle_migrations` tables
 * whose schema predates the `name` column.
 */

import { describe, expect, it } from 'vitest';
import {
  importLegacyDrizzleJournal,
  type LegacySqliteBridge,
  type Migration,
  type SqliteColumnInfo,
} from './migration.js';

class FakeBridge implements LegacySqliteBridge {
  public readonly recorded: Array<{ id: string; timeCompletedMs: number }> = [];
  constructor(
    private readonly tables: Set<string>,
    private readonly columns: Map<string, readonly SqliteColumnInfo[]>,
    private readonly journal: ReadonlyArray<{ name?: string | null; created_at?: number | null }>
  ) {}
  async tableExists(name: string): Promise<boolean> {
    return this.tables.has(name);
  }
  async tableColumns(name: string): Promise<readonly SqliteColumnInfo[]> {
    return this.columns.get(name) ?? [];
  }
  async fetchLegacyJournal(): Promise<
    ReadonlyArray<{ name?: string | null; created_at?: number | null }>
  > {
    return this.journal;
  }
  async recordCompleted(id: string, timeCompletedMs: number): Promise<void> {
    this.recorded.push({ id, timeCompletedMs });
  }
}

const noopUp = async (): Promise<void> => {
  /* no-op */
};

describe('importLegacyDrizzleJournal', () => {
  it('is a no-op when the legacy table does not exist', async () => {
    const bridge = new FakeBridge(new Set(), new Map(), []);
    await importLegacyDrizzleJournal(bridge, []);
    expect(bridge.recorded).toEqual([]);
  });

  it('uses the `name` column when it is present', async () => {
    const bridge = new FakeBridge(
      new Set(['__drizzle_migrations']),
      new Map([
        ['__drizzle_migrations', [{ name: 'id' }, { name: 'name' }, { name: 'created_at' }]],
      ]),
      [
        { name: '20260828074139_kilocode_board', created_at: 1_700_000_000_000 },
        { name: '20260907102000_model_usage_index', created_at: 1_700_000_001_000 },
      ]
    );
    await importLegacyDrizzleJournal(bridge, []);
    expect(bridge.recorded.map((r) => r.id)).toEqual([
      '20260828074139_kilocode_board',
      '20260907102000_model_usage_index',
    ]);
  });

  it('skips rows with a null/empty name when the column is present', async () => {
    const bridge = new FakeBridge(
      new Set(['__drizzle_migrations']),
      new Map([['__drizzle_migrations', [{ name: 'name' }, { name: 'created_at' }]]]),
      [
        { name: null, created_at: 1_700_000_000_000 },
        { name: '', created_at: 1_700_000_001_000 },
        { name: '20260828074139_kilocode_board', created_at: 1_700_000_002_000 },
      ]
    );
    await importLegacyDrizzleJournal(bridge, []);
    expect(bridge.recorded.map((r) => r.id)).toEqual(['20260828074139_kilocode_board']);
  });

  it('falls back to matching by `created_at` prefix when the `name` column is absent', async () => {
    // 2026-08-28 07:41:39 UTC = 1785656499000ms
    const createdAtMs = Date.UTC(2026, 7, 28, 7, 41, 39);
    const migrations: Migration[] = [
      { id: '20260828074139_kilocode_board', up: noopUp },
      { id: '20260907102000_model_usage_index', up: noopUp },
    ];
    const bridge = new FakeBridge(
      new Set(['__drizzle_migrations']),
      new Map([['__drizzle_migrations', [{ name: 'id' }, { name: 'created_at' }]]]),
      [{ created_at: createdAtMs }]
    );
    await importLegacyDrizzleJournal(bridge, migrations);
    expect(bridge.recorded.map((r) => r.id)).toEqual(['20260828074139_kilocode_board']);
  });

  it('throws when a legacy timestamp has no matching known migration', async () => {
    const bridge = new FakeBridge(
      new Set(['__drizzle_migrations']),
      new Map([['__drizzle_migrations', [{ name: 'created_at' }]]]),
      [{ created_at: Date.UTC(2099, 0, 1, 0, 0, 0) }]
    );
    await expect(importLegacyDrizzleJournal(bridge, [])).rejects.toThrow(
      /Legacy migration timestamp/
    );
  });

  it('skips rows without a `created_at` when name column is absent (no data to match on)', async () => {
    const bridge = new FakeBridge(
      new Set(['__drizzle_migrations']),
      new Map([['__drizzle_migrations', [{ name: 'id' }]]]),
      [{ created_at: null }, { created_at: undefined }]
    );
    await importLegacyDrizzleJournal(bridge, []);
    expect(bridge.recorded).toEqual([]);
  });
});
