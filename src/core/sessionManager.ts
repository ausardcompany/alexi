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
  partialCompact,
} from './compaction.js';
import { closeSession } from './sessionClose.js';
import { getUndoManager } from '../undo/index.js';
import { SessionRewind, SessionPartialSummarize } from '../bus/index.js';

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
   * Create a new session
   */
  createSession(modelId?: string): Session {
    const session: Session = {
      metadata: {
        id: randomUUID(),
        created: Date.now(),
        updated: Date.now(),
        modelId,
        totalTokens: 0,
        messageCount: 0,
      },
      messages: [],
    };

    this.activeSession = session;
    this.saveSession(session);

    return session;
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
   * List all sessions
   */
  listSessions(): SessionMetadata[] {
    try {
      const files = fs.readdirSync(this.sessionsDir);
      const sessions: SessionMetadata[] = [];

      for (const file of files) {
        if (!file.endsWith('.json')) continue;

        const sessionPath = path.join(this.sessionsDir, file);
        const content = fs.readFileSync(sessionPath, 'utf-8');
        const session = JSON.parse(content) as Session;

        sessions.push(session.metadata);
      }

      // Sort by updated time (newest first)
      sessions.sort((a, b) => b.updated - a.updated);

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
    this.activeSession = null;
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

    return { memoriesCreated };
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
      markdown += `${message.content}\n\n`;

      if (message.tokens) {
        markdown += `*Tokens: ${message.tokens.input || 0} in / ${message.tokens.output || 0} out*\n\n`;
      }
    }

    return markdown;
  }

  /**
   * Manually trigger compaction on the active session
   */
  async compact(): Promise<{ saved: number; before: number; after: number } | null> {
    if (!this.activeSession) {
      return null;
    }

    const before = estimateMessagesTokens(this.activeSession.messages);
    const { messages } = await compactConversation(this.activeSession.messages);

    this.activeSession.messages = messages;
    this.activeSession.metadata.messageCount = messages.length;
    this.activeSession.metadata.updated = Date.now();
    this.saveSession(this.activeSession);

    const after = estimateMessagesTokens(messages);

    return { saved: before - after, before, after };
  }

  /**
   * Count the number of user-assistant turn pairs in the session.
   * A "turn" is defined as a user message (optionally followed by an assistant response).
   */
  getTurnCount(): number {
    if (!this.activeSession) {
      return 0;
    }

    return this.activeSession.messages.filter((m) => m.role === 'user').length;
  }

  /**
   * Rewind the last N user-assistant turn pairs from the session.
   * Also triggers file undo for any file changes made in those turns.
   *
   * @param n - Number of turns to rewind (default 1)
   * @returns Object with details about what was rewound
   */
  async rewind(
    n = 1
  ): Promise<{ turnsRemoved: number; messagesRemoved: number; filesRestored: string[] }> {
    if (!this.activeSession) {
      throw new Error('No active session');
    }

    const totalTurns = this.getTurnCount();
    if (n <= 0) {
      throw new Error('Number of turns must be a positive integer');
    }
    if (n > totalTurns) {
      throw new Error(`Cannot rewind ${n} turns: only ${totalTurns} turn(s) in session`);
    }

    const messages = this.activeSession.messages;

    // Find the index where we should cut: remove last n user messages and their
    // associated assistant responses.
    // Walk from the end to find the n-th user message.
    let userCount = 0;
    let cutIndex = messages.length;

    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === 'user') {
        userCount++;
        if (userCount === n) {
          cutIndex = i;
          break;
        }
      }
    }

    const removedMessages = messages.slice(cutIndex);
    const messagesRemoved = removedMessages.length;

    // Undo file changes associated with removed messages
    const undoManager = getUndoManager();
    const undoHistory = undoManager.getUndoHistory();
    const filesRestored: string[] = [];

    // Find undo entries whose messageId matches any removed message timestamp
    // Since messageId in undo entries corresponds to message identifiers,
    // we undo entries from the top of the stack that correspond to the removed turns.
    // We perform undos for entries created after the cut point timestamp.
    const cutTimestamp = removedMessages.length > 0 ? removedMessages[0].timestamp : Date.now();
    const entriesToUndo = undoHistory.filter((entry) => entry.createdAt >= cutTimestamp);

    // Undo them in reverse order (most recent first)
    for (let i = entriesToUndo.length - 1; i >= 0; i--) {
      if (undoManager.canUndo()) {
        const result = await undoManager.undo();
        if (result.success) {
          filesRestored.push(...result.restoredFiles);
        }
      }
    }

    // Truncate messages
    this.activeSession.messages = messages.slice(0, cutIndex);
    this.activeSession.metadata.messageCount = this.activeSession.messages.length;
    this.activeSession.metadata.updated = Date.now();
    this.saveSession(this.activeSession);

    // Emit event
    SessionRewind.publish({
      sessionId: this.activeSession.metadata.id,
      turnsRemoved: n,
      messagesRemoved,
      filesRestored,
      timestamp: Date.now(),
    });

    return { turnsRemoved: n, messagesRemoved, filesRestored };
  }

  /**
   * Summarize all messages before the given turn index while keeping recent turns intact.
   * Turn indices are 1-based (turn 1 = first user message and its response).
   *
   * @param beforeTurn - Summarize all turns before this turn number (1-based)
   * @returns Object with details about what was summarized
   */
  async partialSummarize(
    beforeTurn: number
  ): Promise<{ messagesSummarized: number; messagesPreserved: number }> {
    if (!this.activeSession) {
      throw new Error('No active session');
    }

    const totalTurns = this.getTurnCount();
    if (beforeTurn <= 0) {
      throw new Error('Turn number must be a positive integer');
    }
    if (beforeTurn > totalTurns) {
      throw new Error(
        `Cannot summarize before turn ${beforeTurn}: only ${totalTurns} turn(s) in session`
      );
    }
    if (beforeTurn <= 1) {
      throw new Error('Nothing to summarize before turn 1');
    }

    const messages = this.activeSession.messages;

    // Find the message index that corresponds to the start of turn `beforeTurn`.
    // Turn N starts at the N-th user message.
    let userCount = 0;
    let splitIndex = 0;

    for (let i = 0; i < messages.length; i++) {
      if (messages[i].role === 'user') {
        userCount++;
        if (userCount === beforeTurn) {
          splitIndex = i;
          break;
        }
      }
    }

    // Messages before splitIndex get summarized; messages from splitIndex onward are kept
    const messagesToSummarize = messages.slice(0, splitIndex);
    const messagesToKeep = messages.slice(splitIndex);

    if (messagesToSummarize.length === 0) {
      return { messagesSummarized: 0, messagesPreserved: messagesToKeep.length };
    }

    // Generate partial summary
    const summaryMessage = await partialCompact(messages, 0, splitIndex);

    // Replace old messages with summary + kept messages
    this.activeSession.messages = [summaryMessage, ...messagesToKeep];
    this.activeSession.metadata.messageCount = this.activeSession.messages.length;
    this.activeSession.metadata.updated = Date.now();
    this.saveSession(this.activeSession);

    // Emit event
    SessionPartialSummarize.publish({
      sessionId: this.activeSession.metadata.id,
      messagesSummarized: messagesToSummarize.length,
      messagesPreserved: messagesToKeep.length,
      timestamp: Date.now(),
    });

    return {
      messagesSummarized: messagesToSummarize.length,
      messagesPreserved: messagesToKeep.length,
    };
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

// ============ Global Instance ============

let globalSessionManager: SessionManager | null = null;

/**
 * Get the global SessionManager instance
 * @param options - Optional configuration for initialization
 * @returns The global SessionManager instance
 */
export function getSessionManager(options?: SessionManagerOptions): SessionManager {
  if (!globalSessionManager) {
    globalSessionManager = new SessionManager(options);
  }
  return globalSessionManager;
}

/**
 * Set the global SessionManager instance
 * @param manager - SessionManager instance to use globally
 */
export function setSessionManager(manager: SessionManager): void {
  globalSessionManager = manager;
}

/**
 * Reset the global SessionManager instance (useful for testing)
 */
export function resetSessionManager(): void {
  globalSessionManager = null;
}
