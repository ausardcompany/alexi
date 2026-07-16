import { Schema, Tool, ToolJsonSchema } from 'somewhere';

// existing parameters definition
const Params = Schema.Union([StartParams, ListParams, PromptParams]);

// New code begins
const WireParams = Schema.Struct({
  mode: Schema.optional(StartParams.fields.mode),
  versions: Schema.optional(StartParams.fields.versions),
  tasks: Schema.optional(StartParams.fields.tasks),
  action: Schema.optional(Schema.Literals(['list', 'prompt'])),
  filter: Schema.optional(ListParams.fields.filter),
  sessionID: Schema.optional(PromptParams.fields.sessionID),
  prompt: Schema.optional(PromptParams.fields.prompt),
});

export const AgentManagerTool = Tool.define({
  parameters: Params,
  jsonSchema: ToolJsonSchema.fromSchema(WireParams),
  // other configurations
});
