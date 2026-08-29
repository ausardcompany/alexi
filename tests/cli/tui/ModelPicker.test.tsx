import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render } from 'ink-testing-library';

import { ModelPicker } from '../../../src/cli/tui/dialogs/ModelPicker.js';
import { DialogProvider } from '../../../src/cli/tui/context/DialogContext.js';
import { ThemeProvider } from '../../../src/cli/tui/context/ThemeContext.js';

// ---------------------------------------------------------------------------
// Mock the modelCatalog module so tests are deterministic and offline
// ---------------------------------------------------------------------------

vi.mock('../../../src/providers/modelCatalog.js', () => {
  const entries = [
    { id: 'anthropic--claude-4.5-sonnet', source: 'both', live: true, metadata: undefined },
    { id: 'anthropic--claude-4.5-haiku', source: 'both', live: true, metadata: undefined },
    { id: 'gpt-4o', source: 'both', live: true, metadata: undefined },
    { id: 'gemini-2.5-pro', source: 'static', live: false, metadata: undefined },
  ];

  return {
    getCatalogStatus: vi.fn(() => 'ready' as const),
    getCatalogEntries: vi.fn(() => entries),
    getLiveModels: vi.fn(() => entries.filter((e) => e.live).map((e) => e.id)),
    subscribeCatalog: vi.fn(() => () => {}),
  };
});

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

// modelGroups prop is kept for API compatibility but the component now builds
// its own groups from the catalog; tests verify the new rendered output.
const legacyModelGroups = [
  {
    provider: 'anthropic',
    models: [
      { id: 'claude-sonnet-id', label: 'claude-sonnet' },
      { id: 'claude-haiku-id', label: 'claude-haiku', description: 'Fast and lightweight' },
    ],
  },
];

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('ModelPicker', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders without crashing', () => {
    const { lastFrame } = render(
      <Wrapper>
        <ModelPicker currentModel="anthropic--claude-4.5-sonnet" modelGroups={legacyModelGroups} />
      </Wrapper>
    );
    expect(lastFrame()).toBeTruthy();
  });

  it('shows the title "Select Model"', () => {
    const { lastFrame } = render(
      <Wrapper>
        <ModelPicker currentModel="anthropic--claude-4.5-sonnet" modelGroups={legacyModelGroups} />
      </Wrapper>
    );
    expect(lastFrame()).toContain('Select Model');
  });

  it('shows currentModel in the "Current:" line', () => {
    const { lastFrame } = render(
      <Wrapper>
        <ModelPicker currentModel="my-current-model" modelGroups={legacyModelGroups} />
      </Wrapper>
    );
    expect(lastFrame()).toContain('Current: my-current-model');
  });

  it('renders model ids from the catalog', () => {
    const { lastFrame } = render(
      <Wrapper>
        <ModelPicker
          currentModel="anthropic--claude-4.5-sonnet"
          modelGroups={legacyModelGroups}
        />
      </Wrapper>
    );
    expect(lastFrame()).toContain('anthropic--claude-4.5-sonnet');
    expect(lastFrame()).toContain('gpt-4o');
  });

  it('shows live indicator (●) for live models', () => {
    const { lastFrame } = render(
      <Wrapper>
        <ModelPicker
          currentModel="anthropic--claude-4.5-sonnet"
          modelGroups={legacyModelGroups}
        />
      </Wrapper>
    );
    // Live models get ● prefix; static-only get ○
    expect(lastFrame()).toContain('●');
  });

  it('shows static indicator (○) for non-live models', () => {
    const { lastFrame } = render(
      <Wrapper>
        <ModelPicker
          currentModel="anthropic--claude-4.5-sonnet"
          modelGroups={legacyModelGroups}
        />
      </Wrapper>
    );
    // gemini-2.5-pro is static-only → ○
    expect(lastFrame()).toContain('○');
  });

  it('shows navigation hints', () => {
    const { lastFrame } = render(
      <Wrapper>
        <ModelPicker currentModel="anthropic--claude-4.5-sonnet" modelGroups={legacyModelGroups} />
      </Wrapper>
    );
    expect(lastFrame()).toContain('Esc');
  });

  it('shows catalog status badge when ready', () => {
    const { lastFrame } = render(
      <Wrapper>
        <ModelPicker currentModel="anthropic--claude-4.5-sonnet" modelGroups={legacyModelGroups} />
      </Wrapper>
    );
    // "3 live · 4 total"
    expect(lastFrame()).toContain('live');
    expect(lastFrame()).toContain('total');
  });

  it('renders correctly when currentModel is not in catalog', () => {
    const { lastFrame } = render(
      <Wrapper>
        <ModelPicker currentModel="unknown-model-xyz" modelGroups={legacyModelGroups} />
      </Wrapper>
    );
    expect(lastFrame()).toContain('Current: unknown-model-xyz');
  });
});
