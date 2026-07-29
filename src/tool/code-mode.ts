return yield* Effect.promise(async () => {
  const raw = await input.entry.tool.client.callTool(
    { name: input.entry.tool.def.name, arguments: input.args },
    CallToolResultSchema,
    {
      resetTimeoutOnProgress: true,
      signal: input.ctx.abort,
      timeout: input.entry.tool.timeout,
      onprogress: () => {},
    },
  )
  // Error handling
})