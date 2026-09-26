/**
 * Session commands - manage conversation sessions
 */

import type { Command } from 'commander';
import { SessionManager } from '../../core/sessionManager.js';
import {
  applyRetentionPolicy,
  formatBytes,
  type RetentionPolicy,
} from '../../core/sessionRetention.js';

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
    .option(
      '--cleanup',
      'Run the session retention sweep now (deletes sessions older than retention.maxAgeDays)'
    )
    .action(
      async (opts: {
        json?: boolean;
        here?: boolean;
        workdir?: string;
        all?: boolean;
        search?: string;
        cleanup?: boolean;
      }) => {
        try {
          if (opts.cleanup) {
            const sessionManager = new SessionManager();
            const summary = sessionManager.cleanupExpiredSessions();
            const parts = [
              `Deleted ${summary.deleted} expired sessions`,
              `skipped ${summary.skipped} active/recent sessions`,
            ];
            if (summary.errors.length > 0) {
              parts.push(`${summary.errors.length} errors`);
            }
            console.log(`${parts.join(', ')}.`);
            for (const err of summary.errors) {
              console.error(err);
            }
            if (summary.errors.length > 0) {
              process.exit(1);
            }
            return;
          }

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
          //
          // Ports upstream opencode `627501673 fix(cli): list sessions across
          // all projects instead of crashing`: when the scoping/filter path
          // fails (e.g. FTS index missing, workdir stat error), fall back to
          // an unfiltered listing so `alexi sessions` degrades gracefully
          // across multi-project workspaces instead of crashing.
          let sessions;
          try {
            sessions = opts.search
              ? sessionManager.searchSessions(opts.search, filter)
              : sessionManager.listSessions(filter);
          } catch (scopeErr) {
            console.error(
              `Warning: scoped session listing failed (${String(scopeErr)}); falling back to all sessions`
            );
            sessions = sessionManager.listSessions();
          }

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

  // Manual retention cleanup. Complements the automatic age-only sweep in
  // `SessionManager.cleanupExpiredSessions`: this subcommand supports
  // age-based AND count-based cleanup plus a dry-run preview mode, so
  // operators can reclaim disk space on demand without waiting for the
  // 24h scheduler cooldown. Uses `sessions-clean` (hyphenated) to match
  // the shape of the existing `sessions-search`, `session-export`, and
  // `session-delete` subcommands registered above.
  program
    .command('sessions-clean')
    .description(
      'Delete expired sessions from ~/.alexi/sessions/ using age and/or count policies. ' +
        'Use --dry-run to preview what would be deleted. Use --max-age to delete sessions ' +
        'older than N days (default: 30). Use --max-count to keep only the N most recent ' +
        'sessions per project (default: 100). Use --project to limit cleanup to a single ' +
        'project bucket. Use --exclude to protect sessions whose id or title matches a glob.'
    )
    .option('--dry-run', 'Preview deletions without removing any files')
    .option(
      '--max-age <days>',
      'Delete sessions older than N days (default: 30). Pass 0 to skip age-based cleanup.',
      (v) => parseInt(v, 10),
      30
    )
    .option(
      '--max-count <n>',
      'Keep only the N most recent sessions per project (default: 100). Pass 0 to skip count-based cleanup.',
      (v) => parseInt(v, 10),
      100
    )
    .option('--project <name>', 'Limit cleanup to a specific project bucket')
    .option(
      '--exclude <pattern>',
      'Glob to exclude sessions by id or title (repeatable)',
      (value: string, previous: string[] = []) => previous.concat([value]),
      [] as string[]
    )
    .option('--json', 'Emit the retention result as JSON')
    .action(
      async (opts: {
        dryRun?: boolean;
        maxAge?: number;
        maxCount?: number;
        project?: string;
        exclude?: string[];
        json?: boolean;
      }) => {
        try {
          const policy: RetentionPolicy = {};

          if (typeof opts.maxAge === 'number' && Number.isFinite(opts.maxAge) && opts.maxAge > 0) {
            policy.maxAgeDays = Math.floor(opts.maxAge);
          } else if (opts.maxAge !== undefined && opts.maxAge !== 0) {
            console.error(
              `Error: --max-age must be a non-negative integer (got '${String(opts.maxAge)}')`
            );
            process.exit(1);
          }

          if (
            typeof opts.maxCount === 'number' &&
            Number.isFinite(opts.maxCount) &&
            opts.maxCount > 0
          ) {
            policy.maxCountPerProject = Math.floor(opts.maxCount);
          } else if (opts.maxCount !== undefined && opts.maxCount !== 0) {
            console.error(
              `Error: --max-count must be a non-negative integer (got '${String(opts.maxCount)}')`
            );
            process.exit(1);
          }

          if (typeof opts.project === 'string' && opts.project.trim().length > 0) {
            policy.project = opts.project.trim();
          }

          if (Array.isArray(opts.exclude) && opts.exclude.length > 0) {
            policy.excludePatterns = opts.exclude;
          }

          if (opts.dryRun) {
            policy.dryRun = true;
          }

          if (policy.maxAgeDays === undefined && policy.maxCountPerProject === undefined) {
            console.error(
              'Error: at least one of --max-age or --max-count must be positive (both were 0)'
            );
            process.exit(1);
          }

          const result = await applyRetentionPolicy(policy);

          if (opts.json) {
            console.log(JSON.stringify(result, null, 2));
            if (result.errors.length > 0) {
              process.exit(1);
            }
            return;
          }

          const verb = result.dryRun ? 'Would delete' : 'Deleted';
          const kept = result.skipped.length;
          console.log(
            `${verb} ${result.deleted.length} sessions (${formatBytes(result.bytesFreed)})` +
              (kept > 0 ? `, skipped ${kept}` : '') +
              (result.errors.length > 0 ? `, ${result.errors.length} errors` : '') +
              '.'
          );

          if (result.dryRun && result.deleted.length > 0) {
            for (const filePath of result.deleted) {
              console.log(`  would delete: ${filePath}`);
            }
          }

          for (const err of result.errors) {
            console.error(err);
          }

          if (result.errors.length > 0) {
            process.exit(1);
          }
        } catch (e) {
          console.error(String(e));
          process.exit(1);
        }
      }
    );

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
