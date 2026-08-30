/**
 * Session Manager for Multi-Turn Conversations
 * Manages conversation history and context for continuous interactions
 */

import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import {
  shouldCompact,
  compactConversation,
  estimateMessagesTokens,
  type CompactionOptions,
} from './compaction.js';
import { closeSession } from './sessionClose.js';
import { clearRuleCommandCache } from '../plugin/index.js';
import { stripInternalWrappers } from '../agent/stripInternalWrappers.js';
import {
  SessionSearchIndex,
  type SessionSearchOptions,
  type SessionSearchResult,
} from '../session/search.js';

/**
 * Normalize a workdir for comparison. Resolves `.`, `..`, and trailing
 * separators, and lowercases on Windows where filesystem paths are
 * case-insensitive.
 */
function normalizeWorkdir(p: string): string {
  const resolved = path.resolve(p);
  return process.platform === 'win32' ? resolved.toLowerCase() : resolved;
}

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  tokens?: {
    input?: number;
    output?: number;
  };
  /**
   * Optional metadata that overrides how the message is presented to the
   * user in transcripts (TUI rendering, `sessions export`, and session
   * replay). The value does NOT change how the message is delivered to
   * the model — providers still receive the message with its logical
   * `role`. Set `displayRole: 'system'` on hook context messages or
   * other internal instrumentation that should reach the model but be
   * hidden from user-facing transcripts. Absent for regular user /
   * assistant / system messages, which are always rendered.
   */
  displayRole?: 'system' | 'user' | 'assistant';
}

export interface SessionMetadata {
  id: string;
  created: number;
  updated: number;
  modelId?: string;
  totalTokens: number;
  messageCount: number;
  title?: string;
  /**
   * Working directory where the session was created (typically `process.cwd()`
   * at session-creation time). Optional because sessions created before this
   * field was introduced have no recorded workdir.
   */
  workdir?: string;
  /**
   * ID of the parent session that spawned this one as a subagent. Absent
   * for top-level user sessions and for legacy sessions created before
   * this field was introduced. Used by `getSessionParentChain` to compute
   * the current subagent nesting depth for the `task` tool's
   * `MAX_SUBAGENT_DEPTH` guard.
   */
  parentSessionId?: string;
  /**
   * Agent slug the session was created / last-run with. Populated by
   * headless (`alexi chat`) callers and by the interactive TUI when the
   * user picks an agent, so that a subsequent `--session <id>` resume
   * without an explicit `--agent` flag continues with the same agent
   * instead of silently reverting to the built-in default.
   *
   * Ported from upstream kilocode commit f4cba053a.
   */
  agent?: string;
}

export interface Session {
  metadata: SessionMetadata;
  messages: Message[];
}

export interface SessionManagerOptions {
  sessionsDir?: string;
  maxContextTokens?: number;
  autoCompact?: boolean;
}

export class SessionManager {
  private sessionsDir: string;
  private activeSession: Session | null = null;
  private maxContextTokens: number;
  private autoCompact: boolean;
  private searchIndex: SessionSearchIndex;

  constructor(options?: string | SessionManagerOptions) {
    const opts: SessionManagerOptions =
      typeof options === 'string' ? { sessionsDir: options } : (options ?? {});

    this.sessionsDir = opts.sessionsDir || path.join(process.env.HOME || '~', '.alexi', 'sessions');
    this.maxContextTokens = opts.maxContextTokens ?? 128_000;
    this.autoCompact = opts.autoCompact ?? true;

    // Ensure sessions directory exists
    if (!fs.existsSync(this.sessionsDir)) {
      fs.mkdirSync(this.sessionsDir, { recursive: true });
    }

    // The FTS index is lazily initialized: constructing the class does not
    // open the SQLite handle. That way, callers that only want to
    // `listSessions()` do not pay the native-binding cost, and CI runners
    // without a working `better-sqlite3` build still function.
    this.searchIndex = new SessionSearchIndex(this.sessionsDir);
  }

