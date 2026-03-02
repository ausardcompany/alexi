/**
 * Symbol extraction from AST nodes
 *
 * Extracts top-level symbols (classes, functions, interfaces, types,
 * variables, methods) from a TypeScript/JavaScript source file using
 * the tree-sitter AST produced by treeSitter.ts.
 */

import { parseSource, walkNode, getNameNode } from './treeSitter.js';

// ─── Public interfaces ────────────────────────────────────────────────────────

export interface CodeSymbol {
  name: string;
  kind: 'class' | 'function' | 'interface' | 'type' | 'variable' | 'method';
  filePath: string;
  line: number;
  /** Condensed first-line signature (e.g. "function foo(a: string): void") */
  signature?: string;
  /** Number of cross-file references discovered during ranking */
  references: number;
}

// ─── Node-type → symbol-kind mapping ─────────────────────────────────────────

const TOP_LEVEL_KINDS: Record<string, CodeSymbol['kind']> = {
  // Classes
  class_declaration: 'class',
  abstract_class_declaration: 'class',
  // Functions
  function_declaration: 'function',
  generator_function_declaration: 'function',
  // Interfaces & types (TypeScript)
  interface_declaration: 'interface',
  type_alias_declaration: 'type',
  // Variables / constants that are exported
  lexical_declaration: 'variable',
  variable_declaration: 'variable',
};

/**
 * Node types that we descend into to look for the above declarations
 * (e.g. export statements wrap the real declaration).
 */
const TRANSPARENT_WRAPPERS = new Set([
  'export_statement',
  'export_default_declaration',
  'ambient_declaration', // "declare …"
]);

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Extract a condensed single-line signature from a node.
 * We take only the first non-trivial line of the node's text and truncate.
 */
function extractSignature(node: import('tree-sitter').SyntaxNode): string {
  const raw = node.text ?? '';
  // Take just the first line and strip the body (everything after '{' or '=>')
  const firstLine = raw.split('\n')[0].replace(/\{.*/, '').replace(/=>.*/, '').trim();
  return firstLine.length > 120 ? firstLine.slice(0, 120) + '…' : firstLine;
}

/**
 * Extract name + kind from a node, unwrapping export/ambient wrappers.
 * Returns null if the node is not a recognisable top-level declaration.
 */
function extractDeclaration(
  node: import('tree-sitter').SyntaxNode
): { name: string; kind: CodeSymbol['kind']; signature: string } | null {
  let target = node;

  // Unwrap transparent export/ambient wrappers
  if (TRANSPARENT_WRAPPERS.has(node.type)) {
    // The actual declaration is usually the last named child
    for (let i = node.childCount - 1; i >= 0; i--) {
      const child = node.child(i);
      if (child && child.type !== 'export' && child.type !== 'default' && child.isNamed) {
        target = child;
        break;
      }
    }
  }

  const kind = TOP_LEVEL_KINDS[target.type];
  if (!kind) return null;

  // For variable declarations, look at the first declarator
  let nameNode: import('tree-sitter').SyntaxNode | null = null;
  if (kind === 'variable') {
    // lexical_declaration → variable_declarator → identifier
    for (let i = 0; i < target.childCount; i++) {
      const child = target.child(i);
      if (child?.type === 'variable_declarator') {
        nameNode = getNameNode(child);
        break;
      }
    }
  } else {
    nameNode = getNameNode(target);
  }

  if (!nameNode) return null;

  return {
    name: nameNode.text,
    kind,
    signature: extractSignature(node), // use the outermost node for the signature
  };
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Extract top-level code symbols from `source`.
 *
 * Only direct children of the root program node (and their export wrappers)
 * are examined. Method extraction is done one level deeper for class bodies.
 */
export function extractSymbols(source: string, filePath: string): CodeSymbol[] {
  const root = parseSource(source, filePath);
  if (!root) return [];

  const symbols: CodeSymbol[] = [];

  // Walk only the first level of the program
  for (let i = 0; i < root.childCount; i++) {
    const child = root.child(i);
    if (!child || !child.isNamed) continue;

    const decl = extractDeclaration(child);
    if (!decl) continue;

    symbols.push({
      name: decl.name,
      kind: decl.kind,
      filePath,
      line: child.startPosition.row + 1,
      signature: decl.signature,
      references: 0,
    });

    // For classes, also extract public methods
    if (decl.kind === 'class') {
      // Find class_body inside the class_declaration (or wrapped node)
      let classNode = child;
      if (TRANSPARENT_WRAPPERS.has(child.type)) {
        for (let j = child.childCount - 1; j >= 0; j--) {
          const c = child.child(j);
          if (c && (c.type === 'class_declaration' || c.type === 'abstract_class_declaration')) {
            classNode = c;
            break;
          }
        }
      }

      walkNode(classNode, (node) => {
        if (
          node.type === 'method_definition' ||
          node.type === 'public_field_definition' ||
          node.type === 'method_signature'
        ) {
          // Only direct children of the class body (skip deeply nested)
          if (node.parent?.type === 'class_body' && node.parent?.parent === classNode) {
            const methodName = getNameNode(node);
            if (methodName) {
              symbols.push({
                name: `${decl.name}.${methodName.text}`,
                kind: 'method',
                filePath,
                line: node.startPosition.row + 1,
                signature: extractSignature(node),
                references: 0,
              });
            }
          }
        }
      });
    }
  }

  return symbols;
}
