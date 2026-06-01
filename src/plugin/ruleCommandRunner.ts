/**
 * Plugin rule command runner — spawn-safe execution of `source: 'command'`
 * plugin rules with timeout, output cap, and secret-shaped env scrubbing.
 *
 * This is the dynamic counterpart to the static `inline` / `file` rule sources
 * defined in `src/plugin/index.ts`. Plugins can declare a shell-free command
 * whose stdout becomes the rule body injected into the system prompt.
 *
 * Hard guarantees:
 *   - `shell: false` — no `/bin/sh -c` invocation. Commands are tokenised
 *     internally into argv form so a plugin can't break out via `;`, `|`,
 *     `$()`, etc.
 *   - 5s default timeout (configurable). On timeout, the child is aborted
 *     and whatever stdout was buffered is returned with `timedOut: true`.
 *   - 32 KB default stdout cap (configurable). Once exceeded, the child is
 *     killed and the result is flagged with `truncated: true`.
 *   - Secret-shaped env vars are stripped from the child's environment so
 *     that arbitrary plugin commands cannot exfiltrate `AICORE_*` /
 *     `SAP_PROXY_*` credentials.
 */

import { spawn } from 'child_process';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface RunRuleCommandOptions {
  /** Working directory for the spawned process — typically the plugin root. */
  pluginRoot: string;
  /**
   * Command to execute. Either:
   *   - a single string (whitespace-tokenised with simple quote handling), or
   *   - an array of `[program, ...args]`.
   *
   * In both cases we spawn with `shell: false`, so shell metacharacters are
   * passed as-is to the child program (i.e. they have no meaning).
   */
  command: string | string[];
  /** Optional override for the default 5000 ms timeout. */
  timeoutMs?: number;
  /** Optional override for the default 32 KB stdout cap. */
  maxBytes?: number;
}

export interface RunRuleCommandResult {
  /** UTF-8 decoded stdout, capped at `maxBytes`. */
  stdout: string;
  /** Buffered stderr (uncapped — used for log diagnostics, not prompt content). */
  stderr: string;
  /** True when the cap was hit and the child was killed. */
  truncated: boolean;
  /** True when the timeout fired and the child was aborted. */
  timedOut: boolean;
  /** Exit code, or `null` if the process did not exit normally. */
  exitCode: number | null;
}

// ---------------------------------------------------------------------------
// Defaults
// ---------------------------------------------------------------------------

const DEFAULT_TIMEOUT_MS = 5000;
const DEFAULT_MAX_BYTES = 32 * 1024;

// ---------------------------------------------------------------------------
// Env scrubbing
// ---------------------------------------------------------------------------

/**
 * Patterns matching env-var names whose value is likely a secret. Plugin
 * commands inherit `process.env` MINUS any var whose name matches one of
 * these — this is a defence-in-depth measure, not a sandbox.
 *
 * Kept as a flat array so reviewers can grep it. If you add a new pattern,
 * also extend `scrubEnv`'s test coverage.
 */
const SECRET_ENV_PATTERNS: RegExp[] = [
  /^AICORE_/i,
  /^SAP_PROXY_/i,
  /_TOKEN$/i,
  /_SECRET$/i,
  /_KEY$/i,
  /_PASSWORD$/i,
  /^GITHUB_TOKEN$/i,
  /^GH_TOKEN$/i,
];

/**
 * Return a shallow copy of `env` with secret-shaped variable names removed.
 * Exported for unit testing — production callers should go through
 * {@link runRuleCommand}.
 */
export function scrubEnv(env: NodeJS.ProcessEnv): NodeJS.ProcessEnv {
  const clean: NodeJS.ProcessEnv = {};
  for (const [name, value] of Object.entries(env)) {
    if (value === undefined) {
      continue;
    }
    const isSecret = SECRET_ENV_PATTERNS.some((rx) => rx.test(name));
    if (isSecret) {
      continue;
    }
    clean[name] = value;
  }
  return clean;
}

// ---------------------------------------------------------------------------
// Tokeniser
// ---------------------------------------------------------------------------

/**
 * Tokenise a command string into argv. Supports:
 *   - whitespace separation
 *   - single-quoted segments (no escapes inside)
 *   - double-quoted segments (with `\\"` and `\\\\` backslash escapes)
 *   - backslash escape outside quotes
 *
 * Rejects unbalanced quotes by throwing — callers should treat that as a
 * configuration error.
 *
 * Note: this is intentionally simpler than POSIX `sh` parsing. Variable
 * expansion, command substitution, and redirection are *not* supported,
 * because we never invoke a shell.
 */
