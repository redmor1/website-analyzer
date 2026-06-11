import * as zod from "zod"

// the Report could have one or more scanners inside as keys
export type Report = Partial<Record<Scanner, unknown>>

export const ScannerEnum = zod.enum([
  "ffuf",
  "nmap",
  "nuclei",
  "retire",
  "testssl",
  "wapiti",
])

export type Scanner = zod.infer<typeof ScannerEnum>
