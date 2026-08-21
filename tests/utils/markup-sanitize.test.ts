/**
 * Tests for `sanitizeHookContext` — the injective encoding used to safely
 * embed hook `contextModification` payloads inside
 * `<hook_context tool_name="..." tool_call_id="...">...</hook_context>`
 * user messages injected back into the model conversation.
 */

import { describe, it, expect } from 'vitest';
import { sanitizeHookContext } from '../../src/utils/markup-sanitize.js';

describe('sanitizeHookContext', () => {
  describe('embedded hook_context tag escaping', () => {
    it('escapes an opening <hook_context> tag', () => {
      const out = sanitizeHookContext('<hook_context>');
      expect(out).toBe('&lt;hook_context&gt;');
      expect(out).not.toContain('<hook_context>');
    });

    it('escapes a closing </hook_context> tag', () => {
      const out = sanitizeHookContext('</hook_context>');
      expect(out).toBe('&lt;/hook_context&gt;');
      expect(out).not.toContain('</hook_context>');
    });

    it('escapes hook_context tags case-insensitively', () => {
      const variants = [
        '<HOOK_CONTEXT>',
        '<Hook_Context>',
        '<hOoK_cOnTeXt>',
        '</HOOK_CONTEXT>',
        '</Hook_Context>',
      ];
      for (const v of variants) {
        const out = sanitizeHookContext(v);
        expect(out.toLowerCase()).not.toContain('<hook_context');
        expect(out.toLowerCase()).not.toContain('</hook_context');
        expect(out.startsWith('&lt;')).toBe(true);
        expect(out.endsWith('&gt;')).toBe(true);
      }
    });

    it('escapes hook_context tags with attributes', () => {
      const out = sanitizeHookContext('<hook_context tool_name="evil" tool_call_id="1">');
      expect(out).not.toContain('<hook_context');
      // Attribute quotes are also escaped as part of the general encoding.
      expect(out).toContain('&quot;');
    });

    it('escapes nested hook_context tags', () => {
      const out = sanitizeHookContext(
        '<hook_context><hook_context>inner</hook_context></hook_context>'
      );
      expect(out).not.toContain('<hook_context');
      expect(out).not.toContain('</hook_context');
      // The literal token "inner" survives (no angle brackets around it).
      expect(out).toContain('inner');
    });

    it('escapes tags across multiple lines', () => {
      const input = 'before\n<hook_context>\nmid\n</hook_context>\nafter';
      const out = sanitizeHookContext(input);
      expect(out).not.toContain('<hook_context>');
      expect(out).not.toContain('</hook_context>');
      expect(out).toContain('before');
      expect(out).toContain('mid');
      expect(out).toContain('after');
    });
  });

  describe('attribute delimiter escaping', () => {
    it('escapes double quotes', () => {
      expect(sanitizeHookContext('say "hi"')).toBe('say &quot;hi&quot;');
    });

    it('escapes lone < and >', () => {
      expect(sanitizeHookContext('a < b > c')).toBe('a &lt; b &gt; c');
    });

    it('escapes ampersands first so the encoding stays injective', () => {
      // A literal `&lt;` in the input must not collapse into the same output
      // as a literal `<` after encoding.
      const rawEntity = sanitizeHookContext('&lt;');
      const rawAngle = sanitizeHookContext('<');
      expect(rawEntity).toBe('&amp;lt;');
      expect(rawAngle).toBe('&lt;');
      expect(rawEntity).not.toBe(rawAngle);
    });
  });

  describe('injectivity (no two distinct inputs share an output)', () => {
    // If the encoding is injective, distinct inputs must produce distinct
    // outputs. This is the property that keeps tool identity attribution
    // safe: no two distinct `<hook_context tool_call_id="A">` and
    // `<hook_context tool_call_id="B">` payloads can collapse to the same
    // stamped block.
    const samples = [
      '',
      'plain',
      '<',
      '>',
      '<>',
      '"',
      '&',
      '&amp;',
      '&lt;',
      '&gt;',
      '&quot;',
      '<hook_context>',
      '</hook_context>',
      '<HOOK_CONTEXT tool_name="a">',
      '<hook_context tool_name="a">',
      '<script>alert(1)</script>',
      'multi\nline\ntext',
      'a<b>c"d&e',
    ];

    it('produces a distinct output for every distinct input', () => {
      const outputs = samples.map(sanitizeHookContext);
      const uniq = new Set(outputs);
      expect(uniq.size).toBe(samples.length);
    });
  });

  describe('idempotence-relevant properties', () => {
    it('never emits a bare < after encoding', () => {
      const out = sanitizeHookContext(
        'raw < and <hook_context> and <foo attr="x"> and </hook_context>'
      );
      expect(out).not.toMatch(/<[^&]/);
      expect(out).not.toContain('<hook_context');
      expect(out).not.toContain('</hook_context');
    });

    it('leaves plain ASCII text without special chars unchanged', () => {
      const plain = 'lint found 3 warnings and 1 error in build.log';
      expect(sanitizeHookContext(plain)).toBe(plain);
    });
  });

  describe('edge cases', () => {
    it('handles the empty string', () => {
      expect(sanitizeHookContext('')).toBe('');
    });

    it('handles a payload that is only special chars', () => {
      expect(sanitizeHookContext('<>"&')).toBe('&lt;&gt;&quot;&amp;');
    });

    it('does not truncate long inputs', () => {
      const long = 'x'.repeat(100_000);
      expect(sanitizeHookContext(long).length).toBe(100_000);
    });
  });
});
