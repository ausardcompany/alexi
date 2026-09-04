/**
 * Regression tests for subagent survival after permission denial.
 *
 * Ports upstream opencode fix #13744 (commit `4b85267ae`): denying a
 * permission prompt inside a subagent must NOT tear down the subagent.
 * The tool call fails with a scoped denial error and the subagent's
 * agent loop continues so it can choose a different action (or return a
 * best-effort answer).
 *
 * Alexi's tool executor already routes permission denials through
 * `{ success: false, error }` in `src/tool/index.ts` — this test
 * pins that contract so a future refactor cannot regress it by
 * accidentally raising a fatal exception from the denial path.
 *
 * Important for SAP AI Core deployments: permission prompts are common
 * in guarded enterprise environments; a fatal denial would otherwise
 * take down the whole subagent every time an operator says "no" to a
 * routine `bash` call.
 */

import { describe, expect, it, beforeEach } from 'vitest';
import { z } from 'zod';
import { defineTool } from '../tool/index.js';
import {
  PermissionManager,
  setPermissionManager,
  type PermissionRule,
} from '../permission/index.js';

// A minimal deny-everything ruleset targeted at a specific tool name. Using
// a real `PermissionManager` (rather than mocking `check()`) guarantees the
// test exercises the same code path as production.
function denyAllRulesFor(toolName: string): PermissionRule[] {
  return [
    {
      id: `deny-${toolName}`,
      tools: [toolName],
      decision: 'deny',
      priority: 1000,
    },
  ];
}

describe('subagent permission denial does not terminate the subagent', () => {
  beforeEach(() => {
    // Reset the global permission manager between cases; otherwise rules
    // leak across tests and the deny-everything ruleset stays hot.
    setPermissionManager(new PermissionManager([]));
  });

  it('returns a scoped tool-error result instead of throwing when denied', async () => {
    setPermissionManager(new PermissionManager(denyAllRulesFor('write')));

    const writeTool = defineTool({
      name: 'write',
      description: 'test write tool',
      parameters: z.object({ path: z.string() }),
      permission: {
        action: 'write',
        getResource: (params) => params.path,
      },
      async execute() {
        // Should never run — permission gate rejects first.
        return { success: true, data: { wrote: true } };
      },
    });

    const result = await writeTool.execute(
      { path: 'test.txt' },
      { workdir: process.cwd(), subagentDepth: 1 }
    );

    // The subagent-runner-visible contract: a denial is a FAILED tool call,
    // not a thrown error. The subagent loop can observe `success: false`,
    // record the denial in its transcript, and keep running.
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
    expect(result.error).toMatch(/write/i);
  });

  it('lets the subagent continue after a denied tool call', async () => {
    // Denies `write` but allows a follow-up read-only tool. The subagent
    // logic (simulated as a sequential loop below) must be able to
    // observe the denial and still complete the next tool call.
    setPermissionManager(new PermissionManager(denyAllRulesFor('write')));

    const writeTool = defineTool({
      name: 'write',
      description: 'test write tool',
      parameters: z.object({ path: z.string() }),
      permission: { action: 'write', getResource: (params) => params.path },
      async execute() {
        return { success: true, data: { wrote: true } };
      },
    });

    const readTool = defineTool({
      name: 'read-test',
      description: 'test read tool',
      parameters: z.object({ path: z.string() }),
      async execute(params) {
        return { success: true, data: { path: params.path, content: 'ok' } };
      },
    });

    const ctx = { workdir: process.cwd(), subagentDepth: 1 };

    // Step 1: denied write — subagent observes a failure but does not abort.
    const denied = await writeTool.execute({ path: 'a.txt' }, ctx);
    expect(denied.success).toBe(false);

    // Step 2: the same "subagent" proceeds to a permitted read — this
    // simulates the agent loop choosing a different action after seeing
    // the denial in step 1.
    const read = await readTool.execute({ path: 'a.txt' }, ctx);
    expect(read.success).toBe(true);
    expect(read.data?.content).toBe('ok');
  });
});
