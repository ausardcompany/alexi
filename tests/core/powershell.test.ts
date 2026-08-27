import { describe, expect, it } from 'vitest';

import { PowerShell, args } from '../../src/core/powershell.js';

// kilocode_change - rollback of PR #13365 (support-configurable-powershell-shell).
// Upstream commit `a15d25359` reverted the `pwsh` install-root probing because
// it caused Windows startup issues. The previous tests exercised `locations()`,
// `probe()`, and `pwsh()` — all of which have been removed. What remains is the
// `args()` invocation-flags helper (still needed by callers that spawn pwsh).
describe('core/powershell', () => {
  it('args() returns the expected pwsh invocation flags', () => {
    expect(args('Get-Date')).toEqual([
      '-NoLogo',
      '-NoProfile',
      '-NonInteractive',
      '-Command',
      'Get-Date',
    ]);
  });

  it('exports a bundled PowerShell namespace with the args helper', () => {
    expect(PowerShell.args).toBe(args);
  });
});
