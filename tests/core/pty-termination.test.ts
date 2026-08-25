import { describe, expect, it } from 'vitest';

import { tree } from '../../src/core/pty/termination.js';

describe('core/pty/termination.tree', () => {
  it('returns a non-empty process list on any Node platform', async () => {
    // On Linux we hit the /proc code path; elsewhere we fall back to ps.
    // Either way, the test process itself must appear in the returned list.
    const rows = await tree();
    expect(Array.isArray(rows)).toBe(true);
    expect(rows.length).toBeGreaterThan(0);
    const self = rows.find((r) => r.pid === process.pid);
    expect(self).toBeDefined();
    expect(typeof self?.parent).toBe('number');
  });

  it('tolerates vanished /proc entries without throwing', async () => {
    // This is a smoke test — the fix `aadded4a3` guarantees that any
    // race between readdir and readFile is silently dropped. We can't
    // easily force a race in a unit test, but we can at least assert
    // that multiple back-to-back walks all succeed under high fork
    // pressure would have caught the original crash regression.
    for (let i = 0; i < 5; i++) {
      const rows = await tree();
      expect(rows.length).toBeGreaterThan(0);
    }
  });
});
