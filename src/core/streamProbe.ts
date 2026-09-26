/**
 * Stream-silence connectivity probe (issue #1836).
 *
 * When a provider stream falls silent (no chunk, no error), the
 * {@link import('./streamWatchdog.js').createStreamWatchdog} idle timer
 * fires. Historically that surfaced only as a `StreamStalledError`, which
 * looks the same to the user whether the model is thinking hard or the
 * network cable was unplugged. This module adds a cheap connectivity
 * probe the watchdog can call at the moment of stall so the TUI can
 * render a distinct `[waiting for network]` inline error and let the
 * user retry instead of staring at an infinite spinner.
 *
 * Design summary:
 * - {@link isLocalEndpoint} classifies the provider baseURL as local
 *   (localhost, 127/8, 10/8, 192.168/16, 172.16/12, bare hostname with
 *   no dot) or remote. Local endpoints get a TCP-connect probe on the
 *   URL's port; remote endpoints get an HTTP HEAD probe via the shared
 *   {@link import('../providers/connectivity.js').checkConnectivity}.
 * - {@link resolveProviderBaseUrl} pulls the provider's base URL from
 *   `SAP_PROXY_BASE_URL`, then falls back to the AI_API_URL inside
 *   `AICORE_SERVICE_KEY`. Env-var references (`${VAR}` and `$VAR`) are
 *   expanded so users can layer overrides.
 * - {@link probeStreamConnectivity} composes the two: resolve URL,
 *   classify, run the appropriate probe, and return a plain
 *   `{ reachable, error? }` result. All errors are caught internally —
 *   the caller never needs a try/catch.
 *
 * The module deliberately has NO React/Ink dependencies so it can run
 * in the streaming orchestrator's server-side code path without pulling
 * in TUI machinery.
 */

import net from 'node:net';

import { env } from '../config/env.js';
import { checkConnectivity, type ConnectivityResult } from '../providers/connectivity.js';

/**
 * Default TCP-connect timeout for the local-endpoint probe (ms).
 * Kept short so a hung local proxy does not compound the user's
 * already-perceived stall. Two seconds is generous for a loopback or
 * LAN TCP handshake and matches the "quickly surface a disconnect"
 * intent behind Kilocode #13523.
 */
export const DEFAULT_LOCAL_PROBE_TIMEOUT_MS = 2_000;

/**
 * Default HTTP HEAD timeout for the remote-endpoint probe (ms). Uses a
 * shorter budget than {@link checkConnectivity}'s startup default so a
 * mid-stream stall does not stack up another 15 seconds of dead air
 * before the TUI can react.
 */
export const DEFAULT_REMOTE_PROBE_TIMEOUT_MS = 3_000;

/**
 * Structured probe result. Mirrors {@link ConnectivityResult} to keep the
 * shape ergonomic for callers already handling that type.
 */
export interface ProbeResult {
  /** True if the endpoint accepted a connection / responded to HEAD. */
  reachable: boolean;
  /** Human-readable failure detail when {@link reachable} is `false`. */
  error?: string;
  /** Classification used ('local' or 'remote'), for logs/tests. */
  kind?: 'local' | 'remote';
  /** URL actually probed (post env-var expansion). */
  url?: string;
}

/**
 * Options accepted by {@link probeStreamConnectivity}. All optional; the
 * defaults are appropriate for a stream-silence probe fired from the
 * watchdog.
 */
export interface StreamProbeOptions {
  /** Base URL to probe. If omitted, resolved via {@link resolveProviderBaseUrl}. */
  baseUrl?: string;
  /** TCP-connect timeout for local endpoints (ms). */
  localTimeoutMs?: number;
  /** HTTP HEAD timeout for remote endpoints (ms). */
  remoteTimeoutMs?: number;
  /**
   * Test/DI override for the remote probe. Defaults to the shared
   * {@link checkConnectivity} helper. Injecting a stub keeps the unit
   * tests free of real network dependencies.
   */
  remoteProbe?: (url: string, timeoutMs?: number) => Promise<ConnectivityResult>;
  /**
   * Test/DI override for the local TCP probe. Defaults to
   * {@link tcpConnect}.
   */
  localProbe?: (host: string, port: number, timeoutMs: number) => Promise<ProbeResult>;
}

