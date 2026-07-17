const ModelSchema = z.object({
  name: z.string(),
  cost: ModelCostSchema,
  costMultiplier: z.number().default(1),
  cost200K: ModelCostSchema.optional(),
  allowAnonymous: z.boolean().optional(),
  byokProvider: z.enum(['openai', 'anthropic', 'google']).optional(),
});
