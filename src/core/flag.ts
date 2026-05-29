// kilocode_change: minimal flag module ported from upstream packages/core/src/flag/flag.ts.
// Only the flag(s) actually consumed by alexi are kept here.

function truthy(key: string): boolean {
  const value = process.env[key]?.toLowerCase();
  return value === 'true' || value === '1';
}

export const KILO_DISABLE_EXTERNAL_SKILLS = truthy('KILO_DISABLE_EXTERNAL_SKILLS'); // kilocode_change