/**
 * Regex for private/loopback IPv4 ranges. Matches:
 * - 127.0.0.0/8    (loopback)
 * - 10.0.0.0/8     (RFC1918 private)
 * - 192.168.0.0/16 (RFC1918 private)
 * - 172.16.0.0/12  (RFC1918 private, 172.16.x-172.31.x)
 * - 169.254.0.0/16 (link-local)
 *
 * Kept as a lazy-evaluated array so tests can extend without patching a
 * frozen constant.
 */
const PRIVATE_IPV4_RANGES: ReadonlyArray<RegExp> = [
  /^127\./,
  /^10\./,
  /^192\.168\./,
  /^172\.(1[6-9]|2\d|3[0-1])\./,
  /^169\.254\./,
];

/**
 * IPv6 loopback and unique-local-address prefixes we treat as "local".
 * Any address in `::1`, `fc00::/7`, or `fe80::/10` (link-local) qualifies.
 */
function isIpv6Local(host: string): boolean {
  const cleaned = host.replace(/^\[|\]$/g, '').toLowerCase();
  if (cleaned === '::1') {
    return true;
  }
  // fc00::/7 (unique local) and fe80::/10 (link-local)
  return /^(fc|fd)/.test(cleaned) || cleaned.startsWith('fe80:');
}

/**
 * Classify an endpoint URL as local (loopback, RFC1918, link-local,
 * unresolved bare hostname) vs remote (public/resolvable).
 *
 * A bare hostname without a dot (e.g. `sap-ai-core`, `my-proxy`) is
 * treated as local because it typically resolves to a machine on the
 * corporate LAN via /etc/hosts, dnsmasq, or Docker DNS — probing it via
 * TCP-connect gives an immediate signal even when public DNS is
 * unreachable.
 *
 * @param url  Absolute URL (with protocol) to classify. Malformed URLs
 *             return `'remote'` so we default to the safer public-HEAD
 *             probe rather than skipping the check.
 */
export function isLocalEndpoint(url: string): boolean {
  let host: string;
  try {
    host = new URL(url).hostname;
  } catch {
    return false;
  }
  if (!host) {
    return false;
  }
  const lower = host.toLowerCase();
  if (lower === 'localhost') {
    return true;
  }
  // Bare hostname (no dot) → LAN-only per docs above.
  if (!lower.includes('.') && !lower.includes(':')) {
    return true;
  }
  // IPv6 literal
  if (lower.includes(':')) {
    return isIpv6Local(lower);
  }
  // IPv4 dotted quad → check private ranges.
  if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(lower)) {
    return PRIVATE_IPV4_RANGES.some((r) => r.test(lower));
  }
  return false;
}

/**
 * Expand `${VAR}` and `$VAR` references in a URL string using
 * `process.env`. Unset variables expand to the empty string, matching
 * shell semantics; this is the safest behaviour when a config points at
 * `${SAP_HOST}/v2/lm` and `SAP_HOST` is unset — we degrade to a bad URL
 * and the probe reports unreachable, which is exactly the signal the
 * watchdog wants.
 */
export function expandEnvVars(input: string): string {
  return input
    .replace(/\$\{([A-Z_][A-Z0-9_]*)\}/gi, (_m, name: string) => process.env[name] ?? '')
    .replace(/\$([A-Z_][A-Z0-9_]*)/gi, (_m, name: string) => process.env[name] ?? '');
}

