/**
 * Tests for the non-interactive chat path's handling of a custom
 * command's `submitPrompt`. The chat command MUST NOT auto-submit a
 * follow-up — it surfaces a hint instead. Issue #779.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  runCommandNonInteractive,
  SUBMIT_PROMPT_NON_INTERACTIVE_HINT,
} from '../../src/cli/commands/chat.js';
import { defineCommand, getCommandRegistry } from '../../src/command/index.js';

describe('runCommandNonInteractive', () => {
  beforeEach(() => {
    // Isolate the global registry between tests.
    getCommandRegistry().clear();
  });

  afterEach(() => {
    getCommandRegistry().clear();
  });

  it('returns rendered template only when command has no submitPrompt', async () => {
    getCommandRegistry().register(
      defineCommand({
        name: 'plain',
        template: 'just the body',
      })
    );

    const result = await runCommandNonInteractive('plain', []);
    expect(result.rendered).toBe('just the body');
    expect(result.submitPrompt).toBeUndefined();
    expect(result.hint).toBeUndefined();
  });

  it('surfaces the resolved submitPrompt and hint without auto-submitting', async () => {
    getCommandRegistry().register(
      defineCommand({
        name: 'review',
        arguments: [{ name: 'file', required: true }],
        template: 'review: $1',
        submitPrompt: 'now apply fixes to $1',
      })
    );

    const result = await runCommandNonInteractive('review', ['main.ts']);
    expect(result.rendered).toBe('review: main.ts');
    expect(result.submitPrompt).toBe('now apply fixes to main.ts');
    expect(result.hint).toBe(SUBMIT_PROMPT_NON_INTERACTIVE_HINT);
    expect(result.hint).toMatch(/non-interactive/);
    expect(result.hint).toMatch(/REPL/);
  });

  it('does not surface a hint when submitPrompt resolves to whitespace', async () => {
    getCommandRegistry().register(
      defineCommand({
        name: 'whitespace',
        template: 'body',
        submitPrompt: '   ',
      })
    );

    const result = await runCommandNonInteractive('whitespace', []);
    expect(result.hint).toBeUndefined();
  });

  it('throws CommandError when command does not exist', async () => {
    await expect(runCommandNonInteractive('nonexistent', [])).rejects.toThrow(/Command not found/);
  });
});
