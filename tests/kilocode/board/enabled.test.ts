/**
 * Tests for `src/kilocode/board/enabled.ts` — the upstream-parity three-
 * signal resolver for `KILOCODE_EXPERIMENTAL_SWARM_BOARD`.
 *
 * Verification for issue #1732 (Kilocode PR #14013 port). The module was
 * previously zero-inbound (see `docs/adr/REVIEW-2026-09-14.md:300`); we
 * still cover its behaviour so downstream tooling that imports the
 * upstream-namespaced helper gets a locked-in contract.
 *
 * Truthy vocabulary: `1|true|yes|on` (case-insensitive).
 * Falsy vocabulary:  `0|false|no|off` (case-insensitive) — force-disables
 * even when the passed-in `experimentalConfigFlag` is `true`.
 * Anything else (empty, unset, `'maybe'`): env var contributes nothing;
 * result is the passed-in `experimentalConfigFlag`.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { isBoardEnabled } from '../../../src/kilocode/board/enabled.js';

const ENV_VAR = 'KILOCODE_EXPERIMENTAL_SWARM_BOARD';

describe('src/kilocode/board/enabled.ts :: isBoardEnabled', () => {
  const saved = process.env[ENV_VAR];

  beforeEach(() => {
    delete process.env[ENV_VAR];
  });

  afterEach(() => {
    if (saved === undefined) {
      delete process.env[ENV_VAR];
    } else {
      process.env[ENV_VAR] = saved;
    }
  });

  it('returns false when env is unset and config flag defaults to false', () => {
    expect(isBoardEnabled()).toBe(false);
  });

  it('returns true when env is unset and config flag is true', () => {
    expect(isBoardEnabled(true)).toBe(true);
  });

  it.each(['1', 'true', 'yes', 'on', 'TRUE', 'ON', 'Yes'])(
    'returns true for truthy env value %s (case-insensitive)',
    (value) => {
      process.env[ENV_VAR] = value;
      expect(isBoardEnabled(false)).toBe(true);
    }
  );

  it.each(['0', 'false', 'no', 'off', 'FALSE', 'Off', 'NO'])(
    'returns false for falsy env value %s, even when config flag is true',
    (value) => {
      process.env[ENV_VAR] = value;
      expect(isBoardEnabled(true)).toBe(false);
    }
  );

  it('falls back to the config flag when env is set to an unrecognised value', () => {
    process.env[ENV_VAR] = 'maybe';
    expect(isBoardEnabled(true)).toBe(true);
    expect(isBoardEnabled(false)).toBe(false);
  });

  it('treats an empty env string as unset', () => {
    process.env[ENV_VAR] = '';
    expect(isBoardEnabled(true)).toBe(true);
    expect(isBoardEnabled(false)).toBe(false);
  });
});
