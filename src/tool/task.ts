export function inherited(input: {
  caller: Agent.Info
  session: Session.Info
  rules: Permission.Rule[]
  mcp?: Record<string, any>
}): Permission.Rule[] {
  const prefixes = Object.keys(input.mcp ?? {}).map((k) => k.replace(/[^a-zA-Z0-9_-]/g, "_") + "_")
  const isMcp = (p: string) => prefixes.some((prefix) => p.startsWith(prefix))
  return rules.filter(
    (r: Permission.Rule) =>
      r.action === "deny" && (r.permission === "edit" || r.permission === "bash" || isMcp(r.permission)),
  )
}