/**
 * `alexi revert` — session-wide snapshot revert.
 *
 * Rolls back every file edit made during one agent step by loading the
 * matching snapshot from `~/.alexi/sessions/<sessionId>/snapshots/` and
 * restoring `FileCheckpoint.originalContent` bytes to each recorded file.
 * Files that have been modified outside the agent since the snapshot are
 * skipped with reason `'modified-outside-agent'`.
 */

import type { Command } from 'commander';
import { SessionManager } from '../../core/sessionManager.js';
import { loadSnapshot, previewRevert, revertTo } from '../../core/snapshot.js';

export interface RevertOptions {
  session?: string;
  to: string;
  preview?: boolean;
  yes?: boolean;
}

/**
 * Resolve the session id: honour --session when provided, otherwise fall
 * back to the most recently updated session.
 */
export function resolveSessionId(explicit?: string): string | null {
  if (explicit) {
    return explicit;
  }
  const sessions = new SessionManager().listSessions();
  if (sessions.length === 0) {
    return null;
  }
  return sessions[0].id;
}

/**
 * Format a preview row for terminal output.
 */
function formatPreviewRow(
  filePath: string,
  exists: boolean,
  bytes: number,
  status: string
): string {
  return `${filePath}\t${exists ? 'yes' : 'no'}\t${bytes}\t${status}`;
}

/**
 * Core action for `alexi revert`. Exported for direct invocation from tests
 * so they can avoid spawning a child process. Returns the numeric exit code
 * the CLI should propagate; also writes user-facing output to
 * stdout/stderr via the provided IO handles (defaulting to process.*).
 */
export async function runRevert(
  opts: RevertOptions,
  io: {
    out: (s: string) => void;
    err: (s: string) => void;
  } = {
    out: (s: string) => process.stdout.write(s + '\n'),
    err: (s: string) => process.stderr.write(s + '\n'),
  }
): Promise<number> {
  if (!opts.to) {
    io.err('Error: --to <stepId> is required');
    return 1;
  }

  const sessionId = resolveSessionId(opts.session);
  if (!sessionId) {
    io.err('Error: no sessions found. Specify --session <id> explicitly.');
    return 1;
  }

  const snapshot = await loadSnapshot(sessionId, opts.to);
  if (!snapshot) {
    io.err(`Error: snapshot '${opts.to}' not found for session '${sessionId}'.`);
    return 1;
  }

  if (opts.preview) {
    io.out(`Snapshot ${snapshot.stepId} (session ${sessionId})`);
    io.out(`Tools: ${snapshot.toolCalls.join(', ') || '(none)'}`);
    io.out('filePath\texists\tbytes-to-restore\tstatus');
    for (const row of previewRevert(snapshot)) {
      io.out(
        formatPreviewRow(
          row.filePath,
          row.currentExists,
          row.willRestoreBytes,
          row.currentExists ? 'restorable' : 'file-missing'
        )
      );
    }
    return 0;
  }

  const result = await revertTo(snapshot);
  const skippedOutside = result.skipped.filter((s) => s.reason === 'modified-outside-agent').length;
  io.out(
    `restored ${result.restored.length} file(s), skipped ${skippedOutside} (outside-agent edits)`
  );
  if (result.skipped.length > skippedOutside) {
    // Surface non-outside-agent skip reasons on stderr so callers see them.
    for (const s of result.skipped) {
      if (s.reason !== 'modified-outside-agent') {
        io.err(`skipped ${s.filePath}: ${s.reason}`);
      }
    }
  }
  return 0;
}

export function registerRevertCommand(program: Command): void {
  program
    .command('revert')
    .description(
      'Revert every file edit made during one agent step by restoring the ' +
        'file bytes captured in the matching session snapshot. Files modified ' +
        'outside the agent since the snapshot are skipped.'
    )
    .option('--session <id>', 'Session id (defaults to the most recent session)')
    .requiredOption('--to <stepId>', 'Snapshot step id to revert to')
    .option('--preview', 'Print the per-file plan and exit without writing')
    .option('--yes', 'Skip the interactive confirm when not in a TTY')
    .action(async (opts: RevertOptions) => {
      const code = await runRevert(opts);
      if (code !== 0) {
        process.exit(code);
      }
    });
}
