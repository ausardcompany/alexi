import React from 'react';
import { Box, Text } from 'ink';

import { MessageBubble } from './MessageBubble.js';
import { MarkdownRenderer } from './MarkdownRenderer.js';
import { Spinner } from './Spinner.js';
import { ToolRow } from './ToolRow.js';
import { WorkActivity } from './WorkActivity.js';
import type { ToolCallState } from '../context/ChatContext.js';
import { useTheme } from '../context/ThemeContext.js';
import type { ImageAttachmentPreview } from '../context/AttachmentContext.js';
import { collapseCompletedWork } from '../utils/collapseWork.js';

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
  /**
   * Optional per-message display-role override. Messages with
   * `displayRole: 'system'` are hidden from the transcript so internal
   * instrumentation (e.g. hook `contextModification` payloads that were
   * injected into the model conversation) does not clutter the user's
   * view. Model API calls are unaffected — this is a UI-only filter.
   */
  displayRole?: 'system' | 'user' | 'assistant';
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

  // Hide messages tagged with `displayRole: 'system'` from the transcript.
  // These are typically hook `contextModification` payloads that were sent
  // to the model as instrumentation but should not clutter the user's view.
  const visibleMessages = messages.filter((m) => m.displayRole !== 'system');

  // Group the transcript into runs (user -> assistant deliverable). Each
  // completed run's tool calls collapse into a single WorkActivity summary,
  // keeping final answers visible while working details remain on demand.
  const runs = collapseCompletedWork(visibleMessages, { isStreaming });

  return (
    <Box flexDirection="column" flexGrow={1} overflow="hidden" backgroundColor={colors.background}>
      {/* Empty state */}
      {visibleMessages.length === 0 && !isStreaming && (
        <Box flexGrow={1} alignItems="center" justifyContent="center">
          <Text color={colors.dimText}>Start a conversation…</Text>
        </Box>
      )}

      {/* Completed messages (history), grouped into runs */}
      {runs.map((run) => (
        <Box key={run.id} flexDirection="column">
          {run.userMessage !== null && (
            <MessageBubble
              role={run.userMessage.role}
              content={run.userMessage.content}
              agent={run.userMessage.agent}
              model={run.userMessage.model}
              tokens={run.userMessage.tokens}
              timestamp={run.userMessage.timestamp}
              images={run.userMessage.images}
            />
          )}
          {run.shouldCollapse ? (
            <WorkActivity toolCalls={run.toolCalls} duration={run.durationMs} />
          ) : (
            run.toolCalls.map((tc) => (
              <ToolRow
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
            ))
          )}
          {run.assistantMessage !== null && (
            <MessageBubble
              role={run.assistantMessage.role}
              content={run.assistantMessage.content}
              agent={run.assistantMessage.agent}
              model={run.assistantMessage.model}
              tokens={run.assistantMessage.tokens}
              timestamp={run.assistantMessage.timestamp}
              images={run.assistantMessage.images}
            />
          )}
        </Box>
      ))}

      {/* Active tool calls (currently executing) */}
      {activeToolCalls.map((tc) => (
        <ToolRow
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
