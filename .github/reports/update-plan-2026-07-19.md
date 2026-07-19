```markdown
# Update Plan for Alexi

Generated: 2026-07-19
Based on upstream commits: fab2133..f557328 (opencode)

## Summary
- Total changes planned: 4
- Critical: 0 | High: 2 | Medium: 1 | Low: 1

## Changes

### 1. Support OpenAI route integration
**File**: `src/router/openaiRoute.ts`
**Priority**: high
**Type**: feature
**Reason**: To integrate OpenAI route support and enhance Alexi's AI capabilities.

**Current code**:
```typescript
// No existing OpenAI route integration
```

**New code**:
```typescript
import { Router } from 'express';
import { openAIHandler } from '../handlers/openai';

const router = Router();

router.post('/openai', openAIHandler);

export default router;
```

### 2. Align new session project picker
**File**: `src/ui/sessionProjectPicker.tsx`
**Priority**: high
**Type**: feature
**Reason**: To improve user experience when selecting projects in a new session.

**Current code**:
```typescript
// Old project picker logic
```

**New code**:
```typescript
import React, { useState } from 'react';

const SessionProjectPicker = () => {
  const [selectedProject, setSelectedProject] = useState(null);

  const handleProjectChange = (project) => {
    setSelectedProject(project);
  };

  return (
    <div>
      <select onChange={(e) => handleProjectChange(e.target.value)}>
        {/* Options dynamically loaded */}
      </select>
    </div>
  );
};

export default SessionProjectPicker;
```

### 3. Prevent overlapping composer borders
**File**: `src/ui/styles/composer.css`
**Priority**: medium
**Type**: bugfix
**Reason**: To fix UI issue where composer borders overlap in certain scenarios.

**Current code**:
```css
.composer {
  border: 1px solid #ccc;
}
```

**New code**:
```css
.composer {
  border: 1px solid #ccc;
  box-sizing: border-box;
}
```

### 4. Update i18n language files for new terms
**File**: `src/i18n/en.json`
**Priority**: low
**Type**: refactor
**Reason**: To ensure new terms are available in multiple languages.

**Current code**:
```json
{
  "welcome": "Welcome"
}
```

**New code**:
```json
{
  "welcome": "Welcome",
  "newTerm": "New Term"
}
```

## Testing Recommendations
- Test OpenAI route by sending sample requests and verifying responses.
- Use the session project picker with various project lists to ensure proper functionality.
- Validate UI changes in different browser environments to ensure no border overlaps.
- Check language files for proper translations and loading in the UI.

## Potential Risks
- Integration of new routes could potentially interfere with existing request handling if not properly isolated.
- UI changes might affect layout in older browser versions; ensure thorough cross-browser testing.
```
{"prompt_tokens":2557,"completion_tokens":670,"total_tokens":3227,"cache_read_input_tokens":0}

[Session: 5905bf4f-bad0-4caf-a324-583aadad7b37]
[Messages: 2, Tokens: 3227]
