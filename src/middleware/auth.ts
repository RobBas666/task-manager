import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { handleError } from '../utils/errorUtils'
import { jwtUser } from '../consts/interfaces'

const JWT_SECRET = process.env.JWT_SECRET || 'eca72ecc761090150bd496489cc62ff052027652045a2a73fc6c0f65b667113c'

const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.header('Authorization')?.replace('Bearer ', '')

  if (!token) {
    res.status(401).json({ message: 'No token provided' })
    return
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET as string)
    req.user = decoded as jwtUser
    next()
  } catch (e: unknown) {
    handleError(e, res, 401, 'Invalid or expired token')
  }
}

export default authMiddleware
