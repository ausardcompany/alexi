/**
 * Permission Routes
 * Simplified permission routing structure
 * Based on kilocode/opencode permission patterns
 */

import { getPermissionManager, type PermissionContext, type PermissionResult } from './index.js';

export const permissionRoutes = {
  /**
   * Check if a permission request should be granted
   */
  async check(request: PermissionContext): Promise<PermissionResult> {
    const manager = getPermissionManager();
    return manager.check(request);
  },

  /**
   * Grant a permission for the current session
   */
  grant(request: PermissionContext): void {
    const manager = getPermissionManager();
    manager.grantSession(request);
  },

  /**
   * Revoke a previously granted session permission
   */
  revoke(request: PermissionContext): void {
    const manager = getPermissionManager();
    manager.revokeSession(request);
  },

  /**
   * Clear all session-level permission grants
   */
  clearSession(): void {
    const manager = getPermissionManager();
    manager.clearSession();
  },
};
