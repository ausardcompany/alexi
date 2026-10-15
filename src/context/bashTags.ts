/**
 * Bash tree-sitter tag extraction
 *
 * Extracts repomap-relevant tags from a bash source file: function
 * definitions, `for` / `while` loops, and `case` statements. Mirrors the
 * tag categories Aider surfaces for shell scripts so the repository map
 * carries enough shell-script context for the agent.
 *
 * The extractor walks the entire tree, so tags nested inside functions
 * (e.g. a `for` loop within `deploy()`) are reported too. Callers that
 * only want top-level tags (`symbols.ts` currently does, to keep the
 * symbol index compact) can filter the results by `tag.depth === 0` or
 * by comparing `tag.parentType === 'program'`.
 *
 * Returns an empty array when:
 *   - The file is not a supported bash file (`isBashSupported` guard), OR
 *   - The `tree-sitter-bash` grammar is not installed, OR
 *   - Parsing fails.
 *
 * Grammar availability can be probed via
 * `checkGrammarAvailable('bash')` from `./treeSitter.js`.
 */

import { parseSource, type TreeSitterSyntaxNode } from './treeSitter.js';
import { getLanguageForFile } from './extensions.js';

/** Tag categories emitted by {@link extractBashTags}. */
export type BashTagKind = 'function' | 'for' | 'while' | 'case';

/**
 * One extracted tag.
 *
 *  - `name` is the best-effort stable identifier for the construct: the
 *    function name for `function`, the loop variable for `for`, the case
 *    scrutinee text for `case`, or a positional `<kind>@L<line>` fallback
 *    (used for `while` which has no natural identifier, and for parses
 *    where the field lookup fails on an older grammar version).
 *  - `text` is the trimmed first line of the construct (its header).
 *  - `line` and `column` are 1-indexed.
 *  - `parentType` is the AST node type of the immediate parent, so
 *    callers can tell `top-level in program` apart from `inside a
 *    function body / another compound statement` without re-walking.
 */
export interface BashTag {
  kind: BashTagKind;
  name: string;
  line: number;
  column: number;
  text: string;
  parentType: string;
}

const TAG_NODE_TYPES: Readonly<Record<string, BashTagKind>> = {
  function_definition: 'function',
  for_statement: 'for',
  while_statement: 'while',
  case_statement: 'case',
};

/** Return true when `filePath` is a bash-family source file. */
export function isBashSupported(filePath: string): boolean {
  return getLanguageForFile(filePath) === 'bash';
}

function firstLine(node: TreeSitterSyntaxNode): string {
  const raw = node.text ?? '';
  return raw.split('\n')[0].trim();
}

function findFirstChildOfType(
  node: TreeSitterSyntaxNode,
  ...types: string[]
): TreeSitterSyntaxNode | null {
  const typeSet = new Set(types);
  for (let i = 0; i < node.childCount; i++) {
    const child = node.child(i);
    if (child && typeSet.has(child.type)) {
      return child;
    }
  }
  return null;
}

/**
 * Derive a human-readable identifier for a bash construct.
 *
 * Falls back to `<kind>@L<line>` when the construct has no natural name
 * (e.g. a `while` loop) or when the tree-sitter-bash grammar does not
 * expose the expected field name on an older release.
 */
export function bashTagName(kind: BashTagKind, node: TreeSitterSyntaxNode): string {
  const line = node.startPosition.row + 1;
  if (kind === 'function') {
    const nameNode = node.childForFieldName?.('name') ?? findFirstChildOfType(node, 'word');
    return nameNode?.text ?? `function@L${line}`;
  }
  if (kind === 'for') {
    const varNode =
      node.childForFieldName?.('variable') ?? findFirstChildOfType(node, 'variable_name', 'word');
    return varNode?.text ?? `for@L${line}`;
  }
  if (kind === 'case') {
    const valueNode =
      node.childForFieldName?.('value') ??
      findFirstChildOfType(node, 'word', 'string', 'simple_expansion', 'expansion');
    const text = valueNode?.text?.trim();
    return text && text.length > 0 ? text : `case@L${line}`;
  }
  // while has no natural identifier.
  return `while@L${line}`;
}

/**
 * Walk the AST iteratively, collecting every `function_definition`,
 * `for_statement`, `while_statement`, and `case_statement` encountered.
 *
 * Iteration order is pre-order (parent before child) and results are
 * sorted by `line` then `column` before being returned so callers can
 * rely on top-to-bottom ordering regardless of walk order.
 */
function collectTags(root: TreeSitterSyntaxNode): BashTag[] {
  const tags: BashTag[] = [];
  const stack: TreeSitterSyntaxNode[] = [root];
  while (stack.length > 0) {
    const node = stack.pop() as TreeSitterSyntaxNode;
    const kind = TAG_NODE_TYPES[node.type];
    if (kind) {
      tags.push({
        kind,
        name: bashTagName(kind, node),
        line: node.startPosition.row + 1,
        column: node.startPosition.column + 1,
        text: firstLine(node),
        parentType: node.parent?.type ?? 'program',
      });
    }
    // Push children in reverse so the iterative pre-order walk visits
    // them in natural source order.
    for (let i = node.childCount - 1; i >= 0; i--) {
      const child = node.child(i);
      if (child) {
        stack.push(child);
      }
    }
  }
  tags.sort((a, b) => a.line - b.line || a.column - b.column);
  return tags;
}

/**
 * Extract bash tags (functions, loops, case statements) from `source`.
 *
 * The default `filePath` points at a `.sh` file so callers that already
 * know they have bash content do not need to synthesise a path; passing
 * the real path is preferred when available because it is forwarded to
 * downstream error messages.
 */
export function extractBashTags(source: string, filePath = 'script.sh'): BashTag[] {
  if (!isBashSupported(filePath)) {
    return [];
  }
  const root = parseSource(source, filePath);
  if (!root) {
    return [];
  }
  return collectTags(root);
}

/**
 * Extract bash tags from an already-parsed root node.
 *
 * Call sites that have already run {@link parseSource} (for example the
 * `symbols.ts` pipeline) should prefer this entry point over
 * {@link extractBashTags} so they do not re-parse the same source.
 */
export function extractBashTagsFromRoot(root: TreeSitterSyntaxNode): BashTag[] {
  return collectTags(root);
}

/**
 * Convenience wrapper returning only the tags whose immediate parent is
 * the program root. Equivalent to
 * `extractBashTags(source, filePath).filter((t) => t.parentType === 'program')`
 * but kept as a separate export because the `symbols.ts` pipeline uses it
 * for every bash file and the intent is clearer at the call site.
 */
export function extractTopLevelBashTags(source: string, filePath = 'script.sh'): BashTag[] {
  return extractBashTags(source, filePath).filter((tag) => tag.parentType === 'program');
}
