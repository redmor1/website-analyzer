import { atom } from "nanostores";
import type {
  ObservatoryData,
  Report,
  RetireData,
} from "@website-analyzer/shared";
import observatoryTestData from "@frontend/data/observatory-test-data.json";
import retireTestData from "@frontend/data/retire-test-data.json";

export const scan = atom<Report>({
  retire: retireTestData as RetireData,
  wappalyzergo: {},
  observatory: observatoryTestData as ObservatoryData,
});
