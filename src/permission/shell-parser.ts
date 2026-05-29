/**
 * POSIX shell command parser used by the permission gate to detect
 * directory-mutating builtins (`cd`, `pushd`, `popd`, `chdir`) that could
 * otherwise let an LLM-driven session escape its sandbox.
 *
 * Carry-over from claude-code v2.1.149 (PowerShell `cd..` permission bypass
 * fix). The same class of bug — command forms that mutate `PWD` outside the
 * parser's variable-tracking layer — affects every POSIX-shell wrapper.
 *
 * The parser is deliberately small: it walks a bash command and emits a
 * flat list of segments (`{ cmd, args, env, subshell, substitution }`) so
 * that callers (the permission gate, the bash tool wrapper) can audit each
 * segment instead of pattern-matching the raw string.
 *
 * It recognises:
 *   - statement separators: `;`, `&&`, `||`, `&`
 *   - pipes: `|` (treats both sides as separate segments)
 *   - parenthesised subshells: `(…)` (nested SegmentList, `subshell: true`)
 *   - `$(…)` / backtick substitutions (nested SegmentList, `substitution: true`)
 *   - inline assignments: `FOO=bar BAZ=qux cmd …`
 *   - single quotes (literal), double quotes, and `\` escapes
 *
 * It is NOT a full bash grammar — it is just enough to identify directory
 * mutators and the cwd they would resolve against.
 */

import * as path from 'path';

/**
 * A single command segment after parsing. Each segment represents one
 * "binary + args" unit between separators / pipes.
 */
export interface ShellSegment {
  /** The command name (first word after assignments). Empty for assignment-only segments. */
  cmd: string;
  /** Positional argument list (raw, with quoting stripped). */
  args: string[];
  /** Inline `VAR=value` assignments that prefix the command. */
  env: Record<string, string>;
  /** True when this segment lives inside a parenthesised subshell `(…)`. */
  subshell: boolean;
  /** True when this segment came from a `$(…)` or backtick substitution. */
  substitution: boolean;
  /**
   * Nested segment lists from substitutions / subshells encountered while
   * parsing this segment's arguments. They are exposed so callers can audit
   * them without re-parsing.
   */
  nested: ShellSegment[];
}

/** Builtins that mutate the shell's current working directory. */
export const BUILTINS_DIRECTORY_MUTATORS = new Set(['cd', 'pushd', 'popd', 'chdir']);

/** Token types produced by the lexer. */
type TokenKind =
  | 'word'
  | 'op' // ; && || & |
  | 'lparen'
  | 'rparen'
  | 'subst' // already-parsed nested $(...) / `...` content
  | 'eof';

interface Token {
  kind: TokenKind;
  value: string;
  /** For `subst` tokens, the nested SegmentList tree. */
  nested?: ShellSegment[];
}

/**
 * Tokenize a raw command string. Quoting is honoured but not preserved in
 * the output: each `word` token already has its quotes stripped. Command
 * substitutions (`$(…)` / backticks) are recursively parsed so each
 * resulting `subst` token carries a fully resolved nested segment list.
 */
