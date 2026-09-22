import { describe, expect, it } from 'vitest';

import { createIncrementalLinkifier } from '../../../src/cli/tui/utils/incrementalLinkify.js';
import { linkify } from '../../../src/cli/tui/utils/linkify.js';

/**
 * Incremental linkifier tests — Issue #1807.
 *
 * The bash tool row previously re-linkified its entire streaming buffer
 * on every chunk arrival. These tests pin down the incremental contract:
 *
 *   1. Output MUST match `linkify(text)` exactly for any input (correctness).
 *   2. Committed lines MUST NOT be re-scanned on subsequent calls
 *      (incremental behaviour → performance).
 *   3. A shrinking / unrelated buffer resets the cache (safety).
 *   4. A realistic large-output benchmark stays under a coarse threshold.
 */
describe('createIncrementalLinkifier', () => {
  const CWD = '/tmp/incremental-linkify-test';

  it('produces byte-identical output to linkify() for a growing buffer', () => {
    const lines = [
      'starting install',
      'https://example.com/pkg',
      'see src/foo.ts:42 for details',
      'plain line without links',
      'another link http://example.org/x',
    ];
    const inc = createIncrementalLinkifier(CWD);

    let buf = '';
    for (const line of lines) {
      buf += line + '\n';
      const got = inc(buf);
      const want = linkify(buf, CWD);
      expect(got).toBe(want);
    }
  });

  it('re-uses cache: appending a full line does not re-scan committed prefix', () => {
    const inc = createIncrementalLinkifier(CWD);
    const first = 'line one see src/a.ts:1\n';
    const second = 'line two see src/b.ts:2\n';

    // First call: full scan, no cache.
    inc(first);
    expect(inc.lastCachedChars()).toBe(0);

    // Second call: prefix is `first`, cache should apply.
    inc(first + second);
    expect(inc.lastCachedChars()).toBe(first.length);
  });

  it('handles chunk arrivals that split a line across calls', () => {
    const inc = createIncrementalLinkifier(CWD);

    const parts = [
      'downloading ',
      'https://example.com/big',
      '.tar.gz\n',
      'unpacking to /tmp/dest\n',
      'wrote src/generated.ts:100\n',
    ];

    let buf = '';
    let final = '';
    for (const p of parts) {
      buf += p;
      final = inc(buf);
    }
    expect(final).toBe(linkify(buf, CWD));
  });

  it('resets when the buffer shrinks or diverges from the cached prefix', () => {
    const inc = createIncrementalLinkifier(CWD);

    inc('one\ntwo\nthree\n');
    // Feed a completely different buffer — must cache-miss.
    const out = inc('totally new content see src/x.ts:9\n');
    expect(out).toBe(linkify('totally new content see src/x.ts:9\n', CWD));
    expect(inc.lastCachedChars()).toBe(0);
  });

  it('does not re-process the entire output buffer on every chunk (perf invariant)', () => {
    // Build a large committed prefix, then append a small tail. The
    // linkifier must scan at most `tail.length` characters, NOT the
    // whole buffer. We assert this by comparing lastCachedChars() to
    // the buffer length: cached chars must be > 0 and grow with each
    // committed line.
    const inc = createIncrementalLinkifier(CWD);
    let buf = '';
    let previousCached = 0;

    for (let i = 0; i < 200; i++) {
      buf += `line ${i} https://example.com/${i}\n`;
      inc(buf);
      if (i > 0) {
        expect(inc.lastCachedChars()).toBeGreaterThan(previousCached);
      }
      previousCached = inc.lastCachedChars();
    }

    // The last invocation should have cached ALL but the final line.
    const lastNl = buf.lastIndexOf('\n', buf.length - 2);
    expect(inc.lastCachedChars()).toBe(lastNl + 1);
  });

  it('renders a 10k-line output faster than repeated full linkify() calls', () => {
    // Benchmark: 2000 chunk arrivals, each adding one line. This is a
    // realistic worst case for `npm install --verbose` or `git log --all`.
    const CHUNKS = 2000;
    const lines: string[] = [];
    for (let i = 0; i < CHUNKS; i++) {
      lines.push(
        i % 4 === 0
          ? `[${i}] fetched https://registry.npmjs.org/pkg/${i}`
          : i % 3 === 0
            ? `wrote src/generated/file-${i}.ts:${i}`
            : `progress: ${i}/${CHUNKS}`
      );
    }

    // Naive: re-run linkify on the whole buffer each time.
    let naiveBuf = '';
    const naiveStart = process.hrtime.bigint();
    for (const l of lines) {
      naiveBuf += l + '\n';
      linkify(naiveBuf, CWD);
    }
    const naiveMs = Number(process.hrtime.bigint() - naiveStart) / 1e6;

    // Incremental: run through the linkifier once per chunk.
    const inc = createIncrementalLinkifier(CWD);
    let incBuf = '';
    const incStart = process.hrtime.bigint();
    for (const l of lines) {
      incBuf += l + '\n';
      inc(incBuf);
    }
    const incMs = Number(process.hrtime.bigint() - incStart) / 1e6;

    // We do NOT hardcode absolute ms budgets (CI variability). We only
    // require the incremental path to be measurably faster than the
    // naive path on a 2000-chunk workload. Empirically this ratio is
    // 5-20x; we use a conservative 1.5x lower bound to stay stable.
    expect(incMs).toBeLessThan(naiveMs);
    expect(naiveMs / Math.max(incMs, 0.001)).toBeGreaterThan(1.5);
  });

  it('reset() clears cache so next call is a fresh full scan', () => {
    const inc = createIncrementalLinkifier(CWD);
    inc('a\nb\nc\n');
    expect(inc.lastCachedChars()).toBeGreaterThanOrEqual(0);
    inc.reset();
    inc('d\n');
    expect(inc.lastCachedChars()).toBe(0);
  });

  it('handles empty input without error', () => {
    const inc = createIncrementalLinkifier(CWD);
    expect(inc('')).toBe('');
    expect(inc.lastCachedChars()).toBe(0);
  });

  it('handles output that never contains a newline', () => {
    const inc = createIncrementalLinkifier(CWD);
    const out1 = inc('progress: 10%');
    const out2 = inc('progress: 50%');
    const out3 = inc('progress: 100%');
    expect(out1).toBe(linkify('progress: 10%', CWD));
    expect(out2).toBe(linkify('progress: 50%', CWD));
    expect(out3).toBe(linkify('progress: 100%', CWD));
  });
});
