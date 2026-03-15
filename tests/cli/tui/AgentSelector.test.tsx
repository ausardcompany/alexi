import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from 'ink-testing-library';

import { AgentSelector } from '../../../src/cli/tui/dialogs/AgentSelector.js';
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

const defaultAgents = [
  { name: 'code', color: 'green', description: 'General coding assistant' },
  { name: 'debug', color: 'red', description: 'Debugging and error analysis' },
  { name: 'plan', color: 'blue', description: 'Planning and architecture' },
  { name: 'explore', color: 'cyan', description: 'Code exploration and reading' },
];

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('AgentSelector', () => {
  it('renders without crashing', () => {
    const { lastFrame } = render(
      <Wrapper>
        <AgentSelector currentAgent="code" agents={defaultAgents} />
      </Wrapper>
    );
    expect(lastFrame()).toBeTruthy();
  });

  it('shows the title "Agent Selector"', () => {
    const { lastFrame } = render(
      <Wrapper>
        <AgentSelector currentAgent="code" agents={defaultAgents} />
      </Wrapper>
    );
    expect(lastFrame()).toContain('Agent Selector');
  });

  it('shows currentAgent in the "Current:" line', () => {
    const { lastFrame } = render(
      <Wrapper>
        <AgentSelector currentAgent="debug" agents={defaultAgents} />
      </Wrapper>
    );
    expect(lastFrame()).toContain('Current: debug');
  });

  it('renders agent names padded to 14 chars in the list', () => {
    const { lastFrame } = render(
      <Wrapper>
        <AgentSelector currentAgent="code" agents={defaultAgents} />
      </Wrapper>
    );
    // 'code' padEnd(14) => 'code          '
    expect(lastFrame()).toContain('code          ');
    // 'debug' padEnd(14) => 'debug         '
    expect(lastFrame()).toContain('debug         ');
  });

  it('renders agent descriptions', () => {
    const { lastFrame } = render(
      <Wrapper>
        <AgentSelector currentAgent="code" agents={defaultAgents} />
      </Wrapper>
    );
    expect(lastFrame()).toContain('General coding assistant');
    expect(lastFrame()).toContain('Debugging and error analysis');
    expect(lastFrame()).toContain('Planning and architecture');
    expect(lastFrame()).toContain('Code exploration and reading');
  });

  it('shows "[Esc] Cancel" hint', () => {
    const { lastFrame } = render(
      <Wrapper>
        <AgentSelector currentAgent="code" agents={defaultAgents} />
      </Wrapper>
    );
    expect(lastFrame()).toContain('[Esc] Cancel');
  });

  it('renders correctly with a single agent', () => {
    const singleAgent = [
      { name: 'orchestrator', color: 'magenta', description: 'Orchestration mode' },
    ];
    const { lastFrame } = render(
      <Wrapper>
        <AgentSelector currentAgent="orchestrator" agents={singleAgent} />
      </Wrapper>
    );
    expect(lastFrame()).toContain('Agent Selector');
    expect(lastFrame()).toContain('Current: orchestrator');
    expect(lastFrame()).toContain('Orchestration mode');
  });

  it('renders all agent names in the list', () => {
    const { lastFrame } = render(
      <Wrapper>
        <AgentSelector currentAgent="plan" agents={defaultAgents} />
      </Wrapper>
    );
    for (const agent of defaultAgents) {
      expect(lastFrame()).toContain(agent.name);
    }
  });

  it('renders correctly with empty agents list', () => {
    const { lastFrame } = render(
      <Wrapper>
        <AgentSelector currentAgent="code" agents={[]} />
      </Wrapper>
    );
    expect(lastFrame()).toContain('Agent Selector');
    expect(lastFrame()).toContain('Current: code');
  });
});
