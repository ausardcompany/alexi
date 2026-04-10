/**
 * Permission Routes for Server API
 * Provides endpoints for managing permission states including allow-everything toggle
 */

import type { SessionManager } from '../core/sessionManager.js';
import { Permission } from './next.js';

export interface PermissionRoutesOptions {
  sessionManager: SessionManager;
}

/**
 * Create permission route handlers
 */
export function createPermissionRoutes(options: PermissionRoutesOptions) {
  const { sessionManager } = options;

  return {
    /**
     * Enable allow-everything mode for a session
     * POST /api/permissions/allow-everything
     * Body: { sessionId: string, scope?: 'session' | 'project' }
     */
    async allowEverything(req: {
      sessionId: string;
      scope?: 'session' | 'project';
    }): Promise<{ success: boolean; state?: Permission.State; error?: string }> {
      const { sessionId, scope = 'session' } = req;

      if (!sessionId) {
        return { success: false, error: 'sessionId required' };
      }

      try {
        const session = sessionManager.loadSession(sessionId);
        if (!session) {
          return { success: false, error: 'Session not found' };
        }

        // Get or create permission state
        const currentState: Permission.State = (session as any).permissionState ?? {
          approved: [],
          denied: [],
          allowEverything: false,
        };

        const newState = Permission.allowEverything(currentState, scope);

        // Store updated state in session
        (session as any).permissionState = newState;
        sessionManager.saveSession(session);

        return { success: true, state: newState };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    },

    /**
     * Disable allow-everything mode for a session
     * POST /api/permissions/disable-allow-everything
     * Body: { sessionId: string }
     */
    async disableAllowEverything(req: {
      sessionId: string;
    }): Promise<{ success: boolean; state?: Permission.State; error?: string }> {
      const { sessionId } = req;

      if (!sessionId) {
        return { success: false, error: 'sessionId required' };
      }

      try {
        const session = sessionManager.loadSession(sessionId);
        if (!session) {
          return { success: false, error: 'Session not found' };
        }

        // Get current permission state
        const currentState: Permission.State = (session as any).permissionState ?? {
          approved: [],
          denied: [],
          allowEverything: false,
        };

        const newState = Permission.disableAllowEverything(currentState);

        // Store updated state in session
        (session as any).permissionState = newState;
        sessionManager.saveSession(session);

        return { success: true, state: newState };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    },

    /**
     * Get permission state for a session
     * GET /api/permissions/state?sessionId=xxx
     */
    async getState(req: {
      sessionId: string;
    }): Promise<{ success: boolean; state?: Permission.State; error?: string }> {
      const { sessionId } = req;

      if (!sessionId) {
        return { success: false, error: 'sessionId required' };
      }

      try {
        const session = sessionManager.loadSession(sessionId);
        if (!session) {
          return { success: false, error: 'Session not found' };
        }

        const state: Permission.State = (session as any).permissionState ?? {
          approved: [],
          denied: [],
          allowEverything: false,
        };

        return { success: true, state };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    },
  };
}
