import React from 'react';
import { Box, Text, useInput } from 'ink';

import { useTheme } from '../context/ThemeContext.js';
import type { ThemeColors } from '../theme/types.js';
import type { FileChange } from '../types/props.js';
import { formatUsageBlock, type UsageEntry } from '../utils/formatUsage.js';
import { StatusIcon } from './StatusIcon.js';
import type { WorktreeStatusEntry } from '../../../agent/worktreeStatus.js';

/**
 * Prefix rendered next to a pinned worktree in the sidebar. Kept as an
 * ASCII token rather than an emoji so the Encoding Guard workflow does
 * not have to make an exception and so terminals without emoji fonts
 * still render it legibly. See upstream kilocode PR #14891.
 */
export const PIN_INDICATOR = '[P]';

/**
 * Stable-sort the worktree list so pinned entries bubble to the top
 * while preserving relative order within each bucket. Exported so the
 * sidebar tests can exercise sort behaviour without rendering.
 *
 * The sort is intentionally NOT in-place — the input array is a
 * readonly snapshot from the registry.
 */
export function sortWorktreesPinnedFirst(
  worktrees: readonly WorktreeStatusEntry[]
): readonly WorktreeStatusEntry[] {
  if (worktrees.length < 2) {
    return worktrees;
  }
  const pinned: WorktreeStatusEntry[] = [];
  const rest: WorktreeStatusEntry[] = [];
  for (const wt of worktrees) {
    if (wt.pinned === true) {
      pinned.push(wt);
    } else {
      rest.push(wt);
    }
  }
  if (pinned.length === 0) {
    return worktrees;
  }
  return [...pinned, ...rest];
}

export interface SidebarProps {
  files: FileChange[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  onActivate: (path: string) => void;
  isFocused: boolean;
  /**
   * Optional index of the currently-selected worktree in the
   * `worktrees` array. When set, pressing `p` while the sidebar is
   * focused toggles the pin on the entry at this index. The index is
   * applied against the UNSORTED `worktrees` snapshot the caller
   * passes in so the TUI's selection cursor and the pin target stay
   * consistent regardless of pinned-first display order.
   */
  selectedWorktreeIndex?: number;
  /**
   * Pin-toggle callback. Invoked with the worktree id (from the entry
   * at `selectedWorktreeIndex`) when the user presses the pin keybind.
   * Typically wired to `toggleWorktreePin` from
   * `src/core/agent-manager/orchestration-api.ts` so the toggle is
   * persisted to `~/.alexi/agent-manager.json`.
   */
  onTogglePin?: (id: string) => void;
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
  /**
   * Optional Agent Manager worktree list. When provided (and non-empty),
   * the Sidebar renders a compact "Worktrees" section with a
   * {@link StatusIcon} next to each entry. Empty arrays and `undefined`
   * both suppress the section so tests / legacy callers see no change.
   *
   * Ports Kilocode PR #14487's status-icon panel — see issue #1826.
   */
  worktrees?: readonly WorktreeStatusEntry[];
  /**
   * When false, disable the animated spinner for `running` worktrees.
   * Defaults to true. Snapshot tests should pass `false` to keep the
   * rendered frame deterministic.
   */
  animateWorktrees?: boolean;
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
 * WorktreesSection — compact Agent Manager worktree status list.
 *
 * Rendered inside the Sidebar between the file list and the Usage
 * section. Each row is `<StatusIcon /> <label>` with the optional
 * detail string dimmed to the right. See issue #1826 / Kilocode #14487.
 */
function WorktreesSection({
  worktrees,
  colors,
  animate,
}: {
  worktrees: readonly WorktreeStatusEntry[];
  colors: ThemeColors;
  animate: boolean;
}): React.JSX.Element | null {
  if (worktrees.length === 0) {
    return null;
  }

  // Pinned entries bubble to the top. This matches upstream kilocode
  // PR #14891: pinned worktrees sit above unpinned ones in the sidebar
  // regardless of their original insertion position. The relative
  // order within each bucket is preserved so a pin toggle does not
  // reshuffle the whole list.
  const ordered = sortWorktreesPinnedFirst(worktrees);

  return (
    <Box flexDirection="column" marginTop={1}>
      <Text color={colors.text} bold>
        Worktrees ({worktrees.length})
      </Text>
      {ordered.map((wt) => (
        <Box key={wt.id}>
          <StatusIcon status={wt.status} animate={animate} />
          <Text color={colors.text} wrap="truncate-end">
            {' '}
            {wt.pinned === true ? `${PIN_INDICATOR} ` : ''}
            {wt.label}
          </Text>
          {wt.detail !== undefined && wt.detail !== '' && (
            <Text color={colors.dimText} wrap="truncate-end">
              {' '}
              {wt.detail}
            </Text>
          )}
        </Box>
      ))}
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
 *
 * When `worktrees` is provided and non-empty, renders an Agent Manager
 * worktree status panel with animated status icons — see issue #1826.
 */
export function Sidebar({
  files,
  selectedIndex,
  onSelect,
  onActivate,
  isFocused,
  usage,
  worktrees,
  animateWorktrees = true,
  selectedWorktreeIndex,
  onTogglePin,
}: SidebarProps): React.JSX.Element {
  const { theme } = useTheme();
  const { colors } = theme;

  useInput(
    (input, key) => {
      if (!isFocused) {
        return;
      }

      // Pin-toggle keybind (`p`). Fires regardless of whether there
      // are any file changes so a user with only Agent Manager
      // worktrees in the sidebar can still pin entries. The handler
      // only runs when the caller wired both an index and a callback,
      // which the TUI does when it owns the selection cursor.
      if (
        input === 'p' &&
        !key.ctrl &&
        !key.meta &&
        onTogglePin !== undefined &&
        worktrees !== undefined &&
        worktrees.length > 0 &&
        selectedWorktreeIndex !== undefined
      ) {
        const target = worktrees[selectedWorktreeIndex];
        if (target !== undefined) {
          onTogglePin(target.id);
          return;
        }
      }

      if (files.length === 0) {
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
  const hasWorktrees = worktrees !== undefined && worktrees.length > 0;
  const worktreesForRender: readonly WorktreeStatusEntry[] = worktrees ?? [];

  if (files.length === 0) {
    return (
      <Box flexDirection="column" padding={1}>
        <Text color={colors.dimText} bold>
          Files
        </Text>
        <Text color={colors.dimText}>No changes yet</Text>
        {hasWorktrees && (
          <WorktreesSection
            worktrees={worktreesForRender}
            colors={colors}
            animate={animateWorktrees}
          />
        )}
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
      {hasWorktrees && (
        <WorktreesSection
          worktrees={worktreesForRender}
          colors={colors}
          animate={animateWorktrees}
        />
      )}
      {hasUsage && <UsageSection entries={usage} colors={colors} />}
    </Box>
  );
}
