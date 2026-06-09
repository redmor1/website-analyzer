// the Report could have one or more scanners inside as keys
export type Report = Partial<Record<Scanner, unknown>>

export type Scanner =
  | "ffuf"
  | "nmap"
  | "nuclei"
  | "retire"
  | "testssl"
  | "wapiti"
