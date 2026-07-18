/**
 * Include-pattern helpers shared by the grep, glob, and codesearch tools.
 *
 * These utilities implement the `indexing.additionalExtensions` config
 * knob: user-provided include patterns are extended so that any file
 * ending in one of the configured extensions ALSO matches, without the
 * caller having to write `--include '*.{ts,proto,graphql}'` every time.
 *
 * Extensions are supplied in dotted form (`.proto`, `.graphql`) as
 * validated by `validateAdditionalExtension` in `src/config/userConfig.ts`.
 */

/**
 * Extract the bare extension name (no leading `.`) for each entry.
 * Accepts entries with or without the leading dot; empty / invalid
 * entries are dropped.
 */
function normalize(extensions: readonly string[]): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const raw of extensions) {
    if (typeof raw !== 'string') {
      continue;
    }
    const trimmed = raw.trim();
    if (trimmed.length === 0) {
      continue;
    }
    const bare = (trimmed.startsWith('.') ? trimmed.slice(1) : trimmed).toLowerCase();
    if (bare.length === 0) {
      continue;
    }
    if (seen.has(bare)) {
      continue;
    }
    seen.add(bare);
    out.push(bare);
  }
  return out;
}

/**
 * Merge a caller-provided include pattern with the configured
 * `additionalExtensions`.
 *
 * Behavior:
 * - When `extensions` is empty, the include pattern is returned as-is.
 * - When the user did NOT pass an include pattern (undefined) and
 *   extensions is empty, undefined is returned (the tool searches all
 *   files as before).
 * - When the user did NOT pass an include pattern but extensions is
 *   non-empty, the include pattern is left undefined — additional
 *   extensions are ADDITIVE, they do not restrict a broad search. This
 *   preserves the historical grep/glob "search everything" behavior for
 *   projects that don't set an include.
 * - When the user passed an include pattern, additional extensions are
 *   UNIONED into the pattern. Recognized shapes:
 *     - `*.ts`             -> `*.{ts,proto,graphql}`
 *     - `*.{ts,tsx}`       -> `*.{ts,tsx,proto,graphql}`
 *     - anything else      -> `{<original>,*.proto,*.graphql}`
 *
 * The returned pattern is intended to be handed to both `rg --glob` and
 * the in-process include matcher; both understand `{a,b,c}` alternates.
 */
export function mergeIncludePattern(
  include: string | undefined,
  extensions: readonly string[]
): string | undefined {
  const bare = normalize(extensions);
  if (bare.length === 0) {
    return include;
  }

  if (include === undefined || include.trim().length === 0) {
    // Additive semantics: do not narrow a broad search.
    return include;
  }

  const trimmed = include.trim();

  // Shape: *.<ext>
  const singleExt = /^\*\.([A-Za-z0-9_-]+)$/.exec(trimmed);
  if (singleExt) {
    const merged = uniqueLower([singleExt[1], ...bare]);
    return merged.length === 1 ? `*.${merged[0]}` : `*.{${merged.join(',')}}`;
  }

  // Shape: *.{a,b,c}
  const groupExt = /^\*\.\{([^{}]+)\}$/.exec(trimmed);
  if (groupExt) {
    const parts = groupExt[1]
      .split(',')
      .map((p) => p.trim())
      .filter((p) => p.length > 0);
    const merged = uniqueLower([...parts, ...bare]);
    return `*.{${merged.join(',')}}`;
  }

  // Fallback: wrap original pattern and each extension in an alternation.
  const additions = bare.map((e) => `*.${e}`);
  return `{${[trimmed, ...additions].join(',')}}`;
}

function uniqueLower(values: readonly string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const v of values) {
    const lower = v.toLowerCase();
    if (seen.has(lower)) {
      continue;
    }
    seen.add(lower);
    out.push(lower);
  }
  return out;
}

/**
 * Merge a set of additional extensions into a base set of well-known
 * code extensions. Used by the codesearch tool, which maintains a
 * hard-coded `CODE_EXTENSIONS` whitelist. All returned extensions
 * include the leading dot and are lower-cased.
 */
export function mergeExtensionSet(
  base: ReadonlySet<string>,
  extensions: readonly string[]
): Set<string> {
  const out = new Set<string>();
  for (const b of base) {
    out.add(b.toLowerCase());
  }
  for (const bare of normalize(extensions)) {
    out.add(`.${bare}`);
  }
  return out;
}
