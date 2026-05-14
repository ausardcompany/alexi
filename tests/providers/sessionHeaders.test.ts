import { describe, it, expect } from 'vitest';

import {
  buildSessionHeaders,
  buildSessionHeadersFromContext,
  mergeSessionHeaders,
} from '../../src/providers/sessionHeaders.js';

describe('sessionHeaders', () => {
  describe('buildSessionHeaders', () => {
    it('should include x-session-affinity header', () => {
      const headers = buildSessionHeaders('session-123');
      expect(headers['x-session-affinity']).toBe('session-123');
    });

    it('should include x-parent-session-id when parentSessionID is provided', () => {
      const headers = buildSessionHeaders('session-123', 'parent-456');
      expect(headers['x-parent-session-id']).toBe('parent-456');
    });

    it('should omit x-parent-session-id when parentSessionID is not provided', () => {
      const headers = buildSessionHeaders('session-123');
      expect(headers['x-parent-session-id']).toBeUndefined();
    });

    it('should include x-alexi-agent-id when agentID is provided', () => {
      const headers = buildSessionHeaders('session-123', undefined, 'agent-abc');
      expect(headers['x-alexi-agent-id']).toBe('agent-abc');
    });

    it('should include x-alexi-parent-agent-id when parentAgentID is provided', () => {
      const headers = buildSessionHeaders('session-123', undefined, undefined, 'parent-agent-xyz');
      expect(headers['x-alexi-parent-agent-id']).toBe('parent-agent-xyz');
    });

    it('should include both agent headers when both are provided', () => {
      const headers = buildSessionHeaders('session-123', 'parent-456', 'agent-abc', 'parent-xyz');
      expect(headers['x-alexi-agent-id']).toBe('agent-abc');
      expect(headers['x-alexi-parent-agent-id']).toBe('parent-xyz');
    });

    it('should omit agent headers when not provided (backwards compatibility)', () => {
      const headers = buildSessionHeaders('session-123', 'parent-456');
      expect(headers['x-alexi-agent-id']).toBeUndefined();
      expect(headers['x-alexi-parent-agent-id']).toBeUndefined();
    });
  });

  describe('buildSessionHeadersFromContext', () => {
    it('should pass through agentID to headers', () => {
      const headers = buildSessionHeadersFromContext({
        sessionID: 'session-123',
        agentID: 'agent-abc',
      });
      expect(headers['x-alexi-agent-id']).toBe('agent-abc');
    });

    it('should pass through parentAgentID to headers', () => {
      const headers = buildSessionHeadersFromContext({
        sessionID: 'session-123',
        parentAgentID: 'parent-agent-xyz',
      });
      expect(headers['x-alexi-parent-agent-id']).toBe('parent-agent-xyz');
    });

    it('should pass through all fields from context', () => {
      const headers = buildSessionHeadersFromContext({
        sessionID: 'session-123',
        parentSessionID: 'parent-456',
        agentID: 'agent-abc',
        parentAgentID: 'parent-agent-xyz',
      });
      expect(headers['x-session-affinity']).toBe('session-123');
      expect(headers['x-parent-session-id']).toBe('parent-456');
      expect(headers['x-alexi-agent-id']).toBe('agent-abc');
      expect(headers['x-alexi-parent-agent-id']).toBe('parent-agent-xyz');
    });

    it('should omit agent headers when context has no agent fields', () => {
      const headers = buildSessionHeadersFromContext({
        sessionID: 'session-123',
      });
      expect(headers['x-alexi-agent-id']).toBeUndefined();
      expect(headers['x-alexi-parent-agent-id']).toBeUndefined();
    });
  });

  describe('mergeSessionHeaders', () => {
    it('should merge agent headers into existing headers', () => {
      const existing = { 'content-type': 'application/json' };
      const result = mergeSessionHeaders(existing, {
        sessionID: 'session-123',
        agentID: 'agent-abc',
        parentAgentID: 'parent-agent-xyz',
      });
      expect(result['content-type']).toBe('application/json');
      expect(result['x-session-affinity']).toBe('session-123');
      expect(result['x-alexi-agent-id']).toBe('agent-abc');
      expect(result['x-alexi-parent-agent-id']).toBe('parent-agent-xyz');
    });

    it('should return existing headers unchanged when no context is provided', () => {
      const existing = { 'content-type': 'application/json' };
      const result = mergeSessionHeaders(existing);
      expect(result).toEqual(existing);
    });
  });
});
