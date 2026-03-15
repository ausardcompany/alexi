import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

export interface KeybindState {
  leaderActive: boolean;
  leaderTimeout: ReturnType<typeof setTimeout> | null;
  inputFocused: boolean;
}

export interface KeybindContextValue {
  state: KeybindState;
  activateLeader: () => void;
  deactivateLeader: () => void;
  setInputFocused: (focused: boolean) => void;
}

const LEADER_TIMEOUT_MS = 1500;

const KeybindContext = createContext<KeybindContextValue | null>(null);

export function KeybindProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const [leaderActive, setLeaderActive] = useState(false);
  const [inputFocused, setInputFocusedState] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const deactivateLeader = useCallback(() => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setLeaderActive(false);
  }, []);

  const activateLeader = useCallback(() => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
    }
    setLeaderActive(true);
    timeoutRef.current = setTimeout(() => {
      setLeaderActive(false);
      timeoutRef.current = null;
    }, LEADER_TIMEOUT_MS);
  }, []);

  const setInputFocused = useCallback((focused: boolean) => {
    setInputFocusedState(focused);
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const state: KeybindState = {
    leaderActive,
    leaderTimeout: timeoutRef.current,
    inputFocused,
  };

  const value: KeybindContextValue = {
    state,
    activateLeader,
    deactivateLeader,
    setInputFocused,
  };

  return <KeybindContext.Provider value={value}>{children}</KeybindContext.Provider>;
}

export function useKeybind(): KeybindContextValue {
  const ctx = useContext(KeybindContext);
  if (ctx === null) {
    throw new Error('useKeybind must be used within a KeybindProvider');
  }
  return ctx;
}

export { KeybindContext };
