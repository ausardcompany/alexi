import React from 'react';
import { Box, Text } from 'ink';

import { MessageBubble } from './MessageBubble.js';
import { MarkdownRenderer } from './MarkdownRenderer.js';
import { Spinner } from './Spinner.js';
import { ToolCallBlock } from './ToolCallBlock.js';
import type { ToolCallState } from '../context/ChatContext.js';
import { useTheme } from '../context/ThemeContext.js';
import type { ImageAttachmentPreview } from '../context/AttachmentContext.js';

// ---------------------------------------------------------------------------
// Types (aligned with contracts/message-area.ts MessageDisplay)
// ---------------------------------------------------------------------------

export interface MessageDisplay {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  toolCalls: ToolCallState[];
  agent?: string;
  model?: string;
  tokens?: number;
  timestamp: number;
  /** Image attachments included with this message (display metadata only). */
  images?: ImageAttachmentPreview[];
}

export interface MessageAreaProps {
  /** Completed conversation messages (user + assistant history) */
  messages: MessageDisplay[];
  /** Currently streaming text (live, incomplete assistant response) */
  streamingText: string;
  /** Whether streaming is in progress */
  isStreaming: boolean;
  /** Active tool calls being executed */
  activeToolCalls: ToolCallState[];
  /** Callback to toggle tool call expansion */
  onToggleToolCall: (toolCallId: string) => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * MessageArea — full conversation viewport.
 *
 * Renders both completed messages (history) and the live streaming area
 * inside the dynamic viewport so messages remain visible on screen.
 */
export function MessageArea({
  messages,
  streamingText,
  isStreaming,
  activeToolCalls,
  onToggleToolCall,
}: MessageAreaProps): React.JSX.Element {
  const {
    theme: { colors },
  } = useTheme();

  return (
    <Box flexDirection="column" flexGrow={1} overflow="hidden" backgroundColor={colors.background}>
      {/* Empty state */}
      {messages.length === 0 && !isStreaming && (
        <Box flexGrow={1} alignItems="center" justifyContent="center">
          <Text color={colors.dimText}>Start a conversation…</Text>
        </Box>
      )}

      {/* Completed messages (history) */}
      {messages.map((msg) => (
        <Box key={msg.id} flexDirection="column">
          <MessageBubble
            role={msg.role}
            content={msg.content}
            agent={msg.agent}
            model={msg.model}
            tokens={msg.tokens}
            timestamp={msg.timestamp}
            images={msg.images}
          />
          {msg.toolCalls.map((tc) => (
            <ToolCallBlock
              key={tc.id}
              toolName={tc.toolName}
              params={tc.params}
              status={tc.status}
              output={tc.output}
              error={tc.error}
              isExpanded={tc.isExpanded}
              onToggle={() => onToggleToolCall(tc.id)}
              diff={tc.diff}
            />
          ))}
        </Box>
      ))}

      {/* Active tool calls (currently executing) */}
      {activeToolCalls.map((tc) => (
        <ToolCallBlock
          key={tc.id}
          toolName={tc.toolName}
          params={tc.params}
          status={tc.status}
          output={tc.output}
          error={tc.error}
          isExpanded={tc.isExpanded}
          onToggle={() => onToggleToolCall(tc.id)}
          diff={tc.diff}
        />
      ))}

      {/* Streaming: spinner while waiting */}
      {isStreaming && !streamingText && (
        <Box paddingX={1} paddingY={0}>
          <Spinner label="thinking…" />
        </Box>
      )}

      {/* Streaming: live markdown as it arrives */}
      {isStreaming && streamingText && (
        <Box paddingX={1} flexDirection="column" backgroundColor={colors.background}>
          <Text color={colors.success} bold>
            assistant
          </Text>
          <Box paddingLeft={2}>
            <MarkdownRenderer markdown={streamingText} isPartial={true} />
          </Box>
        </Box>
      )}
    </Box>
  );
}
