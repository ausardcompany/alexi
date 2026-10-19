/**
 * `alexi permissions` command group — list, view, and edit saved
 * permission rules outside the normal interactive ask flow.
 *
 * Issue #2087. The three subcommands mirror the SST OpenCode pattern:
 *
 *   alexi permissions list                 list every saved rule
 *   alexi permissions show <ruleId>        show rule details + provenance
 *   alexi permissions edit <ruleId> [opts] edit a rule (flags or TTY)
 *
 * Non-interactive callers (CI, scripts, agents) can drive `edit` with
 * `--decision`, `--priority`, and `--description` flags; when the
 * terminal is a TTY and no flags are supplied, an `@inquirer/prompts`
 * `select` picker is used instead.
 */

import type { Command } from 'commander';
import {
  getPermissionManager,
  getDenialProvenance,
  formatProvenanceMessage,
  type PermissionDecision,
  type PermissionManager,
  type PermissionRule,
} from '../../permission/index.js';

// --- Types ---------------------------------------------------------------

type FormattableRule = PermissionRule;

const VALID_DECISIONS: readonly PermissionDecision[] = ['allow', 'deny', 'ask'];

/**
 * Minimal interactive prompt surface the CLI depends on. Kept as a
 * narrow type so tests can inject a stub without pulling in
 * `@inquirer/prompts` directly. See `editRuleFromOpts` for the TTY
 * fallback path that uses the real prompts package.
 */
export interface InteractivePromptAdapter {
  pickDecision: (current: PermissionDecision) => Promise<PermissionDecision | null>;
  askPriority: (current: number) => Promise<number | null>;
  askDescription: (current: string | undefined) => Promise<string | null>;
}

// --- Pure formatters (exported for tests) --------------------------------

/**
 * Format one rule as a single human-readable summary line. Used by
 * `permissions list` and as the header of `permissions show`.
 */
export function formatRuleSummary(rule: FormattableRule): string {
  const id = rule.id ?? '<no-id>';
  const name = rule.name ?? '(unnamed)';
  const decision = rule.decision.toUpperCase();
  const priority = rule.priority ?? 0;
  const patterns = describeRulePatterns(rule);
  return `  [${decision}] ${id} — ${name} (priority ${priority})${patterns ? ` — ${patterns}` : ''}`;
}

/**
 * Describe the matching patterns of a rule in a single line. Shows the
 * first few entries from `tools`, `actions`, `paths`, `commands`, and
 * `hosts` so operators can tell rules apart at a glance.
 */
export function describeRulePatterns(rule: FormattableRule): string {
  const parts: string[] = [];
  if (rule.tools && rule.tools.length > 0) {
    parts.push(`tools: ${rule.tools.join(',')}`);
  }
  if (rule.actions && rule.actions.length > 0) {
    parts.push(`actions: ${rule.actions.join(',')}`);
  }
  if (rule.paths && rule.paths.length > 0) {
    parts.push(`paths: ${rule.paths.join(',')}`);
  }
  if (rule.commands && rule.commands.length > 0) {
    parts.push(`commands: ${rule.commands.join(',')}`);
  }
  if (rule.hosts && rule.hosts.length > 0) {
    parts.push(`hosts: ${rule.hosts.join(',')}`);
  }
  return parts.join('; ');
}

/**
 * Format a full rule block for `permissions show`. Includes every
 * populated field plus the latest denial provenance keyed by the rule's
 * id, when available. Pure so tests can diff on exact output.
 */
export function formatRuleDetail(rule: FormattableRule): string {
  const lines: string[] = [];
  lines.push(`Rule: ${rule.id ?? '<no-id>'}`);
  if (rule.name) {
    lines.push(`  Name:        ${rule.name}`);
  }
  if (rule.description) {
    lines.push(`  Description: ${rule.description}`);
  }
  lines.push(`  Decision:    ${rule.decision}`);
  lines.push(`  Priority:    ${rule.priority ?? 0}`);
  if (rule.tools && rule.tools.length > 0) {
    lines.push(`  Tools:       ${rule.tools.join(', ')}`);
  }
  if (rule.actions && rule.actions.length > 0) {
    lines.push(`  Actions:     ${rule.actions.join(', ')}`);
  }
  if (rule.paths && rule.paths.length > 0) {
    lines.push(`  Paths:       ${rule.paths.join(', ')}`);
  }
  if (rule.commands && rule.commands.length > 0) {
    lines.push(`  Commands:    ${rule.commands.join(', ')}`);
  }
  if (rule.hosts && rule.hosts.length > 0) {
    lines.push(`  Hosts:       ${rule.hosts.join(', ')}`);
  }
  if (rule.externalPaths !== undefined) {
    lines.push(`  External:    ${rule.externalPaths}`);
  }
  if (rule.homeExpansion !== undefined) {
    lines.push(`  Home expand: ${rule.homeExpansion}`);
  }
  const ruleId = rule.id;
  if (ruleId !== undefined) {
    const provenance = getDenialProvenance(ruleId);
    if (provenance) {
      lines.push(`  Provenance:  ${formatProvenanceMessage(provenance)}`);
    }
  }
  return lines.join('\n');
}

