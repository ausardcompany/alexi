/**
 * WebFetch Tool - Fetch content from URLs
 */

import { z } from 'zod';
import { defineTool, truncateOutput, type ToolResult } from '../index.js';

const WebFetchParamsSchema = z.object({
  url: z.string().describe('The URL to fetch content from'),
  format: z
    .enum(['text', 'markdown', 'html'])
    .optional()
    .default('markdown')
    .describe('Output format (default: markdown)'),
  timeout: z.number().optional().describe('Timeout in seconds (max 120, default 30)'),
});

interface WebFetchResult {
  url: string;
  contentType: string;
  content: string;
  statusCode: number;
}

export const webfetchTool = defineTool<typeof WebFetchParamsSchema, WebFetchResult>({
  name: 'webfetch',
  description: `Fetch content from a URL.

Usage:
- HTTP URLs are upgraded to HTTPS
- Returns content in text, markdown, or html format
- Timeout max is 120 seconds
- Content may be summarized if very large`,

  parameters: WebFetchParamsSchema,

  permission: {
    action: 'network',
    getResource: (params) => new URL(params.url).hostname,
  },

  async execute(params, context): Promise<ToolResult<WebFetchResult>> {
    try {
      // Parse and validate URL
      let url = params.url;
      if (url.startsWith('http://')) {
        url = 'https://' + url.slice(7);
      }
      if (!url.startsWith('https://')) {
        url = 'https://' + url;
      }

      const parsedUrl = new URL(url);

      const timeoutMs = Math.min(params.timeout ?? 30, 120) * 1000;
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);

      // Also respect context abort signal
      const abortHandler = () => controller.abort();
      context.signal?.addEventListener('abort', abortHandler);

      try {
        const response = await fetch(parsedUrl.toString(), {
          signal: controller.signal,
          headers: {
            'User-Agent': 'SAP-Bot-Orchestrator/1.0',
            Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          },
          redirect: 'follow',
        });

        clearTimeout(timer);
        context.signal?.removeEventListener('abort', abortHandler);

        // Check for redirect to different host
        const finalUrl = response.url;
        if (new URL(finalUrl).hostname !== parsedUrl.hostname) {
          return {
            success: true,
            data: {
              url: finalUrl,
              contentType: 'redirect',
              content: `Redirected to different host: ${finalUrl}. Make a new request with this URL.`,
              statusCode: response.status,
            },
          };
        }

        if (!response.ok) {
          return {
            success: false,
            error: `HTTP ${response.status}: ${response.statusText}`,
          };
        }

        const contentType = response.headers.get('content-type') ?? 'text/plain';
        let content = await response.text();

        // Simple HTML to markdown/text conversion
        if (params.format !== 'html' && contentType.includes('html')) {
          content = htmlToText(content, params.format === 'markdown');
        }

        const { content: truncatedContent, truncated } = truncateOutput(content);

        return {
          success: true,
          data: {
            url: finalUrl,
            contentType,
            content: truncatedContent,
            statusCode: response.status,
          },
          truncated,
          hint: truncated ? 'Content truncated due to size.' : undefined,
        };
      } finally {
        clearTimeout(timer);
        context.signal?.removeEventListener('abort', abortHandler);
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return {
          success: false,
          error: 'Request timed out or was aborted',
        };
      }
      return {
        success: false,
        error: err instanceof Error ? err.message : String(err),
      };
    }
  },
});

/**
 * Simple HTML to text/markdown conversion
 */
function htmlToText(html: string, markdown: boolean): string {
  // Remove script and style tags
  let text = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<noscript[^>]*>[\s\S]*?<\/noscript>/gi, '');

  // Convert common tags
  if (markdown) {
    // Headers
    text = text.replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, '# $1\n\n');
    text = text.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, '## $1\n\n');
    text = text.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, '### $1\n\n');
    text = text.replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, '#### $1\n\n');
    text = text.replace(/<h5[^>]*>([\s\S]*?)<\/h5>/gi, '##### $1\n\n');
    text = text.replace(/<h6[^>]*>([\s\S]*?)<\/h6>/gi, '###### $1\n\n');

    // Bold and italic
    text = text.replace(/<(strong|b)[^>]*>([\s\S]*?)<\/\1>/gi, '**$2**');
    text = text.replace(/<(em|i)[^>]*>([\s\S]*?)<\/\1>/gi, '*$2*');

    // Links
    text = text.replace(/<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, '[$2]($1)');

    // Code
    text = text.replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, '`$1`');
    text = text.replace(/<pre[^>]*>([\s\S]*?)<\/pre>/gi, '```\n$1\n```\n');

    // Lists
    text = text.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, '- $1\n');
  }

  // Line breaks and paragraphs
  text = text.replace(/<br\s*\/?>/gi, '\n');
  text = text.replace(/<\/p>/gi, '\n\n');
  text = text.replace(/<p[^>]*>/gi, '');

  // Remove remaining tags
  text = text.replace(/<[^>]+>/g, '');

  // Decode entities
  text = text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

  // Clean up whitespace
  text = text
    .split('\n')
    .map((line) => line.trim())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  return text;
}
