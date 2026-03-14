/**
 * Keybinding infrastructure for the interactive REPL
 * Provides Tab agent cycling and Ctrl+X leader key system
 */

import * as readline from 'readline';
import { c } from './colors.js';

/** Leader key timeout in milliseconds */
const LEADER_TIMEOUT_MS = 1500;

/** Ordered list of agents for Tab cycling */
const AGENT_CYCLE_ORDER = ['code', 'debug', 'plan', 'explore', 'orchestrator'] as const;

/** Actions available via leader key sequences */
export type LeaderAction = 'new-session' | 'model-picker' | 'agent-list' | 'status' | 'help';

/** Leader key mapping: key name → action */
const LEADER_KEY_MAP: Record<string, LeaderAction> = {
  n: 'new-session',
  m: 'model-picker',
  a: 'agent-list',
  s: 'status',
  h: 'help',
};

/** Keypress event key descriptor from Node.js readline */
export interface KeypressKey {
  name?: string;
  ctrl?: boolean;
  meta?: boolean;
  shift?: boolean;
  sequence?: string;
}

/** Options for configuring the keypress handler */
export interface KeypressHandlerOptions {
  /** Called when Tab is pressed to cycle agents (reverse = Shift+Tab) */
  onTabCycleAgent: (reverse: boolean) => void;
  /** Called when a leader key sequence completes */
  onLeaderAction?: (action: LeaderAction) => void;
  /** Called when leader mode enters or exits */
  onLeaderModeChange?: (active: boolean) => void;
  /** Called when Ctrl+L is pressed */
  onClearScreen?: () => void;
}

/**
 * Handles keypress events for the REPL
 * Supports Tab agent cycling and Ctrl+X leader key sequences
 */
export class KeypressHandler {
  private isLeaderMode = false;
  private leaderTimeout: ReturnType<typeof setTimeout> | null = null;
  private options: KeypressHandlerOptions;
  private currentLineContent = '';

  constructor(options: KeypressHandlerOptions) {
    this.options = options;
  }

  /**
   * Update the current line content so Tab knows whether input is empty
   * Should be called on each keypress or line change
   */
  setCurrentLineContent(content: string): void {
    this.currentLineContent = content;
  }

  /**
   * Handle a keypress event from process.stdin
   */
  handleKeypress(_str: string | undefined, key: KeypressKey | undefined): void {
    if (!key) {
      return;
    }

    // Leader mode: waiting for second key in Ctrl+X sequence
    if (this.isLeaderMode) {
      this.handleLeaderKey(key);
      return;
    }

    // Ctrl+X: enter leader mode
    if (key.ctrl && key.name === 'x') {
      this.enterLeaderMode();
      return;
    }

    // Ctrl+L: clear screen
    if (key.ctrl && key.name === 'l') {
      this.options.onClearScreen?.();
      return;
    }

    // Tab / Shift+Tab: cycle agents (only when input line is empty)
    if (key.name === 'tab' && this.currentLineContent.length === 0) {
      this.options.onTabCycleAgent(key.shift === true);
      return;
    }
  }

  /** Clean up timers and resources */
  dispose(): void {
    this.cancelLeaderMode();
  }

  private enterLeaderMode(): void {
    this.isLeaderMode = true;
    this.options.onLeaderModeChange?.(true);

    // Auto-cancel after timeout
    this.leaderTimeout = setTimeout(() => {
      this.cancelLeaderMode();
    }, LEADER_TIMEOUT_MS);
  }

  private handleLeaderKey(key: KeypressKey): void {
    const action = key.name ? LEADER_KEY_MAP[key.name] : undefined;

    // Cancel leader mode regardless
    this.cancelLeaderMode();

    if (action) {
      this.options.onLeaderAction?.(action);
    }
  }

  private cancelLeaderMode(): void {
    if (this.leaderTimeout) {
      clearTimeout(this.leaderTimeout);
      this.leaderTimeout = null;
    }
    if (this.isLeaderMode) {
      this.isLeaderMode = false;
      this.options.onLeaderModeChange?.(false);
    }
  }
}

/**
 * Get the ordered list of agent IDs for Tab cycling
 */
export function getAgentCycleOrder(): readonly string[] {
  return AGENT_CYCLE_ORDER;
}

/**
 * Compute the next agent in the cycle
 * @param currentAgent - Current agent ID (defaults to 'code')
 * @param reverse - Cycle backwards (Shift+Tab)
 * @returns Next agent ID in the cycle
 */
export function cycleAgent(currentAgent: string | undefined, reverse: boolean): string {
  const agents = AGENT_CYCLE_ORDER;
  const current = currentAgent ?? 'code';
  const idx = agents.indexOf(current as (typeof agents)[number]);

  // If not found, start from beginning
  if (idx === -1) {
    return agents[0];
  }

  if (reverse) {
    return agents[(idx - 1 + agents.length) % agents.length];
  }
  return agents[(idx + 1) % agents.length];
}

/**
 * Format the keybinding hints bar shown below the prompt
 * @param _agentId - Current agent ID (reserved for future context-aware hints)
 * @param isLeaderMode - Whether Ctrl+X leader mode is active
 * @returns Formatted hints bar string
 */
export function formatHintsBar(_agentId: string | undefined, isLeaderMode: boolean): string {
  if (isLeaderMode) {
    return (
      c('dim', '  Ctrl+X: ') +
      c('white', '[n]') +
      c('dim', 'ew session · ') +
      c('white', '[m]') +
      c('dim', 'odel · ') +
      c('white', '[a]') +
      c('dim', 'gents · ') +
      c('white', '[s]') +
      c('dim', 'tatus · ') +
      c('white', '[h]') +
      c('dim', 'elp')
    );
  }

  return (
    c('dim', '  Tab') +
    c('gray', ' switch agent · ') +
    c('dim', 'Ctrl+X') +
    c('gray', ' leader · ') +
    c('dim', '/help') +
    c('gray', ' commands')
  );
}

/**
 * Set up keypress handling on stdin alongside an existing readline interface
 * @param stdin - The process.stdin stream
 * @param options - Keypress handler callbacks
 * @returns The KeypressHandler instance for lifecycle management
 */
export function setupKeypressHandler(
  stdin: NodeJS.ReadStream,
  options: KeypressHandlerOptions
): KeypressHandler {
  // Enable keypress events on stdin (safe to call multiple times)
  readline.emitKeypressEvents(stdin);

  const handler = new KeypressHandler(options);

  // Attach keypress listener
  stdin.on('keypress', (str: string | undefined, key: KeypressKey | undefined) => {
    handler.handleKeypress(str, key);
  });

  return handler;
}
