import type { Request, Response } from "express"

import cors from "cors"
import express from "express"
import zod from "zod"

import { config } from "./config.js"
import { mergeReports, runScans } from "./features/orchestrator/orchestrator.js"
import { ScannerEnum } from "./types/types.js"

const app = express()
const PORT = Number(process.env.PORT) || 3000
const jsonParser = express.json({ limit: "100kb", strict: true })

const corsOptions = {
  origin: "http://localhost:4321",
}

// middleware
app.use(cors(corsOptions))

app.get("/", (request: Request, response: Response) => {
  response.send("Hello World!")
  console.log("Response sent")
})

const scanRequestSchema = zod.object({
  scanners: zod
    .array(ScannerEnum)
    .min(1, "You must select at least one scanner"),

  websiteUrl: zod.url({
    hostname: zod.regexes.domain,
    normalize: true, // lots of i/o logic depends on normalized urls
    protocol: /^https?$/,
  }),
})

app.post("/", jsonParser, async (request, response) => {
  try {
    const parsedRequest = scanRequestSchema.parse(request.body)
    console.log(parsedRequest)
    await runScans(parsedRequest.websiteUrl, parsedRequest.scanners)
    const report = await mergeReports(
      parsedRequest.websiteUrl,
      parsedRequest.scanners,
    )
    return response.status(200).send(report)
  } catch (error) {
    console.error(error)
    return response.status(500).send("Internal Server Error")
  }
})

app.listen(PORT, () => {
  console.log(`Website-analyzer app listening on PORT ${String(PORT)}`)
  console.log(`Reports saving to: ${config.reportFilePath}`)
})
