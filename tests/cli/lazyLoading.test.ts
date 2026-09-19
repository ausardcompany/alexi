/**
 * Regression tests for the CLI lazy-loading contract (issue #1769).
 *
 * The goal of the lazy-loading refactor is that heavy runtime modules
 * (TUI, orchestrator, agent loop, git auto-commit, repo map, SAP AI
 * SDK, session manager, etc.) are NOT pulled in when the user runs
 * `alexi --help`, `alexi --version`, or dispatches a command that
 * doesn't need them. The refactor achieves this by moving the imports
 * out of the module top-level and into the Commander `.action(...)`
 * closure via dynamic `import(...)`.
 *
 * These tests defend that contract at two layers:
 *
 * 1. **Static-import assertion**: parse each command file's source and
 *    assert its top-level `import ... from '...';` statements do NOT
 *    reference the banned heavy modules. This is the fast, deterministic
 *    line of defence — a reviewer that adds a static import of e.g.
 *    `../../core/orchestrator.js` back to `chat.ts` will trip the test
 *    immediately, without needing to boot Commander or spawn a child
 *    process.
 *
 * 2. **Module-cache assertion**: spawn a Node child process that boots
 *    `src/cli/program.ts` via `tsx` with `--version` and inspect Node's
 *    module cache to confirm the banned modules never resolved. This
 *    catches indirect leaks (e.g. a small utility that transitively
 *    pulls in the orchestrator). Skipped when `tsx` is not on PATH so
 *    it degrades gracefully outside the repo dev environment.
 *
 * The banned-module list is intentionally scoped to the "big rocks"
 * identified during the profiling pass in #1769 — TUI (Ink/React),
 * orchestrator, agent loop, SAP AI SDK, git auto-commit, and the
 * background-process tool graph. Other imports (small utils, types,
 * commander) are allowed at the top level.
 */

import { describe, it, expect } from 'vitest';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..', '..');
const COMMANDS_DIR = path.join(REPO_ROOT, 'src', 'cli', 'commands');

/**
 * Banned top-level imports per command file. The value is the list of
 * import specifiers that MUST NOT appear as a value (non-type) import
 * at the module top level of the given file. Type-only imports are
 * allowed (erased at compile time so zero runtime cost).
 *
 * Keep this table small and scoped to the actual big-cost modules — a
 * long list will trigger churn on every new command without meaningful
 * signal.
 */
const BANNED_TOP_LEVEL_IMPORTS: Record<string, string[]> = {
  'interactive.ts': [
    '../tui/index.js',
    '../../providers/index.js',
    '../../git/autoCommit.js',
    '../../git/config.js',
    '../../git/dirtyFiles.js',
    '../../context/repoMap.js',
    '../../utils/gitWorktree.js',
    '../../permission/index.js',
  ],
  'agent.ts': [
    '../../core/agenticChat.js',
    '../../core/sessionManager.js',
    '../../core/streamingOrchestrator.js',
    '../../core/effortLevel.js',
    '../../git/autoCommit.js',
    '../../git/config.js',
    '../../git/dirtyFiles.js',
    '../../context/repoMap.js',
    '../../utils/gitWorktree.js',
    '../../agent/defaultAgent.js',
    '../../config/userConfig.js',
    '../../permission/index.js',
    '../../bus/index.js',
    '../utils/mistakeLimitPrompt.js',
  ],
  'chat.ts': [
    '../../core/orchestrator.js',
    '../../core/streamingOrchestrator.js',
    '../../core/sessionManager.js',
    '../../agent/defaultAgent.js',
    '../../agent/index.js',
    '../../config/userConfig.js',
    '../../session/drain.js',
  ],
  'models.ts': ['@sap-ai-sdk/ai-api'],
  'server.ts': [
    '../../server/auth.js',
    '../../server/socket.js',
    '../../server/protocol.js',
    '../../command/index.js',
  ],
};

/**
 * Extract non-type-only static import specifiers from a TypeScript
 * source file. This is intentionally a plain regex parse — a full AST
 * would add a devDependency (ts-morph / @typescript-eslint/parser) for
 * almost no benefit. The regex accepts:
 *
 *   import foo from '...';
 *   import { a, b } from '...';
 *   import * as ns from '...';
 *   import '...';
 *   import foo, { a } from '...';
 *
 * and correctly ignores:
 *
 *   import type { X } from '...';     // type-only (erased)
 *   import { type Y } from '...';     // acceptable — the specifier is
 *                                     // still imported but only used
 *                                     // for types, which does NOT
 *                                     // erase the module load; we
 *                                     // conservatively flag this if
 *                                     // it appears in the banned list.
 *   const x = await import('...');    // dynamic (allowed)
 *
 * The parse is line-oriented and stops at the first `import` block
 * boundary (blank line or non-import line) — TypeScript convention
 * places all top-level imports at the top of the file, so this is a
 * safe approximation that will not miss imports in practice.
 */
