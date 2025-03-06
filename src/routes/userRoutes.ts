import express from "express";
import UserService from "../services/UserService";

const userRouter = express.Router();

userRouter.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserService.signup(email, password);
    res.status(201).json({ message: "User created successfully", user });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

userRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await UserService.login(email, password);
    res.json({ message: "Login successful", token: result.token });
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
});

export default userRouter;
