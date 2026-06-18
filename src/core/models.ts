import { Schema } from 'some-schema-library';

export const Provider = Schema.Struct({
  api: Schema.optional(Schema.String),
  name: Schema.String,
  description: Schema.optional(Schema.String), // kilocode_change
  env: Schema.Array(Schema.String),
  id: Schema.String,
  npm: Schema.optional(Schema.String),
});
