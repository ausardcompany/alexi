/**
 * Provider Health Check
 *
 * Validates provider credentials and connectivity before sessions so users
 * can discover misconfiguration (missing env vars, bad credentials,
 * unreachable endpoints) proactively, instead of mid-session after wasting
 * quota on failed requests.
 *
 * Issue #2067.
 *
 * Each supported provider has a dedicated check that:
 *   1. Verifies the env vars that must be set.
 *   2. For SAP AI Core, validates that `AICORE_SERVICE_KEY` is valid JSON
 *      and derives the API base URL from `serviceurls.AI_API_URL`.
 *   3. Attempts a minimal network call (HEAD on the base URL) with a
 *      bounded timeout, measuring latency.
 *   4. Classifies the outcome into a structured `HealthResult`.
 *
 * No chat/completion call is issued — a HEAD on the deployment base URL
 * is enough to confirm DNS + TLS + reachability without burning quota.
 * Auth errors (401/403) still count as "reachable" at the network layer
 * but are surfaced as `ok: false` with a specific reason so operators
 * know to fix credentials rather than network.
 */

import { env } from '../config/env.js';
import { checkConnectivity, type ConnectivityResult } from './connectivity.js';

/**
 * Default per-provider timeout for the connectivity probe (ms). Shorter
 * than the module-level connectivity default because `provider health`
 * is interactive and must fail fast when things are wrong.
 */
const DEFAULT_HEALTH_TIMEOUT_MS = 10_000;

/**
 * Structured outcome of a single provider health check.
 */
export interface HealthResult {
  /** Short identifier (e.g. `'sap-ai-core'`, `'sap-proxy'`). */
  provider: string;
  /** `true` when every validation passed. */
  ok: boolean;
  /** Round-trip latency of the connectivity probe in ms, when attempted. */
  latency?: number;
  /** First failure reason, intended for CLI display. */
  error?: string;
  /** Rich per-step details, surfaced under `--verbose`. */
  details?: HealthDetails;
}

/**
 * Fine-grained diagnostic data for a single provider. Shown by the CLI
 * only when `--verbose` is passed, so the compact human output stays
 * one-line-per-provider by default.
 */
export interface HealthDetails {
  /** Which env vars were checked and whether each was present. */
  envVars: Array<{ name: string; present: boolean; required: boolean }>;
  /** Which base URL the network probe was aimed at, if any. */
  endpoint?: string;
  /** Raw connectivity result, if the probe ran. */
  connectivity?: ConnectivityResult;
  /** `true` when env validation passed and the probe was attempted. */
  attemptedProbe: boolean;
}

/**
 * Known provider identifier accepted by {@link checkProviderHealth}. Kept
 * as a plain string union rather than an enum so tests and callers can
 * pass raw strings without extra imports.
 */
export type ProviderId = 'sap-ai-core' | 'sap-proxy';

/** Public list of all providers this module knows how to check. */
export const KNOWN_PROVIDERS: readonly ProviderId[] = ['sap-ai-core', 'sap-proxy'];

/**
 * Return the subset of {@link KNOWN_PROVIDERS} whose required env vars
 * are present. Used by the CLI to decide which providers to check when
 * the user does not pass `--provider`.
 *
 * A provider is "configured" when at least its first required env var
 * is set. We intentionally do NOT require every env var to be present
 * — a half-configured provider should still be checked so the user
 * sees exactly WHICH variable is missing.
 */
export function listConfiguredProviders(): ProviderId[] {
  const configured: ProviderId[] = [];
  if (env('AICORE_SERVICE_KEY')) {
    configured.push('sap-ai-core');
  }
  if (env('SAP_PROXY_BASE_URL')) {
    configured.push('sap-proxy');
  }
  return configured;
}

/**
 * Options accepted by {@link checkProviderHealth}.
 */
export interface CheckProviderHealthOptions {
  /** Override the connectivity probe timeout (ms). */
  timeoutMs?: number;
  /** Skip the network probe entirely (env-var-only check). */
  skipNetwork?: boolean;
}

/**
 * Validate a single provider's configuration + reachability.
 *
 * Returns a structured {@link HealthResult}. Never throws — a thrown
 * error from any inner step is caught and surfaced as `ok: false`.
 */
export async function checkProviderHealth(
  provider: string,
  options: CheckProviderHealthOptions = {}
): Promise<HealthResult> {
  const timeoutMs = options.timeoutMs ?? DEFAULT_HEALTH_TIMEOUT_MS;

  switch (provider) {
    case 'sap-ai-core':
      return checkSapAiCoreHealth(timeoutMs, options.skipNetwork === true);
    case 'sap-proxy':
      return checkSapProxyHealth(timeoutMs, options.skipNetwork === true);
    default:
      return {
        provider,
        ok: false,
        error: `Unknown provider '${provider}'. Known providers: ${KNOWN_PROVIDERS.join(', ')}`,
        details: { envVars: [], attemptedProbe: false },
      };
  }
}

/**
 * Check SAP AI Core: `AICORE_SERVICE_KEY` must be set and valid JSON,
 * `AICORE_RESOURCE_GROUP` is optional (defaults to `'default'`), and
 * the derived `AI_API_URL` must be reachable.
 */
