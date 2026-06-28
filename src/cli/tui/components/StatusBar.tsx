import React from 'react';
import { Box, Text } from 'ink';

import { ProviderModelFellBack } from '../../../bus/index.js';
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
  /**
   * Optional label for the highest-cost routed model today. Rendered dimmed
   * after the cost segment so users can see which route is burning their
   * budget when auto-routing is on. Truncated to 18 chars + ellipsis to
   * keep the segment compact (matches the model truncation rule below).
   */
  topModelLabel?: string;
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
  topModelLabel,
}: StatusBarProps): React.JSX.Element {
  const { theme } = useTheme();
  const { colors } = theme;

  // Subscribe to provider fallback events so the user can see when their
  // configured model id was not recognized and a different one is being used.
  // Persists for the rest of the session (matches the dedup-once semantics on
  // the publisher side in src/providers/index.ts).
  const [fallbackWarning, setFallbackWarning] = React.useState<{
    requested: string;
    effective: string;
  } | null>(null);

  React.useEffect(() => {
    const unsub = ProviderModelFellBack.subscribe((p) => {
      setFallbackWarning({ requested: p.requestedModel, effective: p.effectiveModel });
    });
    return unsub;
  }, []);

  const currencySymbol = CURRENCY_SYMBOLS[cost.currency] ?? `${cost.currency} `;
  const costStr = `${currencySymbol}${cost.totalCost.toFixed(4)}`;
  const topModelDisplay =
    topModelLabel && topModelLabel.length > 0
      ? topModelLabel.length > 20
        ? topModelLabel.slice(0, 18) + '…'
        : topModelLabel
      : null;

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
        {topModelDisplay && (
          <Text color={colors.dimText} backgroundColor={colors.backgroundDarker}>
            {' · '}
            {topModelDisplay}
          </Text>
        )}
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

      {/* Fallback warning (only when model id was not recognized) */}
      {fallbackWarning && (
        <Box backgroundColor={colors.backgroundDarker} paddingX={1}>
          <Text color={colors.warning} backgroundColor={colors.backgroundDarker}>
            ! model {fallbackWarning.requested} unavailable → using {fallbackWarning.effective}
          </Text>
        </Box>
      )}

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
