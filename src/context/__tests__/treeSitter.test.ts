/**
 * Tests for tree-sitter AST parsing helpers
 */

import { describe, it, expect } from 'vitest';
import {
  isSupportedFile,
  parseSource,
  walkNode,
  findChildOfType,
  getNameNode,
} from '../treeSitter.js';

describe('isSupportedFile', () => {
  it('returns true for .ts files', () => {
    expect(isSupportedFile('foo.ts')).toBe(true);
  });

  it('returns true for .tsx files', () => {
    expect(isSupportedFile('component.tsx')).toBe(true);
  });

  it('returns true for .js files', () => {
    expect(isSupportedFile('index.js')).toBe(true);
  });

  it('returns true for .mjs files', () => {
    expect(isSupportedFile('module.mjs')).toBe(true);
  });

  it('returns true for .cjs files', () => {
    expect(isSupportedFile('module.cjs')).toBe(true);
  });

  it('returns true for .jsx files', () => {
    expect(isSupportedFile('component.jsx')).toBe(true);
  });

  it('returns true for .sh files', () => {
    expect(isSupportedFile('deploy.sh')).toBe(true);
  });

  it('returns true for .bash files', () => {
    expect(isSupportedFile('helpers.bash')).toBe(true);
  });

  it('returns false for .py files', () => {
    expect(isSupportedFile('script.py')).toBe(false);
  });

  it('returns false for .json files', () => {
    expect(isSupportedFile('package.json')).toBe(false);
  });

  it('returns false for .md files', () => {
    expect(isSupportedFile('README.md')).toBe(false);
  });

  it('returns false for files with no extension', () => {
    expect(isSupportedFile('Makefile')).toBe(false);
  });

  it('is case-insensitive for the extension', () => {
    expect(isSupportedFile('Foo.TS')).toBe(true);
    expect(isSupportedFile('Bar.JS')).toBe(true);
  });

  it('handles nested paths correctly', () => {
    expect(isSupportedFile('src/core/utils.ts')).toBe(true);
    expect(isSupportedFile('src/core/utils.go')).toBe(false);
  });
});

describe('parseSource', () => {
  it('parses valid TypeScript and returns a SyntaxNode', () => {
    const source = 'const x: number = 42;';
    const root = parseSource(source, 'file.ts');
    expect(root).not.toBeNull();
    expect(root?.type).toBe('program');
  });

  it('parses valid JavaScript and returns a SyntaxNode', () => {
    const source = 'const x = 42;';
    const root = parseSource(source, 'file.js');
    expect(root).not.toBeNull();
    expect(root?.type).toBe('program');
  });

  it('parses .mjs files as JavaScript', () => {
    const source = 'export const x = 1;';
    const root = parseSource(source, 'module.mjs');
    expect(root).not.toBeNull();
  });

  it('parses .cjs files as JavaScript', () => {
    const source = 'const x = require("y");';
    const root = parseSource(source, 'module.cjs');
    expect(root).not.toBeNull();
  });

  it('parses .tsx files', () => {
    const source = 'const el = <div />;';
    const root = parseSource(source, 'component.tsx');
    expect(root).not.toBeNull();
  });

  it('parses .jsx files', () => {
    const source = 'const el = <span>Hello</span>;';
    const root = parseSource(source, 'component.jsx');
    expect(root).not.toBeNull();
  });

  it('parses .sh files as bash', () => {
    const source = 'foo() { echo hi; }';
    const root = parseSource(source, 'script.sh');
    expect(root).not.toBeNull();
    expect(root?.type).toBe('program');
  });

  it('parses .bash files as bash', () => {
    const source = 'function bar() { echo hi; }';
    const root = parseSource(source, 'helpers.bash');
    expect(root).not.toBeNull();
    expect(root?.type).toBe('program');
  });

  it('returns null for unsupported file extensions', () => {
    const root = parseSource('x = 1', 'script.py');
    expect(root).toBeNull();
  });

  it('returns null for files with no extension', () => {
    const root = parseSource('x = 1', 'Makefile');
    expect(root).toBeNull();
  });

  it('returns a node with children for non-empty source', () => {
    const source = 'function foo() {} function bar() {}';
    const root = parseSource(source, 'file.ts');
    expect(root).not.toBeNull();
    expect(root!.childCount).toBeGreaterThan(0);
  });

  it('returns a root node for empty source without throwing', () => {
    const root = parseSource('', 'file.ts');
    expect(root).not.toBeNull();
  });
});

