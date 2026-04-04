/**
 * Heap Snapshot Utilities
 * Enables debugging of memory issues in long-running CLI processes
 */

import * as v8 from 'v8';
import * as fs from 'fs';
import * as path from 'path';
import { getLogger } from '../log/index.js';

const log = getLogger();

const HEAP_THRESHOLD_MB = 1024; // 1GB threshold
const SNAPSHOT_DIR = '.alexi/heap-snapshots';
const MIN_SNAPSHOT_INTERVAL_MS = 60000; // 1 minute between snapshots

let lastSnapshotTime = 0;

export function checkAndSnapshot(): void {
  const heapUsed = process.memoryUsage().heapUsed;
  const heapUsedMB = heapUsed / 1024 / 1024;

  if (heapUsedMB < HEAP_THRESHOLD_MB) {
    return;
  }

  const now = Date.now();
  if (now - lastSnapshotTime < MIN_SNAPSHOT_INTERVAL_MS) {
    return;
  }

  lastSnapshotTime = now;

  try {
    if (!fs.existsSync(SNAPSHOT_DIR)) {
      fs.mkdirSync(SNAPSHOT_DIR, { recursive: true });
    }

    const filename = `heap-${Date.now()}.heapsnapshot`;
    const filepath = path.join(SNAPSHOT_DIR, filename);

    v8.writeHeapSnapshot(filepath);
    log.info('system', `Heap snapshot written to ${filepath} (heap: ${heapUsedMB.toFixed(2)}MB)`);
  } catch (err) {
    log.error('system', 'Failed to write heap snapshot', {
      error: err instanceof Error ? err.message : String(err),
    });
  }
}

export function startHeapMonitoring(intervalMs: number = 30000): NodeJS.Timeout {
  return setInterval(checkAndSnapshot, intervalMs);
}
