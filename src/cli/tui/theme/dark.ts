import type { ThemeColors, ThemeState } from './types.js';

export const darkTheme: ThemeColors = {
  primary: 'cyan',
  secondary: 'blue',
  background: '#1a1a1a',
  border: 'gray',
  borderFocused: 'cyan',
  text: 'white',
  dimText: 'gray',
  bold: 'white',
  error: 'red',
  success: 'green',
  warning: 'yellow',
  info: 'cyan',
  agents: {
    code: 'green',
    debug: 'red',
    plan: 'yellow',
    explore: 'cyan',
    orchestrator: 'magenta',
  },
  toolHeader: 'blueBright',
  toolOutput: 'white',
  diffAdd: 'green',
  diffRemove: 'red',
  diffContext: 'gray',
  prompt: 'green',
  cursor: 'white',
  placeholder: 'gray',
};

export const darkThemeState: ThemeState = {
  active: 'dark',
  colors: darkTheme,
  borderStyle: 'round',
};
