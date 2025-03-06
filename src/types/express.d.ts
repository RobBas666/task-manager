import { jwtUser } from '../consts/interfaces'

declare global {
  namespace Express {
    interface Request {
      user?: jwtUser; // Declare the 'user' property on the Request object
    }
  }
}
