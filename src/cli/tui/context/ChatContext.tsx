import React, { createContext, useContext, useReducer, useCallback } from 'react';

// ---------------------------------------------------------------------------
// Data-model interfaces
// ---------------------------------------------------------------------------

export interface DiffLine {
  type: 'add' | 'remove' | 'context';
  content: string;
}

export interface DiffHunk {
  oldStart: number;
  oldLines: number;
  newStart: number;
  newLines: number;
  lines: DiffLine[];
}

export interface DiffData {
  filePath: string;
  hunks: DiffHunk[];
}

export interface ToolCallState {
  id: string;
  toolName: string;
  params: Record<string, unknown>;
  status: 'pending' | 'running' | 'completed' | 'failed';
  output: string | null;
  error: string | null;
  isExpanded: boolean;
  diff: DiffData | null;
  startedAt: number;
  completedAt: number | null;
}

export interface ChatState {
  isStreaming: boolean;
  streamingText: string;
  activeToolCalls: ToolCallState[];
  completedToolCalls: ToolCallState[];
  abortController: AbortController | null;
  error: string | null;
  responseModel: string | null;
}

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------

type ChatAction =
  | { type: 'SET_STREAMING'; payload: boolean }
  | { type: 'APPEND_STREAM_TEXT'; payload: string }
  | { type: 'CLEAR_STREAM_TEXT' }
  | { type: 'ADD_TOOL_CALL'; payload: ToolCallState }
  | { type: 'UPDATE_TOOL_CALL'; payload: { id: string } & Partial<ToolCallState> }
  | { type: 'TOGGLE_TOOL_CALL_EXPANSION'; payload: string }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_ABORT_CONTROLLER'; payload: AbortController | null }
  | { type: 'SET_RESPONSE_MODEL'; payload: string | null }
  | { type: 'RESET' };

// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------

const INITIAL_STATE: ChatState = {
  isStreaming: false,
  streamingText: '',
  activeToolCalls: [],
  completedToolCalls: [],
  abortController: null,
  error: null,
  responseModel: null,
};

function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'SET_STREAMING':
      return { ...state, isStreaming: action.payload };

    case 'APPEND_STREAM_TEXT':
      return { ...state, streamingText: state.streamingText + action.payload };

    case 'CLEAR_STREAM_TEXT':
      return { ...state, streamingText: '' };

    case 'ADD_TOOL_CALL':
      return { ...state, activeToolCalls: [...state.activeToolCalls, action.payload] };

    case 'UPDATE_TOOL_CALL': {
      const { id, ...updates } = action.payload;
      const isTerminal = updates.status === 'completed' || updates.status === 'failed';

      const updated = state.activeToolCalls.map((tc) =>
        tc.id === id ? { ...tc, ...updates } : tc
      );

      if (isTerminal) {
        const finished = updated.find((tc) => tc.id === id);
        const remaining = updated.filter((tc) => tc.id !== id);
        return {
          ...state,
          activeToolCalls: remaining,
          completedToolCalls: finished
            ? [...state.completedToolCalls, finished]
            : state.completedToolCalls,
        };
      }

      return { ...state, activeToolCalls: updated };
    }

    case 'TOGGLE_TOOL_CALL_EXPANSION': {
      const toggleIn = (list: ToolCallState[]) =>
        list.map((tc) => (tc.id === action.payload ? { ...tc, isExpanded: !tc.isExpanded } : tc));
      return {
        ...state,
        activeToolCalls: toggleIn(state.activeToolCalls),
        completedToolCalls: toggleIn(state.completedToolCalls),
      };
    }

    case 'SET_ERROR':
      return { ...state, error: action.payload };

    case 'SET_ABORT_CONTROLLER':
      return { ...state, abortController: action.payload };

    case 'SET_RESPONSE_MODEL':
      return { ...state, responseModel: action.payload };

    case 'RESET':
      return { ...INITIAL_STATE };

    default:
      return state;
  }
}

// ---------------------------------------------------------------------------
// Context value
// ---------------------------------------------------------------------------

export interface ChatContextValue extends ChatState {
  setStreaming: (streaming: boolean) => void;
  appendStreamText: (text: string) => void;
  clearStreamText: () => void;
  addToolCall: (toolCall: ToolCallState) => void;
  updateToolCall: (id: string, updates: Partial<ToolCallState>) => void;
  toggleToolCallExpansion: (id: string) => void;
  setError: (error: string | null) => void;
  setAbortController: (controller: AbortController | null) => void;
  setResponseModel: (model: string | null) => void;
  reset: () => void;
}

export const ChatContext = createContext<ChatContextValue | null>(null);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

interface ChatProviderProps {
  children: React.ReactNode;
}

export function ChatProvider({ children }: ChatProviderProps) {
  const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);

  const setStreaming = useCallback((streaming: boolean) => {
    dispatch({ type: 'SET_STREAMING', payload: streaming });
  }, []);

  const appendStreamText = useCallback((text: string) => {
    dispatch({ type: 'APPEND_STREAM_TEXT', payload: text });
  }, []);

  const clearStreamText = useCallback(() => {
    dispatch({ type: 'CLEAR_STREAM_TEXT' });
  }, []);

  const addToolCall = useCallback((toolCall: ToolCallState) => {
    dispatch({ type: 'ADD_TOOL_CALL', payload: toolCall });
  }, []);

  const updateToolCall = useCallback((id: string, updates: Partial<ToolCallState>) => {
    dispatch({ type: 'UPDATE_TOOL_CALL', payload: { id, ...updates } });
  }, []);

  const toggleToolCallExpansion = useCallback((id: string) => {
    dispatch({ type: 'TOGGLE_TOOL_CALL_EXPANSION', payload: id });
  }, []);

  const setError = useCallback((error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  }, []);

  const setAbortController = useCallback((controller: AbortController | null) => {
    dispatch({ type: 'SET_ABORT_CONTROLLER', payload: controller });
  }, []);

  const setResponseModel = useCallback((model: string | null) => {
    dispatch({ type: 'SET_RESPONSE_MODEL', payload: model });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  const value: ChatContextValue = {
    ...state,
    setStreaming,
    appendStreamText,
    clearStreamText,
    addToolCall,
    updateToolCall,
    toggleToolCallExpansion,
    setError,
    setAbortController,
    setResponseModel,
    reset,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useChat(): ChatContextValue {
  const ctx = useContext(ChatContext);
  if (ctx === null) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return ctx;
}
