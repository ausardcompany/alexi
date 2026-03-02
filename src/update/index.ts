/**
 * Self-Update System for Alexi CLI
 * Provides version checking against npm registry and update capabilities
 */

import fs from 'fs';
import path from 'path';
import os from 'os';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

// ============ Type Definitions ============

export interface UpdateState {
  lastCheck: string; // ISO timestamp
  currentVersion: string; // From package.json
  latestVersion?: string; // From npm registry
  updateAvailable: boolean;
  checkedPackage: string; // Package name
}

export interface UpdateCheckResult {
  currentVersion: string;
  latestVersion: string;
  updateAvailable: boolean;
  lastChecked: Date;
  fromCache: boolean;
}

export interface UpdateCheckOptions {
  force?: boolean;
}

export interface UpdateResult {
  success: boolean;
  message: string;
}

// ============ Constants ============

const PACKAGE_NAME = 'alexi';
const CONFIG_DIR = path.join(os.homedir(), '.alexi');
const UPDATE_CHECK_FILE = path.join(CONFIG_DIR, '.update-check');
const DEFAULT_CHECK_INTERVAL_MS = 24 * 60 * 60 * 1000; // 24 hours
const NPM_REGISTRY_URL = `https://registry.npmjs.org/${PACKAGE_NAME}/latest`;

// ============ Helper Functions ============

/**
 * Get the current version from package.json
 */
function getCurrentVersion(): string {
  try {
    // Navigate up from dist/update/index.js or src/update/index.ts to find package.json
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    // Try multiple possible locations
    const possiblePaths = [
      path.join(__dirname, '..', '..', 'package.json'), // from src/update or dist/update
      path.join(__dirname, '..', '..', '..', 'package.json'), // fallback
      path.join(process.cwd(), 'package.json'), // current working directory
    ];

    for (const pkgPath of possiblePaths) {
      if (fs.existsSync(pkgPath)) {
        const content = fs.readFileSync(pkgPath, 'utf-8');
        const pkg = JSON.parse(content);
        if (pkg.name === PACKAGE_NAME && pkg.version) {
          return pkg.version;
        }
      }
    }

    // Fallback: try to get version from npm
    try {
      const result = execSync(`npm list ${PACKAGE_NAME} --json 2>/dev/null`, {
        encoding: 'utf-8',
        timeout: 5000,
      });
      const data = JSON.parse(result);
      if (data.dependencies?.[PACKAGE_NAME]?.version) {
        return data.dependencies[PACKAGE_NAME].version;
      }
    } catch {
      // Ignore npm list errors
    }

    return '0.0.0'; // Unknown version
  } catch {
    return '0.0.0';
  }
}

/**
 * Parse a semver version string into components
 */
function parseVersion(version: string): {
  major: number;
  minor: number;
  patch: number;
  prerelease: string | null;
} {
  // Handle versions like "1.2.3-beta.1"
  const prereleaseMatch = version.match(/^(\d+)\.(\d+)\.(\d+)(?:-(.+))?$/);

  if (prereleaseMatch) {
    return {
      major: parseInt(prereleaseMatch[1], 10),
      minor: parseInt(prereleaseMatch[2], 10),
      patch: parseInt(prereleaseMatch[3], 10),
      prerelease: prereleaseMatch[4] || null,
    };
  }

  // Simple version without prerelease
  const parts = version.split('.').map(Number);
  return {
    major: parts[0] || 0,
    minor: parts[1] || 0,
    patch: parts[2] || 0,
    prerelease: null,
  };
}

/**
 * Compare two prerelease strings
 * Returns: -1 if a < b, 0 if a == b, 1 if a > b
 */
