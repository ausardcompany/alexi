/**
 * Browser Tool - Browser automation using Puppeteer
 *
 * Puppeteer is an optional dependency (~120MB).
 * If not installed, returns a helpful error message.
 */

import { z } from 'zod';
import { defineTool, truncateOutput, type ToolResult } from '../index.js';
import { redactUrl } from '../../utils/url-redact.js';
import { redactUrlsFromString } from '../../utils/logger.js';

// Puppeteer types - we define minimal interfaces to avoid requiring the package
interface PuppeteerBrowser {
  newPage(): Promise<PuppeteerPage>;
  close(): Promise<void>;
}

interface PuppeteerPage {
  goto(url: string, options?: { waitUntil?: string; timeout?: number }): Promise<unknown>;
  click(selector: string): Promise<void>;
  mouse: {
    click(x: number, y: number): Promise<void>;
  };
  keyboard: {
    type(text: string): Promise<void>;
  };
  screenshot(options?: {
    encoding?: 'base64' | 'binary';
    fullPage?: boolean;
  }): Promise<string | Buffer>;
  content(): Promise<string>;
  url(): string;
  title(): Promise<string>;
  close(): Promise<void>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  evaluate<T>(fn: (...args: any[]) => T, ...args: any[]): Promise<T>;
  on(event: string, handler: (msg: { text(): string }) => void): void;
}

const BrowserParamsSchema = z.object({
  action: z
    .enum(['launch', 'goto', 'click', 'type', 'screenshot', 'scroll', 'close', 'content'])
    .describe('Browser action to perform'),

  // For 'launch' and 'goto'
  url: z.string().optional().describe('URL to navigate to'),

  // For 'click'
  selector: z.string().optional().describe('CSS selector to click'),
  x: z.number().optional().describe('X coordinate for click'),
  y: z.number().optional().describe('Y coordinate for click'),

  // For 'type'
  text: z.string().optional().describe('Text to type'),

  // For 'scroll'
  direction: z.enum(['up', 'down']).optional().describe('Scroll direction'),
  amount: z.number().optional().describe('Scroll amount in pixels'),

  // For 'screenshot'
  fullPage: z.boolean().optional().describe('Capture full page'),
});

interface BrowserResult {
  action: string;
  success: boolean;
  url?: string;
  title?: string;
  screenshot?: string;
  content?: string;
  consoleLogs?: string[];
}

// Global browser instance (singleton per session)
let browserInstance: PuppeteerBrowser | null = null;
let pageInstance: PuppeteerPage | null = null;
let consoleLogs: string[] = [];

// Type for puppeteer module
interface PuppeteerModule {
  default: {
    launch(options: { headless: boolean; args: string[] }): Promise<PuppeteerBrowser>;
  };
}

// Injectable import function for testing
let puppeteerImporter: () => Promise<PuppeteerModule> = async () => {
  // Use Function constructor to avoid static analysis
  const dynamicImport = new Function('moduleName', 'return import(moduleName)');
  return dynamicImport('puppeteer');
};

/**
 * Set custom puppeteer import function (for testing)
 */
export function _setPuppeteerImporter(importer: () => Promise<PuppeteerModule>): void {
  puppeteerImporter = importer;
}

/**
 * Reset puppeteer importer to default
 */
export function _resetPuppeteerImporter(): void {
  puppeteerImporter = async () => {
    const dynamicImport = new Function('moduleName', 'return import(moduleName)');
    return dynamicImport('puppeteer');
  };
}

/**
 * Check if puppeteer is installed
 */
async function checkPuppeteerInstalled(): Promise<boolean> {
  try {
    await puppeteerImporter();
    return true;
  } catch {
    return false;
  }
}

/**
 * Get or create browser instance
 */
async function getBrowser(): Promise<PuppeteerBrowser> {
  if (!browserInstance) {
    const puppeteer = await puppeteerImporter();
    browserInstance = (await puppeteer.default.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    })) as PuppeteerBrowser;
  }
  return browserInstance;
}

/**
 * Get or create page instance
 */
async function getPage(): Promise<PuppeteerPage> {
  if (!pageInstance) {
    const browser = await getBrowser();
    pageInstance = (await browser.newPage()) as PuppeteerPage;
    // Collect console logs
    pageInstance.on('console', (msg: { text(): string }) => consoleLogs.push(msg.text()));
  }
  return pageInstance;
}

/**
 * Close browser and clean up
 */
async function closeBrowser(): Promise<void> {
  if (pageInstance) {
    await pageInstance.close();
    pageInstance = null;
  }
  if (browserInstance) {
    await browserInstance.close();
    browserInstance = null;
  }
  consoleLogs = [];
}

/**
 * Get current page info
 */
async function getPageInfo(page: PuppeteerPage): Promise<{ url: string; title: string }> {
  const url = page.url();
  const title = await page.title();
  return { url, title };
}

