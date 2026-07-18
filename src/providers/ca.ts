/**
 * Auto-CA harvesting from system trust store.
 *
 * Discovers OS trust anchors (macOS Keychain, Windows cert store, Linux CA
 * bundle at standard paths) and installs them into the Node.js HTTPS agent
 * so provider requests transparently trust internal corporate CAs.
 *
 * This eliminates the need for manual `NODE_EXTRA_CA_CERTS` setup in
 * corporate environments where SAP AI Core or other providers are fronted
 * by internal proxies with self-signed or internal CA-signed certificates.
 *
 * Disable via `ALEXI_DISABLE_CA_HARVEST=1`.
 *
 * See docs/PROVIDERS.md#auto-ca-harvesting for details.
 */

import { execFileSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import * as os from 'node:os';
import * as https from 'node:https';
import * as tls from 'node:tls';

/**
 * Supported OS platforms for CA harvesting.
 */
export type CaPlatform = 'darwin' | 'win32' | 'linux';

/**
 * Standard Linux CA bundle paths, in the order they should be tried.
 * The first existing path wins.
 */
export const LINUX_CA_BUNDLE_PATHS = [
  '/etc/ssl/certs/ca-certificates.crt', // Debian / Ubuntu
  '/etc/pki/tls/certs/ca-bundle.crt', // RHEL / CentOS / Fedora
  '/etc/ssl/ca-bundle.pem', // openSUSE
  '/etc/ssl/cert.pem', // Alpine / BSD-style
];

/**
 * macOS keychains that ship with the system root CA store.
 */
export const MACOS_KEYCHAINS = [
  '/System/Library/Keychains/SystemRootCertificates.keychain',
  '/Library/Keychains/System.keychain',
];

const PEM_CERT_REGEX = /-----BEGIN CERTIFICATE-----[\s\S]*?-----END CERTIFICATE-----/g;

/**
 * Detect the current OS platform for CA harvesting purposes.
 * Anything that is not macOS or Windows is treated as Linux-compatible.
 */
export function detectPlatform(): CaPlatform {
  const platform = os.platform();
  if (platform === 'darwin') {
    return 'darwin';
  }
  if (platform === 'win32') {
    return 'win32';
  }
  return 'linux';
}

/**
 * Check whether CA harvesting is disabled via `ALEXI_DISABLE_CA_HARVEST`.
 *
 * Any truthy value ('1', 'true', 'yes', case-insensitive) disables the feature.
 */
export function isDisabled(env: NodeJS.ProcessEnv = process.env): boolean {
  const raw = env.ALEXI_DISABLE_CA_HARVEST;
  if (!raw) {
    return false;
  }
  const normalized = raw.trim().toLowerCase();
  return normalized === '1' || normalized === 'true' || normalized === 'yes';
}

/**
 * Extract all PEM CERTIFICATE blocks from a raw text blob.
 *
 * Duplicate PEM blocks (byte-for-byte identical after trim) are collapsed.
 * Non-CERTIFICATE PEM types (PRIVATE KEY, TRUSTED CERTIFICATE, etc.) are
 * ignored.
 */
export function extractPemBlocks(raw: string): string[] {
  if (!raw) {
    return [];
  }
  const matches = raw.match(PEM_CERT_REGEX);
  if (!matches) {
    return [];
  }
  const seen = new Set<string>();
  const out: string[] = [];
  for (const m of matches) {
    const trimmed = m.trim();
    if (!seen.has(trimmed)) {
      seen.add(trimmed);
      out.push(trimmed);
    }
  }
  return out;
}

/**
 * Read a Linux CA bundle from the first standard path that exists.
 * Returns an empty array when no bundle is present or the file is unreadable.
 */
export function harvestLinuxCAs(
  paths: readonly string[] = LINUX_CA_BUNDLE_PATHS,
  reader: (path: string) => string = (p) => readFileSync(p, 'utf8'),
  exists: (path: string) => boolean = existsSync
): string[] {
  for (const path of paths) {
    try {
      if (!exists(path)) {
        continue;
      }
      const content = reader(path);
      const blocks = extractPemBlocks(content);
      if (blocks.length > 0) {
        return blocks;
      }
    } catch {
      // Continue to next candidate path — permission issues, bad symlinks, etc.
    }
  }
  return [];
}

/**
 * Runner signature for the macOS `security` command. Extracted for testability.
 */
export type SecurityRunner = (keychain: string) => string;

/**
 * Default macOS `security` command runner. Invokes
 * `security find-certificate -a -p <keychain>` and returns stdout.
 *
 * Any invocation failure (missing binary, non-zero exit, IO error) returns
 * an empty string so the caller can continue with remaining keychains.
 */
export const defaultSecurityRunner: SecurityRunner = (keychain) => {
  try {
    return execFileSync('security', ['find-certificate', '-a', '-p', keychain], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
      maxBuffer: 32 * 1024 * 1024,
    });
  } catch {
    return '';
  }
};

