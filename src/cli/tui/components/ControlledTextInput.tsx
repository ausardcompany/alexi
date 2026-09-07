import React, { useState, useEffect } from 'react';
import { Text, useInput } from 'ink';
import chalk from 'chalk';

// `chalk` is a direct dependency of `ink` (which is a direct dependency here),
// so it is guaranteed to be resolvable. Using it (rather than raw ANSI escape
// codes) matters because chalk auto-detects terminal capability and produces
// plain text when writing to a non-TTY — which keeps rendered output stable
// in tests using `ink-testing-library`, matching the behaviour of upstream
// `ink-text-input` v6.
const inverse = (s: string): string => chalk.inverse(s);
const grey = (s: string): string => chalk.grey(s);

/**
 * ControlledTextInput — a small fork of `ink-text-input` (v6.0.0) that adds
 * explicit Home/End keyboard navigation.
 *
 * Why fork:
 *   `ink-text-input` v6 owns its own cursor position as internal state with no
 *   public setter, so a parent's `useInput` handler cannot move the cursor.
 *   Home/End keypresses are parsed by Ink into `key.home` / `key.end` with
 *   `input === ''`; the upstream component swallows them harmlessly but does
 *   NOT move the cursor. Kilocode PR #13855 solved the same problem in their
 *   CLI by handling the keys inside the input component; we do the same here.
 *
 * Behaviour parity with `ink-text-input`:
 *   - Left/Right arrow → move cursor by one
 *   - Backspace/Delete → delete char before cursor
 *   - Enter → onSubmit(currentValue)
 *   - Up/Down/Tab/Ctrl-C are ignored (bubble up to the parent's useInput)
 *   - Typed characters insert at cursor
 *   - Paste (multi-char input) inserts at cursor and advances cursor by
 *     the pasted length
 *
 * Added:
 *   - Home → cursor to start (offset 0)
 *   - End  → cursor to end (offset value.length)
 */
export interface ControlledTextInputProps {
  /** Text to display when `value` is empty. */
  readonly placeholder?: string;
  /**
   * Listen to user's input. Useful in case there are multiple input components
   * at the same time and input must be "routed" to a specific component.
   */
  readonly focus?: boolean;
  /** Replace all chars and mask the value. */
  readonly mask?: string;
  /** Whether to show cursor and allow navigation inside text input. */
  readonly showCursor?: boolean;
  /** Highlight pasted text. */
  readonly highlightPastedText?: boolean;
  /** Current value. */
  readonly value: string;
  /** Called when value updates. */
  readonly onChange: (value: string) => void;
  /** Called when Enter is pressed. */
  readonly onSubmit?: (value: string) => void;
}

export function ControlledTextInput({
  value: originalValue,
  placeholder = '',
  focus = true,
  mask,
  highlightPastedText = false,
  showCursor = true,
  onChange,
  onSubmit,
}: ControlledTextInputProps): React.JSX.Element {
  const [state, setState] = useState({
    cursorOffset: (originalValue || '').length,
    cursorWidth: 0,
  });
  const { cursorOffset, cursorWidth } = state;

  useEffect(() => {
    setState((previousState) => {
      if (!focus || !showCursor) {
        return previousState;
      }
      const newValue = originalValue || '';
      if (previousState.cursorOffset > newValue.length - 1) {
        return {
          cursorOffset: newValue.length,
          cursorWidth: 0,
        };
      }
      return previousState;
    });
  }, [originalValue, focus, showCursor]);

  const cursorActualWidth = highlightPastedText ? cursorWidth : 0;
  const value = mask ? mask.repeat(originalValue.length) : originalValue;
  let renderedValue = value;
  let renderedPlaceholder = placeholder ? grey(placeholder) : undefined;

  // Fake mouse cursor — parity with ink-text-input rendering.
  if (showCursor && focus) {
    renderedPlaceholder =
      placeholder.length > 0 ? inverse(placeholder[0]) + grey(placeholder.slice(1)) : inverse(' ');
    renderedValue = value.length > 0 ? '' : inverse(' ');
    let i = 0;
    for (const char of value) {
      renderedValue +=
        i >= cursorOffset - cursorActualWidth && i <= cursorOffset ? inverse(char) : char;
      i++;
    }
    if (value.length > 0 && cursorOffset === value.length) {
      renderedValue += inverse(' ');
    }
  }

  useInput(
    (input, key) => {
      // Keys we intentionally do not handle here — let the parent's useInput
      // process them (history navigation, autocomplete, Ctrl+C exit, etc.).
      if (
        key.upArrow ||
        key.downArrow ||
        (key.ctrl && input === 'c') ||
        key.tab ||
        (key.shift && key.tab)
      ) {
        return;
      }

      if (key.return) {
        if (onSubmit) {
          onSubmit(originalValue);
        }
        return;
      }

      // Home / End — jump cursor to line boundaries. This is the whole point
      // of this fork (see file header).
      if (key.home) {
        if (showCursor) {
          setState({ cursorOffset: 0, cursorWidth: 0 });
        }
        return;
      }
      if (key.end) {
        if (showCursor) {
          setState({ cursorOffset: originalValue.length, cursorWidth: 0 });
        }
        return;
      }

      let nextCursorOffset = cursorOffset;
      let nextValue = originalValue;
      let nextCursorWidth = 0;

      if (key.leftArrow) {
        if (showCursor) {
          nextCursorOffset--;
        }
      } else if (key.rightArrow) {
        if (showCursor) {
          nextCursorOffset++;
        }
      } else if (key.backspace || key.delete) {
        if (cursorOffset > 0) {
          nextValue =
            originalValue.slice(0, cursorOffset - 1) +
            originalValue.slice(cursorOffset, originalValue.length);
          nextCursorOffset--;
        }
      } else {
        nextValue =
          originalValue.slice(0, cursorOffset) +
          input +
          originalValue.slice(cursorOffset, originalValue.length);
        nextCursorOffset += input.length;
        if (input.length > 1) {
          nextCursorWidth = input.length;
        }
      }

      if (nextCursorOffset < 0) {
        nextCursorOffset = 0;
      }
      if (nextCursorOffset > nextValue.length) {
        nextCursorOffset = nextValue.length;
      }

      setState({
        cursorOffset: nextCursorOffset,
        cursorWidth: nextCursorWidth,
      });

      if (nextValue !== originalValue) {
        onChange(nextValue);
      }
    },
    { isActive: focus }
  );

  return (
    <Text>
      {placeholder ? (value.length > 0 ? renderedValue : renderedPlaceholder) : renderedValue}
    </Text>
  );
}

export default ControlledTextInput;
