# Migration Guide: Permission Prompt Updates

## Overview

This guide helps developers understand and integrate the new permission prompt system introduced in the 2026-03-15 update.

## What Changed?

### New Features
1. **Interactive CLI Permission Prompts**: Enhanced visual prompts with better UX
2. **Internationalization Support**: i18n infrastructure for future localization
3. **Session Memory**: Remember permission decisions during a session

### No Breaking Changes
- All existing code continues to work without modifications
- Permission system remains event-based
- SAP AI Core integration unchanged

## For End Users

### Interactive Mode
Permission prompts now appear automatically when using `alexi interactive`:

```bash
alexi interactive
```

No configuration needed! The system detects TTY and activates automatically.

### New Commands
```bash
/permissions        # View permission rules
/permissions reset  # Clear session memory
```

### Documentation
Read the full guide at `docs/permission-system.md`

## For Developers

### Using the Permission Prompt Handler

#### Basic Usage (Automatic)
If you're using the interactive CLI, permission prompts work automatically. No code changes needed.

#### Manual Integration
To integrate permission prompts in custom code:

```typescript
import { 
  startPermissionPromptHandler, 
  isPermissionPromptSupported 
} from './permission/index.js';

// Check if prompts are supported
if (isPermissionPromptSupported()) {
  // Start the handler
  const cleanup = startPermissionPromptHandler();
  
  // Your code here...
  
  // Clean up when done
  cleanup();
}
```

#### Event-Based Integration
The system uses the existing event bus:

```typescript
import { PermissionRequested, PermissionResponse } from './bus/index.js';

// Listen for permission requests
const unsubscribe = PermissionRequested.subscribe((request) => {
  console.log(`Permission requested: ${request.action}`);
  
  // Custom logic here...
  
  // Respond with decision
  PermissionResponse.publish({
    id: request.id,
    granted: true,
    remember: false,
    timestamp: Date.now(),
  });
});

// Clean up
unsubscribe();
```

### Using Internationalization

#### Basic Translation
```typescript
import { t } from './i18n/index.js';

// Get translated string
const approveText = t('permission.approve');  // "Approve"
const denyText = t('permission.deny');        // "Deny"
```

#### Direct Access
```typescript
import { en } from './i18n/index.js';

// Access translations directly
console.log(en.permission.requestingPermission);
```

#### Adding New Locales
To add a new locale (e.g., German):

1. Create `src/i18n/de.ts`:
```typescript
import type { Translations } from './en.js';

export const de: Translations = {
  permission: {
    approve: 'Genehmigen',
    deny: 'Ablehnen',
    // ... other translations
  },
  common: {
    tool: 'Werkzeug',
    resource: 'Ressource',
    // ... other translations
  },
};
```

2. Update `src/i18n/index.ts`:
```typescript
import { de } from './de.js';

type Locale = 'en' | 'de';

const translations: Record<Locale, Translations> = {
  en,
  de,
};
```

### Testing

#### Testing Permission Prompts
```typescript
import { describe, it, expect, vi } from 'vitest';
import { PermissionRequested, PermissionResponse } from './bus/index.js';

describe('My Feature', () => {
  it('should handle permission requests', () => {
    const handler = vi.fn();
    const unsubscribe = PermissionRequested.subscribe(handler);
    
    // Trigger permission request
    PermissionRequested.publish({
      id: 'test-123',
      toolName: 'write',
      action: 'write',
      resource: '/test/file.txt',
      description: 'Test write',
      timestamp: Date.now(),
    });
    
    expect(handler).toHaveBeenCalled();
    unsubscribe();
  });
});
```

#### Testing i18n
```typescript
import { describe, it, expect } from 'vitest';
import { t, setLocale } from './i18n/index.js';

describe('My Localized Feature', () => {
  it('should use correct translations', () => {
    setLocale('en');
    expect(t('permission.approve')).toBe('Approve');
  });
});
```

## API Reference

### Permission Prompt Handler

#### `startPermissionPromptHandler(): () => void`
Starts listening for permission requests and displays prompts.

**Returns**: Cleanup function to stop the handler

**Example**:
```typescript
const cleanup = startPermissionPromptHandler();
// ... later ...
cleanup();
```

#### `isPermissionPromptSupported(): boolean`
Checks if the current environment supports interactive prompts.

**Returns**: `true` if both stdin and stdout are TTY

**Example**:
```typescript
if (isPermissionPromptSupported()) {
  // Safe to use interactive prompts
}
```

### Internationalization

#### `t(keyPath: string): string`
Gets a translated string by key path.

**Parameters**:
- `keyPath`: Dot-separated key path (e.g., 'permission.approve')

**Returns**: Translated string or key path if not found

**Example**:
```typescript
const text = t('permission.readAccess');  // "Read Access"
```

#### `getLocale(): Locale`
Gets the current locale.

**Returns**: Current locale code (e.g., 'en')

#### `setLocale(locale: Locale): void`
Sets the current locale.

**Parameters**:
- `locale`: Locale code to activate

**Example**:
```typescript
setLocale('en');
```

#### `getTranslations(): Translations`
Gets all translations for the current locale.

**Returns**: Translation object

## Common Patterns

### Custom Permission Handler
```typescript
import { PermissionRequested, PermissionResponse } from './bus/index.js';

function createCustomPermissionHandler(autoApprove: boolean) {
  return PermissionRequested.subscribe((request) => {
    PermissionResponse.publish({
      id: request.id,
      granted: autoApprove,
      remember: false,
      timestamp: Date.now(),
    });
  });
}

// Use in tests
const cleanup = createCustomPermissionHandler(true);
// ... test code ...
cleanup();
```

### Conditional Prompt Handler
```typescript
import { startPermissionPromptHandler, isPermissionPromptSupported } from './permission/index.js';

let cleanup: (() => void) | undefined;

function initializePermissions(interactive: boolean) {
  if (interactive && isPermissionPromptSupported()) {
    cleanup = startPermissionPromptHandler();
  }
}

function shutdownPermissions() {
  if (cleanup) {
    cleanup();
    cleanup = undefined;
  }
}
```

## Troubleshooting

### Issue: Prompts Not Appearing
**Solution**: Check TTY support
```typescript
console.log('TTY supported:', isPermissionPromptSupported());
```

### Issue: Multiple Handlers Active
**Solution**: Always clean up handlers
```typescript
const cleanup = startPermissionPromptHandler();
// Always call cleanup, even on error
try {
  // Your code
} finally {
  cleanup();
}
```

### Issue: Translation Not Found
**Solution**: Check key path and locale
```typescript
import { t, getLocale } from './i18n/index.js';
console.log('Current locale:', getLocale());
console.log('Translation:', t('permission.approve'));
```

## Best Practices

1. **Always Clean Up**: Call cleanup functions to prevent memory leaks
2. **Check TTY**: Use `isPermissionPromptSupported()` before starting handler
3. **Handle Errors**: Wrap permission logic in try-catch blocks
4. **Test Both Modes**: Test with and without interactive prompts
5. **Use Events**: Prefer event-based integration over direct calls
6. **Type Safety**: Use TypeScript types for translation keys

## Examples

See these files for complete examples:
- `src/cli/interactive.ts` - Integration in REPL
- `src/permission/prompt.test.ts` - Testing patterns
- `src/i18n/index.test.ts` - i18n testing

## Support

For questions or issues:
- Check `docs/permission-system.md` for user documentation
- Review test files for usage examples
- Open an issue on GitHub for bugs

## Changelog

### 2026-03-15
- Added CLI permission prompt handler
- Added internationalization infrastructure
- Integrated into interactive REPL
- Added comprehensive tests and documentation
