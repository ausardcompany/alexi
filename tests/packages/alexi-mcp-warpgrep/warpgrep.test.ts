import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import {
  WarpGrepParamsSchema,
  WARPGREP_DESCRIPTION,
  isWarpgrepAvailable,
  resetWarpgrepClientLoader,
  setWarpgrepClientLoader,
  warpgrepExecute,
} from '../../../packages/alexi-mcp-warpgrep/src/warpgrep.js';
import { createWarpgrepServer } from '../../../packages/alexi-mcp-warpgrep/src/index.js';

describe('alexi-mcp-warpgrep - core', () => {
  afterEach(() => {
    resetWarpgrepClientLoader();
    delete process.env['MORPH_API_KEY'];
  });

  describe('WarpGrepParamsSchema', () => {
    it('parses a valid query', () => {
      const result = WarpGrepParamsSchema.safeParse({ query: 'user login' });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.query).toBe('user login');
      }
    });

    it('rejects a missing query', () => {
      const result = WarpGrepParamsSchema.safeParse({});
      expect(result.success).toBe(false);
    });

    it('rejects a non-string query', () => {
      const result = WarpGrepParamsSchema.safeParse({ query: 42 });
      expect(result.success).toBe(false);
    });
  });

  describe('WARPGREP_DESCRIPTION', () => {
    it('exposes usage guidance for LLM clients', () => {
      expect(WARPGREP_DESCRIPTION).toContain('semantic meaning');
      expect(WARPGREP_DESCRIPTION).toContain('When to use');
      expect(WARPGREP_DESCRIPTION).toContain('When NOT to use');
    });
  });

  describe('isWarpgrepAvailable', () => {
    it('returns false when @morphllm/morphsdk is not resolvable', () => {
      // In this test environment, @morphllm/morphsdk is not installed.
      expect(isWarpgrepAvailable()).toBe(false);
    });
  });

  describe('warpgrepExecute - error paths', () => {
    it('returns an error when @morphllm/morphsdk is unavailable', async () => {
      setWarpgrepClientLoader(async () => null);
      const outcome = await warpgrepExecute({ query: 'anything' });
      expect(outcome.success).toBe(false);
      if (!outcome.success) {
        expect(outcome.error).toContain('@morphllm/morphsdk');
      }
    });

    it('returns an error on invalid parameters', async () => {
      setWarpgrepClientLoader(async () => {
        throw new Error('should not be called');
      });
      const outcome = await warpgrepExecute({ notAQuery: true });
      expect(outcome.success).toBe(false);
      if (!outcome.success) {
        expect(outcome.error).toContain('Invalid parameters');
      }
    });

    it('surfaces underlying client failures', async () => {
      setWarpgrepClientLoader(async () => {
        return class FakeClient {
          async execute(): Promise<{ success: boolean; error: string }> {
            return { success: false, error: 'upstream 502' };
          }
        } as unknown as Parameters<typeof setWarpgrepClientLoader>[0] extends () => Promise<infer T>
          ? T
          : never;
      });

      const outcome = await warpgrepExecute({ query: 'x' });
      expect(outcome.success).toBe(false);
      if (!outcome.success) {
        expect(outcome.error).toContain('Search failed');
        expect(outcome.error).toContain('upstream 502');
      }
    });

    it('wraps thrown client errors', async () => {
      setWarpgrepClientLoader(async () => {
        return class ExplodingClient {
          async execute(): Promise<never> {
            throw new Error('boom');
          }
        } as unknown as Parameters<typeof setWarpgrepClientLoader>[0] extends () => Promise<infer T>
          ? T
          : never;
      });

      const outcome = await warpgrepExecute({ query: 'x' });
      expect(outcome.success).toBe(false);
      if (!outcome.success) {
        expect(outcome.error).toContain('WarpGrep search failed');
        expect(outcome.error).toContain('boom');
      }
    });
  });

  describe('warpgrepExecute - success paths', () => {
    it('returns spans on a successful search', async () => {
      const spans = [
        {
          filePath: 'src/auth.ts',
          startLine: 10,
          endLine: 20,
          content: 'export function login() {}',
        },
      ];

      const captured: { searchTerm?: string; repoRoot?: string } = {};
      setWarpgrepClientLoader(async () => {
        return class OkClient {
          constructor(_config: unknown) {}
          async execute(input: {
            searchTerm: string;
            repoRoot: string;
          }): Promise<{ success: boolean; codeSpans: typeof spans }> {
            captured.searchTerm = input.searchTerm;
            captured.repoRoot = input.repoRoot;
            return { success: true, codeSpans: spans };
          }
        } as unknown as Parameters<typeof setWarpgrepClientLoader>[0] extends () => Promise<infer T>
          ? T
          : never;
      });

      const outcome = await warpgrepExecute(
        { query: 'user login' },
        { repoRoot: '/tmp/some/repo' }
      );
      expect(outcome.success).toBe(true);
      if (outcome.success) {
        expect(outcome.data.spans).toEqual(spans);
        expect(outcome.data.query).toBe('user login');
      }
      expect(captured.searchTerm).toBe('user login');
      expect(captured.repoRoot).toBe('/tmp/some/repo');
    });

    it('returns a hint when there are zero spans', async () => {
      setWarpgrepClientLoader(async () => {
        return class EmptyClient {
          constructor(_config: unknown) {}
          async execute(): Promise<{ success: boolean; codeSpans: [] }> {
            return { success: true, codeSpans: [] };
          }
        } as unknown as Parameters<typeof setWarpgrepClientLoader>[0] extends () => Promise<infer T>
          ? T
          : never;
      });

      const outcome = await warpgrepExecute({ query: 'nothing here' });
      expect(outcome.success).toBe(true);
      if (outcome.success) {
        expect(outcome.data.spans).toEqual([]);
        expect(outcome.hint).toContain('No relevant code found');
      }
    });

    it('uses the api key when MORPH_API_KEY is set', async () => {
      process.env['MORPH_API_KEY'] = 'secret-key';
      const configs: Array<{ morphApiKey: string; morphApiUrl?: string }> = [];

      setWarpgrepClientLoader(async () => {
        return class ConfigCaptureClient {
          constructor(config: { morphApiKey: string; morphApiUrl?: string }) {
            configs.push(config);
          }
          async execute(): Promise<{ success: boolean; codeSpans: [] }> {
            return { success: true, codeSpans: [] };
          }
        } as unknown as Parameters<typeof setWarpgrepClientLoader>[0] extends () => Promise<infer T>
          ? T
          : never;
      });

      await warpgrepExecute({ query: 'x' });
      expect(configs.length).toBe(1);
      expect(configs[0].morphApiKey).toBe('secret-key');
      expect(configs[0].morphApiUrl).toBeUndefined();
    });

    it('falls back to the kilo proxy url when MORPH_API_KEY is missing', async () => {
      delete process.env['MORPH_API_KEY'];
      const configs: Array<{ morphApiKey: string; morphApiUrl?: string }> = [];

      setWarpgrepClientLoader(async () => {
        return class ConfigCaptureClient {
          constructor(config: { morphApiKey: string; morphApiUrl?: string }) {
            configs.push(config);
          }
          async execute(): Promise<{ success: boolean; codeSpans: [] }> {
            return { success: true, codeSpans: [] };
          }
        } as unknown as Parameters<typeof setWarpgrepClientLoader>[0] extends () => Promise<infer T>
          ? T
          : never;
      });

      await warpgrepExecute({ query: 'x' });
      expect(configs.length).toBe(1);
      expect(configs[0].morphApiKey).toBe('kilo-free');
      expect(configs[0].morphApiUrl).toBe('https://api.kilo.ai/api/gateway');
    });
  });
});