  /**
   * Create a new session.
   *
   * When `parentSessionId` is provided the new session is recorded as a
   * subagent child of that parent, which allows `getSessionParentChain`
   * to walk the ancestry and compute the current subagent nesting depth.
   *
   * When `options.initialMessages` is provided the transcript is seeded
   * with those messages and the session is persisted to disk immediately
   * (before returning). This is what forked/recovered sessions rely on to
   * survive a hub restart: without immediate persistence, the seeded
   * history would live only in memory until the first completed turn
   * (see issue #1330). Brand-new empty sessions are still persisted
   * eagerly for backwards compatibility, so external callers that inspect
   * the sessions directory right after `createSession` continue to see
   * the session file.
   */
  createSession(
    modelId?: string,
    parentSessionId?: string,
    options?: { initialMessages?: Message[] }
  ): Session {
    const initialMessages = options?.initialMessages ?? [];
    const totalTokens = initialMessages.reduce(
      (sum, m) => sum + (m.tokens?.input ?? 0) + (m.tokens?.output ?? 0),
      0
    );
    // Auto-generate a title from the first seeded user message so
    // forked/recovered sessions surface a sensible name in listSessions.
    const firstUser = initialMessages.find((m) => m.role === 'user');
    const title = firstUser
      ? firstUser.content.slice(0, 50) + (firstUser.content.length > 50 ? '...' : '')
      : undefined;
    const session: Session = {
      metadata: {
        id: randomUUID(),
        created: Date.now(),
        updated: Date.now(),
        modelId,
        totalTokens,
        messageCount: initialMessages.length,
        workdir: process.cwd(),
        parentSessionId,
        title,
      },
      messages: [...initialMessages],
    };

    this.activeSession = session;
    // Persist immediately. When `initialMessages` is provided this is what
    // guarantees seeded history is durable across hub restarts (issue
    // #1330). For empty sessions this preserves the historical
    // eager-persistence contract that existing callers rely on.
    this.saveSession(session);

    return session;
  }

  /**
   * Detect whether a caught error is an abort-family error (issue #1330).
   *
   * Aborts surface in three shapes:
   *   1. `DOMException` with `name === 'AbortError'`
   *   2. Plain `Error` with `name === 'AbortError'`
   *   3. Node native abort: `Error` with `code === 'ABORT_ERR'`
   *
   * This helper lets orchestrators and REPLs decide, in a `catch` block,
   * whether to flush the partial transcript to disk before re-throwing or
   * returning to the prompt. It mirrors {@link isAbortError} from the
   * streaming orchestrator but lives on `SessionManager` so consumers do
   * not need a cross-module import to check the classification.
   */
  static detectAbort(err: unknown): boolean {
    if (!(err instanceof Error) && !(typeof err === 'object' && err !== null)) {
      return false;
    }
    const e = err as { name?: unknown; code?: unknown };
    if (typeof e.name === 'string' && e.name === 'AbortError') {
      return true;
    }
    if (typeof e.code === 'string' && e.code === 'ABORT_ERR') {
      return true;
    }
    return false;
  }

  /**
   * Instance forwarder for {@link SessionManager.detectAbort}. Provided so
   * mock-friendly test doubles do not need to import the class statically.
   */
  detectAbort(err: unknown): boolean {
    return SessionManager.detectAbort(err);
  }

  /**
   * Flush the active session's transcript to disk immediately.
   *
   * Called by the streaming orchestrator / REPL when a request is
   * aborted, to guarantee that partial history (messages received before
   * the abort) is not silently dropped when the process crashes or the
   * hub daemon exits (issue #1330). No-op when there is no active
   * session, so callers can invoke it unconditionally in a `finally`
   * block.
   */
  flush(): void {
    if (!this.activeSession) {
      return;
    }
    this.saveSession(this.activeSession);
  }

  /**
   * Flush the active transcript if `err` is an abort-family error.
   *
   * Returns `true` when a flush was performed (i.e. the error was
   * classified as abort-family AND an active session existed), otherwise
   * `false`. Non-abort errors are ignored so callers can use this in a
   * generic `catch (err)` without pre-filtering.
   */
  flushOnAbort(err: unknown): boolean {
    if (!SessionManager.detectAbort(err)) {
      return false;
    }
    if (!this.activeSession) {
      return false;
    }
    this.saveSession(this.activeSession);
    return true;
  }

