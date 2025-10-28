import { z } from "zod"

export const IdentitySchema = z.object({
  wallet: z.string(),
  name: z.string().optional(),
  contact: z.string().optional(),
  country: z.string().optional(),
  state: z.string().optional(),
  guardians: z.array(z.string()).optional(),
})

export type Identity = z.infer<typeof IdentitySchema>

export const CapsuleSchema = z.object({
  id: z.string(),
  type: z.string(),
  schemaURI: z.string().optional(),
  payloadCID: z.string(),
  attestations: z.array(
    z.object({
      issuer: z.string(),
      sig: z.string(),
    }),
  ),
  tags: z.array(z.string()).optional(),
  createdAt: z.string(),
})

export type Capsule = z.infer<typeof CapsuleSchema>

export const AccessRequestSchema = z.object({
  id: z.string(),
  requester: z.string(),
  scope: z.array(z.string()),
  duration: z.number(),
  status: z.enum(["pending", "granted", "revoked", "expired"]),
  fraudScore: z.number().optional(),
})

export type AccessRequest = z.infer<typeof AccessRequestSchema>

export const FraudAlertSchema = z.object({
  id: z.string(),
  score: z.number(),
  reason: z.string(),
  action: z.enum(["allow", "step-up", "block"]),
})

export type FraudAlert = z.infer<typeof FraudAlertSchema>
