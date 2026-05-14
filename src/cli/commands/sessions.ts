/**
 * Session commands - manage conversation sessions
 */

import type { Command } from 'commander';
import { SessionManager } from '../../core/sessionManager.js';

export function registerSessionCommands(program: Command): void {
  // List all sessions
  program
    .command('sessions')
    .description('List saved sessions (filtered by current workspace by default)')
    .option('-a, --all', 'Show sessions from all workspaces')
    .action(async (opts: { all?: boolean }) => {
      try {
        const sessionManager = new SessionManager();
        const filter = opts.all ? undefined : { workdir: process.cwd() };
        const sessions = sessionManager.listSessions(filter);

        if (sessions.length === 0) {
          console.log(opts.all ? 'No sessions found' : 'No sessions found for current workspace');
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
