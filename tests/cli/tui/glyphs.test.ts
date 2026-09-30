/**
 * Glyph audit for `src/cli/tui/**` — issue #1896.
 *
 * Scans every TUI source file for non-ASCII code points and asserts that
 * each one is either:
 *  - inside a Unicode range we consider mono-font-safe on Linux
 *    (Box Drawing, Block Elements, Geometric Shapes, arrows, currency,
 *    General Punctuation subset — see {@link SAFE_GLYPH_RANGES}),
 *  - listed in the individual-glyph allow-list
 *    ({@link SAFE_INDIVIDUAL_GLYPHS}), or
 *  - routed through `linuxSafeGlyph()` (so the actual glyph emitted at
 *    runtime is already substituted on Linux).
 *
 * Adding a new fragile glyph to TUI code triggers this test and forces
 * the author to either pick a safer glyph or add a fallback in
 * `src/cli/tui/theme/glyphs.ts`.
 */

import * as path from 'node:path';
import { promises as fs } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, it, expect, afterEach } from 'vitest';

import {
  SAFE_GLYPH_RANGES,
  SAFE_INDIVIDUAL_GLYPHS,
  _internalGlyphTable,
  isSafeCodePoint,
  linuxSafeGlyph,
} from '../../../src/cli/tui/theme/glyphs.js';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const TUI_ROOT = path.resolve(HERE, '../../../src/cli/tui');

// Emoji-heavy files whose glyphs are UX-only (permission dialog icons).
// Out of scope for the Linux mono-font audit — issue #1896 explicitly
// targets the compact TUI glyphs, not full-width emoji.
const AUDIT_EXCLUDES: ReadonlySet<string> = new Set([
  path.resolve(TUI_ROOT, 'hooks/usePermission.ts'),
]);

async function walk(dir: string): Promise<string[]> {
  const out: string[] = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...(await walk(full)));
    } else if (
      entry.isFile() &&
      (full.endsWith('.ts') || full.endsWith('.tsx')) &&
      !full.endsWith('.d.ts')
    ) {
      out.push(full);
    }
  }
  return out;
}

interface Offender {
  file: string;
  line: number;
  column: number;
  codePoint: number;
  char: string;
  snippet: string;
}

/**
 * Strip TypeScript block and line comments from source. The audit only
 * cares about glyphs that render at runtime; documentation and inline
 * explanations of unsafe code points must be readable. We replace
 * comment characters with spaces (preserving column positions).
 */
function stripComments(source: string): string {
  const out: string[] = [];
  let i = 0;
  const n = source.length;
  let inBlock = false;
  let inLine = false;
  let inString: '"' | "'" | '`' | null = null;
  while (i < n) {
    const ch = source[i];
    const next = i + 1 < n ? source[i + 1] : '';
    if (inBlock) {
      if (ch === '*' && next === '/') {
        out.push('  ');
        i += 2;
        inBlock = false;
        continue;
      }
      out.push(ch === '\n' ? '\n' : ' ');
      i++;
      continue;
    }
    if (inLine) {
      if (ch === '\n') {
        inLine = false;
        out.push('\n');
        i++;
        continue;
      }
      out.push(' ');
      i++;
      continue;
    }
    if (inString) {
      out.push(ch);
      if (ch === '\\' && i + 1 < n) {
        out.push(source[i + 1]);
        i += 2;
        continue;
      }
      if (ch === inString) {
        inString = null;
      }
      i++;
      continue;
    }
    if (ch === '/' && next === '*') {
      inBlock = true;
      out.push('  ');
      i += 2;
      continue;
    }
    if (ch === '/' && next === '/') {
      inLine = true;
      out.push('  ');
      i += 2;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') {
      inString = ch;
      out.push(ch);
      i++;
      continue;
    }
    out.push(ch);
    i++;
  }
  return out.join('');
}

async function collectOffenders(): Promise<Offender[]> {
  const files = (await walk(TUI_ROOT)).filter((f) => !AUDIT_EXCLUDES.has(f));
  const offenders: Offender[] = [];
  for (const file of files) {
    const raw = await fs.readFile(file, 'utf8');
    const content = stripComments(raw);
    const lines = content.split(/\r?\n/);
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      for (let j = 0; j < line.length; j++) {
        const codePoint = line.codePointAt(j);
        if (codePoint === undefined) {
          continue;
        }
        // Advance past the low surrogate for supplementary characters
        // so we do not double-count the pair.
        if (codePoint > 0xffff) {
          j++;
        }
        if (codePoint < 0x80) {
          continue;
        }
        if (isSafeCodePoint(codePoint)) {
          continue;
        }
        offenders.push({
          file: path.relative(TUI_ROOT, file),
          line: i + 1,
          column: j + 1,
          codePoint,
          char: String.fromCodePoint(codePoint),
          snippet: line.trim().slice(0, 120),
        });
      }
    }
  }
  return offenders;
}

