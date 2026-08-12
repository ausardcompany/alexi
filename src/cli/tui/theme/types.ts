export type AgentName = 'code' | 'debug' | 'plan' | 'explore' | 'orchestrator';

export interface ThemeColors {
  // Core colors
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  backgroundSecondary: string;
  backgroundDarker: string;
  border: string;
  borderFocused: string;
  borderDim: string;
  text: string;
  dimText: string;
  textEmphasized: string;
  bold: string;

  // Semantic colors
  error: string;
  success: string;
  warning: string;
  info: string;

  // Tool-call status colors (drive per-row styling in ToolRow)
  toolRunning: string;
  toolCompleted: string;
  toolFailed: string;

  // Agent colors
  agents: Record<AgentName, string>;

  // Tool display
  toolHeader: string;
  toolOutput: string;

  // Diff colors
  diffAdd: string;
  diffRemove: string;
  diffContext: string;
  diffAddBg: string;
  diffRemoveBg: string;
  diffContextBg: string;
  diffLineNumber: string;
  diffAddedLineNumberBg: string;
  diffRemovedLineNumberBg: string;
  diffHighlightAdded: string;
  diffHighlightRemoved: string;

  // Input
  prompt: string;
  cursor: string;
  placeholder: string;

  // UI chrome
  statusBarBg: string;
  sidebarBg: string;
  sidebarBorder: string;
  scrollbar: string;
  selection: string;

  // Agent badge pill
  pillBg: string;
  pillText: string;

  // Dialog overlay
  dialogOverlay: string;
}

export interface ThemeState {
  active: 'dark' | 'light';
  colors: ThemeColors;
  borderStyle: 'single' | 'round' | 'double' | 'bold';
}
