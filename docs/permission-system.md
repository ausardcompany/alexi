# Permission Prompt System

## Overview

Alexi features an interactive permission system that prompts users before performing sensitive operations. This ensures you maintain control over what the AI can do on your system.

## Permission Types

The system handles five types of permissions:

- **📖 Read Access**: Reading files and directories
- **✏️ Write Access**: Creating, modifying, or deleting files
- **⚙️ Execute Command**: Running shell commands
- **🌐 Network Access**: Making network requests
- **🔐 Administrative Access**: System-level operations

## Interactive Prompt

When Alexi needs permission, you'll see a formatted prompt like this:

```
╭────────────────────────────────────────────────────────────────────╮
│ ✏️  Write Access                                                   │
├────────────────────────────────────────────────────────────────────┤
│ Tool: write                                                        │
│ Resource: /home/user/project/src/index.ts                         │
│                                                                    │
│ Create new file with TypeScript code                              │
├────────────────────────────────────────────────────────────────────┤
│ [A]pprove  [D]eny  [R]emember & Approve  [N]ever Ask             │
╰────────────────────────────────────────────────────────────────────╯

Your choice:
```

## Response Options

You have four choices when prompted:

1. **[A]pprove**: Grant permission for this single operation
2. **[D]eny**: Deny permission for this operation
3. **[R]emember & Approve**: Grant permission and remember for this session
4. **[N]ever Ask**: Deny permission and remember for this session

Simply type the letter (case-insensitive) and press Enter.

## Session Memory

When you choose "Remember" or "Never Ask", your decision is stored for the current session only. This means:

- The same operation won't prompt you again during this session
- Your decision is forgotten when you exit the interactive mode
- You can clear session permissions with `/permissions reset`

## Permission Rules

Alexi uses a rule-based system with sensible defaults:

### Default Rules

1. **Read Access**: Generally allowed for workspace files
2. **Write Access**: Always asks before modifying files
3. **Execute Commands**: Always asks, except for safe read-only commands
4. **Sensitive Files**: Always denied (e.g., `.env`, secrets)
5. **Dangerous Commands**: Always denied (e.g., `rm -rf /`)

### Safe Commands

These read-only commands are pre-approved:
- `ls`, `pwd`, `cat`, `head`, `tail`
- `grep`, `find`, `wc`, `file`, `which`, `echo`

### Viewing Rules

List all permission rules:
```bash
/permissions
```

Reset session permissions:
```bash
/permissions reset
```

## Configuration

### Doom Loop Detection

Alexi detects when the same operation is repeatedly attempted and denied:

- Default: 3 attempts within 60 seconds
- Configurable via the permission manager
- Helps prevent infinite retry loops

### External Directory Control

By default, Alexi only accesses files within your project directory. External access can be enabled if needed.

## Non-Interactive Mode

When running in non-interactive environments (CI, scripts), permission prompts are disabled. The system falls back to the rule-based decisions:

- Allowed operations proceed automatically
- Denied operations fail immediately
- "Ask" operations are denied by default

## API Usage

For programmatic use:

```typescript
import { getPermissionManager, startPermissionPromptHandler } from './permission/index.js';

// Get the permission manager
const manager = getPermissionManager();

// Check a permission
const result = await manager.check({
  toolName: 'write',
  action: 'write',
  resource: '/path/to/file.txt',
  description: 'Write data to file',
});

if (result.granted) {
  // Proceed with operation
}

// Start interactive prompt handler (CLI only)
if (isPermissionPromptSupported()) {
  const cleanup = startPermissionPromptHandler();
  // ... later ...
  cleanup(); // Stop handling prompts
}
```

## Event-Based Architecture

The permission system uses an event bus for loose coupling:

```typescript
import { PermissionRequested, PermissionResponse } from './bus/index.js';

// Listen for permission requests
PermissionRequested.subscribe((request) => {
  console.log(`Permission requested: ${request.action} on ${request.resource}`);
});

// Send permission response
PermissionResponse.publish({
  id: request.id,
  granted: true,
  remember: false,
  timestamp: Date.now(),
});
```

## Best Practices

1. **Review Prompts Carefully**: Always read what permission is being requested
2. **Use "Remember" Wisely**: Only remember permissions you trust
3. **Reset When Needed**: Use `/permissions reset` if you change your mind
4. **Check Rules**: Review `/permissions` to understand what's allowed
5. **Trust but Verify**: Even with permissions, review changes with `/diff`

## Troubleshooting

### Prompts Not Appearing

- Ensure you're in interactive mode (`alexi interactive`)
- Check that your terminal supports TTY (not redirected I/O)
- Verify with `/permissions` that rules aren't auto-allowing

### Permission Denied Unexpectedly

- Check if a rule is denying the operation (`/permissions`)
- Look for doom loop detection (too many retries)
- Verify the file path is within the project directory

### Prompts Appearing Too Often

- Use "Remember & Approve" for trusted operations
- Consider adding custom rules for your workflow
- Check that you're not in a retry loop

## Future Enhancements

Planned improvements include:

- Persistent permission preferences across sessions
- Per-project permission configuration
- Permission audit log
- More granular control over file patterns
- Integration with OS-level permissions

## Related Commands

- `/permissions` - View permission rules
- `/permissions reset` - Clear session grants
- `/config` - View configuration
- `/help` - Full command reference