describe('TUI Unicode glyph audit (issue #1896)', () => {
  it('safe-range table is non-empty and monotonic', () => {
    expect(SAFE_GLYPH_RANGES.length).toBeGreaterThan(0);
    for (const [start, end] of SAFE_GLYPH_RANGES) {
      expect(start).toBeLessThanOrEqual(end);
      expect(start).toBeGreaterThanOrEqual(0);
      expect(end).toBeLessThanOrEqual(0x10ffff);
    }
  });

  it('individual-glyph allow-list contains only non-ASCII entries', () => {
    for (const cp of SAFE_INDIVIDUAL_GLYPHS) {
      expect(cp).toBeGreaterThanOrEqual(0x80);
    }
  });

  it('isSafeCodePoint agrees with the safe ranges + allow-list', () => {
    expect(isSafeCodePoint(0x41)).toBe(true); // A — ASCII
    expect(isSafeCodePoint(0x2500)).toBe(true); // ─ — box drawing
    expect(isSafeCodePoint(0x25a0)).toBe(true); // ■ — geometric shapes
    expect(isSafeCodePoint(0x2713)).toBe(true); // ✓ — allow-list
    expect(isSafeCodePoint(0x23f8)).toBe(false); // ⏸ — must go through linuxSafeGlyph
    expect(isSafeCodePoint(0x27f3)).toBe(false); // ⟳ — must go through linuxSafeGlyph
  });

  it('every TUI source file uses only mono-font-safe glyphs', async () => {
    const offenders = await collectOffenders();
    // Fail with a readable per-line breakdown so the author can either
    // pick a safer glyph or add a fallback in theme/glyphs.ts.
    if (offenders.length > 0) {
      const rendered = offenders
        .map(
          (o) =>
            `  ${o.file}:${o.line}:${o.column}  U+${o.codePoint
              .toString(16)
              .toUpperCase()
              .padStart(4, '0')} ${JSON.stringify(o.char)}  in: ${o.snippet}`
        )
        .join('\n');
      throw new Error(
        `Found ${offenders.length} font-fragile glyph(s) in src/cli/tui/**.\n` +
          `Route them through linuxSafeGlyph() in src/cli/tui/theme/glyphs.ts,\n` +
          `pick a safer alternative, or add to SAFE_INDIVIDUAL_GLYPHS:\n${rendered}`
      );
    }
    expect(offenders).toEqual([]);
  });
});

describe('linuxSafeGlyph fallbacks', () => {
  const originalPlatform = process.platform;

  afterEach(() => {
    Object.defineProperty(process, 'platform', {
      value: originalPlatform,
      configurable: true,
    });
  });

  function setPlatform(p: NodeJS.Platform): void {
    Object.defineProperty(process, 'platform', { value: p, configurable: true });
  }

  it('exposes both a pretty and a linux glyph for every entry', () => {
    const table = _internalGlyphTable();
    const keys = Object.keys(table);
    expect(keys.length).toBeGreaterThan(0);
    for (const key of keys) {
      const entry = table[key];
      expect(entry.pretty.length).toBeGreaterThan(0);
      expect(entry.linux.length).toBeGreaterThan(0);
      // The pretty glyph is expected to be the non-ASCII "nice" one;
      // the linux glyph must render without the pretty glyph's code
      // point so we know we actually substituted.
      const prettyCP = entry.pretty.codePointAt(0);
      const linuxCP = entry.linux.codePointAt(0);
      expect(prettyCP).toBeDefined();
      expect(linuxCP).toBeDefined();
      expect(linuxCP).not.toBe(prettyCP);
    }
  });

  it('returns the pretty glyph on darwin', () => {
    setPlatform('darwin');
    expect(linuxSafeGlyph('pause')).toBe('\u23F8');
    expect(linuxSafeGlyph('loading')).toBe('\u27F3');
  });

  it('returns the pretty glyph on win32', () => {
    setPlatform('win32');
    expect(linuxSafeGlyph('pause')).toBe('\u23F8');
    expect(linuxSafeGlyph('loading')).toBe('\u27F3');
  });

  it('returns the safe substitute on linux', () => {
    setPlatform('linux');
    expect(linuxSafeGlyph('pause')).toBe('\u25A0');
    // Loading substitute is ASCII `*` to avoid the U+21BB fallback
    // which also has patchy Linux coverage — see comment in glyphs.ts.
    expect(linuxSafeGlyph('loading')).toBe('*');
  });
});
