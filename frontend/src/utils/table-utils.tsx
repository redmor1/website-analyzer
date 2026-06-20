import type {
  RetireVulnerability,
  RetireVulnerabilitySeverity,
} from "@website-analyzer/shared";

const severityWeights: Record<RetireVulnerabilitySeverity, number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
};

export function getSeverityWeights(vulnerability: RetireVulnerability): number {
  const severity = vulnerability.ratings?.[0]?.severity;

  // if severity exists
  if (typeof severity === "string") {
    return severityWeights[severity] || 0;
  }

  // if severity doesnt exist
  return 0;
}
