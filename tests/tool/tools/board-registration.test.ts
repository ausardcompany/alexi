/**
 * Regression test for issue #1732: setting only the upstream-parity
 * env var `KILOCODE_EXPERIMENTAL_SWARM_BOARD=1` must cause
 * `registerBuiltInTools()` to expose `kilo_board_read` / `kilo_board_write`
 * to the model.
 *
 * Before the fix, `isBoardEnabled()` in `src/config/userConfig.ts` only
 * checked the `KILO_*` namespace, so the upstream env-var name — while
 * documented in `docs/CONFIGURATION.md#KILOCODE_EXPERIMENTAL_SWARM_BOARD`
 * as the primary opt-in — had zero effect on tool registration. This
 * suite locks in the wired-in behaviour.
 *
 * We use `vi.resetModules()` around each case so the tool registry
 * singleton (`src/tool/index.ts:globalRegistry`) is rebuilt from scratch
 * — otherwise a truthy result from the first case would poison the
 * "should be absent" cases via the module-scoped registry.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'fs';

async function registerFresh(): Promise<string[]> {
  // Re-import both modules so the global registry is fresh and
  // `registerBuiltInTools` picks up the current env state.
  vi.resetModules();
  const toolIndex = await import('../../../src/tool/index.js');
  const toolsIndex = await import('../../../src/tool/tools/index.js');
  toolsIndex.registerBuiltInTools();
  return toolIndex.getAllToolNames();
}

describe('registerBuiltInTools honors KILOCODE_EXPERIMENTAL_SWARM_BOARD (issue #1732)', () => {
  const savedKilocode = process.env.KILOCODE_EXPERIMENTAL_SWARM_BOARD;
  const savedSpecific = process.env.KILO_EXPERIMENTAL_SHARED_AGENT_BOARD;
  const savedUmbrella = process.env.KILO_EXPERIMENTAL;
  let originalConfig: string | null = null;
  let configPath: string | null = null;

  beforeEach(async () => {
    // Snapshot user config so the persisted flag does not leak between tests
    // or masquerade as an opt-in. Same save/restore pattern as
    // `tests/tool/tools/board.test.ts`.
    const { CONFIG_FILE, setConfigSharedAgentBoard } =
      await import('../../../src/config/userConfig.js');
    configPath = CONFIG_FILE;
    try {
      originalConfig = fs.readFileSync(CONFIG_FILE, 'utf-8');
    } catch {
      originalConfig = null;
    }
    setConfigSharedAgentBoard(false);
    delete process.env.KILOCODE_EXPERIMENTAL_SWARM_BOARD;
    delete process.env.KILO_EXPERIMENTAL_SHARED_AGENT_BOARD;
    delete process.env.KILO_EXPERIMENTAL;
  });

  afterEach(() => {
    if (configPath) {
      try {
        if (originalConfig !== null) {
          fs.writeFileSync(configPath, originalConfig, 'utf-8');
        } else if (fs.existsSync(configPath)) {
          fs.unlinkSync(configPath);
        }
      } catch {
        // best-effort
      }
    }
    if (savedKilocode === undefined) {
      delete process.env.KILOCODE_EXPERIMENTAL_SWARM_BOARD;
    } else {
      process.env.KILOCODE_EXPERIMENTAL_SWARM_BOARD = savedKilocode;
    }
    if (savedSpecific === undefined) {
      delete process.env.KILO_EXPERIMENTAL_SHARED_AGENT_BOARD;
    } else {
      process.env.KILO_EXPERIMENTAL_SHARED_AGENT_BOARD = savedSpecific;
    }
    if (savedUmbrella === undefined) {
      delete process.env.KILO_EXPERIMENTAL;
    } else {
      process.env.KILO_EXPERIMENTAL = savedUmbrella;
    }
  });

  it('does NOT register board tools when no opt-in signal is set', async () => {
    const names = await registerFresh();
    expect(names).not.toContain('kilo_board_read');
    expect(names).not.toContain('kilo_board_write');
  });

  it('registers board tools when KILOCODE_EXPERIMENTAL_SWARM_BOARD=1', async () => {
    process.env.KILOCODE_EXPERIMENTAL_SWARM_BOARD = '1';
    const names = await registerFresh();
    expect(names).toContain('kilo_board_read');
    expect(names).toContain('kilo_board_write');
  });

  it('registers board tools when KILOCODE_EXPERIMENTAL_SWARM_BOARD=true (case-insensitive)', async () => {
    process.env.KILOCODE_EXPERIMENTAL_SWARM_BOARD = 'TRUE';
    const names = await registerFresh();
    expect(names).toContain('kilo_board_read');
    expect(names).toContain('kilo_board_write');
  });

  it('does NOT register board tools when KILOCODE_EXPERIMENTAL_SWARM_BOARD=0', async () => {
    process.env.KILOCODE_EXPERIMENTAL_SWARM_BOARD = '0';
    const names = await registerFresh();
    expect(names).not.toContain('kilo_board_read');
    expect(names).not.toContain('kilo_board_write');
  });

  it('still honors KILO_EXPERIMENTAL_SHARED_AGENT_BOARD=1', async () => {
    process.env.KILO_EXPERIMENTAL_SHARED_AGENT_BOARD = '1';
    const names = await registerFresh();
    expect(names).toContain('kilo_board_read');
    expect(names).toContain('kilo_board_write');
  });
});
