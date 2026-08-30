/**
 * SQLite FTS5-indexed session history search.
 *
 * Replaces the eager `fs.readdirSync + JSON.parse + sort` scan performed by
 * {@link SessionManager.listSessions} with a persistent full-text index
 * populated incrementally on session save and reconciled with the on-disk
 * `~/.alexi/sessions/*.json` files on demand.
 *
 * Design (ported from kilocode #13420):
 *   - Index lives at `<sessionsDir>/.index.db` (SQLite file, gitignored).
 *   - Two tables: an FTS5 virtual table for text search on `title`, and a
 *     companion `sessions_meta` table for structured metadata (timestamp,
 *     workdir, modelId, messageCount, totalTokens).
 *   - Search returns rows ranked by FTS5 bm25(). Lower bm25 score means a
 *     better match, so we sort ascending and expose the score verbatim.
 *   - Native `better-sqlite3` binding failures degrade gracefully: the
 *     index disables itself and callers can fall back to
 *     `SessionManager.listSessions`. No native binding == no crash.
 *
 * The public contract intentionally mirrors `SessionMetadata` from
 * {@link ../core/sessionManager.js}: `search()` returns rows shaped like
 * `SessionMetadata & { score: number }` so the calling CLI/TUI code does
 * not need a second mapping step.
 */

import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import type { Message, SessionMetadata, Session } from '../core/sessionManager.js';

// `better-sqlite3` is a CommonJS-only native module. Bridge the ESM/CJS gap
// through `createRequire` so a missing/broken native binding fails at
// resolution time (caught below) rather than at ES module load time.
const nodeRequire = createRequire(import.meta.url);

// `better-sqlite3` is a native module. Import type-only so a missing/broken
// native binding at load time does not crash the whole CLI — the class
// dynamically resolves the binding on `initializeIndex()` and disables
// itself on failure.
type BetterSqliteDatabase = {
  exec: (sql: string) => void;
  prepare: (sql: string) => {
    run: (...args: unknown[]) => { changes: number };
    all: (...args: unknown[]) => unknown[];
    get: (...args: unknown[]) => unknown;
  };
  close: () => void;
  pragma: (name: string) => unknown;
};

export interface SessionSearchResult extends SessionMetadata {
  /**
   * FTS5 bm25 score. LOWER is better (closer to 0). Absent for wildcard /
   * empty queries where the result is chronologically sorted instead.
   */
  score?: number;
  /**
   * First ~100 characters of the matched message content, drawn from the
   * best-matching column via FTS5's `snippet()` auxiliary function.
   * Present only for MATCH queries where the row hit an indexed column
   * (title or content). Empty / whitespace-only queries return
   * chronological results without a snippet.
   */
  snippet?: string;
}

export interface SessionSearchOptions {
  /**
   * Maximum number of results to return. Defaults to 100.
   */
  limit?: number;
  /**
   * When set, only sessions whose recorded `workdir` matches (resolved,
   * case-sensitive on POSIX, case-insensitive on Windows) are returned.
   */
  workdir?: string;
}

/**
 * FTS5-indexed session history search.
 *
 * Construct once per {@link SessionManager}; the class is safe to reuse
 * across calls but NOT safe to share between processes (SQLite is
 * process-local). All methods are synchronous.
 */
export class SessionSearchIndex {
  private sessionsDir: string;
  private dbPath: string;
  private db: BetterSqliteDatabase | null = null;
  private initialized = false;
  /**
   * Set to `true` when the native binding failed to load or the index
   * failed to initialize. Once disabled, all methods become no-ops
   * (`search()` returns an empty array) so callers can safely fall back
   * to a filesystem scan without extra error handling.
   */
  private disabled = false;

  constructor(sessionsDir: string) {
    this.sessionsDir = sessionsDir;
    this.dbPath = path.join(sessionsDir, '.index.db');
  }

  /**
   * Load `better-sqlite3` lazily. Returns the module's default export or
   * `null` if the native binding is unavailable (e.g. a musl/glibc
   * mismatch on some CI runners). Callers must treat `null` as "index
   * disabled" and fall back.
   */
  private loadDriver(): (new (path: string) => BetterSqliteDatabase) | null {
    try {
      const mod = nodeRequire('better-sqlite3') as new (path: string) => BetterSqliteDatabase;
      return mod;
    } catch {
      return null;
    }
  }

