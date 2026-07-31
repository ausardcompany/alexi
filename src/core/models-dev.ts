import { Flock } from 'flock';
import { Effect } from 'effect';

/**
 * Fetch model data from network or cache.
 * New logic prevents duplicate fetches by re-reading cache under lock.
 */

export const fetchModelData = async (lockKey: string) => {
  return await Effect.scoped(
    Effect.gen(function* () {
      yield* Flock.effect(lockKey);
      const rechecked = yield* loadFromDisk();
      if (rechecked) return rechecked;
      const text = yield* fetchAndWrite();
      return JSON.parse(text) as Record<string, Provider>;
    })
  );
};
