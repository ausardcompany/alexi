import { describe, it, expect } from 'vitest';
import { stripInternalWrappers } from './stripInternalWrappers.js';

describe('stripInternalWrappers', () => {
  it('removes a self-closing <agent_switch/> marker', () => {
    const input = '<agent_switch from="code" to="debug"/>\n\nHello there';
    expect(stripInternalWrappers(input)).toBe('\n\nHello there');
  });

  it('removes a <system-reminder>...</system-reminder> block', () => {
    const input = '<system-reminder>Step limit reached.</system-reminder>';
    expect(stripInternalWrappers(input)).toBe('');
  });

  it('removes multi-line <system-reminder> bodies', () => {
    const input =
      'Prefix\n' +
      '<system-reminder source="apps/foo/AGENTS.md">\n' +
      'Line 1\n' +
      'Line 2\n' +
      'Line 3\n' +
      '</system-reminder>\n' +
      'Suffix';
    const out = stripInternalWrappers(input);
    expect(out).not.toContain('system-reminder');
    expect(out).not.toContain('Line 1');
    expect(out.startsWith('Prefix')).toBe(true);
    expect(out.endsWith('Suffix')).toBe(true);
  });

  it('preserves normal user prose around the wrappers', () => {
    const input =
      '<agent_switch from="code" to="debug"/>\n\n' +
      'Please look at src/foo.ts and\n' +
      '<system-reminder>ignore me</system-reminder>\n' +
      'tell me what happens.';
    const out = stripInternalWrappers(input);
    expect(out).toContain('Please look at src/foo.ts and');
    expect(out).toContain('tell me what happens.');
    expect(out).not.toContain('agent_switch');
    expect(out).not.toContain('system-reminder');
  });

  it('is idempotent on already-clean input', () => {
    const clean = 'Just a normal user message.';
    expect(stripInternalWrappers(clean)).toBe(clean);
    expect(stripInternalWrappers(stripInternalWrappers(clean))).toBe(clean);
  });

  it('is idempotent when applied twice to wrapped input', () => {
    const wrapped =
      '<agent_switch from="code" to="debug"/>\n\n' +
      'hi <system-reminder>x</system-reminder> there';
    const once = stripInternalWrappers(wrapped);
    const twice = stripInternalWrappers(once);
    expect(twice).toBe(once);
  });

  it('handles multiple consecutive <system-reminder> blocks without merging bodies', () => {
    const input =
      '<system-reminder>A</system-reminder>' + 'MIDDLE' + '<system-reminder>B</system-reminder>';
    expect(stripInternalWrappers(input)).toBe('MIDDLE');
  });

  it('handles empty and non-string-like inputs safely', () => {
    expect(stripInternalWrappers('')).toBe('');
  });

  it('leaves other angle-bracket tokens untouched', () => {
    const input = 'Compare a < b and c > d in <not-a-reminder>text</not-a-reminder>.';
    expect(stripInternalWrappers(input)).toBe(input);
  });
});
