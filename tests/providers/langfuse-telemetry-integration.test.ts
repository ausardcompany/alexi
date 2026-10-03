/**
 * Integration test for BYOK Langfuse tracing (issue #1914).
 *
 * Boots a fake Langfuse HTTP receiver on a local port, points the module
 * under test at it with real credentials + opt-in, drives one trace +
 * generation lifecycle, and verifies the payload the SDK sent carries:
 * - the direct-exporter `sdkIntegration` string (`alexi-langfuse-direct`)
 * - `environment: 'benchmark'`
 * - the merged env+call tags (deduped)
 * - env + call metadata (call wins on key conflict)
 *
 * Keeping this test under `tests/providers/` instead of
 * `src/providers/__tests__/` so the heavier HTTP server lifecycle lives
 * alongside the other provider-level integration tests
 * (`ca.test.ts`, `connector-persistence.test.ts`, ...).
 */

import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import http from 'node:http';
import type { AddressInfo } from 'node:net';

import {
  _resetLangfuseTelemetryForTests,
  LANGFUSE_SDK_INTEGRATION,
  resolveAiSdkTelemetry,
  startLangfuseGeneration,
  startLangfuseTrace,
  finishLangfuseGeneration,
} from '../../src/providers/langfuse-telemetry.js';

interface RecordedRequest {
  method: string;
  url: string;
  authorization: string | undefined;
  body: unknown;
}

const recorded: RecordedRequest[] = [];

let server: http.Server;
let baseUrl: string;

beforeAll(async () => {
  server = http.createServer((req, res) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk) => chunks.push(chunk as Buffer));
    req.on('end', () => {
      const body = Buffer.concat(chunks).toString('utf8');
      let parsed: unknown = body;
      try {
        parsed = JSON.parse(body) as unknown;
      } catch {
        // leave as string
      }
      recorded.push({
        method: req.method ?? 'GET',
        url: req.url ?? '',
        authorization: req.headers['authorization']?.toString(),
        body: parsed,
      });
      res.statusCode = 207;
      res.setHeader('content-type', 'application/json');
      res.end(JSON.stringify({ successes: [], errors: [] }));
    });
  });
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const addr = server.address() as AddressInfo;
  baseUrl = `http://127.0.0.1:${addr.port}`;
});

afterAll(async () => {
  await new Promise<void>((resolve, reject) =>
    server.close((err) => (err ? reject(err) : resolve()))
  );
});

beforeEach(() => {
  recorded.length = 0;
  _resetLangfuseTelemetryForTests();
  for (const name of [
    'ALEXI_LANGFUSE_ALL_PROVIDERS',
    'ALEXI_LANGFUSE_TAGS',
    'ALEXI_LANGFUSE_METADATA',
    'LANGFUSE_TRACING_ENVIRONMENT',
    'LANGFUSE_BASE_URL',
    'LANGFUSE_PUBLIC_KEY',
    'LANGFUSE_SECRET_KEY',
  ]) {
    delete process.env[name];
  }
});

describe('langfuse direct exporter (integration)', () => {
  it('ships traces to the operator-configured Langfuse with the direct scope + env + tags + metadata', async () => {
    process.env.ALEXI_LANGFUSE_ALL_PROVIDERS = '1';
    process.env.LANGFUSE_BASE_URL = baseUrl;
    process.env.LANGFUSE_PUBLIC_KEY = 'pk-test';
    process.env.LANGFUSE_SECRET_KEY = 'sk-test';
    process.env.LANGFUSE_TRACING_ENVIRONMENT = 'benchmark';
    process.env.ALEXI_LANGFUSE_TAGS = 'env-tag, shared ';
    process.env.ALEXI_LANGFUSE_METADATA = 'suite=swe-bench,runId=env-run';

    const decision = await resolveAiSdkTelemetry('byok-model');
    expect(decision.isEnabled).toBe(true);
    if (!decision.isEnabled) {
      // Narrow type for TS; the assertion above guards this branch.
      return;
    }

    const trace = startLangfuseTrace(decision, {
      name: 'sap-ai-core.chat',
      sessionId: 'session-integration-1',
      tags: ['call-tag', 'shared'],
      metadata: { runId: 'call-run' },
    });
    expect(trace).toBeDefined();

    const generation = startLangfuseGeneration(trace, {
      name: 'sap-ai-core.chat',
      model: 'byok-model',
      input: 'hello',
    });
    finishLangfuseGeneration(generation, {
      output: 'world',
      usage: { prompt_tokens: 5, completion_tokens: 3, total_tokens: 8 },
      finishReason: 'stop',
    });

    // Force the SDK to drain its queue to our fake receiver. `flushAsync()`
    // dispatches the HTTP requests but the Node HTTP agent may deliver the
    // last response bytes a few ms after `flushAsync()` resolves, so we
    // poll with a bounded deadline before asserting.
    await decision.client.flushAsync();
    const deadline = Date.now() + 2_000;
    while (recorded.length < 3 && Date.now() < deadline) {
      await new Promise((resolve) => setTimeout(resolve, 25));
    }

    // There may be several POSTs (trace + generation events arrive in
    // separate batches by default). Collect every event body in a flat array.
    expect(recorded.length).toBeGreaterThanOrEqual(1);
    expect(recorded[0].authorization).toMatch(/^Basic /);

    const allBodies = recorded.flatMap((r) => {
      const b = r.body as { batch?: unknown[] } | undefined;
      return Array.isArray(b?.batch) ? b!.batch! : [b as unknown];
    });

    // Trace create event with merged tags/metadata/environment.
    const traceCreate = allBodies.find((entry) => {
      const e = entry as { type?: string; body?: { tags?: unknown } };
      return e?.type === 'trace-create';
    }) as
      | undefined
      | {
          type: string;
          body: {
            sessionId?: string;
            tags?: string[];
            metadata?: Record<string, string>;
            environment?: string;
          };
        };
    expect(traceCreate).toBeDefined();
    expect(traceCreate?.body.sessionId).toBe('session-integration-1');
    // Tags: env first, then call-site new values appended, deduped.
    // 'shared' appears in both and MUST appear once.
    expect(traceCreate?.body.tags).toEqual(['env-tag', 'shared', 'call-tag']);
    // Metadata: `{...env, ...callSite}` -- call-site wins on `runId`.
    expect(traceCreate?.body.metadata).toMatchObject({
      suite: 'swe-bench',
      runId: 'call-run',
    });

    // The sdkIntegration metadata is attached at the batch-wrapper level
    // on every ingestion POST: this confirms the direct exporter identity.
    const sdkIntegrations = recorded
      .map(
        (r) => (r.body as { metadata?: { sdk_integration?: string } })?.metadata?.sdk_integration
      )
      .filter(Boolean);
    expect(sdkIntegrations.length).toBeGreaterThan(0);
    for (const sdk of sdkIntegrations) {
      expect(sdk).toBe(LANGFUSE_SDK_INTEGRATION);
    }

    // The LANGFUSE_TRACING_ENVIRONMENT value propagates onto the trace
    // body (observable on both trace-create and generation-create events).
    expect(traceCreate?.body.environment).toBe('benchmark');
  }, 20_000);
});
