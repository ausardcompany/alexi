/**
 * Shell Permission Pattern Masking (upstream port)
 *
 * The read-only bash rulesets deny shell operators with globs such as `*>*`,
 * `*|*`, `*;*` and `*$(*`, which match the character anywhere in the pattern.
 * When the shell tool uses the raw command text as that pattern, a `|` inside
 * a quoted grep regex or a `2>/dev/null` redirect denies a legitimate
 * read-only command.
 *
 * `pattern` renders the permission pattern from the tree-sitter parse instead
 * of re-lexing the text. Operator characters (`< > | & ; $ \` newline`) are
 * masked with `_` only where the parser proves they are inert:
 *
 *   - inside literal tokens: quoted strings, ANSI-C strings, escaped words,
 *     heredoc bodies
 *   - inside redirects that cannot touch a real file: `/dev/null` targets,
 *     fd duplication such as `2>&1`, and explicit fd closes (`2>&-`)
 *
 * Everything else — real pipes, real redirects, real command substitution,
 * real statement separators — is preserved verbatim so the blocklist still
 * has a chance to match on it.
 *
 * Ported from `packages/opencode/src/kilocode/tool/shell-pattern.ts`
 * (upstream kilocode `c33d81690..a85ae672a`).
 *
 * Tree-sitter is an optional peer dependency in this repo. When the
 * `tree-sitter-bash` grammar is not installed the module falls back to
 * returning the raw command text, matching upstream's behaviour on parse
 * failure.
 */

import type { TreeSitterSyntaxNode } from '../context/treeSitter.js';
import { parseSource } from '../context/treeSitter.js';
import type { ShellType } from './tools/shell/id.js';

// Alexi uses `ShellType` in `src/tool/tools/shell/id.ts`; upstream refers to
// this as `ShellID`. Alias so the exported signature matches the plan while
// staying honest about the underlying type.
export type ShellID = ShellType;