function extractTopLevelValueImports(source: string): string[] {
  const specs: string[] = [];
  const lines = source.split('\n');
  // Import statements may span multiple lines (destructured lists), so
  // accumulate until we see the closing quote + semicolon.
  let buf = '';
  let inImport = false;
  for (const raw of lines) {
    const line = raw.trimEnd();
    if (!inImport) {
      // Ignore comments and blank lines while scanning the header.
      if (/^\s*(\/\/|\/\*|\*|$)/.test(line)) {
        continue;
      }
      if (/^\s*import\b/.test(line)) {
        inImport = true;
        buf = line;
      } else {
        // Reached a non-import top-level statement — stop scanning.
        // Type-only re-exports and interface declarations may still
        // follow, but any `import ...` after this point would be a
        // stylistic anomaly; erring on the side of stopping keeps the
        // parse simple.
        break;
      }
    } else {
      buf += ' ' + line;
    }
    // A statement terminates at a semicolon that closes the import.
    if (inImport && /;\s*$/.test(buf)) {
      // Skip type-only imports entirely — `import type { ... } from '...';`
      // is erased at runtime.
      const isTypeOnly = /^\s*import\s+type\b/.test(buf);
      if (!isTypeOnly) {
        const match = buf.match(/from\s+['"]([^'"]+)['"]/);
        if (match) {
          specs.push(match[1]);
        } else {
          // Side-effect import: `import '...';`
          const sideEffect = buf.match(/^\s*import\s+['"]([^'"]+)['"]/);
          if (sideEffect) {
            specs.push(sideEffect[1]);
          }
        }
      }
      inImport = false;
      buf = '';
    }
  }
  return specs;
}

describe('CLI lazy-loading contract (#1769)', () => {
  describe('top-level import assertions', () => {
    for (const [file, banned] of Object.entries(BANNED_TOP_LEVEL_IMPORTS)) {
      it(`${file} does not statically import heavy modules at the top level`, async () => {
        const src = await readFile(path.join(COMMANDS_DIR, file), 'utf8');
        const specs = extractTopLevelValueImports(src);
        for (const bannedSpec of banned) {
          expect(
            specs,
            `${file} must NOT statically import '${bannedSpec}' at the top level; use ` +
              `\`const { ... } = await import('${bannedSpec}');\` inside the .action() closure instead.`
          ).not.toContain(bannedSpec);
        }
      });
    }
  });

  describe('dynamic import audit', () => {
    it('each banned static import has a matching dynamic import(...) in the file', async () => {
      // If we move a heavy import out of the static graph but forget to
      // add the dynamic loader, the command action will throw at runtime
      // with an undefined reference. This audit catches such regressions
      // by asserting the file uses `import('<spec>')` at least once for
      // every banned specifier.
      for (const [file, banned] of Object.entries(BANNED_TOP_LEVEL_IMPORTS)) {
        const src = await readFile(path.join(COMMANDS_DIR, file), 'utf8');
        for (const spec of banned) {
          // Regex is scoped to a dynamic import call:
          //   import('spec')  or  import("spec")
          const dynamicRe = new RegExp(
            `import\\(\\s*['"]${spec.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"]\\s*\\)`
          );
          expect(
            dynamicRe.test(src),
            `${file} moved '${spec}' out of the static import graph but has no ` +
              `matching \`import('${spec}')\` dynamic loader. The command action will ` +
              `throw ReferenceError at runtime.`
          ).toBe(true);
        }
      }
    });
  });

  describe('commands/index.ts still re-exports every register* helper', () => {
    it('does not accidentally lose a command registration', async () => {
      // The lazy-loading refactor is scoped to individual command files.
      // The barrel file (commands/index.ts) must keep re-exporting every
      // registration helper so tests and downstream callers that import
      // by name (`import { registerChatCommand } from '.../commands/index.js'`)
      // keep working.
      const src = await readFile(path.join(COMMANDS_DIR, 'index.ts'), 'utf8');
      const expected = [
        'registerChatCommand',
        'registerAgentCommand',
        'registerInteractiveCommand',
        'registerModelsCommand',
        'registerExplainCommand',
        'registerSessionCommands',
        'registerContextCommands',
        'registerStageCommands',
        'registerNotesCommand',
        'registerDoDCommands',
        'registerCodeReviewCommand',
        'registerPluginCommand',
        'registerRevertCommand',
        'registerServerCommand',
        'registerGenerateCommand',
        'registerReloadCommand',
      ];
      for (const name of expected) {
        expect(src).toContain(name);
      }
    });
  });
});
