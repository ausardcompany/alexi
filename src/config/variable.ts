/**
 * Variable Substitution Utilities
 * Handles template variable substitution with JSON escaping support
 */

/**
 * Escapes a string for safe inclusion in JSON
 */
function escapeJsonString(str: string): string {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t');
}

/**
 * Substitutes variables in a template string
 * @param template - Template string with {variable} placeholders
 * @param variables - Key-value pairs to substitute
 * @param options - Substitution options
 * @param options.escapeJson - If true, escape values for JSON contexts
 */
export function substitute(
  template: string,
  variables: Record<string, string>,
  options: { escapeJson?: boolean } = {}
): string {
  const { escapeJson = false } = options;

  let result = template;
  for (const [key, value] of Object.entries(variables)) {
    const processedValue = escapeJson ? escapeJsonString(value) : value;
    result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), processedValue);
  }
  return result;
}
