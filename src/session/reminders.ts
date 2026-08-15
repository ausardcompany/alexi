/**
 * Session reminders — short system-role messages injected into the model's
 * context when a session-level state change happens (agent switch, mode
 * change, etc.). Mirrors upstream opencode `session/reminders.ts`.
 *
 * The functions here are intentionally pure so callers (orchestrator, TUI,
 * agent hooks) can compose reminders without a running session object.
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Reminder text shown to the model on the first user turn after the user
 * leaves the Ask agent for a Code agent. The Ask agent is read-only, so the
 * next agent needs an explicit hint that write tools are back on the table.
 *
 * Ported from `packages/opencode/src/kilocode/session/ask-code-switch.txt`.
 * Loaded from disk (rather than inlined) so operators can override the
 * wording without a recompile.
 */
const ASK_CODE_SWITCH_TXT = readFileSync(
  path.join(__dirname, 'ask-code-switch.txt'),
  'utf8'
).trimEnd();

/**
 * Built-in code-agent ids. Kept in sync with `builtInAgents` in
 * `src/agent/index.ts`. When adding a new coding-oriented agent (i.e. one
 * that may edit files) add it here so the ask→code reminder fires.
 */
const CODE_AGENT_IDS: ReadonlySet<string> = new Set(['code', 'debug', 'orchestrator']);

/**
 * Return `true` if `agentId` names a code (write-capable) agent, and `false`
 * for read-only agents like `ask`, `explore`, or `plan`.
 */
export function isCodeAgent(agentId: string): boolean {
  return CODE_AGENT_IDS.has(agentId);
}

/**
 * Return the system reminder that should be surfaced immediately after an
 * agent switch, or `undefined` if no reminder is warranted.
 *
 * Current rules:
 * - `ask → <code-agent>` → return the ask-code-switch reminder so the
 *   destination model knows write tools are now available.
 *
 * Add new switch-triggered reminders here.
 */
export function reminderForAgentSwitch(from: string, to: string): string | undefined {
  if (from === 'ask' && isCodeAgent(to)) {
    return ASK_CODE_SWITCH_TXT;
  }
  return undefined;
}

/**
 * A single reminder envelope. Mirrors the OpenAI `role: 'system'` message
 * shape so callers can spread it straight into a chat request.
 */
export interface ReminderMessage {
  role: 'system';
  content: string;
}

/**
 * Build the list of reminders for a given session context. Additive: callers
 * may spread additional reminders onto the returned array.
 */
export function buildSessionReminders(input: {
  previousAgentId?: string | null;
  currentAgentId: string;
}): ReminderMessage[] {
  const reminders: ReminderMessage[] = [];
  const { previousAgentId, currentAgentId } = input;
  if (previousAgentId && previousAgentId !== currentAgentId) {
    const switchReminder = reminderForAgentSwitch(previousAgentId, currentAgentId);
    if (switchReminder) {
      reminders.push({ role: 'system', content: switchReminder });
    }
  }
  return reminders;
}
