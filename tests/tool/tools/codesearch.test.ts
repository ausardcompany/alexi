/**
 * Tests for codesearch output cap (MAX_MATCHES + truncateOutput).
 *
 * Issue #791: codesearch must cap output at MAX_MATCHES = 100 entries and
 * 50KB (MAX_BYTES) via the shared truncateOutput helper, populate
 * `truncated`/`hint` on the result, and document the cap in the tool
 * description string.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as fs from 'fs/promises';
import * as path from 'path';
import os from 'os';

// Bypass permission checks in defineTool for these tests.
vi.mock('../../../src/tool/index.js', async () => {
  const actual = await vi.importActual<typeof import('../../../src/tool/index.js')>(
    '../../../src/tool/index.js'
  );
  return {
    ...actual,
    defineTool: (def: unknown) => {
      const d = def as {
        name: string;
        description: string;
        parameters: unknown;
        execute: (...args: unknown[]) => unknown;
      };
      return {
        ...d,
        execute: d.execute,
        executeUnsafe: d.execute,
        toFunctionSchema: () => ({
          name: d.name,
          description: d.description,
          parameters: {},
        }),
      };
    },
  };
});

import { codesearchTool } from '../../../src/tool/tools/codesearch.js';
import type { ToolContext } from '../../../src/tool/index.js';

const MAX_MATCHES = 100;

describe('codesearch output cap', () => {
  let tempDir: string;
  let context: ToolContext;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'codesearch-cap-test-'));
    context = { workdir: tempDir };
  });

  afterEach(async () => {
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  it('documents the match cap in the tool description', () => {
    // Description must mention the MAX_MATCHES number and steer the model
    // towards the include filter for narrowing.
    expect(codesearchTool.description).toMatch(/at most\s+100\s+matches/);
    expect(codesearchTool.description).toMatch(/include/);
  });

  it('returns truncated=false and no hint for an under-cap workdir', async () => {
    // Tiny workdir with exactly 2 matches of a unique token.
    await fs.writeFile(path.join(tempDir, 'a.ts'), 'const fooMarker = 1;\n');
    await fs.writeFile(path.join(tempDir, 'b.ts'), 'const fooMarker = 2;\n');

    const result = await codesearchTool.execute(
      {
        query: 'fooMarker',
        searchType: 'content',
        contextLines: 0,
        maxResults: 100,
        caseSensitive: false,
      },
      context
    );

    expect(result.success).toBe(true);
    expect(result.data?.matches.length).toBeLessThanOrEqual(MAX_MATCHES);
    expect(result.data?.truncated).toBe(false);
    expect(result.data?.hint).toBeUndefined();
    expect(result.truncated).toBe(false);
    expect(result.hint).toBeUndefined();
  });

  it('caps matches at MAX_MATCHES and sets truncated=true with a hint', async () => {
    // Synthesise > MAX_MATCHES files each containing the same unique token.
    const fileCount = MAX_MATCHES + 25;
    for (let i = 0; i < fileCount; i++) {
      // Use a bare token so the regex compiles and matches once per file.
      await fs.writeFile(path.join(tempDir, `f${i}.ts`), `const widgetToken = ${i};\n`);
    }

    const result = await codesearchTool.execute(
      {
        query: 'widgetToken',
        searchType: 'content',
        contextLines: 0,
        // Caller asks for more than the hard cap; hard cap must still apply.
        maxResults: 500,
        caseSensitive: false,
      },
      context
    );

    expect(result.success).toBe(true);
    expect(result.data?.matches.length).toBeLessThanOrEqual(MAX_MATCHES);
    expect(result.data?.truncated).toBe(true);
    expect(result.data?.hint).toBe(
      'Result truncated. Narrow the query with the include filter or a more specific pattern.'
    );
    expect(result.truncated).toBe(true);
    expect(result.hint).toBe(
      'Result truncated. Narrow the query with the include filter or a more specific pattern.'
    );
    // Total matches reported in raw form (pre-cap) so the model can see
    // how much it missed.
    expect(result.data?.totalMatches).toBeGreaterThanOrEqual(fileCount);
  });
});
