import { readFile } from "node:fs/promises"
import path from "node:path"

import type { Report, Scanner } from "../../types/types.js"

import { config } from "../../config.js"
import { getSafeFilename } from "../../utils/filenames.js"

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
