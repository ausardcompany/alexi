import { describe, it, expect, beforeEach } from 'vitest';
import type { Agent } from './index.js';
import {
  getAgentRegistry,
  getCurrentAgent,
  switchAgent,
  stripInternalOptions,
  INTERNAL_OPTION_KEYS,
} from './index.js';

describe('Agent System', () => {
  beforeEach(() => {
    // Reset to default agent
    switchAgent('code');
  });

  describe('Agent registry', () => {
    it('returns built-in agents', () => {
      const registry = getAgentRegistry();
      const agents = registry.list();

      expect(agents.length).toBeGreaterThan(0);
      expect(agents.some((a: Agent) => a.id === 'code')).toBe(true);
      expect(agents.some((a: Agent) => a.id === 'debug')).toBe(true);
      expect(agents.some((a: Agent) => a.id === 'plan')).toBe(true);
    });

    it('switches agents correctly', () => {
      const codeAgent = getCurrentAgent();
      expect(codeAgent.id).toBe('code');

      const debugAgent = switchAgent('debug');
      expect(debugAgent).not.toBeNull();
      expect(getCurrentAgent().id).toBe('debug');
    });

    it('resolves aliases', () => {
      const agent = switchAgent('d'); // alias for debug
      expect(agent).not.toBeNull();
      expect(agent?.id).toBe('debug');
    });
  });

  describe('Agent tool permissions', () => {
    it('code agent can use most tools', () => {
      const agent = getCurrentAgent();
      expect(agent.id).toBe('code');

      expect(agent.canUseTool('read')).toBe(true);
      expect(agent.canUseTool('write')).toBe(true);
      expect(agent.canUseTool('bash')).toBe(true);
    });

    it('plan agent has limited tools', () => {
      switchAgent('plan');
      const agent = getCurrentAgent();

      expect(agent.canUseTool('read')).toBe(true);
      expect(agent.canUseTool('glob')).toBe(true);
      expect(agent.canUseTool('grep')).toBe(true);

      // Plan agent should not have write tools
      expect(agent.canUseTool('write')).toBe(false);
      expect(agent.canUseTool('edit')).toBe(false);
    });

    it('explore agent has search-only tools', () => {
      switchAgent('explore');
      const agent = getCurrentAgent();

      expect(agent.canUseTool('read')).toBe(true);
      expect(agent.canUseTool('glob')).toBe(true);
      expect(agent.canUseTool('grep')).toBe(true);

      // Explore agent should not have write or bash
      expect(agent.canUseTool('write')).toBe(false);
      expect(agent.canUseTool('bash')).toBe(false);
    });
  });

  describe('stripInternalOptions', () => {
    it('strips every key listed in INTERNAL_OPTION_KEYS', () => {
      const input: Record<string, unknown> = {
        // real provider option fields must survive
        maxTokens: 4096,
        temperature: 0.7,
      };
      // Inject a sentinel value for every internal key
      for (const key of INTERNAL_OPTION_KEYS) {
        input[key] = `internal-${key}`;
      }

      const result = stripInternalOptions(input);

      // Every internal key must be gone
      for (const key of INTERNAL_OPTION_KEYS) {
        expect(result).not.toHaveProperty(key);
      }
      // Real options preserved with their original values
      expect(result.maxTokens).toBe(4096);
      expect(result.temperature).toBe(0.7);
      // Result contains exactly the two real fields
      expect(Object.keys(result).sort()).toEqual(['maxTokens', 'temperature']);
    });

    it('preserves non-internal keys with their original values', () => {
      const signal = new AbortController().signal;
      const headers = { 'x-request-id': 'abc' };
      const tools = [{ type: 'function' as const, function: { name: 'read' } }];

      const result = stripInternalOptions({
        maxTokens: 2048,
        temperature: 0.2,
        topP: 0.95,
        topK: 40,
        signal,
        headers,
        tools,
        toolChoice: 'auto',
      });

      expect(result.maxTokens).toBe(2048);
      expect(result.temperature).toBe(0.2);
      expect(result.topP).toBe(0.95);
      expect(result.topK).toBe(40);
      expect(result.signal).toBe(signal);
      expect(result.headers).toBe(headers);
      expect(result.tools).toBe(tools);
      expect(result.toolChoice).toBe('auto');
    });

    it('returns an empty object for an empty input', () => {
      expect(stripInternalOptions({})).toEqual({});
    });

    it('does not mutate the input object', () => {
      const input = {
        id: 'code',
        source: 'user',
        maxTokens: 1024,
      };
      const before = { ...input };
      stripInternalOptions(input);
      expect(input).toEqual(before);
    });

    it('covers all known agent-metadata deny-list entries', () => {
      // Snapshot-style guard: if a new AgentConfig-only field is added to
      // AgentSchema, the developer must also update INTERNAL_OPTION_KEYS (or
      // explicitly justify why it is a legitimate provider option).
      const expected = [
        'id',
        'name',
        'displayName',
        'description',
        'source',
        'reference',
        'resolved',
        'mode',
        'systemPrompt',
        'deprecated',
        'disabledTools',
        'aliases',
        'preferredModel',
      ];
      expect([...INTERNAL_OPTION_KEYS].sort()).toEqual(expected.sort());
    });
  });

  describe('Agent mode filtering', () => {
    it('lists primary agents', () => {
      const registry = getAgentRegistry();
      const primaryAgents = registry.list('primary');

      expect(primaryAgents.some((a: Agent) => a.id === 'orchestrator')).toBe(true);
    });

    it('lists subagents', () => {
      const registry = getAgentRegistry();
      const subagents = registry.list('subagent');

      expect(subagents.some((a: Agent) => a.id === 'explore')).toBe(true);
    });

    it('lists all agents when no filter', () => {
      const registry = getAgentRegistry();
      const allAgents = registry.list();
      const filteredAgents = registry.list('all');

      expect(allAgents.length).toBeGreaterThanOrEqual(filteredAgents.length);
    });
  });
});
