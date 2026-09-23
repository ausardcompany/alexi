/**
 * Incremental linkifier for streaming shell / bash tool output.
 *
 * Background:
 *   {@link linkify} scans its input with two regexes (URL + `path:line`).
 *   Rendering a bash tool row calls `linkify` on the *entire* current
 *   buffer on every chunk arrival, which is O(n) per re-render — good
 *   for a single call but O(n^2) over the lifetime of a streaming
 *   command that emits thousands of chunks (npm install, git log --all,
 *   large find outputs). This is the shell-side analogue of Kilocode's
 *   incremental syntax-highlighting optimisation (#14361).
 *
 * Strategy:
 *   All committed newline-terminated lines are frozen: their linkified
 *   form never changes because the regexes only match text within a
 *   line. We cache the last-processed *prefix* (raw text up to the last
 *   `\n`, plus its linkified string). On each new chunk we linkify only
 *   the un-committed tail (`text.slice(committedLen)`) and concatenate.
 *   When the tail crosses one or more newlines we advance the commit
 *   point so future calls do not re-scan those lines either.
 *
 *   If the incoming buffer is NOT a strict extension of the cached
 *   prefix (e.g. the caller truncated the output, or a completely new
 *   tool row landed on the same slot) we reset the cache and linkify
 *   from scratch.
 */

import { linkify } from './linkify.js';

interface LinkifierCache {
  /** Raw input text up to (and including) the last committed `\n`. */
  committedRaw: string;
  /** Linkified form of {@link committedRaw}. Stable across appends. */
  committedTransformed: string;
}

export interface IncrementalLinkifier {
  /** Run the linkifier over `text`, reusing the cached prefix when possible. */
  (text: string): string;
  /** Discard cache — useful when the underlying tool row is reused. */
  reset(): void;
  /**
   * Introspection for tests: returns the number of characters of `text`
   * that were served from cache on the most recent invocation. `0` means
   * the whole buffer was re-scanned (initial call or cache miss); a
   * positive value proves incremental behaviour.
   */
  lastCachedChars(): number;
}

/**
 * Build a fresh incremental linkifier bound to `cwd`.
 *
 * The returned function is a drop-in replacement for
 * `(text) => linkify(text, cwd)` — same output for the same input — but
 * amortises to O(delta) per call when invoked repeatedly with growing
 * text, where `delta` is the number of characters appended since the
 * last call.
 */
export function createIncrementalLinkifier(cwd: string = process.cwd()): IncrementalLinkifier {
  const cache: LinkifierCache = { committedRaw: '', committedTransformed: '' };
  let lastCachedChars = 0;

  const fn = ((text: string): string => {
    // Fast path: identical to previous input. We still have to
    // recompute because we cannot cache the full transformed string
    // safely (URL regex `lastIndex` state is per-call), but we can at
    // least skip work on the committed prefix.
    if (text.length === 0) {
      lastCachedChars = 0;
      return '';
    }

    const isExtension =
      cache.committedRaw.length > 0 &&
      text.length >= cache.committedRaw.length &&
      text.startsWith(cache.committedRaw);

    if (!isExtension) {
      // Cache miss: buffer shrank, changed, or first call.
      const transformed = linkify(text, cwd);
      const lastNl = text.lastIndexOf('\n');
      if (lastNl >= 0) {
        cache.committedRaw = text.slice(0, lastNl + 1);
        cache.committedTransformed = linkify(cache.committedRaw, cwd);
      } else {
        cache.committedRaw = '';
        cache.committedTransformed = '';
      }
      lastCachedChars = 0;
      return transformed;
    }

    // Incremental path: linkify only the tail. Because linkify's
    // regexes only match within a single line, and the cached prefix
    // ends on a line boundary (last `\n`), splitting there is safe.
    lastCachedChars = cache.committedRaw.length;
    const tail = text.slice(cache.committedRaw.length);
    if (tail.length === 0) {
      return cache.committedTransformed;
    }

    const tailLastNl = tail.lastIndexOf('\n');
    if (tailLastNl < 0) {
      // No newline in tail: nothing new to commit; linkify tail on
      // every call. This is bounded by max line length in practice.
      const tailTransformed = linkify(tail, cwd);
      return cache.committedTransformed + tailTransformed;
    }

    // Tail contains at least one newline. Split at the last one:
    // everything up to and including it is now committed (frozen);
    // everything after is the still-growing final line.
    const newlyCommitted = tail.slice(0, tailLastNl + 1);
    const openTail = tail.slice(tailLastNl + 1);
    const newlyCommittedTransformed = linkify(newlyCommitted, cwd);
    const openTailTransformed = openTail.length === 0 ? '' : linkify(openTail, cwd);

    cache.committedRaw = cache.committedRaw + newlyCommitted;
    cache.committedTransformed = cache.committedTransformed + newlyCommittedTransformed;

    return cache.committedTransformed + openTailTransformed;
  }) as IncrementalLinkifier;

  fn.reset = () => {
    cache.committedRaw = '';
    cache.committedTransformed = '';
    lastCachedChars = 0;
  };
  fn.lastCachedChars = () => lastCachedChars;

  return fn;
}
