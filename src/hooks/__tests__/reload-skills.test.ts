/**
 * SessionStart `reloadSkills` follow-up tests.
 *
 * The hook manager must:
 * - parse `hookSpecificOutput.reloadSkills` out of a successful SessionStart
 *   hook's stdout JSON;
 * - call `reloadSkills(cwd)` from `src/skill/index.ts` exactly once per
 *   `execute()` invocation, even if multiple hooks request a reload;
 * - leave non-SessionStart events alone.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';

const reloadSkillsMock = vi.fn(() => ({ added: 0, removed: 0, total: 0 }));

vi.mock('../../skill/index.js', () => ({
  reloadSkills: reloadSkillsMock,
}));

import {
  HookManagerImpl,
  parseHookSpecificOutput,
  type HookContext,
  type HookDefinition,
} from '../index.js';

describe('SessionStart reloadSkills follow-up', () => {
  let tempDir: string;

  beforeEach(() => {
    reloadSkillsMock.mockClear();
    reloadSkillsMock.mockReturnValue({ added: 1, removed: 0, total: 5 });
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'reload-skills-hook-'));
  });

  afterEach(() => {
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  describe('parseHookSpecificOutput', () => {
    it('extracts the reloadSkills flag from a JSON stdout payload', () => {
      const out = JSON.stringify({ hookSpecificOutput: { reloadSkills: true } });
      expect(parseHookSpecificOutput(out)).toEqual({ reloadSkills: true });
    });

    it('returns undefined for plain text output', () => {
      expect(parseHookSpecificOutput('not json at all')).toBeUndefined();
    });

    it('returns undefined for objects without a hookSpecificOutput key', () => {
      expect(parseHookSpecificOutput({ unrelated: true })).toBeUndefined();
    });

    it('accepts an object value directly (script return path)', () => {
      const ret = { hookSpecificOutput: { reloadSkills: true, sessionTitle: 'Hi' } };
      expect(parseHookSpecificOutput(ret)).toEqual({
        reloadSkills: true,
        sessionTitle: 'Hi',
      });
    });

    it('rejects malformed shapes safely', () => {
      const bad = JSON.stringify({ hookSpecificOutput: { reloadSkills: 'yes' } });
      expect(parseHookSpecificOutput(bad)).toBeUndefined();
    });
  });

  describe('SessionStart hook integration', () => {
    it('invokes reloadSkills once when a SessionStart hook requests it', async () => {
      const manager = new HookManagerImpl();
      const payload = JSON.stringify({ hookSpecificOutput: { reloadSkills: true } });
      // printf avoids appending a trailing newline on POSIX shells; cmd.exe
      // quirks aren't material here because the JSON is robust to trailing
      // whitespace via parseHookSpecificOutput.
      const command =
        process.platform === 'win32'
          ? `echo ${payload.replace(/"/g, '\\"')}`
          : `printf '%s' '${payload}'`;

      const hook: HookDefinition = {
        event: 'SessionStart',
        type: 'command',
        command,
      };
      manager.register(hook);

      const ctx: HookContext = {
        event: 'SessionStart',
        timestamp: Date.now(),
      };

      const results = await manager.execute('SessionStart', ctx);

      expect(results).toHaveLength(1);
      expect(results[0].success).toBe(true);
      expect(results[0].hookSpecificOutput?.reloadSkills).toBe(true);
      expect(reloadSkillsMock).toHaveBeenCalledTimes(1);
    });

    it('does not invoke reloadSkills for hooks that do not request it', async () => {
      const manager = new HookManagerImpl();
      const command = process.platform === 'win32' ? `echo hello` : `printf 'hello'`;

      manager.register({
        event: 'SessionStart',
        type: 'command',
        command,
      });

      await manager.execute('SessionStart', {
        event: 'SessionStart',
        timestamp: Date.now(),
      });

      expect(reloadSkillsMock).not.toHaveBeenCalled();
    });

    it('does not invoke reloadSkills for non-SessionStart events', async () => {
      const manager = new HookManagerImpl();
      const payload = JSON.stringify({ hookSpecificOutput: { reloadSkills: true } });
      const command =
        process.platform === 'win32'
          ? `echo ${payload.replace(/"/g, '\\"')}`
          : `printf '%s' '${payload}'`;

      // PostToolUse accepts command hooks too; reloadSkills must be ignored.
      manager.register({
        event: 'PostToolUse',
        type: 'command',
        command,
      });

      await manager.execute('PostToolUse', {
        event: 'PostToolUse',
        timestamp: Date.now(),
        toolName: 'read',
      });

      expect(reloadSkillsMock).not.toHaveBeenCalled();
    });

    it('only fires reloadSkills once even when multiple hooks request it', async () => {
      const manager = new HookManagerImpl();
      const payload = JSON.stringify({ hookSpecificOutput: { reloadSkills: true } });
      const command =
        process.platform === 'win32'
          ? `echo ${payload.replace(/"/g, '\\"')}`
          : `printf '%s' '${payload}'`;

      manager.register({ event: 'SessionStart', type: 'command', command });
      manager.register({ event: 'SessionStart', type: 'command', command });

      await manager.execute('SessionStart', {
        event: 'SessionStart',
        timestamp: Date.now(),
      });

      expect(reloadSkillsMock).toHaveBeenCalledTimes(1);
    });
  });
});
