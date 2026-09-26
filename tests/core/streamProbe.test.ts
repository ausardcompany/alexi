/**
 * Unit tests for the stream-silence connectivity probe (issue #1836).
 *
 * Covers:
 *   - `isLocalEndpoint` classification for loopback, RFC1918, IPv6
 *     literals, bare hostnames, and public FQDNs.
 *   - `resolveProviderBaseUrl` env-var resolution (proxy URL wins,
 *     falls back to `serviceurls.AI_API_URL` inside `AICORE_SERVICE_KEY`,
 *     env-var references expanded).
 *   - `probeStreamConnectivity` dispatching to the local TCP probe vs
 *     the remote HTTP HEAD probe based on classification.
 *   - `NetworkDisconnectedError` shape + `isNetworkDisconnectedError`
 *     type-guard.
 *
 * No real network is touched: the remote-HEAD probe is stubbed via
 * `remoteProbe` DI, and the local-TCP probe uses a `net.createServer`
 * ephemeral listener so the test controls whether the port accepts
 * connections.
 */
import { describe, it, expect, afterEach } from 'vitest';
import net from 'node:net';

import {
  isLocalEndpoint,
  resolveProviderBaseUrl,
  expandEnvVars,
  tcpConnect,
  probeStreamConnectivity,
  NetworkDisconnectedError,
  isNetworkDisconnectedError,
} from '../../src/core/streamProbe.js';

describe('isLocalEndpoint', () => {
  it('classifies loopback / RFC1918 / link-local IPv4 as local', () => {
    expect(isLocalEndpoint('http://127.0.0.1:8080')).toBe(true);
    expect(isLocalEndpoint('http://localhost:8080')).toBe(true);
    expect(isLocalEndpoint('http://10.0.5.1:9000')).toBe(true);
    expect(isLocalEndpoint('http://192.168.1.42:8080')).toBe(true);
    expect(isLocalEndpoint('http://172.16.0.1:8080')).toBe(true);
    expect(isLocalEndpoint('http://172.31.255.254:8080')).toBe(true);
    expect(isLocalEndpoint('http://169.254.10.5:80')).toBe(true);
  });

  it('classifies IPv4 addresses outside RFC1918 as remote', () => {
    // Boundary cases: 172.15.x and 172.32.x are NOT in 172.16/12.
    expect(isLocalEndpoint('http://172.15.0.1:8080')).toBe(false);
    expect(isLocalEndpoint('http://172.32.0.1:8080')).toBe(false);
    expect(isLocalEndpoint('http://8.8.8.8')).toBe(false);
    expect(isLocalEndpoint('http://11.0.0.1')).toBe(false);
  });

  it('classifies bare hostnames (no dot) as local', () => {
    // Typical corporate LAN pattern: `sap-ai-core`, `my-proxy`, resolved
    // via /etc/hosts, dnsmasq, or Docker DNS.
    expect(isLocalEndpoint('http://sap-ai-core:8080')).toBe(true);
    expect(isLocalEndpoint('https://my-proxy/v2/lm')).toBe(true);
  });

  it('classifies fully-qualified domain names as remote', () => {
    expect(isLocalEndpoint('https://api.ai.prod.eu-central-1.aws.ml.hana.ondemand.com')).toBe(
      false
    );
    expect(isLocalEndpoint('https://api.openai.com/v1')).toBe(false);
  });

  it('handles IPv6 loopback / unique-local / link-local as local', () => {
    expect(isLocalEndpoint('http://[::1]:8080')).toBe(true);
    expect(isLocalEndpoint('http://[fc00::1]:80')).toBe(true);
    expect(isLocalEndpoint('http://[fd12:3456:789a::1]:80')).toBe(true);
    expect(isLocalEndpoint('http://[fe80::1]:80')).toBe(true);
  });

  it('classifies public IPv6 as remote', () => {
    expect(isLocalEndpoint('http://[2606:4700:4700::1111]:80')).toBe(false);
  });

  it('returns false for malformed URLs (defaults to remote HEAD probe)', () => {
    expect(isLocalEndpoint('not a url')).toBe(false);
    expect(isLocalEndpoint('')).toBe(false);
  });
});

describe('expandEnvVars', () => {
  const ORIG_HOST = process.env.SAP_TEST_HOST;
  afterEach(() => {
    if (ORIG_HOST === undefined) {
      delete process.env.SAP_TEST_HOST;
    } else {
      process.env.SAP_TEST_HOST = ORIG_HOST;
    }
  });

  it('expands ${VAR} and $VAR from process.env', () => {
    process.env.SAP_TEST_HOST = 'api.example.com';
    expect(expandEnvVars('https://${SAP_TEST_HOST}/v2/lm')).toBe('https://api.example.com/v2/lm');
    expect(expandEnvVars('https://$SAP_TEST_HOST/v2/lm')).toBe('https://api.example.com/v2/lm');
  });

  it('expands unset variables to the empty string (shell semantics)', () => {
    delete process.env.SAP_TEST_HOST;
    expect(expandEnvVars('https://${SAP_TEST_HOST}/v2/lm')).toBe('https:///v2/lm');
  });

  it('leaves strings without references untouched', () => {
    expect(expandEnvVars('https://localhost:8080/v2')).toBe('https://localhost:8080/v2');
  });
});

