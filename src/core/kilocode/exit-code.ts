import { constants } from 'node:os';
import * as Effect from 'effect/Effect';
import { ExitCode } from 'effect/unstable/process/ChildProcessSpawner';

export const settle = ([code, signal]: readonly [number | null, NodeJS.Signals | null]) => {
  if (code !== null) return Effect.succeed(ExitCode(code));
  if (signal && signal in constants.signals) {
    return Effect.succeed(ExitCode(128 + constants.signals[signal]));
  }
  return Effect.succeed(ExitCode(1));
};
