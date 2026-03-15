import React from 'react';
import { Box, Text } from 'ink';

import { useTheme } from '../context/ThemeContext.js';
import type { DiffHunk, DiffLine } from '../context/ChatContext.js';

export interface DiffViewProps {
  filePath: string;
  hunks: DiffHunk[];
}

/**
 * Compute the padding width required to display the largest line number
 * across all hunks. Returns at least 1.
 */
function computeGutterWidth(hunks: DiffHunk[]): number {
  let maxLineNum = 1;
  for (const hunk of hunks) {
    let oldNum = hunk.oldStart;
    let newNum = hunk.newStart;
    for (const line of hunk.lines) {
      if (line.type === 'remove') {
        maxLineNum = Math.max(maxLineNum, oldNum);
        oldNum++;
      } else if (line.type === 'add') {
        maxLineNum = Math.max(maxLineNum, newNum);
        newNum++;
      } else {
        maxLineNum = Math.max(maxLineNum, oldNum, newNum);
        oldNum++;
        newNum++;
      }
    }
  }
  return String(maxLineNum).length;
}

/**
 * Pad a number to a given width with leading spaces,
 * or return a string of spaces if the number is undefined.
 */
function padNum(num: number | undefined, width: number): string {
  if (num === undefined) {
    return ' '.repeat(width);
  }
  return String(num).padStart(width, ' ');
}

/**
 * Return the prefix character for a diff line type.
 */
function linePrefix(type: DiffLine['type']): string {
  if (type === 'add') {
    return '+';
  }
  if (type === 'remove') {
    return '-';
  }
  return ' ';
}

/**
 * DiffView — renders a file diff with colored added/removed/context lines.
 *
 * Displays a file path header, hunk headers with @@ markers, and
 * line-by-line content with a two-column line number gutter.
 */
export function DiffView({ filePath, hunks }: DiffViewProps): React.JSX.Element {
  const { theme } = useTheme();
  const { colors } = theme;

  const gutterWidth = computeGutterWidth(hunks);

  const header = `─── ${filePath} ───`;

  return (
    <Box flexDirection="column">
      {/* File path header */}
      <Text color={colors.dimText}>{header}</Text>

      {hunks.length === 0
        ? null
        : hunks.map((hunk, hunkIdx) => {
            let oldNum = hunk.oldStart;
            let newNum = hunk.newStart;

            const hunkHeader = `@@ -${hunk.oldStart},${hunk.oldLines} +${hunk.newStart},${hunk.newLines} @@`;

            return (
              <Box key={hunkIdx} flexDirection="column" marginTop={hunkIdx > 0 ? 1 : 0}>
                {/* Hunk header */}
                <Text color={colors.dimText}>{hunkHeader}</Text>

                {/* Lines */}
                {hunk.lines.map((line, lineIdx) => {
                  let leftNum: number | undefined;
                  let rightNum: number | undefined;
                  let lineColor: string;

                  if (line.type === 'remove') {
                    leftNum = oldNum;
                    rightNum = undefined;
                    lineColor = colors.diffRemove;
                    oldNum++;
                  } else if (line.type === 'add') {
                    leftNum = undefined;
                    rightNum = newNum;
                    lineColor = colors.diffAdd;
                    newNum++;
                  } else {
                    leftNum = oldNum;
                    rightNum = newNum;
                    lineColor = colors.diffContext;
                    oldNum++;
                    newNum++;
                  }

                  const gutter = `${padNum(leftNum, gutterWidth)} ${padNum(rightNum, gutterWidth)}`;

                  return (
                    <Box key={lineIdx}>
                      <Text color={colors.dimText}>{gutter} </Text>
                      <Text color={lineColor}>
                        {linePrefix(line.type)}
                        {line.content}
                      </Text>
                    </Box>
                  );
                })}
              </Box>
            );
          })}
    </Box>
  );
}
