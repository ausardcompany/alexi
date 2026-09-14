/**
 * Tests for the "reject with feedback" flow.
 *
 * Ports the kilocode `feat: support permission rejection feedback` behaviour
 * (upstream commit b30b2cf0d) into Alexi's PermissionManager: when the user
 * rejects a tool call with an optional natural-language reason, that reason
 * is surfaced on the resulting `PermissionResult.feedback` so the agent
 * loop can forward it back to the model as a follow-up user message.
 */

import { describe, it, expect, beforeEach } from 'vitest';

import { PermissionManager } from '../index.js';
import { PermissionRequested, PermissionResponse } from '../../bus/index.js';

describe('PermissionManager rejection feedback', () => {
  beforeEach(() => {
    // No global state to reset — a fresh manager per test is enough.
  });

  it('threads user-supplied feedback through to PermissionResult.feedback', async () => {
    const manager = new PermissionManager([
      { id: 'ask-shell', tools: ['shell'], decision: 'ask', priority: 10 },
    ]);

    const unsub = PermissionRequested.subscribe((req) => {
      PermissionResponse.publish({
        id: req.id,
        granted: false,
        timestamp: Date.now(),
        feedback: '  please use the read-only tool instead  ',
      });
    });

    try {
      const result = await manager.check({
        toolName: 'shell',
        action: 'execute',
        resource: 'ls -la',
      });
      expect(result.granted).toBe(false);
      // Whitespace at the edges should be trimmed by askUser().
      expect(result.feedback).toBe('please use the read-only tool instead');
    } finally {
      unsub();
    }
  });

  it('omits feedback when the user approves the tool call', async () => {
    const manager = new PermissionManager([
      { id: 'ask-shell', tools: ['shell'], decision: 'ask', priority: 10 },
    ]);

    const unsub = PermissionRequested.subscribe((req) => {
      // Even if the caller mistakenly attaches feedback to an approval,
      // the manager should not surface it — feedback is denial-only.
      PermissionResponse.publish({
        id: req.id,
        granted: true,
        timestamp: Date.now(),
        feedback: 'ignored',
      });
    });

    try {
      const result = await manager.check({
        toolName: 'shell',
        action: 'execute',
        resource: 'ls',
      });
      expect(result.granted).toBe(true);
      expect(result.feedback).toBeUndefined();
    } finally {
      unsub();
    }
  });

  it('omits feedback when the user rejects without a reason', async () => {
    const manager = new PermissionManager([
      { id: 'ask-shell', tools: ['shell'], decision: 'ask', priority: 10 },
    ]);

    const unsub = PermissionRequested.subscribe((req) => {
      PermissionResponse.publish({
        id: req.id,
        granted: false,
        timestamp: Date.now(),
        // No feedback field at all — the common "plain deny" case.
      });
    });

    try {
      const result = await manager.check({
        toolName: 'shell',
        action: 'execute',
        resource: 'ls',
      });
      expect(result.granted).toBe(false);
      expect(result.feedback).toBeUndefined();
    } finally {
      unsub();
    }
  });

  it('treats whitespace-only feedback as absent', async () => {
    const manager = new PermissionManager([
      { id: 'ask-shell', tools: ['shell'], decision: 'ask', priority: 10 },
    ]);

    const unsub = PermissionRequested.subscribe((req) => {
      PermissionResponse.publish({
        id: req.id,
        granted: false,
        timestamp: Date.now(),
        feedback: '   \t  ',
      });
    });

    try {
      const result = await manager.check({
        toolName: 'shell',
        action: 'execute',
        resource: 'ls',
      });
      expect(result.granted).toBe(false);
      expect(result.feedback).toBeUndefined();
    } finally {
      unsub();
    }
  });
});
