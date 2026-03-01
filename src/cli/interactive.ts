/**
 * Interactive REPL for streaming chat conversations
 * Features: real-time streaming, slash commands, session management, colors
 */

import * as readline from 'readline';
import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs';
import { streamChat, resolveModelId, isAbortError } from '../core/streamingOrchestrator.js';
import { SessionManager } from '../core/sessionManager.js';
import { env } from '../config/env.js';
import { colors, c } from './utils/colors.js';
import { getCheckpointManager } from '../core/checkpoints.js';
import { compactConversation, estimateTokens } from '../core/compaction.js';
import { DoDChecker } from '../core/dodChecker.js';
import { getStageManager, type ConversationStage } from '../core/stageManager.js';
import { getPermissionManager, defaultRules } from '../permission/index.js';
import { getMcpClientManager, loadMcpConfig, type McpServerConfig } from '../mcp/index.js';
import { getDoctor } from '../doctor/index.js';
import { getCostTracker } from '../core/costTracker.js';
import { getMemoryManager } from '../core/memory.js';

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
  agent?: string;
  stage?: ConversationStage;
  thinkingMode?: boolean;
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
  console.log(c('cyan', '  Context & Session:'));
  console.log();
  console.log(
    c('yellow', '  /compact') + c('gray', '           - Trigger manual context compaction')
  );
  console.log(
    c('yellow', '  /context') + c('gray', '           - Show context usage (tokens used/available)')
  );
  console.log(
    c('yellow', '  /status') +
      c('gray', '            - Show current status (model, agent, session, stage)')
  );
  console.log(
    c('yellow', '  /diff') + c('gray', '              - Show files changed in current session')
  );
  console.log(c('yellow', '  /undo') + c('gray', '              - Undo last file change'));
  console.log(c('yellow', '  /redo') + c('gray', '              - Redo last undone change'));
  console.log(
    c('yellow', '  /fork [name]') + c('gray', '       - Fork current session with optional name')
  );
  console.log(c('yellow', '  /rename <name>') + c('gray', '     - Rename current session'));
  console.log();
  console.log(c('cyan', '  Agents & Stages:'));
  console.log();
  console.log(
    c('yellow', '  /agent <name>') +
      c('gray', '      - Switch to different agent (code, debug, plan)')
  );
  console.log(c('yellow', '  /stage <name>') + c('gray', '      - Switch development stage'));
  console.log(
    c('yellow', '  /dod') +
      c('gray', '               - Run Definition of Done checks for current stage')
  );
  console.log();
  console.log(c('cyan', '  Configuration & System:'));
  console.log();
  console.log(
    c('yellow', '  /config') + c('gray', '            - Show current configuration')
  );
  console.log(
    c('yellow', '  /config path') + c('gray', '       - Show config file paths')
  );
  console.log(
    c('yellow', '  /config set <k> <v>') + c('gray', '- Set a configuration value')
  );
  console.log(
    c('yellow', '  /permissions') + c('gray', '       - List permission rules')
  );
  console.log(
    c('yellow', '  /permissions reset') + c('gray', ' - Clear session permission grants')
  );
  console.log(
    c('yellow', '  /mcp') + c('gray', '               - List MCP servers')
  );
  console.log(
    c('yellow', '  /mcp connect <name>') + c('gray', '- Connect to MCP server')
  );
  console.log(
    c('yellow', '  /mcp disconnect <n>') + c('gray', '- Disconnect from MCP server')
  );
  console.log(
    c('yellow', '  /mcp status') + c('gray', '        - Show MCP connection status')
  );
  console.log(
    c('yellow', '  /think [on|off]') + c('gray', '    - Toggle extended thinking mode')
  );
  console.log(
    c('yellow', '  /doctor') + c('gray', '            - Run environment health checks')
  );
  console.log(
    c('yellow', '  /clear-history') + c('gray', '     - Clear conversation history')
  );
  console.log(
    c('yellow', '  /bug, /feedback') + c('gray', '    - Report issues and feedback')
  );
  console.log();
  console.log(c('cyan', '  Cost & Memory:'));
  console.log();
  console.log(
    c('yellow', '  /cost') + c('gray', '              - Show cost summary for current session')
  );
  console.log(
    c('yellow', '  /cost today') + c('gray', '        - Show today\'s cost summary')
  );
  console.log(
    c('yellow', '  /cost month') + c('gray', '        - Show this month\'s cost summary')
  );
  console.log(
    c('yellow', '  /cost all') + c('gray', '          - Show all-time cost summary')
  );
  console.log(
    c('yellow', '  /cost export') + c('gray', '       - Export cost history to CSV')
  );
  console.log(
    c('yellow', '  /remember <text>') + c('gray', '   - Save a memory (use #tags for categorization)')
  );
  console.log(
    c('yellow', '  /memory') + c('gray', '            - List all memories')
  );
  console.log(
    c('yellow', '  /memory search <q>') + c('gray', ' - Search memories by text or tag')
  );
  console.log(
    c('yellow', '  /memory stats') + c('gray', '      - Show memory statistics')
  );
  console.log(
    c('yellow', '  /memory export') + c('gray', '     - Export memories to JSON')
  );
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

    case 'compact': {
      const history = state.sessionManager.getHistory();
      if (history.length === 0) {
        console.log(c('yellow', '\n  No conversation to compact\n'));
        return true;
      }
      console.log(c('cyan', '\n  Compacting conversation...'));
      try {
        const { result } = await compactConversation(history);
        if (result.estimatedTokensSaved > 0) {
          console.log(c('green', `  Compacted: saved ~${result.estimatedTokensSaved} tokens`));
          console.log(
            c(
              'gray',
              `  Messages reduced from ${result.originalMessages} to ${result.compactedMessages}`
            )
          );
        } else {
          console.log(c('yellow', '  No compaction needed'));
        }
      } catch (err) {
        console.log(c('red', `  Compaction failed: ${err}`));
      }
      console.log();
      return true;
    }

    case 'context': {
      const history = state.sessionManager.getHistory();
      const content = history.map((m) => m.content).join('');
      const totalTokens = estimateTokens(content);
      const maxTokens = 128000; // Default context window
      const percent = ((totalTokens / maxTokens) * 100).toFixed(1);
      console.log(c('cyan', '\n  Context Usage:\n'));
      console.log(
        c(
          'gray',
          `    Tokens: ${totalTokens.toLocaleString()} / ${maxTokens.toLocaleString()} (${percent}%)`
        )
      );
      console.log(c('gray', `    Messages: ${history.length}`));
      if (parseFloat(percent) > 75) {
        console.log(c('yellow', '    Warning: Consider running /compact to free up context'));
      }
      console.log();
      return true;
    }

    case 'status': {
      const session = state.sessionManager.getCurrentSession();
      const stageManager = getStageManager();
      const currentStage = stageManager.getCurrentStage();
      console.log(c('cyan', '\n  Current Status:\n'));
      console.log(c('gray', `    Model: ${c('green', state.currentModel)}`));
      console.log(c('gray', `    Agent: ${c('yellow', state.agent || 'code')}`));
      console.log(
        c('gray', `    Session: ${c('yellow', session?.metadata.id.slice(0, 8) || 'none')}`)
      );
      console.log(
        c(
          'gray',
          `    Stage: ${c('yellow', currentStage?.stage || state.stage || 'implementation')}`
        )
      );
      console.log(
        c('gray', `    Auto-route: ${state.autoRoute ? c('green', 'on') : c('red', 'off')}`)
      );
      console.log();
      return true;
    }

    case 'diff': {
      const checkpointMgr = getCheckpointManager();
      const history = checkpointMgr.getHistory();
      if (history.length === 0) {
        console.log(c('yellow', '\n  No file changes in current session\n'));
        return true;
      }
      const uniqueFiles = Array.from(new Set(history.map((h) => h.filePath)));
      console.log(c('cyan', '\n  Files Changed:\n'));
      for (const filePath of uniqueFiles) {
        const fileChanges = history.filter((h) => h.filePath === filePath);
        console.log(c('gray', `    ${filePath} (${fileChanges.length} change(s))`));
      }
      console.log();
      return true;
    }

    case 'undo': {
      const checkpointMgr = getCheckpointManager();
      const undoResult = await checkpointMgr.undo();
      if (undoResult.success) {
        console.log(c('green', `\n  Undone changes to: ${undoResult.filePath}\n`));
      } else {
        console.log(c('yellow', `\n  ${undoResult.error || 'Nothing to undo'}\n`));
      }
      return true;
    }

    case 'redo': {
      const checkpointMgr = getCheckpointManager();
      const redoResult = await checkpointMgr.redo();
      if (redoResult.success) {
        console.log(c('green', `\n  Redone changes to: ${redoResult.filePath}\n`));
      } else {
        console.log(c('yellow', `\n  ${redoResult.error || 'Nothing to redo'}\n`));
      }
      return true;
    }

    case 'fork': {
      const session = state.sessionManager.getCurrentSession();
      if (!session) {
        console.log(c('yellow', '\n  No active session to fork\n'));
        return true;
      }
      const forkName = args[0] || `fork-${Date.now()}`;
      // Create a new session with the same history
      state.sessionManager.createSession(state.currentModel);
      const newSession = state.sessionManager.getCurrentSession();
      if (newSession) {
        newSession.metadata.title = forkName;
        console.log(
          c('green', `\n  Forked session: ${forkName} (${newSession.metadata.id.slice(0, 8)})\n`)
        );
      }
      return true;
    }

    case 'rename': {
      if (args.length === 0) {
        console.log(c('red', '\n  Usage: /rename <name>\n'));
        return true;
      }
      const session = state.sessionManager.getCurrentSession();
      if (!session) {
        console.log(c('yellow', '\n  No active session to rename\n'));
        return true;
      }
      const newName = args.join(' ');
      session.metadata.title = newName;
      console.log(c('green', `\n  Session renamed to: ${newName}\n`));
      return true;
    }

    case 'agent': {
      const availableAgents = ['code', 'debug', 'plan', 'explore', 'orchestrator'];
      if (args.length === 0) {
        console.log(c('cyan', '\n  Available Agents:\n'));
        for (const agent of availableAgents) {
          const marker = agent === (state.agent || 'code') ? c('green', ' <- current') : '';
          console.log(c('gray', `    @${agent}${marker}`));
        }
        console.log();
      } else {
        const requestedAgent = args[0].replace('@', '');
        if (availableAgents.includes(requestedAgent)) {
          state.agent = requestedAgent;
          console.log(c('green', `\n  Switched to agent: @${requestedAgent}\n`));
        } else {
          console.log(c('red', `\n  Unknown agent: ${args[0]}`));
          console.log(c('gray', `  Available: ${availableAgents.join(', ')}\n`));
        }
      }
      return true;
    }

    case 'stage': {
      const stageManager = getStageManager();
      const stages = stageManager.listStages();
      if (args.length === 0) {
        const currentStage = stageManager.getCurrentStage();
        console.log(c('cyan', '\n  Available Stages:\n'));
        for (const stage of stages) {
          const marker = stage.type === currentStage?.stage ? c('green', ' <- current') : '';
          console.log(c('gray', `    ${stage.type}: ${stage.name}${marker}`));
        }
        console.log();
      } else {
        const requestedStage = args[0] as ConversationStage;
        const validStages = stages.map((s) => s.type);
        if (validStages.includes(requestedStage)) {
          stageManager.setStage(requestedStage);
          state.stage = requestedStage;
          const stageDef = stageManager.getStageDefinition(requestedStage);
          console.log(c('green', `\n  Switched to stage: ${stageDef.name}\n`));
          console.log(c('dim', `  ${stageDef.description}\n`));
        } else {
          console.log(c('red', `\n  Unknown stage: ${args[0]}`));
          console.log(c('gray', `  Available: ${validStages.join(', ')}\n`));
        }
      }
      return true;
    }

    case 'dod': {
      const stageManager = getStageManager();
      const currentStage = stageManager.getCurrentStage()?.stage || state.stage || 'implementation';
      const dodChecker = new DoDChecker();
      console.log(c('cyan', `\n  Running DoD checks for stage: ${currentStage}\n`));
      const report = dodChecker.runChecks(currentStage);
      for (const { check, result } of report.results) {
        const status = result.passed ? c('green', '  ✓') : c('red', '  ✗');
        console.log(`${status} ${check}`);
        if (!result.passed && result.suggestion) {
          console.log(c('dim', `      ${result.suggestion}`));
        }
      }
      console.log();
      console.log(c('gray', `  Summary: ${report.passed}/${report.totalChecks} passed`));
      console.log();
      return true;
    }

    case 'config': {
      const configDir = path.join(os.homedir(), '.alexi');
      const configPath = path.join(configDir, 'config.json');

      if (args.length === 0 || args[0] === 'show') {
        console.log(c('cyan', '\n  Configuration:\n'));
        try {
          if (fs.existsSync(configPath)) {
            const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
            for (const [key, value] of Object.entries(config)) {
              console.log(c('gray', `    ${key}: ${c('green', String(value))}`));
            }
          } else {
            console.log(c('yellow', '    No config file found. Using defaults.'));
          }
        } catch (err) {
          console.log(c('red', `    Error reading config: ${err}`));
        }
        console.log();
      } else if (args[0] === 'path') {
        console.log(c('cyan', '\n  Config Paths:\n'));
        console.log(c('gray', `    Config dir:  ${configDir}`));
        console.log(c('gray', `    Config file: ${configPath}`));
        console.log(c('gray', `    MCP servers: ${path.join(configDir, 'mcp-servers.json')}`));
        console.log(c('gray', `    Sessions:    ${path.join(configDir, 'sessions')}`));
        console.log();
      } else if (args[0] === 'set' && args.length >= 3) {
        const key = args[1];
        const value = args.slice(2).join(' ');
        try {
          if (!fs.existsSync(configDir)) {
            fs.mkdirSync(configDir, { recursive: true });
          }
          let config: Record<string, unknown> = {};
          if (fs.existsSync(configPath)) {
            config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
          }
          // Try to parse as JSON for booleans/numbers
          try {
            config[key] = JSON.parse(value);
          } catch {
            config[key] = value;
          }
          fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
          console.log(c('green', `\n  Set ${key} = ${value}\n`));
        } catch (err) {
          console.log(c('red', `\n  Error saving config: ${err}\n`));
        }
      } else {
        console.log(c('yellow', '\n  Usage: /config [show|path|set <key> <value>]\n'));
      }
      return true;
    }

    case 'permissions': {
      const permManager = getPermissionManager();

      if (args.length === 0 || args[0] === 'list') {
        console.log(c('cyan', '\n  Permission Rules:\n'));
        const rules = permManager.getRules();
        for (const rule of rules) {
          const status =
            rule.decision === 'allow'
              ? c('green', 'ALLOW')
              : rule.decision === 'deny'
                ? c('red', 'DENY')
                : c('yellow', 'ASK');
          const tools = rule.tools?.join(', ') || '*';
          const paths = rule.paths?.join(', ') || '*';
          console.log(c('gray', `    ${status} ${rule.name || rule.id || 'rule'}`));
          console.log(c('dim', `          tools: ${tools}, paths: ${paths}`));
        }
        console.log();
      } else if (args[0] === 'reset') {
        // Reset by clearing session grants
        permManager.clearSession();
        console.log(c('green', '\n  Permission session grants cleared\n'));
      } else {
        console.log(c('yellow', '\n  Usage: /permissions [list|reset]\n'));
      }
      return true;
    }

    case 'mcp': {
      const mcpManager = getMcpClientManager();

      if (args.length === 0 || args[0] === 'list') {
        console.log(c('cyan', '\n  MCP Servers:\n'));
        const configDir = path.join(os.homedir(), '.alexi');
        const mcpConfigPath = path.join(configDir, 'mcp-servers.json');
        try {
          if (fs.existsSync(mcpConfigPath)) {
            const mcpConfig = JSON.parse(fs.readFileSync(mcpConfigPath, 'utf-8'));
            const servers = mcpConfig.servers || [];
            if (!Array.isArray(servers) || servers.length === 0) {
              console.log(c('yellow', '    No MCP servers configured'));
            } else {
              const statusList = mcpManager.getStatus();
              for (const server of servers as McpServerConfig[]) {
                const connStatus = statusList.find((s) => s.name === server.name);
                const isConnected = connStatus?.status === 'connected';
                const statusIcon = isConnected ? c('green', '●') : c('red', '○');
                const enabledStr = server.enabled ? '' : c('dim', ' (disabled)');
                console.log(
                  c('gray', `    ${statusIcon} ${server.name}: ${server.command || 'unknown'}${enabledStr}`)
                );
              }
            }
          } else {
            console.log(c('yellow', '    No MCP config file found'));
            console.log(c('dim', `    Create ${mcpConfigPath} to add servers`));
          }
        } catch (err) {
          console.log(c('red', `    Error reading MCP config: ${err}`));
        }
        console.log();
      } else if (args[0] === 'connect' && args[1]) {
        const serverName = args[1];
        console.log(c('cyan', `\n  Connecting to ${serverName}...`));
        try {
          const config = loadMcpConfig();
          const serverConfig = config.servers.find((s) => s.name === serverName);
          if (!serverConfig) {
            console.log(c('red', `  Server '${serverName}' not found in config\n`));
          } else {
            const result = await mcpManager.connect(serverConfig);
            if (result.status === 'connected') {
              console.log(c('green', `  Connected to ${serverName} (${result.tools.length} tools)\n`));
            } else {
              console.log(c('red', `  Connection failed: ${result.error || 'unknown error'}\n`));
            }
          }
        } catch (err) {
          console.log(c('red', `  Connection failed: ${err}\n`));
        }
      } else if (args[0] === 'disconnect' && args[1]) {
        const serverName = args[1];
        try {
          await mcpManager.disconnect(serverName);
          console.log(c('green', `\n  Disconnected from ${serverName}\n`));
        } catch (err) {
          console.log(c('red', `\n  Disconnect failed: ${err}\n`));
        }
      } else if (args[0] === 'status') {
        console.log(c('cyan', '\n  MCP Connection Status:\n'));
        const statusList = mcpManager.getStatus();
        if (statusList.length === 0) {
          console.log(c('yellow', '    No servers registered'));
        } else {
          for (const server of statusList) {
            const statusIcon =
              server.status === 'connected'
                ? c('green', '●')
                : server.status === 'connecting'
                  ? c('yellow', '◐')
                  : c('red', '○');
            console.log(c('gray', `    ${statusIcon} ${server.name} (${server.tools} tools) - ${server.status}`));
            if (server.error) {
              console.log(c('dim', `        Error: ${server.error}`));
            }
          }
        }
        console.log();
      } else {
        console.log(c('yellow', '\n  Usage: /mcp [list|connect <name>|disconnect <name>|status]\n'));
      }
      return true;
    }

    case 'think': {
      if (args.length === 0) {
        const status = state.thinkingMode ? c('green', 'on') : c('red', 'off');
        console.log(c('gray', `\n  Extended thinking mode: ${status}\n`));
      } else if (args[0] === 'on') {
        state.thinkingMode = true;
        console.log(c('green', '\n  Extended thinking mode enabled\n'));
        console.log(c('dim', '  The AI will show detailed reasoning for complex tasks\n'));
      } else if (args[0] === 'off') {
        state.thinkingMode = false;
        console.log(c('yellow', '\n  Extended thinking mode disabled\n'));
      } else {
        console.log(c('yellow', '\n  Usage: /think [on|off]\n'));
      }
      return true;
    }

    case 'bug':
    case 'feedback': {
      console.log(c('cyan', '\n  Report Issues & Feedback:\n'));
      console.log(c('gray', '    GitHub Issues: https://github.com/user/alexi/issues'));
      console.log(c('gray', '    Discussions:   https://github.com/user/alexi/discussions'));
      console.log();
      console.log(c('dim', '  Please include:'));
      console.log(c('dim', '    - Steps to reproduce'));
      console.log(c('dim', '    - Expected vs actual behavior'));
      console.log(c('dim', '    - Alexi version (run: alexi --version)'));
      console.log();
      return true;
    }

    case 'doctor': {
      console.log(c('cyan', '\n  Running health checks...\n'));
      try {
        const doctor = getDoctor();
        const results = await doctor.runAll();
        for (const result of results) {
          const statusIcon =
            result.status === 'pass'
              ? c('green', '✓')
              : result.status === 'warn'
                ? c('yellow', '⚠')
                : c('red', '✗');
          console.log(`  ${statusIcon} ${result.name}`);
          if (result.status !== 'pass' && result.message) {
            console.log(c('dim', `      ${result.message}`));
          }
          if (result.fix) {
            console.log(c('dim', `      Fix: ${result.fix}`));
          }
        }
        const summary = doctor.getSummary(results);
        console.log();
        console.log(
          c(
            'gray',
            `  Summary: ${summary.passed}/${results.length} passed${summary.warned ? `, ${summary.warned} warnings` : ''}`
          )
        );
      } catch (err) {
        console.log(c('red', `  Doctor failed: ${err}`));
      }
      console.log();
      return true;
    }

    case 'clear-history': {
      const history = state.sessionManager.getHistory();
      if (history.length === 0) {
        console.log(c('yellow', '\n  No history to clear\n'));
      } else {
        const count = history.length;
        state.sessionManager.clearSession();
        state.sessionManager.createSession(state.currentModel);
        console.log(c('green', `\n  Cleared ${count} messages from history\n`));
      }
      return true;
    }

    case 'cost': {
      const costTracker = getCostTracker();
      const subCmd = args[0]?.toLowerCase();

      if (!subCmd || subCmd === 'today') {
        const summary = costTracker.getTodaySummary();
        console.log(c('cyan', '\n  Today\'s API Costs:\n'));
        if (summary.callCount === 0) {
          console.log(c('yellow', '    No API calls recorded today'));
        } else {
          console.log(c('gray', `    Total Cost:    ${c('green', costTracker.formatCost(summary.totalCost))}`));
          console.log(c('gray', `    API Calls:     ${summary.callCount}`));
          console.log(c('gray', `    Input Tokens:  ${summary.totalInputTokens.toLocaleString()}`));
          console.log(c('gray', `    Output Tokens: ${summary.totalOutputTokens.toLocaleString()}`));
        }
        console.log();
      } else if (subCmd === 'month') {
        const summary = costTracker.getMonthSummary();
        console.log(c('cyan', '\n  This Month\'s API Costs:\n'));
        if (summary.callCount === 0) {
          console.log(c('yellow', '    No API calls recorded this month'));
        } else {
          console.log(c('gray', `    Total Cost:    ${c('green', costTracker.formatCost(summary.totalCost))}`));
          console.log(c('gray', `    API Calls:     ${summary.callCount}`));
          console.log(c('gray', `    Input Tokens:  ${summary.totalInputTokens.toLocaleString()}`));
          console.log(c('gray', `    Output Tokens: ${summary.totalOutputTokens.toLocaleString()}`));
          console.log();
          console.log(c('cyan', '    By Model:'));
          for (const [model, data] of Object.entries(summary.byModel)) {
            console.log(c('gray', `      ${model}: ${costTracker.formatCost(data.cost)} (${data.calls} calls)`));
          }
        }
        console.log();
      } else if (subCmd === 'all') {
        const summary = costTracker.getAllTimeSummary();
        console.log(c('cyan', '\n  All-Time API Costs:\n'));
        if (summary.callCount === 0) {
          console.log(c('yellow', '    No API calls recorded'));
        } else {
          console.log(c('gray', `    Total Cost:    ${c('green', costTracker.formatCost(summary.totalCost))}`));
          console.log(c('gray', `    API Calls:     ${summary.callCount}`));
          console.log(c('gray', `    Input Tokens:  ${summary.totalInputTokens.toLocaleString()}`));
          console.log(c('gray', `    Output Tokens: ${summary.totalOutputTokens.toLocaleString()}`));
          console.log();
          console.log(c('cyan', '    By Model:'));
          for (const [model, data] of Object.entries(summary.byModel)) {
            console.log(c('gray', `      ${model}: ${costTracker.formatCost(data.cost)} (${data.calls} calls)`));
          }
          console.log();
          console.log(c('cyan', '    Recent Days:'));
          const dates = Object.entries(summary.byDate).slice(-7);
          for (const [date, cost] of dates) {
            console.log(c('gray', `      ${date}: ${costTracker.formatCost(cost)}`));
          }
        }
        console.log();
      } else if (subCmd === 'clear') {
        costTracker.clearHistory();
        console.log(c('green', '\n  Cost history cleared\n'));
      } else if (subCmd === 'export') {
        const csv = costTracker.exportToCsv();
        const exportPath = path.join(os.homedir(), '.alexi', 'cost-export.csv');
        fs.writeFileSync(exportPath, csv);
        console.log(c('green', `\n  Cost history exported to: ${exportPath}\n`));
      } else {
        console.log(c('yellow', '\n  Usage: /cost [today|month|all|clear|export]\n'));
      }
      return true;
    }

    case 'memory': {
      const memoryManager = getMemoryManager();
      const subCmd = args[0]?.toLowerCase();

      if (!subCmd || subCmd === 'list') {
        const memories = memoryManager.search({ limit: 10, sortBy: 'updated' });
        console.log(c('cyan', '\n  Stored Memories:\n'));
        if (memories.length === 0) {
          console.log(c('yellow', '    No memories stored'));
          console.log(c('dim', '    Use /remember <text> to add a memory'));
        } else {
          for (const m of memories) {
            const date = new Date(m.updated).toLocaleDateString();
            const preview = m.content.slice(0, 60) + (m.content.length > 60 ? '...' : '');
            const tags = m.tags?.length ? c('dim', ` [${m.tags.join(', ')}]`) : '';
            console.log(c('gray', `    ${c('yellow', m.id.slice(0, 6))} ${preview}${tags}`));
            console.log(c('dim', `         Updated: ${date}`));
          }
          const stats = memoryManager.getStats();
          if (stats.count > 10) {
            console.log(c('dim', `\n    ... and ${stats.count - 10} more memories`));
          }
        }
        console.log();
      } else if (subCmd === 'search' && args[1]) {
        const query = args.slice(1).join(' ');
        const memories = memoryManager.search({ query, limit: 10 });
        console.log(c('cyan', `\n  Search Results for "${query}":\n`));
        if (memories.length === 0) {
          console.log(c('yellow', '    No matching memories found'));
        } else {
          for (const m of memories) {
            const preview = m.content.slice(0, 60) + (m.content.length > 60 ? '...' : '');
            console.log(c('gray', `    ${c('yellow', m.id.slice(0, 6))} ${preview}`));
          }
        }
        console.log();
      } else if (subCmd === 'delete' && args[1]) {
        const id = args[1];
        // Try to find memory by partial ID
        const memories = memoryManager.getAll();
        const match = memories.find((m) => m.id.startsWith(id));
        if (match) {
          memoryManager.delete(match.id);
          console.log(c('green', `\n  Deleted memory: ${match.id.slice(0, 6)}\n`));
        } else {
          console.log(c('red', `\n  Memory not found: ${id}\n`));
        }
      } else if (subCmd === 'clear') {
        const count = memoryManager.clearAll();
        console.log(c('green', `\n  Cleared ${count} memories\n`));
      } else if (subCmd === 'stats') {
        const stats = memoryManager.getStats();
        console.log(c('cyan', '\n  Memory Statistics:\n'));
        console.log(c('gray', `    Total Memories: ${stats.count}`));
        console.log(c('gray', `    Total Size:     ${(stats.totalSize / 1024).toFixed(1)} KB`));
        if (stats.tags.length > 0) {
          console.log(c('gray', `    Tags:           ${stats.tags.join(', ')}`));
        }
        if (stats.oldest) {
          console.log(c('gray', `    Oldest:         ${new Date(stats.oldest).toLocaleDateString()}`));
        }
        if (stats.newest) {
          console.log(c('gray', `    Newest:         ${new Date(stats.newest).toLocaleDateString()}`));
        }
        console.log();
      } else if (subCmd === 'export') {
        const json = memoryManager.exportToJson();
        const exportPath = path.join(os.homedir(), '.alexi', 'memories-export.json');
        fs.writeFileSync(exportPath, json);
        console.log(c('green', `\n  Memories exported to: ${exportPath}\n`));
      } else {
        console.log(c('yellow', '\n  Usage: /memory [list|search <query>|delete <id>|clear|stats|export]\n'));
      }
      return true;
    }

    case 'remember': {
      if (args.length === 0) {
        console.log(c('yellow', '\n  Usage: /remember <text to remember> [#tag1 #tag2]\n'));
        console.log(c('dim', '  Example: /remember User prefers TypeScript #preferences'));
        return true;
      }

      const memoryManager = getMemoryManager();

      // Parse content and tags
      const fullText = args.join(' ');
      const tagMatches = fullText.match(/#\w+/g) || [];
      const tags = tagMatches.map((t) => t.slice(1));
      const content = fullText.replace(/#\w+/g, '').trim();

      if (!content) {
        console.log(c('red', '\n  Memory content cannot be empty\n'));
        return true;
      }

      const entry = memoryManager.add(content, {
        tags: tags.length > 0 ? tags : undefined,
        source: state.sessionManager.getCurrentSession()?.metadata.id,
      });

      console.log(c('green', `\n  Memory saved: ${entry.id.slice(0, 6)}`));
      if (tags.length > 0) {
        console.log(c('dim', `  Tags: ${tags.join(', ')}`));
      }
      console.log();
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
