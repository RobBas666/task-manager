import User from "../models/user"; // Import your User model type

declare global {
  namespace Express {
    interface Request {
      user?: any; // Declare the 'user' property on the Request object
    }
  }
}
