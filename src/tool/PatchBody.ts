import { diffOverflowPanel } from './DiffOverflow';

// Add logic to handle large diffs:
if (diffLines.length > DIFF_MAX_LINES) {
  return diffOverflowPanel(openDiff);
}