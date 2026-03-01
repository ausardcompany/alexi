import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';
import {
  HookManagerImpl,
  getHookManager,
  resetHookManager,
  substituteTemplates,
  type HookDefinition,
  type HookContext,
  type HookEvent,
} from '../index.js';

describe('Hooks System', () => {
  let tempDir: string;
  let manager: HookManagerImpl;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'hooks-test-'));
    manager = new HookManagerImpl();
    resetHookManager();
  });

  afterEach(() => {
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
    resetHookManager();
  });

  describe('Template Substitution', () => {
    it('should substitute all template variables', () => {
      const context: HookContext = {
        event: 'PostToolUse',
        timestamp: 1234567890,
        sessionId: 'session-123',
        toolName: 'read',
        error: 'some error',
      };

      const template =
        'Event: {{event}}, Tool: {{toolName}}, Session: {{sessionId}}, Time: {{timestamp}}, Error: {{error}}';
      const result = substituteTemplates(template, context);

      expect(result).toBe(
        'Event: PostToolUse, Tool: read, Session: session-123, Time: 1234567890, Error: some error'
      );
    });

    it('should handle missing optional values', () => {
      const context: HookContext = {
        event: 'SessionStart',
        timestamp: 1234567890,
      };

      const template = 'Tool: {{toolName}}, Session: {{sessionId}}';
      const result = substituteTemplates(template, context);

      expect(result).toBe('Tool: , Session: ');
    });

    it('should handle multiple occurrences of same variable', () => {
      const context: HookContext = {
        event: 'PreToolUse',
        timestamp: 123,
        toolName: 'bash',
      };

      const template = '{{toolName}} - {{toolName}} - {{toolName}}';
      const result = substituteTemplates(template, context);

      expect(result).toBe('bash - bash - bash');
    });
  });

  describe('Hook Registration', () => {
    it('should register a command hook', () => {
      const hook: HookDefinition = {
        event: 'PostToolUse',
        type: 'command',
        command: 'echo "test"',
        description: 'Test hook',
      };

      manager.register(hook);
      const hooks = manager.getHooks('PostToolUse');

      expect(hooks).toHaveLength(1);
      expect(hooks[0]).toMatchObject(hook);
    });

    it('should register multiple hooks for same event', () => {
      const hook1: HookDefinition = {
        event: 'SessionStart',
        type: 'command',
        command: 'echo "hook1"',
      };

      const hook2: HookDefinition = {
        event: 'SessionStart',
        type: 'command',
        command: 'echo "hook2"',
      };

      manager.register(hook1);
      manager.register(hook2);

      const hooks = manager.getHooks('SessionStart');
      expect(hooks).toHaveLength(2);
    });

    it('should throw error for command hook without command', () => {
      const hook: HookDefinition = {
        event: 'PostToolUse',
        type: 'command',
      };

      expect(() => manager.register(hook)).toThrow('Command hook requires "command" field');
    });

    it('should throw error for http hook without url', () => {
      const hook: HookDefinition = {
        event: 'PostToolUse',
        type: 'http',
      };

      expect(() => manager.register(hook)).toThrow('HTTP hook requires "url" field');
    });

    it('should throw error for script hook without script', () => {
      const hook: HookDefinition = {
        event: 'PostToolUse',
        type: 'script',
      };

      expect(() => manager.register(hook)).toThrow('Script hook requires "script" field');
    });

    it('should get all hooks across events', () => {
      manager.register({
        event: 'SessionStart',
        type: 'command',
        command: 'echo "start"',
      });

      manager.register({
        event: 'SessionEnd',
        type: 'command',
        command: 'echo "end"',
      });

      manager.register({
        event: 'PostToolUse',
        type: 'command',
        command: 'echo "tool"',
      });

      const allHooks = manager.getHooks();
      expect(allHooks).toHaveLength(3);
    });
  });

  describe('Hook Unregistration', () => {
    it('should unregister all hooks for an event', () => {
      manager.register({
        event: 'SessionStart',
        type: 'command',
        command: 'echo "1"',
      });

      manager.register({
        event: 'SessionStart',
        type: 'command',
        command: 'echo "2"',
      });

      manager.unregister('SessionStart');
      expect(manager.getHooks('SessionStart')).toHaveLength(0);
    });

    it('should unregister a specific hook by index', () => {
      manager.register({
        event: 'SessionStart',
        type: 'command',
        command: 'echo "1"',
      });

      manager.register({
        event: 'SessionStart',
        type: 'command',
        command: 'echo "2"',
      });

      manager.unregister('SessionStart', 0);

      const hooks = manager.getHooks('SessionStart');
      expect(hooks).toHaveLength(1);
      expect(hooks[0].command).toBe('echo "2"');
    });

    it('should handle unregistering non-existent event', () => {
      expect(() => manager.unregister('Error')).not.toThrow();
    });
  });

  describe('Command Hook Execution', () => {
    it('should execute a simple command hook', async () => {
      manager.register({
        event: 'PostToolUse',
        type: 'command',
        command: 'echo "hello"',
      });

      const context: HookContext = {
        event: 'PostToolUse',
        timestamp: Date.now(),
        toolName: 'read',
      };

      const results = await manager.execute('PostToolUse', context);

      expect(results).toHaveLength(1);
      expect(results[0].success).toBe(true);
      expect(results[0].output?.trim()).toBe('hello');
      expect(results[0].duration).toBeGreaterThanOrEqual(0);
    });

    it('should substitute templates in command', async () => {
      manager.register({
        event: 'PostToolUse',
        type: 'command',
        command: 'echo "Tool: {{toolName}}"',
      });

      const context: HookContext = {
        event: 'PostToolUse',
        timestamp: Date.now(),
        toolName: 'read',
      };

      const results = await manager.execute('PostToolUse', context);

      expect(results[0].success).toBe(true);
      expect(results[0].output?.trim()).toBe('Tool: read');
    });

    it('should handle command failure', async () => {
      manager.register({
        event: 'Error',
        type: 'command',
        command: 'exit 1',
      });

      const context: HookContext = {
        event: 'Error',
        timestamp: Date.now(),
      };

      const results = await manager.execute('Error', context);

      expect(results).toHaveLength(1);
      expect(results[0].success).toBe(false);
      expect(results[0].error).toBeDefined();
    });

    it('should skip disabled hooks', async () => {
      manager.register({
        event: 'PostToolUse',
        type: 'command',
        command: 'echo "enabled"',
        enabled: true,
      });

      manager.register({
        event: 'PostToolUse',
        type: 'command',
        command: 'echo "disabled"',
        enabled: false,
      });

      const context: HookContext = {
        event: 'PostToolUse',
        timestamp: Date.now(),
      };

      const results = await manager.execute('PostToolUse', context);

      expect(results).toHaveLength(1);
      expect(results[0].output?.trim()).toBe('enabled');
    });
  });

  describe('Timeout Handling', () => {
    it('should timeout long-running command', async () => {
      manager.register({
        event: 'PostToolUse',
        type: 'command',
        command: 'sleep 2', // 2 seconds is enough to exceed 100ms timeout
        timeout: 100, // 100ms timeout
      });

      const context: HookContext = {
        event: 'PostToolUse',
        timestamp: Date.now(),
      };

      const results = await manager.execute('PostToolUse', context);

      expect(results[0].success).toBe(false);
      expect(results[0].error).toContain('timed out');
    }, 10000); // Increased test timeout for slower CI runners
  });

  describe('HTTP Hook Execution', () => {
    it('should handle HTTP hook with mock fetch', async () => {
      // Mock fetch
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        statusText: 'OK',
        text: () => Promise.resolve('{"status": "ok"}'),
      });

      vi.stubGlobal('fetch', mockFetch);

      manager.register({
        event: 'SessionEnd',
        type: 'http',
        url: 'https://example.com/webhook',
        method: 'POST',
      });

      const context: HookContext = {
        event: 'SessionEnd',
        timestamp: Date.now(),
        sessionId: 'test-session',
      };

      const results = await manager.execute('SessionEnd', context);

      expect(results).toHaveLength(1);
      expect(results[0].success).toBe(true);
      expect(results[0].output).toBe('{"status": "ok"}');
      expect(mockFetch).toHaveBeenCalledWith(
        'https://example.com/webhook',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      );

      vi.unstubAllGlobals();
    });

    it('should handle HTTP hook failure', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        text: () => Promise.resolve('Error'),
      });

      vi.stubGlobal('fetch', mockFetch);

      manager.register({
        event: 'Error',
        type: 'http',
        url: 'https://example.com/webhook',
      });

      const context: HookContext = {
        event: 'Error',
        timestamp: Date.now(),
      };

      const results = await manager.execute('Error', context);

      expect(results[0].success).toBe(false);
      expect(results[0].error).toContain('500');

      vi.unstubAllGlobals();
    });

    it('should substitute templates in URL', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        statusText: 'OK',
        text: () => Promise.resolve('ok'),
      });

      vi.stubGlobal('fetch', mockFetch);

      manager.register({
        event: 'PostToolUse',
        type: 'http',
        url: 'https://example.com/tools/{{toolName}}',
        method: 'GET',
      });

      const context: HookContext = {
        event: 'PostToolUse',
        timestamp: Date.now(),
        toolName: 'read',
      };

      await manager.execute('PostToolUse', context);

      expect(mockFetch).toHaveBeenCalledWith('https://example.com/tools/read', expect.any(Object));

      vi.unstubAllGlobals();
    });
  });

  describe('Load from Config', () => {
    it('should load hooks from JSON config file', async () => {
      const configPath = path.join(tempDir, 'hooks.json');
      const config = {
        hooks: [
          {
            event: 'PostToolUse',
            type: 'command',
            command: 'echo "from config"',
            description: 'Config hook',
          },
          {
            event: 'SessionStart',
            type: 'command',
            command: 'echo "session started"',
          },
        ],
      };

      fs.writeFileSync(configPath, JSON.stringify(config));

      await manager.loadFromConfig(configPath);

      expect(manager.getHooks()).toHaveLength(2);
      expect(manager.getHooks('PostToolUse')).toHaveLength(1);
      expect(manager.getHooks('SessionStart')).toHaveLength(1);
    });

    it('should load hooks from direct array format', async () => {
      const configPath = path.join(tempDir, 'hooks-array.json');
      const config = [
        {
          event: 'PreToolUse',
          type: 'command',
          command: 'echo "pre-tool"',
        },
      ];

      fs.writeFileSync(configPath, JSON.stringify(config));

      await manager.loadFromConfig(configPath);

      expect(manager.getHooks('PreToolUse')).toHaveLength(1);
    });

    it('should handle invalid config file gracefully', async () => {
      const configPath = path.join(tempDir, 'invalid.json');
      fs.writeFileSync(configPath, '{ invalid json }');

      // Should not throw, just warn
      await expect(manager.loadFromConfig(configPath)).resolves.not.toThrow();
    });

    it('should handle non-existent config file', async () => {
      const configPath = path.join(tempDir, 'nonexistent.json');

      // Should not throw
      await expect(manager.loadFromConfig(configPath)).resolves.not.toThrow();
    });
  });

  describe('Multiple Hooks for Same Event', () => {
    it('should execute multiple hooks in order', async () => {
      // We'll use command hooks that append to output
      manager.register({
        event: 'SessionStart',
        type: 'command',
        command: 'echo "first"',
      });

      manager.register({
        event: 'SessionStart',
        type: 'command',
        command: 'echo "second"',
      });

      manager.register({
        event: 'SessionStart',
        type: 'command',
        command: 'echo "third"',
      });

      const context: HookContext = {
        event: 'SessionStart',
        timestamp: Date.now(),
      };

      const results = await manager.execute('SessionStart', context);

      expect(results).toHaveLength(3);
      expect(results[0].output?.trim()).toBe('first');
      expect(results[1].output?.trim()).toBe('second');
      expect(results[2].output?.trim()).toBe('third');
    });

    it('should continue execution even if one hook fails', async () => {
      manager.register({
        event: 'SessionStart',
        type: 'command',
        command: 'echo "first"',
      });

      manager.register({
        event: 'SessionStart',
        type: 'command',
        command: 'exit 1', // This will fail
      });

      manager.register({
        event: 'SessionStart',
        type: 'command',
        command: 'echo "third"',
      });

      const context: HookContext = {
        event: 'SessionStart',
        timestamp: Date.now(),
      };

      const results = await manager.execute('SessionStart', context);

      expect(results).toHaveLength(3);
      expect(results[0].success).toBe(true);
      expect(results[1].success).toBe(false);
      expect(results[2].success).toBe(true);
    });
  });

  describe('Global Hook Manager', () => {
    it('should return singleton instance', () => {
      const manager1 = getHookManager();
      const manager2 = getHookManager();

      expect(manager1).toBe(manager2);
    });

    it('should reset global manager', () => {
      const manager1 = getHookManager();
      manager1.register({
        event: 'SessionStart',
        type: 'command',
        command: 'echo "test"',
      });

      resetHookManager();

      const manager2 = getHookManager();
      expect(manager2.getHooks()).toHaveLength(0);
      expect(manager1).not.toBe(manager2);
    });
  });

  describe('Hook Events', () => {
    it('should support all defined hook events', () => {
      const events: HookEvent[] = [
        'SessionStart',
        'SessionEnd',
        'PreToolUse',
        'PostToolUse',
        'PostToolUseFailure',
        'PermissionRequest',
        'Stop',
        'Error',
      ];

      for (const event of events) {
        const hook: HookDefinition = {
          event,
          type: 'command',
          command: `echo "${event}"`,
        };

        expect(() => manager.register(hook)).not.toThrow();
      }

      expect(manager.getHooks()).toHaveLength(events.length);
    });
  });

  describe('Script Hook', () => {
    it('should handle non-existent script file', async () => {
      manager.register({
        event: 'PostToolUse',
        type: 'script',
        script: path.join(tempDir, 'nonexistent.js'),
      });

      const context: HookContext = {
        event: 'PostToolUse',
        timestamp: Date.now(),
      };

      const results = await manager.execute('PostToolUse', context);

      expect(results[0].success).toBe(false);
      expect(results[0].error).toContain('not found');
    });

    it('should execute a script that exports a function', async () => {
      const scriptPath = path.join(tempDir, 'test-hook.mjs');
      fs.writeFileSync(
        scriptPath,
        `
        export default function(context) {
          return { received: context.event, tool: context.toolName };
        }
        `
      );

      manager.register({
        event: 'PostToolUse',
        type: 'script',
        script: scriptPath,
      });

      const context: HookContext = {
        event: 'PostToolUse',
        timestamp: Date.now(),
        toolName: 'read',
      };

      const results = await manager.execute('PostToolUse', context);

      expect(results[0].success).toBe(true);
      expect(results[0].output).toContain('PostToolUse');
      expect(results[0].output).toContain('read');
    });

    it('should handle script that throws error', async () => {
      const scriptPath = path.join(tempDir, 'error-hook.mjs');
      fs.writeFileSync(
        scriptPath,
        `
        export default function(context) {
          throw new Error('Script error');
        }
        `
      );

      manager.register({
        event: 'Error',
        type: 'script',
        script: scriptPath,
      });

      const context: HookContext = {
        event: 'Error',
        timestamp: Date.now(),
      };

      const results = await manager.execute('Error', context);

      expect(results[0].success).toBe(false);
      expect(results[0].error).toContain('Script error');
    });
  });
});
