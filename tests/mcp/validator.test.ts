import { describe, it, expect } from 'vitest';
import { validateMcpResponse } from '../../src/mcp/validator.js';

describe('validateMcpResponse — JSON-RPC envelope', () => {
  it('accepts a valid JSON-RPC envelope with a tools/list result', () => {
    const response = {
      jsonrpc: '2.0',
      id: 1,
      result: {
        tools: [{ name: 'search', inputSchema: { type: 'object' } }],
      },
    };
    const result = validateMcpResponse(response, 'tools/list', 'srv');
    expect(result.valid).toBe(true);
    expect(result.violations).toEqual([]);
  });

  it('flags a missing jsonrpc field in an envelope-shaped response', () => {
    const response = {
      id: 1,
      result: { tools: [] },
    };
    const result = validateMcpResponse(response, 'tools/list', 'srv');
    expect(result.valid).toBe(false);
    expect(result.violations.some((v) => v.includes('jsonrpc'))).toBe(true);
  });

  it('flags a wrong jsonrpc value', () => {
    const response = {
      jsonrpc: '1.0',
      id: 1,
      result: { tools: [] },
    };
    const result = validateMcpResponse(response, 'tools/list', 'srv');
    expect(result.valid).toBe(false);
    expect(result.violations.some((v) => v.includes('jsonrpc'))).toBe(true);
  });

  it('flags an envelope with both result and error set', () => {
    const response = {
      jsonrpc: '2.0',
      id: 1,
      result: { tools: [] },
      error: { code: -32000, message: 'something' },
    };
    const result = validateMcpResponse(response, 'tools/list', 'srv');
    expect(result.valid).toBe(false);
    expect(result.violations.some((v) => v.includes('BOTH'))).toBe(true);
  });

  it('flags an envelope with neither result nor error', () => {
    const response = {
      jsonrpc: '2.0',
      id: 1,
    };
    const result = validateMcpResponse(response, 'tools/list', 'srv');
    expect(result.valid).toBe(false);
    expect(result.violations.some((v) => v.includes('neither'))).toBe(true);
  });

  it('accepts an error envelope without validating payload shape', () => {
    const response = {
      jsonrpc: '2.0',
      id: 1,
      error: { code: -32000, message: 'server error' },
    };
    const result = validateMcpResponse(response, 'tools/list', 'srv');
    expect(result.valid).toBe(true);
    expect(result.violations).toEqual([]);
  });

  it('accepts an id of null (spec-sanctioned for parse errors)', () => {
    const response = {
      jsonrpc: '2.0',
      id: null,
      error: { code: -32700, message: 'parse error' },
    };
    const result = validateMcpResponse(response, 'tools/list', 'srv');
    expect(result.valid).toBe(true);
  });

  it('treats a plain result payload (no envelope) as unwrapped', () => {
    const response = {
      tools: [{ name: 'search', inputSchema: { type: 'object' } }],
    };
    const result = validateMcpResponse(response, 'tools/list', 'srv');
    expect(result.valid).toBe(true);
  });
});

describe('validateMcpResponse — tools/list', () => {
  it('flags a tools/list missing the tools array', () => {
    const result = validateMcpResponse({}, 'tools/list', 'srv');
    expect(result.valid).toBe(false);
    expect(result.violations[0]).toContain("missing the 'tools' array");
  });

  it('flags a tool entry without a name', () => {
    const result = validateMcpResponse(
      { tools: [{ inputSchema: { type: 'object' } }] },
      'tools/list',
      'srv'
    );
    expect(result.valid).toBe(false);
    expect(result.violations.some((v) => v.includes('name'))).toBe(true);
  });

  it('flags a tool entry with empty name', () => {
    const result = validateMcpResponse(
      { tools: [{ name: '', inputSchema: { type: 'object' } }] },
      'tools/list',
      'srv'
    );
    expect(result.valid).toBe(false);
  });

  it('flags a tool entry without inputSchema', () => {
    const result = validateMcpResponse({ tools: [{ name: 'search' }] }, 'tools/list', 'srv');
    expect(result.valid).toBe(false);
    expect(result.violations.some((v) => v.toLowerCase().includes('inputschema'))).toBe(true);
  });

  it('flags an inputSchema missing a type field', () => {
    const result = validateMcpResponse(
      { tools: [{ name: 'search', inputSchema: {} }] },
      'tools/list',
      'srv'
    );
    expect(result.valid).toBe(false);
  });

  it('accepts a tools/list with multiple valid entries', () => {
    const result = validateMcpResponse(
      {
        tools: [
          { name: 'a', inputSchema: { type: 'object' } },
          { name: 'b', description: 'b', inputSchema: { type: 'object', properties: {} } },
        ],
      },
      'tools/list',
      'srv'
    );
    expect(result.valid).toBe(true);
  });

  it('flags a non-object result for tools/list', () => {
    const result = validateMcpResponse('nope', 'tools/list', 'srv');
    expect(result.valid).toBe(false);
    expect(result.violations[0]).toContain('non-object');
  });
});

