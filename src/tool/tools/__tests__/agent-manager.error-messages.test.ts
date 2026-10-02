/**
 * Regression test for agent-manager validation error message quality.
 *
 * Ports upstream opencode's 2026-10 improvement to `worktreeID` validation
 * error messages. The upstream fix replaced the ambiguous
 * `"worktreeID requires mode local"` with a message that:
 *   - Echoes the received `worktreeID` value (helps the LLM see what it
 *     sent).
 *   - Explicitly tells the caller how to recover ("omit worktreeID or send
 *     JSON null").
 *
 * Alexi's analogue is the cross-field rule that rejects `worktreeId` on
 * any non-`create` action. These tests lock in the improved remediation
 * hint so a future refactor doesn't regress to a bare one-liner.
 */
import { describe, it, expect } from 'vitest';
import type { ToolContext } from '../../index.js';

describe('agent-manager tool — validation error messages', () => {
  it('includes the received worktreeId value in the error message', async () => {
    const { agentManagerTool } = await import('../agent-manager.js');
    const context: ToolContext = { workdir: process.cwd() };

    const result = await agentManagerTool.executeUnsafe(
      { action: 'list', worktreeId: 'wt-xyz-123' },
      context
    );

    expect(result.success).toBe(false);
    // Received value must appear in the error so the LLM can see what it
    // sent and self-correct instead of retrying the same payload.
    expect(result.error ?? '').toContain('wt-xyz-123');
  });

  it('includes a remediation hint telling the caller how to recover', async () => {
    const { agentManagerTool } = await import('../agent-manager.js');
    const context: ToolContext = { workdir: process.cwd() };

    const result = await agentManagerTool.executeUnsafe(
      { action: 'stop', worktreeId: 'wt-abc' },
      context
    );

    expect(result.success).toBe(false);
    // Must spell out the fix path so LLM callers can self-correct.
    expect(result.error ?? '').toMatch(/omit worktreeId or send JSON null/i);
  });

  it('names the offending action in the error message', async () => {
    const { agentManagerTool } = await import('../agent-manager.js');
    const context: ToolContext = { workdir: process.cwd() };

    const result = await agentManagerTool.executeUnsafe(
      { action: 'status', worktreeId: 'wt-abc', sessionId: 'session-1' },
      context
    );

    expect(result.success).toBe(false);
    expect(result.error ?? '').toContain('status');
  });
});
