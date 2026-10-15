/**
 * Symbol extraction from AST nodes
 *
 * Extracts top-level symbols (classes, functions, interfaces, types,
 * variables, methods) from a TypeScript/JavaScript source file using
 * the tree-sitter AST produced by treeSitter.ts.
 */

import { parseSource, walkNode, getNameNode, type TreeSitterSyntaxNode } from './treeSitter.js';
import type { BashTag } from './bashTags.js';

// ─── Public interfaces ────────────────────────────────────────────────────────

export interface CodeSymbol {
  name: string;
  /**
   * Logical category of the symbol.
   *
   * TS/JS/Python emit `class | function | interface | type | variable |
   * method`. Bash additionally emits `for | while | case` to surface the
   * extra tag categories tree-sitter-bash can detect (see
   * `src/context/bashTags.ts`). Downstream renderers (`repoMap.ts`) treat
   * the kind as an opaque label, so adding new kinds is backwards
   * compatible for formatting.
   */
  kind:
    'class' | 'function' | 'interface' | 'type' | 'variable' | 'method' | 'for' | 'while' | 'case';
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
function extractSignature(node: TreeSitterSyntaxNode): string {
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
  node: TreeSitterSyntaxNode
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
  let nameNode: TreeSitterSyntaxNode | null = null;
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

// ─── Bash symbol extraction ───────────────────────────────────────────────────

/**
 * Returns true if the file path points to a bash script.
 */
function isBashFile(filePath: string): boolean {
  const ext = filePath.split('.').pop()?.toLowerCase();
  return ext === 'sh' || ext === 'bash';
}

/**
 * Build a compact single-line signature for a bash function declaration.
 * Produces either `name()` or `function name` / `function name()` to match
 * the two supported syntaxes.
 */
function extractBashSignature(node: TreeSitterSyntaxNode, name: string): string {
  const raw = node.text ?? '';
  const firstLine = raw.split('\n')[0].trim();
  // Detect Bash-style `function name [()] { ... }`
  const startsWithFunction = /^function\b/.test(firstLine);
  // Detect POSIX `name() { ... }` style — parens present in the head
  const headBeforeBody = firstLine.replace(/\{.*$/, '').trim();
  const hasParens = /\(\s*\)/.test(headBeforeBody);
  if (startsWithFunction) {
    return hasParens ? `function ${name}()` : `function ${name}`;
  }
  return `${name}()`;
}

/**
 * Shorten a bash construct's header for use as a `signature` string.
 * Mirrors the TS/JS cap at 120 characters + ellipsis to keep repomap
 * rendering stable across languages.
 */
function truncateHeader(text: string): string {
  const trimmed = text.trim();
  return trimmed.length > 120 ? trimmed.slice(0, 120) + '…' : trimmed;
}

/**
 * Extract top-level tags from a bash source file.
 *
 * Produces `CodeSymbol` entries for:
 *  - `function_definition` — POSIX `name() { ... }` and Bash keyword-style
 *    `function name [()] { ... }`, surfaced with kind `function` and a
 *    normalised signature.
 *  - `for_statement`, `while_statement`, `case_statement` — surfaced with
 *    the matching kind (`for` / `while` / `case`) and a trimmed first-line
 *    signature. The name is best-effort (`for` loop variable, `case`
 *    scrutinee, `function` name, or a positional `<kind>@L<line>`
 *    fallback) so the symbol index remains stable even when a construct
 *    has no natural identifier.
 *
 * Only direct children of the program root are kept — helpers and
 * compound statements nested inside another function are dropped so the
 * symbol index stays compact. Callers that need the full set should use
 * `extractBashTagsFromRoot` directly.
 */
function extractBashSymbols(root: TreeSitterSyntaxNode, filePath: string): CodeSymbol[] {
  const symbols: CodeSymbol[] = [];

  // Walk the direct children of the program and, for each, unwrap a
  // single `redirected_statement` wrapper if present. tree-sitter-bash
  // wraps `while read x; do ...; done < input.txt` and similar top-level
  // redirected forms in a `redirected_statement` node; the inner tagged
  // statement is still conceptually top-level and should surface.
  for (let i = 0; i < root.childCount; i++) {
    const child = root.child(i);
    if (!child) continue;

    const inner = child.type === 'redirected_statement' ? child.child(0) : child;
    if (!inner) continue;

    const tagKind = BASH_TOP_LEVEL_KINDS[inner.type];
    if (!tagKind) continue;

    if (tagKind === 'function') {
      // Preserve the previously-tested signature format for functions.
      const nameNode = inner.childForFieldName?.('name') ?? findBashFunctionName(inner);
      const name = nameNode?.text;
      if (!name) continue;
      symbols.push({
        name,
        kind: 'function',
        filePath,
        line: inner.startPosition.row + 1,
        signature: extractBashSignature(inner, name),
        references: 0,
      });
      continue;
    }

    // For loops / while loops / case statements re-use the bashTags
    // name derivation so the symbol name stays consistent with the
    // tag-level output (`i` for `for i in ...`, `"$1"` for case, etc.).
    // The `function` branch above returned, so the remaining kinds are
    // guaranteed to be `BashTag['kind']`.
    const flowKind = tagKind as Exclude<BashTag['kind'], 'function'>;
    const name = bashNameForNode(flowKind, inner);
    symbols.push({
      name,
      kind: flowKind,
      filePath,
      line: inner.startPosition.row + 1,
      signature: truncateHeader(inner.text ?? ''),
      references: 0,
    });
  }

  return symbols;
}

/**
 * AST node types that map to a `CodeSymbol['kind']` at the bash top
 * level. Kept local to `symbols.ts` because the richer tag set lives in
 * `bashTags.ts` and is independent of the symbol-index trim.
 */
const BASH_TOP_LEVEL_KINDS: Readonly<Record<string, CodeSymbol['kind']>> = {
  function_definition: 'function',
  for_statement: 'for',
  while_statement: 'while',
  case_statement: 'case',
};

/**
 * Older grammar fallback for the function name — mirrors the behaviour
 * previously implemented inline so pre-0.21 tree-sitter-bash releases
 * still produce usable output.
 */
function findBashFunctionName(node: TreeSitterSyntaxNode): TreeSitterSyntaxNode | null {
  for (let i = 0; i < node.childCount; i++) {
    const child = node.child(i);
    if (child && child.type === 'word') return child;
  }
  return null;
}

/**
 * Mirror `bashTagName` for the three non-function kinds, kept local to
 * avoid a circular dependency on bashTags.ts for a tiny helper. The
 * logic MUST stay in sync with `bashTagName` — the shared contract is
 * covered by the symbols.test.ts + bashTags.test.ts suites together.
 */
function bashNameForNode(
  kind: Exclude<BashTag['kind'], 'function'>,
  node: TreeSitterSyntaxNode
): string {
  const line = node.startPosition.row + 1;
  if (kind === 'for') {
    const varNode =
      node.childForFieldName?.('variable') ?? firstChildOfTypes(node, 'variable_name', 'word');
    return varNode?.text ?? `for@L${line}`;
  }
  if (kind === 'case') {
    const valueNode =
      node.childForFieldName?.('value') ??
      firstChildOfTypes(node, 'word', 'string', 'simple_expansion', 'expansion');
    const text = valueNode?.text?.trim();
    return text && text.length > 0 ? text : `case@L${line}`;
  }
  return `while@L${line}`;
}

function firstChildOfTypes(
  node: TreeSitterSyntaxNode,
  ...types: string[]
): TreeSitterSyntaxNode | null {
  const typeSet = new Set(types);
  for (let i = 0; i < node.childCount; i++) {
    const child = node.child(i);
    if (child && typeSet.has(child.type)) return child;
  }
  return null;
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

  // Bash uses a different AST shape (no classes / interfaces / etc.)
  if (isBashFile(filePath)) {
    return extractBashSymbols(root, filePath);
  }

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