/**
 * Resolve the provider base URL for the stream-silence probe. Mirrors
 * the resolution order used inside `SapOrchestrationProvider.resolveApiBaseUrl`
 * so the probe hits the same endpoint the failing stream is attached to.
 *
 * Resolution order:
 *   1. Explicit `SAP_PROXY_BASE_URL` env var.
 *   2. `serviceurls.AI_API_URL` inside `AICORE_SERVICE_KEY` (JSON).
 *   3. `undefined` when neither is present — callers must treat this as
 *      "no probe possible, fall back to the stall path".
 */
export function resolveProviderBaseUrl(): string | undefined {
  const proxyUrl = env('SAP_PROXY_BASE_URL');
  if (proxyUrl && proxyUrl.trim().length > 0) {
    return expandEnvVars(proxyUrl.trim());
  }

  const serviceKeyJson = env('AICORE_SERVICE_KEY');
  if (serviceKeyJson) {
    try {
      const serviceKey: unknown = JSON.parse(serviceKeyJson);
      if (
        typeof serviceKey === 'object' &&
        serviceKey !== null &&
        'serviceurls' in serviceKey &&
        typeof (serviceKey as { serviceurls: unknown }).serviceurls === 'object' &&
        (serviceKey as { serviceurls: unknown }).serviceurls !== null &&
        'AI_API_URL' in (serviceKey as { serviceurls: Record<string, unknown> }).serviceurls
      ) {
        const raw = (serviceKey as { serviceurls: Record<string, unknown> }).serviceurls.AI_API_URL;
        if (typeof raw === 'string' && raw.trim().length > 0) {
          return expandEnvVars(raw.trim());
        }
      }
    } catch {
      // Malformed JSON: fall through and return undefined so the probe
      // becomes a no-op rather than surfacing a spurious "unreachable".
    }
  }
  return undefined;
}

/**
 * Attempt a TCP handshake to `host:port` with an explicit timeout.
 *
 * Resolves to `{ reachable: true }` on `connect`; resolves to
 * `{ reachable: false, error }` on timeout, refused, or DNS failure.
 * Never rejects — the probe is best-effort observability, not a control
 * flow primitive.
 */
export function tcpConnect(
  host: string,
  port: number,
  timeoutMs: number = DEFAULT_LOCAL_PROBE_TIMEOUT_MS
): Promise<ProbeResult> {
  return new Promise<ProbeResult>((resolve) => {
    let settled = false;
    const settle = (result: ProbeResult): void => {
      if (settled) {
        return;
      }
      settled = true;
      try {
        socket.destroy();
      } catch {
        // ignore: socket may already be closed.
      }
      resolve(result);
    };

    const socket = new net.Socket();
    socket.setNoDelay(true);
    const timer = setTimeout(() => {
      settle({
        reachable: false,
        error: `TCP connect to ${host}:${port} timed out after ${timeoutMs}ms`,
        kind: 'local',
      });
    }, timeoutMs);
    // Do not let the probe timer keep the event loop alive.
    if (typeof (timer as { unref?: () => void }).unref === 'function') {
      (timer as { unref: () => void }).unref();
    }

    socket.once('connect', () => {
      clearTimeout(timer);
      settle({ reachable: true, kind: 'local' });
    });
    socket.once('error', (err: Error) => {
      clearTimeout(timer);
      settle({
        reachable: false,
        error: `TCP connect to ${host}:${port} failed: ${err.message}`,
        kind: 'local',
      });
    });

    try {
      socket.connect(port, host);
    } catch (err) {
      clearTimeout(timer);
      const message = err instanceof Error ? err.message : String(err);
      settle({
        reachable: false,
        error: `TCP connect to ${host}:${port} threw synchronously: ${message}`,
        kind: 'local',
      });
    }
  });
}

/**
 * Derive the numeric port from a URL, applying protocol defaults so
 * `https://foo` maps to 443 and `http://foo` to 80 without an explicit
 * `:443` / `:80`.
 */
