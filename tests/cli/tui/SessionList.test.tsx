import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from 'ink-testing-library';

import { SessionList, type SessionSummary } from '../../../src/cli/tui/dialogs/SessionList.js';
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

const now = Date.now();

const sampleSessions: SessionSummary[] = [
  {
    id: 'session-aaa',
    name: 'Refactor',
    createdAt: now - 60_000,
    messageCount: 5,
    lastMessage: 'Refactored the utils module',
  },
  {
    id: 'session-bbb',
    createdAt: now - 120_000,
    messageCount: 1,
    lastMessage: 'Hello world',
  },
  {
    id: 'session-ccc',
    name: 'Debug',
    createdAt: now - 180_000,
    messageCount: 12,
  },
];

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('SessionList', () => {
  it('renders without crashing', () => {
    const { lastFrame } = render(
      <Wrapper>
        <SessionList sessions={[]} activeSessionId="none" />
      </Wrapper>
    );
    expect(lastFrame()).toBeTruthy();
  });

  it('shows the "Sessions" title', () => {
    const { lastFrame } = render(
      <Wrapper>
        <SessionList sessions={[]} activeSessionId="none" />
      </Wrapper>
    );
    expect(lastFrame()).toContain('Sessions');
  });

  it('shows "[New Session]" option', () => {
    const { lastFrame } = render(
      <Wrapper>
        <SessionList sessions={sampleSessions} activeSessionId="session-aaa" />
      </Wrapper>
    );
    expect(lastFrame()).toContain('[New Session]');
  });

  it('renders session entries with name and message count', () => {
    const { lastFrame } = render(
      <Wrapper>
        <SessionList sessions={sampleSessions} activeSessionId="session-aaa" />
      </Wrapper>
    );
    const frame = lastFrame() ?? '';
    expect(frame).toContain('Refactor');
    expect(frame).toContain('5 msgs');
  });

  it('shows session ID prefix when name is missing', () => {
    const { lastFrame } = render(
      <Wrapper>
        <SessionList sessions={sampleSessions} activeSessionId="session-aaa" />
      </Wrapper>
    );
    const frame = lastFrame() ?? '';
    // session-bbb has no name, so should show first 8 chars of ID
    expect(frame).toContain('session-');
  });

  it('shows single message count as "1 msg"', () => {
    const { lastFrame } = render(
      <Wrapper>
        <SessionList sessions={sampleSessions} activeSessionId="session-aaa" />
      </Wrapper>
    );
    const frame = lastFrame() ?? '';
    expect(frame).toContain('1 msg');
  });

  it('marks the active session with "(active)"', () => {
    const { lastFrame } = render(
      <Wrapper>
        <SessionList sessions={sampleSessions} activeSessionId="session-aaa" />
      </Wrapper>
    );
    const frame = lastFrame() ?? '';
    expect(frame).toContain('(active)');
  });

  it('does not mark non-active sessions with "(active)"', () => {
    const { lastFrame } = render(
      <Wrapper>
        <SessionList sessions={sampleSessions} activeSessionId="session-aaa" />
      </Wrapper>
    );
    const frame = lastFrame() ?? '';
    // Only one "(active)" marker should appear
    const matches = frame.match(/\(active\)/g);
    expect(matches).toHaveLength(1);
  });

  it('shows last message preview truncated', () => {
    const { lastFrame } = render(
      <Wrapper>
        <SessionList sessions={sampleSessions} activeSessionId="session-aaa" />
      </Wrapper>
    );
    const frame = lastFrame() ?? '';
    expect(frame).toContain('Refactored the utils module');
    expect(frame).toContain('Hello world');
  });

  it('shows "[Esc] Cancel" hint', () => {
    const { lastFrame } = render(
      <Wrapper>
        <SessionList sessions={sampleSessions} activeSessionId="session-aaa" />
      </Wrapper>
    );
    expect(lastFrame()).toContain('[Esc] Cancel');
  });

  it('renders with empty sessions list', () => {
    const { lastFrame } = render(
      <Wrapper>
        <SessionList sessions={[]} activeSessionId="none" />
      </Wrapper>
    );
    const frame = lastFrame() ?? '';
    expect(frame).toContain('Sessions');
    expect(frame).toContain('[New Session]');
  });

  // Issue #1901: paused sessions should show their scheduled wake
  // time inline so the operator does not need to leave the TUI.
  it('renders the scheduled wake time for paused sessions', () => {
    const paused: SessionSummary[] = [
      {
        id: 'session-paused',
        name: 'Paused',
        createdAt: now - 60_000,
        messageCount: 3,
        // Far enough in the future to land in the relative branch
        // (<24h horizon) so the label is predictable.
        scheduledWakeTime: Date.now() + 2 * 60 * 60 * 1000,
      },
    ];
    const { lastFrame } = render(
      <Wrapper>
        <SessionList sessions={paused} activeSessionId="other" />
      </Wrapper>
    );
    const frame = lastFrame() ?? '';
    expect(frame).toContain('resumes in');
    expect(frame).toContain('Paused');
  });

  it('omits the wake-time label on sessions without a schedule', () => {
    const { lastFrame } = render(
      <Wrapper>
        <SessionList sessions={sampleSessions} activeSessionId="session-aaa" />
      </Wrapper>
    );
    const frame = lastFrame() ?? '';
    expect(frame).not.toContain('resumes in');
    expect(frame).not.toContain('wakes at');
  });
});
