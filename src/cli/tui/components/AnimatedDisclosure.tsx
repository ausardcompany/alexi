import React, { useEffect, useRef, useState } from 'react';
import { Box, useAnimation } from 'ink';

export interface AnimatedDisclosureProps {
  /** Whether the disclosure should be expanded (visible) or collapsed. */
  isExpanded: boolean;
  /** Content rendered inside the disclosure. */
  children: React.ReactNode;
  /**
   * Natural height (in terminal rows) of the fully-expanded content.
   *
   * This must be supplied by the caller because Ink's `useBoxMetrics`
   * returns Yoga's *computed* layout, which honours the animated clip
   * height and therefore cannot report the unclipped natural height of
   * children rendered inside the clipping box. When omitted, or when
   * `duration` is 0, the disclosure snaps between states without
   * animation (safe fallback).
   */
  contentLines?: number;
  /**
   * Total animation duration in milliseconds. Defaults to 120ms.
   * Set to 0 to disable animation entirely (content snaps between states).
   */
  duration?: number;
  /**
   * Interval between animation ticks in milliseconds. Defaults to 30ms
   * (~33fps), which is well below the terminal-flush ceiling and produces
   * a smooth reveal without excessive redraws.
   */
  interval?: number;
  /**
   * Called with `true` when an animation starts and `false` when it
   * settles. Parents can use this to gate keyboard input during the
   * transition (the `inert` pattern) so users cannot re-toggle mid-flight.
   */
  onAnimatingChange?: (isAnimating: boolean) => void;
}

/**
 * AnimatedDisclosure - wraps children in a clipping Box whose visible
 * height eases between 0 and `contentLines` over `duration` ms, so
 * expand/collapse transitions reveal or hide rows smoothly instead of
 * snapping.
 *
 * Design notes:
 * - Terminals cannot render partial rows. Animation is per-row: at
 *   fractional progress `p`, the visible height is
 *   `round(p * contentLines)`. For short content (2-4 rows) this looks
 *   like a fast staircase reveal; for longer content it feels smooth.
 * - Measurement in Ink is not free: `useBoxMetrics` reports the computed
 *   (clipped) height, so it cannot substitute for a caller-supplied
 *   `contentLines`. Callers pass the expected line count so the
 *   component knows the target without a "flash of unclipped content"
 *   on first paint. This keeps the component honest and predictable.
 * - Rapid-toggle handling: a mid-flight direction change captures the
 *   current eased progress as the new start and flips the target. The
 *   frame elapsed counter is reset so easing feels consistent.
 * - Inert contract: the parent that owns keyboard bindings should ignore
 *   toggle events while the most recent `onAnimatingChange` payload was
 *   `true`. This prevents interaction races where a second toggle
 *   arrives before the current animation has settled.
 * - When `contentLines <= 0`, `duration <= 0`, or animation is disabled,
 *   the component renders children iff `isExpanded` and returns `null`
 *   otherwise. This is the same visibility contract as the previous
 *   static disclosure.
 */
export function AnimatedDisclosure({
  isExpanded,
  children,
  contentLines,
  duration = 120,
  interval = 30,
  onAnimatingChange,
}: AnimatedDisclosureProps): React.JSX.Element | null {
  const shouldAnimate = duration > 0 && typeof contentLines === 'number' && contentLines > 0;

  // Whether children are mounted at all. Stays true during the collapse
  // animation so there is content to clip; unmounts once fully collapsed.
  const [isMounted, setIsMounted] = useState<boolean>(isExpanded);
  // Progress in [0, 1]: 0 = fully collapsed, 1 = fully expanded.
  const [progress, setProgress] = useState<number>(isExpanded ? 1 : 0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  const targetProgressRef = useRef<number>(isExpanded ? 1 : 0);
  const startProgressRef = useRef<number>(isExpanded ? 1 : 0);
  const elapsedRef = useRef<number>(0);

  useEffect(() => {
    const nextTarget = isExpanded ? 1 : 0;
    if (targetProgressRef.current === nextTarget) {
      return;
    }
    if (nextTarget === 1) {
      setIsMounted(true);
    }
    targetProgressRef.current = nextTarget;
    startProgressRef.current = progress;
    elapsedRef.current = 0;
    if (!shouldAnimate) {
      setProgress(nextTarget);
      setIsAnimating(false);
      if (nextTarget === 0) {
        setIsMounted(false);
      }
      return;
    }
    setIsAnimating(true);
    // `progress` intentionally read via snapshot to seed startProgressRef;
    // adding it to deps would restart the animation on every tick.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExpanded, shouldAnimate]);

  useEffect(() => {
    onAnimatingChange?.(isAnimating);
  }, [isAnimating, onAnimatingChange]);

  const { delta } = useAnimation({ interval, isActive: isAnimating });

  useEffect(() => {
    if (!isAnimating) {
      return;
    }
    if (delta <= 0) {
      return;
    }
    elapsedRef.current += delta;
    const rawFraction = Math.min(1, elapsedRef.current / duration);
    const eased = easeInOutQuad(rawFraction);
    const start = startProgressRef.current;
    const target = targetProgressRef.current;
    const next = start + (target - start) * eased;
    if (rawFraction >= 1) {
      setProgress(target);
      setIsAnimating(false);
      if (target === 0) {
        setIsMounted(false);
      }
      return;
    }
    setProgress(next);
  }, [delta, duration, isAnimating]);

  if (!isMounted && progress === 0) {
    return null;
  }

  // Snap path: no valid contentLines or duration == 0. Render children
  // as-is when mounted; return null when not.
  if (!shouldAnimate) {
    return <>{children}</>;
  }

  const naturalHeight = contentLines as number;
  const visibleHeight = Math.max(0, Math.round(progress * naturalHeight));
  if (visibleHeight <= 0) {
    return null;
  }

  return (
    <Box height={visibleHeight} overflow="hidden" flexDirection="column">
      {children}
    </Box>
  );
}

/**
 * Quadratic ease-in-out curve. Produces a symmetric acceleration curve
 * that feels smoother than linear for short (<200ms) reveals.
 */
function easeInOutQuad(t: number): number {
  if (t < 0.5) {
    return 2 * t * t;
  }
  return -1 + (4 - 2 * t) * t;
}
