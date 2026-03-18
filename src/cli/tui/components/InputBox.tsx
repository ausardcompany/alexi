import React, { useState, useCallback, useRef, useMemo } from 'react';
import { Box, Text, useInput } from 'ink';
import TextInput from 'ink-text-input';

import type { InputBoxProps } from '../types/props.js';
import { fuzzyMatch, completeModelName } from '../../utils/completer.js';
import { useClipboardImage } from '../hooks/useClipboardImage.js';
import { useAttachments } from '../context/AttachmentContext.js';
import { AttachmentBar } from './AttachmentBar.js';

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
const MAX_SUGGESTIONS = 6;

export function InputBox({
  agent,
  agentColor,
  disabled,
  onSubmit,
  isFocused,
  commands = [],
}: InputBoxProps): React.JSX.Element {
  const [value, setValue] = useState('');
  // history[0] = oldest, history[history.length-1] = newest
  const [history, setHistory] = useState<string[]>([]);
  // historyIndex: -1 = current (not in history), >= 0 = navigating history
  const [historyIndex, setHistoryIndex] = useState(-1);
  // Saved current input before we started navigating history
  const savedInputRef = useRef('');
  // Autocomplete selection index (-1 = none selected)
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1);

  // Clipboard image paste (Ctrl+V interception)
  useClipboardImage({ enabled: isFocused && !disabled });
  const { pending, clearAll: clearAttachments } = useAttachments();

  // Autocomplete: compute filtered suggestions when value starts with '/'
  interface Suggestion {
    text: string;
    display: string;
    description: string;
    aliases?: string;
    score: number;
  }

  const suggestions: Suggestion[] = useMemo(() => {
    // Model name completion after /model
    if (value.startsWith('/model ')) {
      const partial = value.slice('/model '.length);
      const result = completeModelName(partial);
      return result.items.slice(0, MAX_SUGGESTIONS).map((item) => ({
        text: `/model ${item.text}`,
        display: item.text,
        description: '',
        score: item.score,
      }));
    }

    // Slash command completion
    if (!value.startsWith('/') || value.includes(' ')) {
      return [];
    }
    const partial = value.slice(1).toLowerCase();
    if (partial.length === 0) {
      // Show all commands when just '/' is typed
      return commands.slice(0, MAX_SUGGESTIONS).map((cmd) => ({
        text: `/${cmd.name} `,
        display: `/${cmd.name}`,
        description: cmd.description,
        aliases: cmd.aliases?.length ? `(${cmd.aliases.join(', ')})` : undefined,
        score: 0,
      }));
    }

    // Fuzzy match commands
    const matches: Suggestion[] = [];
    for (const cmd of commands) {
      const nameResult = fuzzyMatch(partial, cmd.name);
      const aliasResult = cmd.aliases?.map((a) => fuzzyMatch(partial, a)).find((r) => r.match);
      const best = nameResult.match ? nameResult : aliasResult;
      if (best && best.match) {
        matches.push({
          text: `/${cmd.name} `,
          display: `/${cmd.name}`,
          description: cmd.description,
          aliases: cmd.aliases?.length ? `(${cmd.aliases.join(', ')})` : undefined,
          score: best.score,
        });
      }
    }
    matches.sort((a, b) => b.score - a.score);
    return matches.slice(0, MAX_SUGGESTIONS);
  }, [value, commands]);

  // Handle Up/Down arrow keys, Tab for autocomplete, and Escape.
  // useInput fires even when TextInput is focused (we guard with isFocused + !disabled).
  useInput(
    (_input, key) => {
      if (disabled) {
        return;
      }

      // Escape — dismiss autocomplete, or clear attachments
      if (key.escape) {
        if (suggestions.length > 0 && selectedSuggestion >= 0) {
          setSelectedSuggestion(-1);
          return;
        }
        if (pending.length > 0) {
          clearAttachments();
          return;
        }
        return;
      }

      // Tab — autocomplete navigation / acceptance
      if (key.tab && suggestions.length > 0) {
        if (key.shift) {
          // Shift+Tab — move selection up
          setSelectedSuggestion((prev) => (prev <= 0 ? suggestions.length - 1 : prev - 1));
        } else if (selectedSuggestion >= 0) {
          // Tab with active selection — accept the suggestion
          const chosen = suggestions[selectedSuggestion];
          setValue(chosen.text);
          setSelectedSuggestion(-1);
        } else {
          // Tab with no selection — select first
          setSelectedSuggestion(0);
        }
        return;
      }

      if (key.upArrow) {
        // If autocomplete is showing, navigate suggestions
        if (suggestions.length > 0) {
          setSelectedSuggestion((prev) => (prev <= 0 ? suggestions.length - 1 : prev - 1));
          return;
        }
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
        // If autocomplete is showing, navigate suggestions
        if (suggestions.length > 0) {
          setSelectedSuggestion((prev) => (prev >= suggestions.length - 1 ? 0 : prev + 1));
          return;
        }
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
        // Reset autocomplete selection when user types
        setSelectedSuggestion(-1);
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
      // If a suggestion is selected and Enter is pressed, accept the suggestion
      if (selectedSuggestion >= 0 && suggestions.length > 0) {
        const chosen = suggestions[selectedSuggestion];
        setValue(chosen.text);
        setSelectedSuggestion(-1);
        return;
      }

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
      setSelectedSuggestion(-1);
      onSubmit(trimmed);
    },
    [disabled, onSubmit, selectedSuggestion, suggestions]
  );

  if (disabled) {
    return (
      <Box
        flexDirection="column"
        borderTop
        borderStyle="single"
        borderColor="gray"
        borderBottom={false}
        borderLeft={false}
        borderRight={false}
      >
        <AttachmentBar />
        <Box paddingX={1}>
          <Text color={agentColor} bold>
            {agent} ❯{' '}
          </Text>
          <Text dimColor>Streaming...</Text>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      flexDirection="column"
      borderTop
      borderStyle="single"
      borderColor="gray"
      borderBottom={false}
      borderLeft={false}
      borderRight={false}
    >
      <AttachmentBar />
      {/* Autocomplete suggestion list */}
      {suggestions.length > 0 && (
        <Box flexDirection="column" paddingX={1}>
          {suggestions.map((sug, idx) => {
            const isSelected = idx === selectedSuggestion;
            return (
              <Text key={sug.display + idx}>
                <Text color={isSelected ? agentColor : 'gray'} bold={isSelected}>
                  {isSelected ? '❯ ' : '  '}
                </Text>
                <Text color={isSelected ? agentColor : 'white'} bold={isSelected}>
                  {sug.display}
                </Text>
                {sug.aliases && <Text color="gray"> {sug.aliases}</Text>}
                {sug.description && (
                  <Text color="gray" dimColor>
                    {' '}
                    {sug.description}
                  </Text>
                )}
              </Text>
            );
          })}
        </Box>
      )}
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
    </Box>
  );
}
