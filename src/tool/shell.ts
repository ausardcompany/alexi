import { unparsed } from '@/tool/shell-unparsed'; // Import unparsed command handler

// logic to handle unparsed commands
const lost = unparsed(root, nodes.length);
if (lost.length > 0) scan.access = 'unknown';
for (const pattern of lost) {
  scan.patterns.add(pattern);
}