  /**
   * Create the SQLite database (if missing) and the FTS5 schema, then
   * populate the index from `~/.alexi/sessions/*.json` on first run.
   *
   * Safe to call multiple times: subsequent calls are no-ops once
   * initialization has succeeded. On failure the index is marked disabled
   * and returns without throwing so `SessionManager` can degrade
   * gracefully to a filesystem scan.
   */
  initializeIndex(): void {
    if (this.initialized || this.disabled) {
      return;
    }

    // Ensure the sessions directory exists before we try to open a DB
    // inside it. New installs may not have one yet.
    if (!fs.existsSync(this.sessionsDir)) {
      try {
        fs.mkdirSync(this.sessionsDir, { recursive: true });
      } catch {
        this.disabled = true;
        return;
      }
    }

    const Driver = this.loadDriver();
    if (!Driver) {
      this.disabled = true;
      return;
    }

    try {
      this.db = new Driver(this.dbPath);
      // Small performance knobs. WAL journaling lets readers coexist with
      // writers without blocking; NORMAL synchronous is safe for a local
      // metadata index because a lost write only means a re-index on
      // startup, not lost user data.
      this.db.pragma('journal_mode = WAL');
      this.db.pragma('synchronous = NORMAL');

      // FTS5 virtual table for text search. `id`, `workdir`, and `modelId`
      // are declared UNINDEXED so they round-trip as stored columns
      // without adding tokens to the inverted index. Both `title` and
      // `content` (concatenated message text) are indexed so queries like
      // `ax sessions search "react hooks"` find sessions whose messages
      // discuss the term even if the title is generic ("Untitled").
      this.db.exec(`
        CREATE VIRTUAL TABLE IF NOT EXISTS sessions_fts USING fts5(
          id UNINDEXED,
          title,
          content,
          workdir UNINDEXED,
          modelId UNINDEXED,
          tokenize = 'unicode61 remove_diacritics 1'
        );
      `);

      // Schema migration: databases created by Part 1 of the FTS work
      // (issue #1584) declared the virtual table without the `content`
      // column. Detect that shape and rebuild the table so `content`
      // becomes searchable. The rebuild is destructive (FTS5 has no
      // ALTER TABLE), so callers must reindex from `~/.alexi/sessions/*.json`
      // afterwards via `refreshIndex`. That reindex is the same code path
      // used on a fresh install, so it is well-exercised.
      if (!this.hasContentColumn()) {
        this.db.exec('DROP TABLE IF EXISTS sessions_fts');
        this.db.exec(`
          CREATE VIRTUAL TABLE sessions_fts USING fts5(
            id UNINDEXED,
            title,
            content,
            workdir UNINDEXED,
            modelId UNINDEXED,
            tokenize = 'unicode61 remove_diacritics 1'
          );
        `);
      }

      // Companion table for structured, non-searchable metadata. Kept
      // outside the FTS virtual table so we can index/order by timestamp
      // without loading the FTS payload.
      this.db.exec(`
        CREATE TABLE IF NOT EXISTS sessions_meta (
          id TEXT PRIMARY KEY,
          created INTEGER NOT NULL,
          updated INTEGER NOT NULL,
          messageCount INTEGER NOT NULL,
          totalTokens INTEGER NOT NULL,
          workdir TEXT,
          modelId TEXT,
          parentSessionId TEXT,
          agent TEXT,
          title TEXT
        );
        CREATE INDEX IF NOT EXISTS sessions_meta_updated_idx
          ON sessions_meta(updated DESC);
        CREATE INDEX IF NOT EXISTS sessions_meta_workdir_idx
          ON sessions_meta(workdir);
      `);
    } catch {
      this.disabled = true;
      this.db = null;
      return;
    }

    this.initialized = true;

    // Populate from filesystem on first run. If the DB is empty (fresh
    // install or newly-migrated index) do a one-shot scan; otherwise
    // trust the incremental upserts wired through SessionManager.
    try {
      const count = this.db.prepare('SELECT COUNT(*) as c FROM sessions_meta').get() as {
        c: number;
      };
      if (count.c === 0) {
        this.refreshIndex();
      }
    } catch {
      // Populate failure is non-fatal; the index will be filled on
      // subsequent upserts.
    }
  }

