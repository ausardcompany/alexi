/**
 * PTY output/exit latch.
 *
 * Ports upstream kilocode `203f19f5d` (fix(cli): keep PTY output and
 * exit emitted before listeners attach).
 *
 * The problem: `node-pty` (and analogous PTY libraries) may emit
 * `data` and `exit` events synchronously inside `spawn()` — for very
 * short-lived processes (e.g. `printf hello`) the child can exit
 * before the caller has had a chance to attach `.onData` / `.onExit`
 * listeners. Those events are then lost forever, causing the calling
 * agent code to hang waiting for output that already fired.
 *
 * The fix: an in-memory latch that buffers emissions until a listener
 * attaches, then flushes the buffer to the listener in order. Once a
 * listener detaches, further emissions are buffered again — so the
 * pattern is safe against "detach + late reattach" too.
 *
 * Alexi does NOT ship a native PTY driver today, but the latch itself
 * is dependency-free and can be reused wherever a short-lived event
 * source races with async listener attachment (e.g. subprocess bash
 * tool wrappers).
 */

export interface PtyLatch<T> {
  /**
   * Emit a value. If a listener is currently attached, the value is
   * delivered synchronously. Otherwise the value is buffered in FIFO
   * order and delivered on the next `attach()`.
   */
  emit(value: T): void;
  /**
   * Attach a listener. Any buffered values are flushed to it
   * synchronously in emission order before this call returns.
   * Returns a detach function that, when called, clears the current
   * listener so subsequent emissions buffer again.
   */
  attach(listener: (value: T) => void): () => void;
}

/**
 * Create a new latch. Values MUST be strictly ordered by emission —
 * the buffer is a plain array flushed head-first.
 */
export function createPtyLatch<T>(): PtyLatch<T> {
  const buffered: T[] = [];
  let listener: ((value: T) => void) | undefined;

  return {
    emit(value: T) {
      if (listener) {
        listener(value);
      } else {
        buffered.push(value);
      }
    },
    attach(next: (value: T) => void) {
      listener = next;
      // Drain synchronously so ordering with respect to future emits
      // is preserved. If the flush itself detaches (listener re-assigns
      // to undefined mid-loop), stop early — remaining buffered values
      // stay for the next attach.
      while (buffered.length > 0 && listener === next) {
        const value = buffered.shift() as T;
        next(value);
      }
      return () => {
        if (listener === next) {
          listener = undefined;
        }
      };
    },
  };
}
