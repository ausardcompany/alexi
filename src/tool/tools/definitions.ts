/**
 * Definitions Tool - Extract code definitions from source files
 * Supports TypeScript, JavaScript, Python, and Bash
 */

import { z } from 'zod';
import * as fs from 'fs/promises';
import * as path from 'path';
import { defineTool, type ToolResult } from '../index.js';

const DefinitionTypes = [
  'class',
  'function',
  'interface',
  'type',
  'const',
  'enum',
  'method',
] as const;
type DefinitionType = (typeof DefinitionTypes)[number];

const DefinitionsParamsSchema = z.object({
  filePath: z.string().describe('Path to the source file'),
  types: z
    .array(z.enum(DefinitionTypes))
    .optional()
    .describe('Types of definitions to extract. Default: all'),
});

interface Definition {
  name: string;
  type: DefinitionType;
  line: number;
  signature: string;
  exported: boolean;
}

interface DefinitionsResult {
  filePath: string;
  definitions: Definition[];
  language: string;
}

type SupportedLanguage = 'typescript' | 'javascript' | 'python' | 'bash' | 'unknown';

// TypeScript/JavaScript regex patterns
// Note: Use [ \t]* instead of \s* for indentation to avoid matching newlines
const tsPatterns = {
  class: /^([ \t]*)(export\s+)?(abstract\s+)?class\s+(\w+)([^{]*)/gm,
  function: /^([ \t]*)(export\s+)?(async\s+)?function\s+(\w+)\s*(\([^)]*\))\s*(:\s*[^{;]+)?/gm,
  interface: /^([ \t]*)(export\s+)?interface\s+(\w+)([^{]*)/gm,
  type: /^([ \t]*)(export\s+)?type\s+(\w+)\s*(<[^=]*>)?\s*=/gm,
  const: /^([ \t]*)(export\s+)?const\s+(\w+)\s*[=:]/gm,
  enum: /^([ \t]*)(export\s+)?enum\s+(\w+)/gm,
  // Arrow functions assigned to const (treated as functions)
  arrowFn:
    /^([ \t]*)(export\s+)?const\s+(\w+)\s*=\s*(async\s+)?(\([^)]*\)|[a-zA-Z_$][\w$]*)\s*(:\s*[^=]+)?\s*=>/gm,
  // Class methods
  method:
    /^([ \t]*)(public\s+|private\s+|protected\s+)?(static\s+)?(async\s+)?(\w+)\s*(\([^)]*\))\s*(:\s*[^{;]+)?(?=\s*\{)/gm,
};

// Python regex patterns
const pythonPatterns = {
  class: /^class\s+(\w+)(\([^)]*\))?:/gm,
  function: /^(async\s+)?def\s+(\w+)\s*(\([^)]*\))(\s*->\s*[^:]+)?:/gm,
};

