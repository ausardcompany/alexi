import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  drainCovered,
  PermissionDeniedError,
  type PendingEntry,
  type Ruleset,
} from '../drain.js';
import { PermissionResponse } from '../../bus/index.js';

// Mock the bus module
vi.mock('../../bus/index.js', () => ({
  PermissionResponse: {
    publish: vi.fn(),
  },
}));

describe('permission drain', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('drainCovered', () => {
    it('should resolve pending permissions covered by allow rules', async () => {
      const resolve = vi.fn();
      const reject = vi.fn();

      const pending: Record<string, PendingEntry> = {
        'req-1': {
          info: {
            id: 'req-1',
            sessionID: 'session-1',
            permission: 'file:read',
            patterns: ['/path/to/file.txt'],
          },
          ruleset: [],
          resolve,
          reject,
        },
      };

      const approved: Ruleset = [
        { permission: 'file:read', pattern: '/path/*', action: 'allow' },
      ];

      await drainCovered(pending, approved);

      expect(resolve).toHaveBeenCalled();
      expect(reject).not.toHaveBeenCalled();
      expect(pending['req-1']).toBeUndefined();
      expect(PermissionResponse.publish).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'req-1',
          granted: true,
          remember: false,
        }),
      );
    });

    it('should reject pending permissions covered by deny rules', async () => {
      const resolve = vi.fn();
      const reject = vi.fn();

      const pending: Record<string, PendingEntry> = {
        'req-1': {
          info: {
            id: 'req-1',
            sessionID: 'session-1',
            permission: 'file:write',
            patterns: ['/sensitive/file.txt'],
          },
          ruleset: [],
          resolve,
          reject,
        },
      };

      const approved: Ruleset = [
        { permission: 'file:write', pattern: '/sensitive/*', action: 'deny' },
      ];

      await drainCovered(pending, approved);

      expect(reject).toHaveBeenCalled();
      expect(resolve).not.toHaveBeenCalled();
      expect(pending['req-1']).toBeUndefined();

      // Check that the reject was called with PermissionDeniedError
      const rejectCall = reject.mock.calls[0][0];
      expect(rejectCall).toBeInstanceOf(PermissionDeniedError);
      expect(rejectCall.rules).toHaveLength(1);
      expect(rejectCall.rules[0].pattern).toBe('/sensitive/*');

      expect(PermissionResponse.publish).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'req-1',
          granted: false,
          remember: false,
        }),
      );
    });

    it('should skip the excluded request ID', async () => {
      const resolve = vi.fn();
      const reject = vi.fn();

      const pending: Record<string, PendingEntry> = {
        'req-1': {
          info: {
            id: 'req-1',
            sessionID: 'session-1',
            permission: 'file:read',
            patterns: ['/path/to/file.txt'],
          },
          ruleset: [],
          resolve,
          reject,
        },
      };

      const approved: Ruleset = [
        { permission: 'file:read', pattern: '/path/*', action: 'allow' },
      ];

      await drainCovered(pending, approved, 'req-1'); // Exclude this request

      expect(resolve).not.toHaveBeenCalled();
      expect(reject).not.toHaveBeenCalled();
      expect(pending['req-1']).toBeDefined();
    });

    it('should not touch pending permissions not fully covered', async () => {
      const resolve = vi.fn();
      const reject = vi.fn();

      const pending: Record<string, PendingEntry> = {
        'req-1': {
          info: {
            id: 'req-1',
            sessionID: 'session-1',
            permission: 'file:read',
            patterns: ['/path/to/file.txt'],
          },
          ruleset: [],
          resolve,
          reject,
        },
      };

      // No matching rules - should remain as 'ask'
      const approved: Ruleset = [];

      await drainCovered(pending, approved);

      expect(resolve).not.toHaveBeenCalled();
      expect(reject).not.toHaveBeenCalled();
      expect(pending['req-1']).toBeDefined();
    });

    it('should handle multiple patterns in a single request', async () => {
      const resolve = vi.fn();
      const reject = vi.fn();

      const pending: Record<string, PendingEntry> = {
        'req-1': {
          info: {
            id: 'req-1',
            sessionID: 'session-1',
            permission: 'file:read',
            patterns: ['/path/file1.txt', '/path/file2.txt'],
          },
          ruleset: [],
          resolve,
          reject,
        },
      };

      const approved: Ruleset = [
        { permission: 'file:read', pattern: '/path/*', action: 'allow' },
      ];

      await drainCovered(pending, approved);

      expect(resolve).toHaveBeenCalled();
      expect(reject).not.toHaveBeenCalled();
      expect(pending['req-1']).toBeUndefined();
    });

    it('should deny if any pattern is denied even if others are allowed', async () => {
      const resolve = vi.fn();
      const reject = vi.fn();

      const pending: Record<string, PendingEntry> = {
        'req-1': {
          info: {
            id: 'req-1',
            sessionID: 'session-1',
            permission: 'file:read',
            patterns: ['/public/file.txt', '/secret/data.txt'],
          },
          ruleset: [],
          resolve,
          reject,
        },
      };

      const approved: Ruleset = [
        { permission: 'file:read', pattern: '/public/*', action: 'allow' },
        { permission: 'file:read', pattern: '/secret/*', action: 'deny' },
      ];

      await drainCovered(pending, approved);

      expect(reject).toHaveBeenCalled();
      expect(resolve).not.toHaveBeenCalled();
      expect(pending['req-1']).toBeUndefined();
    });

    it('should process multiple pending requests', async () => {
      const resolve1 = vi.fn();
      const reject1 = vi.fn();
      const resolve2 = vi.fn();
      const reject2 = vi.fn();

      const pending: Record<string, PendingEntry> = {
        'req-1': {
          info: {
            id: 'req-1',
            sessionID: 'session-1',
            permission: 'file:read',
            patterns: ['/allowed/file.txt'],
          },
          ruleset: [],
          resolve: resolve1,
          reject: reject1,
        },
        'req-2': {
          info: {
            id: 'req-2',
            sessionID: 'session-2',
            permission: 'file:write',
            patterns: ['/denied/file.txt'],
          },
          ruleset: [],
          resolve: resolve2,
          reject: reject2,
        },
      };

      const approved: Ruleset = [
        { permission: 'file:read', pattern: '/allowed/*', action: 'allow' },
        { permission: 'file:write', pattern: '/denied/*', action: 'deny' },
      ];

      await drainCovered(pending, approved);

      expect(resolve1).toHaveBeenCalled();
      expect(reject1).not.toHaveBeenCalled();
      expect(resolve2).not.toHaveBeenCalled();
      expect(reject2).toHaveBeenCalled();
      expect(pending['req-1']).toBeUndefined();
      expect(pending['req-2']).toBeUndefined();
    });

    it('should use current ruleset for evaluation', async () => {
      const resolve = vi.fn();
      const reject = vi.fn();

      const pending: Record<string, PendingEntry> = {
        'req-1': {
          info: {
            id: 'req-1',
            sessionID: 'session-1',
            permission: 'file:read',
            patterns: ['/path/file.txt'],
          },
          // This request was made when there was already a matching rule
          ruleset: [{ permission: 'file:read', pattern: '/path/*', action: 'allow' }],
          resolve,
          reject,
        },
      };

      // Even with empty approved rules, should resolve based on current ruleset
      const approved: Ruleset = [];

      await drainCovered(pending, approved);

      expect(resolve).toHaveBeenCalled();
      expect(reject).not.toHaveBeenCalled();
      expect(pending['req-1']).toBeUndefined();
    });
  });

  describe('PermissionDeniedError', () => {
    it('should create error with rules', () => {
      const rules: Ruleset = [
        { permission: 'file:write', pattern: '/secret/*', action: 'deny' },
      ];

      const error = new PermissionDeniedError(rules);

      expect(error).toBeInstanceOf(Error);
      expect(error.name).toBe('PermissionDeniedError');
      expect(error.message).toBe('Permission denied by rules');
      expect(error.rules).toEqual(rules);
    });
  });
});