  /**
   * Walk the `parentSessionId` chain starting at `sessionId` and return the
   * ordered list of ancestor session IDs (nearest ancestor first, root
   * ancestor last). The returned array does NOT include `sessionId`
   * itself, so its `.length` is the subagent nesting depth of
   * `sessionId` (0 for a top-level session, N for a session spawned by
   * one already at depth N-1).
   *
   * Missing sessions or broken parent links terminate the walk gracefully
   * — the chain returned reflects however far the walk got before the
   * next parent could not be resolved. A safety cap prevents an infinite
   * loop if a corrupted session store contains a cycle.
   */
  getSessionParentChain(sessionId: string): string[] {
    const chain: string[] = [];
    const visited = new Set<string>([sessionId]);
    const MAX_HOPS = 64;

    let currentId: string | undefined = sessionId;
    let hops = 0;
    while (currentId && hops < MAX_HOPS) {
      const sessionPath = path.join(this.sessionsDir, `${currentId}.json`);
      if (!fs.existsSync(sessionPath)) {
        break;
      }
      let parsed: Session;
      try {
        parsed = JSON.parse(fs.readFileSync(sessionPath, 'utf-8')) as Session;
      } catch {
        break;
      }
      const parentId = parsed.metadata.parentSessionId;
      if (!parentId || visited.has(parentId)) {
        break;
      }
      chain.push(parentId);
      visited.add(parentId);
      currentId = parentId;
      hops++;
    }

    return chain;
  }

  /**
   * Load an existing session
   */
  loadSession(sessionId: string): Session | null {
    const sessionPath = path.join(this.sessionsDir, `${sessionId}.json`);

    try {
      if (!fs.existsSync(sessionPath)) {
        return null;
      }

      const content = fs.readFileSync(sessionPath, 'utf-8');
      const session = JSON.parse(content) as Session;

      this.activeSession = session;
      return session;
    } catch (error) {
      console.error(`Failed to load session ${sessionId}:`, error);
      return null;
    }
  }

  /**
   * Save session to disk and refresh the FTS index entry.
   *
   * The FTS upsert runs after a successful JSON write so a filesystem
   * failure does not leave the index pointing at a session file that
   * never existed on disk. Index failures are swallowed inside
   * `upsertSession` — a broken index degrades to `listSessions` scans
   * rather than blocking a save.
   */
  private saveSession(session: Session): void {
    const sessionPath = path.join(this.sessionsDir, `${session.metadata.id}.json`);

    try {
      fs.writeFileSync(sessionPath, JSON.stringify(session, null, 2), 'utf-8');
    } catch (error) {
      console.error('Failed to save session:', error);
      return;
    }

    this.searchIndex.upsertSession(session.metadata, session.messages);
  }

  /**
   * Persist the current active session to disk without adding a message.
   *
   * Used by callers that mutate `metadata` directly (for example stamping
   * the resolved agent slug after a headless chat completes so the next
   * `--session <id>` resume picks it up — see kilocode f4cba053a) and
   * therefore cannot rely on `addMessage`'s implicit save. No-ops when
   * there is no active session so callers do not need a null check.
   */
  persistActiveSession(): void {
    if (this.activeSession) {
      this.saveSession(this.activeSession);
    }
  }

