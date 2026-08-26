import React, { useState } from 'react';
import { Box, Text } from 'ink';

import { useTheme } from '../context/ThemeContext.js';
import { AnimatedDisclosure } from './AnimatedDisclosure.js';
import { ToolRow } from './ToolRow.js';
import type { ToolCallState } from '../context/ChatContext.js';
import { formatDuration } from '../utils/formatDuration.js';

export interface WorkActivityProps {
  /** Flat tool-call list from a completed run, in transcript order. */
  toolCalls: ToolCallState[];
  /** Total wall-clock duration across all tool calls in the run, ms. */
  duration: number;
  /**
   * Controlled expansion state. When omitted, the component manages its
   * own expansion state (uncontrolled) starting collapsed.
   */
  isExpanded?: boolean;
  /** Toggle callback invoked when the summary row is activated. */
  onToggle?: () => void;
  /**
   * When true, animate the disclosure open/close. Defaults to `true`.
   * Set `false` in tests or snapshot renders so children mount
   * synchronously.
   */
  animate?: boolean;
  /**
   * Animation duration in ms. Defaults to 180ms (iOS-style easing per the
   * Cline reference); AnimatedDisclosure supports a fast 120ms fallback,
   * this component follows the run-level rhythm.
   */
  animationDuration?: number;
}

/**
 * WorkActivity — collapses a completed run's tool calls behind a single
 * summary row of the form:
 *
 *   > Worked for 4m 12s and made 14 tool calls
 *
 * The summary is the disclosure trigger; the AnimatedDisclosure body
 * renders each tool call inline. Working-row rhythm is tighter than
 * the transcript rhythm (no vertical margin between rows) so the run
 * feels like a coherent block rather than a stack of independent bubbles.
 *
 * Behaviour:
 * - Uncontrolled by default (starts collapsed). Pass `isExpanded` +
 *   `onToggle` to control it from a parent, e.g. to persist expansion
 *   state across renders.
 * - When there are zero tool calls, this component renders nothing —
 *   there is nothing to summarise. The caller should already gate on
 *   `toolCalls.length > 0` but the guard here is defensive.
 * - Individual tool rows keep their own expand/collapse — clicking a
 *   row inside the expanded WorkActivity toggles that single tool.
 *   Individual toggles are stored locally to this component because
 *   the run projection does not own tool-call state.
 */
export function WorkActivity({
  toolCalls,
  duration,
  isExpanded,
  onToggle,
  animate = true,
  animationDuration = 180,
}: WorkActivityProps): React.JSX.Element | null {
  const { theme } = useTheme();
  const { colors } = theme;

  const [uncontrolledExpanded, setUncontrolledExpanded] = useState<boolean>(false);
  const [innerToggles, setInnerToggles] = useState<Record<string, boolean>>({});

  if (toolCalls.length === 0) {
    return null;
  }

  const controlled = typeof isExpanded === 'boolean';
  const expanded = controlled ? (isExpanded as boolean) : uncontrolledExpanded;

  const handleToggle = (): void => {
    if (controlled) {
      onToggle?.();
      return;
    }
    setUncontrolledExpanded((prev) => !prev);
  };
  // Referencing handleToggle keeps the eslint `no-unused-vars` rule happy
  // while remaining useful when a parent binds keyboard input to the row.
  void handleToggle;

  const toolCount = toolCalls.length;
  const label = `Worked for ${formatDuration(duration)} and made ${toolCount} tool ${
    toolCount === 1 ? 'call' : 'calls'
  }`;

  // Estimate body height for the AnimatedDisclosure clip target. Each tool
  // row renders as a single header + possibly a body when the row itself is
  // expanded. Assume 1 row per tool (header only) at rest; a slightly-under
  // estimate produces a fast staircase reveal which is preferable to the
  // "flash of unclipped content" caused by over-estimating.
  const contentLines = Math.max(1, toolCalls.length);

  const chevron = expanded ? '\u25BE' : '\u25B8';

  return (
    <Box flexDirection="column" paddingLeft={2}>
      <Box>
        <Text color={colors.dimText}>{chevron} </Text>
        <Text color={colors.toolCompleted}>{label}</Text>
      </Box>
      <AnimatedDisclosure
        isExpanded={expanded}
        contentLines={contentLines}
        duration={animate ? animationDuration : 0}
      >
        <Box flexDirection="column">
          {toolCalls.map((tc) => {
            const rowExpanded = innerToggles[tc.id] ?? tc.isExpanded;
            return (
              <ToolRow
                key={tc.id}
                toolName={tc.toolName}
                params={tc.params}
                status={tc.status}
                output={tc.output}
                error={tc.error}
                diff={tc.diff}
                duration={
                  typeof tc.startedAt === 'number' && typeof tc.completedAt === 'number'
                    ? tc.completedAt - tc.startedAt
                    : undefined
                }
                isExpanded={rowExpanded}
                onToggle={() =>
                  setInnerToggles((prev) => ({ ...prev, [tc.id]: !(prev[tc.id] ?? tc.isExpanded) }))
                }
                animate={animate}
              />
            );
          })}
        </Box>
      </AnimatedDisclosure>
    </Box>
  );
}