// --- Core operations (pure, exported for tests) --------------------------

export interface ListResult {
  rules: FormattableRule[];
}

export function listRules(manager: PermissionManager = getPermissionManager()): ListResult {
  return { rules: manager.getRules() };
}

export interface ShowResult {
  rule: FormattableRule | undefined;
}

export function showRule(
  ruleId: string,
  manager: PermissionManager = getPermissionManager()
): ShowResult {
  return { rule: manager.getRule(ruleId) };
}

export interface EditOptions {
  decision?: string;
  priority?: string | number;
  description?: string;
}

export interface EditResult {
  updated: FormattableRule | null;
  reason?: string;
}

/**
 * Apply an edit described by raw CLI flags. Validates and normalises
 * each field before delegating to `PermissionManager.updateRule`. When
 * no editable flag is present, returns `{ updated: null, reason }` so
 * the caller can escalate to the interactive TTY flow (or fail with a
 * clear error in non-TTY environments).
 */
export function applyEditFlags(
  ruleId: string,
  opts: EditOptions,
  manager: PermissionManager = getPermissionManager()
): EditResult {
  const patch: Partial<FormattableRule> = {};

  if (opts.decision !== undefined) {
    const decision = String(opts.decision).toLowerCase() as PermissionDecision;
    if (!VALID_DECISIONS.includes(decision)) {
      return {
        updated: null,
        reason: `Invalid --decision '${opts.decision}'. Expected one of: ${VALID_DECISIONS.join(', ')}.`,
      };
    }
    patch.decision = decision;
  }

  if (opts.priority !== undefined) {
    const priority = typeof opts.priority === 'number' ? opts.priority : Number(opts.priority);
    if (!Number.isFinite(priority)) {
      return {
        updated: null,
        reason: `Invalid --priority '${String(opts.priority)}' (must be a number).`,
      };
    }
    patch.priority = priority;
  }

  if (opts.description !== undefined) {
    patch.description = String(opts.description);
  }

  if (Object.keys(patch).length === 0) {
    return { updated: null, reason: 'no fields to update' };
  }

  const existing = manager.getRule(ruleId);
  if (!existing) {
    return { updated: null, reason: `Rule '${ruleId}' not found.` };
  }

  const updated = manager.updateRule(ruleId, patch);
  return { updated };
}

/**
 * Interactive editor. Receives an `InteractivePromptAdapter` so tests
 * can inject a deterministic fake instead of driving a real tty. Each
 * prompt returning `null` means "keep current value". Returns the
 * updated rule, or `null` when the rule was not found.
 */
export async function editRuleInteractively(
  ruleId: string,
  adapter: InteractivePromptAdapter,
  manager: PermissionManager = getPermissionManager()
): Promise<FormattableRule | null> {
  const existing = manager.getRule(ruleId);
  if (!existing) {
    return null;
  }

  const patch: Partial<FormattableRule> = {};

  const nextDecision = await adapter.pickDecision(existing.decision);
  if (nextDecision && nextDecision !== existing.decision) {
    patch.decision = nextDecision;
  }

  const nextPriority = await adapter.askPriority(existing.priority ?? 0);
  if (nextPriority !== null && nextPriority !== (existing.priority ?? 0)) {
    patch.priority = nextPriority;
  }

  const nextDescription = await adapter.askDescription(existing.description);
  if (nextDescription !== null && nextDescription !== (existing.description ?? '')) {
    patch.description = nextDescription;
  }

  if (Object.keys(patch).length === 0) {
    return existing;
  }

  return manager.updateRule(ruleId, patch);
}

// --- Interactive adapter (TTY only) --------------------------------------

/**
 * Default adapter that uses `@inquirer/prompts`. Dynamic-imported so
 * non-interactive runs (and tests) never pay the cost of loading it.
 */
