import { z } from "zod";

// the Report could have one or more scanners inside as keys
export type Report = Partial<Record<Scanner, unknown>>;

export const ScannerEnum = z.enum(["retire", "wappalyzergo", "observatory"]);

export type Scanner = z.infer<typeof ScannerEnum>;
