/**
 * OSC-8 hyperlink helper.
 *
 * Wraps a URL in the OSC-8 escape sequence so supporting terminals render it
 * as a clickable link. Falls back to plain text (or `label (url)`) when the
 * terminal does not advertise hyperlink support.
 *
 * @see https://gist.github.com/egmontkob/eb114294efbcd5adb1944c9f3cb5feda
 */

/** Operating System Command introducer (ESC ]). */
const OSC = '\u001B]';
/** String Terminator (ESC \). */
const ST = '\u001B\\';

/** Allow-list of TERM_PROGRAM values known to support OSC-8 hyperlinks. */
const SUPPORTED_TERM_PROGRAMS: ReadonlySet<string> = new Set([
  'iTerm.app',
  'WezTerm',
  'ghostty',
  'Apple_Terminal',
  'vscode',
  'cursor',
  'Hyper',
  'WarpTerminal',
]);

/**
 * Detect whether the active stdout supports OSC-8 hyperlinks.
 *
 * Heuristic (cheap and dependency-free):
 *   - `FORCE_HYPERLINK=1` / `NO_HYPERLINK=1` env overrides win.
 *   - When stdout is not a TTY, return false (CI, piped, redirected).
 *   - Honor a small allow-list of `TERM_PROGRAM` values that ship support.
 *   - kitty advertises support via `TERM` containing `kitty`.
 *   - Windows Terminal advertises via `WT_SESSION`.
 *   - Default: false.
 *
 * Tests should monkey-patch `process.stdout.isTTY` and env vars to exercise.
 */
export function supportsHyperlinks(stream: NodeJS.WriteStream = process.stdout): boolean {
  if (process.env.FORCE_HYPERLINK === '1') {
    return true;
  }
  if (process.env.NO_HYPERLINK === '1') {
    return false;
  }
  if (!stream.isTTY) {
    return false;
  }

  const termProgram = process.env.TERM_PROGRAM ?? '';
  if (SUPPORTED_TERM_PROGRAMS.has(termProgram)) {
    return true;
  }

  // kitty advertises via TERM
  if ((process.env.TERM ?? '').includes('kitty')) {
    return true;
  }

  // Windows Terminal
  if (process.env.WT_SESSION) {
    return true;
  }

  return false;
}

/**
 * Wrap a URL in an OSC-8 hyperlink if the terminal supports it. Otherwise
 * returns plain text. When `label` is omitted (or equal to `url`), the URL
 * is printed once; otherwise the fallback shows `label (url)`.
 */
export function hyperlink(url: string, label?: string): string {
  const text = label ?? url;
  if (!supportsHyperlinks()) {
    if (label !== undefined && label !== url) {
      return `${label} (${url})`;
    }
    return url;
  }
  return `${OSC}8;;${url}${ST}${text}${OSC}8;;${ST}`;
}
