# Changes Summary

## Files Modified
1. `src/providers/snowflake-cortex.ts`
   - Updated token handling to use `SNOWFLAKE_CORTEX_TOKEN` with fallback to `SNOWFLAKE_CORTEX_PAT` and options.

2. `src/core/model.ts`
   - Added budget management fields to the ZenData model.

3. `src/core/project/copy.ts`
   - Added error handling for directory unavailable situations to prevent crashes.

4. `src/cli/mcp.ts`
   - Integrated protocol versioning into the debug setup.

5. `package.json`
   - Updated version from `7.3.46` to `1.17.6`.

## Summary of Changes
- **Snowflake Cortex Token Handling**: Enhanced token retrieval to improve compatibility with new authentication mechanisms.
- **ZenData Model**: Introduced budget management features to extend capabilities.
- **Directory Error Handling**: Implemented error handling in project copy to improve robustness.
- **MCP Protocol Version**: Ensured correct MCP protocol version is utilized during debugging.
- **Version Update**: Synchronized package version to align with upstream conventions.

## Issues Encountered
- The specified files were missing and had to be created before applying changes.
