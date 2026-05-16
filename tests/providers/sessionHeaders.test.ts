import { describe, it, expect } from 'vitest';
import {
  buildSessionHeaders,
  buildSessionHeadersFromContext,
  mergeSessionHeaders,
} from '../../src/providers/sessionHeaders.js';
import type { SessionContext } from '../../src/providers/sessionHeaders.js';

describe('sessionHeaders', () => {
  describe('buildSessionHeaders', () => {
    it('returns session affinity header with only sessionID', () => {
      const headers = buildSessionHeaders('session-123');
      expect(headers).toEqual({
        'x-session-affinity': 'session-123',
      });
    });

    it('includes parent session ID when provided', () => {
      const headers = buildSessionHeaders('session-123', 'parent-456');
      expect(headers).toEqual({
        'x-session-affinity': 'session-123',
        'x-parent-session-id': 'parent-456',
      });
    });

    it('includes x-alexi-agent-id when agentId is provided', () => {
      const headers = buildSessionHeaders('session-123', undefined, 'code-agent');
      expect(headers).toEqual({
        'x-session-affinity': 'session-123',
        'x-alexi-agent-id': 'code-agent',
      });
    });

    it('includes x-alexi-parent-agent-id when parentAgentId is provided', () => {
      const headers = buildSessionHeaders('session-123', undefined, undefined, 'main-agent');
      expect(headers).toEqual({
        'x-session-affinity': 'session-123',
        'x-alexi-parent-agent-id': 'main-agent',
      });
    });

    it('includes all headers when all parameters are provided', () => {
      const headers = buildSessionHeaders('session-123', 'parent-456', 'code-agent', 'main-agent');
      expect(headers).toEqual({
        'x-session-affinity': 'session-123',
        'x-parent-session-id': 'parent-456',
        'x-alexi-agent-id': 'code-agent',
        'x-alexi-parent-agent-id': 'main-agent',
      });
    });

    it('omits agent headers when not provided (backward compatibility)', () => {
      const headers = buildSessionHeaders('session-123', 'parent-456');
      expect(headers).not.toHaveProperty('x-alexi-agent-id');
      expect(headers).not.toHaveProperty('x-alexi-parent-agent-id');
    });
  });

  describe('buildSessionHeadersFromContext', () => {
    it('builds headers from minimal context', () => {
      const context: SessionContext = { sessionID: 'ctx-session-1' };
      const headers = buildSessionHeadersFromContext(context);
      expect(headers).toEqual({
        'x-session-affinity': 'ctx-session-1',
      });
    });

    it('builds headers with all context fields', () => {
      const context: SessionContext = {
        sessionID: 'ctx-session-1',
        parentSessionID: 'ctx-parent-1',
        agentId: 'explore',
        parentAgentId: 'orchestrator',
      };
      const headers = buildSessionHeadersFromContext(context);
      expect(headers).toEqual({
        'x-session-affinity': 'ctx-session-1',
        'x-parent-session-id': 'ctx-parent-1',
        'x-alexi-agent-id': 'explore',
        'x-alexi-parent-agent-id': 'orchestrator',
      });
    });

    it('omits agent headers when context does not include them', () => {
      const context: SessionContext = {
        sessionID: 'ctx-session-1',
        parentSessionID: 'ctx-parent-1',
      };
      const headers = buildSessionHeadersFromContext(context);
      expect(headers).not.toHaveProperty('x-alexi-agent-id');
      expect(headers).not.toHaveProperty('x-alexi-parent-agent-id');
    });
  });

  describe('mergeSessionHeaders', () => {
    it('returns existing headers when no session context is provided', () => {
      const existing = { 'content-type': 'application/json', authorization: 'Bearer token' };
      const result = mergeSessionHeaders(existing);
      expect(result).toEqual(existing);
    });

    it('merges session headers into existing headers', () => {
      const existing = { 'content-type': 'application/json' };
      const context: SessionContext = {
        sessionID: 'merge-session-1',
        parentSessionID: 'merge-parent-1',
      };
      const result = mergeSessionHeaders(existing, context);
      expect(result).toEqual({
        'content-type': 'application/json',
        'x-session-affinity': 'merge-session-1',
        'x-parent-session-id': 'merge-parent-1',
      });
    });

    it('merges agent identity headers when context includes them', () => {
      const existing = { 'content-type': 'application/json' };
      const context: SessionContext = {
        sessionID: 'merge-session-1',
        agentId: 'code',
        parentAgentId: 'main',
      };
      const result = mergeSessionHeaders(existing, context);
      expect(result).toEqual({
        'content-type': 'application/json',
        'x-session-affinity': 'merge-session-1',
        'x-alexi-agent-id': 'code',
        'x-alexi-parent-agent-id': 'main',
      });
    });

    it('does not include agent headers when context omits them', () => {
      const existing = { 'content-type': 'application/json' };
      const context: SessionContext = {
        sessionID: 'merge-session-1',
      };
      const result = mergeSessionHeaders(existing, context);
      expect(result).not.toHaveProperty('x-alexi-agent-id');
      expect(result).not.toHaveProperty('x-alexi-parent-agent-id');
    });

    it('session headers override existing headers with same keys', () => {
      const existing = { 'x-session-affinity': 'old-value' };
      const context: SessionContext = {
        sessionID: 'new-value',
        agentId: 'test-agent',
      };
      const result = mergeSessionHeaders(existing, context);
      expect(result['x-session-affinity']).toBe('new-value');
      expect(result['x-alexi-agent-id']).toBe('test-agent');
    });
  });
});
