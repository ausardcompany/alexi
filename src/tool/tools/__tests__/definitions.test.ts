import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { definitionsTool } from '../definitions.js';
import type { ToolContext } from '../../index.js';

describe('Definitions Tool', () => {
  let tempDir: string;
  let context: ToolContext;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'definitions-test-'));
    context = { workdir: tempDir };
  });

  afterEach(() => {
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  describe('TypeScript class extraction', () => {
    it('should extract a basic class', async () => {
      const filePath = path.join(tempDir, 'test.ts');
      fs.writeFileSync(
        filePath,
        `class MyClass {
  constructor() {}
}`
      );

      const result = await definitionsTool.executeUnsafe({ filePath }, context);

      expect(result.success).toBe(true);
      expect(result.data?.language).toBe('typescript');
      expect(result.data?.definitions).toHaveLength(1);
      expect(result.data?.definitions[0]).toMatchObject({
        name: 'MyClass',
        type: 'class',
        line: 1,
        signature: 'class MyClass',
        exported: false,
      });
    });

    it('should extract an exported abstract class', async () => {
      const filePath = path.join(tempDir, 'test.ts');
      fs.writeFileSync(
        filePath,
        `export abstract class BaseService extends EventEmitter implements IService {
  abstract process(): void;
}`
      );

      const result = await definitionsTool.executeUnsafe({ filePath }, context);

      expect(result.success).toBe(true);
      expect(result.data?.definitions).toHaveLength(1);
      expect(result.data?.definitions[0]).toMatchObject({
        name: 'BaseService',
        type: 'class',
        exported: true,
      });
      expect(result.data?.definitions[0].signature).toContain('export');
      expect(result.data?.definitions[0].signature).toContain('abstract');
      expect(result.data?.definitions[0].signature).toContain('extends EventEmitter');
    });
  });

  describe('Function extraction', () => {
    it('should extract a regular function', async () => {
      const filePath = path.join(tempDir, 'test.ts');
      fs.writeFileSync(
        filePath,
        `function processData(input: string, count: number): string {
  return input.repeat(count);
}`
      );

      const result = await definitionsTool.executeUnsafe({ filePath }, context);

      expect(result.success).toBe(true);
      expect(result.data?.definitions).toHaveLength(1);
      expect(result.data?.definitions[0]).toMatchObject({
        name: 'processData',
        type: 'function',
        line: 1,
        exported: false,
      });
      expect(result.data?.definitions[0].signature).toContain('function processData');
      expect(result.data?.definitions[0].signature).toContain('(input: string, count: number)');
    });

    it('should extract an exported async function', async () => {
      const filePath = path.join(tempDir, 'test.ts');
      fs.writeFileSync(
        filePath,
        `export async function fetchData(url: string): Promise<Response> {
  return fetch(url);
}`
      );

      const result = await definitionsTool.executeUnsafe({ filePath }, context);

      expect(result.success).toBe(true);
      expect(result.data?.definitions).toHaveLength(1);
      expect(result.data?.definitions[0]).toMatchObject({
        name: 'fetchData',
        type: 'function',
        exported: true,
      });
      expect(result.data?.definitions[0].signature).toContain('export');
      expect(result.data?.definitions[0].signature).toContain('async');
    });

    it('should extract arrow functions', async () => {
      const filePath = path.join(tempDir, 'test.ts');
      fs.writeFileSync(
        filePath,
        `export const multiply = (a: number, b: number): number => a * b;

const add = (x: number, y: number) => x + y;

export const asyncFetch = async (url: string): Promise<void> => {
  await fetch(url);
};`
      );

      const result = await definitionsTool.executeUnsafe({ filePath }, context);

      expect(result.success).toBe(true);
      const functions = result.data?.definitions.filter((d) => d.type === 'function');
      expect(functions).toHaveLength(3);

      const multiply = functions?.find((f) => f.name === 'multiply');
      expect(multiply).toMatchObject({
        name: 'multiply',
        type: 'function',
        exported: true,
      });
      expect(multiply?.signature).toContain('=>');

      const add = functions?.find((f) => f.name === 'add');
      expect(add).toMatchObject({
        name: 'add',
        type: 'function',
        exported: false,
      });

      const asyncFetch = functions?.find((f) => f.name === 'asyncFetch');
      expect(asyncFetch).toMatchObject({
        name: 'asyncFetch',
        type: 'function',
        exported: true,
      });
      expect(asyncFetch?.signature).toContain('async');
    });
  });

  describe('Interface and type extraction', () => {
    it('should extract interfaces', async () => {
      const filePath = path.join(tempDir, 'test.ts');
      fs.writeFileSync(
        filePath,
        `export interface UserData {
  id: string;
  name: string;
}

interface Config extends BaseConfig {
  debug: boolean;
}`
      );

      const result = await definitionsTool.executeUnsafe({ filePath }, context);

      expect(result.success).toBe(true);
      const interfaces = result.data?.definitions.filter((d) => d.type === 'interface');
      expect(interfaces).toHaveLength(2);

      const userData = interfaces?.find((i) => i.name === 'UserData');
      expect(userData).toMatchObject({
        name: 'UserData',
        type: 'interface',
        exported: true,
      });

      const config = interfaces?.find((i) => i.name === 'Config');
      expect(config).toMatchObject({
        name: 'Config',
        type: 'interface',
        exported: false,
      });
      expect(config?.signature).toContain('extends BaseConfig');
    });

    it('should extract type aliases', async () => {
      const filePath = path.join(tempDir, 'test.ts');
      fs.writeFileSync(
        filePath,
        `export type ID = string | number;

type Callback<T> = (value: T) => void;`
      );

      const result = await definitionsTool.executeUnsafe({ filePath }, context);

      expect(result.success).toBe(true);
      const types = result.data?.definitions.filter((d) => d.type === 'type');
      expect(types).toHaveLength(2);

      const idType = types?.find((t) => t.name === 'ID');
      expect(idType).toMatchObject({
        name: 'ID',
        type: 'type',
        exported: true,
      });

      const callbackType = types?.find((t) => t.name === 'Callback');
      expect(callbackType).toMatchObject({
        name: 'Callback',
        type: 'type',
        exported: false,
      });
      expect(callbackType?.signature).toContain('<T>');
    });
  });

  describe('Const and enum extraction', () => {
    it('should extract const declarations', async () => {
      const filePath = path.join(tempDir, 'test.ts');
      fs.writeFileSync(
        filePath,
        `export const MAX_SIZE = 100;
const DEFAULT_NAME = "unnamed";
const config: Config = { debug: true };`
      );

      const result = await definitionsTool.executeUnsafe({ filePath }, context);

      expect(result.success).toBe(true);
      const consts = result.data?.definitions.filter((d) => d.type === 'const');
      expect(consts).toHaveLength(3);

      const maxSize = consts?.find((c) => c.name === 'MAX_SIZE');
      expect(maxSize).toMatchObject({
        name: 'MAX_SIZE',
        type: 'const',
        exported: true,
      });

      const defaultName = consts?.find((c) => c.name === 'DEFAULT_NAME');
      expect(defaultName).toMatchObject({
        name: 'DEFAULT_NAME',
        type: 'const',
        exported: false,
      });
    });

    it('should extract enums', async () => {
      const filePath = path.join(tempDir, 'test.ts');
      fs.writeFileSync(
        filePath,
        `export enum Status {
  Pending,
  Active,
  Done,
}

enum Priority {
  Low = 1,
  High = 2,
}`
      );

      const result = await definitionsTool.executeUnsafe({ filePath }, context);

      expect(result.success).toBe(true);
      const enums = result.data?.definitions.filter((d) => d.type === 'enum');
      expect(enums).toHaveLength(2);

      const status = enums?.find((e) => e.name === 'Status');
      expect(status).toMatchObject({
        name: 'Status',
        type: 'enum',
        exported: true,
      });

      const priority = enums?.find((e) => e.name === 'Priority');
      expect(priority).toMatchObject({
        name: 'Priority',
        type: 'enum',
        exported: false,
      });
    });
  });

  describe('Python class/function extraction', () => {
    it('should extract Python classes', async () => {
      const filePath = path.join(tempDir, 'test.py');
      fs.writeFileSync(
        filePath,
        `class MyClass:
    def __init__(self):
        pass

class ChildClass(ParentClass):
    pass`
      );

      const result = await definitionsTool.executeUnsafe({ filePath }, context);

      expect(result.success).toBe(true);
      expect(result.data?.language).toBe('python');
      const classes = result.data?.definitions.filter((d) => d.type === 'class');
      expect(classes).toHaveLength(2);

      const myClass = classes?.find((c) => c.name === 'MyClass');
      expect(myClass).toMatchObject({
        name: 'MyClass',
        type: 'class',
        line: 1,
      });

      const childClass = classes?.find((c) => c.name === 'ChildClass');
      expect(childClass).toMatchObject({
        name: 'ChildClass',
        type: 'class',
      });
      expect(childClass?.signature).toContain('(ParentClass)');
    });

    it('should extract Python functions', async () => {
      const filePath = path.join(tempDir, 'test.py');
      fs.writeFileSync(
        filePath,
        `def process_data(input_str: str) -> str:
    return input_str.upper()

async def fetch_data(url: str) -> dict:
    pass`
      );

      const result = await definitionsTool.executeUnsafe({ filePath }, context);

      expect(result.success).toBe(true);
      const functions = result.data?.definitions.filter((d) => d.type === 'function');
      expect(functions).toHaveLength(2);

      const processData = functions?.find((f) => f.name === 'process_data');
      expect(processData).toMatchObject({
        name: 'process_data',
        type: 'function',
      });
      expect(processData?.signature).toContain('def process_data');
      expect(processData?.signature).toContain('-> str');

      const fetchData = functions?.find((f) => f.name === 'fetch_data');
      expect(fetchData).toMatchObject({
        name: 'fetch_data',
        type: 'function',
      });
      expect(fetchData?.signature).toContain('async');
    });
  });

  describe('Bash definitions', () => {
    it('should extract POSIX function syntax', async () => {
      const filePath = path.join(tempDir, 'deploy.sh');
      fs.writeFileSync(
        filePath,
        `#!/bin/bash
deploy_app() {
  echo "Deploying..."
}

cleanup() {
  rm -rf tmp
}`
      );

      const result = await definitionsTool.executeUnsafe({ filePath }, context);

      expect(result.success).toBe(true);
      expect(result.data?.language).toBe('bash');
      expect(result.data?.definitions).toHaveLength(2);

      const deploy = result.data?.definitions.find((d) => d.name === 'deploy_app');
      expect(deploy).toMatchObject({
        name: 'deploy_app',
        type: 'function',
        line: 2,
        signature: 'deploy_app()',
        exported: true,
      });

      const cleanup = result.data?.definitions.find((d) => d.name === 'cleanup');
      expect(cleanup).toMatchObject({
        name: 'cleanup',
        type: 'function',
        line: 6,
        signature: 'cleanup()',
      });
    });

    it('should extract Bash keyword function syntax', async () => {
      const filePath = path.join(tempDir, 'utils.bash');
      fs.writeFileSync(
        filePath,
        `#!/bin/bash
function build_project {
  npm run build
}

function run_tests {
  npm test
}`
      );

      const result = await definitionsTool.executeUnsafe({ filePath }, context);

      expect(result.success).toBe(true);
      expect(result.data?.language).toBe('bash');
      expect(result.data?.definitions).toHaveLength(2);

      const build = result.data?.definitions.find((d) => d.name === 'build_project');
      expect(build).toMatchObject({
        name: 'build_project',
        type: 'function',
        line: 2,
        signature: 'function build_project',
        exported: true,
      });

      const tests = result.data?.definitions.find((d) => d.name === 'run_tests');
      expect(tests).toMatchObject({
        name: 'run_tests',
        type: 'function',
        line: 6,
      });
    });

    it('should deduplicate functions with both syntaxes', async () => {
      const filePath = path.join(tempDir, 'mixed.sh');
      fs.writeFileSync(
        filePath,
        `#!/bin/bash
function my_func() {
  echo "hi"
}`
      );

      const result = await definitionsTool.executeUnsafe({ filePath }, context);

      expect(result.success).toBe(true);
      expect(result.data?.definitions).toHaveLength(1);
      expect(result.data?.definitions[0]).toMatchObject({
        name: 'my_func',
        type: 'function',
      });
    });

    it('should extract mixed POSIX and Bash keyword functions', async () => {
      const filePath = path.join(tempDir, 'mixed2.sh');
      fs.writeFileSync(
        filePath,
        `#!/bin/bash
posix_fn() {
  echo "posix"
}

function keyword_fn {
  echo "keyword"
}`
      );

      const result = await definitionsTool.executeUnsafe({ filePath }, context);

      expect(result.success).toBe(true);
      expect(result.data?.definitions).toHaveLength(2);
      const names = result.data?.definitions.map((d) => d.name);
      expect(names).toContain('posix_fn');
      expect(names).toContain('keyword_fn');
    });

    it('should respect type filter for bash', async () => {
      const filePath = path.join(tempDir, 'filter.sh');
      fs.writeFileSync(
        filePath,
        `#!/bin/bash
my_fn() {
  echo "hi"
}`
      );

      const result = await definitionsTool.executeUnsafe({ filePath, types: ['class'] }, context);

      expect(result.success).toBe(true);
      expect(result.data?.definitions).toHaveLength(0);
    });
  });

  describe('Export detection', () => {
    it('should correctly identify exported vs non-exported definitions', async () => {
      const filePath = path.join(tempDir, 'test.ts');
      fs.writeFileSync(
        filePath,
        `export class ExportedClass {}
class InternalClass {}

export function exportedFunc() {}
function internalFunc() {}

export const EXPORTED_CONST = 1;
const INTERNAL_CONST = 2;

export interface ExportedInterface {}
interface InternalInterface {}

export type ExportedType = string;
type InternalType = number;`
      );

      const result = await definitionsTool.executeUnsafe({ filePath }, context);

      expect(result.success).toBe(true);

      const exported = result.data?.definitions.filter((d) => d.exported);
      const internal = result.data?.definitions.filter((d) => !d.exported);

      expect(exported?.map((d) => d.name)).toEqual(
        expect.arrayContaining([
          'ExportedClass',
          'exportedFunc',
          'EXPORTED_CONST',
          'ExportedInterface',
          'ExportedType',
        ])
      );

      expect(internal?.map((d) => d.name)).toEqual(
        expect.arrayContaining([
          'InternalClass',
          'internalFunc',
          'INTERNAL_CONST',
          'InternalInterface',
          'InternalType',
        ])
      );
    });
  });

  describe('Filtering by type', () => {
    it('should filter by single type', async () => {
      const filePath = path.join(tempDir, 'test.ts');
      fs.writeFileSync(
        filePath,
        `class MyClass {}
function myFunc() {}
interface MyInterface {}
const MY_CONST = 1;`
      );

      const result = await definitionsTool.executeUnsafe({ filePath, types: ['class'] }, context);

      expect(result.success).toBe(true);
      expect(result.data?.definitions).toHaveLength(1);
      expect(result.data?.definitions[0].type).toBe('class');
    });

    it('should filter by multiple types', async () => {
      const filePath = path.join(tempDir, 'test.ts');
      fs.writeFileSync(
        filePath,
        `class MyClass {}
function myFunc() {}
interface MyInterface {}
type MyType = string;
const MY_CONST = 1;
enum MyEnum { A, B }`
      );

      const result = await definitionsTool.executeUnsafe(
        { filePath, types: ['class', 'interface', 'type'] },
        context
      );

      expect(result.success).toBe(true);
      expect(result.data?.definitions).toHaveLength(3);
      const types = result.data?.definitions.map((d) => d.type);
      expect(types).toContain('class');
      expect(types).toContain('interface');
      expect(types).toContain('type');
      expect(types).not.toContain('function');
      expect(types).not.toContain('const');
      expect(types).not.toContain('enum');
    });
  });

  describe('JavaScript support', () => {
    it('should handle JavaScript files', async () => {
      const filePath = path.join(tempDir, 'test.js');
      fs.writeFileSync(
        filePath,
        `class MyClass {}
export function myFunc() {}
const myConst = 123;`
      );

      const result = await definitionsTool.executeUnsafe({ filePath }, context);

      expect(result.success).toBe(true);
      expect(result.data?.language).toBe('javascript');
      expect(result.data?.definitions).toHaveLength(3);
    });

    it('should not extract interface/type from JavaScript', async () => {
      const filePath = path.join(tempDir, 'test.js');
      fs.writeFileSync(
        filePath,
        `// These would be syntax errors in real JS but test the filtering
class MyClass {}
function myFunc() {}`
      );

      const result = await definitionsTool.executeUnsafe(
        { filePath, types: ['interface', 'type'] },
        context
      );

      expect(result.success).toBe(true);
      expect(result.data?.definitions).toHaveLength(0);
    });
  });

  describe('Line number accuracy', () => {
    it('should return correct line numbers', async () => {
      const filePath = path.join(tempDir, 'test.ts');
      fs.writeFileSync(
        filePath,
        `// Line 1 - comment
// Line 2 - comment

class MyClass {
  // Line 5
}

function myFunc() {
  // Line 9
}

interface MyInterface {
  // Line 13
}`
      );

      const result = await definitionsTool.executeUnsafe({ filePath }, context);

      expect(result.success).toBe(true);

      const classObj = result.data?.definitions.find((d) => d.name === 'MyClass');
      expect(classObj?.line).toBe(4);

      const func = result.data?.definitions.find((d) => d.name === 'myFunc');
      expect(func?.line).toBe(8);

      const iface = result.data?.definitions.find((d) => d.name === 'MyInterface');
      expect(iface?.line).toBe(12);
    });
  });

  describe('Sorting', () => {
    it('should sort definitions by line number', async () => {
      const filePath = path.join(tempDir, 'test.ts');
      fs.writeFileSync(
        filePath,
        `const first = 1;

class Second {}

function third() {}

interface Fourth {}`
      );

      const result = await definitionsTool.executeUnsafe({ filePath }, context);

      expect(result.success).toBe(true);
      const names = result.data?.definitions.map((d) => d.name);
      expect(names).toEqual(['first', 'Second', 'third', 'Fourth']);
    });
  });

  describe('Error handling', () => {
    it('should return error for non-existent file', async () => {
      const result = await definitionsTool.executeUnsafe(
        { filePath: path.join(tempDir, 'nonexistent.ts') },
        context
      );

      expect(result.success).toBe(false);
      expect(result.error).toContain('File not found');
    });

    it('should return error for unsupported file type', async () => {
      const filePath = path.join(tempDir, 'test.rs');
      fs.writeFileSync(filePath, 'fn main() {}');

      const result = await definitionsTool.executeUnsafe({ filePath }, context);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Unsupported file type');
    });

    it('should return error for directory path', async () => {
      const result = await definitionsTool.executeUnsafe({ filePath: tempDir }, context);

      expect(result.success).toBe(false);
      expect(result.error).toContain('directory');
    });
  });

  describe('Relative paths', () => {
    it('should handle relative paths', async () => {
      const filePath = path.join(tempDir, 'test.ts');
      fs.writeFileSync(filePath, 'class MyClass {}');

      const result = await definitionsTool.executeUnsafe({ filePath: 'test.ts' }, context);

      expect(result.success).toBe(true);
      expect(result.data?.definitions).toHaveLength(1);
    });
  });

  describe('Method extraction', () => {
    it('should extract class methods', async () => {
      const filePath = path.join(tempDir, 'test.ts');
      fs.writeFileSync(
        filePath,
        `class MyService {
  public async fetchData(url: string): Promise<Response> {
    return fetch(url);
  }

  private processResult(data: any): void {
    console.log(data);
  }

  static getInstance(): MyService {
    return new MyService();
  }
}`
      );

      const result = await definitionsTool.executeUnsafe({ filePath, types: ['method'] }, context);

      expect(result.success).toBe(true);
      const methods = result.data?.definitions.filter((d) => d.type === 'method');
      expect(methods?.length).toBeGreaterThanOrEqual(1);
    });
  });
});
