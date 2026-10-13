/**
 * Codemode web fetch helper.
 *
 * Mirrors upstream opencode commits:
 *   - 4fbdea2d fix(core): throw error on codemode fetch using file://
 *   - e5f4bf4c test(core): match codemode file fetch error message
 *
 * Rationale: when the model synthesises a `fetch(url)` call inside the
 * confined code-mode runtime, the URL comes from the model and is therefore
 * untrusted. Allowing `file://` would let the model exfiltrate local
 * secrets — in Alexi's deployment context that means:
 *
 *   - `~/.alexi/sessions/*.json`                   (chat transcripts)
 *   - `$AICORE_SERVICE_KEY` payload on disk        (SAP AI Core creds)
 *   - `~/.aicore/credentials`, `~/.sap/*`          (destination configs)
 *   - any mounted secret volume                    (CI runners, container)
 *
 * The guard runs BEFORE the fetch so no handle is opened against the
 * local filesystem even for a split-second. The error message is kept
 * compatible with the upstream wording so operators searching the shared
 * knowledge base find the same guidance.
 */

export async function codemodeFetch(url: string, init?: RequestInit): Promise<Response> {
  const parsed = new URL(url);
  if (parsed.protocol === 'file:') {
    throw new Error(`codemode: refusing to fetch file:// URL (${url})`);
  }
  return fetch(url, init);
}
