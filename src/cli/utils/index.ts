/**
 * CLI utilities barrel export
 */

export { colors, c, type ColorName } from './colors.js';
export { VALID_STAGES, isValidStage, validateStageOrExit } from './validation.js';
export {
  AGENT_COLORS,
  DEFAULT_AGENT_COLOR,
  getAgentColor,
  formatAgentPrompt,
  formatAgentBadge,
  formatAgentSwitchNotice,
} from './agentColors.js';
export {
  setupKeypressHandler,
  cycleAgent,
  getAgentCycleOrder,
  formatHintsBar,
  KeypressHandler,
  type KeypressKey,
  type KeypressHandlerOptions,
  type LeaderAction,
} from './keybindings.js';
