#!/usr/bin/env node
/**
 * Alexi CLI - Main entry point
 *
 * This is the main CLI entry point that uses the modular command structure.
 * Individual commands are implemented in the ./commands/ directory.
 */

import { Command } from 'commander';
import { createRequire } from 'module';
import { registerAllCommands } from './commands/index.js';

const require = createRequire(import.meta.url);
const packageJson = require('../../package.json');

const program = new Command();
program
  .name('alexi')
  .description('Alexi - Intelligent LLM orchestrator')
  .version(packageJson.version);

// Register all commands from modular command files
registerAllCommands(program);

await program.parseAsync(process.argv);
