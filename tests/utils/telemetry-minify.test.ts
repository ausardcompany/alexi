/**
 * Minify-survivability test for `src/utils/telemetry.ts`.
 *
 * Contract this test enforces:
 * 1. The telemetry module must not rely on class-name checks
 *    (`obj.constructor.name === 'TelemetryService'`) — bundlers routinely
 *    rename classes to single letters in production builds, silently
 *    breaking any such check.
 * 2. The exported `isTelemetryService` structural helper must return
 *    `true` for an instance produced by the *minified* module, proving
 *    the pattern is minify-safe.
 * 3. The exported `Telemetry` facade must remain fully functional after
 *    minification (setEnabled + track + getEvents + clear round-trip).
 *
 * We use esbuild (already a transitive dev dep via vitest/vite) to
 * minify. The issue mentions Bun's `--minify` flag as the reference
 * implementation; we substitute esbuild because it is the minifier
 * already present in the alexi toolchain and produces the same class-
 * renaming behaviour that is being defended against. If Bun is added
 * to the toolchain later, a second matrix entry can be appended without
 * changing the test's semantics.
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { transform } from 'esbuild';

import { isTelemetryService, telemetryInstance } from '../../src/utils/telemetry.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const TELEMETRY_SRC = resolve(__dirname, '../../src/utils/telemetry.ts');

interface MinifiedModule {
  Telemetry: {
    setEnabled(enabled: boolean): void;
    track(event: string, properties?: Record<string, unknown>): void;
    getEvents(): Array<{ event: string; properties?: Record<string, unknown>; timestamp: number }>;
    clear(): void;
  };
  isTelemetryService: (obj: unknown) => boolean;
  telemetryInstance: unknown;
}

/**
 * Load `src/utils/telemetry.ts` through esbuild with `minify: true`, then
 * import the resulting ESM code via a data-URL dynamic import so the test
 * sees an actually-minified live module (not just its source string).
 */
async function loadMinifiedTelemetry(): Promise<{
  mod: MinifiedModule;
  minifiedSource: string;
}> {
  const source = await readFile(TELEMETRY_SRC, 'utf8');
  const result = await transform(source, {
    loader: 'ts',
    format: 'esm',
    minify: true,
    target: 'es2022',
    // Keep property names untouched — we still want `setEnabled`/`track`
    // preserved (that's the whole point of the structural check). It is
    // class *identifier* names we expect to lose. Property mangling would
    // require an explicit opt-in via `mangleProps`, which we do NOT set.
  });
  const dataUrl = `data:text/javascript;base64,${Buffer.from(result.code).toString('base64')}`;
  const mod = (await import(dataUrl)) as MinifiedModule;
  return { mod, minifiedSource: result.code };
}

describe('telemetry minify-survivability', () => {
  let mod: MinifiedModule;
  let minifiedSource: string;

  beforeAll(async () => {
    ({ mod, minifiedSource } = await loadMinifiedTelemetry());
  });

  it('esbuild actually minified the module (source is shorter and lacks readable class name)', async () => {
    const original = await readFile(TELEMETRY_SRC, 'utf8');
    // Sanity: minified output is materially smaller than the original TS.
    expect(minifiedSource.length).toBeLessThan(original.length / 2);
    // The `TelemetryService` identifier is a local (non-exported) class
    // name inside the module and must have been renamed by the minifier.
    // If this ever regresses (esbuild changes defaults) the whole test is
    // meaningless, so we assert it explicitly. We look for the class
    // *declaration* rather than the raw substring because the exported
    // helper `isTelemetryService` naturally contains "TelemetryService"
    // as a substring after minification.
    expect(minifiedSource).not.toMatch(/class\s+TelemetryService\b/);
    // Same idea, negative form: some renamed class MUST appear.
    expect(minifiedSource).toMatch(/class\s+[A-Za-z_$][\w$]*\s*\{/);
  });

  it('exposes isTelemetryService and telemetryInstance after minification', () => {
    expect(typeof mod.isTelemetryService).toBe('function');
    expect(mod.telemetryInstance).toBeDefined();
    expect(mod.telemetryInstance).not.toBeNull();
  });

  it('isTelemetryService returns true for the minified singleton instance', () => {
    // This is the core assertion: structural detection works even though
    // the internal class name has been mangled by the minifier.
    expect(mod.isTelemetryService(mod.telemetryInstance)).toBe(true);
  });

  it('isTelemetryService rejects plain objects, null, and partial shapes', () => {
    expect(mod.isTelemetryService(null)).toBe(false);
    expect(mod.isTelemetryService(undefined)).toBe(false);
    expect(mod.isTelemetryService({})).toBe(false);
    expect(mod.isTelemetryService('telemetry')).toBe(false);
    // Partial shape — `track` only. Must be rejected: many event emitters
    // expose a `track` method and would otherwise be false-positives.
    expect(mod.isTelemetryService({ track: () => undefined })).toBe(false);
  });

  it('accepts any duck-typed shape that carries the full method surface (minify-safe by design)', () => {
    const duck = {
      setEnabled: (_e: boolean) => undefined,
      track: (_event: string) => undefined,
      getEvents: () => [],
      clear: () => undefined,
    };
    expect(mod.isTelemetryService(duck)).toBe(true);
  });

  it('constructor.name of the minified instance is NOT "TelemetryService" (proves the risk)', () => {
    // This test documents *why* structural checks are required. If this
    // ever starts equalling 'TelemetryService', esbuild has changed
    // behaviour and the minify-survival scenario needs re-evaluation.
    const instance = mod.telemetryInstance as { constructor: { name: string } };
    expect(instance.constructor.name).not.toBe('TelemetryService');
  });

  it('minified Telemetry facade round-trips setEnabled + track + getEvents + clear', () => {
    mod.Telemetry.clear();
    mod.Telemetry.setEnabled(true);
    mod.Telemetry.track('minify_test', { attempt: 1 });
    mod.Telemetry.track('minify_test', { attempt: 2 });

    const events = mod.Telemetry.getEvents();
    expect(events).toHaveLength(2);
    expect(events[0]?.event).toBe('minify_test');
    expect(events[0]?.properties).toEqual({ attempt: 1 });

    mod.Telemetry.clear();
    expect(mod.Telemetry.getEvents()).toHaveLength(0);
  });

  it('minified Telemetry respects disabled state', () => {
    mod.Telemetry.clear();
    mod.Telemetry.setEnabled(false);
    mod.Telemetry.track('should_not_record');
    expect(mod.Telemetry.getEvents()).toHaveLength(0);
  });

  it('unminified isTelemetryService also accepts the minified module instance (cross-boundary duck-typing)', () => {
    // The structural check imported from the non-minified test build must
    // accept an instance produced by the minified build — that's the
    // realistic production scenario (compiled consumer + minified vendor).
    expect(isTelemetryService(mod.telemetryInstance)).toBe(true);
    // And vice versa.
    expect(mod.isTelemetryService(telemetryInstance)).toBe(true);
  });
});
