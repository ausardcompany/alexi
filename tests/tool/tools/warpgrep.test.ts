import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

/**
 * The built-in `codebase_search` (WarpGrep) tool has been removed. Semantic
 * codebase search is now provided by the standalone `alexi-mcp-warpgrep`
 * MCP server. These tests pin that contract so it does not silently
 * regress: the tool must NOT appear in `builtInTools` regardless of
 * whether `@morphllm/morphsdk` is installed, and the `grep` tool
 * description must still surface a "how to enable semantic search" hint
 * when the SDK is unavailable.
 */
describe('WarpGrep built-in tool - removed from registry', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('is not present in builtInTools when morphsdk is unavailable', async () => {
    const { builtInTools } = await import('../../../src/tool/tools/index.js');
    const toolNames = builtInTools.map((t) => t.name);
    expect(toolNames).not.toContain('codebase_search');
  });

  it('adds the install hint to grep description when morphsdk is unavailable', async () => {
    const { builtInTools } = await import('../../../src/tool/tools/index.js');
    const grepRegistered = builtInTools.find((t) => t.name === 'grep');
    expect(grepRegistered).toBeDefined();
    expect(grepRegistered!.description).toContain(
      'Note: For semantic code search, install @morphllm/morphsdk'
    );
  });

  it('adds the install hint to grep toFunctionSchema description', async () => {
    const { builtInTools } = await import('../../../src/tool/tools/index.js');
    const grepRegistered = builtInTools.find((t) => t.name === 'grep');
    expect(grepRegistered).toBeDefined();
    const schema = grepRegistered!.toFunctionSchema();
    expect(schema.description).toContain(
      'Note: For semantic code search, install @morphllm/morphsdk'
    );
  });

  it('remains absent from builtInTools even when morphsdk resolves', async () => {
    // Even if the SDK is present, we do NOT re-register the built-in tool:
    // semantic search is deliberately migrated to `alexi-mcp-warpgrep`.
    vi.doMock('../../../src/tool/tools/warpgrep.js', async () => {
      const actual = await vi.importActual<typeof import('../../../src/tool/tools/warpgrep.js')>(
        '../../../src/tool/tools/warpgrep.js'
      );
      return {
        ...actual,
        isWarpgrepAvailable: () => true,
      };
    });

    const { builtInTools } = await import('../../../src/tool/tools/index.js');
    const toolNames = builtInTools.map((t) => t.name);
    expect(toolNames).not.toContain('codebase_search');
  });
});
