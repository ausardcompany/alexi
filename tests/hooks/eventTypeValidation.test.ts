import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';
import {
  HookManagerImpl,
  COMMAND_ONLY_EVENTS,
  RefinedHookDefinitionSchema,
  type HookDefinition,
} from '../../src/hooks/index.js';

describe('Hook Event-Type Compatibility Validation', () => {
  let manager: HookManagerImpl;
  let tempDir: string;

  beforeEach(() => {
    manager = new HookManagerImpl();
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'hooks-validation-'));
  });

  afterEach(() => {
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  describe('COMMAND_ONLY_EVENTS constant', () => {
    it('should include SessionStart, SessionEnd, and Error', () => {
      expect(COMMAND_ONLY_EVENTS).toContain('SessionStart');
      expect(COMMAND_ONLY_EVENTS).toContain('SessionEnd');
      expect(COMMAND_ONLY_EVENTS).toContain('Error');
    });

    it('should not include tool-related events', () => {
      expect(COMMAND_ONLY_EVENTS).not.toContain('PreToolUse');
      expect(COMMAND_ONLY_EVENTS).not.toContain('PostToolUse');
      expect(COMMAND_ONLY_EVENTS).not.toContain('PostToolUseFailure');
    });
  });

  describe('register() validation', () => {
    it('should accept command type on SessionStart', () => {
      const hook: HookDefinition = {
        event: 'SessionStart',
        type: 'command',
        command: 'echo "session started"',
      };

      expect(() => manager.register(hook)).not.toThrow();
      expect(manager.getHooks('SessionStart')).toHaveLength(1);
    });

    it('should accept command type on SessionEnd', () => {
      const hook: HookDefinition = {
        event: 'SessionEnd',
        type: 'command',
        command: 'echo "session ended"',
      };

      expect(() => manager.register(hook)).not.toThrow();
      expect(manager.getHooks('SessionEnd')).toHaveLength(1);
    });

    it('should accept command type on Error', () => {
      const hook: HookDefinition = {
        event: 'Error',
        type: 'command',
        command: 'echo "error occurred"',
      };

      expect(() => manager.register(hook)).not.toThrow();
      expect(manager.getHooks('Error')).toHaveLength(1);
    });

    it('should reject http type on SessionStart', () => {
      const hook: HookDefinition = {
        event: 'SessionStart',
        type: 'http',
        url: 'https://example.com/webhook',
      };

      expect(() => manager.register(hook)).toThrow(
        "Hook event 'SessionStart' requires type 'command'. Got 'http'. Use a command-type hook instead."
      );
    });

    it('should reject script type on SessionEnd', () => {
      const hook: HookDefinition = {
        event: 'SessionEnd',
        type: 'script',
        script: '/path/to/hook.js',
      };

      expect(() => manager.register(hook)).toThrow(
        "Hook event 'SessionEnd' requires type 'command'. Got 'script'. Use a command-type hook instead."
      );
    });

    it('should reject http type on Error', () => {
      const hook: HookDefinition = {
        event: 'Error',
        type: 'http',
        url: 'https://example.com/error-webhook',
      };

      expect(() => manager.register(hook)).toThrow(
        "Hook event 'Error' requires type 'command'. Got 'http'. Use a command-type hook instead."
      );
    });

    it('should reject script type on Error', () => {
      const hook: HookDefinition = {
        event: 'Error',
        type: 'script',
        script: '/path/to/error-hook.js',
      };

      expect(() => manager.register(hook)).toThrow(
        "Hook event 'Error' requires type 'command'. Got 'script'. Use a command-type hook instead."
      );
    });

    it('should accept http type on PreToolUse (not restricted)', () => {
      const hook: HookDefinition = {
        event: 'PreToolUse',
        type: 'http',
        url: 'https://example.com/pre-tool',
      };

      expect(() => manager.register(hook)).not.toThrow();
      expect(manager.getHooks('PreToolUse')).toHaveLength(1);
    });

    it('should accept script type on PostToolUse (not restricted)', () => {
      const hook: HookDefinition = {
        event: 'PostToolUse',
        type: 'script',
        script: '/path/to/post-tool-hook.js',
      };

      expect(() => manager.register(hook)).not.toThrow();
      expect(manager.getHooks('PostToolUse')).toHaveLength(1);
    });

    it('should accept http type on PostToolUseFailure (not restricted)', () => {
      const hook: HookDefinition = {
        event: 'PostToolUseFailure',
        type: 'http',
        url: 'https://example.com/failure-webhook',
      };

      expect(() => manager.register(hook)).not.toThrow();
      expect(manager.getHooks('PostToolUseFailure')).toHaveLength(1);
    });

    it('should accept script type on PermissionRequest (not restricted)', () => {
      const hook: HookDefinition = {
        event: 'PermissionRequest',
        type: 'script',
        script: '/path/to/permission-hook.js',
      };

      expect(() => manager.register(hook)).not.toThrow();
      expect(manager.getHooks('PermissionRequest')).toHaveLength(1);
    });

    it('should accept http type on Stop (not restricted)', () => {
      const hook: HookDefinition = {
        event: 'Stop',
        type: 'http',
        url: 'https://example.com/stop-webhook',
      };

      expect(() => manager.register(hook)).not.toThrow();
      expect(manager.getHooks('Stop')).toHaveLength(1);
    });
  });

  describe('RefinedHookDefinitionSchema validation', () => {
    it('should accept command type on SessionStart via schema', () => {
      const result = RefinedHookDefinitionSchema.safeParse({
        event: 'SessionStart',
        type: 'command',
        command: 'echo "start"',
      });

      expect(result.success).toBe(true);
    });

    it('should reject http type on SessionStart via schema', () => {
      const result = RefinedHookDefinitionSchema.safeParse({
        event: 'SessionStart',
        type: 'http',
        url: 'https://example.com/webhook',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('SessionStart');
        expect(result.error.issues[0].message).toContain('http');
        expect(result.error.issues[0].message).toContain('command');
      }
    });

    it('should reject script type on Error via schema', () => {
      const result = RefinedHookDefinitionSchema.safeParse({
        event: 'Error',
        type: 'script',
        script: '/path/to/hook.js',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Error');
        expect(result.error.issues[0].message).toContain('script');
      }
    });

    it('should accept http type on PreToolUse via schema', () => {
      const result = RefinedHookDefinitionSchema.safeParse({
        event: 'PreToolUse',
        type: 'http',
        url: 'https://example.com/webhook',
      });

      expect(result.success).toBe(true);
    });
  });

  describe('loadFromConfig() graceful degradation', () => {
    it('should skip invalid hooks and load valid ones', async () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const configPath = path.join(tempDir, 'hooks.json');
      const config = {
        hooks: [
          {
            event: 'SessionStart',
            type: 'command',
            command: 'echo "valid start hook"',
            description: 'Valid start hook',
          },
          {
            event: 'SessionStart',
            type: 'http',
            url: 'https://example.com/invalid',
            description: 'Invalid http on SessionStart',
          },
          {
            event: 'PostToolUse',
            type: 'http',
            url: 'https://example.com/valid',
            description: 'Valid http on PostToolUse',
          },
        ],
      };

      fs.writeFileSync(configPath, JSON.stringify(config));

      await manager.loadFromConfig(configPath);

      // Should have loaded 2 valid hooks, skipped 1 invalid
      expect(manager.getHooks('SessionStart')).toHaveLength(1);
      expect(manager.getHooks('PostToolUse')).toHaveLength(1);

      // Should have logged a warning for the invalid hook
      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('Invalid http on SessionStart'));
      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining("requires type 'command'"));

      warnSpy.mockRestore();
    });

    it('should log warning with hook description when available', async () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const configPath = path.join(tempDir, 'hooks.json');
      const config = {
        hooks: [
          {
            event: 'Error',
            type: 'script',
            script: '/path/to/hook.js',
            description: 'My error reporter',
          },
        ],
      };

      fs.writeFileSync(configPath, JSON.stringify(config));

      await manager.loadFromConfig(configPath);

      expect(manager.getHooks()).toHaveLength(0);
      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('My error reporter'));
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining("Hook event 'Error' requires type 'command'")
      );

      warnSpy.mockRestore();
    });

    it('should log warning with hook index when no description', async () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const configPath = path.join(tempDir, 'hooks.json');
      const config = {
        hooks: [
          {
            event: 'SessionEnd',
            type: 'http',
            url: 'https://example.com/hook',
          },
        ],
      };

      fs.writeFileSync(configPath, JSON.stringify(config));

      await manager.loadFromConfig(configPath);

      expect(manager.getHooks()).toHaveLength(0);
      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('hook at index 0'));
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining("Hook event 'SessionEnd' requires type 'command'")
      );

      warnSpy.mockRestore();
    });
  });
});
