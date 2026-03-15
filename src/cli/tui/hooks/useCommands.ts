/**
 * Command registry for TUI slash commands.
 *
 * Replaces the monolithic switch statement in interactive.ts with a
 * declarative, extensible array of SlashCommand objects.  Phase 5 wires
 * up essential commands only; remaining commands will be migrated later.
 */

import { useCallback, useMemo } from 'react';
import { useApp } from 'ink';

import { useSession } from '../context/SessionContext.js';
import type { AgentName } from '../context/SessionContext.js';
import { useDialog } from '../context/DialogContext.js';
import type { DialogType } from '../context/DialogContext.js';
import { useTheme } from '../context/ThemeContext.js';
import type { ModelGroup } from '../dialogs/ModelPicker.js';
import type { AgentOption } from '../dialogs/AgentSelector.js';

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

export type CommandCategory = 'general' | 'session' | 'model' | 'git' | 'debug' | 'config';

export interface CommandContext {
  exit: () => void;
  sessionId: string;
  model: string;
  agent: string;
  setModel: (m: string) => void;
  setAgent: (a: AgentName) => void;
}

export interface SlashCommand {
  name: string;
  aliases?: string[];
  description: string;
  category: CommandCategory;
  execute: (args: string, context: CommandContext) => Promise<boolean>;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const AVAILABLE_AGENTS: AgentName[] = ['code', 'debug', 'plan', 'explore', 'orchestrator'];

const AGENT_DESCRIPTIONS: Record<AgentName, string> = {
  code: 'General-purpose coding agent',
  debug: 'Specialized for debugging and fixing issues',
  plan: 'Creates detailed implementation plans',
  explore: 'Fast codebase exploration and search',
  orchestrator: 'Coordinates work across multiple agents',
};

// ---------------------------------------------------------------------------
// BuildCommandsDeps
// ---------------------------------------------------------------------------

interface BuildCommandsDeps {
  openDialog: (type: DialogType, props: Record<string, unknown>) => Promise<unknown>;
  setTheme: (theme: 'dark' | 'light') => void;
}

// ---------------------------------------------------------------------------
// Command definitions
// ---------------------------------------------------------------------------

function buildCommands(deps: BuildCommandsDeps): SlashCommand[] {
  return [
    // /help ----------------------------------------------------------------
    {
      name: 'help',
      aliases: ['h'],
      description: 'Show available commands',
      category: 'general',
      execute: async (_args, _ctx) => {
        // In Phase 5 we simply return true to signal "handled".
        // The TUI layer can render a help panel in response.
        return true;
      },
    },

    // /exit, /quit, /q -----------------------------------------------------
    {
      name: 'exit',
      aliases: ['quit', 'q'],
      description: 'Exit the TUI',
      category: 'general',
      execute: async (_args, ctx) => {
        ctx.exit();
        return true;
      },
    },

    // /clear ---------------------------------------------------------------
    {
      name: 'clear',
      description: 'Clear messages',
      category: 'general',
      execute: async (_args, _ctx) => {
        // Handled by the TUI – the hook caller clears the message list.
        return true;
      },
    },

    // /model [id] ----------------------------------------------------------
    {
      name: 'model',
      description: 'Show or switch the current model',
      category: 'model',
      execute: async (args, ctx) => {
        const modelId = args.trim();
        if (modelId) {
          ctx.setModel(modelId);
          return true;
        }
        // No args — open ModelPicker dialog
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
        try {
          const chosen = await deps.openDialog('model-picker', {
            currentModel: ctx.model,
            modelGroups: STATIC_MODEL_GROUPS,
          });
          if (typeof chosen === 'string') {
            ctx.setModel(chosen);
          }
        } catch {
          // User cancelled dialog — no-op
        }
        return true;
      },
    },

    // /agent [name] --------------------------------------------------------
    {
      name: 'agent',
      description: 'Show or switch the current agent',
      category: 'session',
      execute: async (args, ctx) => {
        const requested = args.trim().replace(/^@/, '');
        if (requested && AVAILABLE_AGENTS.includes(requested as AgentName)) {
          ctx.setAgent(requested as AgentName);
          return true;
        }
        if (!requested) {
          // Open AgentSelector dialog
          const agentOptions: AgentOption[] = AVAILABLE_AGENTS.map((name) => ({
            name,
            color: '',
            description: AGENT_DESCRIPTIONS[name] ?? name,
          }));
          try {
            const chosen = await deps.openDialog('agent-selector', {
              currentAgent: ctx.agent,
              agents: agentOptions,
            });
            if (typeof chosen === 'string' && AVAILABLE_AGENTS.includes(chosen as AgentName)) {
              ctx.setAgent(chosen as AgentName);
            }
          } catch {
            // cancelled
          }
        }
        return true;
      },
    },

    // /status --------------------------------------------------------------
    {
      name: 'status',
      description: 'Show current session status',
      category: 'session',
      execute: async (_args, _ctx) => {
        // The TUI renders a status panel. Returning true signals "handled".
        return true;
      },
    },

    // /sessions ------------------------------------------------------------
    {
      name: 'sessions',
      description: 'Open session list',
      category: 'session',
      execute: async (_args, ctx) => {
        try {
          await deps.openDialog('session-list', {
            sessions: [],
            activeSessionId: ctx.sessionId,
          });
        } catch {
          // cancelled
        }
        return true;
      },
    },

    // /mcp -----------------------------------------------------------------
    {
      name: 'mcp',
      description: 'Manage MCP servers',
      category: 'config',
      execute: async (_args, _ctx) => {
        try {
          await deps.openDialog('mcp-manager', {
            servers: [],
          });
        } catch {
          // cancelled
        }
        return true;
      },
    },

    // /theme [dark|light] --------------------------------------------------
    {
      name: 'theme',
      description: 'Switch theme (dark/light)',
      category: 'config',
      execute: async (args, _ctx) => {
        const t = args.trim().toLowerCase();
        if (t === 'dark' || t === 'light') {
          deps.setTheme(t);
        }
        return true;
      },
    },
  ];
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export interface UseCommandsReturn {
  /** Returns true if the input was a slash command (handled), false otherwise. */
  handleCommand: (input: string) => Promise<boolean>;
  /** The full list of registered commands. */
  commands: SlashCommand[];
}

export function useCommands(): UseCommandsReturn {
  const { exit } = useApp();
  const session = useSession();
  const { open } = useDialog();
  const { setTheme } = useTheme();

  const commands = useMemo(
    () =>
      buildCommands({
        openDialog: open as BuildCommandsDeps['openDialog'],
        setTheme,
      }),
    [open, setTheme]
  );

  const handleCommand = useCallback(
    async (input: string): Promise<boolean> => {
      const trimmed = input.trim();

      // Not a slash command
      if (!trimmed.startsWith('/')) {
        return false;
      }

      const withoutSlash = trimmed.slice(1);
      const spaceIdx = withoutSlash.indexOf(' ');
      const cmdName = (
        spaceIdx === -1 ? withoutSlash : withoutSlash.slice(0, spaceIdx)
      ).toLowerCase();
      const args = spaceIdx === -1 ? '' : withoutSlash.slice(spaceIdx + 1);

      const ctx: CommandContext = {
        exit,
        sessionId: session.sessionId,
        model: session.model,
        agent: session.agent,
        setModel: session.setModel,
        setAgent: session.setAgent,
      };

      for (const cmd of commands) {
        if (cmd.name === cmdName || cmd.aliases?.includes(cmdName)) {
          return cmd.execute(args, ctx);
        }
      }

      // Unknown command — still counts as "handled" (prevents sending as chat)
      return true;
    },
    [commands, exit, session]
  );

  return { handleCommand, commands };
}
