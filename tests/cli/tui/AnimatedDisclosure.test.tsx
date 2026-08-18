import React, { useState } from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render } from 'ink-testing-library';
import { Text } from 'ink';

import { AnimatedDisclosure } from '../../../src/cli/tui/components/AnimatedDisclosure.js';

/**
 * These tests exercise the AnimatedDisclosure state machine, not pixel-
 * perfect terminal output. Ink's `ink-testing-library` renders into a
 * text buffer and does not step the animation clock deterministically,
 * so we assert on visibility contract: initial expanded state renders
 * content, initial collapsed state renders nothing, the snap fallback
 * (no `contentLines` or `duration=0`) renders instantly, and the
 * `onAnimatingChange` inert callback fires exactly around a toggle.
 */

function ContentProbe({ label }: { label: string }): React.JSX.Element {
  return <Text>{label}</Text>;
}

describe('AnimatedDisclosure', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders content when initially expanded (contentLines provided)', () => {
    const { lastFrame } = render(
      <AnimatedDisclosure isExpanded={true} contentLines={3}>
        <ContentProbe label="hello-expanded" />
      </AnimatedDisclosure>
    );
    expect(lastFrame()).toContain('hello-expanded');
  });

  it('renders nothing when initially collapsed', () => {
    const { lastFrame } = render(
      <AnimatedDisclosure isExpanded={false} contentLines={3}>
        <ContentProbe label="hidden-collapsed" />
      </AnimatedDisclosure>
    );
    expect(lastFrame() ?? '').not.toContain('hidden-collapsed');
  });

  it('snaps to visible when duration=0 and expanded', () => {
    const { lastFrame } = render(
      <AnimatedDisclosure isExpanded={true} contentLines={3} duration={0}>
        <ContentProbe label="snap-visible" />
      </AnimatedDisclosure>
    );
    expect(lastFrame()).toContain('snap-visible');
  });

  it('renders content when contentLines is omitted (snap fallback)', () => {
    // Without contentLines, the component snaps rather than animating.
    // In the expanded state that means children are rendered directly.
    const { lastFrame } = render(
      <AnimatedDisclosure isExpanded={true}>
        <ContentProbe label="snap-fallback" />
      </AnimatedDisclosure>
    );
    expect(lastFrame()).toContain('snap-fallback');
  });

  it('renders nothing when collapsed and duration=0', () => {
    const { lastFrame } = render(
      <AnimatedDisclosure isExpanded={false} contentLines={3} duration={0}>
        <ContentProbe label="hidden-snap" />
      </AnimatedDisclosure>
    );
    expect(lastFrame() ?? '').not.toContain('hidden-snap');
  });

  it('does not fire onAnimatingChange when duration=0', () => {
    const onAnimatingChange = vi.fn();
    function Harness(): React.JSX.Element {
      const [expanded, setExpanded] = useState(false);
      // Trigger a toggle after mount to exercise the transition path.
      React.useEffect(() => {
        setExpanded(true);
      }, []);
      return (
        <AnimatedDisclosure
          isExpanded={expanded}
          contentLines={3}
          duration={0}
          onAnimatingChange={onAnimatingChange}
        >
          <ContentProbe label="no-anim" />
        </AnimatedDisclosure>
      );
    }
    render(<Harness />);
    // With duration=0 the component never enters isAnimating=true, so
    // the callback should only ever have been invoked (if at all) with
    // false — never true.
    const trueCalls = onAnimatingChange.mock.calls.filter(([v]) => v === true);
    expect(trueCalls.length).toBe(0);
  });

  it('unmounts children after collapsing with duration=0', async () => {
    const { rerender, lastFrame } = render(
      <AnimatedDisclosure isExpanded={true} contentLines={3} duration={0}>
        <ContentProbe label="will-unmount" />
      </AnimatedDisclosure>
    );
    expect(lastFrame()).toContain('will-unmount');
    rerender(
      <AnimatedDisclosure isExpanded={false} contentLines={3} duration={0}>
        <ContentProbe label="will-unmount" />
      </AnimatedDisclosure>
    );
    // Yield to the event loop so React flushes the effect that reacts
    // to the isExpanded prop change and unmounts children.
    await new Promise((resolve) => setTimeout(resolve, 20));
    expect(lastFrame() ?? '').not.toContain('will-unmount');
  });

  it('reports isAnimating=true when a real animation starts', async () => {
    const onAnimatingChange = vi.fn();
    const { rerender } = render(
      <AnimatedDisclosure
        isExpanded={false}
        contentLines={4}
        duration={200}
        interval={50}
        onAnimatingChange={onAnimatingChange}
      >
        <ContentProbe label="animated-in" />
      </AnimatedDisclosure>
    );
    // Toggle from collapsed to expanded — this must trigger a real
    // animation because `contentLines > 0` and `duration > 0`.
    rerender(
      <AnimatedDisclosure
        isExpanded={true}
        contentLines={4}
        duration={200}
        interval={50}
        onAnimatingChange={onAnimatingChange}
      >
        <ContentProbe label="animated-in" />
      </AnimatedDisclosure>
    );
    // Yield so the effect that flips isAnimating=true and the callback
    // effect that mirrors it can both flush.
    await new Promise((resolve) => setTimeout(resolve, 20));
    const trueCalls = onAnimatingChange.mock.calls.filter(([v]) => v === true);
    expect(trueCalls.length).toBeGreaterThan(0);
  });

  it('is inert during animation: reports isAnimating=false initially with no toggle', () => {
    const onAnimatingChange = vi.fn();
    render(
      <AnimatedDisclosure
        isExpanded={true}
        contentLines={3}
        duration={100}
        onAnimatingChange={onAnimatingChange}
      >
        <ContentProbe label="idle" />
      </AnimatedDisclosure>
    );
    // Initial mount at isExpanded=true starts at progress=1, so no
    // animation is triggered — the callback should only have reported
    // false (idle) or never been called.
    const trueCalls = onAnimatingChange.mock.calls.filter(([v]) => v === true);
    expect(trueCalls.length).toBe(0);
  });

  it('handles a rapid toggle without throwing (expand then collapse)', () => {
    // Should not throw during any of the state transitions.
    expect(() => {
      const { rerender, unmount } = render(
        <AnimatedDisclosure isExpanded={false} contentLines={4} duration={100} interval={20}>
          <ContentProbe label="rapid-toggle" />
        </AnimatedDisclosure>
      );
      rerender(
        <AnimatedDisclosure isExpanded={true} contentLines={4} duration={100} interval={20}>
          <ContentProbe label="rapid-toggle" />
        </AnimatedDisclosure>
      );
      // Reverse direction mid-flight to exercise the direction-reversal path.
      rerender(
        <AnimatedDisclosure isExpanded={false} contentLines={4} duration={100} interval={20}>
          <ContentProbe label="rapid-toggle" />
        </AnimatedDisclosure>
      );
      unmount();
    }).not.toThrow();
  });

  it('returns null (no content, no wrapper) when collapsed with snap fallback', () => {
    const { lastFrame } = render(
      <AnimatedDisclosure isExpanded={false}>
        <ContentProbe label="never" />
      </AnimatedDisclosure>
    );
    // The empty frame should not contain the label.
    expect(lastFrame() ?? '').not.toContain('never');
  });
});
