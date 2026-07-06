import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';

import { useDialog } from '../context/DialogContext.js';
import { useTheme } from '../context/ThemeContext.js';
import type { MessageDisplay } from '../components/MessageArea.js';
import { stripInternalWrappers } from '../../../agent/stripInternalWrappers.js';

export interface RewindDialogProps {
  messages: MessageDisplay[];
}

export interface RewindResult {
  turnIndex: number;
  mode: 'discard' | 'summarize';
}

interface TurnBoundary {
  index: number;
  turnNumber: number;
  firstLine: string;
  timestamp: number;
}

/**
 * Extract turn boundaries from messages — user messages serve as landmarks.
 */
function extractTurnBoundaries(messages: MessageDisplay[]): TurnBoundary[] {
  const boundaries: TurnBoundary[] = [];
  let turnNumber = 0;

  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];
    if (msg.role === 'user') {
      turnNumber++;
      const firstLine = stripInternalWrappers(msg.content).trim().split('\n')[0].slice(0, 60);
      boundaries.push({
        index: i,
        turnNumber,
        firstLine,
        timestamp: msg.timestamp,
      });
    }
  }

  return boundaries;
}

/**
 * Format a timestamp to a short time string.
 */
function formatTime(ts: number): string {
  const date = new Date(ts);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * RewindDialog — interactive turn boundary picker.
 *
 * Shows a scrollable list of turn boundaries (user messages).
 * After selecting a turn, the user chooses an action:
 * - "Discard after here" — truncate session history after the selected turn
 * - "Summarize before here" — compact everything before the selected turn
 */
export function RewindDialog({ messages }: RewindDialogProps): React.JSX.Element {
  const dialog = useDialog();
  const {
    theme: { colors },
  } = useTheme();

  const boundaries = extractTurnBoundaries(messages);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [actionMode, setActionMode] = useState(false);
  const [actionIndex, setActionIndex] = useState(0);

  const VISIBLE_ITEMS = 8;
  const scrollOffset = Math.max(0, selectedIndex - VISIBLE_ITEMS + 1);
  const visibleBoundaries = boundaries.slice(scrollOffset, scrollOffset + VISIBLE_ITEMS);

  useInput((input, key) => {
    if (key.escape) {
      if (actionMode) {
        setActionMode(false);
      } else {
        dialog.cancel();
      }
      return;
    }

    if (actionMode) {
      if (key.upArrow || input === 'k') {
        setActionIndex((prev) => Math.max(0, prev - 1));
      } else if (key.downArrow || input === 'j') {
        setActionIndex((prev) => Math.min(1, prev + 1));
      } else if (key.return) {
        const boundary = boundaries[selectedIndex];
        if (boundary) {
          const mode = actionIndex === 0 ? 'discard' : 'summarize';
          const result: RewindResult = { turnIndex: boundary.index, mode };
          dialog.close(result);
        }
      }
      return;
    }

    if (key.upArrow || input === 'k') {
      setSelectedIndex((prev) => Math.max(0, prev - 1));
    } else if (key.downArrow || input === 'j') {
      setSelectedIndex((prev) => Math.min(boundaries.length - 1, prev + 1));
    } else if (key.return) {
      if (boundaries.length > 0) {
        setActionMode(true);
        setActionIndex(0);
      }
    }
  });

  if (boundaries.length === 0) {
    return (
      <Box
        flexDirection="column"
        borderStyle="round"
        borderColor={colors.borderFocused}
        padding={1}
        width={60}
      >
        <Text color={colors.text} bold>
          Rewind / Manage Context
        </Text>
        <Box marginTop={1}>
          <Text color={colors.dimText}>No turn boundaries found.</Text>
        </Box>
        <Box marginTop={1}>
          <Text color={colors.dimText}>[Esc] Close</Text>
        </Box>
      </Box>
    );
  }

  if (actionMode) {
    const boundary = boundaries[selectedIndex];
    const actions = ['Discard after here', 'Summarize before here'];

    return (
      <Box
        flexDirection="column"
        borderStyle="round"
        borderColor={colors.borderFocused}
        padding={1}
        width={60}
      >
        <Text color={colors.text} bold>
          Rewind — Choose Action
        </Text>
        <Box marginTop={1}>
          <Text color={colors.dimText}>
            Turn {boundary?.turnNumber}: {boundary?.firstLine}
          </Text>
        </Box>
        <Box marginTop={1} flexDirection="column">
          {actions.map((action, idx) => {
            const isSelected = idx === actionIndex;
            return (
              <Box key={action}>
                <Text color={isSelected ? colors.primary : colors.dimText}>
                  {isSelected ? '▸ ' : '  '}
                  {action}
                </Text>
              </Box>
            );
          })}
        </Box>
        <Box marginTop={1}>
          <Text color={colors.dimText}>Enter: confirm · Esc: back</Text>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      flexDirection="column"
      borderStyle="round"
      borderColor={colors.borderFocused}
      padding={1}
      width={60}
    >
      <Text color={colors.text} bold>
        Rewind / Manage Context
      </Text>
      <Box marginTop={1} flexDirection="column">
        {visibleBoundaries.map((boundary, visIdx) => {
          const actualIdx = scrollOffset + visIdx;
          const isSelected = actualIdx === selectedIndex;
          return (
            <Box key={boundary.index}>
              <Text color={isSelected ? colors.primary : colors.dimText}>
                {isSelected ? '▸ ' : '  '}
              </Text>
              <Text color={isSelected ? colors.text : colors.dimText}>
                [{boundary.turnNumber}] {formatTime(boundary.timestamp)} {boundary.firstLine}
              </Text>
            </Box>
          );
        })}
      </Box>
      {boundaries.length > VISIBLE_ITEMS && (
        <Box marginTop={1}>
          <Text color={colors.dimText}>
            Showing {scrollOffset + 1}-{Math.min(scrollOffset + VISIBLE_ITEMS, boundaries.length)}{' '}
            of {boundaries.length}
          </Text>
        </Box>
      )}
      <Box marginTop={1}>
        <Text color={colors.dimText}>↑↓: navigate · Enter: select · Esc: cancel</Text>
      </Box>
    </Box>
  );
}
