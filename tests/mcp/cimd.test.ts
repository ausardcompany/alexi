import { describe, it, expect } from 'vitest';
import {
  buildManifestFromTools,
  McpCapabilityMismatchError,
  validateCapabilities,
  CapabilityManifestSchema,
  type CapabilityManifest,
} from '../../src/mcp/cimd.js';
import type { McpServerConfig } from '../../src/mcp/config.js';

/**
 * Build a stdio server config with sensible defaults for CIMD tests.
 * Individual tests override `expectedCapabilities` and `cimdEnabled`.
 */
function makeServer(overrides: Partial<McpServerConfig> = {}): McpServerConfig {
  return {
    name: 'test-server',
    transport: 'stdio',
    command: 'node',
    args: ['server.js'],
    enabled: true,
    ...overrides,
  };
}

describe('CapabilityManifestSchema', () => {
  it('accepts a manifest with only tools', () => {
    const parsed = CapabilityManifestSchema.parse({
      tools: [{ name: 'search' }],
    });
    expect(parsed.tools).toHaveLength(1);
  });

  it('accepts a manifest with protocolVersion and tools', () => {
    const parsed = CapabilityManifestSchema.parse({
      protocolVersion: '2024-11-05',
      tools: [
        {
          name: 'echo',
          description: 'echoes input',
          inputSchema: { type: 'object', properties: { text: { type: 'string' } } },
        },
      ],
    });
    expect(parsed.protocolVersion).toBe('2024-11-05');
    expect(parsed.tools?.[0].name).toBe('echo');
  });

  it('rejects a tool without a name', () => {
    const result = CapabilityManifestSchema.safeParse({ tools: [{ description: 'no name' }] });
    expect(result.success).toBe(false);
  });
});

describe('buildManifestFromTools', () => {
  it('projects tool fields onto the manifest shape', () => {
    const manifest = buildManifestFromTools(
      [{ name: 'a', description: 'A tool', inputSchema: { type: 'object' } }, { name: 'b' }],
      '2024-11-05'
    );
    expect(manifest.protocolVersion).toBe('2024-11-05');
    expect(manifest.tools).toEqual([
      { name: 'a', description: 'A tool', inputSchema: { type: 'object' } },
      { name: 'b', description: undefined, inputSchema: undefined },
    ]);
  });

  it('omits protocolVersion when none is supplied', () => {
    const manifest = buildManifestFromTools([{ name: 'a' }]);
    expect(manifest.protocolVersion).toBeUndefined();
    expect(manifest.tools).toHaveLength(1);
  });
});

