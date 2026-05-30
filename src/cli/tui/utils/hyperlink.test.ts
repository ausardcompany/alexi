/**
 * Tests for OSC-8 hyperlink helper.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { hyperlink, supportsHyperlinks } from './hyperlink.js';

const OSC = '\u001B]';
const ST = '\u001B\\';

describe('supportsHyperlinks', () => {
  let originalIsTTY: boolean | undefined;

  beforeEach(() => {
    originalIsTTY = process.stdout.isTTY;
    // Default: pretend we are running in a TTY so individual tests opt in/out
    // by adjusting env vars or `isTTY` explicitly.
    Object.defineProperty(process.stdout, 'isTTY', {
      configurable: true,
      writable: true,
      value: true,
    });
    // Reset env vars that affect detection.
    vi.stubEnv('FORCE_HYPERLINK', '');
    vi.stubEnv('NO_HYPERLINK', '');
    vi.stubEnv('TERM_PROGRAM', '');
    vi.stubEnv('TERM', '');
    vi.stubEnv('WT_SESSION', '');
  });

  afterEach(() => {
    Object.defineProperty(process.stdout, 'isTTY', {
      configurable: true,
      writable: true,
      value: originalIsTTY,
    });
    vi.unstubAllEnvs();
  });

  it('returns false when stdout is not a TTY', () => {
    Object.defineProperty(process.stdout, 'isTTY', {
      configurable: true,
      writable: true,
      value: false,
    });
    vi.stubEnv('TERM_PROGRAM', 'iTerm.app');
    expect(supportsHyperlinks()).toBe(false);
  });

  it('returns true when FORCE_HYPERLINK=1 is set, even without a TTY', () => {
    Object.defineProperty(process.stdout, 'isTTY', {
      configurable: true,
      writable: true,
      value: false,
    });
    vi.stubEnv('FORCE_HYPERLINK', '1');
    expect(supportsHyperlinks()).toBe(true);
  });

  it('returns false when NO_HYPERLINK=1 is set, even on a supporting terminal', () => {
    vi.stubEnv('NO_HYPERLINK', '1');
    vi.stubEnv('TERM_PROGRAM', 'iTerm.app');
    expect(supportsHyperlinks()).toBe(false);
  });

  it.each([
    ['iTerm.app'],
    ['WezTerm'],
    ['ghostty'],
    ['Apple_Terminal'],
    ['vscode'],
    ['cursor'],
    ['Hyper'],
    ['WarpTerminal'],
  ])('returns true for TERM_PROGRAM=%s', (termProgram) => {
    vi.stubEnv('TERM_PROGRAM', termProgram);
    expect(supportsHyperlinks()).toBe(true);
  });

  it('returns true when TERM contains "kitty"', () => {
    vi.stubEnv('TERM', 'xterm-kitty');
    expect(supportsHyperlinks()).toBe(true);
  });

  it('returns true when WT_SESSION is set (Windows Terminal)', () => {
    vi.stubEnv('WT_SESSION', 'abc-123');
    expect(supportsHyperlinks()).toBe(true);
  });

  it('returns false for unknown TERM_PROGRAM with no other hints', () => {
    vi.stubEnv('TERM_PROGRAM', 'SomeUnknownTerm');
    expect(supportsHyperlinks()).toBe(false);
  });

  it('honors a custom stream argument with isTTY=false', () => {
    const fakeStream = { isTTY: false } as NodeJS.WriteStream;
    vi.stubEnv('TERM_PROGRAM', 'iTerm.app');
    expect(supportsHyperlinks(fakeStream)).toBe(false);
  });
});

describe('hyperlink', () => {
  let originalIsTTY: boolean | undefined;

  beforeEach(() => {
    originalIsTTY = process.stdout.isTTY;
    Object.defineProperty(process.stdout, 'isTTY', {
      configurable: true,
      writable: true,
      value: false,
    });
    vi.stubEnv('FORCE_HYPERLINK', '');
    vi.stubEnv('NO_HYPERLINK', '');
    vi.stubEnv('TERM_PROGRAM', '');
    vi.stubEnv('TERM', '');
    vi.stubEnv('WT_SESSION', '');
  });

  afterEach(() => {
    Object.defineProperty(process.stdout, 'isTTY', {
      configurable: true,
      writable: true,
      value: originalIsTTY,
    });
    vi.unstubAllEnvs();
  });

  it('returns plain url when terminal does not support hyperlinks', () => {
    expect(hyperlink('https://example.com')).toBe('https://example.com');
  });

  it('returns "label (url)" when label is provided and terminal does not support hyperlinks', () => {
    expect(hyperlink('https://example.com', 'Click')).toBe('Click (https://example.com)');
  });

  it('returns just url when label equals url and terminal does not support hyperlinks', () => {
    expect(hyperlink('https://example.com', 'https://example.com')).toBe('https://example.com');
  });

  it('emits OSC-8 sequence when FORCE_HYPERLINK=1', () => {
    vi.stubEnv('FORCE_HYPERLINK', '1');
    const out = hyperlink('https://example.com');
    expect(out).toBe(`${OSC}8;;https://example.com${ST}https://example.com${OSC}8;;${ST}`);
    expect(out).toContain('\u001B]8;;https://example.com');
    expect(out).toContain('\u001B]8;;\u001B\\');
  });

  it('emits OSC-8 sequence with label when FORCE_HYPERLINK=1', () => {
    vi.stubEnv('FORCE_HYPERLINK', '1');
    const out = hyperlink('https://example.com', 'Click here');
    expect(out).toBe(`${OSC}8;;https://example.com${ST}Click here${OSC}8;;${ST}`);
  });
});
