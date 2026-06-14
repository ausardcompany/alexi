const token =
  process.env.SNOWFLAKE_CORTEX_TOKEN ??
  process.env.SNOWFLAKE_CORTEX_PAT ??
  evt.options.token ??
  evt.options.apiKey;
