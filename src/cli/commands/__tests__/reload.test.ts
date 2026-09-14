/**
 * Tests for the `/reload` command primitive — mirrors kilocode's
 * `feat(cli): reload the whole project from /reload` (commit 3a2c5d5c2)
 * and `fix(cli): surface reload failures and skip in-flight instances`
 * (commit 546195019).
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

import {
  registerRefresher,
  executeReload,
  formatReloadResult,
  IN_FLIGHT_MARKER,
  _resetRefreshersForTest,
  registeredSubsystems,
} from '../../../src/cli/commands/reload.js';

describe('reload command primitive', () => {
  beforeEach(() => {
    _resetRefreshersForTest();
  });

  it('runs every registered refresher and reports success', async () => {
    const a = vi.fn(async () => {});
    const b = vi.fn(async () => {});
    registerRefresher('a', a);
    registerRefresher('b', b);

    const result = await executeReload();
    expect(a).toHaveBeenCalledOnce();
    expect(b).toHaveBeenCalledOnce();
    expect(result.outcomes).toHaveLength(2);
    expect(result.outcomes.every((o) => o.ok)).toBe(true);
  });

  it('surfaces failures without aborting subsequent refreshers', async () => {
    registerRefresher('broken', async () => {
      throw new Error('kaboom');
    });
    const survivor = vi.fn(async () => {});
    registerRefresher('survivor', survivor);

    const result = await executeReload();
    expect(survivor).toHaveBeenCalledOnce();
    expect(result.outcomes[0]).toMatchObject({ subsystem: 'broken', ok: false });
    expect(result.outcomes[0].reason).toContain('kaboom');
    expect(result.outcomes[1]).toMatchObject({ subsystem: 'survivor', ok: true });
  });

  it('classifies in-flight rejections as skipped, not failed', async () => {
    registerRefresher('busy', async () => {
      throw new Error(`${IN_FLIGHT_MARKER} one request in flight`);
    });

    const result = await executeReload();
    expect(result.outcomes[0]).toMatchObject({
      subsystem: 'busy',
      ok: false,
      skipped: true,
    });
    expect(result.outcomes[0].reason).toBe('one request in flight');
  });

  it('formatReloadResult renders ok / failed / skipped tallies', () => {
    const rendered = formatReloadResult({
      elapsedMs: 42,
      outcomes: [
        { subsystem: 'a', ok: true },
        { subsystem: 'b', ok: false, reason: 'kaboom' },
        { subsystem: 'c', ok: false, skipped: true, reason: 'in-flight request' },
      ],
    });
    expect(rendered).toContain('✓ a');
    expect(rendered).toContain('✗ b — kaboom');
    expect(rendered).toContain('⏭  c — skipped: in-flight request');
    expect(rendered).toContain('1 ok, 1 failed, 1 skipped');
    expect(rendered).toContain('42ms');
  });

  it('registeredSubsystems reports names in registration order', () => {
    registerRefresher('first', async () => {});
    registerRefresher('second', async () => {});
    expect(registeredSubsystems()).toEqual(['first', 'second']);
  });
});
