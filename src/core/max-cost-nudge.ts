export type MaxCostChoice = 'continue' | 'stop';

export interface MaxCostMessage {
  id: string;
  sessionID: string;
  role?: string;
  cost?: number;
}

export class MaxCostNudge {
  readonly #msgs = new Map<string, { sid: string; cost: number }>();
  readonly #totals = new Map<string, number>();
  readonly #floors = new Map<string, number>();
  readonly #alerted = new Map<string, Set<number>>();
  readonly #acked = new Map<string, Set<number>>();

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

  // Internal state accessors reserved for future logic wiring
  _internalState(): {
    msgs: Map<string, { sid: string; cost: number }>;
    totals: Map<string, number>;
    floors: Map<string, number>;
    alerted: Map<string, Set<number>>;
    acked: Map<string, Set<number>>;
  } {
    return {
      msgs: this.#msgs,
      totals: this.#totals,
      floors: this.#floors,
      alerted: this.#alerted,
      acked: this.#acked,
    };
  }
}
