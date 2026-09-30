/**
 * Tool Registry - Exports and registers all built-in tools
 */

import { registerTool, type Tool } from '../index.js';

// Import all tools
import { readTool } from './read.js';
import { writeTool } from './write.js';
import { editTool } from './edit.js';
import { shellTool, bashTool } from './shell.js';
import { backgroundProcessTool } from './background-process.js';
import { globTool } from './glob.js';
import { grepTool } from './grep.js';
import { webfetchTool } from './webfetch.js';
import { taskTool } from './task.js';
import { taskStatusTool } from './task_status.js';
import { questionTool } from './question.js';
import { suggestTool } from './suggest.js';
import { todowriteTool } from './todowrite.js';
import { deleteTool } from './delete.js';
import { multieditTool } from './multiedit.js';
import { lsTool } from './ls.js';
import { websearchTool } from './websearch.js';
import { skillTool } from './skill.js';
import { definitionsTool } from './definitions.js';
import { notebookReadTool, notebookEditTool } from './notebook.js';
import { browserTool } from './browser.js';
import { diagnosticsTool } from './diagnostics.js';
// codesearch removed - use semantic search or grep instead
import { batchTool } from './batch.js';
import { storeMemoryTool, recallMemoryTool } from './memory.js';
// The built-in `codebase_search` (WarpGrep) tool has been removed. Semantic
// codebase search is now provided by the `alexi-mcp-warpgrep` MCP server
// (see `packages/alexi-mcp-warpgrep`). We still consult `isWarpgrepAvailable`
// to decide whether to append the "install @morphllm/morphsdk" hint to the
// `grep` tool description — users who have the SDK installed do not need it.
import { isWarpgrepAvailable } from './warpgrep.js';
import { recallTool } from './recall.js';
import { agentManagerTool } from './agent-manager.js';
import { agentManagerModelsTool } from './agent-manager-models.js';
import { applyPatchTool } from './apply-patch.js';
import { repoCloneTool } from './repo-clone.js';
import { imageGenTool } from './image-gen.js';
import { openPlanTool } from './open-plan.js';
// Ports kilocode `9076f0301` fix(opencode): offer the link_pr tool to CLI
// sessions only. The tool binds a PR URL to the active session, but the
// storage is CLI-only — non-CLI backends (SAP BAS extension, VS Code
// webview) must not see the tool at all. Gated at registration by
// `prEnabled()` and again at execute-time inside the tool.
import { linkPrTool } from './link-pr.js';
import { enabled as prEnabled } from '../../session/pr-link.js';
// Ports kilocode `packages/opencode/src/kilocode/tool/registry.ts` (+36):
// shared agent board tools are gated behind `experimental.sharedAgentBoard`.
import { boardReadTool, boardWriteTool } from './board.js';
import { isBoardEnabled } from '../../config/userConfig.js';
// kilocode_change: schedule_wakeup / cancel_wakeup let agents defer work
// (kilocode commit b7070e507). Backed by the filesystem wakeup store
// under `src/kilocode/wakeup/`.
import { scheduleWakeupTool } from './schedule-wakeup.js';
import { cancelWakeupTool } from './cancel-wakeup.js';
// Ports upstream opencode #14268: self-context tools (`context_inspect`,
// `context_summarize`) gated behind `experimental.contextTools`.
import { contextInspectTool, contextSummarizeTool } from './context.js';
import { getConfigContextTools } from '../../config/userConfig.js';

/**
 * When warpgrep (codebase_search) is unavailable, append a hint to the grep
 * tool description so users know how to enable semantic search.
 */
const SEMANTIC_SEARCH_INSTALL_HINT = '\nNote: For semantic code search, install @morphllm/morphsdk';

const warpgrepAvailable = isWarpgrepAvailable();

const grepToolMaybeHinted = warpgrepAvailable
  ? grepTool
  : {
      ...grepTool,
      description: grepTool.description + SEMANTIC_SEARCH_INSTALL_HINT,
      toFunctionSchema() {
        const schema = grepTool.toFunctionSchema();
        return {
          ...schema,
          description: schema.description + SEMANTIC_SEARCH_INSTALL_HINT,
        };
      },
    };

