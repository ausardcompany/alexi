import React from 'react';
import { Text } from 'ink';
import InkSpinner from 'ink-spinner';

import { useTheme } from '../context/ThemeContext.js';

export interface SpinnerProps {
  /** Label displayed after the spinner */
  label?: string;
  /** Type of spinner animation (defaults to 'dots') */
  type?: Parameters<typeof InkSpinner>[0]['type'];
  /** Override theme color */
  color?: string;
}

export function Spinner({ label, type = 'dots', color }: SpinnerProps): React.JSX.Element {
  const {
    theme: { colors },
  } = useTheme();
  const spinnerColor = color ?? colors.warning;

  return (
    <Text color={spinnerColor}>
      <InkSpinner type={type} />
      {label ? ` ${label}` : ''}
    </Text>
  );
}