describe('walkNode', () => {
  it('visits all descendant nodes', () => {
    const source = 'const a = 1; const b = 2;';
    const root = parseSource(source, 'file.ts')!;

    const visited: string[] = [];
    walkNode(root, (node) => visited.push(node.type));

    expect(visited.length).toBeGreaterThan(2);
    expect(visited[0]).toBe('program');
  });

  it('skips nodes whose type is in skipTypes', () => {
    const source = 'const a = 1;';
    const root = parseSource(source, 'file.ts')!;

    const visited: string[] = [];
    walkNode(root, (node) => visited.push(node.type), new Set(['lexical_declaration']));

    expect(visited).not.toContain('lexical_declaration');
    // variable_declarator is a child of lexical_declaration, so it should also be skipped
    expect(visited).not.toContain('variable_declarator');
  });

  it('calls visitor for root node itself', () => {
    const source = 'const x = 1;';
    const root = parseSource(source, 'file.ts')!;

    const visited: string[] = [];
    walkNode(root, (node) => visited.push(node.type));

    expect(visited[0]).toBe('program');
  });

  it('stops at the skipped root if root type is skipped', () => {
    const source = 'const x = 1;';
    const root = parseSource(source, 'file.ts')!;

    const visited: string[] = [];
    walkNode(root, (node) => visited.push(node.type), new Set(['program']));

    expect(visited).toHaveLength(0);
  });
});

describe('findChildOfType', () => {
  it('returns the first matching child', () => {
    const source = 'function foo(a: string): void {}';
    const root = parseSource(source, 'file.ts')!;
    // root → function_declaration
    const funcDecl = root.child(0)!;
    const identifier = findChildOfType(funcDecl, 'identifier');
    expect(identifier).not.toBeNull();
    expect(identifier!.type).toBe('identifier');
    expect(identifier!.text).toBe('foo');
  });

  it('returns null when no child has the requested type', () => {
    const source = 'const x = 1;';
    const root = parseSource(source, 'file.ts')!;
    const result = findChildOfType(root, 'nonexistent_type');
    expect(result).toBeNull();
  });

  it('accepts multiple type arguments and returns the first match', () => {
    const source = 'class Foo {}';
    const root = parseSource(source, 'file.ts')!;
    const classDecl = root.child(0)!;
    // class_declaration has a type_identifier for the name
    const nameNode = findChildOfType(classDecl, 'identifier', 'type_identifier');
    expect(nameNode).not.toBeNull();
    expect(nameNode!.text).toBe('Foo');
  });
});

describe('getNameNode', () => {
  it('returns the identifier child of a function declaration', () => {
    const source = 'function myFunc() {}';
    const root = parseSource(source, 'file.ts')!;
    const funcDecl = root.child(0)!;
    const nameNode = getNameNode(funcDecl);
    expect(nameNode).not.toBeNull();
    expect(nameNode!.text).toBe('myFunc');
  });

  it('returns the type_identifier child of a class declaration', () => {
    const source = 'class MyClass {}';
    const root = parseSource(source, 'file.ts')!;
    const classDecl = root.child(0)!;
    const nameNode = getNameNode(classDecl);
    expect(nameNode).not.toBeNull();
    expect(nameNode!.text).toBe('MyClass');
  });

  it('returns null for a node with no identifier children', () => {
    const source = '42;';
    const root = parseSource(source, 'file.ts')!;
    // expression_statement → number literal, no identifier
    const exprStmt = root.child(0)!;
    const nameNode = getNameNode(exprStmt);
    expect(nameNode).toBeNull();
  });
});