function comparePrereleases(a: string | null, b: string | null): number {
  // No prerelease is greater than having prerelease (1.0.0 > 1.0.0-beta)
  if (a === null && b === null) return 0;
  if (a === null) return 1;
  if (b === null) return -1;

  const aParts = a.split('.');
  const bParts = b.split('.');

  const maxLen = Math.max(aParts.length, bParts.length);

  for (let i = 0; i < maxLen; i++) {
    const aPart = aParts[i] || '';
    const bPart = bParts[i] || '';

    // Compare numeric parts as numbers
    const aNum = parseInt(aPart, 10);
    const bNum = parseInt(bPart, 10);

    if (!isNaN(aNum) && !isNaN(bNum)) {
      if (aNum < bNum) return -1;
      if (aNum > bNum) return 1;
    } else {
      // Compare as strings
      if (aPart < bPart) return -1;
      if (aPart > bPart) return 1;
    }
  }

  return 0;
}

/**
 * Compare two semver versions
 * Returns: true if latest > current (update available)
 */
function isNewerVersion(current: string, latest: string): boolean {
  const curr = parseVersion(current);
  const lat = parseVersion(latest);

  // Compare major.minor.patch
  if (lat.major > curr.major) return true;
  if (lat.major < curr.major) return false;

  if (lat.minor > curr.minor) return true;
  if (lat.minor < curr.minor) return false;

  if (lat.patch > curr.patch) return true;
  if (lat.patch < curr.patch) return false;

  // Same major.minor.patch - compare prerelease
  return comparePrereleases(lat.prerelease, curr.prerelease) > 0;
}

/**
 * Ensure config directory exists
 */
function ensureConfigDir(): void {
  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR, { recursive: true });
  }
}

/**
 * Detect installation type (global or local)
 */
function detectInstallationType(): 'global' | 'local' {
  try {
    // Check if running from a global npm installation
    const globalResult = execSync('npm root -g', {
      encoding: 'utf-8',
      timeout: 5000,
    }).trim();

    const __filename = fileURLToPath(import.meta.url);

    if (__filename.startsWith(globalResult)) {
      return 'global';
    }

    return 'local';
  } catch {
    return 'local';
  }
}

// ============ UpdateManager Class ============

export class UpdateManager {
  private currentVersion: string;
  private packageName: string;
  private checkIntervalMs: number;

  constructor(options?: { checkIntervalMs?: number }) {
    this.currentVersion = getCurrentVersion();
    this.packageName = PACKAGE_NAME;
    this.checkIntervalMs = options?.checkIntervalMs ?? DEFAULT_CHECK_INTERVAL_MS;
  }

  /**
   * Get the current update state from cache
   */
  getState(): UpdateState | undefined {
    try {
      if (!fs.existsSync(UPDATE_CHECK_FILE)) {
        return undefined;
      }

      const content = fs.readFileSync(UPDATE_CHECK_FILE, 'utf-8');
      return JSON.parse(content) as UpdateState;
    } catch {
      return undefined;
    }
  }

  /**
   * Save update state to cache
   */
  private saveState(state: UpdateState): void {
    try {
      ensureConfigDir();
      fs.writeFileSync(UPDATE_CHECK_FILE, JSON.stringify(state, null, 2), 'utf-8');
    } catch {
      // Silently fail - caching is not critical
    }
  }

  /**
   * Check if rate limit allows a new check
   */
  shouldCheck(): boolean {
    const state = this.getState();

    if (!state) {
      return true;
    }

    try {
      const lastCheck = new Date(state.lastCheck);
      const now = new Date();
      const elapsed = now.getTime() - lastCheck.getTime();

      return elapsed >= this.checkIntervalMs;
    } catch {
      return true;
    }
  }

  /**
   * Fetch the latest version from npm registry
   */
  private async fetchLatestVersion(): Promise<string> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch(NPM_REGISTRY_URL, {
        signal: controller.signal,
        headers: {
          Accept: 'application/json',
          'User-Agent': `${PACKAGE_NAME}/${this.currentVersion}`,
        },
      });

      clearTimeout(timeout);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = (await response.json()) as { version?: string };

      if (!data.version) {
        throw new Error('No version found in registry response');
      }