const MASK = '_';
const OPERATORS = /[<>|&;$`\n]/g;

/**
 * Node types whose text is guaranteed to be a literal string as far as the
 * shell is concerned — operator characters appearing inside them cannot be
 * re-lexed as real operators by the shell, so masking them is safe.
 */
const LITERAL = new Set([
  'word',
  'number',
  'string_content',
  'raw_string',
  'ansi_c_string',
  'heredoc_start',
]);

/** Redirects whose operator writes to (or reads from) a file target. */
const DISCARD = new Set(['>', '>>', '>|', '&>', '&>>', '<']);

/** Redirects that duplicate one file descriptor onto another. */
const DUP = new Set(['>&', '<&']);

/** Redirect operators that close a file descriptor (`n>&-`, `n<&-`). */
const CLOSE = new Set(['>&-', '<&-']);

/**
 * Higher-level nodes whose subtree is user-visible text we want to keep
 * literal: full quoted strings and heredoc redirect bodies. Operator
 * characters inside them do not act as operators, so we mask them.
 */
const TEXT = new Set(['string', 'heredoc_redirect']);

function mask(text: string): string {
  return text.replace(OPERATORS, MASK);
}

/**
 * Iterate the (typed) children of a tree-sitter node. `web-tree-sitter`
 * exposes them via `.children`; the shim in `treeSitter.ts` exposes them
 * via `.child(i)` / `.childCount`. Support both so we can port the upstream
 * implementation without depending on the peer-dep types.
 */
function iterChildren(node: TreeSitterSyntaxNode): TreeSitterSyntaxNode[] {
  const maybeChildren = (node as unknown as { children?: unknown }).children;
  if (Array.isArray(maybeChildren)) {
    return maybeChildren.filter(
      (c): c is TreeSitterSyntaxNode => typeof c === 'object' && c !== null
    );
  }
  const out: TreeSitterSyntaxNode[] = [];
  for (let i = 0; i < node.childCount; i++) {
    const child = node.child(i);
    if (child) {
      out.push(child);
    }
  }
  return out;
}

/**
 * True when a redirect node cannot cause a filesystem write / read, so its
 * operator characters are inert and safe to mask. Mirrors the upstream
 * `inert()` helper.
 */
function inert(node: TreeSitterSyntaxNode): boolean {
  const children = iterChildren(node);
  const op = children.find((child) => !child.isNamed)?.type;
  if (!op) {
    return false;
  }
  if (CLOSE.has(op)) {
    return true;
  }
  const namedChildren = children.filter((c) => c.isNamed);
  const target = namedChildren[namedChildren.length - 1];
  if (!target || target.type === 'file_descriptor') {
    return false;
  }
  if (DISCARD.has(op)) {
    return target.type === 'word' && target.text === '/dev/null';
  }
  if (DUP.has(op)) {
    return target.type === 'number' || target.text === '-';
  }
  return false;
}

/**
 * Recursively render the permission pattern for a parsed shell command.
 * Emits each token verbatim unless the parser has proven that its
 * operator characters are inert, in which case they are replaced with `_`.
 */
function render(node: TreeSitterSyntaxNode): string {
  // Base case: pure literal text — mask any operator chars inside.
  if (LITERAL.has(node.type)) {
    return mask(node.text);
  }

  // Higher-level literal wrappers (quoted strings, heredoc bodies).
  if (TEXT.has(node.type)) {
    return mask(node.text);
  }

  // Redirect nodes: mask iff the operator is inert.
  if (node.type === 'file_redirect' || node.type === 'heredoc_redirect') {
    if (inert(node)) {
      return mask(node.text);
    }
    // Real redirect — walk children so any nested literal is still masked
    // but the operator character itself survives.
    return renderChildren(node);
  }

  const children = iterChildren(node);
  if (children.length === 0) {
    // Leaf node without a special type — preserve its text verbatim.
    return node.text;
  }
  return renderChildren(node);
}

function renderChildren(node: TreeSitterSyntaxNode): string {
  const children = iterChildren(node);
  if (children.length === 0) {
    return node.text;
  }
  // Reassemble token-by-token, using the source-position gaps to preserve
  // whitespace between children. We approximate the gaps by falling back to
  // a single space when the underlying node doesn't expose byte offsets.
  const parts: string[] = [];
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    if (i > 0) {
      parts.push(gapBetween(children[i - 1], child, node));
    }
    parts.push(render(child));
  }
  return parts.join('');
}

function gapBetween(
  prev: TreeSitterSyntaxNode,
  next: TreeSitterSyntaxNode,
  parent: TreeSitterSyntaxNode
): string {
  // Best-effort: if we can read byte offsets from the underlying tree-sitter
  // node, splice the exact whitespace out of the parent's text. Otherwise
  // fall back to a single space (harmless for permission-pattern matching).
  const prevEnd = (prev as unknown as { endIndex?: number }).endIndex;
  const nextStart = (next as unknown as { startIndex?: number }).startIndex;
  const parentStart = (parent as unknown as { startIndex?: number }).startIndex;
  if (
    typeof prevEnd === 'number' &&
    typeof nextStart === 'number' &&
    typeof parentStart === 'number' &&
    nextStart >= prevEnd
  ) {
    const slice = parent.text.slice(prevEnd - parentStart, nextStart - parentStart);
    return slice;
  }
  return ' ';
}

/**
 * Render the permission pattern used by the read-only ruleset for a shell
 * command. Falls back to the raw text if parsing is unavailable or fails.
 *
 * The `kind` argument reserves space for future shell-specific carve-outs
 * (e.g. PowerShell uses different operator characters); today only bash is
 * meaningfully parsed and every other shell falls through to the raw text.
 */
export function pattern(node: TreeSitterSyntaxNode | null, kind: ShellID, raw: string): string {
  try {
    if (!node) {
      return raw;
    }
    if (kind !== 'bash' && kind !== 'sh' && kind !== 'zsh') {
      // Non-POSIX shells don't share the bash operator glossary; keep raw.
      return raw;
    }
    const rendered = render(node);
    return rendered.length > 0 ? rendered : raw;
  } catch {
    return raw;
  }
}

/**
 * Convenience wrapper that parses `command` as bash via the optional
 * tree-sitter-bash grammar and returns the masked pattern. When the grammar
 * is unavailable (or parsing fails) the raw command is returned unchanged.
 */
export function patternFor(command: string, kind: ShellID): string {
  const root = parseSource(command, 'command.bash');
  return pattern(root, kind, command);
}
