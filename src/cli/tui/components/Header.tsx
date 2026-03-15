import React from 'react';
import { Box, Text } from 'ink';

import type { HeaderProps } from '../types/props.js';

export type { HeaderProps };

/**
 * Header — top bar of the TUI layout.
 *
 * ┌──────────────────────────────────────────────────┐
 * │ model-name      [agent]      session-id  N tokens │
 * └──────────────────────────────────────────────────┘
 *
 * Height: 3 (1 border top + 1 content line + 1 border bottom)
 */
export function Header({
  model,
  agent,
  agentColor,
  sessionId,
  tokenCount,
  autoRoute,
}: HeaderProps): React.JSX.Element {
  return (
    <Box flexDirection="row" justifyContent="space-between" width="100%">
      {/* Left: model name (truncated if too long) */}
      <Box flexShrink={1}>
        <Text bold wrap="truncate-end">
          {model}
        </Text>
        {autoRoute && (
          <>
            <Text dimColor> [</Text>
            <Text color="cyan">auto-route</Text>
            <Text dimColor>]</Text>
          </>
        )}
      </Box>

      {/* Center: agent badge */}
      <Box flexShrink={0} marginX={1}>
        <Text color={agentColor} bold>
          {agent}
        </Text>
      </Box>

      {/* Right: session ID + token count */}
      <Box flexShrink={0}>
        <Text dimColor>{sessionId.slice(0, 8)}</Text>
        {tokenCount > 0 && <Text dimColor> {tokenCount.toLocaleString()} tok</Text>}
      </Box>
    </Box>
  );
}
