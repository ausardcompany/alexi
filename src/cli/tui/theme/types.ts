export type AgentName = 'code' | 'debug' | 'plan' | 'explore' | 'orchestrator';

export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  border: string;
  borderFocused: string;
  text: string;
  dimText: string;
  bold: string;
  error: string;
  success: string;
  warning: string;
  info: string;
  agents: Record<AgentName, string>;
  toolHeader: string;
  toolOutput: string;
  diffAdd: string;
  diffRemove: string;
  diffContext: string;
  prompt: string;
  cursor: string;
  placeholder: string;
}

export interface ThemeState {
  active: 'dark' | 'light';
  colors: ThemeColors;
  borderStyle: 'single' | 'round' | 'double' | 'bold';
}
