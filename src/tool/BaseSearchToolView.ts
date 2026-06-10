import { Tool, ToolParts, SecondarySessionPartView } from '../models';

abstract class BaseSearchToolView extends SecondarySessionPartView {
  constructor(tool: Tool, parts: ToolParts, repo?: string) {
    super(parts.header, parts.scroll(tool));
    this.initialize(tool, parts, repo);
  }

  private initialize(tool: Tool, parts: ToolParts, repo?: string): void {
    // Initialization logic here
  }
  
  abstract toolIcon(tool: Tool): Icon;
  abstract toolTitle(tool: Tool): string;
  abstract targets(tool: Tool, repo?: string): string[];
  abstract viewName(): string;
}
