/**
 * /reload-skills — re-scan skill directories and refresh the active registry.
 *
 * No arguments. Prints a one-line summary of added/removed/total counts.
 *
 * Mirrors the SessionStart hook `reloadSkills` follow-up but exposes it as an
 * interactive slash command so users can pull in newly installed skills
 * without restarting the session.
 */

import { reloadSkills } from '../skill/index.js';

/**
 * Re-scan skill directories rooted at `workdir` and produce a human-readable
 * summary suitable for echoing back to the TUI / REPL.
 */
export async function runReloadSkills(workdir: string): Promise<string> {
  const { added, removed, total } = reloadSkills(workdir);
  return `Skills reloaded: +${added} added, -${removed} removed, ${total} total.`;
}
