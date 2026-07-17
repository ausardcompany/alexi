if (ctx.extra?.["denyDirectory"] === true) {
    const resolved2 = yield* fs.realPath(requested)
    const target2 = process.platform === "win32" ? FSUtil.normalizePath(resolved2) : resolved2
    if (target2 !== target) {
        return yield* Effect.fail(new Error(`Directory attachments cannot be expanded: ${requested}`))
    }
}