describe('validateMcpResponse — resources/list', () => {
  it('accepts a valid resources/list response', () => {
    const result = validateMcpResponse(
      {
        resources: [
          { uri: 'file:///tmp/notes.md', name: 'notes' },
          { uri: 'https://example.com/doc', name: 'doc', mimeType: 'text/html' },
        ],
      },
      'resources/list',
      'srv'
    );
    expect(result.valid).toBe(true);
  });

  it('flags an invalid resource URI (missing scheme)', () => {
    const result = validateMcpResponse(
      { resources: [{ uri: 'notes.md', name: 'notes' }] },
      'resources/list',
      'srv'
    );
    expect(result.valid).toBe(false);
    expect(result.violations[0]).toContain('malformed URI');
  });

  it('flags an empty uri', () => {
    const result = validateMcpResponse(
      { resources: [{ uri: '', name: 'n' }] },
      'resources/list',
      'srv'
    );
    expect(result.valid).toBe(false);
  });

  it('flags a missing name', () => {
    const result = validateMcpResponse(
      { resources: [{ uri: 'file:///a' }] },
      'resources/list',
      'srv'
    );
    expect(result.valid).toBe(false);
  });

  it('flags a missing resources array', () => {
    const result = validateMcpResponse({}, 'resources/list', 'srv');
    expect(result.valid).toBe(false);
    expect(result.violations[0]).toContain("missing the 'resources' array");
  });
});

describe('validateMcpResponse — prompts/list', () => {
  it('accepts a valid prompts/list response', () => {
    const result = validateMcpResponse(
      { prompts: [{ name: 'summarise' }, { name: 'translate', description: 'translate text' }] },
      'prompts/list',
      'srv'
    );
    expect(result.valid).toBe(true);
  });

  it('flags a prompt with empty name', () => {
    const result = validateMcpResponse({ prompts: [{ name: '' }] }, 'prompts/list', 'srv');
    expect(result.valid).toBe(false);
  });

  it('flags a missing prompts array', () => {
    const result = validateMcpResponse({}, 'prompts/list', 'srv');
    expect(result.valid).toBe(false);
  });
});

describe('validateMcpResponse — completion/complete', () => {
  it('accepts a valid completion/complete response', () => {
    const result = validateMcpResponse(
      { completion: { values: ['a', 'b'], total: 2, hasMore: false } },
      'completion/complete',
      'srv'
    );
    expect(result.valid).toBe(true);
  });

  it('flags a missing completion object', () => {
    const result = validateMcpResponse({}, 'completion/complete', 'srv');
    expect(result.valid).toBe(false);
  });

  it('flags a completion.values that is not an array', () => {
    const result = validateMcpResponse(
      { completion: { values: 'nope' } },
      'completion/complete',
      'srv'
    );
    expect(result.valid).toBe(false);
  });

  it('flags a non-string value in completion.values', () => {
    const result = validateMcpResponse(
      { completion: { values: ['a', 42] } },
      'completion/complete',
      'srv'
    );
    expect(result.valid).toBe(false);
    expect(result.violations.some((v) => v.includes('not a string'))).toBe(true);
  });
});

describe('validateMcpResponse — unknown methods', () => {
  it('does not fail on a method the validator does not know about', () => {
    const result = validateMcpResponse(
      { jsonrpc: '2.0', id: 1, result: { arbitrary: true } },
      'logging/setLevel',
      'srv'
    );
    expect(result.valid).toBe(true);
  });

  it('still validates the JSON-RPC envelope for unknown methods', () => {
    const result = validateMcpResponse(
      { jsonrpc: '1.0', id: 1, result: {} },
      'logging/setLevel',
      'srv'
    );
    expect(result.valid).toBe(false);
  });
});

describe('validateMcpResponse — violation messages', () => {
  it('includes the server name and method in violation strings', () => {
    const result = validateMcpResponse(
      { tools: [{ inputSchema: { type: 'object' } }] },
      'tools/list',
      'my-server'
    );
    expect(result.valid).toBe(false);
    expect(result.violations.every((v) => v.includes('my-server'))).toBe(true);
  });
});
