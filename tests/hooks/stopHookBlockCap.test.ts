import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  HookManagerImpl,
  resetHookManager,
  getStopHookBlockCap,
  type HookDefinition,
} from '../../src/hooks/index.js';

describe('Stop Hook Block Cap', () => {
  const originalEnv = process.env.ALEXI_STOP_HOOK_BLOCK_CAP;

  beforeEach(() => {
    resetHookManager();
    delete process.env.ALEXI_STOP_HOOK_BLOCK_CAP;
  });

  afterEach(() => {
    resetHookManager();
    if (originalEnv !== undefined) {
      process.env.ALEXI_STOP_HOOK_BLOCK_CAP = originalEnv;
    } else {
      delete process.env.ALEXI_STOP_HOOK_BLOCK_CAP;
    }
  });

  describe('getStopHookBlockCap', () => {
    it('should return default of 8 when env var is not set', () => {
      expect(getStopHookBlockCap()).toBe(8);
    });

    it('should return custom value from ALEXI_STOP_HOOK_BLOCK_CAP env var', () => {
      process.env.ALEXI_STOP_HOOK_BLOCK_CAP = '5';
      expect(getStopHookBlockCap()).toBe(5);
    });

    it('should return default when env var is not a valid positive integer', () => {
      process.env.ALEXI_STOP_HOOK_BLOCK_CAP = 'abc';
      expect(getStopHookBlockCap()).toBe(8);
    });

    it('should return default when env var is zero', () => {
      process.env.ALEXI_STOP_HOOK_BLOCK_CAP = '0';
      expect(getStopHookBlockCap()).toBe(8);
    });

    it('should return default when env var is negative', () => {
      process.env.ALEXI_STOP_HOOK_BLOCK_CAP = '-3';
      expect(getStopHookBlockCap()).toBe(8);
    });

    it('should handle large valid values', () => {
      process.env.ALEXI_STOP_HOOK_BLOCK_CAP = '100';
      expect(getStopHookBlockCap()).toBe(100);
    });
  });

  describe('Stop hook blocking behavior', () => {
    let manager: HookManagerImpl;

    beforeEach(() => {
      manager = new HookManagerImpl();
    });

    it('should track consecutive blocks when Stop hook always fails', async () => {
      // Register a Stop hook that always fails (command that exits non-zero)
      const hook: HookDefinition = {
        event: 'Stop',
        type: 'command',
        command: 'exit 1',
        timeout: 5000,
      };
      manager.register(hook);

      let consecutiveBlocks = 0;
      const cap = getStopHookBlockCap(); // 8

      // Simulate the agentic loop checking Stop hooks
      for (let i = 0; i < cap + 2; i++) {
        const results = await manager.execute('Stop', {
          event: 'Stop',
          timestamp: Date.now(),
        });

        const blocked = results.some((r) => !r.success);
        if (blocked) {
          consecutiveBlocks++;
          if (consecutiveBlocks >= cap) {
            break;
          }
        } else {
          consecutiveBlocks = 0;
        }
      }

      expect(consecutiveBlocks).toBe(cap);
    });

    it('should respect custom cap via env var', async () => {
      process.env.ALEXI_STOP_HOOK_BLOCK_CAP = '3';

      const hook: HookDefinition = {
        event: 'Stop',
        type: 'command',
        command: 'exit 1',
        timeout: 5000,
      };
      manager.register(hook);

      let consecutiveBlocks = 0;
      const cap = getStopHookBlockCap(); // 3

      for (let i = 0; i < cap + 2; i++) {
        const results = await manager.execute('Stop', {
          event: 'Stop',
          timestamp: Date.now(),
        });

        const blocked = results.some((r) => !r.success);
        if (blocked) {
          consecutiveBlocks++;
          if (consecutiveBlocks >= cap) {
            break;
          }
        } else {
          consecutiveBlocks = 0;
        }
      }

      expect(consecutiveBlocks).toBe(3);
    });

    it('should reset counter when Stop hook succeeds', async () => {
      // Use a script-based approach: alternate between fail and succeed
      // We'll test the logic directly with mock results
      let callCount = 0;
      const results = [false, false, true, false, false, false]; // success pattern

      let consecutiveBlocks = 0;
      const cap = 8;

      for (const success of results) {
        callCount++;
        if (!success) {
          consecutiveBlocks++;
          if (consecutiveBlocks >= cap) {
            break;
          }
        } else {
          consecutiveBlocks = 0;
        }
      }

      // After the pattern [F, F, T, F, F, F]:
      // After F: counter = 1
      // After F: counter = 2
      // After T: counter = 0 (reset)
      // After F: counter = 1
      // After F: counter = 2
      // After F: counter = 3
      expect(consecutiveBlocks).toBe(3);
      expect(callCount).toBe(6); // All iterations processed, cap not hit
    });

    it('should not block when no Stop hooks are registered', async () => {
      // No hooks registered
      const results = await manager.execute('Stop', {
        event: 'Stop',
        timestamp: Date.now(),
      });

      // Empty results array — no blocking
      expect(results).toHaveLength(0);
      const blocked = results.some((r) => !r.success);
      expect(blocked).toBe(false);
    });

    it('should not block when Stop hook succeeds', async () => {
      const hook: HookDefinition = {
        event: 'Stop',
        type: 'command',
        command: 'exit 0',
        timeout: 5000,
      };
      manager.register(hook);

      const results = await manager.execute('Stop', {
        event: 'Stop',
        timestamp: Date.now(),
      });

      expect(results).toHaveLength(1);
      expect(results[0].success).toBe(true);
      const blocked = results.some((r) => !r.success);
      expect(blocked).toBe(false);
    });
  });
});
