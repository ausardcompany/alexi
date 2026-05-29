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
 *     totalTokens: number
 *   }
 */
export function registerSessionCommands(program: Command): void {
  // List all sessions
  program
    .command('sessions')
    .description(
      'List all saved sessions. Use --json to emit a stable JSON array ' +
        '({ id, title, model, updatedAt, messageCount, totalTokens }) for scripting.'
    )
    .option('--json', 'Output sessions as JSON array')
    .action(async (opts: { json?: boolean }) => {
      try {
        const sessionManager = new SessionManager();
        const sessions = sessionManager.listSessions();

        if (opts.json) {
          const out = sessions.map((s) => ({
            id: s.id,
            title: s.title || null,
            model: s.modelId ?? null,
            updatedAt: s.updated,
            messageCount: s.messageCount,
            totalTokens: s.totalTokens,
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
          console.log();
        });
      } catch (e) {
        console.error(String(e));
        process.exit(1);
      }
    });

  // Export session to markdown
  program
    .command('session-export')
    .requiredOption('-s, --session <id>', 'Session ID to export')
    .option('-o, --output <file>', 'Output file (defaults to stdout)')
    .description('Export session to markdown')
    .action(async (opts: { session: string; output?: string }) => {
      try {
        const sessionManager = new SessionManager();
        const markdown = sessionManager.exportToMarkdown(opts.session);

        if (opts.output) {
          const fs = await import('fs');
          fs.writeFileSync(opts.output, markdown, 'utf-8');
          console.log(`Session exported to ${opts.output}`);
        } else {
          console.log(markdown);
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
