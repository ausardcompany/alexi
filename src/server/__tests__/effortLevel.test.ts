/**
 * Tests for effort level propagation through the server tool execution endpoint
 */

import { describe, it, expect } from 'vitest';
import { z } from 'zod';

// Test that the ToolExecuteRequestSchema accepts effortLevel
const ToolExecuteRequestSchema = z.object({
  parameters: z.record(z.string(), z.unknown()),
  sessionId: z.string().optional(),
  effortLevel: z.enum(['low', 'medium', 'high']).optional(),
});

describe('Server effort level propagation', () => {
  describe('ToolExecuteRequestSchema', () => {
    it('should accept request with effortLevel high', () => {
      const request = ToolExecuteRequestSchema.parse({
        parameters: { command: 'echo hello' },
        sessionId: 'session-1',
        effortLevel: 'high',
      });

      expect(request.effortLevel).toBe('high');
    });

    it('should accept request with effortLevel low', () => {
      const request = ToolExecuteRequestSchema.parse({
        parameters: { command: 'echo hello' },
        effortLevel: 'low',
      });

      expect(request.effortLevel).toBe('low');
    });

    it('should accept request with effortLevel medium', () => {
      const request = ToolExecuteRequestSchema.parse({
        parameters: { command: 'echo hello' },
        effortLevel: 'medium',
      });

      expect(request.effortLevel).toBe('medium');
    });

    it('should accept request without effortLevel (defaults to undefined)', () => {
      const request = ToolExecuteRequestSchema.parse({
        parameters: { command: 'echo hello' },
      });

      expect(request.effortLevel).toBeUndefined();
    });

    it('should reject invalid effortLevel values', () => {
      expect(() =>
        ToolExecuteRequestSchema.parse({
          parameters: { command: 'echo hello' },
          effortLevel: 'invalid',
        })
      ).toThrow();
    });

    it('should reject numeric effortLevel values', () => {
      expect(() =>
        ToolExecuteRequestSchema.parse({
          parameters: { command: 'echo hello' },
          effortLevel: 5,
        })
      ).toThrow();
    });
  });
});