  /**
   * Add a message to the current session.
   *
   * The optional 4th argument accepts either a raw `displayRole` string
   * (for the common hook-context case) or an options object carrying
   * additional per-message metadata. The `displayRole` value overrides
   * how the message is rendered in user-facing transcripts (see
   * `Message.displayRole`) without changing its logical `role`.
   */
  addMessage(
    role: Message['role'],
    content: string,
    tokens?: Message['tokens'],
    options?: { displayRole?: Message['displayRole'] } | Message['displayRole']
  ): void {
    if (!this.activeSession) {
      this.createSession();
    }

    const displayRole = typeof options === 'string' ? options : options?.displayRole;

    const message: Message = {
      role,
      content,
      timestamp: Date.now(),
      tokens,
      ...(displayRole ? { displayRole } : {}),
    };

    this.activeSession!.messages.push(message);
    this.activeSession!.metadata.updated = Date.now();
    this.activeSession!.metadata.messageCount++;

    if (tokens) {
      this.activeSession!.metadata.totalTokens += (tokens.input || 0) + (tokens.output || 0);
    }

    // Auto-generate title from first user message. Skip messages that
    // are hidden from the transcript (e.g. hook context stamped with
    // `displayRole: 'system'`) so internal instrumentation cannot end
    // up as the session title.
    if (!this.activeSession!.metadata.title && role === 'user' && !displayRole) {
      const title = content.slice(0, 50) + (content.length > 50 ? '...' : '');
      this.activeSession!.metadata.title = title;
    }

    this.saveSession(this.activeSession!);

    // Auto-compact if enabled and context usage exceeds threshold
    if (this.autoCompact && shouldCompact(this.activeSession!.messages, this.maxContextTokens)) {
      this.compact().catch(() => {});
    }
  }

  /**
   * Get current session
   */
  getCurrentSession(): Session | null {
    return this.activeSession;
  }

  /**
   * Get conversation history for API calls
   */
  getHistory(maxMessages?: number): Message[] {
    if (!this.activeSession) {
      return [];
    }

    const messages = this.activeSession.messages;

    if (maxMessages && messages.length > maxMessages) {
      // Keep system messages and last N messages
      const systemMessages = messages.filter((m) => m.role === 'system');
      const recentMessages = messages.slice(-maxMessages);

      return [...systemMessages, ...recentMessages];
    }

    return messages;
  }

  /**
   * List all sessions.
   *
   * @param opts.workdir When set, only sessions whose recorded `workdir`
   *   resolves to the same path are returned. Sessions with no recorded
   *   workdir (legacy sessions created before the field was introduced) are
   *   excluded from filtered results — they have no opinion. Path comparison
   *   is performed via `path.resolve` and is case-insensitive on Windows.
   */
  listSessions(opts?: { workdir?: string }): SessionMetadata[] {
    try {
      const files = fs.readdirSync(this.sessionsDir);
      const sessions: SessionMetadata[] = [];

      for (const file of files) {
        if (!file.endsWith('.json')) {
          continue;
        }

        const sessionPath = path.join(this.sessionsDir, file);
        const content = fs.readFileSync(sessionPath, 'utf-8');
        const session = JSON.parse(content) as Session;

        sessions.push(session.metadata);
      }

      // Sort by updated time (newest first)
      sessions.sort((a, b) => b.updated - a.updated);

      if (opts?.workdir !== undefined) {
        const target = normalizeWorkdir(opts.workdir);
        return sessions.filter((s) => {
          if (s.workdir === undefined) {
            return false;
          }
          return normalizeWorkdir(s.workdir) === target;
        });
      }

      return sessions;
    } catch (error) {
      console.error('Failed to list sessions:', error);
      return [];
    }
  }

  /**
   * Delete a session
   */
  deleteSession(sessionId: string): boolean {
    const sessionPath = path.join(this.sessionsDir, `${sessionId}.json`);

    try {
      if (fs.existsSync(sessionPath)) {
        fs.unlinkSync(sessionPath);

        if (this.activeSession?.metadata.id === sessionId) {
          this.activeSession = null;
        }

        // Drop any plugin command-rule output cached against this session.
        clearRuleCommandCache(sessionId);

        // Remove from the FTS index so `--search` no longer surfaces the
        // deleted session. Safe when the index has not been initialized
        // yet — the call short-circuits internally.
        this.searchIndex.deleteSession(sessionId);

        return true;
      }
      return false;
    } catch (error) {
      console.error(`Failed to delete session ${sessionId}:`, error);
      return false;
    }
  }

