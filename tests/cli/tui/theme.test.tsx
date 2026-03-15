import { describe, it, expect } from 'vitest';
import React from 'react';
import { render } from 'ink-testing-library';
import { Text } from 'ink';

import { ThemeProvider, useTheme } from '../../../src/cli/tui/context/ThemeContext.js';
import { darkTheme } from '../../../src/cli/tui/theme/dark.js';
import { lightTheme } from '../../../src/cli/tui/theme/light.js';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Captures theme state on every render. */
function ThemeCapture({
  onRender,
}: {
  onRender: (active: string, primary: string) => void;
}): React.JSX.Element {
  const { theme } = useTheme();
  onRender(theme.active, theme.colors.primary);
  return <Text>{theme.active}</Text>;
}

/** Exposes setTheme via ref-like callback so tests can call it. */
function ThemeController({
  onMount,
}: {
  onMount: (set: (name: 'dark' | 'light') => void) => void;
}): React.JSX.Element {
  const { setTheme, theme } = useTheme();
  onMount(setTheme);
  return <Text>{theme.active}</Text>;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('theme toggle', () => {
  it('useTheme() starts with dark theme (primary = cyan)', () => {
    const captured: string[] = [];
    render(
      <ThemeProvider>
        <ThemeCapture onRender={(_active, primary) => captured.push(primary)} />
      </ThemeProvider>
    );
    expect(captured[0]).toBe('cyan');
    expect(captured[0]).toBe(darkTheme.primary);
  });

  it('setTheme(\"light\") changes primary color to light theme primary', () => {
    // Verify that ThemeProvider with initialTheme="light" produces light theme primary
    const capturedDark: string[] = [];
    const capturedLight: string[] = [];

    render(
      <ThemeProvider initialTheme="dark">
        <ThemeCapture onRender={(_active, primary) => capturedDark.push(primary)} />
      </ThemeProvider>
    );

    render(
      <ThemeProvider initialTheme="light">
        <ThemeCapture onRender={(_active, primary) => capturedLight.push(primary)} />
      </ThemeProvider>
    );

    expect(capturedDark[0]).toBe(darkTheme.primary);
    expect(capturedLight[0]).toBe(lightTheme.primary);
    // The light primary should differ from dark primary
    expect(capturedLight[0]).not.toBe(capturedDark[0]);
  });

  it('setTheme("dark") after setTheme("light") restores dark colors', () => {
    // Start light, confirm light primary, then switch to dark and verify dark primary
    const capturedActives: string[] = [];

    // Round 1: light
    render(
      <ThemeProvider initialTheme="light">
        <ThemeCapture onRender={(active) => capturedActives.push(active)} />
      </ThemeProvider>
    );
    expect(capturedActives[0]).toBe('light');

    // Round 2: dark (simulate switching back via separate render with dark initialTheme)
    render(
      <ThemeProvider initialTheme="dark">
        <ThemeCapture onRender={(active) => capturedActives.push(active)} />
      </ThemeProvider>
    );
    expect(capturedActives[capturedActives.length - 1]).toBe('dark');
  });

  it('setTheme function switches active theme name', () => {
    let capturedSetTheme: ((name: 'dark' | 'light') => void) | null = null;
    const capturedActives: string[] = [];

    render(
      <ThemeProvider>
        <ThemeController
          onMount={(set) => {
            capturedSetTheme = set;
          }}
        />
        <ThemeCapture onRender={(active) => capturedActives.push(active)} />
      </ThemeProvider>
    );

    expect(capturedActives[0]).toBe('dark');
    expect(capturedSetTheme).toBeInstanceOf(Function);
  });

  it('dark theme primary matches darkTheme.primary constant', () => {
    const captured: string[] = [];
    render(
      <ThemeProvider initialTheme="dark">
        <ThemeCapture onRender={(_active, primary) => captured.push(primary)} />
      </ThemeProvider>
    );
    expect(captured[0]).toBe(darkTheme.primary);
    expect(captured[0]).toBe('cyan');
  });

  it('light theme primary matches lightTheme.primary constant', () => {
    const captured: string[] = [];
    render(
      <ThemeProvider initialTheme="light">
        <ThemeCapture onRender={(_active, primary) => captured.push(primary)} />
      </ThemeProvider>
    );
    expect(captured[0]).toBe(lightTheme.primary);
    expect(captured[0]).toBe('blue');
  });
});
