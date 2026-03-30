# Quick Reference: New Features & APIs

## Config Protection API

### Import
```typescript
import { ConfigProtection } from './permission/config-paths.js';
```

### Check if a path is a config file
```typescript
// Check relative path
if (ConfigProtection.isRelative('.alexi/config.json')) {
  // This is a config file
}

// Check absolute path (global config)
if (ConfigProtection.isGlobalConfigDir('/Users/john/.alexi/config.json')) {
  // This is in global config directory
}

// Check permission request
if (ConfigProtection.isRequest({ patterns: ['.alexi/rules.json'] })) {
  // This request involves config files
}
```

### Use metadata flag
```typescript
const metadata = {
  [ConfigProtection.DISABLE_ALWAYS_KEY]: true, // 'disableAlways'
};
```

## Shell Utilities API

### Import
```typescript
import { Shell } from './shell/shell.js';
```

### Detect default shell
```typescript
const shell = Shell.getDefaultShell();
// Windows: C:\Program Files\PowerShell\7\pwsh.exe or cmd.exe
// Unix: /bin/bash or $SHELL
```

### Get shell arguments
```typescript
const args = Shell.getShellArgs('pwsh.exe');
// Returns: ['-NoProfile', '-NonInteractive', '-Command']

const args = Shell.getShellArgs('cmd.exe');
// Returns: ['/c']

const args = Shell.getShellArgs('/bin/bash');
// Returns: ['-c']
```

### Find PowerShell
```typescript
const pwsh = Shell.findPowerShell();
// Returns: 'C:\\Program Files\\PowerShell\\7\\pwsh.exe' or undefined
```

## Built-in Skills API

### Import
```typescript
import { BuiltinSkills } from './skill/builtin.js';
```

### Get a built-in skill
```typescript
const skill = BuiltinSkills.get('alexi-config');
// Returns: Skill object or undefined
```

### List all built-in skills
```typescript
const skills = BuiltinSkills.list();
// Returns: Array of Skill objects
```

### Check if location is built-in
```typescript
if (BuiltinSkills.isBuiltin('__builtin__')) {
  // This is a built-in skill
}
```

### Access built-in skill directly
```typescript
const configSkill = BuiltinSkills.ALEXI_CONFIG;
console.log(configSkill.name); // 'alexi-config'
console.log(configSkill.prompt); // Configuration reference content
```

## Using in Tools

### Example: Check config file in a tool
```typescript
import { defineTool } from '../index.js';
import { ConfigProtection } from '../../permission/config-paths.js';

export const myTool = defineTool({
  name: 'my-tool',
  // ...
  async execute(params, context) {
    if (ConfigProtection.isRelative(params.filePath)) {
      // Handle config file specially
      return {
        success: false,
        error: 'Cannot modify config files with this tool',
      };
    }
    // Normal processing
  },
});
```

### Example: Use Shell utility in bash tool
```typescript
import { Shell } from '../../shell/shell.js';
import { spawn } from 'child_process';

const shell = Shell.getDefaultShell();
const shellArgs = Shell.getShellArgs(shell);

const proc = spawn(shell, [...shellArgs, command], {
  cwd: workdir,
  // ...
});
```

## Permission Events

### Listen for config file permission requests
```typescript
import { PermissionRequested } from '../bus/index.js';
import { ConfigProtection } from '../permission/config-paths.js';

PermissionRequested.subscribe((event) => {
  if (event.metadata?.[ConfigProtection.DISABLE_ALWAYS_KEY]) {
    // This is a config file - hide "always allow" option
    console.log('Config file edit requested:', event.resource);
  }
});
```

## Testing

### Test config protection
```typescript
import { ConfigProtection } from '../config-paths.js';

describe('my feature', () => {
  it('should protect config files', () => {
    expect(ConfigProtection.isRelative('.alexi/config.json')).toBe(true);
  });
});
```

### Mock shell detection
```typescript
import { Shell } from '../shell.js';
import { vi } from 'vitest';

describe('my feature', () => {
  it('should use correct shell', () => {
    const spy = vi.spyOn(Shell, 'getDefaultShell');
    spy.mockReturnValue('/bin/bash');
    
    // Test code
    
    spy.mockRestore();
  });
});
```

## Common Patterns

### Pattern: Protect config in write operations
```typescript
async execute(params, context) {
  // Check before writing
  if (ConfigProtection.isRelative(params.filePath)) {
    // Will trigger permission prompt with disableAlways flag
  }
  
  // Proceed with write
}
```

### Pattern: Cross-platform command execution
```typescript
const shell = Shell.getDefaultShell();
const shellArgs = Shell.getShellArgs(shell);

// Windows: pwsh.exe -NoProfile -NonInteractive -Command "dir"
// Unix: /bin/bash -c "ls"
const proc = spawn(shell, [...shellArgs, command]);
```

### Pattern: Register custom built-in skill
```typescript
// In builtin.ts
export const MY_SKILL: Skill = {
  id: 'my-skill',
  name: 'my-skill',
  description: 'My custom skill',
  prompt: 'Skill content here',
  source: 'builtin',
  sourcePath: BUILTIN_LOCATION,
};

export const ALL = [ALEXI_CONFIG, MY_SKILL] as const;
```

## Configuration

### Protect custom config paths
Edit `src/permission/config-paths.ts`:
```typescript
const CONFIG_DIRS = [
  '.alexi/',
  '.kilocode/',
  '.opencode/',
  '.myapp/', // Add custom config directory
];

const CONFIG_ROOT_FILES = new Set([
  'alexi.json',
  'myapp.json', // Add custom config file
]);
```

### Add custom shell paths
Edit `src/shell/shell.ts`:
```typescript
export function findPowerShell(): string | undefined {
  const pwshPaths = [
    'C:\\Program Files\\PowerShell\\7\\pwsh.exe',
    'C:\\CustomPath\\pwsh.exe', // Add custom path
  ];
  // ...
}
```

## Debugging

### Enable config protection logging
```typescript
import { ConfigProtection } from './permission/config-paths.js';

// Add logging to isRelative
const isConfig = ConfigProtection.isRelative(path);
console.log(`Path ${path} is config:`, isConfig);
```

### Debug shell detection
```typescript
import { Shell } from './shell/shell.js';

console.log('Platform:', process.platform);
console.log('Default shell:', Shell.getDefaultShell());
console.log('PowerShell:', Shell.findPowerShell());
```

## Migration Guide

### If you have custom permission checks
Before:
```typescript
if (path.includes('.alexi/')) {
  // Custom check
}
```

After:
```typescript
import { ConfigProtection } from './permission/config-paths.js';

if (ConfigProtection.isRelative(path)) {
  // Use standard check
}
```

### If you spawn processes directly
Before:
```typescript
spawn(command, { shell: true });
```

After:
```typescript
import { Shell } from './shell/shell.js';

const shell = Shell.getDefaultShell();
const shellArgs = Shell.getShellArgs(shell);
spawn(shell, [...shellArgs, command]);
```

## Troubleshooting

### Config files not being protected
1. Check path normalization (use forward slashes)
2. Verify path is relative to project root
3. Check if path is in EXCLUDED_SUBDIRS

### PowerShell not detected on Windows
1. Check PowerShell installation path
2. Verify PATH environment variable
3. Falls back to cmd.exe automatically

### Built-in skills not appearing
1. Check SkillRegistry initialization
2. Verify import of BuiltinSkills in skill/index.ts
3. Check skill registration in constructor
