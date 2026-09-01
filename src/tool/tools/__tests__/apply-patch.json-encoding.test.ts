/**
 * Regression test for apply_patch result / permission metadata JSON encoding.
 *
 * Ports upstream kilocode commit `f7da00f`: previously the tool leaked
 * `movePath: undefined` into permission metadata, breaking JSON schema
 * encoding downstream. Alexi's apply-patch tool doesn't emit `movePath`,
 * but this test guards against future regressions by asserting that the
 * emitted `ToolResult` is JSON-encodable — i.e. no field carries
 * `undefined` such that `JSON.parse(JSON.stringify(...))` loses data or
 * introduces `null`s that would confuse downstream consumers.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import type { ToolContext } from '../../index.js';

describe('apply_patch tool — JSON-encodable result', () => {
  let workdir: string;

  beforeEach(() => {
    workdir = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'apply-patch-json-')));
  });

  afterEach(() => {
    try {
      fs.rmSync(workdir, { recursive: true, force: true });
    } catch {
      // best-effort
    }
  });

  it('produces a JSON-encodable success payload with no undefined fields', async () => {
    const { applyPatchTool } = await import('../apply-patch.js');
    const target = path.join(workdir, 'sample.txt');
    fs.writeFileSync(target, 'line1\nline2\nline3\n', 'utf-8');

    const patch = ['@@ -1,3 +1,3 @@', ' line1', '-line2', '+lineTWO', ' line3', ''].join('\n');

    const context: ToolContext = { workdir };
    const result = await applyPatchTool.executeUnsafe({ path: target, patch }, context);
    expect(result.success).toBe(true);

    // JSON round-trip must not throw and must not lose keys through
    // `undefined` erasure. If any field were `undefined`, it would be
    // silently dropped by JSON.stringify — assert that the parsed shape
    // has the same top-level `data` keys as the original.
    const encoded = JSON.stringify(result);
    expect(() => JSON.parse(encoded)).not.toThrow();
    const decoded = JSON.parse(encoded) as typeof result;
    expect(decoded.success).toBe(true);
    expect(decoded.data).toBeDefined();
    // No undefined-shaped fields should be present in the payload — a
    // `movePath: undefined` regression would fail this assertion because
    // the key would be silently stripped by JSON.stringify.
    for (const [key, value] of Object.entries(result.data ?? {})) {
      expect(value, `field "${key}" must not be undefined`).not.toBeUndefined();
    }
    expect(decoded.data).toEqual(result.data);
  });
});
