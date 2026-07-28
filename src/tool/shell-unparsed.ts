import type { Node } from 'web-tree-sitter';

export function unparsed(root: Node, commands: number): string[] {
  if (!root.hasError && commands > 0) return [];
  const failed = root
    .descendantsOfType('ERROR')
    .filter((node): node is Node => Boolean(node))
    .filter((node) => node.descendantsOfType('command_name').length > 0)
    .map((node) => node.text.trim())
    .filter((text) => text.length > 0);
  if (failed.length > 0) return failed;
  const raw = root.text.trim();
  return raw ? [raw] : [];
}
