import { Router } from "express";
import { loginAdmin, registerAdmin, verifyToken } from "../controller/authController.js";
const authRouter = Router()
  
authRouter.post("/register",registerAdmin)
authRouter.post("/login",loginAdmin)
authRouter.post("/verify-token",verifyToken)
export default authRouter