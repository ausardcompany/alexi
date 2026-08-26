/**
 * Run boundary detection and work-collapse projection.
 *
 * A "run" is the sequence of messages between (and including) a user
 * message and the terminating assistant reply. Runs let the transcript
 * fold a completed conversation turn's tool calls behind a single
 * `WorkActivity` disclosure so the final answer stays visible while
 * working details remain available on demand.
 *
 * Contract:
 * - A run is delimited by a user message (`role === 'user'`). Every
 *   run therefore starts with a user message and continues until the
 *   next user message. Anything before the first user message (system
 *   prompts, warm-up assistant lines) is emitted as a leading "prelude"
 *   run with no user delimiter — collapse rules still apply.
 * - A run is *completed* iff:
 *     - The session is not currently streaming (`isStreaming === false`), AND
 *     - The run contains at least one assistant message with non-empty
 *       textual `content` OR at least one image attachment (deliverable).
 *   The trailing run only collapses under these conditions; any earlier
 *   run in the transcript is always eligible to collapse.
 * - A run is *cancelled/failed* when it contains a `failed` tool call
 *   and no successful assistant deliverable. Cancelled runs keep their
 *   rows expanded so the failure is visible without interaction.
 * - Assistant messages with image attachments are always treated as
 *   deliverables and never merged into the summary — their bubble is
 *   emitted as its own row before any subsequent WorkActivity.
 *
 * Output:
 * - The projection is a list of `RunProjection` values in transcript
 *   order. Each projection carries:
 *     - the user-delimiter message (may be `null` for the prelude),
 *     - the deliverable assistant message (may be `null` for an
 *       in-flight or cancelled run),
 *     - the flat list of tool calls to collapse, and
 *     - whether the run should collapse into WorkActivity or render
 *       each row expanded.
 *   The consuming component decides how to render each projection.
 */

import type { MessageDisplay } from '../components/MessageArea.js';
import type { ToolCallState } from '../context/ChatContext.js';

/** One transcript run — a user message plus everything up to the next one. */
export interface RunProjection {
  /** Stable identifier derived from the delimiter message (or the run index). */
  id: string;
  /** The user message that opens this run, or null for the leading prelude. */
  userMessage: MessageDisplay | null;
  /**
   * The assistant message that closes this run, if any. Present iff the
   * run produced a textual or media deliverable. `null` for in-flight,
   * cancelled, or purely-tool runs.
   */
  assistantMessage: MessageDisplay | null;
  /**
   * Non-deliverable assistant messages that appeared inside the run
   * (interstitial narration, thinking traces surfaced as content). These
   * are folded into the WorkActivity summary alongside tool calls when
   * the run collapses.
   */
  interstitialAssistantMessages: MessageDisplay[];
  /** Flat tool-call list for the run, in transcript order. */
  toolCalls: ToolCallState[];
  /** Total wall-clock duration across all tool calls in the run, ms. */
  durationMs: number;
  /**
   * When true, the consumer should render this run as a single
   * WorkActivity disclosure. When false, the run is trailing/active or
   * cancelled and every tool row should render expanded.
   */
  shouldCollapse: boolean;
  /** True when at least one tool call ended in `failed`. */
  hasFailure: boolean;
}

export interface CollapseWorkOptions {
  /** Whether streaming is currently in progress (trailing run gate). */
  isStreaming: boolean;
}

/**
 * Group a flat transcript into per-run projections and decide which
 * runs are eligible to collapse into a WorkActivity summary.
 */
export function collapseCompletedWork(
  messages: MessageDisplay[],
  options: CollapseWorkOptions
): RunProjection[] {
  const runs: RunProjection[] = [];
  let current: RunProjection | null = null;
  let runIndex = 0;

  const startRun = (delimiter: MessageDisplay | null): RunProjection => {
    const projection: RunProjection = {
      id: delimiter?.id ?? `prelude-${runIndex}`,
      userMessage: delimiter,
      assistantMessage: null,
      interstitialAssistantMessages: [],
      toolCalls: [],
      durationMs: 0,
      shouldCollapse: false,
      hasFailure: false,
    };
    runIndex += 1;
    return projection;
  };

  for (const message of messages) {
    if (message.role === 'user') {
      if (current !== null) {
        runs.push(current);
      }
      current = startRun(message);
      continue;
    }

    if (current === null) {
      current = startRun(null);
    }

    if (message.role === 'assistant') {
      const isDeliverable = messageIsDeliverable(message);
      // Collect tool calls attached to any assistant message inside the run.
      for (const tc of message.toolCalls) {
        current.toolCalls.push(tc);
        if (tc.status === 'failed') {
          current.hasFailure = true;
        }
        const started = tc.startedAt;
        const finished = tc.completedAt;
        if (typeof started === 'number' && typeof finished === 'number' && finished >= started) {
          current.durationMs += finished - started;
        }
      }
      if (isDeliverable) {
        // The last deliverable in the run wins. In practice there is at
        // most one per run because the orchestrator emits a single final
        // assistant message per turn, but be defensive.
        current.assistantMessage = message;
      } else {
        current.interstitialAssistantMessages.push(message);
      }
    }
    // system-role messages are ignored for run boundary detection; the
    // MessageArea already filters them out of the visible transcript.
  }

  if (current !== null) {
    runs.push(current);
  }

  const lastIndex = runs.length - 1;
  return runs.map((run, index) => {
    const isTrailing = index === lastIndex;
    const hasDeliverable = run.assistantMessage !== null;
    const trailingReady = !options.isStreaming && hasDeliverable;
    // Runs with zero tool calls have nothing to collapse — always render inline.
    const hasCollapsibleWork = run.toolCalls.length > 0;
    // Failed / cancelled runs stay expanded so the user sees the failure
    // without interaction.
    const canCollapse = hasCollapsibleWork && !run.hasFailure;
    const shouldCollapse = canCollapse && (!isTrailing || trailingReady);
    return { ...run, shouldCollapse };
  });
}

/**
 * A message is a deliverable when it has non-empty textual content OR
 * carries at least one image attachment. Assistant messages that exist
 * purely to host tool calls (no text, no media) are not deliverables
 * and get folded into the WorkActivity summary.
 */
function messageIsDeliverable(message: MessageDisplay): boolean {
  const hasText = typeof message.content === 'string' && message.content.trim().length > 0;
  const hasImages = Array.isArray(message.images) && message.images.length > 0;
  return hasText || hasImages;
}
