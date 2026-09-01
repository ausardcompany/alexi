import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { z } from 'zod';

import { defineTool } from '../src/tool/index.js';
import {
  PermissionManager,
  USER_REJECTION_GUIDANCE_SUFFIX,
  buildUserRejectedToolReason,
  getPermissionManager,
  setPermissionManager,
} from '../src/permission/index.js';

/**
 * Integration test for issue #1616. Verifies that when the permission
 * manager denies a tool call, the tool wrapper in `src/tool/index.ts`
 * surfaces the standardized rejection message (via
 * `buildUserRejectedToolReason`) rather than an ad-hoc string.
 */
describe('tool wrapper user-rejection messaging', () => {
  const originalManager = getPermissionManager();

  beforeEach(() => {
    // Install a permission manager whose only rule is a deny for our
    // synthetic tool, so `check()` returns `granted: false` deterministically.
    const denyingManager = new PermissionManager([
      {
        tools: ['synthetic_reject_tool'],
        decision: 'deny',
        priority: 100,
      },
    ]);
    setPermissionManager(denyingManager);
  });

  afterEach(() => {
    setPermissionManager(originalManager);
  });

  it('routes permission denial through buildUserRejectedToolReason', async () => {
    const tool = defineTool({
      name: 'synthetic_reject_tool',
      description: 'Test tool used to assert rejection messaging',
      parameters: z.object({ path: z.string() }),
      permission: {
        action: 'write',
        getResource: (params) => params.path,
      },
      execute: async () => ({ success: true, data: 'should not run' }),
    });

    const result = await tool.execute({ path: '/tmp/foo' }, { workdir: '/tmp' });

    expect(result.success).toBe(false);
    // The LLM-facing error must name the tool that was rejected.
    expect(result.error).toContain('User rejected synthetic_reject_tool');
    // It must include the resource + action so the model can reason about
    // what specifically was blocked.
    expect(result.error).toContain('write on /tmp/foo');
    // And it must carry the guidance suffix so the model does not treat
    // this as a system failure.
    expect(result.error).toContain(USER_REJECTION_GUIDANCE_SUFFIX);
    // Exact-match sanity check: the wrapper should produce byte-identical
    // output to a direct call of the helper for the same tool / reason.
    expect(result.error).toBe(
      buildUserRejectedToolReason('synthetic_reject_tool', 'write on /tmp/foo')
    );
  });

  it('does not emit the legacy "Permission denied:" prefix', async () => {
    // Regression: prior implementation produced
    //   "Permission denied: write on /tmp/foo"
    // which the LLM misread as a system error. Guard against a regression.
    const tool = defineTool({
      name: 'synthetic_reject_tool',
      description: 'Test tool used to assert rejection messaging',
      parameters: z.object({ path: z.string() }),
      permission: {
        action: 'write',
        getResource: (params) => params.path,
      },
      execute: async () => ({ success: true, data: 'should not run' }),
    });

    const result = await tool.execute({ path: '/tmp/foo' }, { workdir: '/tmp' });
    expect(result.error).not.toMatch(/^Permission denied:/);
  });
});
