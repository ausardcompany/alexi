import { heredocs } from "@/tool/shell-heredoc" // kilocode_change

const ask = Effect.fn("ShellTool.ask")(function* (
  ctx: Tool.Context,
  scan: Scan,
  command: string,
  metadata: ReturnType<typeof heredocs>, // kilocode_change
  description?: string,
) {
  yield* ctx.log("ShellTool.ask", {
    permission: ShellID.ToolID,
    patterns: Array.from(scan.patterns),
    always: Array.from(scan.always),
    metadata: { command: normalizeUrls(command), ...(description ? { description } : {}), ...metadata }, // kilocode_change
  })
})

export const ShellPermission = Effect.gen(function* () {
  yield* Effect.gen(function* () {
    const tree = yield* Effect.acquireRelease(parse(input.command, ps), (tree) => Effect.sync(() => tree.delete()))
    const scan = yield* collect(tree.rootNode, input.cwd, ps, input.shell, instance)
    const metadata = heredocs(tree.rootNode, ShellID.toKind(Shell.name(input.shell))) // kilocode_change
    if (!containsPath(input.cwd, instance)) {
      scan.dirs.add(input.cwd)
      scan.access = "unknown"
    }
    yield* ask(ctx, scan, input.command, metadata, input.description) // kilocode_change
  })
})