import { XMLParser } from "fast-xml-parser"
import { readFile, unlink, writeFile } from "node:fs/promises"
import path from "node:path"

import { config } from "../../config.js"
import { spawnPromise } from "../../utils/exec.js"
import { getSafeFilename } from "../../utils/filenames.js"


export async function runNmapScan(url: string) {
  try {
    let targetHost = url
    try {
      targetHost = new URL(url).hostname
    } catch (error) {
      console.error(error)
      // If URL parsing fails, assume the user already passed a raw domain or IP
    }

    const JsonFilename = getSafeFilename(url, "nmap")

    // Create a temp XML filename so i can parse it to .json later
    const temporaryXmlFilename = `temp-${String(Date.now())}-nmap.xml`

    const hostFolder = config.reportFilePath
    const containerFolder = "/app/reports"

    const finalJsonFilePath = path.join(hostFolder, JsonFilename)
    const temporaryXmlFilePath = path.join(hostFolder, temporaryXmlFilename)

    const commandArguments = [
      "run",
      "--rm",
      "--mount",
      `type=bind,source=${hostFolder},target=${containerFolder}`,
      "nmap-local:latest",
      "-sV",
      "-F",
      "--min-rate",
      "300",
      "-oX",
      `${containerFolder}/${temporaryXmlFilename}`, // instruct nmap to use the temp xml file so we can convert it later to .json
      "--",
      targetHost,
    ]
    console.log(`Starting nmap scan for: ${targetHost}`)

    // running nmap, will parse
    try {
      await spawnPromise("docker", commandArguments)

      const xmlData = await readFile(temporaryXmlFilePath, "utf8")

      // parse xml file to js object
      const parser = new XMLParser({
        attributeNamePrefix: "",
        ignoreAttributes: false,
      })
      const jsonObject = parser.parse(xmlData) as Record<string, unknown>
      console.log("Parsed Nmap XML successfully", jsonObject)
      await writeFile(finalJsonFilePath, JSON.stringify(jsonObject))

      await unlink(temporaryXmlFilePath)
    } catch (error) {
      console.error("Nmap scan or conversion failed:", error)

      // Attempt cleanup if it crashed mid-execution
      try {
        await unlink(temporaryXmlFilePath)
      } catch {
        // Ignore cleanup errors
      }

      throw error
    }

    console.log(
      `Scan complete. nmap JSON saved to ${path.join(hostFolder, JsonFilename)}`,
    )
  } catch (error) {
    console.error("Nmap scan failed:", error)
  }
}
