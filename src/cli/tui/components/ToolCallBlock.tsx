import React from 'react';

import { ToolRow, type ToolRowProps } from './ToolRow.js';

export type ToolCallBlockProps = ToolRowProps;

/**
 * ToolCallBlock — thin wrapper around {@link ToolRow}.
 *
 * Historically this component owned the entire rendering logic for a
 * tool call. It now delegates to `ToolRow` so that the row-level
 * concerns (disclosure state, status colors, terminal-style command
 * output, syntax-highlighted diffs) live in one place and can be reused
 * by consumers that want per-call rendering.
 *
 * The public prop shape is preserved so existing callers (MessageArea
 * and its tests) do not need to change.
 */
export function ToolCallBlock(props: ToolCallBlockProps): React.JSX.Element {
  return <ToolRow {...props} />;
}
