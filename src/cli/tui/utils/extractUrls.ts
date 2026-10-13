/**
 * Transcript URL extraction.
 *
 * Scans assistant-authored transcript content for URLs so the TUI can
 * expose them to Shift+{1-9} quick-open keybinds (ports upstream kilocode
 * PR #14910 — "open numbered transcript URLs in default browser").
 *
 * The extractor is deliberately conservative:
 *   - Only `http:` / `https:` URLs are returned. Other schemes are not
 *     browser-safe (see `src/core/open.ts` scheme allow-list), so there
 *     is no point surfacing them.
 *   - Markdown autolinks (`<https://example.com>`) and inline links
 *     (`[text](https://example.com)`) are unwrapped to the raw URL.
 *   - Trailing sentence punctuation (`.`, `,`, `;`, `:`, `!`, `?`, `)`,
 *     `]`, `}`, `>`) is stripped so a URL at the end of a sentence does
 *     not swallow the period.
 *   - Duplicates (identical href) are collapsed in the per-transcript
 *     helper, preserving first-seen order, so Shift+1 always refers to
 *     the first distinct URL.
 */

/** Matches markdown inline-link syntax: `[label](https://host/...)`. */
const MARKDOWN_LINK_RE = /\[([^\]]*)\]\((https?:\/\/[^\s)]+)\)/g;

/** Matches markdown autolink syntax: `<https://host/...>`. */
const AUTOLINK_RE = /<(https?:\/\/[^\s>]+)>/g;

/**
 * Matches a bare http(s) URL. We stop at whitespace, angle brackets,
 * backticks, parentheses, and quotes so we do not swallow surrounding
 * markdown or code-fence delimiters. Trailing sentence punctuation is
 * handled by {@link stripTrailingPunctuation} after the match.
 */
const BARE_URL_RE = /\bhttps?:\/\/[^\s<>`"'()]+/g;

const TRAILING_PUNCT = /[.,;:!?)\]}>]+$/;

interface Match {
  start: number;
  end: number;
  url: string;
}

function stripTrailingPunctuation(url: string): string {
  return url.replace(TRAILING_PUNCT, '');
}

function cleanAndFilter(url: string): string | undefined {
  const cleaned = stripTrailingPunctuation(url);
  if (cleaned.length === 0) {
    return undefined;
  }
  if (!/^https?:\/\//i.test(cleaned)) {
    return undefined;
  }
  return cleaned;
}

/**
 * Extract ordered `http(s)` URLs from one piece of text.
 *
 * URLs are returned in the order they appear visually in `text` (left to
 * right, top to bottom). Markdown inline / autolink wrappers are
 * unwrapped to the raw URL, and the bare-URL pass skips any range
 * already consumed by a wrapper match so the same href is not emitted
 * twice from the same syntactic position.
 */
export function extractUrlsFromText(text: string): string[] {
  if (typeof text !== 'string' || text.length === 0) {
    return [];
  }

  const matches: Match[] = [];
  const consumed: Array<[number, number]> = [];

  const pushMatch = (
    rangeStart: number,
    rangeEnd: number,
    rawUrl: string,
    markConsumed: boolean
  ): void => {
    const cleaned = cleanAndFilter(rawUrl);
    if (cleaned === undefined) {
      return;
    }
    matches.push({ start: rangeStart, end: rangeEnd, url: cleaned });
    if (markConsumed) {
      consumed.push([rangeStart, rangeEnd]);
    }
  };

  MARKDOWN_LINK_RE.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = MARKDOWN_LINK_RE.exec(text)) !== null) {
    pushMatch(m.index, m.index + m[0].length, m[2], true);
  }

  AUTOLINK_RE.lastIndex = 0;
  while ((m = AUTOLINK_RE.exec(text)) !== null) {
    pushMatch(m.index, m.index + m[0].length, m[1], true);
  }

  BARE_URL_RE.lastIndex = 0;
  while ((m = BARE_URL_RE.exec(text)) !== null) {
    const start = m.index;
    const end = start + m[0].length;
    const insideConsumed = consumed.some(([s, e]) => start >= s && end <= e);
    if (insideConsumed) {
      continue;
    }
    pushMatch(start, end, m[0], false);
  }

  matches.sort((a, b) => a.start - b.start);
  return matches.map((x) => x.url);
}

/**
 * Shape of a transcript entry the extractor cares about. We intentionally
 * do not import `MessageDisplay` here to keep this utility reusable from
 * tests and from other call sites that only have raw text + role.
 */
export interface TranscriptEntry {
  role: 'user' | 'assistant' | 'system';
  content: string;
  displayRole?: 'user' | 'assistant' | 'system';
}

/**
 * Extract ordered, de-duplicated `http(s)` URLs from the full transcript.
 *
 * Only assistant-authored messages are scanned — user prompts and hidden
 * system instrumentation (`displayRole: 'system'`) do not surface URLs
 * for the Shift+{1-9} shortcuts. This matches upstream kilocode PR
 * #14910's "open URLs from the model's response" semantics.
 */
export function extractUrlsFromMessages(messages: readonly TranscriptEntry[]): string[] {
  const seen = new Set<string>();
  const ordered: string[] = [];
  for (const msg of messages) {
    // Hide messages tagged as display-system from URL extraction, matching
    // MessageArea.tsx's own filter.
    if (msg.displayRole === 'system') {
      continue;
    }
    if (msg.role !== 'assistant') {
      continue;
    }
    for (const url of extractUrlsFromText(msg.content)) {
      if (!seen.has(url)) {
        seen.add(url);
        ordered.push(url);
      }
    }
  }
  return ordered;
}
