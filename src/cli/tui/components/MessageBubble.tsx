import React from 'react';
import { Box, Text, useStdout } from 'ink';

import type { MessageBubbleProps } from '../types/props.js';
import { MarkdownRenderer } from './MarkdownRenderer.js';
import { useTheme } from '../context/ThemeContext.js';
import { formatSize } from '../../../utils/imageValidation.js';

export type { MessageBubbleProps };

export interface MessageBubbleExtendedProps extends MessageBubbleProps {
  isPartial?: boolean;
}

/**
 * MessageBubble — renders a single conversation message.
 *
 * Upstream-matched styling:
 * - Role-specific icons: ● for user, ◆ for assistant
 * - Timestamp inline in header
 * - Compact metadata format
 * - backgroundSecondary tint for user messages
 * - Full-width separators
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
  const { theme } = useTheme();
  const { colors } = theme;
  const { stdout } = useStdout();
  const columns = stdout?.columns ?? 80;

  const timeStr = new Date(timestamp).toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  if (role === 'system') {
    const separator = '─'.repeat(Math.max(10, columns - 4));
    return (
      <Box paddingX={1} justifyContent="center">
        <Text color={colors.dimText}>{separator}</Text>
      </Box>
    );
  }

  if (role === 'user') {
    return (
      <Box
        paddingX={1}
        paddingY={0}
        flexDirection="column"
        backgroundColor={colors.backgroundSecondary}
      >
        {/* Image placeholders */}
        {images && images.length > 0 && (
          <Box gap={1}>
            {images.map((img) => (
              <Text key={img.id} color={colors.info}>
                [Image: {img.format.toUpperCase()} {formatSize(img.sizeBytes)}]
              </Text>
            ))}
          </Box>
        )}
        {/* Header: You + timestamp */}
        <Box>
          <Text color={colors.primary} bold>
            You
          </Text>
          <Text color={colors.dimText}> {timeStr}</Text>
        </Box>
        <Box paddingLeft={2}>
          <Text wrap="wrap">{content}</Text>
        </Box>
      </Box>
    );
  }

  // assistant
  const agentLabel = agent ?? 'assistant';

  return (
    <Box paddingX={1} paddingY={0} flexDirection="column" backgroundColor={colors.background}>
      {/* Header: agent name + metadata */}
      <Box>
        <Text color={colors.success} bold>
          {agentLabel}
        </Text>
        <Text color={colors.dimText}>
          {'  '}
          {[model, tokens !== undefined ? `${tokens} tok` : null, timeStr]
            .filter(Boolean)
            .join(' · ')}
        </Text>
      </Box>
      {/* Content */}
      <Box paddingLeft={2}>
        <MarkdownRenderer markdown={content} isPartial={isPartial} />
      </Box>
    </Box>
  );
}
