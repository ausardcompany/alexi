export type MaxCostChoice = "continue" | "stop"

export interface MaxCostMessage {
  id: string
  sessionID: string
  role?: string
  cost?: number
}

export class MaxCostNudge {
  readonly #msgs = new Map<string, { sid: string; cost: number }>()
  readonly #totals = new Map<string, number>()
  readonly #floors = new Map<string, number>()
  readonly #alerted = new Map<string, Set<number>>() 
  readonly #acked = new Map<string, Set<number>>()
  
  #limit: number | undefined

  static normalizeLimit(value: number | undefined | null): number | undefined {
    if (value == null || !Number.isFinite(value) || value <= 0) return undefined
    return Math.ceil(value)
  }

  static formatCost(value: number): string {
    return `$${value.toFixed(value < 1 ? 4 : 2)}`
  }

  setLimit(value: number | undefined | null): void {
    // Additional logic
  }
}