export const browserTool = defineTool<typeof BrowserParamsSchema, BrowserResult>({
  name: 'browser',
  description: `Browser automation using Puppeteer.

Actions:
- launch: Create browser and navigate to URL
- goto: Navigate to URL
- click: Click element by selector or coordinates
- type: Type text into focused element
- screenshot: Capture page screenshot (returns base64)
- scroll: Scroll page up/down
- close: Close browser session
- content: Get page HTML content

Note: Requires puppeteer to be installed (npm install puppeteer)`,

  parameters: BrowserParamsSchema,

  permission: {
    action: 'network',
    getResource: (params) => {
      if (params.url) {
        try {
          return new URL(params.url).hostname;
        } catch {
          return params.url;
        }
      }
      return 'browser-session';
    },
  },

  async execute(params, _context): Promise<ToolResult<BrowserResult>> {
    // Check if puppeteer is installed
    if (!(await checkPuppeteerInstalled())) {
      return {
        success: false,
        error: 'Puppeteer not installed. Run: npm install puppeteer',
      };
    }

    const { action } = params;

    try {
      switch (action) {
        case 'launch': {
          if (!params.url) {
            return {
              success: false,
              error: "URL required for 'launch' action",
            };
          }

          const page = await getPage();
          try {
            await page.goto(params.url, {
              waitUntil: 'domcontentloaded',
              timeout: 30000,
            });
          } catch (err) {
            if (err instanceof Error && err.name === 'TimeoutError') {
              return {
                success: false,
                error: `Navigation timeout for URL: ${redactUrl(params.url)}`,
              };
            }
            throw err;
          }

          const info = await getPageInfo(page);
          return {
            success: true,
            data: {
              action: 'launch',
              success: true,
              url: info.url,
              title: info.title,
              consoleLogs: [...consoleLogs],
            },
          };
        }

        case 'goto': {
          if (!params.url) {
            return {
              success: false,
              error: "URL required for 'goto' action",
            };
          }

          if (!pageInstance) {
            return {
              success: false,
              error: "No browser session. Use action='launch' first",
            };
          }

          const page = await getPage();
          try {
            await page.goto(params.url, {
              waitUntil: 'domcontentloaded',
              timeout: 30000,
            });
          } catch (err) {
            if (err instanceof Error && err.name === 'TimeoutError') {
              return {
                success: false,
                error: `Navigation timeout for URL: ${redactUrl(params.url)}`,
              };
            }
            throw err;
          }

          const info = await getPageInfo(page);
          return {
            success: true,
            data: {
              action: 'goto',
              success: true,
              url: info.url,
              title: info.title,
              consoleLogs: [...consoleLogs],
            },
          };
        }

        case 'click': {
          if (!pageInstance) {
            return {
              success: false,
              error: "No browser session. Use action='launch' first",
            };
          }

          const page = await getPage();

          if (params.selector) {
            // Click by selector
            try {
              await page.click(params.selector);
            } catch (err) {
              if (
                err instanceof Error &&
                (err.message.includes('No element found') ||
                  err.message.includes('waiting for selector'))
              ) {
                return {
                  success: false,
                  error: `Element not found: ${params.selector}`,
                };
              }
              throw err;
            }
          } else if (params.x !== undefined && params.y !== undefined) {
            // Click by coordinates
            await page.mouse.click(params.x, params.y);
          } else {
            return {
              success: false,
              error: "Either 'selector' or 'x' and 'y' coordinates required for click",
            };
          }

          const info = await getPageInfo(page);
          return {
            success: true,
            data: {
              action: 'click',
              success: true,
              url: info.url,
              title: info.title,
              consoleLogs: [...consoleLogs],
            },
          };
        }

        case 'type': {
          if (!params.text) {
            return {
              success: false,
              error: "Text required for 'type' action",
            };
          }

          if (!pageInstance) {
            return {
              success: false,
              error: "No browser session. Use action='launch' first",
            };
          }

          const page = await getPage();
          await page.keyboard.type(params.text);

          const info = await getPageInfo(page);
          return {
            success: true,
            data: {
              action: 'type',
              success: true,
              url: info.url,
              title: info.title,
              consoleLogs: [...consoleLogs],
            },
          };
        }

        case 'screenshot': {
          if (!pageInstance) {
            return {
              success: false,
              error: "No browser session. Use action='launch' first",
            };
          }

          const page = await getPage();
          const screenshot = await page.screenshot({
            encoding: 'base64',
            fullPage: params.fullPage ?? false,
          });

          const info = await getPageInfo(page);
          return {
            success: true,
            data: {
              action: 'screenshot',
              success: true,
              url: info.url,
              title: info.title,
              screenshot: screenshot as string,
              consoleLogs: [...consoleLogs],
            },
          };
        }

        case 'scroll': {
          if (!pageInstance) {
            return {
              success: false,
              error: "No browser session. Use action='launch' first",
            };
          }

          const page = await getPage();
          const direction = params.direction ?? 'down';
          const amount = params.amount ?? 500;
          const scrollAmount = direction === 'up' ? -amount : amount;

          await page.evaluate((scrollY: number) => {
            globalThis.scrollBy(0, scrollY);
          }, scrollAmount);

          const info = await getPageInfo(page);
          return {
            success: true,
            data: {
              action: 'scroll',
              success: true,
              url: info.url,
              title: info.title,
              consoleLogs: [...consoleLogs],
            },
          };
        }

        case 'close': {
          await closeBrowser();
          return {
            success: true,
            data: {
              action: 'close',
              success: true,
            },
          };
        }

        case 'content': {
          if (!pageInstance) {
            return {
              success: false,
              error: "No browser session. Use action='launch' first",
            };
          }

          const page = await getPage();
          const content = await page.content();
          const { content: truncatedContent, truncated } = truncateOutput(content);

          const info = await getPageInfo(page);
          return {
            success: true,
            data: {
              action: 'content',
              success: true,
              url: info.url,
              title: info.title,
              content: truncatedContent,
              consoleLogs: [...consoleLogs],
            },
            truncated,
            hint: truncated ? 'Content truncated due to size.' : undefined,
          };
        }

        default:
          return {
            success: false,
            error: `Unknown action: ${action}`,
          };
      }
    } catch (err) {
      // Puppeteer frequently embeds the target URL in thrown errors
      // (navigation failures, protocol errors). Redact credential-like
      // query params before surfacing the message to the caller.
      const raw = err instanceof Error ? err.message : String(err);
      return {
        success: false,
        error: redactUrlsFromString(raw),
      };
    }
  },
});

// Export for testing purposes
export { closeBrowser as _closeBrowser };
