import React, { createContext, useContext, useState, useCallback } from 'react';

import type { SessionManager } from '../../../core/sessionManager.js';

export interface CostInfo {
  inputTokens: number;
  outputTokens: number;
  totalCost: number;
  currency: string;
}

export type AgentName = 'code' | 'debug' | 'plan' | 'explore' | 'orchestrator';

export const AGENTS: AgentName[] = ['code', 'debug', 'plan', 'explore', 'orchestrator'];

export interface SessionContextValue {
  sessionId: string;
  model: string;
  autoRoute: boolean;
  agent: AgentName;
  stage: string | null;
  tokenCount: number;
  cost: CostInfo;
  setModel: (m: string) => void;
  setAgent: (a: AgentName) => void;
  cycleAgent: (forward: boolean) => void;
  setTokenCount: (n: number) => void;
  setCost: (c: CostInfo) => void;
}

export const SessionContext = createContext<SessionContextValue | null>(null);

export interface SessionProviderProps {
  children: React.ReactNode;
  initialModel: string;
  initialAutoRoute: boolean;
  initialAgent?: AgentName;
  sessionId: string;
  sessionManager?: SessionManager;
}

const DEFAULT_COST: CostInfo = {
  inputTokens: 0,
  outputTokens: 0,
  totalCost: 0,
  currency: 'USD',
};

export function SessionProvider({
  children,
  initialModel,
  initialAutoRoute,
  initialAgent = 'orchestrator',
  sessionId,
}: SessionProviderProps) {
  const [model, setModel] = useState<string>(initialModel);
  const [agent, setAgent] = useState<AgentName>(initialAgent);
  const [tokenCount, setTokenCount] = useState<number>(0);
  const [cost, setCost] = useState<CostInfo>(DEFAULT_COST);

  const cycleAgent = useCallback((forward: boolean) => {
    setAgent((prev) => {
      const idx = AGENTS.indexOf(prev);
      const len = AGENTS.length;
      const next = forward ? (idx + 1) % len : (idx - 1 + len) % len;
      return AGENTS[next];
    });
  }, []);

  const value: SessionContextValue = {
    sessionId,
    model,
    autoRoute: initialAutoRoute,
    agent,
    stage: null,
    tokenCount,
    cost,
    setModel,
    setAgent,
    cycleAgent,
    setTokenCount,
    setCost,
  };

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionContextValue {
  const ctx = useContext(SessionContext);
  if (ctx === null) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return ctx;
}
