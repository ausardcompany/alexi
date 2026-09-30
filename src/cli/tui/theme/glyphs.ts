/**
 * Centralized Unicode glyph constants for the TUI, with platform-aware
 * fallbacks for glyphs that are missing from common Linux monospace fonts
 * (DejaVu Sans Mono, Noto Sans Mono, Ubuntu Mono, etc.).
 *
 * Background (issue #1896, prompted by Cline PR #14686):
 * A handful of Unicode blocks used by TUIs render as "tofu" (blank box or
 * U+FFFD) on Linux terminals whose default monospace font does not carry
 * that block. `Miscellaneous Technical` (U+2300-U+23FF) and
 * `Supplemental Arrows-A` (U+27F0-U+27FF) are the two blocks that hit us
 * today. On macOS the built-in fallback font stack (SF Mono → Menlo →
 * Apple Symbols) fills the gap; on Linux there is no such implicit stack
 * for terminal emulators, so we ship a substitute glyph for those two
 * blocks and keep the "pretty" glyph everywhere else.
 *
 * The rule of thumb is:
 * - Glyphs in Box Drawing (U+2500-U+257F), Block Elements (U+2580-U+259F),
 *   Geometric Shapes (U+25A0-U+25FF), the Dingbats subset used here
 *   (U+2713, U+2717, U+276F), and common punctuation/currency
 *   (U+2013, U+2014, U+2026, U+2190-U+2193, U+00A3, U+00A5, U+20AC,
 *   U+00B7) are safe on every mainstream Linux mono font. Use them
 *   verbatim.
 * - Glyphs from Miscellaneous Technical (U+2300-U+23FF) or Supplemental
 *   Arrows-A (U+27F0-U+27FF) go through this module so we can serve a
 *   Linux-safe substitute.
 *
 * The `SAFE_GLYPH_RANGES` table below is consumed by
 * `tests/cli/tui/glyphs.test.ts`, which scans the entire TUI source tree
 * for stray non-ASCII characters and fails when one falls outside the
 * declared safe ranges without an explicit allow-list entry here.
 */

/**
 * Unicode ranges that we consider safely covered by DejaVu Sans Mono,
 * JetBrains Mono, and Noto Sans Mono. Any TUI glyph outside these ranges
 * MUST either live in `SAFE_INDIVIDUAL_GLYPHS` (single-code-point
 * allow-list) or be routed through {@link linuxSafeGlyph}.
 */
export const SAFE_GLYPH_RANGES: ReadonlyArray<readonly [number, number]> = [
  // ASCII printable + tab/newline
  [0x0009, 0x000a],
  [0x000d, 0x000d],
  [0x0020, 0x007e],
  // Latin-1 punctuation + currency we actually use
  [0x00a3, 0x00a3], // £
  [0x00a5, 0x00a5], // ¥
  [0x00b7, 0x00b7], // ·
  // General Punctuation subset (dashes, ellipsis)
  [0x2013, 0x2014], // – —
  [0x2026, 0x2026], // …
  // Currency Symbols
  [0x20ac, 0x20ac], // €
  // Arrows (left/up/right/down)
  [0x2190, 0x2193],
  // Box Drawing
  [0x2500, 0x257f],
  // Block Elements
  [0x2580, 0x259f],
  // Geometric Shapes
  [0x25a0, 0x25ff],
];

/**
 * Explicit allow-list for individual glyphs OUTSIDE the safe ranges above
 * that we still consider acceptable. Adding an entry here is a promise
 * that the glyph has been verified in DejaVu Sans Mono / JetBrains Mono /
 * Noto Sans Mono.
 *
 * Emoji code points from Miscellaneous Symbols and Pictographs
 * (U+1F300+) are intentionally NOT in this list — `usePermission.ts`
 * uses them but is UX-only and out of scope for the Linux mono-font
 * audit. See issue #1896.
 */
export const SAFE_INDIVIDUAL_GLYPHS: ReadonlySet<number> = new Set<number>([
  0x2713, // ✓ CHECK MARK (Dingbats)
  0x2717, // ✗ BALLOT X (Dingbats)
  0x276f, // ❯ HEAVY RIGHT-POINTING ANGLE QUOTATION MARK ORNAMENT
  0x26a0, // ⚠ WARNING SIGN (Miscellaneous Symbols) — widely rendered
]);

/**
 * Glyphs that we KNOW render as tofu on at least one common Linux mono
 * font (DejaVu Sans Mono is the primary offender for these two).
 *
 * Each entry names the semantic use, the "pretty" glyph, and a
 * Linux-safe substitute drawn from Box Drawing / Block Elements /
 * Geometric Shapes.
 */
const LINUX_UNSAFE_GLYPHS: Record<string, { pretty: string; linux: string }> = {
  // ⏸ PAUSE (Miscellaneous Technical) — missing on DejaVu Sans Mono.
  // U+25A0 (■ BLACK SQUARE) is the closest visual match that is
  // universally present.
  pause: { pretty: '\u23F8', linux: '\u25A0' },
  // ⟳ CLOCKWISE GAPPED CIRCLE ARROW (Supplemental Arrows-A) — missing on
  // DejaVu Sans Mono. Fallback to `*` since the closest visual match
  // (U+21BB "clockwise open circle arrow") also has patchy Linux
  // coverage, and the semantic is "activity in progress" — an ASCII
  // asterisk is unambiguous in-context.
  loading: { pretty: '\u27F3', linux: '*' },
};

/**
 * True when we are running on Linux and should substitute
 * font-fragile glyphs with widely-supported alternatives.
 *
 * Extracted as a function so tests can stub `process.platform` and so
 * bundlers / TS strictness does not fold this into a compile-time
 * constant.
 */
function isLinux(): boolean {
  return process.platform === 'linux';
}

/**
 * Resolve a Linux-safe glyph by semantic name. On macOS/Windows returns
 * the pretty glyph; on Linux returns the pre-baked substitute.
 *
 * @example
 *   const PAUSE_GLYPH = linuxSafeGlyph('pause'); // ⏸ or ■
 */
export function linuxSafeGlyph(key: keyof typeof LINUX_UNSAFE_GLYPHS): string {
  const entry = LINUX_UNSAFE_GLYPHS[key];
  return isLinux() ? entry.linux : entry.pretty;
}

/**
 * Test helper: expose the full mapping so `glyphs.test.ts` can assert
 * that every declared entry has BOTH a pretty and a linux glyph and that
 * neither is ASCII-only accidentally.
 */
export function _internalGlyphTable(): typeof LINUX_UNSAFE_GLYPHS {
  return LINUX_UNSAFE_GLYPHS;
}

/**
 * True when the given code point falls inside {@link SAFE_GLYPH_RANGES}
 * or {@link SAFE_INDIVIDUAL_GLYPHS}. Used by the glyph audit test.
 */
export function isSafeCodePoint(codePoint: number): boolean {
  if (codePoint < 0x80) {
    return true;
  }
  if (SAFE_INDIVIDUAL_GLYPHS.has(codePoint)) {
    return true;
  }
  for (const [start, end] of SAFE_GLYPH_RANGES) {
    if (codePoint >= start && codePoint <= end) {
      return true;
    }
  }
  return false;
}
