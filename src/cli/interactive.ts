/**
 * Interactive REPL for streaming chat conversations
 * Features: real-time streaming, slash commands, session management, colors
 */

import * as readline from 'readline';
import { streamChat, resolveModelId, isAbortError } from '../core/streamingOrchestrator.js';
import { SessionManager } from '../core/sessionManager.js';
import { env } from '../config/env.js';
import { colors, c } from './utils/colors.js';

export interface InteractiveOptions {
  model?: string;
  autoRoute?: boolean;
  preferCheap?: boolean;
  session?: string;
  systemPrompt?: string;
}

interface ReplState {
  sessionManager: SessionManager;
  currentModel: string;
  autoRoute: boolean;
  preferCheap: boolean;
  systemPrompt?: string;
  abortController?: AbortController;
  isStreaming: boolean;
}

// Spinner animation frames
const spinnerFrames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];

/**
 * Print colored header
 */
function printHeader(state: ReplState): void {
  console.log();
  console.log(c('cyan', '╭─────────────────────────────────────────────────────╮'));
  console.log(
    c('cyan', '│') +
      c('bold', '          SAP Bot Orchestrator - Interactive         ') +
      c('cyan', '│')
  );
  console.log(c('cyan', '╰─────────────────────────────────────────────────────╯'));
  console.log();
  console.log(c('gray', `  Model: ${c('green', state.currentModel)}`));
  console.log(c('gray', `  Auto-route: ${state.autoRoute ? c('green', 'on') : c('red', 'off')}`));

  const session = state.sessionManager.getCurrentSession();
  if (session) {
    console.log(c('gray', `  Session: ${c('yellow', session.metadata.id.slice(0, 8))}`));
  }

  console.log();
  console.log(c('dim', '  Type /help for commands, /exit to quit'));
  console.log(c('dim', '  Press Ctrl+C during response to cancel'));
  console.log();
}

/**
 * Print help message
 */
function printHelp(): void {
  console.log();
  console.log(c('cyan', '  Available Commands:'));
  console.log();
  console.log(c('yellow', '  /help') + c('gray', '              - Show this help message'));
  console.log(c('yellow', '  /exit, /quit, /q') + c('gray', '   - Exit the REPL'));
  console.log(c('yellow', '  /model <id>') + c('gray', '        - Switch to a different model'));
  console.log(c('yellow', '  /models') + c('gray', '            - List available models'));
  console.log(c('yellow', '  /session') + c('gray', '           - Show current session info'));
  console.log(c('yellow', '  /sessions') + c('gray', '          - List all sessions'));
  console.log(c('yellow', '  /session load <id>') + c('gray', ' - Load a previous session'));
  console.log(c('yellow', '  /session new') + c('gray', '       - Start a new session'));
  console.log(c('yellow', '  /session export') + c('gray', '    - Export session to markdown'));
  console.log(c('yellow', '  /clear') + c('gray', '             - Clear screen'));
  console.log(c('yellow', '  /history') + c('gray', '           - Show conversation history'));
  console.log(c('yellow', '  /autoroute') + c('gray', '         - Toggle auto model routing'));
  console.log(c('yellow', '  /system <prompt>') + c('gray', '   - Set system prompt'));
  console.log(c('yellow', '  /tokens') + c('gray', '            - Show token usage stats'));
  console.log();
}

/**
 * Handle slash commands
 */
