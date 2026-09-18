/**
 * Placeholder runtime for `experimental.code_mode`.
 *
 * The real confined-JavaScript sandbox (`isolated-vm` / worker + MCP
 * on-demand tool cache) is a multi-file port from upstream kilocode
 * that will land in a follow-up commit. This module exists so the
 * dynamic import in `./code-mode.ts` resolves at type-check time and
 * so callers get a well-typed `null`-equivalent runtime when the
 * feature flag is flipped on ahead of the sandbox implementation.
 *
 * `createCodeModeRuntime()` intentionally returns a runtime that
 * refuses every dispatch — the caller in `loadCodeMode()` treats a
 * throwing / unavailable runtime as "code_mode disabled" and falls
 * back to the direct-tool path, so this stub is safe to ship.
 */

import type { CodeMode } from './code-mode.js';

class UnavailableCodeModeRuntime implements CodeMode {
  async dispatch(_toolName: string, _args: unknown): Promise<unknown> {
    throw new Error(
      '[code_mode] runtime not yet implemented in Alexi; falling back to direct tool dispatch.'
    );
  }

  async dispose(): Promise<void> {
    // no-op: nothing to release
  }
}

export function createCodeModeRuntime(): CodeMode {
  return new UnavailableCodeModeRuntime();
}
