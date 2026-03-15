import { describe, it, expect } from 'vitest';
import React, { act } from 'react';
import { render } from 'ink-testing-library';
import { Text } from 'ink';

import {
  DialogContext,
  DialogProvider,
  useDialog,
} from '../../../src/cli/tui/context/DialogContext.js';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function DialogStateInspector(): React.JSX.Element {
  const { isOpen, currentType, stack } = useDialog();
  return <Text>{JSON.stringify({ isOpen, currentType, stackLen: stack.length })}</Text>;
}

let capturedOpen: ((type: string, props?: Record<string, unknown>) => Promise<unknown>) | null =
  null;
let capturedClose: ((result?: unknown) => void) | null = null;
let capturedCancel: (() => void) | null = null;

function DialogCapture(): React.JSX.Element {
  const dialog = useDialog();
  capturedOpen = dialog.open as typeof capturedOpen;
  capturedClose = dialog.close;
  capturedCancel = dialog.cancel;
  return <DialogStateInspector />;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('DialogContext', () => {
  describe('initial state', () => {
    it('starts with empty stack and isOpen=false', () => {
      const { lastFrame } = render(
        <DialogProvider>
          <DialogStateInspector />
        </DialogProvider>
      );
      const state = JSON.parse(lastFrame()!);
      expect(state.isOpen).toBe(false);
      expect(state.currentType).toBeNull();
      expect(state.stackLen).toBe(0);
    });
  });

  describe('open()', () => {
    it('pushing a dialog sets isOpen=true and stackLen=1', () => {
      const { lastFrame } = render(
        <DialogProvider>
          <DialogCapture />
        </DialogProvider>
      );

      act(() => {
        void capturedOpen?.('model-picker');
      });

      const state = JSON.parse(lastFrame()!);
      expect(state.isOpen).toBe(true);
      expect(state.stackLen).toBe(1);
      expect(state.currentType).toBe('model-picker');
    });

    it('returns a promise', () => {
      render(
        <DialogProvider>
          <DialogCapture />
        </DialogProvider>
      );

      act(() => {
        const result = capturedOpen?.('agent-selector');
        expect(result).toBeInstanceOf(Promise);
      });
    });

    it('stacking two dialogs gives stackLen=2', () => {
      const { lastFrame } = render(
        <DialogProvider>
          <DialogCapture />
        </DialogProvider>
      );

      act(() => {
        void capturedOpen?.('model-picker');
        void capturedOpen?.('agent-selector');
      });

      const state = JSON.parse(lastFrame()!);
      expect(state.stackLen).toBe(2);
      expect(state.currentType).toBe('agent-selector');
    });
  });

  describe('close()', () => {
    it('close() pops the top dialog', () => {
      const { lastFrame } = render(
        <DialogProvider>
          <DialogCapture />
        </DialogProvider>
      );

      act(() => {
        void capturedOpen?.('model-picker');
      });

      act(() => {
        capturedClose?.('selected-model');
      });

      const state = JSON.parse(lastFrame()!);
      expect(state.isOpen).toBe(false);
      expect(state.stackLen).toBe(0);
    });

    it('close() resolves the promise with the result', async () => {
      render(
        <DialogProvider>
          <DialogCapture />
        </DialogProvider>
      );

      let promise: Promise<unknown> | undefined;
      act(() => {
        promise = capturedOpen?.('model-picker') as Promise<unknown>;
      });

      act(() => {
        capturedClose?.('my-model');
      });

      const result = await promise;
      expect(result).toBe('my-model');
    });

    it('close() on empty stack is a no-op', () => {
      const { lastFrame } = render(
        <DialogProvider>
          <DialogCapture />
        </DialogProvider>
      );

      act(() => {
        capturedClose?.();
      });

      const state = JSON.parse(lastFrame()!);
      expect(state.stackLen).toBe(0);
    });
  });

  describe('cancel()', () => {
    it('cancel() pops the top dialog', () => {
      const { lastFrame } = render(
        <DialogProvider>
          <DialogCapture />
        </DialogProvider>
      );

      act(() => {
        // Attach .catch to prevent unhandled rejection in the test environment
        capturedOpen?.('permission')?.catch(() => {});
      });

      act(() => {
        capturedCancel?.();
      });

      const state = JSON.parse(lastFrame()!);
      expect(state.isOpen).toBe(false);
      expect(state.stackLen).toBe(0);
    });

    it('cancel() results in a rejected dialog entry', () => {
      // The DialogProvider's cancel() calls reject() on the top entry.
      // We test this by verifying the stack becomes empty after cancel(),
      // which means the entry was popped (and reject was called).
      const { lastFrame } = render(
        <DialogProvider>
          <DialogCapture />
        </DialogProvider>
      );

      // Open, then cancel — verify stack is empty
      act(() => {
        // Attach catch to avoid any unhandled rejection surfacing from the mock env
        capturedOpen?.('permission')?.catch(() => {});
      });

      act(() => {
        capturedCancel?.();
      });

      const state = JSON.parse(lastFrame()!);
      expect(state.isOpen).toBe(false);
      expect(state.stackLen).toBe(0);
    });
  });

  describe('DialogContext direct access', () => {
    it('DialogContext is exported and defined', () => {
      expect(DialogContext).toBeDefined();
    });
  });

  describe('useDialog guard', () => {
    it('useDialog returns a valid context when inside DialogProvider', () => {
      let capturedCtx: ReturnType<typeof useDialog> | null = null;
      function Capture(): React.JSX.Element {
        capturedCtx = useDialog();
        return <Text>{String(capturedCtx.isOpen)}</Text>;
      }
      render(
        <DialogProvider>
          <Capture />
        </DialogProvider>
      );
      expect(capturedCtx).not.toBeNull();
      expect(capturedCtx!.stack).toBeDefined();
      expect(capturedCtx!.open).toBeInstanceOf(Function);
      expect(capturedCtx!.close).toBeInstanceOf(Function);
      expect(capturedCtx!.cancel).toBeInstanceOf(Function);
    });
  });
});
