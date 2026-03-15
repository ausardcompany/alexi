import React from 'react';
import { Box, Text } from 'ink';

import type { MessageBubbleProps } from '../types/props.js';
import { MarkdownRenderer } from './MarkdownRenderer.js';
import { useTheme } from '../context/ThemeContext.js';
import { formatSize } from '../../../utils/imageValidation.js';

export type { MessageBubbleProps };

/** Extended props adding streaming-aware `isPartial` flag. */
export interface MessageBubbleExtendedProps extends MessageBubbleProps {
  /** Whether this message is still being streamed (partial markdown). Defaults to false. */
  isPartial?: boolean;
}

/**
 * MessageBubble — renders a single conversation message.
 *
 * Roles:
 * - user:      "You ❯ <content>" in prompt color
 * - assistant: "[agent] <content>" in text color (markdown in Phase 4)
 * - system:    dimmed centered line
 *
 * Metadata line (assistant only): [model | N tokens | HH:MM:SS]
 */
export function MessageBubble({
  role,
  content,
  agent,
  model,
  tokens,
  timestamp,
  images,
  isPartial = false,
}: MessageBubbleExtendedProps): React.JSX.Element {
  const {
    theme: { colors },
  } = useTheme();

  const timeStr = new Date(timestamp).toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  if (role === 'system') {
    return (
      <Box paddingX={1} justifyContent="center">
        <Text dimColor>─ {content} ─</Text>
      </Box>
    );
  }

  if (role === 'user') {
    return (
      <Box paddingX={1} flexDirection="column">
        {/* Image placeholders */}
        {images && images.length > 0 && (
          <Box gap={1}>
            {images.map((img) => (
              <Text key={img.id} color="cyan">
                [Image: {img.format.toUpperCase()} {formatSize(img.sizeBytes)}]
              </Text>
            ))}
          </Box>
        )}
        <Box>
          <Text color={colors.primary} bold>
            You ❯{' '}
          </Text>
          <Text>{content}</Text>
        </Box>
        <Box>
          <Text dimColor> {timeStr}</Text>
        </Box>
      </Box>
    );
  }

  // assistant
  const agentLabel = agent ?? 'assistant';

  return (
    <Box paddingX={1} flexDirection="column">
      {/* Label on its own line */}
      <Box>
        <Text color={colors.success} bold>
          {agentLabel} ❯
        </Text>
      </Box>
      {/* Content with consistent left padding */}
      <Box paddingLeft={2}>
        <MarkdownRenderer markdown={content} isPartial={isPartial} />
      </Box>
      {/* Metadata line */}
      <Box paddingLeft={2}>
        <Text dimColor>
          {[model, tokens !== undefined ? `${tokens} tok` : null, timeStr]
            .filter(Boolean)
            .join(' | ')}
        </Text>
      </Box>
    </Box>
  );
}
