/**
 * Bash command parser for plan-mode read-only allowlist.
 *
 * Given a shell command string, determines whether the command is safe to
 * run in a read-only investigation context (i.e. it will not modify the
 * filesystem, network state, or version control history).
 *
 * Design (ported from kilocode #12906):
 *
 * 1. Mask out quoted strings, heredoc bodies, escaped characters and
 *    shell comments so that the tokens inside them cannot false-positive
 *    against the read-only allowlist or the block-list. The masking
 *    replaces the payload with same-length runs of a filler character so
 *    that index positions remain stable for the rest of the pipeline.
 * 2. Split the masked command on shell control operators (`;`, `|`, `||`,
 *    `&&`, `&`, newline) into simple segments.
 * 3. Inspect each segment independently. A segment is read-only if:
 *      - The leading command token is in `READ_ONLY_COMMANDS`, and
 *      - When the command is `git`, its subcommand is in
 *        `READ_ONLY_GIT_SUBCOMMANDS` and not in
 *        `MUTATING_GIT_SUBCOMMANDS`, and
 *      - No `>`, `>>`, `<>` redirect targets a real filesystem path
 *        (writes to `/dev/*` and `/tmp/*` are tolerated, but `..`
 *        traversal is always rejected), and
 *      - The command is not a known mutating helper for otherwise
 *        read-looking commands (e.g. `sed -i`, `perl -i`, `sort -o`,
 *        `find -delete`, `xargs rm`, `npm install`).
 * 4. If any segment is not read-only, the entire command is treated as
 *    mutating. This is deliberately conservative — a pipeline that
 *    starts with `ls` but pipes into `xargs rm` MUST be blocked.
 *
 * All matchers operate on the masked command so a `rm` sitting inside a
 * quoted echo (`echo "rm foo.txt"`) does not trigger a false positive.
 */

// ============ Allowlists / blocklists ============

/**
 * Command names whose default behaviour is read-only (writes stdout/stderr,
 * inspects the filesystem, or prints VCS metadata). Individual entries may
 * still be rejected below if used with mutating flags — e.g. `sed -i`.
 */
const READ_ONLY_COMMANDS = new Set<string>([
  'ls',
  'cat',
  'head',
  'tail',
  'less',
  'more',
  'grep',
  'egrep',
  'fgrep',
  'rg',
  'ag',
  'ack',
  'find',
  'pwd',
  'echo',
  'printf',
  'git',
  'diff',
  'wc',
  'sort',
  'uniq',
  'cut',
  'awk',
  'gawk',
  'sed',
  'du',
  'df',
  'stat',
  'file',
  'which',
  'type',
  'whoami',
  'id',
  'date',
  'uname',
  'hostname',
  'env',
  'printenv',
  'true',
  'false',
  'test',
  'tree',
  'basename',
  'dirname',
  'realpath',
  'readlink',
  'tr',
  'jq',
  'yq',
  'column',
  'nl',
  'tac',
  'rev',
  'ps',
  'top',
  'htop',
  'xargs',
  'perl',
  'python',
  'python3',
  'node',
  'ruby',
]);

/**
 * Command names whose default behaviour writes to the filesystem, mutates
 * VCS state, or performs a network install/upload. Always blocked.
 */
const BLOCKED_COMMANDS = new Set<string>([
  'rm',
  'mv',
  'cp',
  'tee',
  'touch',
  'truncate',
  'dd',
  'install',
  'unlink',
  'shred',
  'chmod',
  'chown',
  'mkdir',
  'rmdir',
  'ln',
  'sudo',
  'su',
  'doas',
  'eval',
  'exec',
  'source',
  '.',
  'sh',
  'bash',
  'zsh',
  'fish',
  'dash',
  'ksh',
  'csh',
  'tcsh',
  'pwsh',
  'powershell',
  'cmd',
]);

/**
 * `git <subcmd>` phrases that are read-only. A phrase may be one token
 * (`git log`) or two (`git stash list`).
 */
const READ_ONLY_GIT_SUBCOMMANDS = new Set<string>([
  'status',
  'log',
  'diff',
  'show',
  'branch',
  'tag',
  'remote',
  'ls-files',
  'ls-tree',
  'rev-parse',
  'rev-list',
  'reflog',
  'blame',
  'shortlog',
  'describe',
  'config',
  'stash list',
  'stash show',
  'worktree list',
  'submodule status',
  'help',
  'grep',
]);

