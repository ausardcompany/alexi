import { PermissionSchema } from '@opencode-ai/core';

const schema = new PermissionSchema({
  evaluate: (resource, action) => {
    // Updated logic for permission evaluation
  }
});