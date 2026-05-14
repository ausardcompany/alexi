/**
 * Session Manager for Multi-Turn Conversations
 * Manages conversation history and context for continuous interactions
 */

import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import { shouldCompact, compactConversation, estimateMessagesTokens } from './compaction.js';
import { closeSession } from './sessionClose.js';

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
  workdir?: string;
}

export interface SessionListFilter {
  workdir?: string;
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
  createSession(modelId?: string, workdir?: string): Session {
    const session: Session = {
      metadata: {
        id: randomUUID(),
        created: Date.now(),
        updated: Date.now(),
        modelId,
        totalTokens: 0,
        messageCount: 0,
        workdir,
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
   * List all sessions, optionally filtered by workspace
   */
  listSessions(filter?: SessionListFilter): SessionMetadata[] {
    try {
      const files = fs.readdirSync(this.sessionsDir);
      let sessions: SessionMetadata[] = [];

      for (const file of files) {
        if (!file.endsWith('.json')) continue;

        const sessionPath = path.join(this.sessionsDir, file);
        const content = fs.readFileSync(sessionPath, 'utf-8');
        const session = JSON.parse(content) as Session;

        sessions.push(session.metadata);
      }

      // Apply workdir filter if provided
      if (filter?.workdir) {
        sessions = sessions.filter((s) => s.workdir === filter.workdir);
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
