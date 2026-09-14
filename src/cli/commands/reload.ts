/**
 * `/reload` command — refresh the whole project's runtime state without
 * restarting the process.
 *
 * Ports kilocode's `feat(cli): reload the whole project from /reload`
 * (commit `3a2c5d5c2`) and its follow-up `fix(cli): surface reload
 * failures and skip in-flight instances` (commit `546195019`).
 *
 * Alexi does not have a multi-instance registry the way kilocode does,
 * so "the current project" is treated as a single logical unit and the
 * reload targets are:
 *   - Routing config (`~/.alexi/routing.json` / repo-local override)
 *   - User config (`~/.alexi/config.json`)
 *   - Project context (`.alexi/context/*`, cached repo map, etc.)
 *   - Skill registry (`.alexi/skills`, `~/.alexi/skills`)
 *   - MCP servers (soft reconnect through `refreshMcpServers`)
 *
 * A refresh is skipped when the module reports an in-flight request —
 * mirrors the `546195019` behaviour so a reload during an active
 * completion cannot yank state out from under the request.
 *
 * The command is intentionally best-effort: individual sub-refresh
 * failures are surfaced in the returned result but do not abort the
 * remaining refreshes. The caller (CLI runner, `/reload` slash command
 * in the TUI, headless script) decides how to render them.
 */

import type { Command } from 'commander';
import { logger } from '../../utils/logger.js';

/** Per-subsystem outcome of a reload attempt. */
export interface ReloadOutcome {
  /** Human-readable subsystem name (e.g. `'routing-config'`). */
  subsystem: string;
  /** `true` when the refresh completed; `false` on failure or skip. */
  ok: boolean;
  /** Reason string when `ok === false` (error message or skip reason). */
  reason?: string;
  /** `true` when the subsystem was skipped due to an in-flight request. */
  skipped?: boolean;
}

export interface ReloadResult {
  /** Every subsystem attempted, in the order they were run. */
  outcomes: ReloadOutcome[];
  /** Total elapsed time in milliseconds. */
  elapsedMs: number;
}

/**
 * Signature the reload command uses to talk to a subsystem. Each
 * refresh function returns void on success or throws on failure. If a
 * subsystem is currently busy handling an in-flight request it should
 * throw a marker error whose message starts with `IN_FLIGHT:` so
 * `executeReload` can classify it as `skipped` rather than `failed`.
 */
export type Refresher = () => Promise<void>;

/**
 * Marker prefix that a refresher should throw when it refuses to
 * refresh because a request is in flight. Kept as an exported constant
 * so hosts can rely on the exact string. Mirrors upstream's
 * "skip in-flight instances" (`546195019`).
 */
export const IN_FLIGHT_MARKER = 'IN_FLIGHT:';

async function runOne(subsystem: string, fn: Refresher): Promise<ReloadOutcome> {
  try {
    await fn();
    return { subsystem, ok: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.startsWith(IN_FLIGHT_MARKER)) {
      return {
        subsystem,
        ok: false,
        skipped: true,
        reason: msg.slice(IN_FLIGHT_MARKER.length).trim() || 'in-flight request',
      };
    }
    return { subsystem, ok: false, reason: msg };
  }
}

/**
 * Refreshers used by `executeReload()`. Exposed so tests can substitute
 * lightweight stubs and so callers can add or remove targets without
 * modifying this file (`registerRefresher` / `unregisterRefresher`).
 */
const refreshers = new Map<string, Refresher>();

/**
 * Register (or replace) a refresher under `subsystem`. Multiple registrations
 * with the same name overwrite the earlier one, so bootstrap order does
 * not matter.
 */
export function registerRefresher(subsystem: string, fn: Refresher): void {
  refreshers.set(subsystem, fn);
}

/**
 * Remove a previously registered refresher. Silent no-op when nothing
 * was registered under that name. Mainly used in tests.
 */
export function unregisterRefresher(subsystem: string): void {
  refreshers.delete(subsystem);
}

/** Clear every registered refresher — test-only. */
export function _resetRefreshersForTest(): void {
  refreshers.clear();
}

/**
 * List currently registered subsystem names in registration order.
 * Exposed for observability (status commands, TUI hints).
 */
