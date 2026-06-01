/**
 * Shared helper for attaching per-directory AGENTS.md system-reminders to
 * file-touching tool results.
 *
 * Used by `read`, `edit`, `multiedit`, `write`, and `grep` so the relevant
 * `apps/<x>/AGENTS.md` rules reach the agent even when it edits a file
 * without reading it first.
 */

import * as path from 'path';
import type { ToolResult } from '../tool/index.js';
import { instructionsForPath } from './system.js';

/**
 * If `context.agentsMdSeen` is provided, walk parent directories of `absPath`
 * looking for AGENTS.md files and attach any new finds to
 * `result.metadata.systemReminders` as workdir-relative `source` entries.
 *
 * No-op when `context.agentsMdSeen` is absent (e.g. test harnesses, one-shot
 * CLI commands). The shared `agentsMdSeen` set is mutated by
 * `instructionsForPath` so subsequent calls in the same session won't
 * re-emit the same AGENTS.md.
 */
export function attachAgentsMdReminders<T>(
  result: ToolResult<T>,
  absPath: string,
  context: { workdir: string; agentsMdSeen?: Set<string> }
): void {
  if (!context.agentsMdSeen) {
    return;
  }

  const reminders = instructionsForPath(absPath, context.workdir, context.agentsMdSeen);
  if (reminders.length === 0) {
    return;
  }

  result.metadata = {
    ...(result.metadata ?? {}),
    systemReminders: reminders.map((r) => ({
      source: path.relative(context.workdir, r.path),
      content: r.content,
    })),
  };
}

/**
 * Multi-path variant for tools like `grep` that touch many files in a single
 * call. Walks the unique parent directories of `absPaths` and attaches any
 * newly-discovered AGENTS.md to `result.metadata.systemReminders`. Dedup is
 * handled by the shared `context.agentsMdSeen` set across paths.
 */
export function attachAgentsMdRemindersForPaths<T>(
  result: ToolResult<T>,
  absPaths: Iterable<string>,
  context: { workdir: string; agentsMdSeen?: Set<string> }
): void {
  if (!context.agentsMdSeen) {
    return;
  }

  const collected: Array<{ source: string; content: string }> = [];
  const visitedDirs = new Set<string>();

  for (const absPath of absPaths) {
    const dir = path.dirname(path.resolve(absPath));
    if (visitedDirs.has(dir)) {
      continue;
    }
    visitedDirs.add(dir);

    const reminders = instructionsForPath(absPath, context.workdir, context.agentsMdSeen);
    for (const r of reminders) {
      collected.push({
        source: path.relative(context.workdir, r.path),
        content: r.content,
      });
    }
  }

  if (collected.length === 0) {
    return;
  }

  result.metadata = {
    ...(result.metadata ?? {}),
    systemReminders: [...(result.metadata?.systemReminders ?? []), ...collected],
  };
}
