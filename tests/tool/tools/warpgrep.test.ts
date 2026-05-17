import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('WarpGrep Tool - Conditional Registration', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('isWarpgrepAvailable', () => {
    it('should return false when @morphllm/morphsdk is not resolvable', async () => {
      // In this test environment, @morphllm/morphsdk is not installed
      const { isWarpgrepAvailable } = await import('../../../src/tool/tools/warpgrep.js');
      expect(isWarpgrepAvailable()).toBe(false);
    });
  });

  describe('tool registration when morphsdk is unavailable', () => {
    it('should exclude codebase_search from builtInTools', async () => {
      // @morphllm/morphsdk is not installed in the test environment
      const { builtInTools } = await import('../../../src/tool/tools/index.js');

      const toolNames = builtInTools.map((t) => t.name);
      expect(toolNames).not.toContain('codebase_search');
    });

    it('should add hint to grep tool description', async () => {
      const { builtInTools } = await import('../../../src/tool/tools/index.js');

      const grepRegistered = builtInTools.find((t) => t.name === 'grep');
      expect(grepRegistered).toBeDefined();
      expect(grepRegistered!.description).toContain(
        'Note: For semantic code search, install @morphllm/morphsdk'
      );
    });

    it('should add hint to grep tool toFunctionSchema description', async () => {
      const { builtInTools } = await import('../../../src/tool/tools/index.js');

      const grepRegistered = builtInTools.find((t) => t.name === 'grep');
      expect(grepRegistered).toBeDefined();
      const schema = grepRegistered!.toFunctionSchema();
      expect(schema.description).toContain(
        'Note: For semantic code search, install @morphllm/morphsdk'
      );
    });
  });

  describe('tool registration when morphsdk is available', () => {
    beforeEach(() => {
      vi.resetModules();
      // Mock the warpgrep module to report availability as true
      vi.doMock('../../../src/tool/tools/warpgrep.js', async () => {
        const actual = await vi.importActual('../../../src/tool/tools/warpgrep.js');
        return {
          ...actual,
          isWarpgrepAvailable: () => true,
        };
      });
    });

    it('should include codebase_search in builtInTools', async () => {
      const { builtInTools } = await import('../../../src/tool/tools/index.js');

      const toolNames = builtInTools.map((t) => t.name);
      expect(toolNames).toContain('codebase_search');
    });

    it('should not add hint to grep tool description', async () => {
      const { builtInTools } = await import('../../../src/tool/tools/index.js');

      const grepRegistered = builtInTools.find((t) => t.name === 'grep');
      expect(grepRegistered).toBeDefined();
      expect(grepRegistered!.description).not.toContain(
        'Note: For semantic code search, install @morphllm/morphsdk'
      );
    });
  });
});