function portOfUrl(u: URL): number {
  if (u.port) {
    return parseInt(u.port, 10);
  }
  if (u.protocol === 'https:') {
    return 443;
  }
  if (u.protocol === 'http:') {
    return 80;
  }
  // Fallback: unknown protocol, try 443 (safer default for corp proxies).
  return 443;
}

/**
 * Run the stream-silence connectivity probe.
 *
 * Contract:
 * - Returns `{ reachable: true }` when the endpoint responds (TCP for
 *   local, HTTP HEAD for remote).
 * - Returns `{ reachable: false, error }` when the endpoint is
 *   unreachable OR the base URL cannot be resolved.
 * - Never throws. Never rejects.
 *
 * The consumer is the watchdog; it uses the boolean to decide whether
 * to surface a `NetworkDisconnectedError` (probe failed → network is
 * down) or the usual `StreamStalledError` (probe passed → server is
 * slow / stuck).
 */
export async function probeStreamConnectivity(options?: StreamProbeOptions): Promise<ProbeResult> {
  const baseUrl = options?.baseUrl ?? resolveProviderBaseUrl();
  if (!baseUrl) {
    return {
      reachable: false,
      error: 'No provider base URL configured (SAP_PROXY_BASE_URL / AICORE_SERVICE_KEY unset)',
    };
  }

  let parsed: URL;
  try {
    parsed = new URL(baseUrl);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { reachable: false, error: `Invalid provider base URL "${baseUrl}": ${message}` };
  }

  if (isLocalEndpoint(baseUrl)) {
    const probe = options?.localProbe ?? tcpConnect;
    const port = portOfUrl(parsed);
    const host = parsed.hostname.replace(/^\[|\]$/g, '');
    const result = await probe(
      host,
      port,
      options?.localTimeoutMs ?? DEFAULT_LOCAL_PROBE_TIMEOUT_MS
    );
    return { ...result, kind: 'local', url: baseUrl };
  }

  const probe = options?.remoteProbe ?? checkConnectivity;
  const timeoutMs = options?.remoteTimeoutMs ?? DEFAULT_REMOTE_PROBE_TIMEOUT_MS;
  const result = await probe(baseUrl, timeoutMs);
  return {
    reachable: result.reachable,
    error: result.error,
    kind: 'remote',
    url: baseUrl,
  };
}

/**
 * Error raised by {@link import('./streamWatchdog.js').createStreamWatchdog}
 * when a stream-silence probe classifies the failure as a network
 * disconnect rather than a plain provider stall.
 *
 * Kept in this module (not `streamWatchdog.ts`) so the probe is the
 * source of truth for what "disconnected" means; the watchdog re-exports
 * the class for consumer imports.
 */
export class NetworkDisconnectedError extends Error {
  /** Discriminator for `isNetworkDisconnectedError` and TUI branches. */
  readonly isNetworkDisconnected = true;
  /** Machine-readable code kept stable across message revisions. */
  readonly code = 'NETWORK_DISCONNECTED';
  /** Endpoint URL that failed the probe (post env-var expansion). */
  readonly url?: string;
  /** 'local' or 'remote' kind, mirrored from {@link ProbeResult}. */
  readonly kind?: 'local' | 'remote';
  constructor(detail: string, meta?: { url?: string; kind?: 'local' | 'remote' }) {
    super(`Network disconnected: ${detail}`);
    this.name = 'NetworkDisconnectedError';
    this.url = meta?.url;
    this.kind = meta?.kind;
  }
}

/**
 * Type-guard for {@link NetworkDisconnectedError} that also matches
 * duck-typed errors carrying the marker (defensive against
 * cross-module-boundary `instanceof` failures — same pattern as
 * `isStreamStalledError`).
 */
export function isNetworkDisconnectedError(err: unknown): err is NetworkDisconnectedError {
  if (err instanceof NetworkDisconnectedError) {
    return true;
  }
  return (
    typeof err === 'object' &&
    err !== null &&
    (err as { isNetworkDisconnected?: unknown }).isNetworkDisconnected === true
  );
}