  /**
   * Search saved sessions by FTS5 MATCH query.
   *
   * Delegates to the {@link SessionSearchIndex} initialized in the
   * constructor. Empty / whitespace-only queries fall back to
   * chronological order (matching `listSessions`) so callers can drive a
   * single UI code path. Options mirror {@link listSessions}: pass
   * `{ workdir }` to filter to sessions created in a specific directory.
   *
   * Returns rows shaped like {@link SessionMetadata} with an optional
   * `score` (lower is better). When the native SQLite binding is
   * unavailable an empty array is returned; callers should surface a
   * "no matches" message rather than a stacktrace.
   */
  searchSessions(query: string, options?: SessionSearchOptions): SessionSearchResult[] {
    // Reconciliation ensures manual `rm ~/.alexi/sessions/<id>.json` and
    // restores from backup both converge. Runs on every call because it
    // is cheap when the index is already warm (a directory listing plus
    // a diff against the meta table).
    this.searchIndex.refreshIndex();
    return this.searchIndex.search(query, options);
  }

  /**
   * Clear current session (reset conversation)
   */
  clearSession(): void {
    const sessionId = this.activeSession?.metadata.id;
    this.activeSession = null;
    if (sessionId) {
      clearRuleCommandCache(sessionId);
    }
  }

  /**
   * Close the active session, extract important knowledge, and store it as memories.
   * Returns the number of memories created, or null if no session / too few messages.
   */
  async closeAndExtract(): Promise<{ memoriesCreated: number } | null> {
    if (!this.activeSession) {
      return null;
    }

    const { messages } = this.activeSession;
    const sessionId = this.activeSession.metadata.id;

    const memoriesCreated = closeSession(messages, sessionId);

    this.activeSession = null;
    // Drop any plugin command-rule output cached against this session.
    clearRuleCommandCache(sessionId);

    return { memoriesCreated };
  }

  /**
   * Export session to JSON.
   *
   * Returns a pretty-printed JSON string with the following top-level shape:
   *   {
   *     version: '1.0',
   *     exported: <unix-ms>,
   *     metadata: { id, created, updated, modelId?, title?, workdir?,
   *                 parentSessionId?, totalTokens, messageCount },
   *     messages: Array<{ role, content, timestamp, tokens?,
   *                       reasoning?, toolCalls?, toolResults? }>,
   *   }
   *
   * Unlike {@link exportToMarkdown}, this format is intended for
   * machine-readable / round-trip use: `JSON.parse(exported)` always
   * yields an object matching the shape above. Content is preserved
   * as-is (no internal-wrapper stripping) so a future re-import can
   * faithfully reconstruct the session.
   *
   * When `sessionId` is provided the session is loaded from disk;
   * otherwise the active session is used. If no session is available,
   * a minimal envelope with `metadata: null` and `messages: []` is
   * returned (still valid JSON).
   */
  exportToJSON(sessionId?: string): string {
    const session = sessionId ? this.loadSession(sessionId) : this.activeSession;

    if (!session) {
      return JSON.stringify(
        {
          version: '1.0',
          exported: Date.now(),
          metadata: null,
          messages: [],
        },
        null,
        2
      );
    }

    const messages = session.messages.map((m) => {
      const entry: Record<string, unknown> = {
        role: m.role,
        content: m.content,
        timestamp: m.timestamp,
      };
      if (m.tokens) {
        entry.tokens = m.tokens;
      }
      // Structured extras (reasoning traces, tool calls/results) are
      // preserved when present on the on-disk message. They are not
      // part of the base `Message` interface, but sessions written by
      // richer producers may include them; we surface them verbatim.
      const extra = m as unknown as {
        reasoning?: unknown;
        toolCalls?: unknown;
        toolResults?: unknown;
      };
      if (extra.reasoning !== undefined) {
        entry.reasoning = extra.reasoning;
      }
      if (extra.toolCalls !== undefined) {
        entry.toolCalls = extra.toolCalls;
      }
      if (extra.toolResults !== undefined) {
        entry.toolResults = extra.toolResults;
      }
      return entry;
    });

    const meta = session.metadata;
    const exportObject = {
      version: '1.0',
      exported: Date.now(),
      metadata: {
        id: meta.id,
        created: meta.created,
        updated: meta.updated,
        modelId: meta.modelId,
        title: meta.title,
        workdir: meta.workdir,
        parentSessionId: meta.parentSessionId,
        totalTokens: meta.totalTokens,
        messageCount: meta.messageCount,
      },
      messages,
    };

    return JSON.stringify(exportObject, null, 2);
  }

