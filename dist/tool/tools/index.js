/**
 * Tool Registry - Exports and registers all built-in tools
 */
import { registerTool } from "../index.js";
// Import all tools
import { readTool } from "./read.js";
import { writeTool } from "./write.js";
import { editTool } from "./edit.js";
import { bashTool } from "./bash.js";
import { globTool } from "./glob.js";
import { grepTool } from "./grep.js";
import { webfetchTool } from "./webfetch.js";
import { taskTool } from "./task.js";
import { questionTool } from "./question.js";
import { todowriteTool } from "./todowrite.js";
// All built-in tools
export const builtInTools = [
    readTool,
    writeTool,
    editTool,
    bashTool,
    globTool,
    grepTool,
    webfetchTool,
    taskTool,
    questionTool,
    todowriteTool,
];
/**
 * Register all built-in tools
 */
export function registerBuiltInTools() {
    for (const tool of builtInTools) {
        // Cast needed because tools have different parameter schemas
        registerTool(tool);
    }
}
// Re-export individual tools
export { readTool, writeTool, editTool, bashTool, globTool, grepTool, webfetchTool, taskTool, questionTool, todowriteTool, };
// Re-export UI utilities from specific tools
export { getPendingQuestions, answerQuestion } from "./question.js";
export { getTodos, onTodosChange, clearTodos } from "./todowrite.js";
