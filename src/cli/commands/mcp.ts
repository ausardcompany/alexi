/**
 * MCP command — install and manage Model Context Protocol servers.
 *
 * The initial surface is `ax mcp install <repo-url>`, which clones an
 * MCP plugin from a git repository into `~/.alexi/mcp-plugins/<name>/`
 * and registers it in `~/.alexi/mcp-servers.json`. Additional
 * subcommands (list, remove, refresh) will follow as separate PRs.
 */

import type { Command } from 'commander';

import { installGitMCPPlugin, type InstallGitMcpOptions } from '../../mcp/git-installer.js';

/** Options exposed by `ax mcp install <repo-url>`. */
export interface McpInstallCliOptions {
  name?: string;
  branch?: string;
  autoUpdate?: boolean;
  force?: boolean;
  noAutoConnect?: boolean;
}

/**
 * Register the `mcp` command tree on the CLI program.
 */
export function registerMcpCommand(program: Command): void {
  const cmd = program.command('mcp').description('Manage Model Context Protocol (MCP) servers');

  cmd
    .command('install <repo-url>')
    .description(
      'Install an MCP server from a git repository (GitHub / GitLab / Bitbucket, HTTPS, or SSH)'
    )
    .option('--name <name>', 'Custom plugin name (defaults to repo slug)')
    .option('--branch <branch>', 'Git branch or tag to clone')
    .option('--auto-update', 'Enable auto-update on refresh (default: false)')
    .option('--force', 'Overwrite an existing plugin directory')
    .option('--no-auto-connect', 'Do not auto-connect this server on session startup')
    .action(async (repoUrl: string, cliOptions: McpInstallCliOptions) => {
      const options: InstallGitMcpOptions = {
        name: cliOptions.name,
        branch: cliOptions.branch,
        autoUpdate: cliOptions.autoUpdate ?? false,
        force: cliOptions.force ?? false,
        // Commander stores `--no-auto-connect` as `autoConnect: false`.
        autoConnect: (cliOptions as { autoConnect?: boolean }).autoConnect ?? true,
        onProgress: (message) => {
          process.stdout.write(`${message}\n`);
        },
      };

      try {
        const result = await installGitMCPPlugin(repoUrl, options);
        process.stdout.write(
          `Installed MCP plugin '${result.server.name}' from ${result.parsed.url}\n`
        );
        process.stdout.write(`  Path:    ${result.pluginPath}\n`);
        process.stdout.write(`  Command: ${result.server.command}\n`);
        if (result.server.args && result.server.args.length > 0) {
          process.stdout.write(`  Args:    ${result.server.args.join(' ')}\n`);
        }
        process.stdout.write(`  Source:  ${result.entry.source}\n`);
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        process.stderr.write(`Error: ${message}\n`);
        process.exit(1);
      }
    });
}
