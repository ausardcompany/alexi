export type MaxCostChoice = 'continue' | 'stop';

export interface MaxCostMessage {
  id: string;
  sessionID: string;
  role?: string;
  cost?: number;
}

export class MaxCostNudge {
  #limit: number | undefined;

  static normalizeLimit(value: number | undefined | null): number | undefined {
    if (value === null || value === undefined || !Number.isFinite(value) || value <= 0) {
      return undefined;
    }
    return Math.ceil(value);
  }

  static formatCost(value: number): string {
    return `$${value.toFixed(value < 1 ? 4 : 2)}`;
  }

  setLimit(value: number | undefined | null): void {
    this.#limit = MaxCostNudge.normalizeLimit(value);
  }

  getLimit(): number | undefined {
    return this.#limit;
  }
}
