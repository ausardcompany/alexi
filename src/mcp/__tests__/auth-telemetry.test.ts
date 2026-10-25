/**
 * Tests for the MCP sign-in telemetry pairing tracker. We assert the
 * core invariant: every `start` is paired with exactly one `complete`,
 * even under displacement, double-complete, and shutdown.
 */

import { describe, expect, it } from 'vitest';
import { McpAuthTelemetry, type SignInEvent } from '../auth-telemetry.js';

function recorder(): { events: SignInEvent[]; emit: (e: SignInEvent) => void } {
  const events: SignInEvent[] = [];
  return { events, emit: (e) => events.push(e) };
}

describe('McpAuthTelemetry', () => {
  it('pairs a successful start with a complete', () => {
    const { events, emit } = recorder();
    const t = new McpAuthTelemetry(emit, () => 1000);
    t.start('flow-1', 'server-a');
    t.complete('flow-1', 'success');

    expect(events).toHaveLength(2);
    expect(events[0]).toMatchObject({ kind: 'start', flowId: 'flow-1', serverId: 'server-a' });
    expect(events[1]).toMatchObject({
      kind: 'complete',
      flowId: 'flow-1',
      serverId: 'server-a',
      outcome: 'success',
    });
    expect(t.inflightCount()).toBe(0);
  });

  it('displaces a prior flow for the same server', () => {
    const { events, emit } = recorder();
    const t = new McpAuthTelemetry(emit, () => 2000);
    t.start('flow-1', 'server-a');
    t.start('flow-2', 'server-a');

    // Expect: start(1), complete(1, displaced), start(2).
    expect(events.map((e) => `${e.kind}:${e.flowId}:${e.outcome ?? ''}`)).toEqual([
      'start:flow-1:',
      'complete:flow-1:displaced',
      'start:flow-2:',
    ]);
    expect(t.inflightCount()).toBe(1);
  });

  it('does NOT displace flows for other servers', () => {
    const { events, emit } = recorder();
    const t = new McpAuthTelemetry(emit, () => 3000);
    t.start('flow-1', 'server-a');
    t.start('flow-2', 'server-b');

    expect(events).toHaveLength(2);
    expect(events.every((e) => e.kind === 'start')).toBe(true);
    expect(t.inflightCount()).toBe(2);
  });

  it('is idempotent on double-complete', () => {
    const { events, emit } = recorder();
    const t = new McpAuthTelemetry(emit, () => 4000);
    t.start('flow-1', 'server-a');
    t.complete('flow-1', 'failure', 'network');
    t.complete('flow-1', 'success'); // no-op

    expect(events).toHaveLength(2);
    expect(events[1]).toMatchObject({ outcome: 'failure', error: 'network' });
  });

  it('closes all outstanding flows as interrupt on shutdown', () => {
    const { events, emit } = recorder();
    const t = new McpAuthTelemetry(emit, () => 5000);
    t.start('flow-1', 'server-a');
    t.start('flow-2', 'server-b');
    t.shutdown();

    const completes = events.filter((e) => e.kind === 'complete');
    expect(completes).toHaveLength(2);
    expect(completes.every((e) => e.outcome === 'interrupt')).toBe(true);
    expect(t.inflightCount()).toBe(0);
  });

  it('reports durationMs between start and complete', () => {
    const { events, emit } = recorder();
    let clock = 1000;
    const t = new McpAuthTelemetry(emit, () => clock);
    t.start('flow-1', 'server-a');
    clock = 1750;
    t.complete('flow-1', 'success');

    const complete = events.find((e) => e.kind === 'complete');
    expect(complete?.durationMs).toBe(750);
  });

  it('silently ignores complete() for an unknown flow', () => {
    const { events, emit } = recorder();
    const t = new McpAuthTelemetry(emit, () => 6000);
    t.complete('nope', 'success');
    expect(events).toHaveLength(0);
  });
});
