import { createContext, useContext, useState, useCallback } from 'react';

import { darkThemeState } from '../theme/dark.js';
import { lightThemeState } from '../theme/light.js';
import type { ThemeState } from '../theme/types.js';

export interface ThemeContextValue {
  theme: ThemeState;
  toggleTheme: () => void;
  setTheme: (name: 'dark' | 'light') => void;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);

interface ThemeProviderProps {
  children: React.ReactNode;
  initialTheme?: 'dark' | 'light';
}

export function ThemeProvider({ children, initialTheme = 'dark' }: ThemeProviderProps) {
  const [currentName, setCurrentName] = useState<'dark' | 'light'>(initialTheme);
  const [theme, setThemeState] = useState<ThemeState>(
    initialTheme === 'dark' ? darkThemeState : lightThemeState
  );

  const toggleTheme = useCallback(() => {
    setCurrentName((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      setThemeState(next === 'dark' ? darkThemeState : lightThemeState);
      return next;
    });
  }, []);

  const setTheme = useCallback((name: 'dark' | 'light') => {
    setCurrentName(name);
    setThemeState(name === 'dark' ? darkThemeState : lightThemeState);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (ctx === null) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return ctx;
}
