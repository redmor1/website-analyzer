import { atom } from "nanostores";
import type { Report } from "@website-analyzer/shared/src/types";
import retireTestData from "@/data/vulnerability-test-data.json";

export const scan = atom<Report>({
  retire: retireTestData,
});
