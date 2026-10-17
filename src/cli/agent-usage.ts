/**
 * Project-scoped agent usage aggregation.
 *
 * Ports kilocode commits:
 *   - 88312a65b (introduce per-project agent usage records)
 *   - db5fb2ae1 (aggregation / rollup helpers for the CLI)
 *
 * Usage tracking is especially valuable for SAP consulting engagements
 * where several customer projects share the same AI Core deployment
 * budget — operators need to know "how many tokens did agent `code-fix`
 * burn on project `s4hana-migration` last week" without parsing raw
 * session JSONL by hand.
 *
 * This module exports:
 *
 *   - {@link AgentUsageRecord} — one row per agent run.
 *   - {@link aggregateByProject} — rolls a stream of records up into
 *     a per-project / per-agent summary table.
 *   - {@link formatUsageTable} — renders the summary as a plain-text
 *     table for the `alexi usage` CLI command.
 *
 * The record store itself (JSONL append, retention, redaction) is
 * handled by the caller — this module is pure functions over
 * in-memory data so it stays testable without filesystem fixtures.
 */

/**
 * One agent run. Shapes mirrored from the kilocode usage schema with
 * SAP-friendly additions: `project` is kept as a free-form string so
 * engagements can embed customer code, worktree id, or any other key
 * their cost tooling understands.
 */
export interface AgentUsageRecord {
  /** Session id this agent ran within. */
  sessionId: string;
  /** Agent identifier (`code-review`, `research`, custom agent name). */
  agent: string;
  /** Project / workspace key — opaque to this module. */
  project: string;
  /** Agent start time (epoch ms). */
  startedAt: number;
  /** Agent end time (epoch ms). Undefined for runs still in flight. */
  endedAt?: number;
  /** Terminal outcome. */
  outcome: 'success' | 'aborted' | 'error' | 'unknown';
  /** Prompt tokens consumed across the whole run. */
  tokensIn: number;
  /** Completion tokens produced across the whole run. */
  tokensOut: number;
  /** Billed cost in USD when the pricing catalog could resolve the model. */
  costUSD?: number;
}

/**
 * Rolled-up summary. `project` → `agent` → aggregate counters. Keeping
 * both levels nested makes rendering trivial (one row per project with
 * per-agent breakdown) and keeps the aggregation step O(n).
 */
export interface AgentUsageSummary {
  /** Rollup by project id. */
  byProject: Record<string, ProjectSummary>;
  /** Grand totals across every record. */
  totals: ProjectTotals;
}

export interface ProjectSummary {
  project: string;
  byAgent: Record<string, AgentTotals>;
  totals: ProjectTotals;
}

export interface AgentTotals {
  agent: string;
  runs: number;
  successes: number;
  failures: number;
  tokensIn: number;
  tokensOut: number;
  costUSD: number;
  durationMs: number;
}

export interface ProjectTotals {
  runs: number;
  successes: number;
  failures: number;
  tokensIn: number;
  tokensOut: number;
  costUSD: number;
  durationMs: number;
}

/**
 * Build an empty totals shell. Factored so {@link aggregateByProject}
 * and {@link formatUsageTable} stay symmetric.
 */
function emptyTotals(): ProjectTotals {
  return {
    runs: 0,
    successes: 0,
    failures: 0,
    tokensIn: 0,
    tokensOut: 0,
    costUSD: 0,
    durationMs: 0,
  };
}

/**
 * Aggregate a batch of usage records into a per-project / per-agent
 * summary. The function is pure: callers can safely pass a filtered
 * subset (e.g. "last 7 days") without the module having to know about
 * time windows.
 */