function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  const len = input.length;

  while (i < len) {
    const ch = input[i];

    // Skip whitespace
    if (ch === ' ' || ch === '\t' || ch === '\n') {
      i++;
      continue;
    }

    // Comment — bash treats `#` as start-of-comment outside of words/quotes.
    if (ch === '#') {
      while (i < len && input[i] !== '\n') {
        i++;
      }
      continue;
    }

    // Operators
    if (ch === ';') {
      tokens.push({ kind: 'op', value: ';' });
      i++;
      continue;
    }
    if (ch === '|') {
      if (input[i + 1] === '|') {
        tokens.push({ kind: 'op', value: '||' });
        i += 2;
      } else {
        tokens.push({ kind: 'op', value: '|' });
        i++;
      }
      continue;
    }
    if (ch === '&') {
      if (input[i + 1] === '&') {
        tokens.push({ kind: 'op', value: '&&' });
        i += 2;
      } else {
        tokens.push({ kind: 'op', value: '&' });
        i++;
      }
      continue;
    }
    if (ch === '(') {
      tokens.push({ kind: 'lparen', value: '(' });
      i++;
      continue;
    }
    if (ch === ')') {
      tokens.push({ kind: 'rparen', value: ')' });
      i++;
      continue;
    }

    // Word — accumulate until next operator / whitespace, honouring quotes
    // and substitutions. We keep the original (with quote characters) in
    // `raw` and the stripped form in `stripped`.
    let stripped = '';
    let nested: ShellSegment[] | undefined;
    let isWord = false;

    while (i < len) {
      const c = input[i];
      if (c === ' ' || c === '\t' || c === '\n') {
        break;
      }
      if (c === ';' || c === '|' || c === '&' || c === '(' || c === ')') {
        break;
      }
      if (c === '#' && !isWord) {
        // Comment cannot start mid-word, but if we haven't started a word
        // yet this is unreachable (handled above). Defensive: break.
        break;
      }

      if (c === '\\' && i + 1 < len) {
        // Backslash escape — copy next char literally.
        stripped += input[i + 1];
        i += 2;
        isWord = true;
        continue;
      }

      if (c === "'") {
        // Single-quoted literal — no interpolation. Reads until next `'`.
        i++;
        while (i < len && input[i] !== "'") {
          stripped += input[i];
          i++;
        }
        if (i < len) {
          i++; // consume closing '
        }
        isWord = true;
        continue;
      }

      if (c === '"') {
        // Double-quoted — allows escapes, $(...) and backticks.
        i++;
        while (i < len && input[i] !== '"') {
          if (input[i] === '\\' && i + 1 < len) {
            stripped += input[i + 1];
            i += 2;
            continue;
          }
          if (input[i] === '$' && input[i + 1] === '(') {
            const { content, end } = readBalanced(input, i + 2, '(', ')');
            const inner = parseSegments(content);
            (nested ??= []).push(...markSubstitution(inner));
            stripped += '\u0000'; // placeholder; substitution result is captured separately
            i = end;
            continue;
          }
          if (input[i] === '`') {
            const { content, end } = readUntil(input, i + 1, '`');
            const inner = parseSegments(content);
            (nested ??= []).push(...markSubstitution(inner));
            stripped += '\u0000';
            i = end;
            continue;
          }
          stripped += input[i];
          i++;
        }
        if (i < len) {
          i++; // consume closing "
        }
        isWord = true;
        continue;
      }

      if (c === '$' && input[i + 1] === '(') {
        const { content, end } = readBalanced(input, i + 2, '(', ')');
        const inner = parseSegments(content);
        (nested ??= []).push(...markSubstitution(inner));
        // The substitution's own value is unknown — emit a placeholder so
        // the literal text the user wrote isn't lost but isn't matched either.
        stripped += '\u0000';
        i = end;
        isWord = true;
        continue;
      }

      if (c === '`') {
        const { content, end } = readUntil(input, i + 1, '`');
        const inner = parseSegments(content);
        (nested ??= []).push(...markSubstitution(inner));
        stripped += '\u0000';
        i = end;
        isWord = true;
        continue;
      }

      stripped += c;
      i++;
      isWord = true;
    }

    if (isWord) {
      tokens.push({ kind: 'word', value: stripped, nested });
    }
  }

  tokens.push({ kind: 'eof', value: '' });
  return tokens;
}

/**
 * Read characters until a matching closing delimiter, counting nested
 * `open` / `close` pairs. Used for `$(…)` substitutions that may contain
 * further parentheses (e.g. `$(echo $(date))`).
 *
 * @param src    Source string.
 * @param start  Index of the first character after the opening delimiter.
 * @param open   Opening delimiter character.
 * @param close  Closing delimiter character.
 * @returns      Captured content and the index AFTER the closing delimiter.
 */
function readBalanced(
  src: string,
  start: number,
  open: string,
  close: string
): { content: string; end: number } {
  let depth = 1;
  let i = start;
  let content = '';
  while (i < src.length && depth > 0) {
    const c = src[i];
    if (c === '\\' && i + 1 < src.length) {
      content += c + src[i + 1];
      i += 2;
      continue;
    }
    if (c === "'") {
      // Single quotes — copy literal, no nesting.
      content += c;
      i++;
      while (i < src.length && src[i] !== "'") {
        content += src[i];
        i++;
      }
      if (i < src.length) {
        content += src[i];
        i++;
      }
      continue;
    }
    if (c === open) {
      depth++;
    } else if (c === close) {
      depth--;
      if (depth === 0) {
        i++;
        break;
      }
    }
    content += c;
    i++;
  }
  return { content, end: i };
}

/**
 * Read until a single-character terminator, honouring backslash escapes.
 * Used for backtick command substitutions.
 */
