import { describe, it, expect } from 'vitest';

// Placeholder content based on the update plan

describe('Code Mode Tool Tests', () => {
  it('should align with updated parameter schema', async () => {
    await expect(Effect.runPromise(decode({ code: "return 1" }))).resolves.toEqual({ code: "return 1" });
    await expect(Effect.runPromise(decode({}))).rejects.toThrow();
    expect(Schema.toJsonSchemaDocument(Parameters).schema).toMatchObject({
      properties: {
        code: {
          description: "Script body executed by the confined interpreter.",
        },
      },
    });
  });
});