import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs/promises';
import * as os from 'os';
import * as path from 'path';

import { CostTracker } from '../../src/core/costTracker.js';
import type { Message, Session, SessionMetadata } from '../../src/core/sessionManager.js';
import { getAgentUsage } from '../../src/core/agentUsage.js';

function makeMessage(
  role: Message['role'],
  content: string,
  timestamp: number,
  tokens?: Message['tokens']
): Message {
  const msg: Message = { role, content, timestamp };
  if (tokens) {
    msg.tokens = tokens;
  }
  return msg;
}

function makeSession(
  partial: Partial<SessionMetadata> & { id: string },
  messages: Message[]
): Session {
  const created = partial.created ?? Date.parse('2026-10-17T10:00:00Z');
  const updated = partial.updated ?? messages[messages.length - 1]?.timestamp ?? created;
  const metadata: SessionMetadata = {
    id: partial.id,
    created,
    updated,
    modelId: partial.modelId ?? 'gpt-4o',
    totalTokens: partial.totalTokens ?? 0,
    messageCount: messages.length,
    title: partial.title,
    workdir: partial.workdir,
    parentSessionId: partial.parentSessionId,
    agent: partial.agent,
    lastAccessedAt: partial.lastAccessedAt ?? updated,
  };
  return { metadata, messages };
}

