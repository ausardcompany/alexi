import React, { createContext, useCallback, useContext, useState } from 'react';

export type DialogType =
  | 'model-picker'
  | 'agent-selector'
  | 'permission'
  | 'session-list'
  | 'session-rename'
  | 'mcp-manager'
  | 'command-palette'
  | 'confirm'
  | 'alert';

export interface DialogEntry {
  id: string;
  type: DialogType;
  props: Record<string, unknown>;
  resolve: (result: unknown) => void;
  reject: () => void;
}

export interface DialogContextValue {
  stack: DialogEntry[];
  open: <T>(type: DialogType, props?: Record<string, unknown>) => Promise<T>;
  close: (result?: unknown) => void;
  cancel: () => void;
  isOpen: boolean;
  currentType: DialogType | null;
  currentEntry: DialogEntry | null;
}

const DialogContext = createContext<DialogContextValue | null>(null);

export function DialogProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const [stack, setStack] = useState<DialogEntry[]>([]);

  const open = useCallback(
    <T,>(type: DialogType, props: Record<string, unknown> = {}): Promise<T> => {
      return new Promise<T>((resolve, reject) => {
        const id = Date.now().toString();
        const entry: DialogEntry = {
          id,
          type,
          props,
          resolve: resolve as (result: unknown) => void,
          reject,
        };
        setStack((prev) => [...prev, entry]);
      });
    },
    []
  );

  const close = useCallback((result?: unknown) => {
    setStack((prev) => {
      if (prev.length === 0) {
        return prev;
      }
      const top = prev[prev.length - 1];
      top.resolve(result);
      return prev.slice(0, -1);
    });
  }, []);

  const cancel = useCallback(() => {
    setStack((prev) => {
      if (prev.length === 0) {
        return prev;
      }
      const top = prev[prev.length - 1];
      top.reject();
      return prev.slice(0, -1);
    });
  }, []);

  const currentEntry = stack.length > 0 ? stack[stack.length - 1] : null;

  const value: DialogContextValue = {
    stack,
    open,
    close,
    cancel,
    isOpen: stack.length > 0,
    currentType: currentEntry?.type ?? null,
    currentEntry,
  };

  return <DialogContext.Provider value={value}>{children}</DialogContext.Provider>;
}

export function useDialog(): DialogContextValue {
  const ctx = useContext(DialogContext);
  if (ctx === null) {
    throw new Error('useDialog must be used within a DialogProvider');
  }
  return ctx;
}

export { DialogContext };
