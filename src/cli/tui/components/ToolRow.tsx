import React from 'react';
import { Box, Text } from 'ink';

import { useTheme } from '../context/ThemeContext.js';
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
}: ToolRowProps): React.JSX.Element {
  void onToggle;
  const { theme } = useTheme();
  const { colors } = theme;

  const paramsPreview = formatParamsPreview(params);
  const icon = TOOL_ICONS[toolName] ?? '\u{1F527}';

  const shouldShow = isExpanded || status === 'failed';

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

  const renderBody = (): React.JSX.Element | null => {
    if (!shouldShow) {
      return null;
    }

    let bodyContent: React.JSX.Element | null = null;

    if (error !== null) {
      bodyContent = <Text color={colors.error}>{error}</Text>;
    } else if (diff !== null) {
      bodyContent = <DiffView filePath={diff.filePath} hunks={diff.hunks} />;
    } else if (toolName === 'bash' && output !== null) {
      const command = typeof params.command === 'string' ? params.command : '';
      const commandLine = formatBashCommand(command);
      const { text: truncatedText, truncated, remaining } = truncateOutput(output);
      bodyContent = (
        <Box flexDirection="column">
          <Text color={colors.toolOutput}>
            <Text bold>{commandLine}</Text>
            {'\n'}
            {truncatedText}
          </Text>
          {truncated ? <Text color={colors.dimText}>... ({remaining} more lines)</Text> : null}
        </Box>
      );
    } else if (output !== null) {
      const { text: truncatedText, truncated, remaining } = truncateOutput(output);
      bodyContent = (
        <Box flexDirection="column">
          <Text color={colors.toolOutput}>{truncatedText}</Text>
          {truncated ? <Text color={colors.dimText}>... ({remaining} more lines)</Text> : null}
        </Box>
      );
    }

    if (bodyContent === null) {
      return null;
    }

    return (
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
