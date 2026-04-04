import React from 'react';
import { Box } from 'ink';

import { useTheme } from '../context/ThemeContext.js';

export interface SplitPaneProps {
  /** Main content (left/primary pane) */
  main: React.ReactNode;
  /** Side panel content (right pane — e.g., sidebar) */
  side: React.ReactNode;
  /** Side panel width (percentage string or number of columns). Default: '25%' */
  sideWidth?: string | number;
  /** Whether the side panel is visible. Default: false */
  sideVisible?: boolean;
}

/**
 * SplitPane — horizontal split layout with collapsible RIGHT side panel.
 * Matches upstream OpenCode layout: main content LEFT, sidebar RIGHT.
 */
export function SplitPane({
  main,
  side,
  sideWidth = '25%',
  sideVisible = false,
}: SplitPaneProps): React.JSX.Element {
  const { theme } = useTheme();
  const { colors } = theme;

  if (!sideVisible) {
    return (
      <Box flexDirection="row" flexGrow={1} backgroundColor={colors.background}>
        {main}
      </Box>
    );
  }

  return (
    <Box flexDirection="row" flexGrow={1} backgroundColor={colors.background}>
      {/* Main content (left) — fills remaining space */}
      <Box flexGrow={1} overflowY="hidden">
        {main}
      </Box>

      {/* Side panel (right) — fixed width with left border */}
      <Box
        width={sideWidth}
        flexShrink={0}
        borderLeft
        borderStyle="single"
        borderColor={colors.sidebarBorder}
        borderTop={false}
        borderBottom={false}
        borderRight={false}
        overflowY="hidden"
        backgroundColor={colors.sidebarBg}
      >
        {side}
      </Box>
    </Box>
  );
}
