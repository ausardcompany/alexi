/**
 * Regression test for provider request-header preservation.
 *
 * Ports the intent of upstream kilocode fix #13752 (opencode provider
 * headers restored after regression) into Alexi's SAP-focused surface.
 * The concern is architectural: any request-adapter that reshapes the
 * outgoing payload has historically been a place where per-provider
 * custom headers (`Authorization`, `X-SAP-*`, `x-session-affinity`, ...)
 * were dropped. This test locks the header-forwarding contract at the
 * layer Alexi controls — `CompletionOptions.headers` and
 * `buildSessionHeaders` — so a future refactor cannot silently regress.
 *
 * We do NOT dial out to real SAP AI Core here; the objective is to
 * assert that headers assembled at the request-construction layer:
 *  1. survive `mergeSessionHeaders` (session affinity + agent tracing),
 *  2. keep the caller-provided `Authorization` and SAP-specific `X-SAP-*`
 *     headers intact,
 *  3. compose safely with the `X-Interaction-Id` correlation header
 *     added alongside this test (see plan item #6).
 */

import { describe, it, expect } from 'vitest';
import {
  buildSessionHeaders,
  mergeSessionHeaders,
  type SessionContext,
} from '../sessionHeaders.js';

describe('provider request headers survive session-header merge', () => {
  it('preserves Authorization and X-SAP-* headers', () => {
    const base: Record<string, string> = {
      Authorization: 'Bearer sap-ai-core-token',
      'X-SAP-Resource-Group': 'my-rg',
      'X-SAP-Deployment-Id': 'deploy-42',
      'Content-Type': 'application/json',
    };
    const ctx: SessionContext = {
      sessionID: 'sess-abc',
      parentSessionID: 'parent-xyz',
      agentId: 'code',
      parentAgentId: 'orchestrator',
    };

    const merged = mergeSessionHeaders(base, ctx);

    // Original auth + SAP headers must survive verbatim.
    expect(merged['Authorization']).toBe('Bearer sap-ai-core-token');
    expect(merged['X-SAP-Resource-Group']).toBe('my-rg');
    expect(merged['X-SAP-Deployment-Id']).toBe('deploy-42');
    expect(merged['Content-Type']).toBe('application/json');

    // And the session-tracing headers must also be present so
    // load-balanced SAP AI Core deployments can route by affinity.
    expect(merged['x-session-affinity']).toBe('sess-abc');
    expect(merged['X-Interaction-Id']).toBe('sess-abc');
    expect(merged['x-parent-session-id']).toBe('parent-xyz');
    expect(merged['x-alexi-agent-id']).toBe('code');
    expect(merged['x-alexi-parent-agent-id']).toBe('orchestrator');
  });

  it('is a no-op when no session context is supplied', () => {
    const base = { Authorization: 'Bearer x', 'X-SAP-Custom': 'v' };
    const merged = mergeSessionHeaders(base);
    // With no session context, no extra headers are injected.
    expect(merged).toEqual(base);
  });

  it('does not overwrite pre-existing session headers on the base object', () => {
    // Defensive: a caller that already set `x-session-affinity` (e.g.
    // via a middleware) should keep the explicit value when the
    // session context is absent. This mirrors the "custom headers
    // survive request construction" invariant.
    const base = { 'x-session-affinity': 'explicit-value' };
    const merged = mergeSessionHeaders(base);
    expect(merged['x-session-affinity']).toBe('explicit-value');
  });

  it('buildSessionHeaders emits only defined optional fields', () => {
    // parentSessionID / agentId / parentAgentId are optional; unset
    // fields must not appear as undefined keys on the outgoing header
    // record (some HTTP libs will still serialise `undefined` as an
    // empty header value, which SAP AI Core may reject).
    const headers = buildSessionHeaders('sess-1');
    expect(headers['x-session-affinity']).toBe('sess-1');
    // X-Interaction-Id (opencode #47215) rides on every request that
    // has a session id, purely additive for tracing.
    expect(headers['X-Interaction-Id']).toBe('sess-1');
    expect(headers['x-parent-session-id']).toBeUndefined();
    expect(headers['x-alexi-agent-id']).toBeUndefined();
    expect(headers['x-alexi-parent-agent-id']).toBeUndefined();
  });

  it('attaches X-Interaction-Id on merged headers for session correlation', () => {
    // Regression pin for the opencode #47215 pattern: SAP AI Core / any
    // downstream that understands X-Interaction-Id can trace requests
    // back to the originating Alexi session without extra plumbing.
    const merged = mergeSessionHeaders({ Authorization: 'Bearer x' }, { sessionID: 'sess-42' });
    expect(merged['X-Interaction-Id']).toBe('sess-42');
    expect(merged['x-session-affinity']).toBe('sess-42');
    // Non-session headers still survive.
    expect(merged['Authorization']).toBe('Bearer x');
  });
});
