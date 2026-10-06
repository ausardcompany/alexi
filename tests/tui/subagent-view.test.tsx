/**
 * TUI smoke tests for the SubagentView and SubagentProvider
 * (issue #1924 / kilocode #14702).
 *
 * The visual component is deliberately simple — a bordered panel with
 * optional "Steering active" badge. The data-layer behaviour of
 * steer() is covered by `tests/agent/steering.test.ts`; here we assert
 * only on static rendering invariants to keep the test fast and
 * independent of React effect scheduling in the node-env runner.
 */

import { describe, it, expect } from 'vitest';
import React from 'react';
import { render as inkRender } from 'ink-testing-library';
import { Text } from 'ink';

import { ThemeProvider } from '../../src/cli/tui/context/ThemeContext.js';
import { SubagentView } from '../../src/cli/tui/components/SubagentView.js';
import {
  SubagentProvider,
  useSubagent,
  type SubagentContextValue,
} from '../../src/cli/tui/context/SubagentContext.js';

function themed(element: React.ReactElement): React.ReactElement {
  return <ThemeProvider>{element}</ThemeProvider>;
}

/**
 * Capture the live `SubagentContextValue` into a shared ref so tests
 * can read it without pulling in `@testing-library/react`, which needs
 * a DOM environment.
 */
function Capture({ into }: { into: { current: SubagentContextValue | null } }): React.JSX.Element {
  const ctx = useSubagent();
  into.current = ctx;
  return <Text>captured</Text>;
}

describe('SubagentView', () => {
  it('renders the subagent id and output without a steering overlay by default', () => {
    const { lastFrame, unmount } = inkRender(
      themed(
        <SubagentView
          subagentId="sub-abc12345"
          output="searching repository for auth flows"
          steeringPrompt={null}
        />
      )
    );
    const frame = lastFrame() ?? '';
    expect(frame).toContain('subagent');
    expect(frame).toContain('sub-abc12345');
    expect(frame).toContain('searching repository');
    // No steering panel.
    expect(frame).not.toContain('Steering active');
    unmount();
  });

  it('renders the "Steering active" badge and the prompt when steering is set', () => {
    const { lastFrame, unmount } = inkRender(
      themed(
        <SubagentView
          subagentId="sub-abc12345"
          output="working..."
          steeringPrompt="focus on edge cases"
          steeringDeliveredAt={new Date('2026-10-04T12:00:00Z').toISOString()}
        />
      )
    );
    const frame = lastFrame() ?? '';
    expect(frame).toContain('Steering active');
    expect(frame).toContain('focus on edge cases');
    unmount();
  });

  it('omits the steering panel when the prompt is whitespace-only', () => {
    const { lastFrame, unmount } = inkRender(
      themed(<SubagentView subagentId="sub-abc12345" output="working" steeringPrompt="   " />)
    );
    expect(lastFrame() ?? '').not.toContain('Steering active');
    unmount();
  });

  it('renders the delivery timestamp when provided', () => {
    const ts = new Date('2026-10-04T15:04:05Z').toISOString();
    const { lastFrame, unmount } = inkRender(
      themed(
        <SubagentView
          subagentId="sub-xyz"
          output="working"
          steeringPrompt="be careful"
          steeringDeliveredAt={ts}
        />
      )
    );
    const frame = lastFrame() ?? '';
    expect(frame).toContain('Steering active');
    expect(frame).toContain('be careful');
    unmount();
  });
});

describe('SubagentProvider initial state', () => {
  it('starts with no active subagent and no steering prompt', () => {
    const captured: { current: SubagentContextValue | null } = { current: null };
    const { unmount } = inkRender(
      themed(
        <SubagentProvider>
          <Capture into={captured} />
        </SubagentProvider>
      )
    );
    expect(captured.current).not.toBeNull();
    expect(captured.current?.activeSubagentId).toBeNull();
    expect(captured.current?.steeringPrompt).toBeNull();
    expect(captured.current?.steeringDeliveredAt).toBeNull();
    unmount();
  });

  it('steer() rejects when there is no active subagent (Ctrl+S no-op invariant)', async () => {
    const captured: { current: SubagentContextValue | null } = { current: null };
    const { unmount } = inkRender(
      themed(
        <SubagentProvider>
          <Capture into={captured} />
        </SubagentProvider>
      )
    );
    const outcome = await captured.current!.steer('focus on tests');
    expect(outcome).toBe(false);
    expect(captured.current?.steeringPrompt).toBeNull();
    unmount();
  });
});
