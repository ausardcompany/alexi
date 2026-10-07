/**
 * Config-overlay shadowed-write detection.
 *
 * Ports upstream kilocode fixes `b9e4b1e98`, `b1395f98d`, `506fa0876`,
 * and `5ee9257b8` ("surface shadowed config overlay writes before
 * saving"). When Alexi layers managed preferences (macOS MDM) over
 * user config, a write to the lower-precedence `userConfig` for a key
 * that is also set in the higher-precedence `managed` overlay silently
 * takes no effect at read time: the operator saves, re-reads, and
 * sees the managed value instead of their edit.
 *
 * This module is pure — no I/O. Callers invoke {@link detectShadowedWrite}
 * before persisting a user-config change and surface the resulting
 * warning (CLI, TUI dialog) so the operator understands why their edit
 * will have no effect.
 *
 * SAP AI Core note: managed preferences on macOS are the only
 * higher-precedence layer in Alexi today (see
 * `src/config/userConfig.ts`). The helper is written generically so
 * additional overlay sources (project `.alexi/config.json`,
 * environment-level overrides, …) can be added later without churning
 * the public surface.
 */

/**
 * Identifier for a single overlay layer. Kept as a string so callers
 * can pick stable names (`'managed'`, `'user'`, `'project'`, …)
 * without threading an enum through the config code.
 */
export type OverlayId = string;

/**
 * Snapshot of a single overlay layer.
 *   - `id`         — stable identifier, used in warning text.
 *   - `precedence` — higher value wins on conflict.
 *   - `keys`       — the set of keys the layer currently defines.
 */
export interface OverlayLayer {
  id: OverlayId;
  precedence: number;
  keys: ReadonlySet<string>;
}

/** Result of a shadowed-write detection. */
export interface ShadowedWrite {
  shadowedBy: OverlayId;
}

/**
 * Return non-null when writing `key` to `targetOverlay` would be
 * silently shadowed by a higher-precedence layer that already defines
 * the same key. Returns `null` when the write is safe.
 *
 * The target layer itself does NOT need to currently define the key —
 * the detection is based solely on which higher-precedence overlays
 * define it.
 */
export function detectShadowedWrite(
  key: string,
  targetOverlay: OverlayId,
  layers: ReadonlyArray<OverlayLayer>
): ShadowedWrite | null {
  const target = layers.find((l) => l.id === targetOverlay);
  if (!target) {
    return null;
  }
  // Pick the HIGHEST-precedence shadower so the warning points at the
  // layer that will actually win at read time (not any arbitrary
  // intermediate layer).
  let shadower: OverlayLayer | undefined;
  for (const layer of layers) {
    if (layer.id === targetOverlay) {
      continue;
    }
    if (layer.precedence <= target.precedence) {
      continue;
    }
    if (!layer.keys.has(key)) {
      continue;
    }
    if (!shadower || layer.precedence > shadower.precedence) {
      shadower = layer;
    }
  }
  return shadower ? { shadowedBy: shadower.id } : null;
}

/**
 * Human-readable warning for a shadowed write. Kept here so every
 * caller surfaces the same wording.
 */
export function formatShadowedWriteWarning(
  key: string,
  targetOverlay: OverlayId,
  shadow: ShadowedWrite
): string {
  return (
    `Config key "${key}" written to the "${targetOverlay}" overlay will be shadowed ` +
    `by the "${shadow.shadowedBy}" overlay, which defines the same key at a higher precedence. ` +
    `The write will persist, but reads will continue to see the "${shadow.shadowedBy}" value.`
  );
}