      return data.version;
    } catch (error) {
      clearTimeout(timeout);

      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout while checking npm registry', { cause: error });
      }

      throw error;
    }
  }

  /**
   * Check for updates
   */
  async check(options?: UpdateCheckOptions): Promise<UpdateCheckResult> {
    const force = options?.force ?? false;

    // Check rate limit (unless forced)
    if (!force && !this.shouldCheck()) {
      const state = this.getState();

      if (state) {
        return {
          currentVersion: this.currentVersion,
          latestVersion: state.latestVersion || this.currentVersion,
          updateAvailable: state.updateAvailable,
          lastChecked: new Date(state.lastCheck),
          fromCache: true,
        };
      }
    }

    // Fetch latest version from registry
    try {
      const latestVersion = await this.fetchLatestVersion();
      const updateAvailable = isNewerVersion(this.currentVersion, latestVersion);
      const now = new Date();

      // Save state
      const state: UpdateState = {
        lastCheck: now.toISOString(),
        currentVersion: this.currentVersion,
        latestVersion,
        updateAvailable,
        checkedPackage: this.packageName,
      };

      this.saveState(state);

      return {
        currentVersion: this.currentVersion,
        latestVersion,
        updateAvailable,
        lastChecked: now,
        fromCache: false,
      };
    } catch (error) {
      // On error, try to return cached state if available
      const state = this.getState();

      if (state) {
        return {
          currentVersion: this.currentVersion,
          latestVersion: state.latestVersion || this.currentVersion,
          updateAvailable: state.updateAvailable,
          lastChecked: new Date(state.lastCheck),
          fromCache: true,
        };
      }

      // No cache available, throw the error
      throw new Error(
        `Failed to check for updates: ${error instanceof Error ? error.message : String(error)}`,
        { cause: error }
      );
    }
  }

  /**
   * Perform the update
   */
  async update(): Promise<UpdateResult> {
    try {
      // First, check if update is available
      const checkResult = await this.check({ force: true });

      if (!checkResult.updateAvailable) {
        return {
          success: true,
          message: `Already running the latest version (${this.currentVersion})`,
        };
      }

      // Detect installation type
      const installationType = detectInstallationType();

      // Build the update command
      const updateCommand =
        installationType === 'global'
          ? `npm install -g ${this.packageName}@latest`
          : `npm install ${this.packageName}@latest`;

      // Execute the update
      execSync(updateCommand, {
        encoding: 'utf-8',
        timeout: 120000, // 2 minutes
        stdio: 'inherit',
      });

      // Clear the cache after successful update
      this.clearCache();

      return {
        success: true,
        message: `Successfully updated from ${this.currentVersion} to ${checkResult.latestVersion}`,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);

      return {
        success: false,
        message: `Update failed: ${errorMessage}`,
      };
    }
  }

  /**
   * Clear the update state cache
   */
  clearCache(): void {
    try {
      if (fs.existsSync(UPDATE_CHECK_FILE)) {
        fs.unlinkSync(UPDATE_CHECK_FILE);
      }
    } catch {
      // Silently fail - not critical
    }
  }

  /**
   * Get the current version
   */
  getCurrentVersion(): string {
    return this.currentVersion;
  }

  /**
   * Get the package name
   */
  getPackageName(): string {
    return this.packageName;
  }
}

// ============ Singleton Instance ============

let updateManagerInstance: UpdateManager | null = null;

/**
 * Get the singleton UpdateManager instance
 */
export function getUpdateManager(): UpdateManager {
  if (!updateManagerInstance) {
    updateManagerInstance = new UpdateManager();
  }
  return updateManagerInstance;
}

/**
 * Reset the singleton instance (useful for testing)
 */
export function resetUpdateManager(): void {
  updateManagerInstance = null;
}

// ============ Convenience Functions ============

/**
 * Check for updates (convenience function)
 */
export async function checkForUpdates(options?: UpdateCheckOptions): Promise<UpdateCheckResult> {
  return getUpdateManager().check(options);
}

/**
 * Perform update (convenience function)
 */
export async function performUpdate(): Promise<UpdateResult> {
  return getUpdateManager().update();
}

// ============ Exports ============

export {
  PACKAGE_NAME,
  CONFIG_DIR,
  UPDATE_CHECK_FILE,
  DEFAULT_CHECK_INTERVAL_MS,
  NPM_REGISTRY_URL,
  getCurrentVersion,
  isNewerVersion,
  parseVersion,
  detectInstallationType,
};
