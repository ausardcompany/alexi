/**
 * Tests for the shared agent board enablement helper.
 *
 * Ports upstream kilocode #14013 — the board can be enabled via config
 * key OR via `KILO_EXPERIMENTAL_SHARED_AGENT_BOARD=1` OR via the
 * umbrella `KILO_EXPERIMENTAL=1` env flag. The rule is a boolean OR:
 * an explicit config `false` does NOT override a set env flag.
 *
 * We drive `getConfigSharedAgentBoard()` through the real config file
 * using the same save/restore pattern as `tests/config/userConfig.test.ts`
 * because `isBoardEnabled()` and `getConfigSharedAgentBoard()` live in
 * the same module and `vi.mock` cannot intercept intra-module calls.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';

import {
  CONFIG_FILE,
  isBoardEnabled,
  setConfigSharedAgentBoard,
} from '../../../src/config/userConfig.js';

describe('isBoardEnabled', () => {
  const savedSpecific = process.env.KILO_EXPERIMENTAL_SHARED_AGENT_BOARD;
  const savedUmbrella = process.env.KILO_EXPERIMENTAL;
  let originalConfigContent: string | null = null;

  beforeEach(() => {
    // Snapshot the existing user config so we can restore it after the test.
    try {
      originalConfigContent = fs.readFileSync(CONFIG_FILE, 'utf-8');
    } catch {
      originalConfigContent = null;
    }
    // Reset config key to false by default. Env flags cleared per-test.
    setConfigSharedAgentBoard(false);
    delete process.env.KILO_EXPERIMENTAL_SHARED_AGENT_BOARD;
    delete process.env.KILO_EXPERIMENTAL;
  });

  afterEach(() => {
    // Restore original config content
    try {
      if (originalConfigContent !== null) {
        fs.writeFileSync(CONFIG_FILE, originalConfigContent, 'utf-8');
      } else if (fs.existsSync(CONFIG_FILE)) {
        fs.unlinkSync(CONFIG_FILE);
      }
    } catch {
      // Best-effort restore
    }
    // Restore env vars
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

  it('returns true when the config key is true', () => {
    setConfigSharedAgentBoard(true);
    expect(isBoardEnabled()).toBe(true);
  });

  it('returns true when the specific env flag is "1" and config is false', () => {
    setConfigSharedAgentBoard(false);
    process.env.KILO_EXPERIMENTAL_SHARED_AGENT_BOARD = '1';
    expect(isBoardEnabled()).toBe(true);
  });

  it('returns true when the umbrella env flag is "1" and config is false', () => {
    setConfigSharedAgentBoard(false);
    process.env.KILO_EXPERIMENTAL = '1';
    expect(isBoardEnabled()).toBe(true);
  });

  it('returns false when config is false and no env flags are set', () => {
    setConfigSharedAgentBoard(false);
    expect(isBoardEnabled()).toBe(false);
  });

  it('returns false when env flag is set to a non-"1" value', () => {
    setConfigSharedAgentBoard(false);
    process.env.KILO_EXPERIMENTAL_SHARED_AGENT_BOARD = '0';
    process.env.KILO_EXPERIMENTAL = 'true';
    expect(isBoardEnabled()).toBe(false);
  });

  it('env flag overrides an explicit config false (OR semantics)', () => {
    setConfigSharedAgentBoard(false);
    process.env.KILO_EXPERIMENTAL_SHARED_AGENT_BOARD = '1';
    expect(isBoardEnabled()).toBe(true);
  });
});
