/**
 * Grep tool signal-controls integration point.
 *
 * The primary grep tool implementation lives in `./tools/grep.ts` (that is
 * where the ripgrep fast-path + JS fallback + tool registration sit). This
 * module is the plan-anchored surface for the upstream #12811 grep signal
 * controls: it re-exports the `applySignalControls` helper and its schema
 * types so callers can wire signal filtering into ad-hoc grep pipelines
 * (skills, plugins, subagents) without reaching into the tool internals.
 *
 * Kept intentionally thin so the primary grep tool can adopt the same
 * helper incrementally without a schema breaking change.
 */

export {
  applySignalControls,
  type GrepMatch,
  type GrepSignalControls,
} from './grep-signal-controls.js';
