import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render } from 'ink-testing-library';

import { ModelPicker } from '../../../src/cli/tui/dialogs/ModelPicker.js';
import { DialogProvider } from '../../../src/cli/tui/context/DialogContext.js';
import { ThemeProvider } from '../../../src/cli/tui/context/ThemeContext.js';
import { invalidateCatalog, refreshModelCatalog } from '../../../src/providers/modelCatalog.js';

// Mock the SAP SDK so `refreshModelCatalog` can be driven to an error
// state without live credentials.
const { executeMock, deploymentQueryMock } = vi.hoisted(() => {
  const executeMock = vi.fn();
  const deploymentQueryMock = vi.fn(() => ({ execute: executeMock }));
  return { executeMock, deploymentQueryMock };
});

vi.mock('@sap-ai-sdk/ai-api', () => ({
  DeploymentApi: {
    deploymentQuery: deploymentQueryMock,
  },
}));

const noSleep = (): Promise<void> => Promise.resolve();

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

// ---------------------------------------------------------------------------
// Issue #1851 — surface model-list endpoint errors in the model picker.
//
// These tests exercise the "no props" branch (`modelGroups` omitted), where
// the picker reads the live SAP AI Core catalog state. We drive
// `refreshModelCatalog` into error / ready by rejecting / resolving the
// mocked `DeploymentApi.deploymentQuery` promise.
// ---------------------------------------------------------------------------

describe('ModelPicker — model-list endpoint errors (#1851)', () => {
  beforeEach(() => {
    executeMock.mockReset();
    deploymentQueryMock.mockClear();
    invalidateCatalog();
  });

  afterEach(() => {
    invalidateCatalog();
  });

  it('renders the classified reason and actionable hint on a 401 failure', async () => {
    executeMock.mockRejectedValue(Object.assign(new Error('boom'), { status: 401 }));
    await refreshModelCatalog('default', { retry: { sleep: noSleep } });

    const { lastFrame } = render(
      <Wrapper>
        <ModelPicker currentModel="claude-sonnet-id" />
      </Wrapper>
    );

    const frame = lastFrame() ?? '';
    expect(frame).toContain('Model list unavailable');
    expect(frame).toMatch(/unauthorized/i);
    // The actionable hint should follow on the next line.
    expect(frame).toMatch(/AICORE_SERVICE_KEY/);
  });

  it('renders a network hint when the catalog fetch fails with ECONNRESET', async () => {
    executeMock.mockRejectedValue(Object.assign(new Error('boom'), { code: 'ECONNRESET' }));
    await refreshModelCatalog('default', { retry: { sleep: noSleep, maxAttempts: 1 } });

    const { lastFrame } = render(
      <Wrapper>
        <ModelPicker currentModel="claude-sonnet-id" />
      </Wrapper>
    );

    const frame = lastFrame() ?? '';
    expect(frame).toContain('Model list unavailable');
    expect(frame).toMatch(/network|proxy|VPN/i);
  });

  it('renders a 404 hint suggesting -m fallback', async () => {
    executeMock.mockRejectedValue(Object.assign(new Error('not found'), { status: 404 }));
    await refreshModelCatalog('default', { retry: { sleep: noSleep } });

    const { lastFrame } = render(
      <Wrapper>
        <ModelPicker currentModel="claude-sonnet-id" />
      </Wrapper>
    );

    const frame = lastFrame() ?? '';
    expect(frame).toMatch(/not found|endpoint/i);
    expect(frame).toMatch(/AI_API_URL|-m/);
  });

  it('shows live-model badge (no error) after a successful refresh', async () => {
    executeMock.mockResolvedValueOnce({
      resources: [{ id: 'dep-1', configurationName: 'gpt-4o' }],
    });
    await refreshModelCatalog('default', { retry: { sleep: noSleep } });

    const { lastFrame } = render(
      <Wrapper>
        <ModelPicker currentModel="gpt-4o" />
      </Wrapper>
    );

    const frame = lastFrame() ?? '';
    expect(frame).not.toContain('Model list unavailable');
    expect(frame).toMatch(/live|total/);
  });
});
