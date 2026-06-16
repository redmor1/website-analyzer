import { readFile, unlink } from "node:fs/promises"
import path from "node:path"

import type { Report, Scanner } from "../../types/types.js"

import { config } from "../../config.js"
import { getSafeFilename } from "../../utils/filenames.js"
import { runObservatoryScan } from "../observatory/observatory-scanner.js"
import { runRetireScan } from "../retire/retire-scanner.js"
import { runWappalyzergoScan } from "../wappalyzergo/wappalyzergo-scanner.js"

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

      // if file doesn't exist, skip to next scanner
      if (error_.code === "ENOENT") continue

      // if json.parse fails (means the file is corrupted or something)
      if (error instanceof SyntaxError) {
        console.error(
          `Corrupted JSON file detected for ${scanner}. Deleting...`,
        )
        try {
          // tries to delete it
          await unlink(filePath)
          console.log(`Successfully deleted corrupted file: ${filePath}`)
        } catch (unlinkError) {
          console.error(
            `Failed to delete corrupted file: ${filePath}`,
            unlinkError,
          )
        }
        // skip to next scanner so successful reports can still be returned
        continue
      }

      // for unexpected critical errors, throw to stop execution
      console.error(`Unexpected error processing ${scanner}:`, error)
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
        case "observatory": {
          await runObservatoryScan(url)
          break
        }
        case "retire": {
          await runRetireScan(url)
          break
        }
        case "wappalyzergo": {
          await runWappalyzergoScan(url)
          break
        }
        default: {
          console.warn(`Scanner ${tool} is disabled for passive scanning mode or doesn't exist.`)
          break
        }
      }
    }
  } catch (error) {
    console.error(error)
    throw new Error("Scan execution failed", { cause: error })
  }
}
