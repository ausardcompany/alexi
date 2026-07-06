/**
 * Helpers for stripping Alexi-internal message wrappers from user-facing text.
 *
 * Two kinds of wrappers may appear in stored message content:
 *
 * - `<agent_switch from="X" to="Y"/>` — a self-closing marker prepended to
 *   the first outbound user turn after a `switchTo(...)` call. Signals the
 *   destination agent's model that a handover happened. Emitted by
 *   `agenticChat` and `streamingOrchestrator`.
 *
 * - `<system-reminder>...</system-reminder>` — a block wrapper used for
 *   AGENTS.md reminders, step-limit hints, and similar per-turn signals
 *   sent to the model. Emitted by `agenticChat`.
 *
 * These wrappers are useful for the model but should never be shown to a
 * human user (TUI display) or included in exported transcripts (session
 * export). This module provides a single `stripInternalWrappers(text)`
 * entrypoint used by both call sites.
 *
 * The stripper is IDEMPOTENT and preserves surrounding prose. It uses a
 * pair of single-shot regexes rather than an HTML parser to avoid pulling
 * in a dependency.
 */

// Match self-closing `<agent_switch ... />` markers with any attribute set.
// Case-sensitive on the tag name; attributes may span multiple lines.
const AGENT_SWITCH_RE = /<agent_switch\b[^>]*\/>/g;

// Match `<system-reminder ...>...</system-reminder>` blocks including
// multi-line bodies. Non-greedy body so consecutive blocks aren't merged.
const SYSTEM_REMINDER_RE = /<system-reminder\b[^>]*>[\s\S]*?<\/system-reminder>/g;

/**
 * Remove `<agent_switch/>` self-closing markers and
 * `<system-reminder>...</system-reminder>` blocks from `text`.
 *
 * - Idempotent: calling it on already-clean text returns the input.
 * - Preserves whitespace around removed wrappers; the caller is responsible
 *   for any secondary trimming they need.
 * - Non-mutating: returns a new string.
 *
 * @param text The raw message content (may include wrappers).
 * @returns The same text with internal wrappers removed.
 */
export function stripInternalWrappers(text: string): string {
  if (!text) {
    return text;
  }
  return text.replace(AGENT_SWITCH_RE, '').replace(SYSTEM_REMINDER_RE, '');
}
