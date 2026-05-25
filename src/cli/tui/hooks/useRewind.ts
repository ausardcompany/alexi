/**
 * useRewind hook — exposes discardAfter and summarizeBefore for managing
 * conversation history via the rewind menu.
 */

import { useCallback, useRef } from 'react';

import { useChat } from '../context/ChatContext.js';
import type { RewindMode } from '../context/ChatContext.js';
import type { MessageDisplay } from '../components/MessageArea.js';
import { partialCompact } from '../../../compaction/index.js';
import type { Message } from '../../../compaction/index.js';

export interface UseRewindOptions {
  messages: MessageDisplay[];
  setMessages: (messages: MessageDisplay[]) => void;
}

export interface UseRewindReturn {
  /** Discard all messages after the given turn index */
  discardAfter: (turnIndex: number) => void;
  /** Summarize all messages before the given turn index */
  summarizeBefore: (turnIndex: number) => Promise<void>;
  /** Combined rewind handler (discard or summarize) */
  rewindTo: (index: number, mode: RewindMode) => Promise<void>;
}

/**
 * Convert a MessageDisplay to a compaction Message for summarization.
 */
function toCompactionMessage(msg: MessageDisplay): Message {
  return {
    role: msg.role,
    content: msg.content,
    timestamp: msg.timestamp,
  };
}

export function useRewind({ messages, setMessages }: UseRewindOptions): UseRewindReturn {
  const chat = useChat();

  // Use a ref to always access the latest messages without recreating callbacks
  const messagesRef = useRef(messages);
  messagesRef.current = messages;

  const discardAfter = useCallback(
    (turnIndex: number) => {
      // Keep messages[0..turnIndex] inclusive
      const truncated = messagesRef.current.slice(0, turnIndex + 1);
      setMessages(truncated);
    },
    [setMessages]
  );

  const summarizeBefore = useCallback(
    async (turnIndex: number) => {
      if (turnIndex <= 0) {
        // Nothing to summarize
        return;
      }

      const currentMessages = messagesRef.current;
      const compactionMessages = currentMessages.map(toCompactionMessage);

      try {
        const compactedMessages = await partialCompact(compactionMessages, turnIndex);

        // Rebuild MessageDisplay array from compacted messages
        const preserved = currentMessages.slice(turnIndex);
        const summaryMsg = compactedMessages[0];

        if (summaryMsg) {
          const summaryDisplay: MessageDisplay = {
            id: `summary-${Date.now()}`,
            role: 'system',
            content: summaryMsg.content,
            toolCalls: [],
            timestamp: summaryMsg.timestamp ?? Date.now(),
          };
          setMessages([summaryDisplay, ...preserved]);
        } else {
          setMessages(preserved);
        }
      } catch {
        // If summarization fails, fall back to simple truncation
        const preserved = currentMessages.slice(turnIndex);
        setMessages(preserved);
      }
    },
    [setMessages]
  );

  const rewindTo = useCallback(
    async (index: number, mode: RewindMode) => {
      if (mode === 'discard') {
        discardAfter(index);
      } else {
        await summarizeBefore(index);
      }

      // Clear any streaming state — abort unconditionally (no-op if not active)
      chat.abortController?.abort();
    },
    [discardAfter, summarizeBefore, chat]
  );

  return { discardAfter, summarizeBefore, rewindTo };
}
