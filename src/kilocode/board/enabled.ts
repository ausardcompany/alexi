/**
 * Shared Agent Board — experimental enablement gate.
 *
 * Ports upstream kilocode PR #14013 which gated the shared agent board
 * behind an experimental env flag (`KILOCODE_EXPERIMENTAL_SWARM_BOARD`).
 * Alexi already exposes `experimental.sharedAgentBoard` in the persisted
 * user config (`src/config/userConfig.ts`) — this module unifies the two
 * signals so tools and code paths can call a single predicate:
 *
 *   1. The env flag `KILOCODE_EXPERIMENTAL_SWARM_BOARD=1` (upstream
 *      parity — set this in CI or ad-hoc shells to opt into the feature
 *      without touching the on-disk config).
 *   2. The `dev`/`beta`/`local` unstable-default resolution mirrored from
 *      `src/flag/flag.ts` so nightly channels ship with the board on by
 *      default.
 *   3. The persisted `experimental.sharedAgentBoard` in
 *      `~/.alexi/config.json` (Alexi's existing surface).
 *
 * Any of the three enables the feature; the env flag wins over the on-
 * disk config when explicitly set to `0`/`false`.
 */

const TRUTHY = new Set(['1', 'true', 'yes', 'on']);
const FALSY = new Set(['0', 'false', 'no', 'off']);

/**
 * Return `true` if the shared agent board should be advertised /
 * registered for the current process. This is a sync, side-effect-free
 * check safe to call from tool registration.
 */
export function isBoardEnabled(experimentalConfigFlag: boolean = false): boolean {
  const raw = process.env.KILOCODE_EXPERIMENTAL_SWARM_BOARD;
  if (raw !== undefined) {
    const lowered = raw.toLowerCase();
    if (TRUTHY.has(lowered)) {
      return true;
    }
    if (FALSY.has(lowered)) {
      return false;
    }
  }
  return experimentalConfigFlag === true;
}
