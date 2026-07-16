import { sessions, Effect } from 'somewhere';

// logic for checking subagent depth
const parent = yield * sessions.get(ctx.sessionID);

// New code begins
let current = parent;
let depth = 0;
while (current.parentID) {
  depth++;
  current = yield * sessions.get(current.parentID);
}
if (depth >= (cfg.subagent_depth ?? 1)) {
  return (
    yield *
    Effect.fail(
      new Error(
        `Subagent depth limit reached (${cfg.subagent_depth ?? 1}). Increase "subagent_depth" to allow nested subagents.`
      )
    )
  );
}