  /**
   * Insert or update a session in the FTS index.
   *
   * Called by {@link SessionManager.saveSession} after every persist so
   * the index stays in lock-step with the on-disk JSON. Safe to call
   * with a metadata object whose `id` already exists — both the FTS
   * virtual table and the meta table are updated in a single transaction.
   *
   * When `messages` is provided, their `content` fields are concatenated
   * (with whitespace separators, and truncated to a safe upper bound) and
   * indexed under the `content` column. Callers that only have metadata
   * on hand (e.g. legacy call sites) can omit `messages`; the row is
   * still indexed for title search but `content` will be empty.
   *
   * No-op when the index is disabled (native binding missing).
   */
  upsertSession(metadata: SessionMetadata, messages?: Message[]): void {
    if (!this.initialized) {
      this.initializeIndex();
    }
    if (this.disabled || !this.db) {
      return;
    }

    const content = messages ? this.buildContent(messages) : '';

    try {
      // FTS5 does not support ON CONFLICT — delete-then-insert on the
      // virtual table is the documented upsert idiom. Wrapping both
      // operations plus the meta upsert in a single BEGIN/COMMIT keeps
      // the two tables consistent even if one statement throws.
      this.db.exec('BEGIN');
      this.db.prepare('DELETE FROM sessions_fts WHERE id = ?').run(metadata.id);
      this.db
        .prepare(
          'INSERT INTO sessions_fts (id, title, content, workdir, modelId) VALUES (?, ?, ?, ?, ?)'
        )
        .run(
          metadata.id,
          metadata.title ?? '',
          content,
          metadata.workdir ?? '',
          metadata.modelId ?? ''
        );
      this.db
        .prepare(
          `INSERT INTO sessions_meta
            (id, created, updated, messageCount, totalTokens, workdir, modelId,
             parentSessionId, agent, title)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON CONFLICT(id) DO UPDATE SET
             created = excluded.created,
             updated = excluded.updated,
             messageCount = excluded.messageCount,
             totalTokens = excluded.totalTokens,
             workdir = excluded.workdir,
             modelId = excluded.modelId,
             parentSessionId = excluded.parentSessionId,
             agent = excluded.agent,
             title = excluded.title`
        )
        .run(
          metadata.id,
          metadata.created,
          metadata.updated,
          metadata.messageCount,
          metadata.totalTokens,
          metadata.workdir ?? null,
          metadata.modelId ?? null,
          metadata.parentSessionId ?? null,
          metadata.agent ?? null,
          metadata.title ?? null
        );
      this.db.exec('COMMIT');
    } catch {
      try {
        this.db.exec('ROLLBACK');
      } catch {
        // Rollback failure is best-effort; the next transaction will
        // recover the database.
      }
    }
  }

  /**
   * Remove a session from the index.
   *
   * Called by {@link SessionManager.deleteSession} so search results no
   * longer surface deleted sessions. Safe to call with an unknown id
   * (no-op).
   */
  deleteSession(id: string): void {
    if (!this.initialized) {
      this.initializeIndex();
    }
    if (this.disabled || !this.db) {
      return;
    }

    try {
      this.db.exec('BEGIN');
      this.db.prepare('DELETE FROM sessions_fts WHERE id = ?').run(id);
      this.db.prepare('DELETE FROM sessions_meta WHERE id = ?').run(id);
      this.db.exec('COMMIT');
    } catch {
      try {
        this.db.exec('ROLLBACK');
      } catch {
        // See upsertSession()
      }
    }
  }

  /**
   * FTS5 MATCH search.
   *
   * `query` is FTS5 syntax: `"api refactor"` for phrase, `api OR refactor`
   * for union, `api*` for prefix. Empty or whitespace-only queries fall
   * back to a chronological listing (mirroring `listSessions` behaviour)
   * so callers can wire a single UI path.
   *
   * Returns rows shaped like {@link SessionMetadata} augmented with an
   * optional `score` (FTS5 bm25). Rows are ordered by ascending score for
   * MATCH queries (lower bm25 == better match) and by descending
   * `updated` for empty queries.
   */
  search(query: string, options?: SessionSearchOptions): SessionSearchResult[] {
    if (!this.initialized) {
      this.initializeIndex();
    }
    if (this.disabled || !this.db) {
      return [];
    }

    const limit = Math.max(1, Math.min(options?.limit ?? 100, 10_000));
    const trimmed = query.trim();

    try {
      const rows = trimmed
        ? this.matchQuery(trimmed, limit, options?.workdir)
        : this.recentQuery(limit, options?.workdir);
      return rows;
    } catch {
      // Malformed FTS5 syntax (e.g. an unbalanced quote from user input)
      // manifests as an SQLite error. Return empty rather than crash the
      // CLI; the caller can surface a "no matches" message.
      return [];
    }
  }

