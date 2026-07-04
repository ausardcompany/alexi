const resolved = params.path ? PlanFile.resolve(params.path, instance) : undefined;
const target = resolved ?? Session.plan(info, instance);
const file =
  yield * Effect.promise(() => PlanFile.locate(target, messages, info, instance, ctx.agent));
