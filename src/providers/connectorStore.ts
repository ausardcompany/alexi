/**
 * Connector Store
 *
 * Minimal typed abstraction over per-provider persisted state:
 * OAuth `accessToken` + `refreshToken` + `expiry`, plus room for
 * rate-limit metadata. In addition to the in-memory default, this
 * module ships a JSON-file-backed persistence layer at
 * `~/.alexi/connectors.json` (see `loadConnectorState` /
 * `saveConnectorState`) so users do not have to re-authenticate on
 * every session start.
 *
 * Public surface:
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
 *  5. `loadConnectorState()` / `saveConnectorState()` — read/write the
 *     on-disk JSON snapshot. Corrupt / missing files resolve to an
 *     empty snapshot so a bad cache never blocks a session.
 *  6. `getConnectorStatePath()` / `setConnectorStatePath()` /
 *     `resetConnectorStatePath()` — path overrides for tests.
 *
 * We deliberately keep the interface minimal (`get`, `set`, `delete`)
 * — richer queries live on top of `get()` in caller code. This matches
 * the pattern in `sessionManager.ts` where the storage layer is a
 * dumb key-value byproduct and semantics live in the caller.
 */

import fs from 'fs';
import path from 'path';
import os from 'os';
import { getConfigPersistAuthTokens } from '../config/userConfig.js';

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
 * Track whether `initializeConnectorStore` has already hydrated the
 * current store from disk in this process. Callers may invoke the
 * initializer eagerly on startup or lazily before their first
 * refresh — either way we only pay the read once.
 *
 * `setConnectorStore` resets this flag so a test swapping the store
 * to a fresh in-memory instance gets re-hydrated on the next init
 * call.
 */
let currentStoreHydrated = false;

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
  currentStoreHydrated = false;
}

// ============================================================================
// On-disk persistence (~/.alexi/connectors.json)
// ============================================================================

/**
 * On-disk file format version. Bump when a backwards-incompatible
 * shape change is made; loaders that see an unknown version reject
 * the file (returning an empty snapshot) rather than mis-parse.
 */
const CONNECTOR_STATE_VERSION = 1;

/**
 * Skew applied to `expiresAt` on load. Tokens within this window of
 * expiry are pruned so the caller performs a fresh refresh rather
 * than racing the OAuth server. Matches the 30-second skew used in
 * `sapOrchestration.ts` (`TOKEN_EXPIRY_SKEW_MS`).
 */
const TOKEN_EXPIRY_SKEW_MS = 30_000;

/**
 * Shape of a single connector entry as stored on disk. Note this is
 * a narrower projection of `ConnectorState` — we intentionally do
 * NOT persist the `extra` bag, `clientSecret`, or `tokenEndpoint`
 * because the caller re-hydrates those from configuration on
 * startup. The on-disk file is a token cache, not a full mirror.
 */
interface StoredConnectorEntry {
  accessToken?: string;
  refreshToken?: string;
  /** Unix epoch ms; named `expiresAt` on disk to match tokenStorage. */
  expiresAt?: number;
}

/**
 * Full on-disk file shape.
 */
export interface ConnectorStateFile {
  version: number;
  connectors: Record<string, StoredConnectorEntry>;
}

const DEFAULT_CONNECTOR_FILE = path.join(os.homedir(), '.alexi', 'connectors.json');

let currentConnectorFile: string = DEFAULT_CONNECTOR_FILE;

/**
 * Return the absolute path used for on-disk connector state.
 * Tests may relocate this via `setConnectorStatePath`.
 */
export function getConnectorStatePath(): string {
  return currentConnectorFile;
}

/**
 * Override the connector state path. Intended for tests that want
 * to point at a `fs.mkdtempSync(...)` directory. Callers must
 * restore the previous value in their `afterEach` hook (or call
 * `resetConnectorStatePath`).
 */
export function setConnectorStatePath(newPath: string): void {
  currentConnectorFile = newPath;
}

/**
 * Restore the connector state path to the default
 * `~/.alexi/connectors.json`.
 */
export function resetConnectorStatePath(): void {
  currentConnectorFile = DEFAULT_CONNECTOR_FILE;
}

/**
 * Return `true` when `value` matches the `StoredConnectorEntry` shape.
 * Any deviation (missing fields, wrong types) is rejected so a
 * malformed entry cannot poison the in-memory store on load.
 */
function isStoredConnectorEntry(value: unknown): value is StoredConnectorEntry {
  if (!value || typeof value !== 'object') {
    return false;
  }
  const rec = value as Record<string, unknown>;
  if (rec.accessToken !== undefined && typeof rec.accessToken !== 'string') {
    return false;
  }
  if (rec.refreshToken !== undefined && typeof rec.refreshToken !== 'string') {
    return false;
  }
  if (
    rec.expiresAt !== undefined &&
    (typeof rec.expiresAt !== 'number' || !Number.isFinite(rec.expiresAt))
  ) {
    return false;
  }
  return true;
}

