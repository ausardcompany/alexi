/**
 * Nested PowerShell unwrapping (port of cline/cline#13815).
 *
 * When the bash / shell tool runs a command through PowerShell, the user
 * command is passed as an argument to a `-Command` bootstrap that wraps
 * it in a scriptblock (see `shellSpawnArgs` in `./id.ts`). PowerShell's
 * `-Command` parser interprets that argument as PowerShell source, which
 * means a nested `powershell -Command "..."` inside it has its
 * double-quoted body parsed by the OUTER parser first: `$_` and other
 * dollar-expressions are interpolated away before the nested shell ever
 * sees them.
 *
 * A pipeline like
 *   powershell -Command "Get-ChildItem | Where-Object { $_.Name -like '*.ts' }"
 * therefore fails once per enumerated item with
 *   "The property 'Name' cannot be found on this object"
 * because `$_` was interpolated to the empty string BEFORE the nested
 * `Where-Object` scriptblock was compiled. The nested child still exits
 * 0 (successful invocation), but the pipeline filter fails on every
 * item. Over large directory trees this looks like a hang (hundreds of
 * error records to stderr).
 *
 * The fix is to detect standalone `powershell` / `pwsh` wrappers,
 * decode the quoted body per PowerShell's own string rules (so `$_`
 * survives byte-identical), and run the decoded script directly
 * through the existing bootstrap using the requested edition. This
 * preserves the intended script's variables and embedded quotes,
 * bypassing both outer `$` interpolation and Windows PowerShell's
 * native argv quote loss.
 *
 * Unwrapping is deliberately conservative:
 *   - The nested executable must be `powershell` / `powershell.exe` or
 *     `pwsh` / `pwsh.exe` (bare or as a path). Quoted executable paths
 *     require the call operator `&`.
 *   - `-NoProfile` must be written in full: without it, the nested
 *     process would load the user's profile (functions, aliases,
 *     modules) which the profile-less outer bootstrap cannot
 *     reproduce.
 *   - Only bootstrap-equivalent flags (`-NoLogo`, `-NonInteractive`)
 *     are allowed alongside `-NoProfile`. Anything else
 *     (`-ExecutionPolicy`, `-File`, `-WorkingDirectory`, abbreviations
 *     like `-c`) can change semantics, so the command passes through
 *     unchanged.
 *   - The `-Command` tail must be exactly one complete ASCII single-
 *     or double-quoted string. Trailing statements after the closing
 *     quote, unquoted tails, and here-strings are left alone.
 *   - Newlines are statement terminators in PowerShell: the executable,
 *     flags, and quoted tail may be separated only by horizontal
 *     whitespace (spaces or tabs). Newlines inside the quoted body are
 *     fine.
 *
 * A double-quoted body is decoded with the escape rules of the OUTER
 * PowerShell edition, because that is the parser that owns the string:
 * `` `u{...} `` code-point escapes and `` `e `` ESC only decode when
 * the outer shell is PowerShell 7+.
 *
 * One deliberate difference from the naive nested spawn: the unwrapped
 * script runs under the outer bootstrap's `$ErrorActionPreference =
 * 'Stop'`, matching the fail-fast semantics documented on
 * `shellSpawnArgs`. That is the same tradeoff GitHub Actions makes for
 * its `powershell` / `pwsh` steps.
 */

export interface NestedPowerShellInvocation {
  /**
   * The executable requested by the nested wrapper, taken byte-identical
   * from the source command. May be a bare name (`powershell`), a full
   * path (`C:\\Program Files\\PowerShell\\7\\pwsh.exe`), or a name with
   * extension (`pwsh.exe`). Callers that spawn this string on Windows
   * should be aware that libuv's `spawn` searches the child's working
   * directory before PATH for bare names (see cline/cline#14149).
   */
  executable: string;
  /** The decoded script text — variables and quotes preserved. */
  script: string;
}

const UNWRAPPABLE_FLAGS = new Set(['-nologo', '-noninteractive', '-noprofile']);
const REQUIRED_FLAG = '-noprofile';

/**
 * Return the trailing path component of a shell executable string, in
 * lower case, using both `/` and `\` as separators so a Windows path
 * like `C:\\Program Files\\PowerShell\\7\\pwsh.exe` resolves to
 * `pwsh.exe`. The result is used only for edition classification, not
 * for spawn — the original casing/path is preserved through
 * `NestedPowerShellInvocation.executable`.
 */
