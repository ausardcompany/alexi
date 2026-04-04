import React from 'react';
import { Box, Text } from 'ink';

import { useTheme } from '../context/ThemeContext.js';
import { Spinner } from './Spinner.js';

export interface StatusBarProps {
  agent: string;
  model: string;
  cost: { totalCost: number; currency: string };
  isStreaming: boolean;
  leaderActive: boolean;
  /** Token count for current session (shown in status bar since no header) */
  tokenCount?: number;
  /** Session ID (shown abbreviated) */
  sessionId?: string;
}

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
};

function formatTokens(count: number): string {
  if (count >= 1_000_000) {
    return `${(count / 1_000_000).toFixed(1)}M`;
  }
  if (count >= 1_000) {
    return `${(count / 1_000).toFixed(1)}k`;
  }
  return String(count);
}

/**
 * StatusBar — full-width bar at the very bottom with colored segment blocks.
 *
 * Matches upstream OpenCode layout:
 * [ctrl+? help][context/cost/tokens][streaming|agent][model name]
 *
 * Each segment has its own background color for a polished, cohesive look.
 */
export function StatusBar({
  agent,
  model,
  cost,
  isStreaming,
  leaderActive,
  tokenCount = 0,
  sessionId,
}: StatusBarProps): React.JSX.Element {
  const { theme } = useTheme();
  const { colors } = theme;

  const currencySymbol = CURRENCY_SYMBOLS[cost.currency] ?? `${cost.currency} `;
  const costStr = `${currencySymbol}${cost.totalCost.toFixed(4)}`;

  // Leader mode — full-width hint bar
  if (leaderActive) {
    return (
      <Box backgroundColor={colors.backgroundDarker}>
        <Text backgroundColor={colors.backgroundDarker} color={colors.warning}>
          {' '}
          leader: [n]ew [m]odel [a]gent [s]essions [f]iles [t]heme [l]ogs [h]elp [b]sidebar [q]uit
          [Esc]cancel{' '}
        </Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="row" backgroundColor={colors.backgroundDarker}>
      {/* Segment 1: Help hint */}
      <Box backgroundColor={colors.backgroundSecondary} paddingX={1}>
        <Text color={colors.dimText} backgroundColor={colors.backgroundSecondary}>
          ctrl+? help
        </Text>
      </Box>

      {/* Segment 2: Context info (cost + tokens) */}
      <Box backgroundColor={colors.backgroundDarker} paddingX={1} flexGrow={1}>
        <Text color={colors.dimText} backgroundColor={colors.backgroundDarker}>
          {costStr}
        </Text>
        {tokenCount > 0 && (
          <Text color={colors.dimText} backgroundColor={colors.backgroundDarker}>
            {' · '}
            {formatTokens(tokenCount)} tok
          </Text>
        )}
        {sessionId && (
          <Text color={colors.dimText} backgroundColor={colors.backgroundDarker}>
            {' · '}
            {sessionId.slice(0, 8)}
          </Text>
        )}
      </Box>

      {/* Segment 3: Streaming indicator or agent */}
      <Box backgroundColor={colors.backgroundSecondary} paddingX={1}>
        {isStreaming ? (
          <Box>
            <Spinner />
            <Text color={colors.info} backgroundColor={colors.backgroundSecondary}>
              {' '}
              streaming
            </Text>
          </Box>
        ) : (
          <Text color={colors.text} backgroundColor={colors.backgroundSecondary} bold>
            {agent}
          </Text>
        )}
      </Box>

      {/* Segment 4: Model name (rightmost, inverted colors) */}
      <Box backgroundColor={colors.secondary} paddingX={1}>
        <Text color={colors.backgroundDarker} backgroundColor={colors.secondary} bold>
          {model.length > 20 ? model.slice(0, 18) + '…' : model}
        </Text>
      </Box>
    </Box>
  );
}
