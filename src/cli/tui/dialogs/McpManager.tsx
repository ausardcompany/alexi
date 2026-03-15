import React from 'react';
import { Box, Text, useInput } from 'ink';
import { useDialog } from '../context/DialogContext.js';
import { useTheme } from '../context/ThemeContext.js';

export interface McpServerInfo {
  name: string;
  url: string;
  status: 'connected' | 'disconnected' | 'error';
  toolCount: number;
}

export interface McpManagerProps {
  servers: McpServerInfo[];
}

export function McpManager({ servers }: McpManagerProps): React.JSX.Element {
  const dialog = useDialog();
  const { theme } = useTheme();
  const colors = theme.colors;

  useInput((_input, key) => {
    if (key.escape) {
      dialog.close(undefined);
    }
  });

  return (
    <Box
      borderStyle="round"
      borderColor={colors.info}
      paddingX={2}
      paddingY={1}
      flexDirection="column"
    >
      <Text color={colors.info} bold>
        MCP Manager
      </Text>
      <Text> </Text>
      {servers.length === 0 ? (
        <Text color={colors.dimText}>No MCP servers configured.</Text>
      ) : (
        servers.map((server) => {
          if (server.status === 'connected') {
            return (
              <Box key={server.name} flexDirection="row" gap={1}>
                <Text color={colors.success}>●</Text>
                <Text>{server.name}</Text>
                <Text color={colors.success}>connected</Text>
                <Text color={colors.dimText}>{server.toolCount} tools</Text>
              </Box>
            );
          }
          if (server.status === 'disconnected') {
            return (
              <Box key={server.name} flexDirection="row" gap={1}>
                <Text color={colors.dimText}>○</Text>
                <Text>{server.name}</Text>
                <Text color={colors.dimText}>disconnected</Text>
              </Box>
            );
          }
          return (
            <Box key={server.name} flexDirection="row" gap={1}>
              <Text color={colors.error}>✗</Text>
              <Text>{server.name}</Text>
              <Text color={colors.error}>error</Text>
            </Box>
          );
        })
      )}
      <Text> </Text>
      <Text color={colors.dimText}>[Esc] Close</Text>
    </Box>
  );
}
