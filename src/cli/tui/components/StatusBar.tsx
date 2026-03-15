import React from 'react';
import { Box, Text } from 'ink';

import type { StatusBarProps } from '../types/props.js';
import { useTheme } from '../context/ThemeContext.js';

export type { StatusBarProps };

/** Map common ISO 4217 currency codes to symbols. */
const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
};

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
  const {
    theme: { colors },
  } = useTheme();

  const currencySymbol = CURRENCY_SYMBOLS[cost.currency] ?? `${cost.currency} `;
  const costStr = `${currencySymbol}${cost.totalCost.toFixed(4)}`;

  if (leaderActive) {
    return (
      <Box paddingX={1}>
        <Text color={colors.warning}>
          leader: [n]ew session · [m]odel · [a]gent · [s]essions · [/]palette · [Esc] cancel
        </Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="row" justifyContent="space-between" paddingX={1}>
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
        {isStreaming ? (
          <Text color={colors.info}>● streaming</Text>
        ) : (
          <Text dimColor>{costStr}</Text>
        )}
      </Box>
    </Box>
  );
}
