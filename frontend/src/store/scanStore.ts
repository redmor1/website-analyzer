import { atom } from "nanostores";
import type { Report } from "@website-analyzer/shared/src/types";
import observatoryTestData from "@/data/observatory-test-data.json";
import retireTestData from "@/data/retire-test-data.json";

export const scan = atom<Report>({
  retire: retireTestData,
  wappalyzergo: {},
  observatory: observatoryTestData,
});
