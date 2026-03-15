import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from 'ink-testing-library';

import {
  CommandPalette,
  type CommandEntry,
  type CommandPaletteProps,
} from '../../../src/cli/tui/components/CommandPalette.js';
import { DialogProvider } from '../../../src/cli/tui/context/DialogContext.js';
import { ThemeProvider } from '../../../src/cli/tui/context/ThemeContext.js';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function Wrapper({ children }: { children: React.ReactNode }): React.JSX.Element {
  return (
    <ThemeProvider>
      <DialogProvider>{children}</DialogProvider>
    </ThemeProvider>
  );
}

const defaultCommands: CommandEntry[] = [
  { name: 'clear', description: 'Clear message history', category: 'session' },
  { name: 'model', description: 'Switch the active model', category: 'config', shortcut: 'Ctrl+M' },
  { name: 'agent', description: 'Select an agent', category: 'config' },
  { name: 'exit', description: 'Exit the application', category: 'app', shortcut: 'Ctrl+C' },
];

// ---------------------------------------------------------------------------
// Type smoke-check — if CommandEntry or CommandPaletteProps are not exported
// the TypeScript compiler will fail this file before tests even run.
// ---------------------------------------------------------------------------

const _typeCheck: CommandPaletteProps = { commands: [] };
const _entryCheck: CommandEntry = {
  name: 'smoke',
  description: 'smoke check',
  category: 'test',
};
void _typeCheck;
void _entryCheck;

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('CommandPalette', () => {
  it('renders without crashing', () => {
    const { lastFrame } = render(
      <Wrapper>
        <CommandPalette commands={defaultCommands} />
      </Wrapper>
    );
    expect(lastFrame()).toBeTruthy();
  });

  it('shows the title "Command Palette"', () => {
    const { lastFrame } = render(
      <Wrapper>
        <CommandPalette commands={defaultCommands} />
      </Wrapper>
    );
    expect(lastFrame()).toContain('Command Palette');
  });

  it('shows "[Esc] Cancel" hint', () => {
    const { lastFrame } = render(
      <Wrapper>
        <CommandPalette commands={defaultCommands} />
      </Wrapper>
    );
    expect(lastFrame()).toContain('[Esc] Cancel');
  });

  it('renders command items with /${name}  ${description} format', () => {
    const { lastFrame } = render(
      <Wrapper>
        <CommandPalette commands={defaultCommands} />
      </Wrapper>
    );
    const frame = lastFrame() ?? '';
    expect(frame).toContain('/clear  Clear message history');
    expect(frame).toContain('/model  Switch the active model');
    expect(frame).toContain('/agent  Select an agent');
    expect(frame).toContain('/exit  Exit the application');
  });

  it('renders all provided commands initially (no filter)', () => {
    const { lastFrame } = render(
      <Wrapper>
        <CommandPalette commands={defaultCommands} />
      </Wrapper>
    );
    const frame = lastFrame() ?? '';
    for (const cmd of defaultCommands) {
      expect(frame).toContain(cmd.name);
      expect(frame).toContain(cmd.description);
    }
  });

  it('shows "No commands match" when commands list is empty', () => {
    const { lastFrame } = render(
      <Wrapper>
        <CommandPalette commands={[]} />
      </Wrapper>
    );
    expect(lastFrame()).toContain('No commands match');
  });

  it('exports CommandEntry and CommandPaletteProps types (smoke check via import)', () => {
    // If the types are not exported the TypeScript compilation of this file
    // will fail, acting as a compile-time test.  At runtime we simply assert
    // the component itself is a function.
    expect(typeof CommandPalette).toBe('function');
  });
});