  /**
   * Reconcile the index with the filesystem: rescans
   * `~/.alexi/sessions/*.json`, upserts every session, and deletes rows
   * for sessions whose JSON file no longer exists.
   *
   * Called on `alexi sessions --search ...` startup so manual `rm` of a
   * session file, or restoration from backup, both eventually converge.
   */
  refreshIndex(): void {
    if (!this.initialized) {
      // initializeIndex() will itself call refreshIndex() when the DB is
      // empty — guard against re-entry by short-circuiting here. Callers
      // that explicitly want a refresh after init has completed will
      // fall through the second time.
      this.initializeIndex();
      if (!this.initialized || this.disabled || !this.db) {
        return;
      }
    }
    if (this.disabled || !this.db) {
      return;
    }

    let files: string[];
    try {
      files = fs.readdirSync(this.sessionsDir).filter((f) => f.endsWith('.json'));
    } catch {
      return;
    }

    const seen = new Set<string>();
    for (const file of files) {
      const full = path.join(this.sessionsDir, file);
      try {
        const raw = fs.readFileSync(full, 'utf-8');
        const parsed = JSON.parse(raw) as Session;
        if (!parsed?.metadata?.id) {
          continue;
        }
        seen.add(parsed.metadata.id);
        this.upsertSession(parsed.metadata, parsed.messages);
      } catch {
        // Corrupted or partially-written session file: skip. The next
        // successful save will re-index it.
        continue;
      }
    }

    // Prune index rows whose backing file has vanished. Batched via a
    // single SELECT so we do not iterate every row of a large index.
    try {
      const rows = this.db.prepare('SELECT id FROM sessions_meta').all() as { id: string }[];
      const toDelete = rows.filter((r) => !seen.has(r.id));
      for (const row of toDelete) {
        this.deleteSession(row.id);
      }
    } catch {
      // Pruning failure is non-fatal; stale rows just linger until the
      // next refresh.
    }
  }

  /**
   * Close the underlying database handle. Callers do not normally need
   * this — the handle is released when the process exits — but tests use
   * it to release temp directories cleanly.
   */
  close(): void {
    if (this.db) {
      try {
        this.db.close();
      } catch {
        // best-effort
      }
      this.db = null;
      this.initialized = false;
    }
  }

  /**
   * @internal Test-only: report whether the native binding is available
   * and the schema initialized. Used by unit tests to skip when the CI
   * runner cannot build `better-sqlite3`.
   */
  isReady(): boolean {
    if (!this.initialized) {
      this.initializeIndex();
    }
    return this.initialized && !this.disabled && this.db !== null;
  }

  // --- private helpers ---

  private matchQuery(
    query: string,
    limit: number,
    workdir: string | undefined
  ): SessionSearchResult[] {
    // Escape a user-provided query into an FTS5 phrase-safe form. Double
    // quotes inside the query are doubled per FTS5 phrase syntax, and the
    // whole term is optionally wrapped in quotes when it contains
    // whitespace or characters that FTS5 would otherwise treat as
    // operators. We keep operator-like queries (containing " OR ", " AND ",
    // "*", ":") verbatim so power users can leverage full FTS5 syntax.
    const looksLikeOperatorSyntax = /\s(OR|AND|NOT)\s|\*|:|"|\(/.test(query);
    const ftsQuery = looksLikeOperatorSyntax ? query : this.escapePhrase(query);

    const workdirClause = workdir ? 'AND m.workdir = ?' : '';
    const normalized = workdir ? this.normalizeWorkdir(workdir) : undefined;

    // `snippet(table, col, start, end, ellipsis, tokens)` extracts a
    // context window from the matched column. `-1` for the column index
    // asks FTS5 to pick the best-matching column automatically (title vs
    // content), so we return the most relevant excerpt regardless of
    // where the match landed. 15 tokens keeps the snippet close to the
    // 100-character budget requested by the CLI.
    const sql = `
      SELECT m.id, m.created, m.updated, m.messageCount, m.totalTokens,
             m.workdir, m.modelId, m.parentSessionId, m.agent, m.title,
             bm25(sessions_fts) as score,
             snippet(sessions_fts, -1, '', '', '...', 15) as snippet
      FROM sessions_fts f
      JOIN sessions_meta m ON m.id = f.id
      WHERE sessions_fts MATCH ?
      ${workdirClause}
      ORDER BY score ASC
      LIMIT ?
    `;

    const args: unknown[] = [ftsQuery];
    if (normalized !== undefined) {
      args.push(normalized);
    }
    args.push(limit);

    const rows = this.db!.prepare(sql).all(...args) as Array<{
      id: string;
      created: number;
      updated: number;
      messageCount: number;
      totalTokens: number;
      workdir: string | null;
      modelId: string | null;
      parentSessionId: string | null;
      agent: string | null;
      title: string | null;
      score: number;
      snippet: string | null;
    }>;

    return rows.map((r) => this.toResult(r, r.score, this.truncateSnippet(r.snippet)));
  }

