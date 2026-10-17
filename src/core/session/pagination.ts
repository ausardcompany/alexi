/**
 * Session list pagination with an opaque cursor.
 *
 * Ports kilocode's session-list pagination refactor (cursor schema +
 * ordered page loader). The previous `alexi sessions` command loaded
 * every session metadata record into memory before filtering, which
 * scales badly for operators who have accumulated hundreds of
 * sessions over long engagements.
 *
 * Design:
 *
 *   - Pages are ordered by `updatedAt DESC, id DESC` (id tiebreak
 *     makes the order total so cursor arithmetic is deterministic).
 *   - The cursor is an opaque base64-url-encoded JSON object. Opaque
 *     is deliberate: callers that persist the cursor across releases
 *     should NOT depend on its structure; we may extend it with a
 *     schema version byte in the future.
 *   - A `null` cursor fetches the first page.
 *   - An empty-result page returns `nextCursor: null` so callers can
 *     detect the end without a count query.
 *
 * This module is a pure data-plumbing helper. The actual session
 * iteration lives in `SessionManager` — this file provides the
 * cursor-encode/decode primitives and a typed page shape so the CLI
 * and TUI can share the pagination surface without duplicating the
 * ordering invariant.
 */

/**
 * Current cursor schema version. Bump when the shape changes so
 * {@link decodeSessionsCursor} can reject stale cursors instead of
 * silently returning the wrong page.
 */
export const SESSIONS_CURSOR_VERSION = 1;

/**
 * Decoded shape of a sessions-list cursor. The `(updatedAt, id)` pair
 * identifies the LAST row of the previous page; the next page starts
 * strictly after it in the total ordering.
 */
export interface SessionsCursor {
  v: typeof SESSIONS_CURSOR_VERSION;
  /** Updated-at timestamp of the last emitted row (unix epoch ms). */
  updatedAt: number;
  /** Session id of the last emitted row. Breaks ties when `updatedAt` collides. */
  id: string;
}

/**
 * Public page shape returned by `listSessionsPage`.
 */
export interface SessionsPage<T> {
  /** Rows for this page, already sorted by the ordering invariant. */
  items: T[];
  /**
   * Cursor to fetch the next page, or `null` when `items` is the last
   * page. A `null` cursor on a non-empty response means "this is the
   * last page" — callers do not need to probe further.
   */
  nextCursor: string | null;
}

/**
 * Encode a cursor to a URL-safe base64 string. Opaque to callers.
 */
export function encodeSessionsCursor(cursor: SessionsCursor): string {
  const json = JSON.stringify(cursor);
  // Node's Buffer handles base64url since v16; fall back to a manual
  // tr-style substitution to stay safe under strict ESM targets.
  const b64 = Buffer.from(json, 'utf8').toString('base64');
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/**
 * Decode a cursor emitted by {@link encodeSessionsCursor}. Returns
 * `null` for malformed, version-mismatched, or missing cursors so
 * callers always have a well-defined "start from the beginning"
 * fallback.
 */
export function decodeSessionsCursor(raw: string | null | undefined): SessionsCursor | null {
  if (raw === null || raw === undefined || raw.length === 0) {
    return null;
  }
  try {
    const padded = raw.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((raw.length + 3) % 4);
    const json = Buffer.from(padded, 'base64').toString('utf8');
    const parsed = JSON.parse(json) as Partial<SessionsCursor>;
    if (
      parsed.v !== SESSIONS_CURSOR_VERSION ||
      typeof parsed.updatedAt !== 'number' ||
      typeof parsed.id !== 'string'
    ) {
      return null;
    }
    return {
      v: SESSIONS_CURSOR_VERSION,
      updatedAt: parsed.updatedAt,
      id: parsed.id,
    };
  } catch {
    return null;
  }
}

/**
 * Minimal row shape the paginator needs. Any session record carrying
 * `id` + `updatedAt` is accepted — this helper is deliberately
 * structural so it can page over both the SessionManager JSONL
 * records and the search-FTS result rows.
 */
export interface PaginableSessionRow {
  id: string;
  updatedAt: number;
  [k: string]: unknown;
}

/**
 * Compare two rows under the `(updatedAt DESC, id DESC)` ordering.
 * Returns a value compatible with `Array.prototype.sort`.
 */
export function compareSessionsDesc(a: PaginableSessionRow, b: PaginableSessionRow): number {
  if (a.updatedAt !== b.updatedAt) {
    return b.updatedAt - a.updatedAt;
  }
  if (a.id === b.id) {
    return 0;
  }
  return a.id < b.id ? 1 : -1;
}

/**
 * Slice an already-ordered `rows` array into a page starting after
 * `cursor` and capped at `pageSize`. The function does NOT re-sort —
 * callers are expected to sort once (via {@link compareSessionsDesc})
 * and page many times.
 */
export function listSessionsPage<T extends PaginableSessionRow>(
  rows: readonly T[],
  cursor: SessionsCursor | null,
  pageSize: number
): SessionsPage<T> {
  if (pageSize <= 0) {
    return { items: [], nextCursor: null };
  }
  let start = 0;
  if (cursor) {
    // Skip rows up to and including the cursor row.
    start = rows.findIndex((r) => r.updatedAt === cursor.updatedAt && r.id === cursor.id);
    if (start === -1) {
      // Cursor row no longer exists (session deleted). Fall back to
      // the ordering: skip anything strictly > cursor in DESC order
      // (i.e. keep rows whose (updatedAt,id) is strictly less than
      // the cursor pair).
      start = rows.findIndex(
        (r) =>
          r.updatedAt < cursor.updatedAt || (r.updatedAt === cursor.updatedAt && r.id < cursor.id)
      );
      if (start === -1) {
        return { items: [], nextCursor: null };
      }
    } else {
      start += 1;
    }
  }
  const end = Math.min(rows.length, start + pageSize);
  const items = rows.slice(start, end);
  if (items.length === 0 || end >= rows.length) {
    return { items, nextCursor: null };
  }
  const last = items[items.length - 1];
  if (!last) {
    return { items, nextCursor: null };
  }
  return {
    items,
    nextCursor: encodeSessionsCursor({
      v: SESSIONS_CURSOR_VERSION,
      updatedAt: last.updatedAt,
      id: last.id,
    }),
  };
}