function normalizeShellName(shell: string): string {
  const normalizedPath = shell.replaceAll('\\', '/');
  const lastSeparatorIndex = normalizedPath.lastIndexOf('/');
  const baseName =
    lastSeparatorIndex >= 0 ? normalizedPath.slice(lastSeparatorIndex + 1) : normalizedPath;
  return baseName.toLowerCase();
}

/**
 * Classify a PowerShell executable path or name by edition, matching
 * the registry names: `powershell(.exe)` is Windows PowerShell 5.1 and
 * `pwsh(.exe)` is PowerShell 7+. Anything else is not a PowerShell
 * executable and returns undefined — the caller then leaves the
 * command untouched.
 */
function getPowerShellEdition(shell: string): 'windows' | 'core' | undefined {
  const name = normalizeShellName(shell);
  if (name === 'powershell' || name === 'powershell.exe') {
    return 'windows';
  }
  if (name === 'pwsh' || name === 'pwsh.exe') {
    return 'core';
  }
  return undefined;
}

/**
 * Decode the body of a PowerShell double-quoted string to the literal
 * text a nested `powershell -Command "..."` would have received:
 * backtick escapes (`` `n ``, `` `t ``, `` `" ``, `` `$ ``, ...) resolve
 * to their characters and `""` to a quote. `$`-expressions stay literal
 * — the model wrote them for the inner shell's parser. `` `u{...} ``
 * code-point and `` `e `` ESC escapes exist only in PowerShell 7+, so
 * the OUTER edition that owns this string decides how (or whether)
 * they decode, not the requested inner edition.
 */
function decodePowerShellDoubleQuotedString(body: string, edition: 'windows' | 'core'): string {
  let decoded = '';
  for (let i = 0; i < body.length; i++) {
    const character = body[i];
    if (character === '`' && i + 1 < body.length) {
      const escaped = body[i + 1];
      if (escaped === 'u' && edition === 'core' && body[i + 2] === '{') {
        const closing = body.indexOf('}', i + 3);
        const hex = closing > i + 3 ? body.slice(i + 3, closing) : '';
        const codePoint = Number.parseInt(hex, 16);
        if (
          hex.length > 0 &&
          hex.length <= 6 &&
          /^[0-9a-fA-F]+$/.test(hex) &&
          codePoint <= 0x10ffff
        ) {
          decoded += String.fromCodePoint(codePoint);
          i = closing;
          continue;
        }
        // A malformed escape stays literal rather than guessing.
      }
      switch (escaped) {
        case 'n':
          decoded += '\n';
          break;
        case 'r':
          decoded += '\r';
          break;
        case 't':
          decoded += '\t';
          break;
        case 'b':
          decoded += '\b';
          break;
        case 'f':
          decoded += '\f';
          break;
        case 'v':
          decoded += '\v';
          break;
        case '0':
          decoded += '\0';
          break;
        case 'a':
          decoded += '\x07';
          break;
        case 'e':
          // The ESC escape exists only in PowerShell 7+; Windows
          // PowerShell 5.1 leaves it as a literal 'e'.
          decoded += edition === 'core' ? '\x1b' : 'e';
          break;
        default:
          // `"`, `$, `` ` ``, and any other escape resolve to the escaped
          // character itself.
          decoded += escaped;
      }
      i++;
      continue;
    }
    if (character === '"' && body[i + 1] === '"') {
      decoded += '"';
      i++;
      continue;
    }
    decoded += character;
  }
  return decoded;
}

/**
 * Scan one complete ordinary ASCII-quoted string. Return its delimiter
 * and body together so decoding uses the same quoting rules as boundary
 * detection. Only whitespace may follow the closing quote; here-strings
 * (`@"..."@`, `@'...'@`) are not supported.
 */
