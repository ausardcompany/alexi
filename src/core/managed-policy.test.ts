/**
 * Tests for `src/core/managed-policy.ts`.
 *
 * These tests document the contract of the two upstream fixes we ported:
 *
 *   - opencode #55297: `experimental.policies` → top-level `policies` migration.
 *     Both shapes must be accepted; the new field wins on a per-document basis.
 *
 *   - opencode #55267: managed configuration has highest precedence. Managed
 *     policies load FIRST (so they run LAST under reverse-load evaluation),
 *     managed settings load LAST (so they win on later-wins keys).
 */

import { describe, it, expect } from 'vitest';
import {
  applyManagedPrecedence,
  mergePolicies,
  resolvePoliciesWithPrecedence,
  type TaggedConfigDocument,
} from './managed-policy.js';

describe('mergePolicies', () => {
  it('accepts the legacy experimental.policies shape', () => {
    const docs = [{ path: 'a.json', info: { experimental: { policies: [{ rule: 'A' }] } } }];
    expect(mergePolicies(docs)).toEqual([{ rule: 'A' }]);
  });

  it('accepts the new top-level policies shape', () => {
    const docs = [{ path: 'a.json', info: { policies: [{ rule: 'A' }] } }];
    expect(mergePolicies(docs)).toEqual([{ rule: 'A' }]);
  });

  it('prefers top-level policies when both are set on the same document', () => {
    const docs = [
      {
        path: 'a.json',
        info: {
          policies: [{ rule: 'new' }],
          experimental: { policies: [{ rule: 'old' }] },
        },
      },
    ];
    expect(mergePolicies(docs)).toEqual([{ rule: 'new' }]);
  });

  it('preserves input order across documents', () => {
    const docs = [
      { path: 'a.json', info: { policies: [{ rule: 'A' }] } },
      { path: 'b.json', info: { experimental: { policies: [{ rule: 'B' }] } } },
      { path: 'c.json', info: { policies: [{ rule: 'C' }] } },
    ];
    expect(mergePolicies(docs)).toEqual([{ rule: 'A' }, { rule: 'B' }, { rule: 'C' }]);
  });

  it('skips documents with no policies at all', () => {
    const docs = [
      { path: 'a.json', info: { somethingElse: 42 } },
      { path: 'b.json', info: { policies: [{ rule: 'B' }] } },
    ];
    expect(mergePolicies(docs)).toEqual([{ rule: 'B' }]);
  });
});

describe('applyManagedPrecedence', () => {
  const managedDoc: TaggedConfigDocument = {
    path: '/etc/alexi/managed.json',
    managed: true,
    info: {
      policies: [{ rule: 'managed-A' }],
      model: 'enterprise-model',
    },
  };

  const userDoc: TaggedConfigDocument = {
    path: '~/.alexi/config.json',
    managed: false,
    info: {
      policies: [{ rule: 'user-A' }],
      model: 'user-model',
    },
  };

  it('splits managed policies out from managed settings', () => {
    const result = applyManagedPrecedence([userDoc, managedDoc]);
    // Managed policies are extracted into their own documents.
    expect(result.managedPolicies).toHaveLength(1);
    expect(result.managedPolicies[0]?.info).toEqual({ policies: [{ rule: 'managed-A' }] });
    // Managed settings keep non-policy fields.
    expect(result.managedSettings).toHaveLength(1);
    expect(result.managedSettings[0]?.info).toEqual({ model: 'enterprise-model' });
    // User documents are returned unchanged, in input order.
    expect(result.userDocuments).toEqual([userDoc]);
  });

  it('strips experimental.policies from managed settings too', () => {
    const legacyManaged: TaggedConfigDocument = {
      path: '/etc/alexi/legacy.json',
      managed: true,
      info: {
        experimental: { policies: [{ rule: 'legacy' }], other: 'kept' },
        model: 'enterprise-model',
      },
    };
    const result = applyManagedPrecedence([legacyManaged]);
    expect(result.managedPolicies[0]?.info).toEqual({ policies: [{ rule: 'legacy' }] });
    // `experimental.other` survives because we only strip the policies key.
    expect(result.managedSettings[0]?.info).toEqual({
      model: 'enterprise-model',
      experimental: { other: 'kept' },
    });
  });

  it('reverses managed-source order so the LAST-loaded managed source wins final authority', () => {
    const m1: TaggedConfigDocument = {
      path: '/etc/alexi/first.json',
      managed: true,
      info: { policies: [{ rule: 'first' }] },
    };
    const m2: TaggedConfigDocument = {
      path: '/etc/alexi/second.json',
      managed: true,
      info: { policies: [{ rule: 'second' }] },
    };
    const result = applyManagedPrecedence([m1, m2]);
    // Reverse load order: `second` becomes the FIRST-loaded policy, which under
    // reverse-load evaluation gives it the final say.
    expect(result.managedPolicies.map((d) => d.info.policies)).toEqual([
      [{ rule: 'second' }],
      [{ rule: 'first' }],
    ]);
  });

  it('leaves pure-user document lists untouched', () => {
    const result = applyManagedPrecedence([userDoc]);
    expect(result.managedPolicies).toEqual([]);
    expect(result.managedSettings).toEqual([]);
    expect(result.userDocuments).toEqual([userDoc]);
  });
});

describe('resolvePoliciesWithPrecedence (end-to-end)', () => {
  it('composes managed policies first, user documents in middle, managed settings last', () => {
    const managed: TaggedConfigDocument = {
      path: '/etc/alexi/managed.json',
      managed: true,
      info: { policies: [{ src: 'managed' }] },
    };
    const user: TaggedConfigDocument = {
      path: '~/.alexi/config.json',
      managed: false,
      info: { policies: [{ src: 'user' }] },
    };
    const project: TaggedConfigDocument = {
      path: '.alexi/config.json',
      managed: false,
      info: { experimental: { policies: [{ src: 'project' }] } },
    };
    // Order: managed policies -> user documents (in input order) -> managed settings (no policies).
    expect(resolvePoliciesWithPrecedence([user, project, managed])).toEqual([
      { src: 'managed' }, // from managedPolicies — loaded FIRST
      { src: 'user' },
      { src: 'project' },
    ]);
  });
});
