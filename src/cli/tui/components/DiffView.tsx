import React from 'react';
import { Box, Text } from 'ink';
import { highlight } from 'cli-highlight';

import { useTheme } from '../context/ThemeContext.js';
import type { DiffHunk, DiffLine } from '../context/ChatContext.js';
import { guessLanguageFromPath } from '../utils/formatToolOutput.js';

export interface DiffViewProps {
  filePath: string;
  hunks: DiffHunk[];
}

const MAX_VISIBLE_LINES = 10;

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

function padNum(num: number | undefined, width: number): string {
  if (num === undefined) {
    return ' '.repeat(width);
  }
  return String(num).padStart(width, ' ');
}

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
 * Count additions and deletions across all hunks.
 */
function countChanges(hunks: DiffHunk[]): { additions: number; deletions: number } {
  let additions = 0;
  let deletions = 0;
  for (const hunk of hunks) {
    for (const line of hunk.lines) {
      if (line.type === 'add') {
        additions++;
      } else if (line.type === 'remove') {
        deletions++;
      }
    }
  }
  return { additions, deletions };
}

/**
 * DiffView — renders a file diff with upstream-matched styling:
 * - Background highlighting per line (diffAddBg/diffRemoveBg)
 * - +N/-M summary in header
 * - diffLineNumber color for gutter
 * - Collapsible long diffs (first 10 lines + "N more")
 */
/**
 * Best-effort syntax highlight of a single line. Falls back to the raw
 * text on any highlighter failure (unknown language, illegal input, …)
 * so a broken highlighter never breaks the diff render.
 */
function highlightLine(content: string, language: string | undefined): string {
  if (!language || content.length === 0) {
    return content;
  }
  try {
    return highlight(content, { language, ignoreIllegals: true });
  } catch {
    return content;
  }
}

export function DiffView({ filePath, hunks }: DiffViewProps): React.JSX.Element {
  const { theme } = useTheme();
  const { colors } = theme;

  const gutterWidth = computeGutterWidth(hunks);
  const { additions, deletions } = countChanges(hunks);
  const language = guessLanguageFromPath(filePath);

  return (
    <Box flexDirection="column">
      {/* File header with +N/-M summary */}
      <Box>
        <Text color={colors.dimText}>─── {filePath} ───</Text>
        <Text color={colors.success}> +{additions}</Text>
        <Text color={colors.error}>/-{deletions}</Text>
      </Box>

      {hunks.length === 0
        ? null
        : hunks.map((hunk, hunkIdx) => {
            let oldNum = hunk.oldStart;
            let newNum = hunk.newStart;

            const hunkHeader = `@@ -${hunk.oldStart},${hunk.oldLines} +${hunk.newStart},${hunk.newLines} @@`;

            // Check if we need to collapse long hunks
            const totalLines = hunk.lines.length;
            const shouldCollapse = totalLines > MAX_VISIBLE_LINES;
            const visibleLines = shouldCollapse
              ? hunk.lines.slice(0, MAX_VISIBLE_LINES)
              : hunk.lines;
            const hiddenCount = shouldCollapse ? totalLines - MAX_VISIBLE_LINES : 0;

            return (
              <Box key={hunkIdx} flexDirection="column" marginTop={hunkIdx > 0 ? 1 : 0}>
                <Text color={colors.dimText}>{hunkHeader}</Text>

                {visibleLines.map((line, lineIdx) => {
                  let leftNum: number | undefined;
                  let rightNum: number | undefined;
                  let lineColor: string;
                  let bgColor: string | undefined;

                  if (line.type === 'remove') {
                    leftNum = oldNum;
                    rightNum = undefined;
                    lineColor = colors.diffRemove;
                    bgColor = colors.diffRemoveBg;
                    oldNum++;
                  } else if (line.type === 'add') {
                    leftNum = undefined;
                    rightNum = newNum;
                    lineColor = colors.diffAdd;
                    bgColor = colors.diffAddBg;
                    newNum++;
                  } else {
                    leftNum = oldNum;
                    rightNum = newNum;
                    lineColor = colors.diffContext;
                    bgColor = undefined;
                    oldNum++;
                    newNum++;
                  }

                  const gutter = `${padNum(leftNum, gutterWidth)} ${padNum(rightNum, gutterWidth)}`;

                  const highlighted = highlightLine(line.content, language);

                  return (
                    <Box key={lineIdx}>
                      <Text color={colors.diffLineNumber}>{gutter} </Text>
                      <Text color={lineColor} backgroundColor={bgColor}>
                        {linePrefix(line.type)}
                        {highlighted}
                      </Text>
                    </Box>
                  );
                })}

                {shouldCollapse && (
                  <Text color={colors.dimText}> ... ({hiddenCount} more lines)</Text>
                )}
              </Box>
            );
          })}
    </Box>
  );
}
