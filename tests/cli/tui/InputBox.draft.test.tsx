/**
 * Draft persistence tests for InputBox.
 *
 * Covers the TUI side of issue #1949: the InputBox must save in-progress
 * drafts under the current session id, restore them when the sessionId
 * prop changes (session switch), clear them after a successful submit,
 * and persist them on unmount so a later remount (e.g. after a dialog
 * closes) picks them up again.
 *
 * DraftCache's own semantics (empty eviction, promote-on-submit, etc.)
 * are covered by `src/session/__tests__/draft.test.ts`. Here we only
 * exercise the wiring in `src/cli/tui/components/InputBox.tsx`.
 */

import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render } from 'ink-testing-library';

// Mock clipboard & attachments so InputBox mounts without external deps.
vi.mock('../../../src/cli/tui/hooks/useClipboardImage.js', () => ({
  useClipboardImage: vi.fn(),
}));

vi.mock('../../../src/cli/tui/context/AttachmentContext.js', () => ({
  useAttachments: () => ({
    pending: [],
    reading: false,
    error: null,
    pasteFromClipboard: vi.fn(),
    addFromFile: vi.fn(),
    remove: vi.fn(),
    clearAll: vi.fn(),
    consumeAll: vi.fn(),
  }),
}));

import { InputBox, MOUNT_DEBOUNCE_MS } from '../../../src/cli/tui/components/InputBox.js';
import { ThemeProvider } from '../../../src/cli/tui/context/ThemeContext.js';
import { getDraftCache, resetDraftCache } from '../../../src/session/draft.js';

function Wrapper({ children }: { children: React.ReactNode }): React.JSX.Element {
  return <ThemeProvider>{children}</ThemeProvider>;
}

