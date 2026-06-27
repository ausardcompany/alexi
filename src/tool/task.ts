const mode: "allow" | "deny" = cfg.experimental?.sandbox_restrict_network === false ? "allow" : "deny";
const fallback = { enabled: cfg.experimental?.sandbox ?? false, mode };
yield* SandboxPolicy.inherit(ctx.sessionID, session.id, fallback);