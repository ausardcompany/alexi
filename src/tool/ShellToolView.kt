package ai.kilocode.client.session.views.tool

import ai.kilocode.client.plugin.KiloBundle
import ai.kilocode.client.session.model.Tool
import ai.kilocode.client.session.ui.selection.SessionSelection
import ai.kilocode.client.ui.md.MdTerminal
import javax.swing.JPanel

class ShellToolView(
    tool: Tool,
    private val selection: SessionSelection? = null,
) : SecondarySessionPartView(tool.id, { JPanel() }), UiDataProvider {

    override fun uiDataSnapshot(sink: DataSink) {
        selection?.provideCopy(sink) { "Markdown content" ?: fallbackText() }
    }

    private fun fallbackText() = "Fallback content"
}

    init {
        // Initialization code here
    }
}
