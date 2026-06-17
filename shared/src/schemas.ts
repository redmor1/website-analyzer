import { z } from "zod";

import { ScannerEnum } from "./types.js";

export const scanRequestSchema = z.object({
  scanners: z.array(ScannerEnum).min(1, "You must select at least one scanner"),

  websiteUrl: z.url({
    hostname: z.regexes.domain,
    normalize: true, // lots of i/o logic depends on normalized urls
    protocol: /^https?$/,
  }),
});

export const scanResponseSchema = z.object({
  metadata: z.object({
    timestamp: z.date(),
    websiteUrl: z.url({
      hostname: z.regexes.domain,
      normalize: true, // lots of i/o logic depends on normalized urls
      protocol: /^https?$/,
    }),
  }),
  scanners: z.array(ScannerEnum).min(1, "No scanners detected"),
});

export const hostSchema = z
  .string()
  .regex(
    /^[a-zA-Z0-9.-]+(:\d+)?$/,
    "Invalid host format. Only alphanumeric, hyphens, periods, and ports are allowed.",
  );
