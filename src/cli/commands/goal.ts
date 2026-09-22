/**
 * Goal command — inspect, set, and clear the persistent multi-turn goal
 * on a session (issue #1804).
 *
 * Usage:
 *   alexi goal set <description> [--target <target>] [--session <id>]
 *   alexi goal status [--session <id>]
 *   alexi goal clear [--session <id>]
 *
 * When `--session <id>` is omitted, the command operates on the most
 * recently updated session (by `listSessions()` order). This mirrors the
 * "current" session semantics used by `alexi chat` / `alexi sessions`.
 */

import type { Command } from 'commander';
import { SessionManager, type SessionGoal } from '../../core/sessionManager.js';
import { SessionGoalUpdated } from '../../bus/index.js';

/**
 * Publish a `SessionGoalUpdated` bus event; swallows publish failures so
 * they never surface as a CLI error (worst case the TUI misses one update).
 */
function publishGoalUpdate(sessionId: string, goal: SessionGoal | null): void {
  try {
    SessionGoalUpdated.publish({
      sessionId,
      description: goal ? goal.description : null,
      target: goal?.target ?? null,
      armed: goal ? goal.armed : false,
      timestamp: Date.now(),
    });
  } catch {
    // Non-fatal.
  }
}

interface CommonOptions {
  session?: string;
}

interface SetOptions extends CommonOptions {
  target?: string;
}

/**
 * Resolve the target session id. When `sessionId` is provided we load it
 * verbatim; otherwise we return the most recently updated session. Returns
 * `null` when no sessions exist so the caller can render a friendly error.
 */
function resolveSessionId(
  sessionManager: SessionManager,
  sessionId: string | undefined
): string | null {
  if (sessionId) {
    return sessionId;
  }
  const [latest] = sessionManager.listSessions();
  return latest ? latest.id : null;
}

/**
 * Format a `SessionGoal` for CLI output. Kept as a plain helper so the
 * same formatter can be reused by future TUI slash commands.
 */
export function formatGoal(goal: SessionGoal | undefined): string {
  if (!goal) {
    return 'No goal set for this session.';
  }
  const lines: string[] = [];
  lines.push(`Goal: ${goal.description}`);
  if (goal.target) {
    lines.push(`Target: ${goal.target}`);
  }
  lines.push(`Armed: ${goal.armed ? 'yes' : 'no'}`);
  lines.push(`Created: ${new Date(goal.createdAt).toISOString()}`);
  return lines.join('\n');
}

/**
 * Result payload returned by the pure `setGoal` / `clearGoal` /
 * `statusGoal` helpers so the command's action handler can be exercised
 * in tests without spawning a Commander program.
 */
export interface GoalCommandResult {
  ok: boolean;
  sessionId?: string;
  goal?: SessionGoal;
  message: string;
}

export function setGoal(
  sessionManager: SessionManager,
  description: string,
  opts: SetOptions
): GoalCommandResult {
  const trimmed = description.trim();
  if (!trimmed) {
    return { ok: false, message: 'Goal description must not be empty.' };
  }

  const sessionId = resolveSessionId(sessionManager, opts.session);
  if (!sessionId) {
    return { ok: false, message: 'No sessions found. Start a chat before setting a goal.' };
  }
  const session = sessionManager.loadSession(sessionId);
  if (!session) {
    return { ok: false, message: `Session not found: ${sessionId}` };
  }

  const target = opts.target?.trim() ? opts.target.trim() : undefined;
  session.metadata.goal = {
    description: trimmed,
    target,
    armed: true,
    createdAt: Date.now(),
  };

  try {
    sessionManager.persistActiveSession();
  } catch (err) {
    return {
      ok: false,
      sessionId,
      message: `Failed to persist goal: ${err instanceof Error ? err.message : String(err)}`,
    };
  }

  publishGoalUpdate(sessionId, session.metadata.goal);

  return {
    ok: true,
    sessionId,
    goal: session.metadata.goal,
    message: `Goal armed on session ${sessionId.slice(0, 8)}:\n${formatGoal(session.metadata.goal)}`,
  };
}

export function clearGoal(sessionManager: SessionManager, opts: CommonOptions): GoalCommandResult {
  const sessionId = resolveSessionId(sessionManager, opts.session);
  if (!sessionId) {
    return { ok: false, message: 'No sessions found.' };
  }
  const session = sessionManager.loadSession(sessionId);
  if (!session) {
    return { ok: false, message: `Session not found: ${sessionId}` };
  }

  if (!session.metadata.goal) {
    return {
      ok: true,
      sessionId,
      message: `No goal set for session ${sessionId.slice(0, 8)}; nothing to clear.`,
    };
  }

  delete session.metadata.goal;
  try {
    sessionManager.persistActiveSession();
  } catch (err) {
    return {
      ok: false,
      sessionId,
      message: `Failed to persist goal clear: ${err instanceof Error ? err.message : String(err)}`,
    };
  }

  publishGoalUpdate(sessionId, null);

  return {
    ok: true,
    sessionId,
    message: `Cleared goal on session ${sessionId.slice(0, 8)}.`,
  };
}

export function statusGoal(sessionManager: SessionManager, opts: CommonOptions): GoalCommandResult {
  const sessionId = resolveSessionId(sessionManager, opts.session);
  if (!sessionId) {
    return { ok: false, message: 'No sessions found.' };
  }
  const session = sessionManager.loadSession(sessionId);
  if (!session) {
    return { ok: false, message: `Session not found: ${sessionId}` };
  }

  return {
    ok: true,
    sessionId,
    goal: session.metadata.goal,
    message: `Session ${sessionId.slice(0, 8)}:\n${formatGoal(session.metadata.goal)}`,
  };
}

export function registerGoalCommand(program: Command): void {
  const cmd = program.command('goal').description('Manage the persistent multi-turn goal');

  cmd
    .command('set <description>')
    .description('Arm a persistent goal on the target session')
    .option('--target <target>', 'Optional concrete completion target')
    .option('-s, --session <id>', 'Target session id (default: most recent)')
    .action((description: string, opts: SetOptions) => {
      const manager = new SessionManager();
      const result = setGoal(manager, description, opts);
      if (!result.ok) {
        console.error(result.message);
        process.exit(1);
      }
      console.log(result.message);
    });

  cmd
    .command('status')
    .description('Show the active goal on the target session')
    .option('-s, --session <id>', 'Target session id (default: most recent)')
    .action((opts: CommonOptions) => {
      const manager = new SessionManager();
      const result = statusGoal(manager, opts);
      if (!result.ok) {
        console.error(result.message);
        process.exit(1);
      }
      console.log(result.message);
    });

  cmd
    .command('clear')
    .description('Clear the active goal on the target session')
    .option('-s, --session <id>', 'Target session id (default: most recent)')
    .action((opts: CommonOptions) => {
      const manager = new SessionManager();
      const result = clearGoal(manager, opts);
      if (!result.ok) {
        console.error(result.message);
        process.exit(1);
      }
      console.log(result.message);
    });
}
