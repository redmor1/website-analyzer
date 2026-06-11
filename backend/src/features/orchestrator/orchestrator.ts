import { readFile } from "node:fs/promises"
import path from "node:path"

import type { Report, Scanner } from "../../types/types.js"

import { config } from "../../config.js"
import { getSafeFilename } from "../../utils/filenames.js"
import { runFfufScan } from "../ffuf/ffuf-scanner.ts"
import { runNmapScan } from "../nmap/nmap-scanner.ts"
import { runNucleiScan } from "../nuclei/nuclei-scanner.ts"
import { runRetireScan } from "../retire/retire-scanner.ts"
import { runTestSslScan } from "../testssl/testssl-scanner.ts"
import { runWapitiScan } from "../wapiti/wapiti-scanner.ts"

export async function mergeReports(
  url: string,
  scanners: Scanner[],
): Promise<Report> {
  const report: Report = {}
  for (const scanner of scanners) {
    const safeFilename = getSafeFilename(url, scanner)
    const filePath = path.resolve(config.reportFilePath, safeFilename)

    try {
      const file = await readFile(filePath, "utf8")
      report[scanner] = JSON.parse(file)
    } catch (error) {
      // if readfile fails
      // type casting since the error can come from readFile
      const error_ = error as NodeJS.ErrnoException
      if (error_.code === "ENOENT") continue

      // if json.parse fails
      console.log(error)
      throw error
    }
  }
  return report
}

export async function runScans(url: string, tools: string[]) {
  try {
    // iterate through each scanner and run it
    for (const tool of tools) {
      switch (tool) {
        case "ffuf": {
          await runFfufScan(url, "common.txt")
          break
        }
        case "nmap": {
          await runNmapScan(url)
          break
        }
        case "nuclei": {
          await runNucleiScan(url, false)
          break
        }
        case "retire": {
          await runRetireScan(url)
          break
        }
        case "testssl": {
          await runTestSslScan(url)
          break
        }
        case "wapiti": {
          await runWapitiScan(url)
          break
        }
        default: {
          break
        }
      }
    }
  } catch (error) {
    console.error(error)
    throw new Error("Scan execution failed", { cause: error })
  }
}
