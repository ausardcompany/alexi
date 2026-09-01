/**
 * Regression test for agent-manager JSON-encoded params tolerance.
 *
 * Ports the intent of upstream kilocode commit `02df76976`
 * (`fix(agent-manager): decode JSON-encoded task arrays`): some models
 * (Anthropic in particular) emit structured tool-call params as JSON
 * strings rather than native objects. Alexi's `agent-manager` tool
 * doesn't take a `tasks: array` — the closest structural field is
 * `config` — so this test verifies that the tool tolerates a JSON-encoded
 * `config` string exactly the way a native object is tolerated.
 */
import { describe, it, expect } from 'vitest';
import type { ToolContext } from '../../index.js';

describe('agent-manager tool — JSON-encoded config tolerance', () => {
  it('accepts a JSON-encoded config string on create', async () => {
    const { agentManagerTool } = await import('../agent-manager.js');
    const context: ToolContext = { workdir: process.cwd() };

    const result = await agentManagerTool.executeUnsafe(
      // Intentionally pass `config` as a JSON string — some models
      // over-encode structured params this way. The preprocessor should
      // decode it before Zod validation and the schema should accept it.
      {
        action: 'create',
        config: JSON.stringify({ excludeLocalState: true }) as unknown as {
          excludeLocalState?: boolean;
        },
      },
      context
    );

    expect(result.success).toBe(true);
    expect(result.data?.action).toBe('create');
    expect(result.data?.session?.status).toBe('created-fresh');
  });

  it('accepts a native config object on create (regression)', async () => {
    const { agentManagerTool } = await import('../agent-manager.js');
    const context: ToolContext = { workdir: process.cwd() };

    const result = await agentManagerTool.executeUnsafe(
      { action: 'create', config: { excludeLocalState: false } },
      context
    );

    expect(result.success).toBe(true);
    expect(result.data?.session?.status).toBe('created');
  });

  it('accepts a missing / null config on list', async () => {
    const { agentManagerTool } = await import('../agent-manager.js');
    const context: ToolContext = { workdir: process.cwd() };

    const missing = await agentManagerTool.executeUnsafe({ action: 'list' }, context);
    expect(missing.success).toBe(true);

    const nulled = await agentManagerTool.executeUnsafe(
      { action: 'list', config: null as unknown as undefined },
      context
    );
    expect(nulled.success).toBe(true);
  });
});
