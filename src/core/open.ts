/**
 * Safe URL opener.
 *
 * Ports the upstream opencode commit that centralizes URL opening behind
 * a scheme allow-list. Guards against arbitrary-scheme injection
 * (`file://`, `javascript:`, `ms-msdt:`, UNC paths like `\\server\share`)
 * which is a real vulnerability for SAP AI Core integrations that
 * surface links from LLM output.
 *
 * Implementation deliberately uses Node's built-in child_process +
 * platform-specific launcher (`open` on macOS, `xdg-open` on Linux,
 * `cmd /c start ""` on Windows) rather than pulling in the `open` npm
 * package, to keep Alexi's dependency surface small.
 *
 * alexi_change: introduce `openUrl` as the single sanctioned browser-open
 * entry point. New call sites MUST use this instead of shelling out to
 * `xdg-open` / `open` directly.
 */

import { spawn, type SpawnOptions } from 'child_process';

/**
 * Options for `openUrl`. Kept intentionally minimal so callers don't
 * reintroduce ways to bypass the scheme allow-list.
 */
export interface OpenUrlOptions {
  /**
   * When true, resolve immediately after spawning the launcher without
   * waiting for it to exit. Default true — matches `open` package
   * behavior and avoids blocking the TUI on a browser launch.
   */
  detached?: boolean;
}

/**
 * Opens the given URL in the user's default browser.
 *
 * Only `http:` and `https:` URLs are permitted to avoid arbitrary-scheme
 * injection (e.g., `javascript:`, `file://`, `ms-msdt:`, UNC paths).
 *
 * Rejects with an `Error` when:
 *   - `input` is not a parseable URL
 *   - the URL scheme is not http(s)
 *   - the platform launcher fails to spawn
 */
export function openUrl(input: string, options: OpenUrlOptions = {}): Promise<void> {
  const parsed = safeParseUrl(input);
  if (!parsed || (parsed.protocol !== 'http:' && parsed.protocol !== 'https:')) {
    return Promise.reject(
      new Error(`Only http and https links can be opened in the browser: ${input}`)
    );
  }
  return spawnLauncher(parsed.href, options.detached ?? true);
}

function safeParseUrl(input: string): URL | undefined {
  if (typeof input !== 'string' || input.length === 0) {
    return undefined;
  }
  // Reject UNC paths outright — some Node versions on Windows will
  // otherwise accept `\\server\share\file.html` as a `file:` URL after
  // implicit normalization.
  if (input.startsWith('\\\\') || input.startsWith('//')) {
    return undefined;
  }
  if (typeof URL.canParse === 'function' && !URL.canParse(input)) {
    return undefined;
  }
  try {
    return new URL(input);
  } catch {
    return undefined;
  }
}

function spawnLauncher(href: string, detached: boolean): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const spec = platformLauncher();
    if (!spec) {
      reject(new Error(`Unsupported platform for openUrl: ${process.platform}`));
      return;
    }
    const args = [...spec.args, href];
    const spawnOptions: SpawnOptions = {
      stdio: 'ignore',
      detached,
      shell: false,
    };
    try {
      const child = spawn(spec.command, args, spawnOptions);
      child.once('error', (err) => {
        reject(err);
      });
      if (detached) {
        // Let the child outlive Alexi if the user quits before the
        // browser tab opens.
        child.unref();
        resolve();
      } else {
        child.once('exit', (code) => {
          if (code === 0 || code === null) {
            resolve();
          } else {
            reject(new Error(`Browser launcher exited with code ${code}`));
          }
        });
      }
    } catch (err) {
      reject(err instanceof Error ? err : new Error(String(err)));
    }
  });
}

interface LauncherSpec {
  command: string;
  args: readonly string[];
}

function platformLauncher(): LauncherSpec | undefined {
  switch (process.platform) {
    case 'darwin':
      return { command: 'open', args: [] };
    case 'win32':
      // `cmd /c start "" <url>` — the empty "" is the window title so
      // that a URL with spaces isn't consumed as the title arg.
      return { command: 'cmd', args: ['/c', 'start', ''] };
    default:
      return { command: 'xdg-open', args: [] };
  }
}
