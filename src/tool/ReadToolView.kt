class ReadToolView(
    tool: Tool,
    openFile: SessionFileOpener = { _, _ -> },
    private val selection: SessionSelection? = null,
    private val parts: ToolParts = toolParts(tool, openFile),
) : SecondarySessionPartView(parts.header, parts.scroll(tool), expandable = false) {
}
