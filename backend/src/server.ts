import type { Request, Response } from "express"

import { scanRequestSchema } from "@website-analyzer/shared"
import cors from "cors"
import express from "express"

import { config } from "./config.js"
import { mergeReports, runScans } from "./features/orchestrator/orchestrator.js"
import { validateTargetUrl } from "./utils/url-validation.js"
import { checkApiKey } from "./middlewares/api-key.js"

const app = express()
const PORT = Number(process.env.PORT) || 3000
const FRONTEND_URL = String(process.env.FRONTEND_URL) || "http://localhost:4321"
const jsonParser = express.json({ limit: "100kb", strict: true })

const corsOptions = {
  origin: FRONTEND_URL,
}

// middleware
app.use(cors(corsOptions))

app.get("/", (request: Request, response: Response) => {
  response.send("Hello World!")
  console.log("Response sent")
})

app.post("/", jsonParser, checkApiKey, async (request, response) => {
  try {
    // Validate request shape
    const parsedRequest = scanRequestSchema.parse(request.body)

    // Deep validation for command injection & SSRF
    const safeUrl = await validateTargetUrl(parsedRequest.websiteUrl)

    await runScans(safeUrl, parsedRequest.scanners)
    const report = await mergeReports(safeUrl, parsedRequest.scanners)
    console.log("Successfully merged reports. Sending response.")
    return response.status(200).send(report)
  } catch (error) {
    console.error(error)

    if (error instanceof Error && error.name === "ZodError") {
      return response.status(400).send(error.message)
    }

    return response.status(500).send("Internal Server Error")
  }
})

app.listen(PORT, () => {
  console.log(`Website-analyzer app listening on PORT ${String(PORT)}`)
  console.log(`Reports saving to: ${config.reportFilePath}`)
})
