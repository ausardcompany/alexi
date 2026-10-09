/**
 * Dispatcher coverage audit for every HookEvent type.
 *
 * Context: upstream Cline PR #14945 (2026-10-09) fixed a dispatcher that
 * fell through to a default branch for one event type (`agent_error`),
 * returning a non-JSON failure instead of an empty-object success.
 *
 * Alexi's hook runtime routes event dispatch through a
 * `Map<HookEvent, HookDefinition[]>` and then branches on `hook.type`
 * (command / http / script), so there is no per-event switch that can
 * silently drop an event. This test pins that contract: for EVERY event
 * declared in the `HookEvent` union, `HookManagerImpl.execute()` must
 * return a well-formed `HookResult` without hitting a default/unknown
 * fallthrough branch.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { HookManagerImpl, type HookContext, type HookEvent } from '../../src/hooks/index.js';

/** Every event in the `HookEvent` union. Keep in sync with src/hooks/index.ts L24-32. */
const ALL_EVENTS: HookEvent[] = [
  'SessionStart',
  'SessionEnd',
  'PreToolUse',
  'PostToolUse',
  'PostToolUseFailure',
  'PermissionRequest',
  'Stop',
  'Error',
];

describe('Hook dispatcher coverage: every HookEvent type', () => {
  let manager: HookManagerImpl;

  beforeEach(() => {
    manager = new HookManagerImpl();
  });

  afterEach(() => {
    manager.clear();
  });

  describe('empty registry: dispatcher returns [] without throwing', () => {
    for (const event of ALL_EVENTS) {
      it(`returns [] for ${event} when no hooks registered`, async () => {
        const context: HookContext = { event, timestamp: Date.now() };
        const results = await manager.execute(event, context);
        expect(results).toEqual([]);
      });
    }
  });

  describe('registered command hook: dispatcher runs it for every event', () => {
    for (const event of ALL_EVENTS) {
      it(`dispatches a command hook for ${event} and returns a well-formed result`, async () => {
        manager.register({
          event,
          type: 'command',
          command: 'echo ok',
        });

        const context: HookContext = { event, timestamp: Date.now() };
        const results = await manager.execute(event, context);

        expect(results).toHaveLength(1);
        const [result] = results;
        expect(result).toBeDefined();
        expect(typeof result.success).toBe('boolean');
        expect(typeof result.duration).toBe('number');
        // Did not fall through to an "Unknown hook type" branch.
        expect(result.error ?? '').not.toMatch(/Unknown hook type/);
        expect(result.success).toBe(true);
        expect(result.output?.trim()).toBe('ok');
      });
    }
  });

  describe('registered http hook: dispatcher runs it for tool-use/perm/stop events', () => {
    // SessionStart, SessionEnd, Error are command-only by design (see
    // COMMAND_ONLY_EVENTS in src/hooks/index.ts). Those events are
    // covered by the command-hook block above.
    const httpCompatible: HookEvent[] = [
      'PreToolUse',
      'PostToolUse',
      'PostToolUseFailure',
      'PermissionRequest',
      'Stop',
    ];

    for (const event of httpCompatible) {
      it(`dispatches an http hook for ${event}`, async () => {
        const mockFetch = vi.fn().mockResolvedValue({
          ok: true,
          status: 200,
          statusText: 'OK',
          text: () => Promise.resolve('{}'),
        });
        vi.stubGlobal('fetch', mockFetch);

        manager.register({
          event,
          type: 'http',
          url: 'https://example.invalid/hook',
          method: 'POST',
        });

        const context: HookContext = {
          event,
          timestamp: Date.now(),
          toolName: 'read',
        };

        const results = await manager.execute(event, context);
        expect(results).toHaveLength(1);
        const [result] = results;
        expect(result.success).toBe(true);
        expect(result.output).toBe('{}');
        expect(mockFetch).toHaveBeenCalledOnce();

        vi.unstubAllGlobals();
      });
    }
  });

  describe('unknown hook type: dispatcher falls through to default branch safely', () => {
    it('returns success:false with "Unknown hook type" when type is tampered post-registration', async () => {
      manager.register({
        event: 'PostToolUse',
        type: 'command',
        command: 'echo ok',
      });

      // Simulate a corrupted registry entry (e.g., a future type the
      // dispatcher doesn't know about). Cast through unknown because the
      // dispatcher switch has a default branch exactly for this case.
      const [registered] = manager.getHooks('PostToolUse');
      (registered as unknown as { type: string }).type = 'bogus';

      const context: HookContext = {
        event: 'PostToolUse',
        timestamp: Date.now(),
      };
      const results = await manager.execute('PostToolUse', context);

      expect(results).toHaveLength(1);
      expect(results[0].success).toBe(false);
      expect(results[0].error).toContain('Unknown hook type');
    });
  });
});
