import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';

import { useTheme } from '../context/ThemeContext.js';
import { LogViewer } from '../components/LogViewer.js';
import { StatusBar } from '../components/StatusBar.js';
import type { LogEntry } from '../types/props.js';
import { getCostTracker } from '../../../core/costTracker.js';

/**
 * Pick the highest-cost routed model from today's usage. Returns `undefined`
 * when no calls have been recorded yet so the StatusBar omits the segment.
 */
function pickTopModelLabel(_costSignal: number): string | undefined {
  const summary = getCostTracker().getTodaySummary();
  const entries = Object.entries(summary.byModel);
  if (entries.length === 0) {
    return undefined;
  }
  entries.sort((a, b) => b[1].cost - a[1].cost);
  return entries[0][0];
}

export interface LogsPageProps {
  entries: LogEntry[];
  agent: string;
  model: string;
  cost: { totalCost: number; currency: string };
  isStreaming: boolean;
  leaderActive: boolean;
}

const LEVEL_OPTIONS: Array<LogEntry['level'] | 'all'> = ['all', 'debug', 'info', 'warn', 'error'];

/**
 * LogsPage — dedicated debug/logs page.
 *
 * Header with "Logs" title, filter controls, LogViewer, and StatusBar.
 */
export function LogsPage({
  entries,
  agent,
  model,
  cost,
  isStreaming,
  leaderActive,
}: LogsPageProps): React.JSX.Element {
  const { theme } = useTheme();
  const { colors } = theme;
  const [levelFilter, setLevelFilter] = useState<LogEntry['level'] | 'all'>('all');
  const [filterQuery, setFilterQuery] = useState('');
  // Recompute on the same hook that already drives cost updates — when the
  // total cost changes (i.e. a turn just recorded usage), the memo re-runs.
  const topModelLabel = React.useMemo(() => pickTopModelLabel(cost.totalCost), [cost.totalCost]);

  useInput((input, key) => {
    // Cycle level filter with Tab
    if (key.tab) {
      setLevelFilter((prev) => {
        const idx = LEVEL_OPTIONS.indexOf(prev);
        return LEVEL_OPTIONS[(idx + 1) % LEVEL_OPTIONS.length];
      });
      return;
    }
    // Simple query editing
    if (key.backspace || key.delete) {
      setFilterQuery((prev) => prev.slice(0, -1));
      return;
    }
    if (input && input.length === 1 && !key.ctrl && !key.meta && !key.escape) {
      setFilterQuery((prev) => prev + input);
    }
  });

  return (
    <>
      {/* Header */}
      <Box
        paddingX={1}
        borderBottom
        borderStyle="single"
        borderColor={colors.border}
        borderTop={false}
        borderLeft={false}
        borderRight={false}
      >
        <Text color={colors.text} bold>
          Logs
        </Text>
        <Text color={colors.dimText}> Level: </Text>
        <Text color={colors.primary} bold>
          {levelFilter}
        </Text>
        {filterQuery && (
          <>
            <Text color={colors.dimText}> Filter: </Text>
            <Text color={colors.text}>{filterQuery}</Text>
          </>
        )}
        <Text color={colors.dimText}> ({entries.length} entries)</Text>
      </Box>

      {/* Log viewer */}
      <LogViewer entries={entries} levelFilter={levelFilter} filterQuery={filterQuery} />

      {/* Status bar */}
      <Box flexShrink={0}>
        <StatusBar
          agent={agent}
          model={model}
          cost={cost}
          isStreaming={isStreaming}
          leaderActive={leaderActive}
          topModelLabel={topModelLabel}
        />
      </Box>
    </>
  );
}