describe('alexi-mcp-warpgrep - MCP server', () => {
  afterEach(() => {
    resetWarpgrepClientLoader();
  });

  it('creates an McpServer with codebase_search registered', () => {
    const server = createWarpgrepServer();
    // The high-level McpServer type does not expose a public tools() getter,
    // but it exposes the underlying `server` field. We assert on the
    // JSON-Schema shape indirectly through `toolInputSchemaJson`.
    const schema = (
      server as unknown as {
        toolInputSchemaJson: (name: string) => Record<string, unknown> | undefined;
      }
    ).toolInputSchemaJson('codebase_search');
    expect(schema).toBeDefined();
    expect(schema).toMatchObject({ type: 'object' });
  });

  it('does not register any tool other than codebase_search', () => {
    const server = createWarpgrepServer();
    const schema = (
      server as unknown as {
        toolInputSchemaJson: (name: string) => Record<string, unknown> | undefined;
      }
    ).toolInputSchemaJson('some_other_tool');
    expect(schema).toBeUndefined();
  });
});

describe('alexi-mcp-warpgrep - entry module', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('exports createWarpgrepServer and main', async () => {
    const mod = await import('../../../packages/alexi-mcp-warpgrep/src/index.js');
    expect(typeof mod.createWarpgrepServer).toBe('function');
    expect(typeof mod.main).toBe('function');
  });
});
