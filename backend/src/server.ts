import express from "express"
const app = express()
const PORT = Number(process.env.PORT) || 3000

app.get("/", (request, response) => {
  response.send("Hello World!")
  console.log("Response sent")
})

app.listen(PORT, () => {
  console.log(`Example app listening on PORT ${String(PORT)}`)
})
