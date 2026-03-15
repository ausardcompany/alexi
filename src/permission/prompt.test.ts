/**
 * Tests for CLI Permission Prompt Handler
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { PermissionRequested, PermissionResponse } from '../bus/index.js';
import { isPermissionPromptSupported } from './prompt.js';

describe('Permission Prompt', () => {
  describe('isPermissionPromptSupported', () => {
    let originalStdin: any;
    let originalStdout: any;

    beforeEach(() => {
      originalStdin = process.stdin.isTTY;
      originalStdout = process.stdout.isTTY;
    });

    afterEach(() => {
      process.stdin.isTTY = originalStdin;
      process.stdout.isTTY = originalStdout;
    });

    it('should return true when both stdin and stdout are TTY', () => {
      process.stdin.isTTY = true;
      process.stdout.isTTY = true;
      expect(isPermissionPromptSupported()).toBe(true);
    });

    it('should return false when stdin is not TTY', () => {
      process.stdin.isTTY = false;
      process.stdout.isTTY = true;
      expect(isPermissionPromptSupported()).toBe(false);
    });

    it('should return false when stdout is not TTY', () => {
      process.stdin.isTTY = true;
      process.stdout.isTTY = false;
      expect(isPermissionPromptSupported()).toBe(false);
    });

    it('should return false when neither is TTY', () => {
      process.stdin.isTTY = false;
      process.stdout.isTTY = false;
      expect(isPermissionPromptSupported()).toBe(false);
    });
  });

  describe('Permission Event Flow', () => {
    it('should allow publishing permission request events', () => {
      const handler = vi.fn();
      const unsubscribe = PermissionRequested.subscribe(handler);

      PermissionRequested.publish({
        id: 'test-123',
        toolName: 'write',
        action: 'write',
        resource: '/tmp/test.txt',
        description: 'Write to test file',
        timestamp: Date.now(),
      });

      expect(handler).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'test-123',
          toolName: 'write',
          action: 'write',
          resource: '/tmp/test.txt',
        })
      );

      unsubscribe();
    });

    it('should allow publishing permission response events', () => {
      const handler = vi.fn();
      const unsubscribe = PermissionResponse.subscribe(handler);

      PermissionResponse.publish({
        id: 'test-123',
        granted: true,
        remember: false,
        timestamp: Date.now(),
      });

      expect(handler).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'test-123',
          granted: true,
          remember: false,
        })
      );

      unsubscribe();
    });

    it('should handle multiple subscribers', () => {
      const handler1 = vi.fn();
      const handler2 = vi.fn();

      const unsub1 = PermissionRequested.subscribe(handler1);
      const unsub2 = PermissionRequested.subscribe(handler2);

      PermissionRequested.publish({
        id: 'test-456',
        toolName: 'read',
        action: 'read',
        resource: '/tmp/test.txt',
        description: 'Read test file',
        timestamp: Date.now(),
      });

      expect(handler1).toHaveBeenCalled();
      expect(handler2).toHaveBeenCalled();

      unsub1();
      unsub2();
    });
  });

  describe('Permission Action Types', () => {
    it('should support all permission action types', () => {
      const actions: Array<'read' | 'write' | 'execute' | 'network' | 'admin'> = [
        'read',
        'write',
        'execute',
        'network',
        'admin',
      ];

      for (const action of actions) {
        const handler = vi.fn();
        const unsubscribe = PermissionRequested.subscribe(handler);

        PermissionRequested.publish({
          id: `test-${action}`,
          toolName: 'test-tool',
          action,
          resource: '/test/resource',
          description: `Test ${action} permission`,
          timestamp: Date.now(),
        });

        expect(handler).toHaveBeenCalledWith(
          expect.objectContaining({
            action,
          })
        );

        unsubscribe();
      }
    });
  });
});
