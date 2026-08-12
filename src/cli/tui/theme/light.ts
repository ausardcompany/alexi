import type { ThemeColors, ThemeState } from './types.js';

export const lightTheme: ThemeColors = {
  // Core colors — OpenCode default light theme
  primary: '#3b7dd8',
  secondary: '#7b5bb6',
  accent: '#d68c27',
  background: '#f8f8f8',
  backgroundSecondary: '#f0f0f0',
  backgroundDarker: '#ffffff',
  border: '#d3d3d3',
  borderFocused: '#3b7dd8',
  borderDim: '#e5e5e6',
  text: '#2a2a2a',
  dimText: '#8a8a8a',
  textEmphasized: '#b0851f',
  bold: '#2a2a2a',

  // Semantic
  error: '#d1383d',
  success: '#3d9a57',
  warning: '#d68c27',
  info: '#318795',

  // Tool-call status
  toolRunning: '#7b5bb6', // violet — active/running
  toolCompleted: '#8a8a8a', // dim — succeeded
  toolFailed: '#d1383d', // red — failed

  // Agent colors
  agents: {
    code: '#3d9a57',
    debug: '#d1383d',
    plan: '#b0851f',
    explore: '#318795',
    orchestrator: '#7b5bb6',
  },

  // Tool display
  toolHeader: '#3b7dd8',
  toolOutput: '#2a2a2a',

  // Diff colors
  diffAdd: '#2E7D32',
  diffRemove: '#C62828',
  diffContext: '#757575',
  diffAddBg: '#E8F5E9',
  diffRemoveBg: '#FFEBEE',
  diffContextBg: '#F5F5F5',
  diffLineNumber: '#9E9E9E',
  diffAddedLineNumberBg: '#C8E6C9',
  diffRemovedLineNumberBg: '#FFCDD2',
  diffHighlightAdded: '#A5D6A7',
  diffHighlightRemoved: '#EF9A9A',

  // Input
  prompt: '#3d9a57',
  cursor: '#2a2a2a',
  placeholder: '#8a8a8a',

  // UI chrome
  statusBarBg: '#eeeeee',
  sidebarBg: '#f0f0f0',
  sidebarBorder: '#d3d3d3',
  scrollbar: '#d3d3d3',
  selection: '#e5e5e6',

  // Agent badge pill
  pillBg: '#e5e5e6',
  pillText: '#2a2a2a',

  // Dialog overlay
  dialogOverlay: '#ffffff',
};

export const lightThemeState: ThemeState = {
  active: 'light',
  colors: lightTheme,
  borderStyle: 'single',
};
