import type { ThemeColors, ThemeState } from './types.js';

export const lightTheme: ThemeColors = {
  primary: 'blue',
  secondary: 'cyan',
  background: '#ffffff',
  border: 'gray',
  borderFocused: 'blue',
  text: 'black',
  dimText: '#555555',
  bold: 'black',
  error: 'red',
  success: 'green',
  warning: '#cc8800',
  info: 'blue',
  agents: {
    code: 'green',
    debug: 'red',
    plan: '#cc8800',
    explore: 'blue',
    orchestrator: 'magenta',
  },
  toolHeader: 'blue',
  toolOutput: 'black',
  diffAdd: 'green',
  diffRemove: 'red',
  diffContext: 'gray',
  prompt: 'green',
  cursor: 'black',
  placeholder: 'gray',
};

export const lightThemeState: ThemeState = {
  active: 'light',
  colors: lightTheme,
  borderStyle: 'round',
};
