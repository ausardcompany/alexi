/**
 * Interactive command - start REPL with streaming responses
 */

import type { Command } from 'commander';
import { startInteractive } from '../interactive.js';
import { createAutoCommitManager } from '../../git/autoCommit.js';
import { loadGitConfig } from '../../git/config.js';
import { commitDirtyFiles } from '../../git/dirtyFiles.js';
import { RepoMapManager } from '../../context/repoMap.js';

interface InteractiveOptions {
  model?: string;
  autoRoute?: boolean;
  preferCheap?: boolean;
  session?: string;
  system?: string;
  // Git flags — commander's --no-<name> sets <name> to false (not no<Name> to true)
  autoCommits?: boolean;
  dirtyCommits?: boolean;
  gitCommitVerify?: boolean;
  attributeCoAuthoredBy?: boolean;
  attributeAuthor?: boolean;
  // Repo map flags
  mapTokens?: string;
}

export function registerInteractiveCommand(program: Command): void {
  program
    .command('interactive')
    .alias('i')
    .description('Start interactive REPL with streaming responses')
    .option('--model <id>', 'Model ID to use')
    .option('--auto-route', 'Enable automatic model routing')
    .option('--prefer-cheap', 'Prefer cheaper models when auto-routing')
    .option('--session <id>', 'Continue existing session')
    .option('--system <prompt>', 'System prompt for the conversation')
    // Git auto-commit flags
    .option('--no-auto-commits', 'Disable git auto-commits')
    .option('--no-dirty-commits', 'Skip committing pre-existing dirty files')
    .option('--git-commit-verify', 'Run pre-commit hooks when auto-committing')
    .option('--attribute-co-authored-by', 'Add Co-authored-by trailer to AI commits (default)')
    .option('--attribute-author', 'Override git author for AI commits')
    // Repo map flags
    .option('--map-tokens <n>', 'Repo map token budget (default: 2000; set to 0 to disable)')
    .action(async (opts: InteractiveOptions) => {
      try {
        const workdir = process.cwd();
        let gitManager: ReturnType<typeof createAutoCommitManager> | undefined;

        // Commander's --no-auto-commits sets opts.autoCommits = false (default: true)
        if (opts.autoCommits !== false) {
          const gitConfig = await loadGitConfig(workdir);

          // Commander's --no-dirty-commits sets opts.dirtyCommits = false
          if (opts.dirtyCommits === false) gitConfig.dirtyCommits = false;
          if (opts.gitCommitVerify) gitConfig.commitVerify = true;
          if (opts.attributeAuthor) gitConfig.attribution.style = 'author';
          else if (opts.attributeCoAuthoredBy) gitConfig.attribution.style = 'co-authored-by';

          gitManager = createAutoCommitManager(workdir, gitConfig);

          if (gitConfig.dirtyCommits) {
            const dirtyResult = await commitDirtyFiles(workdir, gitConfig);
            if (dirtyResult.committed) {
              console.log(
                `[Git] Committed ${dirtyResult.filesCommitted.length} pre-existing dirty file(s): ${dirtyResult.hash}`
              );
            }
          }
        }

        // Set up repo map manager (enabled by default; disable with --map-tokens 0)
        const DEFAULT_MAP_TOKENS = 2000;
        const mapTokensBudget =
          opts.mapTokens !== undefined ? parseInt(opts.mapTokens, 10) : DEFAULT_MAP_TOKENS;
        let repoMapManager: RepoMapManager | undefined;
        if (!isNaN(mapTokensBudget) && mapTokensBudget > 0) {
          repoMapManager = new RepoMapManager(workdir, { maxTokens: mapTokensBudget });
        }

        await startInteractive({
          model: opts.model,
          autoRoute: opts.autoRoute,
          preferCheap: opts.preferCheap,
          session: opts.session,
          systemPrompt: opts.system,
          gitManager,
          repoMapManager,
        });
      } catch (e) {
        console.error(String(e));
        process.exit(1);
      }
    });
}
