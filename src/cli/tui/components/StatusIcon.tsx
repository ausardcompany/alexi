import React from 'react';
import { Text } from 'ink';
import InkSpinner from 'ink-spinner';

import { useTheme } from '../context/ThemeContext.js';
import type { ThemeColors } from '../theme/types.js';
import type { WorktreeStatus } from '../../../agent/worktreeStatus.js';

/**
 * Static icon glyphs used for every worktree status EXCEPT `running`.
 * `running` gets an animated `<InkSpinner>` because a static spinner
 * character would be indistinguishable from `idle` when the terminal
 * lacks animation support — the spinner conveys "actively working".
 *
 * Kept as a top-level constant so `StatusIcon` and its consumers can
 * assert against the mapping in tests without going through render
 * output.
 */
export const STATIC_STATUS_ICONS: Record<Exclude<WorktreeStatus, 'running'>, string> = {
  idle: '\u2713', // ✓ checkmark
  error: '\u2717', // ✗ cross
  blocked: '\u23F8', // ⏸ pause
  unknown: '?',
};

/**
 * Resolve the semantic color for a status. Uses theme colors rather
 * than raw hex so the mapping tracks light/dark themes automatically.
 *
 * `blocked` uses `dimText` (gray) rather than a semantic color because
 * "waiting on user input" is neither success nor failure — the neutral
 * tone matches Kilocode's #14487 mock where blocked worktrees fade
 * against active ones.
 */
export function statusColor(status: WorktreeStatus, colors: ThemeColors): string {
  switch (status) {
    case 'running':
      return colors.warning;
    case 'idle':
      return colors.success;
    case 'error':
      return colors.error;
    case 'blocked':
      return colors.dimText;
    case 'unknown':
      return colors.dimText;
    default: {
      // Exhaustiveness guard: a new status added to the union without
      // updating this switch will fail compilation via `never`.
      const _exhaustive: never = status;
      void _exhaustive;
      return colors.dimText;
    }
  }
}

export interface StatusIconProps {
  /** Lifecycle status to render. */
  status: WorktreeStatus;
  /**
   * When true (the default), the `running` status renders an animated
   * ink-spinner. Set `false` in snapshot tests or terminals that
   * misbehave with animation frames — a static `\u25D0` (◐) is used
   * instead so the layout stays stable.
   */
  animate?: boolean;
  /**
   * Optional color override. When omitted, the theme-derived
   * {@link statusColor} is used. Provided for consumers that want to
   * dim inactive worktrees regardless of status.
   */
  color?: string;
}

/**
 * StatusIcon — single-glyph indicator for an Agent Manager worktree.
 *
 * Rendered inline (no wrapping <Box>) so callers can compose it with a
 * label on the same row: `<StatusIcon status={s} /><Text> {label}</Text>`.
 * A trailing space is intentionally NOT emitted here — the caller
 * controls spacing, which keeps the component reusable in dense
 * layouts (e.g. matrix summaries) where spacing is variable.
 *
 * The `running` state uses ink-spinner (`type: 'dots'`) which cycles
 * roughly every 80ms. When `animate={false}` we fall back to a static
 * half-filled circle so the layout stays stable in tests. The choice
 * of `◐` matches the mock in issue #1826 and Kilocode #14487.
 */
export function StatusIcon({ status, animate = true, color }: StatusIconProps): React.JSX.Element {
  const {
    theme: { colors },
  } = useTheme();
  const resolvedColor = color ?? statusColor(status, colors);

  if (status === 'running') {
    return (
      <Text color={resolvedColor}>
        {animate ? <InkSpinner type="dots" /> : '\u25D0'}
      </Text>
    );
  }

  return <Text color={resolvedColor}>{STATIC_STATUS_ICONS[status]}</Text>;
}
