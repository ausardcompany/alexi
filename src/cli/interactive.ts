/**
 * Interactive REPL for streaming chat conversations
 * Features: real-time streaming, slash commands, session management, colors
 */

import * as readline from 'readline';
import { streamChat, resolveModelId, isAbortError } from '../core/streamingOrchestrator.js';
import { SessionManager } from '../core/sessionManager.js';
import { getWorkflowManager } from '../core/workflowManager.js';
import { DoDChecker } from '../core/dodChecker.js';
import { getMcpClientManager } from '../mcp/client.js';
import { loadMcpConfig } from '../mcp/config.js';
import { getSkillRegistry, type Skill } from '../skill/index.js';
import { registerBuiltInSkills } from '../skill/skills/index.js';
import { env } from '../config/env.js';
import type { ConversationStage } from '../core/stageManager.js';
import { getUndoManager, performUndo, performRedo, getUndoStackInfo } from '../undo/index.js';
import { getPlanModeManager, isPlanMode, getPlanModeIndicator, ModeChanged } from '../plan/index.js';
import { getCommandRegistry, executeCommand, listCommands, registerBuiltInCommands } from '../command/index.js';
import { shareSession, exportSessionToFile, importSessionFromFile, getShareManager } from '../share/index.js';
import { initProject, analyzeProject, formatAnalysisForCLI, formatInitResultForCLI } from '../init/index.js';
import { getCompactionManager, shouldCompact, compactConversation, estimateConversationTokens } from '../compaction/index.js';
import { loadPluginsFromDefaultLocations, listPlugins, enablePlugin, disablePlugin, getPluginManager } from '../plugin/index.js';
import { getDoctor } from '../doctor/index.js';
import { getLogViewer } from '../log/viewer.js';
import type { LogLevel } from '../log/index.js';
import { getProfileManager } from '../profile/index.js';
import { getSoundManager } from '../sound/index.js';
import { checkForUpdates } from '../update/index.js';

// Initialize skills
registerBuiltInSkills();

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  italic: '\x1b[3m',
  
  // Foreground
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  gray: '\x1b[90m',
  
  // Background
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
};

function c(color: keyof typeof colors, text: string): string {
  return `${colors[color]}${text}${colors.reset}`;
}

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
  activeSkill?: Skill;
  abortController?: AbortController;
  isStreaming: boolean;
}

// Spinner animation frames
const spinnerFrames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];

/**
 * Print colored header
 */
