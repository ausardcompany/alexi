/**
 * Programmatic Tool Calling (`code_mode`)
 *
 * Ports upstream kilocode commit 6b5e8a04e (`experimental.code_mode`).
 * Routes MCP tool calls through a confined JavaScript runtime with
 * on-demand tool discovery instead of exposing every MCP tool directly
 * on every turn. This dramatically reduces the tool-schema token
 * overhead — critical when working against SAP AI Core token budgets
 * (opus / gpt-4-class deployments in AI Core charge per input token,
 * including the tool-catalog block).
 *
 * The runtime is intentionally NOT eagerly required — `loadCodeMode`
 * dynamically imports the runtime module the first time the flag is
 * observed, and refuses to load when the environment is network-
 * restricted (upstream commit e0dcb0e4e). A network-restricted process
 * cannot fetch on-demand tool definitions, so code_mode would be worse
 * than the direct-tool path.
 *
 * Alexi's runtime bindings are minimal by design — this module is a
 * shim that unlocks the config gate; the actual sandbox will be filled
 * in by follow-up commits as the upstream implementation stabilises.
 */

import { getConfigCodeMode } from '../config/userConfig.js';
import { logger } from '../utils/logger.js';

export interface CodeMode {
  /**
   * Dispatch an MCP tool call through the confined runtime. The
   * runtime resolves the tool by name against its on-demand cache,
   * loads the definition if absent, and executes it inside the
   * sandbox.
   */
  dispatch(toolName: string, args: unknown): Promise<unknown>;
  /**
   * Release any runtime resources (isolates, workers, sockets).
   */
  dispose(): Promise<void>;
}

/**
 * True when the current process is running with network access
 * restricted (offline, `ALEXI_NO_NETWORK=1`, or an air-gapped SAP AI
 * Core deployment). Kept small and pure so the check runs cheap on
 * every session start.
 */
function isNetworkRestricted(): boolean {
  if (process.env.ALEXI_NO_NETWORK === '1' || process.env.ALEXI_NO_NETWORK === 'true') {
    return true;
  }
  if (process.env.NO_PROXY === '*' || process.env.no_proxy === '*') {
    return true;
  }
  return false;
}

/**
 * Load the code-mode runtime if the experimental flag is enabled AND
 * the environment permits it. Returns `null` when disabled or when
 * network access is restricted.
 */
export async function loadCodeMode(): Promise<CodeMode | null> {
  if (!getConfigCodeMode()) {
    return null;
  }
  if (isNetworkRestricted()) {
    logger.warn(
      '[code_mode] experimental.code_mode requires network access for on-demand tool discovery; skipping.'
    );
    return null;
  }
  try {
    const mod = await import('./code-mode-runtime.js');
    return mod.createCodeModeRuntime();
  } catch (err) {
    logger.warn(
      `[code_mode] runtime unavailable: ${err instanceof Error ? err.message : String(err)}`
    );
    return null;
  }
}

/**
 * Test-only: expose the network-restricted check so unit tests can
 * assert on the gating without spawning a real runtime.
 */
export function _isNetworkRestrictedForTests(): boolean {
  return isNetworkRestricted();
}