async function handleCommand(input: string, state: ReplState): Promise<boolean> {
  const parts = input.slice(1).split(/\s+/);
  const cmd = parts[0].toLowerCase();
  const args = parts.slice(1);

  switch (cmd) {
    case 'help':
    case 'h':
      printHelp();
      return true;

    case 'exit':
    case 'quit':
    case 'q':
      console.log(c('gray', '\n  Goodbye!\n'));
      process.exit(0);
      break; // eslint-disable-line no-fallthrough

    case 'model':
      if (args.length === 0) {
        console.log(c('gray', `\n  Current model: ${c('green', state.currentModel)}\n`));
      } else {
        state.currentModel = args.join(' ');
        console.log(c('green', `\n  Switched to model: ${state.currentModel}\n`));
      }
      return true;

    case 'models':
      try {
        const baseURL = env('SAP_PROXY_BASE_URL');
        const apiKey = env('SAP_PROXY_API_KEY');
        if (baseURL && apiKey) {
          const url = baseURL.replace(/\/$/, '') + '/models';
          const res = await fetch(url, { headers: { Authorization: `Bearer ${apiKey}` } });
          if (res.ok) {
            const data = (await res.json()) as { data?: Array<{ id: string }> };
            console.log(c('cyan', '\n  Available Models:\n'));
            const models = data?.data || [];
            models.forEach((m: any) => {
              const marker = m.id === state.currentModel ? c('green', ' ← current') : '';
              console.log(c('gray', `    • ${m.id}${marker}`));
            });
            console.log();
          } else {
            console.log(c('red', `\n  Failed to fetch models: ${res.status}\n`));
          }
        } else {
          console.log(c('yellow', '\n  Model listing requires SAP_PROXY_BASE_URL\n'));
        }
      } catch (e) {
        console.log(c('red', `\n  Error fetching models: ${e}\n`));
      }
      return true;

    case 'session':
      if (args.length === 0) {
        const session = state.sessionManager.getCurrentSession();
        if (session) {
          console.log(c('cyan', '\n  Current Session:\n'));
          console.log(c('gray', `    ID: ${session.metadata.id}`));
          console.log(c('gray', `    Title: ${session.metadata.title || 'Untitled'}`));
          console.log(c('gray', `    Messages: ${session.metadata.messageCount}`));
          console.log(c('gray', `    Tokens: ${session.metadata.totalTokens}`));
          console.log(c('gray', `    Model: ${session.metadata.modelId || 'N/A'}`));
          console.log();
        } else {
          console.log(c('yellow', '\n  No active session\n'));
        }
      } else if (args[0] === 'new') {
        state.sessionManager.clearSession();
        state.sessionManager.createSession(state.currentModel);
        const session = state.sessionManager.getCurrentSession();
        console.log(c('green', `\n  Created new session: ${session?.metadata.id.slice(0, 8)}\n`));
      } else if (args[0] === 'load' && args[1]) {
        const loaded = state.sessionManager.loadSession(args[1]);
        if (loaded) {
          console.log(c('green', `\n  Loaded session: ${loaded.metadata.id.slice(0, 8)}\n`));
          if (loaded.metadata.modelId) {
            state.currentModel = loaded.metadata.modelId;
          }
        } else {
          console.log(c('red', `\n  Session not found: ${args[1]}\n`));
        }
      } else if (args[0] === 'export') {
        const session = state.sessionManager.getCurrentSession();
        if (session) {
          const markdown = state.sessionManager.exportToMarkdown();
          console.log(c('cyan', '\n  Session Export:\n'));
          console.log(markdown);
        } else {
          console.log(c('yellow', '\n  No active session to export\n'));
        }
      }
      return true;

    case 'sessions': {
      const sessions = state.sessionManager.listSessions();
      if (sessions.length === 0) {
        console.log(c('yellow', '\n  No saved sessions\n'));
      } else {
        console.log(c('cyan', '\n  Saved Sessions:\n'));
        sessions.slice(0, 10).forEach((s) => {
          const date = new Date(s.updated).toLocaleDateString();
          const current = state.sessionManager.getCurrentSession()?.metadata.id === s.id;
          const marker = current ? c('green', ' ← current') : '';
          console.log(
            c('gray', `    ${s.id.slice(0, 8)} - ${s.title || 'Untitled'} (${date})${marker}`)
          );
        });
        if (sessions.length > 10) {
          console.log(c('dim', `\n    ... and ${sessions.length - 10} more`));
        }
        console.log();
      }
      return true;
    }

    case 'clear':
      console.clear();
      printHeader(state);
      return true;

    case 'history': {
      const history = state.sessionManager.getHistory();
      if (history.length === 0) {
        console.log(c('yellow', '\n  No conversation history\n'));
      } else {
        console.log(c('cyan', '\n  Conversation History:\n'));
        history.forEach((m) => {
          const role = m.role === 'user' ? c('blue', 'You') : c('green', 'AI');
          const preview = m.content.slice(0, 100) + (m.content.length > 100 ? '...' : '');
          console.log(c('gray', `    ${role}: ${preview}`));
        });
        console.log();
      }
      return true;
    }

    case 'autoroute':
      state.autoRoute = !state.autoRoute;
      console.log(c('green', `\n  Auto-routing: ${state.autoRoute ? 'enabled' : 'disabled'}\n`));
      return true;

    case 'system':
      if (args.length === 0) {
        if (state.systemPrompt) {
          console.log(c('gray', `\n  Current system prompt: ${state.systemPrompt}\n`));
        } else {
          console.log(c('yellow', '\n  No system prompt set\n'));
        }
      } else {
        state.systemPrompt = args.join(' ');
        console.log(c('green', `\n  System prompt set\n`));
      }
      return true;

    case 'tokens': {
      const stats = state.sessionManager.getSessionStats();
      if (stats) {
        console.log(c('cyan', '\n  Token Statistics:\n'));
        console.log(c('gray', `    Messages: ${stats.messageCount}`));
        console.log(c('gray', `    Total tokens: ${stats.totalTokens}`));
        console.log(c('gray', `    Avg per message: ${stats.avgTokensPerMessage}`));
        console.log();
      } else {
        console.log(c('yellow', '\n  No statistics available\n'));
      }
      return true;
    }

    default:
      console.log(c('red', `\n  Unknown command: /${cmd}`));
      console.log(c('gray', '  Type /help for available commands\n'));
      return true;
  }
}