// All built-in tools
export const builtInTools = [
  readTool,
  writeTool,
  editTool,
  shellTool,
  backgroundProcessTool,
  globTool,
  grepToolMaybeHinted,
  webfetchTool,
  websearchTool,
  taskTool,
  taskStatusTool,
  questionTool,
  suggestTool,
  todowriteTool,
  deleteTool,
  multieditTool,
  lsTool,
  skillTool,
  definitionsTool,
  notebookReadTool,
  notebookEditTool,
  browserTool,
  diagnosticsTool,
  // codesearchTool removed - superseded by improved semantic search
  batchTool,
  storeMemoryTool,
  recallMemoryTool,
  // codebase_search (warpgrep) removed — provided by `alexi-mcp-warpgrep` MCP server
  recallTool,
  agentManagerTool,
  agentManagerModelsTool,
  applyPatchTool,
  repoCloneTool,
  imageGenTool,
  openPlanTool,
  scheduleWakeupTool, // kilocode_change
  cancelWakeupTool, // kilocode_change
  // Ports kilocode `9076f0301`: `link_pr` is only offered to CLI backends.
  // The check runs once at module load — Alexi does not hot-reload tools,
  // so callers embedding Alexi as a library must set `ALEXI_CLIENT`
  // before importing this module. On non-CLI backends the tool is
  // omitted from the registry entirely so the model never sees it.
  ...(prEnabled() ? [linkPrTool] : []),
];

/**
 * Register all built-in tools.
 *
 * Ports kilocode: `experimental.sharedAgentBoard` gates the two board
 * tools so the model never sees them unless the operator has opted in.
 * The flag is read fresh on each call so a config change picks up on
 * the next process restart (Alexi does not hot-reload tools mid-turn).
 *
 * Ports kilocode #14013: the enable path also accepts the environment
 * flags `KILO_EXPERIMENTAL_SHARED_AGENT_BOARD=1` or the umbrella
 * `KILO_EXPERIMENTAL=1`, via `isBoardEnabled()` in `userConfig.ts`.
 */
export function registerBuiltInTools(): void {
  for (const tool of builtInTools) {
    // Cast needed because tools have different parameter schemas
    registerTool(tool as Tool<any, any>);
  }
  if (isBoardEnabled()) {
    registerTool(boardReadTool as Tool<any, any>);
    registerTool(boardWriteTool as Tool<any, any>);
  }
  // Ports upstream opencode #14268: gate context self-inspection tools
  // behind `experimental.contextTools`. Fresh read on each call so a
  // config change picks up on next process restart.
  if (getConfigContextTools()) {
    registerTool(contextInspectTool as Tool<any, any>);
    registerTool(contextSummarizeTool as Tool<any, any>);
  }
}

// Re-export individual tools
export {
  readTool,
  writeTool,
  editTool,
  shellTool,
  bashTool,
  backgroundProcessTool,
  globTool,
  grepTool,
  webfetchTool,
  websearchTool,
  taskTool,
  taskStatusTool,
  questionTool,
  suggestTool,
  todowriteTool,
  deleteTool,
  multieditTool,
  lsTool,
  skillTool,
  definitionsTool,
  notebookReadTool,
  notebookEditTool,
  browserTool,
  diagnosticsTool,
  // codesearchTool removed
  batchTool,
  storeMemoryTool,
  recallMemoryTool,
  // warpgrepTool removed — codebase_search is now the `alexi-mcp-warpgrep` MCP server
  isWarpgrepAvailable,
  recallTool,
  agentManagerTool,
  agentManagerModelsTool,
  applyPatchTool,
  repoCloneTool,
  imageGenTool,
  openPlanTool,
  boardReadTool,
  boardWriteTool,
  scheduleWakeupTool,
  cancelWakeupTool,
  contextInspectTool,
  contextSummarizeTool,
  // Ports kilocode `9076f0301`. Re-exported unconditionally so tests
  // and downstream consumers can reference the tool object; whether it
  // is registered depends on `prEnabled()` — see `builtInTools`.
  linkPrTool,
};

// Re-export UI utilities from specific tools
export { getPendingQuestions, answerQuestion } from './question.js';
export { getTodos, onTodosChange, clearTodos, type Todo } from './todowrite.js';
export {
  listBackgroundProcesses,
  stopBackgroundProcess,
  type BackgroundProcess,
} from './background-process.js';
