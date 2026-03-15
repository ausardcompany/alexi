import { useCallback, useRef } from 'react';

import { useChat } from '../context/ChatContext.js';
import { useSession } from '../context/SessionContext.js';

export interface UseStreamChatReturn {
  sendMessage: (text: string) => Promise<void>;
  abort: () => void;
}

export function useStreamChat(): UseStreamChatReturn {
  const chat = useChat();
  const session = useSession();
  const abortControllerRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(
    async (text: string): Promise<void> => {
      // Clear previous state
      chat.clearStreamText();
      chat.setError(null);
      chat.setResponseModel(null);

      // Create and store a new AbortController
      const controller = new AbortController();
      abortControllerRef.current = controller;
      chat.setAbortController(controller);

      // Signal streaming has started
      chat.setStreaming(true);

      try {
        // Dynamic import to handle environments where streamChat may not be available
        const { streamChat } = await import('../../../core/streamingOrchestrator.js');

        const generator = streamChat(text, {
          modelOverride: session.model,
          autoRoute: session.autoRoute,
          agentId: session.agent,
          signal: controller.signal,
        });

        // Iterate the async generator for streaming chunks
        let iterResult = await generator.next();

        while (!iterResult.done) {
          const chunk = iterResult.value;
          if (chunk.text) {
            chat.appendStreamText(chunk.text);
          }
          iterResult = await generator.next();
        }

        // When done === true, value holds the StreamingResult
        const result = iterResult.value;

        // Update session with usage info
        if (result.usage?.total_tokens) {
          session.setTokenCount(result.usage.total_tokens);
        }

        chat.setResponseModel(result.modelUsed);
      } catch (err: unknown) {
        // Handle abort gracefully — not an error
        if (err instanceof Error && err.name === 'AbortError') {
          // Aborted by user; no error to display
        } else {
          const message = err instanceof Error ? err.message : String(err);
          chat.setError(message);
        }
      } finally {
        chat.setStreaming(false);
        chat.setAbortController(null);
        abortControllerRef.current = null;
      }
    },
    [chat, session]
  );

  const abort = useCallback(() => {
    abortControllerRef.current?.abort();
  }, []);

  return { sendMessage, abort };
}