/**
 * `git <subcmd>` phrases that mutate the repository, working tree, or
 * remote. Always blocked, even if `git` itself is otherwise read-only.
 */
const MUTATING_GIT_SUBCOMMANDS = new Set<string>([
  'add',
  'commit',
  'push',
  'pull',
  'fetch',
  'merge',
  'rebase',
  'cherry-pick',
  'revert',
  'reset',
  'checkout',
  'switch',
  'restore',
  'clean',
  'rm',
  'mv',
  'apply',
  'am',
  'stash save',
  'stash push',
  'stash apply',
  'stash pop',
  'stash drop',
  'stash clear',
  'stash create',
  'stash store',
  'tag -d',
  'branch -d',
  'branch -D',
  'remote add',
  'remote remove',
  'remote rename',
  'remote set-url',
  'worktree add',
  'worktree remove',
  'submodule add',
  'submodule update',
]);

/**
 * Package managers whose `install`, `add`, `remove`, `update`, `upgrade`,
 * `publish` subcommands must be blocked. Their read-only subcommands
 * (`npm ls`, `pip show`, `cargo tree`, ...) are also blocked here — the
 * simpler rule is to require the user to leave plan mode for any
 * package-manager invocation.
 */
const BLOCKED_PACKAGE_MANAGERS = new Set<string>([
  'npm',
  'pnpm',
  'yarn',
  'bun',
  'pip',
  'pip3',
  'pipx',
  'poetry',
  'cargo',
  'gem',
  'bundle',
  'go',
  'apt',
  'apt-get',
  'yum',
  'dnf',
  'brew',
  'apk',
  'pacman',
  'snap',
  'nix',
  'docker',
  'podman',
  'kubectl',
  'helm',
  'terraform',
  'ansible',
  'ansible-playbook',
]);

/**
 * Sentinel character used to mask masked-out ranges (quoted strings,
 * heredoc bodies, escapes, comments). Chosen because `\u0001` is not a
 * valid character in a shell command line under any normal condition.
 * Constructed via `String.fromCharCode` and compared with `RegExp`
 * built from that same string so ESLint's `no-control-regex` rule
 * does not fire on inline `\u0001` literals.
 */
const FILLER_CHAR = String.fromCharCode(1);
const FILLER_ONLY_RE = new RegExp(`${FILLER_CHAR}+`, 'g');

// ============ Masking helpers ============

/**
 * Mask ranges of the command string that must NOT participate in token
 * matching: single/double/backtick quotes, heredoc bodies, escape
 * sequences, and shell comments.
 *
 * Replaces each masked character with a fixed filler that is guaranteed
 * not to appear in a real command (`\u0001`). Length is preserved so
 * downstream splitters and matchers keep their indices.
 */
