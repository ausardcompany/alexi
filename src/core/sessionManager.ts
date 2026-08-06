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
  }

  /**
   * Create a new session.
   *
   * When `parentSessionId` is provided the new session is recorded as a
   * subagent child of that parent, which allows `getSessionParentChain`
   * to walk the ancestry and compute the current subagent nesting depth.
   */
  createSession(modelId?: string, parentSessionId?: string): Session {
    const session: Session = {
      metadata: {
        id: randomUUID(),
        created: Date.now(),
        updated: Date.now(),
        modelId,
        totalTokens: 0,
        messageCount: 0,
        workdir: process.cwd(),
        parentSessionId,
      },
      messages: [],
    };

    this.activeSession = session;
    this.saveSession(session);

    return session;
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
   * Save session to disk
   */
  private saveSession(session: Session): void {
    const sessionPath = path.join(this.sessionsDir, `${session.metadata.id}.json`);

    try {
      fs.writeFileSync(sessionPath, JSON.stringify(session, null, 2), 'utf-8');
    } catch (error) {
      console.error('Failed to save session:', error);
    }
  }

  /**
   * Add a message to the current session
   */
  addMessage(role: Message['role'], content: string, tokens?: Message['tokens']): void {
    if (!this.activeSession) {
      this.createSession();
    }

    const message: Message = {
      role,
      content,
      timestamp: Date.now(),
      tokens,
    };

    this.activeSession!.messages.push(message);
    this.activeSession!.metadata.updated = Date.now();
    this.activeSession!.metadata.messageCount++;

    if (tokens) {
      this.activeSession!.metadata.totalTokens += (tokens.input || 0) + (tokens.output || 0);
    }

    // Auto-generate title from first user message
    if (!this.activeSession!.metadata.title && role === 'user') {
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

        return true;
      }
      return false;
    } catch (error) {
      console.error(`Failed to delete session ${sessionId}:`, error);
      return false;
    }
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
