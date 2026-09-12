/**
 * Tests for the mistake-limit user steering prompt (issue #1692).
 *
 * These tests pin the decision matrix the CLI relies on when the
 * agenticChat loop's LoopDetector / MistakeTracker trips:
 *
 *   yolo=true             -> 'continue' (auto-recover, print notice)
 *   non-TTY / no stdin    -> 'stop'     (explanation to stderr)
 *   quiet + TTY           -> 'stop'     (one-line stderr, no prompt)
 *   TTY (default)         -> prompt "Try a different approach? (y/n)"
 *   abort signal fires    -> 'stop'     (release readline)
 *
 * The actual steering-message injection lives in agenticChat; here we
 * only verify the callback surface.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { EventEmitter } from 'node:events';
import type { Writable } from 'node:stream';
import type { ConsecutiveMistakeReason } from '../../../src/core/agenticChat.js';
import {
  createMistakeLimitPrompt,
  describeReason,
} from '../../../src/cli/utils/mistakeLimitPrompt.js';

/**
 * Minimal writable stream that captures every write for later inspection.
 * readline attaches 'resize' and other listeners to its `output`, so the
 * sink needs to be a real EventEmitter — a bare object with `write` is
 * not sufficient (readline calls `output.on(...)` during construction).
 */
class Sink extends EventEmitter {
  buffer: string[] = [];
  isTTY?: boolean;
  write(chunk: string | Uint8Array): boolean {
    this.buffer.push(typeof chunk === 'string' ? chunk : Buffer.from(chunk).toString('utf8'));
    return true;
  }
  // readline may call `output.end()` on close for terminal streams; a
  // no-op is fine for tests.
  end(): this {
    return this;
  }
}

function makeSink(): Sink {
  return new Sink();
}

/**
 * Fake readline-compatible stdin. `readline.createInterface` only needs
 * `on`/`removeListener` from the input stream to drive its state
 * machine; we push a single line and then emit 'end' so the underlying
 * readline closes deterministically. `isTTY` is set so
 * `createMistakeLimitPrompt` treats the stream as interactive.
 */
class FakeStdin extends EventEmitter {
  isTTY = true;
  readable = true;
  // readline probes for a few common Readable methods; stub them so the
  // interface constructor doesn't throw when we don't provide a real
  // Readable stream implementation.
  setEncoding(): this {
    return this;
  }
  pause(): this {
    return this;
  }
  resume(): this {
    return this;
  }
  push(): boolean {
    return true;
  }
  // readline calls `input.read?.()` opportunistically.
  read(): null {
    return null;
  }
}

/**
 * Helper: build the prompt callback pointed at fake I/O and drive it
 * with a synthesised user answer.
 */
function withFakeIO(opts: {
  answer?: string;
  yolo?: boolean;
  quiet?: boolean;
  isTTY?: boolean;
  signal?: AbortSignal;
}): {
  callback: ReturnType<typeof createMistakeLimitPrompt>;
  stdin: FakeStdin;
  stdout: Sink;
  stderr: Sink;
  respond: (text: string) => void;
} {
  const stdin = new FakeStdin();
  stdin.isTTY = opts.isTTY ?? true;
  const stdout = makeSink();
  stdout.isTTY = opts.isTTY ?? true;
  const stderr = makeSink();

  const callback = createMistakeLimitPrompt({
    yolo: opts.yolo,
    quiet: opts.quiet,
    signal: opts.signal,
    // Casts are safe: readline only touches the subset of the interface
    // that FakeStdin implements.
    stdin: stdin as unknown as NodeJS.ReadableStream & { isTTY?: boolean },
    stdout: stdout as unknown as Writable & { isTTY?: boolean },
    stderr: stderr as unknown as Writable,
    isTTY: opts.isTTY ?? true,
  });

  const respond = (text: string): void => {
    // readline reads by lines; we simulate a line by pushing text plus \n.
    stdin.emit('data', Buffer.from(text + '\n'));
  };

  if (typeof opts.answer === 'string') {
    // Defer the response so the callback has time to attach its
    // 'question' handler before we push data.
    setImmediate(() => respond(opts.answer as string));
  }

  return { callback, stdin, stdout, stderr, respond };
}

const LOOP_REASON: ConsecutiveMistakeReason = {
  kind: 'loop',
  consecutiveCount: 5,
  toolName: 'read',
};
const MISTAKE_REASON: ConsecutiveMistakeReason = {
  kind: 'mistake',
  consecutiveCount: 6,
  toolName: 'bash',
};

