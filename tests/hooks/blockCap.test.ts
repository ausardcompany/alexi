import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  HookManagerImpl,
  STOP_HOOK_BLOCK_CAP,
  getBlockCap,
  type HookContext,
} from '../../src/hooks/index.js';

describe('Stop Hook Block Cap', () => {
  let manager: HookManagerImpl;

  beforeEach(() => {
    manager = new HookManagerImpl();
    vi.unstubAllEnvs();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  describe('getBlockCap()', () => {
    it('should return default cap of 8', () => {
      expect(getBlockCap()).toBe(8);
      expect(STOP_HOOK_BLOCK_CAP).toBe(8);
    });

    it('should read cap from ALEXI_STOP_HOOK_BLOCK_CAP env var', () => {
      vi.stubEnv('ALEXI_STOP_HOOK_BLOCK_CAP', '3');
      expect(getBlockCap()).toBe(3);
    });

    it('should fallback to default for invalid env var', () => {
      vi.stubEnv('ALEXI_STOP_HOOK_BLOCK_CAP', 'invalid');
      expect(getBlockCap()).toBe(8);
    });

    it('should fallback to default for zero value', () => {
      vi.stubEnv('ALEXI_STOP_HOOK_BLOCK_CAP', '0');
      expect(getBlockCap()).toBe(8);
    });

    it('should fallback to default for negative value', () => {
      vi.stubEnv('ALEXI_STOP_HOOK_BLOCK_CAP', '-5');
      expect(getBlockCap()).toBe(8);
    });
  });

  describe('Consecutive block tracking', () => {
    it('should increment counter on consecutive blocks', async () => {
      manager.register({
        event: 'Stop',
        type: 'command',
        command: 'exit 1', // Always fails
      });

      const context: HookContext = {
        event: 'Stop',
        timestamp: Date.now(),
      };

      // Execute multiple times - each should increment the counter
      const results1 = await manager.execute('Stop', context);
      expect(results1[0].success).toBe(false);
      expect(results1[0].capped).toBeUndefined();

      const results2 = await manager.execute('Stop', context);
      expect(results2[0].success).toBe(false);
      expect(results2[0].capped).toBeUndefined();
    });

    it('should reset counter on success', async () => {
      // Use a script-like approach: register a command that we can control
      // First, register a hook that will succeed
      manager.register({
        event: 'Stop',
        type: 'command',
        command: 'exit 1', // Fails
      });

      const context: HookContext = {
        event: 'Stop',
        timestamp: Date.now(),
      };

      // Fail a few times
      await manager.execute('Stop', context);
      await manager.execute('Stop', context);
      await manager.execute('Stop', context);

      // Now unregister and register a succeeding hook
      manager.unregister('Stop');
      manager.register({
        event: 'Stop',
        type: 'command',
        command: 'echo "ok"', // Succeeds
      });

      // This should reset the counter (different hook key since command changed)
      const results = await manager.execute('Stop', context);
      expect(results[0].success).toBe(true);
      expect(results[0].capped).toBeUndefined();
    });

    it('should cap after N consecutive blocks (default 8)', async () => {
      manager.register({
        event: 'Stop',
        type: 'command',
        command: 'exit 1', // Always fails
      });

      const context: HookContext = {
        event: 'Stop',
        timestamp: Date.now(),
      };

      // Execute 8 times to fill up the cap
      for (let i = 0; i < 8; i++) {
        const results = await manager.execute('Stop', context);
        expect(results[0].capped).toBeUndefined();
      }

      // 9th execution should be capped
      const cappedResults = await manager.execute('Stop', context);
      expect(cappedResults[0].success).toBe(false);
      expect(cappedResults[0].capped).toBe(true);
      expect(cappedResults[0].error).toContain('8 consecutive times');
    });

    it('should cap after custom N from env var', async () => {
      vi.stubEnv('ALEXI_STOP_HOOK_BLOCK_CAP', '3');

      manager.register({
        event: 'Stop',
        type: 'command',
        command: 'exit 1', // Always fails
      });

      const context: HookContext = {
        event: 'Stop',
        timestamp: Date.now(),
      };

      // Execute 3 times to fill up the cap
      for (let i = 0; i < 3; i++) {
        const results = await manager.execute('Stop', context);
        expect(results[0].capped).toBeUndefined();
      }

      // 4th execution should be capped
      const cappedResults = await manager.execute('Stop', context);
      expect(cappedResults[0].success).toBe(false);
      expect(cappedResults[0].capped).toBe(true);
      expect(cappedResults[0].error).toContain('3 consecutive times');
    });

    it('should set capped: true on result when cap is reached', async () => {
      vi.stubEnv('ALEXI_STOP_HOOK_BLOCK_CAP', '2');

      manager.register({
        event: 'Stop',
        type: 'command',
        command: 'exit 1',
      });

      const context: HookContext = {
        event: 'Stop',
        timestamp: Date.now(),
      };

      // Hit the cap
      await manager.execute('Stop', context);
      await manager.execute('Stop', context);

      // Should be capped now
      const results = await manager.execute('Stop', context);
      expect(results[0].capped).toBe(true);
      expect(results[0].success).toBe(false);
      expect(results[0].duration).toBe(0);
    });

    it('should not track blocks for non-Stop events', async () => {
      manager.register({
        event: 'PreToolUse',
        type: 'command',
        command: 'exit 1',
      });

      const context: HookContext = {
        event: 'PreToolUse',
        timestamp: Date.now(),
      };

      // Execute many times — should never get capped
      for (let i = 0; i < 20; i++) {
        const results = await manager.execute('PreToolUse', context);
        expect(results[0].success).toBe(false);
        expect(results[0].capped).toBeUndefined();
      }
    });
  });

  describe('resetBlockCount()', () => {
    it('should reset all counters when called without arguments', async () => {
      manager.register({
        event: 'Stop',
        type: 'command',
        command: 'exit 1',
      });

      const context: HookContext = {
        event: 'Stop',
        timestamp: Date.now(),
      };

      // Build up some counts
      for (let i = 0; i < 5; i++) {
        await manager.execute('Stop', context);
      }

      // Reset all
      manager.resetBlockCount();

      // Should need full cap again to get capped
      vi.stubEnv('ALEXI_STOP_HOOK_BLOCK_CAP', '2');
      await manager.execute('Stop', context);
      await manager.execute('Stop', context);

      const results = await manager.execute('Stop', context);
      expect(results[0].capped).toBe(true);
    });

    it('should reset only specified event counters', async () => {
      vi.stubEnv('ALEXI_STOP_HOOK_BLOCK_CAP', '2');

      manager.register({
        event: 'Stop',
        type: 'command',
        command: 'exit 1',
      });

      const context: HookContext = {
        event: 'Stop',
        timestamp: Date.now(),
      };

      // Build up the count to cap
      await manager.execute('Stop', context);
      await manager.execute('Stop', context);

      // Verify it's capped
      let results = await manager.execute('Stop', context);
      expect(results[0].capped).toBe(true);

      // Reset only Stop counters
      manager.resetBlockCount('Stop');

      // Should no longer be capped
      results = await manager.execute('Stop', context);
      expect(results[0].capped).toBeUndefined();
      expect(results[0].success).toBe(false);
    });
  });
});
