/**
 * Plugin rule command runner — spawn-safe execution of `source: 'command'`
 * plugin rules with timeout, output cap, and secret-shaped env scrubbing.
 *
 * This is the dynamic counterpart to the static `inline` / `file` rule sources
 * defined in `src/plugin/index.ts`. Plugins can declare a shell-free command
 * whose stdout becomes the rule body injected into the system prompt.
 *
 * Two execution APIs are exported here:
 *
 *   1. {@link runRuleCommand} — strict, spec-conformant API used by new
 *      callers (issue #648 / parent #633). Argv-based, rejects with typed
 *      errors on TIMEOUT / EXIT, returns `{ stdout, truncated }` on success.
 *      `execFile`-backed (no shell).
 *
 *   2. {@link runRuleCommandLenient} — legacy, never-rejects API consumed
 *      by the materialization path in `src/plugin/index.ts`. Same hard
 *      guarantees (no shell, timeout, cap, env scrub) but surfaces failure
 *      modes in the result object so a partial rule can still be emitted.
 *
 * Hard guarantees (both APIs):
 *   - `shell: false` — no `/bin/sh -c` invocation. Commands are tokenised
 *     internally into argv form so a plugin can't break out via `;`, `|`,
 *     `$()`, etc.
 *   - 5s default timeout (configurable). On timeout, the child is killed
 *     via `AbortController` plus a `SIGKILL` fallback.
 *   - 32 KB default stdout cap (configurable). Once exceeded, the child is
 *     killed.
 *   - Secret-shaped env vars are stripped from the child's environment so
 *     that arbitrary plugin commands cannot exfiltrate `AICORE_*` /
 *     `SAP_PROXY_*` credentials.
 */

import { execFile, spawn } from 'child_process';

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
 * {@link runRuleCommandLenient}.
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
// runRuleCommandLenient (legacy / materialization path)
// ---------------------------------------------------------------------------

/**
 * Spawn a plugin rule command with timeout and stdout-cap enforcement.
 *
 * Always resolves — never rejects. On any failure mode (timeout, oversize
 * stdout, non-zero exit, spawn error) the result fields describe what
 * happened so callers can decide whether to emit the rule, log a warning,
 * or both. By design we still emit whatever stdout was captured even on
 * timeout/truncation, so a partially-produced rule is better than no rule.
 *
 * For the strict argv-based API that rejects on errors (used by new
 * callers per issue #648), prefer {@link runRuleCommand}.
 */