describe('getAgentUsage', () => {
  let sessionsDir: string;
  let tempDir: string;
  let tracker: CostTracker;

  async function writeSession(session: Session): Promise<void> {
    const file = path.join(sessionsDir, `${session.metadata.id}.json`);
    await fs.writeFile(file, JSON.stringify(session, null, 2), 'utf-8');
  }

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'agent-usage-'));
    sessionsDir = path.join(tempDir, 'sessions');
    await fs.mkdir(sessionsDir, { recursive: true });
    // Use a cost tracker with its own data dir so the test never touches
    // the real `~/.alexi/cost-history.json`. The pricing table is static
    // on the class, so a fresh tracker produces identical cost figures.
    const trackerDataDir = path.join(tempDir, 'cost');
    await fs.mkdir(trackerDataDir, { recursive: true });
    tracker = new CostTracker({ dataDir: trackerDataDir });
  });

  afterEach(async () => {
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  it('returns empty array when sessions directory is missing', () => {
    const reports = getAgentUsage(path.join(tempDir, 'does-not-exist'), { costTracker: tracker });
    expect(reports).toEqual([]);
  });

  it('returns empty array when sessions directory is empty', () => {
    const reports = getAgentUsage(sessionsDir, { costTracker: tracker });
    expect(reports).toEqual([]);
  });

  it('aggregates a single session into one run under its agent slug', async () => {
    const t0 = Date.parse('2026-10-17T10:00:00Z');
    await writeSession(
      makeSession(
        { id: 's1', agent: 'code', modelId: 'gpt-4o', created: t0, updated: t0 + 5_000 },
        [
          makeMessage('user', 'hi', t0),
          makeMessage('assistant', 'ok', t0 + 1_000, { input: 100, output: 50 }),
          makeMessage('user', 'again', t0 + 2_000),
          makeMessage('assistant', 'ok', t0 + 4_000, { input: 50, output: 25 }),
        ]
      )
    );

    const reports = getAgentUsage(sessionsDir, { costTracker: tracker });

    expect(reports).toHaveLength(1);
    const [report] = reports;
    expect(report.agentId).toBe('code');
    expect(report.runCount).toBe(1);
    expect(report.sessionCount).toBe(1);
    expect(report.totalInputTokens).toBe(150);
    expect(report.totalOutputTokens).toBe(75);
    expect(report.totalReasoningTokens).toBe(0);

    const [run] = report.runs;
    expect(run.id).toBe('s1');
    expect(run.outcome).toBe('completed');
    expect(run.messageCount).toBe(4);
    // 1 + 1 + 2 seconds (all under the idle threshold) = 4_000 ms.
    expect(run.activeTimeMs).toBe(4_000);

    const expectedCost = tracker.calculateCost('gpt-4o', 150, 75);
    expect(run.cost).toBeCloseTo(expectedCost, 10);
    expect(report.totalCost).toBeCloseTo(expectedCost, 10);
  });

  it('groups runs by agent and sorts runs newest-first by startedAt then id', async () => {
    const t0 = Date.parse('2026-10-01T10:00:00Z');
    await writeSession(
      makeSession({ id: 'oldest', agent: 'code', created: t0, updated: t0 + 1_000 }, [
        makeMessage('assistant', 'done', t0, { input: 10, output: 10 }),
      ])
    );
    await writeSession(
      makeSession(
        { id: 'newer-a', agent: 'code', created: t0 + 86_400_000, updated: t0 + 86_401_000 },
        [makeMessage('assistant', 'done', t0 + 86_400_000, { input: 20, output: 20 })]
      )
    );
    await writeSession(
      makeSession(
        { id: 'newer-b', agent: 'code', created: t0 + 86_400_000, updated: t0 + 86_401_000 },
        [makeMessage('assistant', 'done', t0 + 86_400_000, { input: 30, output: 30 })]
      )
    );
    await writeSession(
      makeSession(
        { id: 'review-1', agent: 'review', created: t0 + 172_800_000, updated: t0 + 172_801_000 },
        [makeMessage('assistant', 'done', t0 + 172_800_000, { input: 5, output: 5 })]
      )
    );

    const reports = getAgentUsage(sessionsDir, { costTracker: tracker });

    expect(reports.map((r) => r.agentId)).toEqual(['review', 'code']);
    const codeReport = reports.find((r) => r.agentId === 'code')!;
    expect(codeReport.runs.map((r) => r.id)).toEqual(['newer-b', 'newer-a', 'oldest']);
  });

  it('attributes subagent spend to the subagent, not the parent (no double counting)', async () => {
    const t0 = Date.parse('2026-10-17T10:00:00Z');
    await writeSession(
      makeSession({ id: 'parent', agent: 'code', created: t0, updated: t0 + 10_000 }, [
        makeMessage('user', 'please', t0),
        makeMessage('assistant', 'done', t0 + 1_000, { input: 100, output: 100 }),
      ])
    );
    await writeSession(
      makeSession(
        {
          id: 'child',
          agent: 'explore',
          parentSessionId: 'parent',
          created: t0 + 500,
          updated: t0 + 2_000,
        },
        [
          makeMessage('user', 'search', t0 + 500),
          makeMessage('assistant', 'results', t0 + 1_500, { input: 200, output: 200 }),
        ]
      )
    );

    const reports = getAgentUsage(sessionsDir, { costTracker: tracker });

    const parentReport = reports.find((r) => r.agentId === 'code')!;
    const childReport = reports.find((r) => r.agentId === 'explore')!;

    expect(parentReport.totalInputTokens).toBe(100);
    expect(parentReport.totalOutputTokens).toBe(100);
    expect(childReport.totalInputTokens).toBe(200);
    expect(childReport.totalOutputTokens).toBe(200);
    // Direct cost only — the sum of the two agents' spend equals the
    // sum of all session cost (no double-count).
    const parentCost = tracker.calculateCost('gpt-4o', 100, 100);
    const childCost = tracker.calculateCost('gpt-4o', 200, 200);
    expect(parentReport.totalCost).toBeCloseTo(parentCost, 10);
    expect(childReport.totalCost).toBeCloseTo(childCost, 10);
    expect(childReport.runs[0].parentSessionId).toBe('parent');
  });

  it('filters by agentId', async () => {
    const t0 = Date.parse('2026-10-17T10:00:00Z');
    await writeSession(
      makeSession({ id: 's1', agent: 'code', created: t0, updated: t0 }, [
        makeMessage('assistant', 'ok', t0, { input: 10, output: 10 }),
      ])
    );
    await writeSession(
      makeSession({ id: 's2', agent: 'review', created: t0 + 1_000, updated: t0 + 1_000 }, [
        makeMessage('assistant', 'ok', t0 + 1_000, { input: 20, output: 20 }),
      ])
    );

    const reports = getAgentUsage(sessionsDir, { costTracker: tracker, agentId: 'review' });

    expect(reports).toHaveLength(1);
    expect(reports[0].agentId).toBe('review');
    expect(reports[0].runs[0].id).toBe('s2');
  });

  it('filters by date range (inclusive on both ends)', async () => {
    const t0 = Date.parse('2026-10-01T00:00:00Z');
    await writeSession(
      makeSession({ id: 'before', agent: 'code', created: t0, updated: t0 }, [
        makeMessage('assistant', 'ok', t0, { input: 10, output: 10 }),
      ])
    );
    await writeSession(
      makeSession(
        { id: 'inside', agent: 'code', created: t0 + 5 * 86_400_000, updated: t0 + 5 * 86_400_000 },
        [makeMessage('assistant', 'ok', t0 + 5 * 86_400_000, { input: 20, output: 20 })]
      )
    );
    await writeSession(
      makeSession(
        {
          id: 'after',
          agent: 'code',
          created: t0 + 10 * 86_400_000,
          updated: t0 + 10 * 86_400_000,
        },
        [makeMessage('assistant', 'ok', t0 + 10 * 86_400_000, { input: 30, output: 30 })]
      )
    );

    const reports = getAgentUsage(sessionsDir, {
      costTracker: tracker,
      startDate: new Date(t0 + 1 * 86_400_000),
      endDate: new Date(t0 + 9 * 86_400_000),
    });

    expect(reports).toHaveLength(1);
    const [report] = reports;
    expect(report.runs.map((r) => r.id)).toEqual(['inside']);
  });

  it('surfaces sessions with no agent slug under the "(unknown)" bucket', async () => {
    const t0 = Date.parse('2026-10-17T10:00:00Z');
    await writeSession(
      makeSession({ id: 'legacy', created: t0, updated: t0 }, [
        makeMessage('assistant', 'ok', t0, { input: 1, output: 1 }),
      ])
    );

    const reports = getAgentUsage(sessionsDir, { costTracker: tracker });
    expect(reports).toHaveLength(1);
    expect(reports[0].agentId).toBe('(unknown)');
  });

  it('excludes idle gaps larger than the threshold from activeTimeMs', async () => {
    const t0 = Date.parse('2026-10-17T10:00:00Z');
    await writeSession(
      makeSession({ id: 's1', agent: 'code', created: t0, updated: t0 + 7_200_000 }, [
        makeMessage('user', 'hi', t0),
        makeMessage('assistant', 'ok', t0 + 1_000, { input: 10, output: 10 }),
        // Simulate the user walking away for an hour.
        makeMessage('user', 'back', t0 + 3_600_000),
        makeMessage('assistant', 'ok', t0 + 3_602_000, { input: 10, output: 10 }),
      ])
    );

    const reports = getAgentUsage(sessionsDir, { costTracker: tracker });
    const [run] = reports[0].runs;
    // Only two sub-threshold gaps contribute: 1_000 ms + 2_000 ms.
    // The 1-hour idle gap is excluded by the default 5-minute threshold.
    expect(run.activeTimeMs).toBe(3_000);
  });

  it('classifies outcome as running when the last message is from the user', async () => {
    const t0 = Date.parse('2026-10-17T10:00:00Z');
    await writeSession(
      makeSession({ id: 's1', agent: 'code', created: t0, updated: t0 + 1_000 }, [
        makeMessage('user', 'first turn', t0),
        makeMessage('assistant', 'reply', t0 + 500, { input: 10, output: 10 }),
        makeMessage('user', 'second turn pending', t0 + 1_000),
      ])
    );

    const reports = getAgentUsage(sessionsDir, { costTracker: tracker });
    expect(reports[0].runs[0].outcome).toBe('running');
  });

  it('classifies outcome as errored when the trailing system message starts with "Error:"', async () => {
    const t0 = Date.parse('2026-10-17T10:00:00Z');
    await writeSession(
      makeSession({ id: 's1', agent: 'code', created: t0, updated: t0 + 1_000 }, [
        makeMessage('user', 'please', t0),
        makeMessage('assistant', 'partial', t0 + 500, { input: 10, output: 10 }),
        makeMessage('system', 'Error: context overflow during tool call', t0 + 1_000),
      ])
    );

    const reports = getAgentUsage(sessionsDir, { costTracker: tracker });
    const report = reports[0];
    expect(report.runs[0].outcome).toBe('errored');
    expect(report.errorCount).toBe(1);
  });

  it('counts reasoning tokens separately but includes them in cost', async () => {
    const t0 = Date.parse('2026-10-17T10:00:00Z');
    await writeSession(
      makeSession(
        { id: 's1', agent: 'code', modelId: 'gpt-4o', created: t0, updated: t0 + 1_000 },
        [
          makeMessage('assistant', 'reply', t0 + 500, {
            input: 100,
            output: 50,
            reasoning: 25,
          }),
        ]
      )
    );

    const reports = getAgentUsage(sessionsDir, { costTracker: tracker });
    const [run] = reports[0].runs;
    expect(run.inputTokens).toBe(100);
    expect(run.outputTokens).toBe(50);
    expect(run.reasoningTokens).toBe(25);
    // Reasoning tokens are billed at the output rate — pass (output + reasoning).
    const expectedCost = tracker.calculateCost('gpt-4o', 100, 75);
    expect(run.cost).toBeCloseTo(expectedCost, 10);
  });

  it('ignores non-JSON files and silently skips corrupt session files', async () => {
    const t0 = Date.parse('2026-10-17T10:00:00Z');
    await writeSession(
      makeSession({ id: 'good', agent: 'code', created: t0, updated: t0 }, [
        makeMessage('assistant', 'ok', t0, { input: 10, output: 10 }),
      ])
    );
    await fs.writeFile(path.join(sessionsDir, 'README.txt'), 'not a session', 'utf-8');
    await fs.writeFile(path.join(sessionsDir, 'broken.json'), '{not json', 'utf-8');
    await fs.writeFile(path.join(sessionsDir, 'wrong-shape.json'), '{"foo":1}', 'utf-8');

    const reports = getAgentUsage(sessionsDir, { costTracker: tracker });
    expect(reports).toHaveLength(1);
    expect(reports[0].runs).toHaveLength(1);
    expect(reports[0].runs[0].id).toBe('good');
  });

  it('aggregates totals correctly across many runs for one agent', async () => {
    const base = Date.parse('2026-10-17T10:00:00Z');
    for (let i = 0; i < 5; i++) {
      await writeSession(
        makeSession(
          {
            id: `s${i}`,
            agent: 'code',
            modelId: 'gpt-4o',
            created: base + i * 1_000,
            updated: base + i * 1_000,
          },
          [
            makeMessage('assistant', 'ok', base + i * 1_000, {
              input: 100,
              output: 50,
            }),
          ]
        )
      );
    }

    const reports = getAgentUsage(sessionsDir, { costTracker: tracker });
    expect(reports).toHaveLength(1);
    const [report] = reports;
    expect(report.runCount).toBe(5);
    expect(report.totalInputTokens).toBe(500);
    expect(report.totalOutputTokens).toBe(250);
    const perRunCost = tracker.calculateCost('gpt-4o', 100, 50);
    expect(report.totalCost).toBeCloseTo(perRunCost * 5, 10);
    expect(report.lastRunAt).toBe(base + 4_000);
  });

  it('works without an explicit cost tracker (uses internal default)', async () => {
    const t0 = Date.parse('2026-10-17T10:00:00Z');
    await writeSession(
      makeSession({ id: 's1', agent: 'code', modelId: 'gpt-4o', created: t0, updated: t0 }, [
        makeMessage('assistant', 'ok', t0, { input: 100, output: 50 }),
      ])
    );

    const reports = getAgentUsage(sessionsDir);
    expect(reports).toHaveLength(1);
    expect(reports[0].runs[0].cost).toBeGreaterThan(0);
  });
});
