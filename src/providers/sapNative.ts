// TODO: Wire a real SAP AI Core provider package, e.g. @jerome-benoit/sap-ai-provider-v2
// This stub throws until native provider is implemented.

export function createSapNativeProvider() {
  throw new Error(
    "Native SAP AI Core provider not implemented. Set SAP_PROXY_BASE_URL/SAP_PROXY_API_KEY to use the proxy path.",
  )
}
