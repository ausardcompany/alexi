/**
 * Tests for {@link formatXlsxCell} — ports the upstream kilocode xlsx
 * cell-formatting fix (opencode `packages/opencode/test/kilocode/read-xlsx.test.ts`).
 *
 * The underlying bugs were:
 *   1. Spreadsheet times (e.g. `14:05`) parse as `14:04:59.999` due to
 *      floating-point error in SheetJS — round away.
 *   2. Month-only / time-only / datetime cells were incorrectly
 *      flattened to date-only ISO strings.
 */

import { describe, expect, it } from 'vitest';
import { formatXlsxCell } from '../read-office.js';

describe('formatXlsxCell', () => {
  it('returns empty string for missing cells and null values', () => {
    expect(formatXlsxCell(undefined)).toBe('');
    expect(formatXlsxCell({ t: 'n', v: null as unknown as number })).toBe('');
    expect(formatXlsxCell({ t: 'n', v: undefined })).toBe('');
  });

  it('returns the formatted error label for error cells', () => {
    expect(formatXlsxCell({ t: 'e', v: 42, w: '#DIV/0!' })).toBe('[Error: #DIV/0!]');
    expect(formatXlsxCell({ t: 'e', v: 7 })).toBe('[Error: 7]');
  });

  it('formats a time-only cell as HH:MM:SS, rounding away SheetJS float error', () => {
    // 14:05 is stored as a 1899-12-30 date; SheetJS parses it as 14:04:59.999.
    const v = new Date('1899-12-30T14:04:59.999Z');
    expect(formatXlsxCell({ t: 'd', v, z: 'h:mm', w: '14:05' })).toBe('14:05');
  });

  it('prefers the SheetJS-formatted `w` value for time-only cells when present', () => {
    const v = new Date('1899-12-30T14:04:59.999Z');
    expect(formatXlsxCell({ t: 'd', v, z: 'h:mm:ss', w: '14:05:00' })).toBe('14:05:00');
  });

  it('falls back to the ISO time slice when `w` is absent for time-only cells', () => {
    const v = new Date('1899-12-30T14:05:00.000Z');
    expect(formatXlsxCell({ t: 'd', v, z: 'h:mm:ss' })).toBe('14:05:00');
  });

  it('reads elapsed [h]:mm formats as the cell shows (duration)', () => {
    const v = new Date('1899-12-30T25:30:00.000Z');
    // Elapsed-hour format must be treated as time, not date-only.
    expect(formatXlsxCell({ t: 'd', v, z: '[h]:mm', w: '25:30' })).toBe('25:30');
  });

  it('formats a date-only cell as YYYY-MM-DD', () => {
    const v = new Date('2024-03-15T00:00:00.000Z');
    expect(formatXlsxCell({ t: 'd', v, z: 'yyyy-mm-dd' })).toBe('2024-03-15');
  });

  it('formats a full datetime cell as "YYYY-MM-DD HH:MM:SS"', () => {
    const v = new Date('2024-03-15T09:30:00.000Z');
    expect(formatXlsxCell({ t: 'd', v, z: 'yyyy-mm-dd h:mm:ss' })).toBe('2024-03-15 09:30:00');
  });

  it('rounds datetime values away from the SheetJS float error', () => {
    // 2024-03-15 14:05 can show up as 14:04:59.999 under cellDates: true.
    const v = new Date('2024-03-15T14:04:59.999Z');
    expect(formatXlsxCell({ t: 'd', v, z: 'yyyy-mm-dd h:mm:ss' })).toBe('2024-03-15 14:05:00');
  });

  it('stringifies non-Date values of type "d" without throwing', () => {
    expect(formatXlsxCell({ t: 'd', v: 'not-a-date' })).toBe('not-a-date');
  });

  it('appends hyperlink target when present', () => {
    expect(formatXlsxCell({ t: 's', v: 'SAP', w: 'SAP', l: { Target: 'https://sap.com' } })).toBe(
      'SAP (https://sap.com)'
    );
  });

  it('prefers formatted `w` text for non-date cells', () => {
    expect(formatXlsxCell({ t: 'n', v: 1234.5, w: '1,234.50' })).toBe('1,234.50');
    expect(formatXlsxCell({ t: 'n', v: 42 })).toBe('42');
  });
});