/**
 * Harvest CA certificates from the macOS Keychain.
 *
 * Iterates the system keychains (SystemRootCertificates + System) and returns
 * a deduplicated list of PEM CERTIFICATE blocks. Non-macOS callers should
 * short-circuit before invoking this.
 */
export function harvestMacosCAs(
  keychains: readonly string[] = MACOS_KEYCHAINS,
  runner: SecurityRunner = defaultSecurityRunner
): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const keychain of keychains) {
    const output = runner(keychain);
    for (const block of extractPemBlocks(output)) {
      if (!seen.has(block)) {
        seen.add(block);
        out.push(block);
      }
    }
  }
  return out;
}

/**
 * Options object accepted by {@link harvestCAs}.
 *
 * All fields are optional. When omitted, real filesystem / subprocess
 * implementations are used. Tests should supply overrides so no real
 * `security` / `/etc/ssl/*` I/O happens.
 */
export interface HarvestOptions {
  /** Override the detected platform. */
  platform?: CaPlatform;
  /** Override the Linux CA bundle path list. */
  linuxPaths?: readonly string[];
  /** Override the fs read function used by the Linux harvester. */
  reader?: (path: string) => string;
  /** Override the fs existence check used by the Linux harvester. */
  exists?: (path: string) => boolean;
  /** Override the macOS keychain list. */
  macosKeychains?: readonly string[];
  /** Override the macOS `security` command runner. */
  securityRunner?: SecurityRunner;
}

/**
 * Harvest CA certificates from the current OS trust store.
 *
 * Dispatches to the platform-specific harvester and returns a deduplicated
 * list of PEM CERTIFICATE blocks. Windows currently returns `[]` — see
 * docs/PROVIDERS.md for the Windows TODO.
 */
export function harvestCAs(options: HarvestOptions = {}): string[] {
  const platform = options.platform ?? detectPlatform();

  if (platform === 'darwin') {
    return harvestMacosCAs(options.macosKeychains, options.securityRunner);
  }

  if (platform === 'linux') {
    return harvestLinuxCAs(options.linuxPaths, options.reader, options.exists);
  }

  // win32: no built-in support yet. Users should set NODE_EXTRA_CA_CERTS or
  // install the optional `win-ca` package (documented in PROVIDERS.md).
  return [];
}

/**
 * Cached list of harvested PEM blocks for the process lifetime.
 * Reading the macOS Keychain on every request is slow (~50ms), so we
 * harvest once at CLI startup.
 */
let cachedHarvestedCAs: string[] | null = null;

/**
 * Return the cached list of harvested CAs, harvesting on the first call.
 *
 * Honors `ALEXI_DISABLE_CA_HARVEST` — when set, returns `[]` without
 * touching the OS trust store.
 */
export function getHarvestedCAs(options: HarvestOptions = {}): string[] {
  if (cachedHarvestedCAs !== null) {
    return cachedHarvestedCAs;
  }
  if (isDisabled()) {
    cachedHarvestedCAs = [];
    return cachedHarvestedCAs;
  }
  cachedHarvestedCAs = harvestCAs(options);
  return cachedHarvestedCAs;
}

/**
 * Test-only hook: clear the cached CA list so each unit test starts from
 * a clean slate. Not part of the public surface.
 *
 * @internal
 */
export function _resetHarvestedCAsCache(): void {
  cachedHarvestedCAs = null;
}

