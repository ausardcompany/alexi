/**
 * Platform-specific clipboard image reader.
 *
 * Shells out to native clipboard tools to read image data:
 * - macOS: `pngpaste` (preferred) or `osascript`
 * - Linux (X11): `xclip`
 * - Linux (Wayland): `wl-paste`
 * - Windows: PowerShell
 *
 * No npm dependencies — uses `child_process.execFile` for safety.
 */

import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { detectImageFormat, type ImageFormat } from './imageValidation.js';
import { logger } from './logger.js';

const execFileAsync = promisify(execFile);

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Platform-specific clipboard tool identifier. */
export type ClipboardTool = 'pngpaste' | 'xclip' | 'wl-paste' | 'powershell';

/** Detected clipboard capability for the current platform. */
export interface ClipboardCapability {
  available: boolean;
  tool?: ClipboardTool;
  platform: NodeJS.Platform;
  installHint?: string;
}

/** Result of reading an image from the clipboard. */
export type ClipboardImageResult =
  | { success: true; data: Buffer; format: ImageFormat }
  | { success: false; error: string };

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Tools to try per platform, in preference order. */
const PLATFORM_TOOLS: Record<
  string,
  Array<{ tool: ClipboardTool; check: string; hint: string }>
> = {
  darwin: [
    {
      tool: 'pngpaste',
      check: 'pngpaste',
      hint: 'Install with: brew install pngpaste',
    },
  ],
  linux: [
    {
      tool: 'wl-paste',
      check: 'wl-paste',
      hint: 'Install with: apt install wl-clipboard',
    },
    {
      tool: 'xclip',
      check: 'xclip',
      hint: 'Install with: apt install xclip',
    },
  ],
  win32: [
    {
      tool: 'powershell',
      check: 'powershell',
      hint: 'PowerShell should be pre-installed on Windows',
    },
  ],
};

// ---------------------------------------------------------------------------
// Detection
// ---------------------------------------------------------------------------

/** Cache for detected capability (per-process). */
let cachedCapability: ClipboardCapability | null = null;

/**
 * Check if a command-line tool is available on PATH.
 */
async function isToolAvailable(name: string): Promise<boolean> {
  try {
    const cmd = process.platform === 'win32' ? 'where' : 'which';
    await execFileAsync(cmd, [name]);
    return true;
  } catch {
    return false;
  }
}

/**
 * Detect clipboard image reading capabilities on the current platform.
 * Result is cached for the process lifetime.
 */
export async function detectClipboard(): Promise<ClipboardCapability> {
  if (cachedCapability) {
    return cachedCapability;
  }

  const platform = process.platform;
  const tools = PLATFORM_TOOLS[platform];

  if (!tools || tools.length === 0) {
    cachedCapability = {
      available: false,
      platform,
      installHint: `Clipboard image reading is not supported on ${platform}`,
    };
    return cachedCapability;
  }

  for (const { tool, check, hint } of tools) {
    if (await isToolAvailable(check)) {
      cachedCapability = { available: true, tool, platform };
      return cachedCapability;
    }
    // Log the first failed tool for diagnostics
    logger.debug(`Clipboard tool '${check}' not found. ${hint}`);
  }

  // No tool found — collect all install hints
  const hints = tools.map((t) => t.hint).join('\n  ');
  cachedCapability = {
    available: false,
    platform,
    installHint: `No clipboard image tool found. Try one of:\n  ${hints}`,
  };
  return cachedCapability;
}

/**
 * Reset the cached capability (useful for testing).
 * @internal
 */
export function _resetClipboardCache(): void {
  cachedCapability = null;
}

// ---------------------------------------------------------------------------
// Read image from clipboard
// ---------------------------------------------------------------------------

/**
 * Read the clipboard image commands per tool.
 */
function getReadCommand(tool: ClipboardTool): { cmd: string; args: string[] } {
  switch (tool) {
    case 'pngpaste':
      // pngpaste - : write PNG to stdout
      return { cmd: 'pngpaste', args: ['-'] };
    case 'xclip':
      return { cmd: 'xclip', args: ['-selection', 'clipboard', '-t', 'image/png', '-o'] };
    case 'wl-paste':
      return { cmd: 'wl-paste', args: ['--type', 'image/png'] };
    case 'powershell':
      return {
        cmd: 'powershell',
        args: [
          '-NoProfile',
          '-Command',
          `
            Add-Type -AssemblyName System.Windows.Forms;
            $img = [System.Windows.Forms.Clipboard]::GetImage();
            if ($img -eq $null) { exit 1 }
            $ms = New-Object System.IO.MemoryStream;
            $img.Save($ms, [System.Drawing.Imaging.ImageFormat]::Png);
            $ms.Position = 0;
            $bytes = $ms.ToArray();
            [Console]::OpenStandardOutput().Write($bytes, 0, $bytes.Length);
          `.trim(),
        ],
      };
  }
}

/**
 * Read image data from the system clipboard.
 *
 * Auto-detects the platform and available tool on first call.
 * Returns the raw image bytes and detected format.
 */
export async function readClipboardImage(): Promise<ClipboardImageResult> {
  const capability = await detectClipboard();

  if (!capability.available || !capability.tool) {
    return {
      success: false,
      error: capability.installHint ?? 'Clipboard image reading is not available',
    };
  }

  const { cmd, args } = getReadCommand(capability.tool);

  try {
    const { stdout } = await execFileAsync(cmd, args, {
      encoding: 'buffer',
      maxBuffer: 50 * 1024 * 1024, // 50 MB buffer
      timeout: 5000, // 5 second timeout
    });

    if (!stdout || stdout.length === 0) {
      return { success: false, error: 'No image found in clipboard' };
    }

    const format = detectImageFormat(stdout);
    if (!format) {
      return { success: false, error: 'Clipboard contains unrecognized image data' };
    }

    return { success: true, data: stdout, format };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);

    // Common case: clipboard doesn't contain an image
    if (
      message.includes('exit code 1') ||
      message.includes('Error: target image/png not available') ||
      message.includes('No image data found')
    ) {
      return { success: false, error: 'No image found in clipboard' };
    }

    return { success: false, error: `Failed to read clipboard: ${message}` };
  }
}

/**
 * Read image data from a file path.
 *
 * @param filePath - Absolute or relative path to the image file.
 * @returns Image data and detected format, or an error.
 */
export async function readImageFile(filePath: string): Promise<ClipboardImageResult> {
  try {
    const fs = await import('node:fs/promises');
    const data = await fs.readFile(filePath);

    if (data.length === 0) {
      return { success: false, error: `File is empty: ${filePath}` };
    }

    const format = detectImageFormat(data);
    if (!format) {
      return { success: false, error: `Unsupported image format: ${filePath}` };
    }

    return { success: true, data, format };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (message.includes('ENOENT')) {
      return { success: false, error: `File not found: ${filePath}` };
    }
    return { success: false, error: `Failed to read file: ${message}` };
  }
}