describe('resolveProviderBaseUrl', () => {
  const ORIG_PROXY = process.env.SAP_PROXY_BASE_URL;
  const ORIG_KEY = process.env.AICORE_SERVICE_KEY;

  afterEach(() => {
    if (ORIG_PROXY === undefined) {
      delete process.env.SAP_PROXY_BASE_URL;
    } else {
      process.env.SAP_PROXY_BASE_URL = ORIG_PROXY;
    }
    if (ORIG_KEY === undefined) {
      delete process.env.AICORE_SERVICE_KEY;
    } else {
      process.env.AICORE_SERVICE_KEY = ORIG_KEY;
    }
  });

  it('prefers SAP_PROXY_BASE_URL when set', () => {
    process.env.SAP_PROXY_BASE_URL = 'http://localhost:9000/v2';
    process.env.AICORE_SERVICE_KEY = JSON.stringify({
      serviceurls: { AI_API_URL: 'https://public.example.com' },
    });
    expect(resolveProviderBaseUrl()).toBe('http://localhost:9000/v2');
  });

  it('falls back to serviceurls.AI_API_URL inside AICORE_SERVICE_KEY', () => {
    delete process.env.SAP_PROXY_BASE_URL;
    process.env.AICORE_SERVICE_KEY = JSON.stringify({
      serviceurls: { AI_API_URL: 'https://api.ai.example.com' },
    });
    expect(resolveProviderBaseUrl()).toBe('https://api.ai.example.com');
  });

  it('expands env-var references inside the resolved URL', () => {
    process.env.SAP_PROXY_BASE_URL = 'https://${SAP_PROXY_HOST}/v2';
    process.env.SAP_PROXY_HOST = 'proxy.local';
    try {
      expect(resolveProviderBaseUrl()).toBe('https://proxy.local/v2');
    } finally {
      delete process.env.SAP_PROXY_HOST;
    }
  });

  it('returns undefined when neither env var is set', () => {
    delete process.env.SAP_PROXY_BASE_URL;
    delete process.env.AICORE_SERVICE_KEY;
    expect(resolveProviderBaseUrl()).toBeUndefined();
  });

  it('returns undefined when AICORE_SERVICE_KEY is not valid JSON', () => {
    delete process.env.SAP_PROXY_BASE_URL;
    process.env.AICORE_SERVICE_KEY = '{not-json';
    expect(resolveProviderBaseUrl()).toBeUndefined();
  });

  it('returns undefined when service key lacks serviceurls.AI_API_URL', () => {
    delete process.env.SAP_PROXY_BASE_URL;
    process.env.AICORE_SERVICE_KEY = JSON.stringify({ serviceurls: {} });
    expect(resolveProviderBaseUrl()).toBeUndefined();
  });
});

describe('tcpConnect', () => {
  let server: net.Server | null = null;

  afterEach(async () => {
    if (server) {
      const s = server;
      server = null;
      await new Promise<void>((resolve) => s.close(() => resolve()));
    }
  });

  it('resolves { reachable: true } when the port accepts a connection', async () => {
    server = net.createServer((socket) => socket.destroy());
    await new Promise<void>((resolve) => server!.listen(0, '127.0.0.1', resolve));
    const address = server.address();
    if (!address || typeof address !== 'object') {
      throw new Error('failed to bind ephemeral port');
    }
    const result = await tcpConnect('127.0.0.1', address.port, 1_000);
    expect(result.reachable).toBe(true);
    expect(result.kind).toBe('local');
  });

  it('resolves { reachable: false } when connect is refused', async () => {
    // Bind then close to release a port that is now guaranteed unused
    // (best effort — the OS could reassign it, but the window is small).
    const srv = net.createServer();
    await new Promise<void>((resolve) => srv.listen(0, '127.0.0.1', resolve));
    const address = srv.address();
    if (!address || typeof address !== 'object') {
      throw new Error('failed to bind ephemeral port');
    }
    const port = address.port;
    await new Promise<void>((resolve) => srv.close(() => resolve()));

    const result = await tcpConnect('127.0.0.1', port, 1_000);
    expect(result.reachable).toBe(false);
    expect(result.error).toMatch(/TCP connect to 127\.0\.0\.1/);
    expect(result.kind).toBe('local');
  });

  it('resolves { reachable: false } on timeout when the port silently drops SYNs', async () => {
    // 10.255.255.1 is a documentation-range address that is almost
    // guaranteed to black-hole. Kept in the RFC1918 space to preserve
    // the "local" classification even when unreachable.
    const result = await tcpConnect('10.255.255.1', 65535, 150);
    expect(result.reachable).toBe(false);
    expect(result.error).toMatch(/timed out|failed/i);
  });
});

