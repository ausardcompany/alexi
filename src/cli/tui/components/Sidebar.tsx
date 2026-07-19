import React from 'react';
import { Box, Text, useInput } from 'ink';

import { useTheme } from '../context/ThemeContext.js';
import type { ThemeColors } from '../theme/types.js';
import type { FileChange } from '../types/props.js';
import { formatUsageBlock, type UsageEntry } from '../utils/formatUsage.js';

export interface SidebarProps {
  files: FileChange[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  onActivate: (path: string) => void;
  isFocused: boolean;
  /**
   * Optional per-model token/cost breakdown. When provided (even as an
   * empty array), the Sidebar renders a compact "Usage" section beneath
   * the files list matching the layout shipped in Kilocode PR #12303:
   * per-model rows (`Sonnet 3.5: 12.3K tokens, $0.45`) plus a running
   * `Total` row, column-aligned, using abbreviated units (K / M).
   *
   * When omitted, the sidebar renders files only (legacy behaviour).
   */
  usage?: UsageEntry[];
}

/** Status indicator character and color mapping */
function statusIndicator(
  status: FileChange['status'],
  colors: ThemeColors
): { char: string; color: string } {
  switch (status) {
    case 'added':
      return { char: '+', color: colors.success };
    case 'modified':
      return { char: '~', color: colors.warning };
    case 'deleted':
      return { char: '-', color: colors.error };
    default:
      return { char: ' ', color: colors.dimText };
  }
}

/**
 * UsageSection — compact per-model token/cost breakdown.
 *
 * Rendered inside the Sidebar below the file list. Uses `formatUsageBlock`
 * to produce column-aligned rows so the trailing `<tokens> tokens, <cost>`
 * segments line up regardless of model-name length.
 */
function UsageSection({
  entries,
  colors,
}: {
  entries: UsageEntry[];
  colors: ThemeColors;
}): React.JSX.Element | null {
  const rows = formatUsageBlock(entries);
  if (rows.length === 0) {
    return null;
  }
  // Last row is the running total — style it slightly stronger so users
  // can spot it immediately in a long session.
  const perModelRows = rows.slice(0, -1);
  const totalRow = rows[rows.length - 1];

  return (
    <Box flexDirection="column" marginTop={1}>
      <Text color={colors.text} bold>
        Usage
      </Text>
      {perModelRows.map((row, idx) => (
        <Text key={`usage-${idx}`} color={colors.dimText} wrap="truncate-end">
          {row}
        </Text>
      ))}
      <Text color={colors.text} wrap="truncate-end">
        {totalRow}
      </Text>
    </Box>
  );
}

/**
 * Sidebar — file changes panel showing files modified by the agent.
 *
 * Displays file paths with status indicators (+added, ~modified, -deleted).
 * Keyboard navigation: Up/Down to select, Enter to activate.
 *
 * When `usage` is provided, also renders a compact per-model
 * token/cost breakdown beneath the files list.
 */
export function Sidebar({
  files,
  selectedIndex,
  onSelect,
  onActivate,
  isFocused,
  usage,
}: SidebarProps): React.JSX.Element {
  const { theme } = useTheme();
  const { colors } = theme;

  useInput(
    (input, key) => {
      if (!isFocused || files.length === 0) {
        return;
      }

      if (key.upArrow) {
        onSelect(Math.max(0, selectedIndex - 1));
        return;
      }
      if (key.downArrow) {
        onSelect(Math.min(files.length - 1, selectedIndex + 1));
        return;
      }
      if (key.return) {
        const file = files[selectedIndex];
        if (file) {
          onActivate(file.path);
        }
        return;
      }
    },
    { isActive: isFocused }
  );

  const hasUsage = usage !== undefined && usage.length > 0;

  if (files.length === 0) {
    return (
      <Box flexDirection="column" padding={1}>
        <Text color={colors.dimText} bold>
          Files
        </Text>
        <Text color={colors.dimText}>No changes yet</Text>
        {hasUsage && <UsageSection entries={usage} colors={colors} />}
      </Box>
    );
  }

  return (
    <Box flexDirection="column" padding={1}>
      <Text color={colors.text} bold>
        Files ({files.length})
      </Text>
      {files.map((file, idx) => {
        const isSelected = idx === selectedIndex;
        const { char, color } = statusIndicator(file.status, colors);
        const bgColor = isSelected ? colors.selection : undefined;

        return (
          <Box key={file.path}>
            <Text backgroundColor={bgColor} color={color}>
              {char}{' '}
            </Text>
            <Text
              backgroundColor={bgColor}
              color={isSelected ? colors.text : colors.dimText}
              wrap="truncate-end"
            >
              {file.path}
            </Text>
            {(file.additions > 0 || file.deletions > 0) && (
              <Text backgroundColor={bgColor} color={colors.dimText}>
                {' '}
                {file.additions > 0 ? <Text color={colors.success}>+{file.additions}</Text> : null}
                {file.deletions > 0 ? <Text color={colors.error}>-{file.deletions}</Text> : null}
              </Text>
            )}
          </Box>
        );
      })}
      {hasUsage && <UsageSection entries={usage} colors={colors} />}
    </Box>
  );
}
