export namespace ZenData {
    // existing schema fields
    budgetMode: z.enum(["always", "fill"]).optional(),
    budgetContribution: z.number().optional(),
    budget: z.number().optional(),
}
