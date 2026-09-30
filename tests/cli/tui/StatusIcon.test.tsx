import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from 'ink-testing-library';

import { StatusIcon, STATIC_STATUS_ICONS, statusColor } from '../../../src/cli/tui/components/StatusIcon.js';
import { ThemeProvider } from '../../../src/cli/tui/context/ThemeContext.js';
import { darkTheme } from '../../../src/cli/tui/theme/dark.js';

// The `blocked` glyph is platform-aware after the #1896 Linux mono-font audit:
// - Non-Linux: U+23F8 ⏸ (PAUSE) — the "pretty" glyph.
// - Linux:     U+25A0 ■ (BLACK SQUARE) — the mono-font-safe fallback.
const EXPECTED_BLOCKED_GLYPH = process.platform === 'linux' ? '\u25A0' : '\u23F8';

function renderIcon(ui: React.JSX.Element) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe('StatusIcon — static mapping', () => {
  it('exposes the expected glyph for every non-running status', () => {
    expect(STATIC_STATUS_ICONS.idle).toBe('\u2713');
    expect(STATIC_STATUS_ICONS.error).toBe('\u2717');
    expect(STATIC_STATUS_ICONS.blocked).toBe(EXPECTED_BLOCKED_GLYPH);
    expect(STATIC_STATUS_ICONS.unknown).toBe('?');
  });

  it('resolves colors from the theme for every status', () => {
    const c = darkTheme;
    expect(statusColor('running', c)).toBe(c.warning);
    expect(statusColor('idle', c)).toBe(c.success);
    expect(statusColor('error', c)).toBe(c.error);
    expect(statusColor('blocked', c)).toBe(c.dimText);
    expect(statusColor('unknown', c)).toBe(c.dimText);
  });
});

describe('StatusIcon — rendering', () => {
  it('renders the checkmark for idle', () => {
    const { lastFrame } = renderIcon(<StatusIcon status="idle" animate={false} />);
    expect(lastFrame() ?? '').toContain('\u2713');
  });

  it('renders the cross for error', () => {
    const { lastFrame } = renderIcon(<StatusIcon status="error" animate={false} />);
    expect(lastFrame() ?? '').toContain('\u2717');
  });

  it('renders the pause glyph for blocked', () => {
    const { lastFrame } = renderIcon(<StatusIcon status="blocked" animate={false} />);
    expect(lastFrame() ?? '').toContain(EXPECTED_BLOCKED_GLYPH);
  });

  it('renders a question mark for unknown', () => {
    const { lastFrame } = renderIcon(<StatusIcon status="unknown" animate={false} />);
    expect(lastFrame() ?? '').toContain('?');
  });

  it('renders a static circle for running when animate=false', () => {
    const { lastFrame } = renderIcon(<StatusIcon status="running" animate={false} />);
    // Static fallback matches the mock in issue #1826.
    expect(lastFrame() ?? '').toContain('\u25D0');
  });

  it('renders without crashing for animated running (spinner)', () => {
    const { lastFrame, unmount } = renderIcon(<StatusIcon status="running" />);
    // Just assert the frame is non-empty — the spinner glyph rotates.
    expect(lastFrame()).toBeTruthy();
    unmount();
  });

  it('honours a color override', () => {
    const { lastFrame } = renderIcon(
      <StatusIcon status="idle" animate={false} color="magenta" />
    );
    // ANSI escape for the exact ink-rendered color varies by terminal;
    // just verify the glyph still renders when the override is set.
    expect(lastFrame() ?? '').toContain('\u2713');
  });
});
