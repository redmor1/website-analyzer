export interface RetireVulnerability {
  id: string;
  description: string;
  cwes?: number[];
  ratings?: { severity: RetireVulnerabilitySeverity }[];
}

export type RetireVulnerabilitySeverity =
  | "low"
  | "medium"
  | "high"
  | "critical";
