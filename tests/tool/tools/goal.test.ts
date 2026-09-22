/**
 * Tests for the `goal` tool (issue #1804).
 *
 * Covers:
 *  - Arms `session.metadata.goal` with `armed: true` on the active session
 *  - Rejects empty descriptions
 *  - Handles missing session manager (test-harness fallback)
 *  - Publishes `SessionGoalUpdated` on the bus
 *  - Passes through the permission manager (using the `goal` action)
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';

import { goalTool } from '../../../src/tool/tools/goal.js';
import { SessionManager } from '../../../src/core/sessionManager.js';
import {
  PermissionManager,
  setPermissionManager,
  getPermissionManager,
} from '../../../src/permission/index.js';
import { SessionGoalUpdated } from '../../../src/bus/index.js';

function makeSessionsDir(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'alexi-goal-test-'));
}

describe('goal tool', () => {
  let sessionsDir: string;
  let sessionManager: SessionManager;

  beforeEach(() => {
    sessionsDir = makeSessionsDir();
    sessionManager = new SessionManager({ sessionsDir });
    // Allow everything so the tool call is not blocked by an interactive
    // permission prompt in the test harness.
    setPermissionManager(
      new PermissionManager([
        {
          id: 'allow-goal',
          decision: 'allow',
          actions: ['goal'],
          priority: 100,
        },
      ])
    );
  });

  afterEach(() => {
    // Reset the singleton so other tests get the default rule set again.
    setPermissionManager(new PermissionManager());
    fs.rmSync(sessionsDir, { recursive: true, force: true });
  });

  it('arms the goal on active session metadata and returns armed=true', async () => {
    const session = sessionManager.createSession('test-model');
    const result = await goalTool.execute(
      { description: 'ship the widget' },
      { workdir: '/tmp', sessionManager }
    );

    expect(result.success).toBe(true);
    expect(result.data?.armed).toBe(true);
    expect(result.data?.description).toBe('ship the widget');
    expect(session.metadata.goal).toBeDefined();
    expect(session.metadata.goal?.description).toBe('ship the widget');
    expect(session.metadata.goal?.armed).toBe(true);
    expect(typeof session.metadata.goal?.createdAt).toBe('number');
  });

  it('records the optional target when provided', async () => {
    sessionManager.createSession('test-model');
    const result = await goalTool.execute(
      { description: 'land the feature', target: 'PR #42' },
      { workdir: '/tmp', sessionManager }
    );

    expect(result.success).toBe(true);
    expect(result.data?.target).toBe('PR #42');
    expect(sessionManager.getCurrentSession()?.metadata.goal?.target).toBe('PR #42');
  });

  it('strips whitespace-only targets to undefined', async () => {
    sessionManager.createSession('test-model');
    const result = await goalTool.execute(
      { description: 'do it', target: '   ' },
      { workdir: '/tmp', sessionManager }
    );

    expect(result.success).toBe(true);
    expect(result.data?.target).toBeUndefined();
  });

  it('rejects an empty description', async () => {
    sessionManager.createSession('test-model');
    const result = await goalTool.execute(
      { description: '   ' },
      { workdir: '/tmp', sessionManager }
    );

    expect(result.success).toBe(false);
    expect(result.error).toContain('empty');
  });

  it('errors when no active session exists', async () => {
    // Do NOT call createSession — the manager has no active session.
    const result = await goalTool.execute(
      { description: 'anything' },
      { workdir: '/tmp', sessionManager }
    );
    expect(result.success).toBe(false);
    expect(result.error).toContain('No active session');
  });

  it('falls back to a transient result when no session manager is attached', async () => {
    const result = await goalTool.execute({ description: 'transient goal' }, { workdir: '/tmp' });

    expect(result.success).toBe(true);
    expect(result.data?.armed).toBe(true);
    expect(result.hint).toBeDefined();
  });

  it('publishes SessionGoalUpdated when arming a goal', async () => {
    const session = sessionManager.createSession('test-model');
    const received: Array<{
      sessionId: string;
      description: string | null;
      armed: boolean;
    }> = [];
    const unsub = SessionGoalUpdated.subscribe((evt) => {
      received.push({
        sessionId: evt.sessionId,
        description: evt.description,
        armed: evt.armed,
      });
    });
    try {
      await goalTool.execute({ description: 'observed goal' }, { workdir: '/tmp', sessionManager });
    } finally {
      unsub();
    }

    expect(received.length).toBeGreaterThan(0);
    const last = received[received.length - 1];
    expect(last.sessionId).toBe(session.metadata.id);
    expect(last.description).toBe('observed goal');
    expect(last.armed).toBe(true);
  });

  it('is denied when the permission manager rejects the goal action', async () => {
    setPermissionManager(
      new PermissionManager([
        {
          id: 'deny-goal',
          decision: 'deny',
          actions: ['goal'],
          priority: 100,
        },
      ])
    );

    sessionManager.createSession('test-model');
    const result = await goalTool.execute(
      { description: 'blocked' },
      { workdir: '/tmp', sessionManager }
    );

    expect(result.success).toBe(false);
    expect(result.error).toContain('User rejected goal');
    // Metadata should not have been touched
    expect(sessionManager.getCurrentSession()?.metadata.goal).toBeUndefined();
    // Restore for cleanup
    setPermissionManager(getPermissionManager());
  });
});
