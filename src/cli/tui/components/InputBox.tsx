import React, { useState, useCallback, useRef } from 'react';
import { Box, Text, useInput } from 'ink';
import TextInput from 'ink-text-input';

import type { InputBoxProps } from '../types/props.js';

export type { InputBoxProps };

/**
 * InputBox — fixed input area at the bottom of the TUI layout.
 *
 * Rendering:
 *   agent ❯ <cursor>
 *
 * Supports:
 * - Enter: submit + clear
 * - Up arrow: navigate history backwards (older entries)
 * - Down arrow: navigate history forwards (newer entries / back to current)
 * - Disabled state during streaming
 */
export function InputBox({
  agent,
  agentColor,
  disabled,
  onSubmit,
  isFocused,
}: InputBoxProps): React.JSX.Element {
  const [value, setValue] = useState('');
  // history[0] = oldest, history[history.length-1] = newest
  const [history, setHistory] = useState<string[]>([]);
  // historyIndex: -1 = current (not in history), >= 0 = navigating history
  const [historyIndex, setHistoryIndex] = useState(-1);
  // Saved current input before we started navigating history
  const savedInputRef = useRef('');

  // Handle Up/Down arrow keys for history navigation.
  // useInput fires even when TextInput is focused (we guard with isFocused + !disabled).
  useInput(
    (_input, key) => {
      if (disabled) {
        return;
      }
      if (key.upArrow) {
        if (history.length === 0) {
          return;
        }
        if (historyIndex === -1) {
          savedInputRef.current = value;
          const newIdx = history.length - 1;
          setHistoryIndex(newIdx);
          setValue(history[newIdx]);
        } else if (historyIndex > 0) {
          const newIdx = historyIndex - 1;
          setHistoryIndex(newIdx);
          setValue(history[newIdx]);
        }
        // At oldest entry — stay
      } else if (key.downArrow) {
        if (historyIndex === -1) {
          return;
        }
        if (historyIndex < history.length - 1) {
          const newIdx = historyIndex + 1;
          setHistoryIndex(newIdx);
          setValue(history[newIdx]);
        } else {
          // Past newest — restore saved input
          setHistoryIndex(-1);
          setValue(savedInputRef.current);
        }
      }
    },
    { isActive: isFocused && !disabled }
  );

  const handleChange = useCallback(
    (val: string) => {
      if (!disabled) {
        setValue(val);
        // Typing while in history navigation resets the navigation index
        if (historyIndex !== -1) {
          setHistoryIndex(-1);
          savedInputRef.current = '';
        }
      }
    },
    [disabled, historyIndex]
  );

  const handleSubmit = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || disabled) {
        return;
      }
      // Push to history (skip consecutive identical entries)
      setHistory((prev) => {
        if (prev.length > 0 && prev[prev.length - 1] === trimmed) {
          return prev;
        }
        return [...prev, trimmed];
      });
      setHistoryIndex(-1);
      savedInputRef.current = '';
      setValue('');
      onSubmit(trimmed);
    },
    [disabled, onSubmit]
  );

  if (disabled) {
    return (
      <Box paddingX={1}>
        <Text color={agentColor} bold>
          {agent} ❯{' '}
        </Text>
        <Text dimColor>Streaming...</Text>
      </Box>
    );
  }

  return (
    <Box paddingX={1}>
      <Text color={agentColor} bold>
        {agent} ❯{' '}
      </Text>
      <TextInput
        value={value}
        onChange={handleChange}
        onSubmit={handleSubmit}
        focus={isFocused}
        placeholder="Type a message or /command"
      />
    </Box>
  );
}