  private recentQuery(limit: number, workdir: string | undefined): SessionSearchResult[] {
    const normalized = workdir ? this.normalizeWorkdir(workdir) : undefined;
    const workdirClause = normalized !== undefined ? 'WHERE workdir = ?' : '';
    const sql = `
      SELECT id, created, updated, messageCount, totalTokens, workdir,
             modelId, parentSessionId, agent, title
      FROM sessions_meta
      ${workdirClause}
      ORDER BY updated DESC
      LIMIT ?
    `;
    const args: unknown[] = [];
    if (normalized !== undefined) {
      args.push(normalized);
    }
    args.push(limit);

    const rows = this.db!.prepare(sql).all(...args) as Array<{
      id: string;
      created: number;
      updated: number;
      messageCount: number;
      totalTokens: number;
      workdir: string | null;
      modelId: string | null;
      parentSessionId: string | null;
      agent: string | null;
      title: string | null;
    }>;

    return rows.map((r) => this.toResult(r));
  }

  private toResult(
    row: {
      id: string;
      created: number;
      updated: number;
      messageCount: number;
      totalTokens: number;
      workdir: string | null;
      modelId: string | null;
      parentSessionId: string | null;
      agent: string | null;
      title: string | null;
    },
    score?: number,
    snippet?: string
  ): SessionSearchResult {
    const result: SessionSearchResult = {
      id: row.id,
      created: row.created,
      updated: row.updated,
      messageCount: row.messageCount,
      totalTokens: row.totalTokens,
    };
    if (row.workdir !== null) {
      result.workdir = row.workdir;
    }
    if (row.modelId !== null) {
      result.modelId = row.modelId;
    }
    if (row.parentSessionId !== null) {
      result.parentSessionId = row.parentSessionId;
    }
    if (row.agent !== null) {
      result.agent = row.agent;
    }
    if (row.title !== null) {
      result.title = row.title;
    }
    if (score !== undefined) {
      result.score = score;
    }
    if (snippet !== undefined && snippet.length > 0) {
      result.snippet = snippet;
    }
    return result;
  }

  /**
   * Detect whether the existing FTS virtual table already carries the
   * `content` column. Older databases (created by Part 1 of the FTS
   * work, issue #1584) declared only `title`; this predicate lets
   * {@link initializeIndex} decide whether to migrate. Uses
   * `PRAGMA table_info` on the virtual table, which SQLite happily
   * services for FTS5 tables.
   */
  private hasContentColumn(): boolean {
    if (!this.db) {
      return false;
    }
    try {
      const rows = this.db.prepare('PRAGMA table_info(sessions_fts)').all() as Array<{
        name: string;
      }>;
      return rows.some((r) => r.name === 'content');
    } catch {
      return false;
    }
  }

  /**
   * Concatenate message contents into a single string suitable for FTS5
   * indexing. Truncated to 64 KiB to bound index size for long sessions
   * (SQLite happily indexes larger blobs, but the 64 KiB cap is a
   * pragmatic ceiling that keeps disk usage predictable and matches the
   * upstream kilocode behaviour). System messages are included so hook
   * context and constitution reminders remain searchable.
   */
  private buildContent(messages: Message[]): string {
    const parts: string[] = [];
    let total = 0;
    const MAX = 64 * 1024;
    for (const m of messages) {
      if (typeof m.content !== 'string' || m.content.length === 0) {
        continue;
      }
      parts.push(m.content);
      total += m.content.length + 1;
      if (total >= MAX) {
        break;
      }
    }
    const joined = parts.join('\n');
    return joined.length > MAX ? joined.slice(0, MAX) : joined;
  }

  /**
   * Clamp FTS5 `snippet()` output to the ~100-character contract that the
   * CLI documents. FTS5 measures snippets in tokens, not characters, so a
   * 15-token window can overshoot on languages with long words; a hard
   * character cap keeps table rendering predictable. Preserves the
   * trailing ellipsis emitted by FTS5.
   */
  private truncateSnippet(raw: string | null | undefined): string {
    if (!raw) {
      return '';
    }
    const collapsed = raw.replace(/\s+/g, ' ').trim();
    if (collapsed.length <= 100) {
      return collapsed;
    }
    return collapsed.slice(0, 97) + '...';
  }

  private escapePhrase(term: string): string {
    // FTS5 phrase syntax: `"double ""quoted"" phrase"`. Doubling embedded
    // quotes lets us pass arbitrary user input without triggering FTS5
    // operator parsing on characters like `-` or `.`.
    return '"' + term.replace(/"/g, '""') + '"';
  }

  private normalizeWorkdir(p: string): string {
    const resolved = path.resolve(p);
    return process.platform === 'win32' ? resolved.toLowerCase() : resolved;
  }
}
