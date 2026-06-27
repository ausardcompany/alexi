// Linux sandbox test placeholder
// Upstream sync introduced a test that depends on a `linux()` test helper
// (Linux-only conditional `it`), an Effect-runtime `spawn` helper, and
// `denied/profile/fixture` policy fixtures that are not present in this
// codebase yet. Marked as a passing no-op so vitest does not fail at file
// load time. Real coverage will be re-introduced with the sandbox feature.
import { describe, it } from 'vitest';

describe('linux sandbox (placeholder)', () => {
  it.todo('prevents renaming denied policy state while sibling state remains writable');
});