function splitCompleteQuotedString(text: string): { quote: "'" | '"'; body: string } | undefined {
  const quote = text[0];
  if (quote !== "'" && quote !== '"') {
    return undefined;
  }
  for (let i = 1; i < text.length; i++) {
    const character = text[i];
    if (quote === '"' && character === '`') {
      // Backticks escape characters only in expandable strings; skip the
      // next character so an escaped closing quote (`" ) does not
      // terminate the string prematurely.
      i++;
      continue;
    }
    if (character === quote) {
      if (text[i + 1] === quote) {
        // Doubled quote is an escape inside both single- and
        // double-quoted PowerShell strings.
        i++;
        continue;
      }
      const remainder = text.slice(i + 1);
      if (remainder.trim() !== '') {
        return undefined;
      }
      return { quote, body: text.slice(1, i) };
    }
  }
  return undefined;
}

/**
 * Decode a complete `-Command` tail (a single ASCII-quoted string,
 * possibly preceded by trimmable whitespace) into the literal script
 * text. Returns undefined when the tail is not a single complete
 * quoted string, or when the decoded script is empty.
 */
function splitNestedCommandToScript(
  commandTail: string,
  edition: 'windows' | 'core'
): string | undefined {
  const trimmed = commandTail.trimStart();
  const quoted = splitCompleteQuotedString(trimmed);
  if (!quoted) {
    return undefined;
  }
  const script = (
    quoted.quote === "'"
      ? quoted.body.replaceAll("''", "'")
      : decodePowerShellDoubleQuotedString(quoted.body, edition)
  ).trim();
  return script.length > 0 ? script : undefined;
}

/**
 * Detect a single-layer redundant nested `powershell` / `pwsh`
 * `-Command <quoted-script>` invocation and return the requested
 * executable together with the decoded script. Returns undefined when
 * the command does not match; the caller then runs it unchanged.
 *
 * `shell` is the outer shell that would parse the command; its edition
 * decides how the double-quoted body decodes.
 */
export function parseNestedPowerShellCommand(
  command: string,
  shell: string
): NestedPowerShellInvocation | undefined {
  // Only horizontal separators belong to this invocation. A bare newline
  // ends the outer statement; do not consume it before the quoted body
  // either. A quoted executable is a string expression unless `&`
  // invokes it — matches Cline's contract that quoted paths require
  // the call operator.
  const head =
    /^[ \t]*(?:&[ \t]+(?:"([^"$`]*)"|'((?:[^']|'')*)')|(?:&[ \t]+)?([^\s$`"';&|<>(){}#@,]+))[ \t]+([\S\s]*)$/.exec(
      command
    );
  if (!head) {
    return undefined;
  }
  const executable = head[1] ?? head[2]?.replaceAll("''", "'") ?? head[3];
  if (executable === undefined) {
    return undefined;
  }
  const outerEdition = getPowerShellEdition(shell);
  if (!outerEdition) {
    return undefined;
  }
  if (!getPowerShellEdition(executable)) {
    return undefined;
  }

  // Walk the flags up to -Command, allowing only bootstrap-equivalent
  // flags. -NoProfile is required: the outer bootstrap runs without
  // profiles, so a nested invocation that would load the user's
  // profile must keep its own process to reproduce that
  // initialization.
  let rest = head[4];
  let sawNoProfile = false;
  for (;;) {
    const flag = /^(-[^\s=]+)[ \t]*([\S\s]*)$/.exec(rest);
    if (!flag) {
      return undefined;
    }
    const name = flag[1].toLowerCase();
    if (name === '-command') {
      if (!sawNoProfile) {
        return undefined;
      }
      const script = splitNestedCommandToScript(flag[2], outerEdition);
      return script === undefined ? undefined : { executable, script };
    }
    if (!UNWRAPPABLE_FLAGS.has(name)) {
      return undefined;
    }
    if (name === REQUIRED_FLAG) {
      sawNoProfile = true;
    }
    rest = flag[2];
  }
}

/**
 * Repeatedly strip PowerShell wrappers until no further layer matches,
 * decoding each with the edition of the shell that would have parsed
 * it. Returns undefined when the command has no unwrappable wrapper at
 * all (in which case the caller should run it unchanged).
 */
export function unwrapNestedPowerShellCommand(
  command: string,
  shell: string
): NestedPowerShellInvocation | undefined {
  let current = parseNestedPowerShellCommand(command, shell);
  if (!current) {
    return undefined;
  }
  for (;;) {
    const next = parseNestedPowerShellCommand(current.script, current.executable);
    if (!next) {
      return current;
    }
    current = next;
  }
}
