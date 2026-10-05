import React from 'react';
import { Box, Text } from 'ink';

import { useTheme } from '../context/ThemeContext.js';

export interface SubagentViewProps {
  /**
   * The subagent's identifier (session id or display name). Rendered
   * in the header so the user can tell which delegate is active when
   * multiple subagents run back-to-back.
   */
  subagentId: string;
  /**
   * The latest text produced by the subagent. Rendered verbatim with
   * wrap="wrap" — a richer rendering can be layered in later; keeping
   * the primitive simple keeps the smoke tests fast.
   */
  output: string;
  /**
   * The current steering prompt, if any. Non-null here means the user
   * has injected a mid-execution instruction that should be visible
   * above the subagent's own output.
   */
  steeringPrompt: string | null;
  /**
   * ISO timestamp of the last steering post. Shown as a dim meta line
   * so the user knows how recent the guidance is. `null` when no
   * steering has fired in this subagent run.
   */
  steeringDeliveredAt?: string | null;
}

/**
 * SubagentView — renders a running subagent with its own border and
 * optional steering overlay.
 *
 * The border uses `colors.info` (cyan/blue in both built-in themes) to
 * distinguish subagent output from the parent agent's message bubbles,
 * which use the standard background panel without a border.
 *
 * When `steeringPrompt` is set, a stacked panel is rendered above the
 * output. The panel has its own warning-coloured border so the eye is
 * drawn to the active guidance; a "Steering active" badge sits in the
 * header for terminals too narrow for the full prompt.
 *
 * Ports upstream kilocode #14702 (subagent steering) — the component
 * is intentionally minimal: future work can swap `output` for a full
 * MessageArea instance once subagent streaming is wired through to the
 * TUI event bus.
 */
export function SubagentView({
  subagentId,
  output,
  steeringPrompt,
  steeringDeliveredAt,
}: SubagentViewProps): React.JSX.Element {
  const { theme } = useTheme();
  const { colors } = theme;

  const hasSteering = steeringPrompt !== null && steeringPrompt.trim().length > 0;
  const deliveredLabel =
    hasSteering && steeringDeliveredAt
      ? new Date(steeringDeliveredAt).toLocaleTimeString(undefined, {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      : null;

  return (
    <Box flexDirection="column">
      {hasSteering && (
        <Box
          flexDirection="column"
          borderStyle="round"
          borderColor={colors.warning}
          paddingX={1}
          marginBottom={1}
        >
          <Box>
            <Text color={colors.warning} bold>
              Steering active
            </Text>
            {deliveredLabel && (
              <Text color={colors.dimText}>
                {'  '}
                {deliveredLabel}
              </Text>
            )}
          </Box>
          <Text color={colors.text} wrap="wrap">
            {steeringPrompt}
          </Text>
        </Box>
      )}

      <Box flexDirection="column" borderStyle="round" borderColor={colors.info} paddingX={1}>
        <Box>
          <Text color={colors.info} bold>
            subagent
          </Text>
          <Text color={colors.dimText}>
            {'  '}
            {subagentId}
          </Text>
        </Box>
        <Text color={colors.text} wrap="wrap">
          {output}
        </Text>
      </Box>
    </Box>
  );
}