/**
 * Read PEM CERTIFICATE blocks from the file(s) referenced by
 * `NODE_EXTRA_CA_CERTS`, if that environment variable is set and the file
 * is readable. Returns an empty array otherwise.
 *
 * We do this so we can *append* rather than replace user-provided
 * additional trust anchors when we install our own `ca` list into
 * `https.globalAgent`.
 */
export function readNodeExtraCACerts(
  env: NodeJS.ProcessEnv = process.env,
  reader: (path: string) => string = (p) => readFileSync(p, 'utf8')
): string[] {
  const path = env.NODE_EXTRA_CA_CERTS;
  if (!path) {
    return [];
  }
  try {
    return extractPemBlocks(reader(path));
  } catch {
    return [];
  }
}

/**
 * Result of {@link installHarvestedCAs}.
 */
export interface InstallResult {
  /** Whether the harvest was skipped because `ALEXI_DISABLE_CA_HARVEST` is set. */
  disabled: boolean;
  /** Number of harvested PEM blocks that were merged into `https.globalAgent`. */
  harvestedCount: number;
  /** Number of PEM blocks read from `NODE_EXTRA_CA_CERTS`, if any. */
  extraCount: number;
  /** Total number of unique PEM blocks now trusted (harvest + extras + Node defaults). */
  totalCount: number;
}

/**
 * Options for {@link installHarvestedCAs}. Mirrors {@link HarvestOptions}
 * plus an override for the target HTTPS agent (used by tests).
 */
export interface InstallOptions extends HarvestOptions {
  /** HTTPS agent to install the merged CA list on. Defaults to `https.globalAgent`. */
  agent?: https.Agent;
  /** Override for reading `NODE_EXTRA_CA_CERTS`. */
  extraReader?: (path: string) => string;
  /** Override for the process env when reading `NODE_EXTRA_CA_CERTS`. */
  env?: NodeJS.ProcessEnv;
}

/**
 * Install harvested + `NODE_EXTRA_CA_CERTS` CAs onto the HTTPS agent's
 * `options.ca` alongside Node's built-in root CAs (from `tls.rootCertificates`).
 *
 * Merging (rather than replacement) preserves the default trust bundle so
 * public HTTPS endpoints keep working while corporate self-signed / internal
 * CA-signed endpoints ALSO validate. Existing `agent.options.ca` entries are
 * preserved and deduplicated by PEM string identity.
 *
 * Safe to call multiple times — subsequent calls dedupe against the current
 * `agent.options.ca` list.
 *
 * Returns a small stats object mostly useful for logging & tests.
 */
export function installHarvestedCAs(options: InstallOptions = {}): InstallResult {
  const agent = options.agent ?? https.globalAgent;

  if (isDisabled(options.env)) {
    return { disabled: true, harvestedCount: 0, extraCount: 0, totalCount: 0 };
  }

  const harvested = harvestCAs(options);
  const extras = readNodeExtraCACerts(options.env, options.extraReader);

  const seen = new Set<string>();
  const merged: string[] = [];

  const pushAll = (blocks: readonly (string | Buffer)[]): void => {
    for (const b of blocks) {
      const s = typeof b === 'string' ? b.trim() : b.toString('utf8').trim();
      if (s.length > 0 && !seen.has(s)) {
        seen.add(s);
        merged.push(s);
      }
    }
  };

  // 1. Node's built-in trust store — preserve default validation.
  pushAll(tls.rootCertificates);

  // 2. Any existing `ca` list already installed on the agent (from prior calls
  //    or user code). `agent.options.ca` may be a single string/Buffer, an
  //    array, or undefined.
  const existing = (agent.options as https.AgentOptions).ca;
  if (existing) {
    const asArray = Array.isArray(existing) ? existing : [existing];
    pushAll(asArray as (string | Buffer)[]);
  }

  // 3. User-provided extras via NODE_EXTRA_CA_CERTS.
  pushAll(extras);

  // 4. Harvested from the OS trust store.
  pushAll(harvested);

  // Assign the merged list back onto the agent. Node accepts string[] here.
  (agent.options as https.AgentOptions).ca = merged;

  return {
    disabled: false,
    harvestedCount: harvested.length,
    extraCount: extras.length,
    totalCount: merged.length,
  };
}
