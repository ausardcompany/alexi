import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Bypass permission wiring so the tool can be invoked directly in tests.
vi.mock('../../../src/tool/index.js', async () => {
  const actual = await vi.importActual<typeof import('../../../src/tool/index.js')>(
    '../../../src/tool/index.js'
  );
  return {
    ...actual,
    defineTool: (def: Parameters<typeof actual.defineTool>[0]) => ({
      ...def,
      execute: def.execute,
      executeUnsafe: def.execute,
      toFunctionSchema: () => ({
        name: def.name,
        description: def.description,
        parameters: {},
      }),
    }),
  };
});

import {
  webfetchTool,
  collectBoundedResponseBody,
  MAX_RESPONSE_BYTES,
  _internals,
} from '../../../src/tool/tools/webfetch.js';
import type { ToolContext } from '../../../src/tool/index.js';

interface BuildResponseOptions {
  status?: number;
  headers?: Record<string, string>;
  bodyText?: string;
  bodyChunks?: Uint8Array[];
  /** When true, response.body is null and `text()` is used. */
  noBody?: boolean;
  /** Optional spy that fires whenever response.body.getReader() is called. */
  onGetReader?: () => void;
  url?: string;
}

function buildResponse(opts: BuildResponseOptions): Response {
  const headers = new Headers(opts.headers ?? {});
  const status = opts.status ?? 200;
  const url = opts.url ?? 'https://example.test/';

  let body: ReadableStream<Uint8Array> | null;
  if (opts.noBody) {
    body = null;
  } else {
    const chunks =
      opts.bodyChunks ??
      (opts.bodyText !== undefined ? [new TextEncoder().encode(opts.bodyText)] : []);
    body = new ReadableStream<Uint8Array>({
      start(controller) {
        for (const chunk of chunks) {
          controller.enqueue(chunk);
        }
        controller.close();
      },
    });
  }

  const response = {
    status,
    statusText: status === 200 ? 'OK' : 'Error',
    ok: status >= 200 && status < 300,
    headers,
    url,
    body,
    async text() {
      if (opts.bodyText !== undefined) {
        return opts.bodyText;
      }
      return '';
    },
  } as unknown as Response;

  if (opts.onGetReader && body) {
    const realStream = body;
    const spied = {
      getReader: () => {
        opts.onGetReader?.();
        return realStream.getReader();
      },
    } as unknown as ReadableStream<Uint8Array>;
    (response as { body: ReadableStream<Uint8Array> | null }).body = spied;
  }

  return response;
}

