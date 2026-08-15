// Test setup file for vitest.
//
// Fail closed: Alexi stores per-user state under `~/.alexi` (memories,
// snippets, cost history, templates, aliases, sessions). Unit tests must
// never write to a real user directory. Individual tests already redirect
// `dataDir` per-manager (see `tests/**/*.test.ts`), but this guard raises a
// loud error if HOME/ALEXI_HOME points at what looks like a real user home
// when a test forgets to override it.
//
// Enable this guard by setting `ALEXI_TEST_FAIL_CLOSED=1` in CI. Local dev
// runs stay opt-in so a bare `npm test` on a developer machine does not
// require additional environment plumbing.
import path from 'node:path';
import os from 'node:os';

if (process.env.ALEXI_TEST_FAIL_CLOSED === '1') {
  const home = process.env.HOME ?? os.homedir();
  const alexiHome = process.env.ALEXI_HOME ?? path.join(home, '.alexi');

  // The env variable is read at flag-import time in some managers, so this
  // assertion must stay at module top level (setup files run before test
  // modules import the code under test).
  const realHome = os.userInfo().homedir;
  if (alexiHome.startsWith(realHome) && !alexiHome.includes('alexi-test-')) {
    throw new Error(
      `unit test preload: refusing to run with ALEXI_HOME="${alexiHome}" — ` +
        'set ALEXI_HOME to a temp directory (see tests/**/*.test.ts for the ' +
        '`dataDir: <tmp>` pattern) before enabling ALEXI_TEST_FAIL_CLOSED.'
    );
  }
}
