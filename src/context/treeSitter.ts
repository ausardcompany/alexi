/**
 * Tree-sitter AST parsing helpers
 *
 * Provides lazy-initialised parsers for TypeScript, JavaScript, and Bash.
 *
 * Grammars (`tree-sitter-typescript`, `tree-sitter-javascript`, `tree-sitter-bash`)
 * and the `tree-sitter` runtime itself are declared as optional peer
 * dependencies so users who never touch code-analysis features do not pay
 * their ~67MB install cost. They are loaded on first parser use via a
 * `createRequire` shim wrapped in try/catch; if the load fails we cache the
 * failure and every subsequent parse for that language returns null. Callers
 * that need to surface an actionable error to the end user can consult
 * `getMissingGrammars()` / `formatMissingGrammarError()`.
 */

import { createRequire } from 'module';
import { getExtension } from './extensions.js';

// The `tree-sitter` package is an optional peer dependency, so we cannot
// import its types statically. We describe the subset of the SyntaxNode
// surface actually used across the codebase so downstream consumers stay
// well-typed without pulling the peer-dep's types.
export interface TreeSitterSyntaxNode {
  readonly type: string;
  readonly text: string;
  readonly childCount: number;
  readonly isNamed: boolean;
  readonly parent: TreeSitterSyntaxNode | null;
  readonly startPosition: { row: number; column: number };
  child(i: number): TreeSitterSyntaxNode | null;
  childForFieldName?(field: string): TreeSitterSyntaxNode | null;
}

type AnyParser = {
  setLanguage(lang: unknown): void;
  parse(source: string): { rootNode: TreeSitterSyntaxNode };
};

const requireOptional = createRequire(import.meta.url);

/** Grammar identifiers we support. */
export type Grammar =
  'tree-sitter' | 'tree-sitter-typescript' | 'tree-sitter-javascript' | 'tree-sitter-bash';

const OPTIONAL_GRAMMAR_PACKAGES: readonly Grammar[] = [
  'tree-sitter',
  'tree-sitter-typescript',
  'tree-sitter-javascript',
  'tree-sitter-bash',
];

/**
 * Human-readable install hint listing the optional peer dependencies.
 * Kept as a single string constant so tests and docs can assert on the
 * exact wording.
 */
export const MISSING_GRAMMAR_INSTALL_HINT =
  'Install optional dependencies to enable definitions tool: `npm install tree-sitter tree-sitter-typescript tree-sitter-javascript tree-sitter-bash`';

// Cached module loads. `undefined` means "not attempted yet".
// `null` means "attempted and failed" (memoised so we do not retry on every call).
const loadedModules: Map<Grammar, unknown | null> = new Map();

/**
 * Attempt to load an optional grammar/runtime package synchronously.
 * Returns the module on success or `null` on failure (and memoises the null).
 */
function loadOptionalModule<T = unknown>(pkg: Grammar): T | null {
  if (loadedModules.has(pkg)) {
    return loadedModules.get(pkg) as T | null;
  }
  try {
    const mod = requireOptional(pkg) as T;
    loadedModules.set(pkg, mod);
    return mod;
  } catch {
    loadedModules.set(pkg, null);
    return null;
  }
}

/**
 * Return the list of optional grammar packages that failed to load so far
 * (or would fail if attempted). Useful for producing an actionable error
 * message when a caller wanted to parse a file but the grammar is missing.
 */
export function getMissingGrammars(): Grammar[] {
  const missing: Grammar[] = [];
  for (const pkg of OPTIONAL_GRAMMAR_PACKAGES) {
    if (loadOptionalModule(pkg) === null) {
      missing.push(pkg);
    }
  }
  return missing;
}

/**
 * Build a user-facing error message describing which optional grammars are
 * missing and how to install them. Returns null when every optional grammar
 * is available.
 */
export function formatMissingGrammarError(): string | null {
  const missing = getMissingGrammars();
  if (missing.length === 0) {
    return null;
  }
  return `${MISSING_GRAMMAR_INSTALL_HINT} (missing: ${missing.join(', ')})`;
}

/**
 * Eagerly load all optional grammars via dynamic import. Intended for
 * ahead-of-time warm-up (e.g. from a long-running server). All failures are
 * swallowed; use `getMissingGrammars()` afterwards to check the result.
 */
export async function preloadGrammars(): Promise<void> {
  for (const pkg of OPTIONAL_GRAMMAR_PACKAGES) {
    if (loadedModules.has(pkg)) {
      continue;
    }
    try {
      const mod = await import(pkg);
      // dynamic imports expose CJS exports on `.default` under NodeNext.
      const resolved = (mod as { default?: unknown }).default ?? mod;
      loadedModules.set(pkg, resolved);
    } catch {
      loadedModules.set(pkg, null);
    }
  }
}

// Lazily initialised parsers (one per language to avoid setLanguage races)
let tsParser: AnyParser | null = null;
let jsParser: AnyParser | null = null;
let tsxParser: AnyParser | null = null;
let bashParser: AnyParser | null = null;

/**
 * Instantiate a parser with the given language, returning null when either
 * the `tree-sitter` runtime or the language grammar is unavailable.
 */
