import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { checkConnectivity } from '../../src/providers/connectivity.js';

describe('checkConnectivity', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('success path', () => {
    it('returns reachable when fetch resolves with 200', async () => {
      vi.mocked(fetch).mockResolvedValue(new Response(null, { status: 200 }));

      const result = await checkConnectivity('https://api.example.com');

      expect(result).toEqual({ reachable: true });
      expect(fetch).toHaveBeenCalledWith('https://api.example.com', {
        method: 'HEAD',
        signal: expect.any(AbortSignal),
      });
    });

    it('returns reachable on 401 (auth failure still means reachable)', async () => {
      vi.mocked(fetch).mockResolvedValue(new Response(null, { status: 401 }));

      const result = await checkConnectivity('https://api.example.com');

      expect(result).toEqual({ reachable: true });
    });

    it('returns reachable on 404', async () => {
      vi.mocked(fetch).mockResolvedValue(new Response(null, { status: 404 }));

      const result = await checkConnectivity('https://api.example.com');

      expect(result).toEqual({ reachable: true });
    });

    it('returns reachable on 500 (server error still means reachable)', async () => {
      vi.mocked(fetch).mockResolvedValue(new Response(null, { status: 500 }));

      const result = await checkConnectivity('https://api.example.com');

      expect(result).toEqual({ reachable: true });
    });
  });

  describe('timeout path', () => {
    it('returns unreachable with timeout error message', async () => {
      const timeoutError = new DOMException('The operation was aborted.', 'TimeoutError');
      vi.mocked(fetch).mockRejectedValue(timeoutError);

      const result = await checkConnectivity('https://api.example.com', 15000);

      expect(result.reachable).toBe(false);
      expect(result.error).toBe('API unreachable after 15s — check network connection');
    });

    it('uses custom timeout value in error message', async () => {
      const timeoutError = new DOMException('The operation was aborted.', 'TimeoutError');
      vi.mocked(fetch).mockRejectedValue(timeoutError);

      const result = await checkConnectivity('https://api.example.com', 5000);

      expect(result.reachable).toBe(false);
      expect(result.error).toBe('API unreachable after 5s — check network connection');
    });

    it('uses default 15s timeout when no timeout specified', async () => {
      const timeoutError = new DOMException('The operation was aborted.', 'TimeoutError');
      vi.mocked(fetch).mockRejectedValue(timeoutError);

      const result = await checkConnectivity('https://api.example.com');

      expect(result.reachable).toBe(false);
      expect(result.error).toContain('15s');
    });
  });

  describe('network error path', () => {
    it('returns unreachable on network TypeError', async () => {
      const networkError = new TypeError('fetch failed');
      vi.mocked(fetch).mockRejectedValue(networkError);

      const result = await checkConnectivity('https://api.example.com');

      expect(result.reachable).toBe(false);
      expect(result.error).toContain('check network connection');
      expect(result.error).toContain('fetch failed');
    });

    it('returns unreachable on generic errors with descriptive message', async () => {
      vi.mocked(fetch).mockRejectedValue(new Error('ECONNREFUSED'));

      const result = await checkConnectivity('https://api.example.com');

      expect(result.reachable).toBe(false);
      expect(result.error).toContain('ECONNREFUSED');
    });
  });

  describe('error message quality', () => {
    it('includes actionable guidance in timeout error', async () => {
      const timeoutError = new DOMException('The operation was aborted.', 'TimeoutError');
      vi.mocked(fetch).mockRejectedValue(timeoutError);

      const result = await checkConnectivity('https://api.example.com');

      expect(result.error).toContain('check network connection');
    });

    it('includes actionable guidance in network error', async () => {
      const networkError = new TypeError('fetch failed: network error');
      vi.mocked(fetch).mockRejectedValue(networkError);

      const result = await checkConnectivity('https://api.example.com');

      expect(result.error).toContain('check network connection');
    });
  });
});