export function tokenizeCommand(input: string): string[] {
  const tokens: string[] = [];
  let current = '';
  let inSingle = false;
  let inDouble = false;
  let started = false;

  for (let i = 0; i < input.length; i++) {
    const ch = input[i];

    if (inSingle) {
      if (ch === "'") {
        inSingle = false;
      } else {
        current += ch;
      }
      continue;
    }

    if (inDouble) {
      if (ch === '\\' && i + 1 < input.length) {
        const next = input[i + 1];
        if (next === '"' || next === '\\') {
          current += next;
          i++;
          continue;
        }
        current += ch;
        continue;
      }
      if (ch === '"') {
        inDouble = false;
      } else {
        current += ch;
      }
      continue;
    }

    if (ch === "'") {
      inSingle = true;
      started = true;
      continue;
    }
    if (ch === '"') {
      inDouble = true;
      started = true;
      continue;
    }
    if (ch === '\\' && i + 1 < input.length) {
      current += input[i + 1];
      i++;
      started = true;
      continue;
    }
    if (ch === ' ' || ch === '\t' || ch === '\n') {
      if (started) {
        tokens.push(current);
        current = '';
        started = false;
      }
      continue;
    }
    current += ch;
    started = true;
  }

  if (inSingle || inDouble) {
    throw new Error('unbalanced quote in command string');
  }
  if (started) {
    tokens.push(current);
  }
  return tokens;
}

// ---------------------------------------------------------------------------
// runRuleCommand
// ---------------------------------------------------------------------------

/**
 * Spawn a plugin rule command with timeout and stdout-cap enforcement.
 *
 * Always resolves — never rejects. On any failure mode (timeout, oversize
 * stdout, non-zero exit, spawn error) the result fields describe what
 * happened so callers can decide whether to emit the rule, log a warning,
 * or both. By design we still emit whatever stdout was captured even on
 * timeout/truncation, so a partially-produced rule is better than no rule.
 */
export async function runRuleCommand(opts: RunRuleCommandOptions): Promise<RunRuleCommandResult> {
  const timeoutMs = opts.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const maxBytes = opts.maxBytes ?? DEFAULT_MAX_BYTES;

  let argv: string[];
  if (Array.isArray(opts.command)) {
    argv = opts.command.slice();
  } else {
    try {
      argv = tokenizeCommand(opts.command);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      return {
        stdout: '',
        stderr: msg,
        truncated: false,
        timedOut: false,
        exitCode: null,
      };
    }
  }

  if (argv.length === 0) {
    return {
      stdout: '',
      stderr: 'empty command',
      truncated: false,
      timedOut: false,
      exitCode: null,
    };
  }

  const [program, ...args] = argv;

  return new Promise<RunRuleCommandResult>((resolve) => {
    const controller = new AbortController();
    const stdoutChunks: Buffer[] = [];
    const stderrChunks: Buffer[] = [];
    let stdoutLen = 0;
    let truncated = false;
    let timedOut = false;
    let settled = false;

    const finalize = (exitCode: number | null): void => {
      if (settled) {
        return;
      }
      settled = true;
      clearTimeout(timer);
      // Cap stdout at maxBytes. If we tripped the size guard mid-chunk, the
      // accumulated buffer may be slightly over by the size of one chunk —
      // slice at maxBytes for a deterministic upper bound.
      const stdoutBuf = Buffer.concat(stdoutChunks);
      const cappedStdout =
        stdoutBuf.length > maxBytes ? stdoutBuf.subarray(0, maxBytes) : stdoutBuf;
      resolve({
        stdout: cappedStdout.toString('utf-8'),
        stderr: Buffer.concat(stderrChunks).toString('utf-8'),
        truncated,
        timedOut,
        exitCode,
      });
    };

    let child;
    try {
      child = spawn(program, args, {
        cwd: opts.pluginRoot,
        shell: false,
        env: scrubEnv(process.env),
        signal: controller.signal,
        stdio: ['ignore', 'pipe', 'pipe'],
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      stderrChunks.push(Buffer.from(msg, 'utf-8'));
      finalize(null);
      return;
    }

    const timer = setTimeout(() => {
      timedOut = true;
      try {
        controller.abort();
      } catch {
        // ignore abort errors
      }
      // If abort doesn't trigger an 'exit' quickly (e.g. on Windows), force
      // kill so finalize runs.
      try {
        child.kill('SIGKILL');
      } catch {
        // ignore
      }
    }, timeoutMs);

    child.stdout?.on('data', (chunk: Buffer) => {
      if (truncated) {
        return;
      }
      stdoutLen += chunk.length;
      stdoutChunks.push(chunk);
      if (stdoutLen > maxBytes) {
        truncated = true;
        try {
          child.kill('SIGKILL');
        } catch {
          // ignore
        }
      }
    });

    child.stderr?.on('data', (chunk: Buffer) => {
      stderrChunks.push(chunk);
    });

    child.on('error', (err: NodeJS.ErrnoException) => {
      // AbortError surfaces here when the controller fires — surface it as
      // a timeout, not a spawn error, since `timedOut` is already set.
      if (!timedOut) {
        stderrChunks.push(Buffer.from(err.message, 'utf-8'));
      }
      finalize(null);
    });

    child.on('exit', (code) => {
      finalize(code);
    });
  });
}