/**
 * Load the on-disk connector snapshot into a `Record<string, ConnectorState>`.
 *
 * Returns an empty record when:
 *  - `persistAuthTokens` is `false` in user config;
 *  - the file does not exist (`ENOENT`);
 *  - the file is unreadable (permissions, IO);
 *  - the JSON is malformed;
 *  - the file `version` does not match `CONNECTOR_STATE_VERSION`.
 *
 * Expired tokens (within `TOKEN_EXPIRY_SKEW_MS` of `now`) are pruned
 * from the returned snapshot — their `accessToken` and `expiry` fields
 * are stripped, but `refreshToken` is kept so the caller can still
 * refresh. If a `now` override is not supplied, `Date.now` is used.
 *
 * This function never throws. Callers can treat a load failure
 * identically to a first-run "empty snapshot".
 */
export async function loadConnectorState(options?: {
  now?: () => number;
}): Promise<Record<string, ConnectorState>> {
  if (!getConfigPersistAuthTokens()) {
    return {};
  }

  let raw: string;
  try {
    raw = await fs.promises.readFile(currentConnectorFile, 'utf-8');
  } catch {
    // Missing / unreadable file: fall back to empty snapshot.
    return {};
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    // Corrupt JSON: treat as empty. The next successful save will
    // overwrite the bad file atomically.
    return {};
  }

  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    return {};
  }

  const file = parsed as Partial<ConnectorStateFile>;
  if (file.version !== CONNECTOR_STATE_VERSION) {
    // Unknown / mismatched version — treat as empty so a future
    // upgrade or a hand-edited file cannot mis-populate the store.
    return {};
  }
  if (!file.connectors || typeof file.connectors !== 'object' || Array.isArray(file.connectors)) {
    return {};
  }

  const now = options?.now ? options.now() : Date.now();
  const out: Record<string, ConnectorState> = {};
  for (const [providerId, entry] of Object.entries(file.connectors)) {
    if (!isStoredConnectorEntry(entry)) {
      continue;
    }
    const state: ConnectorState = {};
    // Prune access tokens that are already expired (or within the
    // skew window). Preserve the refresh token so the caller can
    // still recover without a full re-login.
    if (entry.accessToken && typeof entry.expiresAt === 'number') {
      if (entry.expiresAt - TOKEN_EXPIRY_SKEW_MS > now) {
        state.accessToken = entry.accessToken;
        state.expiry = entry.expiresAt;
      }
    }
    if (entry.refreshToken) {
      state.refreshToken = entry.refreshToken;
    }
    // Only include the entry if at least one field survived.
    if (state.accessToken || state.refreshToken) {
      out[providerId] = state;
    }
  }
  return out;
}

/**
 * Read the on-disk file WITHOUT any pruning or `persistAuthTokens`
 * gating. Used internally by `saveConnectorState` for its
 * read-modify-write cycle so a save for one provider preserves
 * entries for other providers. Returns an empty object on any
 * failure (missing file, corrupt JSON, wrong version, IO error).
 */
async function readRawConnectorFile(): Promise<Record<string, StoredConnectorEntry>> {
  let raw: string;
  try {
    raw = await fs.promises.readFile(currentConnectorFile, 'utf-8');
  } catch {
    return {};
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return {};
  }
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    return {};
  }
  const file = parsed as Partial<ConnectorStateFile>;
  if (file.version !== CONNECTOR_STATE_VERSION) {
    return {};
  }
  if (!file.connectors || typeof file.connectors !== 'object' || Array.isArray(file.connectors)) {
    return {};
  }
  const out: Record<string, StoredConnectorEntry> = {};
  for (const [providerId, entry] of Object.entries(file.connectors)) {
    if (isStoredConnectorEntry(entry)) {
      out[providerId] = { ...entry };
    }
  }
  return out;
}

/**
 * Project a `ConnectorState` into the narrower `StoredConnectorEntry`
 * shape. Returns `null` when no field survives, so the caller can
 * skip persisting empty entries.
 */
function projectStoredEntry(entry: ConnectorState): StoredConnectorEntry | null {
  const stored: StoredConnectorEntry = {};
  if (entry.accessToken) {
    stored.accessToken = entry.accessToken;
  }
  if (entry.refreshToken) {
    stored.refreshToken = entry.refreshToken;
  }
  if (typeof entry.expiry === 'number' && Number.isFinite(entry.expiry)) {
    stored.expiresAt = entry.expiry;
  }
  if (stored.accessToken || stored.refreshToken || stored.expiresAt !== undefined) {
    return stored;
  }
  return null;
}