function readUntil(
  src: string,
  start: number,
  terminator: string
): { content: string; end: number } {
  let i = start;
  let content = '';
  while (i < src.length) {
    const c = src[i];
    if (c === '\\' && i + 1 < src.length) {
      content += c + src[i + 1];
      i += 2;
      continue;
    }
    if (c === terminator) {
      i++;
      break;
    }
    content += c;
    i++;
  }
  return { content, end: i };
}

/** Recursively flag every nested segment as coming from a substitution. */
function markSubstitution(segments: ShellSegment[]): ShellSegment[] {
  for (const seg of segments) {
    seg.substitution = true;
    if (seg.nested.length > 0) {
      markSubstitution(seg.nested);
    }
  }
  return segments;
}

/** Recursively flag every nested segment as coming from a subshell. */
function markSubshell(segments: ShellSegment[]): ShellSegment[] {
  for (const seg of segments) {
    seg.subshell = true;
    if (seg.nested.length > 0) {
      markSubshell(seg.nested);
    }
  }
  return segments;
}

/**
 * Parser entry point. Splits a command into a flat list of segments.
 *
 * The parser is intentionally tolerant: malformed inputs produce as many
 * segments as can be salvaged rather than throwing. Callers should treat
 * any unrecognised input as "deny by default" via the audit helper.
 */
export function parseSegments(command: string): ShellSegment[] {
  const tokens = tokenize(command);
  const segments: ShellSegment[] = [];
  let i = 0;

  while (i < tokens.length && tokens[i].kind !== 'eof') {
    const tok = tokens[i];

    // Skip standalone operators (separators between segments).
    if (tok.kind === 'op') {
      i++;
      continue;
    }

    // Subshell: parse contents recursively, mark all resulting segments
    // as `subshell: true`, then inline them into the parent segment list
    // so callers can iterate without recursion.
    if (tok.kind === 'lparen') {
      const { tokens: innerTokens, end } = sliceParen(tokens, i);
      const inner = parseTokens(innerTokens);
      segments.push(...markSubshell(inner));
      i = end;
      continue;
    }

    if (tok.kind === 'rparen') {
      // Stray rparen — skip.
      i++;
      continue;
    }

    // Words — collect a single command segment.
    const { segment, end } = parseSegment(tokens, i);
    if (segment) {
      segments.push(segment);
    }
    i = end;
  }

  return segments;
}

/**
 * Slice tokens between `lparen` at index `start` and the matching `rparen`,
 * counting nested parens. Returns the inner token slice and the index AFTER
 * the closing rparen.
 */
function sliceParen(tokens: Token[], start: number): { tokens: Token[]; end: number } {
  let depth = 0;
  let i = start;
  for (; i < tokens.length; i++) {
    const t = tokens[i];
    if (t.kind === 'lparen') {
      depth++;
    } else if (t.kind === 'rparen') {
      depth--;
      if (depth === 0) {
        return { tokens: tokens.slice(start + 1, i), end: i + 1 };
      }
    }
  }
  // Unbalanced — return everything we have.
  return { tokens: tokens.slice(start + 1), end: i };
}

/** Parse a token array (already sliced) into segments. */
function parseTokens(tokens: Token[]): ShellSegment[] {
  // Re-use parseSegments by stitching the tokens through a private path.
  const segments: ShellSegment[] = [];
  let i = 0;

  // Append eof if missing.
  const work =
    tokens.length === 0 || tokens[tokens.length - 1].kind !== 'eof'
      ? [...tokens, { kind: 'eof', value: '' } as Token]
      : tokens;

  while (i < work.length && work[i].kind !== 'eof') {
    const tok = work[i];
    if (tok.kind === 'op') {
      i++;
      continue;
    }
    if (tok.kind === 'lparen') {
      const { tokens: innerTokens, end } = sliceParen(work, i);
      const inner = parseTokens(innerTokens);
      segments.push(...markSubshell(inner));
      i = end;
      continue;
    }
    if (tok.kind === 'rparen') {
      i++;
      continue;
    }
    const { segment, end } = parseSegment(work, i);
    if (segment) {
      segments.push(segment);
    }
    i = end;
  }

  return segments;
}

/**
 * Parse a single command segment starting at token index `start`. A segment
 * runs until the next operator / paren / eof.
 */
