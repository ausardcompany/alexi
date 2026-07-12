class TaskToolView(
    tool: Tool,
    private val selection: SessionSelection? = null,
    private val parts: ToolParts = toolParts(tool),
) : SecondarySessionPartView(parts.header, { TaskBody(parts.glyph).scroll }), UiDataProvider {
    // Implementation details
}