/**
 * Atomically merge the supplied connectors into
 * `~/.alexi/connectors.json`, then rewrite the file.
 *
 * Uses a temp-file + rename sequence so concurrent readers never
 * observe a partially-written file. The temp file is created with
 * mode `0o600` so token contents never sit on disk with looser
 * permissions, even briefly. After the rename the target file's
 * mode is tightened again in case it pre-existed with a laxer mode.
 *
 * When `persistAuthTokens` is disabled in user config this is a
 * no-op — callers can invoke it unconditionally.
 *
 * The persisted projection is intentionally narrow: only
 * `accessToken`, `refreshToken`, and `expiresAt` are written per
 * provider. Configuration-derived fields (`tokenEndpoint`,
 * `clientId`, `clientSecret`) are excluded so a stale on-disk cache
 * cannot silently override a corrected `.env` / config file.
 *
 * Semantics: this is a read-modify-write **merge**. Entries for
 * providers not present in `state` are preserved from disk. To
 * remove a provider entry, pass `{}` as its value (an empty
 * `ConnectorState` projects to `null` and is skipped, so the
 * previous entry survives) — use a dedicated future
 * `clearConnectorState(providerId)` helper for explicit deletion.
 */
export async function saveConnectorState(state: Record<string, ConnectorState>): Promise<void> {
  if (!getConfigPersistAuthTokens()) {
    return;
  }

  const merged = await readRawConnectorFile();
  for (const [providerId, entry] of Object.entries(state)) {
    const stored = projectStoredEntry(entry);
    if (stored !== null) {
      merged[providerId] = stored;
    }
  }

  const file: ConnectorStateFile = {
    version: CONNECTOR_STATE_VERSION,
    connectors: merged,
  };

  const dir = path.dirname(currentConnectorFile);
  await fs.promises.mkdir(dir, { recursive: true });

  const tmpPath = `${currentConnectorFile}.${process.pid}.${Math.random()
    .toString(36)
    .slice(2)}.tmp`;
  const contents = JSON.stringify(file, null, 2);
  await fs.promises.writeFile(tmpPath, contents, { encoding: 'utf-8', mode: 0o600 });
  try {
    await fs.promises.rename(tmpPath, currentConnectorFile);
  } catch (err) {
    await fs.promises.unlink(tmpPath).catch(() => undefined);
    throw err;
  }
  // Tighten permissions in case the target pre-existed with a laxer
  // mode. `chmod` is a no-op on Windows for permission bits but does
  // not throw.
  try {
    await fs.promises.chmod(currentConnectorFile, 0o600);
  } catch {
    // Non-fatal: some filesystems (tmpfs, FAT) do not implement chmod.
  }
}

/**
 * Hydrate the currently-registered `ConnectorStore` from the on-disk
 * snapshot. Idempotent: subsequent calls in the same process are
 * no-ops until `setConnectorStore` swaps in a fresh instance (which
 * resets the internal flag).
 *
 * On any load failure this becomes a no-op — the caller keeps
 * running against an empty in-memory store. Individual `store.set`
 * failures are swallowed so a single bad entry cannot block
 * hydration of the rest.
 *
 * Callers should invoke this once during startup (e.g. from the
 * provider bootstrap path in `sapOrchestration.ts`) so the first
 * refresh check finds the persisted refresh token.
 */
export async function initializeConnectorStore(options?: { now?: () => number }): Promise<void> {
  if (currentStoreHydrated) {
    return;
  }
  currentStoreHydrated = true;

  let snapshot: Record<string, ConnectorState>;
  try {
    snapshot = await loadConnectorState(options);
  } catch {
    return;
  }

  for (const [providerId, entry] of Object.entries(snapshot)) {
    try {
      const existing = (await currentStore.get(providerId)) ?? {};
      // Merge: on-disk fields fill in gaps, but never overwrite
      // fields that were already populated in-memory by the current
      // process (e.g. by a prior `alexi login` call in the same
      // session).
      const merged: ConnectorState = { ...entry, ...existing };
      // The merge above prefers `existing`; explicitly restore
      // disk-only fields that `existing` may lack.
      if (existing.accessToken === undefined && entry.accessToken) {
        merged.accessToken = entry.accessToken;
        merged.expiry = entry.expiry;
      }
      if (existing.refreshToken === undefined && entry.refreshToken) {
        merged.refreshToken = entry.refreshToken;
      }
      await currentStore.set(providerId, merged);
    } catch {
      // Skip this entry and keep going.
    }
  }
}
