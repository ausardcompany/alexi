import { useEffect } from 'react';
import { useDialog } from '../context/DialogContext.js';
import { PermissionRequested, PermissionResponse } from '../../../bus/index.js';

interface PermissionDialogProps {
  action: 'read' | 'write' | 'execute' | 'network' | 'admin';
  toolName: string;
  resource: string;
  description: string;
  icon: string;
}

interface PermissionResult {
  granted: boolean;
  remember: boolean;
}

const ACTION_ICONS: Record<string, string> = {
  read: '📖',
  write: '✏️',
  execute: '⚙️',
  network: '🌐',
  admin: '🔐',
};

export function usePermission(): void {
  const { open } = useDialog();

  useEffect(() => {
    const unsub = PermissionRequested.subscribe(async (payload) => {
      const icon = ACTION_ICONS[payload.action] ?? '🔒';
      try {
        const result = await open<PermissionResult>('permission', {
          action: payload.action,
          toolName: payload.toolName,
          resource: payload.resource,
          description: payload.description,
          icon,
        } as Record<string, unknown>);
        PermissionResponse.publish({
          id: payload.id,
          granted: result.granted,
          remember: result.remember,
          timestamp: Date.now(),
        });
      } catch {
        // Dialog was cancelled (Escape or cancel()) → deny
        PermissionResponse.publish({
          id: payload.id,
          granted: false,
          remember: false,
          timestamp: Date.now(),
        });
      }
    });

    return () => unsub();
  }, [open]);
}

// PermissionDialogProps is defined for documentation/type-narrowing purposes
type _PermissionDialogProps = PermissionDialogProps;
