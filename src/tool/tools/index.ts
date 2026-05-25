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
import { warpgrepTool, isWarpgrepAvailable } from './warpgrep.js';
import { recallTool } from './recall.js';
import { agentManagerTool } from './agent-manager.js';
import { applyPatchTool } from './apply-patch.js';
import { repoCloneTool } from './repo-clone.js';

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
  ...(warpgrepAvailable ? [warpgrepTool] : []),
  recallTool,
  agentManagerTool,
  applyPatchTool,
  repoCloneTool,
];

/**
 * Register all built-in tools
 */
export function registerBuiltInTools(): void {
  for (const tool of builtInTools) {
    // Cast needed because tools have different parameter schemas
    registerTool(tool as Tool<any, any>);
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
  warpgrepTool,
  isWarpgrepAvailable,
  recallTool,
  agentManagerTool,
  applyPatchTool,
  repoCloneTool,
};

// Re-export UI utilities from specific tools
export { getPendingQuestions, answerQuestion } from './question.js';
export { getTodos, onTodosChange, clearTodos, type Todo } from './todowrite.js';
export {
  listBackgroundProcesses,
  stopBackgroundProcess,
  type BackgroundProcess,
} from './background-process.js';
