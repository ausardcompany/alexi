/**
 * Tiny re-export shim for `interactive.commands.test.ts`. Centralises the
 * plugin-manager interactions used by the test (load, clear, isEnabled) so
 * the test file itself stays focused on the slash-command surface.
 */
export { getPluginManager, loadPlugin, type Plugin, type LoadResult } from '../../plugin/index.js';
import { getPluginManager } from '../../plugin/index.js';

/**
 * Convenience wrapper around `getPluginManager().isEnabled(name)` used by
 * the slash-command tests.
 */
export function isEnabledHelper(name: string): boolean {
  return getPluginManager().isEnabled(name);
}
