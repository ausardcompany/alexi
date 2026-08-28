/**
 * NUL-delimited composite key builder.
 *
 * Ports kilocode upstream commit `8507bddb0` — extracts the ad-hoc composite
 * key construction pattern (`` `${a}\0${b}` ``, `[a, b].join('\0')`) into a
 * single helper. The NUL byte is used as the separator because it CANNOT
 * appear inside a valid session id / agent id / worktree path / arbitrary
 * user-supplied string, so `zeroID(a, b) === zeroID(c, d)` iff `a === c`
 * AND `b === d` — no delimiter collision, no need for JSON encoding.
 *
 * The fast paths for arity 2 and 3 exist because those two cases dominate
 * callers (sessionID×agentID, sessionID×agentID×toolID). Larger arities
 * fall through to `join('\0')`.
 *
 * All args are coerced via the template-literal path so `number` / `boolean`
 * are stringified consistently across call sites.
 *
 * NOTE: kilocode's upstream helper is named `zeroID`. We keep the same name
 * so grepping and porting stays 1:1.
 */

/**
 * Build a NUL-delimited composite id from any number of scalar parts.
 *
 * @example
 * zeroID('session-42', 'agent-code') // "session-42\0agent-code"
 * zeroID('a', 'b', 'c')              // "a\0b\0c"
 * zeroID('a', 1, true)               // "a\01\0true"
 */
export function zeroID(...parts: (string | number | boolean)[]): string {
  if (parts.length === 2) {
    return `${parts[0]}\0${parts[1]}`;
  }
  if (parts.length === 3) {
    return `${parts[0]}\0${parts[1]}\0${parts[2]}`;
  }
  return parts.join('\0');
}
