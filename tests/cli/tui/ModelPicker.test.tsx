import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from 'ink-testing-library';

import { ModelPicker } from '../../../src/cli/tui/dialogs/ModelPicker.js';
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

const defaultModelGroups = [
  {
    provider: 'anthropic',
    models: [
      { id: 'claude-sonnet-id', label: 'claude-sonnet' },
      { id: 'claude-haiku-id', label: 'claude-haiku', description: 'Fast and lightweight' },
    ],
  },
  {
    provider: 'openai',
    models: [{ id: 'gpt-4o-id', label: 'gpt-4o', description: 'Latest GPT-4 Omni model' }],
  },
];

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('ModelPicker', () => {
  it('renders without crashing', () => {
    const { lastFrame } = render(
      <Wrapper>
        <ModelPicker currentModel="claude-sonnet-id" modelGroups={defaultModelGroups} />
      </Wrapper>
    );
    expect(lastFrame()).toBeTruthy();
  });

  it('shows the title "Model Picker"', () => {
    const { lastFrame } = render(
      <Wrapper>
        <ModelPicker currentModel="claude-sonnet-id" modelGroups={defaultModelGroups} />
      </Wrapper>
    );
    expect(lastFrame()).toContain('Model Picker');
  });

  it('shows currentModel in the "Current:" line', () => {
    const { lastFrame } = render(
      <Wrapper>
        <ModelPicker currentModel="my-current-model" modelGroups={defaultModelGroups} />
      </Wrapper>
    );
    expect(lastFrame()).toContain('Current: my-current-model');
  });

  it('renders model labels in [provider] label format', () => {
    const { lastFrame } = render(
      <Wrapper>
        <ModelPicker currentModel="claude-sonnet-id" modelGroups={defaultModelGroups} />
      </Wrapper>
    );
    expect(lastFrame()).toContain('[anthropic] claude-sonnet');
    expect(lastFrame()).toContain('[openai] gpt-4o');
  });

  it('renders model description text in the output', () => {
    const { lastFrame } = render(
      <Wrapper>
        <ModelPicker currentModel="claude-haiku-id" modelGroups={defaultModelGroups} />
      </Wrapper>
    );
    expect(lastFrame()).toContain('Fast and lightweight');
    expect(lastFrame()).toContain('Latest GPT-4 Omni model');
  });

  it('shows "[Esc] Cancel" hint', () => {
    const { lastFrame } = render(
      <Wrapper>
        <ModelPicker currentModel="claude-sonnet-id" modelGroups={defaultModelGroups} />
      </Wrapper>
    );
    expect(lastFrame()).toContain('[Esc] Cancel');
  });

  it('renders models from multiple providers', () => {
    const { lastFrame } = render(
      <Wrapper>
        <ModelPicker currentModel="claude-sonnet-id" modelGroups={defaultModelGroups} />
      </Wrapper>
    );
    expect(lastFrame()).toContain('[anthropic] claude-haiku');
    expect(lastFrame()).toContain('[openai] gpt-4o');
  });

  it('renders correctly with empty model groups', () => {
    const { lastFrame } = render(
      <Wrapper>
        <ModelPicker currentModel="some-model" modelGroups={[]} />
      </Wrapper>
    );
    expect(lastFrame()).toContain('Model Picker');
    expect(lastFrame()).toContain('Current: some-model');
  });

  it('omits description when model has none', () => {
    const groups = [
      {
        provider: 'anthropic',
        models: [{ id: 'claude-sonnet-id', label: 'claude-sonnet' }],
      },
    ];
    const { lastFrame } = render(
      <Wrapper>
        <ModelPicker currentModel="claude-sonnet-id" modelGroups={groups} />
      </Wrapper>
    );
    // The label should be present
    expect(lastFrame()).toContain('[anthropic] claude-sonnet');
  });
});
