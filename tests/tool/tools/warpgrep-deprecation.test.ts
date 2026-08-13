import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

/**
 * Verifies the built-in `codebase_search` (WarpGrep) tool emits a one-shot
 * deprecation warning pointing users at the standalone MCP server.
 *
 * The tool itself falls back to an "SDK missing" error path in the test
 * environment (because `@morphllm/morphsdk` is not installed), which is
 * exactly the code path we need to exercise: the deprecation warning is
 * emitted BEFORE the SDK availability check.
 */
describe('warpgrep built-in tool - deprecation warning', () => {
  const warnMock = vi.fn();

  beforeEach(async () => {
    vi.resetModules();
    warnMock.mockClear();

    // Mock the logger so we can assert on `warn` calls. Must be registered
    // BEFORE the SUT is imported, hence the `vi.doMock` + dynamic import
    // pattern rather than a top-level `vi.mock`.
    vi.doMock('../../../src/utils/logger.js', () => ({
      logger: {
        debug: vi.fn(),
        info: vi.fn(),
        warn: warnMock,
        error: vi.fn(),
        print: vi.fn(),
        setLevel: vi.fn(),
      },
      default: {
        debug: vi.fn(),
        info: vi.fn(),
        warn: warnMock,
        error: vi.fn(),
        print: vi.fn(),
        setLevel: vi.fn(),
      },
    }));

    // Also mock telemetry to avoid pulling in real reporting during tests.
    vi.doMock('../../../src/utils/telemetry.js', () => ({
      Telemetry: {
        track: vi.fn(),
      },
    }));
  });

  afterEach(() => {
    vi.doUnmock('../../../src/utils/logger.js');
    vi.doUnmock('../../../src/utils/telemetry.js');
  });

  it('emits the deprecation warning on first call', async () => {
    const mod = await import('../../../src/tool/tools/warpgrep.js');
    mod._resetWarpgrepDeprecationWarning();

    const result = await mod.warpgrepTool.executeUnsafe({ query: 'anything' }, { workdir: '/tmp' });

    // The SDK is not installed in the test environment, so we expect the
    // "SDK missing" failure. What we care about here is the warn call.
    expect(result.success).toBe(false);
    expect(warnMock).toHaveBeenCalledTimes(1);
    const warnMessage = String(warnMock.mock.calls[0][0]);
    expect(warnMessage).toContain('deprecated');
    expect(warnMessage).toContain('alexi-mcp-warpgrep');
  });

  it('only emits the deprecation warning once per process', async () => {
    const mod = await import('../../../src/tool/tools/warpgrep.js');
    mod._resetWarpgrepDeprecationWarning();

    await mod.warpgrepTool.executeUnsafe({ query: 'first' }, { workdir: '/tmp' });
    await mod.warpgrepTool.executeUnsafe({ query: 'second' }, { workdir: '/tmp' });
    await mod.warpgrepTool.executeUnsafe({ query: 'third' }, { workdir: '/tmp' });

    expect(warnMock).toHaveBeenCalledTimes(1);
  });
});
