/**
 * Tests for Permission Drain Module
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  drainCovered,
  registerPending,
  removePending,
  getPendingPermissions,
  clearPendingPermissions,
  cleanupExpired,
  type PendingPermission,
} from '../drain.js';
import type { PermissionRule } from '../index.js';

describe('Permission Drain Module', () => {
  beforeEach(() => {
    clearPendingPermissions();
  });

  afterEach(() => {
    clearPendingPermissions();
    vi.clearAllMocks();
  });

  describe('registerPending and removePending', () => {
    it('should register and retrieve pending permissions', () => {
      const pending: PendingPermission = {
        id: 'req-1',
        context: {
          toolName: 'read',
          action: 'read',
          resource: '/path/to/file.ts',
        },
        rules: [],
        resolve: vi.fn(),
        reject: vi.fn(),
        timestamp: Date.now(),
      };

      registerPending(pending);
      const retrieved = getPendingPermissions();

      expect(retrieved).toHaveLength(1);
      expect(retrieved[0].id).toBe('req-1');
    });

    it('should remove pending permissions', () => {
      const pending: PendingPermission = {
        id: 'req-1',
        context: {
          toolName: 'read',
          action: 'read',
          resource: '/path/to/file.ts',
        },
        rules: [],
        resolve: vi.fn(),
        reject: vi.fn(),
        timestamp: Date.now(),
      };

      registerPending(pending);
      expect(getPendingPermissions()).toHaveLength(1);

      const removed = removePending('req-1');
      expect(removed).toBe(true);
      expect(getPendingPermissions()).toHaveLength(0);
    });
  });

  describe('drainCovered', () => {
    it('should resolve pending permissions when all patterns are allowed', async () => {
      const resolve = vi.fn();
      const reject = vi.fn();

      const pending: PendingPermission = {
        id: 'req-1',
        context: {
          toolName: 'read',
          action: 'read',
          resource: '/path/to/file.ts',
        },
        rules: [],
        resolve,
        reject,
        timestamp: Date.now(),
      };

      registerPending(pending);

      const newRules: PermissionRule[] = [
        {
          id: 'rule-1',
          actions: ['read'],
          paths: ['/path/**'],
          decision: 'allow',
          priority: 10,
        },
      ];

      await drainCovered(newRules);

      expect(resolve).toHaveBeenCalledWith(true);
      expect(reject).not.toHaveBeenCalled();
      expect(getPendingPermissions()).toHaveLength(0);
    });

    it('should reject pending permissions when patterns are denied', async () => {
      const resolve = vi.fn();
      const reject = vi.fn();

      const pending: PendingPermission = {
        id: 'req-1',
        context: {
          toolName: 'write',
          action: 'write',
          resource: '/sensitive/file.ts',
        },
        rules: [],
        resolve,
        reject,
        timestamp: Date.now(),
      };

      registerPending(pending);

      const newRules: PermissionRule[] = [
        {
          id: 'rule-1',
          actions: ['write'],
          paths: ['/sensitive/**'],
          decision: 'deny',
          priority: 10,
        },
      ];

      await drainCovered(newRules);

      expect(resolve).not.toHaveBeenCalled();
      expect(reject).toHaveBeenCalled();
      expect(getPendingPermissions()).toHaveLength(0);
    });

    it('should skip the excluded request ID', async () => {
      const resolve = vi.fn();
      const reject = vi.fn();

      const pending: PendingPermission = {
        id: 'req-1',
        context: {
          toolName: 'read',
          action: 'read',
          resource: '/path/to/file.ts',
        },
        rules: [],
        resolve,
        reject,
        timestamp: Date.now(),
      };

      registerPending(pending);

      const newRules: PermissionRule[] = [
        {
          id: 'rule-1',
          actions: ['read'],
          decision: 'allow',
          priority: 10,
        },
      ];

      await drainCovered(newRules, 'req-1'); // Exclude this request

      expect(resolve).not.toHaveBeenCalled();
      expect(reject).not.toHaveBeenCalled();
      expect(getPendingPermissions()).toHaveLength(1);
    });

    it('should not modify pending when evaluation is inconclusive', async () => {
      const resolve = vi.fn();
      const reject = vi.fn();

      const pending: PendingPermission = {
        id: 'req-1',
        context: {
          toolName: 'read',
          action: 'read',
          resource: '/path/to/file.ts',
        },
        rules: [],
        resolve,
        reject,
        timestamp: Date.now(),
      };

      registerPending(pending);

      // Rule that doesn't match the pending context
      const newRules: PermissionRule[] = [
        {
          id: 'rule-1',
          actions: ['write'], // Different action
          decision: 'allow',
          priority: 10,
        },
      ];

      await drainCovered(newRules);

      expect(resolve).not.toHaveBeenCalled();
      expect(reject).not.toHaveBeenCalled();
      expect(getPendingPermissions()).toHaveLength(1);
    });

    it('should handle multiple pending permissions', async () => {
      const resolve1 = vi.fn();
      const reject1 = vi.fn();
      const resolve2 = vi.fn();
      const reject2 = vi.fn();

      const pending1: PendingPermission = {
        id: 'req-1',
        context: {
          toolName: 'read',
          action: 'read',
          resource: '/allowed/file.ts',
        },
        rules: [],
        resolve: resolve1,
        reject: reject1,
        timestamp: Date.now(),
      };

      const pending2: PendingPermission = {
        id: 'req-2',
        context: {
          toolName: 'read',
          action: 'read',
          resource: '/denied/file.ts',
        },
        rules: [],
        resolve: resolve2,
        reject: reject2,
        timestamp: Date.now(),
      };

      registerPending(pending1);
      registerPending(pending2);

      const newRules: PermissionRule[] = [
        {
          id: 'rule-1',
          actions: ['read'],
          paths: ['/allowed/**'],
          decision: 'allow',
          priority: 10,
        },
        {
          id: 'rule-2',
          actions: ['read'],
          paths: ['/denied/**'],
          decision: 'deny',
          priority: 20,
        },
      ];

      await drainCovered(newRules);

      expect(resolve1).toHaveBeenCalledWith(true);
      expect(reject1).not.toHaveBeenCalled();
      expect(resolve2).not.toHaveBeenCalled();
      expect(reject2).toHaveBeenCalled();
      expect(getPendingPermissions()).toHaveLength(0);
    });

    it('should respect rule priority (last match wins)', async () => {
      const resolve = vi.fn();
      const reject = vi.fn();

      const pending: PendingPermission = {
        id: 'req-1',
        context: {
          toolName: 'read',
          action: 'read',
          resource: '/path/to/file.ts',
        },
        rules: [],
        resolve,
        reject,
        timestamp: Date.now(),
      };

      registerPending(pending);

      const newRules: PermissionRule[] = [
        {
          id: 'rule-1',
          actions: ['read'],
          paths: ['/path/**'],
          decision: 'deny',
          priority: 10,
        },
        {
          id: 'rule-2',
          actions: ['read'],
          paths: ['/path/to/**'],
          decision: 'allow',
          priority: 20, // Higher priority, should win
        },
      ];

      await drainCovered(newRules);

      expect(resolve).toHaveBeenCalledWith(true);
      expect(reject).not.toHaveBeenCalled();
    });
  });

  describe('cleanupExpired', () => {
    it('should remove expired pending permissions', () => {
      const resolve = vi.fn();
      const reject = vi.fn();

      const oldPending: PendingPermission = {
        id: 'req-old',
        context: {
          toolName: 'read',
          action: 'read',
          resource: '/path/to/file.ts',
        },
        rules: [],
        resolve,
        reject,
        timestamp: Date.now() - 70000, // 70 seconds ago
      };

      const newPending: PendingPermission = {
        id: 'req-new',
        context: {
          toolName: 'read',
          action: 'read',
          resource: '/path/to/file.ts',
        },
        rules: [],
        resolve: vi.fn(),
        reject: vi.fn(),
        timestamp: Date.now(),
      };

      registerPending(oldPending);
      registerPending(newPending);

      expect(getPendingPermissions()).toHaveLength(2);

      cleanupExpired(60000); // 60 second timeout

      expect(reject).toHaveBeenCalled();
      expect(getPendingPermissions()).toHaveLength(1);
      expect(getPendingPermissions()[0].id).toBe('req-new');
    });

    it('should not remove non-expired permissions', () => {
      const pending: PendingPermission = {
        id: 'req-1',
        context: {
          toolName: 'read',
          action: 'read',
          resource: '/path/to/file.ts',
        },
        rules: [],
        resolve: vi.fn(),
        reject: vi.fn(),
        timestamp: Date.now() - 30000, // 30 seconds ago
      };

      registerPending(pending);

      cleanupExpired(60000); // 60 second timeout

      expect(getPendingPermissions()).toHaveLength(1);
    });
  });

  describe('clearPendingPermissions', () => {
    it('should clear all pending permissions', () => {
      const pending1: PendingPermission = {
        id: 'req-1',
        context: {
          toolName: 'read',
          action: 'read',
          resource: '/path/to/file.ts',
        },
        rules: [],
        resolve: vi.fn(),
        reject: vi.fn(),
        timestamp: Date.now(),
      };

      const pending2: PendingPermission = {
        id: 'req-2',
        context: {
          toolName: 'write',
          action: 'write',
          resource: '/path/to/file.ts',
        },
        rules: [],
        resolve: vi.fn(),
        reject: vi.fn(),
        timestamp: Date.now(),
      };

      registerPending(pending1);
      registerPending(pending2);

      expect(getPendingPermissions()).toHaveLength(2);

      clearPendingPermissions();

      expect(getPendingPermissions()).toHaveLength(0);
    });
  });
});
