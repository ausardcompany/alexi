/**
 * Agent Usage Aggregation
 *
 * Derives per-agent usage aggregates (cost, active time, tokens, outcomes)
 * from persisted session files without loading full transcripts into
 * memory beyond what is required to inspect each file.
 *
 * Pattern ported from Kilocode PR #15185 (project-scoped agent usage
 * aggregation). Alexi's session schema does not yet carry per-message
 * `agentId` or `parentID` linkage, so this module operates at the
 * session granularity: each on-disk session file contributes a single
 * "run" to the agent identified by {@link SessionMetadata.agent}. Child
 * sessions (`parentSessionId` populated) are treated as independent
 * runs attributed to the subagent that executed them, which avoids the
 * double-counting trap called out in the upstream PR — a parent
 * session's `totalTokens` is NOT propagated down from its subagent, so
 * summing both the parent and the child yields the correct direct cost
 * for each agent.
 *
 * Rationale for the session-run granularity:
 *   1. The current session schema (`SessionMetadata.agent`,
 *      `Message.tokens`, `Message.timestamp`) is sufficient to answer
 *      the "how much did <agent> cost this week?" question at session
 *      resolution. A finer per-message-run grouping would require
 *      extending the schema (see issue #2060 follow-up).
 *   2. Each session already represents a single agent run from the
 *      user's point of view — the TUI and CLI spawn one session per
 *      agent invocation.
 *   3. Subagent-spawned sessions carry their own `agent` slug and are
 *      stored as separate files, so attribution is clean.
 */

import fs from 'fs';
import os from 'os';
import path from 'path';

import type { Message, Session, SessionMetadata } from './sessionManager.js';
import { CostTracker } from './costTracker.js';

/**
 * Classification of a session run's final state.
 *
 * - `completed`: the session ended on an assistant turn with no error
 *   marker.
 * - `errored`: the last message is a system note that starts with
 *   `"Error:"`. Alexi's current schema has no dedicated error field, so
 *   this is a conservative heuristic — future schema extensions can
 *   replace it without breaking the public type.
 * - `running`: the last message is from the user (the assistant has
 *   not yet responded), or the session has no messages. A finished
 *   session that was aborted mid-turn also surfaces here, because the
 *   last persisted message is typically the user turn that triggered
 *   the aborted response.
 */
export type AgentRunOutcome = 'completed' | 'errored' | 'running';

/**
 * One aggregated run inside an {@link AgentUsageReport}. In the current
 * schema a run == a session, so {@link id} is the session id and
 * {@link startedAt} is the session's `created` timestamp. The fields
 * mirror the kilocode PR #15185 shape so callers can share rendering
 * code across projects.
 */
export interface AgentUsageRun {
  /** Session (== run) id. */
  id: string;
  /** `SessionMetadata.created` — millis since epoch. */
  startedAt: number;
  /** `SessionMetadata.updated` — millis since epoch. */
  endedAt: number;
  /** Model id recorded on the session, if any. */
  modelId?: string;
  /** Direct input tokens attributed to this run. */
  inputTokens: number;
  /** Direct output tokens attributed to this run. */
  outputTokens: number;
  /** Direct reasoning tokens attributed to this run (0 when absent). */
  reasoningTokens: number;
  /** Direct cost in USD, computed via {@link CostTracker.calculateCost}. */
  cost: number;
  /** Active time in milliseconds (idle gaps between turns excluded). */
  activeTimeMs: number;
  /** Final-state classification for this run. */
  outcome: AgentRunOutcome;
  /** Number of messages persisted on the session. */
  messageCount: number;
  /** Parent session id when this run was spawned as a subagent. */
  parentSessionId?: string;
}

/**
 * Per-agent aggregation across one or more {@link AgentUsageRun}s.
 */
export interface AgentUsageReport {
  /**
   * Agent slug (`SessionMetadata.agent`). Sessions created before the
   * `agent` field was introduced surface under the sentinel
   * `"(unknown)"` so operators can see legacy spend instead of it
   * silently disappearing.
   */
  agentId: string;
  /** Number of runs attributed to this agent. */
  runCount: number;
  /** Count of distinct sessions. Equal to {@link runCount} today. */
  sessionCount: number;
  /** Sum of {@link AgentUsageRun.cost}. */
  totalCost: number;
  /** Sum of {@link AgentUsageRun.inputTokens}. */
  totalInputTokens: number;
  /** Sum of {@link AgentUsageRun.outputTokens}. */
  totalOutputTokens: number;
  /** Sum of {@link AgentUsageRun.reasoningTokens}. */
  totalReasoningTokens: number;
  /** Sum of {@link AgentUsageRun.activeTimeMs}. */
  totalActiveTimeMs: number;
  /** Number of runs with outcome `errored`. */
  errorCount: number;
  /** Latest {@link AgentUsageRun.startedAt} across all runs. */
  lastRunAt: number;
  /** Runs sorted newest-first by `(startedAt, id)`. */
  runs: AgentUsageRun[];
}

