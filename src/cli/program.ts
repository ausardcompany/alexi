#!/usr/bin/env node
/**
 * Alexi CLI - Main entry point
 *
 * This is the main CLI entry point that uses the modular command structure.
 * Individual commands are implemented in the ./commands/ directory.
 */

import { Command } from 'commander';
import { createRequire } from 'module';
import { ProviderModelFellBack } from '../bus/index.js';
import { registerAllCommands } from './commands/index.js';
import { killAllTracked } from '../tool/tools/background-process.js';

const require = createRequire(import.meta.url);
const packageJson = require('../../package.json');

// Install SIGINT/SIGTERM handlers once so any background_process children
// spawned during one-shot commands (e.g. `alexi chat -m "..."`) are reaped
// on Ctrl+C or systemd/docker stop rather than orphaned. The interactive
// REPL removes these listeners on start-up and installs its own two-stage
// (abort-then-exit) handler.
const oneShotShutdown = () => {
  killAllTracked()
    .catch(() => undefined)
    .finally(() => process.exit(0));
};
process.on('SIGINT', oneShotShutdown);
process.on('SIGTERM', oneShotShutdown);

// Default fallback subscriber for non-TUI runs (CLI one-shots, scripts, tests).
// The TUI subscribes its own handler in StatusBar.tsx and always renders,
// regardless of TTY state. This subscriber only writes to stderr when stdout
// is not a TTY (piped output) or when ALEXI_NON_INTERACTIVE is explicitly set.
ProviderModelFellBack.subscribe((p) => {
  if (!process.stdout.isTTY || process.env.ALEXI_NON_INTERACTIVE) {
    process.stderr.write(
      `warning: model '${p.requestedModel}' not recognized — using '${p.effectiveModel}' for this session\n`
    );
  }
});

const program = new Command();
program
  .name('alexi')
  .description('Alexi - Intelligent LLM orchestrator')
  .version(packageJson.version);

// Register all commands from modular command files
registerAllCommands(program);

await program.parseAsync(process.argv);
