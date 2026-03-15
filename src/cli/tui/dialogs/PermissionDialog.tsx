import React from 'react';
import { Box, Text, useInput } from 'ink';

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

  useInput((input, key) => {
    const ch = input.toLowerCase();
    if (ch === 'a') {
      dialog.close({ granted: true, remember: false } satisfies PermissionResult);
      return;
    }
    if (ch === 'd') {
      dialog.close({ granted: false, remember: false } satisfies PermissionResult);
      return;
    }
    if (ch === 'r') {
      dialog.close({ granted: true, remember: true } satisfies PermissionResult);
      return;
    }
    if (ch === 'n') {
      dialog.close({ granted: false, remember: true } satisfies PermissionResult);
      return;
    }
    if (key.escape) {
      dialog.close({ granted: false, remember: false } satisfies PermissionResult);
    }
  });

  const actionLabel = ACTION_LABELS[action] ?? action;

  return (
    <Box
      borderStyle="round"
      borderColor={colors.warning}
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

      <Box marginTop={1}>
        {/* Key hints */}
        <KeyHint letter="A" label="pprove" color={colors.warning} />
        <KeyHint letter="D" label="eny" color={colors.error} />
        <KeyHint letter="R" label="emember" color={colors.success} />
        <Text>
          <Text color={colors.dimText}>[N]ever</Text>
        </Text>
      </Box>
    </Box>
  );
}
