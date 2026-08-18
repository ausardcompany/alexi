import React from 'react';
import { Box, Text } from 'ink';

import { useTheme } from '../context/ThemeContext.js';
import { AnimatedDisclosure } from './AnimatedDisclosure.js';
import { DiffView } from './DiffView.js';
import { Spinner } from './Spinner.js';
import type { DiffData } from '../context/ChatContext.js';
import {
  formatBashCommand,
  formatDuration,
  formatParamsPreview,
  truncateOutput,
} from '../utils/formatToolOutput.js';

export type ToolStatus = 'pending' | 'running' | 'completed' | 'failed';

export interface ToolRowProps {
  toolName: string;
  params: Record<string, unknown>;
  status: ToolStatus;
  output: string | null;
  error: string | null;
  isExpanded: boolean;
  onToggle: () => void;
  diff: DiffData | null;
  /** Duration in ms (set on completion) */
  duration?: number;
  /**
   * Enable animated expand/collapse for the body. Defaults to `true`.
   * Set to `false` in tests or environments where a synchronous snap is
   * preferable (screen readers, CI snapshots, low-power terminals).
   */
  animate?: boolean;
  /**
   * Called with `true` when the disclosure animation starts and `false`
   * when it settles. Parents can use this to gate keyboard input during
   * the transition so a second toggle does not race the animation.
   */
  onAnimatingChange?: (isAnimating: boolean) => void;
}

/**
 * Estimate the number of terminal rows the tool body will occupy.
 * The AnimatedDisclosure component needs a target row count up-front
 * because Ink's `useBoxMetrics` cannot report a natural (unclipped)
 * height from inside its own clipping Box. This estimate is conservative:
 * over-estimating produces a slightly longer animation, under-estimating
 * clips the last row briefly — both are visually acceptable.
 */
function estimateBodyLines(args: {
  toolName: string;
  params: Record<string, unknown>;
  output: string | null;
  error: string | null;
  diff: DiffData | null;
}): number {
  const { toolName, output, error, diff } = args;
  if (error !== null) {
    return Math.max(1, error.split('\n').length);
  }
  if (diff !== null) {
    // 1 header row for the file path + one row per hunk header + one row
    // per line in the hunk. Callers rarely exceed 30 rows before
    // truncation kicks in downstream.
    let rows = 1;
    for (const hunk of diff.hunks) {
      rows += 1 + hunk.lines.length;
    }
    return Math.max(1, rows);
  }
  if (output !== null) {
    const lineCount = output.split('\n').length;
    // bash prefixes with a `$ command` row; add 1. Truncated output adds
    // a "... (N more lines)" hint; add 1 defensively.
    const overhead = toolName === 'bash' ? 2 : 1;
    return Math.max(1, Math.min(lineCount, 20) + overhead);
  }
  return 1;
}

/** Tool-specific icons */
const TOOL_ICONS: Record<string, string> = {
  read: '\u{1F4C4}',
  write: '\u270F\uFE0F',
  edit: '\u270F\uFE0F',
  grep: '\u{1F50D}',
  glob: '\u{1F50D}',
  bash: '\u26A1',
  fetch: '\u{1F310}',
};

/**
 * ToolRow — a single tool call rendered as one row (header) with an
 * optional expanded body underneath.
 *
 * Behaviour:
 * - Row header shows a status icon, tool icon, tool name, params preview,
 *   and status label. Header color follows the tool's status.
 * - Body renders only when `isExpanded` is true OR the tool has failed
 *   (failures auto-expand so users see errors without having to interact).
 * - Bash commands render with a terminal-style `$ command` prefix.
 * - Edit diffs render through `DiffView` (which applies syntax
 *   highlighting when a language can be inferred from the file path).
 *
 * `onToggle` is invoked when the user interacts with the row (via the
 * keyboard handler in the parent). This component itself does not bind
 * input — that stays with the parent to keep the render tree pure.
 */
