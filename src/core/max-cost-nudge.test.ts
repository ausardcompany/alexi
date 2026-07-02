import { describe, expect, test } from "bun:test"
import { MaxCostNudge } from "./max-cost-nudge"

describe("MaxCostNudge", () => {
  test("normalizeLimit functionality", () => {
    expect(MaxCostNudge.normalizeLimit(null)).toBeUndefined()
    expect(MaxCostNudge.normalizeLimit(4.2)).toBe(5)
  })

  test("formatCost precision", () => {
    expect(MaxCostNudge.formatCost(0.5)).toBe("$0.5000")
  })

  // Additional tests
})