describe('probeStreamConnectivity', () => {
  it('uses the local probe for a local base URL', async () => {
    let localCalled = false;
    let remoteCalled = false;
    const result = await probeStreamConnectivity({
      baseUrl: 'http://127.0.0.1:9999',
      localProbe: async () => {
        localCalled = true;
        return { reachable: true, kind: 'local' };
      },
      remoteProbe: async () => {
        remoteCalled = true;
        return { reachable: true };
      },
    });
    expect(localCalled).toBe(true);
    expect(remoteCalled).toBe(false);
    expect(result.reachable).toBe(true);
    expect(result.kind).toBe('local');
    expect(result.url).toBe('http://127.0.0.1:9999');
  });

  it('uses the remote probe for a public FQDN base URL', async () => {
    let localCalled = false;
    let remoteCalled = false;
    const result = await probeStreamConnectivity({
      baseUrl: 'https://api.example.com',
      localProbe: async () => {
        localCalled = true;
        return { reachable: true };
      },
      remoteProbe: async () => {
        remoteCalled = true;
        return { reachable: true };
      },
    });
    expect(remoteCalled).toBe(true);
    expect(localCalled).toBe(false);
    expect(result.reachable).toBe(true);
    expect(result.kind).toBe('remote');
    expect(result.url).toBe('https://api.example.com');
  });

  it('surfaces the underlying error when the endpoint is unreachable', async () => {
    const result = await probeStreamConnectivity({
      baseUrl: 'https://api.example.com',
      remoteProbe: async () => ({ reachable: false, error: 'DNS resolution failed' }),
    });
    expect(result.reachable).toBe(false);
    expect(result.error).toBe('DNS resolution failed');
    expect(result.kind).toBe('remote');
  });

  it('returns unreachable with a descriptive error when no base URL can be resolved', async () => {
    const origProxy = process.env.SAP_PROXY_BASE_URL;
    const origKey = process.env.AICORE_SERVICE_KEY;
    delete process.env.SAP_PROXY_BASE_URL;
    delete process.env.AICORE_SERVICE_KEY;
    try {
      const result = await probeStreamConnectivity();
      expect(result.reachable).toBe(false);
      expect(result.error).toMatch(/No provider base URL/);
    } finally {
      if (origProxy !== undefined) {
        process.env.SAP_PROXY_BASE_URL = origProxy;
      }
      if (origKey !== undefined) {
        process.env.AICORE_SERVICE_KEY = origKey;
      }
    }
  });

  it('returns unreachable when the base URL is syntactically invalid', async () => {
    const result = await probeStreamConnectivity({ baseUrl: 'not a url' });
    expect(result.reachable).toBe(false);
    expect(result.error).toMatch(/Invalid provider base URL/);
  });
});

describe('NetworkDisconnectedError', () => {
  it('is an Error subclass with a stable name, code, and marker', () => {
    const err = new NetworkDisconnectedError('endpoint unreachable', {
      url: 'https://api.example.com',
      kind: 'remote',
    });
    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(NetworkDisconnectedError);
    expect(err.name).toBe('NetworkDisconnectedError');
    expect(err.code).toBe('NETWORK_DISCONNECTED');
    expect(err.isNetworkDisconnected).toBe(true);
    expect(err.url).toBe('https://api.example.com');
    expect(err.kind).toBe('remote');
    expect(err.message).toBe('Network disconnected: endpoint unreachable');
  });
});

describe('isNetworkDisconnectedError', () => {
  it('returns true for real NetworkDisconnectedError instances', () => {
    expect(isNetworkDisconnectedError(new NetworkDisconnectedError('nope'))).toBe(true);
  });

  it('returns true for duck-typed errors carrying isNetworkDisconnected=true', () => {
    // Same defensive pattern as `isStreamStalledError` — errors that
    // cross module/worker boundaries can fail `instanceof` while
    // preserving own-property markers.
    expect(isNetworkDisconnectedError({ isNetworkDisconnected: true })).toBe(true);
  });

  it('returns false for unrelated errors and non-error values', () => {
    expect(isNetworkDisconnectedError(new Error('boom'))).toBe(false);
    expect(isNetworkDisconnectedError(null)).toBe(false);
    expect(isNetworkDisconnectedError(undefined)).toBe(false);
    expect(isNetworkDisconnectedError({ isNetworkDisconnected: false })).toBe(false);
    expect(isNetworkDisconnectedError('disconnected')).toBe(false);
  });
});
