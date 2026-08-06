/**
 * Session commands - manage conversation sessions
 */

import type { Command } from 'commander';
import { SessionManager } from '../../core/sessionManager.js';

/**
 * JSON output shape for `alexi sessions --json` (public contract):
 *   {
 *     id: string,
 *     title: string | null,
 *     model: string | null,
 *     updatedAt: number,   // unix epoch milliseconds
 *     messageCount: number,
 *     totalTokens: number,
 *     workdir: string | null
 *   }
 */
export function registerSessionCommands(program: Command): void {
  // List all sessions
  program
    .command('sessions')
    .description(
      'List all saved sessions. Use --json to emit a stable JSON array ' +
        '({ id, title, model, updatedAt, messageCount, totalTokens, workdir }) for scripting. ' +
        'Use --here to filter to sessions created in the current directory, ' +
        '--workdir <dir> to filter to a specific directory, or --all (default) ' +
        'to list every saved session including legacy ones with no recorded workdir.'
    )
    .option('--json', 'Output sessions as JSON array')
    .option('--here', 'Only list sessions created in the current working directory')
    .option('--workdir <dir>', 'Only list sessions created in the specified directory')
    .option('--all', 'List all sessions (default behavior; explicit no-filter form)')
    .action(async (opts: { json?: boolean; here?: boolean; workdir?: string; all?: boolean }) => {
      try {
        if (opts.here && opts.workdir !== undefined) {
          console.error('Error: --here and --workdir are mutually exclusive');
          process.exit(1);
        }

        let filter: { workdir?: string } | undefined;
        if (opts.here) {
          filter = { workdir: process.cwd() };
        } else if (opts.workdir !== undefined) {
          filter = { workdir: opts.workdir };
        }

        const sessionManager = new SessionManager();
        const sessions = sessionManager.listSessions(filter);

        if (opts.json) {
          const out = sessions.map((s) => ({
            id: s.id,
            title: s.title || null,
            model: s.modelId ?? null,
            updatedAt: s.updated,
            messageCount: s.messageCount,
            totalTokens: s.totalTokens,
            workdir: s.workdir ?? null,
          }));
          console.log(JSON.stringify(out, null, 2));
          return;
        }

        if (sessions.length === 0) {
          console.log('No sessions found');
          return;
        }

        console.log('\n=== Saved Sessions ===\n');
        sessions.forEach((session) => {
          const date = new Date(session.updated).toLocaleString();
          const title = session.title || 'Untitled';
          console.log(`ID: ${session.id}`);
          console.log(`  Title: ${title}`);
          console.log(`  Updated: ${date}`);
          console.log(`  Messages: ${session.messageCount}, Tokens: ${session.totalTokens}`);
          console.log(`  Model: ${session.modelId || 'N/A'}`);
          console.log(`  Workdir: ${session.workdir || 'N/A'}`);
          console.log();
        });
      } catch (e) {
        console.error(String(e));
        process.exit(1);
      }
    });

  // Export session to markdown or JSON
  program
    .command('session-export')
    .requiredOption('-s, --session <id>', 'Session ID to export')
    .option('-o, --output <file>', 'Output file (defaults to stdout)')
    .option(
      '-f, --format <format>',
      'Export format: "markdown" (default) or "json" (preserves full metadata)',
      'markdown'
    )
    .description(
      'Export a session. Default format is markdown (human-readable); ' +
        'use --format json to emit machine-readable JSON preserving all ' +
        'message metadata (timestamps, tokens, reasoning, tool calls/results).'
    )
    .action(async (opts: { session: string; output?: string; format?: string }) => {
      try {
        const format = (opts.format || 'markdown').toLowerCase();
        if (format !== 'markdown' && format !== 'json') {
          console.error(`Error: invalid --format '${opts.format}'. Use 'markdown' or 'json'.`);
          process.exit(1);
        }

        const sessionManager = new SessionManager();
        const content =
          format === 'json'
            ? sessionManager.exportToJSON(opts.session)
            : sessionManager.exportToMarkdown(opts.session);

        if (opts.output) {
          const fs = await import('fs');
          fs.writeFileSync(opts.output, content, 'utf-8');
          console.log(`Session exported to ${opts.output}`);
        } else {
          console.log(content);
        }
      } catch (e) {
        console.error(String(e));
        process.exit(1);
      }
    });

  // Delete session
  program
    .command('session-delete')
    .requiredOption('-s, --session <id>', 'Session ID to delete')
    .description('Delete a session')
    .action(async (opts: { session: string }) => {
      try {
        const sessionManager = new SessionManager();
        const deleted = sessionManager.deleteSession(opts.session);

        if (deleted) {
          console.log(`Session ${opts.session} deleted`);
        } else {
          console.log(`Session ${opts.session} not found`);
        }
      } catch (e) {
        console.error(String(e));
        process.exit(1);
      }
    });
}
