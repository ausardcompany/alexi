class GlobToolView extends BaseSearchToolView {
  constructor(tool: Tool, parts: ToolParts, repo?: string) {
    super(tool, parts, repo);
  }

  toolIcon(tool: Tool): Icon {
    return icon(tool);
  }

  toolTitle(tool: Tool): string {
    return 'Glob Tool';
  }

  targets(tool: Tool, repo?: string): string[] {
    return [globDirectory(tool, repo), globPattern(tool)].filter(Boolean);
  }

  viewName(): string {
    return 'GlobToolView';
  }
}