export interface GetAgentUsageOptions {
  /**
   * When set, only runs for the given agent slug are returned. Matching
   * is case-sensitive and uses the raw session `agent` field.
   */
  agentId?: string;
  /**
   * Lower bound (inclusive) on run start time. Runs whose `startedAt`
   * is strictly before `startDate` are excluded.
   */
  startDate?: Date;
  /**
   * Upper bound (inclusive) on run start time. Runs whose `startedAt`
   * is strictly after `endDate` are excluded.
   */
  endDate?: Date;
  /**
   * Maximum gap in milliseconds between two consecutive messages that
   * still counts toward {@link AgentUsageRun.activeTimeMs}. Gaps larger
   * than this threshold are treated as idle time between turns and
   * excluded from the sum. Defaults to 5 minutes, which comfortably
   * covers a long tool-execution turn but excludes a user who stepped
   * away for an hour.
   */
  idleThresholdMs?: number;
  /**
   * Pre-constructed {@link CostTracker} used for cost calculations.
   * Tests inject a tracker with custom pricing to keep assertions
   * independent of the production price table. Defaults to a fresh
   * tracker rooted at a temporary (never-written-to) data directory,
   * so the aggregation query never touches `~/.alexi/cost-history.json`.
   */
  costTracker?: CostTracker;
}

const DEFAULT_IDLE_THRESHOLD_MS = 5 * 60 * 1000;
const UNKNOWN_AGENT = '(unknown)';

/**
 * Build the fallback cost tracker used when the caller does not supply
 * one. It writes to a per-call temporary directory so loading the
 * pricing table never collides with the user's real
 * `~/.alexi/cost-history.json`.
 */
function buildDefaultCostTracker(): CostTracker {
  const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'alexi-agent-usage-'));
  return new CostTracker({ dataDir });
}

/**
 * Attempt to parse one session file. Returns `null` for anything that
 * is not a readable, parseable session — the caller treats the file as
 * absent rather than letting one corrupt file abort the aggregation.
 */