function printHeader(state: ReplState): void {
  const modeIndicator = getPlanModeIndicator();
  const modeColor = isPlanMode() ? 'yellow' : 'green';
  
  console.log();
  console.log(c('cyan', '╭─────────────────────────────────────────────────────╮'));
  console.log(c('cyan', '│') + c('bold', '                 Alexi - Interactive                  ') + c('cyan', '│'));
  console.log(c('cyan', '╰─────────────────────────────────────────────────────╯'));
  console.log();
  console.log(c('gray', `  Mode: ${c(modeColor, modeIndicator)}`));
  console.log(c('gray', `  Model: ${c('green', state.currentModel)}`));
  console.log(c('gray', `  Auto-route: ${state.autoRoute ? c('green', 'on') : c('red', 'off')}`));
  
  const session = state.sessionManager.getCurrentSession();
  if (session) {
    console.log(c('gray', `  Session: ${c('yellow', session.metadata.id.slice(0, 8))}`));
  }
  if (state.activeSkill) {
    console.log(c('gray', `  Skill: ${c('magenta', state.activeSkill.name)}`));
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
  console.log(c('bold', '  Chat & Session:'));
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
  console.log(c('bold', '  Workflow (DDD):'));
  console.log(c('yellow', '  /workflow') + c('gray', '          - Show workflow status'));
  console.log(c('yellow', '  /workflow start') + c('gray', '    - Start new workflow'));
  console.log(c('yellow', '  /workflow next') + c('gray', '     - Move to next stage'));
  console.log(c('yellow', '  /workflow reset') + c('gray', '    - Reset workflow'));
  console.log(c('yellow', '  /prompt') + c('gray', '            - Show stage system prompt'));
  console.log(c('yellow', '  /dod') + c('gray', '               - Run DoD checks'));
  console.log();
  console.log(c('bold', '  MCP (External Tools):'));
  console.log(c('yellow', '  /mcp') + c('gray', '               - Show MCP status'));
  console.log(c('yellow', '  /mcp connect [name]') + c('gray', '- Connect to MCP server(s)'));
  console.log(c('yellow', '  /mcp tools') + c('gray', '         - List available MCP tools'));
  console.log(c('yellow', '  /mcp call <tool>') + c('gray', '   - Call an MCP tool'));
  console.log();
  console.log(c('bold', '  Skills (AI Behaviors):'));
  console.log(c('yellow', '  /skills') + c('gray', '            - List available skills'));
  console.log(c('yellow', '  /skill <name>') + c('gray', '      - Activate a skill'));
  console.log(c('yellow', '  /skill off') + c('gray', '         - Deactivate current skill'));
  console.log(c('yellow', '  /skill show <name>') + c('gray', ' - Show skill details'));
  console.log();
  console.log(c('bold', '  Undo/Redo:'));
  console.log(c('yellow', '  /undo') + c('gray', '              - Undo last file changes'));
  console.log(c('yellow', '  /redo') + c('gray', '              - Redo previously undone changes'));
  console.log(c('yellow', '  /history-undo') + c('gray', '      - Show undo/redo stack info'));
  console.log();
  console.log(c('bold', '  Mode:'));
  console.log(c('yellow', '  /plan') + c('gray', '              - Toggle plan mode (read-only analysis)'));
  console.log(c('yellow', '  /mode') + c('gray', '              - Show current mode'));
  console.log();
  console.log(c('bold', '  Custom Commands:'));
  console.log(c('yellow', '  /cmd <name> [args]') + c('gray', ' - Execute a custom command'));
  console.log(c('yellow', '  /commands') + c('gray', '          - List available custom commands'));
  console.log();
  console.log(c('bold', '  Session Sharing:'));
  console.log(c('yellow', '  /share') + c('gray', '             - Share current session (copy to clipboard)'));
  console.log(c('yellow', '  /share file <path>') + c('gray', ' - Export session to file'));
  console.log(c('yellow', '  /import <path>') + c('gray', '     - Import session from file'));
  console.log();
  console.log(c('bold', '  Project:'));
  console.log(c('yellow', '  /init') + c('gray', '              - Initialize project (analyze & generate AI_CONTEXT.md)'));
  console.log(c('yellow', '  /analyze') + c('gray', '           - Analyze project structure'));
  console.log();
  console.log(c('bold', '  Context:'));
  console.log(c('yellow', '  /compact') + c('gray', '           - Compact conversation history'));
  console.log(c('yellow', '  /tokens') + c('gray', '            - Show token usage stats'));
  console.log();
  console.log(c('bold', '  Plugins:'));
  console.log(c('yellow', '  /plugins') + c('gray', '           - List loaded plugins'));
  console.log(c('yellow', '  /plugin enable <n>') + c('gray', ' - Enable a plugin'));
  console.log(c('yellow', '  /plugin disable <n>') + c('gray', '- Disable a plugin'));
  console.log();
  console.log(c('bold', '  System:'));
  console.log(c('yellow', '  /doctor') + c('gray', '            - Run health checks'));
  console.log(c('yellow', '  /log, /logs [level]') + c('gray', '- Show recent log entries'));
  console.log(c('yellow', '  /profile') + c('gray', '           - List profiles'));
  console.log(c('yellow', '  /profile switch <n>') + c('gray', '- Switch to a profile'));
  console.log(c('yellow', '  /profile show <n>') + c('gray', '  - Show profile details'));
  console.log(c('yellow', '  /sound') + c('gray', '             - Show sound status'));
  console.log(c('yellow', '  /sound on|off') + c('gray', '      - Enable/disable sounds'));
  console.log(c('yellow', '  /update') + c('gray', '            - Check for updates'));
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
        const baseURL = env("SAP_PROXY_BASE_URL");
        const apiKey = env("SAP_PROXY_API_KEY");
        if (baseURL && apiKey) {
          const url = baseURL.replace(/\/$/, "") + "/models";
          const res = await fetch(url, { headers: { Authorization: `Bearer ${apiKey}` } });
          if (res.ok) {
            const data = await res.json() as { data?: Array<{ id: string }> };
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

    case 'sessions':
      const sessions = state.sessionManager.listSessions();
      if (sessions.length === 0) {
        console.log(c('yellow', '\n  No saved sessions\n'));
      } else {
        console.log(c('cyan', '\n  Saved Sessions:\n'));
        sessions.slice(0, 10).forEach(s => {
          const date = new Date(s.updated).toLocaleDateString();
          const current = state.sessionManager.getCurrentSession()?.metadata.id === s.id;
          const marker = current ? c('green', ' ← current') : '';
          console.log(c('gray', `    ${s.id.slice(0, 8)} - ${s.title || 'Untitled'} (${date})${marker}`));
        });
        if (sessions.length > 10) {
          console.log(c('dim', `\n    ... and ${sessions.length - 10} more`));
        }
        console.log();
      }
      return true;

    case 'clear':
      console.clear();
      printHeader(state);
      return true;

    case 'history':
      const history = state.sessionManager.getHistory();
      if (history.length === 0) {
        console.log(c('yellow', '\n  No conversation history\n'));
      } else {
        console.log(c('cyan', '\n  Conversation History:\n'));
        history.forEach(m => {
          const role = m.role === 'user' ? c('blue', 'You') : c('green', 'AI');
          const preview = m.content.slice(0, 100) + (m.content.length > 100 ? '...' : '');
          console.log(c('gray', `    ${role}: ${preview}`));
        });
        console.log();
      }
      return true;

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

    case 'tokens':
      const tokenHistory = state.sessionManager.getHistory();
      const estimatedTokens = estimateConversationTokens(tokenHistory);
      const needsCompact = shouldCompact(tokenHistory);
      
      console.log(c('cyan', '\n  Token Statistics:\n'));
      console.log(c('gray', `    Messages: ${tokenHistory.length}`));
      console.log(c('gray', `    Estimated tokens: ${estimatedTokens}`));
      console.log(c('gray', `    Needs compaction: ${needsCompact ? c('yellow', 'yes') : c('green', 'no')}`));
      console.log();
      return true;

    // ============ Workflow Commands ============
    case 'workflow':
    case 'wf':
      const wfManager = getWorkflowManager();
      if (args.length === 0 || args[0] === 'status') {
        const wfState = wfManager.getState();
        if (!wfState) {
          console.log(c('yellow', '\\n  No active workflow. Use /workflow start to begin.\\n'));
        } else {
          console.log(c('cyan', '\\n  Workflow Status:\\n'));
          console.log(c('gray', `    Stage: ${c('green', wfState.stageName)} (${wfState.currentStage})`));
          console.log(c('gray', `    Stage #: ${wfState.stageNumber}`));
          console.log(c('gray', `    DoD: ${wfState.dodPassed ? c('green', 'passed') : c('red', 'not passed')}`));
          console.log(c('gray', `    Artifacts: ${wfState.artifacts.length}`));
          console.log(c('gray', `    History: ${wfState.history.length} completed stages`));
          console.log();
        }
      } else if (args[0] === 'start') {
        const validStages: ConversationStage[] = ['architecture', 'planning', 'implementation', 'documentation', 'devops', 'security'];
        const stage = (args[1] as ConversationStage) || 'architecture';
        if (!validStages.includes(stage)) {
          console.log(c('red', `\\n  Invalid stage: ${stage}`));
          console.log(c('gray', `  Valid stages: ${validStages.join(', ')}\\n`));
        } else {
          const newState = wfManager.startWorkflow(stage, args[2]);
          console.log(c('green', `\\n  Workflow started!`));
          console.log(c('gray', `    Stage: ${newState.stageName} (${newState.currentStage})`));
          console.log(c('gray', `    Use /prompt to see the system prompt\\n`));
          // Auto-set system prompt for workflow
          state.systemPrompt = wfManager.getSystemPrompt();
        }
      } else if (args[0] === 'next') {
        const wfState = wfManager.getState();
        if (!wfState) {
          console.log(c('red', '\\n  No active workflow. Use /workflow start first.\\n'));
        } else {
          const previousStage = wfState.stageName;
          const newState = wfManager.nextStage();
          if (!newState) {
            console.log(c('green', '\\n  Workflow complete! All stages done.\\n'));
          } else {
            console.log(c('green', `\\n  Stage transition: ${previousStage} → ${newState.stageName}`));
            console.log(c('gray', `    Stage #: ${newState.stageNumber}\\n`));
            state.systemPrompt = wfManager.getSystemPrompt();
          }
        }
      } else if (args[0] === 'reset') {
        wfManager.reset();
        state.systemPrompt = undefined;
        console.log(c('green', '\\n  Workflow reset.\\n'));
      }
      return true;

    case 'prompt':
    case 'p':
      const promptManager = getWorkflowManager();
      const promptState = promptManager.getState();
      if (!promptState) {
        console.log(c('yellow', '\\n  No active workflow. Use /workflow start first.\\n'));
      } else {
        const promptType = args[0] || 'system';
        let prompt: string;
        if (promptType === 'review') {
          prompt = promptManager.getReviewPrompt('{YOUR_CONTENT}');
        } else if (promptType === 'code') {
          prompt = promptManager.getCodeReviewPrompt('{YOUR_CODE}');
        } else {
          prompt = promptManager.getSystemPrompt();
        }
        console.log(c('cyan', `\\n  ${promptType} prompt for ${promptState.stageName}:\\n`));
        console.log(c('gray', prompt.split('\\n').map(l => '    ' + l).join('\\n')));
        console.log();
      }
      return true;

    case 'dod':
      const dodManager = getWorkflowManager();
      const dodState = dodManager.getState();
      if (!dodState) {
        console.log(c('yellow', '\\n  No active workflow. Use /workflow start first.\\n'));
      } else {
        console.log(c('cyan', `\\n  Running DoD checks for ${dodState.stageName}...\\n`));
        const checker = new DoDChecker();
        const report = checker.runChecks(dodState.currentStage);
        
        report.results.forEach(r => {
          const icon = r.result.passed ? c('green', '✓') : c('red', '✗');
          console.log(`    ${icon} ${r.check}`);
          if (!r.result.passed && r.result.details) {
            console.log(c('dim', `      ${r.result.details.join(', ')}`));
          }
        });
        
        console.log();
        console.log(c('gray', `    Passed: ${report.passed}/${report.totalChecks}`));
        if (report.failed > 0) {
          console.log(c('red', `    Failed: ${report.failed}`));
        }
        console.log();
      }
      return true;

    // ============ MCP Commands ============
    case 'mcp':
      const mcpManager = getMcpClientManager();
      if (args.length === 0 || args[0] === 'status') {
        // Show MCP status
        const mcpStatus = mcpManager.getStatus();
        const mcpConfig = loadMcpConfig();
        
        console.log(c('cyan', '\\n  MCP Status:\\n'));
        
        if (mcpStatus.length === 0) {
          console.log(c('gray', '    No active connections'));
          console.log(c('dim', `    Configured servers: ${mcpConfig.servers.length}`));
          console.log(c('dim', '    Use /mcp connect to connect'));
        } else {
          mcpStatus.forEach(s => {
            const icon = s.status === 'connected' ? c('green', '●') : c('red', '●');
            console.log(`    ${icon} ${s.name} [${s.status}] - ${s.tools} tools`);
            if (s.error) {
              console.log(c('dim', `      Error: ${s.error}`));
            }
          });
        }
        console.log();
      } else if (args[0] === 'connect') {
        const serverName = args[1];
        const mcpConfig = loadMcpConfig();
        
        if (serverName) {
          const server = mcpConfig.servers.find(s => s.name === serverName);
          if (!server) {
            console.log(c('red', `\\n  Server not found: ${serverName}\\n`));
          } else {
            console.log(c('cyan', `\\n  Connecting to ${serverName}...`));
            const conn = await mcpManager.connect(server);
            if (conn.status === 'connected') {
              console.log(c('green', `  ✓ Connected (${conn.tools.length} tools)\\n`));
            } else {
              console.log(c('red', `  ✗ Failed: ${conn.error}\\n`));
            }
          }
        } else {
          // Connect to all enabled
          const enabled = mcpConfig.servers.filter(s => s.enabled);
          if (enabled.length === 0) {
            console.log(c('yellow', '\\n  No enabled servers. Enable one first with CLI:\\n'));
            console.log(c('dim', '    alexi mcp-enable -n <server-name>\\\\n'));
          } else {
            console.log(c('cyan', '\\n  Connecting to enabled servers...\\n'));
            for (const server of enabled) {
              process.stdout.write(c('gray', `    ${server.name}... `));
              const conn = await mcpManager.connect(server);
              if (conn.status === 'connected') {
                console.log(c('green', `✓ (${conn.tools.length} tools)`));
              } else {
                console.log(c('red', `✗ ${conn.error}`));
              }
            }
            console.log();
          }
        }
      } else if (args[0] === 'tools') {
        const allTools = mcpManager.getAllTools();
        
        if (allTools.length === 0) {
          console.log(c('yellow', '\\n  No tools available. Connect to servers first.\\n'));
        } else {
          console.log(c('cyan', `\\n  Available MCP Tools (${allTools.length}):\\n`));
          
          // Group by server
          const byServer = new Map<string, typeof allTools>();
          allTools.forEach(t => {
            const list = byServer.get(t.serverName) || [];
            list.push(t);
            byServer.set(t.serverName, list);
          });
          
          byServer.forEach((tools, server) => {
            console.log(c('bold', `    ${server}:`));
            tools.forEach(t => {
              console.log(c('yellow', `      ${t.name}`));
              if (t.description) {
                const desc = t.description.slice(0, 50);
                console.log(c('dim', `        ${desc}${t.description.length > 50 ? '...' : ''}`));
              }
            });
          });
          console.log();
        }
      } else if (args[0] === 'call') {
        const toolName = args[1];
        if (!toolName) {
          console.log(c('red', '\\n  Usage: /mcp call <tool-name> [json-args]\\n'));
        } else {
          const serverName = mcpManager.findToolServer(toolName);
          if (!serverName) {
            console.log(c('red', `\\n  Tool not found: ${toolName}\\n`));
          } else {
            let toolArgs: Record<string, unknown> = {};
            if (args[2]) {
              try {
                toolArgs = JSON.parse(args.slice(2).join(' '));
              } catch {
                console.log(c('red', '\\n  Invalid JSON arguments\\n'));
                return true;
              }
            }
            
            console.log(c('cyan', `\\n  Calling ${toolName} on ${serverName}...`));
            const result = await mcpManager.callTool(serverName, toolName, toolArgs);
            
            if (result.success) {
              console.log(c('green', '\\n  Result:\\n'));
              console.log(c('gray', `    ${String(result.result).split('\\n').join('\\n    ')}`));
            } else {
              console.log(c('red', `\\n  Error: ${result.error}`));
            }
            console.log();
          }
        }
      } else if (args[0] === 'disconnect') {
        const serverName = args[1];
        if (serverName) {
          await mcpManager.disconnect(serverName);
          console.log(c('green', `\\n  Disconnected from ${serverName}\\n`));
        } else {
          await mcpManager.disconnectAll();
          console.log(c('green', '\\n  Disconnected from all servers\\n'));
        }
      } else {
        console.log(c('red', `\\n  Unknown MCP command: ${args[0]}`));
        console.log(c('gray', '  Available: status, connect, tools, call, disconnect\\n'));
      }
      return true;

    // ============ Skills Commands ============
    case 'skills':
      const skillRegistry = getSkillRegistry();
      const allSkills = skillRegistry.list();
      
      if (allSkills.length === 0) {
        console.log(c('yellow', '\\n  No skills available.\\n'));
      } else {
        console.log(c('cyan', `\\n  Available Skills (${allSkills.length}):\\n`));
        
        // Group by category
        const skillsByCategory = new Map<string, Skill[]>();
        allSkills.forEach(s => {
          const cat = s.category || 'other';
          const list = skillsByCategory.get(cat) || [];
          list.push(s);
          skillsByCategory.set(cat, list);
        });
        
        skillsByCategory.forEach((skills, category) => {
          console.log(c('bold', `    ${category}:`));
          skills.forEach(s => {
            const active = state.activeSkill?.id === s.id ? c('green', ' ← active') : '';
            const aliases = s.aliases?.length ? c('dim', ` (${s.aliases.join(', ')})`) : '';
            console.log(c('yellow', `      ${s.id}`) + aliases + active);
          });
        });
        console.log();
        console.log(c('dim', '    Use /skill <name> to activate'));
        console.log();
      }
      return true;

    case 'skill':
      const registry = getSkillRegistry();
      
      if (args.length === 0) {
        // Show current skill
        if (state.activeSkill) {
          console.log(c('cyan', `\\n  Active Skill: ${state.activeSkill.name} (${state.activeSkill.id})`));
          console.log(c('gray', `    ${state.activeSkill.description}\\n`));
        } else {
          console.log(c('yellow', '\\n  No skill active. Use /skill <name> to activate.\\n'));
        }
      } else if (args[0] === 'off' || args[0] === 'none' || args[0] === 'clear') {
        // Deactivate skill
        if (state.activeSkill) {
          const oldSkill = state.activeSkill;
          state.activeSkill = undefined;
          state.systemPrompt = undefined;
          console.log(c('green', `\\n  Deactivated skill: ${oldSkill.name}\\n`));
        } else {
          console.log(c('yellow', '\\n  No skill is active.\\n'));
        }
      } else if (args[0] === 'show') {
        // Show skill details
        const skillName = args[1];
        if (!skillName) {
          console.log(c('red', '\\n  Usage: /skill show <name>\\n'));
        } else {
          const skill = registry.get(skillName);
          if (!skill) {
            console.log(c('red', `\\n  Skill not found: ${skillName}\\n`));
          } else {
            console.log(c('cyan', `\\n  === ${skill.name} (${skill.id}) ===\\n`));
            console.log(c('gray', `    ${skill.description}`));
            if (skill.category) console.log(c('dim', `    Category: ${skill.category}`));
            if (skill.aliases?.length) console.log(c('dim', `    Aliases: ${skill.aliases.join(', ')}`));
            if (skill.tags?.length) console.log(c('dim', `    Tags: ${skill.tags.join(', ')}`));
            console.log(c('bold', '\\n    Prompt Preview:'));
            const preview = skill.prompt.split('\\n').slice(0, 5).map(l => '      ' + l).join('\\n');
            console.log(c('dim', preview));
            if (skill.prompt.split('\\n').length > 5) {
              console.log(c('dim', '      ...'));
            }
            console.log();
          }
        }
      } else {
        // Activate skill
        const skillName = args[0];
        const skill = registry.get(skillName);
        
        if (!skill) {
          console.log(c('red', `\\n  Skill not found: ${skillName}`));
          console.log(c('gray', '  Use /skills to see available skills\\n'));
        } else {
          state.activeSkill = skill;
          state.systemPrompt = skill.prompt;
          
          // Apply skill settings
          if (skill.preferredModel && !state.autoRoute) {
            state.currentModel = skill.preferredModel;
          }
          
          console.log(c('green', `\\n  ✓ Activated skill: ${skill.name}`));
          console.log(c('gray', `    ${skill.description}`));
          if (skill.tools?.length) {
            console.log(c('dim', `    Recommended tools: ${skill.tools.join(', ')}`));
          }
          console.log();
        }
      }
      return true;

    // ============ Undo/Redo Commands ============
    case 'undo':
      try {
        const undoResult = await performUndo();
        if (undoResult.success) {
          console.log(c('green', '\\n  ✓ Undo successful'));
          if (undoResult.restoredFiles.length > 0) {
            console.log(c('gray', '  Restored files:'));
            undoResult.restoredFiles.forEach(f => {
              console.log(c('dim', `    • ${f}`));
            });
          }
        } else {
          console.log(c('yellow', `\\n  ${undoResult.error || 'Nothing to undo'}`));
        }
        console.log();
      } catch (err) {
        console.log(c('red', `\\n  Undo failed: ${err instanceof Error ? err.message : String(err)}\\n`));
      }
      return true;

    case 'redo':
      try {
        const redoResult = await performRedo();
        if (redoResult.success) {
          console.log(c('green', '\\n  ✓ Redo successful'));
          if (redoResult.restoredFiles.length > 0) {
            console.log(c('gray', '  Restored files:'));
            redoResult.restoredFiles.forEach(f => {
              console.log(c('dim', `    • ${f}`));
            });
          }
        } else {
          console.log(c('yellow', `\\n  ${redoResult.error || 'Nothing to redo'}`));
        }
        console.log();
      } catch (err) {
        console.log(c('red', `\\n  Redo failed: ${err instanceof Error ? err.message : String(err)}\\n`));
      }
      return true;

    case 'history-undo':
    case 'undostack':
      const stackInfo = getUndoStackInfo();
      console.log(c('cyan', '\\n  Undo/Redo Stack Info:\\n'));
      console.log(c('gray', `    Undo entries: ${c('yellow', String(stackInfo.undoCount))}`));
      console.log(c('gray', `    Redo entries: ${c('yellow', String(stackInfo.redoCount))}`));
      
      const undoManager = getUndoManager();
      const peekUndo = undoManager.peekUndo();
      if (peekUndo) {
        console.log(c('dim', `\\n    Last undo: ${peekUndo.description || 'No description'} (${peekUndo.files.length} files)`));
      }
      const peekRedo = undoManager.peekRedo();
      if (peekRedo) {
        console.log(c('dim', `    Last redo: ${peekRedo.description || 'No description'} (${peekRedo.files.length} files)`));
      }
      console.log();
      return true;

    // ============ Plan Mode Commands ============
    case 'plan':
      const planManager = getPlanModeManager();
      const newMode = planManager.toggle();
      const modeColorToggle = newMode === 'plan' ? 'yellow' : 'green';
      console.log(c('green', `\\n  ✓ Switched to ${c(modeColorToggle, newMode.toUpperCase())} mode`));
      if (newMode === 'plan') {
        console.log(c('dim', '    Read-only analysis mode - no file changes allowed'));
      } else {
        console.log(c('dim', '    Full access mode - all operations enabled'));
      }
      console.log();
      return true;

    case 'mode':
      const currentPlanManager = getPlanModeManager();
      const currentMode = currentPlanManager.getMode();
      const currentModeColor = currentMode === 'plan' ? 'yellow' : 'green';
      console.log(c('cyan', '\\n  Current Mode:\\n'));
      console.log(c('gray', `    Mode: ${c(currentModeColor, currentMode.toUpperCase())}`));
      if (currentMode === 'plan') {
        console.log(c('dim', '    Read-only analysis mode'));
        console.log(c('dim', '    Allowed tools: read, glob, grep, webfetch, question'));
      } else {
        console.log(c('dim', '    Full access mode - all operations enabled'));
      }
      console.log(c('dim', '\\n    Use /plan to toggle mode'));
      console.log();
      return true;

    // ============ Custom Commands ============
    case 'cmd':
    case 'command':
      if (args.length === 0) {
        console.log(c('red', '\\n  Usage: /cmd <name> [arguments]'));
        console.log(c('gray', '  Use /commands to see available commands\\n'));
        return true;
      }
      
      const cmdName = args[0];
      const cmdArgs = args.slice(1);
      
      try {
        console.log(c('cyan', `\\n  Executing command: ${cmdName}...\\n`));
        const cmdResult = await executeCommand(cmdName, cmdArgs);
        console.log(c('gray', cmdResult));
        console.log();
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        console.log(c('red', `\\n  Command failed: ${errorMsg}\\n`));
      }
      return true;

    case 'commands':
    case 'cmds':
      const commands = listCommands();
      
      if (commands.length === 0) {
        console.log(c('yellow', '\\\\\\\\n  No custom commands available.'));
        console.log(c('dim', '  Add commands to ~/.alexi/commands/ or .alexi/commands/\\\\\\\\n'));
      } else {
        console.log(c('cyan', `\\\\n  Available Custom Commands (${commands.length}):\\\\n`));
        commands.forEach(cmd => {
          const argsDesc = cmd.arguments && cmd.arguments.length > 0
            ? ` <${cmd.arguments.map(a => a.required ? a.name : `[${a.name}]`).join('> <')}>`
            : '';
          console.log(c('yellow', `    ${cmd.name}${argsDesc}`));
          if (cmd.description) {
            console.log(c('dim', `      ${cmd.description}`));
          }
        });
        console.log();
        console.log(c('dim', '  Use /cmd <name> [args] to execute'));
        console.log();
      }
      return true;

    // ============ Session Sharing Commands ============
    case 'share':
      if (args[0] === 'file') {
        const outputPath = args[1] || './session-export.json';
        const session = state.sessionManager.getCurrentSession();
        if (!session) {
          console.log(c('yellow', '\n  No active session to share\n'));
        } else {
          try {
            const filePath = await exportSessionToFile(session.metadata.id, outputPath);
            console.log(c('green', `\n  Session exported to: ${filePath}\n`));
          } catch (err) {
            const errMsg = err instanceof Error ? err.message : String(err);
            console.log(c('red', `\n  Export failed: ${errMsg}\n`));
          }
        }
      } else {
        const session = state.sessionManager.getCurrentSession();
        if (!session) {
          console.log(c('yellow', '\n  No active session to share\n'));
        } else {
          const result = await shareSession(session.metadata.id);
          if (result.success && result.shareData) {
            console.log(c('green', '\n  Session shared!'));
            console.log(c('gray', `  Share data (${result.shareData.length} chars) copied to clipboard\n`));
            // Note: actual clipboard copy would need an external package
          } else {
            console.log(c('red', `\n  Share failed: ${result.error}\n`));
          }
        }
      }
      return true;

    case 'import':
      if (!args[0]) {
        console.log(c('red', '\n  Usage: /import <file-path>\n'));
      } else {
        const importResult = await importSessionFromFile(args[0]);
        if (importResult.success) {
          console.log(c('green', `\n  Session imported! ID: ${importResult.sessionId?.slice(0, 8)}`));
          console.log(c('gray', `  Messages: ${importResult.messageCount}\n`));
        } else {
          console.log(c('red', `\n  Import failed: ${importResult.error}\n`));
        }
      }
      return true;

    // ============ Project Init Commands ============
    case 'init':
      console.log(c('cyan', '\n  Initializing project...\n'));
      const initResult = await initProject(process.cwd(), { force: args.includes('--force') });
      console.log(formatInitResultForCLI(initResult));
      console.log();
      return true;

    case 'analyze':
      console.log(c('cyan', '\n  Analyzing project...\n'));
      const analysis = await analyzeProject(process.cwd());
      console.log(formatAnalysisForCLI(analysis));
      console.log();
      return true;

    // ============ Context Compaction Commands ============
    case 'compact':
      const compactHistory = state.sessionManager.getHistory();
      if (compactHistory.length < 2) {
        console.log(c('yellow', '\n  Not enough messages to compact\n'));
      } else {
        const strategy = (args[0] as 'truncate' | 'summarize' | 'sliding' | 'smart') || 'smart';
        console.log(c('cyan', `\n  Compacting with ${strategy} strategy...\n`));
        const compactResult = await compactConversation(compactHistory, { strategy });
        if (compactResult.success) {
          console.log(c('green', '  Compaction complete!'));
          console.log(c('gray', `    Messages: ${compactResult.originalMessageCount} → ${compactResult.compactedMessageCount}`));
          console.log(c('gray', `    Tokens: ${compactResult.originalTokens} → ${compactResult.compactedTokens}\n`));
        } else {
          console.log(c('red', `\n  Compaction failed: ${compactResult.error}\n`));
        }
      }
      return true;

    // ============ Plugin Commands ============
    case 'plugins':
      const plugins = listPlugins();
      if (plugins.length === 0) {
        console.log(c('yellow', '\n  No plugins loaded\n'));
      } else {
        console.log(c('cyan', `\n  Loaded Plugins (${plugins.length}):\n`));
        plugins.forEach(p => {
          const status = p.enabled ? c('green', '●') : c('red', '●');
          console.log(`    ${status} ${p.name} v${p.version}`);
          if (p.description) console.log(c('dim', `      ${p.description}`));
        });
        console.log();
      }
      return true;

    case 'plugin':
      if (args[0] === 'enable' && args[1]) {
        try {
          enablePlugin(args[1]);
          console.log(c('green', `\n  Plugin ${args[1]} enabled\n`));
        } catch (err) {
          const errMsg = err instanceof Error ? err.message : String(err);
          console.log(c('red', `\n  Failed to enable plugin: ${errMsg}\n`));
        }
      } else if (args[0] === 'disable' && args[1]) {
        try {
          disablePlugin(args[1]);
          console.log(c('green', `\n  Plugin ${args[1]} disabled\n`));
        } catch (err) {
          const errMsg = err instanceof Error ? err.message : String(err);
          console.log(c('red', `\n  Failed to disable plugin: ${errMsg}\n`));
        }
      } else if (args[0] === 'load') {
        const results = await loadPluginsFromDefaultLocations();
        const loaded = results.filter(r => r.success);
        console.log(c('green', `\n  Loaded ${loaded.length} plugins from default locations\n`));
      } else {
        console.log(c('red', '\n  Usage: /plugin <enable|disable|load> [name]\n'));
      }
      return true;

    // ============ Doctor Command ============
    case 'doctor': {
      const doctor = getDoctor();
      console.log(c('cyan', '\n  Running health checks...\n'));
      const results = await doctor.runAll({ skipNetwork: true });
      const summary = doctor.getSummary(results);
      console.log(doctor.formatReport(results));
      console.log();
      console.log(c('gray', `  Summary: ${c('green', String(summary.passed))} passed, ${c('yellow', String(summary.warned))} warned, ${c('red', String(summary.failed))} failed`));
      console.log();
      return true;
    }

    // ============ Log/Logs Command ============
    case 'log':
    case 'logs': {
      const viewer = getLogViewer();
      const level = args[0] as LogLevel | undefined;
      const filter = level ? { level, limit: 10 } : { limit: 10 };
      const entries = viewer.readLogs(filter);
      
      if (entries.length === 0) {
        console.log(c('yellow', '\n  No log entries found\n'));
      } else {
        console.log(c('cyan', `\n  Recent Logs${level ? ` (${level})` : ''}:\n`));
        entries.forEach(entry => {
          const levelColor = entry.level === 'error' ? 'red' : 
                            entry.level === 'warn' ? 'yellow' : 
                            entry.level === 'debug' ? 'dim' : 'gray';
          const timestamp = new Date(entry.timestamp).toLocaleTimeString();
          console.log(`  ${c('dim', timestamp)} ${c(levelColor, entry.level.padEnd(5))} ${c('gray', `[${entry.category}]`)} ${entry.message}`);
        });
        console.log();
      }
      return true;
    }

    // ============ Profile Command ============
    case 'profile': {
      const manager = getProfileManager();
      const subCmd = args[0];
      
      if (!subCmd) {
        // List profiles
        const profiles = manager.list();
        const current = manager.getActive();
        
        if (profiles.length === 0) {
          console.log(c('yellow', '\n  No profiles configured\n'));
        } else {
          console.log(c('cyan', '\n  Profiles:\n'));
          profiles.forEach(p => {
            const isCurrent = current?.name === p.name;
            const marker = isCurrent ? c('green', ' ← current') : '';
            console.log(`    ${c('yellow', p.name)}${marker}`);
            if (p.description) {
              console.log(c('dim', `      ${p.description}`));
            }
          });
          console.log();
        }
      } else if (subCmd === 'switch') {
        const profileName = args[1];
        if (!profileName) {
          console.log(c('red', '\n  Usage: /profile switch <name>\n'));
        } else {
          try {
            manager.switch(profileName);
            console.log(c('green', `\n  Switched to profile: ${profileName}\n`));
          } catch (err) {
            const errMsg = err instanceof Error ? err.message : String(err);
            console.log(c('red', `\n  Failed to switch profile: ${errMsg}\n`));
          }
        }
      } else if (subCmd === 'show') {
        const profileName = args[1];
        if (!profileName) {
          console.log(c('red', '\n  Usage: /profile show <name>\n'));
        } else {
          const profile = manager.get(profileName);
          if (!profile) {
            console.log(c('red', `\n  Profile not found: ${profileName}\n`));
          } else {
            console.log(c('cyan', `\n  Profile: ${profile.name}\n`));
            if (profile.description) {
              console.log(c('gray', `  Description: ${profile.description}`));
            }
            const envVars = Object.keys(profile.environment);
            if (envVars.length > 0) {
              console.log(c('gray', `  Environment Variables: ${envVars.length}`));
              envVars.slice(0, 5).forEach(key => {
                console.log(c('dim', `    ${key}`));
              });
              if (envVars.length > 5) {
                console.log(c('dim', `    ... and ${envVars.length - 5} more`));
              }
            }
            console.log();
          }
        }
      } else {
        console.log(c('red', '\n  Usage: /profile [switch <name>|show <name>]\n'));
      }
      return true;
    }

    // ============ Sound Command ============
    case 'sound': {
      const soundManager = getSoundManager();
      const action = args[0];
      
      if (action === 'on') {
        soundManager.enable();
        console.log(c('green', '\n  Sounds enabled\n'));
      } else if (action === 'off') {
        soundManager.disable();
        console.log(c('green', '\n  Sounds disabled\n'));
      } else {
        const status = soundManager.isEnabled() ? c('green', 'enabled') : c('red', 'disabled');
        console.log(c('cyan', `\n  Sound status: ${status}\n`));
      }
      return true;
    }

    // ============ Update Command ============
    case 'update': {
      console.log(c('cyan', '\n  Checking for updates...\n'));
      try {
        const result = await checkForUpdates();
        if (result.updateAvailable) {
          console.log(c('yellow', `  Update available: ${result.currentVersion} → ${result.latestVersion}`));
          console.log(c('dim', '  Run \"npm install -g alexi\" to update'));
        } else {
          console.log(c('green', `  Up to date (${result.currentVersion})`));
        }
        console.log();
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : String(err);
        console.log(c('red', `  Failed to check for updates: ${errMsg}\n`));
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
  // Initialize command registry with built-in commands
  registerBuiltInCommands();

  // Load custom commands from default locations
  const commandRegistry = getCommandRegistry();
  commandRegistry.loadFromDefaultLocations().catch((err) => {
    // Silently ignore errors loading custom commands
  });

  // Load plugins from default locations
  try {
    const pluginResults = await loadPluginsFromDefaultLocations();
    const loadedCount = pluginResults.filter(r => r.success).length;
    if (loadedCount > 0) {
      console.log(c('dim', `  Loaded ${loadedCount} plugins`));
    }
  } catch (e) {
    // Silently ignore plugin loading errors on startup
  }

  // Subscribe to mode changes for UI updates
  ModeChanged.subscribe(({ previousMode, newMode }) => {
    console.log(c('magenta', `\n  Mode: ${previousMode} → ${newMode}\n`));
  });

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

  const getPromptText = () => `${getPlanModeIndicator()} ${c('blue', '❯ ')}`;
  
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: getPromptText(),
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
      // Update prompt in case mode changed
      rl.setPrompt(getPromptText());
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
          process.stdout.write(`\r  ${c('cyan', spinnerFrames[spinnerFrame])} ${c('dim', 'Thinking...')}`);
          spinnerFrame = (spinnerFrame + 1) % spinnerFrames.length;
        }
      }, 80);

      // Apply plan mode restrictions to system prompt
      const planManager = getPlanModeManager();
      let effectiveSystemPrompt = state.systemPrompt;
      if (isPlanMode()) {
        effectiveSystemPrompt = (effectiveSystemPrompt || '') + '\n\n' + planManager.getModePrompt();
      }

      const generator = streamChat(input, {
        modelOverride: state.autoRoute ? undefined : state.currentModel,
        autoRoute: state.autoRoute,
        preferCheap: state.preferCheap,
        sessionManager: state.sessionManager,
        systemPrompt: effectiveSystemPrompt,
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

    // Update prompt in case mode changed during streaming
    rl.setPrompt(getPromptText());
    rl.prompt();
  });

  rl.on('close', () => {
    console.log(c('gray', '\n  Goodbye!\n'));
    process.exit(0);
  });
}
