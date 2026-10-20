import { useInput } from 'ink';

import { useSession } from '../context/SessionContext.js';
import { useKeybind } from '../context/KeybindContext.js';
import { useDialog } from '../context/DialogContext.js';
import { useChat } from '../context/ChatContext.js';
import { useSidebar } from '../context/SidebarContext.js';
import { usePage } from '../context/PageContext.js';
import { useSubagent } from '../context/SubagentContext.js';
import type { SlashCommand } from './useCommands.js';
import type { CommandEntry } from '../components/CommandPalette.js';
import { getHelpEntries } from '../utils/helpEntries.js';

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
  /** Available slash commands (passed to command palette when opened via Ctrl+K) */
  commands?: SlashCommand[];
  /**
   * Called with the 1-based index when Shift+{1-9} is pressed.
   *
   * Hooked up by `App.tsx` to open the Nth URL extracted from the current
   * transcript in the default browser (ports upstream kilocode PR #14910).
   * The handler itself owns the "no URL at this index" no-op behaviour so
   * the hook stays stateless w.r.t. transcript content.
   */
  onOpenTranscriptUrl?: (index: number) => void;
  /**
   * Called with the 1-based agent index (1..9) when Ctrl+{1-9} is pressed.
   *
   * Hooked up by `App.tsx` to jump the active agent to the Nth configured
   * agent. The handler itself owns the "no agent at this index" transient
   * error behaviour so the hook stays stateless w.r.t. the configured
   * agent list.
   */
  onJumpToAgent?: (index: number) => void;
}

// ---------------------------------------------------------------------------
// Internal constants
// ---------------------------------------------------------------------------

/**
 * The shifted-digit glyphs on a US QWERTY layout, indexed by digit-1.
 * `!` is Shift+1, `@` is Shift+2, ... `(` is Shift+9. We match on these
 * because many terminals report Shift+digit as the shifted punctuation
 * glyph rather than the digit itself (see useInput handler for details).
 */