async function checkSapAiCoreHealth(
  timeoutMs: number,
  skipNetwork: boolean
): Promise<HealthResult> {
  const serviceKey = env('AICORE_SERVICE_KEY');
  const resourceGroup = env('AICORE_RESOURCE_GROUP');

  const envVars: HealthDetails['envVars'] = [
    { name: 'AICORE_SERVICE_KEY', present: Boolean(serviceKey), required: true },
    { name: 'AICORE_RESOURCE_GROUP', present: Boolean(resourceGroup), required: false },
  ];

  if (!serviceKey) {
    return {
      provider: 'sap-ai-core',
      ok: false,
      error: 'AICORE_SERVICE_KEY is not set',
      details: { envVars, attemptedProbe: false },
    };
  }

  // Validate JSON shape and extract the AI_API_URL for the probe.
  let apiUrl: string | undefined;
  try {
    const parsed = JSON.parse(serviceKey) as {
      serviceurls?: { AI_API_URL?: string };
    };
    const url = parsed.serviceurls?.AI_API_URL;
    if (typeof url === 'string' && url.length > 0) {
      apiUrl = url;
    }
  } catch {
    return {
      provider: 'sap-ai-core',
      ok: false,
      error: 'AICORE_SERVICE_KEY is set but not valid JSON',
      details: { envVars, attemptedProbe: false },
    };
  }

  if (!apiUrl) {
    return {
      provider: 'sap-ai-core',
      ok: false,
      error: 'AICORE_SERVICE_KEY is missing serviceurls.AI_API_URL',
      details: { envVars, attemptedProbe: false },
    };
  }

  if (skipNetwork) {
    return {
      provider: 'sap-ai-core',
      ok: true,
      details: { envVars, endpoint: apiUrl, attemptedProbe: false },
    };
  }

  const startedAt = Date.now();
  const connectivity = await checkConnectivity(apiUrl, timeoutMs);
  const latency = Date.now() - startedAt;

  if (!connectivity.reachable) {
    return {
      provider: 'sap-ai-core',
      ok: false,
      latency,
      error: connectivity.error ?? 'endpoint unreachable',
      details: { envVars, endpoint: apiUrl, connectivity, attemptedProbe: true },
    };
  }

  return {
    provider: 'sap-ai-core',
    ok: true,
    latency,
    details: { envVars, endpoint: apiUrl, connectivity, attemptedProbe: true },
  };
}

/**
 * Check the OpenAI-compatible proxy mode: `SAP_PROXY_BASE_URL` must be
 * set and a valid URL; `SAP_PROXY_API_KEY` is required for the proxy
 * route to actually authenticate but we only flag it as a missing env
 * var rather than failing hard, so the probe still runs.
 */
async function checkSapProxyHealth(timeoutMs: number, skipNetwork: boolean): Promise<HealthResult> {
  const baseUrl = env('SAP_PROXY_BASE_URL');
  const apiKey = env('SAP_PROXY_API_KEY');

  const envVars: HealthDetails['envVars'] = [
    { name: 'SAP_PROXY_BASE_URL', present: Boolean(baseUrl), required: true },
    { name: 'SAP_PROXY_API_KEY', present: Boolean(apiKey), required: true },
  ];

  if (!baseUrl) {
    return {
      provider: 'sap-proxy',
      ok: false,
      error: 'SAP_PROXY_BASE_URL is not set',
      details: { envVars, attemptedProbe: false },
    };
  }

  try {
    // Validate URL shape before issuing a request.
    new URL(baseUrl);
  } catch {
    return {
      provider: 'sap-proxy',
      ok: false,
      error: `SAP_PROXY_BASE_URL is not a valid URL: ${baseUrl}`,
      details: { envVars, endpoint: baseUrl, attemptedProbe: false },
    };
  }

  if (!apiKey) {
    return {
      provider: 'sap-proxy',
      ok: false,
      error: 'SAP_PROXY_API_KEY is not set',
      details: { envVars, endpoint: baseUrl, attemptedProbe: false },
    };
  }

  if (skipNetwork) {
    return {
      provider: 'sap-proxy',
      ok: true,
      details: { envVars, endpoint: baseUrl, attemptedProbe: false },
    };
  }

  const startedAt = Date.now();
  const connectivity = await checkConnectivity(baseUrl, timeoutMs);
  const latency = Date.now() - startedAt;

  if (!connectivity.reachable) {
    return {
      provider: 'sap-proxy',
      ok: false,
      latency,
      error: connectivity.error ?? 'proxy unreachable',
      details: { envVars, endpoint: baseUrl, connectivity, attemptedProbe: true },
    };
  }

  return {
    provider: 'sap-proxy',
    ok: true,
    latency,
    details: { envVars, endpoint: baseUrl, connectivity, attemptedProbe: true },
  };
}

/**
 * Check every provider in `providers` sequentially. Returns the full
 * list of outcomes in input order; callers decide how to render them.
 *
 * Sequential rather than parallel so operators watching the output see
 * results arrive in a predictable order (and so one slow probe does
 * not block or interleave with another).
 */
export async function checkAllProviderHealth(
  providers: readonly string[],
  options: CheckProviderHealthOptions = {}
): Promise<HealthResult[]> {
  const results: HealthResult[] = [];
  for (const provider of providers) {
    results.push(await checkProviderHealth(provider, options));
  }
  return results;
}
