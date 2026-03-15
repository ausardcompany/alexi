# Permission Prompt Quick Reference

## Visual Example

```
╭────────────────────────────────────────────────────────────────────╮
│ ✏️  Write Access                                                   │
├────────────────────────────────────────────────────────────────────┤
│ Tool: write                                                        │
│ Resource: /home/user/project/src/index.ts                         │
│                                                                    │
│ Create new TypeScript file                                        │
├────────────────────────────────────────────────────────────────────┤
│ [A]pprove  [D]eny  [R]emember & Approve  [N]ever Ask             │
╰────────────────────────────────────────────────────────────────────╯

Your choice: _
```

## Permission Icons

| Icon | Type | Description |
|------|------|-------------|
| 📖 | Read | Reading files and directories |
| ✏️ | Write | Creating/modifying/deleting files |
| ⚙️ | Execute | Running shell commands |
| 🌐 | Network | Making network requests |
| 🔐 | Admin | System-level operations |

## Response Options

| Key | Action | Effect | Session Memory |
|-----|--------|--------|----------------|
| A | Approve | Grant once | No |
| D | Deny | Deny once | No |
| R | Remember & Approve | Grant and save | Yes |
| N | Never Ask | Deny and save | Yes |

## CLI Commands

```bash
# View all permission rules
/permissions

# Clear session memory
/permissions reset

# View current status
/status

# Show help
/help
```

## Quick Start

### Interactive Mode
```bash
alexi interactive
# Permission prompts appear automatically
```

### Non-Interactive Mode
```bash
alexi chat "your message"
# Uses rule-based decisions only
```

## Default Rules

| Operation | Default | Exceptions |
|-----------|---------|------------|
| Read files | ✅ Allow | ❌ Secrets (.env, credentials) |
| Write files | ❓ Ask | - |
| Execute commands | ❓ Ask | ✅ Safe commands (ls, cat, etc.) |
| Network | ❓ Ask | - |
| Admin | ❓ Ask | ❌ Dangerous commands (rm -rf /) |

## Safe Commands (Pre-Approved)

```
ls    pwd   cat   head  tail
grep  find  wc    file  which  echo
```

## Code Examples

### Start Handler
```typescript
import { startPermissionPromptHandler } from './permission/index.js';

const cleanup = startPermissionPromptHandler();
// ... your code ...
cleanup();
```

### Check TTY Support
```typescript
import { isPermissionPromptSupported } from './permission/index.js';

if (isPermissionPromptSupported()) {
  // Interactive prompts available
}
```

### Use Translations
```typescript
import { t } from './i18n/index.js';

console.log(t('permission.approve'));  // "Approve"
```

### Listen for Events
```typescript
import { PermissionRequested } from './bus/index.js';

const unsub = PermissionRequested.subscribe((req) => {
  console.log(`${req.action} on ${req.resource}`);
});
```

## Troubleshooting

| Problem | Solution |
|---------|----------|
| No prompts appearing | Check TTY: `isPermissionPromptSupported()` |
| Too many prompts | Use "Remember & Approve" (R) |
| Wrong decision saved | Use `/permissions reset` |
| Prompt during script | Expected - use non-interactive mode |

## File Locations

```
src/
├── permission/
│   ├── index.ts         # Core permission system
│   ├── prompt.ts        # NEW: CLI prompt handler
│   └── prompt.test.ts   # NEW: Tests
├── i18n/
│   ├── index.ts         # NEW: i18n system
│   ├── en.ts            # NEW: English translations
│   └── index.test.ts    # NEW: Tests
└── cli/
    └── interactive.ts   # MODIFIED: Integrated prompts

docs/
├── permission-system.md                    # NEW: Full guide
└── migration-guide-permission-prompts.md   # NEW: Developer guide
```

## Key Features

✅ Visual hierarchy with box-drawing  
✅ Action-specific icons  
✅ Keyboard shortcuts  
✅ Session memory  
✅ Color-coded output  
✅ Event-based architecture  
✅ TTY detection  
✅ Graceful cleanup  
✅ Comprehensive tests  
✅ Full documentation  

## Important Notes

- Session memory is **not persistent** (cleared on exit)
- Prompts only work in **interactive TTY** sessions
- Non-interactive mode uses **rule-based decisions**
- External directory access is **disabled by default**
- Doom loop detection prevents **infinite retries**

## Links

- Full Documentation: `docs/permission-system.md`
- Migration Guide: `docs/migration-guide-permission-prompts.md`
- Test Examples: `src/permission/prompt.test.ts`
- Changes Report: `.github/reports/changes-summary.md`

## Version

Added in: **2026-03-15 Update**  
Based on: kilocode commits 4bf437da, 72a2963f, 673ab875
