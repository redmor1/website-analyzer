import express from "express"
import zod from "zod"

import { config } from "./config.js"
import { runRetireScan } from "./features/retire/retire-scanner.js"

const app = express()
const PORT = Number(process.env.PORT) || 3000

const jsonParser = express.json({ limit: "100kb", strict: true })

app.get("/", (request, response) => {
  response.send("Hello World!")
  console.log("Response sent")
})

const scanRequestSchema = zod.object({
  websiteUrl: zod.url(),
})

app.post("/", jsonParser, async (request, response) => {
  try {
    const parsedRequest = scanRequestSchema.parse(request.body)
    const report = await runRetireScan(parsedRequest.websiteUrl)
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
