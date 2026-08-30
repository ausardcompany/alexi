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
        'to list every saved session including legacy ones with no recorded workdir. ' +
        'Use --search <query> to run an FTS5-ranked search against session titles ' +
        '(e.g. --search "api refactor", --search "openai OR anthropic", --search "auth*"); ' +
        'results are ordered by relevance instead of chronologically.'
    )
    .option('--json', 'Output sessions as JSON array')
    .option('--here', 'Only list sessions created in the current working directory')
    .option('--workdir <dir>', 'Only list sessions created in the specified directory')
    .option('--all', 'List all sessions (default behavior; explicit no-filter form)')
    .option(
      '--search <query>',
      'FTS5-ranked search across session titles (empty query lists chronologically)'
    )
    .action(
      async (opts: {
        json?: boolean;
        here?: boolean;
        workdir?: string;
        all?: boolean;
        search?: string;
      }) => {
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
          // When --search is provided, delegate to the FTS-indexed path.
          // Otherwise fall back to the eager filesystem scan so callers
          // without a working SQLite binding keep the historical behaviour.
          const sessions = opts.search
            ? sessionManager.searchSessions(opts.search, filter)
            : sessionManager.listSessions(filter);

          if (opts.json) {
            const out = sessions.map((s) => ({
              id: s.id,
              title: s.title || null,
              model: s.modelId ?? null,
              updatedAt: s.updated,
              messageCount: s.messageCount,
              totalTokens: s.totalTokens,
              workdir: s.workdir ?? null,
              ...('score' in s && typeof s.score === 'number' ? { score: s.score } : {}),
              ...('snippet' in s && typeof s.snippet === 'string' ? { snippet: s.snippet } : {}),
            }));
            console.log(JSON.stringify(out, null, 2));
            return;
          }

          if (sessions.length === 0) {
            console.log(opts.search ? `No sessions match "${opts.search}"` : 'No sessions found');
            return;
          }

          console.log(opts.search ? '\n=== Search Results ===\n' : '\n=== Saved Sessions ===\n');
          sessions.forEach((session) => {
            const date = new Date(session.updated).toLocaleString();
            const title = session.title || 'Untitled';
            console.log(`ID: ${session.id}`);
            console.log(`  Title: ${title}`);
            console.log(`  Updated: ${date}`);
            console.log(`  Messages: ${session.messageCount}, Tokens: ${session.totalTokens}`);
            console.log(`  Model: ${session.modelId || 'N/A'}`);
            console.log(`  Workdir: ${session.workdir || 'N/A'}`);
            if ('score' in session && typeof session.score === 'number') {
              console.log(`  Score: ${session.score.toFixed(3)}`);
            }
            if ('snippet' in session && typeof session.snippet === 'string') {
              console.log(`  Snippet: ${session.snippet}`);
            }
            console.log();
          });
        } catch (e) {
          console.error(String(e));
          process.exit(1);
        }
      }
    );

  // Dedicated `sessions search <query>` subcommand. Mirrors the
  // `sessions --search <query>` flag but reads more naturally in shell
  // history and completion (`ax sessions search "react hooks"`). Both
  // paths share the same FTS index and produce the same output shape.
  program
    .command('sessions-search <query>')
    .description(
      'Full-text search saved sessions by title and message content. ' +
        'Results are ranked by FTS5 bm25 (most relevant first) and include a ' +
        'short snippet of the matched text. Use --json for machine-readable ' +
        'output identical to `sessions --search`.'
    )
    .option('--json', 'Output results as JSON array')
    .option('--here', 'Only search sessions created in the current working directory')
    .option('--workdir <dir>', 'Only search sessions created in the specified directory')
    .option('--limit <n>', 'Maximum number of results to return', (v) => parseInt(v, 10))
    .action(
      async (
        query: string,
        opts: { json?: boolean; here?: boolean; workdir?: string; limit?: number }
      ) => {
        try {
          if (opts.here && opts.workdir !== undefined) {
            console.error('Error: --here and --workdir are mutually exclusive');
            process.exit(1);
          }

          const filter: { workdir?: string; limit?: number } = {};
          if (opts.here) {
            filter.workdir = process.cwd();
          } else if (opts.workdir !== undefined) {
            filter.workdir = opts.workdir;
          }
          if (typeof opts.limit === 'number' && !Number.isNaN(opts.limit)) {
            filter.limit = opts.limit;
          }

          const sessionManager = new SessionManager();
          const sessions = sessionManager.searchSessions(query, filter);

          if (opts.json) {
            const out = sessions.map((s) => ({
              id: s.id,
              title: s.title || null,
              model: s.modelId ?? null,
              updatedAt: s.updated,
              messageCount: s.messageCount,
              totalTokens: s.totalTokens,
              workdir: s.workdir ?? null,
              ...('score' in s && typeof s.score === 'number' ? { score: s.score } : {}),
              ...('snippet' in s && typeof s.snippet === 'string' ? { snippet: s.snippet } : {}),
            }));
            console.log(JSON.stringify(out, null, 2));
            return;
          }

          if (sessions.length === 0) {
            console.log(`No sessions match "${query}"`);
            return;
          }

          console.log('\n=== Search Results ===\n');
          sessions.forEach((session) => {
            const date = new Date(session.updated).toLocaleString();
            const title = session.title || 'Untitled';
            console.log(`ID: ${session.id}`);
            console.log(`  Title: ${title}`);
            console.log(`  Updated: ${date}`);
            console.log(`  Messages: ${session.messageCount}, Tokens: ${session.totalTokens}`);
            console.log(`  Model: ${session.modelId || 'N/A'}`);
            console.log(`  Workdir: ${session.workdir || 'N/A'}`);
            if ('score' in session && typeof session.score === 'number') {
              console.log(`  Score: ${session.score.toFixed(3)}`);
            }
            if ('snippet' in session && typeof session.snippet === 'string') {
              console.log(`  Snippet: ${session.snippet}`);
            }
            console.log();
          });
        } catch (e) {
          console.error(String(e));
          process.exit(1);
        }
      }
    );

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
