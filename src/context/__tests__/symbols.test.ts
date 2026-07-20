/**
 * Tests for symbol extraction from AST nodes
 */

import { describe, it, expect } from 'vitest';
import { extractSymbols } from '../symbols.js';
import type { CodeSymbol } from '../symbols.js';

// ─── Helper ──────────────────────────────────────────────────────────────────

function symbolNames(symbols: CodeSymbol[]): string[] {
  return symbols.map((s) => s.name);
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('extractSymbols', () => {
  describe('unsupported / empty input', () => {
    it('returns empty array for unsupported file extension', () => {
      expect(extractSymbols('x = 1', 'script.py')).toEqual([]);
    });

    it('returns empty array for empty source', () => {
      expect(extractSymbols('', 'file.ts')).toEqual([]);
    });

    it('returns empty array for source with only comments', () => {
      expect(extractSymbols('// just a comment\n/* block */', 'file.ts')).toEqual([]);
    });
  });

  describe('function declarations', () => {
    it('extracts a top-level function', () => {
      const src = 'function greet(name: string): string { return "hi"; }';
      const symbols = extractSymbols(src, 'file.ts');
      expect(symbolNames(symbols)).toContain('greet');
      const sym = symbols.find((s) => s.name === 'greet')!;
      expect(sym.kind).toBe('function');
      expect(sym.line).toBe(1);
    });

    it('extracts an exported function', () => {
      const src = 'export function doThing(): void {}';
      const symbols = extractSymbols(src, 'file.ts');
      expect(symbolNames(symbols)).toContain('doThing');
      expect(symbols.find((s) => s.name === 'doThing')!.kind).toBe('function');
    });

    it('extracts a generator function', () => {
      const src = 'function* gen() { yield 1; }';
      const symbols = extractSymbols(src, 'file.ts');
      expect(symbolNames(symbols)).toContain('gen');
      expect(symbols.find((s) => s.name === 'gen')!.kind).toBe('function');
    });
  });

  describe('class declarations', () => {
    it('extracts a class', () => {
      const src = 'class Animal {}';
      const symbols = extractSymbols(src, 'file.ts');
      expect(symbolNames(symbols)).toContain('Animal');
      expect(symbols.find((s) => s.name === 'Animal')!.kind).toBe('class');
    });

    it('extracts an exported class', () => {
      const src = 'export class Dog extends Animal {}';
      const symbols = extractSymbols(src, 'file.ts');
      expect(symbolNames(symbols)).toContain('Dog');
    });

    it('extracts methods from a class body', () => {
      const src = `
class Greeter {
  greet(name: string): string { return "hi " + name; }
  farewell(): void {}
}`;
      const symbols = extractSymbols(src, 'file.ts');
      expect(symbolNames(symbols)).toContain('Greeter');
      expect(symbolNames(symbols)).toContain('Greeter.greet');
      expect(symbolNames(symbols)).toContain('Greeter.farewell');
      const method = symbols.find((s) => s.name === 'Greeter.greet')!;
      expect(method.kind).toBe('method');
    });

    it('includes the class symbol before its methods', () => {
      const src = `class Foo { bar() {} }`;
      const symbols = extractSymbols(src, 'file.ts');
      const classIdx = symbols.findIndex((s) => s.name === 'Foo');
      const methodIdx = symbols.findIndex((s) => s.name === 'Foo.bar');
      expect(classIdx).toBeLessThan(methodIdx);
    });
  });

  describe('interface declarations', () => {
    it('extracts a TypeScript interface', () => {
      const src = 'interface Shape { area(): number; }';
      const symbols = extractSymbols(src, 'file.ts');
      expect(symbolNames(symbols)).toContain('Shape');
      expect(symbols.find((s) => s.name === 'Shape')!.kind).toBe('interface');
    });

    it('extracts an exported interface', () => {
      const src = 'export interface Config { debug: boolean; }';
      const symbols = extractSymbols(src, 'file.ts');
      expect(symbolNames(symbols)).toContain('Config');
    });
  });

  describe('type alias declarations', () => {
    it('extracts a TypeScript type alias', () => {
      const src = 'type StringOrNumber = string | number;';
      const symbols = extractSymbols(src, 'file.ts');
      expect(symbolNames(symbols)).toContain('StringOrNumber');
      expect(symbols.find((s) => s.name === 'StringOrNumber')!.kind).toBe('type');
    });

    it('extracts an exported type alias', () => {
      const src = 'export type ID = string;';
      const symbols = extractSymbols(src, 'file.ts');
      expect(symbolNames(symbols)).toContain('ID');
    });
  });

  describe('variable declarations', () => {
    it('extracts a const declaration', () => {
      const src = 'const MAX_RETRIES = 3;';
      const symbols = extractSymbols(src, 'file.ts');
      expect(symbolNames(symbols)).toContain('MAX_RETRIES');
      expect(symbols.find((s) => s.name === 'MAX_RETRIES')!.kind).toBe('variable');
    });

    it('extracts a let declaration', () => {
      const src = 'let counter = 0;';
      const symbols = extractSymbols(src, 'file.ts');
      expect(symbolNames(symbols)).toContain('counter');
    });

    it('extracts an exported const', () => {
      const src = 'export const VERSION = "1.0.0";';
      const symbols = extractSymbols(src, 'file.ts');
      expect(symbolNames(symbols)).toContain('VERSION');
    });
  });

  describe('symbol metadata', () => {
    it('sets filePath on every symbol', () => {
      const src = 'function foo() {} class Bar {}';
      const symbols = extractSymbols(src, 'src/utils.ts');
      expect(symbols.every((s) => s.filePath === 'src/utils.ts')).toBe(true);
    });

    it('sets references to 0 by default', () => {
      const src = 'function foo() {}';
      const symbols = extractSymbols(src, 'file.ts');
      expect(symbols.every((s) => s.references === 0)).toBe(true);
    });

    it('sets the correct line number', () => {
      const src = '\n\nfunction third() {}';
      const symbols = extractSymbols(src, 'file.ts');
      const fn = symbols.find((s) => s.name === 'third')!;
      expect(fn.line).toBe(3);
    });

    it('includes a signature string', () => {
      const src = 'function doWork(a: string, b: number): boolean { return true; }';
      const symbols = extractSymbols(src, 'file.ts');
      const fn = symbols.find((s) => s.name === 'doWork')!;
      expect(fn.signature).toBeDefined();
      expect(fn.signature!.length).toBeGreaterThan(0);
      // Signature should not include the body
      expect(fn.signature).not.toContain('{');
    });

    it('truncates very long signatures to 120 chars + ellipsis', () => {
      const longParams = Array.from({ length: 20 }, (_, i) => `param${i}: string`).join(', ');
      const src = `function longSig(${longParams}): void {}`;
      const symbols = extractSymbols(src, 'file.ts');
      const fn = symbols.find((s) => s.name === 'longSig')!;
      expect(fn.signature).toBeDefined();
      expect(fn.signature!.endsWith('…')).toBe(true);
      // The part before '…' should be ≤120 characters
      expect(fn.signature!.replace('…', '').length).toBeLessThanOrEqual(121);
    });
  });

  describe('JavaScript support', () => {
    it('extracts function from a .js file', () => {
      const src = 'function jsFunc() {}';
      const symbols = extractSymbols(src, 'file.js');
      expect(symbolNames(symbols)).toContain('jsFunc');
    });

    it('extracts class from a .js file', () => {
      const src = 'class JsClass {}';
      const symbols = extractSymbols(src, 'file.js');
      expect(symbolNames(symbols)).toContain('JsClass');
    });
  });

  describe('bash support', () => {
    it('extracts a POSIX-style function from a .sh file', () => {
      const src = 'greet() {\n  echo "hi $1"\n}';
      const symbols = extractSymbols(src, 'script.sh');
      expect(symbolNames(symbols)).toContain('greet');
      const sym = symbols.find((s) => s.name === 'greet')!;
      expect(sym.kind).toBe('function');
      expect(sym.line).toBe(1);
      expect(sym.signature).toBe('greet()');
    });

    it('extracts a Bash keyword-style function without parens', () => {
      const src = 'function farewell {\n  echo bye\n}';
      const symbols = extractSymbols(src, 'script.sh');
      expect(symbolNames(symbols)).toContain('farewell');
      const sym = symbols.find((s) => s.name === 'farewell')!;
      expect(sym.kind).toBe('function');
      expect(sym.signature).toBe('function farewell');
    });

    it('extracts a Bash keyword-style function with parens', () => {
      const src = 'function ping() {\n  echo pong\n}';
      const symbols = extractSymbols(src, 'script.bash');
      expect(symbolNames(symbols)).toContain('ping');
      const sym = symbols.find((s) => s.name === 'ping')!;
      expect(sym.signature).toBe('function ping()');
    });

    it('extracts multiple bash functions in order', () => {
      const src = [
        'alpha() { echo a; }',
        'function beta { echo b; }',
        'function gamma() { echo g; }',
      ].join('\n');
      const symbols = extractSymbols(src, 'utils.sh');
      expect(symbolNames(symbols)).toEqual(['alpha', 'beta', 'gamma']);
    });

    it('ignores nested helper functions defined inside another function', () => {
      const src = ['outer() {', '  inner() { echo nested; }', '  inner', '}'].join('\n');
      const symbols = extractSymbols(src, 'script.sh');
      expect(symbolNames(symbols)).toEqual(['outer']);
    });

    it('returns empty array for a bash file with no functions', () => {
      const src = 'echo hello\nls -la\n';
      const symbols = extractSymbols(src, 'script.sh');
      expect(symbols).toEqual([]);
    });

    it('sets filePath and references correctly on bash symbols', () => {
      const src = 'foo() { echo hi; }';
      const symbols = extractSymbols(src, 'scripts/deploy.sh');
      const sym = symbols[0];
      expect(sym.filePath).toBe('scripts/deploy.sh');
      expect(sym.references).toBe(0);
    });
  });

  describe('multiple symbols', () => {
    it('extracts multiple top-level symbols in order', () => {
      const src = `
function alpha() {}
function beta() {}
function gamma() {}
`;
      const symbols = extractSymbols(src, 'file.ts');
      expect(symbolNames(symbols)).toEqual(['alpha', 'beta', 'gamma']);
    });

    it('handles a file with mixed declaration types', () => {
      const src = `
export const VERSION = "1";
export interface Config { debug: boolean; }
export type ID = string;
export class Manager {}
export function init(): void {}
`;
      const symbols = extractSymbols(src, 'file.ts');
      const kinds = symbols.map((s) => s.kind);
      expect(kinds).toContain('variable');
      expect(kinds).toContain('interface');
      expect(kinds).toContain('type');
      expect(kinds).toContain('class');
      expect(kinds).toContain('function');
    });
  });
});
