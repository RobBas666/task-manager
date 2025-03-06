import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { User } from '../models'

const JWT_SECRET = process.env.JWT_SECRET || 'eca72ecc761090150bd496489cc62ff052027652045a2a73fc6c0f65b667113c'

class UserService {
  // Signup method
  static async signup (email: string, password: string) {
    if (!email || !password) {
      throw new Error('Email and password are required.')
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await User.create({ email, password: hashedPassword })

    return { id: user.id, email: user.email }
  }

  // Login method
  static async login (email: string, password: string) {
    const user = await User.findOne({ where: { email } })
    if (!user) throw new Error('Invalid credentials')

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) throw new Error('Invalid credentials')

    const token = jwt.sign({ id: user.id }, JWT_SECRET as string, {
      expiresIn: '1h'
    })

    return { token }
  }
}

export default UserService
