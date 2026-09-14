/**
 * CLI Permission Prompt Handler
 * Provides interactive permission prompts with improved UX
 * Inspired by kilocode's permission dock improvements
 */

import * as readline from 'readline';
import { PermissionRequested, PermissionResponse } from '../bus/index.js';
import type { PermissionAction } from './index.js';

// Color utilities for CLI output
const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  gray: '\x1b[90m',
};

function c(color: keyof typeof colors, text: string): string {
  return `${colors[color]}${text}${colors.reset}`;
}

/**
 * Format permission action with appropriate icon
 */
function formatActionIcon(action: PermissionAction): string {
  switch (action) {
    case 'read':
      return '📖';
    case 'write':
      return '✏️';
    case 'execute':
      return '⚙️';
    case 'network':
      return '🌐';
    case 'admin':
      return '🔐';
    default:
      return '❓';
  }
}

/**
 * Format permission type label
 */
function formatActionLabel(action: PermissionAction): string {
  switch (action) {
    case 'read':
      return 'Read Access';
    case 'write':
      return 'Write Access';
    case 'execute':
      return 'Execute Command';
    case 'network':
      return 'Network Access';
    case 'admin':
      return 'Administrative Access';
    default:
      return 'Permission Request';
  }
}

/**
 * Render permission prompt with improved layout
 */
function renderPermissionPrompt(data: {
  toolName: string;
  action: PermissionAction;
  resource: string;
  description: string;
}): void {
  const icon = formatActionIcon(data.action);
  const label = formatActionLabel(data.action);
  const boxWidth = 70;

  // Top border
  console.log('\n' + c('cyan', '╭' + '─'.repeat(boxWidth - 2) + '╮'));

  // Header with icon and title
  const headerText = `${icon}  ${label}`;
  const headerPadding = Math.max(0, boxWidth - headerText.length - 4);
  console.log(
    c('cyan', '│ ') + c('bold', headerText) + ' '.repeat(headerPadding) + c('cyan', ' │')
  );

  // Separator
  console.log(c('cyan', '├' + '─'.repeat(boxWidth - 2) + '┤'));

  // Tool name
  const toolLine = `Tool: ${data.toolName}`;
  const toolPadding = Math.max(0, boxWidth - toolLine.length - 4);
  console.log(c('cyan', '│ ') + c('gray', toolLine) + ' '.repeat(toolPadding) + c('cyan', ' │'));

  // Resource (split into multiple lines if too long)
  const resourcePrefix = 'Resource: ';
  const maxResourceWidth = boxWidth - resourcePrefix.length - 6;
  const resourceLines: string[] = [];
  let currentLine = '';

  for (const word of data.resource.split(/\s+/)) {
    if (currentLine.length + word.length + 1 > maxResourceWidth) {
      if (currentLine) {
        resourceLines.push(currentLine);
      }
      currentLine = word;
    } else {
      currentLine += (currentLine ? ' ' : '') + word;
    }
  }
  if (currentLine) {
    resourceLines.push(currentLine);
  }

  // First resource line with prefix
  const firstResourceLine = resourcePrefix + (resourceLines[0] || '');
  const firstPadding = Math.max(0, boxWidth - firstResourceLine.length - 4);
  console.log(
    c('cyan', '│ ') + c('yellow', firstResourceLine) + ' '.repeat(firstPadding) + c('cyan', ' │')
  );

  // Additional resource lines (if any)
  for (let i = 1; i < resourceLines.length; i++) {
    const line = ' '.repeat(resourcePrefix.length) + resourceLines[i];
    const padding = Math.max(0, boxWidth - line.length - 4);
    console.log(c('cyan', '│ ') + c('yellow', line) + ' '.repeat(padding) + c('cyan', ' │'));
  }

  // Description (if different from default)
  if (data.description && data.description !== `${data.action} on ${data.resource}`) {
    console.log(c('cyan', '│ ') + ' '.repeat(boxWidth - 4) + c('cyan', ' │'));
    const descLines: string[] = [];
    let descLine = '';
    const maxDescWidth = boxWidth - 6;

    for (const word of data.description.split(/\s+/)) {
      if (descLine.length + word.length + 1 > maxDescWidth) {
        if (descLine) {
          descLines.push(descLine);
        }
        descLine = word;
      } else {
        descLine += (descLine ? ' ' : '') + word;
      }
    }
    if (descLine) {
      descLines.push(descLine);
    }

    for (const line of descLines) {
      const padding = Math.max(0, boxWidth - line.length - 4);
      console.log(c('cyan', '│ ') + c('dim', line) + ' '.repeat(padding) + c('cyan', ' │'));
    }
  }

  // Bottom separator
  console.log(c('cyan', '├' + '─'.repeat(boxWidth - 2) + '┤'));

  // Action buttons
  const actionsText = '[A]pprove  [D]eny  [R]emember & Approve  [N]ever Ask';
  const _actionsPadding = Math.max(0, boxWidth - actionsText.length - 4);
  console.log(
    c('cyan', '│ ') +
      c('green', '[A]') +
      c('gray', 'pprove  ') +
      c('red', '[D]') +
      c('gray', 'eny  ') +
      c('yellow', '[R]') +
      c('gray', 'emember & Approve  ') +
      c('red', '[N]') +
      c('gray', 'ever Ask') +
      ' '.repeat(Math.max(0, boxWidth - 52)) +
      c('cyan', ' │')
  );

  // Bottom border
  console.log(c('cyan', '╰' + '─'.repeat(boxWidth - 2) + '╯'));
  console.log(
    c('gray', 'Tip: after Deny (D) / Never (N) you can add an optional reason.')
  );
  console.log();
}

