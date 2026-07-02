/**
 * Tests for PermissionManager auto (yolo) mode and the AllowEverything short-circuit
 * wired via `setPermissionMode('auto')`.
 *
 * Covers issue #892: --yolo / --dangerously-skip-permissions wires
 * AllowEverythingPermission.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { PermissionManager, defaultRules } from './index.js';
import { PermissionRequested } from '../bus/index.js';

describe('PermissionManager permission mode (auto/yolo)', () => {
  let manager: PermissionManager;

  beforeEach(() => {
    manager = new PermissionManager(defaultRules);
    // Allow external paths so the external-directory guard does not deny
    // resources like `/tmp/x` before permissionMode is consulted.
    manager.setAllowExternalDirectories(true);
  });

  it("defaults to 'normal' mode", () => {
    expect(manager.getPermissionMode()).toBe('normal');
  });

  it("switches to 'auto' via setPermissionMode", () => {
    manager.setPermissionMode('auto');
    expect(manager.getPermissionMode()).toBe('auto');
  });

  it("allows arbitrary writes without publishing PermissionRequested in 'auto' mode", async () => {
    manager.setPermissionMode('auto');

    // If auto mode were leaking through to askUser, this handler would fire.
    let requested = 0;
    const unsubscribe = PermissionRequested.subscribe(() => {
      requested += 1;
    });

    try {
      const result = await manager.check({
        toolName: 'write',
        action: 'write',
        resource: '/tmp/x',
      });
      expect(result.granted).toBe(true);
      expect(result.decision).toBe('allow');
      expect(requested).toBe(0);
    } finally {
      unsubscribe();
    }
  });

  it("still denies .env in 'auto' mode via deny-secrets exclude list", async () => {
    manager.setPermissionMode('auto');
    const result = await manager.check({
      toolName: 'read_file',
      action: 'read',
      resource: '/repo/.env',
    });
    expect(result.granted).toBe(false);
    expect(result.decision).toBe('deny');
  });

  it("still denies secrets.* in 'auto' mode via deny-secrets exclude list", async () => {
    manager.setPermissionMode('auto');
    const result = await manager.check({
      toolName: 'read_file',
      action: 'read',
      resource: '/repo/secrets.json',
    });
    expect(result.granted).toBe(false);
    expect(result.decision).toBe('deny');
  });

  it("still denies ~/.ssh in 'auto' mode via the SSH belt-and-braces exclude", async () => {
    // Even if a caller drops the deny-secrets rule, --yolo must not touch SSH.
    const permissiveManager = new PermissionManager([]);
    permissiveManager.setAllowExternalDirectories(true);
    permissiveManager.setPermissionMode('auto');
    const result = await permissiveManager.check({
      toolName: 'read_file',
      action: 'read',
      resource: '/home/alice/.ssh/id_rsa',
    });
    expect(result.granted).toBe(false);
    expect(result.decision).toBe('deny');
  });

  it("in 'normal' mode (default) falls back to rule evaluation (asks the user)", async () => {
    // Default rule set has an `ask-write` rule that asks for write actions.
    // In normal mode this MUST publish a PermissionRequested event (proving
    // the check is not short-circuited); wire a subscriber that immediately
    // publishes a granted response so the check resolves without a 60s wait.
    const { PermissionResponse } = await import('../bus/index.js');
    const unsub = PermissionRequested.subscribe((req) => {
      // Defer to next tick so askUser has time to subscribe to
      // PermissionResponse (askUser publishes the request BEFORE it
      // awaits the response).
      setImmediate(() => {
        PermissionResponse.publish({
          id: req.id,
          granted: true,
          remember: false,
          timestamp: Date.now(),
        });
      });
    });
    try {
      const result = await manager.check({
        toolName: 'write',
        action: 'write',
        resource: '/tmp/x',
      });
      expect(result.granted).toBe(true);
    } finally {
      unsub();
    }
  });
});
