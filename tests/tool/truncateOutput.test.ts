import { describe, it, expect } from 'vitest';
import { truncateOutput, MAX_LINES, MAX_BYTES } from '../../src/tool/index.js';

const ELISION_MARKER_REGEX = /^\[\.\.\. (\d+) lines \/ (\d+) bytes elided \.\.\.\]$/;

describe('truncateOutput', () => {
  it('returns output unchanged when within both budgets', () => {
    const output = 'line one\nline two\nline three';
    const result = truncateOutput(output);

    expect(result.truncated).toBe(false);
    expect(result.content).toBe(output);
  });

  it('returns empty output unchanged', () => {
    const result = truncateOutput('');

    expect(result.truncated).toBe(false);
    expect(result.content).toBe('');
  });

  describe('line-budget head + tail truncation', () => {
    const overflow = 100;

    function buildLines(count: number): string {
      return Array.from({ length: count }, (_, i) => `line-${i + 1}`).join('\n');
    }

    it('keeps head + marker + tail with total of MAX_LINES + 1 lines', () => {
      const total = MAX_LINES + overflow;
      const output = buildLines(total);

      const result = truncateOutput(output);

      expect(result.truncated).toBe(true);
      const lines = result.content.split('\n');
      expect(lines.length).toBe(MAX_LINES + 1);

      const headCount = Math.floor(MAX_LINES / 2);
      const tailCount = MAX_LINES - headCount;
      // Head section: first `headCount` of original.
      for (let i = 0; i < headCount; i++) {
        expect(lines[i]).toBe(`line-${i + 1}`);
      }
      // Marker line.
      expect(lines[headCount]).toMatch(ELISION_MARKER_REGEX);
      // Tail section: last `tailCount` of original.
      for (let i = 0; i < tailCount; i++) {
        expect(lines[headCount + 1 + i]).toBe(`line-${total - tailCount + i + 1}`);
      }
    });

    it('preserves the LAST line (failing assertion case)', () => {
      const total = MAX_LINES + overflow;
      const lines = Array.from({ length: total - 1 }, (_, i) => `setup line ${i + 1}`);
      lines.push('AssertionError: expected 1 to equal 2 -- FAILED');
      const output = lines.join('\n');

      const result = truncateOutput(output);

      expect(result.truncated).toBe(true);
      const tailLine = result.content.split('\n').pop();
      expect(tailLine).toBe('AssertionError: expected 1 to equal 2 -- FAILED');
    });

    it('reports omitted line and byte counts in the elision marker', () => {
      const total = MAX_LINES + overflow;
      const output = buildLines(total);

      const result = truncateOutput(output);
      const lines = result.content.split('\n');
      const headCount = Math.floor(MAX_LINES / 2);
      const markerLine = lines[headCount];

      const match = markerLine.match(ELISION_MARKER_REGEX);
      expect(match).not.toBeNull();
      const omittedLines = Number(match![1]);
      const omittedBytes = Number(match![2]);
      expect(omittedLines).toBe(overflow);
      expect(omittedBytes).toBeGreaterThan(0);
    });

    it('handles odd MAX_LINES split correctly (head=floor, tail=remainder)', () => {
      // MAX_LINES is even (2000) in production, but the contract is
      // documented as floor(MAX_LINES/2) head + remainder tail. Verify
      // the split is exhaustive: head + 1 (marker) + tail = MAX_LINES + 1.
      const total = MAX_LINES + 1;
      const output = Array.from({ length: total }, (_, i) => `L${i}`).join('\n');

      const result = truncateOutput(output);
      const lines = result.content.split('\n');
      const headCount = Math.floor(MAX_LINES / 2);
      const tailCount = MAX_LINES - headCount;

      expect(lines.length).toBe(headCount + 1 + tailCount);
      expect(lines[0]).toBe('L0');
      expect(lines[lines.length - 1]).toBe(`L${total - 1}`);
    });
  });

  describe('byte-budget head + tail truncation', () => {
    it('keeps head + marker + tail under MAX_BYTES for a single very long line', () => {
      // No newlines: forces the boundary-snap code to fall back to UTF-8
      // codepoint boundaries.
      const longLine = 'a'.repeat(MAX_BYTES * 2);

      const result = truncateOutput(longLine);

      expect(result.truncated).toBe(true);
      expect(Buffer.byteLength(result.content, 'utf-8')).toBeLessThanOrEqual(MAX_BYTES);

      const parts = result.content.split('\n');
      // Expect exactly: head, marker, tail (3 segments).
      expect(parts.length).toBe(3);
      const [head, marker, tail] = parts;
      expect(head.length).toBeGreaterThan(0);
      expect(tail.length).toBeGreaterThan(0);
      expect(marker).toMatch(ELISION_MARKER_REGEX);
      // For an all-'a' input, the head must be the first run of 'a's and
      // the tail the last run of 'a's.
      expect(/^a+$/.test(head)).toBe(true);
      expect(/^a+$/.test(tail)).toBe(true);
    });

    it('does not split UTF-8 codepoints when snapping head/tail', () => {
      // A long stream of 4-byte emoji codepoints (U+1F680 ROCKET) with no
      // newlines. If we sliced by raw byte index without snapping to a
      // codepoint boundary, the resulting string would contain the U+FFFD
      // replacement character.
      const filler = '\uD83D\uDE80'.repeat(Math.ceil(MAX_BYTES / 2)); // ~MAX_BYTES * 2 bytes

      const result = truncateOutput(filler);

      expect(result.truncated).toBe(true);
      expect(result.content.includes('\uFFFD')).toBe(false);
      expect(Buffer.byteLength(result.content, 'utf-8')).toBeLessThanOrEqual(MAX_BYTES);
    });

    it('reports omitted line and byte counts in the marker for byte-budget path', () => {
      const longLine = 'b'.repeat(MAX_BYTES * 2);

      const result = truncateOutput(longLine);

      const parts = result.content.split('\n');
      const marker = parts[1];
      const match = marker.match(ELISION_MARKER_REGEX);
      expect(match).not.toBeNull();
      const omittedBytes = Number(match![2]);
      expect(omittedBytes).toBeGreaterThan(0);
    });

    it('snaps head and tail to newline boundaries when newlines are present', () => {
      // Many short lines, total bytes >> MAX_BYTES. Head should end at a
      // newline boundary; tail should start at the start of a complete
      // line.
      const linesNeeded = Math.ceil((MAX_BYTES * 4) / 20);
      const lines = Array.from(
        { length: linesNeeded },
        (_, i) => `line-${String(i).padStart(8, '0')}`
      );
      const output = lines.join('\n');

      const result = truncateOutput(output);

      expect(result.truncated).toBe(true);
      // Total bytes within MAX_BYTES.
      expect(Buffer.byteLength(result.content, 'utf-8')).toBeLessThanOrEqual(MAX_BYTES);

      // The first line should be a complete `line-NNNNNNNN` token, and so
      // should the last line.
      const resultLines = result.content.split('\n');
      expect(resultLines[0]).toMatch(/^line-\d{8}$/);
      expect(resultLines[resultLines.length - 1]).toMatch(/^line-\d{8}$/);
    });
  });

  describe('combined line + byte budget', () => {
    it('still produces a truncated head+tail output when both budgets are exceeded', () => {
      // Many lines, each long enough that the byte budget also fires
      // after line-truncation.
      const lineContent = 'x'.repeat(80);
      const totalLines = MAX_LINES + 1000;
      const output = Array.from({ length: totalLines }, (_, i) => `${lineContent}-${i}`).join('\n');

      const result = truncateOutput(output);

      expect(result.truncated).toBe(true);
      expect(Buffer.byteLength(result.content, 'utf-8')).toBeLessThanOrEqual(MAX_BYTES);
      // Head should still come from the very start of the input and tail
      // from the very end. With identical line content prefixes only the
      // suffix index distinguishes them.
      const resultLines = result.content.split('\n');
      // Find first non-marker line.
      const firstLine = resultLines.find((l) => !ELISION_MARKER_REGEX.test(l));
      const lastLine = [...resultLines].reverse().find((l) => !ELISION_MARKER_REGEX.test(l));
      expect(firstLine).toBeDefined();
      expect(lastLine).toBeDefined();
      // Last preserved line must end with the highest index.
      expect(lastLine!.endsWith(`-${totalLines - 1}`)).toBe(true);
    });
  });
});
