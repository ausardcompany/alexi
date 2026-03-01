/**
 * Command registration - registers all CLI commands
 */

import type { Command } from 'commander';
import { registerChatCommand } from './chat.js';
import { registerExplainCommand } from './explain.js';
import { registerModelsCommand } from './models.js';
import { registerSessionCommands } from './sessions.js';
import { registerContextCommands } from './context.js';
import { registerStageCommands } from './stages.js';
import { registerNotesCommand } from './notes.js';
import { registerDoDCommands } from './dod.js';
import { registerInteractiveCommand } from './interactive.js';

/**
 * Register all CLI commands on the program
 * @param program - Commander program instance
 */
export function registerAllCommands(program: Command): void {
  registerChatCommand(program);
  registerInteractiveCommand(program);
  registerModelsCommand(program);
  registerExplainCommand(program);
  registerSessionCommands(program);
  registerContextCommands(program);
  registerStageCommands(program);
  registerNotesCommand(program);
  registerDoDCommands(program);
}

export {
  registerChatCommand,
  registerExplainCommand,
  registerModelsCommand,
  registerSessionCommands,
  registerContextCommands,
  registerStageCommands,
  registerNotesCommand,
  registerDoDCommands,
  registerInteractiveCommand,
};
