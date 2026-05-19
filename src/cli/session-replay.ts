/**
 * Session Replay for Interactive Resume
 * Based on opencode changes for session history replay on resume
 */

import type { Message } from '../../core/sessionManager.js';

export interface ReplayOptions {
  /**
   * Maximum number of messages to replay
   */
  maxMessages?: number;

  /**
   * Whether to show tool calls in replay
   */
  showToolCalls?: boolean;

  /**
   * Whether to show system messages in replay
   */
  showSystemMessages?: boolean;

  /**
   * Callback for each replayed message
   */
  onMessage?: (message: Message, index: number, total: number) => void;
}

export interface ReplayResult {
  messagesReplayed: number;
  skippedMessages: number;
  duration: number;
}

/**
 * Replay session history for interactive resume
 * Allows users to see context when resuming a session
 */
export class SessionReplay {
  /**
   * Replay messages from a session
   */
  async replay(messages: Message[], options: ReplayOptions = {}): Promise<ReplayResult> {
    const startTime = Date.now();
    const {
      maxMessages = 50,
      showToolCalls = true,
      showSystemMessages = false,
      onMessage,
    } = options;

    let messagesReplayed = 0;
    let skippedMessages = 0;

    // Filter messages based on options
    const filteredMessages = messages.filter((msg) => {
      // Skip system messages if not enabled
      if (msg.role === 'system' && !showSystemMessages) {
        skippedMessages++;
        return false;
      }

      // Skip tool calls if not enabled
      if (!showToolCalls && this.hasToolCalls(msg)) {
        skippedMessages++;
        return false;
      }

      return true;
    });

    // Take only the last N messages
    const messagesToReplay = filteredMessages.slice(-maxMessages);
    const total = messagesToReplay.length;

    // Replay each message
    for (let i = 0; i < messagesToReplay.length; i++) {
      const message = messagesToReplay[i];

      if (onMessage) {
        onMessage(message, i, total);
      }

      messagesReplayed++;
    }

    const duration = Date.now() - startTime;

    return {
      messagesReplayed,
      skippedMessages,
      duration,
    };
  }

  /**
   * Check if a message contains tool calls
   */
  private hasToolCalls(message: Message): boolean {
    // Check if message has tool_calls property
    if ('tool_calls' in message && Array.isArray((message as any).tool_calls)) {
      return (message as any).tool_calls.length > 0;
    }

    // Check if content mentions tool execution
    if (typeof message.content === 'string') {
      return (
        message.content.includes('Tool:') ||
        message.content.includes('tool_call') ||
        message.content.includes('function_call')
      );
    }

    return false;
  }

  /**
   * Format a message for display during replay
   */
  formatMessage(message: Message): string {
    const timestamp = message.timestamp ? new Date(message.timestamp).toLocaleTimeString() : '';
    const role = message.role.toUpperCase();

    let content = '';
    if (typeof message.content === 'string') {
      content = message.content;
    } else if (Array.isArray(message.content)) {
      // Handle multimodal content
      content = message.content
        .map((item: any) => {
          if (item.type === 'text') {
            return item.text;
          }
          if (item.type === 'image') {
            return '[Image]';
          }
          return '[Unknown content]';
        })
        .join(' ');
    }

    // Truncate long messages
    const maxLength = 200;
    if (content.length > maxLength) {
      content = content.slice(0, maxLength) + '...';
    }

    return `[${timestamp}] ${role}: ${content}`;
  }

  /**
   * Get a summary of the session
   */
  getSummary(messages: Message[]): {
    totalMessages: number;
    userMessages: number;
    assistantMessages: number;
    systemMessages: number;
    toolCalls: number;
  } {
    let userMessages = 0;
    let assistantMessages = 0;
    let systemMessages = 0;
    let toolCalls = 0;

    for (const message of messages) {
      switch (message.role) {
        case 'user':
          userMessages++;
          break;
        case 'assistant':
          assistantMessages++;
          break;
        case 'system':
          systemMessages++;
          break;
      }

      if (this.hasToolCalls(message)) {
        toolCalls++;
      }
    }

    return {
      totalMessages: messages.length,
      userMessages,
      assistantMessages,
      systemMessages,
      toolCalls,
    };
  }
}

/**
 * Global session replay instance
 */
let globalSessionReplay: SessionReplay | null = null;

/**
 * Get the global session replay instance
 */
export function getSessionReplay(): SessionReplay {
  if (!globalSessionReplay) {
    globalSessionReplay = new SessionReplay();
  }
  return globalSessionReplay;
}
