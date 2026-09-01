import { describe, it, expect } from 'vitest';

import { buildUserRejectedToolReason, USER_REJECTION_GUIDANCE_SUFFIX } from '../index.js';

/**
 * Tests for issue #1616: standardized user-rejection tool messaging.
 *
 * The helper is the single source of truth for the LLM-facing text used
 * when a user (interactively, via TUI, via CLI prompt, or via a permission
 * rule the user configured) rejects a tool call. Every rejection surface
 * must route through the helper so the model consistently sees:
 *
 *   - the name of the tool that was rejected,
 *   - the optional reason the user gave (if any),
 *   - a guidance suffix clarifying that this is NOT a system error.
 */
describe('buildUserRejectedToolReason', () => {
  it('names the tool that was rejected', () => {
    expect(buildUserRejectedToolReason('shell')).toContain('User rejected shell');
  });

  it('appends the guidance suffix when no reason is provided', () => {
    const message = buildUserRejectedToolReason('write');
    expect(message).toContain(USER_REJECTION_GUIDANCE_SUFFIX);
    // No colon-separated reason clause should be present when the caller
    // omitted a reason — the head should be immediately followed by the
    // em-dash separator.
    expect(message).toBe(`User rejected write — ${USER_REJECTION_GUIDANCE_SUFFIX}`);
  });

  it('embeds the user-supplied reason when provided', () => {
    const message = buildUserRejectedToolReason('write', 'Not needed right now');
    expect(message).toBe(
      `User rejected write: Not needed right now — ${USER_REJECTION_GUIDANCE_SUFFIX}`
    );
  });

  it('trims whitespace-only reasons and treats them as absent', () => {
    const message = buildUserRejectedToolReason('bash', '   ');
    expect(message).toBe(`User rejected bash — ${USER_REJECTION_GUIDANCE_SUFFIX}`);
  });

  it('preserves internal whitespace in reasons while trimming edges', () => {
    const message = buildUserRejectedToolReason('bash', '  do not run rm -rf /  ');
    expect(message).toBe(
      `User rejected bash: do not run rm -rf / — ${USER_REJECTION_GUIDANCE_SUFFIX}`
    );
  });

  it('guidance suffix clarifies that rejection is not evidence of wrongdoing', () => {
    // Regression: the exact wording is part of the LLM prompt contract.
    // Changing it may alter model behaviour on rejection retries.
    expect(USER_REJECTION_GUIDANCE_SUFFIX).toContain(
      "The user's rejection is not evidence you did something wrong"
    );
    expect(USER_REJECTION_GUIDANCE_SUFFIX).toContain(
      'Consider waiting for further guidance before trying again'
    );
  });

  it('produces a single-line message safe to embed as a tool-result error', () => {
    const message = buildUserRejectedToolReason('shell', 'sandboxed git write: git push');
    // The message is fed back to the model in the `error` field of a
    // tool result — it must not contain newlines that could confuse
    // structured JSON serialization on the caller side.
    expect(message).not.toContain('\n');
  });
});
