import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  appendEditHistory,
  clearDenialStore,
  formatProvenanceMessage,
  getDenialProvenance,
  recordDenial,
  type PermissionProvenance,
} from '../../src/permission/provenance.js';
import type { PermissionRule } from '../../src/permission/index.js';

/**
 * Issue #2085 — Permission edit history tracking.
 *
 * These tests pin the audit contract: edit records accumulate in order,
 * the top-level `editedAt` pointer stays synchronised with the latest
 * record, inputs are not mutated, and the formatter surfaces the edit
 * count + most recent edit timestamp when a history is attached.
 */
describe('PermissionProvenance edit history (issue #2085)', () => {
  afterEach(() => {
    clearDenialStore();
    vi.useRealTimers();
  });

  describe('appendEditHistory', () => {
    it('creates a new history entry on first edit and sets editedAt', () => {
      const base: PermissionProvenance = {
        decision: 'allow',
        ruleSource: 'config',
        ruleId: 'edit-tool',
      };
      const changes: Partial<PermissionRule> = { name: 'edit-tool-renamed' };
      const updated = appendEditHistory(base, changes, 'typo fix', 1_000_000);

      expect(updated.editedAt).toBe(1_000_000);
      expect(updated.editHistory).toHaveLength(1);
      expect(updated.editHistory?.[0]).toEqual({
        timestamp: 1_000_000,
        changes: { name: 'edit-tool-renamed' },
        reason: 'typo fix',
      });
    });

    it('accumulates edits across multiple calls and preserves order', () => {
      const base: PermissionProvenance = {
        decision: 'ask',
        ruleSource: 'session',
        ruleId: 'write-tool',
      };
      const step1 = appendEditHistory(base, { paths: ['/tmp/a'] }, 'initial narrow', 10);
      const step2 = appendEditHistory(step1, { paths: ['/tmp/b'] }, 'swap path', 20);
      const step3 = appendEditHistory(step2, { priority: 5 }, undefined, 30);

      expect(step3.editHistory).toHaveLength(3);
      expect(step3.editHistory?.map((r) => r.timestamp)).toEqual([10, 20, 30]);
      expect(step3.editedAt).toBe(30);
      // Reason is optional and must be absent from the record when not supplied.
      expect(step3.editHistory?.[2]).not.toHaveProperty('reason');
    });

    it('does not mutate the input provenance', () => {
      const base: PermissionProvenance = {
        decision: 'deny',
        ruleSource: 'default',
      };
      const snapshot = JSON.parse(JSON.stringify(base)) as PermissionProvenance;
      const after = appendEditHistory(base, { description: 'd' }, 'r', 42);

      expect(base).toEqual(snapshot);
      expect(after).not.toBe(base);
    });

    it('does not mutate the previous editHistory array', () => {
      const base: PermissionProvenance = {
        decision: 'allow',
        ruleSource: 'config',
      };
      const step1 = appendEditHistory(base, { name: 'a' }, undefined, 1);
      const step1Snapshot = JSON.parse(JSON.stringify(step1)) as PermissionProvenance;
      const step2 = appendEditHistory(step1, { name: 'b' }, undefined, 2);

      expect(step1).toEqual(step1Snapshot);
      expect(step1.editHistory).toHaveLength(1);
      expect(step2.editHistory).toHaveLength(2);
      expect(step1.editHistory).not.toBe(step2.editHistory);
    });

    it('defaults timestamp to Date.now() when not supplied', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2026-10-19T12:00:00Z'));

      const base: PermissionProvenance = {
        decision: 'allow',
        ruleSource: 'agent',
      };
      const updated = appendEditHistory(base, { name: 'x' });

      expect(updated.editedAt).toBe(Date.parse('2026-10-19T12:00:00Z'));
      expect(updated.editHistory?.[0].timestamp).toBe(Date.parse('2026-10-19T12:00:00Z'));
    });

    it('keeps edit history timestamps monotonically non-decreasing when callers use Date.now()', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2026-10-19T12:00:00Z'));

      let acc: PermissionProvenance = {
        decision: 'allow',
        ruleSource: 'config',
      };
      acc = appendEditHistory(acc, { name: 'a' });
      vi.setSystemTime(new Date('2026-10-19T12:00:01Z'));
      acc = appendEditHistory(acc, { name: 'b' });
      vi.setSystemTime(new Date('2026-10-19T12:00:02Z'));
      acc = appendEditHistory(acc, { name: 'c' });

      const stamps = acc.editHistory?.map((r) => r.timestamp) ?? [];
      for (let i = 1; i < stamps.length; i++) {
        expect(stamps[i]).toBeGreaterThanOrEqual(stamps[i - 1]);
      }
      expect(acc.editedAt).toBe(stamps[stamps.length - 1]);
    });
  });

  describe('formatProvenanceMessage with edit history', () => {
    it('omits edit suffix when history is absent (backwards compatible)', () => {
      const p: PermissionProvenance = {
        decision: 'allow',
        ruleSource: 'config',
        matchedPattern: 'read:*',
      };
      expect(formatProvenanceMessage(p)).toBe('Auto-approved by config (matched read:*)');
    });

    it('omits edit suffix when history is an empty array', () => {
      const p: PermissionProvenance = {
        decision: 'allow',
        ruleSource: 'config',
        editHistory: [],
      };
      expect(formatProvenanceMessage(p)).toBe('Auto-approved by config');
    });

    it('shows singular "time" for a single edit', () => {
      const edited = appendEditHistory(
        {
          decision: 'allow',
          ruleSource: 'config',
          matchedPattern: 'read:*',
        },
        { name: 'renamed' },
        'typo',
        Date.parse('2026-10-19T12:00:00Z')
      );
      expect(formatProvenanceMessage(edited)).toBe(
        'Auto-approved by config (matched read:*) (edited 1 time, last 2026-10-19T12:00:00.000Z)'
      );
    });

    it('shows plural "times" and the most recent edit timestamp for multiple edits', () => {
      let p: PermissionProvenance = {
        decision: 'allow',
        ruleSource: 'config',
        ruleId: 'xyz',
      };
      p = appendEditHistory(p, { name: 'a' }, undefined, Date.parse('2026-10-19T09:00:00Z'));
      p = appendEditHistory(p, { name: 'b' }, undefined, Date.parse('2026-10-19T10:00:00Z'));
      p = appendEditHistory(p, { name: 'c' }, undefined, Date.parse('2026-10-19T11:00:00Z'));

      expect(formatProvenanceMessage(p)).toBe(
        'Auto-approved by config (edited 3 times, last 2026-10-19T11:00:00.000Z)'
      );
    });

    it('appends edit suffix to deny decisions', () => {
      const p = appendEditHistory(
        {
          decision: 'deny',
          ruleSource: 'session',
          ruleId: 'block-net',
          reason: 'network blocked',
        },
        { hosts: ['*.evil.example'] },
        undefined,
        Date.parse('2026-10-19T08:00:00Z')
      );
      expect(formatProvenanceMessage(p)).toBe(
        'Denied by session rule "block-net": network blocked (edited 1 time, last 2026-10-19T08:00:00.000Z)'
      );
    });

    it('appends edit suffix to ask decisions', () => {
      const p = appendEditHistory(
        { decision: 'ask', ruleSource: 'agent' },
        { description: 'tightened' },
        undefined,
        Date.parse('2026-10-19T07:00:00Z')
      );
      expect(formatProvenanceMessage(p)).toBe(
        'Awaiting approval (edited 1 time, last 2026-10-19T07:00:00.000Z)'
      );
    });

    it('prefers top-level editedAt over history tail when the two disagree', () => {
      // Hand-constructed provenance where editedAt was set from an
      // out-of-band source (e.g. a replayed audit event). We honour
      // editedAt as the authoritative "last modified" pointer.
      const p: PermissionProvenance = {
        decision: 'allow',
        ruleSource: 'config',
        editedAt: Date.parse('2026-10-19T23:00:00Z'),
        editHistory: [
          {
            timestamp: Date.parse('2026-10-19T06:00:00Z'),
            changes: { name: 'legacy' },
          },
        ],
      };
      expect(formatProvenanceMessage(p)).toBe(
        'Auto-approved by config (edited 1 time, last 2026-10-19T23:00:00.000Z)'
      );
    });
  });

  describe('denial store preserves edit history round-trip', () => {
    beforeEach(() => {
      clearDenialStore();
    });

    it('records and retrieves an edited provenance unchanged', () => {
      const edited = appendEditHistory(
        {
          decision: 'deny',
          ruleSource: 'config',
          ruleId: 'rule-7',
        },
        { paths: ['/etc/*'] },
        'narrowed scope',
        123
      );
      recordDenial('call-7', edited);
      const retrieved = getDenialProvenance('call-7');
      expect(retrieved).toEqual(edited);
      expect(retrieved?.editHistory).toHaveLength(1);
    });
  });
});