export function ToolRow({
  toolName,
  params,
  status,
  output,
  error,
  isExpanded,
  onToggle,
  diff,
  duration,
  animate = true,
  onAnimatingChange,
}: ToolRowProps): React.JSX.Element {
  void onToggle;
  const { theme } = useTheme();
  const { colors } = theme;

  const paramsPreview = formatParamsPreview(params);
  const icon = TOOL_ICONS[toolName] ?? '\u{1F527}';

  const shouldShow = isExpanded || status === 'failed';
  const contentLines = estimateBodyLines({ toolName, params, output, error, diff });

  const statusColor: string =
    status === 'running'
      ? colors.toolRunning
      : status === 'failed'
        ? colors.toolFailed
        : status === 'completed'
          ? colors.toolCompleted
          : colors.dimText;

  const renderStatusIcon = (): React.JSX.Element => {
    if (status === 'pending') {
      return <Text color={colors.dimText}>{'\u25CB '}</Text>;
    }
    if (status === 'running') {
      return <Spinner />;
    }
    if (status === 'completed') {
      return <Text color={colors.success}>{'\u2713 '}</Text>;
    }
    return <Text color={colors.toolFailed}>{'\u2717 '}</Text>;
  };

  const renderStatusLabel = (): React.JSX.Element => {
    if (status === 'pending') {
      return <Text color={colors.dimText}> pending</Text>;
    }
    if (status === 'running') {
      return <Text color={colors.toolRunning}>{' running\u2026'}</Text>;
    }
    if (status === 'completed') {
      const dur = duration !== undefined ? ` ${formatDuration(duration)}` : '';
      return <Text color={colors.toolCompleted}> done{dur}</Text>;
    }
    return <Text color={colors.toolFailed}> failed</Text>;
  };

  const renderBodyContent = (): React.JSX.Element | null => {
    if (error !== null) {
      return <Text color={colors.error}>{error}</Text>;
    }
    if (diff !== null) {
      return <DiffView filePath={diff.filePath} hunks={diff.hunks} />;
    }
    if (toolName === 'bash' && output !== null) {
      const command = typeof params.command === 'string' ? params.command : '';
      const commandLine = formatBashCommand(command);
      const { text: truncatedText, truncated, remaining } = truncateOutput(output);
      return (
        <Box flexDirection="column">
          <Text color={colors.toolOutput}>
            <Text bold>{commandLine}</Text>
            {'\n'}
            {truncatedText}
          </Text>
          {truncated ? <Text color={colors.dimText}>... ({remaining} more lines)</Text> : null}
        </Box>
      );
    }
    if (output !== null) {
      const { text: truncatedText, truncated, remaining } = truncateOutput(output);
      return (
        <Box flexDirection="column">
          <Text color={colors.toolOutput}>{truncatedText}</Text>
          {truncated ? <Text color={colors.dimText}>... ({remaining} more lines)</Text> : null}
        </Box>
      );
    }
    return null;
  };

  const renderBody = (): React.JSX.Element | null => {
    const bodyContent = renderBodyContent();
    if (bodyContent === null) {
      return null;
    }
    const wrapped = (
      <Box
        borderLeft
        borderStyle="single"
        borderColor={colors.borderDim}
        paddingLeft={1}
        borderTop={false}
        borderRight={false}
        borderBottom={false}
      >
        {bodyContent}
      </Box>
    );
    return (
      <AnimatedDisclosure
        isExpanded={shouldShow}
        contentLines={contentLines}
        duration={animate ? 120 : 0}
        onAnimatingChange={onAnimatingChange}
      >
        {wrapped}
      </AnimatedDisclosure>
    );
  };

  return (
    <Box flexDirection="column" paddingLeft={2}>
      <Box>
        {renderStatusIcon()}
        <Text>{icon} </Text>
        <Text color={statusColor} bold>
          {toolName}
        </Text>
        {paramsPreview && <Text color={colors.dimText}> {paramsPreview}</Text>}
        {renderStatusLabel()}
      </Box>
      {renderBody()}
    </Box>
  );
}
