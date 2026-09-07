import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render } from 'ink-testing-library';

import { ControlledTextInput } from '../../../src/cli/tui/components/ControlledTextInput.js';

/**
 * Escape sequences emitted by common terminals for Home / End. Ink's
 * parse-keypress recognises all of these as `key.home` / `key.end`.
 */
const HOME = '\u001B[H';
const END = '\u001B[F';

/**
 * Controlled harness — mirrors how InputBox wires ControlledTextInput.
 * Cursor position is a private state of the component. We observe cursor
 * behaviour indirectly via `onChange`: typing after Home inserts at the
 * beginning; typing after End inserts at the end. This is more robust than
 * scraping ANSI escapes from rendered output, since `chalk` disables colours
 * (level 0) when writing to a non-TTY, making inverse-video escapes invisible
 * in `ink-testing-library` frames.
 */
function Harness({
  initialValue,
  onChange,
}: {
  initialValue: string;
  onChange?: (v: string) => void;
}): React.JSX.Element {
  const [value, setValue] = React.useState(initialValue);
  return (
    <ControlledTextInput
      value={value}
      onChange={(v) => {
        setValue(v);
        onChange?.(v);
      }}
      focus
    />
  );
}

const flush = (): Promise<void> => new Promise((r) => setImmediate(r));

describe('ControlledTextInput', () => {
  it('renders the current value in the output frame', () => {
    const { lastFrame } = render(<Harness initialValue="hello world" />);
    // Strip ANSI just in case (chalk level 0 → plain, but be defensive).
    const plain = (lastFrame() ?? '').replace(/\u001B\[[0-9;]*m/g, '');
    expect(plain).toContain('hello world');
  });

  it('typing at mount appends at the end (cursor starts at end)', async () => {
    const onChange = vi.fn();
    const { stdin } = render(<Harness initialValue="abc" onChange={onChange} />);
    stdin.write('X');
    await flush();
    expect(onChange).toHaveBeenLastCalledWith('abcX');
  });

  it('Home key moves cursor to start — typing then inserts at the beginning', async () => {
    const onChange = vi.fn();
    const { stdin } = render(<Harness initialValue="hello world" onChange={onChange} />);
    stdin.write(HOME);
    await flush();
    stdin.write('X');
    await flush();
    expect(onChange).toHaveBeenLastCalledWith('Xhello world');
  });

  it('End key moves cursor to end — typing then appends', async () => {
    const onChange = vi.fn();
    const { stdin } = render(<Harness initialValue="hello world" onChange={onChange} />);
    // First jump to start so End actually has work to do.
    stdin.write(HOME);
    await flush();
    stdin.write(END);
    await flush();
    stdin.write('Z');
    await flush();
    expect(onChange).toHaveBeenLastCalledWith('hello worldZ');
  });

  it('Home followed by End restores the original insertion point', async () => {
    const onChange = vi.fn();
    const { stdin } = render(<Harness initialValue="abc" onChange={onChange} />);
    stdin.write(HOME);
    await flush();
    stdin.write(END);
    await flush();
    stdin.write('Z');
    await flush();
    expect(onChange).toHaveBeenLastCalledWith('abcZ');
  });

  it('Home on empty value is a safe no-op (does not corrupt or throw)', async () => {
    const onChange = vi.fn();
    const { stdin, lastFrame } = render(<Harness initialValue="" onChange={onChange} />);
    stdin.write(HOME);
    await flush();
    stdin.write(END);
    await flush();
    // No spurious value updates from Home/End on empty.
    expect(onChange).not.toHaveBeenCalled();
    // Component still renders.
    expect(lastFrame()).toBeDefined();
  });

  it('does not consume Up/Down arrows (they bubble to parent useInput)', async () => {
    // If ControlledTextInput accidentally consumed arrows it would insert
    // escape sequences into value. Verify that onChange is NOT called.
    const onChange = vi.fn();
    const { stdin } = render(<Harness initialValue="hi" onChange={onChange} />);
    stdin.write('\u001B[A'); // up arrow
    await flush();
    stdin.write('\u001B[B'); // down arrow
    await flush();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('left arrow moves cursor back — next typed char inserts before last', async () => {
    const onChange = vi.fn();
    const { stdin } = render(<Harness initialValue="abc" onChange={onChange} />);
    stdin.write('\u001B[D'); // left
    await flush();
    stdin.write('X');
    await flush();
    expect(onChange).toHaveBeenLastCalledWith('abXc');
  });

  it('right arrow after left returns cursor to end', async () => {
    const onChange = vi.fn();
    const { stdin } = render(<Harness initialValue="abc" onChange={onChange} />);
    stdin.write('\u001B[D'); // left → cursor at 2
    await flush();
    stdin.write('\u001B[C'); // right → cursor at 3
    await flush();
    stdin.write('X');
    await flush();
    expect(onChange).toHaveBeenLastCalledWith('abcX');
  });

  it('backspace deletes char before cursor', async () => {
    const onChange = vi.fn();
    const { stdin } = render(<Harness initialValue="abc" onChange={onChange} />);
    stdin.write('\u007F'); // backspace
    await flush();
    expect(onChange).toHaveBeenLastCalledWith('ab');
  });

  it('Home then backspace is a no-op (nothing before start of line)', async () => {
    const onChange = vi.fn();
    const { stdin } = render(<Harness initialValue="abc" onChange={onChange} />);
    stdin.write(HOME);
    await flush();
    stdin.write('\u007F'); // backspace
    await flush();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('Enter triggers onSubmit with current value', async () => {
    const onSubmit = vi.fn();
    function Local(): React.JSX.Element {
      const [v, setV] = React.useState('greetings');
      return <ControlledTextInput value={v} onChange={setV} onSubmit={onSubmit} focus />;
    }
    const { stdin } = render(<Local />);
    stdin.write('\r');
    await flush();
    expect(onSubmit).toHaveBeenCalledWith('greetings');
  });

  it('renders placeholder when value is empty', () => {
    function Local(): React.JSX.Element {
      return <ControlledTextInput value="" onChange={() => {}} focus placeholder="type here" />;
    }
    const { lastFrame } = render(<Local />);
    const plain = (lastFrame() ?? '').replace(/\u001B\[[0-9;]*m/g, '');
    expect(plain).toContain('type here');
  });
});
