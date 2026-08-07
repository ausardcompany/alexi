/**
 * Connector Store
 *
 * Minimal typed abstraction over per-provider persisted state:
 * OAuth `accessToken` + `refreshToken` + `expiry`, plus room for
 * rate-limit metadata. A future feature will add a file-backed
 * implementation persisting to `~/.alexi/connectors/`; for now this
 * module exposes:
 *
 *  1. `ConnectorState` — the shape stored per `providerId`.
 *  2. `ConnectorStore` — the interface a persistence backend implements.
 *  3. `createInMemoryConnectorStore()` — a default in-memory backing
 *     used by tests and by first-run sessions before persistence is
 *     wired up.
 *  4. `getConnectorStore()` / `setConnectorStore()` — a swappable module
 *     singleton the rest of Alexi consumes. Tests reset it to the
 *     in-memory default via `setConnectorStore(createInMemoryConnectorStore())`
 *     to keep isolation between suites.
 *
 * We deliberately keep the interface minimal (`get`, `set`, `delete`)
 * — richer queries live on top of `get()` in caller code. This matches
 * the pattern in `sessionManager.ts` where the storage layer is a
 * dumb key-value byproduct and semantics live in the caller.
 */

/**
 * State persisted for a single connector (provider).
 *
 * Fields are all optional because different providers use different
 * subsets — a proxy-only provider may only need `apiKey`, while an
 * OAuth-backed provider populates the token triple.
 */
export interface ConnectorState {
  /** Current bearer access token. */
  accessToken?: string;
  /** Long-lived refresh token issued by the OAuth server. */
  refreshToken?: string;
  /** Unix epoch milliseconds at which `accessToken` expires. */
  expiry?: number;
  /** OAuth token endpoint URL (e.g. `https://<tenant>/oauth/token`). */
  tokenEndpoint?: string;
  /** OAuth client id (for `client_credentials` grant fallback). */
  clientId?: string;
  /** OAuth client secret (never logged). */
  clientSecret?: string;
  /** Free-form provider extras (never assume shape without narrowing). */
  extra?: Record<string, unknown>;
}

/**
 * Persistence contract for connector state. Implementations may be
 * synchronous (in-memory) or asynchronous (disk / secret manager); the
 * API is async to keep the door open.
 */
export interface ConnectorStore {
  get(providerId: string): Promise<ConnectorState | undefined>;
  set(providerId: string, state: ConnectorState): Promise<void>;
  delete(providerId: string): Promise<void>;
}

/**
 * In-memory connector store. Used as the default until a file-backed
 * implementation lands, and always used by tests to keep suites
 * isolated. Do not export a shared instance from here — call
 * `createInMemoryConnectorStore()` to get a fresh, isolated store.
 */
export function createInMemoryConnectorStore(): ConnectorStore {
  const map = new Map<string, ConnectorState>();
  return {
    async get(providerId) {
      const s = map.get(providerId);
      return s ? { ...s } : undefined;
    },
    async set(providerId, state) {
      map.set(providerId, { ...state });
    },
    async delete(providerId) {
      map.delete(providerId);
    },
  };
}

let currentStore: ConnectorStore = createInMemoryConnectorStore();

/**
 * Return the currently registered connector store. Callers should
 * treat this as a module singleton; overriding it is a test hook.
 */
export function getConnectorStore(): ConnectorStore {
  return currentStore;
}

/**
 * Swap the module singleton. Tests should reset the store between
 * suites so state from one test does not leak into another.
 */
export function setConnectorStore(store: ConnectorStore): void {
  currentStore = store;
}
