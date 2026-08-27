/**
 * Regression test for kilocode fix #13219 (commit `62998965e`) — plan
 * mode permission rulesets must not stack duplicate rules when toggled
 * repeatedly. Without `mergePermissionRulesets`, a broad `ask` rule
 * appended twice would produce two spurious `ask` prompts for the same
 * operation.
 */
import { describe, expect, it } from 'vitest';
import { mergePermissionRulesets, type PermissionRule } from '../index.js';

describe('plan-mode permission stacking', () => {
  it('does not duplicate identical rules when plan mode is toggled repeatedly', () => {
    const base: PermissionRule[] = [
      {
        tools: ['edit'],
        paths: ['**/*'],
        decision: 'ask',
        priority: 10,
      },
    ];
    const planMode: PermissionRule[] = [
      {
        tools: ['edit'],
        paths: ['**/*'],
        decision: 'ask',
        priority: 10,
      },
    ];
    expect(mergePermissionRulesets(base, planMode)).toHaveLength(1);
  });

  it('keeps distinct rules that only differ in decision', () => {
    const base: PermissionRule[] = [
      { tools: ['edit'], decision: 'ask', priority: 10 },
    ];
    const planMode: PermissionRule[] = [
      { tools: ['edit'], decision: 'deny', priority: 10 },
    ];
    const merged = mergePermissionRulesets(base, planMode);
    expect(merged).toHaveLength(2);
    // Base rule stays first — order matters for last-match-wins evaluation.
    expect(merged[0].decision).toBe('ask');
    expect(merged[1].decision).toBe('deny');
  });

  it('keeps distinct rules that differ in tool selector', () => {
    const base: PermissionRule[] = [
      { tools: ['edit'], decision: 'ask', priority: 10 },
    ];
    const planMode: PermissionRule[] = [
      { tools: ['write'], decision: 'ask', priority: 10 },
    ];
    expect(mergePermissionRulesets(base, planMode)).toHaveLength(2);
  });

  it('collapses many redundant toggles down to the base ruleset size', () => {
    const rule: PermissionRule = {
      tools: ['bash'],
      commands: ['ls', 'pwd'],
      decision: 'allow',
      priority: 5,
    };
    // Simulate five toggles of plan mode over the same base ruleset.
    let acc: PermissionRule[] = [rule];
    for (let i = 0; i < 5; i++) {
      acc = mergePermissionRulesets(acc, [rule]);
    }
    expect(acc).toHaveLength(1);
  });

  it('is order-preserving: base rules come before plan-mode-only rules', () => {
    const base: PermissionRule[] = [
      { tools: ['read'], decision: 'allow', priority: 0 },
    ];
    const planMode: PermissionRule[] = [
      { tools: ['write'], decision: 'deny', priority: 100 },
    ];
    const merged = mergePermissionRulesets(base, planMode);
    expect(merged[0].tools).toEqual(['read']);
    expect(merged[1].tools).toEqual(['write']);
  });
});
