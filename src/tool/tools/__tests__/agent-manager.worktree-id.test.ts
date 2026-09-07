/**
 * Regression test for agent-manager `worktreeId` handling.
 *
 * Ports upstream opencode's 2026-09 addition of a `worktreeID` start
 * parameter that targets an existing managed worktree returned by
 * `action: "list"`. Alexi does not yet track managed worktrees in-process
 * so the current handler surfaces a clear "not available in this build"
 * error rather than silently falling through to the caller's cwd. These
 * tests lock in:
 *   - Schema-level validation: blank / whitespace-only rejected, only
 *     valid on `action=create`.
 *   - Runtime capability gating: a valid `worktreeId` on `create`
 *     produces an explanatory error, not a silent success.
 *   - Backward compat: `create` without `worktreeId` still succeeds.
 */
import { describe, it, expect } from 'vitest';
import type { ToolContext } from '../../index.js';

describe('agent-manager tool — worktreeId parameter', () => {
  it('accepts create without worktreeId (backward compat)', async () => {
    const { agentManagerTool } = await import('../agent-manager.js');
    const context: ToolContext = { workdir: process.cwd() };

    const result = await agentManagerTool.executeUnsafe({ action: 'create' }, context);

    expect(result.success).toBe(true);
    expect(result.data?.action).toBe('create');
  });

  it('rejects a blank worktreeId at the schema layer', async () => {
    const { agentManagerTool } = await import('../agent-manager.js');
    const context: ToolContext = { workdir: process.cwd() };

    const result = await agentManagerTool.executeUnsafe(
      { action: 'create', worktreeId: '   ' },
      context
    );

    expect(result.success).toBe(false);
    expect(result.error ?? '').toMatch(/Invalid parameters/i);
  });

  it('rejects worktreeId on non-create actions at the schema layer', async () => {
    const { agentManagerTool } = await import('../agent-manager.js');
    const context: ToolContext = { workdir: process.cwd() };

    const result = await agentManagerTool.executeUnsafe(
      { action: 'list', worktreeId: 'wt-abc' },
      context
    );

    expect(result.success).toBe(false);
    expect(result.error ?? '').toMatch(/Invalid parameters/i);
  });

  it('surfaces a capability error when create is called with a valid worktreeId', async () => {
    const { agentManagerTool } = await import('../agent-manager.js');
    const context: ToolContext = { workdir: process.cwd() };

    const result = await agentManagerTool.executeUnsafe(
      { action: 'create', worktreeId: 'wt-abc' },
      context
    );

    // Managed-worktree tracking is not implemented in this build, so the
    // handler must fail loudly rather than silently ignore the field.
    expect(result.success).toBe(false);
    expect(result.error ?? '').toMatch(/Managed worktrees are not available/i);
    expect(result.error ?? '').toContain('wt-abc');
  });
});
