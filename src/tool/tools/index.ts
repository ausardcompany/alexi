/**
 * Tool Registry - Exports and registers all built-in tools
 */

import { registerTool, type Tool } from '../index.js';

// Import all tools
import { readTool } from './read.js';
import { writeTool } from './write.js';
import { editTool } from './edit.js';
import { bashTool } from './bash.js';
import { globTool } from './glob.js';
import { grepTool } from './grep.js';
import { webfetchTool } from './webfetch.js';
import { taskTool } from './task.js';
import { questionTool } from './question.js';
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
import { codesearchTool } from './codesearch.js';

// All built-in tools
export const builtInTools = [
  readTool,
  writeTool,
  editTool,
  bashTool,
  globTool,
  grepTool,
  webfetchTool,
  websearchTool,
  taskTool,
  questionTool,
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
  codesearchTool,
] as const;

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
  bashTool,
  globTool,
  grepTool,
  webfetchTool,
  websearchTool,
  taskTool,
  questionTool,
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
  codesearchTool,
};

// Re-export UI utilities from specific tools
export { getPendingQuestions, answerQuestion } from './question.js';
export { getTodos, onTodosChange, clearTodos, type Todo } from './todowrite.js';
