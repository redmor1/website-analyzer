import type { NextFunction, Request, Response } from "express"

export function checkApiKey(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const clientApiKey = request.headers["x-api-key"]

  if (!process.env.API_KEY || clientApiKey !== process.env.API_KEY) {
    return response.status(401).send("Unauthorized")
  }

  next()
}
