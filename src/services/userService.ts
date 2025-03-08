import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { User } from '../models'
import Redis from 'ioredis'
import { buildErrorMessage } from '../utils/errorUtils'

const JWT_SECRET = process.env.JWT_SECRET || ''

// const redis = new Redis({
//   host: process.env.REDIS_HOST || "127.0.0.1",
//   port: Number(process.env.REDIS_PORT) || 6379,
//   retryStrategy: (times) => Math.min(times * 50, 2000), // Retry with exponential backoff
// });

class UserService {
  static async signup(email: string, password: string) {
    try {
      if (!email || !password) {
        throw new Error('Email and password are required.')
      }

      const hashedPassword = await bcrypt.hash(password, 10)
      const user = await User.create({ email, password: hashedPassword })

      return { id: user.id, email: user.email }
    } catch (e: unknown) {
      throw new Error(buildErrorMessage(e, "Error creating user"));
    }
  }

  static async login(email: string, password: string) {
    try {
      // const cachedUser = await redis.get(email)

      // const user = cachedUser ? JSON.parse(cachedUser) : await User.findOne({ where: { email } })

      const user = await User.findOne({ where: { email } })
      if (!user) {
        throw new Error('Invalid credentials')
      }

      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) {
        throw new Error('Invalid credentials')
      }

      //await redis.setex(email, 3600, JSON.stringify({ id: user.id, email: user.email })) // we do not want to store the password for security reasons

      const token = jwt.sign({ id: user.id }, JWT_SECRET as string, {
        expiresIn: '1h'
      })

      return { token }
    } catch (e: unknown) {
      throw new Error(buildErrorMessage(e, "Error logging in"));
    }
  }
}

export default UserService
