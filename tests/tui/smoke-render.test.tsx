/**
 * TUI smoke test — render helper that detects three failure modes at
 * boot time: (1) blank output, (2) React error boundary / panic
 * banners, (3) an unresponsive command palette.
 *
 * Ports the upstream kilocode 2026-08 PTY smoke-test hardening (see
 * commits `5e02825c8..ab143253a`). Kilocode's version uses a real
 * pseudo-TTY (`node-pty`) to reproduce a raw-mode boot; Alexi's Ink-
 * based TUI is thin enough that `ink-testing-library` catches the
 * same regressions with much lower flake.
 *
 * The `render()` helper below is exported so future TUI dialogs and
 * pages can add their own boot smoke tests without duplicating the
 * blank / panic / palette detection.
 */

import { describe, it, expect } from 'vitest';
import React from 'react';
import { render as inkRender } from 'ink-testing-library';
import { Box, Text } from 'ink';

/**
 * Substrings that indicate a React error boundary tripped or a native
 * runtime panic surfaced to the terminal. Any of these in the last
 * frame is treated as a boot failure.
 */
const PANIC_MARKERS = [
  'Error boundary caught',
  'The above error occurred',
  'Consider adding an error boundary',
  'Uncaught (in promise)',
  'TypeError:',
  'ReferenceError:',
  'panic:',
];

/**
 * Frame classification returned by {@link render}. Callers assert on
 * these instead of matching raw ANSI so the tests survive theme /
 * layout tweaks.
 */
export interface RenderReport {
  /** The final rendered frame after the component settled. */
  frame: string;
  /** True when the final frame is empty or whitespace-only. */
  isBlank: boolean;
  /**
   * The panic marker found in the frame, or `null` when none matched.
   * When set, callers should treat this as a boot failure.
   */
  panicMarker: string | null;
  /**
   * Result of a synthetic palette-open probe. `null` when the caller
   * did not request a palette check; otherwise `true` when the frame
   * responded to a `?` keypress within the timeout window.
   */
  paletteResponsive: boolean | null;
}

export interface RenderOptions {
  /**
   * When set, the harness sends this key sequence after the initial
   * render and re-samples the frame. The palette is considered
   * responsive when the post-keypress frame differs from the initial
   * one (any visible change counts — a spinner tick alone is fine).
   * Defaults to `undefined` (no palette probe).
   */
  probeKey?: string;
  /**
   * Milliseconds to wait for the initial render to settle before
   * classifying the frame. Defaults to 50ms — Ink flushes frames
   * synchronously on `useState` writes, so a short debounce is enough.
   */
  settleMs?: number;
}

/**
 * Render `element` under `ink-testing-library` and classify the
 * resulting frame. Guaranteed to `unmount()` before returning so
 * timers and effects do not leak between tests.
 */
export async function render(
  element: React.ReactElement,
  options: RenderOptions = {}
): Promise<RenderReport> {
  const settleMs = options.settleMs ?? 50;
  const instance = inkRender(element);
  try {
    // Let effects / initial state writes settle.
    await new Promise((resolve) => setTimeout(resolve, settleMs));

    const initialFrame = instance.lastFrame() ?? '';

    let paletteResponsive: boolean | null = null;
    if (options.probeKey !== undefined) {
      instance.stdin.write(options.probeKey);
      await new Promise((resolve) => setTimeout(resolve, settleMs));
      const postFrame = instance.lastFrame() ?? '';
      paletteResponsive = postFrame !== initialFrame;
    }

    const finalFrame = instance.lastFrame() ?? '';
    const stripped = finalFrame.replace(/\s+/g, '');
    const panicMarker =
      PANIC_MARKERS.find((marker) => finalFrame.includes(marker)) ?? null;

    return {
      frame: finalFrame,
      isBlank: stripped.length === 0,
      panicMarker,
      paletteResponsive,
    };
  } finally {
    instance.unmount();
  }
}

// A minimal component used to demonstrate the harness and prove all
// three classifications are wired end-to-end. Callers registering
// real TUI smoke tests should import `render` and drop in their own
// component / dialog / page.
function Hello(): React.ReactElement {
  return (
    <Box>
      <Text>hello</Text>
    </Box>
  );
}

function Blank(): React.ReactElement {
  return <Box />;
}

function Panicky(): React.ReactElement {
  return (
    <Box>
      <Text>TypeError: cannot read properties of undefined</Text>
    </Box>
  );
}

describe('tui smoke render() helper', () => {
  it('classifies a normal render as non-blank and non-panicking', async () => {
    const report = await render(<Hello />);
    expect(report.isBlank).toBe(false);
    expect(report.panicMarker).toBeNull();
    expect(report.frame).toContain('hello');
  });

  it('detects a blank TUI frame', async () => {
    const report = await render(<Blank />);
    expect(report.isBlank).toBe(true);
  });

  it('detects panic markers in the rendered frame', async () => {
    const report = await render(<Panicky />);
    expect(report.panicMarker).toBe('TypeError:');
  });

  it('reports palette responsiveness when a probe key is supplied', async () => {
    const report = await render(<Hello />, { probeKey: '?' });
    // A static <Hello /> does not react to keypresses, so the palette
    // probe reports "unresponsive". This proves the wiring — a real
    // page with a command palette would flip this to `true`.
    expect(report.paletteResponsive).toBe(false);
  });
});
