import React from 'react';
import { Box, Text } from 'ink';

import { useTheme } from '../context/ThemeContext.js';
import { DiffView } from './DiffView.js';
import { Spinner } from './Spinner.js';
import type { DiffData } from '../context/ChatContext.js';

export interface ToolCallBlockProps {
  toolName: string;
  params: Record<string, unknown>;
  status: 'pending' | 'running' | 'completed' | 'failed';
  output: string | null;
  error: string | null;
  isExpanded: boolean;
  onToggle: () => void;
  diff: DiffData | null;
}

const MAX_PARAMS_PREVIEW_LENGTH = 60;
const MAX_OUTPUT_LINES = 20;
const TRUNCATED_OUTPUT_LINES = 15;

/**
 * Build a compact params preview string, truncated to 60 characters.
 */
function formatParamsPreview(params: Record<string, unknown>): string {
  const raw = JSON.stringify(params);
  if (raw.length > MAX_PARAMS_PREVIEW_LENGTH) {
    return raw.slice(0, MAX_PARAMS_PREVIEW_LENGTH) + '\u2026';
  }
  return raw;
}

/**
 * Truncate output text to the first 15 lines if it exceeds 20 lines,
 * appending a count of remaining lines.
 */
function truncateOutput(text: string): { text: string; truncated: boolean; remaining: number } {
  const lines = text.split('\n');
  if (lines.length > MAX_OUTPUT_LINES) {
    const remaining = lines.length - TRUNCATED_OUTPUT_LINES;
    return {
      text: lines.slice(0, TRUNCATED_OUTPUT_LINES).join('\n'),
      truncated: true,
      remaining,
    };
  }
  return { text, truncated: false, remaining: 0 };
}

/**
 * ToolCallBlock — renders a collapsible tool call with status indicator,
 * parameters preview, output, and optional diff view.
 */
export function ToolCallBlock({
  toolName,
  params,
  status,
  output,
  error,
  isExpanded,
  onToggle,
  diff,
}: ToolCallBlockProps): React.JSX.Element {
  // onToggle is available for future interactive expansion (e.g. click/key binding)
  void onToggle;
  const { theme } = useTheme();
  const { colors } = theme;

  const paramsPreview = formatParamsPreview(params);

  // --- Header ---
  const renderStatusIcon = (): React.JSX.Element => {
    if (status === 'pending') {
      return <Text color={colors.dimText}>○ </Text>;
    }
    if (status === 'running') {
      return <Spinner />;
    }
    if (status === 'completed') {
      return <Text color={colors.success}>✓ </Text>;
    }
    // failed
    return <Text color={colors.error}>✗ </Text>;
  };

  const renderStatusLabel = (): React.JSX.Element => {
    if (status === 'pending') {
      return <Text color={colors.dimText}> pending</Text>;
    }
    if (status === 'running') {
      return <Text color={colors.warning}> running…</Text>;
    }
    if (status === 'completed') {
      return <Text color={colors.dimText}> done</Text>;
    }
    // failed
    return <Text color={colors.error}> failed</Text>;
  };

  // --- Body ---
  const renderBody = (): React.JSX.Element | null => {
    if (!isExpanded) {
      return null;
    }

    let bodyContent: React.JSX.Element | null = null;

    if (error !== null) {
      bodyContent = <Text color={colors.error}>{error}</Text>;
    } else if (diff !== null) {
      bodyContent = <DiffView filePath={diff.filePath} hunks={diff.hunks} />;
    } else if (toolName === 'bash' && output !== null) {
      const command = typeof params.command === 'string' ? params.command : '';
      const { text: truncatedText, truncated, remaining } = truncateOutput(output);

      bodyContent = (
        <Box flexDirection="column">
          <Text color={colors.toolOutput}>
            <Text bold>$ {command}</Text>
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
        borderColor={colors.dimText}
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
      {/* Header line */}
      <Box>
        {renderStatusIcon()}
        <Text color={colors.toolHeader} bold>
          {toolName}
        </Text>
        <Text color={colors.dimText}> ({paramsPreview})</Text>
        {renderStatusLabel()}
      </Box>

      {/* Body */}
      {renderBody()}
    </Box>
  );
}