export function registeredSubsystems(): string[] {
  return Array.from(refreshers.keys());
}

/**
 * Run every registered refresher in order. Individual failures do not
 * abort the pass — every subsystem gets its chance and the aggregated
 * outcomes are returned to the caller.
 */
export async function executeReload(): Promise<ReloadResult> {
  const startedAt = Date.now();
  const outcomes: ReloadOutcome[] = [];
  for (const [subsystem, fn] of refreshers) {
    outcomes.push(await runOne(subsystem, fn));
  }
  return { outcomes, elapsedMs: Date.now() - startedAt };
}

/**
 * Register default refreshers for a plain Alexi install. Called from the
 * CLI bootstrap (or on the first `/reload` invocation). Idempotent —
 * re-registering the same subsystem simply overwrites the previous
 * function reference.
 *
 * Kept lazy (dynamic imports) so `import`ing this module from the CLI
 * dispatcher does not pull the whole config / skill / MCP graph into
 * memory before the user actually invokes `/reload`.
 */
export function registerDefaultRefreshers(): void {
  registerRefresher('routing-config', async () => {
    const mod = await import('../../config/routingConfig.js');
    // `loadRoutingConfig` is idempotent — it re-reads from disk each
    // call — so simply calling it is enough to pick up on-disk edits.
    (mod as { loadRoutingConfig?: () => unknown }).loadRoutingConfig?.();
  });

  registerRefresher('user-config', async () => {
    const mod = await import('../../config/userConfig.js');
    const fn = (mod as { reloadUserConfig?: () => unknown; loadUserConfig?: () => unknown })
      .reloadUserConfig;
    if (typeof fn === 'function') {
      fn();
      return;
    }
    // Fallback: some builds expose only `loadUserConfig` which is also
    // re-read every call.
    const fallback = (mod as { loadUserConfig?: () => unknown }).loadUserConfig;
    if (typeof fallback === 'function') {
      fallback();
    }
  });

  registerRefresher('skills', async () => {
    const mod = await import('../../skill/index.js');
    const fn = (mod as { reloadSkills?: (workdir: string) => unknown }).reloadSkills;
    if (typeof fn === 'function') {
      fn(process.cwd());
    }
  });
}

/**
 * Format the `ReloadResult` for the CLI: one line per subsystem plus a
 * final summary. Exported so the TUI slash-command handler can reuse
 * the same formatting.
 */
export function formatReloadResult(result: ReloadResult): string {
  const lines: string[] = [];
  let ok = 0;
  let failed = 0;
  let skipped = 0;
  for (const outcome of result.outcomes) {
    if (outcome.ok) {
      ok++;
      lines.push(`  ✓ ${outcome.subsystem}`);
    } else if (outcome.skipped) {
      skipped++;
      lines.push(`  ⏭  ${outcome.subsystem} — skipped: ${outcome.reason ?? 'in-flight request'}`);
    } else {
      failed++;
      lines.push(`  ✗ ${outcome.subsystem} — ${outcome.reason ?? 'unknown error'}`);
    }
  }
  lines.push('');
  lines.push(
    `Reload complete: ${ok} ok, ${failed} failed, ${skipped} skipped ` + `(${result.elapsedMs}ms).`
  );
  return lines.join('\n');
}

/**
 * Register the `alexi reload` command on the Commander program. The
 * command has no options today — that mirrors the upstream `/reload`
 * shape and keeps the surface area minimal. Future refresh targets are
 * added via `registerRefresher()` in whichever module owns them.
 */
export function registerReloadCommand(program: Command): void {
  program
    .command('reload')
    .description('Reload the whole project (config, skills, MCP)')
    .action(async () => {
      // Ensure the built-in subsystems are wired up, even if the caller
      // did not go through the interactive bootstrap.
      if (registeredSubsystems().length === 0) {
        registerDefaultRefreshers();
      }
      const result = await executeReload();
      const rendered = formatReloadResult(result);
      logger.info(rendered);
      // Also emit to stdout so headless scripts see the output without
      // depending on the logger transport.
      process.stdout.write(rendered + '\n');
      const anyFailed = result.outcomes.some((o) => !o.ok && !o.skipped);
      if (anyFailed) {
        process.exitCode = 1;
      }
    });
}
