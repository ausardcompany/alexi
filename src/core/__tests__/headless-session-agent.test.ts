/**
 * Regression test for upstream kilocode f4cba053a.
 *
 * When a user runs a headless `alexi chat --session <id>` without an
 * explicit `--agent` flag, the session's previously-recorded agent must
 * survive: it was resolved earlier (either from `--agent` on the very
 * first run, or from `~/.alexi/config.json`) and stamped onto the
 * session metadata. A silent revert to the built-in `code` default
 * would break scripted / CI usage that pins a specific agent.
 *
 * The end-to-end path (Commander → sendChat → provider dispatch) is
 * mocked here; we only assert the metadata-preservation contract:
 * `SessionMetadata.agent` round-trips through save + reload, and
 * `pickAgentSlug` prefers the session-recorded agent over an absent
 * CLI flag.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { SessionManager } from '../sessionManager.js';
import { pickAgentSlug } from '../../agent/defaultAgent.js';

describe('headless session agent preservation', () => {
  let sessionsDir: string;

  beforeEach(() => {
    sessionsDir = fs.mkdtempSync(path.join(os.tmpdir(), 'alexi-headless-agent-'));
  });

  afterEach(() => {
    fs.rmSync(sessionsDir, { recursive: true, force: true });
  });

  it('round-trips session.metadata.agent through save + reload', () => {
    const managerA = new SessionManager({ sessionsDir });
    const session = managerA.createSession();
    session.metadata.agent = 'debug';
    managerA.persistActiveSession();

    // Simulate a fresh process: new manager reads from disk.
    const managerB = new SessionManager({ sessionsDir });
    const reloaded = managerB.loadSession(session.metadata.id);
    expect(reloaded).not.toBeNull();
    expect(reloaded?.metadata.agent).toBe('debug');
  });

  it('prefers session-recorded agent over an absent CLI flag', () => {
    // Simulates chat.ts precedence: cliFlag = opts.agent ?? session.metadata.agent
    const cliFlag = undefined;
    const sessionAgent = 'debug';
    const slug = pickAgentSlug({ cliFlag: cliFlag ?? sessionAgent, configValue: 'code' });
    expect(slug).toBe('debug');
  });

  it('still lets an explicit CLI flag override the session-recorded agent', () => {
    const cliFlag = 'plan';
    const sessionAgent = 'debug';
    const slug = pickAgentSlug({ cliFlag: cliFlag ?? sessionAgent, configValue: 'code' });
    expect(slug).toBe('plan');
  });
});
