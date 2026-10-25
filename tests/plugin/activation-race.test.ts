import { describe, it, expect, beforeEach } from 'vitest';
import { PluginManager, type Plugin } from '../../src/plugin/index.js';

/**
 * Regression tests for the plugin activation gate (upstream opencode PR
 * #51133 — "activation gate before tool dispatch"). The gate must:
 *
 *   1. Resolve immediately when no plugin is still activating.
 *   2. Wait for an in-flight slow `onLoad()` to finish before returning,
 *      so a plugin-provided tool invoked right after `load()` sees a
 *      ready plugin instead of the "command not found" heisenbug.
 *   3. Collapse concurrent `ensureActivated()` calls onto the same
 *      underlying activation promise (no duplicate waits, no fan-out).
 *   4. Skip disabled plugins so their activation state cannot stall the
 *      gate.
 *   5. Report via `isActivated()` / `findPluginForTool()` so tool-readiness
 *      checks can produce a human-readable "plugin X still activating"
 *      error instead of a bare registry miss.
 */

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Build a plugin whose `onLoad` sleeps for `delayMs`, letting a parallel
 * test task race the activation window. Captures a boolean the test can
 * assert on to confirm the gate waited for `onLoad` to actually finish.
 */
function slowPlugin(name: string, delayMs: number): { plugin: Plugin; finished: () => boolean } {
  let done = false;
  const plugin: Plugin = {
    name,
    version: '1.0.0',
    async onLoad(): Promise<void> {
      await sleep(delayMs);
      done = true;
    },
  };
  return { plugin, finished: () => done };
}

describe('Plugin activation gate (ensureActivated)', () => {
  let manager: PluginManager;

  beforeEach(() => {
    manager = new PluginManager('/tmp/alexi-activation-test');
  });

  it('resolves immediately when no plugins are activating', async () => {
    const start = Date.now();
    await manager.ensureActivated();
    const elapsed = Date.now() - start;
    expect(elapsed).toBeLessThan(50);
    expect(manager.isActivated()).toBe(true);
  });

  it('awaits a slow onLoad before returning (heisenbug repro)', async () => {
    const { plugin, finished } = slowPlugin('slow-tool-plugin', 100);

    // Start load() but do NOT await it — simulate a tool dispatcher that
    // kicks off the agent loop immediately after calling load().
    const loadPromise = manager.load(plugin);

    // Give the microtask queue one tick so load() has registered the
    // plugin state and set `activating = true`.
    await sleep(0);

    // Sanity check: activation is actually in flight.
    expect(manager.isActivated()).toBe(false);

    // The gate must wait for onLoad to finish.
    await manager.ensureActivated();
    expect(finished()).toBe(true);
    expect(manager.isActivated()).toBe(true);

    // load() itself still resolves successfully.
    const result = await loadPromise;
    expect(result.success).toBe(true);
  });

  it('reports the owning plugin while activation is in flight', async () => {
    const plugin: Plugin = {
      name: 'owner-plugin',
      version: '1.0.0',
      tools: [
        {
          name: 'owned_tool',
          description: 'test',
          parameters: {} as never,
          execute: async () => ({ success: true, data: 'ok' }),
        },
      ],
      async onLoad(): Promise<void> {
        await sleep(80);
      },
    };

    const loadPromise = manager.load(plugin);
    await sleep(0);

    const owner = manager.findPluginForTool('owned_tool');
    expect(owner).toBeDefined();
    expect(owner?.pluginName).toBe('owner-plugin');
    expect(owner?.activating).toBe(true);

    await loadPromise;
    const settled = manager.findPluginForTool('owned_tool');
    expect(settled?.activating).toBe(false);
  });

  it('collapses concurrent ensureActivated() calls onto one activation', async () => {
    const { plugin } = slowPlugin('shared-plugin', 60);
    const loadPromise = manager.load(plugin);
    await sleep(0);

    const start = Date.now();
    await Promise.all([
      manager.ensureActivated(),
      manager.ensureActivated(),
      manager.ensureActivated(),
    ]);
    const elapsed = Date.now() - start;

    // All three calls finish together — not three serialised waits.
    expect(elapsed).toBeLessThan(150);
    await loadPromise;
  });

  it('ignores disabled plugins so they cannot stall the gate', async () => {
    // Load a fast plugin so we have something to disable.
    const fast: Plugin = { name: 'fast', version: '1.0.0' };
    const slow: Plugin = {
      name: 'slow',
      version: '1.0.0',
      async onLoad(): Promise<void> {
        await sleep(200);
      },
    };

    await manager.load(fast);
    const slowLoad = manager.load(slow);
    await sleep(0);

    // Disable the slow plugin before the gate is checked. Disabled plugins
    // are not advertised to the model, so their activation state must
    // not block tool dispatch.
    manager.disable('slow', { force: true });

    const start = Date.now();
    await manager.ensureActivated();
    const elapsed = Date.now() - start;
    expect(elapsed).toBeLessThan(100);

    // Clean up the dangling load so vitest does not warn.
    await slowLoad;
  });

  it('resolves cleanly when the plugin has no onLoad hook', async () => {
    const plugin: Plugin = { name: 'no-hook', version: '1.0.0' };
    await manager.load(plugin);
    const start = Date.now();
    await manager.ensureActivated();
    const elapsed = Date.now() - start;
    expect(elapsed).toBeLessThan(20);
    expect(manager.isActivated()).toBe(true);
  });

  it('does not get stuck when onLoad throws', async () => {
    const plugin: Plugin = {
      name: 'bad-plugin',
      version: '1.0.0',
      async onLoad(): Promise<void> {
        await sleep(20);
        throw new Error('boom');
      },
    };
    // load() returns a failed LoadResult (not throws) — the activation
    // promise still settles so the gate must not deadlock.
    const result = await manager.load(plugin);
    expect(result.success).toBe(false);

    const start = Date.now();
    await manager.ensureActivated();
    const elapsed = Date.now() - start;
    expect(elapsed).toBeLessThan(50);
    expect(manager.isActivated()).toBe(true);
  });

  it('returns undefined from findPluginForTool for an unknown tool', () => {
    const owner = manager.findPluginForTool('does_not_exist');
    expect(owner).toBeUndefined();
  });
});
