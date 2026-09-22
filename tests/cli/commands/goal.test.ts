/**
 * Tests for the `alexi goal` CLI command helpers (issue #1804).
 *
 * These tests exercise the pure `setGoal` / `clearGoal` / `statusGoal`
 * helpers exported from `src/cli/commands/goal.ts` instead of driving
 * Commander end-to-end, mirroring the pattern used by other CLI command
 * test files under `tests/cli/commands/`.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';

import { SessionManager } from '../../../src/core/sessionManager.js';
import { setGoal, clearGoal, statusGoal, formatGoal } from '../../../src/cli/commands/goal.js';

function makeSessionsDir(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'alexi-goal-cli-test-'));
}

describe('alexi goal CLI helpers', () => {
  let sessionsDir: string;
  let manager: SessionManager;

  beforeEach(() => {
    sessionsDir = makeSessionsDir();
    manager = new SessionManager({ sessionsDir });
  });

  afterEach(() => {
    fs.rmSync(sessionsDir, { recursive: true, force: true });
  });

  it('setGoal arms a goal on the most recent session when --session is omitted', () => {
    const session = manager.createSession('test-model');
    const result = setGoal(manager, 'improve tests', {});
    expect(result.ok).toBe(true);
    expect(result.sessionId).toBe(session.metadata.id);
    expect(result.goal?.description).toBe('improve tests');
    expect(result.goal?.armed).toBe(true);
    // Persisted on disk
    const reloaded = new SessionManager({ sessionsDir }).loadSession(session.metadata.id);
    expect(reloaded?.metadata.goal?.description).toBe('improve tests');
  });

  it('setGoal targets a specific session id when --session is provided', () => {
    const a = manager.createSession('m1');
    const b = manager.createSession('m2');
    const result = setGoal(manager, 'aim at a', { session: a.metadata.id });
    expect(result.ok).toBe(true);
    expect(result.sessionId).toBe(a.metadata.id);
    // b should be untouched
    const reloaded = new SessionManager({ sessionsDir }).loadSession(b.metadata.id);
    expect(reloaded?.metadata.goal).toBeUndefined();
  });

  it('setGoal rejects empty descriptions', () => {
    manager.createSession('m');
    const result = setGoal(manager, '   ', {});
    expect(result.ok).toBe(false);
    expect(result.message).toContain('empty');
  });

  it('setGoal errors when no sessions exist', () => {
    const result = setGoal(manager, 'nowhere', {});
    expect(result.ok).toBe(false);
    expect(result.message).toContain('No sessions');
  });

  it('setGoal records the optional target', () => {
    const s = manager.createSession('m');
    const result = setGoal(manager, 'ship it', { target: 'PR #99' });
    expect(result.ok).toBe(true);
    expect(result.goal?.target).toBe('PR #99');
    const reloaded = new SessionManager({ sessionsDir }).loadSession(s.metadata.id);
    expect(reloaded?.metadata.goal?.target).toBe('PR #99');
  });

  it('statusGoal returns a not-set message when no goal is armed', () => {
    manager.createSession('m');
    const result = statusGoal(manager, {});
    expect(result.ok).toBe(true);
    expect(result.goal).toBeUndefined();
    expect(result.message).toContain('No goal set');
  });

  it('statusGoal shows the active goal when one is armed', () => {
    manager.createSession('m');
    setGoal(manager, 'observed', { target: 'file.ts' });
    const result = statusGoal(manager, {});
    expect(result.ok).toBe(true);
    expect(result.goal?.description).toBe('observed');
    expect(result.message).toContain('observed');
    expect(result.message).toContain('file.ts');
  });

  it('clearGoal removes the goal metadata', () => {
    const s = manager.createSession('m');
    setGoal(manager, 'temporary', {});
    const clearResult = clearGoal(manager, {});
    expect(clearResult.ok).toBe(true);
    const reloaded = new SessionManager({ sessionsDir }).loadSession(s.metadata.id);
    expect(reloaded?.metadata.goal).toBeUndefined();
  });

  it('clearGoal succeeds even when nothing is armed', () => {
    manager.createSession('m');
    const result = clearGoal(manager, {});
    expect(result.ok).toBe(true);
    expect(result.message).toMatch(/nothing to clear/i);
  });

  it('formatGoal renders every populated field', () => {
    const rendered = formatGoal({
      description: 'do things',
      target: 'file.ts',
      armed: true,
      createdAt: 1_000_000_000_000,
    });
    expect(rendered).toContain('Goal: do things');
    expect(rendered).toContain('Target: file.ts');
    expect(rendered).toContain('Armed: yes');
    expect(rendered).toContain('Created:');
  });

  it('formatGoal handles the no-goal case', () => {
    const rendered = formatGoal(undefined);
    expect(rendered).toBe('No goal set for this session.');
  });
});