describe('webfetch tool', () => {
  const context: ToolContext = { workdir: '/tmp' };
  const originalHtmlToText = _internals.htmlToText;

  beforeEach(() => {
    _internals.htmlToText = originalHtmlToText;
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    _internals.htmlToText = originalHtmlToText;
  });

  it('exposes a 5 MB default response cap', () => {
    expect(MAX_RESPONSE_BYTES).toBe(5 * 1024 * 1024);
  });

  describe('collectBoundedResponseBody', () => {
    it('rejects oversize Content-Length without consuming the stream', async () => {
      let readerCreated = false;
      const response = buildResponse({
        headers: { 'content-length': '999999999' },
        bodyText: 'never read',
        onGetReader: () => {
          readerCreated = true;
        },
      });

      const result = await collectBoundedResponseBody(response, MAX_RESPONSE_BYTES);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('Content-Length');
        expect(result.error).toContain(String(MAX_RESPONSE_BYTES));
      }
      expect(readerCreated).toBe(false);
    });

    it('aborts the streaming read when running byte count exceeds the cap', async () => {
      const bigChunk = new Uint8Array(6 * 1024 * 1024); // 6 MB > 5 MB cap
      const response = buildResponse({ bodyChunks: [bigChunk] });

      const result = await collectBoundedResponseBody(response, MAX_RESPONSE_BYTES);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('streamed');
      }
    });

    it('decodes UTF-8 once the bounded buffer is assembled', async () => {
      const response = buildResponse({ bodyText: 'hello world' });

      const result = await collectBoundedResponseBody(response, MAX_RESPONSE_BYTES);

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.text).toBe('hello world');
      }
    });

    it('falls back to response.text() when body is null', async () => {
      const response = buildResponse({ noBody: true, bodyText: 'fallback body' });

      const result = await collectBoundedResponseBody(response, MAX_RESPONSE_BYTES);

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.text).toBe('fallback body');
      }
    });

    it('ignores a non-numeric Content-Length and still streams safely', async () => {
      const response = buildResponse({
        headers: { 'content-length': 'not-a-number' },
        bodyText: 'ok',
      });

      const result = await collectBoundedResponseBody(response, MAX_RESPONSE_BYTES);

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.text).toBe('ok');
      }
    });
  });

  describe('webfetch.execute', () => {
    it('returns an error and skips streaming when Content-Length exceeds cap', async () => {
      let readerCreated = false;
      const response = buildResponse({
        headers: {
          'content-length': '999999999',
          'content-type': 'text/html',
        },
        bodyText: 'should not be read',
        url: 'https://example.test/',
        onGetReader: () => {
          readerCreated = true;
        },
      });
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response));

      const result = await webfetchTool.execute(
        { url: 'https://example.test/', format: 'markdown' },
        context
      );

      expect(result.success).toBe(false);
      expect(result.error).toContain('Content-Length');
      expect(readerCreated).toBe(false);
    });

    it('returns an error when streamed body exceeds cap', async () => {
      const bigChunk = new Uint8Array(6 * 1024 * 1024);
      const response = buildResponse({
        headers: { 'content-type': 'text/plain' },
        bodyChunks: [bigChunk],
        url: 'https://example.test/',
      });
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response));

      const result = await webfetchTool.execute(
        { url: 'https://example.test/', format: 'markdown' },
        context
      );

      expect(result.success).toBe(false);
      expect(result.error).toContain('streamed');
    });

    it('returns content on the success path when body is under the cap', async () => {
      const response = buildResponse({
        headers: { 'content-type': 'text/html' },
        bodyText: '<h1>Hello</h1><p>World</p>',
        url: 'https://example.test/',
      });
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response));

      const result = await webfetchTool.execute(
        { url: 'https://example.test/', format: 'markdown' },
        context
      );

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data?.content).toContain('# Hello');
        expect(result.data?.content).toContain('World');
        expect(result.data?.statusCode).toBe(200);
        expect(result.data?.contentType).toContain('text/html');
      }
    });

    it('surfaces a thrown HTML converter as a tool error rather than crashing', async () => {
      const response = buildResponse({
        headers: { 'content-type': 'text/html' },
        bodyText: '<script>unclosed',
        url: 'https://example.test/',
      });
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response));

      // Simulate catastrophic regex backtracking by making htmlToText throw.
      _internals.htmlToText = () => {
        throw new RangeError('Invalid string length');
      };

      const result = await webfetchTool.execute(
        { url: 'https://example.test/', format: 'markdown' },
        context
      );

      expect(result.success).toBe(false);
      expect(result.error).toContain('HTML conversion failed');
      expect(result.error).toContain('Invalid string length');
    });

    it('passes through raw HTML when format=html (converter not invoked)', async () => {
      let converterCalls = 0;
      _internals.htmlToText = (..._args) => {
        converterCalls += 1;
        return 'should not be called';
      };
      const response = buildResponse({
        headers: { 'content-type': 'text/html' },
        bodyText: '<h1>Raw</h1>',
        url: 'https://example.test/',
      });
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response));

      const result = await webfetchTool.execute(
        { url: 'https://example.test/', format: 'html' },
        context
      );

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data?.content).toBe('<h1>Raw</h1>');
      }
      expect(converterCalls).toBe(0);
    });
  });
});
