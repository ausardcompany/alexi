#!/usr/bin/env node
/**
 * SAP Bot Orchestrator CLI - Main entry point
 * 
 * This is the main CLI entry point that uses the modular command structure.
 * Individual commands are implemented in the ./commands/ directory.
 */

import { Command } from 'commander';
import { registerAllCommands } from './commands/index.js';

const program = new Command();
program.name('sap-bot').description('SAP AI Core bot orchestrator');

// Register all commands from modular command files
registerAllCommands(program);

await program.parseAsync(process.argv);
