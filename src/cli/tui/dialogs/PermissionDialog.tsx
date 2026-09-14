import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import TextInput from 'ink-text-input';

import { useDialog } from '../context/DialogContext.js';
import { useTheme } from '../context/ThemeContext.js';

export interface PermissionDialogProps {
  action: 'read' | 'write' | 'execute' | 'network' | 'admin';
  toolName: string;
  resource: string;
  description: string;
  icon: string;
}

export interface PermissionResult {
  granted: boolean;
  remember: boolean;
  /**
   * Optional natural-language reason supplied by the user when rejecting.
   * Empty / omitted when the user did not supply a reason, or approved.
   * Mirrors kilocode's `feat: support permission rejection feedback in
   * CLI and VS Code` (commit b30b2cf0d).
   */
  feedback?: string;
}

const ACTION_LABELS: Record<string, string> = {
  read: 'Read Access',
  write: 'Write Access',
  execute: 'Execute Command',
  network: 'Network Access',
  admin: 'Administrative Access',
};

function KeyHint({ letter, label, color }: { letter: string; label: string; color: string }) {
  return (
    <Text>
      <Text color={color}>[{letter}]</Text>
      <Text dimColor>{label} </Text>
    </Text>
  );
}

export function PermissionDialog({
  action,
  toolName,
  resource,
  description,
  icon,
}: PermissionDialogProps) {
  const dialog = useDialog();
  const {
    theme: { colors },
  } = useTheme();

  // Two-phase state: primary approve/deny prompt, then (on deny) an
  // optional feedback capture. While `pendingDeny` is set the approval
  // shortcut is intentionally NOT re-armed — mirrors kilocode fix
  // 845565872 (block approval shortcut during rejection feedback).
  const [pendingDeny, setPendingDeny] = useState<{ remember: boolean } | null>(null);
  const [feedback, setFeedback] = useState<string>('');

  useInput((input, key) => {
    // Feedback phase: swallow shortcut keys so a stray 'a' in the reason
    // cannot re-arm the approve path. Enter/Escape are handled by the
    // TextInput below via onSubmit.
    if (pendingDeny) {
      if (key.escape) {
        dialog.close({
          granted: false,
          remember: pendingDeny.remember,
        } satisfies PermissionResult);
      }
      return;
    }

    const ch = input.toLowerCase();
    if (ch === 'a') {
      dialog.close({ granted: true, remember: false } satisfies PermissionResult);
      return;
    }
    if (ch === 'd') {
      setPendingDeny({ remember: false });
      return;
    }
    if (ch === 'r') {
      dialog.close({ granted: true, remember: true } satisfies PermissionResult);
      return;
    }
    if (ch === 'n') {
      setPendingDeny({ remember: true });
      return;
    }
    if (key.escape) {
      dialog.close({ granted: false, remember: false } satisfies PermissionResult);
    }
  });

  const actionLabel = ACTION_LABELS[action] ?? action;

  const onSubmitFeedback = (value: string) => {
    const trimmed = value.trim();
    dialog.close({
      granted: false,
      remember: pendingDeny?.remember ?? false,
      feedback: trimmed.length > 0 ? trimmed : undefined,
    } satisfies PermissionResult);
  };

  return (
    <Box
      borderStyle="round"
      borderColor={colors.borderFocused}
      paddingX={2}
      paddingY={1}
      flexDirection="column"
    >
      {/* Header */}
      <Text color={colors.warning} bold>
        {icon} {actionLabel}
      </Text>

      <Box marginY={1} flexDirection="column">
        {/* Tool and resource */}
        <Box>
          <Text color={colors.dimText}>Tool: </Text>
          <Text color={colors.text}>{toolName}</Text>
        </Box>
        <Box>
          <Text color={colors.dimText}>Resource: </Text>
          <Text color={colors.text}>{resource}</Text>
        </Box>
      </Box>

      {/* Description */}
      <Text color={colors.dimText}>{description}</Text>

      {pendingDeny ? (
        <Box marginTop={1} flexDirection="column">
          <Text color={colors.warning}>
            Reason for rejection (optional, Enter to submit, Esc to skip):
          </Text>
          <Box>
            <Text color={colors.dimText}>&gt; </Text>
            <TextInput value={feedback} onChange={setFeedback} onSubmit={onSubmitFeedback} />
          </Box>
        </Box>
      ) : (
        <Box marginTop={1}>
          {/* Key hints */}
          <KeyHint letter="A" label="pprove" color={colors.warning} />
          <KeyHint letter="D" label="eny" color={colors.error} />
          <KeyHint letter="R" label="emember" color={colors.success} />
          <Text>
            <Text color={colors.dimText}>[N]ever</Text>
          </Text>
        </Box>
      )}
    </Box>
  );
}
