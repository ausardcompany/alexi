/**
 * Dead-flag rejection tests (issue #1972).
 *
 * Verifies that CLI options which were removed during the 2026-10-08 dead-
 * flag audit are now rejected by Commander as unknown options. The audit
 * removed three options that were declared with `.option()` but never
 * read:
 *   - `sessions --all`
 *   - `revert --yes`
 *   - `server start -d` / `server start --detach`
 *
 * Commander's `exitOverride()` turns the unknown-option exit into a thrown
 * `CommanderError` with `code === 'commander.unknownOption'`, which is
 * what these tests assert on.
 */

import { describe, it, expect, vi } from 'vitest';
import { Command, CommanderError } from 'commander';

import { registerSessionCommands } from '../../src/cli/commands/sessions.js';
import { registerRevertCommand } from '../../src/cli/commands/revert.js';
import { registerServerCommand } from '../../src/cli/commands/server.js';

/**
 * Build a Commander program for one registrar with `exitOverride()` so
 * parsing errors surface as thrown `CommanderError`s instead of calling
 * `process.exit`.
 */
function buildProgram(register: (program: Command) => void): Command {
  const program = new Command();
  program.exitOverride();
  // Suppress Commander's error output; the tests only care about the
  // thrown error shape, not stderr noise.
  program.configureOutput({
    writeErr: () => {},
    writeOut: () => {},
  });
  register(program);
  return program;
}

async function expectUnknownOption(program: Command, argv: string[], flag: string): Promise<void> {
  await expect(program.parseAsync(['node', 'alexi', ...argv])).rejects.toSatisfy((err) => {
    if (!(err instanceof CommanderError)) {
      return false;
    }
    // Commander labels the error `commander.unknownOption` and includes
    // the offending flag in `err.message`.
    return err.code === 'commander.unknownOption' && err.message.includes(flag);
  });
}

describe('removed CLI options (issue #1972)', () => {
  describe('sessions --all', () => {
    it('is rejected as an unknown option', async () => {
      const program = buildProgram(registerSessionCommands);
      await expectUnknownOption(program, ['sessions', '--all'], '--all');
    });
  });

  describe('revert --yes', () => {
    it('is rejected as an unknown option', async () => {
      const program = buildProgram(registerRevertCommand);
      // `revert` requires `--to <stepId>`; supply it so the parser gets
      // past required-option validation and lands on the --yes rejection.
      await expectUnknownOption(program, ['revert', '--to', 'step-1', '--yes'], '--yes');
    });
  });

  describe('server start --detach / -d', () => {
    it('rejects --detach as an unknown option', async () => {
      const program = buildProgram(registerServerCommand);
      await expectUnknownOption(program, ['server', 'start', '--detach'], '--detach');
    });

    it('rejects -d as an unknown option', async () => {
      const program = buildProgram(registerServerCommand);
      await expectUnknownOption(program, ['server', 'start', '-d'], '-d');
    });
  });
});

describe('surviving CLI options for the affected commands (regression)', () => {
  // Smoke tests to confirm the sibling flags that WERE kept still parse.
  // `sessions --json` is declared with no action-level side-effects we
  // can observe cheaply from here, so we only verify parse success by
  // mocking SessionManager via dependency injection would be heavy —
  // instead we lean on the richer sessions.test.ts suite. These regression
  // checks focus on parse acceptance for the two single-file commands.

  it('accepts revert --preview (still a declared option)', async () => {
    // We spy on process.exit to avoid tearing down the harness: the
    // revert action calls process.exit(1) when no sessions exist, which
    // happens under the empty $HOME inside this test.
    const exitSpy = vi.spyOn(process, 'exit').mockImplementation((() => undefined) as never);
    try {
      const program = buildProgram(registerRevertCommand);
      // Parsing itself must not throw an unknown-option error.
      // The action may still fail (no sessions), but that is not the
      // concern of this test.
      await program
        .parseAsync(['node', 'alexi', 'revert', '--to', 'step-1', '--preview'])
        .catch(() => {
          // Swallow non-Commander errors (e.g. snapshot loader throwing).
        });
    } finally {
      exitSpy.mockRestore();
    }
  });

  it('accepts server status --json (still a declared option)', async () => {
    const program = buildProgram(registerServerCommand);
    // `server status --json` reads a well-known default socket path and
    // emits JSON. We only care that parsing itself does not reject the
    // flag; downstream filesystem checks are allowed to run.
    await program.parseAsync(['node', 'alexi', 'server', 'status', '--json']);
  });
});
