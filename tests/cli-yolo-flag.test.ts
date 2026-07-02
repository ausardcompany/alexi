/**
 * Tests that --yolo (and --dangerously-skip-permissions) on the chat,
 * agent, and interactive commands flip the global PermissionManager into
 * 'auto' mode.
 *
 * We stub out the heavy downstream modules (sendChat, agenticChat, startTui,
 * SessionManager) so the command action returns quickly and only the flag
 * plumbing under test runs.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('../src/core/orchestrator.js', () => ({
  sendChat: vi.fn(async () => ({
    text: '',
    usage: undefined,
    modelUsed: undefined,
  })),
}));

vi.mock('../src/core/agenticChat.js', () => ({
  agenticChat: vi.fn(async () => ({
    text: '',
    usage: { prompt_tokens: 0, completion_tokens: 0 },
    modelUsed: 'stub',
    iterations: 0,
    toolCallsExecuted: 0,
    toolCallSummary: [],
  })),
}));

vi.mock('../src/core/sessionManager.js', () => ({
  SessionManager: class {
    loadSession() {
      return null;
    }
    getCurrentSession() {
      return null;
    }
  },
}));

vi.mock('../src/cli/tui/index.js', () => ({
  startTui: vi.fn(async () => undefined),
}));

vi.mock('../src/git/autoCommit.js', () => ({
  createAutoCommitManager: vi.fn(() => undefined),
}));

vi.mock('../src/git/config.js', () => ({
  loadGitConfig: vi.fn(async () => ({
    dirtyCommits: false,
    commitVerify: false,
    attribution: { style: 'co-authored-by' },
  })),
}));

vi.mock('../src/git/dirtyFiles.js', () => ({
  commitDirtyFiles: vi.fn(async () => ({ committed: false, filesCommitted: [], hash: '' })),
}));

import { Command } from 'commander';
import { registerChatCommand } from '../src/cli/commands/chat.js';
import { registerAgentCommand } from '../src/cli/commands/agent.js';
import { registerInteractiveCommand } from '../src/cli/commands/interactive.js';
import {
  getPermissionManager,
  setPermissionManager,
  PermissionManager,
  defaultRules,
} from '../src/permission/index.js';

function freshProgram(): Command {
  // exitOverride prevents Commander from calling process.exit on error.
  return new Command().exitOverride();
}

describe('--yolo / --dangerously-skip-permissions CLI flag', () => {
  beforeEach(() => {
    // Reset the global manager between tests so mode leaks are visible.
    setPermissionManager(new PermissionManager(defaultRules));
  });

  it('chat: --yolo sets permission mode to auto', async () => {
    const program = freshProgram();
    registerChatCommand(program);
    await program.parseAsync(['node', 'ax', 'chat', '--yolo', '-m', 'hi']);
    expect(getPermissionManager().getPermissionMode()).toBe('auto');
  });

  it('chat: --dangerously-skip-permissions also sets auto', async () => {
    const program = freshProgram();
    registerChatCommand(program);
    await program.parseAsync(['node', 'ax', 'chat', '--dangerously-skip-permissions', '-m', 'hi']);
    expect(getPermissionManager().getPermissionMode()).toBe('auto');
  });

  it('chat: without the flag, mode stays normal', async () => {
    const program = freshProgram();
    registerChatCommand(program);
    await program.parseAsync(['node', 'ax', 'chat', '-m', 'hi']);
    expect(getPermissionManager().getPermissionMode()).toBe('normal');
  });

  it('agent: --yolo sets permission mode to auto', async () => {
    const program = freshProgram();
    registerAgentCommand(program);
    await program.parseAsync(['node', 'ax', 'agent', '--yolo', '--no-auto-commits', '-m', 'hi']);
    expect(getPermissionManager().getPermissionMode()).toBe('auto');
  });

  it('interactive: --yolo sets permission mode to auto', async () => {
    const program = freshProgram();
    registerInteractiveCommand(program);
    await program.parseAsync(['node', 'ax', 'interactive', '--yolo', '--no-auto-commits']);
    expect(getPermissionManager().getPermissionMode()).toBe('auto');
  });

  it('--dangerously-skip-permissions is hidden from help output', () => {
    const program = freshProgram();
    registerChatCommand(program);
    const chatCmd = program.commands.find((c) => c.name() === 'chat');
    expect(chatCmd).toBeDefined();
    const helpText = chatCmd!.helpInformation();
    expect(helpText).toContain('--yolo');
    expect(helpText).not.toContain('--dangerously-skip-permissions');
  });
});
