import { Schema, PositiveInt } from 'some-schema-library';

const providerConfig = {
  chunkTimeout: Schema.optional(Schema.Union([PositiveInt, Schema.Literal(false)])).annotate({
    description:
      'Timeout in milliseconds between streamed SSE chunks for this provider. If no chunk arrives within this window, the request is aborted. Set to false to disable the idle watchdog.',
  }),
};

export default providerConfig;
