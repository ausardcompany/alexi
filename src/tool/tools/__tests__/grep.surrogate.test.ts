/**
 * Regression test for upstream opencode 6c035e1.
 *
 * The grep tool previously truncated match previews with a naive
 * `String.prototype.slice(0, N)`, which can split a UTF-16 surrogate pair
 * when the boundary falls between the high and low surrogate. That leaves
 * an isolated high surrogate at the end of the preview, which is invalid
 * unicode and is rejected by several downstream JSON serializers, including
 * SAP AI Core's message-shape validation.
 *
 * The fix trims any trailing high surrogate (`\uD800-\uDBFF`) *after* the
 * slice, so oversized lines that end in a multi-byte emoji still produce
 * valid unicode in the preview even if the emoji itself is dropped.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';
import { grepTool, _resetRgDetectionForTests } from '../grep.js';

describe('grep tool — surrogate pair truncation', () => {
  let workdir: string;

  beforeEach(async () => {
    // Force the JS path so this test does not depend on ripgrep being
    // installed on the CI runner. The rg path is protected by the same
    // regex; a full end-to-end rg check would require a real rg binary.
    process.env.ALEXI_DISABLE_RG = '1';
    _resetRgDetectionForTests();
    workdir = await fs.mkdtemp(path.join(os.tmpdir(), 'alexi-grep-surrogate-'));
  });

  afterEach(async () => {
    delete process.env.ALEXI_DISABLE_RG;
    _resetRgDetectionForTests();
    await fs.rm(workdir, { recursive: true, force: true });
  });

  it('does not split surrogate pairs in oversized line previews', async () => {
    // 200 is the JS-path preview cap. Position an emoji (a surrogate pair)
    // straddling the boundary at index 199 so a naive slice would leave a
    // lone high surrogate at the end.
    const prefix = 'needle' + 'x'.repeat(193); // len == 199
    const line = `${prefix}😀\n`; // emoji is at [199..200]
    const file = path.join(workdir, 'file.txt');
    await fs.writeFile(file, line, 'utf-8');

    const result = await grepTool.execute(
      { pattern: 'needle' },
      // Minimal ToolContext — grep only needs workdir + signal.
      { workdir, signal: undefined } as unknown as Parameters<typeof grepTool.execute>[1]
    );

    expect(result.success).toBe(true);
    if (!result.success || !result.data) throw new Error('grep failed');
    const match = result.data.matches[0];
    expect(match).toBeDefined();
    // The preview must not end with an unpaired high surrogate.
    const last = match.content.charCodeAt(match.content.length - 1);
    expect(last).toBeLessThan(0xd800);
    // And it must be valid UTF-16 end-to-end (no lone surrogates anywhere).
    for (let i = 0; i < match.content.length; i++) {
      const code = match.content.charCodeAt(i);
      if (code >= 0xd800 && code <= 0xdbff) {
        // High surrogate — must be followed by a low surrogate.
        const next = match.content.charCodeAt(i + 1);
        expect(next).toBeGreaterThanOrEqual(0xdc00);
        expect(next).toBeLessThanOrEqual(0xdfff);
        i++; // skip the paired low surrogate
      } else {
        expect(code < 0xdc00 || code > 0xdfff).toBe(true);
      }
    }
  });
});