function parseSegment(
  tokens: Token[],
  start: number
): { segment: ShellSegment | null; end: number } {
  const env: Record<string, string> = {};
  const args: string[] = [];
  const nested: ShellSegment[] = [];
  let cmd = '';
  let inAssignments = true;
  let i = start;

  while (i < tokens.length) {
    const t = tokens[i];
    if (t.kind === 'eof' || t.kind === 'op' || t.kind === 'lparen' || t.kind === 'rparen') {
      break;
    }
    if (t.kind !== 'word') {
      i++;
      continue;
    }

    if (t.nested && t.nested.length > 0) {
      nested.push(...t.nested);
    }

    const word = t.value;

    if (inAssignments && cmd === '' && isAssignment(word)) {
      const eq = word.indexOf('=');
      env[word.slice(0, eq)] = word.slice(eq + 1);
      i++;
      continue;
    }

    inAssignments = false;
    if (cmd === '') {
      cmd = word;
    } else {
      args.push(word);
    }
    i++;
  }

  if (cmd === '' && Object.keys(env).length === 0 && nested.length === 0) {
    return { segment: null, end: i };
  }

  return {
    segment: {
      cmd,
      args,
      env,
      subshell: false,
      substitution: false,
      nested,
    },
    end: i,
  };
}

/**
 * A word is an inline assignment if it starts with a valid bash variable
 * name followed by `=`. This is the same recognition rule bash uses.
 */
function isAssignment(word: string): boolean {
  const eq = word.indexOf('=');
  if (eq <= 0) {
    return false;
  }
  const name = word.slice(0, eq);
  return /^[A-Za-z_][A-Za-z0-9_]*$/.test(name);
}

// =============================================================================
// Audit helpers — used by the permission gate / bash tool wrapper.
// =============================================================================

export interface AuditOptions {
  /** The configured workspace root (the agent's "current working directory"). */
  workspace: string;
  /** Allow-listed external directories that `cd`/`pushd` may target. */
  allowlist?: string[];
  /**
   * Pre-existing `OLDPWD` value, if known. When `cd -` is encountered and
   * `OLDPWD` is unknown we deny by default.
   */
  oldPwd?: string;
}

export type AuditDenyReason =
  | 'cd-outside-workspace'
  | 'cd-dash-no-oldpwd'
  | 'pushd-outside-workspace'
  | 'pwd-assignment'
  | 'oldpwd-assignment'
  | 'unknown-target';

export interface AuditFinding {
  segment: ShellSegment;
  /** Resolved absolute path the segment would land in, if computable. */
  resolved?: string;
  reason: AuditDenyReason;
  message: string;
}

export interface AuditResult {
  /** All segments parsed from the command (flat — subshell members included). */
  segments: ShellSegment[];
  /** Findings that the permission gate should treat as deny-by-default. */
  denials: AuditFinding[];
}

/**
 * Audit a command for directory-escape attempts. Walks every segment
 * (including those inside subshells and substitutions) and flags any
 * directory-mutator builtin whose resolved target lies outside the
 * workspace and is not on the allowlist.
 *
 * The function does NOT execute or substitute environment variables —
 * if a target depends on an unknown `$VAR`, the finding is recorded with
 * `reason: 'unknown-target'` so the caller can still ask the user.
 */
export function auditShellCommand(command: string, options: AuditOptions): AuditResult {
  const segments = parseSegments(command);
  const denials: AuditFinding[] = [];

  // Track parent-shell cwd as we walk top-level segments. Subshells get a
  // copy of the current cwd that does NOT bleed back into the parent.
  const parentCwd = path.resolve(options.workspace);
  const oldPwd = options.oldPwd ? path.resolve(options.oldPwd) : undefined;

  walk(segments, parentCwd, oldPwd, /* inSubshell */ false);

  function walk(
    list: ShellSegment[],
    cwd: string,
    prevPwd: string | undefined,
    inSubshell: boolean
  ): { cwd: string; prevPwd: string | undefined } {
    let currentCwd = cwd;
    let currentPrev = prevPwd;

    for (const seg of list) {
      // Reject inline assignments to PWD/OLDPWD outright — too easy to
      // confuse downstream parsers.
      if ('PWD' in seg.env) {
        denials.push({
          segment: seg,
          reason: 'pwd-assignment',
          message: 'Inline PWD= assignment is not permitted',
        });
      }
      if ('OLDPWD' in seg.env) {
        denials.push({
          segment: seg,
          reason: 'oldpwd-assignment',
          message: 'Inline OLDPWD= assignment is not permitted',
        });
      }

      // Recurse into nested substitutions / subshells. They run in their
      // own shell so they don't mutate `currentCwd`.
      if (seg.nested.length > 0) {
        walk(seg.nested, currentCwd, currentPrev, true);
      }

      if (BUILTINS_DIRECTORY_MUTATORS.has(seg.cmd)) {
        const finding = evaluateMutator(seg, currentCwd, currentPrev, options);
        if (finding) {
          denials.push(finding);
        }

        // Update the parent cwd ONLY when this segment is NOT a subshell
        // and not part of a nested substitution.
        if (!seg.subshell && !seg.substitution && !inSubshell) {
          const next = computeMutatorTarget(seg, currentCwd, currentPrev);
          if (next.target) {
            currentPrev = currentCwd;
            currentCwd = next.target;
          }
        }
      }
    }

    return { cwd: currentCwd, prevPwd: currentPrev };
  }

  return { segments, denials };
}

