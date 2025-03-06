import { Response } from 'express'

export function handleError (e: unknown, res: Response, status: number, message?: string) {
  if (e instanceof Error) {
    if (message) {
      res.status(status).json({ message: `${message}: ${e.message}` })
    } else {
      res.status(status).json({ message: `${e.message}` })
    }
  } else {
    res.status(500).json({ message: `An unknown error occurred: ${JSON.stringify(e)}` })
  }
}

export function buildErrorMessage (e: unknown, message: string) {
  if (e instanceof Error) {
    return `${message}: ${e.message}`
  } else {
    return `An unknown error occurred: ${JSON.stringify(e)}`
  }
}
