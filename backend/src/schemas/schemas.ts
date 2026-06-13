import zod from "zod"

import { ScannerEnum } from "../types/types.js"

export const scanRequestSchema = zod.object({
  scanners: zod
    .array(ScannerEnum)
    .min(1, "You must select at least one scanner"),

  websiteUrl: zod.url({
    hostname: zod.regexes.domain,
    normalize: true, // lots of i/o logic depends on normalized urls
    protocol: /^https?$/,
  }),
})

export const scanResponseSchema = zod.object({
  metadata: zod.object({
    timestamp: zod.date(),
    websiteUrl: zod.url({
      hostname: zod.regexes.domain,
      normalize: true, // lots of i/o logic depends on normalized urls
      protocol: /^https?$/,
    }),
  }),
  scanners: zod.array(ScannerEnum).min(1, "No scanners detected"),
})
