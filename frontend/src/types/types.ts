export interface RetireVulnerability {
  id: string;
  description: string;
  cwes?: number[];
  ratings?: { severity: RetireVulnerabilitySeverity }[];
  references?: {
    source: {
      url: string;
    };
  }[];
}

export type RetireVulnerabilitySeverity =
  | "low"
  | "medium"
  | "high"
  | "critical";

export interface ObservatoryTest {
  expectation: string;
  pass: boolean;
  result: string;
  scoreModifier: number;
}

export interface ObservatoryData {
  scan: {
    grade: string;
    score: number;
    testsPassed: number;
    testsQuantity: number;
    responseHeaders: Record<string, string>;
  };
  tests: Record<string, ObservatoryTest>;
}
