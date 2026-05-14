import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';
import {
  HookManagerImpl,
  resetHookManager,
  type HookDefinition,
  type HookContext,
} from '../../src/hooks/index.js';

describe('continueOnBlock', () => {
  let tempDir: string;
  let manager: HookManagerImpl;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'hooks-block-test-'));
    manager = new HookManagerImpl();
    resetHookManager();
  });

  afterEach(() => {
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
    resetHookManager();
  });

  describe('HookDefinition with continueOnBlock', () => {
    it('should accept continueOnBlock in hook definition', () => {
      const hook: HookDefinition = {
        event: 'PreToolUse',
        type: 'command',
        command: 'exit 1',
        continueOnBlock: true,
      };

      expect(() => manager.register(hook)).not.toThrow();
      const hooks = manager.getHooks('PreToolUse');
      expect(hooks).toHaveLength(1);
      expect(hooks[0].continueOnBlock).toBe(true);
    });

    it('should default continueOnBlock to undefined when not set', () => {
      const hook: HookDefinition = {
        event: 'PreToolUse',
        type: 'command',
        command: 'echo "test"',
      };

      manager.register(hook);
      const hooks = manager.getHooks('PreToolUse');
      expect(hooks[0].continueOnBlock).toBeUndefined();
    });
  });

  describe('hook with continueOnBlock=true returns block info', () => {
    it('should set blocked and blockReason when PreToolUse hook fails with continueOnBlock', async () => {
      manager.register({
        event: 'PreToolUse',
        type: 'command',
        command: 'echo "blocked: unsafe operation" >&2; exit 1',
        continueOnBlock: true,
      });

      const context: HookContext = {
        event: 'PreToolUse',
        timestamp: Date.now(),
        toolName: 'bash',
        toolParams: { command: 'rm -rf /' },
      };

      const results = await manager.execute('PreToolUse', context);

      expect(results).toHaveLength(1);
      expect(results[0].success).toBe(false);
      expect(results[0].blocked).toBe(true);
      expect(results[0].blockReason).toBeDefined();
      expect(results[0].blockReason!.length).toBeGreaterThan(0);
    });

    it('should not set blocked when hook succeeds', async () => {
      manager.register({
        event: 'PreToolUse',
        type: 'command',
        command: 'echo "ok"',
        continueOnBlock: true,
      });

      const context: HookContext = {
        event: 'PreToolUse',
        timestamp: Date.now(),
        toolName: 'read',
      };

      const results = await manager.execute('PreToolUse', context);

      expect(results).toHaveLength(1);
      expect(results[0].success).toBe(true);
      expect(results[0].blocked).toBeUndefined();
      expect(results[0].blockReason).toBeUndefined();
    });
  });

  describe('hook without continueOnBlock still halts (backwards compat)', () => {
    it('should NOT set blocked when continueOnBlock is not set', async () => {
      manager.register({
        event: 'PreToolUse',
        type: 'command',
        command: 'exit 1',
        // No continueOnBlock — default behavior
      });

      const context: HookContext = {
        event: 'PreToolUse',
        timestamp: Date.now(),
        toolName: 'bash',
      };

      const results = await manager.execute('PreToolUse', context);

      expect(results).toHaveLength(1);
      expect(results[0].success).toBe(false);
      expect(results[0].blocked).toBeUndefined();
      expect(results[0].blockReason).toBeUndefined();
    });

    it('should NOT set blocked when continueOnBlock is false', async () => {
      manager.register({
        event: 'PreToolUse',
        type: 'command',
        command: 'exit 1',
        continueOnBlock: false,
      });

      const context: HookContext = {
        event: 'PreToolUse',
        timestamp: Date.now(),
        toolName: 'bash',
      };

      const results = await manager.execute('PreToolUse', context);

      expect(results).toHaveLength(1);
      expect(results[0].success).toBe(false);
      expect(results[0].blocked).toBeUndefined();
      expect(results[0].blockReason).toBeUndefined();
    });

    it('should NOT set blocked for non-PreToolUse events even with continueOnBlock', async () => {
      manager.register({
        event: 'PostToolUse',
        type: 'command',
        command: 'exit 1',
        continueOnBlock: true,
      });

      const context: HookContext = {
        event: 'PostToolUse',
        timestamp: Date.now(),
        toolName: 'bash',
      };

      const results = await manager.execute('PostToolUse', context);

      expect(results).toHaveLength(1);
      expect(results[0].success).toBe(false);
      expect(results[0].blocked).toBeUndefined();
      expect(results[0].blockReason).toBeUndefined();
    });
  });

  describe('orchestrator integration with blocked hooks', () => {
    it('should load continueOnBlock from JSON config', async () => {
      const configPath = path.join(tempDir, 'hooks.json');
      const config = {
        hooks: [
          {
            event: 'PreToolUse',
            type: 'command',
            command: 'exit 1',
            continueOnBlock: true,
            description: 'Block dangerous tools',
          },
        ],
      };

      fs.writeFileSync(configPath, JSON.stringify(config));
      await manager.loadFromConfig(configPath);

      const hooks = manager.getHooks('PreToolUse');
      expect(hooks).toHaveLength(1);
      expect(hooks[0].continueOnBlock).toBe(true);
    });

    it('should use error message as blockReason', async () => {
      manager.register({
        event: 'PreToolUse',
        type: 'command',
        command: 'echo "File write not allowed in production" >&2; exit 1',
        continueOnBlock: true,
      });

      const context: HookContext = {
        event: 'PreToolUse',
        timestamp: Date.now(),
        toolName: 'write',
        toolParams: { filePath: '/etc/passwd', content: 'hacked' },
      };

      const results = await manager.execute('PreToolUse', context);

      expect(results[0].blocked).toBe(true);
      expect(results[0].blockReason).toContain('File write not allowed in production');
    });

    it('should handle multiple hooks where one blocks and one succeeds', async () => {
      manager.register({
        event: 'PreToolUse',
        type: 'command',
        command: 'echo "ok"',
        continueOnBlock: true,
      });

      manager.register({
        event: 'PreToolUse',
        type: 'command',
        command: 'echo "blocked" >&2; exit 1',
        continueOnBlock: true,
      });

      const context: HookContext = {
        event: 'PreToolUse',
        timestamp: Date.now(),
        toolName: 'bash',
      };

      const results = await manager.execute('PreToolUse', context);

      expect(results).toHaveLength(2);
      expect(results[0].success).toBe(true);
      expect(results[0].blocked).toBeUndefined();
      expect(results[1].success).toBe(false);
      expect(results[1].blocked).toBe(true);
      expect(results[1].blockReason).toBeDefined();
    });

    it('should use script hook with continueOnBlock', async () => {
      const scriptPath = path.join(tempDir, 'guard.mjs');
      fs.writeFileSync(
        scriptPath,
        `
        export default function(context) {
          if (context.toolName === 'bash') {
            throw new Error('bash tool is not allowed');
          }
          return { allowed: true };
        }
        `
      );

      manager.register({
        event: 'PreToolUse',
        type: 'script',
        script: scriptPath,
        continueOnBlock: true,
      });

      const context: HookContext = {
        event: 'PreToolUse',
        timestamp: Date.now(),
        toolName: 'bash',
      };

      const results = await manager.execute('PreToolUse', context);

      expect(results[0].success).toBe(false);
      expect(results[0].blocked).toBe(true);
      expect(results[0].blockReason).toContain('bash tool is not allowed');
    });
  });
});