async function buildDefaultAdapter(): Promise<InteractivePromptAdapter> {
  const { select, input } = await import('@inquirer/prompts');
  return {
    pickDecision: async (current) => {
      try {
        return (await select({
          message: 'Decision',
          default: current,
          choices: VALID_DECISIONS.map((v) => ({ name: v, value: v })),
        })) as PermissionDecision;
      } catch {
        return null;
      }
    },
    askPriority: async (current) => {
      try {
        const answer = await input({
          message: 'Priority (number)',
          default: String(current),
          validate: (value: string) =>
            Number.isFinite(Number(value)) || 'Priority must be a number',
        });
        const n = Number(answer);
        return Number.isFinite(n) ? n : null;
      } catch {
        return null;
      }
    },
    askDescription: async (current) => {
      try {
        const answer = await input({
          message: 'Description',
          default: current ?? '',
        });
        return answer;
      } catch {
        return null;
      }
    },
  };
}

// --- Command registration ------------------------------------------------

interface ListCliOptions {
  json?: boolean;
}

interface EditCliOptions extends EditOptions {
  interactive?: boolean;
}

export function registerPermissionsCommand(program: Command): void {
  const cmd = program
    .command('permissions')
    .description('List, show, and edit saved permission rules');

  cmd
    .command('list')
    .description('List every saved permission rule')
    .option('--json', 'Emit the rules as a JSON array')
    .action((opts: ListCliOptions) => {
      try {
        const { rules } = listRules();

        if (opts.json) {
          process.stdout.write(JSON.stringify(rules, null, 2) + '\n');
          return;
        }

        if (rules.length === 0) {
          process.stdout.write('No permission rules configured.\n');
          return;
        }

        process.stdout.write('\n=== Permission Rules ===\n\n');
        for (const rule of rules) {
          process.stdout.write(formatRuleSummary(rule) + '\n');
        }
        process.stdout.write('\n');
      } catch (err) {
        process.stderr.write(`Error: ${err instanceof Error ? err.message : String(err)}\n`);
        process.exitCode = 1;
      }
    });

  cmd
    .command('show <ruleId>')
    .description('Show the details and latest provenance for a specific rule')
    .option('--json', 'Emit the rule as a JSON object')
    .action((ruleId: string, opts: ListCliOptions) => {
      try {
        const { rule } = showRule(ruleId);
        if (!rule) {
          process.stderr.write(`Rule '${ruleId}' not found.\n`);
          process.exitCode = 1;
          return;
        }

        if (opts.json) {
          const provenance = rule.id ? getDenialProvenance(rule.id) : undefined;
          process.stdout.write(
            JSON.stringify({ rule, provenance: provenance ?? null }, null, 2) + '\n'
          );
          return;
        }

        process.stdout.write('\n' + formatRuleDetail(rule) + '\n\n');
      } catch (err) {
        process.stderr.write(`Error: ${err instanceof Error ? err.message : String(err)}\n`);
        process.exitCode = 1;
      }
    });

  cmd
    .command('edit <ruleId>')
    .description(
      'Edit a saved rule. Use --decision/--priority/--description for ' +
        'non-interactive edits, or omit them in a TTY to open an inquirer picker.'
    )
    .option('--decision <value>', 'New decision: allow | deny | ask')
    .option('--priority <n>', 'New priority (integer)')
    .option('--description <text>', 'New description')
    .option('--interactive', 'Force the interactive editor even when flags are present')
    .action(async (ruleId: string, opts: EditCliOptions) => {
      try {
        const hasFlags =
          opts.decision !== undefined ||
          opts.priority !== undefined ||
          opts.description !== undefined;

        if (hasFlags && !opts.interactive) {
          const result = applyEditFlags(ruleId, opts);
          if (!result.updated) {
            process.stderr.write(`Error: ${result.reason ?? 'update failed'}\n`);
            process.exitCode = 1;
            return;
          }
          process.stdout.write(`Updated rule '${ruleId}'.\n`);
          process.stdout.write(formatRuleDetail(result.updated) + '\n');
          return;
        }

        if (!process.stdin.isTTY) {
          process.stderr.write(
            'Error: refusing to run interactive editor without a TTY. Pass --decision / --priority / --description, or run from an interactive terminal.\n'
          );
          process.exitCode = 1;
          return;
        }

        const adapter = await buildDefaultAdapter();
        const updated = await editRuleInteractively(ruleId, adapter);
        if (!updated) {
          process.stderr.write(`Rule '${ruleId}' not found.\n`);
          process.exitCode = 1;
          return;
        }
        process.stdout.write(`Updated rule '${ruleId}'.\n`);
        process.stdout.write(formatRuleDetail(updated) + '\n');
      } catch (err) {
        process.stderr.write(`Error: ${err instanceof Error ? err.message : String(err)}\n`);
        process.exitCode = 1;
      }
    });
}
