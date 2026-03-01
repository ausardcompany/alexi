#!/usr/bin/env node
/**
 * Alexi CLI - Main entry point
 *
 * This is the main CLI entry point that uses the modular command structure.
 * Individual commands are implemented in the ./commands/ directory.
 */

import { Command } from 'commander';
import { registerAllCommands } from './commands/index.js';

const program = new Command();
program.name('alexi').description('Alexi - Intelligent LLM orchestrator').version('0.1.0');

// Register all commands from modular command files
registerAllCommands(program);

await program.parseAsync(process.argv);