export function aggregateByProject(records: readonly AgentUsageRecord[]): AgentUsageSummary {
  const byProject: Record<string, ProjectSummary> = {};
  const totals = emptyTotals();

  for (const record of records) {
    const projectKey = record.project;
    const agentKey = record.agent;
    let project = byProject[projectKey];
    if (!project) {
      project = { project: projectKey, byAgent: {}, totals: emptyTotals() };
      byProject[projectKey] = project;
    }
    let agent = project.byAgent[agentKey];
    if (!agent) {
      agent = {
        agent: agentKey,
        runs: 0,
        successes: 0,
        failures: 0,
        tokensIn: 0,
        tokensOut: 0,
        costUSD: 0,
        durationMs: 0,
      };
      project.byAgent[agentKey] = agent;
    }

    const duration = record.endedAt !== undefined ? Math.max(0, record.endedAt - record.startedAt) : 0;
    const succeeded = record.outcome === 'success';
    const failed = record.outcome === 'error' || record.outcome === 'aborted';

    agent.runs += 1;
    if (succeeded) {
      agent.successes += 1;
    }
    if (failed) {
      agent.failures += 1;
    }
    agent.tokensIn += record.tokensIn;
    agent.tokensOut += record.tokensOut;
    if (record.costUSD !== undefined) {
      agent.costUSD += record.costUSD;
    }
    agent.durationMs += duration;

    project.totals.runs += 1;
    if (succeeded) {
      project.totals.successes += 1;
    }
    if (failed) {
      project.totals.failures += 1;
    }
    project.totals.tokensIn += record.tokensIn;
    project.totals.tokensOut += record.tokensOut;
    if (record.costUSD !== undefined) {
      project.totals.costUSD += record.costUSD;
    }
    project.totals.durationMs += duration;

    totals.runs += 1;
    if (succeeded) {
      totals.successes += 1;
    }
    if (failed) {
      totals.failures += 1;
    }
    totals.tokensIn += record.tokensIn;
    totals.tokensOut += record.tokensOut;
    if (record.costUSD !== undefined) {
      totals.costUSD += record.costUSD;
    }
    totals.durationMs += duration;
  }

  return { byProject, totals };
}

/**
 * Render a usage summary as a plain-text table. Columns stay narrow so
 * the output fits in a standard 100-col terminal without wrapping. The
 * caller is free to drop this and format differently (JSON, CSV) — the
 * primary artefact for programmatic consumers is the typed summary.
 */
export function formatUsageTable(summary: AgentUsageSummary): string {
  const lines: string[] = [];
  lines.push('Project / Agent          Runs  OK  Err   TokIn   TokOut   USD      Duration');
  lines.push('------------------------ ----- --- --- ------- -------- -------- --------');
  const projectKeys = Object.keys(summary.byProject).sort();
  for (const projectKey of projectKeys) {
    const project = summary.byProject[projectKey];
    if (!project) {
      continue;
    }
    lines.push(formatRow(project.project, project.totals));
    const agentKeys = Object.keys(project.byAgent).sort();
    for (const agentKey of agentKeys) {
      const agent = project.byAgent[agentKey];
      if (!agent) {
        continue;
      }
      lines.push(formatRow('  ' + agent.agent, agent));
    }
  }
  lines.push('------------------------ ----- --- --- ------- -------- -------- --------');
  lines.push(formatRow('TOTAL', summary.totals));
  return lines.join('\n');
}

function formatRow(label: string, t: ProjectTotals | AgentTotals): string {
  const pad = (v: string | number, w: number): string => String(v).padEnd(w);
  const r = (v: string | number, w: number): string => String(v).padStart(w);
  return [
    pad(label, 24),
    r(t.runs, 5),
    r(t.successes, 3),
    r(t.failures, 3),
    r(t.tokensIn, 7),
    r(t.tokensOut, 8),
    r(t.costUSD.toFixed(3), 8),
    r(formatDuration(t.durationMs), 8),
  ].join(' ');
}

/**
 * Short human-readable duration formatter. Shared with other CLI
 * commands could lift to utils later; kept inline for now because the
 * usage table is its only consumer.
 */
function formatDuration(ms: number): string {
  if (ms < 1_000) {
    return `${ms}ms`;
  }
  const seconds = Math.round(ms / 1_000);
  if (seconds < 60) {
    return `${seconds}s`;
  }
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = (minutes / 60).toFixed(1);
  return `${hours}h`;
}
