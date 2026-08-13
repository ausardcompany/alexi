import { describe, it, expect } from 'vitest';

/**
 * The built-in `codebase_search` (WarpGrep) tool has been removed entirely.
 * There is nothing to deprecate anymore — the tool is simply gone. This
 * test pins the module contract so no caller can accidentally reintroduce
 * `warpgrepTool` without also updating the removal migration.
 */
describe('warpgrep built-in tool - removal contract', () => {
  it('does not export warpgrepTool from the tool module', async () => {
    const mod = (await import('../../../src/tool/tools/warpgrep.js')) as Record<string, unknown>;
    expect(mod.warpgrepTool).toBeUndefined();
  });

  it('still exports isWarpgrepAvailable for the grep-hint switch', async () => {
    const mod = await import('../../../src/tool/tools/warpgrep.js');
    expect(typeof mod.isWarpgrepAvailable).toBe('function');
    // In the test environment @morphllm/morphsdk is not installed.
    expect(mod.isWarpgrepAvailable()).toBe(false);
  });

  it('exposes _resetWarpgrepDeprecationWarning as a no-op for test compatibility', async () => {
    const mod = await import('../../../src/tool/tools/warpgrep.js');
    expect(typeof mod._resetWarpgrepDeprecationWarning).toBe('function');
    expect(() => mod._resetWarpgrepDeprecationWarning()).not.toThrow();
  });
});