export async function runRuleCommandLenient(
  opts: RunRuleCommandOptions
): Promise<RunRuleCommandResult> {
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

// ---------------------------------------------------------------------------
// runRuleCommand (strict, spec-conformant per issue #648 / #633)
// ---------------------------------------------------------------------------

/**
 * Strict argv-based options for {@link runRuleCommand}.
 */
export interface RunRuleCommandStrictOptions {
  /** Argv array. `argv[0]` is the binary, `argv.slice(1)` are arguments. */
  argv: string[];
  /** Working directory for the spawned process. Caller-supplied (typically the plugin root). */
  cwd: string;
  /**
   * Caller-supplied environment. Forwarded to the child after the secret-shaped
   * denylist is applied (see {@link scrubEnvDeny}). When omitted, `process.env`
   * is used as the source.
   */
  env?: NodeJS.ProcessEnv;
  /** Timeout in milliseconds. Defaults to 5000. */
  timeoutMs?: number;
  /** Stdout cap in bytes. Defaults to 32 KB (32 768 bytes). */
  maxBytes?: number;
}

/** Successful result shape from {@link runRuleCommand}. */
export interface RunRuleCommandStrictResult {
  /** UTF-8 decoded stdout, capped at `maxBytes` when overflow occurred. */
  stdout: string;
  /** True when stdout overflowed `maxBytes` and the child was killed. */
  truncated: boolean;
}

/** Discriminated union of typed errors thrown by {@link runRuleCommand}. */
export type RunRuleCommandError =
  | (Error & { code: 'EMPTY_ARGV' })
  | (Error & { code: 'TIMEOUT' })
  | (Error & { code: 'EXIT'; exitCode: number | null; stderr: string })
  | (Error & { code: 'SPAWN_ERROR' });

/**
 * Denylist used by {@link runRuleCommand} to scrub the env passed to children.
 *
 * Removes:
 *   - any var matching `^AICORE_` (SAP AI Core service-key shaped vars)
 *   - any var matching `^SAP_PROXY_` (proxy creds)
 *   - any var whose name matches `/SECRET|TOKEN|PASSWORD|KEY/i`
 *
 * `PATH` and `HOME` are always retained even if they would otherwise match.
 *
 * Exported for unit testing — production callers go through {@link runRuleCommand}.
 */
export function scrubEnvDeny(env: NodeJS.ProcessEnv): NodeJS.ProcessEnv {
  const RETAIN = new Set(['PATH', 'HOME']);
  const SECRET_RX = /SECRET|TOKEN|PASSWORD|KEY/i;
  const out: NodeJS.ProcessEnv = {};
  for (const [name, value] of Object.entries(env)) {
    if (value === undefined) {
      continue;
    }
    if (RETAIN.has(name)) {
      out[name] = value;
      continue;
    }
    if (/^AICORE_/i.test(name)) {
      continue;
    }
    if (/^SAP_PROXY_/i.test(name)) {
      continue;
    }
    if (SECRET_RX.test(name)) {
      continue;
    }
    out[name] = value;
  }
  return out;
}

const STRICT_DEFAULT_TIMEOUT_MS = 5000;
const STRICT_DEFAULT_MAX_BYTES = 32 * 1024;

function makeRunError<C extends RunRuleCommandError['code']>(
  code: C,
  message: string,
  extra?: Partial<RunRuleCommandError>
): RunRuleCommandError {
  const err = new Error(message) as RunRuleCommandError;
  Object.assign(err, { code, ...extra });
  return err;
}

/**
 * Spawn a plugin rule command via `child_process.execFile` (no shell), with
 * a strict argv-based contract.
 *
 * Behaviour (per parent tracker #633 / issue #648):
 *   - `argv[0]` is the binary, `argv.slice(1)` are arguments. Throws
 *     `{ code: 'EMPTY_ARGV' }` synchronously (well, via promise rejection)
 *     when `argv` is empty.
 *   - Default `timeoutMs = 5000`. On timeout the child is aborted via
 *     `AbortController` and the promise rejects with `{ code: 'TIMEOUT' }`.
 *   - Default `maxBytes = 32_768`. On overflow the child is killed and the
 *     promise resolves with `{ stdout: <first maxBytes bytes>, truncated: true }`.
 *   - `cwd` is caller-supplied (no implicit default).
 *   - `env` is the caller's env minus the secret-shaped denylist (see
 *     {@link scrubEnvDeny}). When `env` is omitted, `process.env` is used
 *     as the source.
 *   - Non-zero exit rejects with `{ code: 'EXIT', exitCode, stderr }`.
 */
export function runRuleCommand(
  opts: RunRuleCommandStrictOptions
): Promise<RunRuleCommandStrictResult> {
  return new Promise<RunRuleCommandStrictResult>((resolve, reject) => {
    if (!Array.isArray(opts.argv) || opts.argv.length === 0) {
      reject(makeRunError('EMPTY_ARGV', 'runRuleCommand: argv must be a non-empty array'));
      return;
    }

    const timeoutMs = opts.timeoutMs ?? STRICT_DEFAULT_TIMEOUT_MS;
    const maxBytes = opts.maxBytes ?? STRICT_DEFAULT_MAX_BYTES;
    const baseEnv = opts.env ?? process.env;
    const childEnv = scrubEnvDeny(baseEnv);

    const [program, ...args] = opts.argv;
    const controller = new AbortController();

    let timedOut = false;
    let truncated = false;
    let settled = false;
    let stdoutLen = 0;
    const stdoutChunks: Buffer[] = [];
    const stderrChunks: Buffer[] = [];

    const timer = setTimeout(() => {
      timedOut = true;
      try {
        controller.abort();
      } catch {
        // ignore
      }
    }, timeoutMs);

    const settle = (action: () => void): void => {
      if (settled) {
        return;
      }
      settled = true;
      clearTimeout(timer);
      action();
    };

    const child = execFile(
      program,
      args,
      {
        cwd: opts.cwd,
        env: childEnv,
        signal: controller.signal,
        // Capture stdout/stderr as Buffer so our incremental size cap can
        // sum byte lengths reliably (string encoding would lose the byte
        // boundary at the cap on multi-byte UTF-8 sequences).
        encoding: 'buffer',
        // We handle our own buffer cap via the stdout listener below; setting
        // `maxBuffer` to Infinity prevents execFile from rejecting with its
        // own ERR_CHILD_PROCESS_STDIO_MAXBUFFER before we can return a clean
        // truncation result.
        maxBuffer: Number.POSITIVE_INFINITY,
        // Ensure no shell — defence-in-depth: execFile already defaults to
        // shell:false but make the intent explicit.
        shell: false,
      },
      (err, _stdout, stderr) => {
        // execFile callback fires after the child exits or errors. We don't
        // use its stdout buffer because we accumulate it ourselves (so we can
        // apply the size cap incrementally and surface partial stdout on
        // truncation). `stderr` is used as a fallback for the EXIT typed error.
        if (timedOut) {
          settle(() => reject(makeRunError('TIMEOUT', `command timed out after ${timeoutMs}ms`)));
          return;
        }
        if (truncated) {
          const buf = Buffer.concat(stdoutChunks);
          const capped = buf.length > maxBytes ? buf.subarray(0, maxBytes) : buf;
          settle(() => resolve({ stdout: capped.toString('utf-8'), truncated: true }));
          return;
        }
        if (err) {
          // execFile surfaces non-zero exits as errors with `code` set to the
          // numeric exit code, while spawn-failure errors (ENOENT, EACCES, ...)
          // set `code` to a string identifier. Discriminate by runtime type.
          const e = err as Error & { code?: unknown };
          if (typeof e.code === 'number') {
            const stderrText = Buffer.isBuffer(stderr)
              ? stderr.toString('utf-8')
              : typeof stderr === 'string'
                ? stderr
                : Buffer.concat(stderrChunks).toString('utf-8');
            const exitCode = e.code;
            settle(() =>
              reject(
                makeRunError('EXIT', `command exited with code ${exitCode}`, {
                  exitCode,
                  stderr: stderrText,
                })
              )
            );
            return;
          }
          settle(() =>
            reject(
              makeRunError('SPAWN_ERROR', err.message || 'failed to spawn command', {
                cause: err,
              } as Partial<RunRuleCommandError>)
            )
          );
          return;
        }
        const buf = Buffer.concat(stdoutChunks);
        settle(() => resolve({ stdout: buf.toString('utf-8'), truncated: false }));
      }
    );

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
  });
}
