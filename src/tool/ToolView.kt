import ai.kilocode.client.session.model.Tool
import ai.kilocode.client.session.ui.selection.SessionSelection
import ai.kilocode.client.session.views.tool.ToolParts
import ai.kilocode.client.ui.provider.UiDataProvider
import ai.kilocode.client.ui.provider.DataSink

class ToolView(
    tool: Tool,
    private val selection: SessionSelection? = null,
    private val parts: ToolParts = toolParts(tool, mode = ToolBodyMode.EDITOR)
) : SecondarySessionPartView(parts.header, { parts.scroll(tool) }), UiDataProvider {

    override fun uiDataSnapshot(sink: DataSink) {
        selection?.provideCopy(sink) { parts.content?.text ?: fallbackText() }
    }

    private fun fallbackText() = listOf("Command text", "Output text").filter { it.isNotBlank() }.joinToString("\n\n")
}