describe('validateCapabilities', () => {
  describe('backward compatibility', () => {
    it('is a no-op when the server has no expectedCapabilities (cimdEnabled=false)', () => {
      const server = makeServer();
      const manifest: CapabilityManifest = { tools: [{ name: 'search' }] };
      const result = validateCapabilities(server, manifest);
      expect(result.valid).toBe(true);
      expect(result.mismatches).toEqual([]);
      expect(result.warnings).toEqual([]);
    });

    it('is a no-op when the server has no expectedCapabilities (cimdEnabled=true)', () => {
      const server = makeServer({ cimdEnabled: true });
      const manifest: CapabilityManifest = { tools: [] };
      const result = validateCapabilities(server, manifest);
      expect(result.valid).toBe(true);
      expect(result.mismatches).toEqual([]);
    });
  });

  describe('protocol version', () => {
    it('flags an incompatible protocol version', () => {
      const server = makeServer({
        expectedCapabilities: { protocolVersion: '2024-11-05' },
      });
      const manifest: CapabilityManifest = { protocolVersion: '2025-03-01' };
      const result = validateCapabilities(server, manifest);
      expect(result.valid).toBe(false);
      expect(result.mismatches).toHaveLength(1);
      expect(result.mismatches[0].kind).toBe('protocol_version_incompatible');
      expect(result.mismatches[0].message).toContain('2024-11-05');
      expect(result.mismatches[0].message).toContain('2025-03-01');
    });

    it('accepts matching protocol versions', () => {
      const server = makeServer({
        expectedCapabilities: { protocolVersion: '2024-11-05' },
      });
      const manifest: CapabilityManifest = { protocolVersion: '2024-11-05' };
      expect(validateCapabilities(server, manifest).valid).toBe(true);
    });

    it('skips protocol-version check when the actual manifest omits the field', () => {
      const server = makeServer({
        expectedCapabilities: { protocolVersion: '2024-11-05' },
      });
      const manifest: CapabilityManifest = {};
      expect(validateCapabilities(server, manifest).valid).toBe(true);
    });

    it('skips protocol-version check when the expected manifest omits the field', () => {
      const server = makeServer({ expectedCapabilities: { tools: [] } });
      const manifest: CapabilityManifest = { protocolVersion: '2024-11-05' };
      expect(validateCapabilities(server, manifest).valid).toBe(true);
    });
  });

  describe('tool removal', () => {
    it('flags a tool that disappeared from the actual manifest', () => {
      const server = makeServer({
        expectedCapabilities: {
          tools: [{ name: 'search' }, { name: 'summarise' }],
        },
      });
      const manifest: CapabilityManifest = { tools: [{ name: 'search' }] };
      const result = validateCapabilities(server, manifest);
      expect(result.valid).toBe(false);
      expect(result.mismatches).toHaveLength(1);
      expect(result.mismatches[0].kind).toBe('tool_removed');
      expect(result.mismatches[0].toolName).toBe('summarise');
    });

    it('flags every removed tool independently', () => {
      const server = makeServer({
        expectedCapabilities: {
          tools: [{ name: 'a' }, { name: 'b' }, { name: 'c' }],
        },
      });
      const manifest: CapabilityManifest = { tools: [{ name: 'a' }] };
      const removed = validateCapabilities(server, manifest).mismatches;
      expect(removed).toHaveLength(2);
      expect(removed.every((m) => m.kind === 'tool_removed')).toBe(true);
    });
  });

  describe('additive changes', () => {
    it('records a warning for new tools on the server side', () => {
      const server = makeServer({
        expectedCapabilities: { tools: [{ name: 'search' }] },
      });
      const manifest: CapabilityManifest = {
        tools: [{ name: 'search' }, { name: 'brand-new' }],
      };
      const result = validateCapabilities(server, manifest);
      expect(result.valid).toBe(true);
      expect(result.mismatches).toEqual([]);
      expect(result.warnings).toHaveLength(1);
      expect(result.warnings[0]).toContain('brand-new');
    });
  });

  describe('schema drift', () => {
    it('detects a changed input schema', () => {
      const server = makeServer({
        expectedCapabilities: {
          tools: [
            {
              name: 'search',
              inputSchema: {
                type: 'object',
                properties: { q: { type: 'string' } },
                required: ['q'],
              },
            },
          ],
        },
      });
      const manifest: CapabilityManifest = {
        tools: [
          {
            name: 'search',
            inputSchema: {
              type: 'object',
              properties: { query: { type: 'string' } },
              required: ['query'],
            },
          },
        ],
      };
      const result = validateCapabilities(server, manifest);
      expect(result.valid).toBe(false);
      expect(result.mismatches).toHaveLength(1);
      expect(result.mismatches[0].kind).toBe('tool_schema_changed');
      expect(result.mismatches[0].toolName).toBe('search');
    });

    it('treats structurally equal schemas with reordered keys as matching', () => {
      const server = makeServer({
        expectedCapabilities: {
          tools: [
            {
              name: 'search',
              inputSchema: {
                type: 'object',
                properties: { q: { type: 'string' }, limit: { type: 'number' } },
              },
            },
          ],
        },
      });
      const manifest: CapabilityManifest = {
        tools: [
          {
            name: 'search',
            inputSchema: {
              properties: { limit: { type: 'number' }, q: { type: 'string' } },
              type: 'object',
            },
          },
        ],
      };
      expect(validateCapabilities(server, manifest).valid).toBe(true);
    });

    it('skips schema comparison when the expected inputSchema is absent', () => {
      const server = makeServer({
        expectedCapabilities: { tools: [{ name: 'search' }] },
      });
      const manifest: CapabilityManifest = {
        tools: [
          {
            name: 'search',
            inputSchema: { type: 'object', properties: { q: { type: 'string' } } },
          },
        ],
      };
      expect(validateCapabilities(server, manifest).valid).toBe(true);
    });
  });

  describe('description drift', () => {
    it('flags a changed description as a low-severity mismatch', () => {
      const server = makeServer({
        expectedCapabilities: {
          tools: [{ name: 'search', description: 'Old description' }],
        },
      });
      const manifest: CapabilityManifest = {
        tools: [{ name: 'search', description: 'New description' }],
      };
      const result = validateCapabilities(server, manifest);
      expect(result.valid).toBe(false);
      expect(result.mismatches[0].kind).toBe('tool_description_changed');
    });

    it('does not flag description drift when the expected description is absent', () => {
      const server = makeServer({
        expectedCapabilities: { tools: [{ name: 'search' }] },
      });
      const manifest: CapabilityManifest = {
        tools: [{ name: 'search', description: 'Anything at all' }],
      };
      expect(validateCapabilities(server, manifest).valid).toBe(true);
    });
  });

  describe('composite failures', () => {
    it('collects protocol-version, tool-removal, and schema mismatches in one pass', () => {
      const server = makeServer({
        expectedCapabilities: {
          protocolVersion: '2024-11-05',
          tools: [
            { name: 'search', inputSchema: { type: 'object', properties: {} } },
            { name: 'summarise' },
          ],
        },
      });
      const manifest: CapabilityManifest = {
        protocolVersion: '2025-03-01',
        tools: [
          {
            name: 'search',
            inputSchema: { type: 'object', properties: { q: { type: 'string' } } },
          },
        ],
      };
      const result = validateCapabilities(server, manifest);
      expect(result.valid).toBe(false);
      const kinds = result.mismatches.map((m) => m.kind).sort();
      expect(kinds).toEqual(
        ['protocol_version_incompatible', 'tool_removed', 'tool_schema_changed'].sort()
      );
    });
  });
});

describe('McpCapabilityMismatchError', () => {
  it('carries the mismatch list and a multi-line actionable message', () => {
    const err = new McpCapabilityMismatchError('test-server', [
      { kind: 'tool_removed', toolName: 'search', message: 'search is gone' },
      { kind: 'tool_schema_changed', toolName: 'echo', message: 'echo schema changed' },
    ]);
    expect(err.name).toBe('McpCapabilityMismatchError');
    expect(err.serverName).toBe('test-server');
    expect(err.mismatches).toHaveLength(2);
    expect(err.message).toContain('search is gone');
    expect(err.message).toContain('echo schema changed');
    expect(err.message).toContain('cimdEnabled');
    expect(err.message).toContain('expectedCapabilities');
  });
});