/**
 * Start interactive REPL
 */
export async function startInteractive(options: InteractiveOptions = {}): Promise<void> {
  const state: ReplState = {
    sessionManager: new SessionManager(),
    currentModel: options.model || resolveModelId(),
    autoRoute: options.autoRoute || false,
    preferCheap: options.preferCheap || false,
    systemPrompt: options.systemPrompt,
    isStreaming: false,
  };

  // Load existing session if specified
  if (options.session) {
    const loaded = state.sessionManager.loadSession(options.session);
    if (!loaded) {
      console.error(c('red', `Session not found: ${options.session}`));
      process.exit(1);
    }
    if (loaded.metadata.modelId) {
      state.currentModel = loaded.metadata.modelId;
    }
  } else {
    // Create new session
    state.sessionManager.createSession(state.currentModel);
  }

  printHeader(state);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: c('blue', '❯ '),
    terminal: true,
  });

  // Handle Ctrl+C during streaming
  process.on('SIGINT', () => {
    if (state.isStreaming && state.abortController) {
      state.abortController.abort();
      console.log(c('yellow', '\n\n  [Cancelled]\n'));
      rl.prompt();
    } else {
      console.log(c('gray', '\n\n  Goodbye!\n'));
      process.exit(0);
    }
  });

  rl.prompt();

  rl.on('line', async (line) => {
    const input = line.trim();

    if (!input) {
      rl.prompt();
      return;
    }

    // Handle slash commands
    if (input.startsWith('/')) {
      await handleCommand(input, state);
      rl.prompt();
      return;
    }

    // Send message and stream response
    state.isStreaming = true;
    state.abortController = new AbortController();

    // Print assistant label
    process.stdout.write(c('green', '\n  AI: ') + c('dim', ''));

    let spinnerInterval: NodeJS.Timeout | null = null;
    let spinnerFrame = 0;
    let hasContent = false;

    try {
      // Start spinner
      spinnerInterval = setInterval(() => {
        if (!hasContent) {
          process.stdout.write(
            `\r  ${c('cyan', spinnerFrames[spinnerFrame])} ${c('dim', 'Thinking...')}`
          );
          spinnerFrame = (spinnerFrame + 1) % spinnerFrames.length;
        }
      }, 80);

      const generator = streamChat(input, {
        modelOverride: state.autoRoute ? undefined : state.currentModel,
        autoRoute: state.autoRoute,
        preferCheap: state.preferCheap,
        sessionManager: state.sessionManager,
        systemPrompt: state.systemPrompt,
        signal: state.abortController.signal,
      });

      let result;
      while (true) {
        const { value, done } = await generator.next();

        if (done) {
          result = value;
          break;
        }

        // Clear spinner on first content
        if (!hasContent && value.text) {
          if (spinnerInterval) {
            clearInterval(spinnerInterval);
            spinnerInterval = null;
          }
          process.stdout.write('\r' + ' '.repeat(30) + '\r'); // Clear spinner line
          process.stdout.write(c('green', '  AI: '));
          hasContent = true;
        }

        // Write chunk
        process.stdout.write(value.text);
      }

      // Print metadata
      console.log(colors.reset);
      if (result?.usage) {
        console.log(c('dim', `  [${result.modelUsed} | ${result.usage.total_tokens || 0} tokens]`));
      } else if (result?.modelUsed) {
        console.log(c('dim', `  [${result.modelUsed}]`));
      }
      if (result?.routingReason) {
        console.log(c('dim', `  [Routing: ${result.routingReason}]`));
      }
      console.log();
    } catch (err) {
      if (spinnerInterval) {
        clearInterval(spinnerInterval);
      }

      if (isAbortError(err)) {
        // Already handled in SIGINT
      } else {
        console.log();
        console.log(c('red', `\n  Error: ${err instanceof Error ? err.message : String(err)}\n`));
      }
    } finally {
      state.isStreaming = false;
      state.abortController = undefined;
    }

    rl.prompt();
  });

  rl.on('close', () => {
    console.log(c('gray', '\n  Goodbye!\n'));
    process.exit(0);
  });
}