describe('InputBox — draft persistence (issue #1949)', () => {
  const baseProps = {
    agent: 'code',
    agentColor: 'green',
    disabled: false,
    isFocused: true,
    onSubmit: vi.fn(),
  } as const;

  let nowSpy: ReturnType<typeof vi.spyOn> | undefined;
  let currentTime = 0;

  beforeEach(() => {
    resetDraftCache();
    currentTime = 1_000_000;
    nowSpy = vi.spyOn(Date, 'now').mockImplementation(() => currentTime);
  });

  afterEach(() => {
    nowSpy?.mockRestore();
    resetDraftCache();
  });

  it('restores a pre-existing draft when the component mounts with a sessionId', () => {
    const cache = getDraftCache();
    cache.set('s1', 'draft from a previous mount');

    const { lastFrame } = render(
      <Wrapper>
        <InputBox {...baseProps} sessionId="s1" />
      </Wrapper>
    );

    expect(lastFrame()).toContain('draft from a previous mount');
  });

  it('persists the current draft on unmount so a remount restores it', async () => {
    const onSubmit = vi.fn();
    const first = render(
      <Wrapper>
        <InputBox {...baseProps} sessionId="s1" onSubmit={onSubmit} />
      </Wrapper>
    );
    // Advance past the mount-time debounce window and type a draft.
    currentTime += MOUNT_DEBOUNCE_MS + 1;
    first.stdin.write('in-progress text');
    await new Promise((r) => setImmediate(r));

    // DraftCache is written on every keystroke.
    expect(getDraftCache().get('s1')).toBe('in-progress text');

    // Unmount — the cleanup effect must leave the draft in place.
    first.unmount();
    expect(getDraftCache().get('s1')).toBe('in-progress text');

    // A fresh mount for the same session restores the draft.
    const second = render(
      <Wrapper>
        <InputBox {...baseProps} sessionId="s1" onSubmit={onSubmit} />
      </Wrapper>
    );
    expect(second.lastFrame()).toContain('in-progress text');
  });

  it('saves the current draft under the OLD session id and restores NEW session draft on switch', async () => {
    const cache = getDraftCache();
    cache.set('s2', 'session two draft');

    const { stdin, lastFrame, rerender } = render(
      <Wrapper>
        <InputBox {...baseProps} sessionId="s1" />
      </Wrapper>
    );

    // Type a draft under s1 after the debounce window.
    currentTime += MOUNT_DEBOUNCE_MS + 1;
    stdin.write('session one draft');
    await new Promise((r) => setImmediate(r));
    expect(cache.get('s1')).toBe('session one draft');

    // Switch to session s2.
    rerender(
      <Wrapper>
        <InputBox {...baseProps} sessionId="s2" />
      </Wrapper>
    );
    await new Promise((r) => setImmediate(r));

    // s1's draft is preserved, s2's cached draft is now showing.
    expect(cache.get('s1')).toBe('session one draft');
    expect(lastFrame()).toContain('session two draft');

    // Switch back to s1 — the earlier draft reappears.
    rerender(
      <Wrapper>
        <InputBox {...baseProps} sessionId="s1" />
      </Wrapper>
    );
    await new Promise((r) => setImmediate(r));
    expect(lastFrame()).toContain('session one draft');
  });

  it('switching to a session with no cached draft clears the input (no leak across switch)', async () => {
    const { stdin, lastFrame, rerender } = render(
      <Wrapper>
        <InputBox {...baseProps} sessionId="s1" />
      </Wrapper>
    );
    currentTime += MOUNT_DEBOUNCE_MS + 1;
    stdin.write('typed into s1');
    await new Promise((r) => setImmediate(r));

    // Switch to a session that has no cached draft.
    rerender(
      <Wrapper>
        <InputBox {...baseProps} sessionId="brand-new" />
      </Wrapper>
    );
    await new Promise((r) => setImmediate(r));

    // The input is empty; s1's draft is preserved for later.
    const plain = (lastFrame() ?? '').replace(/\u001B\[[0-9;]*m/g, '');
    expect(plain).not.toContain('typed into s1');
    expect(getDraftCache().get('s1')).toBe('typed into s1');
    expect(getDraftCache().get('brand-new')).toBeUndefined();
  });

  it('clears the draft after a successful submit (promote-on-submit)', async () => {
    const onSubmit = vi.fn();
    const { stdin } = render(
      <Wrapper>
        <InputBox {...baseProps} sessionId="s1" onSubmit={onSubmit} />
      </Wrapper>
    );
    currentTime += MOUNT_DEBOUNCE_MS + 1;
    stdin.write('final message');
    await new Promise((r) => setImmediate(r));
    expect(getDraftCache().get('s1')).toBe('final message');

    stdin.write('\r'); // Enter
    await new Promise((r) => setImmediate(r));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith('final message');
    // Draft must be evicted after a successful submit.
    expect(getDraftCache().get('s1')).toBeUndefined();
  });

  it('multiple sessions keep independent drafts', async () => {
    const cache = getDraftCache();

    // Mount under s1 and type.
    const first = render(
      <Wrapper>
        <InputBox {...baseProps} sessionId="s1" />
      </Wrapper>
    );
    currentTime += MOUNT_DEBOUNCE_MS + 1;
    first.stdin.write('alpha');
    await new Promise((r) => setImmediate(r));
    first.unmount();

    // Separately mount under s2 and type.
    const second = render(
      <Wrapper>
        <InputBox {...baseProps} sessionId="s2" />
      </Wrapper>
    );
    currentTime += MOUNT_DEBOUNCE_MS + 1;
    second.stdin.write('beta');
    await new Promise((r) => setImmediate(r));
    second.unmount();

    expect(cache.get('s1')).toBe('alpha');
    expect(cache.get('s2')).toBe('beta');
    expect(cache.get('s1')).not.toBe(cache.get('s2'));
  });

  it('does not interact with the cache when sessionId is omitted', async () => {
    const cache = getDraftCache();
    // Pre-populate an unrelated entry so we can prove no accidental writes.
    cache.set('untouched', 'keep me');

    const { stdin } = render(
      <Wrapper>
        <InputBox {...baseProps} />
      </Wrapper>
    );
    currentTime += MOUNT_DEBOUNCE_MS + 1;
    stdin.write('typing without a session');
    await new Promise((r) => setImmediate(r));

    // The unrelated entry survives and no new entries appear for any other id.
    expect(cache.get('untouched')).toBe('keep me');
    expect(cache.get('')).toBeUndefined();
  });

  it('clearing the input back to empty evicts the cached draft', async () => {
    const cache = getDraftCache();
    const { stdin } = render(
      <Wrapper>
        <InputBox {...baseProps} sessionId="s1" />
      </Wrapper>
    );
    currentTime += MOUNT_DEBOUNCE_MS + 1;
    stdin.write('hi');
    await new Promise((r) => setImmediate(r));
    expect(cache.get('s1')).toBe('hi');

    // Backspace one char at a time until the buffer is empty, flushing
    // React commits between each so the controlled TextInput picks up
    // the shortened value before the next backspace.
    for (let i = 0; i < 4; i++) {
      stdin.write('\u007f');
      await new Promise((r) => setImmediate(r));
    }

    // DraftCache evicts empty / whitespace values automatically.
    expect(cache.get('s1')).toBeUndefined();
  });
});
