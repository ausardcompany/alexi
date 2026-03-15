import React from 'react';
import { Box, Text, Static } from 'ink';

import { MessageBubble } from './MessageBubble.js';
import { MarkdownRenderer } from './MarkdownRenderer.js';
import { Spinner } from './Spinner.js';
import { ToolCallBlock } from './ToolCallBlock.js';
import type { ToolCallState } from '../context/ChatContext.js';
import { useTheme } from '../context/ThemeContext.js';

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
}

export interface MessageAreaProps {
  /** All completed messages in the conversation */
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
 * MessageArea — scrollable conversation display.
 *
 * Phase 6 integration:
 * - Renders completed messages as MessageBubbles with associated ToolCallBlock components
 * - Shows active tool calls as ToolCallBlock components with live status
 * - Shows streaming text as a live "assistant" bubble with markdown rendering
 * - Auto-scrolls: newest content always visible (Ink handles this with flexGrow)
 *
 * Phase 12 will wrap completed messages in <Static> for perf.
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
    <Box flexDirection="column" flexGrow={1} overflow="hidden">
      {/* Completed messages - Static for performance */}
      <Static items={messages}>
        {(msg) => (
          <React.Fragment key={msg.id}>
            <MessageBubble
              role={msg.role}
              content={msg.content}
              agent={msg.agent}
              model={msg.model}
              tokens={msg.tokens}
              timestamp={msg.timestamp}
            />
            {/* Completed tool calls for this message */}
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
          </React.Fragment>
        )}
      </Static>

      {/* Active tool calls */}
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

      {/* Streaming text (live assistant response) */}
      {isStreaming && streamingText && (
        <Box paddingX={1} flexDirection="column">
          <Box>
            <Text color={colors.success} bold>
              assistant ❯{' '}
            </Text>
            <MarkdownRenderer markdown={streamingText} isPartial={true} />
          </Box>
        </Box>
      )}

      {/* Spinner placeholder while streaming but no text yet */}
      {isStreaming && !streamingText && (
        <Box paddingX={1}>
          <Spinner label="thinking…" />
        </Box>
      )}
    </Box>
  );
}