function readSessionFile(sessionPath: string): Session | null {
  try {
    const content = fs.readFileSync(sessionPath, 'utf-8');
    const parsed = JSON.parse(content) as unknown;
    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      'metadata' in parsed &&
      'messages' in parsed
    ) {
      return parsed as Session;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Sum the active-time contribution of a single session's messages.
 * Gaps larger than `idleThreshold` are excluded; a per-gap guard
 * clamps negative deltas (which should not occur but can appear in
 * files edited by hand) to zero.
 */
function computeActiveTimeMs(messages: Message[], idleThreshold: number): number {
  if (messages.length < 2) {
    return 0;
  }
  let total = 0;
  for (let i = 1; i < messages.length; i++) {
    const prev = messages[i - 1];
    const curr = messages[i];
    const delta = curr.timestamp - prev.timestamp;
    if (delta <= 0) {
      continue;
    }
    if (delta > idleThreshold) {
      continue;
    }
    total += delta;
  }
  return total;
}

/**
 * Classify the outcome of a session based on its persisted messages.
 * See {@link AgentRunOutcome} for the semantics of each bucket.
 */
function classifyOutcome(messages: Message[]): AgentRunOutcome {
  if (messages.length === 0) {
    return 'running';
  }
  const last = messages[messages.length - 1];
  if (last.role === 'system' && last.content.trimStart().startsWith('Error:')) {
    return 'errored';
  }
  if (last.role === 'assistant') {
    return 'completed';
  }
  return 'running';
}

/**
 * Project a parsed session into an {@link AgentUsageRun}. The direct
 * cost is derived from the sum of per-message tokens so a session
 * whose `totalTokens` was lost (legacy file) still produces a defensible
 * estimate.
 */
function sessionToRun(
  session: Session,
  tracker: CostTracker,
  idleThreshold: number
): AgentUsageRun {
  const meta: SessionMetadata = session.metadata;
  let inputTokens = 0;
  let outputTokens = 0;
  let reasoningTokens = 0;

  for (const msg of session.messages) {
    const t = msg.tokens;
    if (!t) {
      continue;
    }
    inputTokens += t.input ?? 0;
    outputTokens += t.output ?? 0;
    reasoningTokens += t.reasoning ?? 0;
  }

  const modelId = meta.modelId ?? '';
  const cost = modelId
    ? tracker.calculateCost(modelId, inputTokens, outputTokens + reasoningTokens)
    : 0;

  return {
    id: meta.id,
    startedAt: meta.created,
    endedAt: meta.updated,
    modelId: meta.modelId,
    inputTokens,
    outputTokens,
    reasoningTokens,
    cost,
    activeTimeMs: computeActiveTimeMs(session.messages, idleThreshold),
    outcome: classifyOutcome(session.messages),
    messageCount: meta.messageCount,
    parentSessionId: meta.parentSessionId,
  };
}

/**
 * Compute per-agent usage aggregates by scanning every session JSON
 * file in `sessionsDir`. Returns one {@link AgentUsageReport} per
 * agent, each with its runs sorted newest-first by `(startedAt, id)`.
 *
 * The function is pure w.r.t. the filesystem — it reads but never
 * writes. Missing directories yield an empty array, mirroring
 * {@link SessionManager.listSessions}.
 */
export function getAgentUsage(
  sessionsDir: string,
  options: GetAgentUsageOptions = {}
): AgentUsageReport[] {
  const idleThreshold = options.idleThresholdMs ?? DEFAULT_IDLE_THRESHOLD_MS;
  const tracker = options.costTracker ?? buildDefaultCostTracker();
  const startMs = options.startDate ? options.startDate.getTime() : undefined;
  const endMs = options.endDate ? options.endDate.getTime() : undefined;

  let files: string[];
  try {
    files = fs.readdirSync(sessionsDir);
  } catch {
    return [];
  }

  const byAgent = new Map<string, AgentUsageRun[]>();

  for (const file of files) {
    if (!file.endsWith('.json')) {
      continue;
    }
    const session = readSessionFile(path.join(sessionsDir, file));
    if (!session) {
      continue;
    }
    const agentId = session.metadata.agent ?? UNKNOWN_AGENT;
    if (options.agentId !== undefined && options.agentId !== agentId) {
      continue;
    }
    const run = sessionToRun(session, tracker, idleThreshold);
    if (startMs !== undefined && run.startedAt < startMs) {
      continue;
    }
    if (endMs !== undefined && run.startedAt > endMs) {
      continue;
    }
    const list = byAgent.get(agentId);
    if (list) {
      list.push(run);
    } else {
      byAgent.set(agentId, [run]);
    }
  }

  const reports: AgentUsageReport[] = [];
  for (const [agentId, runs] of byAgent) {
    // Newest first by startedAt, deterministic tiebreak by id.
    runs.sort((a, b) => {
      if (b.startedAt !== a.startedAt) {
        return b.startedAt - a.startedAt;
      }
      return b.id.localeCompare(a.id);
    });

    let totalCost = 0;
    let totalInputTokens = 0;
    let totalOutputTokens = 0;
    let totalReasoningTokens = 0;
    let totalActiveTimeMs = 0;
    let errorCount = 0;
    let lastRunAt = 0;

    for (const run of runs) {
      totalCost += run.cost;
      totalInputTokens += run.inputTokens;
      totalOutputTokens += run.outputTokens;
      totalReasoningTokens += run.reasoningTokens;
      totalActiveTimeMs += run.activeTimeMs;
      if (run.outcome === 'errored') {
        errorCount += 1;
      }
      if (run.startedAt > lastRunAt) {
        lastRunAt = run.startedAt;
      }
    }

    reports.push({
      agentId,
      runCount: runs.length,
      sessionCount: runs.length,
      totalCost,
      totalInputTokens,
      totalOutputTokens,
      totalReasoningTokens,
      totalActiveTimeMs,
      errorCount,
      lastRunAt,
      runs,
    });
  }

  // Reports are sorted newest-first by `lastRunAt`, with the agent
  // slug as a stable tiebreak so callers rendering the output get a
  // deterministic order across invocations.
  reports.sort((a, b) => {
    if (b.lastRunAt !== a.lastRunAt) {
      return b.lastRunAt - a.lastRunAt;
    }
    return a.agentId.localeCompare(b.agentId);
  });

  return reports;
}
