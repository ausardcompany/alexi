/**
 * Regression tests for issue #765: ensure the bash tool result payload
 * never includes the input `command` string. Echoing the command back
 * doubles cached-turn token spend on heredoc-heavy workloads
 * (cline/cline#11463, commit 7f9d5461, 2026-06-11).
 *
 * NOTE: tests target src/tool/tools/bash.ts directly (not the shell.ts
 * alias) so that any future regression in either implementation is
 * caught independently.
 */

import { describe, it, expect } from 'vitest';
import { bashTool } from '../bash.js';
import type { ToolContext } from '../../index.js';

describe('bash tool — no command echo (issue #765)', () => {
  const context: ToolContext = {
    workdir: process.cwd(),
  };

  function uniqueMarker(prefix: string): string {
    const stamp = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    return `${prefix}-${stamp}-${'X'.repeat(80)}`;
  }

  it('(a) success path: simple echo command is not present in result.data', async () => {
    const marker = uniqueMarker('AX765-success-marker');
    const command = `: '${marker}'; echo hello`;

    const result = await bashTool.executeUnsafe({ command }, context);

    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
    expect(JSON.stringify(result.data)).not.toContain(marker);
    expect(result.data?.stdout.trim()).toBe('hello');
  });

  it('(b) heredoc payload (8 KB) does not appear in result.data', async () => {
    const heredocMarker = uniqueMarker('AX765-heredoc-marker');
    const big = 'X'.repeat(8192);
    const command = `cat > /dev/null <<'EOF'\n${heredocMarker}\n${big}\nEOF\n`;

    const result = await bashTool.executeUnsafe({ command }, context);

    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();

    const serialized = JSON.stringify(result.data);
    expect(serialized).not.toContain(heredocMarker);
    expect(serialized).not.toContain(big);

    // Tight bound: result.data should be small since stdout/stderr empty.
    expect(serialized.length).toBeLessThan(1024);
  });

  it('(c) failure path (exit 1): command is not echoed back in result.data', async () => {
    const marker = uniqueMarker('AX765-error-marker');
    const command = `: '${marker}'; exit 1`;

    const result = await bashTool.executeUnsafe({ command }, context);

    expect(result.success).toBe(false);
    expect(result.data).toBeDefined();
    expect(result.data?.exitCode).toBe(1);
    expect(JSON.stringify(result.data)).not.toContain(marker);
  });

  it('(d) timeout path: command is not echoed back in result.data', async () => {
    const marker = uniqueMarker('AX765-timeout-marker');
    const command = `: '${marker}'; sleep 10`;

    const result = await bashTool.executeUnsafe({ command, timeout: 200 }, context);

    expect(result.data).toBeDefined();
    expect(result.data?.timedOut).toBe(true);
    expect(JSON.stringify(result.data)).not.toContain(marker);
  }, 10000);
});