/**
 * Prompt the user for optional rejection feedback. Empty input (or a
 * timeout) resolves to `undefined`. The rejection-shortcut for the model
 * has already been decided by this point — feedback is a purely additive
 * message that the agent loop forwards to the LLM as a follow-up user
 * turn (mirrors kilocode's `feat: support permission rejection feedback`
 * flow, commit b30b2cf0d).
 *
 * While this input is active the primary approval prompt is not shown,
 * so there is no risk of the "approve shortcut" (A / R) firing on top of
 * the feedback line (see kilocode commit 845565872).
 */
async function promptForRejectionFeedback(timeoutMs = 30_000): Promise<string | undefined> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    let settled = false;
    const timer = setTimeout(() => {
      if (settled) {
        return;
      }
      settled = true;
      rl.close();
      resolve(undefined);
    }, timeoutMs);

    rl.question(c('yellow', 'Optional reason (press Enter to skip): '), (answer) => {
      if (settled) {
        return;
      }
      settled = true;
      clearTimeout(timer);
      rl.close();
      const trimmed = answer.trim();
      resolve(trimmed.length > 0 ? trimmed : undefined);
    });
  });
}

/**
 * Prompt user for permission decision
 */
async function promptUser(
  requestId: string,
  data: {
    toolName: string;
    action: PermissionAction;
    resource: string;
    description: string;
  }
): Promise<void> {
  renderPermissionPrompt(data);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    const askQuestion = () => {
      rl.question(c('cyan', 'Your choice: '), async (answer) => {
        const choice = answer.trim().toLowerCase();

        switch (choice) {
          case 'a':
          case 'approve':
            PermissionResponse.publish({
              id: requestId,
              granted: true,
              remember: false,
              timestamp: Date.now(),
            });
            console.log(c('green', '✓ Permission granted\n'));
            rl.close();
            resolve();
            break;

          case 'd':
          case 'deny': {
            // Close the primary prompt BEFORE opening the feedback prompt
            // so the approval shortcut (A/R) cannot fire on top of the
            // feedback input (parity with kilocode fix 845565872).
            rl.close();
            const feedback = await promptForRejectionFeedback();
            PermissionResponse.publish({
              id: requestId,
              granted: false,
              remember: false,
              timestamp: Date.now(),
              feedback,
            });
            console.log(c('red', '✗ Permission denied\n'));
            resolve();
            break;
          }

          case 'r':
          case 'remember':
            PermissionResponse.publish({
              id: requestId,
              granted: true,
              remember: true,
              timestamp: Date.now(),
            });
            console.log(c('green', '✓ Permission granted and remembered for this session\n'));
            rl.close();
            resolve();
            break;

          case 'n':
          case 'never': {
            rl.close();
            const feedback = await promptForRejectionFeedback();
            PermissionResponse.publish({
              id: requestId,
              granted: false,
              remember: true,
              timestamp: Date.now(),
              feedback,
            });
            console.log(c('red', '✗ Permission denied and remembered for this session\n'));
            resolve();
            break;
          }

          default:
            console.log(c('yellow', 'Invalid choice. Please enter A, D, R, or N.'));
            askQuestion();
            break;
        }
      });
    };

    askQuestion();
  });
}

/**
 * Start the permission prompt handler
 * Subscribes to permission request events and prompts the user
 */
export function startPermissionPromptHandler(): () => void {
  const unsubscribe = PermissionRequested.subscribe(async (data) => {
    await promptUser(data.id, {
      toolName: data.toolName,
      action: data.action,
      resource: data.resource,
      description: data.description,
    });
  });

  return unsubscribe;
}

/**
 * Check if permission prompts are supported in current environment
 */
export function isPermissionPromptSupported(): boolean {
  // Check if we're in an interactive terminal
  return process.stdin.isTTY && process.stdout.isTTY;
}
