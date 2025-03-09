import express from 'express'
import UserService from '../services/userService'
import { handleError } from '../utils/errorUtils'

const userRouter = express.Router()

userRouter.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await UserService.signup(email, password)
    res.status(201).json({ message: 'User created successfully', user })
    return
  } catch (e: unknown) {
    handleError(e, res, 500)
  }
})

userRouter.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const result = await UserService.login(email, password)
    res.json({ message: 'Login successful', token: result.token })
    return
  } catch (e: unknown) {
    handleError(e, res, 500)
  }
})

export default userRouter
