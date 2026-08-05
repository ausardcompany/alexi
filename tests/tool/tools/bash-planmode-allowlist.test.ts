/**
 * Integration tests for the plan-mode read-only bash allowlist.
 *
 * Exercises `PlanModeManager.checkToolExecution` with real command
 * strings under the three interesting configurations:
 *
 * 1. Plan mode + `allowReadOnlyBash: true`  — read-only bash allowed,
 *    mutating bash still blocked.
 * 2. Plan mode + `allowReadOnlyBash: false` — all bash blocked (default).
 * 3. Build mode                              — all bash allowed
 *    regardless of the config.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  getPlanModeManager,
  configurePlanMode,
  resetPlanModeConfig,
} from '../../../src/plan/index.js';

describe('plan-mode read-only bash allowlist', () => {
  beforeEach(() => {
    // Fresh manager state each test.
    getPlanModeManager().setMode('build');
    resetPlanModeConfig();
  });

  afterEach(() => {
    getPlanModeManager().setMode('build');
    resetPlanModeConfig();
  });

  describe('plan mode + allowReadOnlyBash=true', () => {
    beforeEach(() => {
      configurePlanMode({ allowReadOnlyBash: true });
      getPlanModeManager().setMode('plan');
    });

    it('allows read-only bash commands', () => {
      const mgr = getPlanModeManager();
      expect(mgr.checkToolExecution('bash', 'ls -la')).toBe(true);
      expect(mgr.checkToolExecution('bash', 'cat README.md')).toBe(true);
      expect(mgr.checkToolExecution('bash', 'grep -r foo src')).toBe(true);
      expect(mgr.checkToolExecution('bash', 'git status')).toBe(true);
      expect(mgr.checkToolExecution('bash', 'git log --oneline -20')).toBe(true);
    });

    it('blocks mutating bash commands', () => {
      const mgr = getPlanModeManager();
      expect(mgr.checkToolExecution('bash', 'rm file.txt')).toBe(false);
      expect(mgr.checkToolExecution('bash', 'git commit -m wip')).toBe(false);
      expect(mgr.checkToolExecution('bash', 'sed -i s/x/y/ file')).toBe(false);
      expect(mgr.checkToolExecution('bash', 'echo hi > out.txt')).toBe(false);
      expect(mgr.checkToolExecution('bash', 'npm install lodash')).toBe(false);
    });

    it('blocks bash entirely if no command string is supplied', () => {
      const mgr = getPlanModeManager();
      expect(mgr.checkToolExecution('bash')).toBe(false);
    });

    it('still blocks non-bash write tools', () => {
      const mgr = getPlanModeManager();
      expect(mgr.checkToolExecution('write')).toBe(false);
      expect(mgr.checkToolExecution('edit')).toBe(false);
    });
  });

  describe('plan mode + allowReadOnlyBash=false (default)', () => {
    beforeEach(() => {
      getPlanModeManager().setMode('plan');
    });

    it('blocks ALL bash commands, including read-only ones', () => {
      const mgr = getPlanModeManager();
      expect(mgr.checkToolExecution('bash', 'ls -la')).toBe(false);
      expect(mgr.checkToolExecution('bash', 'cat README.md')).toBe(false);
      expect(mgr.checkToolExecution('bash', 'git status')).toBe(false);
      expect(mgr.checkToolExecution('bash', 'rm file.txt')).toBe(false);
    });
  });

  describe('build mode', () => {
    beforeEach(() => {
      configurePlanMode({ allowReadOnlyBash: true });
      getPlanModeManager().setMode('build');
    });

    it('allows all bash commands regardless of allowReadOnlyBash', () => {
      const mgr = getPlanModeManager();
      expect(mgr.checkToolExecution('bash', 'ls')).toBe(true);
      expect(mgr.checkToolExecution('bash', 'rm file.txt')).toBe(true);
      expect(mgr.checkToolExecution('bash', 'git commit -m wip')).toBe(true);
      expect(mgr.checkToolExecution('bash')).toBe(true);
    });
  });
});
