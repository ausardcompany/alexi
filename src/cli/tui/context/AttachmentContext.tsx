import React, { createContext, useContext, useReducer, useCallback, useRef } from 'react';
import { nanoid } from 'nanoid';
import { readClipboardImage, readImageFile } from '../../../utils/clipboard.js';
import { validateImage, type ImageFormat } from '../../../utils/imageValidation.js';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** A pending image attachment before message submission. */
export interface ImageAttachment {
  /** Unique identifier for this attachment. */
  id: string;
  /** Raw image data as a Buffer. */
  data: Buffer;
  /** Detected image format from magic bytes. */
  format: ImageFormat;
  /** Size in bytes of the raw data. */
  sizeBytes: number;
  /** Source of the image. */
  source: 'clipboard' | 'file';
  /** Original file path if source is 'file'. */
  filePath?: string;
  /** Timestamp when the attachment was created. */
  createdAt: number;
}

/** Lightweight version for display purposes (no raw data). */
export interface ImageAttachmentPreview {
  id: string;
  format: ImageFormat;
  sizeBytes: number;
  source: 'clipboard' | 'file';
  filePath?: string;
}

/** State managed by the attachment reducer. */
export interface AttachmentsState {
  /** Currently pending image attachments (not yet submitted). */
  pending: ImageAttachment[];
  /** Whether a clipboard read is in progress. */
  reading: boolean;
  /** Last error from clipboard read or file read. */
  error?: string;
}

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------

type AttachmentAction =
  | { type: 'SET_READING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | undefined }
  | { type: 'ADD_ATTACHMENT'; payload: ImageAttachment }
  | { type: 'REMOVE_ATTACHMENT'; payload: string }
  | { type: 'CLEAR_ALL' }
  | { type: 'CONSUME_ALL' };

// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------

const INITIAL_STATE: AttachmentsState = {
  pending: [],
  reading: false,
  error: undefined,
};

function attachmentReducer(state: AttachmentsState, action: AttachmentAction): AttachmentsState {
  switch (action.type) {
    case 'SET_READING':
      return { ...state, reading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload };

    case 'ADD_ATTACHMENT':
      return { ...state, pending: [...state.pending, action.payload], error: undefined };

    case 'REMOVE_ATTACHMENT':
      return { ...state, pending: state.pending.filter((a) => a.id !== action.payload) };

    case 'CLEAR_ALL':
      return { ...state, pending: [], error: undefined };

    case 'CONSUME_ALL':
      return { ...state, pending: [] };

    default:
      return state;
  }
}

// ---------------------------------------------------------------------------
// Context value
// ---------------------------------------------------------------------------

export interface AttachmentContextValue extends AttachmentsState {
  /** Read image from clipboard and add as attachment. */
  pasteFromClipboard(): Promise<void>;
  /** Read image from file path and add as attachment. */
  addFromFile(filePath: string): Promise<void>;
  /** Remove a specific attachment by ID. */
  remove(id: string): void;
  /** Clear all pending attachments. */
  clearAll(): void;
  /**
   * Consume all pending attachments (called on message submit).
   * Returns the attachments and clears the pending list.
   */
  consumeAll(): ImageAttachment[];
}

export const AttachmentContext = createContext<AttachmentContextValue | null>(null);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

interface AttachmentProviderProps {
  children: React.ReactNode;
}

export function AttachmentProvider({ children }: AttachmentProviderProps): React.JSX.Element {
  const [state, dispatch] = useReducer(attachmentReducer, INITIAL_STATE);

  // Ref to access latest pending list in consumeAll without stale closures
  const pendingRef = useRef<ImageAttachment[]>(state.pending);
  pendingRef.current = state.pending;

  const pasteFromClipboard = useCallback(async () => {
    dispatch({ type: 'SET_READING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: undefined });

    try {
      const result = await readClipboardImage();

      if (!result.success) {
        dispatch({ type: 'SET_ERROR', payload: result.error });
        return;
      }

      const validation = validateImage(result.data);
      if (!validation.valid) {
        dispatch({ type: 'SET_ERROR', payload: validation.error });
        return;
      }

      const attachment: ImageAttachment = {
        id: nanoid(),
        data: result.data,
        format: result.format,
        sizeBytes: result.data.length,
        source: 'clipboard',
        createdAt: Date.now(),
      };

      dispatch({ type: 'ADD_ATTACHMENT', payload: attachment });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      dispatch({ type: 'SET_ERROR', payload: `Clipboard error: ${message}` });
    } finally {
      dispatch({ type: 'SET_READING', payload: false });
    }
  }, []);

  const addFromFile = useCallback(async (filePath: string) => {
    dispatch({ type: 'SET_READING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: undefined });

    try {
      const result = await readImageFile(filePath);

      if (!result.success) {
        dispatch({ type: 'SET_ERROR', payload: result.error });
        return;
      }

      const validation = validateImage(result.data);
      if (!validation.valid) {
        dispatch({ type: 'SET_ERROR', payload: validation.error });
        return;
      }

      const attachment: ImageAttachment = {
        id: nanoid(),
        data: result.data,
        format: result.format,
        sizeBytes: result.data.length,
        source: 'file',
        filePath,
        createdAt: Date.now(),
      };

      dispatch({ type: 'ADD_ATTACHMENT', payload: attachment });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      dispatch({ type: 'SET_ERROR', payload: `File error: ${message}` });
    } finally {
      dispatch({ type: 'SET_READING', payload: false });
    }
  }, []);

  const remove = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_ATTACHMENT', payload: id });
  }, []);

  const clearAll = useCallback(() => {
    dispatch({ type: 'CLEAR_ALL' });
  }, []);

  const consumeAll = useCallback((): ImageAttachment[] => {
    const attachments = [...pendingRef.current];
    dispatch({ type: 'CONSUME_ALL' });
    return attachments;
  }, []);

  const value: AttachmentContextValue = {
    ...state,
    pasteFromClipboard,
    addFromFile,
    remove,
    clearAll,
    consumeAll,
  };

  return <AttachmentContext.Provider value={value}>{children}</AttachmentContext.Provider>;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useAttachments(): AttachmentContextValue {
  const ctx = useContext(AttachmentContext);
  if (ctx === null) {
    throw new Error('useAttachments must be used within an AttachmentProvider');
  }
  return ctx;
}