function makeParser(
  languageAccessor: (grammar: unknown) => unknown,
  grammarPkg: Grammar
): AnyParser | null {
  const ParserCtor = loadOptionalModule<{ new (): AnyParser } | { default: { new (): AnyParser } }>(
    'tree-sitter'
  );
  const grammarModule = loadOptionalModule(grammarPkg);
  if (!ParserCtor || !grammarModule) {
    return null;
  }
  // Handle both CJS default-only exports and ES module wrappers.
  const Ctor =
    typeof ParserCtor === 'function'
      ? (ParserCtor as { new (): AnyParser })
      : (ParserCtor as { default: { new (): AnyParser } }).default;
  const grammar = languageAccessor(grammarModule);
  if (!grammar) {
    return null;
  }
  try {
    const parser: AnyParser = new Ctor();
    parser.setLanguage(grammar);
    return parser;
  } catch {
    return null;
  }
}

function getTsParser(): AnyParser | null {
  if (!tsParser) {
    tsParser = makeParser(
      (g) => (g as { typescript?: unknown }).typescript,
      'tree-sitter-typescript'
    );
  }
  return tsParser;
}

function getTsxParser(): AnyParser | null {
  if (!tsxParser) {
    tsxParser = makeParser((g) => (g as { tsx?: unknown }).tsx, 'tree-sitter-typescript');
  }
  return tsxParser;
}

function getJsParser(): AnyParser | null {
  if (!jsParser) {
    jsParser = makeParser((g) => g, 'tree-sitter-javascript');
  }
  return jsParser;
}

function getBashParser(): AnyParser | null {
  if (!bashParser) {
    bashParser = makeParser((g) => g, 'tree-sitter-bash');
  }
  return bashParser;
}

/**
 * Extensions that tree-sitter can parse.
 * `.d.ts` is included because declaration files are valid TypeScript;
 * `.mts` / `.cts` are TypeScript module variants;
 * `.mjs` / `.cjs` / `.jsx` are JavaScript module variants.
 */
export type SupportedExtension =
  '.ts' | '.tsx' | '.mts' | '.cts' | '.d.ts' | '.js' | '.mjs' | '.cjs' | '.jsx' | '.sh' | '.bash';

const SUPPORTED_EXTENSIONS: ReadonlySet<string> = new Set<SupportedExtension>([
  '.ts',
  '.tsx',
  '.mts',
  '.cts',
  '.d.ts',
  '.js',
  '.mjs',
  '.cjs',
  '.jsx',
  '.sh',
  '.bash',
]);

/**
 * Returns true if the file extension is supported by tree-sitter parsers.
 * NOTE: this is a static check on the extension; it does not verify whether
 * the corresponding grammar package is installed. Use `getMissingGrammars()`
 * for the runtime capability check.
 */
export function isSupportedFile(filePath: string): boolean {
  return SUPPORTED_EXTENSIONS.has(getExtension(filePath));
}

/**
 * Parse source code using the appropriate parser for the file extension.
 * Returns the root node of the AST, or null if the file is not supported
 * OR the required grammar is not installed OR parsing failed.
 */
export function parseSource(source: string, filePath: string): TreeSitterSyntaxNode | null {
  const ext = getExtension(filePath);

  let parser: AnyParser | null;
  switch (ext) {
    case '.ts':
    case '.mts':
    case '.cts':
    case '.d.ts':
      parser = getTsParser();
      break;
    case '.tsx':
    case '.jsx':
      parser = getTsxParser();
      break;
    case '.js':
    case '.mjs':
    case '.cjs':
      parser = getJsParser();
      break;
    case '.sh':
    case '.bash':
      parser = getBashParser();
      break;
    default:
      return null;
  }

  // Return null if parser initialization failed (unsupported ext, missing
  // grammar, or setLanguage error). Callers that need to distinguish
  // "missing grammar" from "parse failure" can call getMissingGrammars().
  if (!parser) {
    return null;
  }

  try {
    const tree = parser.parse(source);
    return tree.rootNode as TreeSitterSyntaxNode;
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
  node: TreeSitterSyntaxNode,
  visitor: (node: TreeSitterSyntaxNode) => void,
  skipTypes?: Set<string>
): void {
  if (skipTypes?.has(node.type)) {
    return;
  }
  visitor(node);
  for (let i = 0; i < node.childCount; i++) {
    const child = node.child(i);
    if (child) {
      walkNode(child, visitor, skipTypes);
    }
  }
}

/**
 * Find the first child node of `node` with type in `types`, or null.
 */
export function findChildOfType(
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
 * Find the `identifier` or `type_identifier` child of a node (for name extraction).
 */
export function getNameNode(node: TreeSitterSyntaxNode): TreeSitterSyntaxNode | null {
  return findChildOfType(node, 'identifier', 'type_identifier', 'property_identifier');
}

/**
 * @internal Reset all cached parsers and module loads. Test-only helper —
 * exported so unit tests can simulate a fresh process after mutating module
 * availability. Not part of the public API.
 */
export function __resetGrammarCache(): void {
  loadedModules.clear();
  tsParser = null;
  jsParser = null;
  tsxParser = null;
  bashParser = null;
}
