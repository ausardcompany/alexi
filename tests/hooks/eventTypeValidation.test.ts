import { describe, it, expect, beforeEach } from 'vitest';
import {
  HookManagerImpl,
  COMMAND_ONLY_EVENTS,
  type HookDefinition,
} from '../../src/hooks/index.js';

describe('Hook event-type compatibility validation', () => {
  let manager: HookManagerImpl;

  beforeEach(() => {
    manager = new HookManagerImpl();
  });

  describe('COMMAND_ONLY_EVENTS constant', () => {
    it('should include SessionStart, SessionEnd, and Error', () => {
      expect(COMMAND_ONLY_EVENTS).toContain('SessionStart');
      expect(COMMAND_ONLY_EVENTS).toContain('SessionEnd');
      expect(COMMAND_ONLY_EVENTS).toContain('Error');
    });

    it('should not include other events', () => {
      expect(COMMAND_ONLY_EVENTS).not.toContain('PreToolUse');
      expect(COMMAND_ONLY_EVENTS).not.toContain('PostToolUse');
      expect(COMMAND_ONLY_EVENTS).not.toContain('Stop');
    });
  });

  describe('register() rejects incompatible event/type combinations', () => {
    it('should throw when registering http hook on SessionStart', () => {
      const hook: HookDefinition = {
        event: 'SessionStart',
        type: 'http',
        url: 'https://example.com/hook',
      };

      expect(() => manager.register(hook)).toThrow(
        "Event 'SessionStart' only supports command-type hooks. Got type 'http'. Use a command-type hook instead."
      );
    });

    it('should throw when registering script hook on SessionEnd', () => {
      const hook: HookDefinition = {
        event: 'SessionEnd',
        type: 'script',
        script: '/tmp/hook.js',
      };

      expect(() => manager.register(hook)).toThrow(
        "Event 'SessionEnd' only supports command-type hooks. Got type 'script'. Use a command-type hook instead."
      );
    });

    it('should throw when registering http hook on Error', () => {
      const hook: HookDefinition = {
        event: 'Error',
        type: 'http',
        url: 'https://example.com/error-hook',
      };

      expect(() => manager.register(hook)).toThrow(
        "Event 'Error' only supports command-type hooks. Got type 'http'. Use a command-type hook instead."
      );
    });

    it('should include event name and hook type in error message', () => {
      const hook: HookDefinition = {
        event: 'SessionStart',
        type: 'script',
        script: '/tmp/hook.js',
      };

      expect(() => manager.register(hook)).toThrow(/SessionStart/);
      expect(() => manager.register(hook)).toThrow(/script/);
    });
  });

  describe('register() allows compatible event/type combinations', () => {
    it('should allow command hook on SessionStart', () => {
      const hook: HookDefinition = {
        event: 'SessionStart',
        type: 'command',
        command: 'echo "session started"',
      };

      expect(() => manager.register(hook)).not.toThrow();
      expect(manager.getHooks('SessionStart')).toHaveLength(1);
    });

    it('should allow command hook on SessionEnd', () => {
      const hook: HookDefinition = {
        event: 'SessionEnd',
        type: 'command',
        command: 'echo "session ended"',
      };

      expect(() => manager.register(hook)).not.toThrow();
      expect(manager.getHooks('SessionEnd')).toHaveLength(1);
    });

    it('should allow command hook on Error', () => {
      const hook: HookDefinition = {
        event: 'Error',
        type: 'command',
        command: 'echo "error occurred"',
      };

      expect(() => manager.register(hook)).not.toThrow();
      expect(manager.getHooks('Error')).toHaveLength(1);
    });

    it('should allow http hook on PreToolUse (not restricted)', () => {
      const hook: HookDefinition = {
        event: 'PreToolUse',
        type: 'http',
        url: 'https://example.com/pre-tool',
      };

      expect(() => manager.register(hook)).not.toThrow();
      expect(manager.getHooks('PreToolUse')).toHaveLength(1);
    });

    it('should allow script hook on PostToolUse (not restricted)', () => {
      const hook: HookDefinition = {
        event: 'PostToolUse',
        type: 'script',
        script: '/tmp/post-tool.js',
      };

      expect(() => manager.register(hook)).not.toThrow();
      expect(manager.getHooks('PostToolUse')).toHaveLength(1);
    });

    it('should allow http hook on Stop (not restricted)', () => {
      const hook: HookDefinition = {
        event: 'Stop',
        type: 'http',
        url: 'https://example.com/stop',
      };

      expect(() => manager.register(hook)).not.toThrow();
      expect(manager.getHooks('Stop')).toHaveLength(1);
    });
  });
});