/**
 * Determine the absolute path a `cd` / `pushd` segment would land in.
 * Returns `{ target: undefined }` when the target depends on an unresolved
 * substitution / variable.
 */
function computeMutatorTarget(
  seg: ShellSegment,
  cwd: string,
  prevPwd: string | undefined
): { target?: string; unresolved?: boolean } {
  if (seg.cmd === 'popd') {
    // popd doesn't have a literal target — it pops the directory stack.
    // We cannot know where it lands without runtime state, so treat as
    // unresolved (the caller's allowlist policy decides).
    return { unresolved: true };
  }

  const arg = seg.args[0];
  if (!arg) {
    // Bare `cd` -> $HOME, `pushd` -> swap top of stack. Both leave the
    // workspace if $HOME is outside it; safer to treat as unresolved.
    return { unresolved: true };
  }

  // `cd -` resolves to OLDPWD.
  if (seg.cmd === 'cd' && arg === '-') {
    if (!prevPwd) {
      return { unresolved: true };
    }
    return { target: prevPwd };
  }

  // Reject targets that depend on unresolved substitutions (placeholder
  // \u0000 was emitted during tokenization for `$(…)` / backticks).
  if (arg.includes('\u0000')) {
    return { unresolved: true };
  }

  // Environment variable expansion is not performed — `$VAR` stays literal.
  // If the target obviously contains an unresolved `$`, mark unresolved.
  if (/\$[A-Za-z_]/.test(arg)) {
    return { unresolved: true };
  }

  const resolved = path.isAbsolute(arg) ? path.resolve(arg) : path.resolve(cwd, arg);
  return { target: resolved };
}

function evaluateMutator(
  seg: ShellSegment,
  cwd: string,
  prevPwd: string | undefined,
  options: AuditOptions
): AuditFinding | null {
  const arg = seg.args[0];

  if (seg.cmd === 'cd' && arg === '-' && !prevPwd) {
    return {
      segment: seg,
      reason: 'cd-dash-no-oldpwd',
      message: '`cd -` is not allowed when OLDPWD is unknown',
    };
  }

  const { target, unresolved } = computeMutatorTarget(seg, cwd, prevPwd);

  if (unresolved || !target) {
    return {
      segment: seg,
      reason: 'unknown-target',
      message: `${seg.cmd} target could not be statically resolved; denying by default`,
    };
  }

  if (isInsideOrAllowed(target, options)) {
    return null;
  }

  return {
    segment: seg,
    resolved: target,
    reason: seg.cmd === 'pushd' ? 'pushd-outside-workspace' : 'cd-outside-workspace',
    message: `${seg.cmd} target ${target} is outside the workspace and not on the external-directory allowlist`,
  };
}

/**
 * Return true if `target` is inside the workspace OR matches one of the
 * allow-listed external directories.
 */
function isInsideOrAllowed(target: string, options: AuditOptions): boolean {
  const ws = path.resolve(options.workspace);
  if (isPathInside(target, ws)) {
    return true;
  }
  for (const allowed of options.allowlist ?? []) {
    if (isPathInside(target, path.resolve(allowed))) {
      return true;
    }
  }
  return false;
}

function isPathInside(child: string, parent: string): boolean {
  const normalizedChild = path.resolve(child);
  const normalizedParent = path.resolve(parent);
  if (normalizedChild === normalizedParent) {
    return true;
  }
  const rel = path.relative(normalizedParent, normalizedChild);
  return rel !== '' && !rel.startsWith('..') && !path.isAbsolute(rel);
}