function maskLiterals(input: string): string {
  const chars = input.split('');
  const out: string[] = new Array(chars.length);
  const FILLER = FILLER_CHAR;
  let i = 0;

  // Preserve newlines and shell operators; mask everything else inside
  // a quoted range.
  const preserve = (ch: string): boolean => ch === '\n';

  while (i < chars.length) {
    const c = chars[i];

    // Backslash escape — consume the next character verbatim (masked).
    if (c === '\\' && i + 1 < chars.length) {
      out[i] = FILLER;
      out[i + 1] = FILLER;
      i += 2;
      continue;
    }

    // Line comment `#...` up to newline. Only recognised as a comment
    // when at start of segment or preceded by whitespace, to avoid
    // false-positives like `foo#bar` (a valid unquoted token).
    if (c === '#' && (i === 0 || /\s/.test(chars[i - 1]))) {
      while (i < chars.length && chars[i] !== '\n') {
        out[i] = FILLER;
        i += 1;
      }
      continue;
    }

    // Heredoc: `<<[-]?WORD` opens; body ends at a line containing WORD.
    // We detect the opener conservatively by scanning back for `<<`.
    if (c === '<' && chars[i + 1] === '<') {
      // Parse `<<[-]?TAG`
      let j = i + 2;
      out[i] = '<';
      out[i + 1] = '<';
      let stripTabs = false;
      if (chars[j] === '-') {
        out[j] = '-';
        stripTabs = true;
        j += 1;
      }
      // Skip whitespace between `<<` and the tag.
      while (j < chars.length && chars[j] === ' ') {
        out[j] = ' ';
        j += 1;
      }
      // Read the tag (may be quoted).
      let tag = '';
      const tagStart = j;
      if (chars[j] === '"' || chars[j] === "'") {
        const q = chars[j];
        out[j] = q;
        j += 1;
        while (j < chars.length && chars[j] !== q) {
          tag += chars[j];
          out[j] = chars[j];
          j += 1;
        }
        if (j < chars.length) {
          out[j] = q;
          j += 1;
        }
      } else {
        while (j < chars.length && /[A-Za-z0-9_]/.test(chars[j])) {
          tag += chars[j];
          out[j] = chars[j];
          j += 1;
        }
      }
      if (tag.length === 0) {
        // Not actually a heredoc — leave as-is.
        i = tagStart;
        out[i] = chars[i];
        i += 1;
        continue;
      }
      // Advance to end of line, then mask body up to the line containing
      // exactly the tag (optionally indented if stripTabs).
      while (j < chars.length && chars[j] !== '\n') {
        out[j] = chars[j];
        j += 1;
      }
      if (j < chars.length) {
        out[j] = '\n';
        j += 1;
      }
      // Mask body line-by-line until a line matches the tag exactly.
      // Newlines inside the body are ALSO masked so `splitSegments`
      // does not treat the body as extra segments.
      while (j < chars.length) {
        const lineStart = j;
        let lineEnd = j;
        while (lineEnd < chars.length && chars[lineEnd] !== '\n') {
          lineEnd += 1;
        }
        let line = input.slice(lineStart, lineEnd);
        if (stripTabs) {
          line = line.replace(/^\t+/, '');
        }
        if (line === tag) {
          // Terminator — mask the tag line and its terminating newline
          // so the entire heredoc contributes zero extra tokens.
          for (let k = lineStart; k < lineEnd; k += 1) {
            out[k] = FILLER;
          }
          if (lineEnd < chars.length) {
            out[lineEnd] = FILLER;
          }
          j = lineEnd + 1;
          break;
        }
        // Mask the body line (including its terminating newline).
        for (let k = lineStart; k < lineEnd; k += 1) {
          out[k] = FILLER;
        }
        if (lineEnd < chars.length) {
          out[lineEnd] = FILLER;
        }
        j = lineEnd + 1;
      }
      i = j;
      continue;
    }

    // Quoted ranges: '...', "...", `...`.
    if (c === "'" || c === '"' || c === '`') {
      out[i] = c;
      let j = i + 1;
      while (j < chars.length && chars[j] !== c) {
        if (c === '"' && chars[j] === '\\' && j + 1 < chars.length) {
          out[j] = FILLER;
          out[j + 1] = FILLER;
          j += 2;
          continue;
        }
        out[j] = preserve(chars[j]) ? chars[j] : FILLER;
        j += 1;
      }
      if (j < chars.length) {
        out[j] = c;
        j += 1;
      }
      i = j;
      continue;
    }

    out[i] = c;
    i += 1;
  }

  return out.join('');
}

// ============ Splitting ============

const SEGMENT_SEPARATORS = /(?:\|\||&&|;|\||&|\n)/g;

/**
 * Split the masked command into segments on shell control operators.
 * Empty segments are dropped. Whitespace is trimmed.
 */
function splitSegments(masked: string): string[] {
  return masked
    .split(SEGMENT_SEPARATORS)
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .filter((s) => s.replace(FILLER_ONLY_RE, '').trim().length > 0);
}

// ============ Redirect analysis ============

/**
 * A redirect target is safe if it targets `/dev/*` or `/tmp/*` AND does
 * not contain `..` path traversal. Everything else is considered a real
 * filesystem write and blocked.
 */
function isRedirectTargetSafe(target: string): boolean {
  const trimmed = target.trim().replace(/^["']|["']$/g, '');
  if (trimmed.length === 0) {
    return false;
  }
  if (trimmed.includes('..')) {
    return false;
  }
  if (trimmed.startsWith('/dev/') || trimmed === '/dev/null') {
    return true;
  }
  if (trimmed.startsWith('/tmp/') || trimmed === '/tmp') {
    return true;
  }
  return false;
}

/**
 * Reject segments containing an output redirect to a real filesystem
 * path. `<` (input redirect) is fine; `>`, `>>`, `<>` are output-mutating.
 *
 * Matches numeric fd prefixes (`2>`, `&>`) too.
 */
function hasUnsafeRedirect(segment: string): boolean {
  const re = /(?:\d*&?>{1,2}|<>)\s*(\S+)/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(segment)) !== null) {
    const target = match[1];
    if (!isRedirectTargetSafe(target)) {
      return true;
    }
  }
  return false;
}

