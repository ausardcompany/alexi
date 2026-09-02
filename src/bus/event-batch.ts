/**
 * Batched event publish primitive.
 *
 * Ported from upstream kilocode `packages/core/src/kilocode/event-batch.ts`,
 * adapted to Alexi's synchronous Zod-backed event bus. Upstream chunks
 * entries, writes them in a single DB transaction, maintains per-aggregate
 * sequences, and notifies subscribers after commit. Alexi's bus is
 * in-memory (no durable event store yet), so the batched contract we can
 * usefully replicate today is:
 *
 *   1. Validate every payload up-front (fail-fast, no partial publish).
 *   2. Fan out to subscribers in publication order, using a snapshot of
 *      the handler set per event so mid-iteration unsubscribes are safe.
 *
 * The actual implementation lives alongside the bus (`./index.ts`) so it
 * can share the internal `eventHandlers` registry without exposing it.
 * This file re-exports the API surface under a stable name that mirrors
 * the upstream module path, so future ports of session-drain / headless
 * flush code can `import { EventBatch } from '../bus/event-batch.js'`
 * with minimal churn.
 *
 * @see src/bus/index.ts - `publishAll` / `publishAllAsync` implementation
 * @see packages/core/src/kilocode/event-batch.ts - upstream reference
 */

import { publishAll, publishAllAsync, type BatchEntry } from './index.js';

/**
 * Namespace mirroring the upstream module shape so ported call sites
 * (`EventBatch.publishAll(...)`, `EventBatch.publishAllAsync(...)`)
 * work verbatim against Alexi's bus.
 */
export const EventBatch = {
  publishAll,
  publishAllAsync,
} as const;

export type { BatchEntry };