  /**
   * Export session to markdown
   */
  exportToMarkdown(sessionId?: string): string {
    const session = sessionId ? this.loadSession(sessionId) : this.activeSession;

    if (!session) {
      return '# No session found\n';
    }

    let markdown = `# ${session.metadata.title || 'Conversation'}\n\n`;
    markdown += `**Session ID:** ${session.metadata.id}\n`;
    markdown += `**Created:** ${new Date(session.metadata.created).toISOString()}\n`;
    markdown += `**Model:** ${session.metadata.modelId || 'N/A'}\n`;
    markdown += `**Total Tokens:** ${session.metadata.totalTokens}\n\n`;
    markdown += `---\n\n`;

    for (const message of session.messages) {
      const timestamp = new Date(message.timestamp).toLocaleString();
      markdown += `## ${message.role.toUpperCase()} (${timestamp})\n\n`;
      // Strip Alexi-internal wrappers (`<agent_switch/>`,
      // `<system-reminder>...</system-reminder>`) from the exported view.
      // The on-disk session store keeps the raw markers so replay still
      // sees the handover context.
      markdown += `${stripInternalWrappers(message.content)}\n\n`;

      if (message.tokens) {
        markdown += `*Tokens: ${message.tokens.input || 0} in / ${message.tokens.output || 0} out*\n\n`;
      }
    }

    return markdown;
  }

  /**
   * Configured maximum context window (tokens) for the active session's
   * model. Used by the streaming orchestrator's overflow-recovery path to
   * seed `compact({ overflowRecovery: true, maxContextTokens, ... })`.
   */
  getMaxContextTokens(): number {
    return this.maxContextTokens;
  }

  /**
   * Manually trigger compaction on the active session.
   *
   * Accepts the same `CompactionOptions` bag as {@link compactConversation}.
   * The streaming orchestrator's context-overflow recovery path passes
   * `{ overflowRecovery: true, maxContextTokens, reserveOutputTokens }`
   * here so a `NothingToCompactError` bubbles up unchanged for the caller
   * to surface as an actionable terminal error.
   */
  async compact(
    options?: CompactionOptions
  ): Promise<{ saved: number; before: number; after: number } | null> {
    if (!this.activeSession) {
      return null;
    }

    const before = estimateMessagesTokens(this.activeSession.messages);
    const { messages } = await compactConversation(this.activeSession.messages, options);

    this.activeSession.messages = messages;
    this.activeSession.metadata.messageCount = messages.length;
    this.activeSession.metadata.updated = Date.now();
    this.saveSession(this.activeSession);

    const after = estimateMessagesTokens(messages);

    return { saved: before - after, before, after };
  }

  /**
   * Get current context window usage
   */
  getContextUsage(): { tokens: number; maxTokens: number; percent: number } | null {
    if (!this.activeSession) {
      return null;
    }

    const tokens = estimateMessagesTokens(this.activeSession.messages);
    const percent =
      this.maxContextTokens > 0 ? Math.round((tokens / this.maxContextTokens) * 100) : 0;

    return { tokens, maxTokens: this.maxContextTokens, percent };
  }

  /**
   * Get statistics for current session
   */
  getSessionStats(): {
    messageCount: number;
    totalTokens: number;
    avgTokensPerMessage: number;
    duration: number;
  } | null {
    if (!this.activeSession) return null;

    const { metadata } = this.activeSession;
    const duration = metadata.updated - metadata.created;
    const avgTokensPerMessage =
      metadata.messageCount > 0 ? metadata.totalTokens / metadata.messageCount : 0;

    return {
      messageCount: metadata.messageCount,
      totalTokens: metadata.totalTokens,
      avgTokensPerMessage: Math.round(avgTokensPerMessage),
      duration,
    };
  }
}