const SHIFTED_DIGITS = '!@#$%^&*(';

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useKeyboard(options: UseKeyboardOptions): void {
  const {
    onExit,
    onClear,
    onNewSession,
    commands = [],
    onOpenTranscriptUrl,
    onJumpToAgent,
  } = options;

  const { cycleAgent } = useSession();
  const { state: keybindState, activateLeader, deactivateLeader } = useKeybind();
  const { open } = useDialog();
  const { isStreaming, abortController } = useChat();
  const sidebar = useSidebar();
  const { togglePage } = usePage();
  const subagent = useSubagent();

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

    // Shift+{1-9} — open the Nth URL from the transcript in the default
    // browser. Terminals report shifted digits in two different ways
    // depending on OS / keyboard layout:
    //   1. As the shifted-punctuation glyph on a US layout (`!@#$%^&*(`)
    //      with `key.shift === false`. Most Linux and macOS terminals
    //      take this path.
    //   2. As the digit itself (`1`..`9`) with `key.shift === true`.
    //      Some terminal multiplexers / Windows terminals do this.
    // We handle both so the keybind works everywhere.
    if (onOpenTranscriptUrl !== undefined && !keybindState.leaderActive && !key.ctrl && !key.meta) {
      const shiftedDigitIndex = SHIFTED_DIGITS.indexOf(input);
      if (shiftedDigitIndex >= 0) {
        onOpenTranscriptUrl(shiftedDigitIndex + 1);
        return;
      }
      if (key.shift && input.length === 1 && input >= '1' && input <= '9') {
        onOpenTranscriptUrl(Number.parseInt(input, 10));
        return;
      }
    }

    // Ctrl+{1-9} — jump directly to the Nth configured agent (1-indexed).
    // Out-of-bounds indices (e.g. Ctrl+9 with 3 agents configured) are
    // surfaced to the handler, which owns the transient-error / no-op
    // behaviour. Terminals report Ctrl+digit as `input === '<digit>'`
    // with `key.ctrl === true`.
    if (
      onJumpToAgent !== undefined &&
      key.ctrl &&
      input.length === 1 &&
      input >= '1' &&
      input <= '9'
    ) {
      onJumpToAgent(Number.parseInt(input, 10));
      return;
    }

    // Ctrl+X — activate leader mode
    if (key.ctrl && input === 'x') {
      activateLeader();
      return;
    }

    // Ctrl+K — open command palette
    if (key.ctrl && input === 'k') {
      const paletteCommands: CommandEntry[] = commands.map((cmd) => ({
        name: cmd.name,
        description: cmd.description,
        category: cmd.category,
      }));
      open('command-palette', { commands: paletteCommands }).catch(() => {
        // user cancelled — no-op
      });
      return;
    }

    // Ctrl+L — clear messages
    if (key.ctrl && input === 'l') {
      onClear();
      return;
    }

    // Ctrl+J — toggle page (chat/logs)
    if (key.ctrl && input === 'j') {
      togglePage();
      return;
    }

    // Ctrl+B — toggle sidebar
    if (key.ctrl && input === 'b') {
      sidebar.toggle();
      return;
    }

    // Ctrl+S — open steering prompt dialog for the active subagent.
    // When no subagent is running we intentionally no-op so Ctrl+S does
    // not accidentally trigger unrelated behaviour (ports upstream
    // kilocode #14702: steering is a strict superset — guard with
    // activeSubagentId so idle sessions ignore the key).
    if (key.ctrl && input === 's') {
      if (subagent.activeSubagentId === null) {
        return;
      }
      open<Record<string, string>>('arg-input', {
        title: 'Steer subagent:',
        fields: [
          {
            name: 'prompt',
            label: 'Prompt',
            placeholder: 'e.g. focus on edge cases',
            required: true,
          },
        ],
      })
        .then((values) => {
          const text = values?.prompt?.trim();
          if (text) {
            void subagent.steer(text);
          }
        })
        .catch(() => {
          // user cancelled — no-op
        });
      return;
    }

    // Ctrl+C — abort streaming, or show quit dialog if messages exist
    if (key.ctrl && input === 'c') {
      if (isStreaming && abortController !== null) {
        abortController.abort();
        return;
      }
      // Open quit dialog (caught if dialog system isn't available)
      open('quit', {}).catch(() => {
        // Fall back to immediate exit
        onExit();
      });
      return;
    }

    // Ctrl+D — alternative quit
    if (key.ctrl && input === 'd') {
      open('quit', {}).catch(() => {
        onExit();
      });
      return;
    }

    // Escape — abort streaming (not just Ctrl+C)
    if (key.escape && !keybindState.leaderActive) {
      if (isStreaming && abortController !== null) {
        abortController.abort();
      }
      return;
    }

    // ? — open help dialog
    if (input === '?' && !keybindState.leaderActive) {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      open('help', { entries: getHelpEntries() }).catch(() => {});
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
          // Omit `modelGroups` so the picker subscribes to the live SAP AI
          // Core catalog and surfaces classified fetch errors (issue #1886)
          // instead of a hardcoded list.
          open('model-picker', {}).catch(() => {
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

        case 't':
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          open('theme', {}).catch(() => {});
          deactivateLeader();
          return;

        case 'f':
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          open('file-picker', {}).catch(() => {});
          deactivateLeader();
          return;

        case 's':
          open('session-list', {}).catch(() => {
            // user cancelled — no-op
          });
          deactivateLeader();
          return;

        case 'l':
          togglePage();
          deactivateLeader();
          return;

        case 'b':
          sidebar.toggle();
          deactivateLeader();
          return;

        case 'q':
          open('quit', {}).catch(() => {
            onExit();
          });
          deactivateLeader();
          return;

        case 'h':
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          open('help', { entries: getHelpEntries() }).catch(() => {});
          deactivateLeader();
          return;

        default:
          break;
      }
    }
  });
}
