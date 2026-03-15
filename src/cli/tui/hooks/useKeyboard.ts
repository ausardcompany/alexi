import { useInput } from 'ink';

import { useSession } from '../context/SessionContext.js';
import { useKeybind } from '../context/KeybindContext.js';
import { useDialog } from '../context/DialogContext.js';
import { useChat } from '../context/ChatContext.js';
import type { ModelGroup } from '../dialogs/ModelPicker.js';

// ---------------------------------------------------------------------------
// Static model groups (same constant as in useCommands.ts)
// ---------------------------------------------------------------------------

const STATIC_MODEL_GROUPS: ModelGroup[] = [
  {
    provider: 'openai',
    models: [
      { id: 'gpt-4o-mini', label: 'gpt-4o-mini', description: 'cheap · 16,000 tokens' },
      { id: 'gpt-4o', label: 'gpt-4o', description: 'medium · 128,000 tokens' },
      { id: 'gpt-4.1', label: 'gpt-4.1', description: 'expensive · 128,000 tokens' },
    ],
  },
  {
    provider: 'claude',
    models: [
      {
        id: 'anthropic--claude-4.5-haiku',
        label: 'claude-4.5-haiku',
        description: 'cheap · 200,000 tokens',
      },
      {
        id: 'anthropic--claude-4.5-sonnet',
        label: 'claude-4.5-sonnet',
        description: 'medium · 200,000 tokens',
      },
      {
        id: 'anthropic--claude-4.5-opus',
        label: 'claude-4.5-opus',
        description: 'expensive · 200,000 tokens',
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

export interface UseKeyboardOptions {
  /** Called when Ctrl+C is pressed and not streaming */
  onExit: () => void;
  /** Called when Ctrl+L is pressed (clear messages) */
  onClear: () => void;
  /** Called when leader+n is pressed (new session) */
  onNewSession: () => void;
  /** Whether the input box is currently accepting text input (i.e. NOT in leader mode) */
  isInputActive: boolean;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useKeyboard(options: UseKeyboardOptions): void {
  const { onExit, onClear, onNewSession } = options;

  const { cycleAgent } = useSession();
  const { state: keybindState, activateLeader, deactivateLeader } = useKeybind();
  const { open } = useDialog();
  const { isStreaming, abortController } = useChat();

  useInput((input, key) => {
    // Tab — cycle agents forward
    if (key.tab && !key.shift) {
      cycleAgent(true);
      return;
    }

    // Shift+Tab — cycle agents backward
    if (key.tab && key.shift) {
      cycleAgent(false);
      return;
    }

    // Ctrl+X — activate leader mode
    if (key.ctrl && input === 'x') {
      activateLeader();
      return;
    }

    // Ctrl+K — open command palette
    if (key.ctrl && input === 'k') {
      open('command-palette', { commands: [] }).catch(() => {
        // user cancelled — no-op
      });
      return;
    }

    // Ctrl+L — clear messages
    if (key.ctrl && input === 'l') {
      onClear();
      return;
    }

    // Ctrl+C — abort streaming if active, then exit
    if (key.ctrl && input === 'c') {
      if (isStreaming && abortController !== null) {
        abortController.abort();
      }
      onExit();
      return;
    }

    // Leader mode key dispatch
    if (keybindState.leaderActive) {
      switch (input) {
        case 'n':
          onNewSession();
          deactivateLeader();
          return;

        case 'm':
          open('model-picker', { modelGroups: STATIC_MODEL_GROUPS }).catch(() => {
            // user cancelled — no-op
          });
          deactivateLeader();
          return;

        case 'a':
          open('agent-selector', {}).catch(() => {
            // user cancelled — no-op
          });
          deactivateLeader();
          return;

        case 's':
          open('session-list', {}).catch(() => {
            // user cancelled — no-op
          });
          deactivateLeader();
          return;

        default:
          break;
      }
    }
  });
}
