/**
 * Tree-sitter AST parsing helpers
 *
 * Provides lazy-initialised parsers for TypeScript and JavaScript.
 * The parsers are created on first use to avoid startup overhead.
 */

import Parser from 'tree-sitter';
import TypeScript from 'tree-sitter-typescript';
import JavaScript from 'tree-sitter-javascript';

// Lazily initialised parsers (one per language to avoid setLanguage races)
let tsParser: Parser | null = null;
let jsParser: Parser | null = null;
let tsxParser: Parser | null = null;

/**
 * Get (or lazily create) the TypeScript parser
 */
function getTsParser(): Parser {
  if (!tsParser) {
    tsParser = new Parser();
    tsParser.setLanguage(TypeScript.typescript);
  }
  return tsParser;
}

/**
 * Get (or lazily create) the TSX parser
 */
function getTsxParser(): Parser {
  if (!tsxParser) {
    tsxParser = new Parser();
    tsxParser.setLanguage(TypeScript.tsx);
  }
  return tsxParser;
}

/**
 * Get (or lazily create) the JavaScript parser
 */
function getJsParser(): Parser {
  if (!jsParser) {
    jsParser = new Parser();
    jsParser.setLanguage(JavaScript);
  }
  return jsParser;
}

export type SupportedExtension = 'ts' | 'tsx' | 'js' | 'mjs' | 'cjs' | 'jsx';

/**
 * Returns true if the file extension is supported by tree-sitter parsers
 */
export function isSupportedFile(filePath: string): boolean {
  const ext = filePath.split('.').pop()?.toLowerCase();
  return (
    ext === 'ts' || ext === 'tsx' || ext === 'js' || ext === 'mjs' || ext === 'cjs' || ext === 'jsx'
  );
}

/**
 * Parse source code using the appropriate parser for the file extension.
 * Returns the root node of the AST, or null if the file is not supported.
 */
export function parseSource(source: string, filePath: string): Parser.SyntaxNode | null {
  const ext = filePath.split('.').pop()?.toLowerCase() as SupportedExtension | undefined;

  let parser: Parser;
  switch (ext) {
    case 'ts':
      parser = getTsParser();
      break;
    case 'tsx':
    case 'jsx':
      parser = getTsxParser();
      break;
    case 'js':
    case 'mjs':
    case 'cjs':
      parser = getJsParser();
      break;
    default:
      return null;
  }

  try {
    const tree = parser.parse(source);
    return tree.rootNode;
  } catch {
    // Parser errors are non-fatal; return null so callers can skip the file
    return null;
  }
}

/**
 * Walk every descendant of a node, calling `visitor` for each.
 * Skips nodes whose type is in the `skipTypes` set.
 */
export function walkNode(
  node: Parser.SyntaxNode,
  visitor: (node: Parser.SyntaxNode) => void,
  skipTypes?: Set<string>
): void {
  if (skipTypes?.has(node.type)) return;
  visitor(node);
  for (let i = 0; i < node.childCount; i++) {
    const child = node.child(i);
    if (child) walkNode(child, visitor, skipTypes);
  }
}

/**
 * Find the first child node of `node` with type in `types`, or null.
 */
export function findChildOfType(
  node: Parser.SyntaxNode,
  ...types: string[]
): Parser.SyntaxNode | null {
  const typeSet = new Set(types);
  for (let i = 0; i < node.childCount; i++) {
    const child = node.child(i);
    if (child && typeSet.has(child.type)) return child;
  }
  return null;
}

/**
 * Find the `identifier` or `type_identifier` child of a node (for name extraction)
 */
export function getNameNode(node: Parser.SyntaxNode): Parser.SyntaxNode | null {
  return findChildOfType(node, 'identifier', 'type_identifier', 'property_identifier');
}