describe('describeReason', () => {
  it('formats a loop trip with tool name and count', () => {
    expect(describeReason(LOOP_REASON)).toContain("same tool ('read')");
    expect(describeReason(LOOP_REASON)).toContain('5 times in a row');
    expect(describeReason(LOOP_REASON)).toContain('loop');
  });

  it('formats a mistake trip with failure count and last tool', () => {
    expect(describeReason(MISTAKE_REASON)).toContain('6 consecutive tool failures');
    expect(describeReason(MISTAKE_REASON)).toContain("last: 'bash'");
    expect(describeReason(MISTAKE_REASON)).toContain('flailing');
  });
});

describe('createMistakeLimitPrompt', () => {
  beforeEach(() => {
    vi.useRealTimers();
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('yolo mode', () => {
    it('returns "continue" without prompting', async () => {
      const { callback, stdin, stderr } = withFakeIO({ yolo: true });
      // The prompt must not read from stdin — assert no listeners are
      // attached after resolution.
      const decision = await callback(LOOP_REASON);
      expect(decision).toBe('continue');
      // No 'data' listeners were registered because readline was never
      // created.
      expect(stdin.listenerCount('data')).toBe(0);
      // The user still gets an explanation.
      expect(stderr.buffer.join('')).toContain('Auto-continuing (--yolo)');
    });

    it('respects quiet mode: no output, still continues', async () => {
      const { callback, stderr } = withFakeIO({ yolo: true, quiet: true });
      const decision = await callback(MISTAKE_REASON);
      expect(decision).toBe('continue');
      expect(stderr.buffer.join('')).toBe('');
    });
  });

  describe('non-TTY / headless mode', () => {
    it('returns "stop" and prints an explanation to stderr', async () => {
      const { callback, stderr } = withFakeIO({ isTTY: false });
      const decision = await callback(LOOP_REASON);
      expect(decision).toBe('stop');
      const errText = stderr.buffer.join('');
      expect(errText).toContain('Stopping (non-interactive');
      expect(errText).toContain('--yolo');
      expect(errText).toContain("'read'");
    });
  });

  describe('quiet + TTY', () => {
    it('does not prompt and returns "stop"', async () => {
      const { callback, stdin, stderr } = withFakeIO({ quiet: true, isTTY: true });
      const decision = await callback(LOOP_REASON);
      expect(decision).toBe('stop');
      // No prompt was rendered.
      expect(stdin.listenerCount('data')).toBe(0);
      expect(stderr.buffer.join('')).toContain('Stopping (quiet mode)');
    });
  });

  describe('interactive TTY prompt', () => {
    it('returns "continue" when the user answers "y"', async () => {
      const { callback, stderr } = withFakeIO({ answer: 'y', isTTY: true });
      const decision = await callback(LOOP_REASON);
      expect(decision).toBe('continue');
      expect(stderr.buffer.join('')).toContain('Continuing with steering guidance');
    });

    it('returns "continue" for "yes" / "YES" / " y "', async () => {
      for (const answer of ['yes', 'YES', ' y ']) {
        const { callback } = withFakeIO({ answer, isTTY: true });
        const decision = await callback(LOOP_REASON);
        expect(decision).toBe('continue');
      }
    });

    it('returns "stop" when the user answers "n"', async () => {
      const { callback, stderr } = withFakeIO({ answer: 'n', isTTY: true });
      const decision = await callback(LOOP_REASON);
      expect(decision).toBe('stop');
      expect(stderr.buffer.join('')).toContain('Stopping run');
    });

    it('returns "stop" on empty input (default is safer option)', async () => {
      const { callback } = withFakeIO({ answer: '', isTTY: true });
      const decision = await callback(LOOP_REASON);
      expect(decision).toBe('stop');
    });

    it('returns "stop" on any non-y answer', async () => {
      const { callback } = withFakeIO({ answer: 'quit', isTTY: true });
      const decision = await callback(MISTAKE_REASON);
      expect(decision).toBe('stop');
    });
  });

  describe('abort signal handling', () => {
    it('returns "stop" immediately when signal is already aborted', async () => {
      const controller = new AbortController();
      controller.abort();
      const { callback, stdin } = withFakeIO({
        signal: controller.signal,
        isTTY: true,
      });
      const decision = await callback(LOOP_REASON);
      expect(decision).toBe('stop');
      // The prompt must not have opened readline.
      expect(stdin.listenerCount('data')).toBe(0);
    });

    it('resolves "stop" when the signal aborts mid-prompt', async () => {
      const controller = new AbortController();
      const { callback } = withFakeIO({
        signal: controller.signal,
        isTTY: true,
      });
      // Kick off the prompt without an answer, then abort.
      const p = callback(MISTAKE_REASON);
      // Give the callback a tick to attach its readline handlers.
      await new Promise((resolve) => setImmediate(resolve));
      controller.abort();
      const decision = await p;
      expect(decision).toBe('stop');
    });
  });
});
