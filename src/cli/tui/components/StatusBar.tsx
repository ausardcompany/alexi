import React from 'react';
import { Box, Text } from 'ink';

import type { StatusBarProps } from '../types/props.js';

export type { StatusBarProps };

/**
 * StatusBar — single-line bar at the very bottom of the TUI.
 *
 * Normal mode:   Tab: switch agent · Ctrl+X: leader · /help     [agent]   $0.00
 * Leader mode:   leader: [n]ew · [m]odel · [a]gent · [Esc]cancel
 * Streaming:     right side shows "● streaming"
 */
export function StatusBar({
  agent,
  model: _model,
  cost,
  isStreaming,
  leaderActive,
}: StatusBarProps): React.JSX.Element {
  const costStr = `$${cost.totalCost.toFixed(4)}`;

  if (leaderActive) {
    return (
      <Box>
        <Text color="yellow">
          leader: [n]ew session · [m]odel · [a]gent · [s]essions · [/]palette · [Esc] cancel
        </Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="row" justifyContent="space-between">
      {/* Left: keybinding hints */}
      <Box>
        <Text dimColor>Tab: switch agent · Ctrl+X: leader · /help</Text>
      </Box>

      {/* Center: agent */}
      <Box>
        <Text dimColor>{agent}</Text>
      </Box>

      {/* Right: cost + streaming indicator */}
      <Box>
        {isStreaming ? <Text color="green">● streaming</Text> : <Text dimColor>{costStr}</Text>}
      </Box>
    </Box>
  );
}
