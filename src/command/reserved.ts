/**
 * Reserved command-name registry.
 *
 * Backports upstream opencode commits 47151ca0c and b4b51f252
 * (`packages/opencode/src/kilocode/command/reserved.ts`) which fix a bug
 * where a user-defined command claiming a reserved name silently disabled
 * ALL slash commands. Reserved clashes should surface as a config warning
 * but not drop the rest of the command table.
 */

/**
 * Names that cannot be re-used by user- or plugin-defined slash commands.
 * These are either Alexi's REPL/TUI built-ins or widely-expected slash
 * verbs (help/exit/quit/clear/new) that users rely on.
 */
export const RESERVED_COMMAND_NAMES: ReadonlySet<string> = new Set([
  'help',
  'exit',
  'quit',
  'clear',
  'new',
  'session',
  'sessions',
  'model',
  'models',
  'agent',
  'agents',
  'reload',
  'context',
  'notes',
  'stages',
  'dod',
  'plugin',
  'generate',
  'explain',
  'chat',
  'interactive',
  'server',
  'revert',
]);

export interface ReservedClash {
  name: string;
  source: string; // e.g. plugin id or config path
}

/**
 * Split a list of candidate commands into those that are safe to register
 * and those whose names clash with the reserved registry. Reserved clashes
 * are returned so the caller can emit a warning per clash — they are NOT
 * silently merged, overwritten, or allowed to disable the rest of the set.
 */
export function partitionReservedCommands<T extends { name: string; source?: string }>(
  commands: T[]
): { kept: T[]; clashes: ReservedClash[] } {
  const kept: T[] = [];
  const clashes: ReservedClash[] = [];
  for (const cmd of commands) {
    if (RESERVED_COMMAND_NAMES.has(cmd.name)) {
      clashes.push({ name: cmd.name, source: cmd.source ?? 'unknown' });
      continue;
    }
    kept.push(cmd);
  }
  return { kept, clashes };
}
