import { z } from "zod";

export const ScannerEnum = z.enum(["retire", "wappalyzergo", "observatory"]);

export type Scanner = z.infer<typeof ScannerEnum>;

export interface ScannerDataMap {
  retire: RetireData;
  observatory: ObservatoryData;
  wappalyzergo: unknown;
}
export type Report = {
  [K in Scanner]?: ScannerDataMap[K];
};

export interface RetireData {
  components: {
    type: string;
    "bom-ref": string;
    name: string;
    version: string;
    purl: string;
    properties: {
      name: string;
      value: string;
    }[];
    licenses?: {
      expression: string;
    }[];
  }[];
  services?: {
    name: string;
    endpoints: string[];
    description: string;
  }[];
  vulnerabilities: RetireVulnerability[];
}

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
