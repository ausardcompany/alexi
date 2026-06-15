import { Event } from "@opencode-ai/core";

export const MyEvent = Event.define({
  type: "my.event",
  schema: {
    data: Schema.Struct({
      message: Schema.String,
    }),
  },
});