// ============ Segment-level analysis ============

/** Tokenise a segment by whitespace, dropping tokens that are only FILLER. */
function tokenise(segment: string): string[] {
  return segment
    .split(/\s+/)
    .map((t) => t.replace(FILLER_ONLY_RE, ''))
    .filter((t) => t.length > 0);
}

/**
 * Some commands are otherwise read-only but have flag combinations that
 * mutate the filesystem. Return `true` if the mutating variant is
 * detected on the given argv.
 */
function hasMutatingFlags(cmd: string, args: string[]): boolean {
  switch (cmd) {
    case 'sed':
    case 'gsed':
      // -i / --in-place
      return args.some((a) => a === '-i' || a === '--in-place' || /^-i[^\s]*/.test(a));
    case 'perl':
      // -i / -i.bak
      return args.some((a) => a === '-i' || /^-i\..+/.test(a));
    case 'gawk':
    case 'awk':
      // -i inplace (gawk) or -i /path/to/inplace
      return args.some((a, idx) => a === '-i' && (args[idx + 1] ?? '').includes('inplace'));
    case 'sort':
      // -o FILE writes result to FILE. Any `-o` presence is treated as
      // mutating unless the target is a safe path (/dev/*, /tmp/*).
      return args.some((a, idx) => {
        if (a === '-o' || a === '--output') {
          return !isRedirectTargetSafe(args[idx + 1] ?? '');
        }
        if (a.startsWith('--output=')) {
          return !isRedirectTargetSafe(a.slice('--output='.length));
        }
        if (/^-o./.test(a)) {
          return true;
        }
        return false;
      });
    case 'find':
      // -delete, -exec ... {} (dangerous), -execdir
      return args.some((a) => a === '-delete' || a === '-exec' || a === '-execdir' || a === '-ok');
    case 'xargs': {
      // xargs <cmd>: the tail after xargs flags is the command being fed.
      // Find the first non-flag argument — that's the sub-command.
      let sub: string | undefined;
      for (let i = 0; i < args.length; i += 1) {
        const a = args[i];
        if (a.startsWith('-')) {
          // -I {} / -n 1 / -0 etc. Skip the arg after -I, -n, -P, -L, -s if any.
          if (['-I', '-i', '-n', '-P', '-L', '-s', '-a', '-E', '-d'].includes(a)) {
            i += 1;
          }
          continue;
        }
        sub = a;
        break;
      }
      if (!sub) {
        return false;
      }
      // The inner command must itself be read-only.
      return !isSingleCommandReadOnly(sub, args.slice(args.indexOf(sub) + 1));
    }
    case 'tar':
      // Extract / create writes files; only `-t` / `--list` is read-only.
      return !args.some((a) => a === '-t' || a === '--list' || /^-[^-]*t/.test(a));
    case 'zip':
    case 'gzip':
    case 'bzip2':
    case 'xz':
    case 'zstd':
      // Compression writes files.
      return !args.some((a) => a === '-l' || a === '--list' || a === '-t' || a === '--test');
    case 'unzip':
      // Only `-l` (list) is read-only.
      return !args.some((a) => a === '-l' || a === '-t');
    case 'python':
    case 'python3':
    case 'node':
    case 'ruby': {
      // Running arbitrary scripts can do anything. Only allow `-V` /
      // `--version` / `--help`. Also treat `-i` / `-i.bak` as an
      // in-place mutation for `ruby` / `perl`-style invocations.
      if (args.some((a) => a === '-i' || /^-i\..+/.test(a))) {
        return true;
      }
      return !args.every((a) => /^--?v(ersion)?$/.test(a) || /^--help$/.test(a) || a === '-h');
    }
    default:
      return false;
  }
}

/**
 * Return true when the given command + args is a read-only invocation.
 *
 * Called for the top-level segment token and, recursively, for the inner
 * command of `xargs`.
 */
