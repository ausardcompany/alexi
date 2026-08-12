import type { ThemeColors, ThemeState } from './types.js';

export const darkTheme: ThemeColors = {
  // Core colors — OpenCode default dark theme
  primary: '#fab283',
  secondary: '#5c9cf5',
  accent: '#9d7cd8',
  background: '#212121',
  backgroundSecondary: '#252525',
  backgroundDarker: '#121212',
  border: '#4b4c5c',
  borderFocused: '#fab283',
  borderDim: '#303030',
  text: '#e0e0e0',
  dimText: '#6a6a6a',
  textEmphasized: '#e5c07b',
  bold: '#e0e0e0',

  // Semantic
  error: '#e06c75',
  success: '#7fd88f',
  warning: '#f5a742',
  info: '#56b6c2',

  // Tool-call status
  toolRunning: '#9d7cd8', // violet — active/running
  toolCompleted: '#6a6a6a', // dim — succeeded
  toolFailed: '#e06c75', // red — failed

  // Agent colors
  agents: {
    code: '#7fd88f',
    debug: '#e06c75',
    plan: '#e5c07b',
    explore: '#56b6c2',
    orchestrator: '#9d7cd8',
  },

  // Tool display
  toolHeader: '#5c9cf5',
  toolOutput: '#e0e0e0',

  // Diff colors
  diffAdd: '#478247',
  diffRemove: '#7C4444',
  diffContext: '#a0a0a0',
  diffAddBg: '#303A30',
  diffRemoveBg: '#3A3030',
  diffContextBg: '#212121',
  diffLineNumber: '#888888',
  diffAddedLineNumberBg: '#293229',
  diffRemovedLineNumberBg: '#332929',
  diffHighlightAdded: '#DAFADA',
  diffHighlightRemoved: '#FADADD',

  // Input
  prompt: '#7fd88f',
  cursor: '#e0e0e0',
  placeholder: '#6a6a6a',

  // UI chrome
  statusBarBg: '#1a1a1a',
  sidebarBg: '#1e1e1e',
  sidebarBorder: '#4b4c5c',
  scrollbar: '#4b4c5c',
  selection: '#303030',

  // Agent badge pill
  pillBg: '#303030',
  pillText: '#e0e0e0',

  // Dialog overlay
  dialogOverlay: '#121212',
};

export const darkThemeState: ThemeState = {
  active: 'dark',
  colors: darkTheme,
  borderStyle: 'single',
};
