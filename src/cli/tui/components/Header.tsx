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
    <Box flexDirection="column">
      <Box flexDirection="row" justifyContent="space-between">
        {/* Left: model name */}
        <Box>
          <Text bold>{model}</Text>
          {autoRoute && (
            <>
              <Text dimColor> [</Text>
              <Text color="cyan">auto-route</Text>
              <Text dimColor>]</Text>
            </>
          )}
        </Box>

        {/* Center: agent badge */}
        <Box>
          <Text color={agentColor} bold>
            {agent}
          </Text>
        </Box>

        {/* Right: session ID + token count */}
        <Box>
          <Text dimColor>{sessionId.slice(0, 8)}</Text>
          {tokenCount > 0 && (
            <>
              <Text dimColor> </Text>
              <Text dimColor>{tokenCount.toLocaleString()} tok</Text>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
}
