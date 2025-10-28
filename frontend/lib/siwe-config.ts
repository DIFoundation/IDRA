export const siweConfig = {
  domain: typeof window !== "undefined" ? window.location.host : "localhost:3000",
  uri: typeof window !== "undefined" ? window.location.origin : "http://localhost:3000",
  version: "1",
  chainId: 1,
  statement: "Sign in to IDRA - Identity & Capsule Management",
}
