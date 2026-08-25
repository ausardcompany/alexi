/**
 * Session output-budget accounting.
 *
 * Ports opencode `17611729e fix(cli): preserve output budget for
 * encrypted reasoning`. Some providers (SAP AI Core routed OpenAI o1
 * / o3 deployments, Claude with encrypted reasoning) return an
 * ENCRYPTED reasoning payload alongside the visible output. That
 * encrypted payload is provider-side state that never becomes visible
 * tokens the client can render, so it must NOT be deducted from the
 * `max_output_tokens` budget when Alexi decides whether the response
 * fits or has overflowed.
 *
 * Before this fix, `remaining = max - (output + reasoningEncrypted)`
 * caused premature truncation whenever a reasoning-heavy model burned
 * a large encrypted budget: Alexi would signal overflow and start
 * compaction even though the user's visible output was well under the
 * limit.
 */

export interface OutputBudgetUsage {
  /** Visible output tokens consumed so far. */
  output: number;
  /**
   * Encrypted reasoning tokens the provider reports. Optional — most
   * providers/models do not surface this at all, in which case callers
   * simply omit it.
   */
  reasoningEncrypted?: number;
}

/**
 * Return the number of output tokens still available given a maximum
 * budget and the current usage. Encrypted-reasoning tokens are
 * DELIBERATELY excluded from the deduction — see the module comment
 * for why. The result is clamped to `>= 0` so callers never see a
 * negative budget on an overshoot.
 */
export function usableOutputBudget(max: number, used: OutputBudgetUsage): number {
  // Encrypted reasoning tokens are provider-side only; do not deduct
  // from the visible output budget.
  const spent = used.output;
  return Math.max(0, max - spent);
}