// Bash regex patterns
const bashPatterns = {
  // POSIX function: name() { ... }
  posixFunction: /^([ \t]*)([a-zA-Z_][a-zA-Z0-9_]*)\s*\(\s*\)\s*\{/gm,
  // Bash keyword: function name { ... } or function name() { ... }
  bashFunction: /^([ \t]*)function\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*(?:\(\s*\))?\s*\{/gm,
};

/**
 * Detect language from file extension
 */
function detectLanguage(filePath: string): SupportedLanguage {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.ts':
    case '.tsx':
      return 'typescript';
    case '.js':
    case '.jsx':
    case '.mjs':
    case '.cjs':
      return 'javascript';
    case '.py':
      return 'python';
    case '.sh':
    case '.bash':
      return 'bash';
    default:
      return 'unknown';
  }
}

/**
 * Get line number for a match position
 */
function getLineNumber(content: string, index: number): number {
  return content.substring(0, index).split('\n').length;
}

/**
 * Extract TypeScript/JavaScript definitions
 */
function extractTsDefinitions(
  content: string,
  types: DefinitionType[] | undefined,
  isTypeScript: boolean
): Definition[] {
  const definitions: Definition[] = [];
  const lines = content.split('\n');
  const shouldExtract = (type: DefinitionType) => !types || types.includes(type);

  // Extract classes
  if (shouldExtract('class')) {
    const classRegex = new RegExp(tsPatterns.class.source, 'gm');
    let match;
    while ((match = classRegex.exec(content)) !== null) {
      const line = getLineNumber(content, match.index);
      const isExported = !!match[2];
      const isAbstract = !!match[3];
      const name = match[4];
      const extendsImpl = match[5]?.trim() || '';

      let signature = '';
      if (isExported) signature += 'export ';
      if (isAbstract) signature += 'abstract ';
      signature += `class ${name}`;
      if (extendsImpl) signature += ` ${extendsImpl}`;

      definitions.push({
        name,
        type: 'class',
        line,
        signature: signature.trim(),
        exported: isExported,
      });
    }
  }

  // Extract regular functions
  if (shouldExtract('function')) {
    const funcRegex = new RegExp(tsPatterns.function.source, 'gm');
    let match;
    while ((match = funcRegex.exec(content)) !== null) {
      const line = getLineNumber(content, match.index);
      const isExported = !!match[2];
      const isAsync = !!match[3];
      const name = match[4];
      const params = match[5] || '()';
      const returnType = match[6]?.trim() || '';

      let signature = '';
      if (isExported) signature += 'export ';
      if (isAsync) signature += 'async ';
      signature += `function ${name}${params}`;
      if (returnType) signature += ` ${returnType}`;

      definitions.push({
        name,
        type: 'function',
        line,
        signature: signature.trim(),
        exported: isExported,
      });
    }

    // Extract arrow functions
    const arrowRegex = new RegExp(tsPatterns.arrowFn.source, 'gm');
    while ((match = arrowRegex.exec(content)) !== null) {
      const line = getLineNumber(content, match.index);
      const isExported = !!match[2];
      const name = match[3];
      const isAsync = !!match[4];
      const params = match[5] || '()';
      const returnType = match[6]?.trim() || '';

      // Format params - if it's a single identifier, wrap in parens
      const formattedParams = params.startsWith('(') ? params : `(${params})`;

      let signature = '';
      if (isExported) signature += 'export ';
      signature += 'const ';
      signature += name;
      signature += ' = ';
      if (isAsync) signature += 'async ';
      signature += `${formattedParams}`;
      if (returnType) signature += ` ${returnType}`;
      signature += ' => ...';

      definitions.push({
        name,
        type: 'function',
        line,
        signature: signature.trim(),
        exported: isExported,
      });
    }
  }

  // Extract interfaces (TypeScript only)
  if (isTypeScript && shouldExtract('interface')) {
    const interfaceRegex = new RegExp(tsPatterns.interface.source, 'gm');
    let match;
    while ((match = interfaceRegex.exec(content)) !== null) {
      const line = getLineNumber(content, match.index);
      const isExported = !!match[2];
      const name = match[3];
      const extendsClause = match[4]?.trim() || '';

      let signature = '';
      if (isExported) signature += 'export ';
      signature += `interface ${name}`;
      if (extendsClause) signature += ` ${extendsClause}`;

      definitions.push({
        name,
        type: 'interface',
        line,
        signature: signature.trim(),
        exported: isExported,
      });
    }
  }

  // Extract type aliases (TypeScript only)
  if (isTypeScript && shouldExtract('type')) {
    const typeRegex = new RegExp(tsPatterns.type.source, 'gm');
    let match;
    while ((match = typeRegex.exec(content)) !== null) {
      const line = getLineNumber(content, match.index);
      const isExported = !!match[2];
      const name = match[3];
      const generics = match[4]?.trim() || '';

      let signature = '';
      if (isExported) signature += 'export ';
      signature += `type ${name}`;
      if (generics) signature += generics;
      signature += ' = ...';

      definitions.push({
        name,
        type: 'type',
        line,
        signature: signature.trim(),
        exported: isExported,
      });
    }
  }

  // Extract const declarations (not arrow functions)
  if (shouldExtract('const')) {
    const constRegex = new RegExp(tsPatterns.const.source, 'gm');
    let match;
    while ((match = constRegex.exec(content)) !== null) {
      const line = getLineNumber(content, match.index);
      const isExported = !!match[2];
      const name = match[3];

      // Skip if this is an arrow function (already handled above)
      const lineContent = lines[line - 1] || '';
      if (lineContent.includes('=>')) {
        continue;
      }

      const signature = `${isExported ? 'export ' : ''}const ${name}`;

      definitions.push({
        name,
        type: 'const',
        line,
        signature,
        exported: isExported,
      });
    }
  }

  // Extract enums (TypeScript only)
  if (isTypeScript && shouldExtract('enum')) {
    const enumRegex = new RegExp(tsPatterns.enum.source, 'gm');
    let match;
    while ((match = enumRegex.exec(content)) !== null) {
      const line = getLineNumber(content, match.index);
      const isExported = !!match[2];
      const name = match[3];

      const signature = `${isExported ? 'export ' : ''}enum ${name}`;

      definitions.push({
        name,
        type: 'enum',
        line,
        signature,
        exported: isExported,
      });
    }
  }

  // Extract methods within classes
  if (shouldExtract('method')) {
    // Find class bodies and extract methods from them
    const classBodyRegex = /class\s+(\w+)[^{]*\{([^]*?)^\}/gm;
    let classMatch;
    while ((classMatch = classBodyRegex.exec(content)) !== null) {
      const className = classMatch[1];
      const classBody = classMatch[2];
      const classStartLine = getLineNumber(content, classMatch.index);

      // Find methods within the class body
      const methodRegex =
        /^(\s*)(public\s+|private\s+|protected\s+)?(static\s+)?(async\s+)?(?!constructor)(\w+)\s*(\([^)]*\))\s*(:\s*[^{;]+)?(?=\s*\{)/gm;
      let methodMatch;
      while ((methodMatch = methodRegex.exec(classBody)) !== null) {
        const methodLine =
          classStartLine + classBody.substring(0, methodMatch.index).split('\n').length - 1;
        const visibility = methodMatch[2]?.trim() || '';
        const isStatic = !!methodMatch[3];
        const isAsync = !!methodMatch[4];
        const name = methodMatch[5];
        const params = methodMatch[6] || '()';
        const returnType = methodMatch[7]?.trim() || '';

        // Skip getters/setters identified by common patterns
        if (name === 'get' || name === 'set') continue;

        let signature = '';
        if (visibility) signature += `${visibility} `;
        if (isStatic) signature += 'static ';
        if (isAsync) signature += 'async ';
        signature += `${name}${params}`;
        if (returnType) signature += ` ${returnType}`;

        definitions.push({
          name: `${className}.${name}`,
          type: 'method',
          line: methodLine,
          signature: signature.trim(),
          exported: false, // Methods are not directly exported
        });
      }
    }
  }

  return definitions;
}

/**
 * Extract Python definitions
 */
function extractPythonDefinitions(
  content: string,
  types: DefinitionType[] | undefined
): Definition[] {
  const definitions: Definition[] = [];
  const shouldExtract = (type: DefinitionType) => !types || types.includes(type);

  // Extract classes
  if (shouldExtract('class')) {
    const classRegex = new RegExp(pythonPatterns.class.source, 'gm');
    let match;
    while ((match = classRegex.exec(content)) !== null) {
      const line = getLineNumber(content, match.index);
      const name = match[1];
      const inheritance = match[2] || '';

      const signature = `class ${name}${inheritance}`;

      definitions.push({
        name,
        type: 'class',
        line,
        signature,
        exported: true, // Python doesn't have explicit exports at module level
      });
    }
  }

  // Extract functions/methods
  if (shouldExtract('function')) {
    const funcRegex = new RegExp(pythonPatterns.function.source, 'gm');
    let match;
    while ((match = funcRegex.exec(content)) !== null) {
      const line = getLineNumber(content, match.index);
      const isAsync = !!match[1];
      const name = match[2];
      const params = match[3] || '()';
      const returnType = match[4]?.trim() || '';

      let signature = '';
      if (isAsync) signature += 'async ';
      signature += `def ${name}${params}`;
      if (returnType) signature += ` ${returnType}`;

      // Check if it's a method (indented under a class)
      const lineContent = content.split('\n')[line - 1] || '';
      const isMethod = /^\s+/.test(lineContent);

      definitions.push({
        name,
        type: isMethod ? 'method' : 'function',
        line,
        signature,
        exported: !isMethod, // Top-level functions are effectively exported
      });
    }
  }

  return definitions;
}

/**
 * Extract Bash definitions
 */
function extractBashDefinitions(
  content: string,
  types: DefinitionType[] | undefined
): Definition[] {
  const definitions: Definition[] = [];
  const shouldExtract = (type: DefinitionType) => !types || types.includes(type);

  // Bash has no classes/interfaces/types — only functions
  if (!shouldExtract('function')) {
    return definitions;
  }

  // POSIX syntax: name() { ... }
  const posixRegex = new RegExp(bashPatterns.posixFunction.source, 'gm');
  let match;
  while ((match = posixRegex.exec(content)) !== null) {
    const line = getLineNumber(content, match.index);
    const name = match[2];
    const signature = `${name}()`;

    definitions.push({
      name,
      type: 'function',
      line,
      signature,
      exported: true, // Bash functions are globally scoped when sourced
    });
  }

  // Bash keyword syntax: function name { ... } or function name() { ... }
  const bashRegex = new RegExp(bashPatterns.bashFunction.source, 'gm');
  while ((match = bashRegex.exec(content)) !== null) {
    const line = getLineNumber(content, match.index);
    const name = match[2];
    const signature = `function ${name}`;

    // Skip if already captured by POSIX pattern (dedup name() { ... } style)
    if (definitions.some((d) => d.name === name)) {
      continue;
    }

    definitions.push({
      name,
      type: 'function',
      line,
      signature,
      exported: true,
    });
  }

  return definitions;
}

export const definitionsTool = defineTool<typeof DefinitionsParamsSchema, DefinitionsResult>({
  name: 'definitions',
  description: `Extract code definitions (classes, functions, interfaces, etc.) from source files.

Supports:
- TypeScript (.ts, .tsx): class, function, interface, type, const, enum, method
- JavaScript (.js, .jsx): class, function, const, method
- Python (.py): class, function/def
- Bash (.sh, .bash): function

Returns definition name, type, line number, signature, and export status.`,

  parameters: DefinitionsParamsSchema,

  permission: {
    action: 'read',
    getResource: (params) => params.filePath,
  },

  async execute(params, context): Promise<ToolResult<DefinitionsResult>> {
    const filePath = path.isAbsolute(params.filePath)
      ? params.filePath
      : path.join(context.workdir, params.filePath);

    try {
      // Check if file exists
      const stat = await fs.stat(filePath);
      if (stat.isDirectory()) {
        return {
          success: false,
          error: `Path is a directory, not a file: ${filePath}`,
        };
      }

      // Read file content
      const content = await fs.readFile(filePath, 'utf-8');

      // Detect language
      const language = detectLanguage(filePath);
      if (language === 'unknown') {
        return {
          success: false,
          error: `Unsupported file type: ${path.extname(filePath)}. Supported: .ts, .tsx, .js, .jsx, .mjs, .cjs, .py, .sh, .bash`,
        };
      }

      // Extract definitions based on language
      let definitions: Definition[];
      if (language === 'python') {
        definitions = extractPythonDefinitions(content, params.types);
      } else if (language === 'bash') {
        definitions = extractBashDefinitions(content, params.types);
      } else {
        const isTypeScript = language === 'typescript';
        definitions = extractTsDefinitions(content, params.types, isTypeScript);
      }

      // Sort by line number
      definitions.sort((a, b) => a.line - b.line);

      return {
        success: true,
        data: {
          filePath,
          definitions,
          language,
        },
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);

      if (message.includes('ENOENT')) {
        return {
          success: false,
          error: `File not found: ${filePath}`,
        };
      }

      if (message.includes('EACCES')) {
        return {
          success: false,
          error: `Permission denied: ${filePath}`,
        };
      }

      return {
        success: false,
        error: message,
      };
    }
  },
});
