/**
 * PermissionAllowlist — distinguish a true blanket deny from an allowlist
 * baseline.
 *
 * Ports upstream kilocode `packages/opencode/src/kilocode/permission/allowlist.ts`
 * (adapted to Alexi's `PermissionRule` shape).
 *
 * ## Why this matters
 *
 * A permission policy can be written two different ways that *look* the same
 * at a glance but mean very different things:
 *
 *   1. **Blanket deny.** `[{ tools: ['edit'], paths: ['*'], decision: 'deny' }]`
 *      — the agent may never edit anything, full stop.
 *
 *   2. **Allowlist baseline.** `[{ tools: ['edit'], paths: ['*'], decision:
 *      'deny' }, { tools: ['edit'], paths: ['src/**'], decision: 'allow' }]`
 *      — the agent may only edit paths under `src/**`, and everything else is
 *      forbidden. The leading catch-all is a *baseline*, not a true ban.
 *
 * `Permission.evaluate('edit', '*', rules)` only ever examines rules with a
 * `*` catch-all path and returns the LAST matching one. For shape (2) that
 * is the baseline deny — the subsequent `src/**` allow has a specific path,
 * so it's invisible to a `('edit', '*')` probe. Code that uses the catch-all
 * probe to decide "is edit globally denied?" sees `deny` in BOTH shapes and
 * incorrectly flattens an allowlist into a true ban.
 *
 * This is the correctness bug that was causing subagents spawned from
 * plan/orchestrator agents to lose edit/write capabilities entirely: the
 * parent's `*` deny baseline (which the parent's own allowlist overrode)
 * was being projected onto the subagent as a hard ceiling.
 *
 * ## API
 *
 *   - {@link PermissionAllowlist.catchAll} returns the last rule that would
 *     match a bare `('<permission>', '*')` probe, if any.
 *   - {@link PermissionAllowlist.exceptions} returns `true` when that
 *     catch-all is only the baseline for later path-specific allows —
 *     i.e. an allowlist baseline, not a true blanket deny.
 */

import type { PermissionRule } from './index.js';

/**
 * Return the last rule in `rules` that targets `permission`'s catch-all
 * (any path). In Alexi, that is any rule whose `tools` either omits the
 * list (matches all tools), contains the exact `permission`, or contains
 * a `*` wildcard tool entry, AND whose `paths` is either absent or is
 * a bare `['*']` catch-all.
 *
 * Mirrors upstream `Permission.evaluate(permission, '*', rules)` semantics
 * for the "the rule applies to EVERY path" probe.
 */
function catchAll(permission: string, rules: PermissionRule[]) {
  let last: PermissionRule | undefined;
  for (const rule of rules) {
    if (!ruleMatchesTool(rule, permission)) {
      continue;
    }
    if (!ruleIsCatchAllPath(rule)) {
      continue;
    }
    last = rule;
  }
  return last;
}

/**
 * `true` when `permission`'s catch-all rule is a `deny` **and** at least
 * one later rule narrows that deny with a path-specific allow / ask —
 * i.e. the catch-all is only a baseline for an allowlist, not a true
 * blanket deny. Call sites that would otherwise treat the baseline as a
 * hard ceiling must consult this helper first.
 */
function exceptions(permission: string, rules: PermissionRule[]): boolean {
  const rule = catchAll(permission, rules);
  if (!rule || rule.decision !== 'deny') {
    return false;
  }
  const index = rules.lastIndexOf(rule);
  return rules.slice(index + 1).some((next) => {
    if (!ruleMatchesTool(next, permission)) {
      return false;
    }
    if (ruleIsCatchAllPath(next)) {
      return false;
    }
    return next.decision !== 'deny';
  });
}

export const PermissionAllowlist = {
  catchAll,
  exceptions,
};

/**
 * A rule matches `permission` when its `tools` field is absent (matches all),
 * includes the literal tool name, or includes a `*` wildcard.
 */
function ruleMatchesTool(rule: PermissionRule, permission: string): boolean {
  if (!rule.tools || rule.tools.length === 0) {
    return true;
  }
  return rule.tools.some((t) => t === permission || t === '*');
}

/**
 * A rule has a "catch-all" path when its `paths` field is absent, empty,
 * or exactly `['*']`. These are the rules that `Permission.evaluate` sees
 * when probing with a `*` path argument.
 */
function ruleIsCatchAllPath(rule: PermissionRule): boolean {
  if (!rule.paths || rule.paths.length === 0) {
    return true;
  }
  return rule.paths.length === 1 && rule.paths[0] === '*';
}
