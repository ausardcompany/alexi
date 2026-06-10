class ReadToolView extends SecondarySessionPartView {
  constructor(tool: Tool, openFile: (path: string) => void, parts: ToolParts) {
    super(parts.header, parts.scroll(tool), false);
    this.setup(tool, parts, openFile);
  }

  private setup(tool: Tool, parts: ToolParts, openFile: (path: string) => void): void {
    // Setup logic here
  }
}
