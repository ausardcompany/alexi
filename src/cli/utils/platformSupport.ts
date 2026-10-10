/**
 * Platform-support diagnostics.
 *
 * Alexi is pure TypeScript/Node — unlike the upstream opencode CLI it
 * ships no native binary, so the "no prebuilt binary for win32-arm64"
 * error class in the opencode fix (`055d95b`) cannot occur here. We
 * still mirror the spirit of that upstream fix by providing a central
 * place to emit a clearer platform-specific diagnostic when something
 * does go wrong at startup — notably when a required *optional* native
 * dependency (e.g. `tree-sitter`, `better-sqlite3`) is missing on an
 * unusual platform.
 *
 * The helpers below are intentionally pure and side-effect-free so they
 * can be unit tested without mocking `process` globally.
 */

/** Platforms Alexi has been exercised on in CI. */
const SUPPORTED_PLATFORMS: ReadonlySet<NodeJS.Platform> = new Set(['linux', 'darwin', 'win32']);

/** Architectures Alexi has been exercised on in CI. */
const SUPPORTED_ARCHS: ReadonlySet<string> = new Set(['x64', 'arm64']);

/**
 * Static context describing the current runtime platform. Extracted into
 * a value so tests can inject synthetic values without monkey-patching
 * `process`.
 */
export interface PlatformInfo {
  platform: NodeJS.Platform;
  arch: string;
  nodeVersion: string;
}

/**
 * Snapshot the current runtime's platform info.
 */
export function currentPlatform(): PlatformInfo {
  return {
    platform: process.platform,
    arch: process.arch,
    nodeVersion: process.versions.node,
  };
}

/**
 * Return a human-readable warning when the runtime platform/arch combo
 * is unusual enough to warrant a diagnostic, or `undefined` when
 * nothing needs saying. The returned string is intended to be printed
 * to stderr by the caller — this helper never writes to stderr itself.
 *
 * Spirit of upstream `055d95b` "fix(cli): improve error message for
 * missing binary on windows arm64": when something fails on an
 * uncommon platform, say so explicitly instead of handing the user a
 * cryptic stack trace.
 */
export function platformSupportWarning(info: PlatformInfo = currentPlatform()): string | undefined {
  const platformOk = SUPPORTED_PLATFORMS.has(info.platform);
  const archOk = SUPPORTED_ARCHS.has(info.arch);

  // win32-arm64: Node runs natively but several optional native deps
  // (tree-sitter grammars, better-sqlite3 prebuilts) historically lacked
  // win32-arm64 wheels. Keep this as an informational notice.
  if (info.platform === 'win32' && info.arch === 'arm64') {
    return (
      'Alexi: running on Windows ARM64. Node runs natively, but some ' +
      'optional native dependencies (tree-sitter grammars, better-sqlite3) ' +
      'may not have prebuilt binaries for this platform. If a feature fails ' +
      'with ENOENT or a load-module error, install the x64 build and run ' +
      'under x64 emulation, or file an issue so support can be added.'
    );
  }

  if (!platformOk) {
    return (
      `Alexi: platform "${info.platform}" is not in the supported set ` +
      `(${[...SUPPORTED_PLATFORMS].join(', ')}). The CLI may still work ` +
      'but is not covered by CI; please report any issues you encounter.'
    );
  }

  if (!archOk) {
    return (
      `Alexi: architecture "${info.arch}" is not in the supported set ` +
      `(${[...SUPPORTED_ARCHS].join(', ')}). The CLI may still work but ` +
      'is not covered by CI; please report any issues you encounter.'
    );
  }

  return undefined;
}

/**
 * Format the "command not found / missing module" diagnostic for a
 * failed startup. Produces a clearer message on uncommon platforms so
 * the user knows the failure is platform-related rather than a bug in
 * their config. Does NOT exit the process — the caller decides.
 */
export function formatStartupError(err: unknown, info: PlatformInfo = currentPlatform()): string {
  const base = err instanceof Error ? err.message : String(err);
  const warning = platformSupportWarning(info);
  if (!warning) {
    return `Alexi failed to start on ${info.platform}-${info.arch}: ${base}`;
  }
  return `Alexi failed to start on ${info.platform}-${info.arch}: ${base}\n${warning}`;
}
