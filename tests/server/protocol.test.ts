import { describe, it, expect } from 'vitest';
import {
  PROTOCOL_VERSION,
  encodeFrame,
  extractLines,
  failure,
  parseRequest,
  parseSlashCommand,
  success,
} from '../../src/server/protocol.js';

describe('server protocol', () => {
  describe('encodeFrame', () => {
    it('encodes a hello message as a newline-terminated JSON line', () => {
      const frame = encodeFrame({ type: 'hello', version: '1.0.0', protocol: PROTOCOL_VERSION });
      expect(frame.endsWith('\n')).toBe(true);
      const obj = JSON.parse(frame.trim());
      expect(obj).toEqual({ type: 'hello', version: '1.0.0', protocol: PROTOCOL_VERSION });
    });

    it('encodes a success response', () => {
      const frame = encodeFrame(success('req-1', { pong: true }));
      const obj = JSON.parse(frame.trim());
      expect(obj).toEqual({
        id: 'req-1',
        type: 'response',
        ok: true,
        result: { pong: true },
      });
    });

    it('encodes an error response', () => {
      const frame = encodeFrame(failure('req-2', 'INVALID', 'nope'));
      const obj = JSON.parse(frame.trim());
      expect(obj).toEqual({
        id: 'req-2',
        type: 'error',
        ok: false,
        error: { code: 'INVALID', message: 'nope' },
      });
    });
  });

  describe('parseRequest', () => {
    it('parses a valid auth frame', () => {
      const res = parseRequest(JSON.stringify({ id: '1', type: 'auth', token: 'abc' }));
      expect(res.ok).toBe(true);
      if (res.ok) {
        expect(res.request.type).toBe('auth');
      }
    });

    it('parses a valid command frame with sessionId', () => {
      const res = parseRequest(
        JSON.stringify({ id: '2', type: 'command', command: '/help', sessionId: 's1' })
      );
      expect(res.ok).toBe(true);
      if (res.ok && res.request.type === 'command') {
        expect(res.request.command).toBe('/help');
        expect(res.request.sessionId).toBe('s1');
      }
    });

    it('rejects an empty frame', () => {
      const res = parseRequest('   ');
      expect(res.ok).toBe(false);
      if (!res.ok) {
        expect(res.code).toBe('EMPTY_FRAME');
      }
    });

    it('rejects invalid JSON', () => {
      const res = parseRequest('{not json');
      expect(res.ok).toBe(false);
      if (!res.ok) {
        expect(res.code).toBe('INVALID_JSON');
      }
    });

    it('rejects frames with unknown types', () => {
      const res = parseRequest(JSON.stringify({ id: '1', type: 'nope' }));
      expect(res.ok).toBe(false);
      if (!res.ok) {
        expect(res.code).toBe('INVALID_REQUEST');
      }
    });

    it('rejects auth frames missing a token', () => {
      const res = parseRequest(JSON.stringify({ id: '1', type: 'auth' }));
      expect(res.ok).toBe(false);
    });

    it('rejects command frames with empty command', () => {
      const res = parseRequest(JSON.stringify({ id: '1', type: 'command', command: '' }));
      expect(res.ok).toBe(false);
    });
  });

  describe('parseSlashCommand', () => {
    it('parses /help with no args', () => {
      expect(parseSlashCommand('/help')).toEqual({ name: 'help', args: [] });
    });

    it('parses /review with args', () => {
      expect(parseSlashCommand('/review src/foo.ts')).toEqual({
        name: 'review',
        args: ['src/foo.ts'],
      });
    });

    it('collapses multiple spaces between args', () => {
      expect(parseSlashCommand('/refactor  a   b')).toEqual({
        name: 'refactor',
        args: ['a', 'b'],
      });
    });

    it('returns null for non-slash input', () => {
      expect(parseSlashCommand('help')).toBeNull();
    });

    it('returns null for a bare slash', () => {
      expect(parseSlashCommand('/   ')).toBeNull();
    });
  });

  describe('extractLines', () => {
    it('yields complete lines and preserves partial trailing input', () => {
      const first = extractLines('', '{"a":1}\n{"b":2}\n{"c":');
      expect(first.lines).toEqual(['{"a":1}', '{"b":2}']);
      expect(first.buffer).toBe('{"c":');

      const second = extractLines(first.buffer, '3}\n');
      expect(second.lines).toEqual(['{"c":3}']);
      expect(second.buffer).toBe('');
    });

    it('yields nothing when the chunk has no newline', () => {
      const res = extractLines('', 'partial');
      expect(res.lines).toEqual([]);
      expect(res.buffer).toBe('partial');
    });

    it('preserves order across successive chunks', () => {
      let buffer = '';
      const seen: string[] = [];
      for (const chunk of ['{"i":1}\n{"i":', '2}\n{"i":3', '}\n']) {
        const { lines, buffer: b } = extractLines(buffer, chunk);
        seen.push(...lines);
        buffer = b;
      }
      expect(seen).toEqual(['{"i":1}', '{"i":2}', '{"i":3}']);
      expect(buffer).toBe('');
    });
  });
});
