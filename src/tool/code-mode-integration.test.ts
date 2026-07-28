const server = new Server({ name: SERVER, version: "1.0.0" }, { capabilities: { tools: {} } })
server.setRequestHandler("tools/list", async () => ({ tools: TOOL_DEFS }))
server.setRequestHandler("tools/call", async (req) =>
  handleCall(req.params.name, (req.params.arguments ?? {}) as Record<string, unknown>),
)