function isSingleCommandReadOnly(cmd: string, args: string[]): boolean {
  // Strip any FILLER prefix (shouldn't happen, but be defensive).
  const bare = cmd.replace(FILLER_ONLY_RE, '').trim();
  if (bare.length === 0) {
    return false;
  }

  // Package managers are always blocked in plan mode.
  if (BLOCKED_PACKAGE_MANAGERS.has(bare)) {
    return false;
  }

  // Hard blocks (rm, sudo, sh -c, ...).
  if (BLOCKED_COMMANDS.has(bare)) {
    return false;
  }

  // Must be on the read-only allowlist.
  if (!READ_ONLY_COMMANDS.has(bare)) {
    return false;
  }

  // Special handling for `git <subcmd>`.
  if (bare === 'git') {
    // Ignore leading global flags like `git -C /path` and `git --no-pager`.
    let idx = 0;
    while (idx < args.length) {
      const a = args[idx];
      if (a === '-C' || a === '--git-dir' || a === '--work-tree') {
        idx += 2;
        continue;
      }
      if (a.startsWith('-')) {
        idx += 1;
        continue;
      }
      break;
    }
    const sub1 = args[idx];
    const sub2 = args[idx + 1];
    if (!sub1) {
      // `git` alone prints help, treat as read-only.
      return true;
    }
    const twoWord = sub2 ? `${sub1} ${sub2}` : '';
    // Explicit mutating phrase wins.
    if (MUTATING_GIT_SUBCOMMANDS.has(sub1) || (twoWord && MUTATING_GIT_SUBCOMMANDS.has(twoWord))) {
      return false;
    }
    // Composite phrases like `stash list` must match on the two-word form.
    if (twoWord && READ_ONLY_GIT_SUBCOMMANDS.has(twoWord)) {
      return true;
    }
    if (READ_ONLY_GIT_SUBCOMMANDS.has(sub1)) {
      return true;
    }
    // Unknown git subcommand — be conservative.
    return false;
  }

  // Check per-command mutating flag combinations.
  if (hasMutatingFlags(bare, args)) {
    return false;
  }

  return true;
}

/** Analyse a single segment. */
function isSegmentReadOnly(rawSegment: string, maskedSegment: string): boolean {
  if (hasUnsafeRedirect(rawSegment)) {
    return false;
  }
  const tokens = tokenise(maskedSegment);
  if (tokens.length === 0) {
    return false;
  }
  // Strip leading env var assignments like `FOO=bar cmd ...`.
  let i = 0;
  while (i < tokens.length && /^[A-Za-z_][A-Za-z0-9_]*=/.test(tokens[i])) {
    i += 1;
  }
  const cmdTok = tokens[i];
  if (!cmdTok) {
    return false;
  }
  const rest = tokens.slice(i + 1);
  return isSingleCommandReadOnly(cmdTok, rest);
}

// ============ Public API ============

/**
 * Return `true` if the given shell command is safe to execute in a
 * read-only plan-mode context (does not modify files, VCS state, or
 * network state).
 *
 * The command may contain multiple segments joined by `;`, `|`, `&&`,
 * `||`, `&`, or newlines. Every segment must be individually read-only
 * for the whole command to be considered read-only.
 */
export function isCommandReadOnly(command: string): boolean {
  if (typeof command !== 'string') {
    return false;
  }
  const trimmed = command.trim();
  if (trimmed.length === 0) {
    return false;
  }

  const masked = maskLiterals(trimmed);
  // Reject command-substitution which could hide anything: `$(...)`, `<(...)`.
  if (/\$\(/.test(masked) || /<\(/.test(masked) || />\(/.test(masked)) {
    return false;
  }

  const segments = splitSegments(masked);
  if (segments.length === 0) {
    return false;
  }

  // Also split the raw command in parallel so redirect analysis can see
  // the actual path text (masking wipes it).
  const rawSegments = splitSegments(trimmed);
  for (let i = 0; i < segments.length; i += 1) {
    const raw = rawSegments[i] ?? segments[i];
    if (!isSegmentReadOnly(raw, segments[i])) {
      return false;
    }
  }

  return true;
}

// ============ Test hooks ============

/**
 * @internal Exposed for unit tests only. Not part of the public API.
 */
export const _testing = {
  maskLiterals,
  splitSegments,
  isRedirectTargetSafe,
  hasUnsafeRedirect,
};
